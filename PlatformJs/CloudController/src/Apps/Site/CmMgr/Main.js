/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.CmMgr.Main', {
    extend : 'WebOs.Kernel.ProcessModel.App',
    requires : [
        'App.Site.CmMgr.Lang.zh_CN',
        'WebOs.Kernel.StdPath',
        'App.Site.CmMgr.Widget.Entry',
        'App.Site.CmMgr.Lib.Const',
        'App.Site.CmMgr.Comp.IconView',
        'App.Site.CmMgr.Comp.InternetPicWin'
    ],
    /*
     * @inheritdoc
     */
    id : 'Site.CmMgr',
    /*
     * @inheritdoc
     */
    widgetMap : {
        Entry : 'App.Site.CmMgr.Widget.Entry'
    },
    constructor : function(config)
    {
        config = config || {};
        this.callParent([config]);
        Ext.Loader.setPath('App.Site.CmMgr.Lib.Editor', WebOs.Kernel.StdPath.getAppPath(this.module, this.name)+'/Js/Editor');
        Ext.Loader.setPath('App.Site.CmMgr.Lib.FieldWidget', WebOs.Kernel.StdPath.getAppPath(this.module, this.name)+'/Js/FieldWidget');
        Ext.Loader.setPath('App.Site.CmMgr.Lib.FieldOptSetter', WebOs.Kernel.StdPath.getAppPath(this.module, this.name)+'/Js/FieldOptSetter');
    },
    /*
     * 获取内容模型小图标
     *
     * @param mkey
     * @returns {string}
     */
    getModelIcon : function(mkey)
    {
        return WebOs.Kernel.StdPath.getAppImagePath(this.module, this.name)+'/'+mkey+'.png';
    },
    /*
     * 获取指定的模型数据
     *
     * @param {Number} id
     */
    getModelInfo : function(mid, callback, scope)
    {
        this.callApp('Mgr/getModelInfo', {
            id : mid
        }, callback, scope);
    },

    /*
     * 增加一个内容模型的元信息
     *
     * @param {Object} data 模型元信息数据
     */
    addModelMeta : function(data, callback, scope)
    {
        this.callApp('Mgr/addModelMeta', data, callback, scope);
    },

    /*
     * 更新一个内容模型元信息
     *
     * @param {Object} data 模型元信息数据
     */
    updateModelMeta : function(data, callback, scope)
    {
        this.callApp('Mgr/updateModelMeta', data, callback, scope);
    },

    /*
     * 根据内容模型的key删除一个内容模型
     *
     * @param {String} key
     */
    deleteModel : function(key, callback, scope)
    {
        this.callApp('Mgr/deleteModel', {
            key : key
        }, callback, scope);
    },

    /*
     * @param editor
     * @returns {string}
     */
    getEditorJsFile : function(editor)
    {
        return  WebOs.Kernel.StdPath.getAppPath(this.module, this.name)+'/Js/Editor/'+editor+'.js';
    },

    /*
     * 增加一个字段
     *
     * @param {String} modelKey
     * @param {Object} data
     */
    addField : function(modelKey, data, callback, scope)
    {
        this.callApp('Mgr/addField', {
            modelKey : modelKey,
            data : data
        }, callback, scope);
    },

    /*
     * 加载指定模型指定字段的信息
     *
     * @param {Number} mid
     * @param {Number} fid
     */
    getField : function(fid, callback, scope)
    {
        this.callApp('Mgr/getField', {
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
        this.callApp('Mgr/updateField', {
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
        this.callApp('Mgr/deleteField', {
            id : id
        }, callback, scope);
    },

    /*
     * 获取指定模型的所有字段
     *
     * @param {Number} mid
     */
    getModelFields : function(mid, callback, scope)
    {
        callback = Ext.isFunction(callback) ? callback : Ext.emptyFn;
        scope = scope ? scope : this;
        var key = 'ModelFields'+mid;
        if(!this.getEnvVar(key)){
            this.callApp('getModelFields', {
                id : mid
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
    }


});