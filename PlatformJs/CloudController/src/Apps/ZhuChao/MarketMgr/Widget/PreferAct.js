/*
 * Cntysoft Cloud Software Team
 *
 * @author ZhiHui <liuyan2526@qq.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.MarketMgr.Widget.PreferAct', {
   extend : 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires : [
      'App.ZhuChao.MarketMgr.Ui.PreferAct.PreferActTree',
      'App.ZhuChao.MarketMgr.Ui.PreferAct.StartUp',
      'App.ZhuChao.MarketMgr.Ui.PreferAct.PreferActEditor',
      'App.ZhuChao.MarketMgr.Ui.PreferAct.JoinMerchant',
      'App.ZhuChao.MarketMgr.Ui.PreferAct.ListView',
      'App.ZhuChao.MarketMgr.Ui.PreferAct.PreferActList'
   ],
   mixins : {
      multiTabPanel : 'SenchaExt.Mixin.MultiTabPanel'
   },
   panelClsMap : {
      StartUp : 'App.ZhuChao.MarketMgr.Ui.PreferAct.StartUp',
      PreferActEditor : 'App.ZhuChao.MarketMgr.Ui.PreferAct.PreferActEditor',
      JoinMerchant : 'App.ZhuChao.MarketMgr.Ui.PreferAct.JoinMerchant',
      ListView : 'App.ZhuChao.MarketMgr.Ui.PreferAct.ListView',
      PreferActList : 'App.ZhuChao.MarketMgr.Ui.PreferAct.PreferActList'
   },
   initPanelType : 'StartUp',
   tbarRef : null,
   treeRef : null,
   initPmTextRef : function ()
   {
      this.pmText = this.GET_PM_TEXT('PREFERACT');
   },
   initLangTextRef : function ()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('WIDGET.PREFERACT');
   },
   applyConstraintConfig : function(config)
   {
      this.callParent([config]);
      Ext.apply(config,{
         resizable : false,
         height : 700,
         width : 1200,
         maximizable : true,
         maximized : false,
         title : this.LANG_TEXT.WIDGET_TITLE,
         layout : {
            type : 'border'
         }
      });
   },
   initComponent : function()
   {
      this.initPanelConfig = {
         tbar : this.tbarConfig()
      }
      Ext.apply(this, {
         items : [{
               xtype : 'appzhuchaomarketuipreferactpreferacttree',
               width : 250,
               collapsible : true,
               region : 'west',
               rootVisible : false,
               mainPanelRef : this
            },this.getTabPanelConfig()]
      });
      this.callParent();
   },
   tbarConfig : function()
   {
      var items = [{
         xtype : 'button',
         text : this.LANG_TEXT.ADDPREFERACT,
         listeners : {
            click : this.tbarAddButtonClickHandler,
            scope : this
         }
      },{
         xtype : 'button',
         text : this.LANG_TEXT.RECYCLE,
         listeners : {
            click : this.tbarListButtonClickHandler,
            scope : this
         }
      }];
   return items;
   },
   tbarAddButtonClickHandler : function()
   {
      this.renderPanel('PreferActEditor',{
         tbar : this.tbarConfig()
      });
   },
   tbarListButtonClickHandler : function()
   {
      this.renderPanel('PreferActList',{
         tbar : this.tbarConfig()
      });
   }
});


