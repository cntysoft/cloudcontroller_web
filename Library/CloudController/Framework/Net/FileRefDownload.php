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
use Cntysoft\Framework\Net\FileRefDownload as BaseDownload;
use Cntysoft\Framework\Core\FileRef\Manager as FileRefManager;
use Cntysoft\Stdlib\Filesystem;
/**
 * 文件下载类
 */
class FileRefDownload extends BaseDownload
{

   /**
    * @var \Cntysoft\Framework\Core\FileRef\Manager $fileRefMgr
    */
   protected $fileRefMgr;

   public function __construct()
   {
      parent::__construct();
      $this->fileRefMgr = new FileRefManager();
   }

   /**
    * @inheritdoc
    */
   protected function getSavedFilename($filename, $targetDir, $useOss = false)
   {
      parent::getSavedFilename($filename, $targetDir);
      return $this->fileRefMgr->getAttachmentFilenameByTargetDir($filename,
            $targetDir);
   }

   /**
    *  @inheritdoc
    */
   protected function afterFileSavedHandler(array $refInfo, $savedDir, $useOss = false)
   {
      
      $targetFilename = $refInfo['targetFile'];
      if ($useOss) {
         $di = Kernel\get_global_di();
         $ossClient = $di->get('OssClient');
         $objectName = str_replace('/Data/UploadFiles/', '',
            $refInfo['attachment']);
         $ossClient->uploadFileByFileRetryForFail(Kernel\get_image_oss_bucket_name(), $objectName, $targetFilename);
         if (file_exists($targetFilename)) {
            Filesystem::deleteFile($targetFilename);
         }
         $refInfo['attachment'] = $objectName;
      }
      
      $rid = $this->fileRefMgr->addTempFileRef($refInfo);
      $refInfo['rid'] = $rid;
      return $refInfo;
   }

}