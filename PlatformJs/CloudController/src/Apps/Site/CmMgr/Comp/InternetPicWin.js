/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.CmMgr.Comp.InternetPicWin', {
   extend : 'WebOs.Component.Window',
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   requires : [
      'App.Site.CmMgr.Lib.Const'
   ],
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.Site.CmMgr',
   /*
    * @property {Ext.form.FieldContainer} picUrlContainerRef
    */
   picUrlContainerRef : null,
   /*
    * @property {Ext.form.Panel} picUrlsFormRef
    */
   picUrlsFormRef : null,
   /*
    * @property {boolean} mutil 网络图片的模式，默认为多张图片
    */
   mutil : null,
   
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('FIELD_WIDGET.INTERNET_PIC_WINDOW');
      if(config.hasOwnProperty('mutil')){
         this.mutil = config.mutil;
      } else{
         this.mutil = true;
      }
      this.applyConstraintConfig();
      this.callParent([config]);
   },
   applyConstraintConfig : function()
   {
      Ext.apply(this, {
         title : this.LANG_TEXT.TITLE,
         modal : true,
         closeAction : 'hide',
         width : 700,
         maxHeight : 330,
         bodyPadding : 10,
         resizable : false
      });
   },

   /*
    * @event imageSelecedInfo
    * 通知栏关闭完成
    *
    * @param {Boolean} saveRemoteImage
    * @param {Array} imageUrls
    */
   initComponent : function()
   {
      var BTN = Cntysoft.GET_LANG_TEXT('UI.BTN');
      Ext.apply(this, {
         items : {
            xtype : 'form',
            layout : {
               type : 'vbox',
               align : 'stretch'
            },
            items : [this.getPicUrlContainerConfig(), {
               xtype : 'checkbox',
               checked : true,
               inputValue : true,
               fieldLabel : this.LANG_TEXT.FIELDS.CHECK,
               name : 'saveRemoteImage'
            }],
            listeners : {
               afterrender : function(form){
                  this.picUrlsFormRef = form;
               },
               scope : this
            }
         },
         buttons : [{
            text : BTN.OK,
            listeners : {
               click : this.saveUrlsHandler,
               scope : this
            }
         }, {
            text : BTN.CANCEL,
            listeners : {
               click : function(btn){
                  var win = btn.up('window');
                  var text = win.down('textfield');
                  text.reset();
                  win.close();
               }
            }
         }]
      });
      this.addListener({
         close : function()
         {
            this.resetSelectFormHandler();
         },
         scope : this
      });
      this.callParent();
   },
   getPicUrlContainerConfig : function()
   {
      var LANG = this.LANG_TEXT;
      var btnDisabled = !this.mutil;
      return {
         xtype : 'fieldcontainer',
         fieldLabel : LANG.FIELDS.TEXT,
         width : 600,
         maxHeight : 200,
         autoScroll : true,
         layout : {
            type : 'vbox',
            align : 'stretch'
         },
         defaults : {
            xtype : 'container',
            layout : 'hbox'
         },
         items : [{
            items : [{
               xtype : 'textfield',
               width : 420,
               validator : Ext.bind(this.picUrlValidator, this),
               validateOnChange : false,
               msgTarget : 'side'
            }, {
               xtype : 'button',
               margin : '0 0 0 10',
               width : 90,
               text : LANG.BTNS.ADD,
               disabled : btnDisabled,
               listeners : {
                  click : this.addPicUrlItemHandler,
                  scope : this
               }
            }]
         }],
         listeners : {
            afterrender : function(container)
            {
               this.picUrlContainerRef = container;
            },
            scope : this
         }
      };
   },
   /*
    * 获取一个图片地址的输入框
    */
   getPicUrlItem : function()
   {
      var BTN = this.LANG_TEXT.BTNS.DELETE;
      return {
         margin : '10 0 0 0',
         items : [{
            xtype : 'textfield',
            width : 420,
            validator : Ext.bind(this.picUrlValidator, this),
            validateOnChange : false
         }, {
            xtype : 'button',
            text : BTN,
            width : 90,
            margin : '0 0 0 10',
            listeners : {
               click : this.deleteButtonClickHandler,
               scope : this
            }
         }]
      };
   },
   resetSelectFormHandler : function()
   {
      var items = this.picUrlContainerRef.items;
      var len = items.getCount();

      for(var i = 1; i < len; i++){
         this.picUrlContainerRef.remove(items.last());
      }

      items.getAt(0).down('textfield').reset();
   },
   /*
    * 保存系统获取网址， 当选择保存到本地的时候系统会先进行异步保存
    */
   saveUrlsHandler : function()
   {
      var form = this.picUrlsFormRef.getForm();
      if(form.isValid()){
         var textfields = this.picUrlsFormRef.query('textfield');
         var len = textfields.length;
         var imageUrls = [];
         for(var i = 0; i < len; i++) {
            imageUrls.push(textfields[i].getValue());
         }
         var checkbox = this.picUrlsFormRef.down('checkbox[name="saveRemoteImage"]');
         if(this.hasListeners.saverequest){
            this.fireEvent('saverequest', {
               saveRemoteImage : checkbox.getValue(),
               imageUrls : imageUrls
            });
         }
         this.close();
      }
   },
   /*
    * 图片地址的验证器
    */
   picUrlValidator : function(url)
   {
      var MSG = this.LANG_TEXT.MSG;
      var C = App.Site.CmMgr.Lib.Const;
      var urlTest = /(((^https?)|(^ftp)):\/\/((([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*)|(localhost|LOCALHOST))\/?)/i;
      if(Ext.isEmpty(url)){
         return MSG.BLANK;
      }
      if(!urlTest.test(url)){
         return MSG.ERROR;
      }
      var suffix = url.substring(url.lastIndexOf('.') + 1);
      if(!Ext.Array.contains(C.IMAGES, suffix)){
         return MSG.ERROR;
      }
      return true;
   },
   //////////////////////////////////////////Listeners///////////////////////////////////////////
   /*
    * 添加按钮点击事件监听函数
    */
   addPicUrlItemHandler : function()
   {
      var item = this.getPicUrlItem();
      this.picUrlContainerRef.add(item);
   },
   /*
    * 删除按钮点击事件监听函数
    */
   deleteButtonClickHandler : function(btn)
   {
      var container = btn.up('container');
      this.picUrlContainerRef.remove(container, true);
   },

   destroy : function()
   {
      delete this.LANG_TEXT;
      delete this.picUrlContainerRef;
      delete this.picUrlsFormRef;
      this.callParent();
   }
});