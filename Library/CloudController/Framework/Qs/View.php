<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\Framework\Qs;
use Cntysoft\Framework\Qs\View as BaseView;
use Cntysoft\Kernel;
use Cntysoft\Framework\Qs\ErrorType;

class View extends BaseView
{
   /**
    * 模板寻找逻辑， 两种方式一种是直接指定一种是查表
    *
    * @param string $resolveType
    * @param string $resolveData
    * @return string
    */
   public function resolveTpl($resolveType, $resolveData)
   {
      //直接指定的话就不会去区分手机平板还是PC了
      if (null == self::$deviceType) {
         $deviceType = $this->detactDeviceType();
      } else {
         $deviceType = self::$deviceType;
      }
      $baseDir = $this->tplRootDir;
      if (self::TPL_RESOLVE_DIRECT == $resolveType) {
         return $resolveData;
      } else if (self::TPL_RESOLVE_FINDER == $resolveType) {
         return $baseDir . DS . $deviceType . DS . $resolveData;
      } else if (self::TPL_RESOLVE_MAP == $resolveType) {
         if (!array_key_exists($resolveData, self::$tplMap)) {
            if (SYS_RUNTIME_MODE_PRODUCT == SYS_RUNTIME_MODE) {
               $errorType = ErrorType::getInstance();
               Kernel\throw_exception(
                  new Exception(
                     sprintf($errorType->msg('E_TPL_MAP_KEY_NOT_EXIST'), $resolveData),
                     $errorType->code('E_TPL_MAP_KEY_NOT_EXIST')),$errorType);
            } else {
               die('map : ' . $resolveData . ' is not exist');
            }
         }
         return $baseDir . DS . $deviceType . DS . self::$tplMap[$resolveData];
      }
   }
}