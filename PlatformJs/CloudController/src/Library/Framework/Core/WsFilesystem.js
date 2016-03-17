/**
 * Cntysoft OpenEngine
 *
 * @author SOFTBOY <cntysoft@163.com>
 * copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 文件系统数据调用,只是提供简单的封装
 */
Ext.define("CloudController.Framework.Core.WsFilesystem",{
    /**
    * @var {Cntysoft.Framework.Rpc.ServiceInvoker} serviceInvoker
    */
   serviceInvoker : null,
   websocketEntry : null,
   constructor : function(config)
   {
      Ext.apply(this, config);
      if(Ext.isEmpty(this.websocketEntry)){
         Cntysoft.raiseError(Ext.getClassName(this), "constructor", "websocketEntry can not be empty");
      }
      var websocketUrl = CloudController.Kernel.Funcs.getWebSocketEntry(this.websocketEntry);
      this.serviceInvoker = new Cntysoft.Framework.Rpc.ServiceInvoker({
         serviceHost: websocketUrl,
         listeners : {
            connecterror : function(invoker, event){
               Cntysoft.showErrorWindow("connect to websocket server " + websocketUrl + " error");
               Cntysoft.raiseError(Ext.getClassName(this), "run", "connect to websocket server " + websocketUrl + " error");
            },
            scope : this
         }
      });
   },
   /**
    * 查看文件内容
    *
    * @param {String} filename 文件名称
    */
   cat : function(filename, callback, scope)
   {
      this.serviceInvoker.callService("Common/Filesystem", "cat", {
         filename : filename
      }, callback, scope);
   },
   /**
    * 保存指定文件
    *
    * @param {Object} data data.filename data.content
    */
   save : function(data, callback, scope)
   {
      this.serviceInvoker.callService("Common/Filesystem", "save", data, callback, scope);
   },
   /**
    * 重命名文件名
    *
    * @param {String} Object {oldName : 'oldName', newName : 'newName'}
    */
   rename : function(data, callback, scope)
   {
      this.serviceInvoker.callService("Common/Filesystem", "rename", data, callback, scope);
   },
   /**
    * 删除指定文件
    *
    * @param {String} filename
    */
   deleteFile : function(filename, callback, scope)
   {
      this.serviceInvoker.callService("Common/Filesystem", "deleteFile", {
         filename : filename
      }, callback, scope);
   },
   /**
    * 批量删除文件，放在一次请求中可以加快速度
    *
    * @param {Array} files
    */
   deleteFiles : function(files, callback, scope)
   {
      this.serviceInvoker.callService("Common/Filesystem", "deleteFiles",{
         files : files
      },callback, scope);
   },
   /**
    * 删除指定文件夹
    *
    * @param string dirname
    */
   deleteDir : function(dirname, callback, scope)
   {
      this.serviceInvoker.callService("Common/Filesystem", "deleteDir", {
         dirname : dirname
      }, callback, scope);
   },
   /**
    * 批量删除文件夹，放在一次请求中可以加快速度
    *
    * @param {Array} dirs
    */
   deleteDirs : function(dirs, callback, scope)
   {
      this.serviceInvoker.callService("Common/Filesystem","deleteDirs", {
         dirs : dirs
      }, callback, scope);
   },
   /**
    * 创建一个文件夹
    *
    * @param {String} dirname
    */
   createDir : function(dirname, callback, scope)
   {
      this.serviceInvoker.callService("Common/Filesystem", "createDir", {
         dirname : dirname
      }, callback, scope);
   },
   /**
    * 粘贴剪切板的文件或者文件夹
    * {
     *      type : 'type',
     *      items : 'items'
     * }
    *
    *
    * @param {Object} data
    */
   paste : function(data, callback, scope)
   {
      return this.callSys('paste',data, callback, scope);
   }
});