/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 筑巢商品分类管理，商品分类查询属性列表类
 */
Ext.define('App.ZhuChao.CategoryMgr.Comp.QueryAttrGrid', {
   extend : 'Ext.grid.Panel',
   alias : 'widget.zhuchaocategorymgrcompqueryattrgrid',
   mixins : {
      fcm : 'Cntysoft.Mixin.ForbidContextMenu',
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.CategoryMgr',
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('COMP.QUERY_ATTR_GRID');
      this.callParent([config]);
   },

   getAttrValues : function()
   {

   },

   setAttrValues : function(values)
   {
      this.store.loadData(values);
   },

   clearAttrValues : function()
   {
      this.store.removeAll();
   },

   initComponent : function()
   {
      var COLS = this.LANG_TEXT.COLS;
      Ext.apply(this, {
         store : new Ext.data.Store({
            fields : [
               {name : 'name', type : 'string', persist : false},
               {name : 'group', type : 'string', persist : false}
            ]
         }),
         tbar : [{
            xtype : 'button',
            text : this.LANG_TEXT.BTN.ADD
         }],
         columns : [
            {text : COLS.NAME,  dataIndex : 'name', flex : 1, resizable : false, sortable : false, menuDisabled : true},
            {text : COLS.GROUP,  dataIndex : 'group', width : 100, resizable : false, sortable : false, menuDisabled : true}
         ]
      });
      this.callParent();
   }
});