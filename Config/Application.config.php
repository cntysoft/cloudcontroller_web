<?php

/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
return array(
    'db' =>
    array(
        'host' => '127.0.0.1',
        'username' => 'root',
        'dbname' => 'cloudcontroller_devel',
        'password' => 'cntysoft',
        'charset' => 'utf8',
    ),
    'lang' =>
    array(
        'webos' => 'zh_CN',
        'sys' => 'zh_CN'
    ),
    'modules' =>
    array(
        'Sys' =>
        array(
            'className' => 'Sys\Module',
            'path' => 'Modules/Sys/Module.php',
            'hasConfig' => true,
        ),
        'Utils' =>
        array(
            'className' => 'Utils\Module',
            'path' => 'Modules/Utils/Module.php',
            'hasConfig' => false,
        ),
    ),
    'systemMode' => 2,
    'sysEntry' => 'system',
    'venderFramework' =>
    array(
        0 => 'VsImage'
    ),
    'session' =>
    array(
        'name' => 'sWSwr3asd@#$@#kjakj2',
        'cookie_httponly' => false,
    ),
    'cookie' =>
    array(
        'prefix' => 'op-',
        'encrypt' => true,
        'encryptKey' => 'obl0.wtYF/knDy3O',
        'path' => '/',
        'domain' => NULL,
    ),
    'supportedModules' => array(
        'Sys'
    ),
    'websocket' => array(
        'upgrademgr' => 'websocket/upgrademgr',
        'metaserver' => 'websocket/metaserver'
    )
);
