/*
 * Cntysoft Cloud Software Team
 *
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.UserCenter.Ui.DesignScheme.Info',{
   extend: 'Ext.form.Panel',
   requires : [
      'App.ZhuChao.UserCenter.Ui.DesignScheme.ImageGroup'
   ],
   mixins: {
      langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
   },
   /*
    * @inheritdoc
    */
   panelType: 'Info',
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    */
   runableLangKey : 'App.ZhuChao.UserCenter',

   mode : 1,
   fileRefs : null,
   targetLoadId : -1,
   userType : 4,
   uid : null,
   
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.DESIGN_SCHEME.INFO');
      this.fileRefs = [];
      this.applyConstraintConfig(config);
      if(config.mode == CloudController.Const.MODIFY_MODE){
         if(!Ext.isDefined(config.targetLoadId) || !Ext.isNumber(config.targetLoadId)){
            Ext.Error.raise({
               cls : Ext.getClassName(this),
               method : 'constructor',
               msg : 'mode is modify, so you must set node id'
            });
         }
         this.targetLoadId = config.targetLoadId;
      }
      
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         border : false,
         title : this.LANG_TEXT.TITLE,
         autoScroll : true,
         bodyPadding : 10
      });
   },

   initComponent : function()
   {
      Ext.apply(this,{
         items : this.getPanelItemsConfig(),
         defaults : {
            labelWidth : 200
         },
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
            afterrender : this.stateHandler,
            scope : this
         }
      });
      this.callParent();
   },

   /*
    * 渲染后首次刷新数据
    */
   stateHandler : function(form)
   {
      this.formRef = form;
      if(this.mode == CloudController.Const.NEW_MODE){
//         var defaultValues = this.getDefaultValues();
//         this.setValues(defaultValues);
         return;
      }
      this.setLoading(this.LANG_TEXT.MSG.LOAD_USER);
      //如果不是添加新的节点 那么我们需要加载数据
      this.mainPanelRef.appRef.loadDesignScheme({id : this.targetLoadId}, this.loadHandler, this);
   },
   
   loadHandler : function(response)
   {
      this.loadMask.hide();
      if(!response.status){
         Cntysoft.Kernel.Utils.processApiError(response);
      }else{
         this.responseData = response.data;
         this.originalFileRefs = response.data['originalFileRefs'];
         this.originalSrc = response.data['originalSrc'];
         if(this.originalSrc){
            this.originalRef.setSrc(FH.getZhuChaoImageUrl(this.originalSrc));
         }
         
         this.planarFileRefs = response.data['planarFileRefs'];
         this.planarSrc = response.data['planarSrc'];
         if(this.planarSrc){
            this.planarRef.setSrc(FH.getZhuChaoImageUrl(this.planarSrc));
         }
         this.fileRefs = response.data['fileRefs'];
         this.imageGroupRef.setFieldValue(response.data['images']);
         this.getForm().setValues(response.data);
      }
   },
   
   getPanelItemsConfig : function()
   {
      var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
      var F = this.LANG_TEXT.FIELDS;
      return [{
         xtype : 'textfield',
         name : 'name',
         fieldLabel : F.NAME + R_STAR,
         width : 700,
         allowBlank : false
      }, {
         xtype : 'fieldcontainer',
         fieldLabel : F.USER,
         layout : 'hbox',
         items : [{
            xtype : 'combo',
            name : 'userType',
            editable : false,
            queryMode: 'local',
            displayField: 'text',
            valueField: 'code',
            margin : '0 10 0 0',
            emptyText : F.EMPTY_TEXT,
            store : Ext.create('Ext.data.Store',{
               fields : ['code', 'text'],
               data : [
                  {"code" : 1, 'text' : F.USER_NORMAL},
                  {"code" : 2, 'text' : F.USER_FOREMAN},
                  {"code" : 3, 'text' : F.USER_DECORATOR},
                  {"code" : 4, 'text' : F.USER_DESIGNER}
               ]
            }),
            listeners : {
               afterrender : function(combo){
                  this.userRef = combo;
                  if(this.responseData){
                     this.uidRef.setValue(this.responseData['userType']);
                  }
               },
               change : function(combo, newValue){
                  this.userType = newValue;
                  if(3 == parseInt(newValue)){
                     this.midRef.show();
                     this.midRef.submitValue = true;
                  }else{
                     this.midRef.hide();
                     this.midRef.submitValue = false;
                  }
                  this.mainPanelRef.appRef.getUserListDSByType({type : newValue}, function(response){
                     this.uidRef.getStore().loadData(response.data['items']);
                     
                     if(this.responseData && newValue == this.responseData['userType']){
                        this.uidRef.setValue(this.responseData['uid']);
                     }else{
                        this.uidRef.setValue('');
                     }
                  }, this);
               },
               scope : this
            }
         }, {
            xtype : 'combo',
            name : 'uid',
            displayField: 'name',
            editable : false,
            margin : '0 10 0 0',
            queryMode: 'local',
            valueField: 'id',
            emptyText : F.EMPTY_TEXT,
            store : Ext.create('Ext.data.Store',{
               pageSize : 0,
               fields : ['id', 'name']
            }),
            listeners : {
               afterrender : function(combo){
                  this.uidRef = combo;
               },
               change : function(combo, newValue){
                  this.uid = newValue;
                  if(3 == parseInt(this.userType)){
                     this.mainPanelRef.appRef.getMemberListDSType({uid : newValue}, function(response){
                        this.midRef.getStore().loadData(response.data['items']);
                        
                        if(this.responseData && newValue == this.responseData['uid']){
                           this.midRef.setValue(this.responseData['mid']);
                        }else{
                           this.midRef.setValue('');
                        }
                     }, this);
                  }
               },
               scope : this
            }
         },  {
            xtype : 'combo',
            name : 'mid',
            displayField: 'name',
            editable : false,
            hidden : true,
            submitValue : false,
            valueField: 'id',
            queryMode: 'local',
            emptyText : F.EMPTY_TEXT,
            store : Ext.create('Ext.data.Store',{
               pageSize : 0,
               fields : ['id', 'name']
            }),
            listeners : {
               afterrender : function(combo){
                  this.midRef = combo;
               },
               scope : this
            }
         }]
      }, {
         xtype : 'textfield',
         fieldLabel : F.INTRO,
         width : 700,
         name : 'intro'
      }, {
         xtype : 'datefield',
         fieldLabel : F.INPUT_TIME,
         format : 'Y-m-d',
         altFormats : 'Y/m/d',
         width : 600,
         name : 'inputTime'
      }, 
      this.getQueryFieldsConfig(),
      {
         xtype : 'hiddenfield',
         name : 'id'
      }, {
         xtype : 'fieldcontainer',
         fieldLabel : F.ORIGINAL_PIC,
         layout: {
            type : 'hbox',
            align:'bottom'
         },
         items : [{
            xtype : 'image',
            width : 200,
            height : 100,
            style : 'border:1px solid #EDEDED',
            listeners : {
               afterrender : function(comp){
                  this.originalRef = comp;
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
               fileuploadsuccess : this.originalUploadSuccessHandler,
               scope : this
            }
         }]
      }, {
         xtype : 'fieldcontainer',
         fieldLabel : F.PLANAR_PIC,
         layout: {
            type : 'hbox',
            align:'bottom'
         },
         items : [{
            xtype : 'image',
            width : 200,
            height : 100,
            style : 'border:1px solid #EDEDED',
            listeners : {
               afterrender : function(comp){
                  this.planarRef = comp;
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
               fileuploadsuccess : this.planarUploadSuccessHandler,
               scope : this
            }
         }]
      }, {
         xtype : 'usercenteruidesignschemeimagegroup',
         fieldLabel : F.EFFECT_IMAGE,
         editorRef : this,
         listeners : {
            afterrender : function(image){
               this.imageGroupRef = image;
            },
            scope : this
         }
      }];
   },
   
   getQueryFieldsConfig : function()
   {
      this.mainPanelRef.appRef.getQueryFields(function(response){
         if(!response.status){
            Cntysoft.Kernel.Utils.processApiError(response);
         }else{
            var cfgs = response.data, items = [], len = cfgs.length;
            for(var i = 0; i < len; i++){
               var fields = cfgs[i].uiOption.items, length = fields.length, data = [];
               for(var j = 0; j < length; j++){
                  var arr = fields[j].split('|'), one = {};
                  one['code'] = arr[1]; 
                  one['text'] = arr[0]; 
                  data.push(one);
               }
               var item = {
                  xtype : 'combo',
                  editable : false,
                  name : cfgs[i].name,
                  fieldLabel : cfgs[i].alias,
                  queryMode: 'local',
                  displayField: 'text',
                  valueField: 'code',
                  value : 1,
                  store : Ext.create('Ext.data.Store',{
                     fields : ['code', 'text'],
                     data : data
                  })
               };
               items.push(item);
            }
     
            this.formRef.insert(4, items);
         }
      }, this);
   },
   
   originalUploadSuccessHandler : function(file)
   {
      var file = file.pop();
      if(this.originalFileRefs){
         Ext.Array.remove(this.fileRefs, this.originalFileRefs);
      }
      this.originalFileRefs = parseInt(file.rid);
      this.originalSrc = file.filename;
      this.fileRefs.push(parseInt(file.rid));
      this.originalRef.setSrc(FH.getZhuChaoImageUrl(file.filename));
   },
   
   planarUploadSuccessHandler : function(file)
   {
      var file = file.pop();
      if(this.planarFileRefs){
         Ext.Array.remove(this.fileRefs, this.planarFileRefs);
      }
      this.planarFileRefs = parseInt(file.rid);
      this.planarSrc = file.filename;
      this.fileRefs.push(parseInt(file.rid));
      this.planarRef.setSrc(FH.getZhuChaoImageUrl(file.filename));
   },
   
   saveHandler : function()
   {
      var MSG = this.LANG_TEXT.MSG;
      if(this.isValid() && this.imageGroupRef.isFieldValueValid()){
         var values = this.getValues();
         values['originalPic'] = [this.originalSrc, this.originalFileRefs];
         values['planarPic'] = [this.planarSrc, this.planarFileRefs];
         values['images'] = this.imageGroupRef.getFieldValue();
         values['fileRefs'] = this.fileRefs;
         
         this.setLoading(MSG.SAVING);
         if(this.mode == CloudController.Const.NEW_MODE){
            this.mainPanelRef.appRef.addDesignScheme(values, function(response){
               this.loadMask.hide();
               if(!response.status){
                  Cntysoft.Kernel.Utils.processApiError(response);
               }else{
                  this.close();
                  this.listRef.reload();
               }
            }, this);
         }else{
            this.mainPanelRef.appRef.updateDesignScheme(values, function(response){
               this.loadMask.hide();
               if(!response.status){
                  Cntysoft.Kernel.Utils.processApiError(response);
               }else{
                  this.close();
                  this.listRef.reload();
               }
            }, this);
         }
      }
   },
   
   getDefaultValues : function()
   {
      return {
         
      };
   },
   
   destroy : function()
   {
      delete this.appRef;
      delete this.originalSrc;
      delete this.originalFileRefs;
      delete this.planarSrc;
      delete this.planarFileRefs;
      delete this.formRef;
      delete this.userType;
      delete this.targetLoadId;
      this.mixins.langTextProvider.destroy.call(this);
      this.callParent();
   }
});