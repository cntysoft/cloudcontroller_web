/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 * @createtime 2015/08/07 3:32 PM
 */
Ext.define('App.Sys.Searcher.Widget.GoodsIndexBuilder', {
   extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires: [
      'App.Sys.Searcher.Comp.GoodsCategoryTree',
      'App.Sys.Searcher.Ui.Goods.ListView',
      'App.Sys.Searcher.Ui.Goods.Builder'
   ],
   mixins: {
      multiTabPanel: 'SenchaExt.Mixin.MultiTabPanel'
   },
   panelClsMap: {
      ListView: 'App.Sys.Searcher.Ui.Goods.ListView'
   },
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT('GOODS_INDEX_BUILDER');
   },
   initLangTextRef: function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('GOODS_INDEX_BUILDER');
   },
   /**
    * {@link WebOs.Mixin.MultiTabPanel#initPanelType initPanelType}
    * @property {String} initPanelType
    */
   initPanelType: 'ListView',
   contextMenuRef: null,
   builderWinRef: null,
   applyConstraintConfig: function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         layout: 'border',
         width: 1000,
         minWidth: 1000,
         minHeight: 550,
         height: 550,
         resizable: false,
         bodyStyle: 'background:#ffffff',
         maximizable: true,
         maximized: true
      });
   },
   initComponent: function()
   {
      Ext.apply(this, {
         items: [
            this.getGoodsCategoryTreeConfig(),
            this.getTabPanelConfig()
         ]
      });
      this.callParent();
   },
   getGoodsCategoryTreeConfig: function()
   {
      return {
         xtype: 'syssearchercompgoodscategorytree',
         region: 'west',
         width: 250,
         margin: '0 2 0 0',
         listeners: {
            itemclick: this.itemClickHandler,
            itemcontextmenu: this.itemContextMenuHandler,
            scope: this
         }
      };
   },
   itemClickHandler: function(tree, record)
   {
      if (record.get('nodeType') == 3) {
         var panel = this.getCurrentActivePanel();
         if (panel.panelType == 'ListView') {
            panel.loadCategoryGoodsInfo(record.get('id'));
         }
      }
   },
   itemContextMenuHandler: function(tree, record, item, index, event)
   {
      if (record.get('nodeType') != 3) {
         return;
      }
      var menu = this.getContextMenu(record);
      menu.record = record;
      var pos = event.getXY();
      event.stopEvent();
      menu.showAt(pos[0], pos[1]);
   },
   getContextMenu: function(record)
   {
      var L = this.LANG_TEXT.MENU;
      if (null == this.contextMenuRef) {
         this.contextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks: true,
            items: [{
                  text: L.BUILD,
                  listeners: {
                     click: function(item)
                     {
                        var record = item.parentMenu.record;
                        this.buildCategoryIndex(record, false);
                     },
                     scope: this
                  }
               }, {
                  text: L.FORCE_BUILD,
                  listeners: {
                     click: function(item)
                     {
                        var record = item.parentMenu.record;
                        this.buildCategoryIndex(record, true);
                     },
                     scope: this
                  }
               }, {
                  text: L.DELETE,
                  listeners: {
                     click: function(item)
                     {
                        var record = item.parentMenu.record;
                        this.deleteCategoryIndex(record, true);
                     },
                     scope: this
                  }
               }]
         });
      }
      return this.contextMenuRef;
   },
   buildCategoryIndex: function(record, force)
   {
      var builder = this.getBuilderWin();
      builder.center();
      builder.setCategoryName(record.get('text'));
      builder.setCategoryId(record.get('id'));
      builder.setForceBuild(force);
      builder.setOperateType(Ext.getClass(builder).OP_TYPE_BUILD);
      builder.show();
   },
   deleteCategoryIndex: function(record, force)
   {
      var builder = this.getBuilderWin();
      builder.center();
      builder.setCategoryName(record.get('text'));
      builder.setCategoryId(record.get('id'));
      builder.setForceBuild(force);
      builder.setOperateType(Ext.getClass(builder).OP_TYPE_DELETE);
      builder.show();
   },
   getBuilderWin: function()
   {
      return new App.Sys.Searcher.Ui.Goods.Builder({
         appRef: this.appRef,
         listeners: {
            buildcomplete: function(cid)
            {
               var panel = this.getCurrentActivePanel();
               if (panel.panelType == 'ListView') {
                  panel.reloadGoodsList();
               }
            },
            deletecomplete: function()
            {
               
               var panel = this.getCurrentActivePanel();
               if (panel.panelType == 'ListView') {
                  panel.reloadGoodsList();
               }
            },
            scope: this
         }
      });
   },
   destroy: function()
   {
      if (this.contextMenuRef) {
         this.contextMenuRef.destroy();
         delete this.contextMenuRef;
      }
      this.callParent();
   }
});