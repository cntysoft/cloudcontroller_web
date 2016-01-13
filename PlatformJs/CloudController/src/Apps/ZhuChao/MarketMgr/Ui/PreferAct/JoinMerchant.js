/*
 * Cntysoft Cloud Software Team
 *
 * @author ZhiHui <liuyan2526@qq.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 该类用来展示还没有被该活动关联的商家列表
 * 
 * @param {type} param1
 * @param {type} param2
 */
Ext.define('App.ZhuChao.MarketMgr.Ui.PreferAct.JoinMerchant', {
   extend : 'Ext.grid.Panel',
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.MarketMgr',
   gridStoreRef : null,
   gridRef : null,
   constructor : function (config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('PREFERACT.JOINMERCHANT');
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
            {text : this.LANG_TEXT.SELECT, width : 70, sortable : false, menuDisabled : true, resizable : false},
            {text : this.LANG_TEXT.ID, dataIndex : 'id', resizable : false, menuDisabled : true, width : 200},
            {text : this.LANG_TEXT.NAME, dataIndex : 'name', resizable : false, menuDisabled : true, flex : 1}
         ],
         /**
          * 以下方法用来在grid中多行选中及显示多选框
          */
         selModel : Ext.create("Ext.selection.CheckboxModel", {
            injectCheckbox : 0, //checkbox位于哪一列，默认值为0
            mode : "simple", //multi,simple,single；默认为多选multi
            checkOnly : false, //如果值为true，则只用点击checkbox列才能选中此条记录
            allowDeselect : true, //如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
            enableKeyNav : true
         }),
         buttons : [{
               text : this.LANG_TEXT.JOIN,
               listeners : {
                  click : this.gridButtonClickHandler,
                  scope : this
               }
            }],
         listeners : {
            afterrender : function (grid){
               this.gridRef = grid;
            }
         }
      });
      this.callParent();
   },
   /**
    * 表单按钮点击处理事件
    * 
    * @returns {undefined}
    */
   gridButtonClickHandler : function ()
   {
      var records = this.gridRef.getSelectionModel().getSelection();
      var merchantIds = [];
      Ext.each(records, function (name){
         merchantIds.push(name.getId());
      }, this);
      var preferactIds = this.preferactId;
      var ret = [];
      ret['merchantIds'] = merchantIds;
      ret['preferactIds'] = preferactIds;
      this.setLoading(this.LANG_TEXT.INJOIN);
      this.mainPanelRef.appRef.joinprefermerchant(ret, function (response){
         this.loadMask.hide();
         if(!response.status){
            Cntysoft.showErrorWindow(response.msg);
         } else{
            this.reloadGridPageFirst(this.gridRef.getStore());
            Cntysoft.showAlertWindow(this.LANG_TEXT.JOINSUCCESS);
         }
      }, this);
   },
   /**
    * gridStore 重新刷新方法
    * 
    * @param {Ext.data.Store} store
    * @param {Object} params
    * @returns {undefined}
    */
   reloadGridPageFirst : function (store, params)
   {
      store.addListener('load', function (store, records){
         store.currentPage = 1;
         if(params){
            store.load({
               params : params
            });
         }
         store.load();
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
      if(null == this.gridStoreRef){
         this.gridStoreRef = new Ext.data.Store({
            autoLoad : true,
            pageSize : 25,
            fields : [
               {name : 'id', type : 'integer', persist : false},
               {name : 'name', type : 'string', persist : false}
            ],
            proxy : {
               type : 'apigateway',
               callType : 'App',
               invokeMetaInfo : {
                  module : 'ZhuChao',
                  name : 'Merchant',
                  method : 'Mgr/getMerchantListByPreferActId'
               },
               pArgs : [{
                     key : 'preferactId',
                     value : this.preferactId
                  }],
               reader : {
                  type : 'json',
                  rootProperty : 'items',
                  totalProperty : 'total'
               }
            }
         });
      }
      ;
      return this.gridStoreRef;
   },
   destroy : function ()
   {
      delete this.gridRef;
      delete this.gridStoreRef;
      this.callParent();
   }
});

