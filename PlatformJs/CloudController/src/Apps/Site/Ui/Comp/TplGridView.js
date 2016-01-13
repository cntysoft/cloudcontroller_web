/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Ui.Comp.TplGridView', {
   extend : 'WebOs.Component.FsView.GridView',
   alias : 'widget.siteuicomptplgridview',
   /*
    * @inheritdoc
    */
   getVeMapItem : function(fileType)
   {
      if(fileType == 'html' || fileType == 'phtml'){
         return [true, true, 'App.Site.Ui.Comp.CodeEditor'];
      }
      return this.callParent(arguments);
   }
});
