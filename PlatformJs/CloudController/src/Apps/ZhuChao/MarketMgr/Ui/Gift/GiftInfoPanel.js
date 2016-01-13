/*
 * Cntysoft Cloud Software Team
 *
 * @author wql <wql1211608804@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 大礼包基本信息添加/修改面板
 */
Ext.define('App.ZhuChao.MarketMgr.Ui.Gift.GiftInfoPanel', {
   extend : 'Ext.panel.Panel',
   requires : [
      'WebOs.Kernel.StdPath',
      'WebOs.Component.Uploader.SimpleUploader',
      'App.ZhuChao.MarketMgr.Ui.Gift.GiftInfoImageGroup'
   ],
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   /**
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.ZhuChao.MarketMgr',
   //权限添加模式
   mode : 1,
   /**
    * @inheritdoc
    */
   panelType : 'GiftInfoPanel',
   queryAttrGridRef : null,
   formRef : null,
   pid : 0,
   fileRefs : null,
   imageRef : null,
   defPicImageRef : null,
   bannerRef : null,
   constructor : function (config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.ATTRS.Gift_INFO');
      this.applyConstraintConfig(config);
      if(config.mode == CloudController.Const.MODIFY_MODE){
         if(!Ext.isDefined(config.targetLoadId)){
            Ext.Error.raise({
               cls : Ext.getClassName(this),
               method : 'constructor',
               msg : 'mode is modify, so you must set node id'
            });
         }
      }
      this.callParent([config]);
   },
   applyConstraintConfig : function (config)
   {
      Ext.apply(config, {
         border : true,
         layout : {
            type : 'vbox',
            align : 'stretch'
         },
         scrollable : true,
         title : this.LANG_TEXT.TITLE
      });
   },
   initComponent : function ()
   {
      Ext.apply(this, {
         items : [
            this.getFormConfig()
         ],
         buttons : [{
               xtype : 'button',
               text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
               listeners : {
                  click : this.saveHandler,
                  scope : this
               }
            }]
      });
      this.addListener('afterrender', this.afterRenderHandler, this);
      this.callParent();
   },
   loadNode : function (nid)
   {
      if(this.$_current_nid_$ !== nid){
         this.gotoModifyMode();
         this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
         this.appRef.getGiftInfo(nid, this.afterLoadNodeHandler, this);
         this.$_current_nid_$ = nid;
      }
   },
   gotoNewMode : function (force)
   {
      if(force || this.mode != CloudController.Const.NEW_MODE){
         if(this.mode == CloudController.Const.MODIFY_MODE){
            this.formRef.remove(this.formRef.items.getAt(0));
         }
         this.formRef.getForm().reset();
         this.currentGiftInfo = null;
         this.mode = CloudController.Const.NEW_MODE;
         this.$_current_nid_$ = -1;
      }
   },
   gotoModifyMode : function (force)
   {
      if(force || this.mode == CloudController.Const.NEW_MODE){
         this.formRef.add(0, this.getIdFieldConfig());
         this.mode = CloudController.Const.MODIFY_MODE;
      }
   },
   afterRenderHandler : function ()
   {
      this.fileRefs = [];
      if(this.mode == CloudController.Const.MODIFY_MODE){
         this.gotoModifyMode(true);
         this.loadNode(this.targetLoadId);
      }
   },
   afterLoadNodeHandler : function (response)
   {
      this.loadMask.hide();
      if(!response.status){
         Cntysoft.Kernel.Utils.processApiError(response);
      } else{
         this.currentGiftInfo = response.data;
         this.formRef.getForm().setValues(this.currentGiftInfo);
         this.imageGroupRef.setFieldValue(response.data['image']);

         this.defPicImageFileRefs = response.data['defPicImageFileRefs'];
         this.defPicImageSrc = response.data['defPicImageSrc'];
         if(this.defPicImageSrc){
            this.defPicImageRef.setSrc(FH.getZhuChaoImageUrl(this.defPicImageSrc));
         }
         this.bannerFileRefs = response.data['bannerFileRefs'];
         this.bannerSrc = response.data['bannerSrc'];
         if(this.bannerSrc){
            this.bannerRef.setSrc(FH.getZhuChaoImageUrl(this.bannerSrc));
         }
         this.fileRefs = this.currentGiftInfo.fileRefs;
      }
   },
   saveHandler : function ()
   {
      var form = this.formRef.getForm();
      var values = {};
      var C = CloudController.Kernel.Const;
      if(form.isValid() && this.imageGroupRef.isFieldValueValid()){
         Ext.apply(values, form.getValues());
         Ext.apply(values, {
            image : this.imageGroupRef.getFieldValue(),
            defPicImage : [this.defPicImageSrc, this.defPicImageFileRefs],
            banner : [this.bannerSrc, this.bannerFileRefs],
            fileRefs : this.fileRefs});
         if(this.mode == C.NEW_MODE){
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
            this.appRef.addGift(values, this.afterAddGiftHandler, this);
         } else if(this.mode == C.MODIFY_MODE){
            Ext.apply(values, {
               id : this.currentGiftInfo.id
            });
            this.appRef.updateGift(values, this.afterUpdateGiftHandler, this);
         }
      }
   },
   afterAddGiftHandler : function (response)
   {
      var C = CloudController.Const;
      this.loadMask.hide();
      if(!response.status){
         Cntysoft.Kernel.Utils.processApiError(response);
      } else{
         Cntysoft.showAlertWindow(this.LANG_TEXT.MSG.SAVE_OK, function (){
            //刷新节点
            this.mainPanelRef.categoryTreeRef.reload();
            this.close();
         }, this);
      }
   },
   afterUpdateGiftHandler : function (response)
   {
      var C = CloudController.Const;
      this.loadMask.hide();
      if(!response.status){
         Cntysoft.Kernel.Utils.processApiError(response);
      } else{
         Cntysoft.showAlertWindow(this.LANG_TEXT.MSG.UPDATE_OK, function (){
            //刷新节点
            this.mainPanelRef.categoryTreeRef.reload();
            this.close();
         }, this);
      }
   },
   getFormConfig : function ()
   {
      var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
      return {
         xtype : 'form',
         bodyPadding : 10,
         defaults : {
            xtype : 'textfield'
         },
         items : [{
               fieldLabel : this.LANG_TEXT.FIELDS.GIFT_NAME + R_STAR,
               allowBlank : false,
               name : 'name'
            }, {
               fieldLabel : this.LANG_TEXT.FIELDS.GIFT_INTRO + R_STAR,
               allowBlank : false,
               name : 'intro'
            }, {
               fieldLabel : this.LANG_TEXT.FIELDS.GIFT_AREA + R_STAR,
               allowBlank : false,
               value : '90',
               name : 'area'
            }, {
               fieldLabel : this.LANG_TEXT.FIELDS.GIFT_PRICE + R_STAR,
               allowBlank : false,
               xtype : 'numberfield',
               value : 0,
               name : 'price'
            }, {
               xtype : 'fieldcontainer',
               fieldLabel : this.LANG_TEXT.FIELDS.GIFT_PIC + R_STAR,
               layout : {
                  type : 'hbox',
                  align : 'bottom'
               },
               items : [{
                     xtype : 'image',
                     width : 260,
                     height : 145,
                     style : 'border:1px solid #EDEDED',
                     listeners : {
                        afterrender : function (comp){
                           this.defPicImageRef = comp;
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
                     buttonText : this.LANG_TEXT.BTN.UPPIC,
                     listeners : {
                        fileuploadsuccess : this.uploaddefPicImageSuccessHandler,
                        scope : this
                     }
                  }]
            }, {
               xtype : 'fieldcontainer',
               fieldLabel : this.LANG_TEXT.FIELDS.GIFT_BANNER + R_STAR,
               layout : {
                  type : 'hbox',
                  align : 'bottom'
               },
               items : [{
                     xtype : 'image',
                     width : 260,
                     height : 145,
                     style : 'border:1px solid #EDEDED',
                     listeners : {
                        afterrender : function (comp){
                           this.bannerRef = comp;
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
                     buttonText : this.LANG_TEXT.BTN.UPBANNER,
                     listeners : {
                        fileuploadsuccess : this.uploadbannerSuccessHandler,
                        scope : this
                     }
                  }]
            }, {
               xtype : 'marketmgruigiftgiftinfoimagegroup',
               fieldLabel : this.LANG_TEXT.FIELDS.GIFT_IMAGES + R_STAR,
               editorRef : this,
               listeners : {
                  afterrender : function (image){
                     this.imageGroupRef = image;
                  },
                  scope : this
               }
            }],
         listeners : {
            afterrender : function (comp)
            {
               this.formRef = comp;
            },
            scope : this
         }
      };
   }, uploaddefPicImageSuccessHandler : function (file, uploadBtn){
      var file = file.pop();
      if(this.defPicImageFileRefs){
         Ext.Array.remove(this.fileRefs, this.defPicImageFileRefs);
      }
      this.defPicImageFileRefs = parseInt(file.rid);
      this.defPicImageSrc = file.filename;
      this.fileRefs.push(parseInt(file.rid));
      this.defPicImageRef.setSrc(FH.getZhuChaoImageUrl(file.filename));
      this.defPicImageRef.setStyle('border', '1px solid #EDEDED');
   },
   uploadbannerSuccessHandler : function (file, uploadBtn){
      var file = file.pop();
      if(this.bannerFileRefs){
         Ext.Array.remove(this.fileRefs, this.bannerFileRefs);
      }
      this.bannerFileRefs = parseInt(file.rid);
      this.bannerSrc = file.filename;
      this.fileRefs.push(parseInt(file.rid));
      this.bannerRef.setSrc(FH.getZhuChaoImageUrl(file.filename));
      this.bannerRef.setStyle('border', '1px solid #EDEDED');
   },
   getIdFieldConfig : function ()
   {
      return {
         xtype : 'displayfield',
         fieldLabel : this.LANG_TEXT.FIELDS.GIFT_ID,
         name : 'id'
      };
   },
   destroy : function ()
   {
      delete this.formRef;
      delete this.appRef;
      delete this.mainPanelRef;
      delete this.targetLoadId;
      delete this.mainPanelRef;
      this.callParent();
   }
});