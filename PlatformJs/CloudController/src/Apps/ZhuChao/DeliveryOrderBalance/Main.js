/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license   http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.DeliveryOrderBalance.Main', {
   extend : 'WebOs.Kernel.ProcessModel.App',
   requires : [
      'App.ZhuChao.DeliveryOrderBalance.Lang.zh_CN'
   ],
   
   id : 'ZhuChao.DeliveryOrderBalance',
   widgetMap : {
      Entry : 'App.ZhuChao.DeliveryOrderBalance.Widget.Entry'
   },
   
   constructor : function(config)
   {
      config = config || {};
      this.callParent([config]);
   },
   
   changeOrderStatus : function(values, callback, scope)
   {
      this.callApp('Mgr/changeOrderStatus', values, callback, scope);
   },
   getOrderInfo : function(values, callback, scope)
   {
      this.callApp('Mgr/getOrderInfo', values, callback, scope);
   },
   downloadExcel : function(values, callback, scope)
   {
      this.callApp('Mgr/downloadExcel', values, callback, scope);
   }
   
});

