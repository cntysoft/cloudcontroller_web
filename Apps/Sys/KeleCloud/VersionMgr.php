<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\KeleCloud;
use Cntysoft\Kernel\App\AbstractLib;
use App\Sys\KeleCloud\Model\VersionInfoModel;
/**
 * 升级信息管理
 */
class VersionMgr extends AbstractLib
{
   public function getInfoById($id)
   {
      return VersionInfoModel::findFirst($id);
   }
   
   public function getList($total = false, $orderBy = null, $offset = 0, $limit = 15)
   {
      $items = VersionInfoModel::find(array(
            'order' => $orderBy,
            'limit' => array(
               'number' => $limit,
               'offset' => $offset
            )
      ));
      if ($total) {
         return array($items, (int) VersionInfoModel::count());
      }
      return $items;
   }
   
   public function addVersion(array $data)
   {
      unset($data["id"]);
      $version = new VersionInfoModel();
      $data['releaseTime'] = time();
      $this->checkRequireFields($data, $version->getRequireFields(array("id")));
      $version->assignBySetter($data);
      return $version->save();
   }
   
   public function updateVersion($id, array $data)
   {
      $version = VersionInfoModel::findFirst($id);
      if(!$version){
         return;
      }
      unset($data['id']);
      unset($data['releaseTime']);
      $version->assignBySetter($data);
      $version->save();
   }
   
   public function deleteVersion($id)
   {
      $version = VersionInfoModel::findFirst($id);
      if(!$version){
         return;
      }
      $version->delete();
   }
}