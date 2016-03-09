<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\KeleCloud\AjaxHandler;
use Cntysoft\Kernel\App\AbstractHandler;
use App\Sys\KeleCloud\Constant;
class ServerInfo extends AbstractHandler
{

   public function getServerList(array $params = array())
   {
      $orderBy = $limit = $offset = null;
      $this->getPageParams($orderBy, $limit, $offset, $params);
      $list = $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_SERVER_MGR,
         'getList',
         array(
            true, 'id desc', $offset, $limit
         )
      );
      $total = $list[1];
      $list = $list[0];
      return array(
         'total' => $total,
         'items' => $list->toArray()
      );
   }
   
   public function getServerListForTree(array $params = array())
   {
      $orderBy = $limit = $offset = null;
      $this->getPageParams($orderBy, $limit, $offset, $params);
      $list = $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_SERVER_MGR,
         'getList',
         array(
            false, 'id desc', $offset, $limit
         )
      );
      $ret = [];
      foreach ($list as $item){
         $ret[] = array(
            'id' => $item->getId(),
            'text' => $item->getName()." <span style = 'color:blue'>[{$item->getInstanceCount()}]</span>",
            'ip' => $item->getIp(),
            'leaf' => true
         );
      }
      return $ret;
   }
   
   public function addServer(array $params)
   {
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_SERVER_MGR,
         'addServer',
         array(
            $params
         )
      );
   }
   
   public function updateServerInfo(array $params)
   {
      $this->checkRequireFields($params, array("id"));
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_SERVER_MGR,
         'updateServer',
         array(
            (int)$params["id"],
            $params
         )
      );
   }
   
   public function deleteServerInfo(array $params)
   {
      $this->checkRequireFields($params, array("id"));
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_SERVER_MGR,
         'deleteServer',
         array(
            (int)$params["id"]
         )
      );
   }
}
