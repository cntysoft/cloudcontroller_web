/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 模块选择下拉菜单
 */
Ext.define('App.Sys.AppInstaller.Comp.ModuleCombo', {
    extend : 'Ext.form.field.ComboBox',
    alias : 'widget.appsysappinstallercompmodulecombo',
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    /**
     * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Sys.AppInstaller',
    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('COMP.MODULE_COMBO');
        this.applyConstraintConfig(config);
        Ext.apply(this, {
            store : this.createStore()
        });
        this.callParent([config]);
    },
    /**
     * @event moduledataready
     * @param {App.Sys.AppInstaller.Comp.ModuleComb} combo
     * @param {Object} data
     */
    applyConstraintConfig : function(config)
    {
        Ext.apply(config,{
            queryMode : 'remote',
            displayField : 'text',
            valueField : 'key',
            editable : false,
            emptyText : this.LANG_TEXT.EMPTY_TEXT
        });
    },
    createStore : function()
    {
        var me = this;
        return new Ext.data.Store({
            autoLoad : true,
            fields : ['text', 'key'],
            proxy : {
                type : 'apigateway',
                callType : 'App',
                invokeMetaInfo : {
                    module : 'Sys',
                    name : 'AppInstaller',
                    method : 'ModuleMgr/getModuleList'
                },
                reader : {
                    type : 'json',
                    rootProperty : 'data'
                },
                onDataReady : function(data)
                {
                    if(me.hasListeners.moduledataready){
                        me.fireEvent('moduledataready', me, data);
                    }
                    return data;
                }
            }
        });
    },

    destroy : function()
    {
        delete this.LANG_TEXT;
        this.callParent();
    }
});