/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Content.Ui.Trashcan.TreePanel', {
    extend : 'App.Site.Content.Comp.CategoryTree',
    alias : 'widget.sitecontentuitrashcantreepanel',
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    /*
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     */
    runableLangKey : 'App.Site.Content',

    constructor : function(config)
    {
        this.title = this.GET_LANG_TEXT('UI.TRASHCAN.TREE_PANEL.TITLE');
        this.callParent([config]);
    },
    initComponent : function()
    {
        this.addListener({
            afterrender : function(){
                this.getRootNode().expand();
            },
            scope : this
        });
        this.callParent();
    }
});