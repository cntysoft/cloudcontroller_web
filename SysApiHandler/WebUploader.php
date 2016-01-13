<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace SysApiHandler;
use Cntysoft\Framework\ApiServer\AbstractScript;
use Cntysoft\Kernel;
use CloudController\Framework\Net\Upload;
use CloudController\Kernel\StdHtmlPath;
use Cntysoft\Kernel\Exception;
use Cntysoft\Kernel\StdErrorType;
/**
 * 处理系统上传
 *
 * Class WebUploader
 * @package SysApiHandler
 */
class WebUploader extends AbstractScript
{
   /**
    * 处理上传文件
    *
    * @param array $params
    * @return string
    */
   public function process(array $params)
   {
      header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
      header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
      header("Cache-Control: no-store, no-cache, must-revalidate");
      header("Cache-Control: post-check=0, pre-check=0", false);
      header("Pragma: no-cache");
      @set_time_limit(5 * 60);
      $this->processParams($params);
      $request = $this->getDi()->get('request');
      //这里不做检查，相关参数没指定已经有默认的参数了
      //探测分片信息
      $chunk = isset($_REQUEST["chunk"]) ? intval($_REQUEST["chunk"]) : 0;
      $chunks = isset($_REQUEST["chunks"]) ? intval($_REQUEST["chunks"]) : 1;
      $params['chunk'] = $chunk;
      $params['total_chunk'] = $chunks;

      $uploadPath = $params['uploadDir'];
      unset($params['uploadDir']);
      $params['uploadDir'] = $uploadPath;
      //在这里强制的不启用缩略图
      $params['enableNail'] = false;
      $uploader = new Upload($params);
      $files = $request->getUploadedFiles();
      //在这里是否需要检测是否有错误, 探测到错误的时候抛出异常
      return $uploader->saveUploadFile(array_shift($files));
   }

   /**
    * 主要是设置一下路径
    *
    * @param array $params
    */
   protected function processParams(array &$params)
   {
      if (array_key_exists('uploadDir', $params)) {
         $params['uploadDir'] = Kernel\real_path($params['uploadDir']); //这里将文件夹的编码转换了
      } else {
         Kernel\throw_exception(new Exception(
            StdErrorType::msg('E_UPLOAD_PATH_EMPTY'), StdErrorType::code('E_UPLOAD_PATH_EMPTY')
         ));
      }
   }

}