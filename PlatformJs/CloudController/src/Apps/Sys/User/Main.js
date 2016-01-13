/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.User.Main', {
    extend: 'WebOs.Kernel.ProcessModel.App',
    requires : [
        'App.Sys.User.Lang.zh_CN',
        'App.Sys.User.Const'
    ],
    /**
     * @inheritdoc
     */
    id: 'Sys.User',
    /**
     * @inheritdoc
     */
    widgetMap : {
        Entry : 'App.Sys.User.Widget.Entry',
        Member : 'App.Sys.User.Widget.Member',
        RoleMgr : 'App.Sys.User.Widget.RoleMgr'
    },

    /**
     * @param string name
     * @param {Ext.Function} callback
     * @param {Object} scope
     */
    sysUserExist : function(name, callback, scope)
    {
        this.callApp('Member/sysUserExist', {
            name : name
        }, callback, scope);
    },
    /**
     *
     * @param {Object} values
     * @param {Ext.Function} callback
     * @param {Object} scope
     */
    addSysUser : function(values, callback, scope)
    {
        this.callApp('Member/addSysUser',values, callback, scope);
    },

    /**
     *
     * @param {Integer} id
     * @param {Object} data
     * @param {Function} callback
     * @param {Object} scope
     */
    updateSysUser : function(id, data, callback, scope)
    {
        this.callApp('Member/updateSysUser',{
            id : id,
            data : data
        }, callback, scope);
    },

    /**
     * 删除一个指定ID的管理员
     *
     * @param {Integer} id
     */
    deleteSysUser : function(id, callback, scope)
    {
        this.callApp('Member/deleteUser', {
            id : id
        }, callback, scope);
    },

    /**
     *
     * @param {Integer} id
     * @param {Boolean} status
     * @param {Function} callback
     * @param {Object} scope
     */
    changSysUserStatus : function(id, status, callback, scope)
    {
        this.callApp('Member/changeSysUserStatus',{
            id : id,
            status : status
        }, callback, scope);
    },

    /**
     * 根据管理员的id获取管理员信息
     *
     * @param {Integer} id
     */
    getSysUserById : function(id, callback, scope)
    {
        this.callApp('Member/getUserBasicInfo', {
            id : id
        }, callback, scope);
    },

    getRole : function(id, callback, scope)
    {
        this.callApp('RoleMgr/getRole', {
            id : id
        }, callback, scope);
    },

    /**
     * 添加一个新的角色
     *
     * @param {Object} data
     */
    addRole : function(data, callback, scope)
    {
        this.callApp('RoleMgr/addRole', data, callback, scope);
    },

    /**
     * 更新一个角色
     *
     * @param {Integer} id
     * @param {Object} data
     */
    updateRole : function(id, data, callback, scope)
    {
        Ext.apply(data, {
            id : id
        });
        this.callApp('RoleMgr/updateRole', data, callback, scope);
    },

    /**
     * 删除一个指定的角色
     *
     * @param {Integer} id
     */
    deleteRole : function(id, callback, scope)
    {
        this.callApp('RoleMgr/deleteRole', {
            rid : id
        }, callback, scope);
    },

    /**
     * 获取授权树节点的数据
     *
     * @param {Integer} treeType 授权的类型
     * @param {Integer} roleId 角色ID
     */
    getAuthorizeTreeNodes : function(treeType, roleId, callback, scope)
    {
        this.callApp('PermMgr/getAuthorizeTreeNodes', {
            type : treeType,
            roleId : roleId
        }, callback, scope);
    },

    /**
     * 设置角色的权限
     *
     * @param {Array} data
     * @param {Function} callback
     * @param {Object} scope
     */
    setRolePerms : function(data, callback, scope)
    {
        this.callApp('PermMgr/setRolePerms', data, callback, scope);
    },

    /**
     * @param {Object} data
     */
    saveRoleSysUsers : function(data, callback, scope)
    {
        this.callApp('RoleMgr/saveRoleSysUsers', data, callback, scope);
    }
});