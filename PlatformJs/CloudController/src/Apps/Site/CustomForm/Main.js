/*
 * Cntysoft Cloud Software Team
 * 
 * @author Arvin <cntyfeng@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.CustomForm.Main', {
    extend : 'WebOs.Kernel.ProcessModel.App',
    requires : [
        'App.Site.CustomForm.Lang.zh_CN',
        'WebOs.Kernel.StdPath',
        'App.Site.CustomForm.Widget.Entry',
        'App.Site.CustomForm.Lib.Const',
        'App.Site.CustomForm.Ui.FieldEditor',
        'App.Site.CustomForm.Ui.FieldListView',
        'App.Site.CustomForm.Ui.FieldTypeWin',
        'App.Site.CustomForm.Ui.MetaInfo',
        'App.Site.CustomForm.Ui.FormListView',
        'App.Site.CustomForm.Ui.FormPreview',
        'App.Site.CustomForm.Ui.QueryPanel'
    ],
    /*
     * @inheritdoc
     */
    id : 'Site.CustomForm',
    /*
     * @inheritdoc
     */
    widgetMap : {
        Entry : 'App.Site.CustomForm.Widget.Entry'
    },
    constructor : function(config)
    {
        config = config || {};
        this.callParent([config]);
        Ext.Loader.setPath('App.Site.CustomForm.Lib.Editor', WebOs.Kernel.StdPath.getAppPath(this.module, this.name)+'/Js/Editor');
        Ext.Loader.setPath('App.Site.CustomForm.Lib.FieldWidget', WebOs.Kernel.StdPath.getAppPath(this.module, this.name)+'/Js/FieldWidget');
        Ext.Loader.setPath('App.Site.CustomForm.Lib.FieldOptSetter', WebOs.Kernel.StdPath.getAppPath(this.module, this.name)+'/Js/FieldOptSetter');
    },

    /*
     * 获取指定的表单数据
     *
     * @param {Number} id
     */
    getFormInfo : function(fid, callback, scope)
    {
        this.callApp('Form/getFormInfo', {
            id : fid
        }, callback, scope);
    },

    getInfo : function(fid, infoId, callback, scope)
    {
       this.callApp('Form/getInfo', {
            id : infoId,
            fid : fid
        }, callback, scope);
    },
    /*
     * 增加一个内容表单的元信息
     *
     * @param {Object} data 表单元信息数据
     */
    addFormMeta : function(data, callback, scope)
    {
        this.callApp('Form/addFormMeta', data, callback, scope);
    },

    /*
     * 更新一个表单元信息
     *
     * @param {Object} data 表单元信息数据
     */
    updateFormMeta : function(data, callback, scope)
    {
        this.callApp('Form/updateFormMeta', data, callback, scope);
    },
    /*
     * 根据内容表单的key删除一个表单
     *
     * @param {String} key
     */
    deleteForm : function(key, callback, scope)
    {
        this.callApp('Form/deleteForm', {
            key : key
        }, callback, scope);
    },

    /*
     * 增加一个字段
     *
     * @param {String} formKey
     * @param {Object} data
     */
    addField : function(formKey, data, callback, scope)
    {
        this.callApp('Form/addField', {
            formKey : formKey,
            data : data
        }, callback, scope);
    },

    /*
     * 加载指定表单指定字段的信息
     *
     * @param {Number} fid
     */
    getField : function(fid, callback, scope)
    {
        this.callApp('Form/getField', {
            fid : fid
        }, callback, scope);
    },

    /*
     * 更新一个字段信息`
     *
     * @param {Number} fid
     * @param {Object} data
     */
    updateField : function(fid, data, callback, scope)
    {
        this.callApp('Form/updateField', {
            id : fid,
            data : data
        }, callback, scope);
    },

    /*
     * 删除指定的字段信息
     *
     * @param {Number} id
     */
    deleteField : function(id, callback, scope)
    {
        this.callApp('Form/deleteField', {
            id : id
        }, callback, scope);
    },

    /*
     * 获取指定表单的所有字段
     *
     * @param {Number} fid
     */
    getFormFields : function(fid, callback, scope)
    {
        callback = Ext.isFunction(callback) ? callback : Ext.emptyFn;
        scope = scope ? scope : this;
        var key = 'FormFields'+fid;
        if(!this.getEnvVar(key)){
            this.callApp('Form/getFormFields', {
                id : fid
            }, function(response){
                if(!response.status){
                    callback.call(scope, response);
                }else{
                    //建立缓存
                    this.setEnvVar(key, response.data);
                    callback.call(scope, response);
                }
            }, this);
        }else{
            callback.call(scope, {
                status : true,
                data : this.getEnvVar(key)
            });
        }
    },
    
    deleteInfo: function(fid, infoId, callback, scope)
    {
       this.callApp('Form/deleteInfo', {
            fid : fid,
            id : infoId
        }, callback, scope);
    }

});