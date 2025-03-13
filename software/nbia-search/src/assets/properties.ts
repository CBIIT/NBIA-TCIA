export let Properties = {
    // 08_FEB_23
    //VERSION: '1.0.12',
    // 08_FEB_23
    //TEST_VERSION: '1.0.12a',

    // APr 2024
    CURRENT_YEAR:'2025',
    VERSION: '9.3',
    TEST_VERSION: '9.3',
    RELEASE_COMMIT: '21387774',

    // This is the text that appears in the clients browser tab or window
    TITLE: 'Search',


    // //////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////
    //  The following values can be over-ridden in the assets/configuration file
    // //////////////////////////////////////////////////////////////////////////
    // This value can be changed in the config file.
    BANNER_TEXT: '',
    // This value can be changed in the config file.
    BANNER_EXP: '',

    // This value can be changed in the config file.
    HTTP_TIMEOUT: 200000,

    // This value can be changed in the config file.
    // Only series with these modalities will show the OHIF viewer button
    OHIF_MODALITIES: ['MG', 'CT', 'MR', 'PT', 'DX', 'CR', 'SC', 'NM', 'CTPT', 'SR', 'SEG', 'RTSTRUCT'],

    // This value can be changed in the config file.
    // If this is left an empty string, the API server url will be used .
    OHIF_SERVER_URL: 'https://dicom-stg.cancerimagingarchive.net',

    // The path and parameters must be filled out, even if server url is left empty
    OHIF_SERVER_PATH: 'viewer',

    OHIF_STUDY_PARAMETER: 'StudyInstanceUIDs=',
    OHIF_SERIES_PARAMETER: 'SeriesInstanceUIDs=',

    // This value can be changed in the config file.
    // Show the OHIF viewer button at the Subject and Study levels - Don't set this to "true" yet...
    SHOW_OHIF_VIEWER: true,
    // This value can be changed in the config file.
    SHOW_OHIF_SERIES_VIEWER: true,

    NO_LICENSE: false,

    // //////////////////////////////////////////////////////////////////////////

    /*
        Our Dev server
        API_SERVER_URL: 'http://ncias-d1707-v.nci.nih.gov:8080',
        API_SERVER_URL: 'https://imaging-devcm.nci.nih.gov',

        QA
        API_SERVER_URL: 'https://ncias-q1730-v.nci.nih.gov',
        API_SERVER_URL: 'https://imaging-qacm.nci.nih.gov',

        Public
        API_SERVER_URL: 'https://public-dev.cancerimagingarchive.net',
        API_SERVER_URL: 'https://public.cancerimagingarchive.net',
    */

    // If this is left an empty string, the server used by the browser to reach the site will be used.
    // This value can be changed in the config file.
    // API_SERVER_URL: 'https://public-dev.cancerimagingarchive.net',
    // API_SERVER_URL: 'https://nbia.cancerimagingarchive.net',

    // API_SERVER_URL: 'http://192.168.1.21:8080',
    API_SERVER_URL: '',
    KEYCLOAK_LOGOUT_URL: 'https://keycloak.dbmi.cloud/auth/realms/TCIA/protocol/openid-connect/logout',
    // //////////////////////////////////////////////////////////////////////////
    //  End of values that can be over-ridden in the assets/configuration file
    // //////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////

    // We will only use this in the QC tools (This may change)
    CINE_MODE: false,


    // This is a flag that is set to true by the ConfigurationService when all the configuration file settings have been set.
    // It used to determine if it is okay to start using the configured settings yet.
    CONFIG_COMPLETE: false,

    // The "CONFIG_FILE" is within the /assets directory
    CONFIG_FILE: 'configuration',


    // //////////////////////////////////////////////////////////////////////////
    //  The following values will by set by the "Brand"
    // //////////////////////////////////////////////////////////////////////////
    NEW_ACCOUNT_REGISTRATION: 'https://public.cancerimagingarchive.net/ncia/legalRules.jsf',
    ACCOUNT_HELP: 'https://wiki.cancerimagingarchive.net/display/NBIA/Cancer+Imaging+Archive+Account+Help',  // Be advised, this can be replaced by the values
    TEXT_SEARCH_DOCUMENTATION: 'https://wiki.nci.nih.gov/display/NBIA/Performing+a+Text+Search+7.0',
    CUSTOM_MENU_DATA: [],
    LOGO_FILE: '',
    FOOTER_HTML: '',
    BRAND_DIR: 'brand',
    DEFAULT_BRAND: 'tcia',
    DOWNLOADER_URL: 'https://wiki.nci.nih.gov/display/NBIA/Downloading+NBIA+Images',

    VERSION_SUFFIX: 'PLACE_HOLDER',  // Don't change this, it is needed by branding.service.ts to know if it is initialized before appending to the version.
    BRAND: '%BRAND%',
    // //////////////////////////////////////////////////////////////////////////
    //  End of values will by set by the "Brand"
    // //////////////////////////////////////////////////////////////////////////


    // This is set from the server, so far it is only used in the footer (depending on the brand)
    HOST_NAME: '',

    // This can be removed when I get rid of all the old code used to get all the search results at once rather than just a page at a time.
    PAGED_SEARCH: true,

    SHOW_DATA_ADMIN_MENU: true,
    /*
       Don't show "Image counts"or "Disk Space" in the search results, or the column selector for search results.
       We get "Image counts" and "Disk space" included in the search results when using the "getExtendedSimpleSearch" rest service,
       but it was slow, so I switched to "getSimpleSearch" rest service which is much faster, but does not include "Image counts" and "Disk space".
     */
    DISABLE_COUNTS_AND_SIZE: true,

    // Show in console, curl version of API calls.
    DEBUG_CURL: false,

    ACTION_LOGGING: true,
    SHORT_LOG: true,

    // @TODO Get rid of these after everything is working. There will no longer be a need to show/hide.
    SHOW_SPECIES: true,
    SHOW_PHANTOM: true,
    SHOW_THIRD_PARTY: true,

    SHOW_QUERY_BUILDER: false,
    SHOW_SUBJECTS_TAB: false,
    SHOW_IMAGES_TAB: false,
    SHOW_SEARCH_SHARED_LIST_TAB: false,
    SHOW_SEARCH_STUDY_TAB: false,

    SHOW_SAVE_SHARED_LIST_TAB: false,
    SHOW_TEST_TAB: false,

    SHOW_SCROLL_STYLE_BUTTON: false,

    SHOW_SUMMARY_TAB: true,

    CONFIRM_EXIT: false,

    SHOW_ROLES: false,

    SHOW_HEADER: true,
    SHOW_UNIVERSAL_MENU: true,

    SHOW_PATIENT_SEX: false,
    SHOW_PATIENT_AGE: false,
    SHOW_SLICE_THICKNESS: false,
    SHOW_PIXEL_SPACING: false,
    SHOW_IMAGE_DESCRIPTION: false,

    USE_COLLECTIONS_LESS_MORE: true,

    // If false sort just by name, this is the default for criteria sorting
    // This is the sort for "Image Modality" and "Anatomical Site" and the default sort for Collections.
    SORT_COLLECTIONS_BY_COUNT: true,
    SORT_ANATOMICAL_BY_COUNT: true,

    SHOW_COLLECTIONS_SORT_OPTIONS: true,


    ///////////////////////////////////////////////////////////////////////////////
    // Key words for thumbnail values in the URL (outbound)
    URL_KEY_THUMBNAIL_SERIES: 'thumbnailSeries',
    URL_KEY_THUMBNAIL_DESCRIPTION: 'thumbnailDescription',
    URL_KEY_THUMBNAIL_TOKEN: 'accessToken',
    ///////////////////////////////////////////////////////////////////////////////

    THUMBNAIL_URL: 'nbia-viewer',
    NO_THUMBNAIL: false,

    ///////////////////////////////////////////////////////////////////////////////
    // Key words for simple search populated by values in the URL
    URL_KEY_PATIENT_ID: 'PatientCriteria',
    // For backwards compatibility
    URL_KEY_PATIENT_ID2: 'patientID',
    URL_KEY_STUDY_ID: 'StudyCriteria',
    URL_KEY_SERIES_ID: 'SeriesCriteria',

    URL_KEY_PATIENT_AGE_RANGE: 'PatientAgeRangeCriteria',
    URL_KEY_PATIENT_SEX: 'PatientSexCriteria',
    URL_KEY_PATIENT_HEIGHT_RANGE: 'PatientHeightRangeCriteria',
    URL_KEY_PATIENT_WEIGHT_RANGE: 'PatientWeightRangeCriteria',
    URL_KEY_NBIA_PROGRAM: 'NBIAProgramCriteria',

    URL_KEY_COLLECTIONS: 'CollectionCriteria',
    // For backwards compatibility
    URL_KEY_COLLECTIONS2: 'collectionName',

    URL_KEY_MODALITY: 'ImageModalityCriteria',
    URL_KEY_MODALITY_ALL: 'ModalityAll',
    URL_KEY_SPECIES: 'SpeciesCriteria',
    URL_KEY_PHANTOMS: 'PhantomCriteria',
    URL_KEY_THIRD_PARTY: 'ThirdPartyCriteria',
    URL_KEY_ANATOMICAL_SITE: 'AnatomicalSiteCriteria',
    URL_KEY_MINIMUM_STUDIES: 'MinNumberOfStudiesCriteria',
    URL_KEY_MINIMUM_STUDIES_DATES: 'MinNumberOfStudyDatesCriteria',
    URL_KEY_DATE_RANGE: 'DateRange',
    URL_KEY_SLICE_THICKNESS: 'SliceThicknessCriteria',
    URL_KEY_PIXEL_SPACING: 'PixelSpacingCriteria',
    URL_KEY_IMAGE_DESCRIPTION: 'ImageDescriptionCriteria',
    URL_KEY_MANUFACTURER: 'ManufacturerCriteria',


    URL_KEY_TEXT_SEARCH: 'text-search',
    URL_KEY_SHARED_LIST: 'saved-cart',

    URL_KEY_EXCLUDE_COMMERCIAL: 'exclude-commercial',
    URL_KEY_DAYS_FROM_BASELINE: 'days-from-baseline',
    URL_KEY_API_URL: 'api-url',
    URL_KEY_SHOW_TEST_TAB: 'show-settings',

    /////////////////////////////////////////////////////////////////////////////////


    DEFAULT_USER: 'nbia_guest',
    DEFAULT_PASSWORD: 'test',
    DEFAULT_SECRET: '',
    DEFAULT_CLIENT_ID: 'nbia-stage',

    /* Search results and Cart pages */
    ROWS_PER_PAGE_CHOICE_DEFAULT: 10,

    /*  How many criteria to show for each Simple search category, before clicking "More..."   */
    CRITERIA_SHOW_COUNT: 5,

    /*  How many numbered page buttons between the arrow buttons  */
    MAX_PAGER_BUTTONS: 6,

    SHOW_INTRO_DEFAULT: true,

    FEEDBACK_SITE: 'http://tciaguiv2.idea.informer.com',
    LEGACY_APP_SITE: 'ncia',
    HELP_SITE: 'https://wiki.cancerimagingarchive.net/x/2QLUAQ',
    HELP_SITE_HUMAN: 'http://www.cancerimagingarchive.net/support',

    LAST_ACCESS: '',

    ROWS_PER_PAGE_LIMIT: 500,

    // Number of elements to show per criteria in the display query. If there are more, show ...
    // Must be 2, 3, 4 or 5 !!!
    DISPLAY_QUERY_ELEMENTS_MAX: 4,

    // How long to show Collection descriptions after mouse leaves the Collection, in seconds.
    COLLECTION_DESCRIPTION_TOOLTIP_TIME: 1,

    // 0 = Old mouseover way   1 = New Click on it way
    COLLECTION_DESCRIPTION_TOOLTIP_TYPE: 1
};

