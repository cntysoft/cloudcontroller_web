<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\User\AjaxHandler;
use Cntysoft\Kernel\App\AbstractHandler;
use Cntysoft\Kernel;
use App\Sys\User\Exception;
use App\Sys\User\Constant;
use CloudController\Mixin\EnsurePermAbout;
use Cntysoft\Stdlib\Tree;
use App\Sys\AppInstaller\Constant as AI_CONST;
class PermMgr extends AbstractHandler
{
   use EnsurePermAbout;

   /**
    * 这个API主要是保存授权树的权限结果
    * 参数字段
    * <code>
    *      array(
    *          'roleId',
    *          'permissions',
    *          'modifiedApps'
    *      );
    * </code>
    */
   public function setRolePerms(array $params)
   {
      $this->ensureSuperUser();
      $this->checkRequireFields($params, array(
         'roleId',
         'permissions',
         'modifiedApps'
      ));
      $roleId = $params['roleId'];
      $permissons = $params['permissions'];
      $modifiedApps = $params['modifiedApps'];
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_PERM,
         'grantRolePerms',
         array(
            $roleId, $permissons, $modifiedApps
         )
      );
   }


   public function getAuthorizeTreeNodes(array $params)
   {
      $this->ensureSuperUser();
      $this->checkRequireFields($params, array('type'));
      $type = (int) $params['type'];
      if ($type !== Constant::TREE_T_GRANT && $type !== Constant::TREE_T_VIEW) {
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_PERM_TREE_TYPE_NOT_SUPPORTED', $type),
            $errorType->code('E_PERM_TREE_TYPE_NOT_SUPPORTED')), $this->getErrorTypeContext());
      } else {
         if ($type == Constant::TREE_T_GRANT) {
            if (!array_key_exists('roleId', $params)) {
               $errorType = $this->getErrorType();
               Kernel\throw_exception(new Exception(
                  $errorType->msg('E_PERM_ROLE_NOT_SPECIFY', $type),
                  $errorType->code('E_PERM_ROLE_NOT_SPECIFY')),
                  $this->getErrorTypeContext());
            }
            $roleId = $params['roleId'];
         }
      }
      $moduleItems = array();
      //获取所有的模块
      $modules = $this->getAppCaller()->call(
         AI_CONST::MODULE_NAME,
         AI_CONST::APP_NAME,
         AI_CONST::APP_API_MODULE_MGR,
         'getModuleList'
      );
      $pm = $this->getAppCaller()->getAppObject(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_PERM
      );
      if (count($modules) > 0) {
         $this->formatResourceItem($modules, $moduleItems, Constant::M_NODE, $pm);
      }
      $treeInfo = array(
         'isSuperUser' => $this->getAppCaller()->call(
            Constant::MODULE_NAME,
            Constant::APP_NAME,
            Constant::APP_API_ACL,
            'curSysUserIsSuperUser'
         )
      );

      foreach ($moduleItems as &$moduleItem) {
         $appItems = array();
         //获取指定的模块的所有挂载的APP
         $rootPermResItems = $pm->getRootPermResByModule($moduleItem['key']);
         if (!empty($rootPermResItems)) {
            $treeInfo['type'] = $type;
            if ($type == Constant::TREE_T_GRANT) {
               $treeInfo['roleId'] = $roleId;
            }
            $this->formatResourceItem($rootPermResItems, $appItems, Constant::A_NODE, $pm, $treeInfo);
            $moduleItem['children'] = $appItems;
            foreach ($moduleItem['children'] as &$appItem) {
               $keyInfo = explode('.', $appItem['key']);
               if (2 !== count($keyInfo)) {
                  Kernel\throw_exception( new Exception(
                     StdErrorType::msg('E_APP_KEY_FORMAT_ERROR', $appItem['key']), StdErrorType::code('E_APP_KEY_FORMAT_ERROR')), \Cntysoft\STD_EXCEPTION_CONTEXT);
               }
               $rTree = $pm->getAppPermResTree($keyInfo[0], $keyInfo[1]);
               if ($rTree) {
                  $treeInfo['type'] = $type;
                  if ($type == Constant::TREE_T_GRANT) {
                     $treeInfo['roleId'] = $roleId;
                  }
                  $this->getResourceTreeNodeRecursive($appItem['id'], $appItem['children'], $treeInfo, $rTree, $pm);
               }
            }
         }
      }
      return $moduleItems;
   }

   /**
    * 递归获取权限树的节点数据
    *
    * @param int $id
    * @param array $data
    * @param \Cntysoft\Stdlib\Tree $rTree
    * @param \App\Sys\User\PermManager $pm
    */
   protected function getResourceTreeNodeRecursive($id, &$data, &$treeInfo, $rTree, $pm)
   {
      $children = $rTree->getChildren($id, 1, $rTree);
      $resourceItems = array();
      $this->formatResourceItem($children, $resourceItems, Constant::R_NODE, $pm, $treeInfo, $rTree);
      $data = $resourceItems;
      foreach ($data as $key => &$item) {
         $item['children'] = array();
         $this->getResourceTreeNodeRecursive($item['id'], $item['children'], $treeInfo, $rTree, $pm);
      }
   }

   /**
    * 格式化权限资源项
    *
    * @param \Phalcon\Mvc\Model\Resultset\Simple $items 需要格式化的项目
    * @param array $ret 返回数据项
    * @param int $type 节点类型
    * @param \App\Sys\User\PermManager $pm
    * @param int $treeInfo 树显示信息
    * @param \Cntysoft\Stdlib\Tree $tree
    */
   protected function formatResourceItem($items, &$ret, $type, $pm = null, $treeInfo = null, Tree &$tree = null)
   {
      foreach ($items as $index => $item) {
         if(Constant::M_NODE == $type){
            $mkey = $item->getKey();
            if($mkey == 'Platform'){
               continue;
            }
         }
         switch ($type) {
            case Constant::M_NODE:
               $id = -( ++$index);
               $extType = Constant::R_MODULE_NODE;
               $text = $item->getText();
               $key = $item->getKey();
               $checked = null;
               $leaf = false;
               break;
            case Constant::R_NODE:
            case Constant::A_NODE:
               if (Constant::R_NODE == $type) {
                  $extType = Constant::R_RESOURCE_NODE;
                  $leaf = $tree->isLeaf($item->getId());
               } else if (Constant::A_NODE == $type) {
                  $extType = Constant::R_APP_NODE;
                  $leaf = false;
               }
               $id = $item->getId();
               $text = $item->getText();
               $key = $item->getModuleKey() . '.' . $item->getAppKey();
               $internalKey = $item->getInternalKey();
               if ($treeInfo['type'] == Constant::TREE_T_GRANT) {
                  $checked = $pm->hasPerm($treeInfo['roleId'], $id);
               } else {
                  $checked = null;
               }
               break;
         }
         $node = array(
            'type'    => $extType,
            'text'    => $text,
            'id'      => $id,
            'key'     => $key,
            'checked' => $checked,
            'leaf'    => $leaf
         );
         if (Constant::R_NODE == $type) {
            $node['internalKey'] = $internalKey;
         }
         if ($treeInfo['type'] == Constant::TREE_T_GRANT) {
            if ($item->getHasDetail()) {
               $node['hasDetail'] = true;
               if ($checked) {
                  $permission = $pm->getPermByResource($treeInfo['roleId'], $item);
                  $node['detailPermission'] = $permission['detailPermission'];
               } else {
                  //没有选中
                  if ((int)$item->getPid() !== 0) {
                     $node['detailPermission'] = $pm->getDefaultDetailPermission(Constant::PERMISSION_ROLE, $treeInfo['roleId'], $item);
                  }
               }
               $node['detailSetter'] = $item->getDetailSetter();
            }
         }
         //取消两个危险的权限， 管理员管理和角色管理， 这个两个权限只能由超级管理员才能拥有
         if ($node['key'] == 'Sys.User' && isset($node['internalKey'])) {
            if ($node['internalKey'] == 'SuperUserManage' || $node['internalKey'] == 'RoleAndPermission') {
               continue;
            }
         }
         $ret[] = $node;
      }
   }
}