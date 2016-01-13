/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license   Expression $license is undefined on line 6, column 17 in Templates/ClientSide/javascript.js.
 */
Ext.define('App.ZhuChao.UserCenter.Ui.Decorator.CertificateSetting', {
   extend : 'Ext.form.Panel',
   requires : [
      'App.ZhuChao.Goods.Comp.GoodsDetailImageView'
   ],
   mixins: {
      langTextProvider: 'WebOs.Mixin.RunableLangTextProvider',
      formTooltip: 'Cntysoft.Mixin.FormTooltip'
   },
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    */
   runableLangKey : 'App.ZhuChao.UserCenter',
   
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.DECORATOR.CERTIFICATE_SETTING');
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
      return [{
            xtype : 'fieldcontainer',
            fieldLabel : F.BUSINESS,
            items : [{
               xtype: 'zhuchaogoodscompgoodsdetailimageview',
               imageHeight: 260,
               imageWidth: 146,
               height: 300,
               border : '1px solid red',
               autoScroll: true,
               store: new Ext.data.Store({
                  fields: [
                     {name: 'url', type: 'string', persist: false},
                     {name: 'fileRefId', type: 'integer', persist: false}
                  ]
               }),
               listeners: {
                  afterrender: function(view) {
                     this.businessCertificateRef = view;
                  },
                  itemcontextmenu: function(grid, record, htmlItem, index, event)
                  {
                     var menu = this.getViewContextMenu();
                     menu.record = record;
                     menu.store = grid.store;
                     var pos = event.getXY();
                     event.stopEvent();
                     menu.showAt(pos[0], pos[1]);
                  },
                  scope: this
               }
            }, {
               xtype: 'container',
               items: {
                  xtype: 'webossimpleuploader',
                  uploadPath: this.mainPanelRef.appRef.getUploadFilesPath(),
                  createSubDir: false,
                  fileTypeExts: ['gif', 'png', 'jpg', 'jpeg'],
                  margin: '0 0 0 5',
                  maskTarget: this,
                  width: 120,
                  height: 30,
                  enableFileRef: true,
                  buttonText: F.UPLOAD_DETAIL_BTN,
                  listeners: {
                     fileuploadsuccess: function(file, btn) {
                        var file = file.pop();
                        this.infoRef.fileRefs.push(parseInt(file.rid));
                        this.businessCertificateRef.store.add({
                           url: FH.getZhuChaoImageUrl(file.filename),
                           fileRefId: file.rid
                        });
                     },
                     scope: this
                  }
               }
            }]
         }, {
            xtype : 'fieldcontainer',
            fieldLabel : F.QUALIFICATION,
            items : [{
               xtype: 'zhuchaogoodscompgoodsdetailimageview',
               imageHeight: 260,
               imageWidth: 146,
               height: 300,
               border : '1px solid red',
               autoScroll: true,
               store: new Ext.data.Store({
                  fields: [
                     {name: 'url', type: 'string', persist: false},
                     {name: 'fileRefId', type: 'integer', persist: false}
                  ]
               }),
               listeners: {
                  afterrender: function(view) {
                     this.qualificationCertificateRef = view;
                  },
                  itemcontextmenu: function(grid, record, htmlItem, index, event)
                  {
                     var menu = this.getViewContextMenu();
                     menu.record = record;
                     menu.store = grid.store;
                     var pos = event.getXY();
                     event.stopEvent();
                     menu.showAt(pos[0], pos[1]);
                  },
                  scope: this
               }
            }, {
               xtype: 'container',
               items: {
                  xtype: 'webossimpleuploader',
                  uploadPath: this.mainPanelRef.appRef.getUploadFilesPath(),
                  createSubDir: false,
                  fileTypeExts: ['gif', 'png', 'jpg', 'jpeg'],
                  margin: '0 0 0 5',
                  maskTarget: this,
                  width: 120,
                  height: 30,
                  enableFileRef: true,
                  buttonText: F.UPLOAD_DETAIL_BTN,
                  listeners: {
                     fileuploadsuccess: function(file, btn) {
                        var file = file.pop();
                        this.infoRef.fileRefs.push(parseInt(file.rid));
                        this.qualificationCertificateRef.store.add({
                           url: FH.getZhuChaoImageUrl(file.filename),
                           fileRefId: file.rid
                        });
                     },
                     scope: this
                  }
               }
            }]
         }, {
            xtype : 'fieldcontainer',
            fieldLabel : F.HONOR,
            items : [{
               xtype: 'zhuchaogoodscompgoodsdetailimageview',
               imageHeight: 260,
               imageWidth: 146,
               height: 300,
               border : '1px solid red',
               autoScroll: true,
               store: new Ext.data.Store({
                  fields: [
                     {name: 'url', type: 'string', persist: false},
                     {name: 'fileRefId', type: 'integer', persist: false}
                  ]
               }),
               listeners: {
                  afterrender: function(view) {
                     this.honorCertificateRef = view;
                  },
                  itemcontextmenu: function(grid, record, htmlItem, index, event)
                  {
                     var menu = this.getViewContextMenu();
                     menu.record = record;
                     menu.store = grid.store;
                     var pos = event.getXY();
                     event.stopEvent();
                     menu.showAt(pos[0], pos[1]);
                  },
                  scope: this
               }
            }, {
               xtype: 'container',
               items: {
                  xtype: 'webossimpleuploader',
                  uploadPath: this.mainPanelRef.appRef.getUploadFilesPath(),
                  createSubDir: false,
                  fileTypeExts: ['gif', 'png', 'jpg', 'jpeg'],
                  margin: '0 0 0 5',
                  maskTarget: this,
                  width: 120,
                  height: 30,
                  enableFileRef: true,
                  buttonText: F.UPLOAD_DETAIL_BTN,
                  listeners: {
                     fileuploadsuccess: function(file, btn) {
                        var file = file.pop();
                        this.infoRef.fileRefs.push(parseInt(file.rid));
                        this.honorCertificateRef.store.add({
                           url: FH.getZhuChaoImageUrl(file.filename),
                           fileRefId: file.rid
                        });
                     },
                     scope: this
                  }
               }
            }]
         }, {
            xtype : 'fieldcontainer',
            fieldLabel : F.OTHER,
            items : [{
               xtype: 'zhuchaogoodscompgoodsdetailimageview',
               imageHeight: 260,
               imageWidth: 146,
               height: 300,
               
               autoScroll: true,
               store: new Ext.data.Store({
                  fields: [
                     {name: 'url', type: 'string', persist: false},
                     {name: 'fileRefId', type: 'integer', persist: false}
                  ]
               }),
               listeners: {
                  afterrender: function(view) {
                     this.otherCertificateRef = view;
                  },
                  itemcontextmenu: function(grid, record, htmlItem, index, event)
                  {
                     var menu = this.getViewContextMenu();
                     menu.record = record;
                     menu.store = grid.store;
                     var pos = event.getXY();
                     event.stopEvent();
                     menu.showAt(pos[0], pos[1]);
                  },
                  scope: this
               }
            }, {
               xtype: 'container',
               items: {
                  xtype: 'webossimpleuploader',
                  uploadPath: this.mainPanelRef.appRef.getUploadFilesPath(),
                  createSubDir: false,
                  fileTypeExts: ['gif', 'png', 'jpg', 'jpeg'],
                  margin: '0 0 0 5',
                  maskTarget: this,
                  width: 120,
                  height: 30,
                  enableFileRef: true,
                  buttonText: F.UPLOAD_DETAIL_BTN,
                  listeners: {
                     fileuploadsuccess: function(file, btn) {
                        var file = file.pop();
                        this.infoRef.fileRefs.push(parseInt(file.rid));
                        this.otherCertificateRef.store.add({
                           url: FH.getZhuChaoImageUrl(file.filename),
                           fileRefId: file.rid
                        });
                     },
                     scope: this
                  }
               }
            }]
         }];
   },
   
   getViewContextMenu: function()
   {

      var L = this.LANG_TEXT.MENU;
      if (null == this.viewContextMenuRef) {
         this.viewContextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks: true,
            items: [{
                  text: L.DELETE,
                  listeners: {
                     click: function(item)
                     {
                        item.parentMenu.store.remove(item.parentMenu.record);
                        Ext.Array.remove(this.infoRef.fileRefs, item.parentMenu.record.get('fileRefId'));
                     },
                     scope: this
                  }
               }]
         });
      }
      return this.viewContextMenuRef;
   },
   
   getInfoValues : function()
   { 
      var values = {};
      var views = [
         this.businessCertificateRef, 
         this.qualificationCertificateRef, 
         this.honorCertificateRef, 
         this.otherCertificateRef
      ];
      var names = [
         'businessCertificate',
         'qualificationCertificate',
         'honorCertificate',
         'otherCertificate'
      ];
      if(!this.rendered && this.responseData){
         var length = names.length;
         for(var i = 0; i < length; i++){
            values[names[i]] = this.responseData[names[i]];
         }
         return values;
      }
      var len = views.length;
      var ossServer = FH.getImgOssServer() + '/';
      
      for(var i = 0; i < len; i++){
         var view = [];
         if(views[i]){
            views[i].store.each(function(record) {
               var url = record.get('url');
               if (Ext.String.startsWith(url, ossServer)) {
                  url = url.replace(ossServer, '');
               }
               view.push([
                  url,
                  record.get('fileRefId')
               ]);
            }, this);
         }
         values[names[i]] = view;
      }
      
      return values;
   },
   
   applyInfoValue : function(values)
   {
      if(!this.rendered){
         this.responseData = values;
      }else{
         var views = [
            this.businessCertificateRef, 
            this.qualificationCertificateRef, 
            this.honorCertificateRef, 
            this.otherCertificateRef
         ];
         var names = [
            'businessCertificate',
            'qualificationCertificate',
            'honorCertificate',
            'otherCertificate'
         ];
         var len = views.length;
         for(var i = 0; i < len; i++){
            Ext.Array.forEach(values[names[i]], function(item) {
               views[i].store.add({
                  url: FH.getZhuChaoImageUrl(item[0]),
                  fileRefId: item[1]
               });
            }, this);
         }
      }
   },
   
   isInfoValid : function()
   {
      return this.getForm().isValid();
   },
   
   destroy : function()
   {
      delete this.businessCertificateRef;
      delete this.qualificationCertificateRef;
      delete this.honorCertificateRef; 
      delete this.otherCertificateRef;
      if (this.viewContextMenuRef) {
         this.viewContextMenuRef.destroy();
         delete this.viewContextMenuRef;
      }
      this.mixins.langTextProvider.destroy.call(this);
      this.callParent();
   }
});

