/*
 * Cntysoft Cloud Software Team
 *
 * @author wql <wql1211608804@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.MarketMgr.Ui.Gift.GiftGoodsList', {
   extend : 'Ext.grid.Panel',
   requires : [
      'WebOs.Kernel.StdPath',
      'Cntysoft.Component.ImagePreview.View'
   ],
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   /**
    * @inheritdoc
    */
   panelType : 'GiftGoodsList',
   /**
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.ZhuChao.MarketMgr',
   contextMenuRef : null,
   constructor : function (config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.ATTRS.GiftGoods_LISTVIEW');
      this.title = this.LANG_TEXT.PANEL_TITLE;
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
         store : store,
         columns : [
            {text : F.ID, dataIndex : 'id', width : 100, resizable : false, sortable : false, menuDisabled : true},
            {text : F.NAME, dataIndex : 'name', width : 200, resizable : false, sortable : false, menuDisabled : true},
            {text : F.TRADEMARK, dataIndex : 'trademark', width : 180, resizable : false, sortable : false, menuDisabled : true},
            {text : F.TRAINTRO, dataIndex : 'traIntro', flex : 1, resizable : false, sortable : false, menuDisabled : true},
            {text : F.PACKNAME, dataIndex : 'packname', width : 150, resizable : false, sortable : false, menuDisabled : true},
            {text : F.TYPENAME, dataIndex : 'typename', width : 150, resizable : false, sortable : false, menuDisabled : true},
            {text : F.PRICE, dataIndex : 'price', width : 150, resizable : false, sortable : false, menuDisabled : true}
         ]
      });
      this.addListener({
         itemdblclick : function (panel, record)
         {
            this.renderModifyPanel(record);
         },
         itemcontextmenu : this.itemContextMenuHandler,
         scope : this
      });
      this.callParent();
   },
   itemContextMenuHandler : function (grid, record, htmlItem, index, event){
      var menu = this.getContextMenu();
      menu.record = record;
      var pos = event.getXY();
      event.stopEvent();
      menu.showAt(pos[0], pos[1]);
   },
   getContextMenu : function (record){
      var L = this.LANG_TEXT.MENU;
      if(null == this.contextMenuRef){
         this.contextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks : true,
            items : [{
                  text : L.GOODS_MODIFY,
                  listeners : {
                     click : function (item)
                     {
                        this.renderModifyPanel(item.parentMenu.record);
                     },
                     scope : this
                  }
               }, {
                  text : L.GOODS_DELETE,
                  listeners : {
                     click : function (item)
                     {
                        record = item.parentMenu.record;
                        Cntysoft.showQuestionWindow(Ext.String.format(this.LANG_TEXT.MSG.GOODS_DELETE, record.get('name')), function (btn){
                           if('yes' == btn){
                              this.appRef.deleteGiftGoods(record.get('id'), this.afterDeleteGiftGoodsPanel(), this);
                              this.close();
                              this.mainPanelRef.renderNewTabPanel('GiftGoodsList', {
                                 appRef : this.appRef,
                                 mode : 0,
                                 targetLoadId : this.targetLoadId
                              });
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
   renderModifyPanel : function (record)
   {
//renderNewTabPanel
      this.mainPanelRef.renderPanel('GiftGoodsPanel', {
         appRef : this.appRef,
         mode : 2,
         targetLoadId : record.get('id')
      });
   },
   afterDeleteGiftGoodsPanel : function ()
   {
      Cntysoft.Utils.Common.reloadGridPage(this.store);
   },
   createDataStore : function ()
   {
      return new Ext.data.Store({
         autoLoad : true,
         fields : [
            {name : 'id', type : 'integer', persist : false},
            {name : 'name', type : 'string', persist : false},
            {name : 'trademark', type : 'string', persist : false},
            {name : 'traIntro', type : 'string', persist : false},
            {name : 'packname', type : 'string', persist : false},
            {name : 'typename', type : 'string', persist : false},
            {name : 'price', type : 'integer', persist : false}
         ],
         proxy : {
            type : 'apigateway',
            callType : 'App',
            invokeMetaInfo : {
               module : 'ZhuChao',
               name : 'MarketMgr',
               method : 'GiftMgr/getGiftGoodsList'

            },
            reader : {
               type : 'json',
               rootProperty : 'items',
               totalProperty : 'total'
            }
         },
         listeners : {
            beforeload : function (store, operation){
               if(!operation.getParams()){
                  operation.setParams({
                     id : this.targetLoadId
                  });
               }
            },
            scope : this
         }
      });
   },
   destroy : function ()
   {
      this.callParent();
   }
});