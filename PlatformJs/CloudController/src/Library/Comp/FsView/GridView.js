/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("CloudController.Comp.FsView.GridView", {
   extend: "Cntysoft.Component.FsView.GridView",
   requires: [
      "CloudController.Framework.Core.WsFilesystem",
      "CloudController.Comp.Editor.WsText"
   ],
   alias: "widget.cloudcontrollercompfsviewgridview",
   websocketEntry: null,
   serviceInvoker: null,
   isCreateFsTree: false,
   uploaderRef: null,
   statics: {
      VE_MAP: {
         js: [true, true, "CloudController.Comp.Editor.WsText"],
         php: [true, true, "CloudController.Comp.Editor.WsText"],
         html: [true, true, "CloudController.Comp.Editor.WsText"],
         css: [true, true, "CloudController.Comp.Editor.WsText"],
         txt: [true, true, "CloudController.Comp.Editor.WsText"]
      }
   },
   /**
    * @return {Object}
    */
   getVeMapItem: function(fileType)
   {
      return this.statics().VE_MAP[fileType];
   },
   /**
    * 构造函数
    *
    * @param {Object} config
    */
   constructor: function(config)
   {
      if(Ext.isEmpty(config.websocketEntry)){
         Cntysoft.raiseError(Ext.getClassName(this), "constructor", "websocketEntry can not be empty");
      }
      this.fsTreeDataProxy = {
         type: "websocketgateway",
         websocketEntryName: config.websocketEntry,
         reader: {
            type: "json",
            rootProperty: "data"
         },
         invokeMetaInfo: {
            name: "Common/Filesystem",
            method: "treeLs"
         }
      };
      this.callParent([config]);
   },
   initComponent: function()
   {
      this.addListener("pathchanged", function(path){
         this.uploaderRef.changeUploadDir(path);
      }, this);
      this.callParent();
   },
   getFsObject: function()
   {
      if(null==this.fs){
         this.fs = new CloudController.Framework.Core.WsFilesystem({
            websocketEntry: this.websocketEntry
         });
      }
      return this.fs;
   },
   /**
    * 获取系统文件目录的数据仓库
    *
    * @return {Ext.data.Store}
    */
   getFsStore: function()
   {
      if(null==this.fsStore){
         this.fsStore = new Ext.data.Store({
            fields: [
               {name: "name", type: "string", persist: false},
               {name: "rawName", type: "string", persist: false},
               {name: "icon", type: "string", persist: false},
               {name: "type", type: "string", persist: false},
               {name: "cTime", type: "string", persist: false},
               {name: "mTime", type: "string", persist: false},
               {name: "isReadable", type: "boolean", persist: false},
               {name: "isWritable", type: "boolean", persist: false},
               {name: "isStartup", type: "boolean", persist: false},
               {name: "size", type: "string", persist: false},
               {name: "fullPath", type: "string", persist: false}
            ],
            proxy: {
               type: "websocketgateway",
               websocketEntryName: this.websocketEntry,
               reader: {
                  type: "json",
                  rootProperty: "entries"
               },
               invokeMetaInfo: {
                  name: "Common/Filesystem",
                  method: "ls"
               },
               pArgs: [{
                     key: "allowFileTypes",
                     value: this.allowFileTypes
                  }],
               listeners: {
                  dataready: this.prepareFileHandler,
                  scope: this
               }
            },
            filters: [
               Ext.bind(this.fileTypeFilter, this)
            ],
            listeners: {
               load: function()
               {
                  if(this.hasListeners.pathchanged){
                     this.fireEvent("pathchanged", this.path);
                  }
               },
               scope: this
            }
         });
      }
      return this.fsStore;
   },
   getUploaderConfig: function()
   {
      var L = this.LANG_TEXT.BTN;
      return {
         xtype: "ccsimpleuploader",
         text: L.UPLOAD_FILE,
         maskTarget: this,
         websocketEntry: this.websocketEntry,
         listeners: {
            uploadsuccess: function()
            {
               this.refresh();
            },
            afterrender: function(comp)
            {
               this.uploaderRef = comp;
            },
            scope: this
         }
      };
   },
   destroy: function()
   {
      delete this.uploaderRef;
      this.callParent();
   }
});