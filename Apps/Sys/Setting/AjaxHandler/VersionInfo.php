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

class VersionInfo extends AbstractHandler
{

   public function getCloudControllerVersion()
   {
      return array(
          'version' => CLOUD_CONTROLLER_VERSION
      );
   }

}
