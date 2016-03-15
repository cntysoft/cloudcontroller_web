<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\Setting;
final class Constant
{
   const PK_SITE_MANAGE = 'SiteConfig';
   const PK_UI_MANAGE = 'UiManage';
   const MODULE_NAME = 'Sys';
   const APP_NAME = 'Setting';
   const APP_API_CFG = 'Config';
   const APP_API_SITE_KEY_SETTING = 'SiteKeySetting';
   const APP_API_SERVER_INFO = 'ServerInfo';
   
   const MASTER_SERVER = 1;
   const DEPLOY_SERVER = 2;
   const MSG_QUEUE_SERVER = 3;
   const DB_SERVER = 4;
   const BACKUP_SERVER = 5;
   
   const SITE_KEY_MAP_OTS_TABEL_NAME = 'site_key_map';
   const SITE_KEY_MAP_OTS_TABEL_NAME_DEVEL = 'site_key_map_devel';
}