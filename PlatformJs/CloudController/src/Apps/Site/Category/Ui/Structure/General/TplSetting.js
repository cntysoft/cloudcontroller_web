/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 栏目模板设置面板
 */
Ext.define('App.Site.Category.Ui.Structure.General.TplSetting', {
   extend: 'Ext.form.Panel',
   requires : [
      'App.Site.Category.Comp.CmSelector',
      'CloudController.Utils',
      'Cntysoft.Component.TplSelect.Win'
   ],
   mixins: {
      langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
   },
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.Site.Category',
   /*
    * 是否设置值标志变量
    *
    * @param {Boolean} isValueSetted
    */
   isValueSetted : false,

   //private
   mainPanelRef : null,
   //private
   COMMON_TEXT : null,
   /*
    * @property {WebOs.Component.TplSelectWin} tplSelectWinRef
    */
   tplSelectWinRef : null,

   constructor : function(config)
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('STRUCTURE.GENERAL_TAB_PANEL.TPL_SETTING');
      this.COMMON_TEXT = config.mainPanelRef.COMMON_TEXT;
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config,{
         title : this.LANG_TEXT.TITLE,
         bodyPadding : 10,
         bodyStyle : 'background-color : #ffffff',
         autoScroll : true
      });
   },

   initComponent : function()
   {
      Ext.apply(this,{
         defaults : {
            labelWidth : 200,
            listeners : this.getFormItemListener()
         },
         bbar : this.getBBarConfig(),
         items : this.getFormFieldsConfig()
      });
      this.callParent();
   },

   getModelTplsValue : function()
   {
      var values = this.getForm().getValues();
      var models = this.down('sitecategorycompcmselector').models;
      var model;
      var modelsTemplate = {};
      var mkey;
      for(var index = 0; index < models.length; index++) {
         model = models[index];
         mkey = 'modelSelector_' + model.id;
         if(undefined != values[mkey] && values[mkey] == 'on'){
            modelsTemplate[model.id] = values['modelTpl_' + model.id];
         }
      }
      return modelsTemplate;
   },

   tplSelectHandler : function(textfield)
   {
      var win = this.getTplSelectWindow(textfield);
      win.center();
      win.show();
   },

   /*
    * @return {Cntysoft.Component.TplSelectWindow}
    */
   getTplSelectWindow : function(textfield)
   {
      this.tfObj = textfield;
      var basePath = CloudController.Utils.getTplPath();
      var len = basePath.length;
      if(null == this.tplSelectWinRef){
         this.tplSelectWinRef = new Cntysoft.Component.TplSelect.Win({
            startPaths : basePath,
            listeners : {
               tplfileselected : function(file)
               {
                  this.tfObj.setValue(file.substr(len+1));
               },
               scope : this
            }
         });
      }
      return this.tplSelectWinRef;
   },

   /*
    * 接口函数，判断面板是否合法
    *
    * @return {Boolean}
    */
   isPanelValid : function()
   {
      var form = this.getForm();
      var modelsTemplate = this.getModelTplsValue();
      if(form.isValid() && !Ext.Object.isEmpty(modelsTemplate)){
         return true;
      }else if(Ext.Object.isEmpty(modelsTemplate)){
         this.mainPanelRef.setActiveTab(this);
         Cntysoft.showErrorWindow(this.LANG_TEXT.MSG.MODELS_TPL_EMPTY);
      }
   },

   getPanelValue : function()
   {
      var values = this.getForm().getValues();
      for(var key in values) {
         if(-1 != key.indexOf('_')){
            delete values[key];
         }
      }
      values.modelsTemplate = this.getModelTplsValue();
      return values;
   },

   applyPanelValue : function(value)
   {
      this.getForm().setValues(value);
   },

   resetPanelValue : function()
   {
      this.getForm().reset();
   },

   /*
    * 获取底部操作配置对象
    */
   getBBarConfig : function()
   {
      return this.mainPanelRef.getBBarConfig();
   },
   /*
    * 获取表单项默认的监听函数
    *
    * @return {Object}
    */
   getFormItemListener : function()
   {
      return {
         afterrender : function(comp)
         {
            this.mainPanelRef.mixins.formTooltip.setupTooltipTarget.call(this.mainPanelRef, comp);
         },
         scope : this
      };
   },

   /*
    * 获取表单配置项
    *
    * @return {Array}
    */
   getFormFieldsConfig : function()
   {
      var RED_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
      var L = this.LANG_TEXT;
      var LABEL_TEXT = L.LABEL;
      var TOOLTIP_TEXT = L.TOOLTIP;
      var BLANK_TEXT = L.BLANK_TEXT;
      var BTN_TEXT = Cntysoft.GET_LANG_TEXT('UI.BTN');
      return [{
         xtype : 'fieldcontainer',
         fieldLabel : LABEL_TEXT.LIST_TPL + RED_STAR,
         layout : {
            type : 'hbox'
         },
         toolTipText : TOOLTIP_TEXT.LIST_TPL,
         anchor : '70%',
         items : [{
            xtype : 'textfield',
            flex : 1,
            margin : '0 10 0 0',
            name : 'listTemplateFile',
            allowBlank : false,
            value : '列表页模板/默认文章列表页模板.phtml',
            blankText : BLANK_TEXT.LIST_TPL
         }, {
            xtype : 'button',
            text : BTN_TEXT.SELECT,
            width : 80,
            listeners : {
               click : function(btn)
               {
                  this.tplSelectHandler(btn.previousSibling());
               },
               scope : this
            }
         }]
      }, {
         xtype : 'fieldcontainer',
         fieldLabel : LABEL_TEXT.HOME_TPL,
         anchor : '70%',
         toolTipText : TOOLTIP_TEXT.HOME_TPL,
         layout : {
            type : 'hbox'
         },
         items : [{
            xtype : 'textfield',
            flex : 1,
            margin : '0 10 0 0',
            name : 'coverTemplateFile'
         }, {
            xtype : 'button',
            text : BTN_TEXT.SELECT,
            width : 80,
            listeners : {
               click : function(btn)
               {
                  this.tplSelectHandler(btn.previousSibling());
               },
               scope : this
            }
         }]
      }, {
         xtype : 'fieldcontainer',
         fieldLabel : LABEL_TEXT.CONTENT_MODEL,
         layout : {
            type : 'hbox'
         },
         items : [{
            xtype : 'component',
            html : L.MSG.CONTENT_MODEL
         }]
      }, {
         xtype : 'sitecategorycompcmselector',
         mainPanelRef : this
      }];
   },
   destroy : function()
   {
      delete this.mainPanelRef;
      delete this.COMMON_TEXT;
      delete this.tplSelectWinRef;
      this.mixins.langTextProvider.destroy.call(this);
      this.callParent();
   }
});