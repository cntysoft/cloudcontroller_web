/*
 * Cntysoft Cloud Software Team
 *
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.UserCenter.Ui.Project.BaseInfo', {
   extend : 'Ext.form.Panel',
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    */
   runableLangKey : 'App.ZhuChao.UserCenter',
   statics : {
      STYLE_KEY : 'ZhuChao.UserCenter.Designer.Style'
   },
   constructor : function (config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.PROJECT.BASE_INFO');
      this.applyConstraintConfig(config);

      this.callParent([config]);
   },
   applyConstraintConfig : function (config)
   {
      Ext.apply(config, {
         border : false,
         title : this.LANG_TEXT.TITLE,
         autoScroll : true,
         bodyPadding : 10
      });
   },
   initComponent : function ()
   {
      Ext.apply(this, {
         items : this.getPanelItemsConfig(),
         defaults : {
            labelWidth : 200
         }
      });
      this.callParent();
   },
   getPanelItemsConfig : function ()
   {
      var F = this.LANG_TEXT.FIELDS;
      var RED_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
      return [{
            xtype : 'textfield',
            name : 'name',
            fieldLabel : F.NAME + RED_STAR,
            allowBlank : false,
            width : 700
         }, {
            xtype : 'fieldcontainer',
            fieldLabel : F.COVER_IMAGE + RED_STAR,
            layout : {
               type : 'hbox',
               align : 'bottom'
            },
            items : [{
                  xtype : 'image',
                  width : 200,
                  height : 100,
                  style : 'border:1px solid #EDEDED',
                  listeners : {
                     afterrender : function (comp){
                        this.imageRef = comp;
                     },
                     scope : this
                  }
               }, {
                  xtype : 'webossimpleuploader',
                  uploadPath : this.mainPanelRef.appRef.getUploadFilesPath(),
                  createSubDir : false,
                  fileTypeExts : ['gif', 'png', 'jpg', 'jpeg'],
                  margin : '0 0 0 5',
                  maskTarget : this,
                  enableFileRef : true,
                  buttonText : F.UPLOAD,
                  listeners : {
                     fileuploadsuccess : this.uploadSuccessHandler,
                     scope : this
                  }
               }]
         }, {
            xtype : 'fieldcontainer',
            fieldLabel : F.USER + RED_STAR,
            layout : 'hbox',
            items : [{
                  xtype : 'combo',
                  name : 'userType',
                  editable : false,
                  queryMode : 'local',
                  displayField : 'text',
                  valueField : 'code',
                  margin : '0 10 0 0',
                  emptyText : F.EMPTY_TEXT,
                  store : Ext.create('Ext.data.Store', {
                     fields : ['code', 'text'],
                     data : [
                        {"code" : 1, 'text' : F.USER_NORMAL},
                        {"code" : 2, 'text' : F.USER_FOREMAN},
                        {"code" : 3, 'text' : F.USER_DECORATOR},
                        {"code" : 4, 'text' : F.USER_DESIGNER}
                     ]
                  }),
                  listeners : {
                     afterrender : function (combo){
                        this.userRef = combo;
                        if(this.responseData){
                           this.uidRef.setValue(this.responseData['userType']);
                        }
                     },
                     change : function (combo, newValue){
                        this.userType = newValue;
                        this.mainPanelRef.appRef.getUserListProjectByType({type : newValue}, function (response){
                           this.uidRef.getStore().loadData(response.data['items']);
                           if(this.responseData && newValue == this.responseData['userType']){
                              this.uidRef.setValue(this.responseData['uid']);
                           } else{
                              this.uidRef.setValue('');
                           }
                        }, this);
                     },
                     scope : this
                  }
               }, {
                  xtype : 'combo',
                  name : 'uid',
                  displayField : 'name',
                  editable : false,
                  margin : '0 10 0 0',
                  valueField : 'id',
                  queryMode : 'local',
                  emptyText : F.EMPTY_TEXT,
                  store : Ext.create('Ext.data.Store', {
                     pageSize : 0,
                     fields : ['id', 'name']
                  }),
                  listeners : {
                     afterrender : function (combo){
                        this.uidRef = combo;
                     },
                     scope : this
                  }
               }]
         }, {
            xtype : 'fieldcontainer',
            layout : 'hbox',
            fieldLabel : F.PCD,
            defaults : {
               margin : '0 10 0 0'
            },
            items : [{
                  xtype : 'combo',
                  name : 'province',
                  queryMode : 'local',
                  displayField : 'name',
                  valueField : 'code',
                  store : Ext.create('Ext.data.Store', {
                     fields : ['name', 'code']
                  }),
                  editable : false,
                  emptyText : F.EMPTY_TEXT,
                  listeners : {
                     afterrender : function (combo){
                        this.provinceRef = combo;
                        this.mainPanelRef.appRef.getProvinces(function (response){
                           combo.getStore().loadData(response.data);
                           if(this.responseData && this.responseData['province']){
                              combo.setValue(this.responseData['province']);
                           }
                        }, this);
                     },
                     change : function (combo, newValue){
                        this.mainPanelRef.appRef.getArea(newValue, function (response){
                           this.cityRef.getStore().loadData(response.data);
                           if(this.responseData && newValue == this.responseData['province']){
                              this.cityRef.setValue(this.responseData['city']);
                           }
                        }, this);
                     },
                     scope : this
                  }
               }, {
                  xtype : 'combo',
                  name : 'city',
                  queryMode : 'local',
                  displayField : 'name',
                  valueField : 'code',
                  store : Ext.create('Ext.data.Store', {
                     fields : ['name', 'code']
                  }),
                  editable : false,
                  emptyText : F.EMPTY_TEXT,
                  listeners : {
                     afterrender : function (combo){
                        this.cityRef = combo;
                     },
                     change : function (combo, newValue){
                        this.mainPanelRef.appRef.getArea(newValue, function (response){
                           this.districtRef.getStore().loadData(response.data);
                           if(this.responseData && newValue == this.responseData['city']){
                              this.districtRef.setValue(this.responseData['district']);
                           }
                        }, this);
                     },
                     scope : this
                  }
               }, {
                  xtype : 'combo',
                  name : 'district',
                  queryMode : 'local',
                  displayField : 'name',
                  valueField : 'code',
                  store : Ext.create('Ext.data.Store', {
                     fields : ['name', 'code']
                  }),
                  editable : false,
                  emptyText : F.EMPTY_TEXT,
                  listeners : {
                     afterrender : function (combo){
                        this.districtRef = combo;
                     },
                     scope : this
                  }
               }]
         }, {
            xtype : 'textfield',
            fieldLabel : F.ADDRESS,
            width : 700,
            name : 'address'
         }, {
            xtype : 'datefield',
            fieldLabel : F.START_TIME,
            format : 'Y-m-d',
            altFormats : 'Y/m/d',
            width : 600,
            name : 'startTime'
         }, {
            xtype : 'datefield',
            fieldLabel : F.END_TIME,
            format : 'Y-m-d',
            altFormats : 'Y/m/d',
            width : 600,
            name : 'endTime'
         }, {
            xtype : 'numberfield',
            fieldLabel : F.PRICE,
            width : 400,
            value : 0,
            name : 'price'
         }, {
            xtype : 'numberfield',
            fieldLabel : F.AREA,
            width : 400,
            name : 'area',
            value : 0
         }, {
            xtype : 'radiogroup',
            fieldLabel : F.TYPE,
            name : 'type',
            width : 700,
            items : [
               {boxLabel : F.TYPE_ALL, name : 'type', inputValue : '1', checked : true},
               {boxLabel : F.TYPE_HALF, name : 'type', inputValue : '2'},
               {boxLabel : F.TYPE_LITTLE, name : 'type', inputValue : '2'}
            ]
         }, {
            xtype : 'combo',
            fieldLabel : F.STYLE,
            width : 400,
            queryMode : 'local',
            displayField : 'name',
            valueField : 'text',
            store : Ext.create('Ext.data.Store', {
               fields : ['name', 'text']
            }),
            name : 'style',
            editable : false,
            listeners : {
               afterrender : function (combo){
                  this.mainPanelRef.appRef.getSysKvDict(this.self.STYLE_KEY, function (response){
                     var items = [];
                     Ext.each(response.data, function (item){
                         items.push({
                             name : item['name'], text : item['value']
                         });
                     }, this);
                     combo.getStore().loadData(items);
                     if(this.responseData && this.responseData['style']){
                        combo.setValue(this.responseData['style']);
                     }
                  }, this);
               },
               scope : this
            }
         }, {
            xtype : 'combo',
            fieldLabel : F.STAGE,
            width : 400,
            name : 'stage',
            queryMode : 'local',
            displayField : 'text',
            editable : false,
            valueField : 'code',
            value : 1,
            store : Ext.create('Ext.data.Store', {
               fields : ['code', 'text'],
               data : [
                  {"code" : 1, 'text' : F.STAGE_START},
                  {"code" : 2, 'text' : F.STAGE_WATER},
                  {"code" : 3, 'text' : F.STAGE_MUD},
                  {"code" : 4, 'text' : F.STAGE_PAINT},
                  {"code" : 5, 'text' : F.STAGE_END}
               ]
            })
         }, {
            xtype : 'hiddenfield',
            name : 'id'
         }];
   },
   uploadSuccessHandler : function (file)
   {
      var file = file.pop();
      if(this.coverSrc){
         Ext.Array.remove(this.infoRef.fileRefs, this.rid);
      }
      this.infoRef.fileRefs.push(parseInt(file.rid));
      this.rid = parseInt(file.rid);
      this.coverSrc = file.filename;
      this.imageRef.setSrc(FH.getZhuChaoImageUrl(file.filename));
   },
   getInfoValues : function ()
   {
      if(!this.rendered && this.responseData){
         var list = ['name', 'province', 'city', 'district', 'coverImage', 'userType', 'uid', 'address', 'startTime', 'endTime', 'price', 'area', 'type', 'style', 'stage', 'id'];
         var len = list.length;
         for(var i = 0; i < len; i++) {
            var name = list[i];
            values[name] = this.responseData[name];
         }
      } else if(this.isValid()){
         var values = this.getForm().getValues();
         values['coverImage'] = [this.coverSrc, this.rid];
         
         return values;
      }
   },
   applyInfoValue : function (values)
   {
      if(!this.rendered){
         this.responseData = values;
      } else{
         this.responseData = values;
         var filter = ['province', 'city', 'district'];
         var valueClone = Ext.clone(values);
         Ext.Object.each(valueClone, function (key, val){
            if(Ext.Array.contains(filter, key)){
               if('0' == valueClone[key]){
                  delete valueClone[key];
               }
            }
         }, this);

         if(valueClone['coverImage']){
            this.coverSrc = valueClone['coverImage'][0];
            this.rid = valueClone['coverImage'][1];
         }
         this.getForm().setValues(valueClone);
         this.imageRef.setSrc(FH.getZhuChaoImageUrl(this.coverSrc));
      }
   },
   isInfoValid : function ()
   {
      return this.getForm().isValid();
   },
   destroy : function ()
   {
      delete this.appRef;
      delete this.responseData;
      delete this.provinceRef;
      delete this.cityRef;
      delete this.districtRef;
      this.mixins.langTextProvider.destroy.call(this);
      this.callParent();
   }
});