<?php

/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\KeleCloud\Model;
use Cntysoft\Phalcon\Mvc\Model as BaseModel;
class InstanceInfoModel extends BaseModel
{
   private $id;
   private $name;
   private $instanceKey;
   private $createTime;
   private $serviceStartTime;
   private $serviceEndTime;
   private $ip;
   public function getSource()
   {
      return "app_sys_kelecloud_instance_info";
   }
   function getId()
   {
      return (int)$this->id;
   }

   function getName()
   {
      return $this->name;
   }

   function getInstanceKey()
   {
      return $this->instanceKey;
   }

   function getCreateTime()
   {
      return (int)$this->createTime;
   }

   function getServiceStartTime()
   {
      return (int)$this->serviceStartTime;
   }

   function getServiceEndTime()
   {
      return (int)$this->serviceEndTime;
   }

   function getIp()
   {
      return $this->ip;
   }

   function setId($id)
   {
      $this->id = (int)$id;
      return $this;
   }

   function setName($name)
   {
      $this->name = $name;
      return $this;
   }

   function setInstanceKey($instanceKey)
   {
      $this->instanceKey = $instanceKey;
      return $this;
   }

   function setCreateTime($createTime)
   {
      $this->createTime = (int)$createTime;
      return $this;
   }

   function setServiceStartTime($serviceStartTime)
   {
      $this->serviceStartTime = (int)$serviceStartTime;
      return $this;
   }

   function setServiceEndTime($serviceEndTime)
   {
      $this->serviceEndTime = (int)$serviceEndTime;
      return $this;
   }

   function setIp($ip)
   {
      $this->ip = $ip;
      return $this;
   }


}