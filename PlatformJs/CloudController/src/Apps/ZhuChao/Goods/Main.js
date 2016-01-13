/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.Goods.Main', {
   extend: 'WebOs.Kernel.ProcessModel.App',
   requires: [
      'App.ZhuChao.Goods.Lang.zh_CN'
   ],
   /**
    * @inheritdoc
    */
   id: 'ZhuChao.Goods',
   /**
    * @inheritdoc
    */
   widgetMap: {
      Entry: 'App.ZhuChao.Goods.Widget.Entry'
   },
   getCategoryAttrs: function(categoryId, callback, scope)
   {
      this.callApp('Mgr/getCategoryAttrs', {
         categoryId: categoryId
      }, callback, scope);
   },
   addGoodsInfo: function(values, callback, scope)
   {
      this.callApp('Mgr/addGoodsInfo', values, callback, scope);
   },
   getGoodsInfo: function(gid, callback, scope)
   {
      this.callApp('Mgr/getGoodsInfo', {
         gid: gid
      }, callback, scope);
   },
   updateGoodsInfo: function(data, callback, scope)
   {
      this.callApp('Mgr/updateGoodsInfo', data, callback, scope);
   },
   getGoodsTotalNumByCatgory: function(cid, callback, scope)
   {
      this.callApp('Mgr/getGoodsTotalNumByCatgory', {
         cid: cid
      }, callback, scope);
   },
   generateSearchAttrMapByCategory: function(cid, page, pageSize, callback, scope)
   {
      this.callApp('Mgr/generateSearchAttrMapByCategory', {
         cid : cid,
         page : page,
         pageSize : pageSize
      }, callback, scope);
   },
   setGoodsOn : function(id, callback, scope)
   {
      this.callApp('Mgr/setOnGoods', {
         gid : id
      }, callback, scope);
   },
   setGoodsOff : function(id, callback, scope)
   {
      this.callApp('Mgr/setOffGoods', {
          gid : id
      }, callback, scope);
   }
});