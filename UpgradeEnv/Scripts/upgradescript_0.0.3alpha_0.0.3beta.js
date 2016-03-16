UpgradeEnv.writeLogMsg("开始创建数据表 app_sys_kelecloud_instance_info");
UpgradeEnv.dbQuery("CREATE TABLE IF NOT EXISTS `app_sys_kelecloud_instance_info` (\
  `id` int(11) NOT NULL COMMENT '可乐云商实例id',\
  `name` varchar(128) NOT NULL COMMENT '实例名称',\
  `instanceKey` varchar(64) NOT NULL COMMENT '实例识别key',\
  `createTime` int(10) unsigned NOT NULL COMMENT '实例创建日期',\
  `serviceStartTime` int(10) unsigned NOT NULL COMMENT '服务开启时间',\
  `serviceEndTime` int(10) unsigned NOT NULL,\
  `serverId` int(10) unsigned NOT NULL COMMENT '服务器ID',\
  `admin` varchar(32) DEFAULT NULL COMMENT '联系人',\
  `phone` varchar(32) DEFAULT NULL COMMENT '联系方式'\
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='可乐云商实例开启时间'");
UpgradeEnv.dbQuery("ALTER TABLE `app_sys_kelecloud_instance_info`\
  ADD PRIMARY KEY (`id`)");
UpgradeEnv.dbQuery("ALTER TABLE `app_sys_kelecloud_instance_info`\
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '可乐云商实例id'");

UpgradeEnv.writeLogMsg("开始创建数据表 app_sys_kelecloud_server_info");

UpgradeEnv.dbQuery("CREATE TABLE IF NOT EXISTS `app_sys_kelecloud_server_info` (\
  `id` int(11) NOT NULL COMMENT '服务器ID',\
  `name` varchar(64) NOT NULL COMMENT '服务器名称',\
  `ip` varchar(15) NOT NULL COMMENT '服务器IP',\
  `platformInfo` text COMMENT '服务器平台配置',\
  `instanceCount` int(10) unsigned NOT NULL COMMENT '实例数量'\
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='可乐云商服务器信息'");
UpgradeEnv.dbQuery("ALTER TABLE `app_sys_kelecloud_server_info`\
  ADD PRIMARY KEY (`id`)");
UpgradeEnv.dbQuery("ALTER TABLE `app_sys_kelecloud_server_info`\
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '服务器ID'");

UpgradeEnv.writeLogMsg("开始创建数据表 app_sys_kelecloud_upgrade_choices");

UpgradeEnv.dbQuery("CREATE TABLE IF NOT EXISTS `app_sys_kelecloud_upgrade_choices` (\
  `id` int(11) NOT NULL COMMENT '升级选择ID',\
  `fromVersion` varchar(32) NOT NULL COMMENT '起点版本号',\
  `toVersion` varchar(32) NOT NULL COMMENT '结束版本号',\
  `description` varchar(128) DEFAULT NULL COMMENT '升级简单描述',\
  `releaseTime` int(10) unsigned NOT NULL COMMENT '发布时间'\
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='升级选择信息表'");
UpgradeEnv.dbQuery("ALTER TABLE `app_sys_kelecloud_upgrade_choices`\
  ADD PRIMARY KEY (`id`)");
UpgradeEnv.dbQuery("ALTER TABLE `app_sys_kelecloud_upgrade_choices`\
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '升级选择ID'");

UpgradeEnv.writeLogMsg("正在处理表 app_sys_appinstaller_installed_apps");
UpgradeEnv.dbQuery("UPDATE `cloudcontroller_devel`.`app_sys_appinstaller_installed_apps` SET `id` = '4' WHERE `app_sys_appinstaller_installed_apps`.`id` = 9");
UpgradeEnv.dbQuery("INSERT INTO `app_sys_appinstaller_installed_apps` (`id`, `name`, `moduleKey`, `appKey`, `type`, `runConfig`, `showOnDesktop`, `installTime`) VALUES\
(5, '可乐云商管理', 'Sys', 'KeleCloud', 1, 'a:0:{}', 1, 1440217498)");


