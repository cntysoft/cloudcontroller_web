/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Ui.Comp.TagGenWin', {
   extend : 'WebOs.Component.Window',
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider',
      formTooltip : 'Cntysoft.Mixin.FormTooltip'
   },
   requires : [
      'App.Site.Ui.Comp.CategoryCombo',
      'App.Site.Category.Comp.CategoryCombo',
      'Ext.layout.container.Fit'
   ],
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.Site.Ui',
   /*
    * @private
    * @property {Object} meta
    */
   meta : null,
   /*
    * 将标签的数据类型映射成ExtJs组件的xtype
    *
    * @private
    * @property {Object} typeMap
    */
   typeMap : null,

   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('COMP.TAG_GEN_WINDOW');
      this.mixins.formTooltip.constructor.call(this);
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         title : this.LANG_TEXT.TITLE,
         closeAction : 'destroy',
         width : 600,
         minWidth : 600,
         modal : true,
         height : 400,
         minHeight : 400,
         maximizable : false,
         constrain : true,
         constrainTo : Ext.getBody(),
         resizable : true,
         layout : 'fit',
         bodyBorder : false,
         autoShow : true,
         bodyStyle : {
            background : '#ffffff'
         }
      });
   },

   /*
    * @event taggenerated
    *
    * @param {String} tag
    */
   initComponent : function()
   {
      Ext.apply(this, {
         items : {
            xtype : 'form',
            items : this.getItemsConfig(),
            padding : '10 0 0 30',
            autoScroll : true,
            defaults : {
               width : 300,
               labelWidth : 120,
               listeners : {
                  afterrender : function(formItem)
                  {
                     this.mixins.formTooltip.setupTooltipTarget.call(this, formItem);
                  },
                  scope : this
               }
            }
         },
         buttons : [{
            text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
            listeners : {
               click : this.saveHandler,
               scope : this
            }
         }, {
            text : Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
            listeners : {
               click : function()
               {
                  this.close();
               },
               scope : this
            }
         }]
      });
      this.callParent();
   },
   /*
    * @returns {Object}
    */
   getTypeMap : function()
   {
      if(null === this.typeMap){
         this.typeMap = {
            'string' : 'textfield',
            'integer' : 'numberfield',
            'boolean' : 'radiogroup',
            'combo' : 'combobox'
         };
      }
      return this.typeMap;
   },
   saveHandler : function()
   {
      var form = this.down('form').getForm();
      if(form.isValid()){
         var attributes = this.meta.attributes;
         var values = this.getFormValues(attributes);
         if(false === values){
            return false;
         }
         var retValues = {};
         var attribute;
         var value;
         for(var key in values){
            attribute = attributes[key];
            if(attribute.defaultValue != values[key]){
               if(Ext.isString(values[key])){
                  value = Ext.String.trim(values[key]);
               }
               if('' != value){
                  retValues[key] = values[key];
               }
            }
         }
         var meta = Ext.clone(this.meta);
         meta.attributes = retValues;
         var tag = App.Site.Ui.Comp.CodeEditor.generateTag(meta);
         if(this.hasListeners.taggenerated){
            this.fireEvent('taggenerated', tag);
         }

         this.close();
      }
   },
   getFormValues : function(attributes)
   {
      var MSG = this.LANG_TEXT.MSG;
      var form = this.down('form').getForm();
      var values = form.getValues();
      if(this.down('uiccategorycombobox')){
         var ncombo = this.down('uiccategorycombobox');
         values.nodeId = ncombo.getValue();
         if(isNaN(parseInt(values.nodeId))){
            if(!ncombo.allowBlank){
               Cntysoft.showErrorWindow(MSG.NODE_ERROR);
               return false;
            }else{
               values.nodeId = attributes['nodeId'].defaultValue ? attributes['nodeId'].defaultValue : '';
            }
         }
      }
      if(this.down('combobox')){
         var mcombo = this.down('combobox');
         values.modelId = mcombo.getValue();
         if(isNaN(parseInt(values.modelId))){
            if(!mcombo.allowBlank){
               Cntysoft.showErrorWindow(MSG.MODEL_ERROR);
               return false;
            }else{
               values.modelId = attributes['modelId'].defaultValue ? attributes['modelId'].defaultValue : '';
            }
         }
      }
      return values;
   },
   getItemsConfig : function()
   {
      var attributes = this.meta.attributes;
      var attribute;
      var items = [];
      var typeMap = this.getTypeMap();
      for(var name in attributes) {
         attribute = attributes[name];
         switch(name){
            case 'nodeId':
               items.push(new App.Site.Ui.Comp.CategoryCombo({
                  labelWidth : 120,
                  value : this.LANG_TEXT.CATEGORY_COMBO_TEXT,
                  name : name,
                  allowBlank : !attribute.require,
                  toolTipText : attribute.description,
                  fieldLabel : attribute.name ? attribute.name : name,
                  listeners : {
                     afterrender : function(formItem)
                     {
                        //this.mixins.formTooltip.setupTooltipTarget.call(this, formItem);
                     },
                     scope : this
                  }
               }));
               break;
            case 'modelId':
               items.push({
                  xtype : typeMap['combo'],
                  store: this.creatModelIdStore(),
                  querymode : 'local',
                  displayField: 'name',
                  valueField: 'id',
                  value : attribute.defaultValue >= 0 && attribute.defaultValue < this.modelIds.length ? attribute.defaultValue : 0,
                  name : name,
                  allowBlank : !attribute.require,
                  toolTipText : attribute.description,
                  fieldLabel : attribute.name ? attribute.name : name
               });
               break;
            default:
               switch(attribute.dataType){
                  case 'integer':
                     items.push({
                        xtype : typeMap['integer'],
                        value : attribute.defaultValue,
                        name : name,
                        allowBlank : !attribute.require,
                        toolTipText : attribute.description,
                        fieldLabel : attribute.name ? attribute.name : name,
                        minValue : 0
                     });
                     break;
                  case 'boolean':
                     items.push({
                        xtype : typeMap['boolean'],
                        columns : 2,
                        allowBlank : !attribute.require,
                        fieldLabel : attribute.name ? attribute.name : name,
                        toolTipText : attribute.description,
                        items : [{
                           boxLabel : Cntysoft.GET_LANG_TEXT('UI.LABEL.YES'),
                           inputValue : true,
                           checked : true == attribute.defaultValue ? true : false,
                           name : name
                        }, {
                           boxLabel : Cntysoft.GET_LANG_TEXT('UI.LABEL.NO'),
                           inputValue : false,
                           checked : false == attribute.defaultValue ? true : false,
                           name : name
                        }]
                     });
                     break;
                  default :
                     items.push({
                        xtype : typeMap[attribute.dataType],
                        value : attribute.defaultValue,
                        name : name,
                        allowBlank : !attribute.require,
                        toolTipText : attribute.description,
                        fieldLabel : attribute.name ? attribute.name : name
                     });
                     break;
               }
               break;
         }
      }
      return items;
   },
   creatModelIdStore : function()
   {
      return Ext.create('Ext.data.Store', {
         fields: ['id', 'name'],
         data : this.modelIds
      });
   },
   destroy : function()
   {
      delete this.editorRef;
      delete this.meta;
      delete this.modelIds;
      this.mixins.formTooltip.destroy.call(this);
      this.mixins.langTextProvider.destroy.call(this);
      this.callParent();
   }
});