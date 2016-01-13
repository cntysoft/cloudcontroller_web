/*
 * Cntysoft Cloud Software Team
 *
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 筑巢模块订单管理入口文件类
 */
Ext.define('App.ZhuChao.ShopFlow.Main', {
   extend: 'WebOs.Kernel.ProcessModel.App',
   requires: [
      'App.ZhuChao.ShopFlow.Lang.zh_CN'
   ],
   /**
    * @inheritdoc
    */
   id: 'ZhuChao.ShopFlow',
   /**
    * @inheritdoc
    */
   widgetMap : {
      Entry : 'App.ZhuChao.ShopFlow.Widget.Entry'
   },
   getOrderInfo : function(id, callback, scope)
   {
       this.callApp('OrderMgr/getOrderInfo', {
           orderId : id
       }, callback, scope);
   }
});