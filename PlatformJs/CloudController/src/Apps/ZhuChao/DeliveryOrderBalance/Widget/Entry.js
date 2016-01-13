/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license   http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.DeliveryOrderBalance.Widget.Entry', {
   extend : 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires : [
      'Ext.grid.column.RowNumberer',
      'Ext.grid.feature.Summary',
      'Ext.Img',
      'Ext.grid.column.Template',
      'Ext.grid.column.Date'
   ],
   contextMenuRef : null,
   constructor : function (config)
   {
      config = config || {};
      this.callParent([config]);
   },
   initPmTextRef : function ()
   {
      this.pmText = this.GET_PM_TEXT('ENTRY');
   },
   initLangTextRef : function ()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.ENTRY');
   },
   applyConstraintConfig : function (config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         minWidth : 1000,
         minHeight : 500,
         bodyStyle : 'backgroud:#fff',
         maximizable : false,
         maximized : true
      });
   },
   initComponent : function ()
   {
      Ext.apply(this, {
         items : [
            this.getOrderGridConfig()
         ]
      });
      this.callParent();
   },
   
   getOrderGridConfig : function()
   {
      var FIELDS = this.LANG_TEXT.FIELDS;
      var store = this.createOrderGridStore();
      return {
         xtype : 'grid',
         autoScroll : true,
         emptyText : FIELDS.EMPTY_TEXT,
         store : store,
         features: [{
            ftype: 'summary',
            dock : 'bottom'
         }],
         columns : [
            {xtype: 'rownumberer', width : 100, text : FIELDS.ID},
            {text : FIELDS.TIME, dataIndex : 'orderTime', xtype: 'datecolumn', width : 150, menuDisabled : true, resizable : false, sortable : true, format:'Y-m-d', align : 'center'},
            {text : FIELDS.MECHANT, dataIndex : 'merchant', flex : 1, menuDisabled : true, resizable : false, sortable : false, align : 'center'},
            {text : FIELDS.TOTAL_PRICE, dataIndex : 'totalPrice', flex : 1, menuDisabled : true, resizable : false, sortable : false, align : 'center', summaryType: 'sum', summaryRenderer : Ext.bind(this.summaryRenderer, this, [FIELDS.TOTAL_PRICE_SUM], true)},
            {text : FIELDS.PAR_PRICE, dataIndex : 'price', flex : 1, menuDisabled : true, resizable : false, sortable : false, align : 'center', summaryType: 'sum', summaryRenderer : Ext.bind(this.summaryRenderer, this, [FIELDS.PAR_PRICE_SUM], true)},
            {text : FIELDS.REAL_PRICE, dataIndex : 'realPrice', flex : 1, menuDisabled : true, resizable : false, sortable : false, align : 'center', summaryType: 'sum', summaryRenderer : Ext.bind(this.summaryRenderer, this, [FIELDS.REAL_PRICE_SUM], true)},
            {text : FIELDS.DO_PRICE, dataIndex : 'doPrice', flex : 1, menuDisabled : true, resizable : false, sortable : false, align : 'center', summaryType: 'sum', summaryRenderer : Ext.bind(this.summaryRenderer, this, [FIELDS.DO_PRICE_SUM], true)},
            {text : FIELDS.STATUS, dataIndex : 'status', width : 140, menuDisabled : true, resizable : false, sortable : false, renderer : Ext.bind(this.statusRender, this), align : 'center'}
         ],
         tbar : this.getTbarConfig(),
         bbar : Ext.create('Ext.PagingToolbar', {
            store : store,
            displayInfo : true,
            emptyMsg : FIELDS.EMPTY_TEXT
         }),
         selModel: {
            mode: "MULTI"
        },
        listeners : {
           afterrender : function(grid){
              this.gridRef = grid;
           },
           itemdblclick : this.gridItemDbClickHandler,
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
      };
   },
   
   summaryRenderer : function(value, summaryData, dataIndex, a, label) 
   {
      return Ext.String.format('<p style="font-size:18px">{0}：<span style="color:red;">{1}</span><p>', label, value);
   },
   
   gridItemDbClickHandler : function(a, record)
   {
      var FIELDS = this.LANG_TEXT.FIELDS;
      return new Ext.window.Window({
         title : FIELDS.TITLE,
         bodyPadding : 10,
         width : 700,
         height : 500,
         autoShow : true,
         modal : true,
         items : [{
            xtype : 'form',
            margin : 0,
            layout: {
               type: 'table',
               columns: 2
            },
            defaults : {
               margin : '5 10'
            },
            items : [{
               xtype : 'textfield',
               fieldLabel : FIELDS.MERCHANT_NAME,
               name : 'merchantName'
            }, {
               xtype : 'textfield',
               fieldLabel : FIELDS.TIME_ORDER,
               name : 'orderTime'
            }, {
               xtype : 'textfield',
               fieldLabel : FIELDS.TOTAL,
               name : 'totalPrice'
            }, {
               xtype : 'textfield',
               fieldLabel : FIELDS.PRICE,
               name : 'parPrice'
            }, {
               xtype : 'textfield',
               fieldLabel : FIELDS.REAL_PRICE,
               name : 'realPrice'
            }, {
               xtype : 'textfield',
               fieldLabel : FIELDS.DISCOUNT,
               name : 'discountPrice'
            }, {
               xtype : 'grid',
               colspan: 2,
               height : 260,
               emptyText : FIELDS.EMPTY_TEXT,
               autoScroll : true,
               border : true,
               columns : [
                  {text : FIELDS.NO, dataIndex : 'number', width : 150 , resizable : false, sortable : false, menuDisabled : true},
                  {text : FIELDS.PRICE, dataIndex : 'price', width : 150, resizable : false, sortable : false, menuDisabled : true},
                  {text : FIELDS.ISSUER, dataIndex : 'issuer', width : 150, resizable : false, sortable : false, menuDisabled : true},
                  {text : FIELDS.ISSUE_TIME, dataIndex : 'issueTime', flex : 1, resizable : false, sortable : false, menuDisabled : true}
               ],
               store : this.createDoListGridStore(),
               listeners : {
                  afterrender : function(grid){
                     this.doListGridRef = grid;
                  },
                  scope : this
               }
            }, {
               xtype : 'hiddenfield',
               name : 'id'
            }],
            listeners : {
               afterrender : function(form){
                  this.doListFormRef = form;
               },
               scope : this
            }
         }],
         buttons : [{
            text : FIELDS.PRINT,
            listeners : {
               click : function(){
                  var baseUrl = window.location.protocol + '//' + window.location.host;
                  window.open(baseUrl + '/print.html?id=' + record.get('id'));
               },
               scope : this
            }
         }],
         listeners : {
            render : function(){
               this.appRef.getOrderInfo({id : record.get('id')}, function(response){
                  if(response.status){
                     var data = response.data;
                     this.doListFormRef.getForm().setValues(data);
                     if(data['doList'].length > 0){
                        this.doListGridRef.store.loadRawData(data['doList']);
                     }
                  }
               }, this);
            },
            scope : this
         }
      });
   },
   
   createDoListGridStore : function()
   {
      return new Ext.data.Store({
         pageSize : 0,
         fields : [
            {name : 'number', type : 'string', persist : false},
            {name : 'price', type : 'integer', persist : false},
            {name : 'issuer', type : 'string', persist : false},
            {name : 'issueTime', type : 'string', persist : false}
         ]
      });
   },
   
   getContextMenu : function()
   {
      var L = this.LANG_TEXT.MENU, MSG = this.LANG_TEXT.MSG;
      if(null == this.contextMenuRef){
         this.contextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks : true,
            items : [{
               text : L.BALANCE,
               listeners : {
                  click : function(item)
                  {
                     Cntysoft.showQuestionWindow(MSG.BALANCE, function(btn){
                        if('yes' == btn){
                           var sel = this.gridRef.getSelection(), values=[];
                           Ext.Array.each(sel, function(row){
                              if(1 == row.get('status')){
                                 values.push(row.get('id'));
                              }
                           });
                           if(!values.length){
                              return;
                           }
                           this.appRef.changeOrderStatus({values : values, status : 2}, function(response){
                              if(!response.status){
                                 Cntysoft.Kernel.Utils.processApiError(response);
                              }else{
                                 Cntysoft.showAlertWindow(MSG.BALANCE_SUCCESS);
                                 this.gridRef.getStore().reload();
                              }
                           }, this);
                        }
                     }, this);
                  },
                  scope : this
               }
            }]
         });
      }
      return this.contextMenuRef;
   },
   
   createOrderGridStore : function()
   {
      return new Ext.data.Store({
         autoLoad : true,
         pageSize : 50,
         fields : [
            {name : 'time', type : 'string', persist : false},
            {name : 'totalPrice', type : 'integer', persist : false},
            {name : 'realPrice', type : 'integer', persist : false},
            {name : 'status', type : 'integer', persist : false},
            {name : 'merchant', type : 'string', persist : false},
            {name : 'doPrice', type : 'integer', persist : false},
            {name : 'price', type : 'integer', persist : false}
         ],
         proxy : {
            type : 'apigateway',
            callType : 'App',
            invokeMetaInfo : {
               module : 'ZhuChao',
               name : 'DeliveryOrderBalance',
               method : 'Mgr/getOrderList'
            },
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
   
   getTbarConfig : function()
   {
      var FIELDS = this.LANG_TEXT.FIELDS, STATUS = this.LANG_TEXT.STATUS, BTN = this.LANG_TEXT.BTN;
      return [
         {xtype : 'tbtext', html: FIELDS.SEARCH},
         {
            xtype : 'form',
            layout : 'hbox',
            defaults : {
               style : 'margin-right : 10px'
            },
            items : [{
               xtype : 'combo',
               name : 'merchantId',
               fieldLabel : FIELDS.MERCHANT,
               fields : ['text', 'id'],
               store : this.createComboStore(),
               displayField : 'text',
               valueField : 'id',
               minChars : 1,
               listeners : {
                  focus : function (combo)
                  {
                     combo.expand();
                  },
                  afterrender : function(merchant)
                  {
                     this.merchantRef = merchant;
                  },
                  scope : this
               }
            },
            {
               xtype : 'datefield',
               fieldLabel : FIELDS.START_TIME,
               name : 'startTime',
               editable : false,
               format : 'Y-m-d'
            },
            {
               xtype : 'datefield',
               fieldLabel : FIELDS.END_TIME,
               name : 'endTime',
               editable : false,
               format : 'Y-m-d'
            },
            {
               xtype : 'combo',
               fieldLabel : FIELDS.STATUS,
               name : 'status',
               queryMode : 'local',
               editable : false,
               store : Ext.create('Ext.data.Store', {
                  fields : ['code', 'text'],
                  data : [
                     {text : STATUS.ALL, code : 0},
                     {text : STATUS.UN_BALANCE, code : 1},
                     {text : STATUS.BALANCE, code : 2}
                  ]
               }),
               value : 1,
               displayField : 'text',
               valueField : 'code'
            }, { 
               xtype : 'button', 
               text : BTN.SEARCH,
               listeners : {
                  click : function(){
                     this.reloadGridPageFirst(this.gridRef.getStore());
                  },
                  scope : this
               }
            }, {
               xtype : 'button', 
               text : BTN.DOWNLOAD,
               listeners : {
                  click : function(){
                     this.appRef.downloadExcel(this.formRef.getForm().getValues(), function(response){
                        if(!response.status){
                           Cntysoft.Kernel.Utils.processApiError(response);
                        }else{
                           window.open(window.location.protocol+'//'+window.location.host+'/Data/Cache/Excel/'+response.data[0]);
                        }
                     }, this);
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
   
   createComboStore : function ()
   {
      return new Ext.data.Store({
         autoLoad : true,
         fields : [
            {name : 'id', type : 'integer', persist : false},
            {name : 'text', type : 'string', persist : false}
         ],
         proxy : {
            type : 'apigateway',
            callType : 'App',
            invokeMetaInfo : {
               module : 'ZhuChao',
               name : 'DeliveryOrderUse',
               method : 'Mgr/getMerchantList'
            },
            reader : {
               type : 'json',
               rootProperty : 'items',
               totalProperty : 'total'
            }
         }
      });
   },

   statusRender : function (value)
   {
      var STATUS = this.LANG_TEXT.STATUS;
      if(1 == value){
         return '<span style="color:red">' + STATUS.UN_BALANCE + '</span>';
      } else if(2 == value){
         return '<span style="color:green">'+ STATUS.BALANCE + '</span>';
      }
   },
   
   destroy : function ()
   {
      if(this.contextMenuRef){
         this.contextMenuRef.destroy();
         delete this.contextMenuRef;
      }
      delete this.formRef;
      delete this.gridRef;
      this.callParent();
   }
});

