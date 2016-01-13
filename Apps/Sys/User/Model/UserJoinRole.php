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
class UserJoinRole extends BaseModel
{
   private $sysUserId;
   private $roleId;

   /**
    * @return string
    */
   public function getSource()
   {
      return 'join_sysuser_role';
   }
   /**
    * @return mixed
    */
   public function getRoleId()
   {
      return (int)$this->roleId;
   }

   /**
    * @param mixed $roleId
    */
   public function setRoleId($roleId)
   {
      $this->roleId = (int)$roleId;
      return $this;
   }

   /**
    * @return mixed
    */
   public function getSysUserId()
   {
      return (int)$this->sysUserId;
   }

   /**
    * @param mixed $sysUserId
    */
   public function setSysUserId($sysUserId)
   {
      $this->sysUserId = (int)$sysUserId;
      return $this;
   }

}