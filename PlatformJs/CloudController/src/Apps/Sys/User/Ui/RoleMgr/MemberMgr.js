/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 成员管理面板
 */
Ext.define('App.Sys.User.Ui.RoleMgr.MemberMgr', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Cntysoft.Kernel.Utils'
    ],
    mixins: {
        langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
    },
    /**
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Sys.User',
    /**
     * @property {String} panelType 面板的类型
     */
    panelType : 'Member',
    /**
     * @property {Ext.grid.Panel} includeGrid 属于该角色的管理员列表
     */
    includeGridRef : null,
    /**
     * @property {Ext.grid.Panel} excludeGrid 不属于该角色的管理员列表
     */
    excludeGridRef : null,
    /**
     * @property {Object} includeData 保存的数据角色的数据
     */
    includeData : null,
    /**
     * @property {Object} excludeData 保存的不属于数据角色的数据
     */
    excludeData : null,
    /**
     * @property {Ext.form.Panel} infoFormRef 信息面板
     */
    infoFormRef : null,
    /**
     * @property {Ext.data.Model} role 关联的角色数据
     */
    role : null,

    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.ROLE_MGR.MEMBER_MANAGER');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },

    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            title : this.LANG_TEXT.TITLE
        });
    },

    initComponent : function()
    {
        Ext.apply(this, {
            layout : {
                type : 'hbox',
                align : 'stretch'
            },
            items : [
                this.getInfoPanelConfig(),
                this.getExcludeGridConfig(),
                this.getIncludeGridConfig()
            ],
            buttons : [{
                text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
                listeners : {
                    click : this.saveRoleDataHandler,
                    scope : this
                }
            }, {
                text : Cntysoft.GET_LANG_TEXT('UI.BTN.RESTORE'),
                listeners : {
                    click : this.restoreHandler,
                    scope : this
                }
            }, {
                text : Cntysoft.GET_LANG_TEXT('UI.BTN.CANCEL'),
                listeners : {
                    click : function()
                    {
                        this.mainPanelRef.renderPanel('ListView');
                    },
                    scope : this
                }
            }]
        });
        this.addListener({
            afterrender : this.afterRenderHandler,
            scope : this
        });
        this.callParent();
    },

    saveRoleDataHandler : function()
    {
        this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
        var data = {
            roleId : this.role.get('id'),
            sysUsers : []
        };

        this.includeGridRef.store.each(function(record){
            data.sysUsers.push(record.get('id'));
        });
        this.mainPanelRef.appRef.saveRoleSysUsers(data, function(response){
            this.loadMask.hide();
            if(response.status){
                this.mainPanelRef.renderPanel('ListView');
            } else{
                Cntysoft.Kernel.Utils.processApiError(response);
            }
        }, this);
    },

    restoreHandler : function()
    {
        this.includeGridRef.store.loadData(this.includeData);
        this.excludeGridRef.store.loadData(this.excludeData);
    },

    loadRoleInfo : function(role, force)
    {
        if(role.get('id') != this.role.get('id') || force){
            this.role = role;
            this.infoFormRef.getForm().setValues({
                roleName : this.role.get('name'),
                num : this.role.get('memberCount'),
                description : this.role.get('description')
            });
            this.includeGridRef.store.load({
                params : {
                    roleId : this.role.get('id')
                }
            });
            this.excludeGridRef.store.load({
                params : {
                    roleId : this.role.get('id')
                }
            });
        }
    },

    afterRenderHandler : function()
    {
        this.loadRoleInfo(this.role, true);
    },

    getInfoPanelConfig : function()
    {
        var COLS = this.LANG_TEXT.COLS;
        return {
            xtype : 'form',
            title : this.LANG_TEXT.INFO_TITLE,
            width : 350,
            margin : '0 1 0 0',
            bodyPadding : 10,
            border : true,
            listeners : {
                afterrender : function(panel)
                {
                    this.infoFormRef = panel;
                },
                scope : this
            },
            defaults : {
                xtype : 'displayfield',
                labelWidth : 100
            },
            items : [{
                fieldLabel : COLS.ROLE_NAME,
                name : 'roleName'
            }, {
                fieldLabel : COLS.NUM,
                name : 'num'
            }, {
                fieldLabel : COLS.DESCRIPTION,
                name : 'description',
                xtype : 'textarea',
                readOnly : true,
                width : 330,
                height : 150
            }]
        };
    },

    getIncludeGridConfig : function()
    {
        var me = this;
        return {
            xtype : 'grid',
            hideHeaders:true,
            allowDeselect : true,
            emptyText : Cntysoft.GET_LANG_TEXT('MSG.EMPTY_TEXT'),
            columns : [
                {text : this.LANG_TEXT.COLS.ROLE_NAME, dataIndex : 'name', resizable : false, flex : 1, menuDisabled : true}
            ],
            title : this.LANG_TEXT.INCLUDE_TITLE,
            flex : 1,
            multiSelect : true,
            viewConfig : {
                plugins : {
                    ptype : 'gridviewdragdrop',
                    dragGroup : this.id+'includeGrid',
                    dropGroup : this.id+'excludeGrid'
                }
            },
            border : true,
            listeners : {
                afterrender : function(grid)
                {
                    this.includeGridRef = grid;
                },
                scope : this
            },
            store : new Ext.data.Store({
                autoLoad : false,
                fields : [
                    {name : 'id', type : 'integer', persist : false},
                    {name : 'name', type : 'string', persist : false}
                ],
                listeners : {
                    load : function()
                    {
                        me.includeData = this.proxy.rawData.items;
                    }
                },
                proxy : {
                    type : 'apigateway',
                    callType : 'App',
                    invokeMetaInfo : {
                        module : 'Sys',
                        name : 'User',
                        method : 'Member/getSysUsersByRole'
                    },
                    reader : {
                        type : 'json',
                        rootProperty : 'items',
                        totalProperty : 'total'
                    }
                }
            })
        };
    },

    getExcludeGridConfig : function()
    {
        var me = this;
        return {
            xtype : 'grid',
            allowDeselect : true,
            hideHeaders:true,
            columns : [
                {text : this.LANG_TEXT.COLS.ROLE_NAME, dataIndex : 'name', flex : 1, resizable : false, menuDisabled : true}
            ],
            title : this.LANG_TEXT.EXCLUDE_TITLE,
            emptyText : Cntysoft.GET_LANG_TEXT('MSG.EMPTY_TEXT'),
            multiSelect : true,
            margin : '0 1 0 0',
            viewConfig : {
                plugins : {
                    ptype : 'gridviewdragdrop',
                    dragGroup : this.id+'excludeGrid',
                    dropGroup : this.id+'includeGrid'
                },
                listeners : {
                    beforedrop : function(node, data, dropRec, dropPosition){
                        var C = App.Sys.User.Const;
                        if(me.role.get('id') == C.SUPER_MANAGER_ROLE_ID){
                            var record = data.records[0]//this.getRecord(data.item);
                            if(record.get('id') == C.SUPER_MANAGER_ID){
                                return false;
                            }
                        }
                        return true;
                    }
                }
            },
            flex : 1,
            border : true,
            listeners : {
                afterrender : function(grid)
                {
                    this.excludeGridRef = grid;
                },
                scope : this
            },
            store : new Ext.data.Store({
                autoLoad : false,
                fields : [
                    {name : 'id', type : 'integer', persist : false},
                    {name : 'name', type : 'string', persist : false}
                ],
                listeners : {
                    load : function()
                    {
                        me.excludeData = this.proxy.rawData.items;
                    }
                },
                proxy : {
                    type : 'apigateway',
                    callType : 'App',
                    invokeMetaInfo : {
                        module : 'Sys',
                        name : 'User',
                        method : 'Member/getSysUsersNotBelongToRole'
                    },
                    reader : {
                        type : 'json',
                        rootProperty : 'items',
                        totalProperty : 'total'
                    }
                }
            })
        };
    },

    destroy : function()
    {
        if(this.loadMask){
            this.loadMask.destroy();
            delete  this.loadMask;
        }
        delete this.role;
        delete this.includeGridRef;
        delete this.excludeGridRef;
        delete this.infoFormRef;
        delete this.mainPanelRef;
        this.callParent();
    }
});