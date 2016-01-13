<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace Utils;
use Phalcon\Mvc\ModuleDefinitionInterface;
use Cntysoft\Kernel;
/**
 * 前端模块初始化代码
 */
class Module implements ModuleDefinitionInterface
{
   /**
    * Registers an autoloader related to the module
    *
    * @param \Phalcon\DiInterface $dependencyInjector
    */
   public function registerAutoloaders(\Phalcon\DiInterface $dependencyInjector = null)
   {
      $di = Kernel\get_global_di();
      $loader = $di->getShared('loader');
      $loader->registerDirs(array(
         __DIR__.DS.'Controllers'
      ))->register();
   }

   /**
    * Registers services related to the module
    *
    * @param \Phalcon\DiInterface $dependencyInjector
    */
   public function registerServices(\Phalcon\DiInterface $dependencyInjector)
   {

   }
}