<?php
/**
 * Cntysoft Cloud Software Team
 */
namespace SysApiHandler;
use Cntysoft\Kernel;
use Cntysoft\Framework\ApiServer\AbstractScript;
use App\Sys\User\Constant as SYSUSER_CONST;
use App\Platform\Util\Constant as PLATFORM_UTIL_CONST;
use CloudController\Mixin\EnsurePermAbout;

/**
 * WebOs桌面相关的API，这个里面需要登录验证
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
class WebOs extends AbstractScript
{
   use EnsurePermAbout;
   /**
    * 保存当前用户的APP虚拟桌面的排列顺序映射数据
    *
    * @param array $params
    */
   public function updateAppVdOrder(array $params)
   {
      $user = $this->getAppCaller()->call(
         SYSUSER_CONST::MODULE_NAME,
         SYSUSER_CONST::APP_NAME,
         SYSUSER_CONST::APP_API_ACL,
         'getCurUser'
      );

      $profile = $user->getProfile();
      $profile->setAppVdOrder($params);
      $profile->save();
   }

   public function saveAdviseInfo(array $params)
   {
      $this->checkRequireParams($params, array(
         'title','content'
      ));
      $params['siteId'] = Kernel\get_site_id();
      $this->getAppCaller()->call(
         PLATFORM_UTIL_CONST::MODULE_NAME,
         PLATFORM_UTIL_CONST::APP_NAME,
         PLATFORM_UTIL_CONST::APP_API_ADVISE,
         'addAdvise',
         array(
            $params
         )
      );
   }
   
   /**
    * 获取当前用户的信息
    * 
    * @return array
    */
   public function getCurrentUserInfo()
   {
      $user = $this->getAppCaller()->call(
         SYSUSER_CONST::MODULE_NAME,
         SYSUSER_CONST::APP_NAME,
         SYSUSER_CONST::APP_API_ACL,
         'getCurUser'
      )->toArray();
      $user['lastLoginTime'] = date('Y-m-d', $user['lastLoginTime']);
      $user['lastLogoutTime'] = date('Y-m-d', $user['lastLogoutTime']);
      $user['lastModifyPwdTime'] = date('Y-m-d', $user['lastModifyPwdTime']);
      
      return $user;
   }
   
   /**
    * 保存用户的信息
    * 
    * @param array $params
    */
   public function saveUserInfo(array $params)
   {
      $this->checkRequireParams($params, array('name', 'enableMultiLogin', 'loginTimes', 'lastLoginIp', 'lastLoginTime', 'lastLogoutTime', 'lastModifyPwdTime', 'loginErrorTimes'));
      unset($params['name']);
      $currentUser = $this->getCurrentUserInfo();
      
      $this->getAppCaller()->call(
         SYSUSER_CONST::MODULE_NAME,
         SYSUSER_CONST::APP_NAME,
         SYSUSER_CONST::APP_API_INFO,
         'updateUser',
         array($currentUser['id'], $params)
      );
   }
   
   /**
    * 修改管理员密码
    * 
    * @param array $params
    */
   public function modifyPwd(array $params)
   {
      $this->checkRequireParams($params, array('oldPassword', 'newPassword'));
		$pwdHasher =  Kernel\get_global_di()->getShared('security');
		$password = $pwdHasher->hash($params['newPassword']);

		$currentUser = $this->getAppCaller()->call(SYSUSER_CONST::MODULE_NAME, SYSUSER_CONST::APP_NAME, SYSUSER_CONST::APP_API_ACL, 'getCurUser');

		if(!$pwdHasher->checkhash($params['oldPassword'], $currentUser->getPassword())){
			$errorType = ErrorType::getInstance();
			Kernel\throw_exception(new Exception(
				$errorType->msg('E_OLD_PASSWORD_ERROR'), $errorType->code('E_OLD_PASSWORD_ERROR')
			));
		}

		$this->appCaller->call(SYSUSER_CONST::MODULE_NAME, SYSUSER_CONST::APP_NAME, SYSUSER_CONST::APP_API_INFO, 'updateUser', array($currentUser->getId(), array('password' => $password)));
   }
}