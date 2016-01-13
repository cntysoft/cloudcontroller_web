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
/**
 * 角色数据模型
 */
class Role extends BaseModel
{
   private $id;
   private $name;
   private $description;

   public function initialize()
   {
      $this->hasManyToMany(
         'id',
         'App\Sys\User\Model\UserJoinRole',
         'roleId',
         'sysUserId',
         'App\Sys\User\Model\BasicInfo',
         "id", array('alias' => 'sysUsers')
      );

      $this->hasMany('id', 'App\Sys\User\Model\Permission', 'roleId', array(
         'alias' => 'permissions'
      ));
   }

   public function getSource()
   {
      return 'app_sys_user_role';
   }

   /**
    * @return int $id
    */
   public function getId()
   {
      return (int)$this->id;
   }

   /**
    * @return string $name
    */
   public function getName()
   {
      return $this->name;
   }

   /**
    * @return string $decription
    */
   public function getDescription()
   {
      return $this->description;
   }

   /**
    * @param int $id
    */
   public function setId($id)
   {
      $this->id = (int)$id;
      return $this;
   }

   /**
    * @param string $name
    */
   public function setName($name)
   {
      $this->name = $name;
      return $this;
   }

   /**
    * @param string $description
    */
   public function setDescription($description)
   {
      $this->description = $description;
      return $this;
   }

}