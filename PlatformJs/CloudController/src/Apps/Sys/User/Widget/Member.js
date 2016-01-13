/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.User.Widget.Member', {
    extend: 'WebOs.Kernel.ProcessModel.AbstractWidget',
    requires : [
        'Ext.layout.container.Border',
        'App.Sys.User.Ui.Member.InfoEditor',
        'App.Sys.User.Ui.Member.ListView'
    ],
    mixins: {
        multiTabPanel : 'SenchaExt.Mixin.MultiTabPanel'
    },

    panelClsMap : {
        ListView : 'App.Sys.User.Ui.Member.ListView',
        InfoEditor : 'App.Sys.User.Ui.Member.InfoEditor'
    },

    /**
     * {@link SenchaExt.Mixin.MultiTabPanel#initPanelType initPanelType}
     * @property {String} initPanelType
     */
    initPanelType : 'ListView',

    initPmTextRef : function()
    {
        this.pmText = this.GET_PM_TEXT('MEMBER');
    },

    initLangTextRef : function()
    {
        this.LANG_TEXT = this.GET_LANG_TEXT('MEMBER');
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
            layout : 'fit',
            maximizable : true
        });
    },

    initComponent : function()
    {
        Ext.apply(this, {
            items : [
                this.getTabPanelConfig()
            ],
            tbar : this.getTBarConfig()
        });
        this.callParent();
    },
    getTBarConfig : function()
    {
        var BTN = this.LANG_TEXT.BTN;
        return [{
            xtype : 'button',
            text : BTN.ADD_MEMBER,
            listeners : {
                click : function()
                {
                    this.renderPanel('InfoEditor',{
                        mode : WebOs.Const.NEW_MODE
                    });
                },
                scope : this
            }
        }]
    }
});