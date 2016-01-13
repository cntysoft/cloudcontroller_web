/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.Merchant.Ui.MerchantListView', {
   extend : 'Ext.grid.Panel',
   requires : [
      'WebOs.Kernel.StdPath'
   ],
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   /*
    * @inheritdoc
    */
   panelType : 'ListView',
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.ZhuChao.Merchant',
   //private
   appRef : null,
   /**
    * @property {Ext.menu.Menu} contextMenuRef
    */
   contextMenuRef : null,
   constructor : function (config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.MERCHANT_LISTVIEW');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig : function (config)
   {
      Ext.apply(config, {
         border : true,
         title : this.LANG_TEXT.TITLE,
         emptyText : this.LANG_TEXT.EMPTY_TEXT
      });
   },
   initComponent : function ()
   {
      var F = this.LANG_TEXT.FIELDS;
      var store = this.createDataStore();
      Ext.apply(this, {
         bbar : Ext.create('Ext.PagingToolbar', {
            store : store,
            displayInfo : true,
            emptyMsg : this.emptyText
         }),
         tbar : this.getTBarConfig(),
         store : store,
         columns : [
            {text : F.ID, dataIndex : 'id', width : 100, resizable : false, sortable : false, menuDisabled : true},
            {text : F.NAME, dataIndex : 'name', width : 160, resizable : false, sortable : false, menuDisabled : true},
            {text : F.ADDRESS, dataIndex : 'address', flex : 1, resizable : false, sortable : false, menuDisabled : true},
            {text : F.PHONE, dataIndex : 'phone', width : 180, resizable : false, sortable : false, menuDisabled : true},
            {text : F.MANAGER, dataIndex : 'manager', width : 140, resizable : false, sortable : false, menuDisabled : true},
            {text : F.LEGAL_PERSON, dataIndex : 'legalPerson', width : 140, resizable : false, sortable : false, menuDisabled : true},
            {text : F.AUTHORIZER, dataIndex : 'authorizer', width : 140, resizable : false, sortable : false, menuDisabled : true},
            {text : F.SORTNUM, dataIndex : 'sortNum', width : 140, resizable : false, sortable : true, menuDisabled : true}
         ]
      });
      this.addListener({
         afterrender : function (grid){
            this.gridRef = grid;
            var map = new Ext.util.KeyMap({
               target : Ext.getBody(),
               key : Ext.event.Event.ENTER,
               fn : function (){
                  this.btnRef.fireEvent('click');
               },
               scope : this
            });
         },
         itemdblclick : function (panel, record)
         {
            this.renderModifyPanel(record);
         },
         itemcontextmenu : this.itemContextMenuHandler,
         scope : this
      });
      this.callParent();
   },
   createDataStore : function ()
   {
      var INFO = this.GET_LANG_TEXT('UI.MERCHANT_INFO');
      var FLOOR = INFO.FLOOR, REGION = INFO.REGION, CITY = INFO.CITY;
      return new Ext.data.Store({
         autoLoad : true,
         fields : [
            {name : 'id', type : 'integer', persist : false},
            {name : 'name', type : 'string', persist : false},
            {name : 'address', type : 'string', persist : false},
            {name : 'phone', type : 'string', persist : false},
            {name : 'manager', type : 'string', persist : false},
            {name : 'legalPerson', type : 'string', persist : false},
            {name : 'authorizer', type : 'string', persist : false},
            {name : 'sortNum', type : 'integer', persist : false}
         ],
         proxy : {
            type : 'apigateway',
            callType : 'App',
            invokeMetaInfo : {
               module : 'ZhuChao',
               name : 'Merchant',
               method : 'Mgr/getMerchantList'
            },
            reader : {
               type : 'json',
               rootProperty : 'items',
               totalProperty : 'total'
            },
            onDataReady : function (ret)
            {
               var orgItems = ret.items;
               var items = [];
               for(var i = 0; i < orgItems.length; i++) {
                  var item = {}, city = 1 == orgItems[i].city ? CITY['NORTH'] : CITY['SOUTH'];
                  Ext.apply(item, {
                     id : orgItems[i].id,
                     name : orgItems[i].name,
                     phone : orgItems[i].phone,
                     manager : orgItems[i].manager,
                     legalPerson : orgItems[i].legalPerson,
                     authorizer : orgItems[i].authorizer,
                     sortNum : orgItems[i].sortNum,
                     address : [city, FLOOR[orgItems[i].floor], REGION[orgItems[i].region], orgItems[i].serial].join(' ')
                  });
                  items.push(item);
               }
               ret.items = items;
               return ret;
            }
         },
         listeners : {
            beforeload : function (store, operation){
               var value = this.nameRef.getValue();
               operation.setParams({name : value});
            },
            scope : this
         }
      });
   },
   reload : function ()
   {
      Cntysoft.Utils.Common.reloadGridPage(this.store);
   },
   renderModifyPanel : function (record)
   {
      this.mainPanelRef.renderNewTabPanel('MerchantInfo', {
         mode : CloudController.Const.MODIFY_MODE,
         targetLoadId : record.get('id'),
         appRef : this.mainPanelRef.appRef
      });
   },
   /**
    * 获取上下文菜单对象
    */
   getContextMenu : function (record)
   {
      var L = this.LANG_TEXT.MENU;
      if(null == this.contextMenuRef){
         this.contextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks : true,
            items : [{
                  text : L.CHANGESORT,
                  listeners : {
                     click : function (item)
                     {
                        var record = item.parentMenu.record;
                        this.getSortWin(record.get('id'), record.get('sortNum'));
                     },
                     scope : this
                  }
               }, {
                  text : L.MODIFY,
                  listeners : {
                     click : function (item)
                     {
                        this.renderModifyPanel(item.parentMenu.record);
                     },
                     scope : this
                  }
               }, {
                  text : L.DELETE,
                  listeners : {
                     click : function (item)
                     {
                        var record = item.parentMenu.record;
                        var id = record.get('id');
                        Cntysoft.showQuestionWindow(Ext.String.format(this.LANG_TEXT.MSG.DELETE_ASK, record.get('name')), function (btn){
                           if('yes' == btn){
                              this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.DELETE'));
                              this.mainPanelRef.appRef.deleteMerchantInfo(id, function (response){
                                 this.loadMask.hide();
                                 if(!response.status){
                                    Cntysoft.showErrorWindow(response.msg);
                                 } else{
                                    this.reload();
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
   getSortWin : function (id, sortNum)
   {
      var SORT = this.LANG_TEXT.SORT_WIN;
      var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
      var MSG = this.LANG_TEXT.MSG;
      var BTN = this.LANG_TEXT.BTN;
      return Ext.create('Ext.window.Window', {
         title : SORT.TITLE,
         autoShow : true,
         width : 500,
         height : 150,
         modal : true,
         bodyPadding : 10,
         items : {
            xtype : 'form',
            items : [{
                  xtype : 'numberfield',
                  fieldLabel : SORT.SORTNUM + R_STAR,
                  minValue : 0,
                  step : 10,
                  allowBlank : false,
                  name : 'sortNum'
               }, {
                  xtype : 'hiddenfield',
                  name : 'id',
                  value : id
               }],
            listeners : {
               afterrender : function (ref){
                  this.formRef = ref;
                  this.formRef.getForm().setValues({id : id, sortNum : sortNum});
               },
               scope : this
            }
         },
         buttons : [{
               text : BTN.SAVE,
               listeners : {
                  click : function (){
                     var form = this.formRef.getForm();
                     if(form.isValid()){
                        this.setLoading(MSG.SORT_CHANGE);
                        var values = form.getValues();
                        this.mainPanelRef.appRef.sortChange(values, function (response){
                           this.loadMask.hide();
                           if(!response.status){
                              Cntysoft.Kernel.Utils.processApiError(response);
                           } else{
                              this.sortWinRef.close();
                              this.reload();
                           }
                        }, this);
                     }
                  },
                  scope : this
               }
            }, {
               text : BTN.CLOSE,
               listeners : {
                  click : function (){
                     this.sortWinRef.close();
                  },
                  scope : this
               }
            }],
         listeners : {
            afterrender : function (sortWin){
               this.sortWinRef = sortWin;
            },
            scope : this
         }
      });
   },
   getTBarConfig : function ()
   {
      var L = this.LANG_TEXT.BTN, F = this.LANG_TEXT.FIELDS;
      return [{
            text : L.ADD_MERCHANT,
            listeners : {
               click : function ()
               {
                  this.mainPanelRef.renderNewTabPanel('MerchantInfo', {
                     appRef : this.mainPanelRef.appRef,
                     targetLoadId : -1,
                     mode : CloudController.Const.NEW_MODE
                  });
               },
               scope : this
            }
         }, {
            xtype : 'tbfill'
         }, {
            xtype : 'textfield',
            name : 'name',
            fieldLabel : F.NAME,
            listeners : {
               afterrender : function (name){
                  this.nameRef = name;
               },
               scope : this
            }
         }, {
            xtype : 'button',
            text : L.SEARCH,
            listeners : {
               afterrender : function (btn){
                  this.btnRef = btn;
               },
               click : function (){
                  this.reloadGridPageFirst(this.gridRef.store);
               },
               scope : this
            }
         }];
   },
   reloadGridPageFirst : function (store, params)
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
      } else{
         store.load();
      }
   },
   itemContextMenuHandler : function (grid, record, htmlItem, index, event)
   {
      var menu = this.getContextMenu();
      menu.record = record;
      var pos = event.getXY();
      event.stopEvent();
      menu.showAt(pos[0], pos[1]);
   },
   destroy : function ()
   {
      delete this.mainPanelRef;
      if(this.contextMenuRef){
         this.contextMenuRef.destroy();
         delete this.contextMenuRef;
      }
      if(null != this.sortWinRef){
         this.sortWinRef.destroy();
         delete this.sortWinRef;
      }
      this.callParent();
   }
});
