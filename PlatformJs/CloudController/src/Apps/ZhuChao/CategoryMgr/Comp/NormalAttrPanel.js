/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 筑巢商品分类管理，普通属性面板类
 */
Ext.define('App.ZhuChao.CategoryMgr.Comp.NormalAttrPanel', {
   extend : 'Ext.panel.Panel',
   alias : 'widget.zhuchaocategorymgrcompnormalattrpanel',
   mixins : {
      fcm : 'Cntysoft.Mixin.ForbidContextMenu',
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.CategoryMgr',
   normalAttrWinRef : null,
   normalAttrGroupWinRef : null,
   contextMenuRef : null,
   normalAttrGroups : [],
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('COMP.NORMAL_ATTR_PANEL');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   applyConstraintConfig : function()
   {
      Ext.apply(this,{
         title : this.LANG_TEXT.TITLE
      });
   },

   initComponent : function()
   {
      var COLS = this.LANG_TEXT.COLS;
      Ext.apply(this, {
         tbar : [{
            xtype : 'button',
            text : this.LANG_TEXT.BTN.ADD_GROUP,
            listeners : {
               click : this.addNormalAttrGroupHandler,
               scope: this
            }
         }]
      });
      this.callParent();
      this.addAttrGroupGrid(this.LANG_TEXT.DEFAULT_GROUP_NAME, true);
   },

   addAttrGroupGrid : function(groupName, slient)
   {
      if(!Ext.Array.contains(this.normalAttrGroups, groupName)){
         var COLS = this.LANG_TEXT.COLS;
         var grid = this.add({
            xtype : 'grid',
            title : groupName,
            height : 300,
            closable : groupName == this.LANG_TEXT.DEFAULT_GROUP_NAME ? false : true,
            tbar : [{
               xtype : 'button',
               text : this.LANG_TEXT.BTN.ADD_ATTR,
               listeners : {
                  click : function(){
                     this.addNormalAttrHandler(grid);
                  },
                  scope: this
               }
            },{
               xtype : 'button',
               text : this.LANG_TEXT.BTN.MODIFY_GROUP_NAME,
               listeners : {
                  click : function(){
                     this.modifyNormalAttrGroupNameHandler(grid);
                  },
                  scope: this
               }
            }],
            emptyText : this.LANG_TEXT.MSG.EMPTY_TEXT,
            store : this.createStore(),
            columns : [
               {text : COLS.NAME,  dataIndex : 'name', width : 200, resizable : false, sortable : false, menuDisabled : true},
               {text : COLS.OPT_VALUE,  dataIndex : 'optValue', flex : 1, resizable : false, sortable : false, menuDisabled : true},
               //{text : COLS.GROUP,  dataIndex : 'group', width : 200, resizable : false, sortable : false, menuDisabled : true},
               {text : COLS.REQUIRED,  dataIndex : 'required', width : 100, resizable : false, sortable : false, menuDisabled : true,renderer : Cntysoft.Utils.ColRenderer.boolRenderer}
            ],
            listeners : {
               itemdblclick : this.modifyRequestHandler,
               itemcontextmenu : this.itemContextMenuHandler,
               scope : this
            }
         });
         this.normalAttrGroups.push(groupName);
         return grid;
      }else{
         if(!slient){
            Cntysoft.showErrorWindow(Ext.String.format(this.LANG_TEXT.ERROR.GROUP_ALREADY_EXIST, groupName));
         }
      }
   },

   itemContextMenuHandler : function(grid, record, item, index, event)
   {
      var menu = this.getContextMenu(grid);
      menu.record = record;
      var pos = event.getXY();
      event.stopEvent();
      menu.showAt(pos[0], pos[1]);
   },

   getContextMenu: function(grid)
   {
      if(null == this.contextMenuRef){
         this.contextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks : true,
            items : [{
               text: this.LANG_TEXT.MENU.DELETE
            }],
            listeners : {
               click : function(menu)
               {
                  this.contextMenuRef.targetGrid.store.remove(menu.record);
               },
               scope: this
            }
         });
      }
      this.contextMenuRef.targetGrid = grid;
      return this.contextMenuRef;
   },

   clearAttrValues : function()
   {
      this.items.each(function(grid){
         if(grid.getTitle() == this.LANG_TEXT.DEFAULT_GROUP_NAME){
            grid.store.removeAll();
         }else{
            this.remove(grid);
         }
      }, this);
      this.normalAttrGroups = [this.LANG_TEXT.DEFAULT_GROUP_NAME];
   },


   getAttrValues : function()
   {
      var values = [];
      this.items.each(function(grid){
         grid.store.each(function(record){
            var value = record.getData();
            if(record.phantom){
               delete value.id;
            }
            values.push(value);
         });
      }, this);
      return values;
   },

   setAttrValues : function(values)
   {
      var defaultGroupName = this.LANG_TEXT.DEFAULT_GROUP_NAME;
      this.normalAttrGroups = [];
      this.removeAll();
      this.addAttrGroupGrid(defaultGroupName);
      if(values.length == 0){
         return;
      }
      //重新组装分组信息
      var groupAttrs = {};
      Ext.Array.forEach(values, function(item){
         var groupName = item.group;
         if(!groupAttrs[groupName]){
            groupAttrs[groupName] = [
               item
            ];
         }else{
            groupAttrs[groupName].push(item);
         }
      }, this);
      Ext.Object.each(groupAttrs, function(key, value){
         if(key != defaultGroupName){
            this.addAttrGroupGrid(key);
         }
      }, this);

      this.items.each(function(grid){
         var values = groupAttrs[grid.getTitle()];
         if(values){
            grid.store.loadData(values);
         }
      }, this);
   },
   createStore : function()
   {
      return new Ext.data.Store({
         fields : [
            {name : 'id', type : 'integer', persist : false},
            {name : 'name', type : 'string', persist : false},
            {name : 'optValue', type : 'string', persist : false},
            {name : 'group', type : 'string', persist : false},
            {name : 'required', type : 'boolean', persist : false}
         ]
      });
   },

   modifyNormalAttrGroupNameHandler : function(grid)
   {
      var win = this.getNormalAttrGroupWin(grid);
      win.loadInfo({
         groupName : grid.getTitle()
      });
      win.center();
      win.show();
   },

   modifyRequestHandler : function(grid, record)
   {
      var win = this.getNormalAttrWin(grid);
      win.loadInfo(record.getData());
      win.center();
      win.show();
   },

   addNormalAttrHandler : function(grid)
   {
      var win = this.getNormalAttrWin(grid);
      win.center();
      win.show();
   },

   addNormalAttrGroupHandler : function()
   {
      var win = this.getNormalAttrGroupWin();
      win.center();
      win.show();
   },
   getNormalAttrGroupWin : function(grid)
   {
      if(null == this.normalAttrGroupWinRef){
         this.normalAttrGroupWinRef = new App.ZhuChao.CategoryMgr.Comp.NormalAttrGroupWindow({
            listeners : {
               saverequest : this.attrGroupRequestHandler,
               scope : this
            }
         });
      }
      this.normalAttrGroupWinRef.targetGrid = grid;
      return this.normalAttrGroupWinRef;
   },

   attrGroupRequestHandler : function(grid, data, mode)
   {
      if(mode == CloudController.Const.NEW_MODE){
         this.addAttrGroupGrid(Ext.String.trim(data.groupName));
      }else if(mode == CloudController.Const.MODIFY_MODE){
         grid.setTitle(Ext.String.trim(data.groupName));
      }
   },

   getNormalAttrWin : function(grid)
   {
      if(null == this.normalAttrWinRef){
         this.normalAttrWinRef = new App.ZhuChao.CategoryMgr.Comp.NormalAttrWindow({
            targetGrid : grid,
            listeners : {
               saverequest : this.saveRequestHandler,
               scope : this
            }
         });
      }
      this.normalAttrWinRef.targetGrid = grid;
      return this.normalAttrWinRef;
   },

   saveRequestHandler : function(grid, data, mode)
   {
      if(mode == CloudController.Const.NEW_MODE){
         data.group = grid.getTitle();
         grid.store.add(data);
      }else if(mode == CloudController.Const.MODIFY_MODE){
         var record = grid.store.findRecord('id', data.id);
         for(var key in data){
            record.set(key, data[key]);
         }
      }
   },

   destroy : function()
   {
      if(this.normalAttrWinRef){
         this.normalAttrWinRef.destroy();
         delete this.normalAttrWinRef;
      }
      if(this.normalAttrGroupWinRef){
         this.normalAttrGroupWinRef.destroy();
         delete this.normalAttrGroupWinRef;
      }
      if(this.contextMenuRef){
         this.contextMenuRef.destroy();
         delete this.contextMenuRef;
      }
      this.normalAttrGroups = [];
      this.callParent();
   }
});
/**
 * 添加属性分组窗口
 */
Ext.define('App.ZhuChao.CategoryMgr.Comp.NormalAttrGroupWindow', {
   extend: 'WebOs.Component.Window',
   mixins : {
      fcm : 'Cntysoft.Mixin.ForbidContextMenu',
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.CategoryMgr',
   formRef : null,
   targetGrid : null,
   mode : 1,
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('COMP.NORMAL_ATTR_GROUP_WINDOW');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config,{
         layout : 'fit',
         resizable : false,
         width : 600,
         height : 160,
         modal : true,
         closeAction : 'hide',
         title : this.LANG_TEXT.TITLE
      });
   },

   initComponent : function()
   {
      Ext.apply(this,{
         items : this.getFormConfig(),
         listeners : {
            close : function()
            {
               this.formRef.getForm().reset();
               this.mode = CloudController.Const.NEW_MODE;
            },
            scope : this
         }
      });
      this.callParent();
   },

   loadInfo : function(values)
   {
      if(!this.rendered){
         this.addListener('afterrender', function(){
            this.loadInfo(values);
         }, this, {
            single : true
         });
         return;
      }
      this.$_current_id_$ = values.id;
      this.mode = CloudController.Const.MODIFY_MODE;
      this.formRef.getForm().setValues(values);
   },

   getFormConfig : function()
   {
      var L = this.LANG_TEXT.FIELDS;
      return {
         xtype : 'form',
         bodyPadding : 10,
         defaults : {
            xtype : 'textfield'
         },
         items : [{
            fieldLabel : L.GROUP_NAME,
            allowBlank : false,
            name : 'groupName',
            labelWidth : 120,
            width : 550,
            validator : function(value){
               if('' == Ext.String.trim(value)){
                  return false;
               }else{
                  return true;
               }
            }
         }],
         buttons : [{
            text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
            listeners : {
               click : this.saveHandler,
               scope : this
            }
         },{
            text : Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
            listeners : {
               click : function()
               {
                  this.close();
               },
               scope : this
            }
         }],
         listeners : {
            afterrender : function(comp)
            {
               this.formRef = comp;
            },
            scope : this
         }
      };
   },

   saveHandler : function()
   {
      var form = this.formRef.getForm();
      if(form.isValid()){
         var values = form.getValues();
         if(this.mode == CloudController.Const.MODIFY_MODE){
            values.id = this.$_current_id_$;
         }
         if(this.hasListeners.saverequest){
            this.fireEvent('saverequest', this.targetGrid, values, this.mode);
         }
         this.close();
      }
   },

   destroy : function()
   {
      delete this.formRef;
      delete this.targetGrid;
      this.callParent();
   }
});

/**
 * 添加普通属性
 */
Ext.define('App.ZhuChao.CategoryMgr.Comp.NormalAttrWindow', {
   extend: 'WebOs.Component.Window',
   mixins : {
      fcm : 'Cntysoft.Mixin.ForbidContextMenu',
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.CategoryMgr',
   formRef : null,
   targetGrid : null,
   mode : 1,
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('COMP.NORMAL_ATTR_WINDOW');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config,{
         layout : 'fit',
         resizable : false,
         width : 600,
         height : 250,
         modal : true,
         closeAction : 'hide',
         title : this.LANG_TEXT.TITLE
      });
   },

   initComponent : function()
   {
      Ext.apply(this,{
         items : this.getFormConfig(),
         listeners : {
            close : function()
            {
               this.formRef.getForm().reset();
               this.mode = CloudController.Const.NEW_MODE;
            },
            scope : this
         }
      });
      this.callParent();
   },

   loadInfo : function(values)
   {
      if(!this.rendered){
         this.addListener('afterrender', function(){
            this.loadInfo(values);
         }, this, {
            single : true
         });
         return;
      }
      this.$_current_id_$ = values.id;
      this.mode = CloudController.Const.MODIFY_MODE;
      this.formRef.getForm().setValues(values);
   },

   getFormConfig : function()
   {
      var L = this.LANG_TEXT.FIELDS;
      return {
         xtype : 'form',
         bodyPadding : 10,
         defaults : {
            xtype : 'textfield'
         },
         items : [{
            fieldLabel : L.NAME,
            allowBlank : false,
            name : 'name'
         },{
            fieldLabel : L.OPT_VALUE,
            name : 'optValue',
            width : 550
         },{
            xtype : 'checkbox',
            fieldLabel : L.REQUIRED,
            name : 'required',
            inputValue : true
         }],
         buttons : [{
            text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
            listeners : {
               click : this.saveHandler,
               scope : this
            }
         },{
            text : Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
            listeners : {
               click : function()
               {
                  this.close();
               },
               scope : this
            }
         }],
         listeners : {
            afterrender : function(comp)
            {
               this.formRef = comp;
            },
            scope : this
         }
      };
   },

   saveHandler : function()
   {
      var form = this.formRef.getForm();
      if(form.isValid()){
         var values = form.getValues();
         Ext.applyIf(values, {
            required : false
         });
         if(this.mode == CloudController.Const.MODIFY_MODE){
            values.id = this.$_current_id_$;
         }
         if(this.hasListeners.saverequest){
            this.fireEvent('saverequest', this.targetGrid, values, this.mode);
         }
         this.close();
      }
   },

   destroy : function()
   {
      delete this.targetGrid;
      delete this.formRef;
      this.callParent();
   }
});