/*
 * Cntysoft Cloud Software Team
 *
 * @author ZhiHui <liuyan2526@qq.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.MarketMgr.Ui.AdsMgr.AdsEditor', {
   extend : 'Ext.form.Panel',
   panelType : 'AdsEditor',
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.MarketMgr',
   requires : [
      'WebOs.Component.Uploader.SimpleUploader'
   ],
   formRef : null,
   comboStoreRef : null,
   constructor : function (config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('ADSMGR.ADSEDITOR');
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
      Ext.apply(this, {
         items : this.formItemsConfig(),
         buttons : [{
               text : this.LANG_TEXT.SUBMIT,
               listeners : {
                  click : this.submitButtonClickHandler,
                  scope : this
               }
            }],
         listeners : {
            afterrender : function (form){
               this.formRef = form;
               if('modify' == this.type){
                  this.gotoModifyMode();
               } else{
                  this.gotoNewMode();
               }
            },
            scope : this
         }
      });
      this.callParent();
   },
   gotoModifyMode : function ()
   {
      var value = this.record.getData();
      delete(value.id);
      value.moduleId = this.record.data.module;
      this.formRef.getForm().setValues(value);
      this.imageRef.setSrc(FH.getZhuChaoImageUrl(this.record.data.image));
      this.image = this.record.data.image;
      this.fileRefs = parseInt(this.record.data.fileRefs);
   },
   gotoNewMode : function ()
   {
      var form = this.formRef.getForm();
      form.reset();
      var value = {
         module : this.record.data.text
      };
      form.setValues(value);
   },
   /**
    * 提交按钮处理事件
    * 
    * @returns {undefined}
    */
   submitButtonClickHandler : function ()
   {
      var form = this.formRef.getForm();
      if(form.isValid()){
         var value = form.getValues();
         if('modify' == this.type){
            value.moduleId = this.record.data.moduleId;
            value.image = this.image;
            value.fileRefs = this.fileRefs;
            value.id = this.record.id;
            delete(value.module);
            this.mainPanelRef.appRef.modifyAds(value, function (response){
               if(!response.status){
                  Cntysoft.showErrorWindow(response.msg);
               } else{
                  this.mainPanelRef.renderPanel('ListView', {
                     tbar : this.mainPanelRef.tbarConfig()
                  });
                  Cntysoft.showAlertWindow(this.LANG_TEXT.MODIFYSUCCESS);
               }
            }, this);
         } else{
            value.moduleId = this.record.id;
            value.image = this.image;
            value.fileRefs = this.fileRefs;
            this.mainPanelRef.appRef.addAds(value, function (response){
               if(!response.status){
                  Cntysoft.showErrorWindow(response.msg);
               } else{
                  this.mainPanelRef.renderPanel('ListView', {
                     tbar : this.mainPanelRef.tbarConfig()
                  });
                  Cntysoft.showAlertWindow(this.LANG_TEXT.ADDSUCCESS);
               }
            }, this);
         }
      }
   },
   /**
    * form表单元素
    * 
    * @returns {Array}
    */
   formItemsConfig : function ()
   {
      return items = [{
            xtype : 'textfield',
            name : 'module',
            margin : '30 0 0 30',
            fieldLabel : this.LANG_TEXT.MODULENAME,
            allowBlank : false,
            readOnly : true
         }, {
            xtype : 'textfield',
            name : 'name',
            margin : '10 0 0 30',
            fieldLabel : this.LANG_TEXT.ADNAME,
            allowBlank : false
         }, {
            xtype : 'textfield',
            name : 'contentUrl',
            margin : '10 0 0 30',
            fieldLabel : this.LANG_TEXT.URL,
            allowBlank : false
         }, {
            xtype : 'textfield',
            name : 'location',
            margin : '10 0 0 30',
            fieldLabel : this.LANG_TEXT.LOCATION,
            allowBlank : false
         }, {
            xtype : 'textfield',
            name : 'gbcolor',
            margin : '10 0 0 30',
            fieldLabel : this.LANG_TEXT.GBCOLOR,
            allowBlank : false
         }, {
            xtype : 'datefield',
            name : 'startTime',
            margin : '10 0 0 30',
            format : 'Y-m-d',
            fieldLabel : this.LANG_TEXT.STARTTIME,
            allowBlank : false
         }, {
            xtype : 'datefield',
            name : 'endTime',
            margin : '10 0 0 30',
            format : 'Y-m-d',
            fieldLabel : this.LANG_TEXT.ENDTIME,
            allowBlank : false
         }, {
            xtype : 'fieldcontainer',
            fieldLabel : this.LANG_TEXT.IMAGE,
            margin : '10 0 0 30',
            layout : {
               type : 'hbox',
               align : 'bottom'
            },
            items : [{
                  xtype : 'image',
                  width : 200,
                  height : 100,
                  style : 'border:1px solid #EDEDED',
                  listeners : {
                     afterrender : function (comp){
                        this.imageRef = comp;
                     },
                     scope : this
                  }
               }, {
                  xtype : 'webossimpleuploader',
                  uploadPath : this.mainPanelRef.appRef.getUploadFilesPath(),
                  createSubDir : false,
                  fileTypeExts : ['gif', 'png', 'jpg', 'jpeg'],
                  margin : '0 0 0 5',
                  maskTarget : this,
                  enableFileRef : true,
                  buttonText : this.LANG_TEXT.UPDATE,
                  listeners : {
                     fileuploadsuccess : this.uploadSuccessHandler,
                     scope : this
                  }
               }]
         }];
   },
   /**
    * 图片上传
    * 
    * @param {type} file
    * @param {type} uploadBtn
    * @returns {undefined}
    */
   uploadSuccessHandler : function (file, uploadBtn)
   {
      var file = file.pop();
      this.fileRefs = parseInt(file.rid);
      this.image = file.filename;
      this.imageRef.setSrc(FH.getZhuChaoImageUrl(file.filename));
   },
   destroy : function ()
   {
      delete this.formRef;
      delete this.comboStoreRef;
      this.callParent();
   }
});
