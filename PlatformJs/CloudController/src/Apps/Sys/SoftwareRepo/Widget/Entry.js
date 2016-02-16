/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.SoftwareRepo.Widget.Entry", {
   extend: "WebOs.Kernel.ProcessModel.AbstractWidget",
   requires : [
      "Cntysoft.Utils.ColRenderer",
      "CloudController.Comp.Uploader.SimpleUploader"
   ],
   LANG_TEXT: null,
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT("ENTRY");
   },
   initLangTextRef: function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT("ENTRY");
   },
   applyConstraintConfig: function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         width: 1000,
         minWidth: 1000,
         height: 500,
         minHeight: 500,
         maximizable: true,
         layout: "fit"
      });
   },
   initComponent: function()
   {
//      this.addListener({
//         afterrender: function()
//         {
//            this.appRef.getRepoFileList();
//         },
//         scope: this
//      });
      Ext.apply(this, {
         items: this.getGridPanelConfig(),
         bbar : this.getBBarConfig()
      });
      this.callParent(arguments);
   },
   getGridPanelConfig: function()
   {
      var L = this.LANG_TEXT.COLS;
      return {
         xtype: "grid",
         columns: [
            {text: L.FILE_NAME, dataIndex: "filename", flex: 1, resizable: false, menuDisabled: true},
            {text: L.FILE_SIZE, dataIndex: "filesize", width: 200, resizable: false, menuDisabled: true, renderer : Cntysoft.Utils.ColRenderer.filesizeRenderer}
         ],
         store: new Ext.data.Store({
            autoLoad: true,
            fields: [
               {name: "module", type: "string"},
               {name: "key", type: "string"},
               {name: "text", type: "string"},
               {name: "status", type: "integer"},
               {name: "aclDataFile", type: "string"},
               {name: "hasAclFile", type: "boolean"}
            ],
            proxy: {
               type: "websocketgateway",
               websocketEntryName : "upgrademgr",
               invokeMetaInfo: {
                  name: "Repo/Info",
                  method: "lsSoftwareRepoDir"
               }
            }
         })
      };
   },
   getBBarConfig : function()
   {
      return [{
            xtype : "ccsimpleuploader",
            text : "上传软件包"
      }];
   }
});