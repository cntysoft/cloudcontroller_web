<?php
/**
 * Cntysoft Cloud Software Team
 */
namespace App\Sys\Searcher;
use Cntysoft\Kernel\App\AbstractLib;
use Cntysoft\Framework\Cloud\Ali\OpenSearch\Search as OpenSearch;
use Cntysoft\Framework\Cloud\Ali\OpenSearch\Suggest as SearchSuggest;
use App\ZhuChao\Goods\Constant as G_CONST;
use App\ZhuChao\CategoryMgr\Constant as CATE_CONST;
use Cntysoft\Kernel;
/**
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
class Searcher extends AbstractLib
{

   const SORT_HITS = 'hits'; //这种方式程序自己排列
   const SORT_PRICE = 'price';
   const SORT_TIME = 'inputtime';
   const FLAG_UP = '+';
   const FLAG_DOWN = '-';

   /**
    * @var \Cntysoft\Framework\Cloud\Ali\OpenSearch\ApiCaller $openSearchApiCaller
    */
   protected $openSearchApiCaller = null;

   /**
    * 实现一个简单的搜索接口
    * 
    * @param string $text
    * @param array $attrFilter
    * @param array $withQueryAttrs
    * @return array
    */
   public function query($text, $page = 0, $pageSize = \Cntysoft\STD_PAGE_SIZE, $attrFilter = array(), array $sorts = array(), $withQueryAttrs = false)
   {

      $searcher = new OpenSearch($this->getOpenSearchApiCaller());
      $searcher->setSearchIndexs(array($this->getGoodsIndexName()));
      $queryCond = array(
         'query' => array(
            OpenSearch::QUERY_CONF_QUERY => sprintf("default:'%s'", $text),
            OpenSearch::QUERY_CONF_CONFIG => array(
               'start' => $page * $pageSize,
               'hit' => $pageSize
            )
      ));
      if (!empty($sorts)) {
         $sortKey = $sorts['key'];
         $sortType = $sorts['type'];
         if (!in_array($sortKey,
               array(self::SORT_HITS, self::SORT_PRICE, self::SORT_TIME))) {
            $errorType = $this->getErrorType();
            Kernel\throw_exception(new Exception(
               $errorType->msg('SORT_KEY_NOT_SUPPORT', $sortKey),
               $errorType->code('SORT_KEY_NOT_SUPPORT')));
         }
         if (!in_array($sortType, array(self::FLAG_UP, self::FLAG_DOWN))) {
            $errorType = $this->getErrorType();
            Kernel\throw_exception(new Exception(
               $errorType->msg('SORT_TYPE_NOT_SUPPORT', $sortType),
               $errorType->code('SORT_TYPE_NOT_SUPPORT')));
         }
         if (self::SORT_HITS != $sortKey) {
            $queryCond['query'][OpenSearch::QUERY_CONF_SORT] = array(
               $sortType . $sortKey
            );
         }
      }
      if (!empty($attrFilter)) {
         $filter = array();
         if (isset($attrFilter['trademarkid'])) {
            $filter[] = sprintf('trademarkid = %d', $attrFilter['trademarkid']);
            unset($attrFilter['trademarkid']);
         }
         if (isset($attrFilter['price'])) {
            $range = $attrFilter['price'];
            $filter[] = sprintf('price >= %d AND price < %d', $range[0],
               $range[1]);
            unset($attrFilter['price']);
         }
         foreach ($attrFilter as $key => $val){
            $filter[] = 'attrmap = "'.md5(strtolower(preg_replace(Constant::ATTR_FILTER_REGEX, '', $key.$val))).'"';
         }
         if (!empty($filter)) {
            $filter = implode(' AND ', $filter);
            $queryCond['query'][OpenSearch::QUERY_CONF_FILTER] = $filter;
         }
      }
      //最简单的搜索
      $response = $searcher->search($queryCond);
      $response = $response['result'];
      $ret = array();
      $searchRet = array(
         'meta' => array(
            'time' => $response['searchtime'],
            'total' => $response['total']
         ),
         'docs' => array()
      );
      $docs = array();
      //暂时我们重新获取相关商品信息
      $gmgr = $this->getAppCaller()->getAppObject(G_CONST::MODULE_NAME,
         G_CONST::APP_NAME, G_CONST::APP_API_MGR);
      foreach ($response['items'] as $item) {
         $ginfo = $gmgr->getGoodsInfo($item['id']);
//         $attrMap = $ginfo->getSearchAttrMap();
//         if (!empty($attrFilter)) {
//            $allow = false;
//            foreach ($attrFilter as $key => $val) {
//               if(isset($attrMap[$key])){
//                  $searchedIn = $attrMap[$key].'';
//                  if(false !== strpos($searchedIn, $val)){
//                     $allow = true;
//                     break;
//                  }
//               }
//            }
//            if (!$allow) {
//               continue;
//            }
//         }

         $docs[] = array(
            'id' => $ginfo->getId(),
            'categoryId' => $ginfo->getCategoryId(),
            'title' => $ginfo->getTitle(),
            'hits' => $ginfo->getHits(),
            'grade' => $ginfo->getGrade(),
            'img' => $ginfo->getImg(),
            'price' => $ginfo->getPrice()
         );
      }
      if (!empty($sorts)) {
         $sortKey = $sorts['key'];
         $sortType = $sorts['type'];
         if (self::SORT_HITS == $sortKey) {
            //按照点击量排序只能程序进行排序
            usort($docs,
               function($a, $b)use($sortType) {
               if ($a['hits'] < $b['hits']) {
                  if (self::FLAG_UP == $sortType) {
                     return -1;
                  } else if (self::FLAG_DOWN == $sortType) {
                     return 1;
                  }
               } else if ($a['hits'] == $b['hits']) {
                  return 0;
               } else if ($a['hits'] > $b['hits']) {
                  if (self::FLAG_UP == $sortType) {
                     return 1;
                  } else if (self::FLAG_DOWN == $sortType) {
                     return -1;
                  }
               }
            });
         }
      }
      $searchRet['docs'] = $docs;
      $ret['search_info'] = $searchRet;
      if ($withQueryAttrs) {
         //聚合搜索结果
         //获取第一个结果的查询属性
         $catemgr = $this->getAppCaller()->getAppObject(
            CATE_CONST::MODULE_NAME, CATE_CONST::APP_NAME,
            CATE_CONST::APP_API_MGR);
         $attrs = array();
         foreach ($docs as $doc) {
            $attrItems = array();
            $category = $catemgr->getNode($doc['categoryId']);
            foreach ($category->queryAttrs as $attr) {
               $attrItems[$attr->getName()] = explode(',', $attr->getOptValues());
            }
            //增加品牌
            $trademarks = array();
            foreach ($category->trademarks as $t) {
               if (!array_key_exists($t->getId(), $trademarks)) {
                  $trademarks[$t->getId()] = array(
                     'id' => $t->getId(),
                     'name' => $t->getName(),
                     'logo' => $t->getLogo()
                  );
               }
            }
            $attrs = array_merge_recursive($attrs, $attrItems);
         }
         foreach ($attrs as $key => $values) {
            $attrs[$key] = array_unique($values);
         }
         if (!empty($trademarks)) {
            $attrs['品牌'] = $trademarks;
         }
         $ret['queryAttrs'] = $attrs;
      }
      return $ret;
   }

   /**
    * 搜索常规信息
    * 
    * @param string $text
    * @param int $page
    * @param int $pageSize
    * @return array
    */
   public function queryGeneralInfo($text, $page = 0, $pageSize = \Cntysoft\STD_PAGE_SIZE)
   {
      $searcher = new OpenSearch($this->getOpenSearchApiCaller());
      $searcher->setSearchIndexs(array($this->getGenrealDocIndexName()));
      $queryCond = array(
         'query' => array(
            OpenSearch::QUERY_CONF_QUERY => sprintf("default:'%s'", $text),
            OpenSearch::QUERY_CONF_CONFIG => array(
               'start' => $page * $pageSize,
               'hit' => $pageSize
            )
      ));
      $response = $searcher->search($queryCond);
      $response = $response['result'];
      $ret = array();
      $searchRet = array(
         'meta' => array(
            'time' => $response['searchtime'],
            'total' => $response['total']
         ),
         'docs' => $response['items']
      );
      $ret['search_info'] = $searchRet;
      return $ret;
   }

   /**
    * 获取商品查询建议列表
    * 
    * @param string $query
    * @param int $hits
    * @return array
    */
   public function getGoodsQuerySuggests($query, $hits = 5)
   {
      $indexName = $this->getGoodsIndexName();
      return $this->getQuerySuggests($query, $indexName,
            Constant::GOODS_SUGGEST_NAME, $hits);
   }

   /**
    * 获取普通信息的查询分析列表
    * 
    * @param string $query
    * @param int $hits
    * @return array
    */
   public function getGinfoQuerySuggests($query, $hits = 5)
   {
      $indexName = $this->getGenrealDocIndexName();
      return $this->getQuerySuggests($query, $indexName,
            Constant::GINFO_SUGGEST_NAME, $hits);
   }

   /**
    * 获取查询建议的列表
    * 
    * @param string $query
    * @param string $indexName
    * @param string $suggestName
    * @param int $hits
    * @return array
    */
   public function getQuerySuggests($query, $indexName, $suggestName, $hits)
   {
      $suggest = new SearchSuggest($this->getOpenSearchApiCaller());
      return $suggest->search(array(
            'query' => $query,
            'indexName' => $indexName,
            'suggestName' => $suggestName,
            'hits' => $hits
      ));
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
         return Constant::GOODS_INDEX_NAME_DEVEL;
      } else {
         return Constant::GOODS_INDEX_NAME;
      }
   }

   /**
    * @return string
    */
   protected function getGenrealDocIndexName()
   {
      if (Kernel\is_local_deploy()) {
         $indexName = Constant::GENERAL_DOC_INDEX_NAME_DEVEL;
      } else {
         $indexName = Constant::GENERAL_DOC_INDEX_NAME;
      }
      return $indexName;
   }

}