<?php
/**
 * Cntysoft Cloud Software Team
 */
namespace App\Sys\AppInstaller\AjaxHandler;
use Cntysoft\Kernel\App\AbstractHandler;
use App\Sys\AppInstaller\Constant;

/**
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
class ModuleMgr extends AbstractHandler
{
   public function getModuleList()
   {
      $ret = $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_MODULE_MGR,
         'getModuleList'
      );
      return $ret->toArray();
   }
}