/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Ui.Ui.Tag.Attribute', {
   extend : 'Ext.grid.Panel',
   alias : 'widget.siteuiuitagattribute',
   requires : [
      'Cntysoft.Utils.HtmlTpl',
      'Ext.grid.plugin.CellEditing',
      'Ext.tip.ToolTip',
      'Ext.layout.container.Anchor'
   ],
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   statics : {
      A_MAP : {
         DELETE : 1,
         ADD_NEW : 2,
         RESTORE : 3
      }
   },
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.Site.Ui',
   /*
    * @property {Ext.tip.ToolTipView} tooltipRef
    */
   tooltipRef : null,
   /*
    * @property {Ext.menu.Menu} containerContextMenuRef
    */
   containerContextMenuRef : null,
   /*
    * @property {Ext.menu.Menu} itemContextMenuRef
    */
   itemContextMenuRef : null,
   /*
    * @property {Ext.window.Window} attributeWinRef
    */
   attributeWinRef : null,
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('TAG.TAG_EDITOR.ATTRIBUTE');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         title : this.TITLE,
         emptyText : this.LANG_TEXT.EMPTY_TEXT
      });
   },
   initComponent : function()
   {
      Ext.apply(this, {
         columns : this.getColsConfig(),
         store : this.createDataStore(),
         selModel: {
            selType: 'cellmodel'
         },
         plugins : [
            Ext.create('Ext.grid.plugin.CellEditing', {
               clicksToEdit : 1
            })
         ]
      });
      this.addListener('afterrender', function(){
         var view = this.getView();
         this.tooltipRef = Ext.create('Ext.tip.ToolTip', {
            target : view.el,
            delegate : view.itemSelector,
            trackMouse : true,
            renderTo : Ext.getBody(),
            listeners : {
               beforeshow : function updateTipBody(tip){
                  this.tooltipRef.update(view.getRecord(tip.triggerElement).get('description'));
               },
               scope : this
            }
         });
      }, this, {
         single : true
      });
      this.addListener({
         containercontextmenu : this.containerContextMenuHanlder,
         itemcontextmenu : this.itemContextMenuHandler,
         scope : this
      });
      this.callParent();
   },
   createDataStore : function()
   {
      return new Ext.data.Store({
         autoLoad : true,
         fields : [
            {name : 'name', type : 'string', persist : false},
            {name : 'dataType', type : 'string', persist : false},
            {name : 'require', type : 'boolean', persist : false},
            {name : 'default', type : 'string', persist : false},
            {name : 'description', type : 'string', persist : false}
         ]
      });
   },
   /*
    * @return {Boolean}
    */
   isValid : function()
   {
      return true;
   },
   /*
    * 清空标签参数
    */
   reset : function()
   {
      this.store.removeAll();
   },
   setValues : function(values)
   {
      if(!this.rendered){
         this.addListener('afterrender', function(){
            this.setValues(values);
         }, this, {
            single : true
         });
         return;
      }
      var items = values.attributes;
      if(items){
         var item;
         var data = [];
         //处理一下值
         for(var key in items) {
            item = items[key];
            item.name = key;
            data.push(item);
         }
         this.store.loadData(data);
      }
   },
   getValues : function()
   {
      var ret = {};
      var field;
      var key;

      this.getStore().each(function(item){
         field = Ext.clone(item.data);
         key = field.name;
         delete field.name;
         switch(field.dataType){
            case 'integer':
               var defaultv = parseInt(field.defaultValue);
               field.defaultValue = isNaN(defaultv) ? 0 : defaultv;
               break;
            case 'boolean':
               field.defaultValue = !!field.defaultValue;
               break;
         }
         ret[key] = field;
      }, this);
      return ret;
   },
   createItemCmenu : function()
   {
      if(!this.itemContextMenuRef){
         this.itemContextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks : true,
            items : [{
               text : this.LANG_TEXT.MENU.DELETE,
               code : this.self.A_MAP.DELETE
            }],
            listeners : {
               click : this.menuItemClickHandler,
               scope : this
            }
         });
      }
      return this.itemContextMenuRef;
   },
   createContainerCmenu : function()
   {
      if(!this.containerContextMenuRef){
         this.containerContextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks : true,
            items : [{
               text : this.LANG_TEXT.MENU.ADD_NEW,
               code : this.self.A_MAP.ADD_NEW
            }, {
               text : this.LANG_TEXT.MENU.RESTORE,
               code : this.self.A_MAP.RESTORE
            }],
            listeners : {
               click : this.menuItemClickHandler,
               scope : this
            }
         });
      }
      return this.containerContextMenuRef;
   },
   /*
    * 显示属性添加窗口
    */
   getAttributeWindow : function()
   {
      if(!this.attributeWinRef){
         var L = this.LANG_TEXT.ATTR_WIN;
         this.attributeWinRef = new Ext.window.Window({
            title : L.TITLE,
            width : 600,
            height : 350,
            modal : true,
            autoScroll : true,
            resizable : false,
            closeAction : 'hide',
            layout : {
               type : 'anchor',
               reserveScrollbar : true
            },
            items : this.getAttributeFormConfig(),
            buttons : [{
               text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
               listeners : {
                  click : this.addAttributeToListHandler,
                  scope : this
               }
            }, {
               text : Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
               listeners : {
                  click : function()
                  {
                     this.attributeWinRef.close();
                  },
                  scope : this
               }
            }],
            reset : function()
            {
               this.down('form').getForm().reset();
            }
         });
      }
      return this.attributeWinRef;
   },

   requireRenderer : function(value)
   {
      if(value){
         return this.LANG_TEXT.YES;
      } else{
         return this.LANG_TEXT.NO;
      }
   },
   menuItemClickHandler : function(menu, item)
   {
      if(item){
         var AM = this.self.A_MAP;
         switch (item.code) {
            case AM.DELETE:
               this.deleteAttributeHandler(menu.record);
               break;
            case AM.ADD_NEW:
               this.addAttributeHandler(menu.record);
               break;
            case AM.RESTORE:
               this.restoreHandler();
               break;
         }
      }
   },
   addAttributeHandler : function(record)
   {
      var win = this.getAttributeWindow();
      win.reset();
      win.show();
   },
   addAttributeToListHandler : function()
   {
      var form = this.attributeWinRef.down('form').getForm();
      if(form.isValid()){
         var values = form.getValues();
         if(this.attrNameValidator(values.name)){
            values.require = values.require == 'on' ? true : false;
            this.store.add(values);
            this.attributeWinRef.close();
         }
      }
   },
   deleteAttributeHandler : function(record)
   {
      Cntysoft.showQuestionWindow(Ext.String.format(this.LANG_TEXT.DELETE_ATTR__ASK, record.get('name')), function(){
         this.store.remove(record);
      }, this);
   },
   restoreHandler : function()
   {
      this.setValues(this.mainPanel.orgValues);
   },
   itemContextMenuHandler : function(panel, record, item, index, e)
   {
      var menu = this.createItemCmenu();
      var pos = e.getXY();
      menu.record = record;
      menu.showAt(pos[0], pos[1]);
      e.stopEvent();
   },
   containerContextMenuHanlder : function(panel, e)
   {
      var menu = this.createContainerCmenu();
      var pos = e.getXY();
      menu.showAt(pos[0], pos[1]);
      e.stopEvent();
   },
   getAttributeFormConfig : function()
   {
      var COLS = this.LANG_TEXT.COLS;
      var W_L = this.LANG_TEXT.ATTR_WIN;
      var RED_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
      return {
         xtype : 'form',
         bodyPadding : 10,
         defaults : {
            width : 400
         },

         items : [{
            xtype : 'textfield',
            fieldLabel : COLS.NAME + RED_STAR,
            allowBlank : false,
            msgTarget : 'side',
            vtype : 'alphanum',
            name : 'name'
         }, new Ext.form.field.ComboBox({
            fieldLabel : COLS.TYPE + RED_STAR,
            emptyText : W_L.TYPE_EMPTY_TEXT,
            triggerAction : 'all',
            displayField : 'name',
            valueField : 'value',
            allowBlank : false,
            msgTarget : 'side',
            editable : false,
            store : new Ext.data.Store({
               fields : [
                  {name : 'name', type : 'string', persist : false},
                  {name : 'value', type : 'string', persist : false}
               ],
               data : [
                  {name : 'string', value : 'string'},
                  {name : 'integer', value : 'integer'},
                  {name : 'boolean', value : 'boolean'}
               ]
            }),
            name : 'dataType'
         }),{
            xtype : 'checkbox',
            fieldLabel : COLS.REQUIRED + RED_STAR,
            name : 'require',
            allowBlank : false,
            msgTarget : 'side'
         },{
            xtype : 'textfield',
            fieldLabel : COLS.DEFAULT + RED_STAR,
            name : 'default',
            allowBlank : false,
            msgTarget : 'side'
         },{
            xtype : 'textarea',
            fieldLabel : COLS.DESCRIPTION,
            height : 120,
            width : 400,
            name : 'description'
         }],
         listeners : {
            afterrender : function(obj){
               this.formRef = obj;
            },
            scope : this
         }
      };
   },
   attrNameValidator : function(value)
   {
      if('' == Ext.String.trim(value)){
         return this.LANG_TEXT.ATTR_NAME;
      }else{
         var store = this.getStore();
         var len = store.getCount();
         if(0 != len){
            for(var i = 0; i < len; i+=1){
               if(value == store.getAt(i).get('name')){
                  this.formRef.down('textfield[name="name"]').markInvalid(this.LANG_TEXT.ATTR_NAME_EXIT);
                  return false;
               }
            }
         }
         return true;
      }
   },
   getColsConfig : function()
   {
      var COLS = this.LANG_TEXT.COLS;
      return [
         {text : COLS.NAME, dataIndex : 'name', width : 150, resizable : false, sortable : false, menuDisabled : true, editor : {
            xtype : 'textfield',
            allowBlank : false
         }},
         {text : COLS.TYPE, dataIndex : 'dataType', width : 100, resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.typeRenderer, this),
            editor : new Ext.form.field.ComboBox({
               typeAhead : true,
               triggerAction : 'all',
               displayField : 'name',
               valueField : 'value',
               store : new Ext.data.Store({
                  fields : [
                     {name : 'name', type : 'string', persist : false},
                     {name : 'value', type : 'string', persist : false}
                  ],
                  data : [
                     {name : 'string', value : 'string'},
                     {name : 'integer', value : 'integer'},
                     {name : 'boolean', value : 'boolean'}
                  ]
               })
            })},
         {text : COLS.REQUIRED, dataIndex : 'require', width : 80, resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.requireRenderer, this),
            editor : new Ext.form.field.ComboBox({
               typeAhead : true,
               triggerAction : 'all',
               displayField : 'text',
               valueField : 'value',
               store : new Ext.data.Store({
                  fields : [
                     {name : 'text', type : 'string', persist : false},
                     {name : 'value', type : 'boolean', persist : false}
                  ],
                  data : [
                     {text : this.LANG_TEXT.YES, value : true},
                     {text : this.LANG_TEXT.NO, value : false}
                  ]
               })
            })},
         {text : COLS.DEFAULT, dataIndex : 'default', width : 130, resizable : false, sortable : false, menuDisabled : true,
            editor : {
               xtype : 'textfield',
               allowBlank : true
            }},
         {text : COLS.DESCRIPTION, dataIndex : 'description', flex : 1, resizable : false, sortable : false, menuDisabled : true, editor : {
            xtype : 'textfield',
            allowBlank : true,
            height : 80
         }}
      ];
   },
   typeRenderer : function(value)
   {
      switch (value) {
         case 'integer':
            return 'integer';
            break;
         case 'string':
            return 'string';
            break;
         default :
            return 'boolean';
            break;
      }
   },
   destroy : function()
   {
      delete this.mainPanelRef;
      if(this.tooltipRef){
         this.tooltipRef.destroy();
         delete this.tooltipRef;
      }
      if(this.containerContextMenuRef){
         this.containerContextMenuRef.destroy();
         delete this.containerContextMenuRef;
      }
      if(this.itemContextMenuRef){
         this.itemContextMenuRef.destroy();
         delete this.itemContextMenuRef;
      }
      if(this.attributeWinRef){
         this.attributeWinRef.destroy();
         delete this.attributeWinRef;
      }
      delete this.formRef;
      this.callParent();
   }
});