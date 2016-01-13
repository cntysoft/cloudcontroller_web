<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace CloudController\Framework\Qs;
use Cntysoft\Framework\Qs\TagResolverInterface;
use Cntysoft\Kernel;

/**
 * 默认标签路径寻找类
 */
class TagResolver implements TagResolverInterface
{
   /**
    * @inheritdoc
    */
   public function getTagBaseDir()
   {
      return CNTY_TAG_DIR;
   }

   /**
    * @inheritdoc
    */
   public function getTagLabelBaseNs()
   {
      return 'TagLibrary\Label';
   }

   /**
    * @inheritdoc
    */
   public function getTagDsBaseNs()
   {
      return 'TagLibrary\Ds';
   }
}