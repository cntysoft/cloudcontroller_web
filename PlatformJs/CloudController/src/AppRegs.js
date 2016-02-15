/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 这个文件为了包含css打包
 */
Ext.define('AppRegs', {
   requires: [
      'App.Sys.Login.Main',
      'App.Sys.SysUiRender.Main',
      'App.Sys.User.Main',
      'App.Sys.Setting.Main',
      'App.Sys.AppInstaller.Main',
      'App.Sys.SoftwareRepo.Main',
      'Daemon.Init.Main'
   ]
});