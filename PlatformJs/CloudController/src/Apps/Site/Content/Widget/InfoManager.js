/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 内容管理窗口
 */
Ext.define('App.Site.Content.Widget.InfoManager', {
   extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires : [
      'Ext.layout.container.Border',
      'App.Site.Content.Ui.Im.CategoryTree',
      'WebOs.Component.CkEditor.Editor'
   ],
   mixins: {
      multiTabPanel : 'SenchaExt.Mixin.MultiTabPanel'
   },

   panelClsMap : {
      Startup : 'App.Site.Content.Ui.Im.Startup',
      ListView : 'App.Site.Content.Ui.Im.ListView'
   },


   /*
    * 初始的面板类型
    *
    * @property {String} initPanelType
    */
   initPanelType : 'ListView',
   /*
    * 当前打开的所有的信息编辑器列表
    *
    * @private
    * @property {App.Site.CmMgr.Lib.Editor.AbstractEditorr[]} editors
    */
   editors : [],
   initPmTextRef : function()
   {
      this.pmText = this.GET_PM_TEXT('INFO_MANAGER');
   },

   initLangTextRef : function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('INFO_MANAGER');
   },
   /*
    * @template
    * @inheritdoc
    */
   applyConstraintConfig : function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         title : this.LANG_TEXT.TITLE,
         width : 1100,
         minWidth : 1100,
         minHeight : 500,
         height : 500,
         resizable : true,
         layout : {
            type : 'border'
         },
         maximizable : true
      });
   },

   initComponent : function()
   {
      var CONST = App.Site.Content.Lib.Const;
      this.initPanelConfig = {
         title : this.GET_LANG_TEXT('UI.IM.INFO_LIST_VIEW.PANEL_TITLE_ALL'),
         loadId : CONST.INFO_M_ALL,
         appRef : this.appRef
      };
      Ext.apply(this,{
         items : [{
            xtype : 'sitecontentuiimcategorytree',
            width : 250,
            region : 'west',
            margin : '0 1 0 0',
            collapsible : true,
            border : false,
            rootVisible : true,
            listeners : {
               itemclick : this.treeNodeLeftClickHandler,
               menuitemclick : this.treePanelMenuClickHandler,
               scope : this
            },
            mainWidgetRef : this
         },this.getTabPanelConfig()]
      });
      this.addListener({
         beforeclose : this.breforeDestroyHandler,
         scope : this
      });
      this.callParent();
   },


   /*
    * 根据内容模型的识别ID获取信息编辑器
    *
    * @param {Number} modelId 系统支持的内容模型
    * @param {Object} config 传递给编辑器的配置对象
    * @param {Function} callback 编辑器实例化完成的回调函数
    * @param {Object} scope 回调函数作用域
    */
   getEditor : function(modelId, config, callback, scope)
   {
      var editorCls;
      config = config || {};
      callback = Ext.isFunction(callback) ? callback : Ext.emptyFn;
      scope = scope ? scope : this;
      //获取环境模型编辑器映射
      //APP间通信
      this.setLoading(this.GET_LANG_TEXT('LOAD_CE_MAP'));
      this.appRef.getModelEditorMap(function(response){
         this.loadMask.hide();
         if(!response.status){
            Cntysoft.processApiError(response);
         }else{
            if(!Ext.isDefined(config.mode) || !Ext.Array.contains([
                  CloudController.Const.NEW_MODE,
                  CloudController.Const.MODIFY_MODE
               ], config.mode)){
               Cntysoft.raiseError(
                  Ext.getClassName(this),
                  'loadEditor',
                  'editor mode type is not supported'
               );
            }
            editorCls = [
               'App.Site.CmMgr.Lib.Editor',
               response.data[modelId]
            ].join('.');
            Ext.apply(config, {
               cmAppRef : this.appRef
            });
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD_SCRIPT'));
            config.modelId = modelId;
            Ext.require(editorCls, function(){
               this.loadMask.hide();
               var win = Ext.create(editorCls, config);
               callback.call(scope, win);
               this.editors.push(win);
            }, this);
         }
      }, this);
   },

   /*
    * 删除列表管理前，在这个函数里判断是否有编辑器没有关闭
    *
    * @private
    */
   breforeDestroyHandler : function()
   {
      var len = this.editors.length;
      var editors = this.editors;
      var flag = true;
      for(var i = 0; i < len; i++) {
         if(!editors[i].isDestroyed){
            flag = false;
         }
      }
      if(!flag){
         Cntysoft.showAlertWindow(this.LANG_TEXT.MSG.CLOSE_WINDOW);
      }
      return flag;
   },

   /*
    * 处理树节右键菜单点击
    * `回收站管理 和 浏览节点 选项没有效果`
    * 
    * @private
    */
   treePanelMenuClickHandler : function(isModelItem, actionCode, modelInfo, record)
   {
      if(isModelItem){
         //暂时这样写，将来再改
         if(0 == actionCode){
            ///系统是通过modelKey识别编辑器的
            this.getEditor(modelInfo.id, {
               mode : CloudController.Const.NEW_MODE,
               autoShow : true,
               targetNode : record,
               listeners : {
                  saverequest : this.infoSaveRequestHandler,
                  scope : this
               }
            });
         } else{
            var modelId = modelInfo.id;
            var nodeId = record.get('id');
            var title = record.get('text');
            this.renderPanel('ListView', {
               title : title,
               loadId : nodeId,
               infoType : modelId,
               appRef : this.appRef
            });
         }
      }
   },

   /*
    * 编辑器保存请求处理器
    *
    * @param {Object} data
    * @param {Number} mode 编辑器的状态
    * @param {App.Site.CmMgr.Lib.Editor.AbstractEditor} editor
    */
   infoSaveRequestHandler : function(data, mode, editor)
   {
      editor.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
      this.appRef.saveInfo(data, function(response){
         editor.loadMask.hide();
         if(!response.status){
            Cntysoft.processApiError(response, this.GET_LANG_TEXT('ERROR_MAP'));
         }else{
            if(mode == CloudController.Const.NEW_MODE){
               data.id = response.data.id;
            }
            this.afterSaveHandler(editor, data, editor.targetNode);
         }
      }, this);
   },

   /*
    * 信息编辑器保存信息之后回调函数
    *
    * @protected
    */
   afterSaveHandler : function(editor, data, node)
   {
      var listView = this.tabPanelRef.getActiveTab();
      if(listView.loadId == data.nodeId){
         listView.setNeedReload();
      } else{
         var type = listView.infoType;
         this.down('sitecontentuiimcategorytree').getView().getSelectionModel().select(node);
         this.renderPanel('ListView', {
            title : node.get('text'),
            loadId : node.get('id'),
            infoType : type,
            appRef : this.appRef
         });
      }
      Cntysoft.showInfoMsgWindow(Cntysoft.GET_LANG_TEXT('MSG.SAVE_OK'), function(){
         if(editor.reOpenForModify()){
            this.getEditor(editor.modelId, {
               autoShow : true,
               mode : CloudController.Const.MODIFY_MODE, //加载内容 编辑模式
               targetLoadId : data.id,
               listeners : {
                  saverequest : function(data, mode, editor){
                     editor.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
                     this.appRef.saveInfo(data, function(response){
                        editor.loadMask.hide();
                        if(!response.status){
                           Cntysoft.processApiError(response);
                        } else{
                           Cntysoft.showInfoMsgWindow(Cntysoft.GET_LANG_TEXT('MSG.SAVE_OK'), function(){
                              Ext.destroy(editor);
                           }, this);
                        }
                     }, this);
                  },
                  scope : this
               }
            });
            return;
         }
         if(!editor.selfDestroy()){
            Ext.destroy(editor);
         }else{
            editor.afterDataSavedHandler(data);
         }
      }, this);
   },

   /*
    * 树节点左键点击
    */
   treeNodeLeftClickHandler : function(view, record)
   {
      var CONST = App.Site.Content.Lib.Const;
      this.renderPanel('ListView', {
         title : record.get('text'),
         loadId : record.get('id'),
         infoType : CONST.INFO_M_ALL,
         appRef : this.appRef
      });
   },

   panelExistHandler : function(activeTab, config)
   {
      var title = config.title;
      activeTab.setTitle(title);
      activeTab.setLoadIdAndType(config.loadId, config.infoType);
   },

   getNewTabObject : function(callback, scope)
   {
      return this.getPanelObject('Startup', {}, callback, scope);
   },

   destroy : function()
   {
      if(this.loadMask){
         this.loadMask.destroy();
         delete this.loadMask;
      }
      Ext.each(this.editors, function(item){
         if(!item.isDestroyed){
            item.destroy();
         }
      });
      delete this.initPanelConfig;
      this.editors = null;
      delete this.editors;
      delete this.tabPanelRef;
      this.mixins.multiTabPanel.destroy.call(this);
      this.callParent();
   }
});