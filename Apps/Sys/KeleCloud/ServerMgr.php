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
use Cntysoft\Kernel;
use App\Sys\KeleCloud\Model\ServerInfoModel;

/**
 * 服务器信息相关接口
 */
class ServerMgr extends AbstractLib
{

   public function getInfoById($id)
   {
      return ServerInfoModel::findFirst($id);
   }

   public function getList($total = false, $orderBy = null, $offset = 0, $limit = 15)
   {
      $items = ServerInfoModel::find(array(
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
      $data['instanceCount'] = 0;
      $this->checkRequireFields($data, $server->getRequireFields(array("id")));
      $server->assignBySetter($data);
      return $server->save();
   }

   public function incServerInstanceCount($id)
   {
      $server = ServerInfoModel::findFirst($id);
      if (!$server) {
         return;
      }
      $num = $server->getInstanceCount();
      $server->setInstanceCount($num + 1);
      $server->save();
   }

   public function decServerInstanceCount($id)
   {
      $server = ServerInfoModel::findFirst($id);
      if (!$server) {
         return;
      }
      $num = $server->getInstanceCount();
      $num--;
      if($num < 0){
         return;
      }
      $server->setInstanceCount($num);
      $server->save();
   }

   public function updateServer($id, array $data)
   {
      $server = ServerInfoModel::findFirst($id);
      if (!$server) {
         return;
      }
      unset($data['id']);
      unset($data['instanceCount']);
      $server->assignBySetter($data);
      $server->save();
   }

   public function deleteServer($id)
   {
      $server = ServerInfoModel::findFirst($id);
      if (!$server) {
         return;
      }
      if ($server->getInstanceCount() > 0) {
         $errorType = $this->getErrorType();
         Kernel\throw_exception(
                 new Exception($errorType->msg('E_SERVER_HAS_INSTANCE'), $errorType->code('E_SERVER_HAS_INSTANCE')), $this->getErrorTypeContext());
      }
      $server->delete();
   }

}
