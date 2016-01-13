<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author Changwang <chenyongwang1104@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\Framework\Qs;
use Cntysoft\Framework\Qs\AssetResolverInterface;
use CloudController\Kernel\StdHtmlPath;
use Cntysoft\Kernel;
use Cntysoft;
class AssetResolver implements AssetResolverInterface
{
   /**
    *  静态文件的基本路径
    *
    * @return string
    */
   public function getAssetBasePath()
   {
      return 'http://statics-res.fhzc.com';
   }

   /**
    * Css文件的基本路径
    *
    * @return string
    */
   public function getCssBasePath()
   {
      $basePath = $this->getAssetBasePath();
      return $basePath . '/' . Cntysoft\CSS;
   }

   /**
    * Image文件的基本路径
    *
    * @return string
    */
   public function getImageBasePath()
   {
      $basePath = $this->getAssetBasePath();
      return $basePath . '/' . Cntysoft\IMAGE;
   }

   /**
    *  Js文件的基本路径
    *
    * @return string
    */
   public function getJsBasePath()
   {
      $basePath = StdHtmlPath::getSkinPath();
      return $basePath . '/' . Cntysoft\JS;
   }

}