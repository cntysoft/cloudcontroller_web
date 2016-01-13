/*
 * Cntysoft Cloud Software Team
 *
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.ShopFlow.Widget.Entry', {
    extend : 'WebOs.Kernel.ProcessModel.AbstractWidget',
    requires : [
        'Ext.layout.container.Fit',
        'App.ZhuChao.ShopFlow.Ui.OrderEditor'
    ],
    mixins : {
        multiTabPanel : 'SenchaExt.Mixin.MultiTabPanel'
    },
    panelClsMap : {
        ListView : 'App.ZhuChao.ShopFlow.Ui.ListView',
        OrderEditor : 'App.ZhuChao.ShopFlow.Ui.OrderEditor'
    },
    /**
     * {@link WebOs.Mixin.MultiTabPanel#initPanelType initPanelType}
     * @property {String} initPanelType
     */
    initPanelType : 'ListView',
    categoryTreeRef : null,
    contextMenuRef : null,
    initPmTextRef : function ()
    {
        this.pmText = this.GET_PM_TEXT('ENTRY');
    },
    applyConstraintConfig : function (config)
    {
        this.callParent([config]);
        Ext.apply(config, {
            layout : 'fit',
            width : 1000,
            minWidth : 1000,
            minHeight : 500,
            height : 500,
            resizable : false,
            bodyStyle : 'background:#ffffff',
            maximizable : false,
            maximized : true
        });
    },
    initComponent : function ()
    {
        Ext.apply(this, {
            items : [
                this.getTabPanelConfig()
            ]
        });
        this.callParent();
    },
    panelExistHandler : function (panel, config)
    {
        if(panel.panelType == 'ListView'){
            panel.loadCategoryGoods(config.targetLoadedCid);
        }
    },
    destroy : function ()
    {
        if(this.contextMenuRef){
            this.contextMenuRef.destroy();
            delete this.contextRef;
        }
        this.callParent();
    }
});