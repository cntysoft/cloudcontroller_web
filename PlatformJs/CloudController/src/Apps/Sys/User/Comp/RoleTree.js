/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 角色树面板
 */
Ext.define('App.Sys.User.Comp.RoleTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.appsysusercomproletree',
    requires: [
        'SenchaExt.Tree.DisableNodePlugin'
    ],
    mixins : {
        fcm : 'Cntysoft.Mixin.ForbidContextMenu',
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    /**
     * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Sys.User',
    plugins : [{
        ptype : 'nodedisabled'
    }],
    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('COMP.ROLE_TREE');
        this.applyConstraintConfig(config);
        this.callParent([config]);
        this.mixins.fcm.forbidContextMenu.call(this);
    },
    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            title : this.LANG_TEXT.TITLE,
            useArrows : true,
            border : true
        });
    },

    initComponent : function()
    {
        Ext.apply(this, {
            store : this.createTreeStore()
        });
        this.addListener({
            afterrender : function(){
                this.getRootNode().expand();
            },
            scope : this
        });
        this.callParent();
    },

    createTreeStore : function()
    {
        return new Ext.data.TreeStore({
            listeners : {
                load : this.setupNodeRecordsHandler,
                scope : this
            },
            root : {
                text : this.LANG_TEXT.ROOT,
                id : 0
            },
            fields : [
                {name : 'text', type : 'string', persist : false},
                {name : 'type', type : 'integer', persist : false},
                {name : 'id', type : 'string', persist : false},
                {name : 'name', type : 'string', persist : false}
            ],
            nodeParam : 'id',
            proxy : {
                type : 'apigateway',
                callType : 'App',
                invokeMetaInfo : {
                    module : 'Sys',
                    name : 'User',
                    method : 'RoleMgr/getRoleList'
                },
                reader : {
                    type : 'json',
                    rootProperty : 'items'
                }
            }
        });
    },

    /**
     * 因为这个API调用得到的数据是GRID用的，所以需要调整
     */
    setupNodeRecordsHandler : function(store,records)
    {
        Ext.each(records, function(record){
            if(1 == record.get('id')){
                record.set('disabled', true);
            }
            record.set('leaf', true);
            record.set('text', record.get('name'));
        });
    },

    destroy : function()
    {
        this.mixins.langTextProvider.destroy.call(this);
        this.callParent();
    }
});