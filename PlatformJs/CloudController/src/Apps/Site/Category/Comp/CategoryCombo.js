/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 系统栏目管理类，栏目树面板
 */
Ext.define('App.Site.Category.Comp.CategoryCombo', {
   extend: 'Ext.form.field.Picker',
   alias: 'widget.sitecategorycompcategorycombo',
   requires: [
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
   runableLangKey : 'App.Site.Category',
   
   editable : false,
   /*
    * 默认的允许节点类型
    *
    * @property {Array} allowTypes
    */
   allowTypes : [1, 2, 3],
   /*
    * 需要展开的路径
    *
    * @property {String} expandPath
    */
   expandPath : null,
   
   /*
    * 当前加载的节点的数据
    *
    * @property {Object} currentNode
    */
   currentNode : null,
   /*
    * @event categoryselect
    * 通知栏打开完成
    *
    *  @param {Ext.data.Model} record
    */
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
         allowTypes : this.allowTypes,
         listeners : {
            itemclick : this.nodeClickHandler,
            scope : this
         }
      });
      
   },
   
   /*
    * 判断本次点击是否允许
    *
    * @param {Ext.tree.Panel} tree
    * @param {Ext.data.NodeInterface} record
    * @return {Boolean}
    */
   isClickAllowed : function(tree, record)
   {
      return true;
   },
   
   /*
    * 节点选择处理器函数
    */
   nodeClickHandler : function(view, record)
   {
      if(this.isClickAllowed(view, record)){
         var nodeType = record.get('nodeType');
         var currentNode = this.currentNode;
         var loopNode = record;
         if(currentNode && nodeType == 3){
            //合理性检查
            if(record.get('id') == currentNode.id){
               return;
            }
            while(loopNode){
               if(currentNode.id == loopNode.get('id')){
                  return;
               }
               loopNode = loopNode.parentNode;
            }
         }
         this.collapse();
         if(this.hasListeners.categoryselect){
            this.fireEvent('categoryselect', record);
         }
         this.setRawValue(record.get('text'));
         this.idData = record.get('id');
      }
   },
   
   /*
    * 获取当前选中的值
    *
    * @return {int}
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
    * 设置当选id
    *
    * @param {int} id
    */
   setValue : function(value)
   {
      this.idData = value;
      return this;
   },
   
   /*
    * 数据重置，这里的处理跟ExtJs默认的不一样
    */
   reset : function()
   {
      var emptyText = this.emptyText;
      var isEmpty;
      var picker = this.getPicker();
      if(this.rendered && emptyText){
         this.setRawValue(emptyText);
         this.valueContainsPlaceholder = true;
         if(isEmpty){
            this.inputEl.addCls(this.emptyCls);
         }
         this.autoSize();
      }
      this.expandPath = null;
      picker.collapseAll();
      this.idData = 0;
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
      var tree = this.getPicker();
      var store = tree.getStore();
      store.reload({
         node : store.getRootNode()
      });
   }
});