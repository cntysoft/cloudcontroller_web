/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.Merchant.Widget.Entry', {
   extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires : [
      'App.ZhuChao.Merchant.Ui.MerchantListView'
   ],
   mixins: {
      multiTabPanel: 'SenchaExt.Mixin.MultiTabPanel'
   },
   panelClsMap: {
      ListView : 'App.ZhuChao.Merchant.Ui.MerchantListView',
      MerchantInfo : 'App.ZhuChao.Merchant.Ui.MerchantInfo'
   },
   /*
    * {@link WebOs.Mixin.MultiTabPanel#initPanelType initPanelType}
    * @property {String} initPanelType
    */
   initPanelType : 'ListView',
   initPmTextRef : function()
   {
      this.pmText = this.GET_PM_TEXT('ENTRY');
   },

   initLangTextRef : function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('ENTRY');
   },

   applyConstraintConfig : function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         layout : 'border',
         width : 1200,
         minWidth : 1200,
         minHeight : 600,
         height : 600,
         resizable : false,
         bodyStyle : 'background:#ffffff',
         maximizable : true
      });
   },

   initComponent : function()
   {
      Ext.apply(this,{
         items : [
            this.getTabPanelConfig()
         ]
      });
      this.callParent();
   }
});