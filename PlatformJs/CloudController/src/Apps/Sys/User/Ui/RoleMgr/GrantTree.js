/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 权限授权树,更新策略，只要APP选中状态改变就全部变化
 */
Ext.define('App.Sys.User.Ui.RoleMgr.GrantTree', {
    extend: 'App.Sys.User.Comp.PermResTree',
    statics: {
        A_MAP: {
            EDIT_DETAIL: 1
        }
    },
    /**
     * 初始化的选择项
     *
     * @property {Ext.util.HashMap()} initCheckedItems
     */
    initCheckedItems : null,
    /**
     * @property {Array} 本次需要修改的程序
     */
    modifiedApps : [],
    //private
    roleId : null,
    currentRole : null,
    ignoreLoad : false,
    /**
     * @property {Ext.menu.Menu} contextMenuRef 具有详细权限的时候的
     */
    contextMenuRef : null,

    initComponent : function()
    {
        this.initCheckedItems = new Ext.util.HashMap();
        this.addListener({
            itemexpand : this.nodeExpandHandler,
            checkchange : this.nodeCheckHandler,
            itemcontextmenu : this.itemContextMenuHandler,
            scope : this
        });
        this.callParent();
    },

    /**
     * 获取授权结果
     */
    getPermissionSelection : function()
    {
        var modifiedApps = this.modifiedApps;
        var data = {
            roleId : this.roleId,
            permissions : [],
            modifiedApps : modifiedApps
        };
        var permissions = data.permissions;
        var items = this.getChecked();
        var len = items.length;
        var item;
        var id;
        var type;
        var N_TYPE = this.self.N_TYPE;
        //详细权限暂时不搞
        for(var i = 0; i < len; i++) {
            item = items[i];
            type = item.get('type');
            if(type == N_TYPE.R_APP_NODE){
                //只处理APP节点
                id = item.get('id');
                //这个地方有个技巧，没有打开初始选中并且没有在modified数组里面的要排除, 不在这次更新请求中
                if(Ext.Array.contains(modifiedApps, id)){
                    this.getAppItemPermissions(permissions, item);
                }
            }
        }
        return data;
    },

    /**
     * 递归收集APP具体的权限项目
     */
    getAppItemPermissions : function(data, appNode)
    {
        var children = appNode.childNodes;
        var len = children.length;
        var item;
        var N_TYPE = this.self.N_TYPE;
        var type = appNode.get('type');
        //处理本身
        if(appNode.get('checked')){
            if(type == N_TYPE.R_RESOURCE_NODE){
                data.push({
                    resourceId : appNode.get('id'),
                    hasDetail : appNode.get('hasDetail'),
                    detailPermission : appNode.get('detailPermission')
                });
            }else{
                //APP节点
                data.push({
                    resourceId : appNode.get('id'),
                    hasDetail : false,
                    detailPermission : null
                });
            }

            //处理孩子
            for(var i = 0; i < len; i++) {
                item = children[i];
                this.getAppItemPermissions(data, item);
            }
        }
    },

    /**
     * 判断是否选择发生了改变
     *
     * @return {Boolean}
     */
    isSelectionChange : function()
    {
        var items = this.getChecked();
        var len = items.length;
        var item;
        if(len != this.initCheckedItems.getCount()){
            return true;
        }
        for(var i = 0; i < len; i++) {
            item = items[i];
            if(!this.initCheckedItems.containsKey(item.get('id'))){
                return true;
            }else{
                //对比详细权限
                var orgDetailPermissin = this.initCheckedItems.get(item.get('id'));
                if(orgDetailPermissin != item.get('detailPermission')){
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * 加载权限树
     *
     * @param {Integer} roleId
     * @param {Boolean} force
     */
    loadRolePermTree : function(roleId, force)
    {
        if(force || this.roleId !== roleId){
            this.roleId = roleId;
            this.loadTreeDataHandler();
            //this.currentRole = roleId;
            this.initCheckedItems.clear();
            this.modifiedApps = [];
        }
    },

    /**
     * 显示详细权限设置窗口
     *
     * @param {Ext.data.Model} record
     */
    renderDetailSetterWindow : function(record)
    {
        if(record.get('hasDetail')){
            var cls = record.get('detailSetter');
            cls = 'App.Sys.User.DetailSetter.'+cls;
            var parts = cls.split('.');
            parts.pop();
            parts.push('Lang');
            parts.push(Cntysoft.getLangType());
            var langCls = parts.join('.');
            //Ext.require([cls, parts.join('.')], function(){
            //    var setter = Ext.create(cls,{
            //        node : record,
            //        appRef : this.appRef,
            //        $_lang_cls_$ : langCls
            //    });
            //    setter.show();
            //}, this);
        }
    },

    //按照当前的数据重新加载树
    reload : function()
    {
        this.loadRolePermTree(this.roleId, true);
    },

    reset : function()
    {
        //这个需要递归处理
        var store = this.getStore();
        var root = store.getRootNode();
        this.doReset(root);
    },
    /**
     * 递归重置
     */
    doReset : function(node)
    {
        //设置当前的节点
        var type = node.get('type');
        var N_TYPE = this.self.N_TYPE;
        //只访问特定的节点
        if(type == N_TYPE.R_APP_NODE || type == N_TYPE.R_RESOURCE_NODE){
            if(this.initCheckedItems.containsKey(node.get('id'))){
                node.set('checked', true);
            } else{
                node.set('checked', false);
            }
        }
        var children = node.childNodes;
        var len = children.length;
        if(len > 0){
            for(var i = 0; i < len; i++) {
                this.doReset(children[i]);
            }
        }
    },

    /**
     * @return {Ext.menu.Menu}
     */
    getContextMenu : function()
    {
        if(null == this.contextMenuRef){
            var M_TEXT = this.LANG_TEXT.MENU;
            this.contextMenuRef = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : [{
                    text : M_TEXT.EDIT_DETAIL,
                    code : this.self.A_MAP.EDIT_DETAIL
                }],
                listeners : {
                    click : this.menuItemClickHandler,
                    scope : this
                }
            });
        }
        return this.contextMenuRef;
    },

    nodeExpandHandler : function(node)
    {
        var N_TYPE = this.self.N_TYPE;
        var nodeType = node.get('type');
        if(nodeType == N_TYPE.R_APP_NODE){
            if(!Ext.Array.contains(this.modifiedApps, node.get('id'))){
                this.modifiedApps.push(node.get('id'));
            }
            node.expand(true);
        }
    },

    /**
     * 选择节点的时候需要递归处理
     */
    nodeCheckHandler : function(node, checked)
    {
        if(node.get('type') == this.self.N_TYPE.R_APP_NODE){
            if(!Ext.Array.contains(this.modifiedApps, node.get('id'))){
                this.modifiedApps.push(node.get('id'));
            }
        }
        //设置子节点
        var len = node.childNodes.length;
        var children = node.childNodes;
        var item;
        if(len > 0){
            for(var i = 0; i < len; i++) {
                item = children[i];
                item.set('checked', checked);
                this.nodeCheckHandler(item, checked);
            }
        }
        //设置父节点
        if(checked){
            var current = node.parentNode;
            //设置父结点
            while(current && (current.get('id') > 0)){
                if(current.get('type') == this.self.N_TYPE.R_APP_NODE){
                    if(!Ext.Array.contains(this.modifiedApps, current.get('id'))){
                        this.modifiedApps.push(current.get('id'));
                    }
                }
                if(!current.get('checked')){
                    current.set('checked', true);
                }
                current = current.parentNode;
            }
        } else{
            //没选中的时候，如果一个节点的兄弟节点都没选中，则要把父结点设置为未选中，这个过程递归
            this.checkItemUncheckedRecursive(node);
        }
    },

    checkItemUncheckedRecursive : function(node)
    {
        if(node){
            if(node.get('type') == this.self.N_TYPE.R_APP_NODE){
                //在应用节点的时候就要退出递归了
                return;
            }
            var parent = node.parentNode;
            var children = parent.childNodes;
            var len = children.length;
            var item;
            var allUnchecked = true;
            if(len > 0){
                for(var i = 0; i < len; i++) {
                    item = children[i];
                    if(item.get('checked')){
                        allUnchecked = false;
                    }
                }
            }
            if(allUnchecked){
                parent.set('checked', false);
            }
            this.checkItemUncheckedRecursive(parent);
        }
    },

    /**
     * 主要是应对权限具有详细子权限的情况
     */
    itemContextMenuHandler : function(panel, record, htmlItem, index, event)
    {
        var N_TYPE = this.self.N_TYPE;
        if(record.get('checked') && record.get('hasDetail') && record.get('type') == N_TYPE.R_RESOURCE_NODE){
            var menu = this.getContextMenu();
            var pos = event.getXY();
            menu.record = record;
            event.stopEvent();
            menu.showAt(pos[0], pos[1]);
        }
    },

    /**
     * 上下文菜单处理器
     */
    menuItemClickHandler : function(menu, item)
    {
        if(!item){
            return;
        }
        var AM = this.self.A_MAP;
        var code = item.code;
        var record = menu.record;
        if(AM.EDIT_DETAIL == code){
            this.renderDetailSetterWindow(record);
        }
    },

    destroy : function()
    {
        this.initCheckedItems.clear();
        this.modifiedApps = [];
        delete this.modifiedApps;
        delete this.initCheckedItems;
        delete this.appRef;
        if(this.contextMenuRef){
            this.contextMenuRef.destroy();
            delete this.contextMenuRef;
        }
        this.callParent();
    }
});
