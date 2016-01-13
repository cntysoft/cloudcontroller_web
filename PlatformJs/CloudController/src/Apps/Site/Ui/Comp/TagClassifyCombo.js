/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Ui.Comp.TagClassifyCombo', {
   extend : 'Ext.form.field.ComboBox',
   alias : 'widget.siteuicomptagclassifycombo',
   requires : [
      'Cntysoft.Utils.HtmlTpl'
   ],
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   /*
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.Site.Ui',
   /*
    * 标签的种类
    *
    * @property {String} tagType
    */
   tagType : null,
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('COMP.TAG_CLASSIFY');
      this.applyConstraintConfig(config);
      if(Ext.isEmpty(config.tagType)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'constructor',
            'tag type must specify'
         );
      }
      this.callParent([config]);
   },
   applyConstraintConfig : function(config)
   {
      var RED_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
      Ext.apply(config, {
         queryMode : 'remote',
         displayField : 'text',
         valueField : 'text',
         fieldLabel : this.LANG_TEXT.FIELD_NAME + RED_STAR,
         editable : false,
         emptyText : this.LANG_TEXT.EMPTY_TEXT,
         height : 25
      });
   },
   initComponent : function()
   {
      Ext.apply(this,{
         store : this.createStore()
      });
      this.callParent();
   },
   createStore : function()
   {
      return new Ext.data.Store({
         autoLoad : true,
         fields : ['text'],
         proxy : {
            type : 'apigateway',
            callType : 'App',
            invokeMetaInfo : {
               module : 'Site',
               name : 'Ui',
               method : 'Tag/getTagClassify'
            },
            reader : {
               type : 'json',
               rootProperty : 'data'
            },
            pArgs : {
               tagType : this.tagType
            }
         }
      });
   },
   destroy : function()
   {
      this.mixins.langTextProvider.destroy.call(this);
      this.callParent();
   }
});