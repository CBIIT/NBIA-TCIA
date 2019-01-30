export let Properties = {
    // 30_JAN_2019
    VERSION: '1.0.39',
    TITLE: 'Search',

    // These values will by set by the "Brand"
    NEW_ACCOUNT_REGISTRATION: 'https://public.cancerimagingarchive.net/ncia/legalRules.jsf',
    ACCOUNT_HELP: 'https://public.cancerimagingarchive.net/ncia/accountSupport.jsf',
    CUSTOM_MENU_DATA: [],
    LOGO_FILE: '',
    FOOTER_HTML: '',
    BRAND_DIR: 'brand',
    DEFAULT_BRAND: 'nbia',
    BRAND: '%BRAND%',

    /*
        Our Dev server
        API_SERVER_URL: 'http://ncias-d1707-v.nci.nih.gov:8080',
        API_SERVER_URL: 'https://imaging-devcm.nci.nih.gov',

        QA
        API_SERVER_URL: 'https://ncias-q1730-v.nci.nih.gov',
        API_SERVER_URL: 'https://imaging-qacm.nci.nih.gov',


        Public beta
        API_SERVER_URL: 'https://public-dev.cancerimagingarchive.net',

        API_SERVER_URL: 'https://public.cancerimagingarchive.net',
    */

    // If this is left an empty string, the url used by the browser to reach the site will be used
     API_SERVER_URL: '',

    // This can be removed when I get rid of all the old code used to get all the search results rather than just a page at a time.
    PAGED_SEARCH: true,

    /*
       Don't show "Image counts"or "Disk Space" in the search results, or the column selector for search results.
       We get "Image counts" and "Disk space" included in the search results when using the "getExtendedSimpleSearch" rest service,
       but it was slow, so I switched to "getSimpleSearch" rest service which is much faster, but does not include "Image counts" and "Disk space".
     */
    DISABLE_COUNTS_AND_SIZE: true,

    // Show in console, curl version of post & get calls.
    DEBUG_CURL: false,

    ACTION_LOGGING: true,
    SHORT_LOG: true,

    SHOW_CINE_MODE: false,

    SHOW_QUERY_BUILDER: false,
    SHOW_SEARCH_SHARED_LIST_TAB: false,
    SHOW_SEARCH_STUDY_TAB: false,

    SHOW_SAVE_SHARED_LIST_TAB: false,
    SHOW_TEST_TAB: false,

    SHOW_SCROLL_STYLE_BUTTON: false,

    SHOW_SUMMARY_TAB: true,

    SHOW_CUSTOM_MENU: true,

    CONFIRM_EXIT: true,

    // If false sort just by name, this is the default for criteria sorting
    // This is the sort for "Image Modality" and "Anatomical Site" and the default sort for Collections.
    SORT_BY_COUNT: true,

    SHOW_COLLECTIONS_SORT_OPTIONS: true,

    SHOW_IMAGE_VIEWER: false,


    ///////////////////////////////////////////////////////////////////////////////
    // Key words for thumbnail values in the URL (outbound)
    URL_KEY_THUMBNAIL_SERIES: 'thumbnailSeries',
    URL_KEY_THUMBNAIL_DESCRIPTION: 'thumbnailDescription',
    ///////////////////////////////////////////////////////////////////////////////

    THUMBNAIL_URL: 'nbia-viewer',
    NO_THUMBNAIL: false,

    ///////////////////////////////////////////////////////////////////////////////
    // Key words for simple search populated by values in the URL
    URL_KEY_PATIENT_ID: 'PatientCriteria',
    // For backwards compatibility
    URL_KEY_PATIENT_ID2: 'patientID',

    URL_KEY_COLLECTIONS: 'CollectionCriteria',
    // For backwards compatibility
    URL_KEY_COLLECTIONS2: 'collectionName',

    URL_KEY_MODALITY: 'ImageModalityCriteria',
    URL_KEY_MODALITY_ALL: 'ModalityAll',
    URL_KEY_ANATOMICAL_SITE: 'AnatomicalSiteCriteria',
    URL_KEY_MINIMUM_STUDIES: 'MinNumberOfStudiesCriteria',
    URL_KEY_DATE_RANGE: 'DateRange',
    URL_KEY_TEXT_SEARCH: 'text-search',
    URL_KEY_SHARED_LIST: 'saved-cart',

    URL_KEY_API_URL: 'api-url',
    URL_KEY_SHOW_TEST_TAB: 'show-settings',

    /////////////////////////////////////////////////////////////////////////////////

/*
        API_SERVER_PASSWORD_DEFAULT: 'changeme',
        API_SERVER_USER_DEFAULT: 'mlerner',
*/

    API_SERVER_USER_DEFAULT: 'nbia_guest',
    API_SERVER_PASSWORD_DEFAULT: 'test',

    API_CLIENT_SECRET_DEFAULT: 'ItsBetweenUAndMe',

    /* Search results and Cart pages */
    ROWS_PER_PAGE_CHOICE_DEFAULT: 10,

    /*  How many criteria to show for each Simple search category, before clicking "More..."   */
    CRITERIA_SHOW_COUNT: 5,

    /*  How many numbed page buttons between the arrow buttons  */
    MAX_PAGER_BUTTONS: 6,

    SHOW_INTRO_DEFAULT: true,

    // TCIA_DOWNLOADER_URL: 'https://wiki.cancerimagingarchive.net/display/NBIA/TCIA+Current+Help+Topics#TCIACurrentHelpTopics-DownloadingTCIAImages',
    TCIA_DOWNLOADER_URL: 'https://wiki.cancerimagingarchive.net/display/NBIA/Downloading+TCIA+Images',

    FEEDBACK_SITE: 'http://tciaguiv2.idea.informer.com',
    LEGACY_APP_SITE: 'ncia',
    HELP_SITE: 'https://wiki.cancerimagingarchive.net/x/2QLUAQ',
    HELP_SITE_HUMAN: 'http://www.cancerimagingarchive.net/support',


    // FIXME - This is not a Property, we need a config type component
    LAST_ACCESS: '',

    ROWS_PER_PAGE_LIMIT: 500,

};

