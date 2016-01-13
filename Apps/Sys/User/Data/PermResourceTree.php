<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
use App\Sys\User\Constant as CM_CONST;
return array(
   'text'        => '管理员管理',
   'internalKey' => 'User',
   'isApp'       => true,
   'hasDetail'   => true,
   'children'    => array(
      array(
         'text'         => '成员管理',
         'hasDetail'    => false,
         'internalKey'  => CM_CONST::PK_MEMBER_MANAGE,
         'codes'        => array(1, 2, 3, 4, 5, 6)
      ),
      array(
         'text'        => '权限管理',
         'hasDetail'   => false,
         'internalKey' => CM_CONST::PK_ACL_MANAGE,
         'codes'       => array(7)
      )
   )
);
