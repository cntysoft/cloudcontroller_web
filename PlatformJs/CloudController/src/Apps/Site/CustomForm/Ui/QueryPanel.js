/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 功能引导面板
 */
Ext.define('App.Site.CustomForm.Ui.QueryPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sitecustomformuiquerypanel',
    requires : [
        'Ext.layout.container.Accordion'
    ],
    mixins: {
        langTextProvider: 'WebOs.Mixin.RunableLangTextProvider'
    },

    /*
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Site.CustomForm',

    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.QUERY_PANEL');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },

    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            border : true,
            title : this.LANG_TEXT.TITLE,
            layout : {
                type : 'accordion',
                titleCollapse : true,
                animate : true,
                activeOnTop : true
            }
        });
    },
    initComponent  : function()
    {
        Ext.apply(this,{
            items : [
                this.getFnPanelConfig()
            ]
        });
        this.callParent();
    },
    /*
     * @return {Object}
     */
    getFnPanelConfig : function()
    {
        return {
            xtype : 'panel',
            title : this.LANG_TEXT.FN_PANEL_TITLE,
            layout : {
                type : 'vbox',
                align : 'stretch'
            },
            bodyPadding : 4,
            defaults : {
                xtype : 'button',
                margin : '0 0 5 0'
            },
            items : [{
                text : this.LANG_TEXT.MANAGER_CODEL,
                listeners : {
                    click : function()
                    {
                        this.mainWidgetRef.renderPanel('FormList',{
                            appRef : this.mainWidgetRef.appRef
                        });
                    },
                    scope : this
                }
            }, {
                text : this.LANG_TEXT.ADD_MODEL,
                listeners : {
                    click : function()
                    {
                        this.mainWidgetRef.renderPanel('MetaInfo',{
                            mode : WebOs.Kernel.Const.NEW_MODE,
                            appRef : this.mainWidgetRef.appRef
                        });
                    },
                    scope : this
                }
            }]
        };
    },

    destroy : function()
    {
        delete this.mainWidgetRef;
        this.mixins.langTextProvider.destroy.call(this);
        this.callParent();
    }
});