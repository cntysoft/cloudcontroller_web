<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\AppInstaller;

final class Constant
{
   const MODULE_NAME = 'Sys';
   const APP_NAME = 'AppInstaller';
   const APP_API_META = 'Meta';
   const APP_API_MMGR = 'MMgr';
   const APP_API_RES_MOUNTER = 'PermResMounter';
   const APP_API_MODULE_MGR = 'ModuleMgr';

   const M_ON = 0;
   const M_OFF = 1;
   const L_TYPE_ALL = 0;
   const L_TYPE_MOUNTED = 1;
   const L_TYPE_UNMOUNTED = 2;

   const APP_M_NEW = 0;
   const APP_M_INSTALLED = 1;
}