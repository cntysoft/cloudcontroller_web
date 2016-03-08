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
class VersionInfo extends AbstractHandler
{

   public function getVersionList(array $params = array())
   {
      $orderBy = $limit = $offset = null;
      $this->getPageParams($orderBy, $limit, $offset, $params);
      $list = $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_VERSION_MGR,
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
   
   public function addVersion(array $params)
   {
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_VERSION_MGR,
         'addVersion',
         array(
            $params
         )
      );
   }
   
   public function updateVersion(array $params)
   {
      $this->checkRequireFields($params, array("id"));
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_VERSION_MGR,
         'updateVersion',
         array(
            (int)$params["id"],
            $params
         )
      );
   }
   
   public function deleteVersion(array $params)
   {
      $this->checkRequireFields($params, array("id"));
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_VERSION_MGR,
         'deleteVersion',
         array(
            (int)$params["id"]
         )
      );
   }
}
