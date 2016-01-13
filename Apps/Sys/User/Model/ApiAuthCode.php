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
class ApiAuthCode extends BaseModel
{
   private $id;
   private $targetType;
   private $targetId;
   private $key;
   private $type;
   private $codes;
   private $belong;
   public function getSource()
   {
      return 'sys_api_authorize_code';
   }
   public function getId()
   {
      return (int)$this->id;
   }

   /**
    * @return \Cntysoft\StdModel\ApiAuthCode
    */
   public function setId($id)
   {
      $this->id =  (int)$id;
      return $this;
   }

   public function getTargetType()
   {
      return (int)$this->targetType;
   }

   /**
    * @return \Cntysoft\StdModel\ApiAuthCode
    */
   public function setTargetType($targetType)
   {
      $this->targetType = (int)$targetType;
   }

   public function getTargetId()
   {
      return (int)$this->targetId;
   }

   /**
    * @return \Cntysoft\StdModel\ApiAuthCode
    */
   public function setTargetId($targetId)
   {
      $this->targetId = (int)$targetId;
      return $this;
   }

   public function getKey()
   {
      return $this->key;
   }

   /**
    * @return \Cntysoft\StdModel\ApiAuthCode
    */
   public function setKey($key)
   {
      $this->key = $key;
      return $this;
   }

   public function getType()
   {
      return $this->type;
   }

   /**
    * @return \Cntysoft\StdModel\ApiAuthCode
    */
   public function setType($type)
   {
      $this->type = $type;
      return $this;
   }

   /**
    * @return array
    */
   public function getCodes()
   {
      if ('' == $this->codes) {
         return array();
      }
      return explode(',', $this->codes);
   }

   /**
    * @return \Cntysoft\StdModel\ApiAuthCode
    */
   public function setCodes(array $codes)
   {
      $this->codes = implode(',', $codes);
      return $this;
   }

   public function getBelong()
   {
      return $this->belong;
   }

   /**
    * @return \Cntysoft\StdModel\ApiAuthCode
    */
   public function setBelong($belong)
   {
      $this->belong = $belong;
      return $this;
   }

}