/*
 * Cntysoft Cloud Software Team
 *
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 筑巢意见反馈信息编辑器
 */
Ext.define('App.ZhuChao.Advice.Ui.Editor', {
   extend : 'Ext.form.Panel',
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   /**
    * @inheritdoc
    */
   panelType : 'Editor',
   /**
    * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.ZhuChao.Advice',
   /**
    * @property {Integer} $_current_nid_$
    */
   $_current_nid_$ : null,
   statusLabelRef : null,
   markButtonRef : null,
   /**
    * 构造函数
    *
    * @param config
    */
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.EDITOR');
      this.applyConstraintConfig(config);
      if(config.mode == CloudController.Const.MODIFY_MODE) {
         if(!Ext.isDefined(config.targetLoadId) || !Ext.isNumber(config.targetLoadId)) {
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
         bodyPadding : 10,
         autoScroll : true
      });
   },
   initComponent : function()
   {
      var L = this.LANG_TEXT.BTNS;
      Ext.apply(this, {
         buttons : [{
            text : L.MAKE_DOWN,
            listeners : {
               click : this.saveHandler,
               afterrender : function(btn)
               {
                  this.markButtonRef = btn;
               },
               scope : this
            }
         }, {
            text : Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
            listeners : {
               click : function()
               {
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
      if(this.mode == CloudController.Const.MODIFY_MODE) {
         this.loadAdviceInfo(this.targetLoadId);
      }
   },
   loadAdviceInfo : function(id)
   {
      if(this.$_current_nid_$ !== id) {
         this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
         this.appRef.getAdviceInfo(id, this.afterLoadInfoHandler, this);
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
         form.setValues(data);

         var status = data.status;
         var C = App.ZhuChao.Advice.Const;
         var L = this.LANG_TEXT.STATUS;
         if(C.ADVICE_S_DOWN == status) {
            this.statusLabelRef.setText(L.DOWN);
            this.markButtonRef.setDisabled(true);
         }else if(C.ADVICE_S_NEW == status) {
            this.statusLabelRef.setText(L.NEW);
            this.markButtonRef.setDisabled(false);
         }
      }
   },
   saveHandler : function()
   {
      if(this.mode == CloudController.Const.MODIFY_MODE) {
         this.appRef.makedownAdviceInfo(this.$_current_nid_$, this.afterSaveHandler, this);
      }
   },

   afterSaveHandler : function(response)
   {
      this.loadMask.hide();
      if(!response.status) {
         Cntysoft.Kernel.Utils.processApiError(response);
      } else{
         this.mainPanelRef.gotoPrev();
         var panel = this.mainPanelRef.getCurrentActivePanel();
         if(panel.panelType == 'ListView') {
            panel.reload();
         }
         this.close();
      }
   },
   getFormItemConfig : function()
   {
      var L = this.LANG_TEXT.LABELS;
      return [{
         xtype : 'textfield',
         fieldLabel : L.TITLE,
         width : 600,
         editable : false,
         name : 'title'
      }, {
         xtype : 'textarea',
         fieldLabel : L.CONTENT,
         width : 600,
         height : 400,
         editable : false,
         name : 'content'
      }, {
         xtype : 'textfield',
         fieldLabel : L.MERCHANT_NAME,
         width : 600,
         editable : false,
         name : 'merchantName'
      }, {
         xtype : 'textfield',
         fieldLabel : L.NAME,
         width : 600,
         editable : false,
         name : 'name'
      }, {
         xtype : 'textfield',
         fieldLabel : L.PHONE,
         width : 600,
         editable : false,
         name : 'phone'
      }, {
         xtype : 'fieldcontainer',
         fieldLabel : L.STATUS,
         width : 600,
         items : [{
            xtype : 'label',
            listeners : {
               afterrender : function(label) {
                  this.statusLabelRef = label;
               },
               scope : this
            }
         }]
      }];
   },
   destroy : function()
   {
      delete this.mainPanelRef;
      delete this.$_current_nid_$;
      delete this.targetLoadId;
      delete this.statusLabelRef;
      delete this.appRef;
      delete this.markButtonRef;
      this.callParent();
   }
});
