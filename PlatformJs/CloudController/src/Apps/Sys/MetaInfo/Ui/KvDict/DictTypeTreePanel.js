/*
 * Cntysoft OpenEngine
 * 
 * @author Changwang <chenyongwang1104@163.com>
 * copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 映射种类管理树
 */
Ext.define('App.Sys.MetaInfo.Ui.KvDict.DictTypeTreePanel', {
    extend : 'Ext.tree.Panel',
    alias : 'widget.sysmetainfokvdicttypetree',
    requires : [
      'SenchaExt.Data.Proxy.ApiProxy',
      'SenchaExt.Tree.DisableNodePlugin',
      'SenchaExt.Data.TreeStore'
    ],
    mixins : {
        fcm : 'Cntysoft.Mixin.ForbidContextMenu',
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    statics : {
        A_MAP : {
            ADD : 1,
            DELETE : 2,
            MODIFY_MAP: 3
        }
    },
    /**
     * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
     * 
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Sys.MetaInfo',
    /**
     * @private
     * @property {Ext.menu.Menu} contextMenu
     */
    contextMenu : null,
    /**
     * 构造函数
     */
    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('KVDICT_MANAGER.TREE_PANEL');
        this.applyConstraintConfig(config);
        this.callParent([config]);
        this.mixins.fcm.forbidContextMenu.call(this);
    },
    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            title : this.LANG_TEXT.TITLE,
            useArrows : true,
            frame : false
        });
    },
    initComponent : function()
    {
        Ext.apply(this,{
           store : this.createTreeStore(),
           autoScroll : true
        });
        this.addListener('itemcontextmenu', this.contextMenuClickHandler, this);
        this.addListener({
            beforeselect : function(tree, record)
            {
                if(record.isRoot()){
                    return false;
                }
            },
           scope : this 
        });
        this.callParent();
    },
    
    createTreeStore : function()
    {
        return new SenchaExt.Data.TreeStore({
            root : {
                text : this.LANG_TEXT.ROOT,
                key : 'root'
            },
            fields : [
                {name : 'text', type : 'string', persist : false},
                {name : 'key', type : 'string', persist : false}
            ],
            nodeParam : 'key',
            proxy : {
                type : 'apigateway',
                callType : 'App',
                invokeMetaInfo : {
                    module : 'Sys',
                    name : 'MetaInfo',
                    method : 'KvDict/getAllKvDictMaps'
                },
                onDataReady : this.setupTreeNodesHandler,
                reader : {
                    type : 'json',
                    rootProperty : 'items'
                }
            }
        });
    },
    /**
     * @return {Ext.menu.Menu}
     */
    getContextMenu : function(record)
    {
        var M = this.LANG_TEXT.MENU;
        var item;
        var A_MAP = this.self.A_MAP;
        if(record.isRoot()){
            item = {
                text : M.ADD,
                code : A_MAP.ADD
            };
        }else{
            item = [{
                    text : M.MODIFY_MAP,
                    code : A_MAP.MODIFY_MAP
            },{
                text : M.DELETE,
                code : A_MAP.DELETE
            }];
        }
        if(null == this.contextMenu){
            this.contextMenu = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : item,
                listeners : {
                    click : function(menu, item)
                    {
                        if(this.hasListeners.actionrequest){
                            this.fireEvent('actionrequest', item.code, menu.record, this);
                        }
                    },
                    scope : this
                }
            });
        }else{
            this.contextMenu.removeAll();
            this.contextMenu.add(item);
        }
        return this.contextMenu;
    },
    /**
     * 处理节点右键点击
     * 
     * @param {Ext.view.View} tree
     * @param {Ext.data.Model} record
     */
    contextMenuClickHandler : function(tree, record, item, index, e)
    {
        var menu = this.getContextMenu(record);
        var pos = e.getXY();
        menu.record = record;
        menu.showAt(pos[0], pos[1]);
        e.stopEvent();
    },
    /**
     * 设置nodes数据
     */
    setupTreeNodesHandler : function(data)
    {
        var len = data.length;
        var ret = [];
        var item;
        for(var i = 0; i < len; i++){
            item = data[i];
            ret.push({
                leaf : true,
                text : item.name,
                key : item.key
            });
        }
        return ret;
    },
    destroy : function()
    {
        this.mixins.langTextProvider.destroy.call(this);
        this.callParent();
    }
});