<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\User;
use App\Sys\User\RoleMgr;
use Cntysoft\Kernel\App\AbstractLib;
use App\Sys\User\Model\BasicInfo as UserModel;
use Cntysoft\Kernel;
use App\Sys\User\Model\Profile as ProfileModel;
use App\Sys\User\Model\Role as RoleModel;
use App\Sys\User\Model\UserJoinRole;

/**
 * 站点管理员管理
 */
class Member extends AbstractLib
{
   /**
    * 根据查询条件获取查询结果
    *
    * @param string $cond 查询条件数组
    * @param boolean $total 是否返回总数
    * @param string $orderBy 排序条件
    * @param int $offset 漂移起始地址
    * @param int $limit 结果数量限制
    * @return \Phalcon\Mvc\Model\Resultset\Simple
    */
   public function getUserListBy($cond, $total = false, $orderBy = null, $offset = 0, $limit = \Cntysoft\STD_PAGE_SIZE)
   {
      $items = UserModel::find(array(
         $cond,
         'order' => $orderBy,
         'limit' =>array(
            'number' => $limit,
            'offset' => $offset
         )
      ));
      if ($total) {
         return array(
            $items,
            (int)UserModel::count($cond)
         );
      }
      return $items;
   }


   /**
    * @param array $data
    * @return \App\Sys\User\Model\BasicInfo
    */
   public function addSysUser(array $data)
   {
      unset($data['id']);
      $sysUser = new UserModel();
      $requires = $sysUser->getRequireFields(array('id', 'profileId'));
      $data += array(
         'loginTimes' => 0,
         'isLock' => false,
         'loginErrorTimes' => 0,
         'enableMultiLogin' => false,
         'enableModifyPwd' => true
      );
      Kernel\ensure_array_has_fields($data, $requires);
      if($this->sysUserExist($data['name'])){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_USER_NAME_EXIST', $data['name'])), $this->getErrorTypeContext());
      }
      //操作角色
      $this->processUserRoles($data);
      //处理管理员的角色
      $roleIds = $data['roles'];
      unset($data['roles']);
      $di = Kernel\get_global_di();
      $pwdHasher = $di->getShared('security');
      $data['password'] = $pwdHasher->hash($data['password']);
      $profile = new ProfileModel();
      $profile->assignBySetter(array(
         'wallPaper'   => Constant::P_DEFAULT_WALLPAPER,
         'appVdOrder'  => array()
      ), true);
      $db = Kernel\get_db_adapter();
      try {
         $db->begin();
         $profile->create();
         $sysUser->setProfileId($profile->getId());
         $sysUser->assignBySetter($data);
         $sysUser->create();
         
         //处理用户角色
         $uid = $sysUser->getId();
         foreach ($roleIds as $rid) {
             $join = new UserJoinRole();
             $join->setRoleId($rid);
             $join->setSysUserId($uid);
             $join->create();
         }
         $db->commit();
      } catch (\Exception $ex) {
         $db->rollback();
         Kernel\throw_exception($ex, $this->getErrorTypeContext());
      }
   }

   /**
    * 检查系统用户名称是否存在
    *
    * @param string $name
    * @return boolean
    */
   public function sysUserExist($name)
   {
      return !$this->getUserByName($name) ? false : true;
   }

   /**
    * 更新指定的站点管理员
    *
    * @param int $id
    * @param array $data
    */
   public function updateUser($id, array $data)
   {
      $id = (int) $id;
      unset($data['id']);
      $sysUser = $this->getUser($id);
      if(!$sysUser){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_USER_IS_NOT_EXIST', $id),
            $errorType->code('E_USER_IS_NOT_EXIST')
         ), $this->getErrorTypeContext());
      }
      $db = Kernel\get_db_adapter();
      try{
         $db->begin();
         $mm = Kernel\get_models_manager();
         if(isset($data['roles'])){
            //清除所有的角色连接
            $query = 'DELETE FROM App\Sys\User\Model\UserJoinRole WHERE sysUserId = ?0';
            $mm->executeQuery($query, array(
               0 => $sysUser->getId()
            ));
            $this->processUserRoles($data);
            //处理管理员的角色
            $roleIds = $data['roles'];
            unset($data['roles']);
            //处理用户角色
            foreach ($roleIds as $rid) {
                $join = new UserJoinRole();
                $join->setRoleId($rid);
                $join->setSysUserId($id);
                $join->create();
            }
            }
         if (isset($data['password'])) {
            $di = Kernel\get_global_di();
            $pwdHasher = $di->getShared('security');
            $data['password'] = $pwdHasher->hash($data['password']);
            //记录更改时间
            $data['lastModifyPwdTime'] = time();
         }
         $sysUser->assignBySetter($data);
         $sysUser->save();
         $db->commit();
      }catch(\Exception $ex){
         $db->rollback();
         Kernel\throw_exception($ex, $this->getErrorTypeContext());
      }
   }

   /**
    * 删除一个指定的系统用户
    *
    * @param int $uid
    */
   public function deleteUser($uid)
   {
      $user = $this->getUser($uid);
      if(!$user){
         return;
      }
      //如果删除的是超级管理员，则要判断，不能把超级管理员全部删除了
      $roles = $user->getRoles();
      $isSuperUser = false;
      foreach ($roles as $role) {
         if ($role->getId() == RoleMgr::SUPER_MANAGER_ROLE_ID) {
            $isSuperUser = true;
            break;
         }
      }
      if ($isSuperUser && 1 == count($role->getSysUsers())) {
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_MUST_HAVE_ONE_SUPER_USER'), $errorType->code('E_MUST_HAVE_ONE_SUPER_USER')), $errorType);
      }
      $db = Kernel\get_db_adapter();
      try{
         $db->begin();
         //删除角色数据
         $mm = Kernel\get_models_manager();
         $query = 'DELETE FROM App\Sys\User\Model\UserJoinRole WHERE sysUserId = ?0';
         $mm->executeQuery($query, array(0 => $user->getId()));
         $user->delete();
         $db->commit();
      }catch(\Exception $ex){
         $db->rollback();
         Kernel\throw_exception($ex);
      }
   }

   /**
    * 修改管理员的状态
    *
    * @param int $id
    * @param string $status
    */
   public function changUserStatus($id, $status)
   {
      $user = $this->getUser($id);
      if(!$user){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_USER_IS_NOT_EXIST', $id),
            $errorType->code('E_USER_IS_NOT_EXIST')
         ), $this->getErrorTypeContext());
      }
      $user->setIsLock($status);
      $user->save();
   }

   /**
    * 获取指定站点的系统用户
    *
    * @param int $uid
    * @return \App\Sys\User\Model\BasicInfo
    */
   public function getUser($uid)
   {
      return UserModel::findFirst((int) $uid);
   }

   /**
    * @param int $roleId
    * @return \Phalcon\Mvc\Model\Resultset\Simple
    */
   public function getSysUsersByRole($roleId)
   {
      $role = $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_ROLE_MGR,
         'getRole',
         array(
            $roleId
         )
      );
      if(!$role){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_ROLE_NOT_EXIST', $roleId),
            $errorType->code('E_ROLE_NOT_EXIST')
         ));
      }
      return $role->getSysUsers();
   }

   /**
    * 获取不属于指定角色下的管理员
    *
    * @param int $roleId
    * @return array
    */
   public function getSysUsersNotBelongToRole($roleId)
   {
      $all = UserModel::find();
      $sysUsers = $this->getSysUsersByRole($roleId);
      $exclude = array();
      foreach ($sysUsers as $user) {
         $exclude[] = $user->getId();
      }
      $ret = array();
      foreach ($all as $user) {
         $id = $user->getId();
         if (!in_array($id, $exclude)) {
            $ret[] = array('id' => $user->getId(), 'name' => $user->getName());
         }
      }
      return $ret;
   }

   /**
    * 根据名称获取站点管理员的信息
    *
    * @param string $name
    * @return \App\Sys\User\Model\BasicInfo
    */
   public function getUserByName($name)
   {
      return UserModel::findFirst(array(
         'name = ?0',
         'bind' => array(
            0 =>  $name
         )
      ));
   }

   /**
    * 保存管理员的用户资料
    *
    * @param int $id
    * @param array $data
    * @throws \Exception
    */
   public function updateSysUserProfile($id, array $data)
   {
      $sysUser = $this->getUser($id);
      if(!$sysUser){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_USER_IS_NOT_EXIST', $id),
            $errorType->code('E_USER_IS_NOT_EXIST')
         ), $this->getErrorTypeContext());
      }
      $profile = $sysUser->getProfile();
      unset($data['id']);
      $profile->assignBySetter($data);
      $profile->save();
   }

   /**
    * 判断指定的用户是否为站点超级管理员
    *
    * @param int $uid
    * @return boolean
    */
   public function isSuper($uid)
   {
      $sysUser = $this->getUser($uid);
      if(!$sysUser){
         return false;
      }
      $roles = $sysUser->getRoles();
      foreach($roles as $role){
         if($role->getId() === RoleMgr::SUPER_MANAGER_ROLE_ID){
            return true;
         }
      }
      return false;
   }


   /**
    * 处理用户的角色数据
    *
    * @param array $data
    */
   protected function processUserRoles(array &$data)
   {
       if(empty($data['roles'])) {
           if(isset($data['isSuperUser'])) {
               $data['roles'] = array(RoleMgr::SUPER_MANAGER_ROLE_ID);
           }else {
               $data['roles'] = array();
           }
       }
       unset($data['isSuperUser']);
//      if (!empty($data['roles'])) {
//         $roleIds = $data['roles'];
//      } else {
//         if(isset($data['isSuperUser'])){
//            //直接就是超级管理员
//            $roleIds = array(RoleMgr::SUPER_MANAGER_ROLE_ID);
//         }else{
//            $roleIds = array();
//         }
//      }
//      unset($data['isSuperUser']);
//      $items = RoleModel::find(RoleModel::generateRangeCond('id', $roleIds));
//      $roles = array();
//      foreach ($items as $role) {
//         $roles[] = $role;
//      }
//      $data['roles'] = $roles;
   }

}