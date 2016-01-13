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
class TestController extends AbstractController
{

   public function indexAction()
   {
      $auth = new Authorizer();
      $auth->retrieveUserInfo();
      exit();
   }

}
