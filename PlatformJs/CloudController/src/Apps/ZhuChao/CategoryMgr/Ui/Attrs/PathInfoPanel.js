/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 查询属性面板
 */
Ext.define('App.ZhuChao.CategoryMgr.Ui.Attrs.PathInfoPanel', {
    extend : 'Ext.panel.Panel',
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    /**
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.ZhuChao.CategoryMgr',
    //权限添加模式
    mode : 1,
    /**
     * @inheritdoc
     */
    panelType : 'PathInfoPanel',
    queryAttrGridRef : null,
    formRef : null,
    iconSrc : null,
    imageRef : null,
    pid : 0,
    constructor : function (config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.ATTRS.PATH_INFO');
        this.applyConstraintConfig(config);
        if(config.mode == CloudController.Const.MODIFY_MODE){
            if(!Ext.isDefined(config.targetLoadId) || !Ext.isNumber(config.targetLoadId)){
                Ext.Error.raise({
                    cls : Ext.getClassName(this),
                    method : 'constructor',
                    msg : 'mode is modify, so you must set node id'
                });
            }
        }
        this.callParent([config]);
    },
    applyConstraintConfig : function (config)
    {
        Ext.apply(config, {
            border : true,
            layout : {
                type : 'vbox',
                align : 'stretch'
            },
            title : this.LANG_TEXT.TITLE
        });
    },
    initComponent : function ()
    {
        Ext.apply(this, {
            items : [
                this.getFormConfig()
            ],
            buttons : [{
                    xtype : 'button',
                    text : Cntysoft.GET_LANG_TEXT('UI.BTN.SAVE'),
                    listeners : {
                        click : this.saveHandler,
                        scope : this
                    }
                }]
        });
        this.addListener('afterrender', this.afterRenderHandler, this);
        this.callParent();
    },
    loadNode : function (nid)
    {
        if(this.$_current_nid_$ !== nid){
            this.gotoModifyMode();
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
            this.appRef.getNodeInfo(nid, this.afterLoadNodeHandler, this);
            this.$_current_nid_$ = nid;
        }
    },
    gotoNewMode : function (force)
    {
        if(force || this.mode != CloudController.Const.NEW_MODE){
            if(this.mode == CloudController.Const.MODIFY_MODE){
                this.formRef.remove(this.formRef.items.getAt(0));
            }
            this.formRef.getForm().reset();
//            this.queryAttrGridRef.clearAttrValues();
            this.imageRef.setSrc('');
            this.iconSrc = null;
            this.currentNodeInfo = null;
            this.mode = CloudController.Const.NEW_MODE;
            this.$_current_nid_$ = -1;
        }
    },
    gotoModifyMode : function (force)
    {
        if(force || this.mode == CloudController.Const.NEW_MODE){
            this.formRef.add(0, this.getIdFieldConfig());
            this.mode = CloudController.Const.MODIFY_MODE;
        }
    },
    afterRenderHandler : function ()
    {
        if(this.mode == CloudController.Const.MODIFY_MODE){
            this.gotoModifyMode(true);
            this.loadNode(this.targetLoadId);
        }
    },
    afterLoadNodeHandler : function (response)
    {
        this.loadMask.hide();
        if(!response.status){
            Cntysoft.Kernel.Utils.processApiError(response);
        } else{
            this.currentNodeInfo = response.data;
            this.formRef.getForm().setValues(this.currentNodeInfo);
//            this.stdAttrRef.setAttrValues(this.currentNodeInfo.stdAttrs);
            this.iconSrc = this.currentNodeInfo.img;
            this.imageRef.setSrc(FH.getZhuChaoImageUrl(this.currentNodeInfo.img));
        }
    },
    saveHandler : function ()
    {
        var form = this.formRef.getForm();
        var values = {};
        var C = CloudController.Kernel.Const;
        if(form.isValid()){
            Ext.apply(values, form.getValues());
            if(this.mode == C.NEW_MODE){
                Ext.apply(values, {
                    pid : this.pid,
                    img : this.iconSrc
                });
                this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
                this.appRef.addNode(values, this.afterAddNodeHandler, this);
            } else if(this.mode == C.MODIFY_MODE){
                Ext.apply(values, {
                    nid : this.currentNodeInfo.id,
                    img : this.iconSrc
                });

                this.appRef.updateNodeInfo(values, this.afterAddNodeHandler, this);
            }
        }
    },
    afterAddNodeHandler : function (response)
    {
        var C = CloudController.Const;
        this.loadMask.hide();
        if(!response.status){
            Cntysoft.Kernel.Utils.processApiError(response);
        } else{
            Cntysoft.showAlertWindow(this.LANG_TEXT.MSG.SAVE_OK, function (){
                //刷新节点
                this.mainPanelRef.categoryTreeRef.reload();
                this.gotoNewMode(true);
            }, this);
        }
    },
    getFormConfig : function ()
    {
        return {
            xtype : 'form',
            bodyPadding : 10,
            defaults : {
                xtype : 'textfield'
            },
            items : [{
                    fieldLabel : this.LANG_TEXT.FIELD.NAME,
                    allowBlank : false,
                    name : 'name'
                }, {
                    fieldLabel : this.LANG_TEXT.FIELD.IDENTIFIER,
                    allowBlank : false,
                    name : 'identifier'
                }, {
                    xtype : 'fieldcontainer',
                    fieldLabel : this.LANG_TEXT.FIELD.IMG,
                    layout : {
                        type : 'hbox',
                        align : 'bottom'
                    },
                    items : [{
                            xtype : 'image',
                            width : 100,
                            height : 100,
                            style : 'border:1px solid #EDEDED',
                            listeners : {
                                afterrender : function (comp){
                                    this.imageRef = comp;
                                },
                                scope : this
                            }
                        }, {
                            xtype : 'webossimpleuploader',
                            uploadPath : this.mainPanelRef.appRef.getUploadFilesPath(),
                            createSubDir : true,
                            fileTypeExts : ['gif', 'png', 'jpg', 'jpeg'],
                            margin : '0 0 0 5',
                            maskTarget : this,
                            enableFileRef : false,
                            overwrite : true,
                            buttonText : this.LANG_TEXT.FIELD.UPLOAD,
                            listeners : {
                                fileuploadsuccess : this.uploadSuccessHandler,
                                scope : this
                            }
                        }]
                }],
            listeners : {
                afterrender : function (comp)
                {
                    this.formRef = comp;
                },
                scope : this
            }
        };
    },
    getIdFieldConfig : function ()
    {
        return {
            xtype : 'displayfield',
            fieldLabel : this.LANG_TEXT.FIELD.ID,
            name : 'id'
        };
    },
    uploadSuccessHandler : function (file)
    {
        var file = file.pop();
        this.iconSrc = file.filename;
        this.imageRef.setSrc(FH.getZhuChaoImageUrl(file.filename));
    },
    destroy : function ()
    {
        delete this.formRef;
        delete this.appRef;
        delete this.mainPanelRef;
        delete this.targetLoadId;
        delete this.mainPanelRef;
        delete this.iconSrc;
        delete this.imageRef;
        this.callParent();
    }
});