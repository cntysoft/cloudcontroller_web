/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 筑巢模块元信息入口文件类
 */
Ext.define('App.ZhuChao.MetaInfo.Main', {
   extend: 'WebOs.Kernel.ProcessModel.App',
   requires: [
      'App.ZhuChao.MetaInfo.Lang.zh_CN'
   ],
   /**
    * @inheritdoc
    */
   id: 'ZhuChao.MetaInfo',
   /**
    * @inheritdoc
    */
   widgetMap : {
      Entry : 'App.ZhuChao.MetaInfo.Widget.Entry',
      Trademark : 'App.ZhuChao.MetaInfo.Widget.Trademark'
   },

   addTrademark : function(values, callback, scope)
   {
      this.callApp('Trademark/addTrademark', values, callback, scope);
   },

   getTrademark : function(id, callback, scope)
   {
      this.callApp('Trademark/getTrademark', {
         id : id
      }, callback, scope);
   },

    getNodes : function(trademarkId, callback, scope)
    {
        this.callApp('Trademark/getChildren', {
            trademarkId : trademarkId
        }, callback, scope);
    },

   updateTrademark : function(values, callback, scope)
   {
      this.callApp('Trademark/updateTrademark', values, callback, scope);
   },

   deleteTrademarkInfo : function(id, callback, scope)
   {
      this.callApp('Trademark/deleteTrademark', {
         id : id
      }, callback, scope);
   }
});