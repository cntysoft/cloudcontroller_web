/*
 * Cntysoft Cloud Software Team
 *
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 意见反馈列表类
 */
Ext.define('App.ZhuChao.Advice.Ui.ListView', {
   extend: 'Ext.grid.Panel',
   requires : [
      'App.ZhuChao.Advice.Const'
   ],
   mixins: {
      langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
   },
   /**
    * @inheritdoc
    */
   panelType : 'ListView',
   /**
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.ZhuChao.Advice',

   //private
   appRef : null,
   /**
    * @property {Ext.menu.Menu} contextMenuRef
    */
   contextMenuRef : null,
   constructor : function(config)
   {
      config = config || {};
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
            {text : F.ID, dataIndex : 'id', width : 160, resizable : false, sortable : false, menuDisabled : true},
            {text : F.TITLE, dataIndex : 'title', flex :1 , resizable : false, sortable : false, menuDisabled : true},
            {text : F.TIME, dataIndex : 'time', width : 200, resizable : false, sortable : false, menuDisabled : true},
            {text : F.STATUS, dataIndex : 'status', width : 100, resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.statusRender, this)}
         ]
      });
      this.addListener({
         itemdblclick : function(panel, record)
         {
            this.renderModifyPanel(record);
         },
         scope : this
      });
      this.callParent();
   },

   createDataStore : function()
   {
      return new Ext.data.Store({
         autoLoad : true,
         fields : [
            {name : 'id', type : 'integer', persist : false},
            {name : 'title', type : 'string', persist : false},
            {name : 'time', type : 'string', persist : false},
            {name : 'status', type : 'integer', persist : false}
         ],
         proxy : {
            type : 'apigateway',
            callType : 'App',
            invokeMetaInfo : {
               module : 'ZhuChao',
               name : 'Advice',
               method : 'Info/getAdviceList'
            },
            reader : {
               type : 'json',
               rootProperty : 'items',
               totalProperty : 'total'
            }
         }
      });
   },

   reload : function()
   {
      Cntysoft.Utils.Common.reloadGridPage(this.store);
   },

   renderModifyPanel : function(record)
   {
      this.mainPanelRef.renderNewTabPanel('Editor',{
         mode : CloudController.Const.MODIFY_MODE,
         targetLoadId : record.get('id'),
         appRef : this.mainPanelRef.appRef
      });
   },
   statusRender : function(value)
   {
      var C = App.ZhuChao.Advice.Const;
      var L = this.LANG_TEXT.STATUS;
      if(C.ADVICE_S_NEW == value) {
         return L.NEW;
      }else if(C.ADVICE_S_DOWN == value) {
         return L.DOWN;
      }
   },
   renderModifyPanel : function(record)
   {
      this.mainPanelRef.renderNewTabPanel('Editor',{
         mode : CloudController.Const.MODIFY_MODE,
         targetLoadId : record.get('id'),
         appRef : this.mainPanelRef.appRef
      });
   },
   destroy : function()
   {
      delete this.mainPanelRef;
      if(this.contextMenuRef){
         this.contextMenuRef.destroy();
         delete this.contextMenuRef;
      }
      this.callParent();
   }
});
