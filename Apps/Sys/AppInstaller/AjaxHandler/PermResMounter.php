<?php
/**
 * Cntysoft Cloud Software Team
 */
namespace App\Sys\AppInstaller\AjaxHandler;
use Cntysoft\Kernel\App\AbstractHandler;
use App\Sys\AppInstaller\Constant;
use Cntysoft\Kernel;
/**
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
class PermResMounter extends AbstractHandler
{
   /**
    * 挂载权限资源
    */
   public function mountPermRes(array $params)
   {
      $this->checkRequireFields($params, array(
         'moduleKey',
         'appKey'
      ));
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_RES_MOUNTER,
         'mountPermRes',
         array(
            $params['moduleKey'],
            $params['appKey']
         )
      );
   }

   /**
    * 重新挂载权限资源
    */
   public function remountPermRes(array $params)
   {
      $this->checkRequireFields($params, array(
         'moduleKey',
         'appKey'
      ));
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_RES_MOUNTER,
         'remountPermRes',
         array(
            $params['moduleKey'],
            $params['appKey']
         )
      );
   }

   /**
    * 卸载挂载权限资源
    */
   public function unmountPermRes(array $params)
   {
      $this->checkRequireFields($params, array(
         'moduleKey',
         'appKey'
      ));
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_RES_MOUNTER,
         'unmountPermRes',
         array(
            $params['moduleKey'],
            $params['appKey']
         )
      );
   }

   /**
    * 获取当前站点挂载情况
    */
   public function getMountedResList(array $params)
   {
      $this->checkRequireFields($params, array('type', 'module'));
      $type = $params['type'];
      $module = $params['module'];
      $ret = array();
      $permResMounter = $this->getAppCaller()->getAppObject(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_RES_MOUNTER
      );
      if($type == Constant::L_TYPE_ALL){
         $unregResources = array();
         $siteAppRepo = $this->getAppCaller()->getAppObject(
            Constant::MODULE_NAME,
            Constant::APP_NAME,
            Constant::APP_API_META
         );

         if('all' == $module){
            $allResources = $siteAppRepo->getAppList();
            $mountedResources = $permResMounter->getMountedPermResources();
         }else {
            $allResources = $siteAppRepo->getAppList($module);
            $mountedResources = $permResMounter->getMountedPermResources("moduleKey = '{$module}'");
         }
         $regResources = array();
         $regKeys = array();
         foreach ($mountedResources as $item) {
            $key = $item->getAppKey();
            $regResources[$key] = array(
               'key'    => $key,
               'text'   => $item->getText(),
               'module' => $item->getModuleKey(),
               'status' => Constant::M_ON
            );
            $regKeys[] = $item->getModuleKey().'.'.$key;
         }
         $skipResources = $permResMounter::getSkipResources();
         foreach ($allResources as $res) {
            $moduleKey = $res->getModuleKey();
            $appKey = $res->getAppKey();
            $key = $moduleKey . '.' . $appKey;
            $text = $res->getName();
            if (!in_array($key, $skipResources)) {
               if (!in_array($key, $regKeys)) {
                  $unregResources[] = array(
                     'key'    => $appKey,
                     'text'   => $text,
                     'module' => $moduleKey,
                     'status' => Constant::M_OFF
                  );
               }
            }
         }
         $ret = array_merge(array_values($regResources), $unregResources);
      }else if(Constant::L_TYPE_MOUNTED == $type){
         if ('all' == $module) {
            $cond = '';
         } else {
            $cond = "moduleKey = '$module'";
         }
         $mountedResources = $permResMounter->getMountedPermResources($cond);
         foreach ($mountedResources as $res) {
            $ret[] = array(
               'key'    => $res->getAppKey(),
               'text'   => $res->getText(),
               'module' => $res->getModuleKey(),
               'status' => Constant::M_ON
            );
         }
      }else if(Constant::L_TYPE_UNMOUNTED == $type){
         $siteAppRepo = $this->getAppCaller()->getAppObject(
            Constant::MODULE_NAME,
            Constant::APP_NAME,
            Constant::APP_API_META
         );
         if ('all' == $module) {
            $allResources = $siteAppRepo->getAppList();
            $mountedResources = $permResMounter->getMountedPermResources();
         } else {
            $allResources = $siteAppRepo->getAppList($module);
            $mountedResources = $permResMounter->getMountedPermResources("moduleKey = '{$module}'");
         }
         $mountedKeys = array();
         foreach ($mountedResources as $res) {
            $mountedKeys[] = $res->getAppKey();
         }
         $skipResources = $permResMounter::getSkipResources();
         foreach ($allResources as $res) {
            $moduleKey = $res->getModuleKey();
            $appKey = $res->getAppKey();
            $key = $moduleKey . '.' . $appKey;
            $text = $res->getName();
            if (!in_array($key, $skipResources)) {
               if (!in_array($appKey, $mountedKeys)) {
                  $ret[] = array(
                     'key'    => $key,
                     'text'   => $text,
                     'module' => $moduleKey,
                     'status' => Constant::M_OFF
                  );
               }
            }
         }
      }else{
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('MOUNT_TYPE_ERROR', $type), $errorType->code('MOUNT_TYPE_ERROR')), $errorType);
      }
      return $ret;
   }
}