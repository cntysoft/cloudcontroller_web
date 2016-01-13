/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.DeliveryOrder.Main', {
   extend : 'WebOs.Kernel.ProcessModel.App',
   requires : [
      'App.ZhuChao.DeliveryOrder.Lang.zh_CN'
   ],
   id : 'ZhuChao.DeliveryOrder',
   widgetMap : {
      Entry : 'App.ZhuChao.DeliveryOrder.Widget.Entry'
   },
   constructor : function(config)
   {
      config = config || {};
      this.callParent([config]);
   },
   
   addActivity : function(value, callback, scope)
   {
      this.callApp('Mgr/addActivity', value, callback, scope);
   },
   updateActivity : function(values, callback, scope)
   {
      this.callApp('Mgr/updateActivity', values, callback, scope);
   },
   changeIssuer : function(values, callback, scope)
   {
      this.callApp('Mgr/changeIssuer', values, callback, scope);
   }
   
});

