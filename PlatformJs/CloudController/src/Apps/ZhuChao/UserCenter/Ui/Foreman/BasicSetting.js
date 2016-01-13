/*
 * Cntysoft Cloud Software Team
 * 
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license   Expression $license is undefined on line 6, column 17 in Templates/ClientSide/javascript.js.
 */
Ext.define('App.ZhuChao.UserCenter.Ui.Foreman.BasicSetting', {
   extend : 'Ext.form.Panel',
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
   
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.FOREMAN.BASIC_SETTING');
      this.mixins.formTooltip.constructor.call(this);
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         border : false,
         bodyPadding : 10,
         title : this.LANG_TEXT.TITLE,
         autoScroll : true
      });
   },

   initComponent : function()
   {
      Ext.apply(this, {
         items : this.getItemsConfig(),
         defaults : {
            labelWidth : 200,
            minWidth : 500,
            listeners : this.getFormItemListener()
         },
         listeners : {
            afterrender : function(){
               if(this.responseData){
                  this.applyInfoValue(this.responseData);
               }
            },
            scope : this
         }
      });
      this.callParent();
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
   
   getItemsConfig : function()
   {
      var F = this.LANG_TEXT.FIELDS;
      var T = this.LANG_TEXT.TOOLTIP_TEXT;
      return [{
            xtype : 'textfield',
            fieldLabel : F.NICK_NAME,
            name : 'nickname'
         }, {
            xtype : 'fieldcontainer',
            fieldLabel : F.AVATAR,
            layout: {
               type : 'hbox',
               align:'bottom'
            },
            items : [{
               xtype : 'image',
               width : 200,
               height : 100,
               style : 'border:1px solid #EDEDED',
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
            fieldLabel : F.NAME,
            name : 'name',
            toolTipText : T.NAME
         }, {
            xtype : 'textfield',
            fieldLabel : F.PHONE,
            name : 'phone',
            toolTipText : T.PHONE
         }, {
            xtype : 'textfield',
            fieldLabel : F.EMAIL,
            name : 'email'
         }, {
            xtype : 'textfield',
            fieldLabel : F.PASSWORD,
            toolTipText : T.PASSWORD,
            name : 'password'
         }, {
            xtype : 'textfield',
            fieldLabel : F.REGISTER_TIME,
            name : 'registerTime'
         }, {
            xtype : 'textfield',
            fieldLabel : F.LAST_LOGIN_TIME,
            name : 'lastLoginTime'
         }, {
            xtype : 'textfield',
            fieldLabel : F.LAST_LOGIN_IP,
            name : 'lastLoginIP'
         }, {
            xtype : 'radiogroup',
            fieldLabel : F.STATUS,
            width : 500,
            items: [
               { boxLabel: F.STATUS_NORMAL, name: 'status', inputValue: 1, checked: true},
               { boxLabel: F.STATUS_LOCK, name: 'status', inputValue: 2 },
               { boxLabel: F.STATUS_DELETE, name: 'status', inputValue: 3 }
            ],
            allowBlank : false
         }, {
            xtype : 'hiddenfield',
            name : 'id'
         }];
   },
   
   uploadSuccessHandler : function(file)
   {
      var file = file.pop();
      this.fileRefs = parseInt(file.rid);
      this.avatarSrc = file.filename;
      this.imageRef.setSrc(FH.getZhuChaoImageUrl(file.filename));
   },
   
   getInfoValues : function()
   {
      var values = this.getForm().getValues();
      values['avatar'] = this.avatarSrc;
      values['avatarfid'] = this.fileRefs;

      return values;
   },
   
   applyInfoValue : function(values)
   {
      if(!this.rendered){
         this.responseData = values;
      }else{
         this.getForm().setValues(values);
         this.avatarSrc = values['avatar'];
         this.fileRefs = values['avatarfid'];
         this.imageRef.setSrc(FH.getZhuChaoImageUrl(values['avatar']));
      }
      
   },
   
   isInfoValid : function()
   {
      return this.getForm().isValid();
   },
   
   destroy : function()
   {
      delete this.appRef;
      delete this.avatarSrc;
      delete this.fileRefs;
      delete this.responseData;
      delete this.imageRef;
      this.mixins.langTextProvider.destroy.call(this);
      this.callParent();
   }
});

