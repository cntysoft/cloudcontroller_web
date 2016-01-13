/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 节点下拉选择
 */
Ext.define('App.Site.Ui.Comp.CategoryCombo', {
   extend : 'Ext.form.field.Picker',
   alias : 'widget.siteuicompcategorycombo',
   requires : [
      'App.Site.Category.Comp.CategoryTree'
   ],
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.Site.Ui',
   editable : false,
   /*
    * 需要展开的路径
    *
    * @property {String} expandPath
    */
   expandPath : null,

   idData : [],
   /*
    * 构造函数
    */
   constructor : function(config)
   {
      config = config || {};
      this.emptyText = this.GET_LANG_TEXT('COMP.CATEGORY_COMBO.SELECT_NODE');
      this.callParent([config]);
   },
   createPicker : function()
   {
      return new App.Site.Category.Comp.CategoryTree({
         height : 250,
         width : 300,
         autoScroll : true,
         floating : true,
         allowTypes : [3],
         listeners : {
            itemclick : this.nodeClickHandler,
            scope : this
         }
      });
   },
   /*
    * 节点选择处理器函数
    */
   nodeClickHandler : function(view, record)
   {
      this.collapse();
      this.fireEvent('categoryselect', record);
      this.setRawValue(record.get('text'));
      this.idData = record.get('id');
   },
   /*
    * 获取当前选中的值
    *
    * @return {int} idData
    */
   getValue : function()
   {
      return this.idData;
   },

   /*
    * 获取提交保存的值，皮包函数
    */
   getSubmitValue : function()
   {
      return this.getValue();
   },
   /*
    * 设置展开路径,这个路径在picker打开的时候会进行相关展开
    *
    * @param {String} path
    */
   setExpandPath : function(path)
   {
      this.expandPath = path;
      return this;
   },
   /*
    * 处理相关节点展开
    */
   onExpand : function()
   {
      if(this.needReload){
         this.reloadTree();
         this.needReload = false;
         return;
      }
      if(null != this.expandPath){
         this.getPicker().getRootNode().collapse();
         this.getPicker().selectPath(this.expandPath);
         this.expandPath = null;
      } else{
         this.getPicker().expandPath('/0');
      }
   },
   /*
    * 重新加载节点,这里是加载整个树的
    */
   reloadTree : function()
   {
      var tree = this.getPicker(),
         store = tree.getStore();
      store.reload({
         node : store.getRootNode()
      });
   },


   destroy : function()
   {
      this.mixins.langTextProvider.destroy.call(this);
      this.callParent();
   }
});