/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Category.Main', {
   extend : 'WebOs.Kernel.ProcessModel.App',
   requires : [
      'App.Site.Category.Lang.zh_CN',
      'App.Site.Category.Widget.Entry',
      'App.Site.Category.Widget.Structure',
      'App.Site.Category.Widget.Sorter'
   ],
   statics : {
      N_TYPE_SINGLE: 1,
      N_TYPE_LINK: 2,
      N_TYPE_GENERAL: 3,
      N_TYPE_INDEX: 4
   },
   /*
    * @inheritdoc
    */
   id : 'Site.Category',
   /*
    * @inheritdoc
    */
   widgetMap : {
      Entry : 'App.Site.Category.Widget.Entry',
      Sorter : 'App.Site.Category.Widget.Sorter',
      Structure : 'App.Site.Category.Widget.Structure'
   },

   /*
    * 根据节点的类型的ID获取面板类型
    *
    * @param {String} type
    * @return {String}
    */
   getPanelKeyByNodeType : function(type)
   {
      var ret = '';
      switch (type) {
         case 1:
         case 4:
            ret = 'SinglePanel';
            break;
         case 2:
            ret = 'LinkPanel';
            break;
         case 3:
            ret = 'GeneralPanel';
            break;
      }
      return ret;
   },
   /*
    * 根据节点ID加载节点数据
    *
    * @param {Int}id
    * @param {Fn} callback
    */
   loadNode : function(id, callback, scope)
   {
      this.callApp('Structure/getNodeInfo', {
         id : id
      }, callback, scope);
   },

   /*
    * 添加一个新的节点
    *
    * @param {Object} data
    * @param {Function} callback
    * @param {Object} scope
    */
   addNode : function(data, callback, scope)
   {
      this.callApp('Structure/addNode', data, callback, scope);
   },

   /*
    * 保存一个节点数据
    *
    * @param data
    * @param callback
    * @param scope
    */
   saveNode : function(data, callback, scope)
   {
      this.callApp('Structure/updateNode', data, callback, scope);
   },
   /*
    * 删除一个节点，单页节点，外部链接节点可以删除,普通节点当还有子节点时候拒绝删除
    * 这里只是第一步判断，在PHP端还会进一步判断
    */
   deleteNode : function(data, callback, scope)
   {
      this.callApp('Structure/deleteNode', data, callback, scope);
   },
   /*
    * 查看节点的标示符是否重复
    *
    * @param {String} identifier 节点的标示符
    */
   checkNodeIdentifier : function(identifier, callback, scope)
   {
      this.callApp('Structure/checkNodeIdentifier', {
         identifier : identifier
      }, callback, scope);
   },

   getAllModels : function(callback, scope)
   {
      this.callApp('Structure/getAllContentModels', null, callback, scope);
   },

   /*
    * 排序节点
    *
    * @param {Object} nodes
    * @param {Function} callback
    * @param {Object} scope
    */
   reorderNodeList : function(nodes, callback, scope)
   {
      this.callApp('Structure/reorderNodeList', nodes, callback, scope);
   }
});