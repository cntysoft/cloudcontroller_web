/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.AppInstaller.Main', {
   extend: 'WebOs.Kernel.ProcessModel.App',
   requires: [
      'App.Sys.AppInstaller.Lang.zh_CN',
      //'App.Sys.User.Const',
      'App.Sys.AppInstaller.Widget.Entry',
      'App.Sys.AppInstaller.Widget.PermResMgr'
   ],
   /**
    * @inheritdoc
    */
   id: 'Sys.AppInstaller',
   /**
    * @inheritdoc
    */
   widgetMap : {
      Entry : 'App.Sys.AppInstaller.Widget.Entry',
      PermResMgr : 'App.Sys.AppInstaller.Widget.PermResMgr'
   },

   /**
    * 挂载一个APP的权限树
    */
   mountPermResource : function(moduleKey, appKey, callback, scope)
   {
      this.callApp('PermResMounter/mountPermRes',{
         moduleKey : moduleKey,
         appKey : appKey
      }, callback, scope);
   },
   /**
    * 卸载APP权限树数据
    */
   unmountPermResource  : function(moduleKey, appKey,  callback, scope)
   {
      this.callApp('PermResMounter/unmountPermRes',{
         moduleKey : moduleKey,
         appKey : appKey
      }, callback, scope);
   },
   /**
    * 重新挂在权限树数据
    */
   remountPermResource : function(moduleKey, appKey, callback, scope)
   {
      return this.callApp('PermResMounter/remountPermRes', {
         moduleKey : moduleKey,
         appKey : appKey
      }, callback, scope);
   }

});