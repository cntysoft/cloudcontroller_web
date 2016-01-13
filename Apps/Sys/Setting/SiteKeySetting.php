<?php
/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
namespace App\Sys\Setting;
use Cntysoft\Kernel\App\AbstractLib;
use App\ZhuChao\Merchant\Constant as MERCHANT_CONST;
use Cntysoft\Framework\Cloud\Ali\Ots\Msg;
/**
 * 生成站点的识别KEY映射数据
 */
class SiteKeySetting extends AbstractLib
{
   /**
    * 生成一次完整的映射数据
    */
   public function generateSiteKeyMap()
   {
      $merchants = $this->getAppCaller()->call(MERCHANT_CONST::MODULE_NAME,
         MERCHANT_CONST::APP_NAME, MERCHANT_CONST::APP_API_MGR,
         'getMerchantList');
      $otsClient = $this->di->get('OtsClient');
      $tablename = $this->getSiteKeyMapTableName();
      $index = 1;
      foreach ($merchants as $merchant) {
         $index++;
         $cond = new Msg\Condition();
         $cond->setRowExistence(Msg\RowExistenceExpectation::IGNORE);
         $siteName = new Msg\Column();
         $siteName->setName('site_name');
         $siteNameValue = new Msg\ColumnValue();
         $siteNameValue->setType(Msg\ColumnValue::V_STRING);
         $siteNameValue->setVString($merchant->getAbbr());
         $siteName->setValue($siteNameValue);
         $siteId = new Msg\Column();
         $siteId->setName('site_id');
         $siteIdValue = new Msg\ColumnValue();
         $siteIdValue->setType(Msg\ColumnValue::V_INT);
         $siteIdValue->setVInt($merchant->getId());
         $siteId->setValue($siteIdValue);
         $otsClient->putRow($tablename, $cond, array($siteName), array($siteId));
         if($index % 10 == 0){
            sleep(1);
         }
      }
   }

   protected function getSiteKeyMapTableName()
   {
      if (\Cntysoft\Kernel\is_devel_mode()) {
         return Constant::SITE_KEY_MAP_OTS_TABEL_NAME_DEVEL;
      } else {
         return Constant::SITE_KEY_MAP_OTS_TABEL_NAME;
      }
   }

}