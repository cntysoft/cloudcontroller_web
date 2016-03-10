<?php

/*
 * Cntysoft Cloud Software Team
 * 
 * @author Shuai <ln6265431@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license   http://www.cntysoft.com/license/new-bsd     New BSD License
 */

use Cntysoft\Phalcon\Mvc\AbstractController;
use App\Sys\User\AjaxHandler\Authorizer;
use App\Sys\AppInstaller\PermResMounter;
use App\Sys\KeleCloud\AjaxHandler\ServerInfo;
use App\Sys\KeleCloud\AjaxHandler\InstanceMgr;

class TestController extends AbstractController
{

   public function indexAction()
   {
      $instanceMgr = new InstanceMgr();
      $instanceMgr->setMetaInfo(array(
          "currentVersion" => "123123asdjfgasd"
      ));
      exit();
      $serverMgr = new ServerInfo();
      $serverMgr->getServerListForTree();
      exit();
      $mounter = new PermResMounter();
      $mounter->mountPermRes("Sys", "KeleCloud");
      exit();
      $auth = new Authorizer();
      $auth->login(json_decode('{"username":"admin","password":"344bba4200ad08694896aafa0b7507101798ac975744914bcc40856e87c3626d","chkcode":"3ftd"}', true));
      exit();
   }

}
