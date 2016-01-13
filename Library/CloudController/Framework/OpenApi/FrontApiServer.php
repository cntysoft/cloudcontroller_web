<?php
/**
 * Cntysoft Cloud Software Team
 */
namespace CloudController\Framework\OpenApi;
use Cntysoft\Kernel;
use Cntysoft\Phalcon\DI\Exception;
use CloudController\Kernel\StdErrorType;
/**
 * 在frontapi 里面的接口有些是不要验证的接口，有些是需要登录了才能使用的，这个apiserver 专门负责这个复杂的关系
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
class FrontApiServer
{
    CONST AUTH_LEVEL_1 = 1; //不用验证直接调用
    CONST AUTH_LEVEL_2 = 2; //需要登录认证
    CONST AUTH_LEVEL_3 = 3; //使用自定义的认证函数进行认证

    /**
     * @var ScriptBroker null
     */
    protected $scriptBroker = null;
    /**
     * @var array $apis
     */
    protected $apis = array();
    /*
     * @var object $customAuthorizer
     */
    protected $customAuthorizer = null;
    /**
     * @var array $whiteList
     */
    protected $whiteList = array();

    /**
     * 构造函数, 初始化属性
     * 
     * @param array $map
     * @param \FrontApi\ApiAuthorizer $authorizer
     */
    public function __construct(array $map = array(), $authorizer)
    {
        $this->apis = $map;
        $this->scriptBroker = new ScriptBroker();
        $this->customAuthorizer = $authorizer;
        //这个地方可能需要设置相关的信息
        $this->initApiWhiteList();
    }

    /**
     * 实现调用机制
     *
     * @param array $meta
     * @return array
     * @throws Exception
     */
    public function doCall(array $meta)
    {
        $params = isset($meta[\Cntysoft\INVOKE_PARAM_KEY]) ? $meta[\Cntysoft\INVOKE_PARAM_KEY] : array();
        $invokeMeta = $meta[\Cntysoft\INVOKE_META_KEY];
        $clsKey = $invokeMeta['cls'];
        $method = $invokeMeta['method'];
        $key = $clsKey . '.' . $method;
        if (!isset($this->apis[$clsKey])) {
            Kernel\throw_exception(new Exception(
                    StdErrorType::msg('E_OPENAPI_NOT_EXIST', $key), StdErrorType::code('E_OPENAPI_NOT_EXIST')
                    ), \Cntysoft\FENG_HUANG_STD_EXCEPTION_CONTEXT);
        }
        $clsinfo = $this->apis[$clsKey];
        $cls = $clsinfo[0];
        $auth = $clsinfo[1];
        if (!$this->authApiMeta($auth, $key, $meta)) {
            Kernel\throw_exception(new Exception(
                    StdErrorType::msg('E_OPENAPI_NOT_EXIST', $key), StdErrorType::code('E_OPENAPI_NOT_EXIST')
                    ), \Cntysoft\FENG_HUANG_STD_EXCEPTION_CONTEXT);
        }
        //这个地方需要进行验证逻辑
        $handler = $this->scriptBroker->get($cls);
        //判断函数存在不
        if (!method_exists($handler, $method)) {
            Kernel\throw_exception(new Exception(
                    StdErrorType::msg('E_OPENAPI_PERMISSION_DENY', $key), StdErrorType::code('E_OPENAPI_PERMISSION_DENY')), \Cntysoft\FENG_HUANG_STD_EXCEPTION_CONTEXT);
        }
        $ret = (array) $handler->$method($params);
        return $ret;
    }

    /**
     * 初始化白名单, 这里的白名单是在接口验证类型为 AUTH_LEVEL_2(需要登录认证) 的时候, 才会使用 
     * 
     * @return void 
     */
    protected function initApiWhiteList()
    {
        $this->whiteList = array(
           'User.login',
           'User.register',
           'User.loginByCookie',
           'User.checkRegAuthCode', //用户注册发送短信验证码之前的图片验证码
           'User.checkForgetAuthCode', //用户找回密码发送短信验证码之前的图片验证码
           'User.checkEmailExist', //检查邮箱是否存在
           'User.checkPhoneExist', //检查手机号码是否存在
           'User.checkNameExist', //检查用户名是否存在
           'User.resetPasswordWithCode', //重置密码
           'User.checkLogin', //验证是否登陆
        );
    }

    /**
     * 验证Api
     * 
     * @param int $authType
     * @param string $key
     * @param array $meta
     * @return boolean
     */
    protected function authApiMeta($authType, $key, array $meta)
    {
        //不需要验证
        if (self::AUTH_LEVEL_1 == $authType) {
            return true;
        }
        //首先验证是否在白名单里面
        if (in_array($key, $this->whiteList)) {
            return true;
        }

        //验证登录
        if (self::AUTH_LEVEL_2 == $authType) {
            //需要验证登录
            $di = Kernel\get_global_di();
            $auth = $di->get('FrontUserAcl');
            if(!$auth->isLogin()) {
                Kernel\throw_exception(new Exception(
                        StdErrorType::msg('E_API_NEED_LOGIN', $key), StdErrorType::code('E_API_NEED_LOGIN')), \Cntysoft\FENG_HUANG_STD_EXCEPTION_CONTEXT);
            }
            
            return true;
        } else if (self::AUTH_LEVEL_3 == $authType) {
            //需要第三方认证
            return $this->customAuthorizer->check($meta);
        }
    }

}