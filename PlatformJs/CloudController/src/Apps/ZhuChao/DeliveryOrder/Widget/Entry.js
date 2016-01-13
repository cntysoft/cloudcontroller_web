/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2015 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.DeliveryOrder.Widget.Entry', {
   extend : 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires : [
      'App.ZhuChao.DeliveryOrder.Ui.ListView',
      'App.ZhuChao.DeliveryOrder.Comp.ActivityTree'
   ],
   mixins : {
      multiTabPanel : 'SenchaExt.Mixin.MultiTabPanel'
   },
   panelClsMap : {
      ListView : 'App.ZhuChao.DeliveryOrder.Ui.ListView'
   },
   initPanelType : 'ListView',
   rootContextMenuRef : null,
   activityContextMenuRef : null,
   initPmTextRef : function ()
   {
      this.pmText = this.GET_PM_TEXT('ENTRY');
   },
   initLangTextRef : function ()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('UI.ENTRY');
   },
   applyConstraintConfig : function (config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         layout : 'border',
         width : 1000,
         minWidth : 1000,
         height : 500,
         minHeight : 500,
         resizable : true,
         style : 'backgroud:#ffffff',
         maximizable : true
      });
   },
   initComponent : function ()
   {
      Ext.apply(this, {
         items : [
//            this.getActivityConfig(),
            this.getTabPanelConfig()
         ]
      });
      this.callParent();
   },
   getActivityConfig : function ()
   {
      return {
         xtype : 'zhuchaodeliveryordercompactivitytree',
         region : 'west',
         width : 260,
         margin : '0 3 0 0',
         collapsible : true,
         collapsed : true,
         border : false,
         listeners : {
            afterrender : function (comp)
            {
               this.categoryTreeRef = comp;
            },
            itemcontextmenu : this.itemContextMenuHandler,
            itemclick : this.itemClickHandler,
            scope : this
         }
      };
   },
   itemContextMenuHandler : function (tree, record, item, index, event)
   {
      var menu = this.getContextMenu(record);
      menu.record = record;
      var pos = event.getXY();
      event.stopEvent();
      menu.showAt(pos[0], pos[1]);
   },
   
   getContextMenu : function (record)
   {
      var MENU = this.LANG_TEXT.MENU;
      if(record.isRoot()){
         if(null == this.rootContextMenuRef){
            this.rootContextMenuRef = new Ext.menu.Menu({
               ignoreParentClicks : true,
               items : [{
                     text : MENU.ADD_ACTIVITY,
                     listeners : {
                        click : function (){
                           var activityWinRef = this.getActivityWindowConfig();
                           activityWinRef.show();
                        },
                        scope : this
                     }
                  }]
            });
         }

         return this.rootContextMenuRef;
      } else{
         if(null == this.activityContextMenuRef){
            this.activityContextMenuRef = new Ext.menu.Menu({
               ignoreParentClicks : true,
               items : [{
                     text : MENU.EDIT_ACTIVITY,
                     listeners : {
                        click : function (item){
                           var record = item.parentMenu.record;
                           var activityWinRef = this.getActivityWindowConfig({'text' : record.get('text'), 'id' : record.get('id')});
                           activityWinRef.show();
                        },
                        scope : this
                     }
                  }, {
                     text : MENU.ADD_DELIVERY_ORDER,
                     listeners : {
                        click : function (){
  
                        },
                        scope : this
                     }
                  }]
            });
         }

         return this.activityContextMenuRef;
      }
   },
   itemClickHandler : function (tree, record)
   {
      var id = record.get('id');
      if(0 == id){
         return;
      } else{
         var grid = this.down('grid');
         grid.getStore().reload({
            params : {
               activityId : id
            }
         });
      }
   },
   getActivityWindowConfig : function (data)
   {
      var BTN = this.LANG_TEXT.BTN;
      if(null == this.activityWinRef){
         this.activityWinRef = Ext.create('WebOs.Component.Window', {
            title : this.LANG_TEXT.WIN_TITLE,
            bodyPadding : 10,
            autoShow : true,
            closeAction : 'hide',
            items : [{
                  xtype : 'form',
                  items : [{
                        xtype : 'textfield',
                        fieldLabel : this.LANG_TEXT.FIELDS.NAME,
                        labelWidth : 80,
                        name : 'text',
                        allowBlank : false,
                        listeners : {
                           afterrender : function (txt){
                              this.activityTxtRef = txt;
                           },
                           scope : this
                        }
                     }, {
                        xtype : 'hiddenfield',
                        name : 'id'
                     }],
                  listeners : {
                     afterrender : function (form){
                        this.formRef = form;
                        if(data){
                           this.formRef.getForm().setValues(data);
                        }
                     },
                     scope : this
                  }
               }],
            buttons : [{
                  text : BTN.SAVE,
                  listeners : {
                     click : function (){
                        if(this.formRef.isValid()){
                           this.activityWinRef.setLoading(this.LANG_TEXT.MSG.SAVING);
                           if(data){
                              var values = this.formRef.getValues();
                              this.appRef.updateActivity(values, function (response){
                                 this.activityWinRef.loadMask.hide();
                                 this.activityWinRef.close();
                                 if(!response.status){
                                    Cntysoft.Kernel.Utils.processApiError(response);
                                 } else{
                                    this.categoryTreeRef.getStore().reload();
                                 }
                              }, this);
                           } else{
                              var value = this.activityTxtRef.getValue();
                              this.appRef.addActivity({'text' : value}, function (response){
                                 this.activityWinRef.loadMask.hide();
                                 this.activityWinRef.close();
                                 if(!response.status){
                                    Cntysoft.Kernel.Utils.processApiError(response);
                                 } else{
                                    this.categoryTreeRef.getStore().reload();
                                 }

                              }, this);
                           }
                        }
                     },
                     scope : this
                  }
               }, {
                  text : BTN.CLOSE,
                  listeners : {
                     click : function (btn){
                        this.activityWinRef.close();
                     },
                     scope : this
                  }
               }],
            listeners : {
               afterrender : function (win){
                  this.activityWinRef = win;
               },
               scope : this
            }
         });
      }

      if(this.activityWinRef.rendered){
         if(data){
            this.formRef.getForm().setValues(data);
         }
      }
      return this.activityWinRef;
   },
   
   destroy : function ()
   {
      if(this.activityWinRef){
         this.activityWinRef.destroy();
         delete this.activityWinRef;
      }
      if(this.activityContextMenuRef){
         this.activityContextMenuRef.destroy();
         delete this.activityContextMenuRef;
      }
      if(this.rootContextMenuRef){
         this.rootContextMenuRef.destroy();
         delete this.rootContextMenuRef;
      }
      if(this.categoryTreeRef){
         this.categoryTreeRef.destroy();
         delete this.categoryTreeRef;
      }
      this.callParent();
   }
});

