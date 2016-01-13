/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Ui.Ui.Tag.ListView', {
   extend : 'Ext.grid.Panel',
   alias : 'widget.siteuiuitaglistview',
   requires : [
      'Cntysoft.Kernel.Utils'
   ],
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   statics : {
      A_MAP : {
         MODIFY_META : 1,
         MODIFY_CODE : 2,
         DELETE : 3,
         COPY : 4
      }
   },
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.Site.Ui',
   /*
    * @property {String} panelType 面板的类型
    */
   panelType : 'List',
   /*
    * 标签的分类
    *
    * @property {String} classify
    */
   classify : null,
   /*
    * 标签的类型
    *
    * @property {String} tagType
    */
   tagType : null,
   /*
    * @property {Ext.menu.Menu} contextMenuRef
    */
   contextMenuRef : null,
   mainPanelRef : null,
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('TAG.LIST_VIEW');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         title : this.LANG_TEXT.TITLE,
         border : true
      });
   },
   initComponent : function()
   {
      this.emptyText = this.LANG_TEXT.EMPTY_TEXT;
      var COLS = this.LANG_TEXT.COLS;
      var store = this.createDataStore();
      Ext.apply(this, {
         columns : [
            {text : COLS.NAME, dataIndex : 'name', width : 150, resizable : false, sortable : false, menuDisabled : true},
            {text : COLS.CLASS, dataIndex : 'classify', width : 100, resizable : false, sortable : false, menuDisabled : true},
            {text : COLS.DESCRIPTION, dataIndex : 'description', flex : 1, resizable : false, sortable : false, menuDisabled : true}
         ],
         store : store,
         bbar : Ext.create('Ext.PagingToolbar', {
            store : store,
            displayInfo : true,
            emptyMsg : Cntysoft.GET_LANG_TEXT('MSG.EMPTY_TEXT'),
            height : 50
         })
      });

      if(this.classify && this.tagType){
         this.addListener('afterrender', function(){
            this.loadTag(this.classify, this.tagType, true);
         }, this, {
            single : true
         });
      }
      this.addListener({
         itemdblclick : function(panel, record)
         {
            this.mainPanelRef.renderPanel('TagEditor', {
               mode : CloudController.Const.MODIFY_MODE, /*修改模式*/
               tagType : record.get('tagType'),
               classify : record.get('classify'),
               qsTagName : record.get('name')
            });
         },
         itemcontextmenu : this.contextMenuHandler,
         scope : this
      });
      this.callParent();
   },
   /*
    * @param {String} classify
    * @param {String} tagType 标签的类型
    */
   loadTag : function(classify, tagType, force)
   {
      if(force || tagType !== this.tagType || classify !== this.classify){
         this.store.load({
            params : {
               classify : classify,
               tagType : tagType
            }
         });
         this.classify = classify;
         this.tagType = tagType;
      }
   },
   createDataStore : function()
   {
      return new Ext.data.Store({
         autoLoad : false,
         fields : [
            {name : 'id', type : 'integer', persist : false},
            {name : 'name', type : 'string', persist : false},
            {name : 'tagType', type : 'string', persist : false},
            {name : 'classify', type : 'string', persist : false},
            {name : 'description', type : 'string', persist : false}
         ],
         proxy : {
            type : 'apigateway',
            callType : 'App',
            invokeMetaInfo : {
               module : 'Site',
               name : 'Ui',
               method : 'Tag/getTagLists'
            },
            reader : {
               type : 'json',
               rootProperty : 'items',
               totalProperty : 'total'
            }
         },
         listeners : {
            beforeload : function(store, operation){
               if(!operation.getParams()){
                  operation.setParams({
                     tagType : this.tagType,
                     classify : this.classify
                  });
               }
            },
            scope : this
         }
      });
   },
   createCmenu : function()
   {
      if(!this.contextMenuRef){
         var A_TEXT = this.LANG_TEXT.A_TEXT;
         var A_MAP = this.self.A_MAP;
         this.contextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks : true,
            items : [{
               text : A_TEXT.MODIFY_META,
               code : A_MAP.MODIFY_META
            },{
               text : A_TEXT.MODIFY_CODE,
               code : A_MAP.MODIFY_CODE
            },{
               text : A_TEXT.DELETE,
               code : A_MAP.DELETE
            },{
               text : A_TEXT.COPY,
               code : A_MAP.COPY
            }],
            listeners : {
               click : this.menuItemClickHandler,
               scope : this
            }
         });
      }
      return this.contextMenuRef;
   },
   menuItemClickHandler: function(menu, item)
   {
      if(item){
         var AM = this.self.A_MAP;
         switch(item.code){
            case AM.MODIFY_META:
               this.modifyHandler(menu.record);
               break;
            case AM.MODIFY_CODE:
               this.openFsHandler(menu.record);
               break;
            case AM.DELETE:
               this.deleteHandler(menu.record);
               break;
            case AM.COPY:
               this.copyHandler(menu.record);
               break;
         }
      }
   },
   contextMenuHandler : function(panel, record, item, index, e)
   {
      var menu = this.createCmenu();
      var pos = e.getXY();
      menu.record = record;
      menu.showAt(pos[0], pos[1]);
      e.stopEvent();
   },
   /*
    * 删除一个标签
    */
   deleteHandler : function(record)
   {
      Cntysoft.showQuestionWindow(Ext.String.format(this.LANG_TEXT.MSG.DELETE_ASK, record.get('classify'), record.get('name')), function(bid){
         if('yes' == bid){
            this.setLoading();
            this.mainPanelRef.appRef.deleteTag(record.get('tagType'), record.get('classify'), record.get('name'), function(response){
               this.loadMask.hide();
               if(response.status){
                  this.store.reload();
               }else{
                  Cntysoft.Kernel.Utils.processApiError(response);
               }
            }, this);
         }
      }, this);
   },
   /*
    * 复制一个指定标签
    */
   copyHandler : function(record)
   {
      this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.OP'));
      this.mainPanelRef.appRef.copyTag(record.get('tagType'), record.get('classify'), record.get('name'),function(response){
         this.loadMask.hide();
         if(response.status){
            this.store.reload();
         }else{
            Cntysoft.Kernel.Utils.processApiError(response);
         }
      }, this);
   },
   openFsHandler : function(record)
   {
      this.mainPanelRef.renderNewTabPanel('TagFsView', {
         tagType : record.get('tagType'),
         classify : record.get('classify'),
         qsTagName : record.get('name')
      });
   },
   modifyHandler : function(record)
   {
      this.mainPanelRef.renderPanel('TagEditor', {
         mode : CloudController.Const.MODIFY_MODE, /*修改模式*/
         tagType : record.get('tagType'),
         classify : record.get('classify'),
         qsTagName : record.get('name')
      });
   },
   destroy : function()
   {
      this.mixins.langTextProvider.destroy.call(this);
      if(this.loadMask){
         this.loadMask.destroy();
         delete this.loadMask;
      }
      if(this.contextMenuRef){
         this.contextMenuRef.destroy();
         delete this.contextMenuRef;
      }
      Ext.destroy(this.el);
      delete this.mainPanelRef;
      this.callParent();
   }
});