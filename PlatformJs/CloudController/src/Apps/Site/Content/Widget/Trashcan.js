/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Content.Widget.Trashcan', {
    extend : 'WebOs.Kernel.ProcessModel.AbstractWidget',
    requires : [
        'App.Site.Content.Ui.Trashcan.TreePanel',
        'App.Site.Content.Ui.Trashcan.ListView',
        'App.Site.Content.Ui.Trashcan.Startup',
        'App.Site.Content.Lib.Const'
    ],
    mixins: {
        multiTabPanel : 'SenchaExt.Mixin.MultiTabPanel'
    },

    panelClsMap : {
        Startup : 'App.Site.Content.Ui.Trashcan.Startup',
        ListView : 'App.Site.Content.Ui.Trashcan.ListView'
    },

    /*
     * 初始的面板类型
     *
     * @property {String} initPanelType
     */
    initPanelType : 'ListView',

    initPmTextRef : function()
    {
        this.pmText = this.GET_PM_TEXT('TRASHCAN');
    },

    initLangTextRef : function()
    {
        this.LANG_TEXT = this.GET_LANG_TEXT('TRASHCAN');
    },

    constructor : function(config)
    {
        this.mixins.multiTabPanel.constructor.call(this);
        this.callParent([config]);
        this.pmText = this.GET_PM_TEXT('TRASHCAN');
    },
    initComponent : function()
    {
        var CONST = App.Site.Content.Lib.Const;
        this.initPanelConfig = {
            title : this.LANG_TEXT.PANEL_TITLE_ALL,
            loadId : CONST.INFO_M_ALL,
            appRef : this.appRef
        };
        Ext.apply(this, {
            items : [{
                xtype : 'sitecontentuitrashcantreepanel',
                width : 240,
                region : 'west',
                margin : '0 1 0 0',
                listeners : {
                    itemclick : this.treeNodeLeftClickHandler,
                    scope : this
                },
                collapsible : true,
                border : false
            }, this.getTabPanelConfig()]
        });
        this.addListener({
            //beforeclose : this.breforeDestroyHandler,
            scope : this
        });
        this.callParent();
    },
    /*
     * @template
     * @inheritdoc
     */
    applyConstraintConfig : function(config)
    {
        this.callParent([config]);
        Ext.apply(config, {
            width : 1100,
            minWidth : 1100,
            minHeight : 450,
            height : 450,
            resizable : true,
            maximizable : true,
            bodyStyle : {
                backgroundColor : '#ffffff'
            },
            layout : {
                type : 'border'
            }
        });
    },

    /*
     * 栏目树点击事件
     */
    treeNodeLeftClickHandler : function(view, record)
    {
        this.renderPanel('ListView', {
            title : record.get('text'),
            loadId : record.get('id'),
            appRef : this.appRef
        });
    },
    /*
     * Panel类型相同的时候
     */
    panelExistHandler : function(activePanel, config)
    {
        var panel = activePanel;
        panel.setTitle(config.title);
        panel.setLoadId(config.loadId);
    },
    getNewTabObject : function(callback, scope)
    {
        return this.getPanelObject('Startup', {}, callback, scope);
    },
    destroy : function()
    {
        this.mixins.multiTabPanel.destroy.call(this);
        delete this.LANG_TEXT;
        this.callParent();
    }
});