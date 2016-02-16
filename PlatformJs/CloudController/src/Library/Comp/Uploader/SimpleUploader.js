/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("CloudController.Comp.Uploader.SimpleUploader",{
   extend : "Ext.Component",
   alias: 'widget.ccsimpleuploader',
   requires : [
      "Cntysoft.Framework.Security.Hash.Md5",
      "Cntysoft.Framework.Rpc.ServiceInvoker",
      "Cntysoft.Framework.Rpc.Request"
   ],
   mixins : {
      langTextProvider : 'Cntysoft.Mixin.LangTextProvider'
   },
   LANG_NAMESPACE : 'CloudController.Lang',
   
   websocketEntry : "upgrademgr",
   serviceInvoker : null,
   totalToBeUpload : 0,
   
   initComponent : function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('UPLOADER.SIMPLE_UPLOADER');
      Ext.apply(this,{
         autoEl : this.getAutoElConfig()
      });
      this.addListener({
         afterrender : function()
         {
            var input = this.el.query("input", false);
            input = input[0];
            input.addListener("change", function(){
               this.initUploadProcess(input.dom.files.item(0));
            }, this);
         },
         scope : this
      });
      var websocketUrl = CloudController.Kernel.Funcs.getWebSocketEntry(this.websocketEntry);
      this.serviceInvoker = new Cntysoft.Framework.Rpc.ServiceInvoker({
         serviceHost: websocketUrl,
         listeners : {
            connecterror : function(invoker, event){
               Cntysoft.raiseError(Ext.getClassName(this), "run", "connect to websocket server " + websocketUrl + " error");
            },
            scope : this
         }
      });
      this.callParent();
   },
   
   initUploadProcess : function(file)
   {
      var request = new Cntysoft.Framework.Rpc.Request("Common/Uploader", "init", {
         filename : file.name,
         size : file.size
      });
      this.serviceInvoker.request(request, function(response){
         
      }, this);
      //      
      //      var reader = new FileReader();
      //      reader.onload = function(event)
      //      {
      //         var data = this.result;
      //         console.log(data)
      //         this.totalToBeUpload = file.size;
      //         var md5 = Cntysoft.Framework.Security.Hash.Md5.hash(data);
      //         console.log(md5)
      //      };
      //      reader.readAsArrayBuffer(file);
   },
   
   
   
   getAutoElConfig : function()
   {
      return {
         tag : "a",
         children : [{
               tag : "input single",
               type : "file",
               id : this.id + "-fileinput",
               value : 1024 * 1024 *100
            }],
         cls : "ccsimpleuploader",
         html : this.LANG_TEXT.UPLOAD_BTN
      }
   },
   
   destroy : function()
   {
      Ext.destroy(this.serviceInvoker);
      delete this.LANG_TEXT;
      this.callParent();
   }
});

