/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.Merchant.Ui.MerchantInfo', {
   extend: 'Ext.form.Panel',
   requires: [
      'WebOs.Kernel.StdPath',
      'App.ZhuChao.Merchant.Comp.CategoryTree',
      'WebOs.Component.Uploader.SimpleUploader'
   ],
   mixins: {
      langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
   },
   /**
    * @inheritdoc
    */
   panelType: 'MerchantInfo',
   /**
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.ZhuChao.Merchant',

   mode : 1,
   gridRef : null,
   fileRefs : null,
   logoSrc : null,
   categoryTreeRef : null,
   imageRef : null,
   categoryGridContextMenuRef : null,
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.MERCHANT_INFO');
      this.applyConstraintConfig(config);
      this.mode = config.mode;
      if(config.mode == CloudController.Const.MODIFY_MODE){
         if(!Ext.isDefined(config.targetLoadId) || !Ext.isNumber(config.targetLoadId)){
            Ext.Error.raise({
               cls : Ext.getClassName(this),
               method : 'constructor',
               msg : 'mode is modify, so you must set node id'
            });
         }
      }
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         border : true,
         title : this.LANG_TEXT.TITLE,
         bodyPadding:10,
         autoScroll : true
      });
   },

   initComponent : function()
   {
      Ext.apply(this, {
         buttons : [{
            text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
            listeners : {
               click : this.saveHandler,
               scope : this
            }
         },{
            text : Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
            listeners : {
               click : function(){
                  this.close();
               },
               scope : this
            }
         }],
         items : this.getFormItemConfig()
      });
      this.addListener('afterrender', this.afterRenderHandler, this);
      this.callParent();
   },

   afterRenderHandler : function()
   {
      if(this.mode == CloudController.Const.MODIFY_MODE){
         this.loadMerchantInfo(this.targetLoadId);
      }
   },


   loadMerchantInfo : function(id)
   {
      if(this.$_current_nid_$ !== id){
         this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
         this.appRef.getMerchantInfo(id,  this.afterLoadInfoHandler, this);
         this.$_current_nid_$ = id;
      }
   },

   afterLoadInfoHandler : function(response)
   {
      this.loadMask.hide();
      if(!response.status){
         Cntysoft.Kernel.Utils.processApiError(response);
      }else{
         var data = response.data;
         var form = this.getForm();
         var selectedTrademarks = data.selectedTrademarks;
         delete data.selectedTrademarks;
         this.gridRef.store.loadData(selectedTrademarks);
         form.setValues(response.data);
         this.logoSrc = data.shopLogo;
         this.imageRef.setSrc(FH.getZhuChaoImageUrl(data.shopLogo));
         this.fileRefs = data.fileRefs;
      }
   },

   saveHandler : function()
   {
      var form = this.getForm();
      if(!this.logoSrc){
         this.imageRef.setStyle('border', '1px solid red');
         return false;
      }

      if(form.isValid()){
         this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
         var values = form.getValues();
         values.floor = parseInt(values.floor);
         var trademarks = [];
         this.gridRef.store.each(function(item){
            trademarks.push(item.get('id'));
         });
         Ext.apply(values, {
            trademarks : trademarks,
            shopLogo : this.logoSrc,
            fileRefs : this.fileRefs
         });
         if(this.mode == CloudController.Const.MODIFY_MODE){
            values.id = this.$_current_nid_$;
            this.appRef.updateMerchantInfo(values, this.afterSaveHandler, this);
         }else if(this.mode == CloudController.Const.NEW_MODE){
            this.appRef.addMerchantInfo(values, this.afterSaveHandler, this);
         }
      }
   },

   afterSaveHandler : function(response)
   {
      this.loadMask.hide();
      if(!response.status){
         Cntysoft.Kernel.Utils.processApiError(response);
      }else{
         this.mainPanelRef.gotoPrev();
         var panel = this.mainPanelRef.getCurrentActivePanel();
         if(panel.panelType == 'ListView'){
            panel.reload();
         }
         this.close();
      }
   },

   itemContextMenuHandler : function(grid, record, htmlItem, index, event)
   {
      var menu = this.getContextMenu();
      menu.record = record;
      var pos = event.getXY();
      event.stopEvent();
      menu.showAt(pos[0], pos[1]);
   },

   getContextMenu : function(record)
   {
      var L = this.LANG_TEXT.MENU;
      if(null == this.categoryGridContextMenuRef){
         this.categoryGridContextMenuRef = new Ext.menu.Menu({
            ignoreParentClicks : true,
            items : [{
               text : L.DELETE,
               listeners : {
                  click : function(item)
                  {
                     var record = item.parentMenu.record;
                     this.categoryTreeRef.expandPath(record.get('path'),{
                        callback : function(){
                           var node = this.categoryTreeRef.getStore().findRecord('id', record.get('id'));
                           node.set('checked', false);
                           this.gridRef.store.remove(record);
                        },
                        scope : this
                     });
                  },
                  scope : this
               }
            }]
         });
      }
      return this.categoryGridContextMenuRef;
   },

   getFormItemConfig : function()
   {
      var merchantId = -1;
      if(this.mode == CloudController.Const.MODE_MODIFY_MODE){
         merchantId = this.targetLoadId;
      }
      var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
      var F = this.LANG_TEXT.FIELDS;
      var MSG = this.LANG_TEXT.MSG;
      var L = this.LANG_TEXT;
      var FLOOR = L.FLOOR;
      var fdata = [];
      for(var k in FLOOR){
         fdata.push({
            name : FLOOR[k],
            value : k
         });
      }
      fdata.unshift(fdata.pop());
      var rdata = [];
      for(var i in L.REGION){
         rdata.push({
            name : L.REGION[i],
            value : i
         });
      }

      return [{
         xtype : 'textfield',
         fieldLabel : F.NAME + R_STAR,
         width : 500,
         allowBlank : false,
         name : 'name'
      }, {
         xtype : 'fieldcontainer',
         fieldLabel : F.KEY + R_STAR,
         layout : 'hbox',
         items : [{
            xtype : 'textfield',
            width : 300,
            name : 'abbr',
            margin : '0 10 0 0',
            allowBlank : false,
            disabled : 2 == this.mode ? true : false
         }, {
            xtype : 'button',
            text : F.ONLY,
            margin : '0 10 0 0',
            hidden : 2 == this.mode ? true : false,
            listeners : {
               click : function(btn){
                  var abbr = btn.previousSibling();
                  var val = abbr.getValue();
                  if(val){
                     this.appRef.ensureKeyExit(val, function(response){
                        if(!response.status){
                           Cntysoft.showErrorWindow(response.msg);
                        } else{
                           if(response.data[0]){
                              abbr.setActiveError(MSG.EXIST);
                              btn.nextSibling().setValue(MSG.EXIST);
                           }else{
                              btn.nextSibling().setValue(MSG.NOT_EXIST);
                           }
                        }
                     }, this);
                  }
               },
               scope : this
            }
         }, {
            xtype : 'displayfield',
            value : ''
         }]
      }, {
         xtype : 'fieldcontainer',
         fieldLabel : F.LOGO + R_STAR,
         layout: {
            type : 'hbox',
            align:'bottom'
         },
         items : [{
            xtype : 'image',
            width : 260,
            height : 145,
            style : 'border:1px solid #EDEDED',
            listeners : {
               afterrender : function(comp){
                  this.imageRef = comp;
               },
               scope : this
            }
         },{
            xtype : 'webossimpleuploader',
            uploadPath : this.mainPanelRef.appRef.getUploadFilesPath(),
            createSubDir : false,
            fileTypeExts : ['gif','png','jpg','jpeg'],
            margin : '0 0 0 5',
            maskTarget : this,
            enableFileRef : true,
            buttonText :  F.UPLOAD,
            listeners : {
               fileuploadsuccess : this.uploadSuccessHandler,
               scope : this
            }
         }]
      },{
         xtype: 'radiogroup',
         fieldLabel: F.CITY+ R_STAR,
         columns: 2,
         width : 300,
         items: [
            { boxLabel: L.CITY.NORTH, name: "city", inputValue: 1},
            { boxLabel: L.CITY.SOUTH, name: "city", inputValue: 2}
         ]
      },{
         xtype: 'numberfield',
         fieldLabel: F.SORT+R_STAR,
         minValue:0,
         allowBlank : false,
         step:10,
         value:0,
         name:'sortNum'
      },{
         xtype : "combo",
         width : 250,
         allowBlank : false,
         fieldLabel: F.FLOOR+ R_STAR,
         store: Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data : fdata
         }),
         editable : false,
         emptyText : L.FLOOR_EMPTY_TEXT,
         queryMode: 'local',
         displayField: 'name',
         valueField: 'value',
         name : 'floor'
      },{
         xtype : "combo",
         width : 250,
         allowBlank : false,
         fieldLabel: F.REGION+ R_STAR,
         store: Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data : rdata
         }),
         editable : false,
         emptyText : L.REGION_EMPTY_TEXT,
         queryMode: 'local',
         displayField: 'name',
         valueField: 'value',
         name : 'region'
      }, {
         xtype : 'textfield',
         fieldLabel: F.SERIAL+ R_STAR,
         allowBlank : false,
         name : 'serial'
      },{
         xtype : 'textfield',
         fieldLabel: F.PHONE+ R_STAR,
         allowBlank : false,
         name : 'phone'
      },{
         xtype : 'textfield',
         fieldLabel: F.MANAGER+ R_STAR,
         allowBlank : false,
         name : 'manager'
      },{
         xtype : 'textfield',
         fieldLabel: F.LEGAL_PERSON,
         name : 'legalPerson'
      },{
         xtype : 'textfield',
         fieldLabel: F.AUTHORIZER,
         name : 'authorizer'
      },{
         xtype : 'fieldcontainer',
         fieldLabel : F.CATEGORY,
         width : 900,
         height : 300,
         layout : 'hbox',
         items : [
            {
            xtype : 'zhuchaomerchantcompcategorytree',
            width : 400,
            height : 300,
            merchantId : merchantId,
            listeners : {
               afterrender : function(comp)
               {
                  this.categoryTreeRef = comp;
               },
               checkchange : function(node, checked)
               {
                  if(checked){
                     this.gridRef.store.add({
                        id : node.get('id'),
                        name : node.get('text')
                     });
                  }else{
                     var record = this.gridRef.store.findRecord('id', node.get('id'));
                     if(record){
                        this.gridRef.store.remove(record);
                     }
                  }
               },
               scope : this
            }
         },
            {
            xtype : 'grid',
            margin : '0 0 0 5',
            width : 400,
            height : 300,
            columns : [
               {text : F.SELECTED_TRADEMARK, dataIndex : 'name', flex:1, resizable : false, sortable : false, menuDisabled : true}
            ],
            listeners : {
               afterrender : function(comp)
               {
                  this.gridRef = comp;
               },
               itemcontextmenu : this.itemContextMenuHandler,
               scope : this
            },
            store : new Ext.data.Store({
               fields : [
                  {name : 'id', type : 'integer', persist : false},
                  {name : 'name', type : 'string', persist : false},
                  {name : 'path', type : 'string', persist : false}
               ]
            })
         }]
      }];
   },

   uploadSuccessHandler : function(file, uploadBtn)
   {
      var file = file.pop();
      this.fileRefs = parseInt(file.rid);
      this.logoSrc = file.filename;
      this.imageRef.setSrc(FH.getZhuChaoImageUrl(file.filename));
      this.imageRef.setStyle('border', '1px solid #EDEDED');
   },

   destroy : function()
   {
      delete this.mainPanelRef;
      delete this.$_current_nid_$;
      delete this.targetLoadId;
      delete this.appRef;
      delete this.gridRef;
      delete this.categoryTreeRef;
      delete this.categoryGridContextMenuRef;
      this.callParent();
   }
});