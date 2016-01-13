<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\Framework\OpenApi;
use Cntysoft\Kernel;
use Cntysoft\Kernel\StdErrorType;
abstract class AbstractScript
{
   /**
    * @var \Phalcon\DI $di
    */
   protected $di;
   /**
    * @var \Cntysoft\Kernel\App\Caller $appCaller
    */
   protected $appCaller;

   /**
    * 构造函数，初始化数据
    */
   public function __construct()
   {
      $this->di = Kernel\get_global_di();
      $this->appCaller = $this->di->get('AppCaller');
   }

   /**
    * 检查是否具有必要的参数
    *
    * @throws Exception
    */
   protected function checkRequireFields(array &$params = array(), array $requires = array())
   {
      $leak = array();
      Kernel\array_has_requires($params, $requires, $leak);
      if (!empty($leak)) {
         Kernel\throw_exception(new Exception(
            StdErrorType::msg('E_API_INVOKE_LEAK_ARGS', implode(', ', $leak)), StdErrorType::code('E_API_INVOKE_LEAK_ARGS')), \Cntysoft\STD_EXCEPTION_CONTEXT);
      }
   }

}