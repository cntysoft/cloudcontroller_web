/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 筑巢商品分类管理，标准参数列表类定义
 */
Ext.define('App.ZhuChao.CategoryMgr.Comp.StdAttrGrid', {
   extend : 'Ext.panel.Panel',
   alias : 'widget.zhuchaocategorymgrcompstdattrgrid',
   mixins : {
      fcm : 'Cntysoft.Mixin.ForbidContextMenu',
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.CategoryMgr',

   colorBoxRef : null,
   gridRef : null,
   stdAttrWinRef : null,
   colorAttrItemWinRef : null,
   customColorRef : null,
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('COMP.STD_ATTR_GRID');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         title : this.LANG_TEXT.TITLE,
         layout : {
            type : 'vbox',
            align : 'stretch'
         }
      });
   },

   initComponent : function()
   {
      Ext.apply(this, {
         items : [
            this.getColorConfig(),
            this.getCustomColorConfig(),
            this.getGridConfig()
         ]
      });

      this.callParent();
   },

   getContextMenu: function()
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
                  this.gridRef.store.remove(menu.record);
               },
               scope: this
            }
         });
      }
      return this.contextMenuRef;
   },

   getColorAttrContextMenu : function()
   {
      if(null == this.colorAttrContextMenuRef){
         this.colorAttrContextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks : true,
            items : [{
               text: this.LANG_TEXT.MENU.DELETE_COLOR_ATTR
            }],
            listeners : {
               click : function(menu)
               {
                  this.customColorRef.store.remove(menu.record);
               },
               scope: this
            }
         });
      }
      return this.colorAttrContextMenuRef;
   },

   clearAttrValues : function()
   {
      this.colorBoxRef.reset();
      this.customColorRef.store.removeAll();
      this.gridRef.store.removeAll();
   },

   getAttrValues : function()
   {
      var values = [];
      var colorChecked = this.colorBoxRef.getValue();
      if(Ext.Object.isEmpty(colorChecked)){
         colorChecked.color = [];
      }
      if(Ext.isString(colorChecked.color)){
         colorChecked.color = [colorChecked.color];
      }
      var colorValue = {};
      if(colorChecked.color.length > 0){
         if(this.$_color_id_$){
            colorValue = {
               id : this.$_color_id_$,
               name : '颜色',
               optValue : colorChecked.color.join(','),
               group : '商品规格',
               attrType : 2
            };
         }else{
            colorValue = {
               name : '颜色',
               optValue : colorChecked.color.join(','),
               group : '商品规格',
               attrType : 2
            }
         }
      }
      if(this.customColorRef.store.getCount() > 0){
         var customColors = [];
         this.customColorRef.store.each(function(item){
            customColors.push(item.get('color')+'|0');
         }, this);
         customColors = customColors.join(',');
         if(this.$_color_id_$){
            if(!Ext.isDefined(colorValue.name)){
               colorValue = {
                  id : this.$_color_id_$,
                  name : '颜色',
                  optValue : customColors,
                  group : '商品规格',
                  attrType : 2
               };
            }else{
               colorValue.optValue = colorValue.optValue+','+customColors;
            }
         }else{
            if(!Ext.isDefined(colorValue.name)){
               colorValue = {
                  name : '颜色',
                  optValue : customColors,
                  group : '商品规格',
                  attrType : 2
               };
            }else{
                colorValue.optValue = colorValue.optValue+','+customColors;
            }
         }
      }
      if(Ext.isDefined(colorValue.name)){
         values.push(colorValue);
      }
      this.gridRef.store.each(function(record){
         var value = record.getData();
         if(record.phantom){
            delete value.id;
         }
         values.push(value);
      });
      return values;
   },

   setAttrValues : function(values)
   {
      //寻找颜色
      var color = Ext.Array.findBy(values, function(item){
         if(item.name == '颜色'){
            return true;
         }
         return false;
      }, this);
      if(color){
         Ext.Array.remove(values, color);
         this.$_color_id_$ = color.id;
         var colors = color.optValue.split(',');
         var quickColors = [];
         var customColors = [];
         Ext.Array.forEach(colors, function(item){
            var parts = item.split('|');
            if('0' == parts[1]){
               customColors.push({
                  color : parts[0]
               });
            }else{
               quickColors.push(item);
            }
         }, this);
         this.colorBoxRef.setValue({
            color: quickColors
         });
         this.customColorRef.store.loadData(customColors);
      }else{
         this.colorBoxRef.setValue({
            color: []
         });
      }
      this.gridRef.store.loadData(values);
   },

   getStdAttrWin : function()
   {
      if(null == this.stdAttrWinRef){
         this.stdAttrWinRef = new App.ZhuChao.CategoryMgr.Comp.StdAttrWindow({
            listeners : {
               saverequest : this.saveRequestHandler,
               scope : this
            }
         });
      }
      return this.stdAttrWinRef;
   },

   itemContextMenuHandler : function(grid, record, item, index, event)
   {
      var menu = this.getContextMenu();
      menu.record = record;
      var pos = event.getXY();
      event.stopEvent();
      menu.showAt(pos[0], pos[1]);
   },

   colorAttrItemContextMenuHandler : function(grid, record, item, index, event)
   {
      var menu = this.getColorAttrContextMenu(grid);
      menu.record = record;
      var pos = event.getXY();
      event.stopEvent();
      menu.showAt(pos[0], pos[1]);
   },

   addStdAttrHandler : function()
   {
      var win = this.getStdAttrWin();
      win.center();
      win.show();
   },

   modifyRequestHandler : function(grid, record)
   {
      var win = this.getStdAttrWin();
      win.loadInfo(record.getData());
      win.center();
      win.show();
   },

   getColorAttrItemWin : function()
   {
      if(null == this.colorAttrItemWinRef){
         this.colorAttrItemWinRef = new App.ZhuChao.CategoryMgr.Comp.ColorAttrItemWindow({
            listeners : {
               saverequest : this.saveColorAttrRequestHandler,
               scope : this
            }
         });
      }
      return this.colorAttrItemWinRef;
   },

   saveColorAttrRequestHandler : function(data, mode)
   {
      if(mode == CloudController.Const.NEW_MODE){
         //暂时没有判断是否存在
         this.customColorRef.store.add(data);
      }else if(mode == CloudController.Const.MODIFY_MODE){
         var record = this.customColorRef.store.findRecord('id', data.id);
         for(var key in data){
            record.set(key, data[key]);
         }
      }
   },

   saveRequestHandler : function(data, mode)
   {
      if(mode == CloudController.Const.NEW_MODE){
         //暂时没有判断是否存在
         this.gridRef.store.add(data);
      }else if(mode == CloudController.Const.MODIFY_MODE){
         var record = this.gridRef.store.findRecord('id', data.id);
         for(var key in data){
            record.set(key, data[key]);
         }
      }
   },

   getCustomColorConfig : function()
   {
      var L = this.LANG_TEXT.CUSTOM_COLOR;
      return {
         xtype : 'grid',
         title : L.TITLE,
         margin : '0 0 10 0',
         height : 300,
         emptyText : L.EMPTY_TEXT,
         columns : [
            {text : L.COLS.NAME,  dataIndex : 'color', flex : 1, resizable : false, sortable : false, menuDisabled : true}
         ],
         tbar : [{
            xtype : 'button',
            text : L.BTN.ADD,
            listeners : {
               click : function(){
                  var win = this.getColorAttrItemWin();
                  win.center();
                  win.show();
               },
               scope: this
            }
         }],
         store : new Ext.data.Store({
            fields : [
               {name : 'color', type : 'string', persist : false}
            ]
         }),
         listeners : {
            itemcontextmenu : this.colorAttrItemContextMenuHandler,
            afterrender : function(comp)
            {
               this.customColorRef = comp;
            },
            scope : this
         }
      };
   },

   getGridConfig : function()
   {
      var COLS = this.LANG_TEXT.COLS;
      return {
         xtype : 'grid',
         height : 300,
         tbar : [{
            xtype : 'button',
            text : this.LANG_TEXT.BTN.ADD,
            listeners : {
               click : this.addStdAttrHandler,
               scope: this
            }
         }],
         emptyText : this.LANG_TEXT.EMPTY_ATTR_TEXT,
         columns : [
            {text : COLS.NAME,  dataIndex : 'name', width : 200, resizable : false, sortable : false, menuDisabled : true},
            {text : COLS.OPT_VALUE,  dataIndex : 'optValue', flex : 1, resizable : false, sortable : false, menuDisabled : true},
            {text : COLS.REQUIRED,  dataIndex : 'required', width : 100, resizable : false, sortable : false, menuDisabled : true, renderer : Cntysoft.Utils.ColRenderer.boolRenderer}
         ],
         store : new Ext.data.Store({
            fields : [
               {name : 'id', type : 'integer', persist : false},
               {name : 'name', type : 'string', persist : false},
               {name : 'optValue', type : 'string', persist : false},
               {name : 'required', type : 'boolean', persist : false}
            ]
         }),
         listeners : {
            afterrender : function(comp)
            {
               this.gridRef = comp;
            },
            itemdblclick : this.modifyRequestHandler,
            itemcontextmenu : this.itemContextMenuHandler,
            scope : this
         }
      }
   },

   getColorConfig : function()
   {
      var  COLOR_NAMES = this.LANG_TEXT.COLOR_NAMES;
      var items = [];
      var item;
      for(var i = 0; i < COLOR_NAMES.length; i++){
         item = COLOR_NAMES[i];
         items.push({
            boxLabel : '<span style ="margin-right:2px;display: inline-block;width : 17px; height : 17px;vertical-align:top;border:1px solid #EDEDED;background: '+item[1]+';"></span>'+'<span style="vertical-align:top;height : 17px;margin-top:-5px">'+item[0]+'</span>',
            name: 'color',
            inputValue:item[0]+'|'+item[1]
         });
      }
      return {
         xtype: 'checkboxgroup',
         columns: 4,
         vertical: true,
         items: items,
         listeners : {
            afterrender : function(comp)
            {
               this.colorBoxRef = comp;
            },
            scope : this
         }
      };
   },
   destroy : function()
   {
      delete this.colorBoxRef;
      delete this.gridRef;
      if(this.stdAttrWinRef){
         this.stdAttrWinRef.destroy();
         delete this.stdAttrWinRef;
      }
      if(this.contextMenuRef){
         this.contextMenuRef.destroy();
         delete this.contextMenuRef;
      }
      if(this.colorAttrContextMenuRef){
         this.colorAttrContextMenuRef.destroy();
         delete this.colorAttrContextMenuRef;
      }
      delete this.customColorRef;
      this.callParent();
   }
});
/**
 * 凤凰筑巢商品分类管理标准属性窗口类
 */
Ext.define('App.ZhuChao.CategoryMgr.Comp.StdAttrWindow', {
   extend: 'WebOs.Component.Window',
   mixins : {
      fcm : 'Cntysoft.Mixin.ForbidContextMenu',
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.CategoryMgr',
   formRef : null,
   mode : 1,
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('COMP.STD_ATTR_WINDOW');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config,{
         layout : 'fit',
         resizable : false,
         width : 600,
         height : 240,
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
            this.fireEvent('saverequest', values, this.mode);
         }
         this.close();
      }
   },

   destroy : function()
   {
      delete this.formRef;
      this.callParent();
   }
});

Ext.define('App.ZhuChao.CategoryMgr.Comp.ColorAttrItemWindow', {
   extend: 'WebOs.Component.Window',
   mixins : {
      fcm : 'Cntysoft.Mixin.ForbidContextMenu',
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   runableLangKey : 'App.ZhuChao.CategoryMgr',
   formRef : null,
   mode : 1,
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('COMP.COLOR_ATTR_ITEM_WINDOW');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config,{
         layout : 'fit',
         resizable : false,
         width : 500,
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
            fieldLabel : L.COLOR_NAME,
            width : 400,
            allowBlank : false,
            name : 'color'
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
            this.fireEvent('saverequest', values, this.mode);
         }
         this.close();
      }
   },

   destroy : function()
   {
      delete this.formRef;
      this.callParent();
   }
});