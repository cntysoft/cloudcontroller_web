<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\Framework\Core;
use Cntysoft\Stdlib\ErrorType as BaseErrorType;
class ErrorType extends BaseErrorType
{
   /**
    * @inheritdoc
    */
   protected $map = array(
      'E_DATA_POOL_KEY_EXIST'     => array(10001, 'data dictionary key : %s is already exist'),
      'E_DATA_POOL_KEY_NOT_EXIST' => array(10002, 'data dictionary key : %s is not exist'),
      'E_KV_KEY_EXIST'            => array(10003, 'key/value map key %s is already exist'),
      'E_KV_KEY_NOT_EXIST'        => array(10004, 'key/value map key %s not exist'),
      'E_FILE_REF_ENTRY_NOT_EXIST' => array(10005, 'file refrence : %d is not exist')
   );
}