/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license   Expression $license is undefined on line 6, column 17 in Templates/ClientSide/javascript.js.
 */
Ext.define('App.ZhuChao.UserCenter.Ui.Decorator.MemberEditor', {
   extend : 'WebOs.Component.Window',
   mixins: {
      langTextProvider: 'WebOs.Mixin.RunableLangTextProvider',
      formTooltip: 'Cntysoft.Mixin.FormTooltip'
   },
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    */
   runableLangKey : 'App.ZhuChao.UserCenter',
   
   avatarSrc : null,
   
   fileRefs : null,
   
   targetLoadId : -1,
   
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.DECORATOR.MEMBER_SETTING');
      this.fileRefs = [];
      this.mode = config.mode;
      this.mixins.formTooltip.constructor.call(this);
      this.applyConstraintConfig(config);
      if(config.mode == CloudController.Const.MODIFY_MODE){
         if(!Ext.isDefined(config.targetLoadId) || !Ext.isNumber(config.targetLoadId)){
            Ext.Error.raise({
               cls : Ext.getClassName(this),
               method : 'constructor',
               msg : 'mode is modify, so you must set node id'
            });
         }
         this.targetLoadId = config.targetLoadId;
      }
      
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         border : false,
         modal : true,
         height : 550,
         minHeight : 550,
         width : 900,
         minWidth : 900,
         bodyPadding : 10,
         title : this.LANG_TEXT.MEMBER_EDITOR.TITLE,
         overflowY : true,
         autoShow : true
      });
   },

   initComponent : function()
   {
      var BTN = this.LANG_TEXT.BTN;
      Ext.apply(this, {
         items : {
            xtype : 'form',
            items : this.getItemsConfig(),
               defaults : {
               labelWidth : 150,
               minWidth : 500,
               listeners : this.getFormItemListener()
            },
            listeners : {
               afterrender : function(form){
                  this.formRef = form;
               },
               scope : this
            }
         },
         buttons : [{
            text : BTN.SAVE,
            listeners : {
               click : this.saveHandler,
               scope : this
            }
         },{
            text : BTN.CLOSE,
            listeners : {
               click : function(){
                  this.close();
               },
               scope : this
            }
         }],
         listeners : {
            afterrender : this.stateHandler,
            scope : this
         }
      });
      this.callParent();
   },
   
   /*
    * 渲染后首次刷新数据
    */
   stateHandler : function()
   {
      if(this.mode == CloudController.Const.NEW_MODE){
//         var defaultValues = this.getDefaultValues();
//         this.setValues(defaultValues);
         return;
      }
      this.setLoading(this.LANG_TEXT.MSG.LOAD_MEMBER);
      //如果不是添加新的节点 那么我们需要加载数据
      this.mainPanelRef.appRef.loadDecoratorMember({id : this.targetLoadId}, this.loadMemberHandler, this);
   },
   
   loadMemberHandler : function(response)
   {
      this.loadMask.hide();
      if(!response.status){
         Cntysoft.Kernel.Utils.processApiError(response);
      }else{
         this.setValues(response.data);
      }
   },
   
   getFormItemListener : function()
   {
      return {
         afterrender : function(comp)
         {
            this.mixins.formTooltip.setupTooltipTarget.call(this, comp);
         },
         scope : this
      };
   },
   
   saveHandler : function()
   {
      var MSG = this.LANG_TEXT.MSG;
      if(this.formRef.isValid()){
         var values = this.formRef.getValues();
         values['avatar'] = this.avatarSrc;
         values['decoratorId'] = this.decoratorId;
         values['fileRefs'] = this.fileRefs;
         this.setLoading(MSG.SAVING);
         if(this.mode == CloudController.Const.MODIFY_MODE){
            this.mainPanelRef.appRef.updateDecoratorMember(values, function(response){
               this.loadMask.hide();
               if(!response.status){
                  Cntysoft.Kernel.Utils.processApiError(response);
               }else{
                  this.memberList.store.reload();
                  this.close();
               }
            }, this);
         }else{
            this.mainPanelRef.appRef.addDecoratorMember(values, function(response){
               this.loadMask.hide();
               if(!response.status){
                  Cntysoft.Kernel.Utils.processApiError(response);
               }else{
                  this.memberList.store.reload();
                  this.close();
               }
            }, this);
         }
         
      }
   },
   
   getItemsConfig : function()
   {
      var F = this.LANG_TEXT.FIELDS;
      var T = this.LANG_TEXT.TOOLTIP_TEXT;
      var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
      return [{
            xtype : 'fieldcontainer',
            fieldLabel : F.AVATAR + R_STAR,
            layout: {
               type : 'hbox',
               align:'bottom'
            },
            items : [{
               xtype : 'image',
               width : 150,
               height : 150,
               style : 'border:1px solid #EDEDED',
               allowBlank : false,
               listeners : {
                  afterrender : function(comp){
                     this.imageRef = comp;
                  },
                  scope : this
               }
            },{
               xtype : 'webossimpleuploader',
               uploadPath : this.mainPanelRef.appRef.getUploadFilesPath(),
               createSubDir : false,
               fileTypeExts : ['gif','png','jpg','jpeg'],
               margin : '0 0 0 5',
               maskTarget : this,
               enableFileRef : true,
               buttonText :  F.UPLOAD,
               listeners : {
                  fileuploadsuccess : this.uploadSuccessHandler,
                  scope : this
               }
            }]
         }, {
            xtype : 'textfield',
            fieldLabel : F.NAME + R_STAR,
            name : 'name',
            allowBlank : false
         },  {
            xtype : 'textfield',
            fieldLabel : F.JOB + R_STAR,
            name : 'job',
            allowBlank : false
         }, {
            xtype : 'combo',
            fieldLabel : F.TYPE,
            name : 'type',
            toolTipText : T.TYPE,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'code',
            store : Ext.create('Ext.data.Store', {
               fields : ['name', 'code'],
               data : [
                  {name : '主要负责人', code : '1'},
                  {name : '设计团队', code : '2'},
                  {name : '施工团队', code : '3'},
                  {name : '其他', code : '4'}
               ]
            }),
            editable : false
         }, {
            xtype : 'textarea',
            fieldLabel : F.CONCEPT,
            width : 400,
            height : 80,
            name : 'concept'
         }, {
            xtype : 'textarea',
            fieldLabel : F.INTRO,
            width : 400,
            height : 80,
            name : 'intro'
         }, {
            xtype : 'hiddenfield',
            name : 'id'
         }];
   },
   
   uploadSuccessHandler : function(file)
   {
      var file = file.pop();
      this.fileRefs.push(parseInt(file.rid));
      this.avatarSrc = file.filename;
      this.imageRef.setSrc(FH.getZhuChaoImageUrl(file.filename));
   },
   
   setValues : function(values)
   {
      this.formRef.getForm().setValues(values);
      this.fileRefs = values['fileRefs'];
      this.avatarSrc = values['avatar'];
      this.imageRef.setSrc(FH.getZhuChaoImageUrl(values['avatar']));
   },
   
   destroy : function()
   {
      delete this.appRef;
      delete this.fileRefs;
      delete this.mode;
      delete this.targetLoadId;
      delete this.avatarSrc;
      delete this.decoratorId;
      delete this.imageRef;
      delete this.formRef;
      this.mixins.langTextProvider.destroy.call(this);
      this.callParent();
   }
});

