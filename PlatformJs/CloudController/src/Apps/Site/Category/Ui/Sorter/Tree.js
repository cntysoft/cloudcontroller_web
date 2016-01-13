/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 栏目管理器节点树管理
 */
Ext.define('App.Site.Category.Ui.Sorter.Tree', {
   extend : 'App.Site.Category.Comp.CategoryTree',
   alias : 'widget.sitecategoryuisortertree',
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   /**
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    */
   runableLangKey : 'App.Site.Category',
   allowTypes : [1, 2, 3, 4, 5],
   extraFields : [],
   constructor : function(config)
   {
      this.title = this.GET_LANG_TEXT('SORTER.TREE_TITLE');
      this.callParent([config]);
   },
   initComponent : function()
   {
      this.addListener({
         afterrender : function(){
            this.getRootNode().expand();
         },
         scope : this
      });
      this.callParent();
   }
});