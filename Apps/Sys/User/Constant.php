<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\User;
class Constant
{
   /**
    * 认证配置信息配置键
    */
   const AUTH_KEY = 'authKey';
   /**
    * 用户登录状态配置键
    */
   const STATUS_KEY = 'statusKey';
   /**
    * 登录允许的错误尝试的次数
    */
   const MAX_LOGIN_ERROR_NUM = 5;

   const P_DEFAULT_WALLPAPER = '1|#546ebd';
   /**
    * APP调用相关常量
    */
   const MODULE_NAME = 'Sys';
   const APP_NAME = 'User';
   const APP_API_ACL = 'Acl';
   const APP_API_INFO = 'Info';
   const APP_API_MEMBER = 'Member';
   const APP_API_ROLE_MGR= 'RoleMgr';
   const APP_API_PERM = 'PermManager';

   const PK_MEMBER_MANAGE = 'MemberManage';
   const PK_ACL_MANAGE = 'AclManage';
   //授权树的类型
   const TREE_T_VIEW = 0;
   const TREE_T_GRANT = 1;

   //权限节点类型
   CONST M_NODE = 1;
   CONST R_NODE = 2;
   CONST A_NODE = 3;
   //权限资源节点类型
   CONST R_APP_NODE = 1;
   CONST R_RESOURCE_NODE = 2;
   CONST R_MODULE_NODE = 3;

   /**
    * 权限树的根节点ID
    */
   const RESOURCE_ROOT_ID = 0;

   /**
    * 用户的权限根据会员组来限定
    */
   const PERMISSION_GROUP = 1;
   /**
    * 权限单独特殊制定
    */
   const PERMISSION_SPECIFIC = 2;
   /**
    * 角色权限类型
    */
   const PERMISSION_ROLE = 3;

   const SUPER_USER_ID = 1;
}