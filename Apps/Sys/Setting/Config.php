<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\Setting;
use Cntysoft\Kernel\App\AbstractLib;
use Cntysoft\StdModel\Config as ConfigModel;
use Cntysoft\Kernel;
/**
 * 站点配置类
 */
class Config extends AbstractLib
{
   const STD_CFG_M_CLS = 'FengHuang\StdModel\Config';
   /**
    * 设置一个配置项，如果不存在全新添加
    *
    * @param string $group
    * @param string $key
    * @param string $value
    */
   public function setItem($group, $key, $value)
   {
      $item = ConfigModel::findFirst(array(
         '[group] = ?1 AND key = ?2',
         'bind' => array(
            0 => $group,
            1 => $key
         )
      ));
      if (!$item) {
         $item = new ConfigModel();
         $item->setGroup($group);
         $item->setKey($key);
         $item->setValue($value);
      } else {
         $item->setValue($value);
      }
      $item->save();
   }

   /**
    * 根据分组获取配置项
    *
    * @param int $siteId
    * @param string $group
    * @return \Phalcon\Mvc\Model\ResultSet
    *
    */
   public function getItemsByGroup($group)
   {
      return ConfigModel::find(array(
         '[group] = ?0',
         'bind' => array(
            0 => $group
         )
      ));
   }

   /**
    * 获取系统站点配置信息
    *
    * @param int $siteId
    * @return array
    */
   public function getSiteConfig()
   {
      $cacher = $this->getAppObject()->getCacheObject();
      $key = md5($this->getAppObject()->getAppKey().'.siteconfig');
      if(!$cacher->exists($key)){
         $items = $this->getItemsByGroup( 'Site');
         $map = array();
         foreach ($items as $item){
            $map[$item->getKey()] = $item->getValue();
         }
         $cacher->save($key, $map);
         return $map;
      }
      return $cacher->get($key);
   }

   /**
    * @param string $key
    * @return \FengHuang\StdModel\Config
    */
   public function getItemByKey($key)
   {
      return ConfigModel::find(array(
         'siteId = ?0 AND key = ?1',
         'bind' => array(
            0 => $key
         )
      ));
   }

   /**
    * 根据分组进行配置项删除
    *
    * @param string $group
    */
   public function deleteByGroup($group)
   {
      $mm = Kernel\get_models_manager();
      $query = sprintf('DELETE FROM %s WHERE  group = ?0', self::STD_CFG_M_CLS);
      $mm->executeQuery($query, array(
         0 => $group
      ));
   }

   /**
    * 根据配置识别KEY删除配置项
    *
    * @param int $siteId
    * @param string $key
    */
   public function deleteByKey($siteId, $key)
   {
      $mm = Kernel\get_models_manager();
      $query = sprintf('DELETE FROM %s WHERE key = ?0', self::STD_CFG_M_CLS);
      $mm->executeQuery($query, array(
         0 => $key
      ));
   }

   /**
    * 重置站点配置，这个函数会删除原有的教堂数据
    *
    * @param int $siteId
    */
   public function generateDefaultSiteConfig($siteId)
   {
      $cfgs = include $this->getAppObject()->getDataDir().DS.'DefaultSiteConfig.php';
      $db = Kernel\get_db_adapter();
      try {
         $db->begin();
         foreach ($cfgs as $item) {
            $cItem = new ConfigModel();
            $cItem->setGroup($item['group']);
            $cItem->setKey($item['key']);
            $cItem->setValue($item['value']);
            $cItem->save();
         }
         $db->commit();
      } catch (\Exception $ex) {
         $db->rollback();
         Kernel\throw_exception($ex, $this->getErrorTypeContext());
      }
   }

}