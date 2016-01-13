/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 角色列表字段类定义
 */
Ext.define('App.Sys.User.Comp.RoleGridField', {
    extend : 'Ext.container.Container',
    alias : 'widget.appsysusercomprolegridfield',
    requires : [
        'App.Sys.User.Comp.RoleListWin'
    ],
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    /**
     * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Sys.User',
    roleGridFieldWinRef : null,
    roleGridRef : null,
    deleteBtnRef : null,
    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('COMP.ROLE_GRID_FIELD');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },
    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            layout : 'anchor',
            width : 400
        });
    },
    initComponent : function()
    {
        Ext.apply(this, {
            items : [this.getGridConfig(), {
                xtype : 'container',
                layout : 'hbox',
                margin : '4 0 0 0',
                items : [{
                    xtype : 'button',
                    text : this.LANG_TEXT.ADD_NEW,
                    listeners : {
                        click : function(){
                            var win = this.getRoleListWindow();
                            win.show();
                        },
                        scope : this
                    }
                }, {
                    xtype : 'button',
                    text : this.LANG_TEXT.DELETE_SELECT,
                    disabled : true,
                    margin : '0 0 0 5',
                    listeners : {
                        afterrender : function(btn){
                            this.deleteBtnRef = btn;
                        },
                        click : this.removeRoleItemsHandler,
                        scope : this
                    }
                }]
            }]
        });
        this.callParent();
    },
    /**
     * 加载角色数据
     *
     * @param {Array}
     */
    loadRoles : function(roles)
    {
        this.roleGridRef.store.loadData(roles);
    },
    getGridConfig : function()
    {
        return {
            xtype : 'grid',
            height : 150,
            emptyText : this.LANG_TEXT.EMPTY_TEXT,
            border : false,
            selModel : {
                mode : 'MULTI'
            },
            columns : [
                {text : this.LANG_TEXT.R_ID, dataIndex : 'id', width : 100, resizable : false, sortable : false, menuDisabled : true},
                {text : this.LANG_TEXT.R_NAME, dataIndex : 'name', flex : 1, resizable : false, sortable : false, menuDisabled : true}
            ],
            listeners : {
                afterrender : function(roleGrid){
                    this.roleGridRef = roleGrid;
                },
                select : function(){
                    this.deleteBtnRef.setDisabled(false);
                },
                deselect : function(){
                    var sm = this.roleGridRef.getSelectionModel();
                    if(0 == sm.getCount()){
                        this.deleteBtnRef.setDisabled(true);
                    }
                },
                scope : this
            },
            store : this.createStore()
        };
    },
    getValues : function()
    {
        var ret = [];
        this.roleGridRef.store.each(function(record){
            ret.push(record.get('id'));
        });
        return ret;
    },
    /**
     * 获取角色列表窗口实例
     */
    getRoleListWindow : function()
    {
        if(null == this.roleGridFieldWinRef){
            this.roleGridFieldWinRef = new App.Sys.User.Comp.RoleListWin({
                listeners : {
                    roleselected : function(records)
                    {
                        this.roleGridRef.store.add(records);
                    },
                    beforeselect : function(sm, record)
                    {
                        var sels = sm.getSelection();
                        var superId = App.Sys.User.Const.SUPER_MANAGER_ROLE_ID;
                        var ret = true;
                        Ext.each(sels, function(item){
                            if(superId == item.get('id')){
                                ret = false;
                            }
                        });
                        var targetStore = this.roleGridRef.getStore();
                        if(-1 != targetStore.indexOf(record)){
                            ret = false;
                        }
                        return ret;
                    },
                    scope : this
                }
            });
        }
        return this.roleGridFieldWinRef;
    },
    createStore : function()
    {
        return new Ext.data.Store({
            autoLoad : false,
            fields : [
                {name : 'id', type : 'integer', persist : false},
                {name : 'name', type : 'string', persist : false}
            ]
        });
    },
    removeRoleItemsHandler : function()
    {
        var sm = this.roleGridRef.getSelectionModel();
        var store = this.roleGridRef.getStore();
        store.remove(sm.getSelection());
        //更新按钮状态
        this.deleteBtnRef.setDisabled(true);
    },
    destroy : function()
    {
        delete this.LANG_TEXT;
        if(this.roleGridFieldWinRef){
            this.roleGridFieldWinRef.destroy();
        }
        delete this.roleGridRef;
        delete this.roleGridFieldWinRef;
        delete this.deleteBtnRef;
        this.mixins.langTextProvider.destroy.call(this);
        this.callParent();
    }
});