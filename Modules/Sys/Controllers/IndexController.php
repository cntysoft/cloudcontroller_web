<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
use Cntysoft\Phalcon\Mvc\AbstractController;
use Cntysoft\Kernel;
use Cntysoft\Framework\Qs\View;
/**
 * 主要提供登陆控制器
 */
class IndexController extends AbstractController
{

   public function indexAction()
   {
      return $this->setupRenderOpt(array(
         View::KEY_TPL_VAR => array(
            'Lang'                   => 'zh_CN', //系统语言
         ),
         View::KEY_RESOLVE_TYPE   => View::TPL_RESOLVE_DIRECT,
         View::KEY_RESOLVE_DATA => CNTY_ROOT_DIR.DS.'PlatformJs/build/production/CloudController/index.html'
      ));
   }

   public function develAction()
   {
      return $this->setupRenderOpt(array(
         View::KEY_TPL_VAR => array(
            'Lang'                   => 'zh_CN', //系统语言
         ),
         View::KEY_RESOLVE_TYPE   => View::TPL_RESOLVE_DIRECT,
         View::KEY_RESOLVE_DATA => CNTY_ROOT_DIR.DS.'PlatformJs'.DS.'CloudController'.DS.'index.html'
      ));
   }
}