/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Ui.Ui.Tag.ClassifyTree', {
   extend : 'Ext.tree.Panel',
   alias : 'widget.siteuiuitagclassifytree',
   requires : [
      'SenchaExt.Data.Proxy.ApiProxy',
      'SenchaExt.Data.TreeStore',
      'App.Site.Ui.Lib.Const'
   ],
   mixins : {
      fcm : 'Cntysoft.Mixin.ForbidContextMenu',
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   statics : {
      A_MAP : {
         CREATE_CLASSIFY : 1,
         CREATE_TAG : 2,
         RENAME_CLASSIFY : 3,
         DELETE_CLASSIFY : 4
      }
   },
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.Site.Ui',
   /*
    * @property {Ext.menu.Menu} classifyMenuRef 分类上面的按钮
    */
   classifyMenuRef : null,
   /*
    * @property {Ext.menu.Menu} typeMenuRef 类型按钮
    */
   typeMenuRef : null,
   //private
   mainWidgetRef : null,
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('TAG.CLASSIFY_TREE');
      this.applyConstraintConfig(config);
      Ext.apply(config, {
         store : this.createTreeStore()
      });
      this.callParent([config]);
      this.mixins.fcm.forbidContextMenu.call(this);
   },
   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         title : this.LANG_TEXT.TITLE,
         rootVisible : false
      });
   },

   /*
    * @event treenodeaction
    * 通知栏打开开始
    *
    * @param {Ext.data.Model} record 点击的记录对象
    * @param {Integer} code 动作代码
    */
   initComponent : function()
   {
      this.addListener({
         itemcontextmenu : this.createCmenuHandler,
         scope : this
      });
      this.callParent();
   },
   /*
    * @return {SenchaExt.Data.TreeStore}
    */
   createTreeStore : function()
   {
      var C = App.Site.Ui.Lib.Const;
      return new SenchaExt.Data.TreeStore({
         listeners : {
            load : this.setupNodeRecordsHandler,
            scope : this
         },
         root : {
            text : this.LANG_TEXT.ROOT_NODE,
            id : 'root',
            nodeType : C.N_T_ROOT
         },
         fields : [
            {name : 'text', type : 'string', persist : false},
            {name : 'nodeType', type : 'integer', persist : false},
            {name : 'id', type : 'string', persist : false}
         ],
         nodeParam : 'id',
         extraParams : ['nodeType'],
         proxy : {
            type : 'apigateway',
            callType : 'App',
            invokeMetaInfo : {
               module : 'Site',
               name : 'Ui',
               method : 'Tag/getClassifyChildren'
            },
            reader : {
               type : 'json',
               rootProperty : 'data'
            }
         }
      });
   },
   /*
    * @return {Ext.menu.Menu}
    */
   createCmenu : function(record)
   {
      var C = App.Site.Ui.Lib.Const;
      var M = this.LANG_TEXT.MENU;
      var A_MAP = this.self.A_MAP;
      var nodeType = record.get('nodeType');
      if(C.N_T_TYPE == nodeType){
         if(!this.typeMenuRef){
            this.typeMenuRef = new Ext.menu.Menu({
               ignoreParentClicks : true,
               items : [{
                  text : M.CREATE_CLASSIFY,
                  code : A_MAP.CREATE_CLASSIFY
               }],
               listeners : {
                  click : this.menuItemClickHandler,
                  scope : this
               }
            });
         }
         this.typeMenuRef.record = record;
         return this.typeMenuRef;
      } else if(C.N_T_CLASSIFY == nodeType){
         if(!this.classifyMenuRef){
            this.classifyMenuRef = new Ext.menu.Menu({
               ignoreParentClicks : true,
               items : [{
                  text : M.CREATE_TAG,
                  code : A_MAP.CREATE_TAG
               },{
                  text : M.RENAME_CLASSIFY,
                  code : A_MAP.RENAME_CLASSIFY
               },{
                  text : M.DELETE_CLASSIFY,
                  code : A_MAP.DELETE_CLASSIFY
               }],
               listeners : {
                  click : this.menuItemClickHandler,
                  scope : this
               }
            });
         }
         this.classifyMenuRef.record = record;
         return this.classifyMenuRef;
      }
   },
   menuItemClickHandler : function(menu, item)
   {
      if(item){
         if(this.hasListeners.treenodeaction){
            this.fireEvent('treenodeaction', menu.record, item.code);
         }
      }
   },
   setupNodeRecordsHandler : function(store, records, successful, operation, node, eOpts)
   {
      var L = this.LANG_TEXT;
      var C = App.Site.Ui.Lib.Const;
      if(node.get('nodeType') == C.N_T_ROOT){
         Ext.each(records, function(record){
            record.set('text', L.NODE_TYPES[record.get('text')]);
         });
      }
   },
   createCmenuHandler : function(panel, record, item, index, e)
   {
      var menu = this.createCmenu(record);
      var pos = e.getXY();
      menu.showAt(pos[0], pos[1]);
      e.stopEvent();
   },
   destroy : function()
   {
      this.mixins.langTextProvider.destroy.call(this);
      if(this.classifyMenuRef){
         this.classifyMenuRef.destroy();
         delete this.classifyMenuRef;
      }
      if(this.typeMenuRef){
         this.typeMenuRef.destroy();
         delete this.typeMenuRef;
      }
      delete this.mainWidgetRef;
      this.callParent();
   }
});