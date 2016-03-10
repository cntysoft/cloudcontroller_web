<?php
   
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\KeleCloud;
use Cntysoft\Kernel\App\AbstractLib;
use Cntysoft\Kernel;
use App\Sys\KeleCloud\Model\InstanceInfoModel;
use App\Sys\Setting\Constant as SETTING_CONST;
/**
 * 服务器信息相关接口
 */
class InstanceMgr extends AbstractLib
{
   public function getInstanceInfo($id)
   {
      return InstanceInfoModel::findFirst($id);
   }
   
   public function getInstanceList($ip = null, $total = false, $orderBy = null, $offset = 0, $limit = 15)
   {
      $items = InstanceInfoModel::find(array(
            'order' => $orderBy,
            'limit' => array(
               'number' => $limit,
               'offset' => $offset
            )
      ));
      if ($total) {
         return array($items, (int) InstanceInfoModel::count());
      }
      return $items;
   }
   
   public function getMetaInfo()
   {
      $data = $this->getAppCaller()->call(SETTING_CONST::MODULE_NAME, SETTING_CONST::APP_NAME, 
              SETTING_CONST::APP_API_CFG, "getItemsByGroup", array(Constant::SYS_CFG_GROUP));
      $ret= [];
      foreach ($data as $item){
         $ret[$item->getKey()] = $item->getValue();
      }
      return $ret;
   }
   
   public function setMetaInfo(array $cfg)
   {
      $cfgSetter = $this->getAppCaller()->getAppObject(SETTING_CONST::MODULE_NAME, SETTING_CONST::APP_NAME, SETTING_CONST::APP_API_CFG);
      foreach ($cfg as $key => $value){
         $cfgSetter->setItem(Constant::SYS_CFG_GROUP, $key, $value);
      }
   }
  
}