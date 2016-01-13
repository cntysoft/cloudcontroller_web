/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 设置选项面板,这个负责加载所有面板的数据，进行集中处理
 */
Ext.define('App.Site.Category.Ui.Structure.Single.FrontStyleSetting', {
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
    * @param {Boolean} isValueSetted
    */
   isValueSetted : false,
   //private
   mainPanelRef : null,
   constructor : function(config)
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('STRUCTURE.SINGLE_TAB_PANEL.FRONT_STYLE_SETTING');
      this.mainPanelRef = config.mainPanelRef;
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config,{
         title : this.LANG_TEXT.TITLE,
         bodyPadding : 10,
         autoScroll : true
      });
   },

   initComponent : function()
   {
      Ext.apply(this,{
         bbar : this.getBBarConfig(),
         defaults : {
            labelWidth : 200,
            listeners : this.getFormItemListener()
         },
         items : this.getFormFieldsConfig(),
         listeners : {
            show : function(){
               if(this.mainPanelRef.currentLoadedNode && this.mainPanelRef.currentLoadedNode.nodeType == 4){
                  this.showOnMenuCt.setHidden(true);
                  this.showOnListParentCt.setHidden(true);
               }else{
                  this.showOnMenuCt.setHidden(false);
                  this.showOnListParentCt.setHidden(false);
               }
            },
            scope : this
         }
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
      return this.getForm().isValid();
   },
   getPanelValue : function()
   {
      return this.getForm().getValues();
   },
   applyPanelValue : function(values)
   {
      this.getForm().setValues(values);
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
      var L = this.LANG_TEXT;
      var C = this.GET_LANG_TEXT('STRUCTURE.COMMON');
      var LABEL_TEXT = L.LABEL;
      var C_LABEL_TEXT = C.LABEL;
      var C_TOOLTIP_TEXT = C.TOOLTIP;
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
      },{
         //是否在首页顶部导航处显示
         xtype : 'fieldcontainer',
         width : 300,
         fieldLabel : C_LABEL_TEXT.SHOW_ON_INDEX_MENU,
         defaultType : 'radiofield',
         toolTipText : C_TOOLTIP_TEXT.SHOW_ON_INDEX_MENU,
         layout : {
            type : 'hbox'
         },
         items : [{
            boxLabel : C_LABEL_TEXT.YES,
            name : 'showOnMenu',
            inputValue : 1,
            checked : true,
            margin : '0 10 0 0'

         }, {
            boxLabel : C_LABEL_TEXT.NO,
            name : 'showOnMenu',
            inputValue : 0
         }],
         listeners : {
            afterrender : function(ct)
            {
               this.showOnMenuCt = ct;
            },
            scope : this
         }
      },{
         //是否在首页栏目列表处显示
         xtype : 'fieldcontainer',
         width : 300,
         fieldLabel : C_LABEL_TEXT.SHOW_ON_PARENT_LIST,
         defaultType : 'radiofield',
         toolTipText : C_TOOLTIP_TEXT.SHOW_ON_PARENT_LIST,
         layout : {
            type : 'hbox'
         },
         items : [{
            boxLabel : C_LABEL_TEXT.YES,
            name : 'showOnListParent',
            inputValue : 1,
            checked : true,
            margin : '0 10 0 0'

         }, {
            boxLabel : C_LABEL_TEXT.NO,
            name : 'showOnListParent',
            inputValue : 0
         }],
         listeners : {
            afterrender : function(ct)
            {
               this.showOnListParentCt = ct;
            },
            scope : this
         }
      }];
   },
   destroy : function()
   {
      delete this.mainPanelRef;
      this.mixins.langTextProvider.destroy.call(this);
      //delete this.dirnameFieldRef;
      this.callParent();
   }
});