<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
use Cntysoft\Phalcon\Mvc\AbstractController;
use Cntysoft\Framework\Utils\CheckCode;

/**
 * 一些功能
 */
class IndexController extends AbstractController
{
   /**
    * 站点验证码生成
    */
   public function siteManagerChkCodeAction()
   {
      $drawer = new CheckCode(\Cntysoft\SITEMANAGER_S_KEY_CHK_CODE, 12, 4);
      $drawer->draw();
      exit;
   }
}