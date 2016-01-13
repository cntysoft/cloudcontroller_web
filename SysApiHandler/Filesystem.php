<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace SysApiHandler;
use Cntysoft\Kernel;
use \SplFileInfo;
use Cntysoft\Stdlib\Filesystem as Fs;
use Cntysoft\Framework\ApiServer\AbstractScript;
/**
 * 一些浏览指定目录的文件 一般是系统的上传目录
 */
class Filesystem extends AbstractScript
{
    /**
     * 允许的路径列表
     *
     * @var array $allowPath
     */
    protected static $allowPath = null;
    /**
     * 受保护的不能进行删除的路径列表,所有的这些路径都是从CNTYT_ROOT_DIR开始算起的
     * 这些路径既不能删除也不能重命名
     *
     * @var array $protectList
     */
    protected static $protectList = array(
       'UploadFiles'
    );

    /**
     * 构造函数
     */
    public function __construct()
    {
        if (null == self::$allowPath) {
            self::$allowPath = array(
               '/Statics',
               '/TagLibrary'
            );
        }
    }

    /**
     * 浏览一些文件的内容
     *
     * @param array $params
     * @return array
     */
    public function cat(array $params)
    {
        $this->checkRequireParams($params, array('filename'));
        $filename = $params['filename'];
        //只能查看在allowPath里面的文件
        $this->checkFileOrPathIsAllowed($filename);
        $filename = CNTY_ROOT_DIR . DS . $filename;
        return array('content' => Fs::cat($filename));
    }

    /**
     * 保存数据到指定的文件中
     *
     * @param array $params
     */
    public function save(array $params)
    {
        $this->checkRequireParams($params, array('filename', 'content'));
        $filename = $params['filename'];
        $this->checkFileOrPathIsAllowed($filename);
        $content = $params['content'];
        $filename = CNTY_ROOT_DIR . DS . $filename;
        try {
            $bytes = Fs::save($filename, $content);
            return array('bytes' => $bytes);
        } catch (\Exception $e) {
            $msg = str_replace(CNTY_ROOT_DIR, '', $e->getMessage());
            throw new \Exception($msg, $e->getCode(), $e);
        }
    }

    /**
     * 浏览指定路径的所有文件
     *
     * @param array $params
     * @return array
     */
    public function ls(array $params)
    {
        $this->checkRequireParams($params, array('path'));
        $path = trim((string) $params['path']);
        if ('' == $path) {
            $errorType = ErrorType::getInstance();
            throw new Exception(
               $errorType->msg('E_PATH_CANOT_BE_EMPTY', $path), $errorType->code('E_PATH_CANOT_BE_EMPTY')
            );
        }
        $rpath = CNTY_ROOT_DIR.$path;
        if (!file_exists(Kernel\real_path($rpath))) {
            Fs::createDir($rpath, 0750, true);
        }
        $ret = array(
           'path'    => $path,
           'entries' => array()
        );
        $entries = &$ret['entries'];
        $items = Fs::ls($rpath);
        if (count($items) > 0) {
            foreach ($items as $fileInfo) {
                $entries[] = array(
                   'name'       => Kernel\convert_2_utf8($fileInfo->getFilename()),
                   'type'       => $fileInfo->isDir() ? 'dir' : $fileInfo->getExtension()? : 'txt',
                   'cTime'      => date('Y/m/d G:i:s', $fileInfo->getCTime()),
                   'mTime'      => date('Y/m/d G:i:s', $fileInfo->getMTime()),
                   'isReadable' => $fileInfo->isReadable(),
                   'isWritable' => $fileInfo->isWritable(),
                   'isStartup'  => false,
                   'size'       => Kernel\byte_format($fileInfo->getSize()),
                   'fullPath'   => str_replace(CNTY_ROOT_DIR, '', $rpath)
                );
            }
        }
        return $ret;
    }

    /**
     * 获取文件树节点数据
     *
     * @param array $params
     * @return array
     */
    public function treeLs(array $params)
    {
        $this->checkRequireParams($params, array('path'));
        $path = explode('|', $params['path']);
        if (1 == $path) {
            //正常
            $data = $this->ls($params['path']);
        } else {
            //多起点
            $data = $this->getStartDirPaths(array(
               'startPaths' => $path
            ));
        }
        $ret = array();
        if (!empty($data['entries'])) {
            foreach ($data['entries'] as $item) {
                if ('dir' == $item['type']) {
                    $ret[] = array(
                       'id'   => $data['path'] == '' ? $item['name'] : $data['path'] . '/' . $item['name'],
                       'text' => $item['name']
                    );
                }
            }
        }
        return $ret;
    }

    /**
     * 生成最初的目录列表
     *
     * @param array $params
     * @return array
     */
    public function getStartDirPaths(array $params = array())
    {
        //检查参数
        $this->checkRequireParams($params, array('startPaths'));
        $startPaths = $params['startPaths'];
        if (!is_array($startPaths) || empty($startPaths)) {
            $errorType = ErrorType::getInstance();
            Kernel\throw_exception(new Exception(
               $errorType->msg('E_INVALID_START_PATH'), $errorType->code('E_INVALID_START_PATH')
            ), $errorType);
        }
        if (1 == count($startPaths)) {
            return $this->ls(array(
               'path' => $startPaths[0]
            ));
        }
        $ret = array(
           'path'    => '',
           'entries' => array()
        );
        //根据几个根目录生成一个列表 一定是文件夹
        foreach ($startPaths as $path) {
            if ($this->isValidPath($path)) {
                if (!file_exists(Kernel\real_path($path)) || !is_dir(Kernel\real_path($path))) {
                    $errorType = ErrorType::getInstance();
                    Kernel\throw_exception(new Exception(
                       $errorType->msg('E_FILE_IS_NOT_EXIST_OR_IS_NOT_DIR', $path), $errorType->code('E_FILE_IS_NOT_EXIST_OR_IS_NOT_DIR')
                    ), $errorType);
                }
                $rpath = CNTY_ROOT_DIR . DS . $path;
                $info = new SplFileInfo(Kernel\real_path($rpath));
                $ret['entries'][] = array(
                   'name'        => Kernel\convert_2_utf8($info->getFilename()),
                   'type'        => 'dir',
                   'cTime'       => date('Y/m/d G:i:s', $info->getCTime()),
                   'mTime'       => date('Y/m/d G:i:s', $info->getMTime()),
                   'isReadable'  => $info->isReadable(),
                   'isWritable'  => $info->isWritable(),
                   'isStartup'   => true, //判断是否为起始目录
                   'startupPath' => $path,
                   'size'        => Kernel\byte_format($info->getSize())
                );
            } else {
                $errorType = ErrorType::getInstance();
                Kernel\throw_exception(new Exception(
                   $errorType->msg('E_PATH_NOT_VALID', $rpath), $errorType->code('E_PATH_NOT_VALID')
                ), $errorType);
            }
        }
        return $ret;
    }

    /**
     * 创建一个文件夹
     *
     * @param array $params
     */
    public function createDir(array $params = array())
    {
        $this->checkRequireParams($params, array('dirname'));
        $dirname = (string) $params['dirname'];
        //在这里是否需要判断长度
        $this->checkFileOrPathIsAllowed($dirname);
        $dirname = CNTY_ROOT_DIR . DS . $dirname;
        try {
            return Fs::createDir($dirname);
        } catch (\ErrorException $e) {
            Kernel\rethrow_error_exception($e);
        }
    }

    /**
     * 重命名一个文件夹或者文件
     *
     * @param array $params
     */
    public function rename(array $params = array())
    {
        $this->checkRequireParams($params, array('newName', 'oldName'));
        $oldName = (string) $params['oldName'];
        $newName = (string) $params['newName'];
        //检查是否合法
        $this->checkFileOrPathIsAllowed($oldName);
        $this->checkFileOrPathIsAllowed($newName);
        //检查是否在保护区域
        if (in_array($oldName, self::$protectList)) {
            $errorType = ErrorType::getInstance();
            Kernel\throw_exception(new Exception(sprintf(
               $errorType->msg('E_PATH_CANOT_MODIFY', $oldName), $errorType->code('E_PATH_CANOT_MODIFY')
            )), $errorType);
        }
        $oldName = CNTY_ROOT_DIR . DS . $oldName;
        $newName = CNTY_ROOT_DIR . DS . $newName;
        try {
            return Fs::rename($oldName, $newName);
        } catch (\ErrorException $e) {
            Kernel\rethrow_error_exception($e);
        }
    }

    /**
     * 删除一个目录或者一个文件,判断路径的类型
     *
     * @param array $path array('filename' => 'filename')
     */
    public function deleteFile(array $params = array())
    {
        $this->checkRequireParams($params, array('filename'));
        $filename = $params['filename'];
        //检查是否在保护区域
        $this->checkFileOrPathIsAllowed($filename);
        if (in_array($filename, self::$protectList)) {
            $errorType = ErrorType::getInstance();
            Kernel\throw_exception(new Exception(
               $errorType->msg('E_PATH_CANOT_MODIFY', 'delete', $filename), $errorType->code('E_PATH_CANOT_MODIFY')
            ));
        }
        $filename = CNTY_ROOT_DIR . DS . $filename;
        try {
            return Fs::deleteFile($filename);
        } catch (\ErrorException $e) {
            Kernel\rethrow_error_exception($e);
        }
    }

    /**
     * 批量删除文件
     *
     * @param array $params
     */
    public function deleteFiles(array $params)
    {
        $this->checkRequireParams($params, array('files'));
        $files = $params['files'];
        if (count($files) > 0) {
            foreach ($files as $file) {
                $this->deleteFile(array('filename' => $file));
            }
        }
    }

    /**
     * 递归删除文件夹,这个方法很危险
     *
     * @param array $params
     */
    public function deleteDir(array $params)
    {
        $this->checkRequireParams($params, array('dirname'));
        $dirname = $params['dirname'];
        $this->checkFileOrPathIsAllowed($dirname);
        if (in_array($dirname, self::$protectList)) {
            $errorType = ErrorType::getInstance();
            Kernel\throw_exception(new Exception(
               $errorType->msg('E_PATH_CANOT_MODIFY', 'delete', $dirname), $errorType->code('E_PATH_CANOT_MODIFY')
            ), $errorType);
        }
        $dirname = CNTY_ROOT_DIR . DS . $dirname;
        try {
            //默认递归删除
            return Fs::deleteDirRecusive($dirname);
        } catch (\ErrorException $e) {
            Kernel\rethrow_error_exception($e);
        }
    }

    /**
     * 删除指定的文件夹列表
     *
     * @param array $params
     */
    public function deleteDirs(array $params)
    {
        $this->checkRequireParams($params, array('dirs'));
        $dirs = $params['dirs'];
        foreach ($dirs as $dir) {
            $this->deleteDir(array('dirname' => $dir));
        }
    }

    /**
     * 粘贴指定的文件序列,暂时解决原子性问题
     *
     * @param array $params
     */
    public function paste(array $params)
    {
        $this->checkRequireParams($params, array('type', 'target', 'items'));
        $type = $params['type'];
        $items = $params['items'];
        $target = $params['target'];
        if (!$this->isValidPath($target)) {
            $errorType = ErrorType::getInstance();
            Kernel\throw_exception(new Exception(
               $errorType->msg('E_PATH_NOT_ALLOWED', $target), $errorType->code('E_PATH_NOT_ALLOWED')
            ), $errorType);
        }
        $target = CNTY_ROOT_DIR . $target;
        if (!is_writable(Kernel\real_path($target))) {
            $errorType = ErrorType::getInstance();
            Kernel\throw_exception(new Exception(
               $errorType->msg('E_FILE_NOT_WRITABLE', $target), $errorType->code('E_FILE_NOT_WRITABLE')
            ), $errorType);
        }

        if ($type == 'copy') {
            foreach ($items as $item) {
                //前期就直接重新命名
                if ($this->isValidPath($item)) {
                    $item = preg_replace('/[\\/\\\\]/i', DS, $item);
                    $filename = substr($item, strrpos($item, DS) + 1);
                    $targetName = $target . DS . $filename;
                    $targetName = $this->generateFileName($targetName);
                    $source = CNTY_ROOT_DIR . $item;
                    if (!file_exists(Kernel\real_path($source))) {
                        $errorType = ErrorType::getInstance();
                        Kernel\throw_exception(new Exception(
                           $errorType->msg('E_FILE_NOT_EXIST', $source), $errorType->code('E_FILE_NOT_EXIST')
                        ), $errorType);
                    }
                    if (is_file(Kernel\real_path($source))) {
                        Fs::copyFile($source, $targetName);
                    } else if (is_dir(Kernel\real_path($source))) {
                        Fs::copyDir($source, $target);
                    }
                }
            }
        } else if ($type == 'cut') {
            foreach ($items as $item) {
                //前期就直接重新命名
                if ($this->isValidPath($item)) {
                    $source = CNTY_ROOT_DIR . DS . $item;
                    $source = preg_replace('/[\\/\\\\]/i', DS, $source);
                    $target = preg_replace('/[\\/\\\\]/i', DS, $target);
                    $filename = substr($source, strrpos($source, DS) + 1);
                    $targetName = $target . DS . $filename;
                    if ($targetName == $source) {
                        continue;
                    }
                    $targetName = $this->generateFileName($targetName);
                    if (!file_exists(Kernel\real_path($source))) {
                        $errorType = ErrorType::getInstance();
                        Kernel\throw_exception(new Exception(
                           $errorType->msg('E_FILE_NOT_EXIST', $source), $errorType->code('E_FILE_NOT_EXIST')
                        ), $errorType);
                    }
                    if (is_file(Kernel\real_path($source))) {
                        Fs::copyFile($source, $targetName);
                        Fs::deleteFile($source);
                    } else if (is_dir(Kernel\real_path($source))) {
                        Fs::copyDir($source, $target);
                        Fs::deleteDirRecusive($source);
                    }
                }
            }
        } else {
            $errorType = ErrorType::getInstance();
            Kernel\throw_exception(new Exception(
               $errorType->msg('E_OP_NOT_SUPPORTED', $type), $errorType->code('E_OP_NOT_SUPPORTED')
            ), $errorType);
        }
    }

    /**
     * 判断一个路径是否允许
     *
     * @param string $path
     * @return boolean
     */
    protected function isValidPath($path)
    {
        //主要查看要访问的路径是否允许
        $isValid = false;
        $len = 0;
        foreach (self::$allowPath as $allowPath) {
            //必须要从开始位置算起
            $len = strlen($allowPath);
            if ($allowPath == substr($path, 0, $len)) {
                $isValid = true;
            }
        }
        return $isValid;
    }

    /**
     * 判断一个路径是否允许
     *
     * @param string $path
     * @throws RuntimeException
     */
    protected function checkFileOrPathIsAllowed($path)
    {
        if (!$this->isValidPath($path)) {
            $errorType = ErrorType::getInstance();
            throw new Exception(
               $errorType->msg('E_PATH_NOT_ALLOWED', $path), $errorType->code('E_PATH_NOT_ALLOWED')
            );
        }
    }

    /**
     * 生成唯一的文件名称
     *
     * @param string $filename
     * @return string
     */
    protected function generateFileName($filename)
    {
        if (file_exists(Kernel\real_path($filename))) {
            $filename .= '.copy';
        }
        return $filename;
    }

}