Ext.Loader.setConfig({
    disableCaching : true
});
/**
 * 系统入口文件， 在这里设置一些全局的对象
 */
Ext.define('FH', {
    extend : 'WebOs.Init',
    singleton : true,
    requires : [
        'CloudController.PackageRequires',
        'CloudController.ExtJsRequires',
        'CloudController.Kernel.StdPath',
        'CloudController.Lang.zh_CN',
        'CloudController.Kernel.Const',
        'CloudController.Os.SysMenuHandler',
        'CloudController.Os.DesktopMenuHandler',
        'CloudController.Utils'
    ],
    /**
     * 系统开始加载时间， 暂时还没有使用
     *
     * @private
     * @property {Number} _startTime 系统开始加载的时间
     */
    _startTime : -1,
    /**
     * 系统就绪时间
     *
     * @private
     * @property {Number} _readyTime 系统加载完成的时间
     */
    _readyTime : -1,
    /**
     * 是否为调试模式, 系统很多地方用到这个属性来决定一些行为，比如抛出一些异常信息
     *
     * @property {boolean} isDebugMode
     */
    isDebugMode : window.CNTYSOFT_IS_DEBUG,
    language : window.CNTYSOFT_LANG,
    langCls : [
        'Cntysoft.Lang.' + window.CNTYSOFT_LANG,
        'CloudController.Lang.' + window.CNTYSOFT_LANG
    ],
    /**
     * 系统支持的语言的列表，这个是硬编码到系统里面的数据
     *
     * @private
     * @readonly
     */
    langTypes : [
        'zh_CN'
    ],
    /**
     * 初始化语言对象
     */
    initLang : function ()
    {
        this.callParent();
        //初始化语言对象
        var sysLang = Ext.create(this.langCls[0]);
        var siteManagerLang = Ext.create(this.langCls[1]);
        var alias = Ext.Function.alias;
        Cntysoft.LangManager.register('System', sysLang);
        Cntysoft.LangManager.register('CloudControllerLang', siteManagerLang);
        Cntysoft.GET_LANG_TEXT = alias(sysLang, 'getText');
        this.GET_LANG_TEXT = alias(siteManagerLang, 'getText');
    },
    run : function ()
    {
        this.callParent();
        Ext.tip.QuickTipManager.init();
    },
    /**
     * 获取系统支持的CDN服务器信息
     * 
     * @returns {Object}
     */
    getCdnServerInfo : function ()
    {
        if(!this.sysReady){
            return {};
        }
        var sysSetting = this.sysEnv.get(CloudController.Kernel.Const.ENV_SYS_SETTING);
        return sysSetting.cdnServer;
    },
    /**
     * 获取图片CDN服务器
     * 
     * @returns {String}
     */
    getImageCdnServer : function ()
    {
        var info = this.getCdnServerInfo();
        return info.img;
    },
    /**
     * 获取图片oss服务器基地址
     * 
     * @returns {String}
     */
    getImgOssServer : function ()
    {
        if(!this.sysReady){
            return null;
        }
        var sysSetting = this.sysEnv.get(CloudController.Kernel.Const.ENV_SYS_SETTING);
        return sysSetting.ossImgServer;
    },
    /**
     * 获取图片的连接地址
     * 
     * @param {String} url
     * @param {String} useCdn 是否使用cdn
     * @returns {String}
     */
    getZhuChaoImageUrl : function (url, useCdn)
    {
        if(!Ext.isEmpty(url)){
            if('/' == url.charAt(0)){
                return url;
            } else{
                var base = '';
                if(useCdn){
                    var cdn = this.getCdnServerInfo();
                    base = cdn.img;
                } else{
                    base = this.getImgOssServer();
                }
                return base + '/' + url;
            }
        }
        
        return url;
    },
    /**
     * 从Cookie登录
     *
     * @param {Function} callback
     * @param {Object} scope
     * @returns
     */
    loginByCookie : function (callback, scope)
    {
        Cntysoft.callApp('Sys', 'User', 'Authorizer/loginByCookie', null, callback, scope);
    },
    /**
     * 用户登录接口
     *
     * @param {String} username
     * @param {String} password
     * @param {String} chkcode
     * @param {Function} callback
     * @param {Object} scope
     * @returns
     */
    login : function (username, password, chkcode, callback, scope)
    {
        Ext.getBody().mask(Cntysoft.GET_LANG_TEXT('MSG.LOGINING'));
        Cntysoft.callApp('Sys', 'User', 'Authorizer/login', {
            username : username,
            password : password,
            chkcode : chkcode
        }, function (){
            Ext.getBody().unmask();
            callback.apply(this, arguments);
        }, scope);
    },
    logoutHandler : function ()
    {
        Ext.getBody().mask(Cntysoft.GET_LANG_TEXT('MSG.LOGOUT_SYS'));
        Cntysoft.callApp('Sys', 'User', 'Authorizer/logout', null, function (response){
            Ext.getBody().unmask();
            if(response.status){
                WebOs.PM().killProcessByRunLevel(WebOs.Kernel.Const.RUN_LEVEL_USER);
                WebOs.PM().killAllProcess();

                //防止弹出提示信息
                window.onbeforeunload = null;
                window.location.reload();
            } else{
                Cntysoft.Kernel.Utils.processApiError(response);
            }
        }, this);
    },
    startBtnRequestHandler : function (topStatusBar)
    {
        return {
            xtype : 'button',
            cls : 'webos-status-bar-logo-btn',
            iconCls : 'webos-status-bar-logo-btn-icon',
            width : 130,
            margin : '0 0 0 ' + this.self.START_BTN_MARGIN,
            height : this.self.HEIGHT,
            listeners : {
                afterrender : function (btn)
                {
                    this.startBtnRef = btn;
                    btn.el.on({
                        mousedown : function (){
                            btn.setIconCls('webos-status-bar-logo-btn-icon-click');
                        },
                        mouseup : function ()
                        {
                            btn.setIconCls('webos-status-bar-logo-btn-icon');
                        },
                        click : function ()
                        {
                            this.toggleSysMenu();
                        },
                        scope : this
                    });
                },
                scope : topStatusBar
            }
        };
    },
    sysmenuRequestHandler : function (menu)
    {
        var handler = new CloudController.Os.SysMenuHandler(menu);
        menu.add(handler.getMenuItems());
    },
    desktopMenuRequestHandler : function (menu)
    {
        var handler = new CloudController.Os.DesktopMenuHandler(menu);
        menu.add(handler.getMenuItems());
    }
}, function (){
    //给CloudController名称空间加上一些东西
    alias = Ext.Function.alias;
    //在App范围里面用CloudController
    Ext.apply(FH, {
        WebOs : WebOs
    });
});
Ext.onReady(function (){
    FH.run();
});