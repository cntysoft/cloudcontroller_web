<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\Framework\Core;
use Cntysoft\Kernel;
use CloudController\StdModel\KvDict as KvDictModel;
/**
 * 系统一个键值数据字典
 */
class KvDict
{
   
   /**
    * 增加一个新的映射
    *
    * @param int $siteId 站点的ID
    * @param string $key 编程使用的识别KEY
    * @param string $name 一个描述性的名称
    * @param array $items
    * @return \CloudController\Framework\Core\KvDict
    */
   public function addMap($siteId, $key, $name, array $items = array())
   {
      $siteId = (int) $siteId;
      if(KvDictModel::findFirst(array(
         'siteId = ?0 AND [key] = ?1',
         'bind' => array(
            0 => $siteId,
            1 => $key
         )
      ))){
         $errorType = ErrorType::getInstance();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_KV_KEY_EXIST', $key), $errorType->code('E_KV_KEY_EXIST')), $errorType
         );
      }
      $mode = new KvDictModel();
      $mode->assignBySetter(array(
         'siteId' => $siteId,
         'key' => $name,
         'items' => $items
      ));
      $mode->create();
   }
      
   /**
    * 修改映射的名字
    *
    * @param int $siteId
    * @param string $key
    * @param string $name
    */
   public function changeMapName($siteId, $key, $name)
   {
      $siteId = (int) $siteId;
      $model = KvDictModel::findFirst(array(
         'siteId = ?0 AND [key] = ?1',
         'bind' => array(
            0 => $siteId,
            1 => $key
         )
      ));
      if (!$model) {
         $errorType = ErrorType::getInstance();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_KV_KEY_NOT_EXIST', $key), $errorType->code('E_KV_KEY_NOT_EXIST')
         ), $errorType);
      }
      $model->setName($name);
      $model->update();
   }
      
   /**
    * 删除一个映射项
    *
    * @param int $siteId
    * @param string $key 映射识别KEY
    * @return \CloudController\Framework\Core\KvDict
    */
   public function removeMap($siteId, $key)
   {
      $model = KvDictModel::findFirst(array(
         'key = ?0',
         'bind' => array(
            0 => $key
         )
      ));
      if ($model) {
         $model->delete();
      }
      return $this;
   }
      
   /**
    * 获取映射数据项
    *
    * @param int $siteId
    * @param string $key
    * @return array
    */
   public function getMapItems($siteId, $key)
   {
      $siteId = (int)$siteId;
      $model = KvDictModel::findFirst(array(
         'siteId = ?0 AND [key] = ?1',
         'bind' => array(
            0 => $siteId,
            1 => $key
         )
      ));
      if (!$model) {
         $errorType = ErrorType::getInstance();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_KV_KEY_NOT_EXIST', $key), $errorType->code('E_KV_KEY_NOT_EXIST')
         ),$errorType);
      }
      $items = $model->getItems();
      if (!is_array($items)) {
         return array();
      }
      return $items;
   }
      
   /**
    * 获取指定映射
    *
    * @param string $key
    * @return \CloudController\StdModel\KvDict
    */
   public function getMap($siteId, $key)
   {
      $siteId = (int) $siteId;
      $model = KvDictModel::findFirst(array(
         'siteId = ?0 AND [key] = ?1',
         'bind' => array(
            0 => $siteId,
            1 => $key
         )
      ));
      if (!$model) {
         $errorType = ErrorType::getInstance();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_KV_KEY_NOT_EXIST', $key), $errorType->code('E_KV_KEY_NOT_EXIST'), $errorType
         ));
      }
      return $model;
   }
      
   /**
    * @param string $key 映射识别KEY
    * @param array $items 数据项
    * @return \CloudController\Framework\Core\KvDict
    */
   public function alterMapItems($siteId, $key, array $items)
   {
      $siteId = (int) $siteId;
      $model = KvDictModel::findFirst(array(
         'siteId = ?0 AND [key] = ?1',
         'bind' => array(
            0 => $siteId,
            1 => $key
         )
      ));
      if (!$model) {
         $errorType = ErrorType::getInstance();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_KV_KEY_NOT_EXIST', $key), $errorType->code('E_KV_KEY_NOT_EXIST')
         ), $errorType);
      }
      $model->setItems($items);
      $model->update();
      return $this;
   }
      
   /**
    * @param int $siteId
    * @return array
    */
   public function toArray($siteId)
   {
      $items = $this->getAll($siteId);
      $ret = array();
      foreach ($items as $item) {
         $ret[] = array(
            'key'   => $item->getKey(),
            'name' => $item->getName(),
            'items' => $item->getItems()
         );
      }
      return $ret;
   }
   /**
    * 获取所有的值
    *
    * @param int $siteId
    */
   public function getAll($siteId)
   {
      return KvDictModel::find(array(
         'siteId = ?0',
         'bind' => array(
            0 => (int) $siteId
         )
      ));
   }
   /**
    * 获取所有的键
    *
    * @param int $siteId
    * @return array
    */
   public function getAllKeys($siteId)
   {
      $items = KvDictModel::find(array(
         'siteId = ?0',
         'bind' => array(
            0 => (int)$siteId
         )
      ));
      $ret = array();
      foreach ($items as $item) {
         $ret[] = $item->getKey();
      }
      return $ret;
   }
}