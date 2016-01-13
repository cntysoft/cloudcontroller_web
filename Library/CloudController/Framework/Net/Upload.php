<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\Framework\Net;
use Cntysoft\Kernel;
use Cntysoft\Framework\Net\Upload as BaseUpload;
use Cntysoft\Framework\Core\FileRef\Manager as FileRefManager;
use Cntysoft\Stdlib\Filesystem as FsLib;
/**
 * 处理文件上传
 */
class Upload extends BaseUpload
{

   /**
    * @inheritdoc
    */
   public function afterSaveUploadFilesHandler($savedFiles)
   {
      $ret = array();
      $di = Kernel\get_global_di();
      $ossClient = $di->get('OssClient');
      $bucketName = Kernel\get_image_oss_bucket_name();
      $opts = $this->getOptions();
      $useOss = $opts->getUseOss();
      if ($opts->getEnableFileRef()) {
         $refManager = new FileRefManager();
         foreach ($savedFiles as $file) {
            $objectName = str_replace(CNTY_UPLOAD_DIR . DS, '', $file);
            $item = array();
            $stat = stat($file);
            try {
               if ($useOss) {
                  //暂时尝试小文件上传函数
                  $retry = 3;
                  $isOk = false;
                  while ($retry-- > 0) {
                     $response = $ossClient->uploadFileByFile($bucketName,
                        $objectName, $file);
                     if ($ossClient->responseIsOk($response)) {
                        $isOk = true;
                        break;
                     }
                  }
                  if (!$isOk) {
                     throw new \Exception('上传文件到阿里云失败');
                  }
                  $attachment = $objectName;
                  $filename = $objectName;
                  FsLib::deleteFile($file);
               } else {
                
                  $attachment = Kernel\convert_2_utf8(str_replace(CNTY_ROOT_DIR,
                           '', $file));
                  $filename = Kernel\convert_2_utf8(str_replace(DS, '/',
                           str_replace(CNTY_ROOT_DIR, '', $file)));
               }
               $rid = $refManager->addTempFileRef(array(
                  'filesize' => $stat['size'],
                  'filename' => Kernel\convert_2_utf8(FsLib::basename($file)),
                  'attachment' => $attachment
               ));
               $item['rid'] = $rid;
               $item['filename'] = $filename;
               array_push($ret, $item);
            } catch (\Exception $e) {
               FsLib::deleteFile($file);
               throw $e;
            }
         }
         //从这里返回，第一个是正常图片的名称，第二个是缩略图的名称，这里就这样写死了
         //这里的处理方式有点不大好
         return $ret;
      }
      //不加入文件引用
      foreach ($savedFiles as $file) {
         $objectName = str_replace(CNTY_UPLOAD_DIR . DS, '', $file);
         $item = array();
         $stat = stat($file);
         try {
            if ($useOss) {
               //暂时尝试小文件上传函数
               $retry = 3;
               $isOk = false;
               while ($retry-- > 0) {
                  $response = $ossClient->uploadFileByFile($bucketName,
                     $objectName, $file);
                  if ($ossClient->responseIsOk($response)) {
                     $isOk = true;
                     break;
                  }
               }
               if (!$isOk) {
                  throw new \Exception('上传文件到阿里云失败');
               }
               $ret[] = array(
                  'filename' => $objectName
               );
               FsLib::deleteFile($file);
            }else{
               $ret[] = array(
                  'filename' => Kernel\convert_2_utf8(str_replace(DS, '/', str_replace(CNTY_ROOT_DIR, '', $file)))
               );
            }
         } catch (\Exception $e) {
            FsLib::deleteFile($file);
            throw $e;
         }
      }
      return $ret;
   }

   /**
    * 获取OSS上传图片的远端地址
    * 
    * @param type $bucket
    * @param type $objectName
    */
   protected function getObjectFileUrl($bucket, $objectName)
   {
      //后台查看图片不使用CDN，而且只用公网查看
      return 'http://' . $bucket . '.' . \Cntysoft\OSS_PUBLIC_ENTRY . '/' . $objectName;
   }

}