/*
 * Cntysoft Cloud Software Team
 *
 * @author ZhiHui <liuyan2526@qq.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 该类用来展示被冻结的活动列表
 * 
 * @param {type} param1
 * @param {type} param2
 */
Ext.define('App.ZhuChao.MarketMgr.Ui.PreferAct.PreferActList', {
   extend : 'Ext.grid.Panel',
   requires : [
      'App.ZhuChao.MarketMgr.Const'
   ],
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.MarketMgr',
   gridRef : null,
   menuRef : null,
   gridStoreRef : null,
   constructor : function (config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('PREFERACT.PREFERACTLIST');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig : function (config)
   {
      Ext.apply(config, {
         title : this.LANG_TEXT.TITLE
      });
   },
   initComponent : function ()
   {
      var store = this.createGridStore();
      Ext.apply(this, {
         store : store,
         bbar : Ext.create('Ext.PagingToolbar', {
            store : store,
            displayInfo : true,
            emptyMsg : this.LANG_TEXT.EMPTY
         }),
         columns : [
            {text : this.LANG_TEXT.ID, dataIndex : 'id', resizable : false, menuDisabled : true, width : 200},
            {text : this.LANG_TEXT.NAME, dataIndex : 'text', resizable : false, menuDisabled : true, flex : 1},
            {text : this.LANG_TEXT.INTRO, dataIndex : 'intro', resizable : false, menuDisabled : true, flex : 1},
            {text : this.LANG_TEXT.STATUS, dataIndex : 'status', resizable : false, menuDisabled : true, flex : 1}
         ],
         listeners : {
            afterrender : function (grid){
               this.gridRef = grid;
            },
            itemcontextmenu : this.contextMenuHandler,
            scope : this
         }
      });
      this.callParent();
   },
   contextMenuHandler : function (tree, record, item, index, event, eOpts)
   {
      if(!record.root){
         var menu = this.createContextMenu(record);
         menu.record = record;
         var pos = event.getXY();
         event.stopEvent();
         menu.showAt(pos[0], pos[1]);
      }
   },
   createContextMenu : function (record)
   {
      var MENU = App.ZhuChao.MarketMgr.Const;
      if(null == this.menuRef){
         this.menuRef = new Ext.menu.Menu({
            width : 140,
            record : record,
            items : [{
                  text : this.LANG_TEXT.DELETE,
                  identifier : MENU.MENU_DELETE_PREFERACT
               }, {
                  text : this.LANG_TEXT.ACTIVE,
                  identifier : MENU.MENU_ACTIVE_PREFERACT
               }],
            listeners : {
               click : this.contextMenuClickHandler,
               scope : this
            }
         });
      }
      ;
      return this.menuRef;
   },
   contextMenuClickHandler : function (menu, item)
   {
      var MENU = App.ZhuChao.MarketMgr.Const;
      if(MENU.MENU_DELETE_PREFERACT == item.identifier){
         var values = menu.record.getId();
         this.setLoading(this.LANG_TEXT.INDELETE);
         this.mainPanelRef.appRef.deletePreferAct({id : values}, function (response){
            this.loadMask.hide();
            if(!response.status){
               Cntysoft.showErrorWindow(response.msg);
            } else{
               this.store.reload();
               Cntysoft.showAlertWindow(this.LANG_TEXT.DELETESUCCESS);
            }
         }, this);
      } else if(MENU.MENU_ACTIVE_PREFERACT == item.identifier){
         var values = menu.record.getId();
         this.setLoading(this.LANG_TEXT.INACTIVE);
         this.mainPanelRef.appRef.activePreferAct({id : values}, function (response){
            this.loadMask.hide();
            if(!response.status){
               Cntysoft.showErrorWindow(response.msg);
            } else{
               this.mainPanelRef.treeRef.store.reload();
               this.reloadGridPageFirst(this.gridRef.getStore());
               Cntysoft.showAlertWindow(this.LANG_TEXT.ACTIVESUCCESS);
            }
         }, this);
      }
   },
   reloadGridPageFirst : function (store, params)
   {
      store.addListener('load', function (store, records){
         store.currentPage = 1;
         if(params){
            store.load({
               params : params
            });
         }else{
            store.load();
         }
      }, this, {
         single : true
      });
      if(params){
         store.load({
            params : params
         });
      } else{
         store.load();
      }
   },
   createGridStore : function ()
   {
      var MENU = App.ZhuChao.MarketMgr.Const;
      if(null == this.gridStoreRef){
         this.gridStoreRef = new Ext.data.Store({
            autoLoad : true,
            pageSize : 25,
            fields : [
               {name : 'id', type : 'integer', persist : false},
               {name : 'text', type : 'string', persist : false},
               {name : 'intro', type : 'string', persist : false},
               {name : 'status', type : 'integer', persist : false}
            ],
            proxy : {
               type : 'apigateway',
               callType : 'App',
               invokeMetaInfo : {
                  module : 'ZhuChao',
                  name : 'MarketMgr',
                  method : 'PreferAct/getPreferActGridList'
               },
               pArgs : [{
                     key : 'status',
                     value : MENU.PREFERACT_STATUS_FREEZE
                  },{
                     key : 'page',
                     value : true
                  }],
               reader : {
                  type : 'json',
                  rootProperty : 'items',
                  totalProperty : 'total'
               }
            }
         });
      }
      return this.gridStoreRef;
   },
   destroy : function ()
   {
      delete this.gridRef;
      delete this.gridStoreRef;
      if(this.menuRef){
         this.menuRef.destroy();
      }
      delete this.menuRef;
      this.callParent();
   }
});

