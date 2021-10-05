/*L
   Copyright SAIC, Ellumen and RSNA (CTP)


   Distributed under the OSI-approved BSD 3-Clause License.
   See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
L*/

-- Server version	10.5.11-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


--
-- Table structure for table `annotation`
--
DROP TABLE IF EXISTS `annotation`;
CREATE TABLE `annotation` (
  `file_path` varchar(300) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `annotation_type` varchar(30) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `series_instance_uid` varchar(300) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `general_series_pk_id` bigint(20) DEFAULT NULL,
  `annotations_pk_id` bigint(20) NOT NULL,
  `submission_date` datetime DEFAULT NULL,
  PRIMARY KEY (`annotations_pk_id`),
  UNIQUE KEY `PK_ANNOTATIONS_PK_ID` (`annotations_pk_id`),
  KEY `fk_ann_gs_pk_id` (`general_series_pk_id`),
  KEY `annotation_file_size` (`file_size`),
  KEY `annotations_submitted_date_idx` (`submission_date`),
  CONSTRAINT `fk_ann_gs_pk_id` FOREIGN KEY (`general_series_pk_id`) REFERENCES `general_series` (`general_series_pk_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `clinical_trial`
--
DROP TABLE IF EXISTS `clinical_trial`;
CREATE TABLE `clinical_trial` (
  `trial_pk_id` bigint(20) NOT NULL,
  `trial_sponsor_name` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `trial_protocol_id` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `trial_protocol_name` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `trial_coordinating_center` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  PRIMARY KEY (`trial_pk_id`),
  UNIQUE KEY `PK_TRIAL_PK_ID` (`trial_pk_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `clinical_trial_protocol`
--
DROP TABLE IF EXISTS `clinical_trial_protocol`;
CREATE TABLE `clinical_trial_protocol` (
  `id` bigint(20) NOT NULL,
  `protocol_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `protocol_name` varchar(1000) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `clinical_trial_sponsor_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PK_C_TRIAL_PROTOCOL` (`id`),
  KEY `fk_clin_trial_sponsor_id` (`clinical_trial_sponsor_id`),
  CONSTRAINT `fk_clin_trial_sponsor_id` FOREIGN KEY (`clinical_trial_sponsor_id`) REFERENCES `clinical_trial_sponsor` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `clinical_trial_sponsor`
--
DROP TABLE IF EXISTS `clinical_trial_sponsor`;
CREATE TABLE `clinical_trial_sponsor` (
  `id` bigint(20) NOT NULL,
  `coordinating_center` varchar(255) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `sponsor_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PK_C_TRIAL_SPONSOR` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `clinical_trial_subject`
--
DROP TABLE IF EXISTS `clinical_trial_subject`;
CREATE TABLE `clinical_trial_subject` (
  `id` bigint(20) NOT NULL,
  `trial_subject_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `trial_subject_reading_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `clinical_trial_protocol_id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `trial_site_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PK_CLINICAL_TRIAL_SUBJECT` (`id`),
  KEY `fk_clinical_trial_protocol_id` (`clinical_trial_protocol_id`),
  KEY `fk_patient_id` (`patient_id`),
  KEY `fk_trial_site` (`trial_site_id`),
  CONSTRAINT `fk_clinical_trial_protocol_id` FOREIGN KEY (`clinical_trial_protocol_id`) REFERENCES `clinical_trial_protocol` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_patient_id` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_pk_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_trial_site` FOREIGN KEY (`trial_site_id`) REFERENCES `trial_site` (`trial_site_pk_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `collection_descriptions`
--
DROP TABLE IF EXISTS `collection_descriptions`;
CREATE TABLE `collection_descriptions` (
  `collection_descriptions_pk_id` bigint(20) NOT NULL,
  `collection_name` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `user_name` varchar(20) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `description` mediumtext CHARACTER SET latin1 COLLATE latin1_bin,
  `collection_descriptions_timest` date DEFAULT NULL,
  PRIMARY KEY (`collection_descriptions_pk_id`),
  UNIQUE KEY `PK_COLLECTION_DESC_PK_ID` (`collection_descriptions_pk_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `csm_application`
--
DROP TABLE IF EXISTS `csm_application`;
CREATE TABLE `csm_application` (
  `APPLICATION_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `APPLICATION_NAME` varchar(255) NOT NULL,
  `APPLICATION_DESCRIPTION` varchar(200) NOT NULL,
  `DECLARATIVE_FLAG` tinyint(1) NOT NULL DEFAULT '0',
  `ACTIVE_FLAG` tinyint(1) NOT NULL DEFAULT '0',
  `UPDATE_DATE` date NOT NULL DEFAULT '1950-01-01',
  `DATABASE_URL` varchar(100) DEFAULT NULL,
  `DATABASE_USER_NAME` varchar(100) DEFAULT NULL,
  `DATABASE_PASSWORD` varchar(100) DEFAULT NULL,
  `DATABASE_DIALECT` varchar(100) DEFAULT NULL,
  `DATABASE_DRIVER` varchar(100) DEFAULT NULL,
  `CSM_VERSION` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`APPLICATION_ID`),
  UNIQUE KEY `UQ_APPLICATION_NAME` (`APPLICATION_NAME`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Table structure for table `csm_configuration_props`
--
DROP TABLE IF EXISTS `csm_configuration_props`;
CREATE TABLE `csm_configuration_props` (
  `PROPERTY_KEY` varchar(300) NOT NULL,
  `PROPERTY_VALUE` varchar(3000) DEFAULT NULL,
  PRIMARY KEY (`PROPERTY_KEY`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `csm_filter_clause`
--
DROP TABLE IF EXISTS `csm_filter_clause`;
CREATE TABLE `csm_filter_clause` (
  `FILTER_CLAUSE_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `CLASS_NAME` varchar(100) NOT NULL,
  `FILTER_CHAIN` varchar(2000) NOT NULL,
  `TARGET_CLASS_NAME` varchar(100) NOT NULL,
  `TARGET_CLASS_ATTRIBUTE_NAME` varchar(100) NOT NULL,
  `TARGET_CLASS_ATTRIBUTE_TYPE` varchar(100) NOT NULL,
  `TARGET_CLASS_ALIAS` varchar(100) DEFAULT NULL,
  `TARGET_CLASS_ATTRIBUTE_ALIAS` varchar(100) DEFAULT NULL,
  `GENERATED_SQL_USER` varchar(4000) NOT NULL,
  `APPLICATION_ID` bigint(20) NOT NULL,
  `UPDATE_DATE` date NOT NULL,
  `GENERATED_SQL_GROUP` varchar(4000) NOT NULL,
  PRIMARY KEY (`FILTER_CLAUSE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `csm_group`
--
DROP TABLE IF EXISTS `csm_group`;
CREATE TABLE `csm_group` (
  `GROUP_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `GROUP_NAME` varchar(255) NOT NULL,
  `GROUP_DESC` varchar(200) DEFAULT NULL,
  `UPDATE_DATE` date NOT NULL DEFAULT '1950-01-01',
  `APPLICATION_ID` bigint(20) NOT NULL,
  PRIMARY KEY (`GROUP_ID`),
  UNIQUE KEY `UQ_GROUP_GROUP_NAME` (`APPLICATION_ID`,`GROUP_NAME`),
  KEY `idx_APPLICATION_ID` (`APPLICATION_ID`),
  CONSTRAINT `FK_APPLICATION_GROUP` FOREIGN KEY (`APPLICATION_ID`) REFERENCES `csm_application` (`APPLICATION_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Table structure for table `csm_mapping`
--
DROP TABLE IF EXISTS `csm_mapping`;
CREATE TABLE `csm_mapping` (
  `MAPPING_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `APPLICATION_ID` bigint(20) NOT NULL,
  `OBJECT_NAME` varchar(100) NOT NULL,
  `ATTRIBUTE_NAME` varchar(100) NOT NULL,
  `OBJECT_PACKAGE_NAME` varchar(100) DEFAULT NULL,
  `TABLE_NAME` varchar(100) DEFAULT NULL,
  `TABLE_NAME_GROUP` varchar(100) DEFAULT NULL,
  `TABLE_NAME_USER` varchar(100) DEFAULT NULL,
  `VIEW_NAME_GROUP` varchar(100) DEFAULT NULL,
  `VIEW_NAME_USER` varchar(100) DEFAULT NULL,
  `ACTIVE_FLAG` tinyint(1) NOT NULL DEFAULT '0',
  `MAINTAINED_FLAG` tinyint(1) NOT NULL DEFAULT '0',
  `UPDATE_DATE` date DEFAULT '0000-00-00',
  PRIMARY KEY (`MAPPING_ID`),
  UNIQUE KEY `UQ_MP_OBJ_NAME_ATTRI_NAME_APP_ID` (`OBJECT_NAME`,`ATTRIBUTE_NAME`,`APPLICATION_ID`),
  KEY `FK_PE_APPLICATION` (`APPLICATION_ID`),
  CONSTRAINT `FK_PE_APPLICATION` FOREIGN KEY (`APPLICATION_ID`) REFERENCES `csm_application` (`APPLICATION_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `csm_password_history`
--
DROP TABLE IF EXISTS `csm_password_history`;
CREATE TABLE `csm_password_history` (
  `CSM_PASSWORD_HISTORY_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `LOGIN_NAME` varchar(500) DEFAULT NULL,
  `PASSWORD` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`CSM_PASSWORD_HISTORY_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `csm_pg_pe`
--
DROP TABLE IF EXISTS `csm_pg_pe`;
CREATE TABLE `csm_pg_pe` (
  `PG_PE_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `PROTECTION_GROUP_ID` bigint(20) NOT NULL,
  `PROTECTION_ELEMENT_ID` bigint(20) NOT NULL,
  `UPDATE_DATE` date DEFAULT '0000-00-00',
  PRIMARY KEY (`PG_PE_ID`),
  UNIQUE KEY `UQ_PROTECTION_GROUP_PROTECTION_ELEMENT_PROTECTION_GROUP_ID` (`PROTECTION_ELEMENT_ID`,`PROTECTION_GROUP_ID`),
  KEY `idx_PROTECTION_ELEMENT_ID` (`PROTECTION_ELEMENT_ID`),
  KEY `idx_PROTECTION_GROUP_ID` (`PROTECTION_GROUP_ID`),
  CONSTRAINT `FK_PROTECTION_ELEMENT_PROTECTION_GROUP` FOREIGN KEY (`PROTECTION_ELEMENT_ID`) REFERENCES `csm_protection_element` (`PROTECTION_ELEMENT_ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_PROTECTION_GROUP_PROTECTION_ELEMENT` FOREIGN KEY (`PROTECTION_GROUP_ID`) REFERENCES `csm_protection_group` (`PROTECTION_GROUP_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Table structure for table `csm_privilege`
--
DROP TABLE IF EXISTS `csm_privilege`;
CREATE TABLE `csm_privilege` (
  `PRIVILEGE_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `PRIVILEGE_NAME` varchar(100) NOT NULL,
  `PRIVILEGE_DESCRIPTION` varchar(200) DEFAULT NULL,
  `UPDATE_DATE` date NOT NULL DEFAULT '1950-01-01',
  PRIMARY KEY (`PRIVILEGE_ID`),
  UNIQUE KEY `UQ_PRIVILEGE_NAME` (`PRIVILEGE_NAME`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Table structure for table `csm_protection_element`
--
DROP TABLE IF EXISTS `csm_protection_element`;
CREATE TABLE `csm_protection_element` (
  `PROTECTION_ELEMENT_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `PROTECTION_ELEMENT_NAME` varchar(100) NOT NULL,
  `PROTECTION_ELEMENT_DESCRIPTION` varchar(200) DEFAULT NULL,
  `OBJECT_ID` varchar(100) NOT NULL,
  `ATTRIBUTE` varchar(100) DEFAULT NULL,
  `PROTECTION_ELEMENT_TYPE` varchar(100) DEFAULT NULL,
  `APPLICATION_ID` bigint(20) NOT NULL,
  `UPDATE_DATE` date NOT NULL DEFAULT '1950-01-01',
  `ATTRIBUTE_VALUE` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`PROTECTION_ELEMENT_ID`),
  UNIQUE KEY `UQ_PE_PE_NAME_ATTRIBUTE_VALUE_APP_ID` (`OBJECT_ID`,`ATTRIBUTE`,`ATTRIBUTE_VALUE`,`APPLICATION_ID`),
  KEY `idx_APPLICATION_ID` (`APPLICATION_ID`),
  KEY `idx_OBJ_ATTR_APP` (`OBJECT_ID`,`ATTRIBUTE`,`APPLICATION_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Table structure for table `csm_protection_group`
--
DROP TABLE IF EXISTS `csm_protection_group`;
CREATE TABLE `csm_protection_group` (
  `PROTECTION_GROUP_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `PROTECTION_GROUP_NAME` varchar(100) NOT NULL,
  `PROTECTION_GROUP_DESCRIPTION` varchar(200) DEFAULT NULL,
  `APPLICATION_ID` bigint(20) NOT NULL,
  `LARGE_ELEMENT_COUNT_FLAG` tinyint(1) NOT NULL,
  `UPDATE_DATE` date NOT NULL DEFAULT '1950-01-01',
  `PARENT_PROTECTION_GROUP_ID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`PROTECTION_GROUP_ID`),
  UNIQUE KEY `UQ_PROTECTION_GROUP_PROTECTION_GROUP_NAME` (`APPLICATION_ID`,`PROTECTION_GROUP_NAME`),
  KEY `idx_APPLICATION_ID` (`APPLICATION_ID`),
  KEY `idx_PARENT_PROTECTION_GROUP_ID` (`PARENT_PROTECTION_GROUP_ID`),
  CONSTRAINT `FK_PG_APPLICATION` FOREIGN KEY (`APPLICATION_ID`) REFERENCES `csm_application` (`APPLICATION_ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_PROTECTION_GROUP` FOREIGN KEY (`PARENT_PROTECTION_GROUP_ID`) REFERENCES `csm_protection_group` (`PROTECTION_GROUP_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Table structure for table `csm_role`
--
DROP TABLE IF EXISTS `csm_role`;
CREATE TABLE `csm_role` (
  `ROLE_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `ROLE_NAME` varchar(100) NOT NULL,
  `ROLE_DESCRIPTION` varchar(200) DEFAULT NULL,
  `APPLICATION_ID` bigint(20) NOT NULL,
  `ACTIVE_FLAG` tinyint(1) NOT NULL,
  `UPDATE_DATE` date NOT NULL DEFAULT '1950-01-01',
  PRIMARY KEY (`ROLE_ID`),
  UNIQUE KEY `UQ_ROLE_ROLE_NAME` (`APPLICATION_ID`,`ROLE_NAME`),
  KEY `idx_APPLICATION_ID` (`APPLICATION_ID`),
  CONSTRAINT `FK_APPLICATION_ROLE` FOREIGN KEY (`APPLICATION_ID`) REFERENCES `csm_application` (`APPLICATION_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Table structure for table `csm_role_privilege`
--
DROP TABLE IF EXISTS `csm_role_privilege`;
CREATE TABLE `csm_role_privilege` (
  `ROLE_PRIVILEGE_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `ROLE_ID` bigint(20) NOT NULL,
  `PRIVILEGE_ID` bigint(20) NOT NULL,
  `UPDATE_DATE` date NOT NULL DEFAULT '1950-01-01',
  PRIMARY KEY (`ROLE_PRIVILEGE_ID`),
  UNIQUE KEY `UQ_ROLE_PRIVILEGE_ROLE_ID` (`PRIVILEGE_ID`,`ROLE_ID`),
  KEY `idx_PRIVILEGE_ID` (`PRIVILEGE_ID`),
  KEY `idx_ROLE_ID` (`ROLE_ID`),
  CONSTRAINT `FK_PRIVILEGE_ROLE` FOREIGN KEY (`PRIVILEGE_ID`) REFERENCES `csm_privilege` (`PRIVILEGE_ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_ROLE` FOREIGN KEY (`ROLE_ID`) REFERENCES `csm_role` (`ROLE_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Table structure for table `csm_user`
--
DROP TABLE IF EXISTS `csm_user`;
CREATE TABLE `csm_user` (
  `USER_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `LOGIN_NAME` varchar(500) DEFAULT NULL,
  `FIRST_NAME` varchar(100) NOT NULL,
  `LAST_NAME` varchar(100) NOT NULL,
  `ORGANIZATION` varchar(500) DEFAULT NULL,
  `DEPARTMENT` varchar(100) DEFAULT NULL,
  `TITLE` varchar(100) DEFAULT NULL,
  `PHONE_NUMBER` varchar(100) DEFAULT NULL,
  `PASSWORD` varchar(100) DEFAULT NULL,
  `EMAIL_ID` varchar(100) DEFAULT NULL,
  `START_DATE` date DEFAULT NULL,
  `END_DATE` date DEFAULT NULL,
  `UPDATE_DATE` date NOT NULL DEFAULT '1950-01-01',
  `MIDDLE_NAME` varchar(100) DEFAULT NULL,
  `FAX` varchar(20) DEFAULT NULL,
  `ADDRESS` varchar(200) DEFAULT NULL,
  `CITY` varchar(100) DEFAULT NULL,
  `STATE` varchar(100) DEFAULT NULL,
  `COUNTRY` varchar(100) DEFAULT NULL,
  `POSTAL_CODE` varchar(10) DEFAULT NULL,
  `MIGRATED_FLAG` tinyint(1) NOT NULL DEFAULT '0',
  `PREMGRT_LOGIN_NAME` varchar(100) DEFAULT NULL,
  `PASSWORD_EXPIRED` tinyint(1) DEFAULT '0',
  `FIRST_TIME_LOGIN` tinyint(1) DEFAULT '0',
  `ACTIVE_FLAG` tinyint(1) DEFAULT '1',
  `PASSWORD_EXPIRY_DATE` date DEFAULT '2012-10-10',
  PRIMARY KEY (`USER_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Table structure for table `csm_user_group`
--
DROP TABLE IF EXISTS `csm_user_group`;
CREATE TABLE `csm_user_group` (
  `USER_GROUP_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `USER_ID` bigint(20) NOT NULL,
  `GROUP_ID` bigint(20) NOT NULL,
  PRIMARY KEY (`USER_GROUP_ID`),
  KEY `idx_USER_ID` (`USER_ID`),
  KEY `idx_GROUP_ID` (`GROUP_ID`),
  CONSTRAINT `FK_UG_GROUP` FOREIGN KEY (`GROUP_ID`) REFERENCES `csm_group` (`GROUP_ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_USER_GROUP` FOREIGN KEY (`USER_ID`) REFERENCES `csm_user` (`USER_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `csm_user_group_role_pg`
--
DROP TABLE IF EXISTS `csm_user_group_role_pg`;
CREATE TABLE `csm_user_group_role_pg` (
  `USER_GROUP_ROLE_PG_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `USER_ID` bigint(20) DEFAULT NULL,
  `GROUP_ID` bigint(20) DEFAULT NULL,
  `ROLE_ID` bigint(20) NOT NULL,
  `PROTECTION_GROUP_ID` bigint(20) NOT NULL,
  `UPDATE_DATE` date NOT NULL DEFAULT '1950-01-01',
  PRIMARY KEY (`USER_GROUP_ROLE_PG_ID`),
  KEY `idx_GROUP_ID` (`GROUP_ID`),
  KEY `idx_ROLE_ID` (`ROLE_ID`),
  KEY `idx_PROTECTION_GROUP_ID` (`PROTECTION_GROUP_ID`),
  KEY `idx_USER_ID` (`USER_ID`),
  CONSTRAINT `FK_USER_GROUP_ROLE_PROTECTION_GROUP_GROUPS` FOREIGN KEY (`GROUP_ID`) REFERENCES `csm_group` (`GROUP_ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_USER_GROUP_ROLE_PROTECTION_GROUP_PROTECTION_GROUP` FOREIGN KEY (`PROTECTION_GROUP_ID`) REFERENCES `csm_protection_group` (`PROTECTION_GROUP_ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_USER_GROUP_ROLE_PROTECTION_GROUP_ROLE` FOREIGN KEY (`ROLE_ID`) REFERENCES `csm_role` (`ROLE_ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_USER_GROUP_ROLE_PROTECTION_GROUP_USER` FOREIGN KEY (`USER_ID`) REFERENCES `csm_user` (`USER_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;


--
-- Table structure for table `csm_user_pe`
--
DROP TABLE IF EXISTS `csm_user_pe`;
CREATE TABLE `csm_user_pe` (
  `USER_PROTECTION_ELEMENT_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `PROTECTION_ELEMENT_ID` bigint(20) NOT NULL,
  `USER_ID` bigint(20) NOT NULL,
  `UPDATE_DATE` date NOT NULL DEFAULT '1950-01-01',
  PRIMARY KEY (`USER_PROTECTION_ELEMENT_ID`),
  UNIQUE KEY `UQ_USER_PROTECTION_ELEMENT_PROTECTION_ELEMENT_ID` (`USER_ID`,`PROTECTION_ELEMENT_ID`),
  KEY `idx_USER_ID` (`USER_ID`),
  KEY `idx_PROTECTION_ELEMENT_ID` (`PROTECTION_ELEMENT_ID`),
  CONSTRAINT `FK_PE_USER` FOREIGN KEY (`USER_ID`) REFERENCES `csm_user` (`USER_ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_PROTECTION_ELEMENT_USER` FOREIGN KEY (`PROTECTION_ELEMENT_ID`) REFERENCES `csm_protection_element` (`PROTECTION_ELEMENT_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;


--
-- Table structure for table `ct_image`
--
DROP TABLE IF EXISTS `ct_image`;
CREATE TABLE `ct_image` (
  `kvp` decimal(22,6) DEFAULT NULL,
  `scan_options` varchar(16) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `data_collection_diameter` decimal(22,6) DEFAULT NULL,
  `reconstruction_diameter` decimal(22,6) DEFAULT NULL,
  `gantry_detector_tilt` decimal(22,6) DEFAULT NULL,
  `exposure_time` decimal(22,6) DEFAULT NULL,
  `x_ray_tube_current` decimal(22,6) DEFAULT NULL,
  `exposure` decimal(22,6) DEFAULT NULL,
  `exposure_in_microas` decimal(22,6) DEFAULT NULL,
  `convolution_kernel` varchar(16) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `revolution_time` decimal(22,6) DEFAULT NULL,
  `single_collimation_width` decimal(22,6) DEFAULT NULL,
  `total_collimation_width` decimal(22,6) DEFAULT NULL,
  `table_speed` decimal(22,6) DEFAULT NULL,
  `table_feed_per_rotation` decimal(22,6) DEFAULT NULL,
  `ct_pitch_factor` decimal(22,6) DEFAULT NULL,
  `anatomic_region_seq` varchar(500) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `image_pk_id` bigint(20) NOT NULL,
  `ct_image_pk_id` bigint(20) NOT NULL,
  `general_series_pk_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ct_image_pk_id`),
  UNIQUE KEY `PK_CT_IMAGE_PK_ID` (`ct_image_pk_id`),
  KEY `convolution_kernel_idx` (`convolution_kernel`),
  KEY `ct_image_image_pk_id_indx` (`image_pk_id`),
  KEY `kvp_idx` (`kvp`),
  KEY `general_series_pk_id` (`general_series_pk_id`),
  CONSTRAINT `ct_image_ibfk_1` FOREIGN KEY (`general_series_pk_id`) REFERENCES `general_series` (`general_series_pk_id`),
  CONSTRAINT `fk_image_pk_id` FOREIGN KEY (`image_pk_id`) REFERENCES `general_image` (`image_pk_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `custom_series_list`
--
DROP TABLE IF EXISTS `custom_series_list`;
CREATE TABLE `custom_series_list` (
  `CUSTOM_SERIES_LIST_PK_ID` bigint(20) NOT NULL,
  `NAME` varchar(200) DEFAULT NULL,
  `comment_` varchar(200) DEFAULT NULL,
  `HYPERLINK` varchar(200) DEFAULT NULL,
  `CUSTOM_SERIES_LIST_TIMESTAMP` date DEFAULT NULL,
  `USER_NAME` varchar(20) DEFAULT NULL,
  `usage_count` int(10) unsigned DEFAULT '0',
  PRIMARY KEY (`CUSTOM_SERIES_LIST_PK_ID`),
  UNIQUE KEY `CUSTOM_SERIES_LIST_PK_ID` (`CUSTOM_SERIES_LIST_PK_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `custom_series_list_attribute`
--
DROP TABLE IF EXISTS `custom_series_list_attribute`;
CREATE TABLE `custom_series_list_attribute` (
  `custom_series_list_attribute_p` bigint(20) NOT NULL DEFAULT 0,
  `SERIES_INSTANCE_UID` varchar(200) DEFAULT NULL,
  `CUSTOM_SERIES_LIST_PK_ID` bigint(20) NOT NULL,
  PRIMARY KEY (`custom_series_list_attribute_p`),
  UNIQUE KEY `CUSTOM_SERIES_LIST_ATTRIBUTE_PK_ID` (`custom_series_list_attribute_p`),
  KEY `FK_CUSTOM_SERIES_LIST_PK_ID` (`CUSTOM_SERIES_LIST_PK_ID`),
  KEY `series_instance_uid_idx` (`SERIES_INSTANCE_UID`),
  CONSTRAINT `FK_CUSTOM_SERIES_LIST_PK_ID` FOREIGN KEY (`CUSTOM_SERIES_LIST_PK_ID`) REFERENCES `custom_series_list` (`CUSTOM_SERIES_LIST_PK_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `databasechangelog`
--
DROP TABLE IF EXISTS `databasechangelog`;
CREATE TABLE `databasechangelog` (
  `ID` varchar(63) NOT NULL,
  `AUTHOR` varchar(63) NOT NULL,
  `FILENAME` varchar(200) NOT NULL,
  `DATEEXECUTED` datetime NOT NULL,
  `MD5SUM` varchar(32) DEFAULT NULL,
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  `COMMENTS` varchar(255) DEFAULT NULL,
  `TAG` varchar(255) DEFAULT NULL,
  `LIQUIBASE` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ID`,`AUTHOR`,`FILENAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
-- Table structure for table `databasechangeloglock`
--
DROP TABLE IF EXISTS `databasechangeloglock`;
CREATE TABLE `databasechangeloglock` (
  `ID` int(11) NOT NULL,
  `LOCKED` tinyint(1) NOT NULL,
  `LOCKGRANTED` datetime DEFAULT NULL,
  `LOCKEDBY` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `deletion_audit_trail`
--
DROP TABLE IF EXISTS `deletion_audit_trail`;
CREATE TABLE `deletion_audit_trail` (
  `deletion_pk_id` bigint(20) NOT NULL,
  `data_id` varchar(64) DEFAULT NULL,
  `data_type` varchar(50) DEFAULT NULL,
  `total_image` bigint(20) DEFAULT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `time_stamp` datetime DEFAULT NULL,
  PRIMARY KEY (`deletion_pk_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Temporary table structure for view `dicom_image`
--
DROP TABLE IF EXISTS `dicom_image`;
/*!50001 DROP VIEW IF EXISTS `dicom_image`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `dicom_image` (
  `IMAGE_PK_ID` tinyint NOT NULL,
  `INSTANCE_NUMBER` tinyint NOT NULL,
  `CONTENT_DATE` tinyint NOT NULL,
  `CONTENT_TIME` tinyint NOT NULL,
  `IMAGE_TYPE` tinyint NOT NULL,
  `ACQUISITION_DATE` tinyint NOT NULL,
  `ACQUISITION_TIME` tinyint NOT NULL,
  `ACQUISITION_NUMBER` tinyint NOT NULL,
  `LOSSY_IMAGE_COMPRESSION` tinyint NOT NULL,
  `PIXEL_SPACING` tinyint NOT NULL,
  `IMAGE_ORIENTATION_PATIENT` tinyint NOT NULL,
  `IMAGE_POSITION_PATIENT` tinyint NOT NULL,
  `SLICE_THICKNESS` tinyint NOT NULL,
  `SLICE_LOCATION` tinyint NOT NULL,
  `I_ROWS` tinyint NOT NULL,
  `I_COLUMNS` tinyint NOT NULL,
  `CONTRAST_BOLUS_AGENT` tinyint NOT NULL,
  `CONTRAST_BOLUS_ROUTE` tinyint NOT NULL,
  `SOP_CLASS_UID` tinyint NOT NULL,
  `SOP_INSTANCE_UID` tinyint NOT NULL,
  `GENERAL_SERIES_PK_ID` tinyint NOT NULL,
  `PATIENT_POSITION` tinyint NOT NULL,
  `SOURCE_TO_DETECTOR_DISTANCE` tinyint NOT NULL,
  `SOURCE_SUBJECT_DISTANCE` tinyint NOT NULL,
  `FOCAL_SPOT_SIZE` tinyint NOT NULL,
  `STORAGE_MEDIA_FILE_SET_UID` tinyint NOT NULL,
  `DICOM_FILE_URI` tinyint NOT NULL,
  `ACQUISITION_DATETIME` tinyint NOT NULL,
  `IMAGE_COMMENTS` tinyint NOT NULL,
  `IMAGE_RECEIVING_TIMESTAMP` tinyint NOT NULL,
  `CURATION_TIMESTAMP` tinyint NOT NULL,
  `ANNOTATION` tinyint NOT NULL,
  `SUBMISSION_DATE` tinyint NOT NULL,
  `DICOM_SIZE` tinyint NOT NULL,
  `IMAGE_LATERALITY` tinyint NOT NULL,
  `TRIAL_DP_PK_ID` tinyint NOT NULL,
  `PATIENT_ID` tinyint NOT NULL,
  `STUDY_INSTANCE_UID` tinyint NOT NULL,
  `SERIES_INSTANCE_UID` tinyint NOT NULL,
  `PATIENT_PK_ID` tinyint NOT NULL,
  `STUDY_PK_ID` tinyint NOT NULL,
  `PROJECT` tinyint NOT NULL,
  `ACQUISITION_MATRIX` tinyint NOT NULL,
  `DX_DATA_COLLECTION_DIAMETER` tinyint NOT NULL,
  `KVP` tinyint NOT NULL,
  `SCAN_OPTIONS` tinyint NOT NULL,
  `DATA_COLLECTION_DIAMETER` tinyint NOT NULL,
  `RECONSTRUCTION_DIAMETER` tinyint NOT NULL,
  `GANTRY_DETECTOR_TILT` tinyint NOT NULL,
  `EXPOSURE_TIME` tinyint NOT NULL,
  `X_RAY_TUBE_CURRENT` tinyint NOT NULL,
  `EXPOSURE` tinyint NOT NULL,
  `EXPOSURE_IN_MICROAS` tinyint NOT NULL,
  `CONVOLUTION_KERNEL` tinyint NOT NULL,
  `REVOLUTION_TIME` tinyint NOT NULL,
  `SINGLE_COLLIMATION_WIDTH` tinyint NOT NULL,
  `TOTAL_COLLIMATION_WIDTH` tinyint NOT NULL,
  `TABLE_SPEED` tinyint NOT NULL,
  `TABLE_FEED_PER_ROTATION` tinyint NOT NULL,
  `CT_PITCH_FACTOR` tinyint NOT NULL,
  `ANATOMIC_REGION_SEQ` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `dicom_series`
--

DROP TABLE IF EXISTS `dicom_series`;
/*!50001 DROP VIEW IF EXISTS `dicom_series`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `dicom_series` (
  `GENERAL_SERIES_PK_ID` tinyint NOT NULL,
  `BODY_PART_EXAMINED` tinyint NOT NULL,
  `FRAME_OF_REFERENCE_UID` tinyint NOT NULL,
  `SERIES_LATERALITY` tinyint NOT NULL,
  `MODALITY` tinyint NOT NULL,
  `PROTOCOL_NAME` tinyint NOT NULL,
  `SERIES_DATE` tinyint NOT NULL,
  `SERIES_DESC` tinyint NOT NULL,
  `SERIES_INSTANCE_UID` tinyint NOT NULL,
  `SERIES_NUMBER` tinyint NOT NULL,
  `SYNC_FRAME_OF_REF_UID` tinyint NOT NULL,
  `STUDY_PK_ID` tinyint NOT NULL,
  `GENERAL_EQUIPMENT_PK_ID` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `dicom_study`
--
DROP TABLE IF EXISTS `dicom_study`;
/*!50001 DROP VIEW IF EXISTS `dicom_study`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `dicom_study` (
  `STUDY_PK_ID` tinyint NOT NULL,
  `STUDY_INSTANCE_UID` tinyint NOT NULL,
  `ADDITIONAL_PATIENT_HISTORY` tinyint NOT NULL,
  `STUDY_DATE` tinyint NOT NULL,
  `STUDY_DESC` tinyint NOT NULL,
  `ADMITTING_DIAGNOSES_DESC` tinyint NOT NULL,
  `ADMITTING_DIAGNOSES_CODE_SEQ` tinyint NOT NULL,
  `OCCUPATION` tinyint NOT NULL,
  `PATIENT_AGE` tinyint NOT NULL,
  `PATIENT_SIZE` tinyint NOT NULL,
  `PATIENT_WEIGHT` tinyint NOT NULL,
  `STUDY_ID` tinyint NOT NULL,
  `STUDY_TIME` tinyint NOT NULL,
  `TRIAL_TIME_POINT_ID` tinyint NOT NULL,
  `TRIAL_TIME_POINT_DESC` tinyint NOT NULL,
  `PATIENT_PK_ID` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `download_data_history`
--
DROP TABLE IF EXISTS `download_data_history`;
CREATE TABLE `download_data_history` (
  `download_data_history_pk_id` bigint(20) NOT NULL,
  `series_instance_uid` varchar(64) DEFAULT NULL,
  `login_name` varchar(100) DEFAULT NULL,
  `download_timestamp` date DEFAULT NULL,
  `download_type` varchar(20) DEFAULT NULL,
  `size_` decimal(22,2) DEFAULT NULL,
  PRIMARY KEY (`download_data_history_pk_id`),
  KEY `download_data_history_timestamp_idx` (`download_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `download_history`
--
DROP TABLE IF EXISTS `download_history`;
CREATE TABLE `download_history` (
  `download_history_pk_id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `total_file_size` decimal(22,2) DEFAULT NULL,
  `download_file_name` varchar(300) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  PRIMARY KEY (`download_history_pk_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `general_equipment`
--
DROP TABLE IF EXISTS `general_equipment`;
CREATE TABLE `general_equipment` (
  `general_equipment_pk_id` bigint(20) NOT NULL,
  `manufacturer` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `institution_name` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `manufacturer_model_name` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `software_versions` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `institution_address` varchar(1024) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `station_name` varchar(16) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `device_serial_number` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  PRIMARY KEY (`general_equipment_pk_id`),
  UNIQUE KEY `PK_G_EQUIPMENT_ID` (`general_equipment_pk_id`),
  KEY `idx_manufacturer_model_name` (`manufacturer_model_name`),
  KEY `idx_software_versions` (`software_versions`),
  KEY `idx_manufacturer` (`manufacturer`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `general_image`
--
DROP TABLE IF EXISTS `general_image`;
CREATE TABLE `general_image` (
  `image_pk_id` bigint(20) NOT NULL,
  `instance_number` bigint(20) DEFAULT NULL,
  `content_date` date DEFAULT NULL,
  `content_time` varchar(16) COLLATE latin1_general_ci DEFAULT NULL,
  `image_type` varchar(16) COLLATE latin1_general_ci DEFAULT NULL,
  `acquisition_date` date DEFAULT NULL,
  `acquisition_time` varchar(16) COLLATE latin1_general_ci DEFAULT NULL,
  `acquisition_number` decimal(22,6) DEFAULT NULL,
  `lossy_image_compression` varchar(16) COLLATE latin1_general_ci DEFAULT NULL,
  `pixel_spacing` decimal(22,6) DEFAULT NULL,
  `image_orientation_patient` varchar(200) COLLATE latin1_general_ci DEFAULT NULL,
  `image_position_patient` varchar(200) COLLATE latin1_general_ci DEFAULT NULL,
  `slice_thickness` decimal(22,6) DEFAULT NULL,
  `slice_location` decimal(22,6) DEFAULT NULL,
  `i_rows` decimal(22,6) DEFAULT NULL,
  `i_columns` decimal(22,6) DEFAULT NULL,
  `contrast_bolus_agent` varchar(64) COLLATE latin1_general_ci DEFAULT NULL,
  `contrast_bolus_route` varchar(64) COLLATE latin1_general_ci DEFAULT NULL,
  `sop_class_uid` varchar(64) COLLATE latin1_general_ci DEFAULT NULL,
  `sop_instance_uid` varchar(64) COLLATE latin1_general_ci DEFAULT NULL,
  `general_series_pk_id` bigint(20) DEFAULT NULL,
  `patient_position` varchar(16) COLLATE latin1_general_ci DEFAULT NULL,
  `source_to_detector_distance` decimal(22,6) DEFAULT NULL,
  `source_subject_distance` decimal(22,6) DEFAULT NULL,
  `focal_spot_size` decimal(22,6) DEFAULT NULL,
  `storage_media_file_set_uid` varchar(64) COLLATE latin1_general_ci DEFAULT NULL,
  `dicom_file_uri` varchar(2000) COLLATE latin1_general_ci DEFAULT NULL,
  `acquisition_datetime` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `image_comments` varchar(4000) COLLATE latin1_general_ci DEFAULT NULL,
  `image_receiving_timestamp` datetime DEFAULT NULL,
  `curation_timestamp` datetime DEFAULT NULL,
  `annotation` varchar(20) COLLATE latin1_general_ci DEFAULT NULL,
  `submission_date` date DEFAULT NULL,
  `dicom_size` decimal(22,6) DEFAULT NULL,
  `image_laterality` varchar(16) COLLATE latin1_general_ci DEFAULT NULL,
  `trial_dp_pk_id` bigint(20) DEFAULT NULL,
  `patient_id` varchar(64) COLLATE latin1_general_ci DEFAULT NULL,
  `study_instance_uid` varchar(500) COLLATE latin1_general_ci DEFAULT NULL,
  `series_instance_uid` varchar(64) COLLATE latin1_general_ci DEFAULT NULL,
  `patient_pk_id` bigint(20) DEFAULT NULL,
  `study_pk_id` bigint(20) DEFAULT NULL,
  `project` varchar(200) COLLATE latin1_general_ci DEFAULT NULL,
  `acquisition_matrix` decimal(22,6) DEFAULT 0.000000,
  `dx_data_collection_diameter` decimal(22,6) DEFAULT 0.000000,
  `md5_digest` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `US_FRAME_NUMBER` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `US_COLOR_DATA_PRESENT` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `US_MULTI_MODALITY` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (`image_pk_id`),
  UNIQUE KEY `PK_IMAGE_PK_ID` (`image_pk_id`),
  UNIQUE KEY `Image_Visibility_Submitted_IDX` (`image_pk_id`,`submission_date`),
  UNIQUE KEY `sop_instance_uid` (`sop_instance_uid`),
  KEY `acquisition_matrix_idx` (`acquisition_matrix`),
  KEY `contrast_bolus_route_idx` (`contrast_bolus_route`),
  KEY `curation_t_indx` (`curation_timestamp`),
  KEY `dx_data_collection_diameter` (`dx_data_collection_diameter`),
  KEY `general_image_search` (`general_series_pk_id`,`image_pk_id`,`slice_thickness`,`contrast_bolus_agent`,`curation_timestamp`),
  KEY `gi_gs_ds_indx` (`general_series_pk_id`,`dicom_size`),
  KEY `gi_ppkid_indx` (`patient_pk_id`),
  KEY `gi_spkid_indx` (`study_pk_id`),
  KEY `gi_tdpkid_indx` (`trial_dp_pk_id`),
  KEY `image_fk_series_pk_id` (`general_series_pk_id`),
  KEY `image_sop_instance_uid` (`sop_instance_uid`),
  KEY `slice_thickness_idx` (`slice_thickness`),
  KEY `SubmittedDateIndex` (`submission_date`),
  KEY `idx_visibility_submitted_date` (`submission_date`),
  KEY `series_instance_uid_idx` (`series_instance_uid`),
  KEY `PATIENT_ID_IDX` (`patient_id`),
  KEY `STUDY_INSTANCE_UID_IDX` (`study_instance_uid`),
  KEY `US_MULTI_MODALITY_IDX` (`US_MULTI_MODALITY`),
  KEY `instanceNumberindx` (`instance_number`),
  KEY `contentDateindx` (`content_date`),
  KEY `contentTimeindx` (`content_time`),
  KEY `imageTypeindx` (`image_type`),
  KEY `acquisitionDateindx` (`acquisition_date`),
  KEY `acquisitionTimeindx` (`acquisition_time`),
  KEY `acquisitionNumberindx` (`acquisition_number`),
  KEY `lossyImageCompressionindx` (`lossy_image_compression`),
  KEY `imageOrientationPatientindx` (`image_orientation_patient`),
  KEY `imagePositionPatientindx` (`image_position_patient`),
  KEY `sliceLocationindx` (`slice_location`),
  KEY `contrastBolusAgentindx` (`contrast_bolus_agent`),
  KEY `SOPClassUIDindx` (`sop_class_uid`),
  KEY `patientPositionindx` (`patient_position`),
  KEY `sourceToDetectorDistanceindx` (`source_to_detector_distance`),
  KEY `sourceSubjectDistanceindx` (`source_subject_distance`),
  KEY `focalSpotSizeindx` (`focal_spot_size`),
  KEY `storageMediaFileSetUIDindx` (`storage_media_file_set_uid`),
  KEY `acquisitionDatetimeindx` (`acquisition_datetime`),
  KEY `imageCommentsindx` (`image_comments`(767)),
  KEY `imageLateralityindx` (`image_laterality`),
  KEY `acquisitionMatrixindx` (`acquisition_matrix`),
  KEY `columnsindx` (`i_columns`),
  KEY `rowsindx` (`i_rows`),
  KEY `usFrameNumindx` (`US_FRAME_NUMBER`),
  KEY `usColorDataPresentindx` (`US_COLOR_DATA_PRESENT`),
  CONSTRAINT `FK_general_image_patient` FOREIGN KEY (`patient_pk_id`) REFERENCES `patient` (`patient_pk_id`),
  CONSTRAINT `FK_general_image_study` FOREIGN KEY (`study_pk_id`) REFERENCES `study` (`study_pk_id`),
  CONSTRAINT `FK_general_image_trialdata_prov` FOREIGN KEY (`trial_dp_pk_id`) REFERENCES `trial_data_provenance` (`trial_dp_pk_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_g_series_pk_id` FOREIGN KEY (`general_series_pk_id`) REFERENCES `general_series` (`general_series_pk_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Table structure for table `general_series`
--
DROP TABLE IF EXISTS `general_series`;
CREATE TABLE `general_series` (
  `general_series_pk_id` bigint(20) NOT NULL,
  `modality` varchar(16) NOT NULL,
  `series_instance_uid` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `series_laterality` varchar(16) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `series_date` date DEFAULT NULL,
  `protocol_name` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `series_desc` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `body_part_examined` varchar(16) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `study_pk_id` bigint(20) DEFAULT NULL,
  `general_equipment_pk_id` bigint(20) DEFAULT NULL,
  `trial_protocol_id` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `trial_protocol_name` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `trial_site_name` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `study_date` date DEFAULT NULL,
  `study_desc` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `admitting_diagnoses_desc` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `patient_age` varchar(4) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `patient_sex` varchar(16) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `patient_weight` decimal(22,6) DEFAULT NULL,
  `age_group` varchar(10) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `patient_pk_id` bigint(20) DEFAULT NULL,
  `series_number` decimal(22,6) DEFAULT NULL,
  `sync_frame_of_ref_uid` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `patient_id` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `frame_of_reference_uid` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `visibility` varchar(5) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `security_group` varchar(50) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `annotations_flag` varchar(5) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `project` varchar(200) DEFAULT NULL,
  `site` varchar(40) DEFAULT NULL,
  `study_instance_uid` varchar(500) DEFAULT NULL,
  `max_submission_timestamp` datetime DEFAULT NULL,
  `batchNum` int(20) DEFAULT NULL,
  `submission_type` varchar(100) DEFAULT NULL,
  `released_status` varchar(50) DEFAULT NULL,
  `third_party_analysis` varchar(4) DEFAULT NULL,
  `description_uri` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`general_series_pk_id`),
  UNIQUE KEY `PK_G_SERIES_PK_ID` (`general_series_pk_id`),
  UNIQUE KEY `series_instance_uid` (`series_instance_uid`),
  KEY `body_part_examined_idx` (`body_part_examined`),
  KEY `general_series_sec_grp_idx` (`security_group`),
  KEY `general_series_site_idx` (`trial_site_name`),
  KEY `modality_idx` (`modality`),
  KEY `series_desc_idx` (`series_desc`),
  KEY `series_visibility_ind` (`visibility`),
  KEY `fk_gs_study_pk_id` (`study_pk_id`),
  KEY `fk_g_equipment_pk_id` (`general_equipment_pk_id`),
  KEY `Series_instance_uid_idx` (`series_instance_uid`),
  KEY `patient_pk_id_idx` (`patient_pk_id`),
  KEY `STUDY_INSTANCE_UID_IDX` (`study_instance_uid`),
  CONSTRAINT `fk_g_equipment_pk_id` FOREIGN KEY (`general_equipment_pk_id`) REFERENCES `general_equipment` (`general_equipment_pk_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_gs_study_pk_id` FOREIGN KEY (`study_pk_id`) REFERENCES `study` (`study_pk_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `gui_action_history`
--
DROP TABLE IF EXISTS `gui_action_history`;
CREATE TABLE `gui_action_history` (
  `GUI_ACTION_HISTORY_PK_ID` bigint(20) NOT NULL DEFAULT 0,
  `ACTION_TIMESTAMP` date DEFAULT NULL,
  `ACTION` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`GUI_ACTION_HISTORY_PK_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `hibernate_unique_key`
--
DROP TABLE IF EXISTS `hibernate_unique_key`;
CREATE TABLE `hibernate_unique_key` (
  `next_hi` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `login_history`
--
DROP TABLE IF EXISTS `login_history`;
CREATE TABLE `login_history` (
  `login_history_pk_id` bigint(20) NOT NULL,
  `login_timestamp` datetime DEFAULT NULL,
  `ip_address` varchar(15) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  PRIMARY KEY (`login_history_pk_id`),
  UNIQUE KEY `PK_LOGIN_HISTORY_PK_ID` (`login_history_pk_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Temporary table structure for view `manufacturer`
--
DROP TABLE IF EXISTS `manufacturer`;
/*!50001 DROP VIEW IF EXISTS `manufacturer`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `manufacturer` (
  `MANUFACTURER` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `manufacturer_model_software`
--
DROP TABLE IF EXISTS `manufacturer_model_software`;
/*!50001 DROP VIEW IF EXISTS `manufacturer_model_software`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `manufacturer_model_software` (
  `ID` tinyint NOT NULL,
  `MANUFACTURER` tinyint NOT NULL,
  `MODEL` tinyint NOT NULL,
  `SOFTWARE` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `modality_descriptions`
--
DROP TABLE IF EXISTS `modality_descriptions`;
CREATE TABLE `modality_descriptions` (
  `modality_descriptions_pk_id` bigint(20) NOT NULL,
  `modality_name` varchar(20) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `description` mediumtext CHARACTER SET latin1 COLLATE latin1_bin,
  PRIMARY KEY (`modality_descriptions_pk_id`),
  UNIQUE KEY `MD_COLLECTION_DESC_PK_ID` (`modality_descriptions_pk_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `mr_image`
--
DROP TABLE IF EXISTS `mr_image`;
CREATE TABLE `mr_image` (
  `IMAGE_TYPE_VALUE_3` varchar(16) NOT NULL,
  `SCANNING_SEQUENCE` varchar(126) NOT NULL,
  `SEQUENCE_VARIANT` varchar(126) NOT NULL,
  `REPETITION_TIME` decimal(22,10) DEFAULT NULL,
  `ECHO_TIME` decimal(22,10) DEFAULT NULL,
  `INVERSION_TIME` decimal(22,10) DEFAULT NULL,
  `SEQUENCE_NAME` varchar(64) DEFAULT NULL,
  `IMAGED_NUCLEUS` varchar(64) DEFAULT NULL,
  `MAGNETIC_FIELD_STRENGTH` decimal(22,10) DEFAULT NULL,
  `SAR` decimal(22,10) DEFAULT NULL,
  `DB_DT` decimal(22,10) DEFAULT NULL,
  `TRIGGER_TIME` decimal(22,10) DEFAULT NULL,
  `ANGIO_FLAG` varchar(1) DEFAULT NULL,
  `IMAGE_PK_ID` bigint(20) NOT NULL,
  `MR_IMAGE_PK_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `GENERAL_SERIES_PK_ID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`MR_IMAGE_PK_ID`),
  KEY `MR_IMAGE_IMAGE_PK_ID_INDX` (`IMAGE_PK_ID`),
  KEY `MR_SERIES_PK_ID_INDX` (`GENERAL_SERIES_PK_ID`),
  CONSTRAINT `FK_MR_GEN_IMAGE_PK_ID` FOREIGN KEY (`IMAGE_PK_ID`) REFERENCES `general_image` (`image_pk_id`),
  CONSTRAINT `FK_MR_GEN_SERIES_PK_ID` FOREIGN KEY (`GENERAL_SERIES_PK_ID`) REFERENCES `general_series` (`general_series_pk_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Temporary table structure for view `number_month`
--
DROP TABLE IF EXISTS `number_month`;
/*!50001 DROP VIEW IF EXISTS `number_month`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `number_month` (
  `PATIENT_ID` tinyint NOT NULL,
  `NUMBER_MONTH` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `patient`
--
DROP TABLE IF EXISTS `patient`;
CREATE TABLE `patient` (
  `patient_pk_id` bigint(20) NOT NULL,
  `patient_id` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `patient_name` varchar(250) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `patient_birth_date` date DEFAULT NULL,
  `patient_sex` varchar(16) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `ethnic_group` varchar(16) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `trial_dp_pk_id` bigint(20) DEFAULT NULL,
  `trial_subject_id` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `trial_subject_reading_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `trial_site_pk_id` bigint(20) DEFAULT NULL,
  `species_code` varchar(64) DEFAULT NULL,
  `species_description` varchar(500) DEFAULT NULL,
  `qc_subject` varchar(4) DEFAULT NULL,
  PRIMARY KEY (`patient_pk_id`),
  UNIQUE KEY `PK_PATINET_PK_ID` (`patient_pk_id`),
  KEY `fk_trial_dp_pk_id` (`trial_dp_pk_id`),
  KEY `fk_trial_site_pk_id` (`trial_site_pk_id`),
  KEY `Patient_Id_Idx` (`patient_id`),
  KEY `species_codeindx` (`species_code`),
  CONSTRAINT `fk_trial_dp_pk_id` FOREIGN KEY (`trial_dp_pk_id`) REFERENCES `trial_data_provenance` (`trial_dp_pk_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `qc_status_history`
--
DROP TABLE IF EXISTS `qc_status_history`;
CREATE TABLE `qc_status_history` (
  `qc_status_history_pk_id` bigint(20) NOT NULL,
  `series_instance_uid` varchar(64) NOT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `comment_` varchar(4000) DEFAULT NULL,
  `history_timestamp` datetime DEFAULT NULL,
  `new_value` varchar(100) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `old_value` varchar(100) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `oldBatch` varchar(20) DEFAULT NULL,
  `newBatch` varchar(20) DEFAULT NULL,
  `oldSubmissionType` varchar(100) DEFAULT NULL,
  `newSubmissionType` varchar(100) DEFAULT NULL,
  `oldReleasedStatus` varchar(50) DEFAULT NULL,
  `newReleasedStatus` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`qc_status_history_pk_id`),
  UNIQUE KEY `PK_QC_STATUS_HISTORY_PK_ID` (`qc_status_history_pk_id`),
  KEY `genseries_qcsts_id_idx` (`series_instance_uid`),
  KEY `qc_status_history_idx` (`history_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `query_history`
--
DROP TABLE IF EXISTS `query_history`;
CREATE TABLE `query_history` (
  `query_history_pk_id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `query_execute_timestamp` datetime DEFAULT NULL,
  `query_elapsed_time` bigint(20) DEFAULT NULL,
  `saved_query_pk_id` bigint(20) DEFAULT NULL,
  `tool` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`query_history_pk_id`),
  UNIQUE KEY `PK_QUERY_HISTORY_PK_ID` (`query_history_pk_id`),
  KEY `query_history_user_idx` (`user_id`),
  KEY `query_hist_save_quer_idx` (`saved_query_pk_id`),
  CONSTRAINT `FK_Q_H_USER_ID` FOREIGN KEY (`user_id`) REFERENCES `csm_user` (`USER_ID`) ON DELETE CASCADE,
  CONSTRAINT `fk_s_query_pk_id` FOREIGN KEY (`saved_query_pk_id`) REFERENCES `saved_query` (`saved_query_pk_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `query_history_attribute`
--
DROP TABLE IF EXISTS `query_history_attribute`;
CREATE TABLE `query_history_attribute` (
  `query_history_attribute_pk_id` bigint(20) NOT NULL,
  `attribute_name` varchar(300) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `subattribute_name` varchar(300) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `attribute_value` varchar(300) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `query_history_pk_id` bigint(20) DEFAULT NULL,
  `instance_number` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`query_history_attribute_pk_id`),
  UNIQUE KEY `PK_Q_H_A_PK_ID` (`query_history_attribute_pk_id`),
  KEY `attri_name_idx` (`attribute_name`),
  KEY `attri_value_idx` (`attribute_value`),
  KEY `query_history_attr_parent` (`query_history_pk_id`),
  KEY `FK_Q_H_PK_ID` (`query_history_pk_id`),
  CONSTRAINT `FK_Q_H_PK_ID` FOREIGN KEY (`query_history_pk_id`) REFERENCES `query_history` (`query_history_pk_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `saved_query`
--
DROP TABLE IF EXISTS `saved_query`;
CREATE TABLE `saved_query` (
  `saved_query_pk_id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `query_name` varchar(200) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `new_data_flag` varchar(5) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `active` varchar(5) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `query_execute_timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`saved_query_pk_id`),
  UNIQUE KEY `PK_SAVED_Q_PK_ID` (`saved_query_pk_id`),
  KEY `saved_query_user_idx` (`user_id`),
  CONSTRAINT `FK_SAVED_QUERY_USER_ID` FOREIGN KEY (`user_id`) REFERENCES `csm_user` (`USER_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `saved_query_attribute`
--
DROP TABLE IF EXISTS `saved_query_attribute`;
CREATE TABLE `saved_query_attribute` (
  `saved_query_attribute_pk_id` bigint(20) NOT NULL,
  `attribute_name` varchar(300) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `subattribute_name` varchar(300) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `attribute_value` varchar(300) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `saved_query_pk_id` bigint(20) DEFAULT NULL,
  `instance_number` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`saved_query_attribute_pk_id`),
  UNIQUE KEY `PK_S_Q_A_PK_ID` (`saved_query_attribute_pk_id`),
  KEY `saved_query_attr_parent` (`saved_query_pk_id`),
  KEY `FK_SAVED_QUERY_PK_ID` (`saved_query_pk_id`),
  CONSTRAINT `FK_SAVED_QUERY_PK_ID` FOREIGN KEY (`saved_query_pk_id`) REFERENCES `saved_query` (`saved_query_pk_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Temporary table structure for view `saved_query_last_exec`
--
DROP TABLE IF EXISTS `saved_query_last_exec`;
/*!50001 DROP VIEW IF EXISTS `saved_query_last_exec`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `saved_query_last_exec` (
  `SAVED_QUERY_PK_ID` tinyint NOT NULL,
  `LAST_EXECUTE_DATE` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `software_versions`
--
DROP TABLE IF EXISTS `software_versions`;
/*!50001 DROP VIEW IF EXISTS `software_versions`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `software_versions` (
  `SOFTWARE_VERSIONS` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `species`
--
DROP TABLE IF EXISTS `species`;
CREATE TABLE `species` (
  `species_code` varchar(64) NOT NULL,
  `species_description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`species_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `study`
--
DROP TABLE IF EXISTS `study`;
CREATE TABLE `study` (
  `study_pk_id` bigint(20) NOT NULL,
  `study_instance_uid` varchar(500) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `study_date` date NOT NULL,
  `study_time` varchar(16) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `study_desc` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `admitting_diagnoses_desc` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `admitting_diagnoses_code_seq` varchar(500) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `patient_pk_id` bigint(20) DEFAULT NULL,
  `study_id` varchar(16) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `trial_time_point_id` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `trial_time_point_desc` varchar(1024) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `patient_age` varchar(4) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `age_group` varchar(10) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `patient_size` decimal(22,6) DEFAULT NULL,
  `patient_weight` decimal(22,6) DEFAULT NULL,
  `occupation` varchar(16) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `additional_patient_history` varchar(4000) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  PRIMARY KEY (`study_pk_id`),
  UNIQUE KEY `PK_STUDY_PK_ID` (`study_pk_id`),
  UNIQUE KEY `study_instance_uid` (`study_instance_uid`),
  KEY `study_desc_idx` (`study_desc`),
  KEY `fk_patient_pk_id` (`patient_pk_id`),
  KEY `STUDY_INSTANCE_UID_idx` (`study_instance_uid`),
  CONSTRAINT `fk_patient_pk_id` FOREIGN KEY (`patient_pk_id`) REFERENCES `patient` (`patient_pk_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Temporary table structure for view `study_series_number`
--
DROP TABLE IF EXISTS `study_series_number`;
/*!50001 DROP VIEW IF EXISTS `study_series_number`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `study_series_number` (
  `PATIENT_PK_ID` tinyint NOT NULL,
  `PATIENT_ID` tinyint NOT NULL,
  `PROJECT` tinyint NOT NULL,
  `STUDY_NUMBER` tinyint NOT NULL,
  `SERIES_NUMBER` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `submission_history`
--
DROP TABLE IF EXISTS `submission_history`;
CREATE TABLE `submission_history` (
  `submission_history_pk_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `patient_id` varchar(64) DEFAULT NULL,
  `study_instance_uid` varchar(500) DEFAULT NULL,
  `series_instance_uid` varchar(64) DEFAULT NULL,
  `sop_instance_uid` varchar(64) DEFAULT NULL,
  `submission_timestamp` datetime DEFAULT NULL,
  `project` varchar(200) DEFAULT NULL,
  `site` varchar(40) DEFAULT NULL,
  `operation_type` smallint(6) NOT NULL,
  UNIQUE KEY `submission_history_pk_id` (`submission_history_pk_id`),
  KEY `project_side_idx` (`project`,`site`),
  KEY `series_instance_uid_idx` (`series_instance_uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `trial_data_provenance`
--
DROP TABLE IF EXISTS `trial_data_provenance`;
CREATE TABLE `trial_data_provenance` (
  `trial_dp_pk_id` bigint(20) NOT NULL,
  `dp_site_name` varchar(40) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `dp_site_id` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `project` varchar(50) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  PRIMARY KEY (`trial_dp_pk_id`),
  UNIQUE KEY `PK_TRIAL_DP_PK_ID` (`trial_dp_pk_id`),
  KEY `siteNameIndex` (`dp_site_name`),
  KEY `projectIndex` (`project`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `trial_site`
--
DROP TABLE IF EXISTS `trial_site`;
CREATE TABLE `trial_site` (
  `trial_site_pk_id` bigint(20) NOT NULL,
  `trial_site_id` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `trial_site_name` varchar(64) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `trial_pk_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`trial_site_pk_id`),
  UNIQUE KEY `PK_TRIAL_SITE_PK_ID` (`trial_site_pk_id`),
  KEY `fk_trial_pk_id` (`trial_pk_id`),
  CONSTRAINT `fk_trial_pk_id` FOREIGN KEY (`trial_pk_id`) REFERENCES `clinical_trial` (`trial_pk_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `workflow`
--
DROP TABLE IF EXISTS `workflow`;
CREATE TABLE `workflow` (
  `WORKFLOW_ID` bigint(20) NOT NULL DEFAULT 0,
  `NAME` varchar(50) DEFAULT NULL,
  `COLLECTION` varchar(200) DEFAULT NULL,
  `SITE` varchar(200) DEFAULT NULL,
  `URL` varchar(255) DEFAULT NULL,
  `WORKFLOW_TYPE` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`WORKFLOW_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Final view structure for view `dicom_image`
--

/*!50001 DROP TABLE IF EXISTS `dicom_image`*/;
/*!50001 DROP VIEW IF EXISTS `dicom_image`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50001 VIEW `dicom_image` AS select `gi`.`image_pk_id` AS `IMAGE_PK_ID`,`gi`.`instance_number` AS `INSTANCE_NUMBER`,`gi`.`content_date` AS `CONTENT_DATE`,`gi`.`content_time` AS `CONTENT_TIME`,`gi`.`image_type` AS `IMAGE_TYPE`,`gi`.`acquisition_date` AS `ACQUISITION_DATE`,`gi`.`acquisition_time` AS `ACQUISITION_TIME`,`gi`.`acquisition_number` AS `ACQUISITION_NUMBER`,`gi`.`lossy_image_compression` AS `LOSSY_IMAGE_COMPRESSION`,`gi`.`pixel_spacing` AS `PIXEL_SPACING`,`gi`.`image_orientation_patient` AS `IMAGE_ORIENTATION_PATIENT`,`gi`.`image_position_patient` AS `IMAGE_POSITION_PATIENT`,`gi`.`slice_thickness` AS `SLICE_THICKNESS`,`gi`.`slice_location` AS `SLICE_LOCATION`,`gi`.`i_rows` AS `I_ROWS`,`gi`.`i_columns` AS `I_COLUMNS`,`gi`.`contrast_bolus_agent` AS `CONTRAST_BOLUS_AGENT`,`gi`.`contrast_bolus_route` AS `CONTRAST_BOLUS_ROUTE`,`gi`.`sop_class_uid` AS `SOP_CLASS_UID`,`gi`.`sop_instance_uid` AS `SOP_INSTANCE_UID`,`gi`.`general_series_pk_id` AS `GENERAL_SERIES_PK_ID`,`gi`.`patient_position` AS `PATIENT_POSITION`,`gi`.`source_to_detector_distance` AS `SOURCE_TO_DETECTOR_DISTANCE`,`gi`.`source_subject_distance` AS `SOURCE_SUBJECT_DISTANCE`,`gi`.`focal_spot_size` AS `FOCAL_SPOT_SIZE`,`gi`.`storage_media_file_set_uid` AS `STORAGE_MEDIA_FILE_SET_UID`,`gi`.`dicom_file_uri` AS `DICOM_FILE_URI`,`gi`.`acquisition_datetime` AS `ACQUISITION_DATETIME`,`gi`.`image_comments` AS `IMAGE_COMMENTS`,`gi`.`image_receiving_timestamp` AS `IMAGE_RECEIVING_TIMESTAMP`,`gi`.`curation_timestamp` AS `CURATION_TIMESTAMP`,`gi`.`annotation` AS `ANNOTATION`,`gi`.`submission_date` AS `SUBMISSION_DATE`,`gi`.`dicom_size` AS `DICOM_SIZE`,`gi`.`image_laterality` AS `IMAGE_LATERALITY`,`gi`.`trial_dp_pk_id` AS `TRIAL_DP_PK_ID`,`gi`.`patient_id` AS `PATIENT_ID`,`gi`.`study_instance_uid` AS `STUDY_INSTANCE_UID`,`gi`.`series_instance_uid` AS `SERIES_INSTANCE_UID`,`gi`.`patient_pk_id` AS `PATIENT_PK_ID`,`gi`.`study_pk_id` AS `STUDY_PK_ID`,`gi`.`project` AS `PROJECT`,`gi`.`acquisition_matrix` AS `ACQUISITION_MATRIX`,`gi`.`dx_data_collection_diameter` AS `DX_DATA_COLLECTION_DIAMETER`,`cti`.`kvp` AS `KVP`,`cti`.`scan_options` AS `SCAN_OPTIONS`,`cti`.`data_collection_diameter` AS `DATA_COLLECTION_DIAMETER`,`cti`.`reconstruction_diameter` AS `RECONSTRUCTION_DIAMETER`,`cti`.`gantry_detector_tilt` AS `GANTRY_DETECTOR_TILT`,`cti`.`exposure_time` AS `EXPOSURE_TIME`,`cti`.`x_ray_tube_current` AS `X_RAY_TUBE_CURRENT`,`cti`.`exposure` AS `EXPOSURE`,`cti`.`exposure_in_microas` AS `EXPOSURE_IN_MICROAS`,`cti`.`convolution_kernel` AS `CONVOLUTION_KERNEL`,`cti`.`revolution_time` AS `REVOLUTION_TIME`,`cti`.`single_collimation_width` AS `SINGLE_COLLIMATION_WIDTH`,`cti`.`total_collimation_width` AS `TOTAL_COLLIMATION_WIDTH`,`cti`.`table_speed` AS `TABLE_SPEED`,`cti`.`table_feed_per_rotation` AS `TABLE_FEED_PER_ROTATION`,`cti`.`ct_pitch_factor` AS `CT_PITCH_FACTOR`,`cti`.`anatomic_region_seq` AS `ANATOMIC_REGION_SEQ` from (`general_image` `gi` join `ct_image` `cti`) where (`gi`.`image_pk_id` = `cti`.`image_pk_id`) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `dicom_series`
--

/*!50001 DROP TABLE IF EXISTS `dicom_series`*/;
/*!50001 DROP VIEW IF EXISTS `dicom_series`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50001 VIEW `dicom_series` AS select `general_series`.`general_series_pk_id` AS `GENERAL_SERIES_PK_ID`,`general_series`.`body_part_examined` AS `BODY_PART_EXAMINED`,`general_series`.`frame_of_reference_uid` AS `FRAME_OF_REFERENCE_UID`,`general_series`.`series_laterality` AS `SERIES_LATERALITY`,`general_series`.`modality` AS `MODALITY`,`general_series`.`protocol_name` AS `PROTOCOL_NAME`,`general_series`.`series_date` AS `SERIES_DATE`,`general_series`.`series_desc` AS `SERIES_DESC`,`general_series`.`series_instance_uid` AS `SERIES_INSTANCE_UID`,`general_series`.`series_number` AS `SERIES_NUMBER`,`general_series`.`sync_frame_of_ref_uid` AS `SYNC_FRAME_OF_REF_UID`,`general_series`.`study_pk_id` AS `STUDY_PK_ID`,`general_series`.`general_equipment_pk_id` AS `GENERAL_EQUIPMENT_PK_ID` from `general_series` where ((`general_series`.`visibility` = '1') and isnull(`general_series`.`security_group`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `dicom_study`
--

/*!50001 DROP TABLE IF EXISTS `dicom_study`*/;
/*!50001 DROP VIEW IF EXISTS `dicom_study`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50001 VIEW `dicom_study` AS select `study`.`study_pk_id` AS `STUDY_PK_ID`,`study`.`study_instance_uid` AS `STUDY_INSTANCE_UID`,`study`.`additional_patient_history` AS `ADDITIONAL_PATIENT_HISTORY`,`study`.`study_date` AS `STUDY_DATE`,`study`.`study_desc` AS `STUDY_DESC`,`study`.`admitting_diagnoses_desc` AS `ADMITTING_DIAGNOSES_DESC`,`study`.`admitting_diagnoses_code_seq` AS `ADMITTING_DIAGNOSES_CODE_SEQ`,`study`.`occupation` AS `OCCUPATION`,`study`.`patient_age` AS `PATIENT_AGE`,`study`.`patient_size` AS `PATIENT_SIZE`,`study`.`patient_weight` AS `PATIENT_WEIGHT`,`study`.`study_id` AS `STUDY_ID`,`study`.`study_time` AS `STUDY_TIME`,`study`.`trial_time_point_id` AS `TRIAL_TIME_POINT_ID`,`study`.`trial_time_point_desc` AS `TRIAL_TIME_POINT_DESC`,`study`.`patient_pk_id` AS `PATIENT_PK_ID` from `study` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `manufacturer`
--

/*!50001 DROP TABLE IF EXISTS `manufacturer`*/;
/*!50001 DROP VIEW IF EXISTS `manufacturer`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50001 VIEW `manufacturer` AS select distinct `general_equipment`.`manufacturer` AS `MANUFACTURER` from `general_equipment` where `general_equipment`.`general_equipment_pk_id` in (select `general_series`.`general_equipment_pk_id` AS `GENERAL_EQUIPMENT_PK_ID` from `general_series` where (`general_series`.`visibility` = _latin1'1')) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `manufacturer_model_software`
--

/*!50001 DROP TABLE IF EXISTS `manufacturer_model_software`*/;
/*!50001 DROP VIEW IF EXISTS `manufacturer_model_software`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50001 VIEW `manufacturer_model_software` AS select distinct `general_equipment`.`general_equipment_pk_id` AS `ID`,`general_equipment`.`manufacturer` AS `MANUFACTURER`,`general_equipment`.`manufacturer_model_name` AS `MODEL`,`general_equipment`.`software_versions` AS `SOFTWARE` from `general_equipment` where `general_equipment`.`general_equipment_pk_id` in (select `general_series`.`general_equipment_pk_id` AS `GENERAL_EQUIPMENT_PK_ID` from `general_series` where (`general_series`.`visibility` = _latin1'1')) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `number_month`
--

/*!50001 DROP TABLE IF EXISTS `number_month`*/;
/*!50001 DROP VIEW IF EXISTS `number_month`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50001 VIEW `number_month` AS select `s`.`patient_pk_id` AS `PATIENT_ID`,round(timestampdiff(MONTH,min(`s`.`study_date`),max(`s`.`study_date`)),0) AS `NUMBER_MONTH` from `study` `s` group by `s`.`patient_pk_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `saved_query_last_exec`
--

/*!50001 DROP TABLE IF EXISTS `saved_query_last_exec`*/;
/*!50001 DROP VIEW IF EXISTS `saved_query_last_exec`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50001 VIEW `saved_query_last_exec` AS select `qh`.`saved_query_pk_id` AS `SAVED_QUERY_PK_ID`,max(`qh`.`query_execute_timestamp`) AS `LAST_EXECUTE_DATE` from (`saved_query` `sq` join `query_history` `qh`) where (`qh`.`saved_query_pk_id` = `sq`.`saved_query_pk_id`) group by `qh`.`saved_query_pk_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `software_versions`
--

/*!50001 DROP TABLE IF EXISTS `software_versions`*/;
/*!50001 DROP VIEW IF EXISTS `software_versions`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50001 VIEW `software_versions` AS select distinct `general_equipment`.`software_versions` AS `SOFTWARE_VERSIONS` from `general_equipment` where `general_equipment`.`general_equipment_pk_id` in (select `general_series`.`general_equipment_pk_id` AS `GENERAL_EQUIPMENT_PK_ID` from `general_series` where ((`general_series`.`visibility` = _latin1'1') and (`general_equipment`.`software_versions` is not null))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `study_series_number`
--

/*!50001 DROP TABLE IF EXISTS `study_series_number`*/;
/*!50001 DROP VIEW IF EXISTS `study_series_number`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50001 VIEW `study_series_number` AS select `g`.`patient_pk_id` AS `PATIENT_PK_ID`,`p`.`patient_id` AS `PATIENT_ID`,`dp`.`project` AS `PROJECT`,count(distinct `g`.`study_pk_id`) AS `STUDY_NUMBER`,count(distinct `g`.`general_series_pk_id`) AS `SERIES_NUMBER` from ((`general_series` `g` join `patient` `p`) join `trial_data_provenance` `dp`) where ((`g`.`visibility` in (1,12)) and (`g`.`patient_pk_id` = `p`.`patient_pk_id`) and (`p`.`trial_dp_pk_id` = `dp`.`trial_dp_pk_id`)) group by `g`.`patient_pk_id`,`p`.`patient_id`,`dp`.`project` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
