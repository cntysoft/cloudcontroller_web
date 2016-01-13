/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('CloudController.Os.Widget.Advise', {
    extend : 'WebOs.Component.Window',
    mixins: {
        langTextProvider: 'Cntysoft.Mixin.LangTextProvider',
        callSys : 'Cntysoft.Mixin.CallSys'
    },
    LANG_NAMESPACE : 'CloudController.Lang',
    scriptName : 'WebOs',
    //private
    formRef : null,
    constructor : function(config)
    {
        this.LANG_TEXT = this.GET_LANG_TEXT('WIDGET.ADVISE');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },

    applyConstraintConfig : function(config)
    {
        this.callParent([config]);
        Ext.apply(config,{
            title : this.LANG_TEXT.TITLE,
            width : 900,
            height : 400,
            minWidth : 900,
            minHieght : 400,
            resizable : false,
            modal : true,
            closeAction : 'hide',
            maximizable : false
        });
    },
    initComponent : function()
    {
        Ext.apply(this,{
            items : this.getFormConfig(),
            buttons : [{
                text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
                listeners : {
                    click : this.saveHandler,
                    scope : this
                }
            }]
        });
        this.addListener({
            close : function()
            {
                this.formRef.getForm().reset();
            }
        });
        this.callParent();
    },

    saveHandler : function()
    {
        var form = this.formRef.getForm();
        if(form.isValid()){
            var values = form.getValues();
            this.callSys('saveAdviseInfo', values, function(response){
                if(!response.status){
                    Cntysoft.Kernel.Utils.processApiError(response);
                }else{
                    Cntysoft.showAlertWindow(Cntysoft.GET_LANG_TEXT('MSG.SAVE_OK'), function(){
                        this.close();
                    }, this);
                }
            }, this);
        }
    },

    getFormConfig : function()
    {
        var L_TEXT = this.LANG_TEXT.LABEL;
        return {
            xtype : 'form',
            bodyPadding : 10,
            items : [{
                xtype : 'textfield',
                fieldLabel : L_TEXT.TITLE,
                width : 600,
                name : 'title',
                allowBlank : false
            },{
                xtype : 'textarea',
                fieldLabel : L_TEXT.CONTENT,
                width : 880,
                height : 250,
                allowBlank : false,
                name : 'content'
            }],
            listeners : {
                afterrender : function(form)
                {
                    this.formRef = form;
                },
                scope : this
            }
        };
    }
});