<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\InitFlow\Listeners;
use Phalcon\Events\Manager as EventsManager;
use Cntysoft\Framework\Core\FileRef\Manager as FileRefManager;
use Cntysoft\Phalcon\Mvc\Listeners\ServiceListener as BaseListener;
use Cntysoft\Framework\Cloud\Ali\OpenSearch\ApiCaller as AliOpenSearchApiCaller;
use Cntysoft\Framework\Cloud\Ali\Ots\Client as OtsClient;
use Cntysoft\Framework\Cloud\Ali\Oss\OssClient;
use Cntysoft\Kernel\ConfigProxy;
/**
 * 系统一些小东西初始化监听类
 */
class ServiceListener extends BaseListener
{
   /**
    * @param \Phalcon\DI $di
    */
   protected function setupFileRefManager($di)
   {
      $di->setShared('FileRefManager', function() {
         $listener = new FileRefManagerListener();
         $events = new EventsManager();
         $listener->attach($events);
         $manager = new FileRefManager();
         $manager->setEventsManager($events);
         return $manager;
      });
   }

   protected function setupAliOpenSearchCaller($di)
   {
      $di->setShared('OpenSearchApiCaller', function() {
         $conf = ConfigProxy::getFrameworkConfig('Cloud');
         return new AliOpenSearchApiCaller($conf->ali->accessKey, $conf->ali->accessKeySecret, $conf->ali->opensearch->toArray());
      });
   }
   
   protected function setupOtsClient($di)
   {
      $di->setShared('OtsClient', function() {
         $conf = ConfigProxy::getFrameworkConfig('Cloud');
         return new OtsClient(\Cntysoft\RT_OTS_API_ENTRY, \Cntysoft\CLOUD_CONTROLLER_OTS_INSTANCE_NAME, $conf->ali->accessKey, $conf->ali->accessKeySecret);
      });
   }
   
   protected function setupOssClient($di)
   {
      $di->setShared('OssClient', function() {
         $conf = ConfigProxy::getFrameworkConfig('Cloud');
         return new OssClient(\Cntysoft\RT_OSS_API_ENTRY, $conf->ali->accessKey, $conf->ali->accessKeySecret);
      });
   }
   
   
   protected function getServiceNames()
   {
      $ret = parent::getServiceNames();
      $ret = array_merge($ret, array(
         'FileRefManager',
         'AliOpenSearchCaller',
         'OtsClient',
         'OssClient'
      ));
      return $ret;
   }

}