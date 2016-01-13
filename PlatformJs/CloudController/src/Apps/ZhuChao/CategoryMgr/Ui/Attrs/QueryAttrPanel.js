/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 商品分类节点查询属性
 */
Ext.define('App.ZhuChao.CategoryMgr.Ui.Attrs.QueryAttrPanel', {
   extend: 'Ext.grid.Panel',
   requires: [
      'App.ZhuChao.CategoryMgr.Comp.QueryAttrsWindow'
   ],
   mixins: {
      langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
   },
   /**
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey: 'App.ZhuChao.CategoryMgr',
   /**
    * @inheritdoc
    */
   panelType: 'QueryAttrPanel',
   queryAttrWinRef: null,
   targetLoadId: -1,
   orgLoadedAttrs: null,
   contextMenuRef: null,
   deleteAttrs : [],
   constructor: function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.ATTRS.QUERY_ATTR');
      this.applyConstraintConfig(config);
      if (!Ext.isDefined(config.targetLoadId) || !Ext.isNumber(config.targetLoadId)) {
         Ext.Error.raise({
            cls: Ext.getClassName(this),
            method: 'constructor',
            msg: 'target load id must not be empty'
         });
      }
      this.callParent([config]);
   },
   applyConstraintConfig: function(config)
   {
      Ext.apply(config, {
         title: this.LANG_TEXT.TITLE
      });
   },
   initComponent: function()
   {
      var COLS = this.LANG_TEXT.COLS;
      Ext.apply(this, {
         tbar: [{
               xtype: 'button',
               text: this.LANG_TEXT.BTN.ADD_ATTR,
               listeners: {
                  click: function() {
                     var win = this.getQueryAttrWindow();
                     win.gotoNewMode();
                     win.center();
                     win.show();
                  },
                  scope: this
               }
            }],
         buttons: [{
               text: Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
               listeners: {
                  click: this.saveHandler,
                  scope: this
               }
            }, {
               text: Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
               listeners: {
                  click: function()
                  {
                     this.mainPanelRef.renderPanel('Welcome');
                  },
                  scope: this
               }
            }],
         emptyText: this.LANG_TEXT.MSG.EMPTY_TEXT,
         store: new Ext.data.Store({
            fields: [
               {name: 'id', type: 'integer', persist: false},
               {name: 'categoryId', type: 'integer', persist: false},
               {name: 'name', type: 'string', persist: false},
               {name: 'optValues', type: 'string', persist: false}
            ]
         }),
         columns: [
            {text: COLS.NAME, dataIndex: 'name', width: 200, resizable: false, sortable: false, menuDisabled: true},
            {text: COLS.OPT_VALUES, dataIndex: 'optValues', flex: 1, resizable: false, sortable: false, menuDisabled: true}
         ],
         listeners: {
            itemdblclick: this.modifyRequestHandler,
            itemcontextmenu: this.itemContextMenuHandler,
            scope: this
         }
      });
      this.addListener({
         afterrender: function()
         {
            if (-1 != this.targetLoadId) {
               this.loadQueryAttrs(this.targetLoadId);
            }
         },
         scope: this
      });
      this.callParent();
   },
   getQueryAttrWindow: function()
   {
      if (!this.queryAttrWinRef) {
         this.queryAttrWinRef = new App.ZhuChao.CategoryMgr.Comp.QueryAttrsWindow({
            appRef: this.mainPanelRef.appRef,
            categoryId: this.targetLoadId,
            listeners: {
               saverequest: this.saveRequestHandler,
               scope: this
            }
         });
      }
      return this.queryAttrWinRef;
   },
   /**
    * 加载指定分类的查询属性
    * 
    * @param {Integer} categoryId
    */
   loadQueryAttrs: function(categoryId)
   {
      this.targetLoadId = categoryId;
      var win = this.getQueryAttrWindow();
      win.setTargetCategory(categoryId);
      this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
      this.appRef.getCategoryQueryAttrs(categoryId, function(response) {
         this.loadMask.hide();
         if (!response.status) {
            Cntysoft.Kernel.Utils.processApiError(response);
         } else {
            this.orgLoadedAttrs = response.data;
            this.store.loadData(response.data);
         }
      }, this);
   },
   saveHandler: function()
   {
      var newAttrs = [];
      var updateAttrs = [];
      var mode = this.mode;
      this.store.each(function(record) {
         var d = record.getData();
         if (record.phantom) {
            delete d.id;
            newAttrs.push(d);
         } else {
            updateAttrs.push(d);
         }
      }, this);
      
      this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
      this.appRef.saveCategoryQueryAttrs(this.targetLoadId, {
         newAttrs: newAttrs,
         deleteAttrs: this.deleteAttrs,
         updateAttrs: updateAttrs
      }, function(response) {
         this.loadMask.hide();
         if (!response.status) {
            Cntysoft.Kernel.Utils.processApiError(response);
         }
      }, this);
   },
   modifyRequestHandler: function(grid, record)
   {
      var win = this.getQueryAttrWindow();
      win.center();
      win.loadQueryAttrValues(record.getData());
      win.show();
   },
   itemContextMenuHandler: function(tree, record, item, index, event)
   {
      var menu = this.getContextMenu();
      menu.record = record;
      var pos = event.getXY();
      event.stopEvent();
      menu.showAt(pos[0], pos[1]);
   },
   getContextMenu: function()
   {
      var L = this.LANG_TEXT.MENU;
      if (null == this.contextMenuRef) {
         this.contextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks: true,
            items: [{
                  text: L.MODIFY_ATTR,
                  listeners: {
                     click: function()
                     {
                     },
                     scope: this
                  }
               }, {
                  text: L.DELETE_ATTR,
                  listeners: {
                     click: function(item)
                     {
                        var record = item.parentMenu.record;
                        this.store.remove(record);
                        if(!record.phantom){
                           this.deleteAttrs.push(record.get('id'));
                        }
                     },
                     scope: this
                  }
               }]
         });
      }
      return this.contextMenuRef;
   },
   saveRequestHandler: function(data, mode)
   {
      //这里不管是否是新加
      var record = this.store.findRecord('name', data.name);
      if (null == record) {
         this.store.add({
            categoryId: this.targetLoadId,
            name: data.name,
            optValues: data.optValues
         });
      } else {
         record.set('optValues', data.optValues);
      }
   },
   destroy: function()
   {
      if (this.queryAttrWinRef) {
         this.queryAttrWinRef.destroy();
         delete this.queryAttrWinRef;
      }
      if (this.contextMenuRef) {
         this.contextMenuRef.destroy();
         delete this.contextMenuRef;
      }
      delete this.orgLoadedAttrs;
      delete this.mainPanelRef;
      delete this.appRef;
      delete this.deleteAttrs;
      this.callParent();
   }
});
