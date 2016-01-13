/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 排序列表显示面板
 */
Ext.define('App.Site.Category.Ui.Sorter.ListView', {
   extend : 'Ext.grid.Panel',
   alias : 'widget.sitecategoryuisorterlistview',
   requires : [
      'Cntysoft.Utils.Common'
   ],
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.Site.Category',

   //private
   appRef : null,
   orgOrderData : null,
   constructor : function(config)
   {
      this.title = this.GET_LANG_TEXT('SORTER.PANEL_TITLE');
      this.emptyText = this.GET_LANG_TEXT('SORTER.MSG.EMPTY_TEXT');
      this.callParent([config]);
   },
   initComponent : function()
   {
      var BTN = Cntysoft.GET_LANG_TEXT('UI.BTN');
      var COLS = this.GET_LANG_TEXT('SORTER.COLS');
      Ext.apply(this, {
         columns : [
            {text : COLS.ID, dataIndex : 'id', width : 100, resizable : false, sortable : false, menuDisabled : true},
            {text : COLS.TEXT, dataIndex : 'text', flex : 1, resizable : false, sortable : false, menuDisabled : true},
            {text : COLS.NODE_TYPE, dataIndex : 'nodeType', width : 100, resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.renderNodeType, this)}
         ],
         store : this.getListStore(),
         viewConfig : {
            plugins : {
               ptype : 'gridviewdragdrop',
               dragText : this.GET_LANG_TEXT('SORTER.MSG.DRAG_TEXT')
            },
            listeners : {
               drop : this.sortDropHandler,
               scope : this
            }
         },
         buttons : [{
            xtype : 'button',
            text : BTN.SAVE,
            listeners : {
               click : this.doSaveHandler,
               scope : this
            }
         }, {
            text : BTN.RESTORE,
            listeners : {
               click : this.restoreSortHandler,
               scope : this
            }
         }]
      });
      this.callParent();
   },
   sortDropHandler : function()
   {
      var store = this.getStore();
      var record;
      var len = store.getCount();

      for(var i = len - 1; i >= 0;i--) {
         record = store.getAt(i);
         record.set('priority', len - i);
      }

   },
   restoreSortHandler : function()
   {
      var org = this.orgOrderData;
      var len = org.length;
      var item;
      var record;
      var store = this.getStore();
      for(var i = 0; i < len; i++) {
         item = org[i];
         record = store.getById(item.id);
         record.set('priority', item.priority);
      }
      store.sort('priority', 'DESC');
   },
   doSaveHandler : function()
   {
      var store = this.getStore();
      var data = {};
      if(store.getCount() > 0){
         this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
         store.each(function(record){
            data[record.get('id')] = record.get('priority');
         }, this);
         this.appRef.reorderNodeList(data, this.afterSaveOrderHandler, this);
      }
   },
   afterSaveOrderHandler : function(response)
   {
      this.loadMask.hide();
      if(response.status){
         this.mainWidgetRef.treePanelRef.store.load();
      } else{
         Cntysoft.processApiError(response);
      }
   },
   /*
    * 获取列表数据仓库
    *
    * @return {Ext.data.Store}
    */
   getListStore : function()
   {
      return Ext.data.Store({
         fields : [
            {name : 'id', type : 'integer'},
            {name : 'text', type : 'string'},
            {name : 'priority', type : 'integer'},
            {name : 'nodeType', type : 'integer'}
         ],
         proxy : {
            type : 'apigateway',
            callType : 'App',
            invokeMetaInfo : {
               module : 'Site',
               name : 'Category',
               method : 'Structure/getChildren'
            },
            pArgs : [{
               key : 'allowTypes',
               value : [1, 2, 3, 4, 5]
            }, {
               key : 'extraFields',
               value : [
                  'nodeType',
                  'priority'
               ]
            }]
         },
         listeners : {
            load : this.dataLoadHandler,
            scope : this
         }
      });
   },
   loadNodeList : function(id)
   {
      var store = this.getStore();
      store.load({
         params : {
            id : id
         }
      });
   },
   dataLoadHandler : function(store, records)
   {
      //首先清空原始排序数据
      var order = this.orgOrderData = [];
      var len;
      var record;
      if(records.length > 0){
         len = records.length;
         for(var i = 0; i < len; i++) {
            record = records[i];
            order.push({
               id : record.get('id'),
               priority : record.get('priority')
            });
         }
      }
   },
   renderNodeType : function(value)
   {
      var MSG = this.GET_LANG_TEXT('SORTER');
      var APP = Ext.getClass(this.appRef);
      switch (value) {
         case APP.N_TYPE_SINGLE :
            return MSG.N_TYPE_SINGLE;
         case APP.N_TYPE_LINK :
            return MSG.N_TYPE_LINK;
         case APP.N_TYPE_GENERAL :
            return MSG.N_TYPE_GENERAL;
         case APP.N_TYPE_INDEX :
            return MSG.N_TYPE_INDEX;
      }
   },
   destroy : function()
   {
      delete this.appRef;
      delete this.mainWidgetRef;
      this.callParent();
   }
});