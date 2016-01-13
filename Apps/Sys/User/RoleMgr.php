<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace  App\Sys\User;
use Cntysoft\Kernel\App\AbstractLib;
use Cntysoft\Kernel;
use App\Sys\User\Model\Role as RoleModel;
use App\Sys\User\Model\UserJoinRole as UserJoinRoleModel;
/**
 * 站点管理员角色管理
 */
class RoleMgr extends AbstractLib
{
   /**
    * 超级管理员用户角色ID
    */
   const SUPER_MANAGER_ROLE_ID = 1;
   const ROLE_KEY = 1;
   /**
    * 获取系统角色列表
    *
    * @param bool $total
    * @param string $orderBy
    * @param int $offset
    * @param int $limit
    */
   public function getRoleList($total = false, $orderBy = null, $offset = 0, $limit = 15)
   {
      $items = RoleModel::find(array(
         'order' => $orderBy,
         'limit' => array(
            'number' => $limit,
            'offset' => $offset
         ),
      ));
      if($total){
         return array(
            $items,
            (int)RoleModel::count()
         );
      }
      return $items;
   }

   /**
    * @param string $name
    * @return \App\Sys\User\Model\Role
    */
   public function getRoleByName($name)
   {
      return RoleModel::findFirstByName($name);
   }

   /**
    * 暂时不判断站点是否存在
    *
    * @param array $data
    * @return \App\Sys\User\Model\Role
    */
   public function addRole(array $data)
   {
      $role = new RoleModel();
      unset($data['id']);
      $requires = $role->getRequireFields(array('id'));
      if($this->getRoleByName($data['name'])){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_ROLE_ALREADY_EXIST', $data['name']), $errorType->code('E_ROLE_ALREADY_EXIST')), $this->getErrorTypeContext());
      }
      Kernel\ensure_array_has_fields($data, $requires);
      $role->assignBySetter($data);
      $role->create();
   }

   /**
    * 更新一个角色数据
    *
    * @param int $id
    * @param array $data
    */
   public function updateRole($id, array $data)
   {
      $role = $this->getRole($id);
      if(!$role){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_ROLE_NOT_EXIST', $id), $errorType->code('E_ROLE_NOT_EXIST')), $this->getErrorTypeContext());
      }
      //判断是否为founder
      if($role->getId() === self::SUPER_MANAGER_ROLE_ID){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_SUPER_ROLE_CANOT_MODIFY'), $errorType->code('E_SUPER_ROLE_CANOT_MODIFY')), $this->getErrorTypeContext());
      }
      unset($data['id']);
      $role->assignBySetter($data);
      $role->save();
   }

   /**
    * 删除指定的角色
    *
    * @param int $id
    */
   public function deleteRole($id)
   {
      $role = $this->getRole($id);
      if(!$role){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_ROLE_NOT_EXIST', $id), $errorType->code('E_ROLE_NOT_EXIST')), $this->getErrorTypeContext());
      }
      if($role->getId() === self::SUPER_MANAGER_ROLE_ID){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_SUPER_ROLE_CANOT_MODIFY'), $errorType->code('E_SUPER_ROLE_CANOT_MODIFY')), $this->getErrorTypeContext());
      }
      if(count($role->getSysUsers()) > 0){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_ROLE_NOT_EMPTY'),
            $errorType->code('E_ROLE_NOT_EMPTY')
         ), $this->getErrorTypeContext());
      }
      $role->delete();
   }

   /**
    * @param int $id
    * @return \App\Sys\User\Role
    */
   public function getRole($id)
   {
      return RoleModel::findFirst((int)$id);
   }
   /**
    * 判断一个角色是否存在
    *
    * @param int $id 角色的ID
    * @return boolean
    */
   public function hasRole($id)
   {
      return null == $this->getRole($id) ? false : true;
   }

   /**
    * 设置角色的管理员
    *
    * @param int  roleId
    * @param \Phalcon\Mvc\Model\Resultset\Simple $sysUsers
    */
   public function setRoleSysUsers($role, $sysUsers)
   {
      $db = Kernel\get_db_adapter();
      try {
         $db->begin();
         foreach ($sysUsers as $user) {
            $m = new UserJoinRoleModel();
            $m->setRoleId($role);
            $m->setSysUserId($user->getId());
            $m->create();
         }
         $db->commit();
      } catch (\Exception $ex) {
         $db->rollback();
         throw $ex;
      }
   }

   /**
    * 清空相应角色的管理员
    *
    * @param int $roleId
    */
   public function clearRoleSysUsers($roleId)
   {
      $modelsManager = Kernel\get_models_manager();
      $query = sprintf('DELETE FROM %s WHERE roleId = ?0', 'App\Sys\User\Model\UserJoinRole');
      $modelsManager->executeQuery($query, array(
         0 => (int)$roleId
      ));
   }
}