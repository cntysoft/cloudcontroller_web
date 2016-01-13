<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\User\AjaxHandler;
use Cntysoft\Kernel\App\AbstractHandler;
use Cntysoft\Kernel;
use App\Sys\User\Constant;

class Authorizer extends AbstractHandler
{
   /**
    * 从Cookie登录
    *
    * @return boolean
    */
   public function loginByCookie()
   {
      return $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_ACL,
         'loginByCookie'
      );
   }

   /**
    * 站点管理员登陆接口
    *
    * @param array $params
    * @return boolean
    */
   public function login($params)
   {
      $this->checkRequireFields($params, array('username', 'password', 'chkcode'));
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_ACL,
         'login',
         array(
            $params['username'],
            $params['password'],
            $params['chkcode']
         )
      );
   }

   public function logout()
   {
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_ACL,
         'logout'
      );
   }
   /**
    * 获取当前用户信息
    *
    * @return array
    */
   public function retrieveUserInfo()
   {
      return $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_ACL,
         'retrieveUserInfo'
      );
   }

}
