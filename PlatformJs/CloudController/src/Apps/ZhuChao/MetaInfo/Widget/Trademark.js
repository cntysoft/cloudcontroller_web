/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.MetaInfo.Widget.Trademark', {
   extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires: [
      'App.ZhuChao.MetaInfo.Ui.Trademark.ListView',
      'App.ZhuChao.MetaInfo.Ui.Trademark.Info'
   ],
   mixins: {
      multiTabPanel: 'SenchaExt.Mixin.MultiTabPanel'
   },
   panelClsMap: {
      ListView :  'App.ZhuChao.MetaInfo.Ui.Trademark.ListView',
      Info :  'App.ZhuChao.MetaInfo.Ui.Trademark.Info'
   },

   /**
    * {@link WebOs.Mixin.MultiTabPanel#initPanelType initPanelType}
    * @property {String} initPanelType
    */
   initPanelType: 'ListView',
   initPmTextRef: function ()
   {
      this.pmText = this.GET_PM_TEXT('TRADEMARK');
   },

   initLangTextRef: function ()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('TRADEMARK');
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config,{
         resizable:false,
         width : 1000,
         height : 500,
         maximizable : true,
         maximized : true
      });
      this.callParent([config]);
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