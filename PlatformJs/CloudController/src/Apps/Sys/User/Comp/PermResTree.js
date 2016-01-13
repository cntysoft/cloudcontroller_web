/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 系统权限树
 */
Ext.define('App.Sys.User.Comp.PermResTree', {
    extend: 'Ext.tree.Panel',
    mixins: {
        fcm: 'Cntysoft.Mixin.ForbidContextMenu',
        langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
    },
    requires: [
        'SenchaExt.Data.TreeStore',
        'Cntysoft.Kernel.Utils'
    ],

    inheritableStatics : {
        N_TYPE : {
            R_APP_NODE : 1,
            R_RESOURCE_NODE : 2,
            R_MODULE_NODE : 3
        },
        TREE_T_VIEW : 0,
        TREE_T_GRANT : 1
    },

    /**
     * @property {Ext.menu.Menu} contextMenuRef 操作上下文菜单
     */
    contextMenuRef : null,
    /**
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Sys.User',
    /**
     * 权限树的类型， 默认为授权查看树
     *
     * @property {Integer} treeViewType
     */
    treeViewType : 0,
    /**
     * @property {Integer} roleId
     */
    roleId : null,

    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('COMP.PERM_RES_TREE');
        Ext.apply(config, {
            store : this.createTreeStore()
        });
        this.callParent([config]);
        this.applyConstraintConfig(config);
        this.mixins.fcm.forbidContextMenu.call(this);
    },
    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            useArrows : true,
            frame : false,
            bodyPadding : 3
        });
    },

    initComponent : function()
    {
        //检查参数
        if(this.treeViewType == this.self.TREE_T_GRANT && null == this.roleId){
            Cntysoft.raiseError(
                Ext.getClassName(this),
                'initComponent',
                'tree view type is grant, but role id is null'
            );
        }
        this.addListener({
            afterrender : this.loadTreeDataHandler,
            scope : this
        });
        this.callParent();
    },

    /**
     * @return {Cntysoft.Kernel.CoreComp.Data.TreeStore}
     */
    createTreeStore : function()
    {
        return new SenchaExt.Data.TreeStore({
            fields : [
                {name : 'text', type : 'string', persist : false},
                {name : 'type', type : 'integer', persist : false},
                {name : 'id', type : 'string', persist : false},
                {name : 'key', type : 'string', persist : false},
                {name : 'module', type : 'string', persist : false},
                {name : 'detailPermission', type : 'auto', persist : false},
                {name : 'hasDetail', type : 'boolean', persist : false},
                {name : 'detailSetter', type : 'string', persist : false}
            ],
            nodeParam : 'id'
        });
    },

    loadTreeDataHandler : function()
    {
        this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
        this.appRef.getAuthorizeTreeNodes(this.treeViewType, this.roleId, function(response){
            if(response.status){
                this.loadMask.hide();
                this.store.setRootNode({
                    id : 0,
                    text : this.LANG_TEXT && this.LANG_TEXT.ROOT,
                    expanded : true,
                    children : response.data
                });
                this.setupNodeRecordsHandler(this.store.getRootNode());
            } else{
                Cntysoft.Kernel.Utils.processApiError(response);
            }
        }, this);
    },

    /**
     * @param {Ext.data.Model} record
     */
    setupNodeRecordsHandler : function(record)
    {},

    /**
     * 遍历树节点的时候采取的处理器
     *
     * @template
     * @param {Object} node
     */
    traverTreeNodeHandler : Ext.emptyFn,

    destroy : function()
    {
        this.mixins.langTextProvider.destroy.call(this);
        delete this.appRef;
        if(this.contextMenuRef){
            this.contextMenuRef.destroy();
            delete this.contextMenuRef;
        }
        this.callParent();
    }
});