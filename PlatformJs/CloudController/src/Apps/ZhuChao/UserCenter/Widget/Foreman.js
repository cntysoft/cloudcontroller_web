/*
 * Cntysoft Cloud Software Team
 *
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.ZhuChao.UserCenter.Widget.Foreman', {
    extend : 'WebOs.Kernel.ProcessModel.AbstractWidget',
    requires : [
        'App.ZhuChao.UserCenter.Ui.Foreman.ListView',
        'App.ZhuChao.UserCenter.Ui.Foreman.Info'
    ],
    mixins : {
        multiTabPanel : 'SenchaExt.Mixin.MultiTabPanel'
    },
    panelClsMap : {
        ListView : 'App.ZhuChao.UserCenter.Ui.Foreman.ListView',
        Info : 'App.ZhuChao.UserCenter.Ui.Foreman.Info'
    },
    /*
     * {@link WebOs.Mixin.MultiTabPanel#initPanelType initPanelType}
     */
    initPanelType : 'ListView',
    /*
     * 装修公司的用户标识
     */
    userType : 2,
    initPmTextRef : function ()
    {
        this.pmText = this.GET_PM_TEXT('FOREMAN');
    },
    applyConstraintConfig : function (config)
    {
        Ext.apply(config, {
            resizable : false,
            width : 1000,
            height : 500,
            maximizable : true,
            maximized : true
        });
        this.callParent([config]);
    },
    initComponent : function ()
    {
        Ext.apply(this, {
            items : [
                this.getTabPanelConfig()
            ]
        });
        this.callParent();
    }
});