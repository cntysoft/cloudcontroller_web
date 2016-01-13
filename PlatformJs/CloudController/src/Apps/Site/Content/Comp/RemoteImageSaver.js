/*
 * Cntysoft OpenEngine
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/*
 * 这个用于保存远端图片到本地
 */
Ext.define('App.Site.Content.Comp.RemoteImageSaver', {
    mixins : {
        langTextProvider : 'WebOs.Mixin.RunableLangTextProvider',
        observable : 'Ext.util.Observable'
    },
    /*
     * @protected
     * @property {App.Cms.ContentModelManager.Lib.Editor.AbstractEditor} editor
     */
    editor : null,
    /*
     * 带有远程地址的字符串, 每次执行保存动作之后失效
     *
     * @property {String} content
     */
    content : '',
    /*
     * {@link Cntysoft.Mixin.AppLangTextProvider#property-appKey}
     *
     * @property {String} appKey
     */
    runableLangKey : 'App.Site.Content',
    /*
     * @property {RegExp} imgRegex
     */
    imgRegex : null,
    constructor : function(config)
    {
        if(!config.editor){
            Cntysoft.raiseError(
                Ext.getClassName(this),
                'constructor',
                'must specify editor property'
            );
        }
        this.LANG_TEXT  = this.GET_LANG_TEXT('COMP.REMOTE_IMAGE_SAVER');
        this.imgRegex = /<img.*?src=[\"\'](http:\/\/[^\"]*?)[\"\'][^\/]*\/>/igm;
        this.mixins.observable.constructor.call(this, config);
        Ext.apply(this, config);
    },
    /*
     * 设置搜索远端图片地址的数据
     *
     * @param {String} content
     */
    setContent : function(content)
    {
        this.content = content;
    },
    /*
     * 进行图片保存动作
     *
     * @param {Function} callback
     * @param {Object} scope
     */
    saveImages : function(callback, scope)
    {
        var imgUrls = [];
        var result;
        callback = Ext.isFunction(callback) ? callback : Ext.emptyFn;
        scope = scope || this;
        while(result = this.imgRegex.exec(this.content)){
            imgUrls.push(result[1]);
        }
        if(imgUrls.length == 0){
            if(this.hasListeners.processcomplete){
                this.fireEvent('processcomplete', this.content, []);
            }
            callback.call(scope, this.content, []);
        } else{
            var fileRefs = [];
            this.recursiveSaveRemoteFile(imgUrls, fileRefs, callback, scope);
        }
    },
    recursiveSaveRemoteFile : function(imgUrls, fileRefs, callback, scope)
    {
        if(imgUrls.length > 0){
            var url = imgUrls.shift();
            this.editor.setLoading(Ext.String.format(this.LANG_TEXT.SAVE_FILE, url));
            this.editor.callSaverApi('downloadRemoteFile', {
                fileUrl : url
            }, function(response){
                //没成功就不管了 很可能是网络错误
                if(response.status){
                    //替换文件内容
                    var data = response.data;
                    fileRefs.push({
                       attachment : data.attachment,
                       rid : data.rid
                    });
                    this.content = this.content.replace(url, data.attachment);
                }
                this.recursiveSaveRemoteFile(imgUrls, fileRefs, callback, scope);
            }, this);
        } else{
            this.editor.loadMask.hide();
            if(this.hasListeners.processcomplete){
                this.fireEvent('processcomplete', this.content, fileRefs);
            }
            callback.call(scope, this.content, fileRefs);
        }
    }
});