<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\User\Model;
use Cntysoft\Phalcon\Mvc\Model as BaseModel;
use Phalcon\Mvc\Model\Relation;
class BasicInfo extends BaseModel
{
   private $id;
   private $name;
   private $password;
   private $enableMultiLogin;
   private $loginTimes;
   private $lastLoginIp;
   private $lastLoginTime;
   private $lastLogoutTime;
   private $lastModifyPwdTime;
   private $isLock;
   private $enableModifyPwd;
   private $loginErrorTimes;
   private $profileId;
   public function getSource()
   {
      return 'app_sys_user_base_info';
   }
   public function initialize()
   {
      $this->hasManyToMany(
         'id',
         'App\Sys\User\Model\UserJoinRole',
         'sysUserId', 'roleId',
         'App\Sys\User\Model\Role',
         'id',
         array(
            'alias' => 'roles'
         )
      );
      $this->hasOne('profileId', 'App\Sys\User\Model\Profile', 'id',array(
         'alias' => 'profile',
         'foreignKey' => array(
            'action' => Relation::ACTION_CASCADE
         )
      ));
   }
   /**
    * @return mixed
    */
   public function getEnableModifyPwd()
   {
      return (boolean)$this->enableModifyPwd;
   }

   /**
    * @param mixed $enableModifyPwd
    */
   public function setEnableModifyPwd($enableModifyPwd)
   {
      $this->enableModifyPwd = (int)$enableModifyPwd;
      return $this;
   }

   /**
    * @return mixed
    */
   public function getEnableMultiLogin()
   {
      return (boolean)$this->enableMultiLogin;
   }

   /**
    * @param mixed $enableMultiLogin
    */
   public function setEnableMultiLogin($enableMultiLogin)
   {
      $this->enableMultiLogin = (int)$enableMultiLogin;
      return $this;
   }

   /**
    * @return mixed
    */
   public function getId()
   {
      return (int)$this->id;
   }

   /**
    * @param mixed $id
    */
   public function setId($id)
   {
      $this->id = (int)$id;
      return $this;
   }

   /**
    * @return mixed
    */
   public function getIsLock()
   {
      return (boolean)$this->isLock;
   }

   /**
    * @param mixed $isLock
    */
   public function setIsLock($isLock)
   {
      $this->isLock = (int)$isLock;
      return $this;
   }

   /**
    * @return mixed
    */
   public function getLastLoginIp()
   {
      return $this->lastLoginIp;
   }

   /**
    * @param mixed $lastLoginIp
    */
   public function setLastLoginIp($lastLoginIp)
   {
      $this->lastLoginIp = $lastLoginIp;
      return $this;
   }

   /**
    * @return mixed
    */
   public function getLastLoginTime()
   {
      return (int)$this->lastLoginTime;
   }

   /**
    * @param mixed $lastLoginTime
    */
   public function setLastLoginTime($lastLoginTime)
   {
      $this->lastLoginTime = (int)$lastLoginTime;
      return $this;
   }

   /**
    * @return mixed
    */
   public function getLastLogoutTime()
   {
      return (int)$this->lastLogoutTime;
   }

   /**
    * @param mixed $lastLogoutTime
    */
   public function setLastLogoutTime($lastLogoutTime)
   {
      $this->lastLogoutTime = (int)$lastLogoutTime;
      return $this;
   }

   /**
    * @return mixed
    */
   public function getLastModifyPwdTime()
   {
      return (int)$this->lastModifyPwdTime;
   }

   /**
    * @param mixed $lastModifyPwdTime
    */
   public function setLastModifyPwdTime($lastModifyPwdTime)
   {
      $this->lastModifyPwdTime = (int)$lastModifyPwdTime;
      return $this;
   }

   /**
    * @return mixed
    */
   public function getLoginErrorTimes()
   {
      return (int)$this->loginErrorTimes;
   }

   /**
    * @param mixed $loginErrorTimes
    */
   public function setLoginErrorTimes($loginErrorTimes)
   {
      $this->loginErrorTimes = (int)$loginErrorTimes;
      return $this;
   }

   /**
    * @return mixed
    */
   public function getLoginTimes()
   {
      return (int)$this->loginTimes;
   }

   /**
    * @param mixed $loginTimes
    */
   public function setLoginTimes($loginTimes)
   {
      $this->loginTimes = (int)$loginTimes;
      return $this;
   }

   /**
    * @return mixed
    */
   public function getName()
   {
      return $this->name;
   }

   /**
    * @param mixed $name
    */
   public function setName($name)
   {
      $this->name = $name;
      return $this;
   }

   /**
    * @return mixed
    */
   public function getPassword()
   {
      return $this->password;
   }

   /**
    * @param mixed $password
    */
   public function setPassword($password)
   {
      $this->password = $password;
      return $this;
   }

   /**
    * @return mixed
    */
   public function getProfileId()
   {
      return (int)$this->profileId;
   }

   /**
    * @param mixed $profileId
    */
   public function setProfileId($profileId)
   {
      $this->profileId = (int)$profileId;
      return $this;
   }

}