/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 节点排序窗口
 */
Ext.define('App.Site.Category.Widget.Sorter', {
    extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
    requires : [
        'App.Site.Category.Ui.Sorter.Tree',
        'Ext.layout.container.Border',
        'App.Site.Category.Ui.Sorter.ListView'
    ],
    //private
    treePanelRef : null,
    //private
    listViewRef : null,

    initPmTextRef : function()
    {
        this.pmText = this.GET_PM_TEXT('SORTER');
    },

    initLangTextRef : function()
    {
        this.LANG_TEXT = this.GET_LANG_TEXT('SORTER');
    },

    applyConstraintConfig : function(config)
    {
        this.callParent([config]);
        Ext.apply(config, {
            layout : 'border',
            width : 930,
            minWidth : 930,
            minHeight : 500,
            height : 500,
            resizable : true,
            bodyStyle : 'background:#ffffff',
            maximizable : true
        });
    },

    initComponent : function()
    {
        Ext.apply(this, {
            items : [this.getTreePanelConfig(), this.getListViewConfig()]
        });
        this.callParent();
    },

    /*
     * 获取导航树面板配置对象
     *
     * @return {Object}
     */
    getTreePanelConfig : function()
    {
        return {
            xtype : 'sitecategoryuisortertree',
            width : 240,
            region : 'west',
            margin : '0 1 0 0',
            collapsible : true,
            listeners : {
                afterrender : function(treePanel)
                {
                    this.treePanelRef = treePanel;
                },
                itemclick : this.nodeClickHandler,
                scope : this
            }
        };
    },

    nodeClickHandler : function(tree, record)
    {
        this.listViewRef.loadNodeList(record.get('id'));
    },

    /*
     * 获取排序列表配置对象
     */
    getListViewConfig : function()
    {
        return {
            xtype : 'sitecategoryuisorterlistview',
            region : 'center',
            appRef : this.appRef,
            mainWidgetRef : this,
            listeners : {
                afterrender : function(listView)
                {
                    this.listViewRef = listView;
                    listView.loadNodeList(0);
                },
                scope : this
            }
        };
    },

    destroy : function()
    {
        delete this.treePanelRef;
        delete this.listViewRef;
        this.callParent();
    }
});