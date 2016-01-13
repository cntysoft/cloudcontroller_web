/*
 * Cntysoft Cloud Software Team
 *
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.UserCenter.Widget.Project', {
   extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires: [
      'App.ZhuChao.UserCenter.Ui.Project.ListView',
      'App.ZhuChao.UserCenter.Ui.Project.Info'
   ],
   mixins: {
      multiTabPanel: 'SenchaExt.Mixin.MultiTabPanel'
   },
   panelClsMap: {
      ListView :  'App.ZhuChao.UserCenter.Ui.Project.ListView',
      Info :  'App.ZhuChao.UserCenter.Ui.Project.Info'
   },

   /*
    * {@link WebOs.Mixin.MultiTabPanel#initPanelType initPanelType}
    */
   initPanelType: 'ListView',
   
   initPmTextRef: function ()
   {
      this.pmText = this.GET_PM_TEXT('PROJECT');
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