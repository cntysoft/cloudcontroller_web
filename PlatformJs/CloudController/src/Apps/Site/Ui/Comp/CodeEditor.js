/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Ui.Comp.CodeEditor', {
   extend : 'WebOs.Component.Editor.Code',
   requires : [
      'Ext.layout.container.Border',
      'App.Site.Ui.Comp.TagClassifyTree',
      'App.Site.Ui.Comp.TagGenWin'
   ],

   statics : {
      generateTag : function(meta)
      {
         if('BuildIn' == meta.tagType){
            switch(meta.category){
               case 'SiteConfig':
                  var tag = Ext.String.format('Qs::SiteConfig("{0}");', meta.id);
                  return tag;
                  break;
               case 'Field':
                  var attributes = meta.attributes;
                  var tag = Ext.String.format('echo Qs::DsField("{0}", "{1}");', attributes['group'], attributes['field']);
                  return tag;
                  break;
               case 'Sys':
                  var tag = Ext.String.format('Qs::Sys("{0}", array());', meta.id);
                  return tag;
                  break;
            }
         }else{
            var attributes = meta.attributes;
            var param = '';
            if(!Ext.Object.isEmpty(attributes)){
               param = ', array(';
               for(var key in attributes){
                  param += key +' => "'+attributes[key]+'" ';
               }
               param += ')';
            }
            var tag = Ext.String.format('Qs::{0}("{1}"{2});', meta.tagType, meta.category + '/' + meta.id, param);
            return tag;
         }
      },

      checkTag : function(text)
      {
         var arr = text.split("");
         var leftLabel = [], rightLabel = [];
         if(Ext.isEmpty(arr)){
            return true;
         }
         var len = arr.length;
         for(var i = len - 1; i >= 0; i -= 1){
            switch(arr[i]){
               case '>':
                  rightLabel=[];
                  leftLabel=[];
                  rightLabel.unshift('>');
                  break;
               case 'p':
                  var leftLen = leftLabel.length;
                  rightLabel=[];
                  if(0 == leftLen || 2 == leftLen){
                     leftLabel.unshift('p');
                  }else{
                     leftLabel=[];
                  }
                  break;
               case 'h':
                  if(1 == leftLabel.length){
                     leftLabel.unshift('h');
                  }else{
                     leftLabel=[];
                  }
                  rightLabel=[];
                  break;
               case '?':
                  if(1 == rightLabel.length){
                     return true;
                  }else if(3 == leftLabel.length){
                     leftLabel.unshift('?');
                     rightLabel=[];
                  }else{
                     rightLabel=[];
                     leftLabel=[];
                  }
                  break;
               case '<':
                  if(4 == leftLabel.length){
                     return false;
                  }else{
                     rightLabel=[];
                     leftLabel=[];
                  }
                  break;
            }
         }
         return true;
      }
   },

   /*
    * 所有模型的id列表
    */
   modelIds : null,

   /*
    * 更改一下布局
    */
   applyConstraintConfig : function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         layout : 'border',
         maximized : true,
         bodyPadding : 1
      });
   },

   /*
    * @inheritdoc
    */
   getEditorConfig : function()
   {
      var config = this.callParent();
      config.region = 'center';
      return config;
   },

   /*
    * 获取编辑器子组件
    */
   getEditorItems : function()
   {
      this.addListener({
         afterrender : this.afterrenderHandler,
         scope : this
      });
      return [this.getEditorConfig(),{
         xtype : 'siteuicomptagclassifytree',
         region : 'west',
         appRef : this.fsViewRef.mainPanelRef.appRef,
         listeners : {
            itemclick : this.itemClickHandler,
            scope : this
         }
      }];
   },

   itemClickHandler : function(tree, record)
   {
      if(record.isLeaf()){
         var meta = Ext.clone(record.raw.meta);
         if(meta.attributes && 0 != meta.attributes.length){
            new App.Site.Ui.Comp.TagGenWin({
               meta : record.raw.meta,
               editorRef : this.editorRef,
               modelIds : this.modelIds,
               listeners : {
                  taggenerated : function(tag)
                  {
                     var cursor = this.editorRef.getCursor();
                     var range = this.editorRef.getRange({'line' : 0, 'ch' : 0}, cursor);
                     if(this.self.checkTag(range)){
                        tag = '<?php ' + tag + ' ?>';
                     }
                     this.editorRef.insertStringAtCursor(tag);
                  },
                  scope : this
               }
            });
         }else{
            var tag = this.self.generateTag(meta);
            var cursor = this.editorRef.getCursor();
            var range = this.editorRef.getRange({'line' : 0, 'ch' : 0}, cursor);
            if(this.self.checkTag(range)){
               tag = '<?php ' + tag + ' ?>';
            }
            this.editorRef.insertStringAtCursor(tag);
         }
      }
   },

   afterrenderHandler : function()
   {
      if(Ext.isEmpty(this.modelIds)){
         this.fsViewRef.mainPanelRef.appRef.getModelIdList(function(response){
            if(!response.status){
               Cntysoft.processApiError(response);
            } else{
               this.modelIds = response.data;
            }
         }, this);
      }
   },

   destroy : function()
   {
      delete this.fsViewRef;
      delete this.editorRef;
      delete this.modelIds;
      this.callParent();
   }
});