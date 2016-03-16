/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("CloudController.Comp.FsView.GridView", {
   extend: "WebOs.Component.FsView.GridView",
   alias: "widget.cloudcontrollercompfsviewgridview",
   websocketEntry: "upgrademgr",
   serviceInvoker: null,
   isCreateFsTree : false,
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
            ]
         });
      }
      return this.fsStore;
   },
});