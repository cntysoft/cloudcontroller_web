/*
 * Cntysoft Cloud Software Team
 *
 * @author wql <wql1211608804@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 凤凰筑巢礼包管理欢迎面板类
 */
Ext.define('App.ZhuChao.MarketMgr.Ui.Gift.WelcomePanel', {
    extend : 'Ext.container.Container',
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    /**
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.ZhuChao.MarketMgr',
    /**
     * @inheritdoc
     */
    panelType : 'WelcomePanel',
    constructor : function (config)
    {
        Ext.apply(config, {
            title : this.GET_LANG_TEXT('UI.ATTRS.WELCOME_PANEL.TITLE')
        });
        this.callParent([config]);
    },
    html : '<div style = "font-weight:bold; font-size:30px; margin: 20px auto;text-align: center">欢迎使用礼包管理程序</div>',
    destroy : function ()
    {
        delete this.mainPanelRef;
        delete this.appRef;
        this.callParent();
    }
});