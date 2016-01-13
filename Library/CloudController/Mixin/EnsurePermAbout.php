<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\Mixin;
use App\Sys\User\Constant;
trait EnsurePermAbout
{
   /**
    * 确保进行API操作的是超级管理员
    *
    * @throws \Cntysoft\Kernel\App\Exception
    */
   protected function ensureSuperUser()
   {
      $isSuper = $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_ACL,
         'curSysUserIsSuperUser'
      );
      if (!$isSuper) {
         $this->throwPermissionDeny('operation only allow by superuser');
      }
   }
}