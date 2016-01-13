<?php
/**
 * Cntysoft Cloud Software Team
 */
namespace App\Sys\AppInstaller;
use Cntysoft\Kernel\App\AbstractLib;
use App\Sys\AppInstaller\Model\AppModule as AppModuleModel;

/**
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
class ModuleMgr extends AbstractLib
{
   /**
    * @return \Phalcon\Mvc\Model\Resultset\Simple
    */
   public function getModuleList()
   {
      return AppModuleModel::find();
   }

   /**
    * 获取模块的名称
    *
    * @param string $key
    * @return \App\Sys\AppInstaller\Model\AppModule
    */
   public function getModule($key)
   {
      return AppModuleModel::findFirst(array(
         '[key] = ?0',
         'bind' => array(
            0 => $key
         )
      ));
   }

   /**
    * 判断一个模型是否存在
    *
    * @param string $key
    * @return  \App\Sys\AppInstaller\Model\AppModule
    */
   public function hasModule($key)
   {
      return AppModuleModel::count(array(
         '[key] = ?0',
         'bind' => array(
            0 => $key
         )
      ));
   }
}