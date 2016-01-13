/*
 * Cntysoft Cloud Software Team
 * 
 * @author wql <wql1211608804@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 图片选择器
 */
Ext.define('App.ZhuChao.MarketMgr.Ui.Gift.ImageGroup', {
   extend : 'Ext.form.FieldContainer',
   xtype : 'marketmgruigiftimagegroup',
   requires : [
      'App.ZhuChao.MarketMgr.Ui.Gift.IconView',
      'Ext.menu.Menu',
      'WebOs.Component.Uploader.Window',
      'App.Site.CmMgr.Comp.InternetPicWin',
      'WebOs.Kernel.StdPath'
   ],
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.MarketMgr',
   /*
    * 图片右键点击上下文菜单
    */
   contextMenuRef : null,
   /*
    * 图片上传窗口
    *
    * @private
    * @property {WebOs.Component.Uploader.Window} uploadWinRef
    */
   uploadWinRef : null,
   /*
    * 网络图片选择窗口
    *
    * @private
    * @property {App.Site.CmMgr.Lib.FieldWidget.InternetPicWindow} internetPicWinRef
    */
   internetPicWinRef : null,
   /*
    * 图片信息配置窗口
    *
    * @private
    * @property {Ext.window.Window} imageConfigWinRef
    */
   imageConfigWinRef : null,
   /*
    * @private
    * @property {App.Site.CmMgr.Comp.IconView} iconViewRef
    */
   iconViewRef : null,
   constructor : function (config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.ATTRS.Gift_Goods.IMAGE_GROUP');
      this.callParent([config]);
   },
   initComponent : function ()
   {
      Ext.apply(this, {
         items : [this.getImageViewConfig(), {
               xtype : 'container',
               margin : '5 0 0 0',
               items : this.getButtonGroupConfig(),
               layout : 'hbox'
            }]
      });

      this.callParent();
   },
   /*
    * @inheritdoc
    */
   getWrapperSize : function (renderOpt)
   {
      return {
         anchor : '100%'
      };
   },
   getInternetPicWindow : function ()
   {
      if(null == this.internetPicWinRef){
         this.internetPicWinRef = new App.Site.CmMgr.Comp.InternetPicWin({
            listeners : {
               saverequest : this.remoteImageSelectedHandler,
               scope : this
            }
         });
      }
      return this.internetPicWinRef;
   },
   /*
    * @return {Ext.data.Store}
    */
   createImageListStore : function ()
   {
      return new Ext.data.Store({
         fields : [
            {name : 'icon', type : 'string', persist : false},
            {name : 'description', type : 'string', persist : false},
            {name : 'price', type : 'int', persist : false},
            {name : 'name', type : 'string', persist : false},
            {name : 'filename', type : 'string', persist : false},
            {name : 'fileRefIds', type : 'auto', persist : false}
         ]
      });
   },
   /*
    * 将图片的URL插入到组图显示框
    *
    * @property {String} imageUrl
    */
   insertImageItemToView : function (imageUrl, imageRealname, rids)
   {
      var suffix = imageUrl.substring(imageUrl.lastIndexOf('.') + 1);
      var store = this.iconViewRef.getStore();
      var filename = imageRealname ? imageRealname : '';
      store.add({
         icon : imageUrl,
         price : 0,
         description : '',
         filename : filename,
         name : (new Date).getTime() + '.' + suffix,
         fileRefIds : rids
      });
   },
   /*
    * <code>
    * {
    *      saveRemoteImage : 'Boolean',
    *      imageUrls : []
    * }
    * </code>
    * @param {Object} imageSelecedInfo
    */
   remoteImageSelectedHandler : function (imageSelecedInfo)
   {
      var imageUrls = imageSelecedInfo.imageUrls;
      if(!imageSelecedInfo.saveRemoteImage){
         var len = imageUrls.length;
         var url;
         for(var i = 0; i < len; i++) {
            url = imageUrls[i];
            this.insertImageItemToView(url, url);
         }
      } else{
         var queue = Ext.clone(imageUrls);
         this.recursiveSaveRemoteImageHandler(queue);
      }
   },
   /*
    * 递归保存远程图片
    */
   recursiveSaveRemoteImageHandler : function (queue)
   {
      if(queue.length > 0){
         var current = queue.shift();
         this.editorRef.setLoading(Ext.String.format(this.LANG_TEXT.MSG.SAVE_REMOTE_IMAGE, current));
         this.editorRef.callSaverApi('downloadRemoteFile', {
            fileUrl : current,
            useOss : true,
            targetDir : '/Data/UploadFiles/Apps/Site/Content'
         }, function (response){
            //没成功就不管了 很可能是网络错误
            if(response.status){
               //替换文件内容
               var data = response.data;
               var rid = parseInt(data.rid);
               var filename = FH.getZhuChaoImageUrl(data.attachment);
               this.editorRef.fileRefs.push(rid);
               this.insertImageItemToView(filename, filename, [rid]);
            }
            this.recursiveSaveRemoteImageHandler(queue);
         }, this);
      } else{
         this.editorRef.loadMask.hide();
      }
   },
   /*
    * 在编辑器提交之前加入文件引用字段信息
    */
   editorbeforeSaveRequestHandler : function (values, mode)
   {
   },
   imageIconRightClickHandler : function (view, record, item, index, e)
   {
      var CONTEXT_MENU = this.LANG_TEXT.CONTEXT_MENU;
      e.preventDefault();
      e.stopEvent();
      var items = [];
      items.push({
         text : CONTEXT_MENU.CONFIG,
         listeners : {
            click : this.setImageConfigHandler,
            scope : this
         }
      });
      items.push({
         xtype : 'menuseparator'
      });
      items.push({
         text : CONTEXT_MENU.DELETE,
         listeners : {
            click : this.deleteImageHandler,
            scope : this
         }
      });
      if(!this.contextMenuRef){
         this.contextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks : true,
            items : items
         });
      } else{
         this.contextMenuRef.removeAll();
         this.contextMenuRef.add(items);
      }
      this.contextMenuRef.record = record;
      this.contextMenuRef.item = item;
      this.contextMenuRef.showAt(e.getXY());
      return this.contextMenuRef;
   },
   /**
    * @TODO 大小限制相关
    */
   uploadClickHandler : function ()
   {
      WebOs.showLoadScriptMask();
      var STD_PATH = WebOs.Kernel.StdPath;
      var uploaderConfig = {};
      Ext.require('WebOs.Component.Uploader.Window', function (){
         WebOs.hideLoadScriptMask();
         if(null == this.uploadWinRef){
            Ext.apply(uploaderConfig, {
               initUploadPath : FH.getAppUploadFilesPath('ZhuChao', 'MarketMgr'),
               uploaderConfig : {
                  //启用附件追踪
                  enableFileRef : true,
                  fileTypeExts : ['gif', 'png', 'jpg', 'jpeg'],
                  createSubDir : true
               },
               listeners : {
                  fileuploadsuccess : this.uploadSuccessHandler,
                  fileuploaderror : function (response)
                  {
                     if(!response.status){
                        Cntysoft.Kernel.Utils.processApiError(response);
                     }
                  },
                  uploadcomplete : function ()
                  {
                     //是否马上关闭
                     this.uploadWinRef.close();
                  },
                  scope : this
               }
            });
            this.uploadWinRef = new WebOs.Component.Uploader.Window(uploaderConfig);
         }
         this.uploadWinRef.center();
         this.uploadWinRef.show();
      }, this);
   },
   uploadSuccessHandler : function (data)
   {
      var filename = data[0].filename;
      var rid = parseInt(data[0].rid);
      this.editorRef.fileRefs.push(rid);
      var parts = filename.split('/');
      var name = parts.pop();
      var store = this.iconViewRef.getStore();
      filename = FH.getZhuChaoImageUrl(filename);
      store.add({
         name : name,
         filename : filename,
         icon : filename,
         price : 0,
         description : '',
         fileRefIds : [rid]
      });
   },
   /*
    * 选择网络图片
    */
   internetClickHandler : function ()
   {
      var win = this.getInternetPicWindow();
      win.show();
   },
   /*
    * 配置图片详细信息
    */
   setImageConfigHandler : function (menu)
   {
      var record = menu.parentMenu.record;
      var item = menu.parentMenu.item;
      var textarea, textarea2;
      var CONFIG = this.LANG_TEXT.CONFIG_WINDOW;
      var BTN = Cntysoft.GET_LANG_TEXT('UI.BTN');
      if(null == this.imageConfigWinRef){
         this.imageConfigWinRef = new Ext.window.Window({
            width : 400,
            height : 200,
            modal : true,
            closeAction : 'hide',
            title : CONFIG.TITLE,
            bodyPadding : 10,
            layout : 'anchor',
            items : [{
                  xtype : 'textfield',
                  name : 'imageIntro',
                  fieldLabel : CONFIG.FIELD_LABEL
               }, {
                  xtype : 'numberfield',
                  name : 'price',
                  fieldLabel : CONFIG.FIELD_PRICE,
                  value : 0
               }],
            buttons : [{
                  text : BTN.OK,
                  listeners : {
                     click : this.imageConfigWindowBtnClickHandler,
                     scope : this
                  }
               }, {
                  text : BTN.CANCEL,
                  listeners : {
                     click : function (btn){
                        var win = btn.up('window');
                        win.close();
                     }
                  }
               }]
         });
      }
      textarea = this.imageConfigWinRef.down('textfield');
      textarea2 = this.imageConfigWinRef.down('numberfield');
      textarea.setValue(record.data.description);
      textarea2.setValue(record.data.price);
      this.imageConfigWinRef.record = record;
      this.imageConfigWinRef.item = item;
      this.imageConfigWinRef.show();
   },
   imageConfigWindowBtnClickHandler : function (btn)
   {
      var win = btn.up('window');
      var record = win.record;
      var item = win.item;
      var textarea = win.down('textfield');
      var textarea2 = win.down('numberfield');
      var value = textarea.getValue();
      var value2 = textarea2.getValue();
      record.data.description = value;
      record.data.price = value2;
      item.firstChild.title = value;
      win.close();
   },
   /*
    * 删除图片
    */
   deleteImageHandler : function (menu)
   {
      var record = menu.parentMenu.record;
      var name = record.data.name;
      var store = this.iconViewRef.getStore();
      var MSG = this.LANG_TEXT.MSG;
      var msg = Ext.String.format(MSG.DELETE, name);
      Cntysoft.showQuestionWindow(msg, function (btn){
         if('yes' == btn){
            Ext.Array.forEach(record.get('fileRefIds'), function (ref){
               Ext.Array.remove(this.editorRef.fileRefs, ref);
            }, this);
            store.remove(record);
         }
      }, this);
   },
   /*
    * 获取图片显示对象
    *
    * @return {Object}
    */
   getImageViewConfig : function ()
   {
      return {
         xtype : 'container',
         height : 290,
         border : true,
         style : {
            borderColor : '#3892D3',
            borderStyle : 'solid',
            borderWidth : '1px'
         },
         autoScroll : true,
         items : {
            xtype : 'zhuchaomarketmgruigifticonview',
            iconHeight : 160,
            iconWidth : 120,
            store : this.createImageListStore(),
            listeners : {
               afterrender : function (view){
                  this.iconViewRef = view;
               },
               itemcontextmenu : this.imageIconRightClickHandler,
               scope : this
            }
         }
      };
   },
   /*
    * 获取按钮
    *
    * @return {Object}
    */
   getButtonGroupConfig : function ()
   {
      var BTN = this.LANG_TEXT.BTNS;
      return [{
            xtype : 'button',
            text : BTN.UPLOAD,
            listeners : {
               click : this.uploadClickHandler,
               scope : this
            }
         }];
   },
   /*
    * 获取值
    *
    * @inheritdoc
    */
   getFieldValue : function ()
   {
      var store = this.iconViewRef.getStore();
      var values = [];
      var ossServer = FH.getImgOssServer() + '/';
      store.each(function (record){
         values.push({
//            icon : record.get('icon'),
            description : record.get('description'),
            price : record.get('price'),
            filename : record.get('filename').replace(ossServer, ''),
            fileRefIds : record.get('fileRefIds')
         });
      });

      return values;
   },
   /*
    * 检查是否合法，当图集信息为空或者没有封面图片的时候返回false
    *
    * @inheritdoc
    */
   isFieldValueValid : function ()
   {
      if(true){
         var store = this.iconViewRef.getStore();
         var notEmpty = false;
         var description = [];
         var num = 0;
         var MSG = this.LANG_TEXT.INVALID_TEXT;
         store.each(function (record, index){
            num++;
            if(record){
               notEmpty = true;
            }
            if(!record.get('description')){
               description[index] = false;
            } else{
               description[index] = true;
            }
         }, this);

         if(!notEmpty){
            this.markInvalid(MSG.EMPTY);
            return false;
         } else if(num > 1 && Ext.Array.contains(description, false)){
            this.markInvalid(MSG.NO_DESCRIPTION);
            return false;
         }

         this.clearInvalid();
      }

      return true;
   },
   /*
    * 清除错误
    */
   clearInvalid : function ()
   {
      if(!this.rendered){
         this.addListener('afterrender', function (){
            this.clearInvalid();
         }, this, {
            single : true
         });
      } else{
         if(!this.$_mark_invalid_el_$){
            this.$_mark_invalid_el_$ = this.el.down('.x-form-item-body');
         }
         this.$_mark_invalid_el_$.applyStyles({
            border : 'none'
         });
         this.unsetActiveError();
         this.updateLayout();
      }
   },
   /*
    * 标记当前字段不合法
    *
    * @param {String} msg
    */
   markInvalid : function (msg)
   {
      if(!this.rendered){
         this.addListener('afterrender', function (){
            this.markInvalid(msg);
         }, this, {
            single : true
         });
      } else{
         if(!this.$_mark_invalid_el_$){
            this.$_mark_invalid_el_$ = this.el.down('.x-form-item-body');
         }
         this.$_mark_invalid_el_$.applyStyles({
            border : '1px solid red'
         });
         this.setActiveError(msg);
         this.updateLayout();
      }
   },
   /*
    * 设置值
    *
    * @inheritdoc
    */
   setFieldValue : function (value)
   {
      var store = this.iconViewRef.getStore();
      var item;
      var images;
      var items = [];
      var ossServer = FH.getImgOssServer() + '/';
      Ext.Array.each(value, function (image){
         image.icon = ossServer + image.filename;
         var parts = image.filename.split('/');
         image.name = parts.pop();
         items.push(image);
      });
      store.add(items);
   },
   /*
    * 删除一些自定义的信息
    */
   destroy : function ()
   {
      delete this.iconViewRef;
      if(this.contextMenuRef){
         this.contextMenuRef.destroy();
      }
      if(this.uploadWinRef){
         this.uploadWinRef.destroy();
      }
      if(this.imageConfigWinRef){
         this.imageConfigWinRef.destroy();
      }
      if(this.internetPicWinRef){
         this.internetPicWinRef.destroy();
      }
      if(!this.isPreviewMode){
         this.editorRef.removeListener('beforesaverequest', this.editorbeforeSaveRequestHandler, this);
      }
      delete this.internetPicWinRef;
      delete this.uploadWinRef;
      delete this.contextMenuRef;
      delete this.imageConfigWinRef;
      this.callParent();
   }
});
