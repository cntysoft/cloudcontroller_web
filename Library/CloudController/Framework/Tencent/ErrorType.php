<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\Framework\Tencent;
use Cntysoft\Stdlib\ErrorType as BaseErrorType;
/**
 * 微信相关开放接口框架
 */
class ErrorType extends BaseErrorType
{
   /**
    * @inheritDoc
    */
   protected $map = array(
      'E_LOGIN_FAIL' => array(10000, 'wechat login fail %s'),
      'E_WECHAT_REQUEST_ERROR' => array(10001, 'wechat request error'),
      'E_PUB_ACCOUNT_EXIST' => array(10002, 'public account already exist'),
      'E_SET_DEV_INFO_ERROR' => array(10003, 'setting wechat dev info error %s'),
      'E_WECHAT_API_INVOKE_ERROR' => array(10004, 'wechat invoke error %s')
   );
}