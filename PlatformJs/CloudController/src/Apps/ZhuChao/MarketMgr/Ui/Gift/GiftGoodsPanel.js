/*
 * Cntysoft Cloud Software Team
 *
 * @author wql <wql1211608804@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 大礼包商品添加/修改面板
 */
Ext.define('App.ZhuChao.MarketMgr.Ui.Gift.GiftGoodsPanel', {
   extend : 'Ext.panel.Panel',
   requires : [
      'WebOs.Kernel.StdPath',
      'WebOs.Component.Uploader.SimpleUploader',
      'App.ZhuChao.MarketMgr.Ui.Gift.ImageGroup'
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
   panelType : 'GiftGoodsPanel',
   queryAttrGridRef : null,
   formRef : null,
   packId : 0,
   typeId : 0,
   fileRefs : null,
   imageRef : null,
   traImageRef : null,
   defImageRef : null,
   constructor : function (config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.ATTRS.Gift_Goods');
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
            }
//         , {
//             xtype : 'button',
//               text: Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
//               listeners: {
//                  click: function() {
//                     this.close();
//                  },
//                  scope: this
//               }
//            }
         ]
      });
      this.addListener('afterrender', this.afterRenderHandler, this);
      this.callParent();
   },
   loadGoods : function (gid)
   {
      if(this.$_current_nid_$ !== gid){
         this.gotoModifyMode();
         this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
         this.appRef.getGiftGoods(gid, this.afterLoadGoodsHandler, this);
         this.$_current_nid_$ = gid;
      }
   },
   gotoGoodsList : function ()
   {
      var panel = this.mainPanelRef.getCurrentActivePanel();
      if(panel.panelType == 'GiftGoodsList'){
         panel.close();
      }
      this.mainPanelRef.renderPanel('GiftGoodsList', {
         appRef : this.appRef,
         mode : 0,
         targetLoadId : this.typeId
      }
      );
   },
   gotoModifyMode : function (force)
   {
      if(force || this.mode == CloudController.Const.NEW_MODE){
         this.formRef.add(0, this.getFieldsConfig());
         this.mode = CloudController.Const.MODIFY_MODE;
      }
   },
   afterRenderHandler : function ()
   {
      this.fileRefs = [];
      if(this.mode == CloudController.Const.MODIFY_MODE){
         this.gotoModifyMode(true);
         this.loadGoods(this.targetLoadId);
      }
   },
   afterLoadGoodsHandler : function (response)
   {
      this.loadMask.hide();
      if(!response.status){
         Cntysoft.Kernel.Utils.processApiError(response);
      } else{
         this.currentGiftGoodsInfo = response.data;
         this.typeId = this.currentGiftGoodsInfo.typeId;
         this.formRef.getForm().setValues(this.currentGiftGoodsInfo);
         this.imageGroupRef.setFieldValue(response.data['image']);

         this.traImageFileRefs = response.data['traImageFileRefs'];
         this.traImageSrc = response.data['traImageSrc'];
         if(this.traImageSrc){
            this.traImageRef.setSrc(FH.getZhuChaoImageUrl(this.traImageSrc));
         }
         this.defImageFileRefs = response.data['defImageFileRefs'];
         this.defImageSrc = response.data['defImageSrc'];
         if(this.defImageSrc){
            this.defImageRef.setSrc(FH.getZhuChaoImageUrl(this.defImageSrc));
         }
         this.fileRefs = this.currentGiftGoodsInfo.fileRefs;
      }
   },
   saveHandler : function ()
   {
      var form = this.formRef.getForm();
      var values = {};
      var C = CloudController.Kernel.Const;
      if(this.checkValid(form) && this.imageGroupRef.isFieldValueValid()){
         Ext.apply(values, form.getValues());
         Ext.apply(values, {
            image : this.imageGroupRef.getFieldValue(),
            traImage : [this.traImageSrc, this.traImageFileRefs],
            defImage : [this.defImageSrc, this.defImageFileRefs],
            fileRefs : this.fileRefs});

         if(this.mode == C.NEW_MODE){
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
            Ext.apply(values, {
               packId : this.packId,
               typeId : this.typeId
            });
            this.appRef.addGiftGoods(values, this.afterAddGiftGoodsHandler, this);
         } else if(this.mode == C.MODIFY_MODE){
            Ext.apply(values, {
               id : this.currentGiftGoodsInfo.id,
               packId : this.currentGiftGoodsInfo.packId,
               typeId : this.currentGiftGoodsInfo.typeId
            });
            this.appRef.updateGiftGoods(values, this.afterUpdateGiftGoodsHandler, this);
         }
      }
   },
   checkValid : function (form)
   {
      if(form.isValid()){
         return true;
      } else{
         if(!this.$_mark_invalid_el_$){
            this.$_mark_invalid_el_$ = this.el.down('.x-form-checkboxgroup-body');
         }
         this.$_mark_invalid_el_$.applyStyles({
            border : '1px solid red'
         });
         this.updateLayout();
      }
   },
   afterAddGiftGoodsHandler : function (response)
   {
      var C = CloudController.Const;
      this.loadMask.hide();
      if(!response.status){
         Cntysoft.Kernel.Utils.processApiError(response);
      } else{
         Cntysoft.showAlertWindow(this.LANG_TEXT.MSG.SAVE_OK, function (){
            //刷新节点
            this.mainPanelRef.categoryTreeRef.reload();
            this.gotoGoodsList();
         }, this);
      }
   },
   afterUpdateGiftGoodsHandler : function (response)
   {
      var C = CloudController.Const;
      this.loadMask.hide();
      if(!response.status){
         Cntysoft.Kernel.Utils.processApiError(response);
      } else{
         Cntysoft.showAlertWindow(this.LANG_TEXT.MSG.UPDATE_OK, function (){
            //刷新节点
            this.mainPanelRef.categoryTreeRef.reload();
            this.gotoGoodsList();
         }, this);
      }
   },
   getFormConfig : function ()
   {
      var F = this.LANG_TEXT.FIELDS;
      var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
      return {
         xtype : 'form',
         bodyPadding : 10,
         defaults : {
            xtype : 'textfield'
         },
         items : [{
               fieldLabel : F.GOODS_NAME + R_STAR,
               allowBlank : false,
               anchor : '40%',
               name : 'name'
            }, {
               fieldLabel : F.GOODS_REALGOODSID,
               allowBlank : true,
               xtype : 'numberfield',
               value : 0,
               name : 'realGoodsId'
            }, {
               fieldLabel : F.GOODS_TRADEMARK + R_STAR,
               allowBlank : false,
               name : 'trademark'
            }, {
               fieldLabel : F.GOODS_PRICE,
               allowBlank : true,
               xtype : 'numberfield',
               value : 0,
               name : 'price'
            }, {
               xtype : 'fieldcontainer',
               fieldLabel : F.GOODS_DEFIMAGE + R_STAR,
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
                           this.defImageRef = comp;
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
                     buttonText : F.GOODS_UP_DEFIMAGE,
                     listeners : {
                        fileuploadsuccess : this.uploaddefImageSuccessHandler,
                        scope : this
                     }
                  }]
            }, {
               xtype : 'checkboxgroup',
               fieldLabel : F.GOODS_SPACE + R_STAR,
               width : 850,
               allowBlank : false,
               columns : 10,
               items : [
                  {boxLabel : '客厅', name : 'space', inputValue : '客厅'},
                  {boxLabel : '餐厅', name : 'space', inputValue : '餐厅'},
                  {boxLabel : '厨房', name : 'space', inputValue : '厨房'},
                  {boxLabel : '主卧', name : 'space', inputValue : '主卧'},
                  {boxLabel : '次卧', name : 'space', inputValue : '次卧'},
                  {boxLabel : '卫生间', name : 'space', inputValue : '卫生间'},
                  {boxLabel : '阳台', name : 'space', inputValue : '阳台'},
                  {boxLabel : '玄关', name : 'space', inputValue : '玄关'},
                  {boxLabel : '书房', name : 'space', inputValue : '书房'},
                  {boxLabel : '儿童房', name : 'space', inputValue : '儿童房'}],
               listeners : {
                  change : function (checkboxg){
                     if(this.$_mark_invalid_el_$){
                        this.$_mark_invalid_el_$.applyStyles({
                           border : '0'
                        });
                     }
                  },
                  scope : this
               }
            }, {
               xtype : 'marketmgruigiftimagegroup',
               fieldLabel : F.GOODS_IMAGE + R_STAR,
               editorRef : this,
               listeners : {
                  afterrender : function (image){
                     this.imageGroupRef = image;
                  },
                  scope : this
               }
            }, {
               fieldLabel : F.GOODS_TRAINTRO,
               anchor : '70%',
               allowBlank : false,
               value : ' ',
               name : 'traIntro'
            }, {
               xtype : 'fieldcontainer',
               fieldLabel : F.GOODS_TRAIMAGE,
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
                           this.traImageRef = comp;
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
                     buttonText : F.GOODS_UP_TRAIMAGE,
                     listeners : {
                        fileuploadsuccess : this.uploadtraImageSuccessHandler,
                        scope : this
                     }
                  }]
            }],
         listeners : {
            afterrender : function (comp)
            {
               this.formRef = comp;
            },
            scope : this
         }
      };
   },
   uploadtraImageSuccessHandler : function (file, uploadBtn){
      var file = file.pop();
      if(this.traImageFileRefs){
         Ext.Array.remove(this.fileRefs, this.traImageFileRefs);
      }
      this.traImageFileRefs = parseInt(file.rid);
      this.traImageSrc = file.filename;
      this.fileRefs.push(parseInt(file.rid));
      this.traImageRef.setSrc(FH.getZhuChaoImageUrl(file.filename));
      this.traImageRef.setStyle('border', '1px solid #EDEDED');
   },
   uploaddefImageSuccessHandler : function (file, uploadBtn){
      var file = file.pop();
      if(this.defImageFileRefs){
         Ext.Array.remove(this.fileRefs, this.defImageFileRefs);
      }
      this.defImageFileRefs = parseInt(file.rid);
      this.defImageSrc = file.filename;
      this.fileRefs.push(parseInt(file.rid));
      this.defImageRef.setSrc(FH.getZhuChaoImageUrl(file.filename));
      this.defImageRef.setStyle('border', '1px solid #EDEDED');
   },
   getFieldsConfig : function ()
   {
      return {
         xtype : 'displayfield',
         fieldLabel : this.LANG_TEXT.FIELDS.GOODS_ID,
         name : 'id'
      };
   },
   destroy : function ()
   {
      delete this.formRef;
      delete this.appRef;
      delete this.mainPanelRef;
      delete this.targetLoadId;
      delete this.packId;
      delete this.typeId;
      delete this.mainPanelRef;
      this.callParent();
   }
});