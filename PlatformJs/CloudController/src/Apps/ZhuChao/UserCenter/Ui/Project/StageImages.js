/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license   http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.UserCenter.Ui.Project.StageImages', {
   extend : 'Ext.form.Panel',
   requires : [
      'App.ZhuChao.UserCenter.Ui.Project.ImageGroup'
   ],
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider',
      formTooltip : 'Cntysoft.Mixin.FormTooltip'
   },
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    */
   runableLangKey : 'App.ZhuChao.UserCenter',
   
   constructor : function (config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.PROJECT.STAGE_IMAGES');
      this.mixins.formTooltip.constructor.call(this);
      this.fileRefs = config.infoRef.fileRefs;
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig : function (config)
   {
      Ext.apply(config, {
         border : false,
         bodyPadding : 10,
         title : this.LANG_TEXT.TITLE,
         autoScroll : true
      });
   },
   initComponent : function ()
   {
      Ext.apply(this, {
         items : this.getItemsConfig(),
         defaults : {
            labelWidth : 150,
            listeners : this.getFormItemListener()
         },
         listeners : {
            afterrender : function (){
               if(this.responseData){
                  this.applyInfoValue(this.responseData);
               }
            },
            scope : this
         }
      });
      this.callParent();
   },
   getFormItemListener : function ()
   {
      return {
         afterrender : function (comp)
         {
            this.mixins.formTooltip.setupTooltipTarget.call(this, comp);
         },
         scope : this
      };
   },
   getItemsConfig : function ()
   {
      var F = this.LANG_TEXT.FIELDS;
      return [{
         xtype : 'usercenteruiprojectimagegroup',
         fieldLabel : F.PREPARE,
         editorRef : this,
         listeners : {
            afterrender : function (image){
               this.prepareRef = image;
            },
            scope : this
         }
      }, {
         xtype : 'usercenteruiprojectimagegroup',
         fieldLabel : F.WATER_ELECTRICITY,
         editorRef : this,
         listeners : {
            afterrender : function (image){
               this.waterElectricityRef = image;
            },
            scope : this
         }
      }, {
         xtype : 'usercenteruiprojectimagegroup',
         fieldLabel : F.MUD_WOOD,
         editorRef : this,
         listeners : {
            afterrender : function (image){
               this.mudWoodRef = image;
            },
            scope : this
         }
      }, {
         xtype : 'usercenteruiprojectimagegroup',
         fieldLabel : F.PAINT,
         editorRef : this,
         listeners : {
            afterrender : function (image){
               this.paintRef = image;
            },
            scope : this
         }
      }, {
         xtype : 'usercenteruiprojectimagegroup',
         fieldLabel : F.FINISH,
         editorRef : this,
         listeners : {
            afterrender : function (image){
               this.finishRef = image;
            },
            scope : this
         }
      }];
   },
   getInfoValues : function ()
   {
      var values = {};
      var views = [
         this.prepareRef,
         this.waterElectricityRef,
         this.mudWoodRef,
         this.paintRef,
         this.finishRef
      ];
      var names = [
         'prepare',
         'waterElectricity',
         'mudWood',
         'paint',
         'finish'
      ];
      if(!this.rendered){
         if(this.responseData){
            var length = names.length;
            for(var i = 0; i < length; i++) {
               values[names[i]] = this.responseData[names[i]];
            }
            return values;
         }else{
            var length = names.length;
            for(var i = 0; i < length; i++) {
               values[names[i]] = [];
            }
            return values;
         }
      }
      var len = views.length;

      for(var i = 0; i < len; i++) {
         values[names[i]] = views[i].getFieldValue();
      }

      return values;
   },
   applyInfoValue : function (values)
   {
      if(!this.rendered){
         this.responseData = values;
      } else{
         var views = [
            this.prepareRef,
            this.waterElectricityRef,
            this.mudWoodRef,
            this.paintRef,
            this.finishRef
         ];
         var names = [
            'prepare',
            'waterElectricity',
            'mudWood',
            'paint',
            'finish'
         ];
         var len = views.length;
         for(var i = 0; i < len; i++) {
            if(values[names[i]]){
               views[i].setFieldValue(values[names[i]]);
            }
         }
      }
   },
   isInfoValid : function ()
   {
      if(!this.rendered){
         return true;
      }else{
         var flag = this.getForm().isValid();
         var views = [
            this.prepareRef,
            this.waterElectricityRef,
            this.mudWoodRef,
            this.paintRef,
            this.finishRef
         ];
         var len = views.length;
         for(var i = 0; i < len; i++) {
            if(!views[i].isFieldValueValid()){
               flag = false;
            }
         }

         return flag;
      }
   },
   
   destroy : function ()
   {
      delete this.businessCertificateRef;
      this.mixins.langTextProvider.destroy.call(this);
      this.callParent();
   }
});

