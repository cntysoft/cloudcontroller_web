/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 内容模型选择器
 */
Ext.define('App.Site.Category.Comp.CmSelector', {
   extend : 'Ext.container.Container',
   alias : 'widget.sitecategorycompcmselector',
   requires : [
      'Ext.layout.container.VBox'
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

   models : null,
   isItemAdded : false,
   needSelectApply : false,
   node : null,
   /*
    * 引用这个内容模型设置器的对象引用
    */
   mainPanelRef : null,
   constructor : function(config)
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('STRUCTURE.GENERAL_TAB_PANEL.TPL_SETTING');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         layout : {
            type : 'vbox'
         }
      });
   },

   /*
    * 初始化组件，在这里主要给mainPanel的nodeloaded事件绑定监听函数
    */
   initComponent : function()
   {
      this.mainPanelRef.mainPanelRef.addListener('nodeloaded', this.nodeLoadHandler, this);
      this.addListener('added', this.initModelItems, this);
      this.callParent();
   },
   /*
    * 获取选择的结果,这个组件一般只是要获取值
    */
   getValue : function()
   {
      var items = this.items;
      var ret = {};
      var checkbox;
      var tpl;
      Ext.each(items, function(item){
         checkbox = item.down('checkbox');
         tpl = item.down('textfield');
         if(checkbox.getRawValue()){
            ret[item.id] = tpl.getRawValue();
         }
      }, this);
      return ret;
   },
   /*
    * 设置相关组件的值
    *
    * @param {Object} node
    */
   nodeLoadHandler : function(node)
   {
      if(!this.isItemAdded){
         this.node = node;
         this.needSelectApply = true;
         return;
      }
      var models, size;
      if(node.nodeType == 3){
         models = node.modelsTemplate;
         size = Ext.Object.getSize(models);
         this.items.each(function(item){
            var model = item.model;
            var cbox = item.down('checkbox');
            cbox.setRawValue(false);
            if(size > 0){
               Ext.iterate(models, function(modelId, tpl){
                  modelId = parseInt(modelId, 10);
                  if(model.id === modelId){
                     cbox.setRawValue(true);
                     if('' == Ext.String.trim(tpl)){
                        item.down('textfield').setRawValue(model.defaultTemplateFile);
                     } else{
                        item.down('textfield').setRawValue(tpl);
                     }
                  }
               }, this);
            } else{
               item.down('checkbox').setRawValue(false);
               item.down('textfield').setRawValue(model.defaultTemplateFile);
            }
         });
      }
      this.node = null;
      this.needSelectApply = false;
   },
   /*
    * 获取模型选择器数据
    *
    * @return {Array}
    */
   initModelItems : function()
   {
      var items = [];
      var BTN_TEXT = Cntysoft.GET_LANG_TEXT('UI.BTN');
      var appRef = this.mainPanelRef.mainPanelRef.mainPanelRef.appRef;
      appRef.getAllModels(function(response){
         if(!response.status){
            Cntysoft.processApiError(response);
            return;
         }
         var data = response.data;
         this.models = data;
         Ext.each(data, function(item){
            items.push({
               xtype : 'fieldcontainer',
               layout : {
                  type : 'hbox'
               },
               model : item,
               items : [{
                  width : 125,
                  xtype : 'checkbox',
                  boxLabel : item.name,
                  checked : 1 == item.id ? true : false,
                  name : 'modelSelector_' + item.id
               }, {
                  xtype : 'textfield',
                  width : 450,
                  margin : '0 5 0 0',
                  value : item.defaultTemplateFile,
                  allowBlank : false,
                  blankText : this.LANG_TEXT.BLANK_TEXT.CONTENT_TPL,
                  name : 'modelTpl_' + item.id
               }, {
                  xtype : 'button',
                  width : 80,
                  text : BTN_TEXT.SELECT,
                  margin : '0 5 0 0',
                  listeners : {
                     click : function(btn)
                     {
                        this.mainPanelRef.tplSelectHandler(btn.previousSibling());
                     },
                     scope : this
                  }
               }]
            });
         }, this);
         this.add(items);
         this.isItemAdded = true;
         if(this.needSelectApply){
            this.nodeLoadHandler(this.node);
         }
      }, this);
   },
   destroy : function()
   {
      if(this.mainPanelRef.mainPanelRef){
         this.mainPanelRef.mainPanelRef.removeListener('nodeloaded', this.nodeLoadHandler, this);
      }
      delete this.mainPanelRef;
      this.callParent();
   }
});