/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.Goods.Comp.MerchantSelectWin', {
   extend: 'Ext.window.Window',
   requires: [
      'WebOs.Kernel.StdPath'
   ],
   mixins: {
      langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
   },
   /**
    * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.ZhuChao.Goods',
   gridRef : null,
   constructor : function(config)
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('COMP.MERCHANT_SELECT_WIN');
      this.applyConstraintConfig();
      this.callParent([config]);
   },
   applyConstraintConfig : function()
   {
      Ext.apply(this, {
         title : this.LANG_TEXT.TITLE,
         maximizable : false,
         resizable : false,
         modal : true,
         height : 350,
         minHeight : 350,
         width : 400,
         minWidth : 400,
         bodyStyle : 'background:#ffffff',
         layout : 'fit',
         closeAction : 'hide'
      });
   },
   initComponent : function()
   {
      Ext.apply(this,{
         items : this.getMerchantGridConfig(),
         buttons : [{
            text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
            listeners : {
               click : this.saveHandler,
               scope : this
            }
         },{
            text : Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
            listeners : {
               click : function()
               {
                  this.close();
               },
               scope : this
            }
         }]
      });
      this.addListener({
         close : this.closeHandler,
         scope : this
      });
      this.callParent();
   },

   saveHandler : function()
   {
      var sels = this.gridRef.getSelectionModel().getSelection();
      if(sels.length == 1){
         this.fireSelectedHandler(sels.pop());
      }
   },

   dbClickHandler : function(grid, record)
   {
      this.fireSelectedHandler(record);
   },

   fireSelectedHandler : function(record)
   {
      if(this.hasListeners.saverequest){
         this.fireEvent('saverequest', record.getData());
      }
      this.close();
   },

   closeHandler : function()
   {
      this.gridRef.getSelectionModel().deselectAll(true);
   },

   getMerchantGridConfig : function()
   {
      var F = this.LANG_TEXT.FIELDS;
      var store = new Ext.data.Store({
         autoLoad : true,
         fields : [
            {name : 'id', type : 'integer', persist : false},
            {name : 'name', type : 'string', persist : false}
         ],
         proxy : {
            type : 'apigateway',
            callType : 'App',
            invokeMetaInfo : {
               module : 'ZhuChao',
               name : 'Goods',
               method : 'Mgr/getMerchants'
            },
            reader : {
               type : 'json',
               rootProperty : 'items',
               totalProperty : 'total'
            }
         },
         listeners : {
            beforeload : function(store, operation){
               var value = this.nameRef.getValue();
               operation.setParams({id : value});
            },
            scope : this
         }
      });
      return {
         xtype : 'grid',
         store : store,
         autoScroll : true,
         selModel : {
            mode : 'SINGLE'
         },
         tbar : this.getTBabConfig(),
         columns : [
            {text : F.ID, dataIndex : 'id', width : 100, resizable : false, sortable : false, menuDisabled : true},
            {text : F.NAME, dataIndex : 'name', flex : 1, resizable : false, sortable : false, menuDisabled : true}
         ],
         listeners : {
            itemdblclick : this.dbClickHandler,
            afterrender : function(comp)
            {
               this.gridRef = comp;
            },
            scope : this
         }
      };
   },
   
   getTBabConfig : function()
   {
      var F = this.LANG_TEXT.FIELDS;
      return [{
         xtype : 'textfield',
         name : 'name',
         fieldLabel : F.ID,
         labelWidth : 50,
         listeners : {
            afterrender : function(name){
               this.nameRef = name;
               name.focus();
            },
            change : function(){
               this.reloadGridPageFirst(this.gridRef.store);
            },
            scope : this
         }
      }];
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
   
   destroy : function()
   {
      this.mixins.langTextProvider.call(this);
      delete this.gridRef;
      this.callParent();
   }
});