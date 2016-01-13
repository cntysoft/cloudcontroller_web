/*
 * Cntysoft OpenEngine
 * 
 * @author Changwang <chenyongwang1104@163.com>
 * copyright  Copyright (c) 2010-2013 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 投票管理程序
 */
Ext.define('App.Sys.MetaInfo.Widget.KvDict', {
    extend : 'WebOs.Kernel.ProcessModel.AbstractWidget',
    requires : [
        'App.Sys.MetaInfo.Ui.KvDict.DictTypeTreePanel',
        'App.Sys.MetaInfo.Ui.KvDict.MapEditor'
    ],
   mixins: {
      multiTabPanel: 'SenchaExt.Mixin.MultiTabPanel'
   },
    /**
     * {@link Cntysoft.Mixin.MultiTabPanel#initPanelType initPanelType}
     */
    initPanelType : 'MapEditor',
    /**
     * {@link Cntysoft.Mixin.MultiTabPanel#panelClsMap panelClsMap}
     */
    panelClsMap : {
        MapEditor : 'App.Sys.MetaInfo.Ui.KvDict.MapEditor',
        MapItemsEditor : 'App.Sys.MetaInfo.Ui.KvDict.MapItemsEditor'
    },
    /**
     * @param {App.General.AttachmentManager.Ui.KvDict.DictTypeTreePanel} typeTree
     */
    typeTree : null,
    /**
     * 构造函数
     */
    constructor : function(config)
    {
        this.mixins.multiTabPanel.constructor.call(this);
        this.callParent([config]);
        this.pmText = this.GET_PM_TEXT('KVDICT');
    },
    /**
     * @inheritdoc
     */
    applyConstraintConfig : function(config)
    {
        this.callParent([config]);
        Ext.apply(config, {
            width : 1000,
            minWidth : 900,
            minHeight : 450,
            height : 450,
            resizable : true,
            maximizable : false,
            bodyStyle : {
                background : '#ffffff'
            },
            layout : {
                type : 'border'
            }
        });
    },
    /**
     * @inheritdoc
     */
    initComponent : function()
    {
        Ext.apply(this, {
            items : [this.getDictTypeTreeConfig(), this.getTabPanelConfig()]
        });
        this.callParent();
    },
    initLangTextRef : function()
    {
        this.LANG_TEXT = this.GET_LANG_TEXT('KVDICT_MANAGER');
    },
    panelExistHandler : function(panel, config)
    {
        if(panel.panelType == 'MapEditor'){
            if(config.mode == 1){
                panel.gotoNewMode();
            } else if(config.mode == 2){
                if(!Ext.isDefined(config.targetMapKey)){
                    Cntysoft.raiseError(
                    Ext.getClassName(this),
                    'panelExistHandler',
                    'goto modify model Map editor targetMapKey parameter'
                    );
                }
                panel.loadMapData(config.targetMapKey);
            }
        }else if(panel.panelType == 'MapItemsEditor'){
            panel.loadDictItems(config.dictKey);
        }
    },
    actionRequestHandler : function(code, record, tree)
    {
        var MAP = Ext.getClass(tree).A_MAP;
        if(MAP.MODIFY_MAP == code){
            this.renderPanel('MapEditor', {
                mode : 2,
                targetMapKey : record.get('key')
            });
        }else if(MAP.DELETE == code){
            Cntysoft.showQuestionWindow(Ext.String.format(this.LANG_TEXT.DELETE_MAP_ASK, record.get('text')), function(bid){
                if(bid == 'yes'){
                    this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.OP'));
                    this.appRef.removeKvMap(record.get('key'), function(response){
                        this.loadMask.hide();
                        if(!response.status){
                            Cntysoft.Kernel.Utils.processApiError(response);
                        }else{
                            var store = this.typeTree.store;
                            record.remove();
                            var root = store.getRootNode();
                            if(root.firstChild){
                                this.renderPanel('MapItemsEditor',{
                                   dictKey :  root.firstChild.get('key')
                                });
                                this.typeTree.selectPath('/root/'+root.firstChild.get('key'), 'key');
                            }else{
                                this.renderPanel('MapEditor',{
                                    mode : 1
                                });
                            }
                        }
                    }, this);
                }
            }, this);
        }else if(MAP.ADD == code){
             this.renderPanel('MapEditor', {
                mode : 1
            });
        }
    },
    /**
     * 获取字典类型树管理面板
     */
    getDictTypeTreeConfig : function()
    {
        return {
            xtype : 'sysmetainfokvdicttypetree',
            width : 300,
            region : 'west',
            border : true,
            margin : '0 1 0 0',
            listeners : {
                actionrequest : this.actionRequestHandler,
                itemclick : function(tree, record)
                {
                    if(!record.isRoot()){
                        this.renderPanel('MapItemsEditor', {
                            dictKey : record.get('key')
                        });
                    }
                    
                },
                afterrender : function(view){
                    this.typeTree = view;
                    view.getRootNode().expand();
                },
                scope : this
            }
        };
    },
    destroy : function()
    {
        if(this.loadMask){
            this.loadMask.destroy();
            delete this.loadMask;
        }
        delete this.typeTree;
        this.mixins.multiTabPanel.destroy.call(this);
        this.callParent();
    }
});