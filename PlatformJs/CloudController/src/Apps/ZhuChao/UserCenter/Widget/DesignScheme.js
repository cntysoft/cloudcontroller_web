/*
 * Cntysoft Cloud Software Team
 *
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.UserCenter.Widget.DesignScheme', {
   extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires: [
      'App.ZhuChao.UserCenter.Ui.DesignScheme.ListView',
      'App.ZhuChao.UserCenter.Ui.DesignScheme.Info'
   ],
   mixins: {
      multiTabPanel: 'SenchaExt.Mixin.MultiTabPanel'
   },
   panelClsMap: {
      ListView :  'App.ZhuChao.UserCenter.Ui.DesignScheme.ListView',
      Info :  'App.ZhuChao.UserCenter.Ui.DesignScheme.Info'
   },

   /*
    * {@link WebOs.Mixin.MultiTabPanel#initPanelType initPanelType}
    */
   initPanelType: 'ListView',
   
   initPmTextRef: function ()
   {
      this.pmText = this.GET_PM_TEXT('DESIGN_SCHEME');
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