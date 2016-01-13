<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\AppInstaller;
use Cntysoft\Kernel\App\AbstractLib;
use App\Sys\AppInstaller\Model\InstalledApp as InstalledAppModel;
use Cntysoft\Kernel\App\AppObject;
use Cntysoft\Kernel;
class Meta extends AbstractLib
{
   /**
    * 根据模块名称获取应用列表
    *
    * @param string $mkey
    * @param bool $total
    * @param null $orderBy
    * @param int $offset
    * @param int $limit
    */
   public function getAppList($mkey = null, $total = false, $orderBy = null, $offset = 0, $limit = 15)
   {
      $query = array(
         'order' => $orderBy,
         'limit' => array(
            'number' => $limit,
            'offset' => $offset
         )
      );
      $cond = array();
      if($mkey){
         $cond[] = 'moduleKey = ?0';
         $cond['bind'] = array(
            0 => $mkey
         );
         array_unshift($query, 'moduleKey = ?0');
         $query['bind'] = array(
            0 => $mkey
         );
      }
      $list = InstalledAppModel::find($query);
      if($total){
         return array($list, (int) InstalledAppModel::count($cond));
      }
      return $list;
   }
   /**
    * 获取已安装的应用信息
    *
    * @param string $mkey
    * @param string $appKey
    * @return \App\Sys\AppInstaller\Model\InstalledApp
    */
   public function getAppInfo($mkey, $appKey)
   {
      return InstalledAppModel::findFirst(array(
         'moduleKey = ?0 AND appKey = ?1',
         'bind' => array(
            0 => $mkey,
            1 => $appKey
         )
      ));
   }

   /**
    * 判断App是否存在
    *
    * @param string $mkey
    * @param string $appKey
    * @return boolean
    */
   public function hasAppInfo($mkey, $appKey)
   {
      return InstalledAppModel::count(array(
         'moduleKey = ?0 AND appKey = ?1',
         'bind' => array(
            0 => $mkey,
            1 => $appKey
         )
      )) > 0 ? true : false;
   }

   /**
    * @param string $moduleKey
    * @param string $appKey
    * @return \App\Sys\AppInstaller\Model\InstalledApp
    */
   public function addAppInfo($moduleKey, $appKey)
   {
      $meta = AppObject::getAppMetaInfo($moduleKey, $appKey);
      $meta += array(
         'type' => AppObject::APP_TYPE_EXT,
         'runConfig' => array(),
         'showOnDesktop' => 1
      );
      $meta['installTime'] = time();
      $app = new InstalledAppModel();
      $requires = $app->getRequireFields(array('id'));
      $this->checkRequireFields($meta, $requires);
      if($this->hasAppInfo($meta['moduleKey'], $meta['appKey'])){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_APP_ALREADY_INSTALLED', $meta['moduleKey'].'.'.$meta['appKey']),
            $errorType->code('E_APP_ALREADY_INSTALLED')
         ));
      }
      $app->assignBySetter($meta);
      $app->create();
      return $app;
   }

   /**
    * @param $moduleKey
    * @param $appKey
    */
   public function removeAppInfo($moduleKey, $appKey)
   {
      $app = $this->getAppInfo($moduleKey, $appKey);
      if($app){
         $app->delete();
      }
   }
}