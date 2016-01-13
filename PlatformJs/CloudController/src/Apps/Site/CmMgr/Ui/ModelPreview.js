/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 模型编辑器预览类实现
 */
Ext.define('App.Site.CmMgr.Ui.ModelPreview', {
   extend: 'Ext.window.Window',
   requires : [
      'Ext.layout.container.Fit'
   ],
   mixins: {
      langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
   },
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey: 'App.Site.CmMgr',

   /*
    * 初始化需要加载的模型
    *
    * @property {String} initLoadedModel
    */
   initLoadedModel : null,
   /*
    * @property {Ext.form.Panel} formPanelRef
    */
   formPanelRef : null,
   //private
   mainPanelRef : null,
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.MODEL_PREVIEW');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   initComponent : function()
   {
      Ext.apply(this, {
         buttons : [{
            text : Cntysoft.GET_LANG_TEXT('UI.BTN.OK'),
            listeners : {
               click : function()
               {
                  this.close();
               },
               scope : this
            }
         }],
         items : {
            xtype : 'form',
            autoScroll : true,
            bodyPadding : 10,
            listeners : {
               afterrender : function(form)
               {
                  this.formPanelRef = form;
               },
               scope : this
            }
         }
      });
      if(this.initLoadedModel){
         this.addListener('afterrender', function(){
            this.renderEditorItems(this.initLoadedModel);
         }, this, {
            single : true
         });
      }
      this.callParent();
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config, {
         modal : true,
         height : 400,
         minHeight : 400,
         width : 1100,
         minWidth : 1100,
         maximizable : true,
         //maximized : true,
         title : this.LANG_TEXT.TITLE,
         constrain : true,
         constrainTo : Ext.getBody(),
         closeAction : 'hide',
         bodyPadding : 1,
         layout : 'fit',
         bodyStyle : {
            background : '#ffffff'
         }
      });
   },

   /*
    * 获取编辑器项目
    */
   renderEditorItems : function(mid)
   {
      this.mainPanelRef.appRef.getModelFields(mid, function(response){
         if(!response.status){
            Cntysoft.processApiError(response);
         } else{
            var cfgs = response.data;
            var baseCls = 'App.Site.CmMgr.Lib.FieldWidget.';
            var items = [];
            var len = cfgs.length;
            var item;
            var clses = [];
            for(var i = 0; i < len; i++) {
               item = cfgs[i];
               if(item.display){
                  clses.push(baseCls + item.fieldType);
               }
            }
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD_SCRIPT'));
            Ext.require(clses, function(){
               this.loadMask.hide();
               for(var i = 0; i < len; i++) {
                  item = cfgs[i];
                  if(item.display){
                     items.push(Ext.create(baseCls + item.fieldType, {
                        renderOptions : item,
                        isPreviewMode : true
                     }));
                  }
               }
               this.formPanelRef.removeAll();
               this.formPanelRef.add(items);
            }, this);
         }
      }, this);
   },

   destroy : function()
   {
      if(this.loadMask){
         this.loadMask.destroy();
         delete this.loadMask;
      }
      delete this.formPanelRef;
      delete this.mainPanelRef;
      this.callParent();
   }
});