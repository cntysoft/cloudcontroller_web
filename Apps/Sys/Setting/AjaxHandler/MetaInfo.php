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
class MetaInfo extends AbstractHandler
{

   public function generateSiteKeyMap()
   {
      $this->getAppCaller()->call(Constant::MODULE_NAME, Constant::APP_NAME,
         Constant::APP_API_SITE_KEY_SETTING, 'generateSiteKeyMap');
   }

}