/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 角色权限授予
 */
Ext.define('App.Sys.User.Ui.RoleMgr.PermGrant', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Cntysoft.Utils.Common',
        'Cntysoft.Kernel.Utils',
        'App.Sys.User.Comp.RoleTree',
        'App.Sys.User.Ui.RoleMgr.GrantTree'
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
    /**
     * @property {String} panelType 面板的类型
     */
    panelType : 'PermGrant',

    /**
     * @property {Ext.container.Container} containerRef 权限选择区
     */
    containerRef : null,
    //private
    saveBtnRef : null,
    //private
    resetBtnRef : null,
    /**
     * @property {App.Sys.User.Ui.RoleMgr.GrantTree}  permTreePanelRef 权限树选择面板
     */
    permTreePanelRef : null,
    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.ROLE_MGR.PERM_GRANT');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },

    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            layout : 'border',
            border : false,
            title : this.LANG_TEXT.TITLE
        });
    },

    initComponent : function()
    {
        Ext.apply(this, {
            items : [{
                xtype : 'container',
                layout : 'fit',
                items : this.getStartupConfig(),
                region : 'center',
                listeners : {
                    afterrender : function(container){
                        this.containerRef = container;
                    },
                    scope : this
                }
            }, {
                xtype : 'appsysusercomproletree',
                width : 250,
                listeners : {
                    itemclick : this.roleItemClickHandler,
                    scope : this
                },
                region : 'east',
                collapsible : true
            }],
            buttons : this.getBtnsConfig()
        });
        this.callParent();
    },

    roleItemClickHandler : function(tree, record)
    {
        if(1 == record.get('id') || 0 == record.get('id')){
            return;
        }
        this.saveBtnRef.setDisabled(false);
        this.resetBtnRef.setDisabled(false);
        //是否需要保护一下， 提示用户要保存
       this.renderPermTreePanel(record);
    },

    renderPermTreePanel : function(record)
    {
        var title = this.LANG_TEXT.CURRENT + record.get('text');
        var roleId = record.get('id');
        if(null == this.permTreePanelRef){
            this.permTreePanelRef = new App.Sys.User.Ui.RoleMgr.GrantTree({
                roleId : roleId,
                treeViewType : 1, /*授权模式*/
                title : title,
                appRef : this.mainPanelRef.appRef
            });
            this.containerRef.remove(this.containerRef.items.getAt(0));
            this.containerRef.add(0, this.permTreePanelRef);
        } else{
            this.permTreePanelRef.loadRolePermTree(roleId);
            this.permTreePanelRef.setTitle(title);
        }
    },

    saveHandler : function()
    {
        if(this.permTreePanelRef.isSelectionChange()){
            var data = this.permTreePanelRef.getPermissionSelection();
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
            this.mainPanelRef.appRef.setRolePerms(data, this.afterSaveHandler, this);
        } else{
            Cntysoft.showAlertWindow(
                this.LANG_TEXT.NO_NEED_SAVE
            );
        }
    },

    afterSaveHandler : function(response)
    {
        this.loadMask.hide();
        if(!response.status){
            Cntysoft.Kernel.Utils.processApiError(response);
        } else{
            Cntysoft.showAlertWindow(
                this.LANG_TEXT.SAVE_OK,
                function()
                {
                    this.permTreePanelRef.reload();
                },
                this
            );
        }
    },

    getStartupConfig : function()
    {
        return {
            xtype : 'panel',
            header : false,
            html : this.LANG_TEXT.START_HTML
        };
    },

    /**
     * @return {Array}
     */
    getBtnsConfig : function()
    {
        var BTN = this.LANG_TEXT.BTN;
        return [{
            text : BTN.SAVE,
            disabled : true,
            listeners : {
                click : this.saveHandler,
                afterrender : function(btn){
                    this.saveBtnRef = btn;
                },
                scope : this
            }
        }, {
            text : BTN.RESET,
            disabled : true,
            listeners : {
                afterrender : function(btn){
                    this.resetBtnRef = btn;
                },
                click : function()
                {
                    this.permTreePanelRef.reset();
                },
                scope : this
            }
        }, {
            text : BTN.RETURN,
            listeners : {
                click : function()
                {
                    this.mainPanelRef.renderPanel('ListView');
                },
                scope : this
            }
        }];
    },
    destroy : function()
    {
        delete this.mainPanelRef;
        delete this.resetBtnRef;
        delete this.saveBtnRef;
        delete this.permTreePanelRef;
        this.callParent();
    }
});