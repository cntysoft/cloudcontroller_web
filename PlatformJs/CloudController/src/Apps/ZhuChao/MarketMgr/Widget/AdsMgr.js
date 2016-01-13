/*
 * Cntysoft Cloud Software Team
 *
 * @author ZhiHui <liuyan2526@qq.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.MarketMgr.Widget.AdsMgr', {
   extend : 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires : [
      'App.ZhuChao.MarketMgr.Ui.AdsMgr.ModuleTree',
      'App.ZhuChao.MarketMgr.Ui.AdsMgr.ListView',
      'App.ZhuChao.MarketMgr.Ui.AdsMgr.AdsModuleEditor',
      'App.ZhuChao.MarketMgr.Ui.AdsMgr.AdsEditor',
      'SenchaExt.Data.Proxy.ApiProxy'
   ],
   mixins : {
      multiTabPanel : 'SenchaExt.Mixin.MultiTabPanel'
   },
   panelClsMap : {
      ListView : 'App.ZhuChao.MarketMgr.Ui.AdsMgr.ListView',
      AdsModuleEditor : 'App.ZhuChao.MarketMgr.Ui.AdsMgr.AdsModuleEditor',
      AdsEditor : 'App.ZhuChao.MarketMgr.Ui.AdsMgr.AdsEditor'
   },
   initPanelType : 'ListView',
   tbarRef : null,
   gridRef : null,
   treeRef : null,
   initPmTextRef : function ()
   {
      this.pmText = this.GET_PM_TEXT('ADSMGR');
   },
   initLangTextRef : function ()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('ENTRY');
   },
   applyConstraintConfig : function (config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         resizable : false,
         height : 700,
         width : 1200,
         maximizable : true,
         maximized : false,
         title : this.LANG_TEXT.ADSMGR.WIDGET_TITLE,
         layout : {
            type : 'border'
         }
      });
   },
   initComponent : function ()
   {
      this.initPanelConfig = {
         tbar : this.tbarConfig(),
         appRef : this.appRef
      };
      Ext.apply(this, {
         items : [{
               xtype : 'appzhuchaomarketmgruiadsmgrmoduletree',
               width : 250,
               collapsible : true,
               region : 'west',
               rootVisible : false,
               mainPanelRef : this
            }, this.getTabPanelConfig()]
      });
      this.callParent();
   },
   tbarConfig : function ()
   {
      return items = [{
            xtype : 'button',
            text : this.LANG_TEXT.ADSMGR.ADDNEWMODULE,
            listeners : {
               click : this.tbarClickHandler,
               scope : this
            }
         }];
   },
   tbarClickHandler : function ()
   {
      var C = CloudController.Const;
      this.renderPanel('AdsModuleEditor', {
         tbar : this.tbarConfig(),
         treeRef : this.treeRef,
         mode : C.NEW_MODE
      });
   },
   panelExistHandler : function (panel, config)
   {
      var C = CloudController.Const;
      var record = config.record;
      panel.record = record;
      if(C.NEW_MODE == config.mode){
         panel.gotoNewMode();
      } else if(C.MODIFY_MODE == config.mode){
         panel.gotoModifyMode();
      }
   }
});


