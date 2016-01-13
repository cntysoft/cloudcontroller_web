/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 内容模型信息修改编辑器, 分为常规信息和额外配置
 */
Ext.define('App.Site.CmMgr.Ui.MetaInfo', {
   extend: 'Ext.tab.Panel',
   requires: [
      'Cntysoft.Utils.HtmlTpl',
      'Cntysoft.Component.TplSelect.Win',
      'WebOs.Component.Uploader.SimpleUploader',
      'CloudController.Utils'
   ],
   mixins: {
      langTextProvider: 'WebOs.Mixin.RunableLangTextProvider',
      formTooltip: 'Cntysoft.Mixin.FormTooltip'
   },
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey: 'App.Site.CmMgr',
   /*
    * 编辑器模型模式为全新添加模式
    *
    * @property {Number} mode
    */
   mode: CloudController.Kernel.Const.NEW_MODE,
   /*
    * @inheritdoc
    */
   panelType: 'MetaInfo',
   /*
    * @property {Ext.form.Panel} basicFormRef
    */
   basicFormRef: null,
   /*
    * @property {Ext.grid.Panel} extraPanelRef
    */
   extraPanelRef: null,
   /*
    * 额外信息添加窗口
    *
    * @property {Ext.window.Window} extraConfigEditorWinRef
    */
   extraConfigEditorWinRef: null,
   //private
   tplSelectWinRef: null,
   /*
    * 当前加载的模型ID
    *
    * @property {Number} currentLoadedId
    */
   currentLoadedId: null,
   /*
    * 初始化的时候加载的模型id
    *
    * @property {Number} initLoadId
    */
   initLoadId: null,
   /*
    * 修改模式存储的原始数据
    *
    * @property {Object} orgData
    */
   orgData: null,
   /*
    * 模型识别KEY字段引用
    *
    * @private
    * @property {Ext.form.field.Text} modelKeyFieldRef
    */
   modelKeyFieldRef: null,
   /*
    * @private
    * @property {Cntysoft.Component.Uploadify.SimpleUploader} uploaderRef
    */
   uploaderRef: null,
   /*
    * @private
    * @property {Ext.menu.Menu} extraCfgContextMenuRef
    */
   extraCfgContextMenuRef: null,
   constructor: function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.META_INFO');
      this.mixins.formTooltip.constructor.call(this);
      this.applyConstraintConfig(config);

      this.callParent([config]);
   },
   applyConstraintConfig: function(config)
   {
      Ext.apply(config, {
         border: false,
         title: this.LANG_TEXT.TITLE
      });
   },
   initComponent: function()
   {
      Ext.apply(this, {
         items: [
            this.getBasicInfoPanelConfig()
                    //this.getExtraCgfPanelConfig()
         ],
         buttons: [{
               text: Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
               listeners: {
                  click: this.saveHandler,
                  scope: this
               }
            }, {
               text: Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
               listeners: {
                  click: function()
                  {
                     this.mainPanelRef.renderPanel('ModelList');
                  },
                  scope: this
               }
            }]
      });
      if (null !== this.initLoadId) {
         this.addListener('afterrender', function() {
            this.loadModel(this.initLoadId);
         }, this, {
            single: true
         });
      }
      this.callParent();
   },
   /*
    * 根据模型ID加载指定的内容模型数据
    *
    * @param {Number} id
    */
   loadModel: function(id)
   {
      var C = CloudController.Const;
      if (id !== this.currentLoadedId) {
         if (this.mode !== C.MODIFY_MODE) {
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
            this.appRef.getModelInfo(id, function(response) {
               this.loadMask.hide();
               if (!response.status) {
                  Cntysoft.processApiError(response);
               } else {
                  this.currentLoadedId = id;
                  var data = response.data;
                  this.orgData = data;
                  data.enabled = data.enabled === true ? 1 : 0;
                  if (!data.icon) {
                     var appRef = this.appRef;
                     data.icon = WebOs.Kernel.StdPath.getAppImagePath(appRef.module, appRef.name) + '/' + data.key + '.png';
                  }
                  this.basicFormRef.getForm().setValues(data);
                  //额外参数
                  //var extra = data.extraConfig;
                  //if(extra){
                  //   var store = this.extraPanelRef.down('grid').store;
                  //   for(var key in extra) {
                  //      store.add({
                  //         key : key,
                  //         value : extra[key]
                  //      });
                  //   }
                  //}
                  this.gotoModifyMode();
               }
            }, this);
         }
      }
   },
   /*
    * 进入修改模式
    */
   gotoModifyMode: function()
   {
      var C = CloudController.Const;
      if (this.mode !== C.MODIFY_MODE) {
         this.down('textfield[name="key"]').setDisabled(true);
         this.mode = C.MODIFY_MODE;
      }
   },
   /*
    * 进入全新模式
    */
   gotoNewMode: function()
   {
      var C = CloudController.Const;
      if (this.mode !== C.NEW_MODE) {
         var basicForm = this.basicFormRef.getForm();
         basicForm.reset();
         //this.extraPanelRef.down('grid').store.removeAll();
         this.down('textfield[name="key"]').setDisabled(false);
         this.mode = C.NEW_MODE;
      }
   },
   /*
    * @return {App.Cms.CategoryManager.Comp.TplSelectWindow}
    */
   getTplSelectWindow: function(textfield)
   {
      this.tfObj = textfield;
      var basePath = CloudController.Utils.getTplPath();
      var len = basePath.length;
      if (null == this.tplSelectWinRef) {
         this.tplSelectWinRef = new Cntysoft.Component.TplSelect.Win({
            startPaths: basePath,
            listeners: {
               tplfileselected: function(file)
               {
                  this.tfObj.setValue(file.substr(len + 1));
               },
               scope: this
            }
         });
      }
      return this.tplSelectWinRef;
   },
   saveHandler: function()
   {
      var basicForm = this.basicFormRef.getForm();
      var values;
      if (basicForm.isValid()) {
         values = basicForm.getValues();
         //values.extraConfig = this.getExtraConfigValues();
         this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
         var method;
         if (this.mode == CloudController.Const.NEW_MODE) {
            method = 'addModelMeta';
         } else {
            method = 'updateModelMeta';
            values.key = this.orgData.key;
         }
         this.appRef[method](values, function(response) {
            this.loadMask.hide();
            if (!response.status) {
               Cntysoft.processApiError(response, this.GET_LANG_TEXT('ERROR_MAP'));
            } else {
               Cntysoft.showInfoMsgWindow(Cntysoft.GET_LANG_TEXT('MSG.SAVE_OK'), function() {
                  this.mainPanelRef.renderPanel('ModelList');
                  //this.mainPanelRef.down('contentmodelmgrmodeltreepanel').store.reload();
               }, this);
            }
         }, this);
      }
   },
   tplSelectHandler: function(textfield)
   {
      var win = this.getTplSelectWindow(textfield);
      win.center();
      win.show();
   },
   getBasicInfoPanelConfig: function()
   {
      var L = this.LANG_TEXT.BASIC_PANEL;
      return {
         xtype: 'form',
         bodyPadding: 10,
         title: L.TITLE,
         autoScroll: true,
         defaults: {
            xtype: 'textfield',
            width: 350,
            labelWidth: 150,
            listeners: {
               afterrender: function(formItem)
               {
                  this.mixins.formTooltip.setupTooltipTarget.call(this, formItem);
               },
               scope: this
            }
         },
         listeners: {
            afterrender: function(panel)
            {
               this.basicFormRef = panel;
            },
            scope: this
         },
         items: this.getFieldsConfig()
      };
   },
   /*
    * 获取表单项配置对象
    *
    * @return Object[]
    */
   getFieldsConfig: function()
   {
      var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
      var F = this.LANG_TEXT.BASIC_PANEL.FIELDS;
      var T_TEXT = this.LANG_TEXT.BASIC_PANEL.T_TEXT;
      return [{
            fieldLabel: F.MODEL_NAME + R_STAR,
            name: 'name',
            allowBlank: false
         }, {
            fieldLabel: F.MODEL_KEY + R_STAR,
            name: 'key',
            toolTipText: T_TEXT.MODEL_KEY,
            //validator : Ext.bind(this.modelKeyValidator, this),
            //validateOnBlur : true,
            //validateOnChange : false,
            //validateBlank : true,
            vtype: 'alphanum',
            listeners: {
               afterrender: function(formItem)
               {
                  this.modelKeyFieldRef = formItem;
                  this.mixins.formTooltip.setupTooltipTarget.call(this, formItem);
               },
               change: function(self, newValue)
               {
                  var value = Ext.String.trim(newValue);
                  if (value.length > 0) {
                     if (this.uploaderRef) {
                        this.uploaderRef.setDisabled(false);
                        this.uploaderRef.setTargetName(value + '.png');
                     }
                  } else {
                     if (this.uploaderRef) {
                        this.uploaderRef.setDisabled(true);
                     }
                  }
               },
               scope: this
            }
         }, {
            fieldLabel: F.ITEM_NAME + R_STAR,
            width: 250,
            name: 'itemName',
            toolTipText: T_TEXT.ITEM_NAME,
            allowBlank: false
         }, {
            fieldLabel: F.ITEM_UNIT + R_STAR,
            width: 250,
            name: 'itemUnit',
            toolTipText: T_TEXT.ITEM_UNIT,
            allowBlank: false
         }, {
            xtype: 'textarea',
            fieldLabel: F.DESCRIPTION,
            width: 555,
            height: 80,
            name: 'description'
         }, {
            xtype: 'fieldcontainer',
            width: 700,
            fieldLabel: F.DEFAULT_TPL + R_STAR,
            toolTipText: T_TEXT.DEFAULT_TPL,
            layout: {
               type: 'hbox'
            },
            items: [{
                  xtype: 'textfield',
                  width: 400,
                  name: 'defaultTemplateFile',
                  allowBlank: false
               }, {
                  xtype: 'button',
                  text: F.SELECT_TPL,
                  margin: '0 0 0 5',
                  listeners: {
                     click: function(btn)
                     {
                        this.tplSelectHandler(btn.previousSibling());
                     },
                     scope: this
                  }
               }]
         }, {
            xtype: 'fieldcontainer',
            width: 680,
            fieldLabel: F.DEFAULT_ICON + R_STAR,
            toolTipText: T_TEXT.DEFAULT_ICON,
            layout: {
               type: 'hbox'
            },
            items: [{
                  xtype: 'textfield',
                  width: 400,
                  name: 'icon',
                  allowBlank: false,
                  disabled: true
               }
//            {
//                xtype : 'webossimpleuploader',
//                uploadPath : 'sadasdfasdas',//this.mainPanel.getIconBasePath(),
//                createSubDir : false,
//                randomize : false,
//                overwrite : true,
//                fileTypeExts : ['png'],
//                margin : '0 0 0 5',
//                width : 110,
//                maskTarget : this,
//                disabled : true,
//                buttonText : F.UPLOAD_ICON
//                //listeners : {
//                //   fileuploadsuccess : this.uploadSuccessHandler,
//                //   afterrender : function(comp)
//                //   {
//                //      this.uploaderRef = comp;
//                //   },
//                //   scope : this
//                //}
//            }
            ]
         },
         {
            xtype: 'textfield',
            fieldLabel: F.EDITOR + R_STAR,
            name: 'editor',
            toolTipText: T_TEXT.EDITOR,
            value: 'StdEditor',
            allowBlank: false
         }, {
            xtype: 'textfield',
            fieldLabel: F.DATA_DAVER + R_STAR,
            name: 'dataSaver',
            toolTipText: T_TEXT.DATA_DAVER,
            value: 'StdSaver',
            allowBlank: false
         }, {
            xtype: 'radiogroup',
            fieldLabel: F.ENABLED,
            columns: 2,
            width: 250,
            vertical: true,
            items: [
               {boxLabel: Cntysoft.GET_LANG_TEXT('UI.BTN.YES'), name: 'enabled', inputValue: 1, checked: true},
               {boxLabel: Cntysoft.GET_LANG_TEXT('UI.BTN.NO'), name: 'enabled', inputValue: 0}
            ]
         }];
   },
   destroy: function()
   {
      this.mixins.langTextProvider.destroy.call(this);
      this.mixins.formTooltip.destroy.call(this);
      delete this.appRef;
      delete this.mainPanelRef;
      delete this.basicFormRef;
      delete this.tplSelectWinRef;
      delete this.extraPanelRef;
      delete this.uploaderRef;
      delete this.tfObj;
      delete this.modelKeyFieldRef;
      if (this.extraCfgContextMenuRef) {
         this.extraCfgContextMenuRef.destroy();
         delete this.extraCfgContextMenuRef;
      }
      if (this.extraConfigEditorWinRef) {
         this.extraConfigEditorWinRef.destroy();
         delete this.extraConfigEditorWinRef;
      }
      if (this.loadMask) {
         this.loadMask.destroy();
         delete this.loadMask;
      }
      this.el.destroy();
      this.callParent();
   }
});