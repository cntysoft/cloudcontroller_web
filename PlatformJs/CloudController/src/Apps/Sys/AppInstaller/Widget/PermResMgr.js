/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.AppInstaller.Widget.PermResMgr', {
   extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires: [
      'App.Sys.AppInstaller.Ui.PermResMgr.ResMountView',
      'App.Sys.AppInstaller.Ui.PermResMgr.ResMountQueue'
   ],
   //private
   treePanelRef : null,
   //private
   listViewRef : null,

   initPmTextRef : function()
   {
      this.pmText = this.GET_PM_TEXT('PERM_RES_MGR');
   },

   initLangTextRef : function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('PERM_RES_MGR');
   },

   applyConstraintConfig : function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         layout : {
            type : 'hbox',
            align: 'stretch'
         },
         width : 930,
         minWidth : 930,
         minHeight : 500,
         height : 500,
         resizable : true,
         bodyStyle : 'background:#ffffff',
         maximizable : true
      });
   },
   initComponent : function()
   {

      var BTN = this.LANG_TEXT.BTN;
      Ext.apply(this, {
         items : [
            this.getSourceResPanelConfig(),
            this.getMountQueueConfig()
         ],
         buttons : [{
            xtype : 'button',
            text : BTN.SAVE,
            disabled : true,
            listeners : {
               click : this.saveOpHandler,
               afterrender : function(btn){
                  this.saveBtnRef = btn;
               },
               scope : this
            }
         }, {
            text : BTN.CLEAR_QUEUE,
            listeners : {
               click : this.clearQueueHandler,
               afterrender : function(btn){
                  this.clearBtnRef = btn;
               },
               scope : this
            }
         }]
      });
      this.callParent();
   },
   /**
    * @param {int} type 挂载的类型
    * @param {Object} record 需要挂在的模权限资源
    */
   mountRequestHandler : function(type, record)
   {
      record.set('type', type);
      this.mountQueueRef.insertRecord(record);
   },

   beforeQueueRequestHandler : function()
   {
      this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
   },
   processItemHandler : function(item)
   {
      this.setLoading(Ext.String.format(this.LANG_TEXT.PROCESS_MSG, item.get('text')));
   },

   queueFinishHandler : function()
   {
      this.loadMask.hide();
      this.saveBtnRef.setDisabled(true);
      this.resListViewRef.reload();
   },

   saveBtnStatusHandler : function(store)
   {
      var OP_CODE = App.Sys.AppInstaller.Ui.PermResMgr.ResMountQueue.OP_CODE;
      var disabled  = true;
      if(store.getCount() > 0){
         store.each(function(item){
            if(OP_CODE.READY == item.get('queueStatus')){
               disabled = false;
            }
         });
         this.saveBtnRef.setDisabled(disabled);
      } else{
         this.saveBtnRef.setDisabled(disabled);
      }
   },

   saveOpHandler : function()
   {
      this.mountQueueRef.request();
   },

   clearQueueHandler : function()
   {
      this.mountQueueRef.clearQueue();
   },

   setCurSiteInfo : function()
   {
      this.curSiteInfoRef.update(Ext.String.format(this.LANG_TEXT.CUR_SITE_MSG, this.targetLoadedSite.get('siteName')));
   },

   getSourceResPanelConfig : function()
   {
      return {
         xtype : 'appsysappinstalleeruipermresmgrresmounterview',
         mainPanelRef : this,
         flex : 1,
         margin : '0 2 0 0',

         listeners : {
            mountrequest : this.mountRequestHandler,
            afterrender : function(view)
            {
               this.resListViewRef = view;
            },
            scope : this
         }
      };
   },

   getMountQueueConfig : function()
   {
      return {
         xtype : 'appsysappinstalleruipermresmgrresmountqueue',
         appRef : this.appRef,
         mainPanelRef : this,
         listeners : {
            afterrender : function(view)
            {
               this.mountQueueRef = view;
            },
            beforerequest : this.beforeQueueRequestHandler,
            processitem : this.processItemHandler,
            queuefinished : this.queueFinishHandler,
            itemschange : this.saveBtnStatusHandler,
            clear : this.saveBtnStatusHandler,
            scope : this
         },
         flex : 1
      };
   },
   destroy : function()
   {
      delete this.resListViewRef;
      delete this.mountQueueRef;
      delete this.saveBtnRef;
      delete this.curSiteInfoRef;
      delete this.clearBtnRef;
      delete this.mainPanelRef;
      this.callParent();
   }
});