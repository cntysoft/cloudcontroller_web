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
/**
 * 当前系统安装的APP模块的分类
 */
class AppModule extends BaseModel
{
   private $key;
   private $text;
   private $description;
   public function getSource()
   {
      return 'app_sys_appinstaller_app_module';
   }

   public function initialize()
   {
      $this->hasMany(
         'key',
         'App\Sys\AppInstaller\Model\InstalledApp',
         'moduleKey',
         array(
            'alias' => 'apps'
         )
      );
   }

   /**
    * @return mixed
    */
   public function getDescription()
   {
      return $this->description;
   }

   /**
    * @param mixed $description
    */
   public function setDescription($description)
   {
      $this->description = $description;
      return $this;
   }

   /**
    * @return mixed
    */
   public function getText()
   {
      return $this->text;
   }

   /**
    * @param mixed $text
    */
   public function setText($text)
   {
      $this->text = $text;
      return $this;
   }

   /**
    * @return mixed
    */
   public function getKey()
   {
      return $this->key;
   }

   /**
    * @param mixed $key
    */
   public function setKey($key)
   {
      $this->key = $key;
      return $this;
   }

}