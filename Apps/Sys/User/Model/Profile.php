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
class Profile extends BaseModel
{
   private $id;
   private $wallPaper;
   private $fileRefs;
   private $imgRefMap;
   private $appVdOrder;

   public function getSource()
   {
      return 'app_sys_user_profile';
   }


   /**
    * @return mixed
    */
   public function getAppVdOrder()
   {
      return unserialize($this->appVdOrder);
   }

   /**
    * @param mixed $appVdOrder
    */
   public function setAppVdOrder($appVdOrder)
   {
      $this->appVdOrder = serialize($appVdOrder);
   }

   /**
    * @return mixed
    */
   public function getId()
   {
      return $this->id;
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
   public function getWallPaper()
   {
      return $this->wallPaper;
   }

   /**
    * @param mixed $wallPaper
    */
   public function setWallPaper($wallPaper)
   {
      $this->wallPaper = $wallPaper;
   }

   /**
    * @return mixed
    */
   public function getFileRefs()
   {
      return $this->fileRefs;
   }

   /**
    * @param mixed $fileRefs
    */
   public function setFileRefs($fileRefs)
   {
      $this->fileRefs = $fileRefs;
   }

   /**
    * @return mixed
    */
   public function getImgRefMap()
   {
      return unserialize($this->imgRefMap);
   }

   /**
    * @param mixed $imgRefMap
    */
   public function setImgRefMap($imgRefMap)
   {
      $this->imgRefMap = serialize($imgRefMap);
   }


}