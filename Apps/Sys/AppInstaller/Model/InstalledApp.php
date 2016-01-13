<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\AppInstaller\Model;
use Cntysoft\Phalcon\Mvc\Model as BaseModel;
class InstalledApp extends BaseModel
{
   private $id;
   private $name;
   private $moduleKey;
   private $appKey;
   private $type;
   private $runConfig;
   private $showOnDesktop;
   private $installTime;

   /**
    * @return string
    */
   public function getSource()
   {
      return 'app_sys_appinstaller_installed_apps';
   }

   /**
    * @return mixed
    */
   public function getAppKey()
   {
      return $this->appKey;
   }

   /**
    * @param mixed $appKey
    */
   public function setAppKey($appKey)
   {
      $this->appKey = $appKey;
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
   public function getInstallTime()
   {
      return (int)$this->installTime;
   }

   /**
    * @param mixed $installTime
    */
   public function setInstallTime($installTime)
   {
      $this->installTime = (int)$installTime;
      return $this;
   }

   /**
    * @return mixed
    */
   public function getModuleKey()
   {
      return $this->moduleKey;
   }

   /**
    * @param mixed $moduleKey
    */
   public function setModuleKey($moduleKey)
   {
      $this->moduleKey = $moduleKey;
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
   public function getRunConfig()
   {
      return unserialize($this->runConfig);
   }

   /**
    * @param mixed $runConfig
    */
   public function setRunConfig($runConfig)
   {
      $this->runConfig = serialize($runConfig);
      return $this;
   }

   /**
    * @return mixed
    */
   public function getShowOnDesktop()
   {
      return (boolean)$this->showOnDesktop;
   }

   /**
    * @param mixed $showOnDesktop
    */
   public function setShowOnDesktop($showOnDesktop)
   {
      $this->showOnDesktop = (int)$showOnDesktop;
      return $this;
   }
   /**
    * @return mixed
    */
   public function getType()
   {
      return (int)$this->type;
   }

   /**
    * @param mixed $type
    */
   public function setType($type)
   {
      $this->type = (int)$type;
      return $this;
   }



}