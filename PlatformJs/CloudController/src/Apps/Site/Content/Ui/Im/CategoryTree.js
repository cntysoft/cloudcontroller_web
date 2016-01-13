/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Content.Ui.Im.CategoryTree', {
   extend: 'App.Site.Content.Comp.CategoryTree',
   alias: 'widget.sitecontentuiimcategorytree',
    requires : [
        'App.Site.CmMgr.Lib.Const'
    ],
   /*
    * @property {Ext.menu.Menu} contextMenuRef
    */
   contextMenuRef : null,

   constructor : function()
   {
      this.SELF_TEXT = this.GET_LANG_TEXT('UI.IM.CATEGORY_TREE');
      this.callParent(arguments);
   },
   applyConstraintConfig : function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         title : this.SELF_TEXT.TITLE
      });
   },
   /*
    * @event menuitemclick
    * 通知栏打开完成
    *
    * @param {boolean} isModelItem
    * @param {int} actionCode
    * @param {Object} modelInfo
    */
   initComponent : function()
   {

      this.addListener({
         itemcontextmenu : this.contextMenuHandler,
         afterrender : function(){
            this.getRootNode().expand();
         },
         scope : this
      });
      this.callParent();
   },

   /*
    * 根据模型进行相应的改变
    *
    * @param {Ext.data.Model} record
    */
   getContextMenu : function(record)
   {
      var MENU_TEXT = this.SELF_TEXT.MENU;
      var cModels = record.get('contentModels');
      var items = [];
      var C = App.Site.CmMgr.Lib.Const;
      if(cModels){
         Ext.each(cModels, function(item, index){
            items.push({
               text : MENU_TEXT.ADD + item.itemName,
               isModelItem : true,
               cModel : item,
               actionCode : 0
            });
            items.push({
               text : MENU_TEXT.ADMIN + item.itemName,
               isModelItem : true,
               cModel : item,
               actionCode : 1
            });
         });
      }
      items.push({
         text : MENU_TEXT.VIEW_NODE,
         listeners : {
            click : function(){
               //路由信息可能一个来自变量
               Cntysoft.Global.gotoUrl('/category/'+record.get('id')+'.html');
            },
            scope : this
         }
      });
      if(null == this.contextMenuRef){
         this.contextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks : true,
            items : items,
            listeners : {
               click : this.menuItemClickHandler,
               scope : this
            }
         });
      } else{
         //处理items
         this.contextMenuRef.removeAll(true);
         this.contextMenuRef.add(items);
      }
      this.contextMenuRef.record = record;
      return this.contextMenuRef;
   },

   /*
    * 菜单项点击处理事件
    *
    * @param {Ext.menu.Menu} menu
    * @param {Ext.Component} item
    */
   menuItemClickHandler : function(menu, item)
   {
      if(item){
         this.fireEvent('menuitemclick', item.isModelItem, item.actionCode, item.cModel, menu.record);
      }
   },
   /*
    * 上下文点击处理函数
    *
    * @param {Ext.tree.Panel} tree
    * @param {Ext.data.Model} record
    */
   contextMenuHandler : function(tree, record, htmlItem, index, event)
   {
      if(!record.isRoot()){
         var menu = this.getContextMenu(record);
         var pos = event.getXY();
         menu.showAt(pos[0], pos[1]);
      }
   },
   /*
    * 资源清除
    */
   destroy : function()
   {
      if(null !== this.contextMenuRef){
         this.contextMenuRef.destroy();
         delete this.contextMenuRef;
      }
      delete this.mainPanelRef;
      delete this.SELF_TEXT;
      this.callParent();
   }
});