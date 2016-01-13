<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\InitFlow\Listeners;
use Cntysoft\Kernel;
use Cntysoft\Phalcon\Mvc\Listeners\BootstrapListener as BaseBootstrapListener;

/**
 * 系统一些小东西初始化监听类
 */
class BootstrapListener extends BaseBootstrapListener
{
   /**
    * @param \Phalcon\Mvc\Router $router
    * @param \Phalcon\Config $config
    */
   protected function configRouter($router, $config)
   {
      $router->add('/'.$config->sysEntry, array(
         'module'     => 'Sys',
         'controller' => 'Index',
         'action'     => 'index'
      ));
      $router->add('/'.$config->sysEntry.'devel', array(
         'module'     => 'Sys',
         'controller' => 'Index',
         'action'     => 'devel'
      ));
      $router->setDefaultAction('index');
      $router->setDefaultController('Index');
      $router->setDefaultModule("Sys");
   }
}