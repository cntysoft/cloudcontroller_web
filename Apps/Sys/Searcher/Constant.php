<?php
/**
 * Cntysoft Cloud Software Team
 */
namespace App\Sys\Searcher;
/**
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
final class Constant
{
   const MODULE_NAME = 'Sys';
   const APP_NAME = 'Searcher';
   const APP_API_SEARCHER = 'Searcher';
   const APP_API_INDEX_BUILDER = 'IndexBuilder';
   //商品搜索索引
   const GOODS_INDEX_NAME = 'fhzc_goods';
   const GOODS_INDEX_NAME_DEVEL = 'fhzc_goods_devel';
   const GOODS_INDEX_NAME_DEBUG = 'fhzc_goods_debug';
   const GOODS_INDEX_MAIN_TABLE_NAME = 'main';
   //普通文章的搜索索引
   const GENERAL_DOC_INDEX_NAME = 'fhzc_general_doc';
   const GENERAL_DOC_INDEX_NAME_DEVEL = 'fhzc_general_doc_devel';
   const GENERAL_DOC_INDEX_NAME_DEBUG = 'fhzc_general_doc_debug';
   const GENERAL_DOC_INDEX_MAIN_TABLE_NAME = 'main';
   //查询推荐的名称
   const GOODS_SUGGEST_NAME = 'goods_suggest';
   const GINFO_SUGGEST_NAME = 'fhzc_doc_suggest';
   const ATTR_FILTER_REGEX = '/[\s:\/\(\)\*&@!#$%\^\-+~\?]/is';
}