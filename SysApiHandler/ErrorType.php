<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace SysApiHandler;
use Zend\Stdlib\ErrorHandler;
/**
 * 为每个需要错误处理的地方提供一个集中管理异常信息的解决方案
 */
class ErrorType
{
    /**
     * 错误管理信息
     *
     * @var array $map
     */
    protected $map = array(
       'E_PATH_NOT_ALLOWED' => array(10001, 'path %s is not allowed.'),
       'E_FILE_NOT_WRITABLE' => array(10002, 'path is not writable'),
       'E_OP_NOT_SUPPORTED' => array(10003, 'operate is not support'),
       'E_OLD_PASSWORD_ERROR' => array(10004, 'the old password is wrong')
    );
    /**
     * 提供这样的构造函数可以让其在APP中以数据的方式加载映射数据表
     *
     * @param array $map
     */
    public function __construct(array $map = array())
    {
        if(!empty($map)){
            $this->map = $map;
        }
    }
    /**
     * 根据错误类型获取出错信息
     *
     * @param string $type
     * @return string
     */
    public function msg($type)
    {
        $tplArgs = func_get_args();
        array_shift($tplArgs);
        if (!array_key_exists($type, $this->map)) {
            trigger_error(sprintf('ERROR type %s is not exist', $type), E_USER_ERROR);
        }
        $tpl = $this->map[$type][1];
        array_unshift($tplArgs, $tpl);
        ErrorHandler::start();
        $msg = call_user_func_array('sprintf', $tplArgs);
        ErrorHandler::stop(true);
        return $msg;
    }
    /**
     * 获取原始的字符串信息
     *
     * @param string $type
     */
    public function rawMsg($type)
    {
        if (!array_key_exists($type, $this->map)) {
            trigger_error(sprintf('ERROR type %s is not exist', $type), E_USER_ERROR);
        }
        return  $this->map[$type][1];
    }

    /**
     * 获取出错代码
     *
     * @param string $type
     * @return int
     * @throws Exception
     */
    public function code($type)
    {
        if (!array_key_exists($type, $this->map)) {
            trigger_error(sprintf('ERROR type %s is not exist', $type), E_USER_ERROR);
        }
        $data = $this->map[$type];
        return $data[0];
    }

    /**
     * 获取系统所有的错误类型名称
     *
     * @return array
     */
    public function errorTypes()
    {
        return array(array_keys($this->map));
    }
    /**
     * 获取错误实例
     *
     * @return \Cntysoft\Stdlib\ErrorType
     */
    public static function getInstance()
    {
        return new static();
    }
}