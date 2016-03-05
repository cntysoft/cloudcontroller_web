/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */

Ext.define("App.Sys.Setting.Comp.UpgradeUpgradeMgrSlaveProgressWin", {
   extend: "WebOs.Component.Window",
   mixins: {
      langTextPrinfoEditorRefovider: 'WebOs.Mixin.RunableLangTextProvider'
   },
   /**
    * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey: 'App.Sys.Setting',
   LANG_TEXT: null,
   targetVersion: null,
   displayer: null,
   targetIp: null,
   applyConstraintConfig: function(config)
   {
      this.LANG_TEXT = this.GET_LANG_TEXT("COMP.UPGRADE_UPGRADEMGR_SLAVE_PROGRESS_WIN");
      this.callParent([config]);
      Ext.apply(config, {
         width: 800,
         minWidth: 800,
         minHeight: 300,
         height: 300,
         layout: "fit",
         maximizable: false,
         resizable: false,
         title: this.LANG_TEXT.TITLE,
         modal: true
      });
   },
   initComponent: function()
   {
      Ext.apply(this, {
         items: this.getDisplayerConfig(),
      });
      this.addListener({
         show: this.startUpgradeHandler,
         scope: this
      });
      this.callParent();
   },
   startUpgradeHandler: function()
   {
      if(!Ext.isEmpty(this.targetVersion)&&!Ext.isEmpty(this.targetIp)){
         this.addMsg(Ext.String.format(this.LANG_TEXT.MSG.UPGRADE_TPL, this.targetVersion));
         this.appRef.UpgradeUpgradeMgrSlave(this.targetVersion, this.targetIp, function(response){
            if(response.status){
               var msg = response.getDataItem("msg");
               if(!Ext.isEmpty(msg)){
                  var key = response.getSignature();
                  var repeat = response.getDataItem("repeat");
                  if(repeat){
                     this.addMsg(msg, key, true);
                  }else{
                     this.addMsg(msg, key);
                  }
               }

            }else{
               var msg = "<span style = 'color:red'>"+response.getErrorString()+"</span>";
               this.addMsg(msg);
            }
         }, this);
      }else{
         Cntysoft.raiseError(Ext.getClassName(this), "startUpgradeHandler", "targetVersion and targetId must set");
      }
   },
   addMsg: function(msg, key, replace)
   {
      replace = !!replace;
      if(!key){
         key = "key"+this.self.KEY_SEED_ID++;
      }
      var store = this.displayer.store;

      if(replace){
         var record = store.findRecord("key", key);
         if(record){
            record.set("msg", msg);
            this.displayer.getView().focusRow(record);
            return;
         }
      }else{
         var record = store.findRecord("key", key);
         if(record){
            key += this.self.KEY_SEED_ID++;
         }
      }
      var added = this.displayer.store.add({
         key: key,
         msg: msg
      });
      this.displayer.getView().focusRow(added.pop());
   },
   getDisplayerConfig: function()
   {
      var COLS = this.LANG_TEXT.COLS;
      return {
         xtype: "grid",
         columns: [
            {text: COLS.MSG, dataIndex: "msg", flex: 1, resizable: false, sortable: false, menuDisabled: true}
         ],
         autoScroll: true,
         store: new Ext.data.Store({
            fields: [
               {name: "msg", type: "string"},
               {name: "key", type: "string"}
            ]
         }),
         listeners: {
            afterrender: function(grid)
            {
               this.displayer = grid;
            },
            scope: this
         }
      };
   },
   setTargetVersion: function(version)
   {
      this.targetVersion = version;
   },
   setTargetSlaveIp: function(ip)
   {
      this.targetIp = ip;
   },
   destroy: function()
   {
      delete this.targetVersion;
      delete this.targetIp;
      delete this.displayer;
      delete this.appRef;
      this.callParent();
   }
});


