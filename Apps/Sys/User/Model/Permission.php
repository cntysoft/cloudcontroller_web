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

class Permission extends BaseModel
{
   private $id;
   private $roleId;
   private $detailPermission;
   private $resourceId;
   public function initialize()
   {
      $this->hasOne('resourceId', 'App\Sys\AppInstaller\Model\PermResource', 'id',array(
         'alias' => 'resource'
      ));

      $this->belongsTo('roleId', 'App\Sys\User\Model\Role', 'id');
   }

   public function getSource()
   {
      return 'app_sys_user_permission';
   }
   /**
    * @return mixed
    */
   public function getDetailPermission()
   {
      return $this->detailPermission;
   }

   /**
    * @param mixed $detailPermission
    */
   public function setDetailPermission($detailPermission)
   {
      $this->detailPermission = $detailPermission;
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
   public function getResourceId()
   {
      return (int)$this->resourceId;
   }

   /**
    * @param mixed $resourceId
    */
   public function setResourceId($resourceId)
   {
      $this->resourceId = (int)$resourceId;
      return $this;
   }

}