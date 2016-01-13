/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.Searcher.Widget.GInfosIndexBuilder', {
   extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires: [
      'App.Sys.Searcher.Ui.GInfos.ListView',
      'App.Sys.Searcher.Comp.GInfosCategoryTree',
      'App.Sys.Searcher.Ui.GInfos.Builder'
   ],
   mixins: {
      multiTabPanel: 'SenchaExt.Mixin.MultiTabPanel'
   },
   panelClsMap: {
      ListView: 'App.Sys.Searcher.Ui.GInfos.ListView'
   },
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT('GINFO_INDEX_BUILDER');
   },
   initLangTextRef: function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('GINFO_INDEX_BUILDER');
   },
   initPanelType: 'ListView',
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
            this.getGInfosCategoryTreeConfig(),
            this.getTabPanelConfig()
         ]
      });
      this.callParent();
   },
   getGInfosCategoryTreeConfig: function()
   {
      return {
         xtype: 'syssearchercompginfoscategorytree',
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
   panelExistHandler: function(panel, config)
   {
      if ('ListView' == panel.panelType) {
         panel.setLoadId(config.loadId);
      }
   },
   itemContextMenuHandler: function(tree, record, item, index, event)
   {
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
      return new App.Sys.Searcher.Ui.GInfos.Builder({
         appRef: this.appRef,
         listeners: {
            buildcomplete: function(cid)
            {
               var panel = this.getCurrentActivePanel();
               if (panel.panelType == 'ListView') {
                  panel.reloadGInfosList();
               }
            },
            deletecomplete: function(cid)
            {
               var panel = this.getCurrentActivePanel();
               if (panel.panelType == 'ListView') {
                  panel.reloadGInfosList();
               }
            },
            scope: this
         }
      });
   },
   /**
    * 树节点左键点击
    */
   itemClickHandler: function(view, record)
   {
      this.renderPanel('ListView', {
         title: record.get('text'),
         loadId: record.get('id')
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