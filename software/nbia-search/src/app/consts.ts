export enum MenuItems {
    IMAGE_SEARCH_MENU_ITEM,
    LOGIN_MENU_ITEM,
    CART_MENU_ITEM,
    DOWNLOAD_MENU_ITEM,
    SAVE_SHARED_LIST_MENU_ITEM,
    SAVE_SHARED_LIST_CART_MENU_ITEM,
    SAVE_CART_MENU_ITEM,
    SAVE_SHARED_LIST_SUBJECT_ID_INPUT_MENU_ITEM,
    SAVE_SHARED_LIST_SERIES_ID_INPUT_MENU_ITEM,
    DISPLAY_QUERY_URL,
    HELP_MENU_ITEM,
    HELP_MENU_ITEM_SITE,
    HELP_MENU_ITEM_TALK_TO_HUMAN,
    HELP_MENU_SHOW_INTRO,
    HIDE_ALL
}

export const Consts = {

        API_ACCESS_TOKEN_URL: 'nbia-api/oauth/token',
        API_LOGOUT_URL: 'nbia-api/logout',
        API_MANIFEST_URL: 'nbia-api/services/getManifestTextV2',
        // API_SAVE_SHARED_LIST_URL: 'nbia-api/services/createSharedList',

        waitTime: 50,

        CRITERIA: 'criteria',

        // The actual value to use when building the Rest call
        COLLECTION_CRITERIA: 'CollectionCriteria',

        // The query type used in the client code to identify the type.
        COLLECTION: 'Collection',

        ANATOMICAL_SITE_CRITERIA: 'AnatomicalSiteCriteria',
        ANATOMICAL_SITE: 'AnatomicalSite',
        MINIMUM_STUDIES: 'MinNumberOfStudiesCriteria',
        IMAGE_MODALITY_CRITERIA: 'ImageModalityCriteria',
        IMAGE_MODALITY: 'ImageModality',
        MODALITY: 'Modality',
        PATIENT_CRITERIA: 'PatientCriteria',
        MANUFACTURER_CRITERIA: 'ManufacturerCriteria',
        MANUFACTURER: 'Manufacturer',
        MANUFACTURER_MODEL_CRITERIA: 'ModelCriteria',
        MANUFACTURER_MODEL: 'Model',
        MANUFACTURER_SOFTWARE_VERSION_CRITERIA: 'SoftwareVersionCriteria',
        MANUFACTURER_SOFTWARE_VERSION: 'Software Ver.',
        DATE_RANGE_CRITERIA: 'DateRangeCriteria',

        ALERT_BOX_WIDTH_DEFAULT: 400,

        SIMPLE_SEARCH_LOG_TEXT: 'SIMPLE_SEARCH',
        DOWNLOAD_CART_LOG_TEXT: 'DOWNLOAD_CART',
        SHARE_QUERY_LOG_TEXT: 'SHARE_QUERY',
        SAVE_CART_LOG_TEXT: 'SAVE_CART',
        HELP_SITE_LOG_TEXT: 'HELP_SITE',
        LOAD_SAVED_QUERY_LOG_TEXT: 'LOAD_SAVED_QUERY',


        // Used by Summary charts.
        COLOR_ARRAY: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94',
            '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],

        COLOR_ARRAY4: ['#9edae5', '#17becf', '#dbdb8d', '#bcbd22', '#c7c7c7', '#7f7f7f', '#f7b6d2', '#e377c2', '#c49c94', '#8c564b', '#c5b0d5'
            , '#9467bd', '#ff9896', '#d62728', '#98df8a', '#2ca02c', '#ffbb78', '#ff7f0e', '#aec7e8', '#1f77b4'],

        COLOR_ARRAY3: ['#fff', '#ffb', '#ff7', '#ff3', '#ff0', '#fbf', '#fbb', '#fb7', '#fb3', '#fb0', '#f7f', '#f7b', '#f77', '#f73', '#f70', '#f3f', '#f3b', '#f37', '#f33', '#f30', '#f0f', '#f0b', '#f07', '#f03', '#f00', '#bff', '#bfb', '#bf7', '#bf3', '#bf0', '#bbf', '#bbb', '#bb7', '#bb3', '#bb0', '#b7f', '#b7b', '#b77', '#b73', '#b70', '#b3f', '#b3b', '#b37', '#b33', '#b30', '#b0f', '#b0b', '#b07', '#b03', '#b00', '#7ff', '#7fb', '#7f7', '#7f3', '#7f0', '#7bf', '#7bb', '#7b7', '#7b3', '#7b0', '#77f', '#77b', '#777', '#773', '#770', '#73f', '#73b', '#737', '#733', '#730', '#70f', '#70b', '#707', '#703', '#700', '#3ff', '#3fb', '#3f7', '#3f3', '#3f0', '#3bf', '#3bb', '#3b7', '#3b3', '#3b0', '#37f', '#37b', '#377', '#373', '#370', '#33f', '#33b', '#337', '#333', '#330', '#30f', '#30b', '#307', '#303', '#300', '#0ff', '#0fb', '#0f7', '#0f3', '#0f0', '#0bf', '#0bb', '#0b7', '#0b3', '#0b0', '#07f', '#07b', '#077', '#073', '#070', '#03f', '#03b', '#037', '#033', '#030', '#00f', '#00b', '#007', '#003', '#000'],

        COLOR_ARRAY0: ['#000', '#003', '#006', '#009', '#00c', '#0000ff', '#030', '#033', '#036', '#039', '#03c', '#03f', '#060', '#063', '#066', '#069', '#06c', '#06f', '#090', '#093', '#096', '#099', '#09c', '#09f', '#0c0', '#0c3', '#0c6', '#0c9', '#0cc', '#0cf', '#0f0', '#0f3', '#0f6', '#0f9', '#0fc', '#0ff', '#300', '#303', '#306', '#309', '#30c', '#30f', '#330', '#333', '#336', '#339', '#33c', '#33f', '#360', '#363', '#366', '#369', '#36c', '#36f', '#390', '#393', '#396', '#399', '#39c', '#39f', '#3c0', '#3c3', '#3c6', '#3c9', '#3cc', '#3cf', '#3f0', '#3f3', '#3f6', '#3f9', '#3fc', '#3ff', '#600', '#603', '#606', '#609', '#60c', '#60f', '#630', '#633', '#636', '#639', '#63c', '#63f', '#660', '#663', '#666', '#669', '#66c', '#66f', '#690', '#693', '#696', '#699', '#69c', '#69f', '#6c0', '#6c3', '#6c6', '#6c9', '#6cc', '#6cf', '#6f0', '#6f3', '#6f6', '#6f9', '#6fc', '#6ff', '#900', '#903', '#906', '#909', '#90c', '#90f', '#930', '#933', '#936', '#939', '#93c', '#93f', '#960', '#963', '#966', '#969', '#96c', '#96f', '#990', '#993', '#996', '#999', '#99c', '#99f', '#9c0', '#9c3', '#9c6', '#9c9', '#9cc', '#9cf', '#9f0', '#9f3', '#9f6', '#9f9', '#9fc', '#9ff', '#c00', '#c03', '#c06', '#c09', '#c0c', '#c0f', '#c30', '#c33', '#c36', '#c39', '#c3c', '#c3f', '#c60', '#c63', '#c66', '#c69', '#c6c', '#c6f', '#c90', '#c93', '#c96', '#c99', '#c9c', '#c9f', '#cc0', '#cc3', '#cc6', '#cc9', '#ccc', '#ccf', '#cf0', '#cf3', '#cf6', '#cf9', '#cfc', '#cff', '#f00', '#f03', '#f06', '#f09', '#f0c', '#f0f', '#f30', '#f33', '#f36', '#f39', '#f3c', '#f3f', '#f60', '#f63', '#f66', '#f69', '#f6c', '#f6f', '#f90', '#f93', '#f96', '#f99', '#f9c', '#f9f', '#fc0', '#fc3', '#fc6', '#fc9', '#fcc', '#fcf', '#ff0', '#ff3', '#ff6', '#ff9', '#ffc', '#fff'],

        COLOR_ARRAY1: ['#000', '#003', '#007', '#00b', '#00f', '#030', '#033', '#037', '#03b', '#03f', '#070', '#073', '#077', '#07b', '#07f', '#0b0', '#0b3', '#0b7', '#0bb', '#0bf', '#0f0', '#0f3', '#0f7', '#0fb', '#0ff', '#300', '#303', '#307', '#30b', '#30f', '#330', '#333', '#337', '#33b', '#33f', '#370', '#373', '#377', '#37b', '#37f', '#3b0', '#3b3', '#3b7', '#3bb', '#3bf', '#3f0', '#3f3', '#3f7', '#3fb', '#3ff', '#700', '#703', '#707', '#70b', '#70f', '#730', '#733', '#737', '#73b', '#73f', '#770', '#773', '#777', '#77b', '#77f', '#7b0', '#7b3', '#7b7', '#7bb', '#7bf', '#7f0', '#7f3', '#7f7', '#7fb', '#7ff', '#b00', '#b03', '#b07', '#b0b', '#b0f', '#b30', '#b33', '#b37', '#b3b', '#b3f', '#b70', '#b73', '#b77', '#b7b', '#b7f', '#bb0', '#bb3', '#bb7', '#bbb', '#bbf', '#bf0', '#bf3', '#bf7', '#bfb', '#bff', '#f00', '#f03', '#f07', '#f0b', '#f0f', '#f30', '#f33', '#f37', '#f3b', '#f3f', '#f70', '#f73', '#f77', '#f7b', '#f7f', '#fb0', '#fb3', '#fb7', '#fbb', '#fbf', '#ff0', '#ff3', '#ff7', '#ffb', '#fff'],

        COLOR_ARRAY2: ['#FFCDD2', '#EF9A9A', '#E57373', '#E53935', '#B71C1C', '#F8BBD0', '#F48FB1', '#F06292', '#D81B60', '#880E4F', '#E1BEE7', '#CE93D8', '#BA68C8', '#8E24AA', '#4A148C', '#D1C4E9', '#B39DDB', '#9575CD', '#5E35B1', '#311B92', '#C5CAE9', '#9FA8DA',
            '#7986CB', '#3949AB', '#1A237E', '#BBDEFB', '#90CAF9', '#64B5F6', '#1E88E5', '#0D47A1', '#B3E5FC', '#81D4FA', '#4FC3F7', '#039BE5', '#01579B', '#B2EBF2', '#80DEEA', '#4DD0E1', '#00ACC1', '#006064', '#B2DFDB',
            '#80CBC4', '#4DB6AC', '#00897B', '#004D40', '#C8E6C9', '#A5D6A7', '#81C784', '#43A047', '#1B5E20', '#DCEDC8', '#C5E1A5', '#AED581', '#7CB342', '#33691E', '#F0F4C3', '#E6EE9C', '#DCE775', '#C0CA33', '#827717', '#FFF9C4', '#FFF59D', '#FFF176', '#FDD835', '#F57F17', '#D7CCC8', '#BCAAA4', '#A1887F', '#6D4C41', '#3E2723'
        ],

        DRILL_DOWN: 'getStudyDrillDown',
        DRILL_DOWN_CART: 'getStudyDrillDownCart',
        DRILL_DOWN_WITH_SERIES: 'getStudyDrillDownWithSeriesIds',
        DRILL_DOWN_CART_FROM_SERIES: 'getStudyDrillDownCartFromSeries',
        DRILL_DOWN_IMAGE: 'getImageDrillDown',
        GET_THUMBNAIL: 'getThumbnail\'',
        COLLECTION_DESCRIPTIONS: 'getCollectionDescriptions',


        // For getting subject "id" data with the subject "subjectId"  will be a simple search
        SHARED_LIST_SUBJECT_ID_SEARCH: 'sharedListSubjectIdSearch',


        // SIMPLE_SEARCH: 'getSimpleSearch',
        // SIMPLE_SEARCH: 'getExtendedSimpleSearch', // This was too slow


         SIMPLE_SEARCH: 'getSimpleSearchWithModalityAndBodyPartPaged',
        // SIMPLE_SEARCH: 'getSimpleSearchWithModalityAndBodyPart',

        // If you change SIMPLE_SEARCH or TEXT_SEARCH change here too.
        SEARCH_TYPES: ['getSimpleSearchWithModalityAndBodyPartPaged', 'getTextSearch'], // Used when getting the string when we have an index  FIXME  This is a little messy.
        // SEARCH_TYPES: ['getExtendedSimpleSearch', 'getTextSearch'], // Used when getting the string when we have an index  FIXME  This is a little messy.


        CRITERIA_SEARCH: 'CRITERIA_SEARCH_PLACE_HOLDER',
        TEXT_SEARCH: 'getTextSearch',
        STUDY_SEARCH: 'STUDY_SEARCH_PLACE_HOLDER',
        SHARED_LIST_SEARCH: 'SHARED_LIST_SEARCH_PLACE_HOLDER',

        CREATE_SHARED_LIST: 'createSharedList',
        DELETE_SHARED_LIST: 'deleteSharedList',
        GET_SHARED_LIST: 'getSharedList',
        LOG_ENTRY: 'addClientAudit',

        SEARCH_TYPE_DEFAULT: 0,  // Simple Search = 0, Free Text = 1, Query Builder = 2

        SEARCH_CRITERIA_VALUES: 'getSimpleSearchCriteriaValues',
        SERIES_FOR_SUBJECT: 'seriesForSubject',
        SERIES_FOR_SHARED_LIST_SUBJECT: 'seriesForSharedListSubject',
        DICOM_TAGS: 'getDicomTags',

        SHOW_CRITERIA_QUERY_COLLECTIONS: 'showQueryCollections',
        SHOW_CRITERIA_QUERY_ANATOMICAL_SITE: 'showQueryAnatomicalSite',
        SHOW_CRITERIA_QUERY_IMAGE_MODALITY: 'showQueryImageModality',
        SHOW_CRITERIA_QUERY_MANUFACTURER_MODEL: 'showQueryManufacturerModel',
        SHOW_CRITERIA_QUERY_AVAILABLE: 'showQueryAvailable',
        SHOW_CRITERIA_QUERY_SUBJECT_ID: 'showQuerySubjectIds',
        SHOW_CRITERIA_MINIMUM_MATCHED_STUDIES: 'showQueryMinimumMatchedStudies',

        SHOW_CRITERIA_QUERY_COLLECTIONS_DEFAULT: true,
        SHOW_CRITERIA_QUERY_ANATOMICAL_SITE_DEFAULT: true,
        SHOW_CRITERIA_QUERY_IMAGE_MODALITY_DEFAULT: true,
        SHOW_CRITERIA_QUERY_MANUFACTURER_MODEL_DEFAULT: false,
        SHOW_CRITERIA_QUERY_AVAILABLE_DEFAULT: false,
        SHOW_CRITERIA_QUERY_SUBJECT_ID_DEFAULT: false,

        DISPLAY_DATA_TYPE_SEARCH_RESULTS: 0,
        DISPLAY_DATA_TYPE_CART_LIST: 1,

        CHART_HEIGHT: 164,
        CHART_WIDTH: 164,
        CHART_HEIGHT_MARGIN: 16,
        CHART_WIDTH_MARGIN: 16,

        SUBJECT_DATE_TOOLTIP: 'Dates have been offset to protect private health information.',

        DEFAULT_SEARCH_RESULTS_COLUMNS:
            [
                {
                    'name': 'Cart',
                    'selected': true,
                    'required': true,
                    'textSearch': true,
                    'criteriaSearch': true,
                    'seq': 0
                },
                {
                    'name': 'Collection ID',
                    'selected': true,
                    'required': true,
                    'textSearch': true,
                    'criteriaSearch': true,
                    'seq': 1
                },
                {
                    'name': 'Subject ID',
                    'selected': true,
                    'required': true,
                    'textSearch': true,
                    'criteriaSearch': true,
                    'seq': 2
                },
                {
                    'name': 'Hit',
                    'selected': true,
                    'required': false,
                    'textSearch': true,
                    'criteriaSearch': false,
                    'seq': 3
                },
                {
                    'name': 'Studies',
                    'selected': true,
                    'required': true,
                    'textSearch': false,
                    'criteriaSearch': true,
                    'seq': 4
                },
                {
                    'name': 'Total Studies',
                    'selected': false,
                    'required': false,
                    'textSearch': true,
                    'criteriaSearch': true,
                    'seq': 5
                },
                {
                    'name': 'Series',
                    'selected': true,
                    'required': false,
                    'textSearch': false,
                    'criteriaSearch': true,
                    'seq': 6
                },
                {
                    'name': 'Total Series',
                    'selected': false,
                    'required': false,
                    'textSearch': true,
                    'criteriaSearch': true,
                    'seq': 7
                },
                {
                    'name': 'Disk Space',
                    'selected': false,
                    'required': false,
                    'textSearch': true,
                    'criteriaSearch': true,
                    'seq': 8
                },
                {
                    'name': 'Image Count',
                    'selected': false,
                    'required': false,
                    'textSearch': true,
                    'criteriaSearch': true,
                    'seq': 9
                }
            ]


    }
;

export interface NumberHash{
    [key: string]: number;
}
