<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\Framework\Tencent;

final class Constant
{
   const WECHAT_LOGIN_ENTRY = 'https://mp.weixin.qq.com/cgi-bin/login';
   const WECHAT_SETTING_ENTRY = 'https://mp.weixin.qq.com/cgi-bin/settingpage?t=setting/index&action=index&token=%s&lang=zh_CN';
   const WECHAT_META_JSON_ENTRY = 'https://mp.weixin.qq.com/advanced/advanced?action=dev&t=advanced/dev&token=%s&lang=zh_CN&f=json';
   const WECHAT_DEV_INFO_SETTING_ENTRY = 'https://mp.weixin.qq.com/advanced/callbackprofile?t=ajax-response&token=%s&lang=zh_CN';
   const WECHAT_DEV_EDITOR_ENTRY = 'https://mp.weixin.qq.com/advanced/advanced?action=interface&t=advanced/interface&token=%s&lang=zh_CN';
   const WECHAT_ENTRY = 'https://mp.weixin.qq.com';
   const WECHAT_API_BASE_ENTRY = 'https://api.weixin.qq.com/cgi-bin';
   const TYPE_DINGYUE = 1;
   const TYPE_FUWU = 2;
   const TYPE_AUTH_DINGYUE = 3;
   const TYPE_AUTH_FUWU = 4;

   const DINGYUE_CALLBACK = 'Wechat/Callback/siteId/%d/Account/%d';
   const MSG_ENCRYTPT_TYPE_NONE = 0;
   const MSG_ENCRYTPT_TYPE_COMPAT = 1;
   const MSG_ENCRYTPT_TYPE_SAFE = 2;
}