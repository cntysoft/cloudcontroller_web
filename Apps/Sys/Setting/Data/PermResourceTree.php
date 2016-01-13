<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
use App\Sys\Setting\Constant as C;
return array(
   'text'        => '系统设置',
   'internalKey' => 'Setting',
   'isApp'       => true,
   'hasDetail'   => true,
   'children'    => array(
      array(
         'text'         => '站点信息设置',
         'hasDetail'    => false,
         'internalKey'  => C::PK_SITE_MANAGE,
         'codes'        => array(1, 2, 3, 4, 5, 6)
      ),
      array(
         'text'         => '风格管理',
         'hasDetail'   => false,
         'internalKey' => C::PK_UI_MANAGE,
         'codes'       => array(7)
      )
   )
);
