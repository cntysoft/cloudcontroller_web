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

class VersionInfoModel extends BaseModel
{

   private $id;
   private $fromVersion;
   private $toVersion;
   private $description;
   private $releaseTime;

   public function getSource()
   {
      return "app_sys_kelecloud_upgrade_choices";
   }
   function getId()
   {
      return (int)$this->id;
   }

   function getFromVersion()
   {
      return $this->fromVersion;
   }

   function getToVersion()
   {
      return $this->toVersion;
   }

   function getDescription()
   {
      return $this->description;
   }

   function getReleaseTime()
   {
      return (int)$this->releaseTime;
   }

   function setId($id)
   {
      $this->id = (int)$id;
      return $this;
   }

   function setFromVersion($fromVersion)
   {
      $this->fromVersion = $fromVersion;
      return $this;
   }

   function setToVersion($toVersion)
   {
      $this->toVersion = $toVersion;
      return $this;
   }

   function setDescription($description)
   {
      $this->description = $description;
      return $this;
   }

   function setReleaseTime($releaseTime)
   {
      $this->releaseTime = (int)$releaseTime;
      return $this;
   }


}
