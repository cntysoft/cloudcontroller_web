<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace SysApiHandler;
use Cntysoft\Kernel;
use Cntysoft\Framework\ApiServer\AbstractScript;
use Cntysoft\Framework\Core\KvDict as Dict;
/**
 * 键值数据读取接口
 */
class KvDict extends AbstractScript
{
   /**
    * <code>
    * array(
    *      'key' => '数据字典KEY'
    * );
    * </code>
    * @param array $params
    */
   public function getMapItems(array $params)
   {
      $this->checkRequireParams($params, array(
         'key'
      ));
      $dict = new Dict();
      try{
         return $dict->getMapItems($params['key']);
      }catch (\Exception $ex){
         return array();
      }
   }

   /**
    * 获取数据字典所有的键
    *
    * @return array
    */
   public function getKvKeys()
   {
      $dict = new Dict();
      return $dict->getAllKeys();
   }
}