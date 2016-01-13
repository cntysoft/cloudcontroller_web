/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 内容管理入口类
 */
Ext.define('App.Site.Content.Main', {
    extend : 'WebOs.Kernel.ProcessModel.App',
    requires : [
        'App.Site.Content.Lang.zh_CN',
        'App.Site.CmMgr.Lang.zh_CN',
        'App.Site.Category.Lang.zh_CN',
        'App.Site.Content.Widget.Entry',
        'App.Site.Content.Widget.InfoManager',
        'App.Site.Content.Lib.Const',
        'Ext.form.field.Date'
    ],
    /*
     * @inheritdoc
     */
    id : 'Site.Content',
    /*
     * @inheritdoc
     */
    widgetMap : {
        Entry : 'App.Site.Content.Widget.Entry',
        InfoManager : 'App.Site.Content.Widget.InfoManager',
        Trashcan : 'App.Site.Content.Widget.Trashcan'
    },

    constructor : function(config)
    {
        config = config || {};

        this.callParent([config]);
        Ext.Loader.setPath('App.Site.CmMgr.Lib.Editor', WebOs.Kernel.StdPath.getAppPath(this.module, 'CmMgr')+'/Js/Editor');
        Ext.Loader.setPath('App.Site.CmMgr.Lib.FieldWidget', WebOs.Kernel.StdPath.getAppPath(this.module, 'CmMgr')+'/Js/FieldWidget');
    },

    /*
     * 调用模型保存器指定的函数
     *
     * @param {Number} mid 模型ID
     * @param {String} name 准备调用的接口函数名称
     * @param {Params} params 调用参数
     */
    callModelSaverApi : function(mid, name, params, callback, scope)
    {
        return this.callApp('Manager/callModelSaverApi',{
            mid : mid,
            name : name,
            params : params
        }, callback, scope);
    },

    /*
     * 获取模型编辑器映射数据
     * 回调函数的参数
     * <code>
     * function(map){}
     * </code>
     */
    getModelEditorMap : function(callback, scope)
    {
        callback = Ext.isFunction(callback) ? callback : Ext.emptyFn;
        scope = scope ? scope : this;
        if(!this.getEnvVar('EditorModelMap')){
            this.callApp('Manager/getModelEditorMap',null , function(response){
                if(!response.status){
                    callback.call(scope, response);
                }else{
                    //建立缓存
                    this.setEnvVar('EditorModelMap', response.data);
                    callback.call(scope, {
                        status : true,
                        data : this.getEnvVar('EditorModelMap')
                    });
                }
            }, this);
        }else{
            callback.call(scope, {
                status : true,
                data : this.getEnvVar('EditorModelMap')
            });
        }
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
            this.callApp('Manager/getModelFields', {
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
    },

    /*
     * 检查标题是否存在
     *
     * @param {Number} nid 节点ID
     * @param {Number} mid 内容模型ID
     * @param {String} title 信息的标题
     */
    infoIsExist : function(nid, mid, title, callback, scope)
    {
        return this.callApp('InfoList/infoIsExist',{
            nid : nid,
            mid : mid,
            title : title
        }, callback, scope);
    },
    /*
     * 对信息进行保存
     */
    saveInfo : function(data, callback, scope)
    {
        this.callApp('Manager/saveInfo', data, callback, scope);
    },
    /*
     * 读入一条信息
     *
     * @param {Int} id
     * @param {Fuction} callback
     * @param {Object} scope
     */
    readInfo : function(id, callback, scope)
    {
        this.callApp('Manager/readInfo', {
            id : id
        }, callback, scope);
    },

    /*
     * 将指定ID信息移到回收站
     * data参数的格式
     * <code>
     *      {
     *          'nodeId' => ['id', 'id'],
     *          'nodeId2' => ['id', 'id']
     *      }
     * </code>
     * @param {Object} data
     * @param {Function} callback
     * @param {Object} scope
     */
    moveToTrashcan : function(data, callback, scope)
    {
        this.callApp('Manager/moveToTrashcan', data, callback, scope);
    },

    /*
     * 将指定ID信息移出回收站
     * data参数的格式
     * <code>
     *      {
     *          'nodeId' => ['id', 'id'],
     *          'nodeId2' => ['id', 'id']
     *      }
     * </code>
     *
     * @param {Object} data
     * @param {Function} callback
     * @param {Object} scope
     */
    moveOutTrashcan : function(data, callback, scope)
    {
        this.callApp('Manager/moveOutTrashcan', data, callback, scope);
    },

    /*
     * 删除指定ID的信息
     * data参数的格式
     * <code>
     *      {
     *          'nodeId' => ['id', 'id'],
     *          'nodeId2' => ['id', 'id']
     *      }
     * </code>
     *
     * @param {Object} data
     * @param {Function} callback
     * @param {Object} scope
     */
    deleteInfo : function(data, callback, scope)
    {
        this.callApp('Manager/deleteInfo', data, callback, scope);
    },

    /*
     * 参数格式
     * <code>
     *      {
     *          items : [{
     *              'nodeId' => 'nodeId',
     *              'id' => '信息的ID',
     *              'status' => '信息状态代码'
     *          }]
     *      }
     * </code>
     * @param {Object} data 待更新的数据
     */
    verifyInfo : function(data, callback, scope)
    {
        this.callApp('Manager/verifyInfo', data, callback, scope);
    },

    /*
     * 清空回收站信息
     *
     * @param {Function} callback
     * @param {Object} scope
     */
    clearTrashcan : function(callback, scope)
    {
        this.callApp('Manager/clearTrashcan', null, callback, scope);
    },

    /*
     * 前台新开窗口查看
     *
     * @param {Int} id
     */
    viewInfoFront : function(id)
    {
        window.open('/item/' + id + '.html');
    }

});