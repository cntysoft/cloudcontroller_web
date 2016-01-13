/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 * @createtime 2015/08/07 3:47 PM
 */
Ext.define('App.Sys.Searcher.Ui.Goods.ListView', {
   extend: 'Ext.grid.Panel',
   requires: [
      'App.Sys.Searcher.Ui.Goods.Builder'
   ],
   mixins: {
      langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
   },
   /**
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey: 'App.Sys.Searcher',
   panelType: 'ListView',
   categoryId: 0,
   constructor: function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.GOODS.LIST_VIEW');
      this.applyConstraintConfig(config);
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
      var F = this.LANG_TEXT.FIELDS;
      var store = this.createDataStore();
      Ext.apply(this, {
         tbar: this.getTBarConfig(),
         bbar: Ext.create('Ext.PagingToolbar', {
            store: store,
            displayInfo: true,
            emptyMsg: this.LANG_TEXT.EMPTY_GOODS
         }),
         store: store,
         columns: [
            {xtype: 'checkcolumn', width: 80, dataIndex: 'checked', text: F.CHECKED, resizable: false, sortable: false, menuDisabled: true},
            {text: F.ID, dataIndex: 'id', width: 120, resizable: false, sortable: false, menuDisabled: true},
            {text: F.TITLE, dataIndex: 'title', flex: 1, resizable: false, sortable: false, menuDisabled: true},
            {text: F.MERCHANT, dataIndex: 'merchant', width: 180, resizable: false, sortable: false, menuDisabled: true},
            {text: F.GENERATED, dataIndex: 'indexGenerated', width: 80, resizable: false, sortable: false, menuDisabled: true, renderer: Ext.bind(this.generateStatusRenderer, this)}
         ]
      });
      this.addListener({
         //itemcontextmenu : this.itemContextMenuHandler,
         scope: this
      });
      this.callParent();
   },
   loadCategoryGoodsInfo: function(cid)
   {
      if (this.categoryId != cid) {
         this.categoryId = cid;
         Cntysoft.Utils.Common.reloadGridPage(this.store);
      }
   },
   reloadGoodsList: function()
   {
      Cntysoft.Utils.Common.reloadGridPage(this.store);
   },
   generateStatusRenderer: function(status)
   {
      if (status) {
         return '<span style = "color:blue">' + this.LANG_TEXT.MSG.GENERATED + '</span>';
      } else {
         return '<span style = "color:red">' + this.LANG_TEXT.MSG.UNGENERATED + '</span>';
      }
   },
   createDataStore: function()
   {
      var me = this;
      return new Ext.data.Store({
         autoLoad: true,
         fields: [
            {name: 'id', type: 'integer', persist: false},
            {name: 'title', type: 'string', persist: false},
            {name: 'merchant', type: 'string', persist: false},
            {name: 'indexGenerated', type: 'boolean', persist: false}
         ],
         proxy: {
            type: 'apigateway',
            callType: 'App',
            invokeMetaInfo: {
               module: 'Sys',
               name: 'Searcher',
               method: 'IndexBuilder/getGoodsList'
            },
            reader: {
               type: 'json',
               rootProperty: 'items',
               totalProperty: 'total'
            },
            invokeParamsReady: function(params)
            {
               params.categoryId = me.categoryId;
               return params;
            }
         }
      });
   },
   checkAllHandler: function()
   {
      this.store.each(function(record) {
         record.set('checked', true);
      }, this);
   },
   unCheckAllHandler: function()
   {
      this.store.each(function(record) {
         record.set('checked', false);
      }, this);
   },
   startBuildHandler: function(force)
   {
      var records = [];
      this.store.each(function(record) {
         if (record.get('checked') == true) {
            records.push(record.get('id'));
         }
      }, this);
      if (records.length > 0) {
         this.setLoading(this.LANG_TEXT.MSG.BUILDING);
         this.mainPanelRef.appRef.buildGoodsIndexByIds(records, force, function(response) {
            this.loadMask.hide();
            if (!response.status) {
               Cntysoft.Kernel.Utils.processApiError(response);
            } else {
               Cntysoft.Utils.Common.reloadGridPage(this.store);
            }
         }, this);
      }
   },
   deleteIndexHandler: function()
   {
      var records = [];
      this.store.each(function(record) {
         if (record.get('checked') == true) {
            records.push(record.get('id'));
         }
      }, this);
      if (records.length > 0) {
         this.setLoading(this.LANG_TEXT.MSG.DELETING);
         this.mainPanelRef.appRef.deleteGoodsIndexByIds(records, function(response) {
            this.loadMask.hide();
            if (!response.status) {
               Cntysoft.Kernel.Utils.processApiError(response);
            } else {
               Cntysoft.Utils.Common.reloadGridPage(this.store);
            }
         }, this);
      }
   },
   getTBarConfig: function()
   {
      var BTN = this.LANG_TEXT.BTN;
      return [{
            text: BTN.CHECKED_ALL,
            listeners: {
               click: this.checkAllHandler,
               scope: this
            }
         }, {
            text: BTN.UNCHECKED,
            listeners: {
               click: this.unCheckAllHandler,
               scope: this
            }
         }, {
            text: BTN.START_BUILD,
            listeners: {
               click: Ext.bind(this.startBuildHandler, this, [false]),
               scope: this
            }
         }, {
            text: BTN.FORCE_BUILD,
            listeners: {
               click: Ext.bind(this.startBuildHandler, this, [true]),
               scope: this
            }
         }, {
            text: BTN.DELETE_INDEX,
            listeners: {
               click: this.deleteIndexHandler,
               scope: this
            }
         }];
   },
   destroy: function()
   {
      this.mixins.langTextProvider.destroy.call(this);
      delete this.mainPanelRef;
      this.callParent();
   }
});