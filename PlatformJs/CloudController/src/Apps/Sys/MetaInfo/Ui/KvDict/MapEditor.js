/*
 * Cntysoft OpenEngine
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 映射种类编辑器
 */
Ext.define('App.Sys.MetaInfo.Ui.KvDict.MapEditor', {
    extend : 'Ext.form.Panel',
    mixins : {
        formTooltip : 'Cntysoft.Mixin.FormTooltip',
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    requires : [
        'Cntysoft.Utils.HtmlTpl'
    ],
    /**
     * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
     * 
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.Sys.MetaInfo',
    /**
     * @property {String} panelType 面板的类型
     */
    panelType : 'MapEditor',
    /**
     * @property {Number} mode
     */
    mode : 1,
    /**
     * @property {Object} loadedValue
     */
    loadedValue : null,
    /**
     * @private
     * @property {String} targetMapKey
     */
    targetMapKey : null,
    constructor : function (config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('KVDICT_MANAGER.MAP_EDITOR');
        this.applyConstraintConfig(config);
        this.mixins.formTooltip.constructor.call(this);
        this.callParent([config]);
    },
    applyConstraintConfig : function (config)
    {
        Ext.apply(config, {
            title : this.LANG_TEXT.TITLE,
            border : true,
            bodyPadding : 10
        });
    },
    initComponent : function ()
    {
        Ext.apply(this, {
            defaults : {
                labelWidth : 120,
                xtype : 'textfield',
                width : 350,
                listeners : {
                    afterrender : function (formItem)
                    {
                        this.mixins.formTooltip.setupTooltipTarget.call(this, formItem);
                    },
                    scope : this
                }
            },
            items : this.getFormItemsConfig(),
            buttons : [{
                    text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
                    listeners : {
                        click : this.saveHandler,
                        scope : this
                    }
                }]
        });
        if(this.mode == 2){
            if(null == this.targetMapKey){
                Cntysoft.raiseError(
                Ext.getClassName(this),
                'initComponent',
                'modify mode targetMapKey parameter can not be null'
                );
            }
            this.addListener('afterrender', function (){
                this.loadMapData(this.targetMapKey);
            }, this);
        }
        this.callParent();
    },
    /**
     * 加载指定的映射数据
     * 
     * @param {String} key
     */
    loadMapData : function (key)
    {
        this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
        this.mainPanelRef.appRef.getKvMap(key, function (response){
            this.loadMask.hide();
            if(!response.status){
                Cntysoft.Kernel.Utils.processApiError(response, this.GET_LANG_TEXT('ERROR_MAP'));
            } else{
                this.loadedValue = response.data;
                this.getForm().setValues(response.data);
                this.gotoModifyMode();
            }
        }, this);
    },
    gotoNewMode : function ()
    {
        this.getForm().reset();
        this.down('textfield[name="identifier"]').setDisabled(false);
        this.mode = 1;
    },
    gotoModifyMode : function ()
    {
        this.down('textfield[name="identifier"]').setDisabled(true);
        this.mode = 2;
    },
    saveHandler : function ()
    {
        var form = this.getForm();
        if(form.isValid()){
            var values = form.getValues();
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
            var method;
            if(this.mode == 2){
                method = 'saveKvMap';
                values.identifier = this.loadedValue.key;
            } else{
                method = 'addKvMap';
            }
            this.mainPanelRef.appRef[method](values, function (response){
                this.loadMask.hide();
                if(!response.status){
                    Cntysoft.Kernel.Utils.processApiError(response, this.GET_LANG_TEXT('ERROR_MAP'));
                } else{
                    var tree = this.mainPanelRef.typeTree;
                    tree.addListener('load', function (){
                        tree.selectPath('/root/' + values.identifier, 'key');
                    }, this, {
                        single : true
                    });
                    tree.store.reload();
                    this.mainPanelRef.renderPanel('MapItemsEditor', {
                        dictKey : values.identifier
                    });
                }
            }, this);
        }
    },
    /**
     * @return {Object}
     */
    getFormItemsConfig : function ()
    {
        var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
        var F = this.LANG_TEXT.FIELDS;
        var T_TEXT = this.LANG_TEXT.T_TEXT;
        return [{
                fieldLabel : F.KEY + R_STAR,
                toolTipText : T_TEXT.KEY,
                name : 'identifier',
                regex : new RegExp('^[a-zA-Z][a-zA-Z0-9_.]*$'),
                allowBlank : false
            }, {
                fieldLabel : F.NAME + R_STAR,
                toolTipText : T_TEXT.NAME,
                name : 'name',
                allowBlank : false
            }];
    },
    destroy : function ()
    {
        this.mixins.formTooltip.destroy.call(this);
        this.mixins.langTextProvider.destroy.call(this);
        if(this.loadMask){
            this.loadMask.destroy();
            delete this.loadMask;
        }
        delete this.loadedValue;
        this.callParent();
    }
});