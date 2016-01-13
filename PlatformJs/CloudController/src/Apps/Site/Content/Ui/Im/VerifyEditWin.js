/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Content.Ui.Im.VerifyEditWin', {
    extend: 'Ext.window.Window',
    statics : {
        INFO_S_DRAFT : 1,
        INFO_S_REJECTION : 4,
        INFO_S_VERIFY : 3
    },
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    /*
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Site.Content',
    /*
     * 内容管理应用对象的引用
     * 
     * @property {App.Site.Content.Main} appRef
     */
    appRef : null,
    /*
     * @property {Object | Array} record
     */
    record : null,

    /*
     * @property {App.Site.Content.Ui.Im.ListView} listViewRef
     */
    listViewRef : null,

    /*
     * @property {Ext.form.RadioGroup} statusFieldRef
     */
    statusFieldRef : null,

    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.IM.VERIFY_EDIT_WINDOW');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },

    applyConstraintConfig : function(config)
    {
        Ext.apply(config,{
            width : 400,
            height : 150,
            modal : true,
            layout : 'fit',
            resizable : false,
            allowMulti : false,
            closeAction : 'hide',
            bodyBorder : false,
            bodyPadding : 10,
            title : this.LANG_TEXT.TITLE
        });
    },

    initComponent : function()
    {
        var BTN_TEXT = Cntysoft.GET_LANG_TEXT('UI.BTN');
        Ext.apply(this,{
            buttons : [{
                text : BTN_TEXT.SAVE,
                listeners : {
                    click : this.saveHandler,
                    scope : this
                }
            }, {
                text : BTN_TEXT.CANCEL,
                listeners : {
                    click : function(){
                        this.close();
                    },
                    scope : this
                }
            }],
            items : this.getFormConfig(),
            listeners : {
                show : function()
                {
                    this.applyValues();
                },
                scope : this
            }
        });
        this.callParent();
    },

    applyValues : function()
    {
        if(Ext.isObject(this.record)){
            var status = this.record.get('status');
            var SELF = this.self;
            var radios = this.statusFieldRef.items;
            switch (status) {
                case SELF.INFO_S_DRAFT:
                    radios.getAt(0).setValue(true);
                    break;
                case SELF.INFO_S_REJECTION:
                    radios.getAt(1).setValue(true);
                    break;
                case SELF.INFO_S_VERIFY:
                    radios.getAt(2).setValue(true);
                    break;
            }
        }
    },

    saveHandler : function()
    {
        var MSG = Cntysoft.GET_LANG_TEXT('MSG');
        var UI = Cntysoft.GET_LANG_TEXT('UI');
        var ERROR = Cntysoft.GET_LANG_TEXT('ERROR');
        var values = this.statusFieldRef.getValue();
        var records = this.record;
        if(!Ext.isArray(records)){
            records = [records];
        }
        //构建保存对象
        var items = [];
        Ext.each(records, function(record){
            items.push({
                id : record.get('id'),
                nodeId : record.get('nid'),
                status : values.status
            });
        });
        this.setLoading(MSG.SAVE);
        this.appRef.verifyInfo({
            items : items
        }, function(response){
            this.loadMask.hide();
            if(response.status){
                this.close();
                //进行刷新
                Cntysoft.showAlertWindow(MSG.OP_OK, function(){
                    this.listViewRef.setNeedReload();
                }, this);
            } else{
                Cntysoft.showErrorWindow(ERROR.SAVE_ERR);
            }
        }, this);
    },

    getFormConfig : function()
    {
        var SELF = this.self;
        var ITEMS = this.LANG_TEXT.ITEMS;
        return {
            xtype : 'form',
            border : false,
            items : [{
                xtype : 'radiogroup',
                columns : 3,
                width : 300,
                items : [
                    {boxLabel : ITEMS.DRAFT, name : 'status', inputValue : SELF.INFO_S_DRAFT, checked : true},
                    {boxLabel : ITEMS.REJECTION, name : 'status', inputValue : SELF.INFO_S_REJECTION},
                    {boxLabel : ITEMS.VERIFY, name : 'status', inputValue : SELF.INFO_S_VERIFY}
                ],
                listeners : {
                    afterrender : function(selfView)
                    {
                        this.statusFieldRef = selfView;
                    },
                    scope : this
                }
            }]
        };
    },
    /*
     * 资源清除函数
     */
    destroy : function()
    {
        delete this.appRef;
        delete this.record;
        delete this.statusFieldRef;
        delete this.listViewRef;
        this.mixins.langTextProvider.destroy.call(this);
        this.callParent();
    }
});