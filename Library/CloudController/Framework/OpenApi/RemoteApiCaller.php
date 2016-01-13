<?php
/**
 * Cntysoft Cloud Software Team
 */
namespace CloudController\Framework\OpenApi;
use Cntysoft\Kernel;
use Cntysoft\Phalcon\DI\Exception;
use CloudController\Kernel\StdErrorType;
use Zend\Http\Client;
/**
 * 这个类没什么实际的用处，只是用来调试OpenApi接口调用的，暂时不支持认证类型的调试
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
class RemoteApiCaller
{
   /**
    * API服务器的调用地址
    *
    * @var string $server
    */
   protected $server;
   /**
    * @var \Zend\Http\Client $client
    */
   protected $client;
   public function __construct($server)
   {
      $this->server = $server;
      $this->client = new Client($this->server);
      $this->client->setMethod('POST');
   }

   public function call($cls, $method, array $params = array())
   {
      $this->client->setParameterPost(array(
         \Cntysoft\INVOKE_META_KEY => json_encode(array(
            'cls' => $cls,
            'method' => $method
         )),
         \Cntysoft\INVOKE_PARAM_KEY => json_encode($params),
         \Cntysoft\INVOKE_SECURITY_KEY => ''
      ));

      $response = $this->client->send();
      return json_decode($response->getBody(), true);
   }
}
