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
}