<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\Framework\Core\FileRef;
use Cntysoft\Framework\Core\FileRef\Manager as BaseMgr;
use Cntysoft\Stdlib\Filesystem;
use Cntysoft\Kernel;
/**
 * 定制化的文件引用管理器
 */
class Manager extends BaseMgr
{
    /**
    * 删除文件引用的文件
    * 
    * @param string $attachment
    */
   protected function doDeleteAttachment($attachment)
   {
      //这里只会有两种情况 一种本地一种OSS上
      if($attachment[0] == DS){
         $filename = CNTY_ROOT_DIR.DS.$attachment;
         if(file_exists($filename)){
            Filesystem::deleteFile($filename);
         }
      }else{
         //这个就是OSS了
         $di = Kernel\get_global_di();
         $ossClient = $di->get('OssClient');
         $ossClient->deleteObjectByRetry(Kernel\get_image_oss_bucket_name(), $attachment);
      }
   }
}