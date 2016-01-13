/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license   http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.DeliveryOrderUse.Main', {
   extend : 'WebOs.Kernel.ProcessModel.App',
   requires : [
      'App.ZhuChao.DeliveryOrderUse.Lang.zh_CN'
   ],
   
   id : 'ZhuChao.DeliveryOrderUse',
   widgetMap : {
      Entry : 'App.ZhuChao.DeliveryOrderUse.Widget.Entry'
   },
   
   constructor : function(config)
   {
      config = config || {};
      this.callParent([config]);
   },
   
   getDeliveryOrder : function(data, callback, scope)
   {
      this.callApp('Mgr/getDeliveryOrder', data, callback, scope);
   },
   
   addOrder : function(data, callback, scope)
   {
      this.callApp('Mgr/addOrder', data, callback, scope);
   },
   
   getMerchantList : function(callback, scope)
   {
      this.callApp('Mgr/getMerchantList', {}, callback, scope);
   }
});

