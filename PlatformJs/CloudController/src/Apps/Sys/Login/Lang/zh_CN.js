/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('App.Sys.Login.Lang.zh_CN', {
   extend : 'Cntysoft.Kernel.AbstractLangHelper',
   data : {
      PM_TEXT : {
         DISPLAY_TEXT : '系统登录程序'
      },
      PLACE_HOLDER : {
         USERNAME : '请您输入用户名',
         PASSWORD : '请您输入密码',
         AUTHCODE : '请您输入认证码',
         CHECKCODE : '请输入验证码'
      },
      MSG : {
         B_TEXT : {
            USERNAME : '用户名不能为空',
            PSW : '登录密码不能为空',
            CHKCODE : '验证码不能为空'
         },
         AUTH_LOGIN : '系统正在验证用户信息'
      },
      ERROR_TYPE : {
         'App/Sys/User/Acl' : {
            10013 : '用户名或者密码错误',
            10008 : '验证码错误',
            10009 : '验证码过期',
            10011 : '您的帐号已经被锁定'
         },
         'CloudController/Kernel/StdErrorType' : {
            1 : '内核错误 : {0}'
         }
      }
   }
});