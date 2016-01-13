/*
 * Cntysoft Cloud Software Team
 *
 * @author ZhiHui <liuyan2526@qq.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.MarketMgr.Ui.AdsMgr.AdsModuleEditor', {
   extend : 'Ext.form.Panel',
   panelType : 'AdsModuleEditor',
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.MarketMgr',
   formRef : null,
   constructor : function (config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('ADSMGR.ADSMODULEEDITOR');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig : function (config)
   {
      Ext.apply(config, {
         title : this.LANG_TEXT.TITLE
      });
   },
   initComponent : function ()
   {
      var C = CloudController.Const;
      Ext.apply(this, {
         items : [{
               xtype : 'textfield',
               fieldLabel : this.LANG_TEXT.MODULENAME,
               margin : '30 0 0 20',
               name : 'name',
               allowBlank : false
            }],
         buttons : [{
               text : this.LANG_TEXT.SUBMIT,
               listeners : {
                  click : this.buttonSubmitClickHandler,
                  scope : this
               }
            }],
         listeners : {
            afterrender : function (form){
               this.formRef = form;
               if(this.mode == C.MODIFY_MODE){
                  this.gotoModifyMode();
               }
            },
            scope : this
         }
      });
      this.callParent();
   },
   gotoNewMode : function ()
   {
      var form = this.formRef.getForm();
      form.reset();
   },
   gotoModifyMode : function ()
   {
      var value = {
         name : this.record.data.text
      };
      this.formRef.getForm().setValues(value);
   },
   /**
    * 提交按钮处理
    * 
    * @returns {undefined}
    */
   buttonSubmitClickHandler : function ()
   {
      var form = this.formRef.getForm();
      if(form.isValid()){
         if('modify' == this.type){
            this.setLoading(this.LANG_TEXT.INMODIFY);
            var items = {
               id : this.record.id,
               value : form.getValues()
            };
            this.mainPanelRef.appRef.modifyAdsModule(items, function (response){
               this.loadMask.hide();
               if(!response.status){
                  Cntysoft.showErrorWindow(response.msg);
               } else{
                  this.mainPanelRef.renderPanel('ListView', {
                     tbar : this.mainPanelRef.tbarConfig()
                  });
                  this.treeRef.store.reload();
                  Cntysoft.showAlertWindow(this.LANG_TEXT.MODIFYSUCCESS);
               }
            }, this);
         } else{
            this.setLoading(this.LANG_TEXT.INADD);
            this.mainPanelRef.appRef.addAdsModule(form.getValues(), function (response){
               this.loadMask.hide();
               if(!response.status){
                  Cntysoft.showErrorWindow(response.msg);
               } else{
                  this.mainPanelRef.renderPanel('ListView', {
                     tbar : this.mainPanelRef.tbarConfig()
                  });
                  this.mainPanelRef.treeRef.store.reload();
                  Cntysoft.showAlertWindow(this.LANG_TEXT.ADDSUCCESS);
               }
            }, this);
         }
      }
   },
   destroy : function ()
   {
      delete  this.formRef;
      this.callParent();
   }
});
