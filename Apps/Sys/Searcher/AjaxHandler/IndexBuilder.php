<?php
/**
 * Cntysoft Cloud Software Team
 *
 * @author softboy <softboy@fhzc.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 * @createtime 2015/08/07 6:17 PM
 */
namespace App\Sys\Searcher\AjaxHandler;
use Cntysoft\Kernel\App\AbstractHandler;
use App\Sys\Searcher\Constant as SEARCH_CONST;
use App\ZhuChao\Goods\Constant as G_CONST;
use App\Site\Category\Constant as CATE_CONST;
use App\Site\Content\Constant as CNT_CONST;
use App\Site\CmMgr\Constant as CMMGR_CONST;
use App\Sys\Searcher\Exception;
/**
 * 索引生成
 */
class IndexBuilder extends AbstractHandler
{
   /**
    * 获取指定节点下面的信息总数
    * 
    * @param string $params
    */
   public function getCategoryGInfosNum($params)
   {
      $this->checkRequireFields($params, array('cid'));
      $total = $this->getAppCaller()->call(CNT_CONST::MODULE_NAME, CNT_CONST::APP_NAME,  CNT_CONST::APP_API_INFO_LIST,
         'countInfosForCategory', array(
            $params['cid'],
            true
         ));
      return array('total' => $total);
      
   }
   public function buildGInfosIndexByIds(array $params)
   {
      $this->checkRequireFields($params, array('ids', 'force'));
      $this->getAppCaller()->call(
         SEARCH_CONST::MODULE_NAME, SEARCH_CONST::APP_NAME,
         SEARCH_CONST::APP_API_INDEX_BUILDER, 'buildGeneralDocIndexByIds',
         array(
         $params['ids'],
         (boolean) $params['force']
         )
      );
   }

   public function buildGInfosIndexByCategory(array $params)
   {
      //不能快速的调用，不然来不及
      $this->checkRequireFields($params,
         array('cid', 'page', 'pageSize', 'force'));
      $this->getAppCaller()->call(
         SEARCH_CONST::MODULE_NAME, SEARCH_CONST::APP_NAME,
         SEARCH_CONST::APP_API_INDEX_BUILDER, 'buildGeneralDocIndexByCategory',
         array(
         (int) $params['cid'],
         (int) $params['page'],
         (int) $params['pageSize'],
         (boolean) $params['force']
         )
      );
   }
   
   public function deleteGInfosIndexByIds(array $params)
   {
      $this->checkRequireFields($params, array('ids'));
      $this->getAppCaller()->call(
         SEARCH_CONST::MODULE_NAME, SEARCH_CONST::APP_NAME,
         SEARCH_CONST::APP_API_INDEX_BUILDER, 'deleteGInfosIndexByIds',
         array(
         $params['ids']
         )
      );
   }

   public function deleteGInfosIndexByCategory(array $params)
   {
      $this->checkRequireFields($params, array('cid', 'page', 'pageSize'));
      $this->getAppCaller()->call(
         SEARCH_CONST::MODULE_NAME, SEARCH_CONST::APP_NAME,
         SEARCH_CONST::APP_API_INDEX_BUILDER, 'deleteGInfosIndexByCategory',
         array(
         (int) $params['cid'],
         (int) $params['page'],
         (int) $params['pageSize'],
         )
      );
   }
   
   public function buildGoodsIndexByCategory(array $params)
   {
      //不能快速的调用，不然来不及
      $this->checkRequireFields($params,
         array('cid', 'page', 'pageSize', 'force'));
      $this->getAppCaller()->call(
         SEARCH_CONST::MODULE_NAME, SEARCH_CONST::APP_NAME,
         SEARCH_CONST::APP_API_INDEX_BUILDER, 'buildGoodsIndexByCategory',
         array(
         (int) $params['cid'],
         (int) $params['page'],
         (int) $params['pageSize'],
         (boolean) $params['force']
         )
      );
   }

   public function buildGoodsIndexByIds(array $params)
   {
      $this->checkRequireFields($params, array('ids', 'force'));

      $this->getAppCaller()->call(
         SEARCH_CONST::MODULE_NAME, SEARCH_CONST::APP_NAME,
         SEARCH_CONST::APP_API_INDEX_BUILDER, 'buildGoodsIndexByIds',
         array(
         $params['ids'],
         (boolean) $params['force']
         )
      );
   }

   public function deleteGoodsIndexByIds(array $params)
   {
      $this->checkRequireFields($params, array('ids'));
      $this->getAppCaller()->call(
         SEARCH_CONST::MODULE_NAME, SEARCH_CONST::APP_NAME,
         SEARCH_CONST::APP_API_INDEX_BUILDER, 'deleteGoodsIndexByIds',
         array(
         $params['ids']
         )
      );
   }

   public function deleteGoodsIndexByCategory(array $params)
   {
      $this->checkRequireFields($params, array('cid', 'page', 'pageSize'));
      $this->getAppCaller()->call(
         SEARCH_CONST::MODULE_NAME, SEARCH_CONST::APP_NAME,
         SEARCH_CONST::APP_API_INDEX_BUILDER, 'deleteGoodsIndexByCategory',
         array(
         (int) $params['cid'],
         (int) $params['page'],
         (int) $params['pageSize'],
         )
      );
   }

   public function getGoodsList(array $params)
   {
      $this->checkRequireFields($params, array('categoryId'));
      $cid = (int) $params['categoryId'];
      $query = array();
      if (0 != $cid) {
         $query = array(
            'categoryId = ?0',
            'bind' => array(
               0 => $cid
            )
         );
      }
      $orderBy = $limit = $offset = null;
      $this->getPageParams($orderBy, $limit, $offset, $params);
      $list = $this->getAppCaller()->call(
         G_CONST::MODULE_NAME, G_CONST::APP_NAME, G_CONST::APP_API_MGR,
         'getGoodsListBy',
         array(
         $query, true, 'indexGenerated asc, id desc', $offset, $limit
         )
      );
      $total = $list[1];
      $list = $list[0];
      foreach ($list as $item) {
         $category = $item->category;
         $merchant = $item->merchant;
         $item = $item->toArray(true);
         $item['category'] = $category->getName();
         $item['merchant'] = $merchant->getName();
         $ret[] = $item;
      }
      return array(
         'total' => $total,
         'items' => $ret
      );
   }

   public function getGoodsNumForCategory(array $params)
   {
      $this->checkRequireFields($params, array('cid'));
      return array('total' => $this->getAppCaller()->call(
            G_CONST::MODULE_NAME, G_CONST::APP_NAME, G_CONST::APP_API_MGR,
            'countCategoryGoods',
            array(
            (int) $params['cid']
            )
      ));
   }

   /**
    * 获取指定节点下的指定状态的信息列表
    *
    * @param array $params
    * @return array
    */
   public function getInfoListByNodeAndStatus(array $params)
   {
      $this->checkRequireFields($params, array('id'));
      $ret = array();
      $nodeId = $params['id'];
      //在这里需要节点管理器APP相关功能
      $categoryTree = $this->getAppCaller()->call(
         CATE_CONST::MODULE_NAME, CATE_CONST::APP_NAME,
         CATE_CONST::APP_API_STRUCTURE, 'getTreeObject'
      );
      /**
       * 这里WEBOS直接请求的数据 所以节点基本可以保证存在
       * @todo 是否强制检查节点是否存在？
       */
      $cNodes = $categoryTree->getChildren($nodeId, -1, false);
      array_unshift($cNodes, $nodeId);
      /**
       * 这个flag的作用是 当获取的信息列表包含子节点的时候，在节点的前面加上节点的名称
       */
      $flag = false;
      if (count($cNodes) > 1) {
         $flag = true;
      }
      $orderBy = $limit = $offset = null;
      $this->getPageParams($orderBy, $limit, $offset, $params);
      $list = $this->getAppCaller()->call(
         CNT_CONST::MODULE_NAME, CNT_CONST::APP_NAME,
         CNT_CONST::APP_API_INFO_LIST, 'getInfoListByNodeAndStatus',
         array(
         $cNodes,
         CNT_CONST::INFO_M_ALL,
         CNT_CONST::INFO_S_VERIFY,
         true, 'id desc', $offset, $limit
         )
      );
      $total = $list[1];
      $list = $list[0];
      //局部化
      $cmm = $this->getAppCaller()->getAppObject(
         CMMGR_CONST::MODULE_NAME, CMMGR_CONST::APP_NAME,
         CMMGR_CONST::APP_API_MGR
      );
      foreach ($list as $item) {
         $ret[] = $this->getItemArrayFromModel($categoryTree, $cmm, $item, $flag);
      }
      return array(
         'total' => $total,
         'items' => $ret
      );
   }

   /**
    * @param \Cntysoft\Stdlib\Tree $categoryTree
    * @param \App\Site\CmMgr\Mgr $cmmgr
    * @param \App\Site\CmMgr\Model\General $itemObj
    * @param boolean $isRenderTitle
    */
   protected function getItemArrayFromModel($categoryTree, $cmmgr, $itemObj, $isRenderTitle)
   {
      $item = array();
      //优化返回结构加快速度
      $item['title'] = $itemObj->getTitle('title');
      if ($isRenderTitle) {
         $nid = $itemObj->getNodeId();
         $node = $categoryTree->getValue($nid);
         $item['title'] = '[' . $node->getText() . '] ' . $item['title'];
      }
      $item['nid'] = $itemObj->getNodeId();
      $item['editor'] = $itemObj->getEditor();
      $item['hits'] = $itemObj->getHits();
      $item['priority'] = $itemObj->getPriority();
      $item['modelId'] = $itemObj->getCmodelId();
      $item['modelKey'] = $cmmgr->getCModelKeyById($item['modelId']);
      $item['indexGenerated'] = $itemObj->getIndexGenerated();
      $item['status'] = $itemObj->getStatus();
      $item['id'] = $itemObj->getId();
      $item['type'] = $itemObj->getCmodelId();
      return $item;
   }

   /**
    * 获取信息栏目的节点数据
    * 
    * @param array $params
    * @return array
    */
   public function getGInfoCategoryChildren(array $params)
   {
      $this->checkRequireFields($params, array('id'));
      $id = (int) $params['id'];
      $allowTypes = array_key_exists('allowTypes', $params) ? $params['allowTypes'] : array();
      $extraFields = array_key_exists('extraFields', $params) ? $params['extraFields'] : array();
      $tree = $this->getAppCaller()->call(
         CATE_CONST::MODULE_NAME, CATE_CONST::APP_NAME,
         CATE_CONST::APP_API_STRUCTURE, 'getTreeObject'
      );
      $nodes = $tree->getChildren($id, 1, true);
      $ret = $this->formatNodes($nodes, $allowTypes, $extraFields);
      usort($ret,
         function($a, $b) {
         if ($a['priority'] < $b['priority']) {
            return -1;
         } else if ($a['priority'] == $b['priority']) {
            return 0;
         } else {
            return 1;
         }
      });
      return $ret;
   }

   /**
    * 处理节点数据
    *
    * @param array $nodes
    * @return array
    */
   protected function formatNodes(array $nodes, &$allowTypes, $extraFields = array())
   {
      $ret = array();
      foreach ($nodes as $node) {
         $type = $node->getNodeType();
         if (in_array($type, $allowTypes)) {
            $item = array(
               'id' => $node->getId(),
               'text' => $node->getText(),
               'priority' => $node->getPriority(),
               'leaf' => $this->isLeaf($node->getId(), $type),
               'nodeType' => ($node->getId() == 1 ? CATE_CONST::N_TYPE_INDEX : $type)
            );
            if (CATE_CONST::N_TYPE_LINK == $type) {
               $item['linkUrl'] = $node->getLinkUrl();
            }
            foreach ($extraFields as $field) {
               $method = 'get' . ucfirst($field);
               if (!method_exists($node, $method)) {
                  Kernel\throw_exception(new Exception(
                     Kernel\StdErrorType::msg('E_METHOD_NOT_EXIST', $method),
                     Kernel\StdErrorType::code('E_METHOD_NOT_EXIST')
                  ));
               }
               $results = $node->$method();
               if (is_object($results)) {
                  if (0 !== count($results)) {
                     foreach ($results as $result) {
                        $item[$field][] = $result->toArray();
                     }
                  }
               } else {
                  $item[$field] = $results;
               }
            }
            $ret[] = $item;
         }
      }
      return $ret;
   }

   /**
    * 判断是否为ExtJs树的叶子节点
    *
    * @return boolean
    */
   protected function isLeaf($id, $nodeType)
   {
      return $nodeType == CATE_CONST::N_TYPE_LINK ||
         $nodeType == CATE_CONST::N_TYPE_SINGLE ||
         $this->getAppCaller()->call(
            CATE_CONST::MODULE_NAME, CATE_CONST::APP_NAME,
            CATE_CONST::APP_API_STRUCTURE, 'getTreeObject'
         )->isLeaf($id);
   }

}