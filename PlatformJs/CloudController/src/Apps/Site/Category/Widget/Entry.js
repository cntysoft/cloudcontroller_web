/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 节点管理程序
 */
Ext.define('App.Site.Category.Widget.Entry', {
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
         height : 300,
         maximizable : false
      });
   },
   getNavTreeData : function()
   {
      var U_NAMES = this.GET_LANG_TEXT('WIDGET_NAMES');
      var me = this;
      return {
         id : 'root',
         name : this.pmText.DISPLAY_TEXT,
         children : [{
            text : U_NAMES.STRUCTURE,
            id : 'Structure',
            leaf : true
         },{
            text : U_NAMES.SORTER,
            id : 'Sorter',
            leaf : true
         }]
      };
   }
});