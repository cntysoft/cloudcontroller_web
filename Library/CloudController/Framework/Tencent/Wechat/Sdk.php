<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\Framework\Tencent\Wechat;
use Zend\Http\Client as HttpClient;
use Zend\Http\Request as HttpRequest;
use Cntysoft\Kernel;
use CloudController\Framework\Tencent\ErrorType;
use CloudController\Framework\Tencent\Exception;
use Cntysoft\Kernel\ConfigProxy;
use CloudController\Framework\Tencent\Constant;
class Sdk
{
   /**
    * @var \Zend\Http\Client $client
    */
   protected $client = null;
   /**
    * @var string $appId
    */
   protected $appId = null;
   /**
    * @var string $appSecret
    */
   protected $appSecret = null;
   /**
    * @var array $apiErrorMap
    */
   protected $apiErrorMap = null;
   /**
    * @var \Phalcon\Cache\Backend\File
    */
   protected $cacher = null;
   public function __construct($appId, $appSecret)
   {
      $this->appId = $appId;
      $this->appSecret = $appSecret;
   }

   //基础Api部分
   /**
    * 获取微信服务器ip列表
    *
    * @return array
    */
   public function getWechatServerIpList()
   {
      $ret = $this->sendApiRequest(sprintf(ApiEntry::IP_LIST_ENTRY, $this->getAccessToken()));
      return $ret['ip_list'];
   }

   //用户管理Api部分
   public function createGroup($group)
   {
      if(iconv_strlen($group, 'utf-8') > 30){
         $group = iconv_substr($group, 0, 30, 'utf-8');
      }
      $ret = $this->sendApiRequest(sprintf(ApiEntry::GROUP_CREATE_ENTRY, $this->getAccessToken()),
         true, array(
            'group' => array(
               'name' => $group
            )
         ));
      return $ret['group'];
   }

   /**
    * 获取当前公众账号的分组信息
    *
    * @return array
    */
   public function getGroupList()
   {
      $ret = $this->sendApiRequest(sprintf(ApiEntry::GROUP_GET_ENTRY, $this->getAccessToken()));
      return $ret['groups'];
   }

   /**
    * 获取Api调用accessToken
    *
    * @return string
    */
   protected function getAccessToken()
   {
      $key = md5(__METHOD__.$this->appId);
      $cacher = $this->getCacher();
      if($cacher->exists($key)){
         return $cacher->get($key);
      }else{
         $ret = $this->sendApiRequest(sprintf(ApiEntry::ACCESS_TOKEN_ENTRY, $this->appId, $this->appSecret));
         $token = $ret['access_token'];
         $cacher->save($key, $token);
         return $token;
      }
   }

   /**
    * @param string $url
    * @param boolean $isPost
    * @param array $params
    * @return array
    */
   protected function sendApiRequest($url, $isPost = false, array $params = array())
   {
      $client = $this->getHttpClient();
      $request = new HttpRequest();
      if($isPost){
         $headers = $request->getHeaders();
         if(!empty($params)){
            $request->setContent(json_encode($params));
         }
         $headers->addHeader(new \Zend\Http\Header\ContentType('application/x-www-form-urlencoded'));
         $request->setHeaders($headers);
         $request->setMethod('post');
      }else{
         $request->setMethod('get');
      }
      $url = Constant::WECHAT_API_BASE_ENTRY.'/'.$url;
      $request->setUri($url);
      $response = $client->send($request);
      if(200 !== $response->getStatusCode()){
         $errorType = ErrorType::getInstance();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_WECHAT_REQUEST_ERROR'),
            $errorType->code('E_WECHAT_REQUEST_ERROR')
         ), $errorType);
      }
      $ret = json_decode($response->getBody(), true);
      if(isset($ret['errcode'])){
         $errorCode = $ret['errcode'];
         if($errorCode !== 0){
            $apiErrorMap = $this->getApiErrorMap();
            $msg = 'unkonw error';
            if(isset($apiErrorMap[$errorCode])){
               $msg = $apiErrorMap[$errorCode];
            }
            $errorType = ErrorType::getInstance();
            Kernel\throw_exception(new Exception(
               $errorType->msg('E_WECHAT_API_INVOKE_ERROR', $msg),
               $errorType->code('E_WECHAT_API_INVOKE_ERROR')
            ), $errorType);
         }
      }

      return $ret;
   }

   /**
    * @return \Zend\Http\Client
    */
   protected function getHttpClient()
   {
      if(null == $this->client){
         $this->client = new HttpClient();
      }
      return $this->client;
   }

   /**
    * @return array
    */
   protected function getApiErrorMap()
   {
      if(null == $this->apiErrorMap){
         $cfg = ConfigProxy::getFrameworkConfig('Tencent');
         $this->apiErrorMap = $cfg->wechat->apiErrorMap->toArray();
      }
      return $this->apiErrorMap;
   }

   /**
    * @return \Phalcon\Cache\Backend\File
    */
   protected function getCacher()
   {
      if(null == $this->cacher){
         $this->cacher = Kernel\make_cache_object('Framework'.DS.'Tencent'.DS.'AccessToken', 7000);
      }
      return $this->cacher;
   }
}

/**
 * 负责定义微信接口地址常量
 *
 * @package CloudController\Framework\Tencent\Wechat
 */
final class ApiEntry
{
   const ACCESS_TOKEN_ENTRY = 'token?grant_type=client_credential&appid=%s&secret=%s';
   const IP_LIST_ENTRY = 'getcallbackip?access_token=%s';
   const GROUP_CREATE_ENTRY = 'groups/create?access_token=%s';
   const GROUP_GET_ENTRY = 'groups/get?access_token=%s';
}