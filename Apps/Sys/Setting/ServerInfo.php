<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\Setting;
use Cntysoft\Kernel\App\AbstractLib;
use App\Sys\Setting\Model\ServerInfoModel;
/**
 * 服务器信息相关接口
 */
class ServerInfo extends AbstractLib
{
   public function getInfoById($id)
   {
      return ServerInfoModel::findFirst($id);
   }
      
   public function getList($cond = null, $total = false, $orderBy = null, $offset = 0, $limit = 15)
   {
      $items = ServerInfoModel::find(array(
          $cond,
            'order' => $orderBy,
            'limit' => array(
               'number' => $limit,
               'offset' => $offset
            )
      ));
      if ($total) {
         return array($items, (int) ServerInfoModel::count());
      }
      return $items;
   }
      
   public function addServer(array $data)
   {
      unset($data["id"]);
      $server = new ServerInfoModel();
      $this->checkRequireFields($data, $server->getRequireFields(array("id")));
      $server->assignBySetter($data);
      return $server->save();
   }
      
   public function updateServer($id, array $data)
   {
      $server = ServerInfoModel::findFirst($id);
      if(!$server){
         return;
      }
      unset($data['id']);
      $server->assignBySetter($data);
      $server->save();
   }
      
   public function deleteServer($id)
   {
      $server = ServerInfoModel::findFirst($id);
      if(!$server){
         return;
      }
      $server->delete();
   }
      
   public function setServerVersion($id, $version)
   {
      $server = ServerInfoModel::findFirst($id);
      if(!$server){
         return;
      }
      $server->setVersion($version);
      $server->save();
   }
}