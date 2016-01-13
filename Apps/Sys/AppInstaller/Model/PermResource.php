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
class PermResource extends BaseModel
{
   private $id;
   private $pid;
   private $moduleKey;
   private $appKey;
   private $hasDetail;
   private $detailSetter;
   private $detailSaver;
   private $text;
   private $internalKey;
   private $context;
   private $authCode;

   public function getSource()
   {
      return 'app_sys_appinstaller_perm_resources';
   }

   public function getId()
   {
      return (int)$this->id;
   }

   public function getPid()
   {
      return (int)$this->pid;
   }

   public function getModuleKey()
   {
      return $this->moduleKey;
   }

   public function getAppKey()
   {
      return $this->appKey;
   }

   public function getHasDetail()
   {
      return (boolean)$this->hasDetail;
   }

   public function getDetailSetter()
   {
      return $this->detailSetter;
   }

   public function getDetailSaver()
   {
      return $this->detailSaver;
   }

   public function getText()
   {
      return $this->text;
   }

   public function getInternalKey()
   {
      return $this->internalKey;
   }

   public function getContext()
   {
      return $this->context;
   }

   public function getAuthCode()
   {
      return $this->authCode;
   }

   public function setId($id)
   {
      $this->id = (int)$id;
      return $this;
   }

   public function setPid($pid)
   {
      $this->pid = (int)$pid;
      return $this;
   }

   public function setModuleKey($moduleKey)
   {
      $this->moduleKey = $moduleKey;
      return $this;
   }

   public function setAppKey($appKey)
   {
      $this->appKey = $appKey;
      return $this;
   }

   public function setHasDetail($hasDetail)
   {
      $this->hasDetail = (int)$hasDetail;
      return $this;
   }

   public function setDetailSetter($detailSetter)
   {
      $this->detailSetter = $detailSetter;
      return $this;
   }

   public function setDetailSaver($detailSaver)
   {
      $this->detailSaver = $detailSaver;
      return $this;
   }

   public function setText($text)
   {
      $this->text = $text;
      return $this;
   }

   public function setInternalKey($internalKey)
   {
      $this->internalKey = $internalKey;
      return $this;
   }

   public function setContext($context)
   {
      $this->context = $context;
      return $this;
   }

   public function setAuthCode($authCode)
   {
      $this->authCode = $authCode;
      return $this;
   }

}