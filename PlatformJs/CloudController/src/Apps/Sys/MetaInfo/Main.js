/*
 * Cntysoft Cloud Software Team
 *
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.MetaInfo.Main', {
   extend: 'WebOs.Kernel.ProcessModel.App',
   requires: [
      'App.Sys.MetaInfo.Lang.zh_CN',
      'App.Sys.MetaInfo.Widget.Entry',
      'App.Sys.MetaInfo.Widget.KvDict'
   ],
   /**
    * @inheritdoc
    */
   id: 'Sys.MetaInfo',
   /**
    * @inheritdoc
    */
   widgetMap: {
      Entry: 'App.Sys.MetaInfo.Widget.Entry',
      KvDict: 'App.Sys.MetaInfo.Widget.KvDict'
   },
   addKvMap : function(data, callback, scope)
   {
       this.callApp('KvDict/addItem', data, callback, scope);
   },
   saveKvMap : function(data, callback, scope)
   {
       this.callApp('KvDict/saveItem', data, callback, scope);
   },
   alterKvMapItems : function(key, items, callback, scope)
   {
       this.callApp('KvDict/saveItemContent', {
           identifier : key,
           items : items
       }, callback, scope);
   },
   removeKvMap : function(key, callback, scope)
   {
       this.callApp('KvDict/deleteItem', {
           identifier : key
       }, callback, scope);
   },
   getKvMap : function(key, callback, scope)
   {
       this.callApp('KvDict/getItem', {
           identifier : key
       }, callback, scope);
   }
});