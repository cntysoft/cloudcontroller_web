/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.Ui.Main', {
    extend : 'WebOs.Kernel.ProcessModel.App',
    requires : [
        'App.Site.Ui.Lang.zh_CN',
        'App.Site.Ui.Widget.Entry',
        'App.Site.Ui.Widget.Tpl',
        'App.Site.Ui.Widget.Css',
        'App.Site.Ui.Widget.Js',
        'App.Site.Ui.Lib.Const'
    ],
    /*
     * @inheritdoc
     */
    id : 'Site.Ui',
    /*
     * @inheritdoc
     */
    widgetMap : {
        Entry : 'App.Site.Ui.Widget.Entry',
        Tag : 'App.Site.Ui.Widget.Tag',
        Tpl : 'App.Site.Ui.Widget.Tpl',
        Css : 'App.Site.Ui.Widget.Css',
        Js : 'App.Site.Ui.Widget.Js'
    },

    /*
     * 添加一个新分类或修改一个分类名
     *
     * @param data
     * @param callback
     * @param scope
     */
    classifyChange : function(data, callback, scope)
    {
        this.callApp('Tag/classifyChange', data, callback, scope);
    },
    /*
     *删除一个新分类
     *
     * @param data
     * @param callback
     * @param scope
     */
    deleteClassify : function(data, callback, scope)
    {
        this.callApp('Tag/deleteClassify', data, callback, scope);
    },
    /*
     * 检查标签名称是否存在
     *
     * @param {String} tagType
     * @param {String} classify
     * @param {String} tagName
     */
    tagNameExist : function(tagType, classify, tagName, callback, scope)
    {
        this.callApp('Tag/tagNameExist', {
            name : tagName,
            tagType : tagType,
            classify : classify
        }, callback, scope);
    },

    tagClassExist : function(tagType, classify, tagClass, callback, scope)
    {
        this.callApp('Tag/tagClassExist', {
            tagClass : tagClass,
            tagType : tagType,
            classify : classify
        }, callback, scope);
    },

    /*
     * 创建一个标签
     *
     * @param {String} tagType
     * @param {Object} meta
     */
    createTag : function(tagType, meta, callback, scope)
    {
        this.callApp('Tag/createTag',{
            tagType : tagType,
            meta : meta
        }, callback, scope);
    },
    /*
     *
     */
    deleteTag : function(tagType, classify, name, callback, scope)
    {
        this.callApp('Tag/deleteTag', {
            tagType : tagType,
            classify : classify,
            name : name
        }, callback, scope);
    },
    copyTag : function(tagType, classify, name, callback, scope)
    {
        this.callApp('Tag/copyTag', {
            tagType : tagType,
            classify : classify,
            name : name
        }, callback, scope);
    },
    /*
     * 加载指定的标签数据
     *
     * @param {String} tagType
     * @param {String} classify
     * @param {String} tagName
     */
    loadTag : function(tagType, classify, tagName, callback, scope)
    {
        this.callApp('Tag/getTagMetaInfo', {
            name : tagName,
            tagType : tagType,
            classify : classify
        }, callback, scope);
    },

    /*
     * 更新一个标签
     *
     * @param {String} tagType
     * @param {Object} meta
     */
    updateTagMeta : function(tagType, sourceClassify, sourceTagName, meta, callback, scope)
    {
        this.callApp('Tag/updateTagMeta',{
            tagType : tagType,
            sourceClassify : sourceClassify,
            sourceTagName : sourceTagName,
            meta : meta
        }, callback, scope);
    },

    /*
     * 获取标签树
     */
    getTagListTreeNodes : function(callback, scope)
    {
        this.callApp('Tag/getTagListTreeNodes',null, callback, scope);
    },

    /*
     * 获取模型列表
     */
    getModelIdList : function(callback, scope)
    {
        this.callApp('Tag/getModelIdList', null, callback, scope);
    }
});