/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Category.Widget.Structure', {
   extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires : [
      'Ext.layout.container.Border',
      'App.Site.Category.Ui.Structure.Startup',
      'App.Site.Category.Ui.Structure.CategoryTree',
      'App.Site.Category.Ui.Structure.SingleTabPanel',
      'App.Site.Category.Ui.Structure.LinkTabPanel'
   ],
   mixins: {
      multiTabPanel : 'SenchaExt.Mixin.MultiTabPanel'
   },

   panelClsMap : {
      SinglePanel : 'App.Site.Category.Ui.Structure.SingleTabPanel',
      LinkPanel : 'App.Site.Category.Ui.Structure.LinkTabPanel',
      GeneralPanel : 'App.Site.Category.Ui.Structure.GeneralTabPanel',
      Startup : 'App.Site.Category.Ui.Structure.Startup'
   },
   statics : {
      /*
       * 获取支持的状态
       *
       * @return {Array}
       */
      getSupportModes : function()
      {
         return [
            CloudController.C.NEW_MODE,
            CloudController.C.MODIFY_MODE
         ];
      }
   },

   /*
    * @property {SenchaExt.Tab.Panel} tabPanelRef
    */
   tabPanelRef : null,
   //private
   treePanelRefRef : null,
   /*
    * {@link SenchaExt.Mixin.MultiTabPanel#initPanelType initPanelType}
    * @property {String} initPanelType
    */
   initPanelType : 'Startup',

   initPmTextRef : function()
   {
      this.pmText = this.GET_PM_TEXT('STRUCTURE');
   },

   initLangTextRef : function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT('STRUCTURE');
   },

   /*
    * @template
    * @inheritdoc
    */
   applyConstraintConfig : function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
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
      Ext.apply(this,{
         items : [
            this.getNodeTreeConifg(),
            this.getTabPanelConfig()
         ]
      });
      this.callParent();
   },

   gotoStartupPanel : function()
   {
      this.renderPanel('Startup');
   },

   /*
    * 重新载入左面板节点树
    */
   reloadCategoryNode : function(pid, callback, scope)
   {
      var tree = this.treePanelRef;
      var store = tree.getStore();
      var node = store.getNodeById(pid) || store.getRootNode();
      var path = node.getPath('id');
      //真他娘的不知道不知道为什么
      tree.on('load', function(){
         tree.expandPath(path, 'id', '/', callback, scope);
      }, this, {
         single : true
      });
      store.load();
   },

   /*
    * 处理Panel类型相同的情况
    */
   panelExistHandler : function(panel, config)
   {
      var activeTab = this.tabPanelRef.getActiveTab();
      var C = CloudController.Kernel.Const;
      if(panel.panelType != 'Startup'){
         var modeType = config.mode;
         var nodeId = config.nodeId;
         //相同的话一般就是设置要重新加载的ID了
         if(modeType == C.MODIFY_MODE){
            activeTab.$_loading_$ = false;
            activeTab.node = config.node;
            activeTab.setTitle(config.title);
            activeTab.load(nodeId);
         } else if(modeType == C.NEW_MODE){
            //如果没有ID则是需要全新添加
            activeTab.parentNode = config.parentNode;
            activeTab.gotoNewMode();
            activeTab.initPanelTitle();
         }
      }
   },

   /*
    * 节点树节点点击处理函数
    */
   nodeClickHandler : function(tree, record)
   {
      //在beforeitemclick事件中处理会影响节点的展开
      var settingPanelType;

      if(record.isRoot()){
         return;
      }
      settingPanelType = this.getPanelKeyByNodeType(record.get('nodeType'));
      this.renderPanel(settingPanelType, {
         appRef : this.appRef,
         nodeId : record.get('id'),
         title : record.get('text'),
         mode : CloudController.C.MODIFY_MODE,
         node : record
      });
   },

   /*
    * 获取左边导航树配置对象
    *
    * @return {Object}
    */
   getNodeTreeConifg : function()
   {
      return {
         xtype : 'sitecategoryuicategorytree',
         width : 250,
         region : 'west',
         margin : '0 1 0 0',
         collapsible : true,
         border : false,
         rootVisible : true,
         listeners : {
            afterrender : function(treePanelRef){
               this.treePanelRef = treePanelRef;
            },
            itemclick : this.nodeClickHandler,
            categorymenuclick : this.categoryMenuClickHandler,
            scope : this
         }
      };
   },
   categoryMenuClickHandler : function(code, node)
   {
      var T = Ext.getClass(this.treePanelRef);
      var MAP = T.AMAP;
      var NODE_TYPE = T.NODE_TYPE;
      var settingPanelType;
      var S_CONST = CloudController.Const;
      switch (code) {
         case MAP.MODIFY_NODE:
            settingPanelType = this.getPanelKeyByNodeType(node.get('nodeType'));
            this.renderPanel(settingPanelType, {
               appRef : this.appRef,
               nodeId : node.get('id'),
               title : node.get('text'),
               node : node,
               mode : S_CONST.MODIFY_MODE
            });
            break;
         case MAP.ADD_GENERAL_NODE:
            settingPanelType = this.getPanelKeyByNodeType(NODE_TYPE.N_TYPE_GENERAL);
            this.renderPanel(settingPanelType, {
               appRef : this.appRef,
               mode : CloudController.Const.NEW_MODE,
               parentNode : node
            });
            break;
         case MAP.ADD_LINK_NODE:
            settingPanelType = this.getPanelKeyByNodeType(NODE_TYPE.N_TYPE_LINK);
            this.renderPanel(settingPanelType, {
               appRef : this.appRef,
               nodeId : node,
               mode : CloudController.Const.NEW_MODE,
               parentNode : node
            });
            break;
         case MAP.ADD_SINGLE_NODE:
            settingPanelType = this.getPanelKeyByNodeType(NODE_TYPE.N_TYPE_SINGLE);
            this.renderPanel(settingPanelType, {
               appRef : this.appRef,
               nodeId : node,
               mode : CloudController.Const.NEW_MODE,
               parentNode : node
            });
            break;
         case MAP.RM_NODE:
            var MSG = this.LANG_TEXT.COMMON.MSG;
            Cntysoft.showQuestionWindow(Ext.String.format(MSG.DELETE_ASK_TPL, node.get('text')), function(id){
               if('yes' == id){
                  this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.OP'));
                  this.appRef.deleteNode({
                     id : node.get('id'),
                     nodeType : node.get('nodeType')
                  },function(response){
                     this.loadMask.hide();
                     if(response.status){
                        Cntysoft.showAlertWindow(Ext.String.format(MSG.DELETE_SUCCESS, node.get('text')));
                        //获取路径
                        this.reloadCategoryNode(node.get('parentId'));
                        this.gotoStartupPanel();
                     } else{
                        Cntysoft.processApiError(response);
                     }
                  }, this);
               }
            }, this);
            break;
         case MAP.VIEW_NODE: //查看节点，这里只是用动态网址
            if(2 == node.get('nodeType')){
               window.open(node.get('linkUrl'));
            }else{
               window.open('/category/' + node.get('id') + '.html');
            }

            break;
      }
   },

   getPanelKeyByNodeType : function(nodeType)
   {
      return this.appRef.getPanelKeyByNodeType(nodeType);
   },

   destroy : function()
   {
      delete this.tabPanelRef;
      delete this.treePanelRef;
      this.callParent();
   }
});