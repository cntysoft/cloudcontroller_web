<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author softboy <softboy@fhzc.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 * @createtime 2015/08/07 6:17 PM
 */
namespace App\Sys\Searcher;
use Cntysoft\Kernel;
use Cntysoft\Kernel\App\AbstractLib;
use App\ZhuChao\Goods\Constant as GOODS_CONST;
use Cntysoft\Framework\Cloud\Ali\OpenSearch\Document as DocMgr;
use App\Site\Content\Constant as CNT_CONST;
use App\Site\CmMgr\Constant as CMMGR_CONST;
use App\Site\Category\Constant as CATE_CONST;
use App\ZhuChao\CategoryMgr\Constant as GCATE_CONST;
/**
 * 索引生成类，主要跟搜索引擎服务器进行交流，生成相关的索引文件
 */
class IndexBuilder extends AbstractLib
{

   /**
    * @var \Cntysoft\Framework\Cloud\Ali\OpenSearch\ApiCaller $openSearchApiCaller
    */
   protected $openSearchApiCaller = null;

   /**
    * 生成普通文章的索引文件
    * 
    * @param array $ids
    * @param boolean $force
    * @throws \App\Sys\Searcher\Exception
    */
   public function buildGeneralDocIndexByIds(array $ids, $force = false)
   {
      $generalInfos = $this->getAppCaller()->getAppObject(
         CNT_CONST::MODULE_NAME, CNT_CONST::APP_NAME,
         CNT_CONST::APP_API_INFO_LIST
      );
      $infos = $generalInfos->getInfosByIds($ids);
      $this->doBuildGenerateDocsIndex($infos, $force);
   }

   /**
    * 根据指定的栏目生成相关信息的搜索索引
    * 
    * @param int $cid
    * @param int $page
    * @param int $pageSize
    * @param boolean $force
    * @throws \App\Sys\Searcher\Exception
    */
   public function buildGeneralDocIndexByCategory($cid, $page, $pageSize = \Cntysoft\STD_PAGE_SIZE, $force = false)
   {
      $cid = (int) $cid;
      //在这里需要节点管理器APP相关功能
      $categoryTree = $this->getAppCaller()->call(
         CATE_CONST::MODULE_NAME, CATE_CONST::APP_NAME,
         CATE_CONST::APP_API_STRUCTURE, 'getTreeObject'
      );
      /**
       * 这里WEBOS直接请求的数据 所以节点基本可以保证存在
       * @todo 是否强制检查节点是否存在？
       */
      $cNodes = $categoryTree->getChildren($cid, -1, false);
      array_unshift($cNodes, $cid);
      $ret = $this->getAppCaller()->call(
         CNT_CONST::MODULE_NAME, CNT_CONST::APP_NAME,
         CNT_CONST::APP_API_INFO_LIST, 'getInfoListByNodeAndStatus',
         array(
         $cNodes,
         CNT_CONST::INFO_M_ALL,
         CNT_CONST::INFO_S_VERIFY,
         true, 'id desc', ($page - 1) * $pageSize, $pageSize
         )
      );
      $cmmgr = $this->getAppCaller()->getAppObject(
         CNT_CONST::MODULE_NAME, CNT_CONST::APP_NAME, CNT_CONST::APP_API_MANAGER);
      $infos = array();
      foreach ($ret[0] as $ginfo) {
         $infos[] = $cmmgr->read($ginfo->getId());
      }
      $this->doBuildGenerateDocsIndex($infos, $force);
   }

   protected function doBuildGenerateDocsIndex($infos, $force = false)
   {
      $cmmgr = $this->getAppCaller()->getAppObject(
         CMMGR_CONST::MODULE_NAME, CMMGR_CONST::APP_NAME,
         CMMGR_CONST::APP_API_MGR);
      $docs = array();
      $statusChangeSet = array();
      foreach ($infos as $info) {
         $ginfo = $info[0];
         $subInfo = $info[1];
         if (!$ginfo->getIsDeleted() && ($force || !$ginfo->getIndexGenerated())) {
            $infoItem = array(
               'id' => $ginfo->getId(),
               'title' => $ginfo->getTitle(),
               'categoryId' => $ginfo->getNodeId(),
               'intro' => $ginfo->getIntro(),
               'inputtime' => $ginfo->getInputTime()
            );
            $mkey = $cmmgr->getCModelKeyById($ginfo->getCmodelId());
            $content = '';
            $coverImage = $ginfo->getDefaultPicUrl();
            if ($mkey == CMMGR_CONST::M_KEY_ARTICLE || $mkey == CMMGR_CONST::M_KEY_ANNOUNCE) {
               $content = $subInfo->getContent();
            } else if ($mkey == CMMGR_CONST::M_KEY_IMAGE || $mkey == CMMGR_CONST::M_KEY_EFFECT_IMAGE) {
               foreach ($subInfo->getImages() as $image) {
                  if ($coverImage == '' && $image['filename'] !== '') {
                     $coverImage = $image['filename'];
                  }
                  $content .= $image['description'];
               }
            }
            if (is_array($coverImage)) {
               $infoItem['image'] = $coverImage[0];
            } else {
               $infoItem['image'] = $coverImage;
            }
            $infoItem['content'] = $content;
            $docs[] = $infoItem;
            $statusChangeSet[] = $ginfo;
         }
      }
      if (empty($docs)) {
         return;
      }
      $docMgr = new DocMgr($this->getGenrealDocIndexName(),
         $this->getOpenSearchApiCaller());
      //@TODO 这个地方可能会有漏洞，可能造成的情况是这边的数据库里面的标志信息已经更新但是搜索引擎的索引没有更新
      $db = Kernel\get_db_adapter();
      try {
         $db->begin();

         $retry = 3;
         $isOk = false;
         $addException = null;
         while ($retry > 0) {
            try {
               $docMgr->add(Constant::GENERAL_DOC_INDEX_MAIN_TABLE_NAME, $docs);
               $isOk = true;
               break;
            } catch (\Exception $ex) {
               $retry--;
               $addException = $ex;
               usleep(500000);
               continue;
            }
         }
         if (!$isOk) {
            throw $addException;
         }
         foreach ($statusChangeSet as $info) {
            $info->setIndexGenerated(true);
            $info->save();
         }
         $db->commit();
      } catch (Exception $ex) {
         $db->rollback();
         Kernel\throw_exception($ex, $this->getErrorTypeContext());
      }
   }

   public function deleteGInfosIndexByCategory($cid, $page, $pageSize = \Cntysoft\STD_PAGE_SIZE)
   {
      $cid = (int) $cid;
      //在这里需要节点管理器APP相关功能
      $categoryTree = $this->getAppCaller()->call(
         CATE_CONST::MODULE_NAME, CATE_CONST::APP_NAME,
         CATE_CONST::APP_API_STRUCTURE, 'getTreeObject'
      );
      /**
       * 这里WEBOS直接请求的数据 所以节点基本可以保证存在
       * @todo 是否强制检查节点是否存在？
       */
      $cNodes = $categoryTree->getChildren($cid, -1, false);
      array_unshift($cNodes, $cid);
      $list = $this->getAppCaller()->call(
         CNT_CONST::MODULE_NAME, CNT_CONST::APP_NAME,
         CNT_CONST::APP_API_INFO_LIST, 'getInfoListByNodeAndStatus',
         array(
         $cNodes,
         CNT_CONST::INFO_M_ALL,
         CNT_CONST::INFO_S_VERIFY,
         true, 'id desc', ($page - 1) * $pageSize, $pageSize
         )
      );
      $this->doDeleteGInfosIndex($list[0]);
   }

   public function deleteGInfosIndexByIds(array $ids)
   {
      $infoMgr = $this->getAppCaller()->getAppObject(
         CNT_CONST::MODULE_NAME, CNT_CONST::APP_NAME,
         CNT_CONST::APP_API_INFO_LIST
      );
      $ginfos = $infoMgr->getInfosByIds($ids, false);
      $this->doDeleteGInfosIndex($ginfos);
   }

   protected function doDeleteGInfosIndex($infos)
   {
      $docs = array();
      $statusChangeSet = array();
      foreach ($infos as $info) {
         $docs[] = array(
            'id' => $info->getId()
         );
         $statusChangeSet[] = $info;
      }

      if (empty($docs)) {
         return;
      }
      $docMgr = new DocMgr($this->getGenrealDocIndexName(),
         $this->getOpenSearchApiCaller());
      //@TODO 这个地方可能会有漏洞，可能造成的情况是这边的数据库里面的标志信息已经更新但是搜索引擎的索引没有更新
      $db = Kernel\get_db_adapter();
      try {
         $db->begin();
         $retry = 3;
         $isOk = false;
         $addException = null;
         while ($retry > 0) {
            try {
               $ret = $docMgr->delete(Constant::GENERAL_DOC_INDEX_MAIN_TABLE_NAME,
                  $docs);
               $isOk = true;
               break;
            } catch (\Exception $ex) {
               $retry--;
               $addException = $ex;
               usleep(500000);
               continue;
            }
         }
         if (!$isOk) {
            throw $addException;
         }

         foreach ($statusChangeSet as $info) {
            $info->setIndexGenerated(false);
            $info->save();
         }
         $db->commit();
      } catch (\Exception $ex) {
         $db->rollback();
         Kernel\throw_exception(
            $ex, $this->getErrorTypeContext());
      }
   }

   /**
    * 根据商品的id，生成商品信息的索引文件
    * 
    * @param array $ids
    * @param boolean $force
    */
   public function buildGoodsIndexByIds(array $ids, $force = false)
   {
      $goodsMgr = $this->getAppCaller()->getAppObject(
         GOODS_CONST::MODULE_NAME, GOODS_CONST::APP_NAME,
         GOODS_CONST::APP_API_MGR
      );
      $ginfos = $goodsMgr->getGoodsInfoByIds($ids);
      $this->doGenerateGoodsIndex($ginfos, $force);
   }

   /**
    * @param int $cid
    * @param int $page
    * @param int $pageSize
    */
   public function buildGoodsIndexByCategory($cid, $page, $pageSize = \Cntysoft\STD_PAGE_SIZE, $force = false)
   {
      //首先我们的查找出来文档数据
      $list = $this->getAppCaller()->call(
         GOODS_CONST::MODULE_NAME, GOODS_CONST::APP_NAME,
         GOODS_CONST::APP_API_MGR, 'getGoodsInfosByCategoryId',
         array(
         $cid, true, 'id desc', ($page - 1) * $pageSize, $pageSize
         )
      );
      $this->doGenerateGoodsIndex($list[0], $force);
   }

   protected function doGenerateGoodsIndex($infos, $force = false)
   {
      $docs = array();
      $statusChangeSet = array();
      $gcategoryMgr = $this->getAppCaller()->getAppObject(GCATE_CONST::MODULE_NAME,
         GCATE_CONST::APP_NAME, GCATE_CONST::APP_API_MGR);
      $gmgr = $this->getAppCaller()->getAppObject(GOODS_CONST::MODULE_NAME,
         GOODS_CONST::APP_NAME, GOODS_CONST::APP_API_MGR);
      $searchKeyPool = array();
      foreach ($infos as $info) {
         $dinfo = $info->detailInfo;
         if ($force || !$info->getIndexGenerated()) {
            $cid = $info->getCategoryId();
            $attrPool = array();
            $cid = $info->getCategoryId();
            if (!isset($searchKeyPool[$cid])) {
               $attrs = $this->getAppCaller()->call(GCATE_CONST::MODULE_NAME,
                  GCATE_CONST::APP_NAME, GCATE_CONST::APP_API_MGR,
                  'getNodeQueryAttrs', array($cid));
               $searchAttrKeys = array();
               foreach ($attrs as $attr) {
                  $searchAttrKeys[] = $attr->getName();
               }
               $searchKeyPool[$cid] = $searchAttrKeys;
            } else {
               $searchAttrKeys = $searchKeyPool[$cid];
            }
            $dinfo = $info->detailInfo;
            $stdAttrMap = $dinfo->getStdAttrMap();
            $stdAttrs = $gmgr->getGoodsStdAttrs($info->getId());
            $combinations = array();
            foreach ($stdAttrs as $attr) {
               $combination = $attr->getCombination();
               foreach ($combination as $i => $val) {
                  if (!isset($combinations[$i])) {
                     $combinations[$i] = array();
                  }
                  if (!in_array($val, $combinations[$i])) {
                     $combinations[$i][] = $val;
                  }
               }
            }

            $i = 0;
            foreach ($stdAttrMap as $key => $val) {
               if (in_array($key, $searchAttrKeys)) {
                  if (is_array($combinations[$i])) {
                     var_dump($key.$combinations[$i]);
                     $attrPool[] = md5(strtolower(preg_replace(Constant::ATTR_FILTER_REGEX, '',$key.implode('/', $combinations[$i]))));
                  } else {
                     var_dump($key.$combinations[$i]);
                     $attrPool[] = md5(strtolower(preg_replace(Constant::ATTR_FILTER_REGEX, '', $key.$combinations[$i])));
                  }
               }
               $i++;
            }
            foreach ($dinfo->getNormalAttrs() as $gkey => $normalAttrs) {
               foreach ($normalAttrs as $akey => $aval) {
                  if (in_array($akey, $searchAttrKeys)) {
                     $attrPool[] = md5(strtolower(preg_replace(Constant::ATTR_FILTER_REGEX, '', $akey.$aval)));
                  }
               }
            }
            $docs[] = array(
               'id' => $info->getId(),
               'title' => $info->getTitle(),
               'price' => $info->getPrice(),
               'merchantid' => $info->getMerchantId(),
               'categoryId' => $cid,
               'trademarkId' => $info->getTrademarkId(),
               'description' => $dinfo->getDescription(),
               'inputtime' => $info->getInputTime(),
               'attrmap' => $attrPool
            );
            $statusChangeSet[] = $info;
         }
      }
      if (empty($docs)) {
         return;
      }
      $docMgr = new DocMgr($this->getGoodsIndexName(),
         $this->getOpenSearchApiCaller());
      //@TODO 这个地方可能会有漏洞，可能造成的情况是这边的数据库里面的标志信息已经更新但是搜索引擎的索引没有更新
      $db = Kernel\get_db_adapter();
      try {
         $db->begin();
         $retry = 3;
         $isOk = false;
         $addException = null;
         while ($retry > 0) {
            try {
               $docMgr->add(Constant::GOODS_INDEX_MAIN_TABLE_NAME, $docs);
               $isOk = true;
               break;
            } catch (\Exception $ex) {
               $retry--;
               $addException = $ex;
               usleep(500000);
               continue;
            }
         }
         if (!$isOk) {
            throw $addException;
         }
         foreach ($statusChangeSet as $info) {
            $info->setIndexGenerated(true);
            $info->save();
         }
         $db->commit();
      } catch (\Exception $ex) {
         $db->rollback();
         Kernel\throw_exception($ex, $this->getErrorTypeContext());
      }
   }

   public function deleteGoodsIndexByIds(array $ids)
   {
      $goodsMgr = $this->getAppCaller()->getAppObject(
         GOODS_CONST::MODULE_NAME, GOODS_CONST::APP_NAME,
         GOODS_CONST::APP_API_MGR
      );
      $ginfos = $goodsMgr->getGoodsInfoByIds($ids);
      $this->doDeleteGoodsIndex($ginfos);
   }

   public function deleteGoodsIndexByCategory($cid, $page, $pageSize = \Cntysoft\STD_PAGE_SIZE)
   {
      //首先我们的查找出来文档数据
      $list = $this->getAppCaller()->call(
         GOODS_CONST::MODULE_NAME, GOODS_CONST::APP_NAME,
         GOODS_CONST::APP_API_MGR, 'getGoodsInfosByCategoryId',
         array(
         $cid, true, 'id desc', ($page - 1) * $pageSize, $pageSize
         )
      );
      $ginfos = $list[0];
      $this->doDeleteGoodsIndex($ginfos);
   }

   protected function doDeleteGoodsIndex($infos)
   {
      $docs = array();
      $statusChangeSet = array();
      foreach ($infos as $info) {
         $docs[] = array(
            'id' => $info->getId()
         );
         $statusChangeSet[] = $info;
      }
      if (empty($docs)) {
         return;
      }
      $docMgr = new DocMgr($this->getGoodsIndexName(),
         $this->getOpenSearchApiCaller());
      //貌似现在返回的信息是不可能失败的
      //@TODO 这个地方可能会有漏洞，可能造成的情况是这边的数据库里面的标志信息已经更新但是搜索引擎的索引没有更新
      $db = Kernel\get_db_adapter();
      try {
         $db->begin();
         $retry = 3;
         $isOk = false;
         $addException = null;
         while ($retry > 0) {
            try {
               $docMgr->delete(Constant::GOODS_INDEX_MAIN_TABLE_NAME, $docs);
               $isOk = true;
               break;
            } catch (\Exception $ex) {
               $retry--;
               $addException = $ex;
               usleep(500000);
               continue;
            }
         }
         if (!$isOk) {
            throw $addException;
         }

         foreach ($statusChangeSet as $info) {
            $info->setIndexGenerated(false);
            $info->save();
         }
         $db->commit();
      } catch (\Exception $ex) {
         $db->rollback();
         Kernel\throw_exception(
            $ex, $this->getErrorTypeContext());
      }
   }

   /**
    * @return \Cntysoft\Framework\Cloud\Ali\OpenSearch\ApiCaller
    */
   protected function getOpenSearchApiCaller()
   {
      if (null == $this->openSearchApiCaller) {
         $this->openSearchApiCaller = $this->di->get('OpenSearchApiCaller');
      }
      return $this->openSearchApiCaller;
   }

   /**
    * @return string
    */
   protected function getGoodsIndexName()
   {
      if (Kernel\is_local_deploy()) {
         $goodsIndex = Constant::GOODS_INDEX_NAME_DEVEL;
      } else if(\Cntysoft\RT_DEPLOY_TYPE == \Cntysoft\DEPLOY_TYPE_PUBLIC_DEBUG){
         $goodsIndex = Constant::GOODS_INDEX_NAME_DEBUG;
      }else if(\Cntysoft\RT_DEPLOY_TYPE == \Cntysoft\DEPLOY_TYPE_PUBLIC_PRODUCT){
         $goodsIndex = Constant::GOODS_INDEX_NAME;
      }
      return $goodsIndex;
   }

   /**
    * @return string
    */
   protected function getGenrealDocIndexName()
   {
      if (Kernel\is_local_deploy()) {
         $goodsIndex = Constant::GENERAL_DOC_INDEX_NAME_DEVEL;
      } else if(\Cntysoft\RT_DEPLOY_TYPE == \Cntysoft\DEPLOY_TYPE_PUBLIC_DEBUG){
         $goodsIndex = Constant::GENERAL_DOC_INDEX_NAME_DEBUG;
      }else if(\Cntysoft\RT_DEPLOY_TYPE == \Cntysoft\DEPLOY_TYPE_PUBLIC_PRODUCT){
         $goodsIndex = Constant::GENERAL_DOC_INDEX_NAME;
      }
      return $goodsIndex;
   }

}