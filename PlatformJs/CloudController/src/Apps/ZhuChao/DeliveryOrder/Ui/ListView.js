/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license   http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.DeliveryOrder.Ui.ListView', {
   extend : 'Ext.grid.Panel',

   mixins: {
      langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
   },
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    */
   runableLangKey : 'App.ZhuChao.DeliveryOrder',
   /**
    * @inheritdoc
    */
   panelType : 'ListView',
   
   targetLoadId : 0,
   contextMenuRef : null,
   
   constructor : function(config)
   {
      config = config || {};
      if(config.targetLoadId){
         this.targetLoadId = config.targetLoadId;
      }
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.LIST_VIEW');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   
   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         border : true,
         title : this.LANG_TEXT.TITLE,
         emptyText : this.LANG_TEXT.EMPTY_TEXT
      });
   },
   
   initComponent : function()
   {
      var F = this.LANG_TEXT.FIELDS;
      var store = this.createDataStore();
      Ext.apply(this, {
         bbar : Ext.create('Ext.PagingToolbar', {
            store : store,
            displayInfo : true,
            emptyMsg : this.emptyText
         }),
         store : store,
         columns : [
            {text : F.ID, dataIndex : 'id', width : 100, resizable : false, sortable : false, menuDisabled : true},
            {text : F.NO, dataIndex : 'number', width : 130 , resizable : false, sortable : false, menuDisabled : true},
            {text : F.CODE, dataIndex : 'code', flex : 1, resizable : false, sortable : false, menuDisabled : true},
            {text : F.PRICE, dataIndex : 'price', width : 100, resizable : false, sortable : false, menuDisabled : true},
            {text : F.ISSUER, dataIndex : 'issuer', width : 100, resizable : false, sortable : false, menuDisabled : true},
            {text : F.ISSUE_TIME, dataIndex : 'issueTime', width : 130, resizable : false, sortable : false, menuDisabled : true},
            {text : F.STATUS, dataIndex : 'status', width : 100, resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.statusRender, this)}
         ],
         selModel: {
            mode: "MULTI"
         },
         tbar : this.getTbarConfig(),
         listeners : {
            afterrender : function(grid)
            {
               this.gridRef = grid;
            },
            itemcontextmenu : function(grid, record, htmlItem, index, event)
            {
               var menu = this.getContextMenu();
               menu.record = record;
               var pos = event.getXY();
               event.stopEvent();
               menu.showAt(pos[0], pos[1]);
            },
            scope : this
         }
      });
      this.callParent();
   },
   
   getTbarConfig : function()
   {
      var FIELDS = this.LANG_TEXT.FIELDS, STATUS = this.LANG_TEXT.STATUS, BTNS = this.LANG_TEXT.BTNS;
      return [
         {xtype : 'tbtext', html: FIELDS.SEARCH},
         {
            xtype : 'form',
            layout : 'hbox',
            defaults : {
               style : 'margin-right : 5px',
               width : 200,
               labelWidth : 80
            },
            items : [{
               xtype : 'combo',
               fieldLabel : FIELDS.STATUS,
               name : 'status',
               queryMode : 'local',
               editable : false,
               store : Ext.create('Ext.data.Store', {
                  fields : ['code', 'text'],
                  data : [
                     {text : STATUS.ALL, code : 0},
                     {text : STATUS.UN_USED, code : 1},
                     {text : STATUS.USED, code : 2}
                  ]
               }),
               value : 0,
               displayField : 'text',
               valueField : 'code'
            }, {
               xtype : 'textfield',
               fieldLabel : FIELDS.NUMBER_START,
               name : 'start_number'
            }, {
               xtype : 'textfield',
               fieldLabel : FIELDS.NUMBER_END,
               name : 'end_number'
            }, { 
               xtype : 'button', 
               text : BTNS.SEARCH,
               width : 80,
               listeners : {
                  click : function(){
                     this.reloadGridPageFirst(this.gridRef.store);
                  },
                  scope : this
               }
            }],
            listeners : {
               afterrender : function(form){
                  this.formRef = form;
               },
               scope : this
            }
         }
      ];
   },
   
   reloadGridPageFirst : function(store, params)
   {
      store.addListener('load', function(store, records){
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
      }else {
         store.load();
      }
   },
      
   getContextMenu : function()
   {
      var L = this.LANG_TEXT.MENU, MSG = this.LANG_TEXT.MSG;
      if(null == this.contextMenuRef){
         this.contextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks : true,
            items : [{
               text : L.ISSUER,
               listeners : {
                  click : this.changeIssuerWinConfig,
                  scope : this
               }
            }]
         });
      }
      return this.contextMenuRef;
   },
   
   changeIssuerWinConfig : function()
   {
      var FIELDS = this.LANG_TEXT.FIELDS, BTNS = this.LANG_TEXT.BTNS, MSG = this.LANG_TEXT.MSG;
      return new Ext.window.Window({
         title : FIELDS.WIN_TITLE,
         autoShow : true,
         modal : true,
         bodyPadding : 10,
         items : [{
               xtype : 'form',
               items : [{
                  xtype : 'textfield',
                  fieldLabel : FIELDS.ISSUER,
                  name : 'issuer',
                  allowBlank : false
               }, {
                  xtype : 'datefield',
                  fieldLabel : FIELDS.ISSUE_TIME,
                  name : 'issueTime',
                  format : 'Y-m-d',
                  allowBlank : false
               }]
            }],
         buttons : [ {
            text : BTNS.ADD,
            listeners : {
               click : function (){
                  var form = this.doWinRef.down('form');
                  if(form.isValid()){
                     var values = form.getValues(), ids = [];
                     this.gridRef.store.each(function (record){
                        ids.push(record.get('id'));
                     });
                     values['ids'] = ids;
                     this.doWinRef.close();
                     this.setLoading(MSG.SAVING);
                     this.mainPanelRef.appRef.changeIssuer(values, function (response){
                        this.loadMask.hide();
                        if(!response.status){
                           Cntysoft.Kernel.Utils.processApiError(response);
                        } else{  
                           this.gridRef.store.reload();
                        }
                     }, this);
                  }
               },
               scope : this
            }
         }, {
            text : BTNS.CLOSE,
            listeners : {
               click : function (){
                  this.doWinRef.close();
               },
               scope : this
            }
         }],
         listeners : {
            afterrender : function (win){
               this.doWinRef = win;
            },
            scope : this
         }
      }); 
   },
   
   statusRender : function (value)
   {
      var STATUS = this.LANG_TEXT.STATUS;
      if(1 == value){
         return STATUS.UN_USED;
      }else if(2 == value){
         return STATUS.USED;
      }
   },
   
   createDataStore : function()
   {
      return new Ext.data.Store({
         autoLoad : true,
         pageSize : 200,
         fields : [
            {name : 'id', type : 'integer', persist : false},
            {name : 'number', type : 'string', persist : false},
            {name : 'code', type : 'string', persist : false},
            {name : 'status', type : 'integer', persist : false},
            {name : 'price', type : 'integer', persist : false},
            {name : 'issuer', type : 'string', persist : false},
            {name : 'issueTime', type : 'string', persist : false}
         ],
         proxy : {
            type : 'apigateway',
            callType : 'App',
            invokeMetaInfo : {
               module : 'ZhuChao',
               name : 'DeliveryOrder',
               method : 'Mgr/getDeliveryOrderListByActivity'
            },
            pArgs : [{
               key : 'activityId',
               value : this.targetLoadId
            }],
            reader : {
               type : 'json',
               rootProperty : 'items',
               totalProperty : 'total'
            }
         },
         listeners : {
            beforeload : function(store, operation){
               var values = this.formRef.getForm().getValues();
               operation.setParams(values);
            },
            scope : this
         }
      });
   },
   
   destroy : function()
   {
      this.callParent();
   }
});

