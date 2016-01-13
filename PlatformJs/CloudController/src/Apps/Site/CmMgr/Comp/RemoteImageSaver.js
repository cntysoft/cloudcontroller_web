/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Site.CmMgr.Comp.RemoteImageSaver', {
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider',
      observable : 'Ext.util.Observable'
   },
   /*
    * @protected
    * @property {App.Site.CmMgr.Lib.Editor.AbstractEditor} editorRef
    */
   editorRef : null,
   /*
    * 带有远程地址的字符串, 每次执行保存动作之后失效
    *
    * @property {String} content
    */
   content : '',
   /*
    * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.Cms.ContentModelManager',
   /*
    * @property {RegExp} imgRegex
    */
   imgRegex : null,
   constructor : function(config)
   {
      if(!config.editorRef){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'constructor',
            'must specify editorRef property'
         );
      }
      this.LANG_TEXT  = this.GET_LANG_TEXT('COMP.REMOTE_IMAGE_SAVER');
      this.imgRegex = /<img.*?src=[\"\'](http:\/\/[^\"]*?)[\"\'][^\/]*\/>/igm;
      this.mixins.observable.constructor.call(this, config);
      this.addEvents(
         /*
          * @param {String} content 处理之后的结果
          * @param {Array} fileRefs 文件引用ID集合
          */
         'processcomplete'
      );
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
         this.editorRef.setLoading(Ext.String.format(this.LANG_TEXT.SAVE_FILE, url));
         this.editorRef.callSaverApi('downloadRemoteFile', {
            fileUrl : url
         }, function(response){
            //没成功就不管了 很可能是网络错误
            if(response.status){
               //替换文件内容
               var data = response.data;
               fileRefs.push(parseInt(data.rid));
               this.content = this.content.replace(url, data.attachment);
            }
            this.recursiveSaveRemoteFile(imgUrls, fileRefs, callback, scope);
         }, this);
      } else{
         this.editorRef.loadMask.hide();
         if(this.hasListeners.processcomplete){
            this.fireEvent('processcomplete', this.content, fileRefs);
         }
         callback.call(scope, this.content, fileRefs);
      }
   },
   destroy : function()
   {
      delete this.editorRef;
      this.callParent();
   }
});