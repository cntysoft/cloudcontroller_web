/*
 * Cntysoft Cloud Software Team
 *
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.UserCenter.Widget.Decorator', {
   extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires: [
      'App.ZhuChao.UserCenter.Ui.Decorator.ListView',
      'App.ZhuChao.UserCenter.Ui.Decorator.Info'
   ],
   mixins: {
      multiTabPanel: 'SenchaExt.Mixin.MultiTabPanel'
   },
   panelClsMap: {
      ListView :  'App.ZhuChao.UserCenter.Ui.Decorator.ListView',
      Info :  'App.ZhuChao.UserCenter.Ui.Decorator.Info'
   },

   /*
    * {@link WebOs.Mixin.MultiTabPanel#initPanelType initPanelType}
    */
   initPanelType: 'ListView',
   
   /*
    * 装修公司的用户标识
    */
   userType : 3,
   
   initPmTextRef: function ()
   {
      this.pmText = this.GET_PM_TEXT('DECORATOR');
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