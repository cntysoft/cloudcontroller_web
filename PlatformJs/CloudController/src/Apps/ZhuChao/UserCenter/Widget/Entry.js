/*
 * Cntysoft Cloud Software Team
 *
 * @author Arvin <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.UserCenter.Widget.Entry', {
   extend : 'WebOs.OsWidget.TreeNavWidget',

   initPmTextRef : function()
   {
      this.pmText = this.GET_PM_TEXT('ENTRY');
   },
   applyConstraintConfig : function(config)
   {
      this.callParent([config]);
      Ext.apply(config,{
         width : 600,
         height : 320,
         maximizable : false
      });
   },
   getNavTreeData : function()
   {
      var U_NAMES = this.GET_LANG_TEXT('WIDGET_NAMES');
      return {
         id : 'root',
         name : this.pmText.DISPLAY_TEXT,
         children : [{
               text : U_NAMES.NORMAL,
               id : 'Normal',
               leaf : true
            }, {
               text : U_NAMES.DECORATOR,
               id : 'Decorator',
               leaf : true
            }, {
               text : U_NAMES.FOREMAN,
               id : 'Foreman',
               leaf : true 
            }, {
               text : U_NAMES.DESIGNER,
               id : 'Designer',
               leaf : true 
            }, {
               text : U_NAMES.PROJECT,
               id : 'Project',
               leaf : true 
            }, {
               text : U_NAMES.DESIGN_SCHEME,
               id : 'DesignScheme',
               leaf : true 
            }]
      };
   }
});