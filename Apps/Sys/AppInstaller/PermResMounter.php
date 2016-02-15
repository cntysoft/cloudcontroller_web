<?php
/**
 * Cntysoft Cloud Software Team
 */

namespace App\Sys\AppInstaller;
use Cntysoft\Kernel\App\AbstractLib;
use Cntysoft\Kernel;
use CloudController\Kernel\StdDir;
use Cntysoft\Kernel\StdErrorType;
use Cntysoft\Kernel\App\AppObject;
use App\Sys\User\Model\ApiAuthCode as ApiAuthCodeModel;
use App\Sys\AppInstaller\Model\PermResource as PermResourceModel;

/**
 * 支持多站点数据读取
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
class PermResMounter extends AbstractLib
{
   /**
    * @const int RESOURCE_ROOT_ID 权限树的根节点ID
    */
   const RESOURCE_ROOT_ID = 0;

   /**
    * 权限资源必要字段
    *
    * @static array R_KS
    */
   static $R_KS = array(
      'hasDetail',
      'text',
      'internalKey'
   );
   /**
    * ID生成器
    *
    * @var int  $idSeed
    */
   protected $idSeed = null;
   /**
    * 系统过滤APP列表， 在这个列表中的程序名称都是一些系统级别的程序，一些基本的运行时支持程序
    *
    * @var array $skipApps
    */
   protected static $skipResources = array(
      'Sys.Login',
      'Sys.SysUiRender',
      'Sys.TaskManager'
   );
   /**
    * @return \Phalcon\Mvc\Model\Resultset\Simple
    */
   public function getMountedPermResources($cond = '', $total = false,  $orderBy = null, $offset = 0, $limit = \Cntysoft\STD_PAGE_SIZE)
   {
      if ('' == $cond) {
         $cond = 'pid = ?0';
      } else {
         $cond .= ' and pid = ?0';
      }
      $items = PermResourceModel::find(array(
         $cond,
         'bind'  => array(
            0 => self::RESOURCE_ROOT_ID
         ),
         'order' => $orderBy,
         'limit' => array(
            'number' => $limit,
            'offset' => $offset
         )
      ));
      if ($total) {
         return array(
            $items,
            PermResourceModel::count(array(
               $cond,
               'bind' => array(
                  0 => self::RESOURCE_ROOT_ID
               ),
            ))
         );
      }
      return $items;
   }
   /**
    * 在系统中很多APP是不需要权限挂载的，这个变量中保存的就是需要跳过的权限资源列表
    *
    * @return array
    */
   public static function getSkipResources()
   {
      return self::$skipResources;
   }

   /**
    * @param string $moduleKey
    * @param string $appKey
    * @return \App\Sys\AppInstaller\Model\PermResource
    */
   public function getMountedResource($moduleKey, $appKey)
   {
      return PermResourceModel::findFirst(array(
         'moduleKey = ?0 AND appKey = ?1',
         'bind' => array(
            0 => $moduleKey,
            1 => $appKey
         )
      ));
   }

   /**
    * 重新挂在APP权限树信息
    *
    * @param string $moduleKey 模块的识别ID
    * @param string $appKey
    * @return \App\Platform\SiteManager\PermResMounter
    */
   public function remountPermRes($moduleKey, $appKey)
   {
      if (!$this->hasMountedResource($moduleKey, $appKey)) {
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_APP_PERM_RES_NOT_MOUNTED', $moduleKey . '.' . $appKey),
            $errorType->code('E_APP_PERM_RES_NOT_MOUNTED')),
            $this->getErrorTypeContext());
      }
      $db = Kernel\get_db_adapter();
      try {
         $db->begin();
         $this->unmountPermRes($moduleKey, $appKey);
         $this->mountPermRes($moduleKey, $appKey);
         $db->commit();
         return $this;
      } catch (\Exception $e) {
         $db->rollback();
         throw $e;
      }
   }

   /**
    * 卸载一个权限资源
    *
    * @param string $moduleKey
    * @param string $appKey
    * @return \App\Platform\SiteManager\PermResMounter
    */
   public function unmountPermRes($moduleKey, $appKey)
   {
      $permRes = $this->getMountedResource($moduleKey, $appKey);
      $key = $moduleKey . '.' . $appKey;
      if (!$permRes) {
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_APP_PERM_RES_NOT_MOUNTED',$key),
            $errorType->code('E_APP_PERM_RES_NOT_MOUNTED')),
            $this->getErrorTypeContext());
      }
      //获取要删除的权限资源
      $resources = PermResourceModel::find(array(
         'moduleKey = ?0 and appKey = ?1',
         'bind' => array(
            0 => $moduleKey,
            1 => $appKey
         )
      ));
      //同时要清除权限授权树里面的数据
      $db = Kernel\get_db_adapter();
      try {
         $db->begin();
         //可能要清除认证代码
         foreach ($resources as $resource) {
            $resource->delete();
         }
         //删除APP相关的权限码
         $query = sprintf("DELETE FROM %s  WHERE key = ?0 OR belong = ?1", 'App\Sys\User\Model\ApiAuthCode');
         $modelsManager = Kernel\get_models_manager();
         $modelsManager->executeQuery($query, array(
            0 => $appKey,
            1 => $appKey
         ));
         $db->commit();
         return $this;
      } catch (\Exception $e) {
         $db->rollback();
         throw $e;
      }
   }

   /**
    * 注册一个权限资源到系统权限树, 是否判断是否已经注册了呢,  一般这个程序很少运行， 效率暂时不是问题
    * 性能可能出在判断一个APP是否安装那里
    *
    * @param string $moduleKey 系统已经安装的模块的识别KEY
    * @param string $appKey APP的识别ID
    * @return \App\Platform\SiteManager\PermResMounter
    */
   public function mountPermRes($moduleKey, $appKey)
   {
      $appKey = trim($appKey);
      $moduleKey = trim($moduleKey);
      if($this->hasMountedResource($moduleKey, $appKey)){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_PERM_RES_ALREADY_MOUNTED', $moduleKey . '.' . $appKey),
            $errorType->code('E_PERM_RES_ALREADY_MOUNTED')), $this->getErrorTypeContext());
      }
      if(!$this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_MODULE_MGR,
         'getModule',
         array(
            $moduleKey
         )
      )){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_MODULE_NOT_EXIST', $moduleKey),
            $errorType->code('E_MODULE_NOT_EXIST')
         ), $this->getErrorTypeContext());
      }
      //检查等待挂载的权限是否已经在系统中上线
      if(!$this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_META,
         'hasAppInfo',
         array(
            $moduleKey,
            $appKey
         )
      )){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_TARGET_APP_NOT_REGISTERED', $moduleKey.'.'.$appKey),
            $errorType->code('E_TARGET_APP_NOT_REGISTERED')
         ));
      }
      $permResFilename = StdDir::getAppDataDir($moduleKey, $appKey).DS.AppObject::PERM_RES_FILE_NAME;
      if (!file_exists($permResFilename)) {
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_APP_PERM_RES_FILE_NOT_EXIST', $moduleKey . '.' . $appKey),
            $errorType->code('E_APP_PERM_RES_FILE_NOT_EXIST')), $this->getErrorTypeContext());
      }
      $db = Kernel\get_db_adapter();
      try {
         $db->begin();
         $pArray = include $permResFilename;
         $pArray += array('hasDetail' => 0);
         $this->checkResourceRequireFields($pArray);
         $resource = new PermResourceModel();
         //确保APP权限项已经存在
         $resource->assign(array(
            'pid'         => self::RESOURCE_ROOT_ID,
            'text'        => $pArray['text'],
            'moduleKey'   => $moduleKey,
            'appKey'      => $pArray['internalKey'],
            'hasDetail'   => (int) $pArray['hasDetail'],
            'internalKey' => $pArray['internalKey']
         ));
         $resource->create();

         $this->idSeed = $resource->getId();
         //递归加载权限资源项
         $children = array_key_exists('children', $pArray) ? $pArray['children'] : array();
         foreach ($children as $item) {
            $this->recurInsertResource($moduleKey, $appKey, $resource->getId(), $item);
         }
         $db->commit();
         return $this;
      } catch (\Exception $e) {
         $db->rollback();
         throw $e;
      }
   }

   /**
    * 递归添加资源项资源项是一个树形结构
    * 接受资源的结构
    * array(
    *    'text' => 'text',
    *    'hasDetail' => 'hasDetail',
    *    'appKey' => 'appKey',
    *    'moduleKey' => 'moduleKey',
    *    'internalKey' => 'internalKey',
    *    children => array(
    *       array(...),
    *       array(...)
    *    )
    * )
    *
    * @param string $moduleKey
    * @param string $appKey
    * @param int $parent
    * @param array $data
    */
   protected function recurInsertResource($moduleKey, $appKey, $parent, array $data)
   {
      if (!empty($data)) {
         $this->checkResourceRequireFields($data);
         $id = ++$this->idSeed;
         $resource = new PermResourceModel();
         $resource->setText($data['text']);
         $resource->setModuleKey($moduleKey);
         $resource->setHasDetail((int) $data['hasDetail']);
         if ($data['hasDetail']) {
            $resource->setDetailSetter($data['detailSetter']);
            if (array_key_exists('detailSaver', $data)) {
               $resource->setDetailSaver($data['detailSaver']);
            } else {
               $resource->setDetailSaver('StdSaver');
            }
            if (array_key_exists('context', $data)) {
               $resource->setContext($data['context']);
            }
         }
         $resource->setAppKey($appKey);
         $resource->setId($id);
         $resource->setPid($parent);
         $resource->setInternalKey($data['internalKey']);
         if (array_key_exists('codes', $data) && is_array($data['codes'])) {
            //这里不会检查SYS模块权限码是否存在
            //@TODO 是否加上这个判断呢？
            $resource->setAuthCode(implode(',', $data['codes']));
         }
         $resource->create();
         if (array_key_exists('children', $data)) {
            $children = $data['children'];
            if (is_array($children)) {
               foreach ($children as $item) {
                  $this->recurInsertResource($moduleKey, $appKey, $id, $item);
               }
            }
         }
      }
   }


   /**
    * 判断权限资源是否进行挂载
    *
    * @param string $moduleKey
    * @param string $appKey
    * @return boolean
    */
   public function hasMountedResource($moduleKey, $appKey)
   {
      return PermResourceModel::count(array(
         'moduleKey = ?0 AND appKey = ?1',
         'bind' => array(
            0 => $moduleKey,
            1 => $appKey
         )
      )) > 1 ? true : false;
   }

   /**
    * 检查资源项的必要字段
    *
    * @param array $item
    * @throws Exception
    */
   protected function checkResourceRequireFields(array &$item)
   {
      $leak = array();
      $requires = self::$R_KS;
      //检查详细设置器选项
      if ((!isset($item['isApp']) || !$item['isApp']) && isset($item['hasDetail']) && $item['hasDetail']) {
         $requires[] = 'detailSetter';
      }
      Kernel\array_has_requires($item, $requires, $leak);
      if (!empty($leak)) {
         //把扩展的信息也传出去
         Kernel\g_data(\Cntysoft\API_CALL_EXP_KEY, $leak);
         Kernel\throw_exception(new Exception(
            StdErrorType::msg('E_ARRAY_KEYS_NOT_EXIST', implode(', ', $leak)),
            StdErrorType::code('E_ARRAY_KEYS_NOT_EXIST')), \Cntysoft\STD_EXCEPTION_CONTEXT);
      }
   }
}