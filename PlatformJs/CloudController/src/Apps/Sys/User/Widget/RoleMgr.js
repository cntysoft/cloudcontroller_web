/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.User.Widget.RoleMgr', {
    extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
    requires : [
        'Ext.layout.container.Border',
        'App.Sys.User.Ui.RoleMgr.ListView',
        'App.Sys.User.Ui.RoleMgr.InfoEditor',
        'App.Sys.User.Ui.RoleMgr.PermGrant',
        'App.Sys.User.Ui.RoleMgr.MemberMgr',
        'App.Sys.User.Comp.RoleListWin'
    ],
    mixins: {
        multiTabPanel : 'SenchaExt.Mixin.MultiTabPanel'
    },

    panelClsMap : {
        ListView : 'App.Sys.User.Ui.RoleMgr.ListView',
        InfoEditor : 'App.Sys.User.Ui.RoleMgr.InfoEditor',
        PermGrant : 'App.Sys.User.Ui.RoleMgr.PermGrant',
        Member : 'App.Sys.User.Ui.RoleMgr.MemberMgr'
    },

    /**
     * {@link SenchaExt.Mixin.MultiTabPanel#initPanelType initPanelType}
     * @property {String} initPanelType
     */
    initPanelType : 'ListView',

    roleGridFieldWinRef : null,

    initPmTextRef : function()
    {
        this.pmText = this.GET_PM_TEXT('ROLE_MGR');
    },

    initLangTextRef : function()
    {
        this.LANG_TEXT = this.GET_LANG_TEXT('ROLE_MGR');
    },

    /**
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
        Ext.apply(this, {
            tbar : this.getTopBarConfig(),
            items : [
                this.getTabPanelConfig()
            ]
        });
        this.callParent();
    },

    getTopBarConfig : function()
    {
        var BTN = this.LANG_TEXT.TOP_BAR;
        return [{
            text : BTN.ROLE_MGR,
            menu : [{
                text : BTN.ADD_ROLE,
                listeners : {
                    click : function()
                    {
                        this.renderPanel('InfoEditor',{
                            mode : WebOs.Kernel.Const.NEW_MODE
                        });
                    },
                    scope : this
                }
            },{
                text : BTN.ROLE_LIST,
                listeners : {
                    click : function()
                    {
                        this.renderPanel('ListView');
                    },
                    scope : this
                }
            }]
        },{
            text : BTN.ROLE_GRANT,
            menu : [{
                text : BTN.PERM_GRANT,
                listeners : {
                    click : function()
                    {
                        this.renderPanel('PermGrant');
                    },
                    scope : this
                }
            },{
                text : BTN.ROLE_MEMBER_MGR,
                listeners : {
                    click : function()
                    {
                        var win = this.getRoleListWindow();
                        win.show();
                    },
                    scope : this
                }
            }]
        }];
    },

    panelExistHandler : function(panel, config)
    {
        if('Member' == panel.panelType){
            panel.loadRoleInfo(config.role);
        }
    },

    /**
     * 获取角色列表窗口实例
     */
    getRoleListWindow : function()
    {
        if(null == this.roleGridFieldWinRef){
            this.roleGridFieldWinRef = new App.Sys.User.Comp.RoleListWin({
                selModel : {
                    mode : 'SINGLE'
                },
                listeners : {
                    roleselected : function(records)
                    {
                        this.renderPanel('Member',{
                            role : records.pop()
                        });
                    },
                    scope : this
                }
            });
        }
        return this.roleGridFieldWinRef;
    }
});