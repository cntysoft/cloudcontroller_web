/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 栏目选项设置面板
 */
Ext.define('App.Site.Category.Ui.Structure.General.CategoryOption', {
   extend: 'Ext.form.Panel',
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
    * @param {boolean} isValueSetted
    */
   isValueSetted : false,
   //private
   mainPanelRef : null,
   //private
   COMMON_TEXT : null,

   constructor : function(config)
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('STRUCTURE.GENERAL_TAB_PANEL.CATEGORY_OPT');
      this.COMMON_TEXT = config.mainPanelRef.COMMON_TEXT;
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig : function(config)
   {
      Ext.apply(config,{
         bodyPadding : 10,
         bodyStyle : 'background-color : #ffffff',
         autoScroll : true,
         title : this.LANG_TEXT.TITLE
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

   /*
    * 接口函数，判断面板是否合法
    *
    * @return {Boolean}
    */
   isPanelValid : function()
   {
      return true;
   },

   getPanelValue : function()
   {
      return this.getForm().getValues();
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
      var C = this.COMMON_TEXT;
      var L = this.LANG_TEXT;
      var C_LABEL_TEXT = C.LABEL;
      var TOOLTIP_TEXT = C.TOOLTIP;
      var LABEL_TEXT = L.LABEL;
      var BTN_TEXT = Cntysoft.GET_LANG_TEXT('UI.BTN');
      return [{
         xtype : 'fieldcontainer',
         fieldLabel : C_LABEL_TEXT.OPEN_TYPE,
         defaultType : 'radiofield',
         layout : {
            type : 'hbox'
         },
         items : [{
            boxLabel : C_LABEL_TEXT.OPEN_TYPE_ORG,
            name : 'openType',
            inputValue : 0,
            checked : true,
            margin : '0 5 0 0'
         }, {
            boxLabel : C_LABEL_TEXT.OPEN_TYPE_NEW,
            name : 'openType',
            inputValue : 1
         }]
      }, {
         xtype : 'fieldcontainer',
         fieldLabel : C_LABEL_TEXT.SHOW_ON_INDEX_MENU,
         defaultType : 'radiofield',
         toolTipText : C_LABEL_TEXT.SHOW_ON_INDEX_MENU,
         anchor : '50%',
         maxWidth : 500,
         minWidth : 400,
         layout : {
            type : 'hbox'
         },
         items : [{
            boxLabel : BTN_TEXT.YES,
            name : 'showOnMenu',
            inputValue : '1',
            checked : true,
            margin : '0 10 0 0'
         }, {
            boxLabel : BTN_TEXT.NO,
            name : 'showOnMenu',
            inputValue : '0'
         }]
      }, {
         xtype : 'fieldcontainer',
         fieldLabel : C_LABEL_TEXT.SHOW_ON_PARENT_LIST,
         defaultType : 'radiofield',
         toolTipText : C_LABEL_TEXT.SHOW_ON_PARENT_LIST,
         anchor : '50%',
         maxWidth : 500,
         minWidth : 400,
         layout : {
            type : 'hbox'
         },
         items : [{
            boxLabel : BTN_TEXT.YES,
            name : 'showOnListParent',
            inputValue : '1',
            checked : true,
            margin : '0 10 0 0'
         }, {
            boxLabel : BTN_TEXT.NO,
            name : 'showOnListParent',
            inputValue : '0'
         }]
      }];
   },

   destroy : function()
   {
      if(this.tplSelectWinRef){
         Ext.destroy(this.tplSelectWinRef);
         delete this.tplSelectWinRef;
      }
      delete this.mainPanelRef;
      delete this.COMMON_TEXT;
      this.mixins.langTextProvider.destroy.call(this);
      this.callParent();
   }
});