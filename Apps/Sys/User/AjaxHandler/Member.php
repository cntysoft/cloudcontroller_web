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
use Cntysoft\Kernel;
use App\Sys\User\Constant;
use App\Sys\User\RoleMgr;
use CloudController\Mixin\EnsurePermAbout;
class Member extends AbstractHandler
{
   use EnsurePermAbout;
   /**
    * 获取指定id的管理员信息
    *
    * @param array $params
    */
   public function getUserBasicInfo(array $params)
   {
      $this->checkRequireFields($params, array('id'));
      $adminUser = $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_MEMBER,
         'getUser',
         array(
            $params['id']
         )
      );
      $roleEntities = $adminUser->getRoles();
      $roles = array();
      $isSuperUser = false;
      if (!empty($roleEntities)) {
         foreach ($roleEntities as $entity) {
            $id = $entity->getId();
            if (RoleMgr::SUPER_MANAGER_ROLE_ID == $id) {
               $isSuperUser = true;
            }
            $roles[] = array(
               'id'   => $id,
               'name' => $entity->getName()
            );
         }
      }
      $ret = $adminUser->toArray(true);
      $ret['roles'] = $roles;
      $ret['isSuperUser'] = $isSuperUser;
      foreach ($ret as $key => $value) {
         if ($value instanceof \DateTime) {
            $ret[$key] = Kernel\get_date_string($value);
         }
      }
      return $ret;
   }
   /**
    * @param array $params
    */
   public function getUserList(array $params)
   {
      $this->checkRequireFields($params, array('queryCond'));
      $cond = (array)$params['queryCond'];
      $orderBy = $limit = $offset = null;
      $this->getPageParams($orderBy, $limit, $offset, $params);
      $cond = $this->getMemberQueryCond($cond);
      $list = $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_MEMBER,
         'getUserListBy',
         array(
            $cond, true, $orderBy, $offset, $limit
         )
      );
      $total = $list[1];
      $list = $list[0];
      $ret = array();
      if(count($list) > 0){
         $this->formatUserInfo($list, $ret);
      }
      return array(
         'total' => $total,
         'items' => $ret
      );
   }

   /**
    * @param array $params
    */
   public function addSysUser(array $params)
   {
      //这个地方有个注意的地方，只有超级管理员才能添加超级管理员
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_MEMBER,
         'addSysUser',
         array(
            $params
         )
      );
   }

   /**
    * @param array $params
    */
   public function updateSysUser(array $params)
   {
      //更新系统用户的信息
      $this->checkRequireFields($params, array(
         'id',
         'data'
      ));
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_MEMBER,
         'updateUser',
         array(
            (int)$params['id'],
            $params['data']
         )
      );
   }

   /**
    * 删除一个指定的管理员
    * 删除一个指定ID的管理员， 这个操作只能是超级管理员才能进行
    *
    * @param array $params
    */
   public function deleteUser(array $params)
   {
      $this->checkRequireFields($params, array('id'));
      //检查是否为自己
      //自己不能删除自己
      $curUserId = $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_ACL,
         'getCurSysUserId'
      );
      $id = (int)$params['id'];
      if($id == $curUserId){
         $errorType = ErrorType::getInstance();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_CANOT_DELETE_SELF'),
            $errorType->code('E_CANOT_DELETE_SELF')), $this->getErrorTypeContext());
      }
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_MEMBER,
         'deleteUser',
         array(
            $id
         )
      );
   }

   /**
    * 修改管理员的状态， 锁定状态和正常状态
    *
    * @param array $params
    */
   public function changeSysUserStatus(array $params)
   {
      $this->ensureSuperUser();
      $this->checkRequireFields($params, array('id', 'status'));
      $id = $params['id'];
      $status = $params['status'];
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_MEMBER,
         'changUserStatus',
         array(
            $id, $status
         )
      );
   }

   public function getSysUsersByRole(array $params)
   {
      $this->checkRequireFields($params, array('roleId'));
      $users = $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_MEMBER,
         'getSysUsersByRole',
         array(
            $params['roleId']
         )
      );
      $ret = array();
      foreach($users as $user){
         $ret[] = $user->toArray(true);
      }
      return array(
         'items' => $ret,
         'total' => count($ret)
      );
   }

   public function getSysUsersNotBelongToRole(array $params)
   {
      $this->checkRequireFields($params, array('roleId'));
      $users = $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_MEMBER,
         'getSysUsersNotBelongToRole',
         array(
            $params['roleId']
         )
      );
      return array(
         'items' => $users,
         'total' => count($users)
      );
   }

   /**
    * @return array
    */
   protected function formatUserInfo($list, array &$ret)
   {
      foreach ($list as $item) {
         $roles = array();
         $roleEntities = $item->getRoles();
         if (!empty($roleEntities)) {
            foreach ($roleEntities as $entity) {
               $roles[] = $entity->getName();
            }
         }
         $ret[] = array(
            'id'                => $item->getId(),
            'name'              => $item->getName(),
            'enableMultiLogin'  => $item->getEnableMultiLogin(),
            'loginTimes'        => $item->getLoginTimes(),
            'lastLoginIp'       => $item->getLastLoginIp(),
            'lastLoginTime'     => $item->getLastLoginTime(),
            'lastModifyPwdTime' => $item->getLastModifyPwdTime(),
            'isLock'            => $item->getIsLock(),
            'enableModifyPwd'   => $item->getEnableModifyPwd(),
            'loginErrorTimes'   => $item->getLoginErrorTimes(),
            'role'              => $roles
         );
      }
   }

   /**
    * 判断指定的名称
    *
    * @param array $params
    * @return array
    */
   public function sysUserExist(array $params)
   {
      $this->checkRequireFields($params, array(
         'name'
      ));
      return array(
         'exist' => $this->getAppCaller()->call(
            Constant::MODULE_NAME,
            Constant::APP_NAME,
            Constant::APP_API_MEMBER,
            'sysUserExist',
            array(
               $params['name']
            )
         )
      );
   }

   /**
    * @param array $cond
    * @return string
    */
   protected function getMemberQueryCond(array $cond)
   {
      $query = '';
      foreach ($cond as $key => $value) {
         if ('' == $query) {
            $query .= "$key = $value";
         } else {
            $query .= "AND $key =$value";
         }
      }
      return $query;
   }
}