/*
 * Cntysoft Cloud Software Team
 *
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.UserCenter.Ui.DesignScheme.ListView',{
   extend: 'Ext.grid.Panel',
   mixins: {
      langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
   },
   /*
    * @inheritdoc
    */
   panelType : 'ListView',
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    */
   runableLangKey : 'App.ZhuChao.UserCenter',

   contextMenuRef : null,

   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.DESIGN_SCHEME.LIST_VIEW');
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
            {text : F.COVER, dataIndex : 'cover', width : 210 , resizable : false, sortable : false, menuDisabled : true, renderer : this.coverRenderer, autoScroll:true},
            {text : F.NAME, dataIndex : 'name', flex : 1, resizable : false, sortable : false, menuDisabled : true},
            {text : F.INTRO, dataIndex : 'intro', flex : 1, resizable : false, sortable : false, menuDisabled : true},
            {text : F.INPUT_TIME, dataIndex : 'inputTime', width : 200,  xtype: 'datecolumn', format:'Y-m-d', resizable : false, sortable : false, menuDisabled : true}
         ],
         tbar : [{
            text : this.LANG_TEXT.BTN.ADD_DESIGN_SCHEME,
            listeners : {
               click : function(){
                  this.mainPanelRef.renderNewTabPanel('Info',{
                     mode : 1,
                     appRef : this.mainPanelRef.appRef,
                     listRef : this
                  });
               },
               scope : this
            }
         }]
      });
      this.addListener({
         itemdblclick : function(panel, record)
         {
            this.renderModifyPanel(record);
         },
         itemcontextmenu : this.itemContextMenuHandler,
         scope : this
      });
      this.callParent();
   },
   
   renderModifyPanel : function(record)
   {
      this.mainPanelRef.renderNewTabPanel('Info',{
         mode : CloudController.Const.MODIFY_MODE,
         targetLoadId : record.get('id'),
         appRef : this.mainPanelRef.appRef,
         listRef : this
      });
   },
   
   coverRenderer : function(value)
   {
     return '<img src="'+FH.getZhuChaoImageUrl(value)+'" style="margin-left:-10px;float:left;width:200px;height:110px"/>'; 
   },
   
   reload : function()
   {
      Cntysoft.Utils.Common.reloadGridPage(this.store);
   },

   createDataStore : function()
   {
      return new Ext.data.Store({
         autoLoad : true,
         fields : [
            {name : 'id', type : 'integer', persist : false},
            {name : 'name', type : 'string', persist : false},
            {name : 'cover', type : 'string', persist : false},
            {name : 'intro', type : 'string', persist : false},
            {name : 'inputTime', type : 'string', persist : false}
         ],
         proxy : {
            type : 'apigateway',
            callType : 'App',
            invokeMetaInfo : {
               module : 'ZhuChao',
               name : 'UserCenter',
               method : 'DesignScheme/getDSList'
            },
            reader : {
               type : 'json',
               rootProperty : 'items',
               totalProperty : 'total'
            }
         }
      });
   },
   /*
    * 获取上下文菜单对象
    */
   getContextMenu : function(record)
   {
      var L = this.LANG_TEXT.MENU, MSG = this.LANG_TEXT.MSG;
      if(null == this.contextMenuRef){
         this.contextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks : true,
            items : [{
               text : L.MODIFY,
               listeners : {
                  click : function(item)
                  {
                     this.renderModifyPanel(item.parentMenu.record);
                  },
                  scope : this
               }
            },{
               text : L.DELETE,
               listeners : {
                  click : function(item)
                  {
                     Cntysoft.showQuestionWindow(MSG.DELETE, function(btn) {
                        if ('yes' == btn) {
                           var record =  item.parentMenu.record;
                           this.setLoading(MSG.DELETING);
                           this.mainPanelRef.appRef.deleteDesignScheme({id : record.get('id')}, function(response){
                              this.loadMask.hide();
                              if(!response.status){
                                 Cntysoft.Kernel.Utils.processApiError(response);
                              }else{
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

   itemContextMenuHandler : function(grid, record, htmlItem, index, event)
   {
      var menu = this.getContextMenu();
      menu.record = record;
      var pos = event.getXY();
      event.stopEvent();
      menu.showAt(pos[0], pos[1]);
   },
   
   destroy : function()
   {
      delete this.appRef;
      this.mixins.langTextProvider.destroy.call(this);
      if(null != this.contextMenuRef){
         this.contextMenuRef.destroy();
         delete this.contextMenuRef;
      }
      this.callParent();
   }
});