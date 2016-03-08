<?php

/**
 * Cntysoft Cloud Software Team
 * 
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license http://www.cntysoft.com/license/new-bsd     New BSD License
 */

namespace App\Sys\KeleCloud\Model;

use Cntysoft\Phalcon\Mvc\Model as BaseModel;

class ServerInfoModel extends BaseModel
{

   private $id;
   private $name;
   private $ip;
   private $platformInfo;
   private $instanceCount;

   public function getSource()
   {
      return "app_sys_kelecloud_server_info";
   }

   function getId()
   {
      return (int) $this->id;
   }

   function getName()
   {
      return $this->name;
   }

   function getIp()
   {
      return $this->ip;
   }

   function getPlatformInfo()
   {
      return $this->platformInfo;
   }

   function setId($id)
   {
      $this->id = (int) $id;
      return $this;
   }

   function setName($name)
   {
      $this->name = $name;
      return $this;
   }

   function setIp($ip)
   {
      $this->ip = $ip;
      return $this;
   }

   function setPlatformInfo($platformInfo)
   {
      $this->platformInfo = $platformInfo;
      return $this;
   }
   
   function getInstanceCount()
   {
      return (int)$this->instanceCount;
   }

   function setInstanceCount($instanceCount)
   {
      $this->instanceCount = (int)$instanceCount;
      return $this;
   }


}
