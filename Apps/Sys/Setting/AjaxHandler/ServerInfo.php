<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\Setting\AjaxHandler;
use Cntysoft\Kernel\App\AbstractHandler;
use App\Sys\Setting\Constant;
class ServerInfo extends AbstractHandler
{

   public function getServerList(array $params = array())
   {
      $orderBy = $limit = $offset = null;
      $this->getPageParams($orderBy, $limit, $offset, $params);
      if(!array_key_exists("cond", $params)){
         $cond = null;
      }else{
         $cond = $params['cond'];
      }
      $list = $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_SERVER_INFO,
         'getList',
         array(
            $cond, true, 'id desc', $offset, $limit
         )
      );
      $total = $list[1];
      $list = $list[0];
      return array(
         'total' => $total,
         'items' => $list->toArray()
      );
   }
   
   public function addServer(array $params)
   {
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_SERVER_INFO,
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
         Constant::APP_API_SERVER_INFO,
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
         Constant::APP_API_SERVER_INFO,
         'deleteServer',
         array(
            (int)$params["id"]
         )
      );
   }
}
