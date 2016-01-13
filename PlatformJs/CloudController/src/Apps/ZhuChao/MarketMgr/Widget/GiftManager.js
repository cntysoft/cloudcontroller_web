/*
 * Cntysoft Cloud Software Team
 *
 * @author wql <wql1211608804@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 凤凰筑巢礼包管理入口WIDGET
 */
Ext.define('App.ZhuChao.MarketMgr.Widget.GiftManager', {
   extend : 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires : [
      'App.ZhuChao.MarketMgr.Comp.GiftTree',
      'App.ZhuChao.MarketMgr.Ui.Gift.WelcomePanel',
      'App.ZhuChao.MarketMgr.Ui.Gift.GiftInfoPanel',
      'App.ZhuChao.MarketMgr.Ui.Gift.GiftGoodsList',
      'App.ZhuChao.MarketMgr.Ui.Gift.GiftCategoryPanel',
      'App.ZhuChao.MarketMgr.Ui.Gift.GiftGoodsPanel'
   ],
   mixins : {
      multiTabPanel : 'SenchaExt.Mixin.MultiTabPanel'
   },
   panelClsMap : {
      Welcome : 'App.ZhuChao.MarketMgr.Ui.Gift.WelcomePanel',
      GiftInfoPanel : 'App.ZhuChao.MarketMgr.Ui.Gift.GiftInfoPanel',
      GiftGoodsList : 'App.ZhuChao.MarketMgr.Ui.Gift.GiftGoodsList',
      GiftCategoryPanel : 'App.ZhuChao.MarketMgr.Ui.Gift.GiftCategoryPanel',
      GiftGoodsPanel : 'App.ZhuChao.MarketMgr.Ui.Gift.GiftGoodsPanel'
   },
   /**
    * {@link WebOs.Mixin.MultiTabPanel#initPanelType initPanelType}
    * @property {String} initPanelType
    */
   initPanelType : 'Welcome',
   categoryTreeRef : null,
   rootNodeContextMenuRef : null,
   topNodeContextMenuRef : null,
   subNodeContextMenuRef : null,
   deleteCategorypackId : null,
   initPmTextRef : function ()
   {
      this.pmText = this.GET_PM_TEXT('GIFTMANAGER');
   },
   initLangTextRef : function ()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('GIFTMANAGER');
   },
   applyConstraintConfig : function (config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         layout : 'border',
         width : 1000,
         minWidth : 1180,
         minHeight : 500,
         height : 500,
         resizable : true,
         bodyStyle : 'background:#ffffff',
         maximizable : true,
         maximized : true
      });
   },
   initComponent : function ()
   {
      Ext.apply(this, {
         items : [
            this.getGiftTreePanelConfig(),
            this.getTabPanelConfig()
         ]
      });
      this.callParent();
   },
   itemContextMenuHandler : function (tree, record, item, index, event)
   {
      var menu = this.getContextMenu(record);
      menu.record = record;
      var pos = event.getXY();
      event.stopEvent();
      menu.showAt(pos[0], pos[1]);
   },
   getContextMenu : function (record)
   {
      var L = this.LANG_TEXT.MENU;
      var C = App.ZhuChao.MarketMgr.Const;
      if(record.isRoot()){
         if(null == this.rootNodeContextMenuRef){
            this.rootNodeContextMenuRef = new Ext.menu.Menu({
               ignoreParentClicks : true,
               items : [{
                     text : L.ROOT,
                     listeners : {
                        click : function ()
                        {
                           this.closeCurrentActivePanel();
                           this.renderNewTabPanel('GiftInfoPanel', {
                              appRef : this.appRef,
                              mode : 1,
                              pid : 0
                           });
                        },
                        scope : this
                     }
                  }]
            });
         }
         return this.rootNodeContextMenuRef;
      } else{
         var nodeType = record.get('nodeType');
         if(C.NODE_TYPE_GIFT_HEAD == nodeType){
            this.topNodeContextMenuRef = new Ext.menu.Menu({
               ignoreParentClicks : true,
               items : [{
                     text : L.GIFT_CATE,
                     listeners : {
                        click : function ()
                        {
                           this.closeCurrentActivePanel();
                           this.renderNewTabPanel('GiftCategoryPanel', {
                              appRef : this.appRef,
                              mode : 1,
                              packId : record.get('id')
                           });
                        },
                        scope : this
                     }
                  }, {
                     text : L.GIFT_MODIFY,
                     listeners : {
                        click : function ()
                        {
                           this.closeCurrentActivePanel();
                           this.renderNewTabPanel('GiftInfoPanel', {
                              appRef : this.appRef,
                              mode : 2,
                              targetLoadId : record.get('id')
                           }
                           );
                        },
                        scope : this
                     }
                  }, {
                     text : L.GIFT_DELETE,
                     listeners : {
                        click : function ()
                        {
                           Cntysoft.showQuestionWindow(Ext.String.format(this.LANG_TEXT.MSG.GIFT_DELETE, record.get('text')), function (btn){
                              if('yes' == btn){
                                 this.appRef.deleteGift(record.get('id'), function (record){
                                    this.categoryTreeRef.reload();
                                    this.closeCurrentActivePanel();
                                 }, this);
                              }
                           }, this);
                        },
                        scope : this
                     }
                  }]
            });
            return this.topNodeContextMenuRef;
         } else if(C.NODE_TYPE_GIFT_CATEGORY == nodeType){
            this.subNodeContextMenuRef = new Ext.menu.Menu({
               ignoreParentClicks : true,
               items : [{
                     text : L.CATE_GOODS,
                     listeners : {
                        click : function ()
                        {
                           this.closeCurrentActivePanel();
                           this.renderNewTabPanel('GiftGoodsPanel', {
                              appRef : this.appRef,
                              mode : 1,
                              typeId : record.get('id'),
                              packId : record.get('packId')
                           });
                        },
                        scope : this
                     }
                  }, {
                     text : L.CATE_MODIFY,
                     listeners : {
                        click : function ()
                        {
                           this.closeCurrentActivePanel();
                           this.renderNewTabPanel('GiftCategoryPanel', {
                              appRef : this.appRef,
                              mode : 2,
                              targetLoadId : record.get('id')
                           });
                        },
                        scope : this
                     }
                  }, {
                     text : L.CATE_DELETE,
                     listeners : {
                        click : function ()
                        {
                           var packId = record.get('packId') + '#';
                           this.deleteCategorypackId = packId;
                           Cntysoft.showQuestionWindow(Ext.String.format(this.LANG_TEXT.MSG.CATE_DELETE, record.get('text')), function (btn){
                              if('yes' == btn){
                                 this.appRef.deleteCategory(record.get('id'), function (){
                                    this.categoryTreeRef.reload();
                                    this.closeCurrentActivePanel();
                                    this.renderNewTabPanel('GiftGoodsList', {
                                       appRef : this.appRef,
                                       mode : 0,
                                       targetLoadId : this.deleteCategorypackId
                                    }
                                    );
                                 }, this);
                              }
                           }, this);
                        },
                        scope : this
                     }
                  }]
            });
            return this.subNodeContextMenuRef;
         }
      }
   },
   getGiftTreePanelConfig : function ()
   {
      return {
         xtype : 'zhuchaomarketmgrcompgifttree',
         region : 'west',
         width : 300,
         margin : '0 1 0 0',
         collapsible : true,
         listeners : {
            afterrender : function (comp)
            {
               this.categoryTreeRef = comp;
            },
            itemcontextmenu : this.itemContextMenuHandler,
            itemclick : this.itemClickHandler,
            scope : this
         }
      };
   },
   closeCurrentActivePanel : function (){
      var panel = this.getCurrentActivePanel();
      if(panel.panelType != 'WelcomePanel'){
         panel.close();
      }
   },
   itemClickHandler : function (tree, record)
   {
      this.closeCurrentActivePanel();
      var nodeType = record.get('nodeType');
      var C = App.ZhuChao.MarketMgr.Const;
      if(nodeType == C.NODE_TYPE_GIFT_CATEGORY){
         this.renderNewTabPanel('GiftGoodsList', {
            appRef : this.appRef,
            mode : 0,
            targetLoadId : record.get('id')
         }
         );
      }
      if(nodeType == 0){
         this.renderNewTabPanel('GiftInfoPanel', {
            appRef : this.appRef,
            mode : 1
         }
         );
      }
      if(nodeType == C.NODE_TYPE_GIFT_HEAD){
         this.renderNewTabPanel('GiftGoodsList', {
            appRef : this.appRef,
            mode : 0,
            targetLoadId : record.get('id')
         }
         );
      }
   },
   panelExistHandler : function (panel, config)
   {
      var C = CloudController.Const;
   },
   destroy : function ()
   {
      delete this.categoryTreeRef;
      this.callParent();
   }
});