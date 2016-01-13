/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 抽象节点设置面板
 */
Ext.define('App.Site.Category.Ui.Structure.AbstractSettingPanel', {
   extend: 'Ext.tab.Panel',
   requires: [
      'Cntysoft.Kernel.Utils',
      'WebOs.Component.Uploader.SimpleUploader'
   ],
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider',
      formTooltip : 'Cntysoft.Mixin.FormTooltip'
   },
   /*
    * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.Site.Category',
   /*
    * 设置面板的类型名称，这个在APP中生成Panel的时候使用
    *
    * @property {String} settingPanelType
    */
   settingPanelType : null,
   /*
    * @private
    */
   isFirstModeChange : true,
   /*
    * @private
    * @property {App.Site.Category.Comp.CategoryTreeField} categoryTreeFieldRef
    */
   categoryTreeFieldRef : null,
   /*
    * 处理ID字段
    *
    * @private
    * @property {Ext.form.field.Text} idFieldRef
    */
   idFieldRef : null,
   /*
    * 当前加载的节点数据, 这个数据是节点数据表的储存的数据
    *
    * @property {Object} currentLoadedNode
    */
   currentLoadedNode : null,
   /*
    * 当前操作的父节点ID, 这个属性在数据保存之后刷新左边的导航树很重要
    *
    * @param {Object} currentData
    */
   currentData : null,
   /*
    * 编辑模式 全新的模式 修改模式
    *
    * @property {Integer} mode
    */
   mode : null,
   /*
    * 点击节点树时候的节点记录对象
    *
    * @property {Object} node
    */
   node : null,
   /*
    * 点击上传栏目图片按钮的时候，用于缓存图片上传器
    *
    * @property {Cntysoft.Component.Uploader} uploadImageWinRef
    */
   uploadImageWinRef : null,
   /*
    * @property {Array} fileRefs
    */
   fileRefs : null,

   nodePicUrl : null,

   constructor : function(config)
   {
      this.COMMON_TEXT = this.GET_LANG_TEXT('STRUCTURE.COMMON');
      var M = App.Site.Category.Widget.Structure;
      //检查模式是否支持
      if(!Ext.Array.contains(M.getSupportModes(), config.mode)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'constructor',
            'mode : ' + mode + ' is not supported'
         );
      }
      if(config.mode == WebOs.Const.MODIFY_MODE){
         if(!Ext.isDefined(config.nodeId) || !Ext.isNumber(config.nodeId)){
            Ext.Error.raise({
               cls : 'App.Site.Category.Ui.Structure.AbstractSettingPanel',
               method : 'constructor',
               msg : 'mode is modify, so you must set node id'
            });
         }
      }
      this.callParent([config]);
   },

   initComponent : function()
   {
      Ext.apply(this, {
         items : this.getFormConfig()
      });
      this.addListener({
         afterrender : this.stateHandler,
         scope : this
      });
      this.callParent();
   },
   /*
    * 初始化节点添加面板的标题，状态不一样标题就不一样
    */
   initPanelTitle : function()
   {
      var TITLE_TYPE = this.COMMON_TEXT.TITLE_TYPE;
      if(this.mode == CloudController.Const.NEW_MODE){
         this.setTitle(this.getTypeText() + TITLE_TYPE.ADD);
      }
   },

   /*
    * 进入编辑模式
    */
   gotoModifyMode : function()
   {
      var C = CloudController.Const;
      var form;
      //this.resetTipLabel();
      if(C.MODIFY_MODE == this.mode && !this.isFirstModeChange){
         return;
      }
      if(this.settingPanelType == 'GeneralPanel'){
         form = this.basicSettingPanel;
      } else{
         form = this.down('form');
      }
      this.idFieldRef.show();
      this.idFieldRef.setDisabled(false);
      this.idFieldRef.setFieldStyle({
         color : 'red'
      });
      this.mode = C.MODIFY_MODE;
      this.isFirstModeChange = false;
   },

   /*
    * @return {Object}
    */
   getDefaultValues : Ext.emptyFn,

   /*
    * 渲染后首次刷新数据
    */
   stateHandler : function()
   {
      if(this.mode == CloudController.Const.NEW_MODE){
         this.currentLoadedNode = this.getDefaultValues();
         //这个修改不是很确定
         if(this.hasListeners.nodeloaded){
            this.fireEvent('nodeloaded', this.currentLoadedNode);
         }
         this.setValues(this.currentLoadedNode, true);
         this.gotoNewMode();
         return;
      }
      this.setLoading(this.COMMON_TEXT.MSG.LOAD_NODE);
      //如果不是添加新的节点 那么我们需要加载数据
      this.appRef.loadNode(this.nodeId, this.loadNodeHandler, this);

   },

   /*
    * 加载节点数据
    *
    * @param {Int} 要加载节点的id
    */
   load : function(id)
   {
      if(!this.$_loading_$){
         this.$_loading_$ = true;
         if(null != this.currentLoadedNode && id == this.currentLoadedNode.id){
            //一样的数据 不加载
            return;
         }
         this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
         this.appRef.loadNode(id, this.loadNodeHandler, this);
      }
   },

   /*
    * @param {Object} response
    */
   loadNodeHandler : function(response)
   {
      if(!this.isDestroyed){
         var form = this.down('form');
         var cTree;
         var data;
         this.$_loading_$ = false;
         this.loadMask.hide();
         if(response.status){
            data = response.data;
            this.nodeType = data.nodeType;
            this.fileRefs = data.fileRefs;
            this.nodePicUrl = data.nodePicUrl;
            data['nodePicUrl'] = this.nodePicUrl[0];
            form.getForm().setValues(data);
            cTree = this.categoryTreeFieldRef;
            cTree.setRawValue(data.parentNodeText);
            cTree.setExpandPath(data.treePath);
            //设置当前加载的对象
            this.currentLoadedNode = data;
            this.gotoModifyMode();
         } else{
            Cntysoft.Kernel.Utils.processApiError(response);
         }
      }
   },

   /*
    * 给表单赋值
    */
   setValues : function(data, isForce)
   {
      this.down('form').getForm().setValues(data);
   },

   /*
    * 进入新添加模式
    */
   gotoNewMode : function()
   {
      var C = CloudController.Const;
      var form = this.formPanelRef;
      form.getForm().reset();
      if(C.MODIFY_MODE == this.mode || C.NEW_MODE == this.mode && !this.idFieldRef.isHidden()){
         this.idFieldRef.setDisabled(true);
         this.idFieldRef.hide();
      }
      this.setupCategoryField();
      this.resetTipLabel();
      this.currentLoadedNode = null;
      this.mode = C.NEW_MODE;
   },

   /*
    * 进行数据保存
    */
   doSave : function(nodeType)
   {
      var formPanel = this.formPanelRef;
      var form = formPanel.getForm();
      var data;
      var C = CloudController.Const;
      if(form.isValid()){
         data = form.getValues();
         data.pid = formPanel.down('sitecategorycompcategorycombo').getValue();
         data.nodeType = nodeType;
         data.fileRefs = this.fileRefs;
         data.nodePicUrl = this.nodePicUrl;
         this.currentData = data;
         var SAVE_MSG = Cntysoft.GET_LANG_TEXT('MSG.SAVE');
         if(this.mode == C.MODIFY_MODE){
            Cntysoft.showQuestionWindow(this.COMMON_TEXT.MSG.SAVE_ASK, function(btn){
               if(btn == 'yes'){
                  this.setLoading(SAVE_MSG);
                  this.appRef.saveNode(data, this.afterSaveNodeHandler, this);
               }
            }, this);
         } else if(this.mode == C.NEW_MODE){
            this.setLoading(SAVE_MSG);
            this.appRef.addNode(data, this.afterSaveNodeHandler, this);
         }
      }
   },

   afterSaveNodeHandler : function(response)
   {
      var categoryTree = this.mainPanelRef.treePanelRef;
      var C = CloudController.Const;
      this.loadMask.hide();
      if(!response.status){
         Cntysoft.Kernel.Utils.processApiError(response, this.GET_LANG_TEXT('ERROR_TYPE'), {
            'Cntysoft/Kernel/StdErrorType' : {
               38 : [response.msg]
            }
         });
      } else{
         var MSG = this.COMMON_TEXT.MSG;
         Cntysoft.showAlertWindow(MSG.SAVE_OK, function(){
            //刷新节点
            this.mainPanelRef.reloadCategoryNode(this.currentData.pid, function(){
               var id = response.data.id;
               if(C.NEW_MODE == this.mode){
                  this.node = this.mainPanelRef.treePanelRef.store.getNodeById(id);
                  this.load(id);
               }
            }, this);
            if(C.MODIFY_MODE == this.mode){
               //需要获取正确的nodePath
               //这里只能进行一次调用指定节点
               this.loadMask.show();
               this.appRef.loadNode(this.currentData.id, function(response){
                  this.loadMask.hide();
                  if(response.status){
                     this.currentLoadedNode = response.data;
                     this.resetTipLabel();
                     categoryTree.selectPath(response.data.treePath + '/' + this.currentData.id);
                  }
               }, this);
            }
         }, this);
      }
   },

   setupCategoryField : function()
   {
      var tree;
      var node = this.parentNode;
      if(this.settingPanelType == 'GeneralPanel'){
         tree = this.basicSettingPanelRef.down('sitecategorycompcategorycombo');
      } else{
         tree = this.categoryTreeFieldRef;
      }
      tree.setRawValue(node.get('text'));
      tree.setValue(node.get('id'));
      tree.setExpandPath(Cntysoft.Kernel.Utils.getTreePath(node));
   },

   /*
    * 重置栏目标示符的提示信息
    */
   resetTipLabel : function()
   {
      var label = this.down('label');
      label.setText('');
   },

   /*
    * 检查栏目标识符按钮点击事件
    */
   checkNodeIdentifierClickHandler : function(btn)
   {
      var needCheck;
      var container = btn.up('fieldcontainer');
      var label = container.down('label');
      var field = container.down('textfield');
      var identifier = field.getValue();
      var LABEL = this.COMMON_TEXT.LABEL.TIP_LABEL;
      var C = CloudController.Const;
      //先判断是否需要检查，当不需要的时候提示原因
      if(C.NEW_MODE == this.mode){
         if(!Ext.isEmpty(identifier)){
            needCheck = true;
         } else{
            needCheck = false;
            label.setText(LABEL.EMPTY_IDENTIFIER);
         }
      } else{
         var oldIdentifier = this.currentLoadedNode.nodeIdentifier;
         if(identifier.toLowerCase() != oldIdentifier.toLowerCase()){
            needCheck = true;
         } else{
            needCheck = false;
            label.setText(LABEL.NOT_DIRTY);
         }
      }

      if(needCheck){
         label.setText(LABEL.CHECKING);
         this.appRef.checkNodeIdentifier(identifier, function(response){
            if(response.status){
               var data = response.data;
               if(data.exist){
                  label.setText(LABEL.EXIST);
                  field.markInvalid(LABEL.EXIST);
               } else{
                  label.setText(LABEL.NOT_EXIST);
               }
            }else{
               Cntysoft.processApiError(response);
            }

         }, this);
      }
   },

   /*
    * 获取底部操作配置对象
    */
   getBBarConfig : function()
   {
      var B_TEXT = Cntysoft.GET_LANG_TEXT('UI.BTN');
      return {
         xtype : 'container',
         layout : {
            type : 'hbox',
            pack : 'end'
         },
         padding : '2 0 2 0',
         defaults : {
            xtype : 'button',
            width : 80,
            margin : '0 2 0 0'
         },
         items : [{
            text : B_TEXT.SAVE,
            listeners : {
               click : this.saveHandler,
               scope : this
            }
         }, {
            text : B_TEXT.CANCEL,
            listeners : {
               click : this.cancelHandler,
               scope : this
            }
         }]
      };
   },

   cancelHandler : function()
   {
      Cntysoft.showQuestionWindow(this.COMMON_TEXT.MSG.CANCEL_EDIT,function(btn){
         if(btn == 'yes'){
            this.gotoStartup();
         }
      }, this);
   },

   /*
    * 在当前的页面显示起始信息页
    */
   gotoStartup : function()
   {
      this.mainPanelRef.gotoStartupPanel();
   },

   /*
    * 获取ID节点配置对象
    *
    * @return {Object}
    */
   getIdNodeConfig : function()
   {
      var L = this.COMMON_TEXT;
      return  {
         xtype : 'textfield',
         fieldLabel : L.LABEL.ID,
         width : 300,
         name : 'id',
         height : 25,
         readOnly : true,
         hidden : true,
         disabled : true,
         toolTipText : L.TOOLTIP.ID,
         listeners : {
            afterrender : function(comp)
            {
               this.idFieldRef = comp;
            },
            scope : this
         }
      };
   },

   /*
    * 获取简单上传对象配置对象
    *
    * @return {Object}
    */
   getUploaderConfig : function()
   {
      var STD_PATH = WebOs.Kernel.StdPath;
      var basePath = STD_PATH.getStdUploadPath();
      return {
         xtype : 'webossimpleuploader',
         uploadPath : basePath,
         createSubDir : true,
         enableFileRef : true,
         fileTypeExts : ['gif','png','jpg','jpeg'],
         margin : '0 0 0 5',
         maskTarget : this,
         buttonText : this.COMMON_TEXT.LABEL.UPLOAD_NODE_PIC_BTN,
         listeners : {
            fileuploadsuccess : this.uploadSuccessHandler,
            scope : this
         }
      };
   },

   /*
    * 图片上传成功响应函数
    *
    */
   uploadSuccessHandler : function (file, btn)
   {
      var picText = btn.previousSibling('textfield');
      picText.setValue(file[0].filename);
      this.nodePicUrl = [file[0].filename, file[0].rid];
      this.fileRefs = parseInt(file[0].rid);
   },

   /*
    * 获取窗口当前的类型 全新还是编辑
    *
    * @return {String}
    */
   getTypeText : Ext.emptyFn,

   destroy : function()
   {
      delete this.LANG_TEXT;
      delete this.COMMON;
      delete this.mainPanelRef;
      delete this.idFieldRef;
      delete this.categoryTreeFieldRef;
      this.callParent();
   }

});