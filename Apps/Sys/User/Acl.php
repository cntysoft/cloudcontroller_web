<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\User;
use Cntysoft\Kernel\App\AbstractLib;
use Cntysoft\Kernel;
use Cntysoft\Kernel\ConfigProxy;
use Cntysoft\Stdlib\Filesystem;
use App\Sys\User\RoleMgr;
use CloudController\Kernel\StdHtmlPath;
use App\Sys\AppInstaller\Constant as APP_INSTALL_CONST;
use App\Sys\User\Model\BasicInfo as UserModel;
/**
 * 站点管理员权限相关的接口
 * 
 * @package App\Sys\User
 */
class Acl extends AbstractLib
{

   /**
    * @var string 登录序列的目录名称
    */
   const LOGIN_SEQ_DIR = 'LoginSeq';

   /**
    * @var array $cookieKeys 客户端储存COOKIES的键
    */
   protected $cookieKeys = array();

   /**
    * SESSION对象管理器
    *
    * @var \Zend\Session\Container  $sessionManager
    */
   protected $sessionManager = null;

   /**
    * COOKIE管理对象
    *
    * @var \Cntysoft\Kernel\CookieManager $cookieManager
    */
   protected $cookieManager = null;

   /**
    * 系统权限树内存缓存数组
    *
    * @var array $permissionTrees
    */
   protected $permissionTrees = array();

   /**
    * @var \App\Sys\User\Model\BasicInfo $curUser
    */
   protected $curUser = null;

   /**
    * @var array $everyoneApps 所有用户都能用的程序
    */
   protected static $everyoneApps = array(
      'Sys.TaskManager'
   );

   /**
    * @var \Phalcon\DI $di
    */
   protected $di = null;

   public function __construct()
   {
      parent::__construct();
      $this->sessionManager = $this->di->get('SessionManager');
      $this->cookieManager = $this->di->get('CookieManager');
   }

/**
 * 获取站点用户的相关信息，桌面背景，可以运行的程序的列表
 * 
 * @return array
 */
   public function retrieveUserInfo()
   {
      $sysUser = $this->getCurUser();
      $userInfo = array();
      $profileArray = array();
      $profileArray['id'] = $sysUser->getId();
      $profile = $sysUser->getProfile();
      $roles = $sysUser->getRoles();
      $rmap = array();
      foreach ($roles as $role) {
         $rmap[$role->getId()] = $role->getName();
      }
      $profileArray['roles'] = $rmap;
      $profileArray['name'] = $sysUser->getName();
      $profileArray['loginTimes'] = $sysUser->getLoginTimes();
      $profileArray['loginErrorTimes'] = $sysUser->getLoginErrorTimes();
      $profileArray['lastLoginIp'] = $sysUser->getLastLoginIp();
      $profileArray['lastLoginTime'] = $sysUser->getLastLoginTime();
      //桌面相关的数据
      $wallpaper = $profile->getWallPaper();
      if (!strpos($wallpaper, '|')) {
         $wallpaper = '1|#003366';
      }
      $profileArray['wallPaper'] = $wallpaper;
      $userInfo['sysUserProfile'] = $profileArray;

      $userInfo['isSuper'] = $this->sysUserIsSuper($sysUser);

      $this->getPhpSetting($userInfo);
      $this->setPlatformInfo($userInfo);

      $userInfo['acl'] = $this->getUserPermTreeArray();
      $userInfo['appMetas'] = $this->getCurUserAppMetaInfo();
      $modules = [];
      foreach ($userInfo['appMetas'] as $meta) {
         $modules[] = $meta['module'];
      }
      $modules = array_unique($modules);
      $this->setupSupportedModules($userInfo, $modules);
      //设置一些系统的配置信息
      $this->setSysSetting($userInfo);
      return $userInfo;
   }

   /**
    * 设置当前用户信息中的 App Modules
    * 
    * 
    * @param array $userInfo
    * @param array $userAllowModules
    */
   protected function setupSupportedModules(array &$userInfo, $userAllowModules)
   {
      $ret = array();
      $cmmgr = $this->getAppCaller()->getAppObject(
         APP_INSTALL_CONST::MODULE_NAME, APP_INSTALL_CONST::APP_NAME,
         APP_INSTALL_CONST::APP_API_MMGR
      );
      $cfg = ConfigProxy::getGlobalConfig();
      $supportedModules = $cfg->supportedModules;
      foreach ($supportedModules as $mkey) {
         if (!isset($ret[$mkey])) {
            $module = $cmmgr->getModule($mkey);
            if (in_array($mkey, $userAllowModules)) {
               $ret[$mkey] = $module->toArray(true);
            }
         }
      }
      $userInfo['supportedModules'] = $ret;
   }

   /**
    * 系统用户登录
    * 
    * @param type $name
    * @param type $password
    * @param type $checkCode
    * @return boolean
    */
   public function login($name, $password, $checkCode)
   {
      $sysChkCode = $this->sessionManager->offsetGet(\Cntysoft\SITEMANAGER_S_KEY_CHK_CODE);
      if (!$sysChkCode) {
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_CHECK_CODE_EXPIRED'),
            $errorType->code('E_CHECK_CODE_EXPIRED')),
            $this->getErrorTypeContext());
      } else if (strtoupper($checkCode) !== $sysChkCode) {
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_CHECK_CODE_ERROR'),
            $errorType->code('E_CHECK_CODE_ERROR')),
            $this->getErrorTypeContext());
      }
      $sysUser = $this->getAppCaller()->call(
         Constant::MODULE_NAME, Constant::APP_NAME, Constant::APP_API_MEMBER,
         'getUserByName', array(
         $name
         )
      );
      if (!$sysUser) {
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_USERNAME_PWD_ERROR'),
            $errorType->code('E_USERNAME_PWD_ERROR')),
            $this->getErrorTypeContext());
      }
      try {
         $pwdHasher = $this->di->getShared('security');
         $targetPwd = $sysUser->getPassword();
         if (!$pwdHasher->checkHash($password, $targetPwd)) {
            $errorType = $this->getErrorType();
            Kernel\throw_exception(new Exception(
               $errorType->msg('E_USERNAME_PWD_ERROR'),
               $errorType->code('E_USERNAME_PWD_ERROR')),
               $this->getErrorTypeContext());
         }
         if ($sysUser->getIsLock()) {
            $errorType = $this->getErrorType();
            Kernel\throw_exception(new Exception(
               $errorType->msg('E_USER_LOCKED'),
               $errorType->code('E_USER_LOCKED')), $this->getErrorTypeContext());
         }
         //记录相关登录时间和IP
         $sysUser->setLastLoginTime(time());
         $sysUser->setLastLoginIp(Kernel\get_client_ip());
         $loginTimes = (int) $sysUser->getLoginTimes();
         $loginTimes++;
         $sysUser->setLoginTimes($loginTimes);
         $sysUser->save();
         //登录成功
         //@TODO这个过程合理吗？
         $keys = $this->getCookieKeys();
         $authKey = $keys[Constant::AUTH_KEY];
         //当前的秒数为登录序列
         $loginSeq = time();
         $token = $this->getLoginToken($name, $loginSeq);
         $this->cookieManager->setCookie($authKey, $token);
         $isSuper = $this->getAppCaller()->call(
            Constant::MODULE_NAME, Constant::APP_NAME, Constant::APP_API_MEMBER,
            'isSuper', array(
            $sysUser->getId()
            )
         );
         $this->sessionManager->offsetSet(\Cntysoft\SITEMANAGER_S_KEY_SYS_USER_INFO,
            $name . '|' . $isSuper);
         $this->setupRolesSessionData($sysUser);
         $this->setLoginSeq($name, $loginSeq);
         return true;
      } catch (\Exception $ex) {
         //记录登录错误的次数
         $loginErrorTimes = $sysUser->getLoginErrorTimes();
         $loginErrorTimes++;
         $sysUser->setLoginErrorTimes($loginErrorTimes);
         $sysUser->save();
         Kernel\throw_exception($ex, $this->getErrorTypeContext());
      }
   }

   /**
    * 通过COOKIE登录系统
    * 
    * @return boolean
    */
   public function loginByCookie()
   {
      $keys = $this->getCookieKeys();
      $authKey = $keys[Constant::AUTH_KEY];
      $token = $this->cookieManager->getCookie($authKey);
      try {
         if (!$token) {
            $errorType = $this->getErrorType();
            Kernel\throw_exception(new Exception(
               $errorType->msg('E_COOKIE_LOGIN_FAILED'),
               $errorType->code('E_COOKIE_LOGIN_FAILED')
               ), $this->getErrorTypeContext());
         }
         $clientToken = Kernel\get_trait_token();
         $token = explode('|', $token);
         if ($clientToken !== $token[1]) {
            $errorType = $this->getErrorType();
            Kernel\throw_exception(new Exception(
               $errorType->msg('E_COOKIE_LOGIN_FAILED'),
               $errorType->code('E_COOKIE_LOGIN_FAILED')),
               $this->getErrorTypeContext());
         }
         $sysUser = $this->getCurUser();
         if ($sysUser && $sysUser->getIsLock()) {
            $this->logout();
            $errorType = $this->getErrorType();
            Kernel\throw_exception(new Exception(
               $errorType->msg('E_USER_LOCKED'),
               $errorType->code('E_USER_LOCKED')), $this->getErrorTypeContext()
            );
         } else if (!$sysUser) {
            $this->logout();
            $errorType = $this->getErrorType();
            Kernel\throw_exception(new Exception(
               $errorType->msg('E_USER_IS_NOT_EXIST'),
               $errorType->code('E_USER_IS_NOT_EXIST')),
               $this->getErrorTypeContext()
            );
         }
         //登录成功
         //当前的秒数为登录序列 更新
         $loginSeq = time();
         $newToken = $this->getLoginToken($token[0], $token[1], $loginSeq);
         $this->cookieManager->setCookie($authKey, $newToken);
         $isSuper = $this->getAppCaller()->call(
            Constant::MODULE_NAME, Constant::APP_NAME, Constant::APP_API_MEMBER,
            'isSuper', array(
            $sysUser->getId()
            )
         );
         $this->sessionManager->offsetSet(\Cntysoft\SITEMANAGER_S_KEY_SYS_USER_INFO,
            $token[0] . '|' . $token[1] . '|' . $isSuper);
         $this->setupRolesSessionData($sysUser);
         $this->setLoginSeq($token[0], $token[1], $loginSeq);
         //记录相关登录时间和IP
         $sysUser->setLastLoginTime(time());
         $sysUser->setLastLoginIp(Kernel\get_client_ip());
         $loginTimes = (int) $sysUser->getLoginTimes();
         $loginTimes++;
         $sysUser->setLoginTimes($loginTimes);
         $sysUser->save();
         return true;
      } catch (\Exception $ex) {
         //记录登录错误的次数
         $sysUser = $this->getCurUser();
         if ($sysUser) {
            $loginErrorTimes = (int) $sysUser->getLoginErrorTimes();
            $loginErrorTimes++;
            $sysUser->setLoginErrorTimes($loginErrorTimes);
            $sysUser->save();
         }
         Kernel\throw_exception($ex, $this->getErrorTypeContext());
      }
   }

   /**
    * @param \App\Sys\User\Model\BasicInfo $sysUser
    */
   protected function setupRolesSessionData($sysUser)
   {
      $roles = $sysUser->getRoles();
      $roleIds = array();
      if (0 !== $roles) {
         foreach ($roles as $role) {
            $roleIds[] = $role->getId();
         }
      }
      $this->sessionManager->offsetSet(\Cntysoft\SITEMANAGER_S_KEY_ROLE,
         implode(',', $roleIds));
   }

   /**
    * 判断当前是否有用户进行了登录, 通过异常进行消息传递
    * 
    * @throws \App\Sys\User\Exception
    */
   public function isLogin()
   {
      $keys = $this->getCookieKeys();
      $key = $keys[Constant::AUTH_KEY];
      $data = explode('|', $this->cookieManager->getCookie($key));
      if (!$data) {
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_NO_BODY_LOGIN'),
            $errorType->code('E_NO_BODY_LOGIN')), $this->getErrorTypeContext());
      }
      //获取当前登录的用户
      $user = $this->getCurUser();
//      if ($user) {
//         if ((int) $data[3] != (int) $this->getLoginSeq($user->getSiteId(),
//               $user->getName())) {
//            $errorType = $this->getErrorType();
//            //多实例失败
//            $this->cookieManager->deleteCookie($key);
//            Kernel\throw_exception(new Exception(
//               $errorType->msg('E_MULTI_LOGIN_FAIL'),
//               $errorType->code('E_MULTI_LOGIN_FAIL')),
//               $this->getErrorTypeContext());
//         }
//      } else if (!$user) {
      if(!$user){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_NO_BODY_LOGIN'),
            $errorType->code('E_NO_BODY_LOGIN')), $this->getErrorTypeContext());
      }
   }

   /**
    * 注销用户登录
    */
   public function logout()
   {
      $keys = $this->getCookieKeys();
      $key = $keys[Constant::AUTH_KEY];
      $this->cookieManager->deleteCookie($key);
      $this->sessionManager->offsetUnset(\Cntysoft\SITEMANAGER_S_KEY_SYS_USER_INFO);
   }

   /**
    * @return \App\Sys\User\Model\BasicInfo
    */
   public function getCurUser()
   {
      if (null == $this->curUser) {
         $keys = $this->getCookieKeys();
         $token = $this->cookieManager->getCookie($keys[Constant::AUTH_KEY]);
         if (!$token) {
            $errorType = $this->getErrorType();
            Kernel\throw_exception(new Exception(
               $errorType->msg('E_AUTH_COOKIE_NOT_EXIST'),
               $errorType->code('E_AUTH_COOKIE_NOT_EXIST')),
               $this->getErrorTypeContext());
         }
         $token = explode('|', $token);
         $name = $token[0];
         $this->curUser = $this->getAppCaller()->call(
            Constant::MODULE_NAME, Constant::APP_NAME, Constant::APP_API_MEMBER,
            'getUserByName', array(
            $name
            )
         );
      }
      return $this->curUser;
   }

   /**
    * 获取当前用户的ID
    *
    * @return int
    * @throws \Exception
    */
   public function getCurSysUserId()
   {
      $keys = $this->getCookieKeys();
      $token = $this->cookieManager->getCookie($keys[Constant::AUTH_KEY]);
      if (!$token) {
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_AUTH_COOKIE_NOT_EXIST'),
            $errorType->code('E_AUTH_COOKIE_NOT_EXIST')),
            $this->getErrorTypeContext());
      }
      $token = explode('|', $token);
      return (int) $token[0];
   }

   /**
    * 判断当前咱点是否为超级管理员
    *
    * @return bool
    * @throws \Exception
    */
   public function curSysUserIsSuperUser()
   {
      $keys = $this->getCookieKeys();
      $token = $this->cookieManager->getCookie($keys[Constant::AUTH_KEY]);
      if (!$token) {
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_AUTH_COOKIE_NOT_EXIST'),
            $errorType->code('E_AUTH_COOKIE_NOT_EXIST')),
            $this->getErrorTypeContext());
      }
      $token = explode('|', $token);
      $name = $token[0];
      $user = $this->getAppCaller()->call(
         Constant::MODULE_NAME, Constant::APP_NAME, Constant::APP_API_MEMBER,
         'getUserByName', array(
         $name
         )
      );
      $roles = $user->getRoles();
      foreach ($roles as $role) {
         if ($role->getId() === RoleMgr::SUPER_MANAGER_ROLE_ID) {
            return true;
         }
      }
      return false;
   }

   /**
    * 设置用户的登录序列
    *
    * @param string $username
    * @param string $seq
    */
   protected function setLoginSeq($username, $seq)
   {
      $base = Kernel\StdDir::getDataDir() . DS . self::LOGIN_SEQ_DIR;
      if (!file_exists($base)) {
         Filesystem::createDir($base);
      }
      $file = $base . DS . $username;
      Filesystem::filePutContents($file, $seq);
   }

   /**
    * 获取登录序列
    *
    * @param string $username
    * @param int $loginSeq 登录序列
    * @return string
    */
   protected function getLoginToken($username, $loginSeq)
   {
      $token = array(
         $username,
         Kernel\get_trait_token(),
         $loginSeq,
         ''//最后一个不知道为什么是乱码
      );
      return implode('|', $token);
   }

   /**
    * 判断指定用户是否为创始人
    *
    * @param int $uid
    */
   public function sysUserIsSuper($uid)
   {
      if (!$uid instanceof UserModel) {
         $user = $this->getAppCaller()->call(
            Constant::MODULE_NAME, Constant::APP_NAME, Constant::APP_API_MEMBER,
            'getUser', array($uid)
         );
      } else {
         $user = $uid;
      }
      if (!$uid instanceof UserModel) {
         return false;
      }
      $roles = $user->getRoles();
      foreach ($roles as $role) {
         if ($role->getId() === RoleMgr::SUPER_MANAGER_ROLE_ID) {
            return true;
         }
      }
      return false;
   }

   /**
    * 获取当前角色所有的详细的APP的权限
    *
    * @return array
    */
   public function getUserPermTreeArray()
   {
      $permTree = $this->getCurUserPermTree();
      $ret = array();
      $appResoureces = $permTree->getChildren(0, 1);
      foreach ($appResoureces as $id) {
         $appResource = $permTree->getValue($id);
         $this->getAppPermissionItems($appResource, $ret, $permTree, true);
      }
      return $ret;
   }

   /**
    * @param array $node  权限树节点数组
    * @param array $data
    * @param \Cntysoft\Stdlib\Tree $tree
    * @param boolean $isApp 是否为起始的APP
    */
   protected function getAppPermissionItems($node, array &$data, $tree, $isApp)
   {
      $key = $isApp ? $node['moduleKey'] . '.' . $node['appKey'] : $node['internalKey'];
      $data[$key] = array(
         'text' => $node['text']
      );
      if (!$this->curUserIsSuper() && 0 !== $node['pid'] && $node['hasDetail']) {
         if ($node instanceof PermResource) {
            $data[$key]['detailPermission'] = $node->getDetailPermission();
         }
      }
      $children = $tree->getChildren($node['id'], 1, true);
      if (count($children) > 0) {
         foreach ($children as $child) {
            $this->getAppPermissionItems($child, $data[$key], $tree, false);
         }
      }
   }

   /**
    * @return \Cntysoft\Stdlib\Tree
    */
   public function getCurUserPermTree()
   {
      return $this->getAppCaller()->call(
            Constant::MODULE_NAME, Constant::APP_NAME, Constant::APP_API_PERM,
            'getUserPermTree', array(
            $this->getCurUser()
            )
      );
   }

   /**
    * 获取当前系统用户能够使用的应用程序的信息
    *
    * @return array
    */
   public function getCurUserAppMetaInfo()
   {
      //这些的快慢直接影响系统的启动速度
      //以后看看能不能进行优化
      $permTree = $this->getCurUserPermTree();
      $apps = $permTree->getChildren(0, 1, true);
      $this->addEveryoneApps($apps);
      $installer = $this->getAppCaller()->getAppObject(
         APP_INSTALL_CONST::MODULE_NAME, APP_INSTALL_CONST::APP_NAME,
         APP_INSTALL_CONST::APP_API_META
      );
      $infos = array();
      $sysUser = $this->getCurUser();
      $profile = $sysUser->getProfile();
      //这里把相应的没有在系统用户权限表的虚拟桌面数据都删除了
      //这样会影响启动速度哦
      //桌面顺序
      $vdOrder = $profile->getAppVdOrder();
      $vdOrder = $vdOrder ? $vdOrder : array();
      $cmmgr = $this->getAppCaller()->getAppObject(
         APP_INSTALL_CONST::MODULE_NAME, APP_INSTALL_CONST::APP_NAME,
         APP_INSTALL_CONST::APP_API_MMGR
      );
      foreach ($apps as $app) {
         $moduleKey = $app['moduleKey'];
         $appKey = $app['appKey'];
         $key = $moduleKey . '.' . $appKey;
         $appObj = $installer->getAppInfo($moduleKey, $appKey);
         if (array_key_exists($key, $vdOrder)) {
            $order = $vdOrder[$key];
         } else {
            $order = 0;
         }
         $infos[] = array(
            'module' => $moduleKey,
            'moduleName' => $cmmgr->getModule($moduleKey)->getText(),
            'name' => $appKey,
            'text' => $appObj->getName(),
            'type' => 'app',
            'order' => $order,
            'runConfig' => $appObj->getRunConfig(),
            'showOnDesktop' => $appObj->getShowOnDesktop()
         );
      }
      return $infos;
   }

   /**
    * 有些App是每个人都能使用的
    *
    * @param array $apps
    */
   protected function addEveryoneApps(array &$apps)
   {
      $installer = $this->getAppCaller()->getAppObject(
         APP_INSTALL_CONST::MODULE_NAME, APP_INSTALL_CONST::APP_NAME,
         APP_INSTALL_CONST::APP_API_META
      );
      foreach (self::$everyoneApps as $app) {
         $parts = explode('.', $app);
         $app = $installer->getAppInfo($parts[0], $parts[1]);
         if ($app) {
            $apps[] = $app->toArray(true);
         }
      }
   }

   /**
    * 判断当前用户是否超级管理员
    *
    * @return boolean
    */
   protected function curUserIsSuper()
   {
      $token = $this->sessionManager->offsetGet(\Cntysoft\SITEMANAGER_S_KEY_SYS_USER_INFO);
      $parts = explode('|', $token);
      return '1' == $parts[1];
   }

   /**
    * 判断当前的用户是否为创始人
    *
    * @return boolean
    */
   protected function setPlatformInfo(array &$data)
   {
      $data['platformInfo'] = array(
         'version' => Kernel\get_sys_version_str()
      );
   }

   /**
    * 设置系统一些配置项
    *
    * @param array $data
    */
   protected function setSysSetting(array &$data)
   {
      //设置凤凰筑巢OSS服务器地址
      $cfg = ConfigProxy::getFrameworkConfig('Net');
      if(Kernel\is_local_deploy()){
         $imgOssServer = 'http://'.\Cntysoft\RT_CLOUD_CONTROLLER_OSS_IMG_BUCKET.'.'.\Cntysoft\OSS_PUBLIC_ENTRY;
      }else{
         $imgOssServer = 'http://'.\Cntysoft\RT_CLOUD_CONTROLLER_OSS_IMG_BUCKET.'.'.\Cntysoft\OSS_PUBLIC_ENTRY;
      }
      
      $data['sysSetting'] = array(
         'upload' => array(
            'allowedPaths' => $cfg->upload->allowedDirs->toArray()
         ),
         'uploadRootPath' => StdHtmlPath::getUploadFilesPath(),
         'ossImgServer' => $imgOssServer,
         'cdnServer' => array(
            'img' => \Cntysoft\Kernel\get_image_cdn_server_url()
         )
      );
      $gcfg = ConfigProxy::getGlobalConfig();
      $data["websocket"] = $gcfg->websocket->toArray();
   }

   protected function getPhpSetting(array &$data)
   {
      //这个地方可能有问题，我们比较的时候没有考虑到单位, 强行按照MB为单位比较
      $postMaxSize = (int) ini_get('post_max_size');
      $memoryLimit = (int) ini_get('memory_limit');
      $uploadMaxFilesize = (int) ini_get('upload_max_filesize');
      $data['phpSetting'] = array(
         'uploadMaxFileSize' => min(array($postMaxSize, $memoryLimit, $uploadMaxFilesize)) . 'MB'
      );
   }

   /**
    * 获取cookies键值
    *
    * @return array
    */
   public function getCookieKeys()
   {
      if (null == $this->cookieKeys) {

         $config = ConfigProxy::getFrameworkConfig('Security');
         if (isset($config->cookieKeys)) {
            $this->cookieKeys = $config->cookieKeys->site->toArray();
         } else {
            $this->cookieKeys = array();
         }
         $this->cookieKeys += $this->getDefaultKeys();
      }
      return $this->cookieKeys;
   }

   /**
    * 默认的COOKIE键
    *
    * @return array
    */
   protected function getDefaultKeys()
   {
      return array(
         Constant::AUTH_KEY => 'qawssh1sw',
         Constant::STATUS_KEY => 'esAWASDSAE'
      );
   }

}