<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
use Cntysoft\Phalcon\Mvc\AbstractController;
use Cntysoft\Framework\ApiServer\Server as ApiServer;
use Cntysoft\Kernel;
use Cntysoft\Kernel\StdErrorType;
use Zend\Json\Json;
/**
 * 处理前端系统与后台php程序直接的调用
 * 这个控制器输出错误信息跟其他控制器不一样 其他控制器可以重定向
 * 暂时把这些逻辑放在控制器里面
 * 这里主要进行验证
 * 第一步 进行用户是否登录验证
 * 第二步 进行API级别的验证，这个验证放在每个APP的AjaxHandler里面进行
 *
 * 改造成基于异常的设计
 */
class ApiController extends AbstractController
{
   /**
    *
    * @var \Cntysoft\Framework\ApiServer\Server $apiServer
    */
   protected $apiServer = null;

   /**
    * 构造函数
    */
   public function initialize()
   {
      $this->apiServer = ApiServer::getInstance();
   }

   public function indexAction()
   {
      try {
         $type = $this->dispatcher->getParam('type');
         $this->checkRequestType($type);
         //这里可能写入相关的错误信息
         $invokeArgs = $this->getInvokeInfo($type);
         $this->authorizeRequest($type, $invokeArgs);
         $r = $this->apiServer->doCall($type, $invokeArgs);
//         exit;
         return Kernel\generate_response(true, $r);
      } catch (\Exception $ex) {
         $extraError['errorCode'] = $ex->getCode();
         $extraError['errorInfo'] = (array) Kernel\g_data(\Cntysoft\API_CALL_EXP_KEY);
         return Kernel\generate_error_response(
            str_replace(CNTY_ROOT_DIR, '', $ex->getMessage()), $extraError
         );
      }
   }


   protected function authorizeRequest($type, array $meta)
   {
      $whiteList = $this->apiServer->getWhiteList();
      if(array_key_exists($type, $whiteList)){
         $allows = $whiteList[$type];
      }else{
         $allows = array();
      }
      $invokeMeta = $meta[\Cntysoft\INVOKE_META_KEY];
      $key = implode('.', array_values($invokeMeta));
      if (!in_array($key, $allows)) {
         $di = Kernel\get_global_di();
         $gate = $di->get('SysGate');
         $gate->isLogin();
      }
   }

   /**
    * 获取调用相关信息
    *
    * @return boolean | array 当出现错误的时候返回false
    */
   protected function getInvokeInfo()
   {

      $requestData = $this->di->get('request')->getPost();
      //检查存在性
      if (!isset($requestData[\Cntysoft\INVOKE_META_KEY])) {
         Kernel\throw_exception(new \Exception(
            StdErrorType::msg('E_API_INVOKE_LEAK_META'), StdErrorType::code('E_API_INVOKE_LEAK_META')), \Cntysoft\STD_EXCEPTION_CONTEXT);
      }
      //检查格式
      $meta = Json::decode($requestData[\Cntysoft\INVOKE_META_KEY], Json::TYPE_ARRAY);
      /**
       * @todo $security = Json::decode(\Cntysoft\INVOKE_SECURITY_KEY, Json::TYPE_ARRAY);
       */
      if (isset($requestData[\Cntysoft\INVOKE_PARAM_KEY])) {
         $params = Json::decode($requestData[\Cntysoft\INVOKE_PARAM_KEY], Json::TYPE_ARRAY);
      } else {
         $params = array();
      }
      if (!is_array($params)) {
         $params = (array) $params;
      }
      /**
       * 格式是否正确在API SERVER里面进行检测
       */
      return array(
         \Cntysoft\INVOKE_META_KEY  => $meta,
         \Cntysoft\INVOKE_PARAM_KEY => $params
         //\Cntysoft\INVOKE_SECURITY_KEY => $security
      );
   }

   /**
    * @param string $type 检查请求类型
    */
   protected function checkRequestType($type)
   {
      if (!in_array($type, Kernel\get_api_call_types())) {
         Kernel\throw_exception( new \Exception(
            StdErrorType::msg('E_API_INVOKE_TYPE_NOT_SUPPORT', $type), StdErrorType::code('E_API_INVOKE_TYPE_NOT_SUPPORT')),\Cntysoft\STD_EXCEPTION_CONTEXT);
      }
   }
}
