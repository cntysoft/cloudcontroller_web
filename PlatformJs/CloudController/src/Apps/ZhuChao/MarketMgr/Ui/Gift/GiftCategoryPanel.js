/*
 * Cntysoft Cloud Software Team
 *
 * @author wql <wql1211608804@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 大礼包的分类添加/修改面板
 */
Ext.define('App.ZhuChao.MarketMgr.Ui.Gift.GiftCategoryPanel', {
    extend : 'Ext.panel.Panel',
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
    },
    /**
     * {@link WebOs.Mixin.RunableLangTextProvider#property-runableLangKey}
     *
     * @property {String} runableLangKey
     */
    runableLangKey : 'App.ZhuChao.MarketMgr',
    //权限添加模式
    mode : 1,
    /**
     * @inheritdoc
     */
    panelType : 'GiftCategoryPanel',
    queryAttrGridRef : null,
    formRef : null,
    packId : 0,
    constructor : function (config)
    {
        config = config || {};
        this.LANG_TEXT = this.GET_LANG_TEXT('UI.ATTRS.Gift_CATE');
        this.applyConstraintConfig(config);
        if(config.mode == CloudController.Const.MODIFY_MODE){
            if(!Ext.isDefined(config.targetLoadId)){
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
    loadGiftCate : function (nid)
    {
        if(this.$_current_nid_$ !== nid){
            this.gotoModifyMode();
            this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
            this.appRef.getCategory(nid, this.afterloadGiftCateHandler, this);
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
            this.currentCateInfo = null;
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
            this.loadGiftCate(this.targetLoadId);
        }
    },
    afterloadGiftCateHandler : function (response)
    {
        this.loadMask.hide();
        if(!response.status){
            Cntysoft.Kernel.Utils.processApiError(response);
        } else{
            this.currentCateInfo = response.data;
            this.formRef.getForm().setValues(this.currentCateInfo);
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
                    packId : this.packId
                });

                this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
                this.appRef.addCategory(values, this.afterAddCategoryHandler, this);
            } else if(this.mode == C.MODIFY_MODE){
                Ext.apply(values, {
                    id : this.currentCateInfo.id,
                    packId : this.currentCateInfo.packId
                });
                this.appRef.updateCategory(values, this.afterUpdateCategoryHandler, this);
            }
        }
    },
    afterAddCategoryHandler : function (response)
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
    afterUpdateCategoryHandler : function (response)
    {
        var C = CloudController.Const;
        this.loadMask.hide();
        if(!response.status){
            Cntysoft.Kernel.Utils.processApiError(response);
        } else{

            this.packId = this.currentCateInfo.packId;
            Cntysoft.showAlertWindow(this.LANG_TEXT.MSG.UPDATE_OK, function (){
                //刷新节点
                this.mainPanelRef.categoryTreeRef.reload();
                this.gotoNewMode(true);
            }, this);
        }
    },
    getFormConfig : function ()
    {
        var R_STAR = Cntysoft.Utils.HtmlTpl.RED_STAR;
        return {
            xtype : 'form',
            bodyPadding : 10,
            defaults : {
                xtype : 'textfield'
            },
            items : [{
                    fieldLabel : this.LANG_TEXT.FIELDS.CATE_NAME + R_STAR,
                    allowBlank : false,
                    name : 'name'
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
            fieldLabel : this.LANG_TEXT.FIELDS.CATE_ID,
            name : 'id'
        };
    },
    destroy : function ()
    {
        delete this.formRef;
        delete this.appRef;
        delete this.mainPanelRef;
        delete this.targetLoadId;
        delete this.mainPanelRef;
        this.callParent();
    }
});