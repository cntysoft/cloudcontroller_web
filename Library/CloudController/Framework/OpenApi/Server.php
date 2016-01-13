<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author changwang <shenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\Framework\OpenApi;
use Cntysoft\Kernel;
use Cntysoft\Phalcon\DI\Exception;
use CloudController\Kernel\StdErrorType;
use Zend\Stdlib\ErrorHandler;
/**
 * Class Server
 * @package CloudController\Framework\OpenApi
 */
class Server
{
   /**
    * @var ScriptBroker null
    */
   protected $scriptBroker = null;
   /**
    * @var array $apis
    */
   protected $apis = array();
   /**
    * @var string $token
    */
   protected $token;
   /**
    * 构造函数
    */
   public function __construct(array $map = array(), $token)
   {
      $this->apis = $map;
      $this->scriptBroker = new ScriptBroker();
      $this->token = md5($token);
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
      ErrorHandler::start();
      $params = isset($meta[\Cntysoft\INVOKE_PARAM_KEY]) ? $meta[\Cntysoft\INVOKE_PARAM_KEY] : array();
      $invokeMeta = $meta[\Cntysoft\INVOKE_META_KEY];
      $clsKey = $invokeMeta['cls'];
      $method = $invokeMeta['method'];
      $key = $clsKey.'/'.$method;
      if(!isset($this->apis[$clsKey])){
         Kernel\throw_exception(new Exception(
            StdErrorType::msg('E_OPENAPI_NOT_EXIST', $key),
            StdErrorType::code('E_OPENAPI_NOT_EXIST')
         ), \Cntysoft\FENG_HUANG_STD_EXCEPTION_CONTEXT);
      }
      $clsinfo = $this->apis[$clsKey];
      $cls = $clsinfo[0];
      $auth = $clsinfo[1];
//      if($auth){
//         $crypter = new \Phalcon\Crypt();
//         $security = $meta[\Cntysoft\INVOKE_SECURITY_KEY];
//         if($this->token != $crypter->decrypt($security,$this->token)){
//            Kernel\throw_exception(new Exception(
//               StdErrorType::msg('E_OPENAPI_PERMISSION_DENY', $key),
//               StdErrorType::code('E_OPENAPI_PERMISSION_DENY')
//            ));
//         }
//      }
      $handler = $this->scriptBroker->get($cls);
      //判断函数存在不
      if (!method_exists($handler, $method)) {
         Kernel\throw_exception( new Exception(
            StdErrorType::msg('E_OPENAPI_NOT_EXIST', $key),
            StdErrorType::code('E_OPENAPI_NOT_EXIST')),
            \Cntysoft\FENG_HUANG_STD_EXCEPTION_CONTEXT);
      }
      $ret = (array) $handler->$method($params);
      ErrorHandler::stop(true);
      return $ret;
   }
}