<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\InitFlow\Listeners;
use CloudController\Framework\Qs\TagResolver;
use CloudController\Framework\Qs\AssetResolver;
use CloudController\Kernel\StdDir;
use Cntysoft\Phalcon\Mvc\Listeners\ViewListener as BaseListener;
use CloudController\Framework\Qs\View;
use Cntysoft\Kernel\ConfigProxy;

class ViewListener extends BaseListener
{
   /**
    * 主要是设置模板引擎
    *
    * @param \Phalcon\Events\Event $event
    * @param \Cntysoft\Phalcon\Mvc\Application $application
    */
   public function boot($event, $application)
   {
      $di = $application->getDI();
      View::setAssetResolver(new AssetResolver());
      View::setTagResolver(new TagResolver());

      $view = new View();
      $qsCfg = ConfigProxy::getFrameworkConfig('Qs');
      //初始化默认的模板映射
      if(isset($qsCfg->tplMap)){
         View::setTplMap($qsCfg->tplMap->toArray());
      }
      $view->setDI($di);
      //设置模板引擎的根目录
      $view->setTplRootDir(StdDir::getTemplatesDir());
      $di->setShared('view', $view);
   }
}