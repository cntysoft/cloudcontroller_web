<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\Framework\Tencent\Wechat;
use Cntysoft\Kernel;
use Cntysoft\Stdlib\Filesystem;
use Zend\Http\Client as HttpClient;
use Zend\Http\Request as HttpRequest;
use Zend\Stdlib\Parameters;
use Zend\Http\Header\Referer as RefererHeader;
use CloudController\Framework\Tencent\Constant;
use CloudController\Framework\Tencent\ErrorType;
use CloudController\Framework\Tencent\Exception;
use Cntysoft\Framework\Core\FileRef\Manager as RefManager;
use CloudController\Kernel\StdDir;
use CloudController\Kernel\StdHtmlPath;
/**
 * 微信智能绑定，支持订阅号服务号和企业号的相关信息获取
 */
abstract class Binder
{
   /**
    * @var array
    */
   protected $cookies = array();
   /**
    * 登陆之后腾讯返回的身份识别令牌
    *
    * @var string $token
    */
   protected $token = null;

   /**
    * 登陆腾讯微信公众号平台
    *
    * @param string $username
    * @param string $password
    * @return \Zend\Http\Response
    */
   protected function login($username, $password)
   {
      $client = new HttpClient();
      $client->setEncType(HttpClient::ENC_FORMDATA);
      $request = new HttpRequest();
      $request->setUri(Constant::WECHAT_LOGIN_ENTRY);
      $request->setMethod('post');
      $headers = $request->getHeaders();
      $refererHeader = new RefererHeader();
      $refererHeader->setUri(Constant::WECHAT_ENTRY);
      $headers->addHeader($refererHeader);
      $request->setHeaders($headers);
      $request->setPost(new Parameters(array(
         'lang' => 'zh_CN',
         'username' => $username,
         'pwd' => md5($password),
         'imgcode' => '',
         'f' => 'json'
      )));
      $response = $client->send($request);
      if(200 != $response->getStatusCode()){
         $this->throwRequestExp();
      }
      $ret = json_decode($response->getContent(), true);
      if(0 !== $ret['base_resp']['ret']){
         $errorType = ErrorType::getInstance();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_LOGIN_FAIL', $ret['base_resp']['err_msg']),
            $errorType->code('E_LOGIN_FAIL')), $errorType);
      }
      $parts = explode('&', $ret['redirect_url']);
      $token = array_pop($parts);
      $parts = explode('=', $token);
      $this->token = $parts[1];
      $cookieHeaders = $response->getCookie();
      $cookies = array();
      foreach($cookieHeaders as $item){
         $cookies[$item->getName()] = $item->getValue();
      }
      $this->cookies = $cookies;
      return $response;
   }

   /**
    * 自动绑定微信公众账号
    *
    * @param int $siteId
    * @param string $username
    * @param string $password
    */
   public function autoBind($siteId, $username, $password)
   {
      set_time_limit(0);
      if($this->checkAccountExistHandler($siteId, $username)){
         $errorType = ErrorType::getInstance();
         Kernel\throw_exception(new Exception(
            $errorType->msg('E_PUB_ACCOUNT_EXIST'),
            $errorType->code('E_PUB_ACCOUNT_EXIST')
         ), $errorType);
      }
      $response = $this->login($username, $password);
      $cookieHeaders = $response->getCookie();
      $cookies = array();
      foreach($cookieHeaders as $item){
         $cookies[$item->getName()] = $item->getValue();
      }
      $pageHtml = $this->requestForAccountPage($cookies);
      $matches = array();
      preg_match_all('/<div class="meta_content">(.*?)<\/div>/sm', $pageHtml, $matches);
      $matches = $matches[1];
      $info = array();
      $info['name'] = trim($matches[0]);
      $info['email'] = trim($matches[2]);
      $info['orgId'] = trim(str_replace(array('<span>', '</span>'), array('', ''), $matches[3]));
      $info['account'] = trim(str_replace(array('<span>', '</span>'), array('', ''), $matches[4]));
      $info['description'] = trim($matches[8]);
      $info['address'] = trim($matches[9]);
      $type = trim($matches[5]);
      $verified = false;
      if(strpos($matches[6], 'icon_verify_checked')){
         $verified = true;
      }
      if('订阅号' == $type){
         if($verified){
            $info['type'] = Constant::TYPE_AUTH_DINGYUE;
         }else{
            $info['type'] = Constant::TYPE_DINGYUE;
         }
      }
      if('服务号' == $type){
         if($verified){
            $info['type'] = Constant::TYPE_AUTH_FUWU;
         }else{
            $info['type'] = Constant::TYPE_FUWU;
         }
      }
      preg_match_all('/"(.*?)"/', trim($matches[1]), $imgSrc);
      $imgSrc = Constant::WECHAT_ENTRY.$imgSrc[1][1];
      $filename = StdDir::getPublicAccountIconsDir().DS.$siteId.DS.$info['account'].'.jpg';
      $response = $this->requestWechatPage($imgSrc);
      Filesystem::filePutContents($filename,$response->getContent());
      $db = Kernel\get_db_adapter();
      try{
         $db->begin();
         $refMgr = new RefManager();
         $fstat = stat($filename);
         $iconSrc = StdHtmlPath::getPublicAccountIconsPath().'/'.$siteId.'/'.$info['account'].'.jpg';
         $rid = $refMgr->addTempFileRef(array(
            'filename' => $info['account'].'.jpg',
            'filesize' => $fstat['size'],
            'attachment' => $iconSrc,
            'uploadDate' => time()
         ));
         $info['icon'] = array(
            $rid, $iconSrc
         );
         $response = $this->requestWechatPage(sprintf(Constant::WECHAT_META_JSON_ENTRY, $this->token));
         $meta = json_decode($response->getBody(), true);
         $info['appId'] = $meta['advanced_info']['dev_info']['app_id'];
         $this->getCallbackMetaInfo($siteId, $username, $info);
         $aid = $this->savePublicAccountMetaHandler($siteId, $info);
         $this->setupWechatCallback($siteId, $aid, $info);
         $db->commit();
         return $info;
      }catch(\Exception $ex){
         $db->rollback();
         $errorType = ErrorType::getInstance();
         Kernel\throw_exception($ex, $errorType);
      }

   }

   /**
    * 检查绑定是否存在
    *
    * @param int $siteId
    * @param string $username
    * @return mixed
    */
   abstract protected function checkAccountExistHandler($siteId, $username);


   /**
    * 将数据同步到数据库
    *
    * @param int $siteId
    * @param array $info
    * @return int
    */
   abstract protected function savePublicAccountMetaHandler($siteId, array $info);

   /**
    * @return string
    */
   public function requestForAccountPage()
   {
      $response = $this->requestWechatPage(sprintf(Constant::WECHAT_SETTING_ENTRY, $this->token));
      return $response->getBody();
   }

   /**
    * @param string $url
    * @param boolean $isPost
    * @param \Zend\Http\Request $request
    * @return \Zend\Http\Response
    */
   protected function requestWechatPage($url, $isPost = false, $request = null, $refererUrl = null)
   {
      $client = new HttpClient();
      $client->setOptions(array(
         'encodecookies' => false
      ));
      if(null == $request){
         $request = new HttpRequest();
      }
      if($isPost){
         $client->setEncType(HttpClient::ENC_FORMDATA);
      }
      $request->setUri($url);
      $headers = $request->getHeaders();
      $cookieHeader = new \Zend\Http\Header\Cookie($this->cookies);
      $cookieHeader->setEncodeValue(false);
      $headers->addHeader($cookieHeader);
      $referer = new RefererHeader();
      if(null == $refererUrl){
         $referer->setUri(Constant::WECHAT_ENTRY);
      }else{
         $referer->setUri($refererUrl);
      }
      $headers->addHeader($referer);
      $request->setHeaders($headers);
      $response = $client->send($request);
      if(200 != $response->getStatusCode()){
         $this->throwRequestExp();
      }
      return $response;
   }

   /**
    * 获取当前的回调地址
    *
    * @param int $siteId
    * @param string $aid
    * @param array $info
    * @return array
    */
   protected function getCallbackMetaInfo($siteId, $aid, array &$info)
   {
      $info['callbackUrl'] = PLATFROM_ENTRY_URL.'/'.sprintf(Constant::DINGYUE_CALLBACK, $siteId, $aid);
      $info['token'] = Kernel\get_random_str(32);
      $info['encodingAesKey'] = Kernel\get_random_str(43);
   }

   /**
    * @param int $siteId
    * @param int $aid
    * @param array $info
    */
   protected function setupWechatCallback($siteId, $aid, array $info)
   {
      $response = $this->requestWechatPage(sprintf(Constant::WECHAT_DEV_EDITOR_ENTRY, $this->token));
      $html = $response->getBody();
      //分析操作序列
      preg_match('/operation_seq\s*?:\s*?"(\d+?)"/',$html, $match);
      $request = new HttpRequest();
      $headers = $request->getHeaders();
      $headers->addHeaderLine('Origin', Constant::WECHAT_ENTRY);
      $headers->addHeaderLine('X-Requested-With', 'XMLHttpRequest');
      $request->setHeaders($headers);
      $request->setMethod('post');
      $request->setPost(new Parameters(array(
         'url' => $info['callbackUrl'],
         'callback_token' => $info['token'],
         'callback_encrypt_mode' => Constant::MSG_ENCRYTPT_TYPE_NONE,
         'encoding_aeskey' => $info['encodingAesKey'],
         'operation_seq' => $match[1]
      )));

      $response = $this->requestWechatPage(sprintf(Constant::WECHAT_DEV_INFO_SETTING_ENTRY, $this->token), true, $request,
         sprintf(Constant::WECHAT_DEV_EDITOR_ENTRY, $this->token));
      $ret = json_decode($response->getBody(), true);
      $code = $ret['base_resp']['ret'];
//      if(0 !== $code){
//         $errorType = ErrorType::getInstance();
//         Kernel\throw_exception(new Exception(
//            $errorType->msg('E_SET_DEV_INFO_ERROR', $ret['base_resp']['err_msg'])
//         ), $errorType);
//      }

   }

   protected function throwRequestExp()
   {
      $errorType = ErrorType::getInstance();
      Kernel\throw_exception(new Exception(
         $errorType->msg('E_WECHAT_REQUEST_ERROR'),
         $errorType->code('E_WECHAT_REQUEST_ERROR')
      ), $errorType);

   }

}