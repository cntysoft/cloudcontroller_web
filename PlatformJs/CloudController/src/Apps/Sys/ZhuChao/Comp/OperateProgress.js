/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.ZhuChao.Comp.OperateProgress", {
   extend: "Ext.grid.Panel",
   mixins: {
      langTextPrinfoEditorRefovider: 'WebOs.Mixin.RunableLangTextProvider'
   },
   alias: "widget.appsyszhuchaocompoperateprogress",
   /**
    * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey: 'App.Sys.ZhuChao',
   LANG_TEXT: null,
   constructor : function(config)
   {
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig: function(config)
   {
      this.LANG_TEXT = this.GET_LANG_TEXT("COMP.OPERATE_PROGRESS");
      Ext.apply(config, {
         maximizable: false,
         resizable: false,
         modal: true
      });
   },
   initComponent: function()
   {
      var COLS = this.LANG_TEXT.COLS;
      Ext.apply(this, {
         columns: [
            {text: COLS.MSG, dataIndex: "msg", flex: 1, resizable: false, sortable: false, menuDisabled: true}
         ],
         autoScroll: true,
         store: new Ext.data.Store({
            fields: [
               {name: "msg", type: "string"},
               {name: "key", type: "string"}
            ]
         })
      });
      this.callParent();
   },
   
   addMsg: function(msg, key, replace)
   {
      replace = !!replace;
      if(!key){
         key = "key"+this.self.KEY_SEED_ID++;
      }
      var store = this.store;

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
      var added = this.store.add({
         key: key,
         msg: msg
      });
      this.getView().focusRow(added.pop());
   },
   destroy: function()
   {
      delete this.appRef;
      this.callParent();
   }
});