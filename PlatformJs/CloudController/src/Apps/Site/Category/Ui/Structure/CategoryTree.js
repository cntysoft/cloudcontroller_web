/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 栏目管理器节点树管理
 */
Ext.define('App.Site.Category.Ui.Structure.CategoryTree', {
   extend: 'App.Site.Category.Comp.CategoryTree',
   alias : 'widget.sitecategoryuicategorytree',
   requires : [
      'App.Site.Category.Lib.Const'
   ],
   statics : {
      AMAP : {
         ADD_SINGLE_NODE : 1,
         ADD_GENERAL_NODE : 2,
         ADD_LINK_NODE : 3,
         RM_NODE : 4,
         VIEW_NODE : 5,
         MODIFY_NODE : 6
      }
   },
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
      //permissionHelper : 'Cntysoft.Mixin.PermissionHelper'
   },
   /*
    * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.Site.Category',
   /*
    * 允许的节点类型
    *
    * @property {Array} allowTypes
    */
   allowTypes : [1, 2, 3, 4],

   contextMenus : [null, null, null, null, null, null],

   /*
    * @event categorymenuclick
    * 通知栏打开完成
    *
    * @param {integer} code
    * @param {Object} node
    */
   initComponent : function()
   {
      this.addListener({
         afterrender : this.afterRenderHandler,
         itemcontextmenu : this.nodeRightClickHandler,
         scope : this
      });
      this.callParent();
   },


   afterRenderHandler : function()
   {
      this.getRootNode().expand();
      this.setTitle(this.GET_LANG_TEXT('STRUCTURE.CATEGORY_TREE.TITLE'));
   },

   /*
    * 处理节点右键点击
    *
    * @param {Ext.view.View} tree
    * @param {Ext.data.Model} record
    */
   nodeRightClickHandler : function(tree, record, item, index, e)
   {
      var menu = this.getContextMenu(record.get('nodeType'), record);
      var pos = e.getXY();
      menu.node = record;
      menu.showAt(pos[0], pos[1]);
      e.stopEvent();
   },

   /*
    * 获取上下文无关按钮
    *
    * @param  {String} type
    * @param {Ext.data.Model} node 当前点击的按钮
    * @return {Ext.menu.Menu} menu
    */
   getContextMenu : function(type, node)
   {
      var C = App.Site.Category.Lib.Const;
      var M_TEXT = this.GET_LANG_TEXT('STRUCTURE.CATEGORY_TREE.MENU');
      var S = this.self;
      var NODE_TYPE = S.NODE_TYPE;
      var AMAP = S.AMAP;
      var menus;
      var menu;
      //加入权限判断
      var nid = node.get('id');
      listeners = {
         click : this.menuItemClickHandler,
         scope : this
      },
         menus = this.contextMenus;
      if(!S.isNodeTypeSupported(type)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'getContextMenu',
            'Node Type : ' + type + ' is not supported'
         );
      }
      switch (parseInt(type)) {
         case NODE_TYPE.N_TYPE_ROOT:
            if(null == menus[type]){
               menu = new Ext.menu.Menu({
                  ignoreParentClicks : true,
                  items : [{
                     text : M_TEXT.ADD_GENERAL_NODE,
                     aCode : AMAP.ADD_GENERAL_NODE
                  }, {
                     text : M_TEXT.ADD_SINGLE_NODE,
                     aCode : AMAP.ADD_SINGLE_NODE
                  }, {
                     text : M_TEXT.ADD_LINK_NODE,
                     aCode : AMAP.ADD_LINK_NODE
                  }],
                  listeners : listeners
               });
               Ext.Array.replace(menus, type, 1, [menu]);
            }
            break;
         case NODE_TYPE.N_TYPE_INDEX:
            if(null == menus[type]){
               menu = new Ext.menu.Menu({
                  ignoreParentClicks : true,
                  items : [{
                     text : M_TEXT.MODIFY_NODE,
                     aCode : AMAP.MODIFY_NODE
                  }, {
                     text : M_TEXT.VIEW_NODE,
                     aCode : AMAP.VIEW_NODE
                  }],
                  listeners : listeners
               });
               Ext.Array.replace(menus, type, 1, [menu]);
            }
            break;
         case NODE_TYPE.N_TYPE_SINGLE:
         case NODE_TYPE.N_TYPE_LINK:
            if(null == menus[type]){
               menu = new Ext.menu.Menu({
                  ignoreParentClicks : true,
                  items : [{
                     text : M_TEXT.MODIFY_NODE,
                     aCode : AMAP.MODIFY_NODE
                  }, {
                     text : M_TEXT.RM_NODE,
                     aCode : AMAP.RM_NODE
                  }, {
                     text : M_TEXT.VIEW_NODE,
                     aCode : AMAP.VIEW_NODE
                  }],
                  listeners : listeners
               });
               Ext.Array.replace(menus, type, 1, [menu]);
            }
            break;
         case NODE_TYPE.N_TYPE_GENERAL:
            if(null == menus[type]){
               menu = new Ext.menu.Menu({
                  ignoreParentClicks : true,
                  items : [{
                     text : M_TEXT.MODIFY_NODE,
                     aCode : AMAP.MODIFY_NODE
                  }, {
                     text : M_TEXT.ADD_GENERAL_NODE,
                     aCode : AMAP.ADD_GENERAL_NODE
                  }, {
                     text : M_TEXT.ADD_SINGLE_NODE,
                     aCode : AMAP.ADD_SINGLE_NODE
                  }, {
                     text : M_TEXT.ADD_LINK_NODE,
                     aCode : AMAP.ADD_LINK_NODE

                  }, {
                     text : M_TEXT.RM_NODE,
                     aCode : AMAP.RM_NODE
                  }, {
                     text : M_TEXT.VIEW_NODE,
                     aCode : AMAP.VIEW_NODE
                  }],
                  listeners : listeners
               });
               Ext.Array.replace(menus, type, 1, [menu]);

            }
            break;
      }
      return menus[type];
   },

   /*
    * 菜单项点击处理函数
    */
   menuItemClickHandler : function(menu, item)
   {
      var node = menu.node;
      if(item && !item.isDisabled() && this.hasListeners.categorymenuclick){
         this.fireEvent('categorymenuclick', item.aCode, node);
      }
   },

   destroy : function()
   {
      var menus = this.contextMenus;
      var len = menus.length;
      var menu;
      if(len > 0){
         for(var i = 0; i < len; i++) {
            menu = menus.pop();
            if(menu){
               menu.destroy();
            }
         }
      }
      for(var i = 0; i < 6; i++) {
         this.contextMenus.push(null);
      }
      this.callParent();
   }
});