<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\Kernel;
use Zend\Stdlib\ErrorHandler;
/**
 * 标准的错误代码 与 提示信息
 * 系统一些常用的错误信息，出错代码管理等等,内核错误代码名称空间为 1 - 10000
 * 出错代码一旦给定就不再改变了,暂时不用Trait
 * 这个里面不抛出异常 直接出错
 */
class StdErrorType
{
   protected static $map = array(
      'E_REQUEST_TYPE_ERROR' => array(1, 'request type error, current request type do not support operation %s'),
      'E_OPENAPI_NOT_EXIST' => array(3, 'api : %s is not supported'),
      'E_OPENAPI_PERMISSION_DENY' => array(4, 'api : %s invoke fail, permission deny'),
      'E_API_NEED_LOGIN' => array(5, 'api need login')
   );

   /**
    * 根据错误类型获取出错信息
    *
    * @param string $type
    * @return string
    */
   public static function msg($type)
   {
      $tplArgs = func_get_args();
      array_shift($tplArgs);
      if (!array_key_exists($type, self::$map)) {
         trigger_error(sprintf('ERROR type %s is not exist', $type), E_USER_ERROR);
      }
      $tpl = self::$map[$type][1];
      array_unshift($tplArgs, $tpl);
      ErrorHandler::start();
      $msg = call_user_func_array('sprintf', $tplArgs);
      ErrorHandler::stop(true);
      return $msg;
   }

   /**
    * 获取出错代码
    *
    * @param string $type
    * @return int
    * @throws Exception
    */
   public static function code($type)
   {
      if (!array_key_exists($type, self::$map)) {
         trigger_error(sprintf('ERROR type %s is not exist', $type), E_USER_ERROR);
      }
      $data = self::$map[$type];
      return $data[0];
   }

   /**
    * 获取系统所有的错误类型名称
    *
    * @return array
    */
   public static function errorTypes()
   {
      return array(array_keys(self::$map));
   }
}