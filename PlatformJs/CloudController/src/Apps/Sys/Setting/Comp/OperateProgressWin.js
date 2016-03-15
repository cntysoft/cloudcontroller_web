/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.Setting.Comp.OperateProgressWin", {
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
   displayer: null,
   applyConstraintConfig: function(config)
   {
      this.LANG_TEXT = this.GET_LANG_TEXT("COMP.OPERATE_PROGRESS_WIN");
      this.callParent([config]);
      Ext.apply(config, {
         width: 700,
         minWidth: 700,
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
         items: this.getDisplayerConfig()
      });
      this.callParent();
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
   destroy: function()
   {
      delete this.displayer;
      delete this.appRef;
      this.callParent();
   }
});