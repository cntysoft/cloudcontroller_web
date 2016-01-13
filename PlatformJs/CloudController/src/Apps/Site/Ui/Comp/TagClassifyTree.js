/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 标签选择树
 */
Ext.define('App.Site.Ui.Comp.TagClassifyTree', {
   extend : 'Ext.tree.Panel',
   alias : 'widget.siteuicomptagclassifytree',
   mixins : {
      fcm : 'Cntysoft.Mixin.ForbidContextMenu',
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.Site.Ui',
   //private
   appRef : null,
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('COMP.TAG_CLASSIFY_TREE');
      this.applyConstraintConfig(config);
      Ext.apply(config, {
         store : new Ext.data.TreeStore({
            root: {
               expanded: true,
               children: []
            }
         })
      });

      this.callParent([config]);
   },
   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         title : this.LANG_TEXT.TITLE,
         collapsible : true,
         width : 250,
         margin : '0 1 0 0',
         border : 1,
         rootVisible : false
      });


   },

   initComponent : function()
   {
      this.addListener({
         afterrender : function(tree)
         {
            this.loadTree(function(){
               tree.store.getRootNode().expand();
            });
         },
         scope : this
      });
      this.callParent();
   },
   /*
    * 加载节点树
    *
    * @param {Function} callback
    * @param {Object} scope
    */
   loadTree : function(callback, scope)
   {
      callback = Ext.isFunction(callback) ? callback : Ext.emptyFn;
      scope = scope || this;
      this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
      this.appRef.getTagListTreeNodes(function(response){
         this.loadMask.hide();
         if(!response.status){
            Cntysoft.processApiError(response);
         } else{
            var root = response.data;
            this.store.setRootNode(root);
            callback.call(scope);
         }
      }, this);
   },
   destroy : function()
   {
      this.mixins.langTextProvider.destroy.call(this);
      delete this.appRef;
      this.callParent();
   }
});