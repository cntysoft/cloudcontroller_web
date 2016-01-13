/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 凤凰筑巢商品分类管理入口WIDGET
 */
Ext.define('App.ZhuChao.CategoryMgr.Widget.Entry', {
   extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires : [
      'App.ZhuChao.CategoryMgr.Comp.CategoryTree',
      'App.ZhuChao.CategoryMgr.Ui.Attrs.DetailPanel',
      'App.ZhuChao.CategoryMgr.Ui.Attrs.PathInfoPanel',
      'App.ZhuChao.CategoryMgr.Ui.Attrs.QueryAttrPanel',
      'App.ZhuChao.CategoryMgr.Ui.Attrs.WelcomePanel'
   ],
   mixins: {
      multiTabPanel: 'SenchaExt.Mixin.MultiTabPanel'
   },
   panelClsMap: {
      Welcome : 'App.ZhuChao.CategoryMgr.Ui.Attrs.WelcomePanel',
      PathInfoPanel : 'App.ZhuChao.CategoryMgr.Ui.Attrs.PathInfoPanel',
      DetailAttrPanel : 'App.ZhuChao.CategoryMgr.Ui.Attrs.DetailPanel',
      QueryAttrPanel : 'App.ZhuChao.CategoryMgr.Ui.Attrs.QueryAttrPanel'
   },

   /**
    * {@link WebOs.Mixin.MultiTabPanel#initPanelType initPanelType}
    * @property {String} initPanelType
    */
   initPanelType : 'Welcome',
   categoryTreeRef : null,
   rootNodeContextMenuRef : null,
   topNodeContextMenuRef : null,
   subNodeContextMenuRef : null,
   detailNodeContextMenuRef : null,
   initPmTextRef : function()
   {
      this.pmText = this.GET_PM_TEXT('ENTRY');
   },

   initLangTextRef : function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('ENTRY');
   },

   applyConstraintConfig : function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         layout : 'border',
         width : 1000,
         minWidth : 1000,
         minHeight : 500,
         height : 500,
         resizable : true,
         bodyStyle : 'background:#ffffff',
         maximizable : true,
         maximized : true
      });
   },

   initComponent : function()
   {
      Ext.apply(this,{
         items : [
            this.getCategoryTreePanelConfig(),
            this.getTabPanelConfig()
         ]
      });
      this.callParent();
   },

   itemContextMenuHandler : function(tree, record, item, index, event)
   {
      var menu = this.getContextMenu(record);
      menu.record = record;
      var pos = event.getXY();
      event.stopEvent();
      menu.showAt(pos[0], pos[1]);
   },

   getContextMenu : function(record)
   {
      var L = this.LANG_TEXT.MENU;
      var C = App.ZhuChao.CategoryMgr.Const;
      if(record.isRoot()){
         if(null == this.rootNodeContextMenuRef){
            this.rootNodeContextMenuRef = new Ext.menu.Menu({
               ignoreParentClicks : true,
               items : [{
                  text : L.ROOT,
                  listeners : {
                     click : function()
                     {
                        this.renderPanel('PathInfoPanel',{
                           appRef : this.appRef,
                           mode : 1,
                           pid : 0
                        });
                     },
                     scope : this
                  }
               }]
            });
         }
         return this.rootNodeContextMenuRef;
      }else{
         var nodeType = record.get('nodeType');
         if(C.NODE_TYPE_TOP_CATEGORY == nodeType){
            this.topNodeContextMenuRef = new Ext.menu.Menu({
               ignoreParentClicks : true,
               items : [{
                  text : L.TOP,
                  listeners : {
                     click : function()
                     {
                        this.renderPanel('PathInfoPanel',{
                           appRef : this.appRef,
                           mode : 1,
                           pid : record.get('id')
                        });
                     },
                     scope : this
                  }
               },{
                  text : L.MODIFY_INFO,
                  listeners : {
                     click : function()
                     {
                        this.renderPanel('PathInfoPanel',{
                           appRef : this.appRef,
                           mode : 2,
                           targetLoadId : record.get('id')
                        });
                     },
                     scope : this
                  }
               }]
            });
            return this.topNodeContextMenuRef;
         }else if(C.NODE_TYPE_SUB_CATEGORY == nodeType){
            this.subNodeContextMenuRef = new Ext.menu.Menu({
               ignoreParentClicks : true,
               items : [{
                  text : L.SUB,
                  listeners : {
                     click : function()
                     {
                        this.renderPanel('DetailAttrPanel',{
                           appRef : this.appRef,
                           mode : 1,
                           pid : record.get('id')
                        });
                     },
                     scope : this
                  }
               },{
                  text : L.MODIFY_INFO,
                  listeners : {
                     click : function()
                     {
                        this.renderPanel('PathInfoPanel',{
                           appRef : this.appRef,
                           mode : 2,
                           targetLoadId : record.get('id')
                        });
                     },
                     scope : this
                  }
               }]
            });
            return this.subNodeContextMenuRef;
         }else if(C.NODE_TYPE_DETAIL_CATEGORY == nodeType){
            this.detailNodeContextMenuRef = new Ext.menu.Menu({
               ignoreParentClicks : true,
               items : [{
                  text : L.MODIFY_INFO,
                  listeners : {
                     click : function()
                     {
                        this.renderPanel('DetailAttrPanel',{
                           appRef : this.appRef,
                           mode : 2,
                           targetLoadId : record.get('id')
                        });
                     },
                     scope : this
                  }
               },{
                  text : L.MODIFY_QUERY_ATTR,
                  listeners : {
                     click : function()
                     {
                        this.renderPanel('QueryAttrPanel',{
                           appRef : this.appRef,
                           targetLoadId : record.get('id')
                        });
                     },
                     scope : this
                  }
               }]
            });
            return this.detailNodeContextMenuRef;
         }
      }
   },

   getCategoryTreePanelConfig : function()
   {
      return {
         xtype : 'zhuchaocategorymgrcompcategorytree',
         region : 'west',
         width : 300,
         margin : '0 1 0 0',
         collapsible : true,
         listeners : {
            afterrender : function(comp)
            {
               this.categoryTreeRef = comp;
            },
            itemcontextmenu : this.itemContextMenuHandler,
            itemdblclick : this.itemdblClickHandler,
            scope : this
         }
      };
   },

   itemdblClickHandler : function(tree, record)
   {
      var nodeType = record.get('nodeType');
      var C = App.ZhuChao.CategoryMgr.Const;
      if(nodeType == C.NODE_TYPE_DETAIL_CATEGORY){
         this.renderPanel('DetailAttrPanel',{
            appRef : this.appRef,
            mode : 2,
            targetLoadId : record.get('id')
         });
      }
   },

   panelExistHandler : function(panel, config)
   {
      var C = CloudController.Const;
      if(panel.panelType == 'PathInfoPanel'){
         if(!config || config.mode == C.NEW_MODE){
            panel.gotoNewMode(true);
            panel.pid = config.pid;
         } else{
            panel.loadNode(config.targetLoadId);
         }
      }else if(panel.panelType == 'DetailAttrPanel'){
         if(!config || config.mode == C.NEW_MODE){
            panel.gotoNewMode(true);
            panel.pid = config.pid;
         } else{
            panel.loadNode(config.targetLoadId);
         }
      }else if(panel.panelType == 'QueryAttrPanel'){
         panel.loadQueryAttrs(config.targetLoadId);
      }
   },

   destroy : function()
   {
      delete this.categoryTreeRef;
      if(this.rootNodeContextMenuRef){
         this.rootNodeContextMenuRef.destroy();
      }
      delete this.rootNodeContextMenuRef;
      if(this.topNodeContextMenuRef){
         this.topNodeContextMenuRef.destroy();
      }
      delete this.topNodeContextMenuRef;
      if(this.subNodeContextMenuRef){
         this.subNodeContextMenuRef.destroy();
      }
      delete this.subNodeContextMenuRef;
      if(this.detailNodeContextMenuRef){
         this.detailNodeContextMenuRef.destroy();
      }
      delete this.detailNodeContextMenuRef;
      this.callParent();
   }
});