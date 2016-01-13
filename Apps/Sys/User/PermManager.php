<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\User;
use App\Sys\AppInstaller\Model\PermResource as PermResourceModel;
use Cntysoft\Kernel\App\AbstractLib;
use Cntysoft\Kernel;
use Cntysoft\Stdlib\Tree;
use App\Sys\User\Model\Permission as PermModel;

/**
 * 站点角色资源权限管理，单个的站点不需要挂载权限资源，这里管理资源的操作只能是只读的
 */
class PermManager extends AbstractLib
{
   /**
    * @var array $permTrees
    */
   protected $permTrees = array();

   /**
    * @var array $permMap 角色权限映射数据
    */
   protected $permMap = array();

   /**
    * 快速判断一个角色是否具有某项权限
    *
    * @param int $roleId 角色ID
    * @param int $resId 权限资源的ID
    * @return boolean
    */
   public function hasPerm($roleId, $resId)
   {
      if (!array_key_exists($roleId, $this->permMap)) {
         $ptree = $this->getRolePermTree($roleId);
         $this->permMap[$roleId] = $ptree->getNodeIds();
      }
      return in_array($resId, $this->permMap[$roleId]);
   }

   /**
    * 收取角色指定的权限
    *
    * @param int $roleId
    * @param array $perms
    * @param array $rootResources
    */
   public function grantRolePerms($roleId, array $perms, array $rootResources)
   {
      $role = $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_ROLE_MGR,
         'getRole',
         array(
            (int)$roleId
         )
      );
      if(!$role){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_ROLE_NOT_EXIST', $roleId),
            $errorType->code('E_ROLE_NOT_EXIST')
         ), $this->getErrorTypeContext());
      }
      if($role->getId() == RoleMgr::SUPER_MANAGER_ROLE_ID){
         return;
      }
      if(!empty($rootResources)){
         $db = Kernel\get_db_adapter();
         try{
            $db->begin();
            $this->clearRolePerms($roleId, $rootResources);
            foreach($perms as $item){
               $this->addRolePerm($role, $item);
            }
            $db->commit();
         }catch(\Exception $ex){
            $db->rollback();
            Kernel\throw_exception($ex, $this->getErrorTypeContext());
         }
      }
   }

   /**
    * @param int $siteId
    * @param \App\Sys\User\Role $role
    * @param array $data
    */
   protected function addRolePerm($role, array $data)
   {
      $roleId = $role->getId();
      unset($data['roleId']);
      Kernel\ensure_array_has_fields($data, array('resourceId'));
      $rid = (int) $data['resourceId'];
      unset($data['resourceId']);
      $resource = $this->getPermRes($rid);
      if(!$resource){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_PERM_RESOURCE_NOT_EXIST', $rid),
            $errorType->code('E_PERM_RESOURCE_NOT_EXIST')
         ), $this->getErrorTypeContext());
      }
      $data += array(
         'detailPermission' => null
      );
      $hasDetail = false;
      $detailPermission = null;
      if ($resource->getPid() != 0 && $resource->getHasDetail()) {
         $hasDetail = true;
      }
      if ($hasDetail) {
         $detailPermission = $data['detailPermission'];
         $data['detailPermission'] = null;
      }
      unset($data['hasDetail']);
      $db = Kernel\get_db_adapter();
      try{
         $db->begin();
         $perm = new PermModel();
         $perm->assignBySetter($data);
         $perm->setRoleId($roleId);
         $perm->setResourceId($rid);
         $perm->create();
         if ($hasDetail) {
            $this->saveDetailPermission($roleId, $resource, $perm, $detailPermission);
         }
         //更新角色权限代码
         //$this->processRoleAuthorizeCode($roleId, $resource);
         $db->commit();
      }catch(\Exception $ex){
         $db->rollback();
         Kernel\throw_exception($ex, $this->getErrorTypeContext());
      }

   }

   /**
    * 清除角色的权限
    *
    * @param int $roleId
    * @param array $rootResources
    */
   public function clearRolePerms($roleId,array $rootResources)
   {
      if(!empty($rootResources)){
         $role = $this->getAppCaller()->call(
            Constant::MODULE_NAME,
            Constant::APP_NAME,
            Constant::APP_API_ROLE_MGR,
            'getRole',
            array(
               (int) $roleId
            )
         );
         if(!$role){
            $errorType = $this->getErrorType();
            Kernel\throw_exception(new Exception(
               $errorType->msg('E_ROLE_NOT_EXIST', $roleId),
               $errorType->code('E_ROLE_NOT_EXIST')
            ), $this->getErrorTypeContext());
         }
         if($role->getId() == RoleMgr::SUPER_MANAGER_ROLE_ID){
            return;
         }
         $db = Kernel\get_db_adapter();
         try{
            $db->begin();
            //计算需要删除的权限， 主要的思想是获取当前角色的权限树， 获取指定APP的所有子权限
            $permTree = $this->getRolePermTree($roleId);
            $deleteItems = array();
            foreach ($rootResources as $app) {
               $resource = PermResourceModel::findFirst($app);
               if ($resource) {
                  //$this->clearRoleAuthorizeCodes($roleId, $resource->getModuleKey() . '.' . $resource->getAppKey());
                  $deleteItems[] = (int) $app;
                  $deleteItems = array_merge($deleteItems, $permTree->getChildren($app));
               }
            }
            $this->deletePermByResourceId($roleId, $deleteItems);
            $db->commit();
         }catch (\Exception $ex){
            $db->rollback();
            Kernel\throw_exception($ex, $this->getErrorTypeContext());
         }
      }
   }

   /**
    * 获取指定角色的权限树
    *
    * @param int $rid
    * @param boolean $withDetailPermission 是否附带详细权限
    * @param boolean $force 强制获取
    * @return \Cntysoft\Stdlib\Tree
    */
   public function getRolePermTree($rid, $withDetailPermission = false, $force = false)
   {
      $role = $this->getAppCaller()->call(
         Constant::MODULE_NAME,
         Constant::APP_NAME,
         Constant::APP_API_ROLE_MGR,
         'getRole',
         array($rid)
      );
      if(!$role){
         $errorType = $this->getErrorType();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_ROLE_NOT_EXIST', $rid),
            $errorType->code('E_ROLE_NOT_EXIST')
         ), $this->getErrorTypeContext());
      }
      if($role->getId() == RoleMgr::SUPER_MANAGER_ROLE_ID){
         return $this->getSuperPermTree();
      }
      $key = 'role_'.$rid;
      if($force || !array_key_exists($key, $this->permTrees)){
         $tree = new Tree('PERMISSION TREE');
         $permissions = PermModel::findByRoleId($rid);
         foreach($permissions as $permission){
            $resource = $permission->getResource();
            $detailPermission = null;
            if ($withDetailPermission && (int) $resource->getPid() !== 0 && $resource->getHasDetail()) {
               $detailPermission = $this->getDetailPermission($rid, $resource, $permission);
            }
            $resource = $resource->toArray(true);
            $resource['detailPermission'] = $detailPermission;
            $tree->setNode($resource['id'], $resource['pid'], $resource);
         }
         $this->permTrees[$key] = $tree;
      }
      return $this->permTrees[$key];
   }

   /**
    * @return \Cntysoft\Stdlib\Tree
    */
   public function getSuperPermTree()
   {
      $key = 'super_perm_tree';
      if(!array_key_exists($key, $this->permTrees)){
         $resources = PermResourceModel::find();
         $tree = new Tree('Permission Tree');
         foreach ($resources as $node) {
            $tree->setNode($node->getId(), $node->getPid(), $node->toArray(true));
         }
         $this->permTrees[$key] = $tree;
      }
      return $this->permTrees[$key];
   }

   /**
    * 获取当前用户的权限树
    *
    * @param \App\Sys\User\Model $sysUser
    * @return \Cntysoft\Stdlib\Tree
    */
   public function getUserPermTree($sysUser)
   {
      $roles = $sysUser->getRoles();
      $key = 'role';
      $isSuper = false;
      //判断是否有超级管理员
      foreach($roles as $role){
         if($role->getId() === RoleMgr::SUPER_MANAGER_ROLE_ID){
            $isSuper = true;
         }
         $key .= '_'.$role->getId();
      }
      if($isSuper){
         return $this->getSuperPermTree();
      }
      if(!isset($this->permTrees[$key])){
         //暂时不合并详细权限，如果详细权限不同保存成一个数组 O(n^2)
//         $permissions = array();
//         foreach ($roles as $role) {
//            $rolePermissions = $role->getPermissions();
//            foreach ($rolePermissions as $p) {
//               $resource = $p->getResource();
//               $rid = $resource->getId();
//               if (!array_key_exists($rid, $permissions)) {
//                  $permissions[$rid] = $resource->toArray(true);
//                  if ($resource->getHasDetail() && $p->getDetailPermission()) {
//                     $permissions[$rid]['detailPermission'] = array($p->getDetailPermission());
//                  } else {
//                     $permissions[$rid]['detailPermission'] = array();
//                  }
//               } else {
//                  //不一样才加入到具体权限里面
//                  if ($resource->getHasDetail() && $p->getDetailPermission() !== $permissions[$rid]['detailPermission']) {
//                     $permissions[$rid]['detailPermission'][] = $p->getDetailPermission();
//                  }
//               }
//            }
//         }

         $permissions = new Tree('User Perm Tree');
         foreach ($roles as $role) {
            $rolePermissions = $role->getPermissions();
            foreach ($rolePermissions as $p) {
               $resource = $p->getResource();
               $rid = $resource->getId();

               if(!$permissions->isNodeExist($rid)) {
                  $permissions->setNode($rid, $resource->getPid(), $resource->toArray(true));
               }
            }
         }

         $this->permTrees[$key] = $permissions;
      }

      return $this->permTrees[$key];
   }

   /**
    * 获取指定的权限资源
    *
    * @param int $id
    * @return \App\Sys\AppInstaller\Model\PermResource
    */
   public function getPermRes($id)
   {
      return PermResourceModel::findFirst((int)$id);
   }

   /**
    * 根据权限资源ID删除角色的权限数据
    *
    * @param int $roleId
    * @param array $resources
    */
   protected function deletePermByResourceId($roleId, array $resources)
   {
      if(!empty($resources)){
         $permItems = PermModel::find(array(
            'roleId = ?0 and ' . PermModel::generateRangeCond('resourceId', $resources),
            'bind' => array(
               0 => (int) $roleId
            )
         ));
         foreach ($permItems as $pitem) {
            $resource = $pitem->getResource();
            if ($resource->getHasDetail() && (int) $resource->getPid() !== 0) {
               $this->clearDetailPermission($roleId, $resource, $pitem);
            }
            $pitem->delete();
         }
      }
   }

   /**
    * @param string $moduleKey
    * @param boolean $total 是否返回总数
    * @param array $orderBy
    * @param int $offset
    * @param int $limit
    * @return array | \Phalcon\Mvc\Model\Resultset\Simple
    */
   public function getRootPermResByModule($mkey, $total = false, $orderBy = null, $offset = 0, $limit = \Cntysoft\STD_PAGE_SIZE)
   {
      $items = PermResourceModel::find(array(
         'moduleKey = ?0 and pid = ?1',
         'bind'  => array(
            0 => $mkey,
            1 => Constant::RESOURCE_ROOT_ID
         ),
         'order' => $orderBy,
         'limit' => array(
            'number' => $limit,
            'offset' => $offset
         )
      ));
      if ($total) {
         return array(
            $items,
            PermResourceModel::count(array(
               'moduleKey = ?0 and pid = ?1',
               'bind' => array(
                  0 => $mkey,
                  1 => self::RESOURCE_ROOT_ID
               )
            ))
         );
      }
      return $items;
   }

   /**
    * 根据权限资源的ID获取相关的权限
    *
    * @param int $roleId 角色的ID
    * @param \App\Sys\AppInstaller\Model\PermResource resource 权限资源
    * @return array
    */
   public function getPermByResource($roleId, PermResourceModel $resource)
   {
      $ptree = $this->getRolePermTree($roleId);
      $ret = $ptree->getValue($resource->getId());
      if ((int) $resource->getPid() !== 0 && $resource->getHasDetail()) {
         $permission = PermModel::findFirst(array(
            'roleId = ?0 and resourceId = ?1',
            'bind' => array(
               0 => $roleId,
               1 => $resource->getId()
            )
         ));
         $ret['detailPermission'] = $this->getDetailPermission( $roleId, $resource, $permission);
      } else {
         $ret['detailPermission'] = null;
      }
      return $ret;
   }

   /**
    * 获取APP注册的权限树
    *
    * @param string $moduleKey
    * @param string $appKey
    * @return \Cntysoft\Stdlib\Tree
    */
   public function getAppPermResTree($moduleKey, $appKey)
   {
      $nodes = PermResourceModel::find(array(
         'moduleKey = ?0 and appKey = ?1',
         'bind' => array(
            0 => $moduleKey,
            1 => $appKey
         )
      ));
      $tree = new Tree($moduleKey . '.' . $appKey);
      if (count($nodes) == 0) {
         return $tree;
      }
      foreach ($nodes as $node) {
         $tree->setNode($node->getId(), $node->getPid(), $node);
      }
      return $tree;
   }

   /**
    * 获取默认的相关实体的详细权限
    *
    * @param int $permissionType 权限类型
    * @param int $targetType 实体的ID 解释根据权限的类型不同而不同
    * @param \App\Sys\AppInstaller\Model\PermResource $resource
    */
   public function getDefaultDetailPermission($permissionType, $targetId, PermResourceModel $resource)
   {

   }

   /**
    * 这里是否使用事件的方式
    *
    * @param $roleId
    * @param \App\Sys\AppInstaller\Model\PermResource $resource
    * @param \App\Sys\User\Model\Permission $perm
    */
   protected function clearDetailPermission($roleId, $resource, $perm)
   {
   }

   /**
    * @param $roleId
    * @param \App\Sys\AppInstaller\Model\PermResource $resource
    * @param \App\Sys\User\Model\Permission $perm
    */
   protected function getDetailPermission($roleId, $resource, $perm)
   {
      return $perm->getDetailPermission();
   }

   /**
    * @param int $roleId
    * @param \App\Sys\AppInstaller\Model\PermResource $resource
    * @param \App\Sys\User\Model\Permission $perm
    */
   protected function saveDetailPermission($roleId, $resource, $perm)
   {
   }
}