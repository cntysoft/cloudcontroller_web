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

class InstanceMgr extends AbstractHandler
{
   public function setMetaInfo(array $params = array())
   {
      $this->checkRequireFields($params, array("currentVersion"));
      $this->getAppCaller()->call(Constant::MODULE_NAME, Constant::APP_NAME, Constant::APP_API_INSTANCE_MGR, "setMetaInfo",array(
          $params
      ));
   }
   
   public function getMetaInfo()
   {
      return $this->getAppCaller()->call(Constant::MODULE_NAME, Constant::APP_NAME, Constant::APP_API_INSTANCE_MGR, "getMetaInfo",array(
          $params
      ));
   }
}