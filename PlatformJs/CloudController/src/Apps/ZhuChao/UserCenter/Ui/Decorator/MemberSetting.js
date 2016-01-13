/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license   Expression $license is undefined on line 6, column 17 in Templates/ClientSide/javascript.js.
 */
Ext.define('App.ZhuChao.UserCenter.Ui.Decorator.MemberSetting', {
   extend : 'Ext.grid.Panel',
   requires : [
      'App.ZhuChao.UserCenter.Ui.Decorator.MemberEditor'
   ],
   mixins: {
      langTextProvider: 'WebOs.Mixin.RunableLangTextProvider',
      formTooltip: 'Cntysoft.Mixin.FormTooltip'
   },
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    */
   runableLangKey : 'App.ZhuChao.UserCenter',
   
   decoratorId : null,
   
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.DECORATOR.MEMBER_SETTING');
      this.mixins.formTooltip.constructor.call(this);
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         border : false,
         title : this.LANG_TEXT.TITLE,
         overflowY : true,
         emptyText : this.LANG_TEXT.EMPTY_TEXT
      });
   },

   initComponent : function()
   {
      var F = this.LANG_TEXT.FIELDS;
      var store = this.createDataStore();
      Ext.apply(this, {
         bbar : Ext.create('Ext.PagingToolbar', {
            store : store,
            displayInfo : true,
            emptyMsg : this.emptyText
         }),
         store : store,
         columns : [
            {text : F.AVATAR, dataIndex : 'avatar', width : 130, resizable : false, sortable : false, menuDisabled : true, renderer : this.avatarRenderer},
            {text : F.NAME, dataIndex : 'name', width :220 , resizable : false, sortable : false, menuDisabled : true},
            {text : F.JOB, dataIndex : 'job', width :220 , resizable : false, sortable : false, menuDisabled : true},
            {text : F.CONCEPT, dataIndex : 'concept', flex :1 , resizable : false, sortable : false, menuDisabled : true},
            {text : F.INTRO, dataIndex : 'intro', flex : 1, resizable : false, sortable : false, menuDisabled : true}
         ],
         tbar : [{
            text : this.LANG_TEXT.BTN.ADD_MEMBER,
            listeners : {
               click : function(){
                  return Ext.create('App.ZhuChao.UserCenter.Ui.Decorator.MemberEditor', {
                     mode : 1,
                     mainPanelRef : this.mainPanelRef,
                     decoratorId : this.decoratorId,
                     memberList : this
                  });
               },
               scope : this
            }
         }]
      });
      this.addListener({
         itemdblclick : function(panel, record)
         {
            return Ext.create('App.ZhuChao.UserCenter.Ui.Decorator.MemberEditor', {
               mode : 2,
               mainPanelRef : this.mainPanelRef,
               decoratorId : this.decoratorId,
               targetLoadId : record.get('id'),
               memberList : this
            });
         },
         itemcontextmenu : this.itemContextMenuHandler,
         show : function(){
            this.store.reload();
         },
         scope : this
      });
      this.callParent();
   },

   
   /*
    * 获取上下文菜单对象
    */
   getContextMenu : function(record)
   {
      var L = this.LANG_TEXT.MENU;
      var MSG = this.LANG_TEXT.MSG;
      if(null == this.contextMenuRef){
         this.contextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks : true,
            closeAction : 'destroy',
            items : [{
               text : L.MODIFY,
               listeners : {
                  click : function(item)
                  {
                     var record =  item.parentMenu.record;
                     return Ext.create('App.ZhuChao.UserCenter.Ui.Decorator.MemberEditor', {
                        mode : 2,
                        mainPanelRef : this.mainPanelRef,
                        decoratorId : this.decoratorId,
                        targetLoadId : record.get('id'),
                        memberList : this
                     });
                  },
                  scope : this
               }
            },{
               text : L.DELETE,
               listeners : {
                  click : function(item){
                     var record =  item.parentMenu.record;
                     Cntysoft.showQuestionWindow(MSG.DELETE, function(btn) {
                        if ('yes' == btn) {
                           this.setLoading(MSG.SAVING);
                           this.mainPanelRef.appRef.deleteDecoratorMember({id : record.get('id')}, function(response){
                              this.loadMask.hide();
                              if(!response.status){
                                 Cntysoft.Kernel.Utils.processApiError(response);
                              }else{
                                 this.store.reload();
                              }
                           }, this);
                        }
                     }, this);
                  },
                  scope : this
               }
            }]
         });
      }
      return this.contextMenuRef;
   },

   itemContextMenuHandler : function(grid, record, htmlItem, index, event)
   {
      var menu = this.getContextMenu();
      menu.record = record;
      var pos = event.getXY();
      event.stopEvent();
      menu.showAt(pos[0], pos[1]);
   },
   
   createDataStore : function()
   {
      return new Ext.data.Store({
         autoLoad : true,
         fields : [
            {name : 'id', type : 'integer', persist : false},
            {name : 'name', type : 'string', persist : false},
            {name : 'avatar', type : 'string', persist : false},
            {name : 'intro', type : 'string', persist : false},
            {name : 'concept', type : 'string', persist : false}
         ],
         proxy : {
            type : 'apigateway',
            callType : 'App',
            pArgs : [{
               key : 'type',
               value : this.mainPanelRef.userType
            }, {
               key : 'decoratorId',
               value : this.decoratorId
            }],
            invokeMetaInfo : {
               module : 'ZhuChao',
               name : 'UserCenter',
               method : 'DecoratorMember/getMemberList'
            },
            reader : {
               type : 'json',
               rootProperty : 'items',
               totalProperty : 'total'
            }
         }
      });
   },
   
   avatarRenderer : function(value)
   {
     return '<img src="'+FH.getZhuChaoImageUrl(value)+'" style="margin-left:-10px;float:left;width:100px;height:110px"/>'; 
   },
   
   applyInfoValue : function(values)
   {
      this.decoratorId = values.id;
   },
   
   destroy : function()
   {
      delete this.decoratorId;
      delete this.type;
      delete this.appRef;
      if (this.contextMenuRef) {
         this.contextMenuRef.destroy();
         delete this.contextMenuRef;
      }
      this.mixins.langTextProvider.destroy.call(this);
      this.callParent();
   }
});

