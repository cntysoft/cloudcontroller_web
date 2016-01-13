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
use  App\Sys\User\Constant;
use Cntysoft\Kernel;
use App\Sys\User\Model\Role as RoleModel;
/**
 * 角色管理
 */
class RoleMgr extends AbstractHandler
{
   public function getRoleList(array $params)
   {
      $orderBy = $offset = $limit = null;
      $this->getPageParams($orderBy, $limit, $offset, $params);
      $ret = array();
      $list = $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_ROLE_MGR,
         'getRoleList',
         array(
            true, $orderBy, $offset, $limit
         )
      );
      $total = $list[1];
      $list = $list[0];
      $this->formatRoleItem($list, $ret);
      return array(
         'total' => $total,
         'items' => $ret
      );
   }

   public function getRole(array $params)
   {
      $this->checkRequireFields($params, array(
         'id'
      ));
      $ret = $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_ROLE_MGR,
         'getRole',
         array(
            (int)$params['id']
         )
      );
      return $ret->toArray(true);
   }

   public function addRole(array $params)
   {
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_ROLE_MGR,
         'addRole',
         array(
            $params
         )
      );
   }

   public function updateRole(array $params)
   {
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_ROLE_MGR,
         'updateRole',
         array(
            $params['id'],$params
         )
      );
   }

   public function deleteRole(array $params)
   {
      $this->checkRequireFields($params, array(
         'rid'
      ));
      $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_ROLE_MGR,
         'deleteRole',
         array(
            (int)$params['rid']
         )
      );
   }

   public function saveRoleSysUsers(array $params)
   {
      $this->checkRequireFields($params, array('roleId', 'sysUsers'));
      $roleId = (int)$params['roleId'];
      $sysUserIds = $params['sysUsers'];
      $role = $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_ROLE_MGR,
         'getRole',
         array(
            $roleId
         )
      );
      $db = Kernel\get_db_adapter();
      try {
         $db->begin();
         $this->getAppCaller()->call(
            Constant::MODULE_NAME,
            Constant::APP_NAME,
            Constant::APP_API_ROLE_MGR,
            'clearRoleSysUsers',
            array(
               $roleId
            )
         );
         if (!empty($sysUserIds)) {
            //超级管理员中必须有创始人
            if (\App\Sys\User\RoleMgr::SUPER_MANAGER_ROLE_ID == $roleId) {
               if (!in_array(Constant::SUPER_USER_ID, $sysUserIds)) {
                  $sysUserIds[] = Constant::SUPER_USER_ID;
               }
            }
            $sysUsers = $this->getAppCaller()->call(
               Constant::MODULE_NAME,
               Constant::APP_NAME,
               Constant::APP_API_MEMBER,
               'getUserListBy',
               array(
                  \Cntysoft\Phalcon\Mvc\Model::generateRangeCond('id', $sysUserIds)
               )
            );
            $this->getAppCaller()->call(
               Constant::MODULE_NAME,
               Constant::APP_NAME,
               Constant::APP_API_ROLE_MGR,
               'setRoleSysUsers',
               array(
                  $roleId, $sysUsers
               )
            );
         }
         $db->commit();
      } catch (\Exception $e) {
         $db->rollback();
         throw $e;
      }
   }

   /**
    * @param \Phalcon\Mvc\Model\Resultset\Simple $list
    * @param array $ret
    */
   protected function formatRoleItem($list, array &$ret)
   {
      foreach ($list as $item) {
         $d = $item->toArray();
         $d['memberCount'] = count($item->getSysUsers());
         $ret[] = $d;
      }
   }
}