<?php
/**
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
chdir(__DIR__);
// 定义一些系统范围里面的常量
define('DS', DIRECTORY_SEPARATOR);
define('CNTY_ROOT_DIR', getcwd());
define('CNTY_CFG_DIR', CNTY_ROOT_DIR . DS . 'Config');
define('CNTY_LIB_DIR', CNTY_ROOT_DIR . DS . 'Library');
define('CNTY_SYS_LIB_DIR', CNTY_LIB_DIR . DS . 'Cntysoft');
define('CLOUDCONTROLLER_SYS_LIB_DIR', CNTY_LIB_DIR . DS . 'CloudController');
define('CNTY_VENDER_DIR', CNTY_LIB_DIR . DS . 'Vender');
define('CNTY_APP_ROOT_DIR', CNTY_ROOT_DIR . DS . 'Apps');
define('CNTY_MODULE_DIR', CNTY_ROOT_DIR . DS . 'Modules');
// 系统运行模式常量
define('SYS_RUNTIME_MODE_PRODUCT', 0x01);
define('SYS_RUNTIME_MODE_DEBUG', 0x02);
//{SYS_DEPLOY_MODE};
// 注册系统相应名称空间
$loader = new \Phalcon\Loader();
$loader->registerNamespaces(array(
   'Cntysoft' => CNTY_SYS_LIB_DIR,
   'CloudController' => CNTY_LIB_DIR . DS . 'CloudController',
   'App' => CNTY_APP_ROOT_DIR,
   'Zend' => CNTY_LIB_DIR . DS . 'Zend',
   'SysApiHandler' => CNTY_ROOT_DIR . DS . 'SysApiHandler',
   'UpgradeEnv' => CNTY_ROOT_DIR . DS . 'UpgradeEnv'
))->register();

$di = new \Phalcon\DI\FactoryDefault();
$di->setShared('loader', function () use($loader) {
   return $loader;
});
try {
   //在这里dispatcher没错，可能之后的步骤错了，总的在这里进行捕捉
   $app = new \CloudController\Phalcon\Mvc\Application($di);
   echo $app->handle()->getContent();
} catch (\Exception $ex) {
   if (SYS_RUNTIME_MODE == SYS_RUNTIME_MODE_DEBUG) {
      throw $ex;
   } else {
      \Cntysoft\Kernel\goto_route('404.html');
   }
}