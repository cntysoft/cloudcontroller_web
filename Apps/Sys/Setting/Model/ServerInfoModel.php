<?php

/**
 * Cntysoft Cloud Software Team
 * 
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license http://www.cntysoft.com/license/new-bsd     New BSD License
 */

namespace App\Sys\Setting\Model;

use Cntysoft\Phalcon\Mvc\Model as BaseModel;

class ServerInfoModel extends BaseModel
{

   private $id;
   private $type;
   private $ip;
   private $description;
   private $version;

   public function getSource()
   {
      return "app_sys_setting_server_info";
   }

   function getId()
   {
      return (int) $this->id;
   }

   function getType()
   {
      return (int) $this->type;
   }

   function getIp()
   {
      return $this->ip;
   }

   function getDescription()
   {
      return $this->description;
   }

   function setId($id)
   {
      $this->id = (int) $id;
      return $this;
   }

   function setType($type)
   {
      $this->type = (int) $type;
      return $this;
   }

   function setIp($ip)
   {
      $this->ip = $ip;
      return $this;
   }

   function setDescription($description)
   {
      $this->description = $description;
      return $this;
   }

   function getVersion()
   {
      return $this->version;
   }

   function setVersion($version)
   {
      $this->version = $version;
      return $this;
   }

}
