/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.Login.Ui.LoginPanel', {
   extend : 'Ext.Component',
   mixins : {
      langTextProvider : 'WebOs.Mixin.RunableLangTextProvider'
   },
   /**
    * {@link Cntysoft.Mixin.RunableLangTextProvider#property-runableLangKey}
    *
    * @property {String} runableLangKey
    */
   runableLangKey : 'App.Sys.Login',
   childEls : ['loginPanelEl', 'usernameEl', 'passwordEl', 'loginEl', 'resetEl', 'chkcodeEl', 'chkcodeimgEl', 'authcodeEl', 'copyrightEl', 'loginBoxBgEl', 'loginBoxEl', 'loginBoxMainEl'],
   renderTpl : [
      '<div class="app-sys-login-panel" id="{id}-loginPanelEl" data-ref="loginPanelEl">',
      '<div class="wrapper">',
      '<div class="box-bg" id="{id}-loginBoxBgEl" data-ref="loginBoxBgEl">',
      '<div class="box-bg-header"></div>',
      '<div class="box-bg-main" id="{id}-loginBoxMainEl" data-ref="loginBoxMainEl"></div>',
      '</div>',
      '<div class="app-sys-login-panel-box" id="{id}-loginBoxEl" data-ref="loginBoxEl">',
      '<div class="box-header">',
      '</div>',
      '<div class="box-main">',
      '<div class="form-group name-c">',
      '<label class="label"></label>',
      '<input type="text" placeholder="{Username_Holder}" id = "{id}-usernameEl" data-ref="usernameEl" class="name" name="username">',
      '</div>',
      '<div class="form-group password-c">',
      '<label class="label"></label>',
      '<input type="password" placeholder="{Password_Holder}" id = "{id}-passwordEl" class="password" name ="password" data-ref="passwordEl">',
      '</div>',
      '<div class="form-group chkcode-c">',
      '<label class="label"></label>',
      '<input type="text" placeholder="{Check_Holder}" id = "{id}-chkcodeEl" class="chkcode" name ="chkcode" blankText = "{chkcode_blank_text}" data-ref="chkcodeEl">',
      '<img  src="{CheckCodeSrc}" id="{id}-chkcodeimgEl" data-ref="chkcodeimgEl" />',
      '</div>',
      '<div class="login-button">',
      '<button type="submit" class="btn-login"id = "{id}-loginEl" data-ref="loginEl">{Ui_Login}</button>',
      '<button type="submit" class="btn-reset" id = "{id}-resetEl" data-ref="resetEl">{Ui_Reset}</button>',
      '</div>',
      '</div>',
      '</div>',
      '</div>',
      '<div class="app-sys-login-panel-copyright" id="{id}-copyrightEl" data-ref="copyrightEl">',
      '<span>郑州神恩信息科技有限公司 版权所有 2011 - 2014</span>',
      '<a href="http://www.cntysoft.com" target="_blank">郑州神恩信息科技官方网站</a> | ',
      '<a href="http://bbs.cntysoft.com" target="_blank">郑州神恩科技论坛</a>',
      ' </div>',
      '</div>'
   ],
   errorCls : 'error',
   ensureAuthCode : !!window.ENSURE_LOGIN_AUTHCODE,

   /**
    * 当数据验证成功的时候发出登录请求
    * @event loginrequest
    * @param string usernamechkcode
    * @param string password
    * @param string checkcode
    */

   initComponent : function()
   {
      //设置body
      Ext.getBody().addCls('app-sys-login-panel');
      this.addListener('afterrender', this.ensureLayoutHandler, this);
      this.addListener('afterrender', this.afterRenderHandler, this);
      Ext.on('resize', this.ensureLayoutHandler, this);
      this.callParent();
   },

   initRenderData : function()
   {
      var TEXT = this.GET_LANG_TEXT('PLACE_HOLDER');
      return Ext.apply(this.callParent(), {
         CheckCodeSrc : this.getCheckCodeUrl(),
         Ui_Login : Cntysoft.GET_LANG_TEXT('UI.BTN.LOGIN'),
         Ui_Reset : Cntysoft.GET_LANG_TEXT('UI.BTN.RESET'),
         Username_Holder : TEXT.USERNAME,
         Password_Holder : TEXT.PASSWORD,
         Authcode_Holder : TEXT.AUTHCODE,
         Check_Holder : TEXT.CHECKCODE
      });
   },

   /**
    * @return {String} 验证码生成地址
    */
   getCheckCodeUrl : function()
   {
      var info = Cntysoft.getDomainInfo();
      return info.domain + '/Utils/Index/siteManagerChkCode?dc_' + (new Date().getTime());
   },


   generateChkCode : function()
   {
      this.chkcodeimgEl.set({
         src : this.getCheckCodeUrl()
      });
   },

   /**
    * 检查表单是否正确
    *
    * @return {Boolean}
    */
   isValid : function()
   {
      var values = this.getFormValues();
      var data;
      var el;
      var ret = true;
      for(var key in values) {
         data = Ext.String.trim(values[key]);
         if('' == data){
            el = this[key + 'El'];
            el.addCls(this.errorCls);
            ret = false;
         }
      }
      return ret;
   },

   /**
    * @return {Object}
    */
   getFormValues : function()
   {
      var els = [this.usernameEl, this.passwordEl, this.chkcodeEl];
      if(this.ensureAuthCode){
         els.push(this.authcodeEl);
      }
      var len = els.length;
      var item;
      var values = {};
      var key;
      for(var i = 0; i < len; i++) {
         item = els[i];
         key = item.getAttribute('name');
         values[key] = item.getValue();
         item.hasError = true;
         item.isBlank = true;
      }
      return values;
   },

   onLogin : function()
   {
      if(this.isValid()){
         var data = this.getFormValues();
         var password = Cntysoft.Utils.Common.hashPwd(data.password);
         if(this.hasListeners.loginrequest){
            this.fireEvent('loginrequest', data.username, password, data.chkcode);
         }
      }
   },

   onReset : function()
   {
      var els = [this.usernameEl, this.passwordEl, this.chkcodeEl];
      var len = els.length;
      var item;
      for(var i = 0; i < len; i++) {
         item = els[i];
         item.dom.value = '';
         item.removeCls(this.errorCls);
         item.isBlank = false;
      }
   },

   //private
   onRender : function()
   {
      this.callParent(arguments);
      this.chkcodeimgEl.on({
         click : this.generateChkCode,
         scope : this
      });
      this.loginEl.on({
         click : this.onLogin,
         scope : this
      });
      this.resetEl.on({
         click : this.onReset,
         scope : this
      });
      this.chkcodeEl.on({
         blur : this.keyupHandler,
         keyup : this.keyupHandler,
         scope : this
      });
      this.usernameEl.on({
         blur : this.keyupHandler,
         keyup : this.keyupHandler,
         scope : this
      });
      this.passwordEl.on({
         blur : this.keyupHandler,
         keyup : this.keyupHandler,
         scope : this
      });
      this.setUpKeyMap();
   },

   /**
    * 初始化 ENTER 按键点击事件
    */
   setUpKeyMap : function()
   {
      if(!this.keyMap){
         this.keyMap = new Ext.util.KeyMap({
            target : Ext.getBody(),
            key : Ext.event.Event.ENTER,
            fn : this.enterKeyHandler,
            scope : this
         });
      } else{
         this.keyMap.addBinding({
            target : Ext.getBody(),
            key : Ext.event.Event.ENTER,
            fn : this.enterKeyHandler,
            scope : this
         });
      }
   },

   /**
    * 移除 ENTER 按键点击事件
    */
   removeKeyMap : function()
   {
      this.keyMap.removeBinding({
         target : Ext.getBody(),
         key : Ext.event.Event.ENTER,
         fn : this.enterKeyHandler,
         scope : this
      });
   },

   enterKeyHandler : function()
   {
      this.onLogin();
   },

   keyupHandler : function(event, htmlDom, opt)
   {
      var el = Ext.fly(htmlDom);
      var value = el.getValue();
      if('' == Ext.String.trim(value)){
         el.addCls(this.errorCls);
      } else{
         el.removeCls(this.errorCls);
      }
   },
   /**
    * 当系统不需要认证码的时候将其去除
    */
   afterRenderHandler : function()
   {
      if(!this.ensureAuthCode){
         Ext.fly(this.loginBoxMainEl).setHeight(260);
      }
   },
   /**
    * 保证登录界面的布局
    */
   ensureLayoutHandler : function()
   {
      var height = Ext.dom.Element.getViewportHeight();
      var width = Ext.dom.Element.getViewportWidth();
      var divHeight = height > 500 ? height : 500;
      var divWidth = width > 565 ? width : 565;
      this.loginPanelEl.setHeight(divHeight);
      var left = Math.ceil((divWidth - 565) / 2) + 'px';
      var top = Math.ceil((divHeight - 380) * 2 / 5) + 'px';
      Ext.fly(this.copyrightEl).setStyle({left : left});
      Ext.fly(this.loginBoxEl).setStyle({top : top});
      Ext.fly(this.loginBoxBgEl).setStyle({top : top});
   },

   //private
   beforeDestroy : function()
   {
      //在这个地方一定不能忘记作用域 要不然删除不掉
      Ext.un('resize', this.ensureLayoutHandler, this);
      this.callParent(arguments);
   },
   destroy : function()
   {
      Ext.getBody().removeCls('app-sys-login-panel');
      Ext.destroy(this.keyMap);
      delete this.keyMap;
      this.callParent();
   }
});