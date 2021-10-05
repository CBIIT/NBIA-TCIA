--
-- Initializing data for table `csm_application`
--

LOCK TABLES `csm_application` WRITE;
INSERT INTO `csm_application` (`APPLICATION_ID`, `APPLICATION_NAME`, `APPLICATION_DESCRIPTION`, `DECLARATIVE_FLAG`, `ACTIVE_FLAG`, `UPDATE_DATE`, `DATABASE_URL`, `DATABASE_USER_NAME`, `DATABASE_PASSWORD`, `DATABASE_DIALECT`, `DATABASE_DRIVER`, `CSM_VERSION`) VALUES
	(1, 'csmupt', 'CSM UPT Super Admin Application', 0, 0, sysdate(), NULL, NULL, NULL, NULL, NULL, NULL),
	(2, 'NCIA', 'Application Description', 0, 0, sysdate(), NULL, NULL, NULL, NULL, NULL, NULL);
UNLOCK TABLES;

--
-- Initializing data for table `csm_configuration_props`
--

LOCK TABLES `csm_configuration_props` WRITE;
INSERT INTO `csm_configuration_props` (`PROPERTY_KEY`, `PROPERTY_VALUE`) VALUES
	('AES_ENCRYPTION_KEY', 'super secret'),
	('ALLOWED_ATTEMPTS', '3'),
	('ALLOWED_LOGIN_TIME', '600000'),
	('MD5_HASH_KEY', 'true'),
	('PASSWORD_EXPIRY_DAYS', '60'),
	('PASSWORD_LOCKOUT_TIME', '1800000'),
	('PASSWORD_MATCH_NUM', '24'),
	('PASSWORD_PATTERN_DESCRIPTION', 'At least one Upper case alphabet, at least one lower case alphabet, at least one number and minimum 8 characters length'),
	('PASSWORD_PATTERN_MATCH', '^.*(?=.{8,})(?=..*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$');
UNLOCK TABLES;

--
-- Initializing data for table `csm_group`
--

LOCK TABLES `csm_group` WRITE;
INSERT INTO `csm_group` (`GROUP_ID`, `GROUP_NAME`, `GROUP_DESC`, `UPDATE_DATE`, `APPLICATION_ID`) VALUES
	(1, 'General User', 'Public user group', sysdate(), 2);
UNLOCK TABLES;

--
-- Initializing data for table `csm_privilege`
--

LOCK TABLES `csm_privilege` WRITE;
INSERT INTO `csm_privilege` (`PRIVILEGE_ID`, `PRIVILEGE_NAME`, `PRIVILEGE_DESCRIPTION`, `UPDATE_DATE`) VALUES
	(1, 'CREATE', 'This privilege grants permission to a user to create an entity. This entity can be an object, a database entry, or a resource such as a network connection', sysdate()),
	(2, 'ACCESS', 'This privilege allows a user to access a particular resource.  Examples of resources include a network or database connection, socket, module of the application, or even the application itself', sysdate()),
	(3, 'READ', 'This privilege permits the user to read data from a file, URL, database, an object, etc. This can be used at an entity level signifying that the user is allowed to read data about a particular entry', sysdate()),
	(4, 'WRITE', 'This privilege allows a user to write data to a file, URL, database, an object, etc. This can be used at an entity level signifying that the user is allowed to write data about a particular entity', sysdate()),
	(5, 'UPDATE', 'This privilege grants permission at an entity level and signifies that the user is allowed to update data for a particular entity. Entities may include an object, object attribute, database row etc', sysdate()),
	(6, 'DELETE', 'This privilege permits a user to delete a logical entity. This entity can be an object, a database entry, a resource such as a network connection, etc', sysdate()),
	(7, 'EXECUTE', 'This privilege allows a user to execute a particular resource. The resource can be a method, function, behavior of the application, URL, button etc', sysdate());
UNLOCK TABLES;

--
-- Initializing data for table `csm_protection_element`
--

LOCK TABLES `csm_protection_element` WRITE;
INSERT INTO `csm_protection_element` (`PROTECTION_ELEMENT_ID`, `PROTECTION_ELEMENT_NAME`, `PROTECTION_ELEMENT_DESCRIPTION`, `OBJECT_ID`, `ATTRIBUTE`, `PROTECTION_ELEMENT_TYPE`, `APPLICATION_ID`, `UPDATE_DATE`, `ATTRIBUTE_VALUE`) VALUES
	(1, 'csmupt', 'CSM UPT Super Admin Application Protection Element', 'csmupt', NULL, NULL, 1, sysdate(), NULL),
	(2, 'NCIA', 'NCIA Admin Application Protection Element', 'NCIA', NULL, NULL, 1, sysdate(), NULL),
	(3, 'NCIA.Common_Element', '', 'NCIA.Common_Element', NULL, NULL, 2, sysdate(), NULL);
UNLOCK TABLES;

--
-- Initializing data for table `csm_protection_group`
--

LOCK TABLES `csm_protection_group` WRITE;
INSERT INTO `csm_protection_group` (`PROTECTION_GROUP_ID`, `PROTECTION_GROUP_NAME`, `PROTECTION_GROUP_DESCRIPTION`, `APPLICATION_ID`, `LARGE_ELEMENT_COUNT_FLAG`, `UPDATE_DATE`, `PARENT_PROTECTION_GROUP_ID`) VALUES
	(1, 'NCIA.PUBLIC', 'Public', 2, 0, sysdate(), NULL),
	(2, 'NCIA.Common_PG', '', 2, 0, sysdate(), NULL);
UNLOCK TABLES;

--
-- Initializing data for table `csm_role`
--

LOCK TABLES `csm_role` WRITE;
INSERT INTO `csm_role` (`ROLE_ID`, `ROLE_NAME`, `ROLE_DESCRIPTION`, `APPLICATION_ID`, `ACTIVE_FLAG`, `UPDATE_DATE`) VALUES
	(1, 'NCIA.READ', 'public role', 2, 0, sysdate()),
	(2, 'NCIA.ADMIN', 'UPT access role', 2, 0, sysdate()),
	(3, 'NCIA.CURATE', 'Add or modify curation data', 2, 0, sysdate()),
	(4, 'NCIA.MANAGE_VISIBILITY_STATUS', 'Manage Visibility Status', 2, 0, sysdate()),
	(5, 'NCIA.VIEW_SUBMISSION_REPORT', 'View submission report', 2, 0, sysdate()),
	(6, 'NCIA.SUPER_CURATOR', 'Super Admin for approving deletion', 2, 0, sysdate()),
	(7, 'NCIA.DELETE_ADMIN', 'Super Admin for deletion', 2, 0, sysdate()),
	(8, 'NCIA.MANAGE_COLLECTION_DESCRIPTION', 'Manage collection description', 2, 0, sysdate());
UNLOCK TABLES;

--
-- Initializing data for table `csm_role_privilege`
--

LOCK TABLES `csm_role_privilege` WRITE;
INSERT INTO `csm_role_privilege` (`ROLE_PRIVILEGE_ID`, `ROLE_ID`, `PRIVILEGE_ID`, `UPDATE_DATE`) VALUES
	(1, 1, 3, sysdate());
UNLOCK TABLES;

--
-- Initializing data for table `csm_user`
--

LOCK TABLES `csm_user` WRITE;
INSERT INTO `csm_user` (`USER_ID`, `LOGIN_NAME`, `FIRST_NAME`, `LAST_NAME`, `ORGANIZATION`, `DEPARTMENT`, `TITLE`, `PHONE_NUMBER`, `PASSWORD`, `EMAIL_ID`, `START_DATE`, `END_DATE`, `UPDATE_DATE`, `MIDDLE_NAME`, `FAX`, `ADDRESS`, `CITY`, `STATE`, `COUNTRY`, `POSTAL_CODE`, `MIGRATED_FLAG`, `PREMGRT_LOGIN_NAME`, `PASSWORD_EXPIRED`, `FIRST_TIME_LOGIN`, `ACTIVE_FLAG`, `PASSWORD_EXPIRY_DATE`) VALUES
	(1, 'nbiaAdmin', 'FsQcmjeTRwMyYjNa0oHwgA==', 'qHd6B/O/6sCgHyhdRmAt7Q==', NULL, NULL, NULL, NULL, '5kJqWYBdWCphljGP2pGUGg==', '', NULL, NULL, sysdate(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, 0, 1, '2021-11-23'),
	(2, 'nbia_guest', 'DQ4nFusFQxr7f3z5/qvdhw==', 'DQ4nFusFQxr7f3z5/qvdhw==', NULL, NULL, NULL, NULL, NULL, 'J+U4jOdifJsvA5uICPsem96DzM2a7MkdUeb0eQ3Sr8E=', NULL, NULL, sysdate(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, 0, 1, '2012-10-10');
	UNLOCK TABLES;

--
-- Initializing data for table `csm_user_group_role_pg`
--

LOCK TABLES `csm_user_group_role_pg` WRITE;
INSERT INTO `csm_user_group_role_pg` (`USER_GROUP_ROLE_PG_ID`, `USER_ID`, `GROUP_ID`, `ROLE_ID`, `PROTECTION_GROUP_ID`, `UPDATE_DATE`) VALUES
	(1, NULL, 1, 1, 1, sysdate()),
	(2, 1, NULL, 2, 1, sysdate()),
	(3, 2, NULL, 1, 1, sysdate());
UNLOCK TABLES;

--
-- Initializing data for table `csm_user_pe`
--

LOCK TABLES `csm_user_pe` WRITE;
INSERT INTO `csm_user_pe` (`USER_PROTECTION_ELEMENT_ID`, `PROTECTION_ELEMENT_ID`, `USER_ID`, `UPDATE_DATE`) VALUES
	(1, 1, 1, sysdate()),
	(2, 2, 1, sysdate());
UNLOCK TABLES;

--
-- Initializing data for table `csm_pg_pe`
--

LOCK TABLES `csm_pg_pe` WRITE;
INSERT INTO `csm_pg_pe` (`PG_PE_ID`, `PROTECTION_GROUP_ID`, `PROTECTION_ELEMENT_ID`, `UPDATE_DATE`) VALUES
	(1, 1, 2, sysdate()),
	(2, 2, 3, sysdate());
UNLOCK TABLES;

--
-- Initializing data for table `hibernate_unique_key`
--

LOCK TABLES `hibernate_unique_key` WRITE;
INSERT INTO `hibernate_unique_key` (`next_hi`) VALUES
	(1);
UNLOCK TABLES;

--
-- Initializing data for table `modality_descriptions`
--

LOCK TABLES `modality_descriptions` WRITE;
INSERT INTO `modality_descriptions` (`modality_descriptions_pk_id`, `modality_name`, `description`) VALUES
	(1, 'CR', 'Computed Radiography'),
	(2, 'CT', 'Computed Tomography'),
	(3, 'MR', 'Magnetic Resonance'),
	(4, 'NM', 'Nuclear Medicine'),
	(5, 'US', 'Ultrasound'),
	(6, 'OT', 'Other'),
	(7, 'BI', 'Biomagnetic imaging'),
	(8, 'DG', 'Diaphanography'),
	(9, 'ES', 'Endoscopy'),
	(10, 'LS', 'Laser surface scan'),
	(11, 'PT', 'Positron emission tomography (PET)'),
	(12, 'RG', 'Radiographic imaging (conventional film/screen)'),
	(13, 'TG', 'Thermography'),
	(14, 'XA', 'X-Ray Angiography'),
	(15, 'RF', 'Radio Fluoroscopy'),
	(16, 'RTIMAGE', 'Radiotherapy Image'),
	(17, 'RTDOSE', 'Radiotherapy Dose'),
	(18, 'RTSTRUCT', 'Radiotherapy Structure Set'),
	(19, 'RTPLAN', 'Radiotherapy Plan'),
	(20, 'RTRECORD', 'RT Treatment Record'),
	(21, 'HC', 'Hard Copy'),
	(22, 'DX', 'Digital Radiography'),
	(23, 'MG', 'Mammography'),
	(24, 'IO', 'Intra-oral Radiography'),
	(25, 'IO', 'Intra-oral Radiography'),
	(26, 'PX', 'Panoramic X-Ray'),
	(27, 'GM', 'General Microscopy'),
	(28, 'SM', 'Slide Microscopy'),
	(29, 'XC', 'External-camera Photography'),
	(30, 'PR', 'Presentation State'),
	(31, 'AU', 'Audio'),
	(32, 'ECG', 'Electrocardiography'),
	(33, 'EPS', 'Cardiac Electrophysiology'),
	(34, 'HD', 'Hemodynamic Waveform'),
	(35, 'SR', 'SR Document'),
	(36, 'IVUS', 'Intravascular Ultrasound'),
	(37, 'OP', 'Ophthalmic Photography'),
	(38, 'SMR', 'Stereometric Relationship'),
	(39, 'AR', 'Autorefraction'),
	(40, 'KER', 'Keratometry'),
	(41, 'VA', 'Visual Acuity'),
	(42, 'VA', 'Visual Acuity'),
	(43, 'SRF', 'Subjective Refraction'),
	(44, 'OCT', 'Optical Coherence Tomography (non-Ophthalmic)'),
	(45, 'LEN', 'Lensometry'),
	(46, 'OPV', 'Ophthalmic Visual Field'),
	(47, 'OPM', 'Ophthalmic Mapping'),
	(48, 'OAM', 'Ophthalmic Axial Measurements'),
	(49, 'RESP', 'Respiratory Waveform'),
	(50, 'KO', 'Key Object Selection'),
	(51, 'SEG', 'Segmentation'),
	(52, 'REG', 'Registration'),
	(53, 'OPT', 'Ophthalmic Tomography'),
	(54, 'BDUS', 'Bone Densitometry (ultrasound)'),
	(55, 'BMD', 'Bone Densitometry (X-Ray)'),
	(56, 'DOC', 'Document'),
	(57, 'FID', 'Fiducials'),
	(58, 'SC', 'Secondary Capture'),
	(59, 'HISTOPATHOLOGY', 'HISTOPATHOLOGY');
UNLOCK TABLES;

--
-- Initializing data for table `species`
--

LOCK TABLES `species` WRITE;
INSERT INTO `species` (`species_code`, `species_description`) VALUES
	('107007004', 'Bovinae'),
	('125076001', 'Cavia porcellus'),
	('125097000', 'Capra hircus'),
	('125099002', 'Ovis aries'),
	('337915000', 'Homo sapiens'),
	('34618005', 'Bos taurus'),
	('35354009', 'Equus caballus'),
	('36571002', 'Oryctolagus cuniculus'),
	('36855005', 'Canis lupus'),
	('371564000', 'Rattus'),
	('371565004', 'Rattus norvegicus'),
	('388168008', 'Bos'),
	('388249000', 'Capra'),
	('388254009', 'Ovis'),
	('388393002', 'Sus'),
	('388445009', 'Equus'),
	('388490000', 'Canis'),
	('388626009', 'Felis'),
	('406733009', 'Callithrix jacchus'),
	('447482001', 'Mus genus'),
	('447612001', 'Mus musculus'),
	('448169003', 'Felis catus'),
	('448771007', 'Canis lupus familiaris'),
	('449310008', 'Mustela putorius furo'),
	('78678003', 'Sus scrofa');
UNLOCK TABLES;

COMMIT;