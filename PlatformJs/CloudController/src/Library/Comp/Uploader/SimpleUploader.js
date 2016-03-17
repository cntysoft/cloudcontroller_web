/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("CloudController.Comp.Uploader.SimpleUploader", {
   extend: "Ext.Component",
   alias: 'widget.ccsimpleuploader',
   requires: [
      "Cntysoft.Framework.Security.Hash.Md5",
      "Cntysoft.Framework.Rpc.ServiceInvoker",
      "Cntysoft.Framework.Rpc.Request"
   ],
   mixins: {
      langTextProvider: 'Cntysoft.Mixin.LangTextProvider'
   },
   LANG_NAMESPACE: 'CloudController.Lang',
   websocketEntry: "upgrademgr",
   serviceInvoker: null,
   totalToBeUpload: 0,
   uploaded: 0,
   /**
    * 提交几次数据然后进行等待
    */
   cycleSize: 1,
   chunkSize: 1024*512,
   totalReaded: 0,
   uploadFile: null,
   fileReader: null,
   uploadFileSetInput: null,
   uploadDir : "",
   /**
    * 上传提示信息显示的组件
    *
    * @property {Ext.Component} maskTarget
    */
   maskTarget: null,
   initComponent: function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('UPLOADER.SIMPLE_UPLOADER');
      Ext.apply(this, {
         autoEl: this.getAutoElConfig()
      });
      this.addListener({
         afterrender: function()
         {
            var input = this.el.query("input", false);
            input = input[0];
            this.uploadFileSetInput = input;
            input.addListener("change", function(){
               this.initUploadProcess(input.dom.files.item(0));
            }, this);
         },
         scope: this
      });
      var websocketUrl = CloudController.Kernel.Funcs.getWebSocketEntry(this.websocketEntry);
      this.serviceInvoker = new Cntysoft.Framework.Rpc.ServiceInvoker({
         serviceHost: websocketUrl,
         listeners: {
            connecterror: function(invoker, event){
               Cntysoft.raiseError(Ext.getClassName(this), "run", "connect to websocket server "+websocketUrl+" error");
            },
            scope: this
         }
      });
      this.callParent();
   },
   initUploadProcess: function(file)
   {

      this.totalToBeUpload = file.size;
      var request = new Cntysoft.Framework.Rpc.Request("Common/Uploader", "init", {
         filename: file.name,
         filesize: file.size,
         cycleSize: this.cycleSize,
         chunkSize: this.chunkSize,
         uploadDir : this.uploadDir
      });
      this.fileReader = new FileReader();
      this.fileReader.onloadstart = Ext.bind(this.loadStartHandler, this);
      this.fileReader.onerror = Ext.bind(function(event){
         this.errorHandler(event);
      }, this);
      this.fileReader.onload = Ext.bind(this.readReadyHandler, this);
      this.serviceInvoker.request(request, function(response){
         if(response.status){
            this.startUploadProcess(file);
         }else{
            this.resetContext();
            if(this.hasListeners.uploaderror){
               this.fireEvent("uploaderror", response.setErrorString());
            }
         }
      }, this);
   },
   
   changeUploadDir : function(uploadDir)
   {
      this.uploadDir = uploadDir;
   },
   loadStartHandler: function()
   {
      if(this.hasListeners.startupload){
         this.fireEvent("startupload", this.uploadFile);
      }
   },
   errorHandler: function(event)
   {
      if(this.hasListeners.uploaderror){
         this.fireEvent("uploaderror", event, this.uploadFile);
      }
   },
   readReadyHandler: function(event)
   {
      var request = new Cntysoft.Framework.Rpc.Request("Common/Uploader", "receiveData");
      request.setExtraData(this.fileReader.result);
      var readed = this.fileReader.result.length;
      this.totalReaded += readed;
      this.serviceInvoker.request(request, function(response){
         if(response.status){
            var data = response.getData();
            this.uploaded += readed;
            if(data.containsKey("cycleComplete")&&data.get("cycleComplete")){
               this.uploadCycle();
            }
         }else{
            this.resetContext();
            if(this.hasListeners.uploaderror){
               this.fireEvent("uploaderror", response.setErrorString());
            }
         }
      }, this);
   },
   startUploadProcess: function(file)
   {
      this.uploadFile = file;
      this.uploadCycle();
      if(this.maskTarget){
         this.maskTarget.setLoading(Ext.String.format(this.LANG_TEXT.PROGRESS_TEXT, "0%"));
      }
   },
   uploadCycle: function()
   {
      for(var i = 0; i<this.cycleSize; i++){
         if(this.uploaded<this.totalToBeUpload){
            var blob = this.uploadFile.slice(this.uploaded, this.uploaded+this.chunkSize);
            this.fileReader.readAsBinaryString(blob);
            if(this.hasListeners.uploadprogress){
               this.fireEvent("uploadprogress", this.uploaded, this.totalToBeUpload, this.uploadFile);
            }
            if(this.maskTarget){
               this.maskTarget.setLoading(Ext.String.format(this.LANG_TEXT.PROGRESS_TEXT, parseInt((this.uploaded/this.totalToBeUpload)*100)+'%'));
            }
         }else{
            this.uploadComplete();
            return;
         }
      }
   },
   uploadComplete: function()
   {
      var request = new Cntysoft.Framework.Rpc.Request("Common/Uploader", "notifyUploadComplete");
      this.serviceInvoker.request(request, function(response){
         this.resetContext();
         this.uploadFileSetInput.dom.value = "";
         this.uploadFileSetInput.dom.type = "";
         this.uploadFileSetInput.dom.type = "file";
         if(response.status){
            if(this.hasListeners.uploadsuccess){
               this.fireEvent("uploadsuccess", this.uploadFile);
            }

         }else{
            if(this.hasListeners.uploaderror){
               this.fireEvent("uploaderror", response.setErrorString());
            }
         }
      }, this);
      if(this.maskTarget){
         this.maskTarget.loadMask.hide();
      }
   },
   getAutoElConfig: function()
   {
      return {
         tag: "a",
         children: [{
               tag: "input single",
               type: "file",
               id: this.id+"-fileinput",
               value: 1024*1024*100
            }],
         cls: "ccsimpleuploader",
         html: this.LANG_TEXT.UPLOAD_BTN
      };
   },
   resetContext: function()
   {
      this.uploadFile = null;
      this.fileReader = null;
      this.totalToBeUpload = 0;
      this.uploaded = 0;
   },
   destroy: function()
   {
      Ext.destroy(this.serviceInvoker);
      delete this.LANG_TEXT;
      delete this.uploadFileSetInput;
      delete this.maskTarget;
      this.callParent();
   }
});

