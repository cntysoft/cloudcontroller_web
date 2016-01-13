/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 凤凰筑巢核心语言包
 */
Ext.define('CloudController.Lang.zh_CN', {
    extend : 'Cntysoft.Kernel.AbstractLangHelper',
    data : {
        SYS_LOADING_MSG : [
            '初始化系统资源',
            '系统引导中',
            '系统验证用户',
            '正在获取用户信息',
            '正在为您渲染桌面'
        ],
        MSG : {
            SYS_RETRIEVE_USER_INFO : '正在获取用户资源信息，请稍候......'
        },
        MENU : {
            SYS_MENU : {
                ACCOUNT : '账号信息',
                MODIFY_PWD : '修改密码',
                SETTING : '系统设置',
                ABOUT_FENG_HUANG : '关于凤凰筑巢',
                HELP_CENTER : '帮助中心',
                APP_STORE : '应用商店',
                LOGOUT : '退出系统'
            },
            DESKTOP_MENU : {
                LOGOUT : '退出系统',
                SHOW_DESKTOP : '显示桌面',
                CHANGE_WALLPAPER : '更换桌面壁纸',
                GOTO_FRONT : '打开系统主页',
                OPEN_APP_SHOP : '应用商城',
                ADVANCE : '给我们提意见',
                SYS_SETTING : '系统设置',
                LOCK_SYS : '锁定系统'
            }
        },
        WIDGET : {
            ADVISE : {
                TITLE : '欢迎使用给我们提意见程序',
                LABEL : {
                    TITLE : '标题',
                    CONTENT : '建议内容'
                }
            },
            ACCOUNT : {
               TITLE : '当前管理员信息',
               BTN : {
                  SAVE : '保存',
                  CLOSE : '关闭'
               },
               MSG : {
                  SAVE : '您确定要保存这些修改？',
                  SAVING : '正在为您保存修改...',
                  SAVE_SUCCESS : '数据保存成功!'
               },
               LABEL : {
                  NAME : '用户名',
                  ENABLE_MULTI_LOGIN : '是否允许多人登陆',
                  ALLOW : '允许',
                  DENY : '不允许',
                  LOGIN_TIMES : '登陆次数',
                  LAST_LOGIN_TIME : '上次登陆时间',
                  LAST_LOGOUT_TIME : '上次登出时间',
                  LAST_LOGIN_IP : '上次登出ip地址',
                  LAST_LMODIFY_PWD_TIME : '上次修改密码时间',
                  LOGIN_ERROR_TIMES : '登陆错误次数'
               }
            },
            MODIFY_PWD : {
               TITLE : '修改管理员密码',
               BTN : {
                  SAVE : '保存',
                  CLOSE : '关闭'
               },
               MSG : {
                  SAVE : '您确定要修改用户密码？',
                  SAVING : '正在为您保存修改...',
                  SAVE_SUCCESS : '密码修改成功!',
                  CLOSE : '您确定不修改密码？',
                  B_TEXT : {
                       NAME : '管理员名称不能为空',
                       F_NAME : '前台会员名称不能为空',
                       PWD : '管理员密码不能为空'
                   }
               },
               ERROR : {
                   10004 : '原始密码错误',
                   PWD_NOT_EQUAL : '两次输入密码不一致'
               },
               LABEL : {
                  ORIGIN_PWD : '原密码',
                  NEW_PWD : '新密码',
                  CHECK_PWD : '确认密码'
               }
            }
        }
    }
});
