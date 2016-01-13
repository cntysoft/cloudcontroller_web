<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\User\AjaxHandler;
use Cntysoft\Kernel\App\AbstractHandler;
use App\Sys\User\Constant as SYS_CONST;
use Cntysoft\Kernel;

class Info extends AbstractHandler
{
   /**
    * 暂时不进行分页
    */
   public function getSysList()
   {
      $items = $this->getAppCaller()->call(
         SYS_CONST::APP_MODULE,
         SYS_CONST::APP_NAME,
         SYS_CONST::APP_API_INFO,
         'getUserList',
         array()
      );
      $ret = array();
      if(0 == count($items)){
         return $this->getExtJsGridDataSet($ret);
      }
      foreach($items as $item){
         $ret[] = $item->toArray(true);
      }

      return $this->getExtJsGridDataSet($ret);
   }

   public function isUserExist(array $params)
   {
      $this->checkRequireFields($params, array(
         'name'
      ));
      $ret = $this->getAppCaller()->call(
         SYS_CONST::APP_MODULE,
         SYS_CONST::APP_NAME,
         SYS_CONST::APP_API_INFO,
         'UserExist',
         array(
            $params['name']
         )
      );
      return array(
         'exist' => $ret
      );
   }

   public function addUser(array $params)
   {
      $this->checkRequireFields($params, array('name', 'password'));
      $this->getAppCaller()->call(
         SYS_CONST::APP_MODULE,
         SYS_CONST::APP_NAME,
         SYS_CONST::APP_API_INFO,
         'addUser',
         array(
            $params
         )
      );
   }

   public function getUserBasicInfo(array $params)
   {
      $this->checkRequireFields($params, array('id'));
      $ret = $this->getAppCaller()->call(
         SYS_CONST::APP_MODULE,
         SYS_CONST::APP_NAME,
         SYS_CONST::APP_API_INFO,
         'getUserBasicInfo',
         array(
            (int)$params['id']
         )
      );
      return $ret->toArray(true, array('password'));
   }

   public function deleteMember(array $params)
   {
      $this->checkRequireFields($params, array('uid'));
      return $this->getAppCaller()->call(SYS_CONST::APP_MODULE, SYS_CONST::APP_NAME, SYS_CONST::APP_API_INFO, 'deleteUser', array((int)$params['uid']));
   }

   public function updateUser($params)
   {
      $this->checkRequireFields($params, array('id'));
      $id = $params['id'];
      unset($params['id']);
      if(isset($params['password'])) {
         $pwdHasher =  Kernel\get_global_di()->getShared('security');
         $params['password'] = $pwdHasher->hash($params['password']);
      }
      return $this->getAppCaller()->call(SYS_CONST::APP_MODULE, SYS_CONST::APP_NAME, SYS_CONST::APP_API_INFO, 'updateUser', array((int)$id, $params));
   }
   
   public function changeUserPassword(array $params)
   {
       $this->checkRequireFields($params, array('password'));
        if(isset($params['password'])) {
           $pwdHasher =  Kernel\get_global_di()->getShared('security');
           $params['password'] = $pwdHasher->hash($params['password']);
        }
        $currentUser = $this->appCaller->call(SYS_CONST::APP_MODULE, SYS_CONST::APP_NAME, SYS_CONST::APP_API_ACL, 'getCurUser', array());
        $id = $currentUser->getId();
        
        return $this->appCaller->call(SYS_CONST::APP_MODULE, SYS_CONST::APP_NAME, SYS_CONST::APP_API_INFO, 'updateUser', array((int)$id, $params));
   }
}