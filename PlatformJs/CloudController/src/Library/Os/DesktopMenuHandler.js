/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * WEBOS桌面上下文菜单处理函数
 */
Ext.define('CloudController.Os.DesktopMenuHandler',{
    requires : [
        'CloudController.Os.Widget.Advise'
    ],
    mixins : {
        langTextProvider : 'Cntysoft.Mixin.LangTextProvider'
    },
    statics : {
        AM : {
            LOGOUT : 1,
            SHOW_DESKTOP : 2,
            CHANGE_WALLPAPER : 3,
            GOTO_FRONT : 4,
            //OPEN_APP_SHOP : 4,
            //ADVANCE : 6,
            //SYS_SETTING : 7,
            LOCK_SYS : 8,
            LOGOUT : 9
        }
    },
    LANG_NAMESPACE : 'CloudController.Lang',
    //private
    menuRef : null,
    //private
    adviseWinRef : null,
    constructor : function(menu)
    {
        this.LANG_TEXT = this.GET_LANG_TEXT('MENU.DESKTOP_MENU');
        this.menuRef = menu;
        menu.addListener({
            click : this.menuItemClickHandler,
            scope : this
        });
    },
    /**
     * 获取菜单对象
     *
     * @return {Array}
     */
    getMenuItems : function()
    {
        var M = this.self.AM;
        return [{
            text : this.LANG_TEXT.SHOW_DESKTOP,
            code : M.SHOW_DESKTOP
        },{
            text : this.LANG_TEXT.CHANGE_WALLPAPER,
            code : M.CHANGE_WALLPAPER
        },{
        //    text : this.LANG_TEXT.ADVANCE,
        //    code : M.ADVANCE
        //}, {
            text : this.LANG_TEXT.GOTO_FRONT,
            code : M.GOTO_FRONT
        },{
            xtype  :'menuseparator'
        },
        //   {
        //    text : this.LANG_TEXT.SYS_SETTING,
        //    code : M.SYS_SETTING
        //},
        //    {
        //    text : this.LANG_TEXT.LOCK_SYS,
        //    code : M.LOCK_SYS
        //},
            {
            text : this.LANG_TEXT.LOGOUT,
            code : M.LOGOUT
        }];
    },

    menuItemClickHandler : function(menu, item)
    {
        var M = this.self.AM;
        var stdHandler = WebOs.ME.getStdHandler();
        var code = item.code;
        switch(code){
            case M.LOGOUT:
                WebOs.ME.logout();
                break;
            case M.SYS_SETTING:
                var STD_HANDLER = WebOs.ME.getStdHandler();
                STD_HANDLER.runApp('Sys', 'Setting',{
                    widgetName : 'Entry'
                });
                break;
            case M.SHOW_DESKTOP:
                stdHandler.showDesktop();
                break;
            case M.GOTO_FRONT:
                stdHandler.gotoFront();
                break;
            //case M.ADVANCE:
            //    this.renderAdviseWin();
            //    break;
            case M.CHANGE_WALLPAPER:
                WebOs.ME.openDesktopWidget('WallPaper');
                break;
        }
    },

    renderAdviseWin : function()
    {
        if(null == this.adviseWinRef){
            this.adviseWinRef = new CloudController.Os.Widget.Advise();
        }
        this.adviseWinRef.show();
    }
});