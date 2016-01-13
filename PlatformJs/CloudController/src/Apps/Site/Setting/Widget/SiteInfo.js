/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Setting.Widget.SiteInfo', {
   extend : 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires : [
      'Ext.layout.container.Anchor'
   ],
   mixins : {
      formTooltip : 'Cntysoft.Mixin.FormTooltip'
   },

   /*
    * 原始从服务器加载的数据快照
    */
   snapshot : null,
   //private
   formRef : null,

   initPmTextRef : function()
   {
      this.pmText = this.GET_PM_TEXT('SITE_INFO');
   },

   initLangTextRef : function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('SITE_CONFIG');
   },
   constructor : function()
   {
      this.mixins.formTooltip.constructor.call(this);
      this.callParent(arguments);
   },
   applyConstraintConfig : function(config)
   {
      this.callParent([config]);
      Ext.apply(config,{
         width : 900,
         height : 500,
         minWidth : 900,
         minHeight : 500,
         maximizable : true,
         resizable : true,
         bodyPadding : 10,
         layout : {
            type : 'anchor',
            reserveScrollbar : true
         },
         autoScroll : true
      });
   },

   initComponent : function()
   {
      var STD_TEXT = Cntysoft.GET_LANG_TEXT();
      Ext.apply(this,{
         items : this.getFormConfig(),
         autoScroll : true,
         buttons : [{
            text : STD_TEXT.UI.BTN.SAVE,
            listeners : {
               click : this.saveConfigHandler,
               scope : this
            }
         },{
            text : STD_TEXT.UI.BTN.RESET,
            listeners : {
               click : this.resetHandler,
               scope : this
            }
         }]
      });
      this.callParent();
   },
   saveConfigHandler : function()
   {
      var form = this.formRef.getForm();
      var dirtyData = {};
      var values;
      var snapshot = this.snapshot;
      var currentValue;
      if(form.isValid()){
         values = form.getValues();
         for(var key in values) {
            currentValue = values[key];
            if(snapshot[key] !== currentValue){
               dirtyData[key] = currentValue;
            }
         }
         this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
         this.appRef.saveSiteConfig(dirtyData, function(response){
            this.loadMask.hide();
            if(!response.status){
               Cntysoft.showErrorWindow(response.msg);
            } else{
               Ext.apply(this.snapshot, dirtyData);
               Cntysoft.showInfoMsgWindow(Cntysoft.GET_LANG_TEXT('MSG.SAVE_OK'));
            }
         }, this);
      }
   },
   resetHandler : function()
   {
      this.formRef.getForm().setValues(this.snapshot);
   },

   getFormConfig : function()
   {
      var T_TEXT = this.LANG_TEXT.MSG.TOOLTIP;
      var L_TEXT = this.LANG_TEXT.UI.LABEL;
      return {
         xtype : 'form',
         defaultType: 'textfield',
         defaults : {
            labelWidth : 180,
            listeners : {
               afterrender : function(formItem)
               {
                  this.mixins.formTooltip.setupTooltipTarget.call(this, formItem);
               },
               scope : this
            }
         },
         items : [{
            fieldLabel : L_TEXT.SITE_NAME + Cntysoft.Utils.HtmlTpl.RED_STAR,
            toolTipText : T_TEXT.SITE_NAME,
            allowBlank : false,
            name : 'SiteName',
            width : 500
         },{
            fieldLabel : L_TEXT.SITE_TITLE + Cntysoft.Utils.HtmlTpl.RED_STAR,
            toolTipText : T_TEXT.SITE_TITLE,
            allowBlank : false,
            name : 'SiteTitle',
            width : 500
         },{
            fieldLabel : L_TEXT.BEIAN,
            toolTipText : T_TEXT.BEIAN,
            name : 'Beian',
            width : 500
         },{

            fieldLabel : L_TEXT.COPY_RIGHT,
            toolTipText : T_TEXT.COPY_RIGHT,
            xtype : 'textarea',
            name : 'Copyright',
            width : 800,
            height : 120
         },{
            fieldLabel : L_TEXT.SITE_KEYWORD,
            toolTipText : T_TEXT.SITE_KEYWORD,
            xtype : 'textarea',
            width : 800,
            name : 'SiteKeywords',
            height : 120
         },{
            fieldLabel : L_TEXT.SITE_DESCRIPTION,
            toolTipText : T_TEXT.SITE_DESCRIPTION,
            xtype : 'textarea',
            name : 'SiteDescription',
            width : 800,
            height : 120
         }],
         listeners : {
            afterrender : function(form){
               this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
               this.formRef = form;
               this.appRef.getSiteConfig(function(response){
                  this.loadMask.hide();
                  if(!response.status){
                     Cntysoft.showErrorWindow(response.msg);
                  } else{
                     var data = response.data;
                     this.snapshot = data;
                     this.formRef.getForm().setValues(data);
                  }
               }, this);
            },
            scope : this
         }
      };
   },

   destroy : function()
   {
      delete this.formRef;
      this.callParent();
   }
});