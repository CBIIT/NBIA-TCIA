export let Properties = {
    // 11_OCT_2021
    VERSION: '1.0.10',
    //23_OCT_2022
    TEST_VERSION: '1.0.10b',

    MAX_CRITERIA_LEN: 32,

    // If this is left an empty string, the server used by the browser to reach the site will be used.
    // This value can be changed in the config file.

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

    API_SERVER_URL: '',

    // This value can be changed in the config file.
    // Only series with these modalities will show the OHIF viewer button
    OHIF_MODALITIES: ['MG', 'CT', 'MR', 'PT', 'DX', 'CR', 'SC', 'NM', 'CTPT'],

    dynamicQueryCriteriaSequenceNumber: 0,

    NO_LICENSE: false,


    // //////////////////////////////////////////////////////////////////////////
    //  The following values will be set by the "Brand"
    // //////////////////////////////////////////////////////////////////////////
    NEW_ACCOUNT_REGISTRATION: 'https://public.cancerimagingarchive.net/ncia/legalRules.jsf',
    ACCOUNT_HELP: 'https://public.cancerimagingarchive.net/ncia/accountSupport.jsf',
    TEXT_SEARCH_DOCUMENTATION: 'https://wiki.nci.nih.gov/display/NBIA/Performing+a+Text+Search+7.0',
    CUSTOM_MENU_DATA: [],
    LOGO_FILE: '',
    FOOTER_HTML: '',
    CONFIG_FILE: 'configuration',
    DEFAULT_BRAND: 'tcia',
    DOWNLOADER_URL: 'https://wiki.nci.nih.gov/display/NBIA/Downloading+NBIA+Images',
    //  END The following values will by set by the "Brand"
    // //////////////////////////////////////////////////////////////////////////

    HELP_BASE_URL: 'https://wiki.cancerimagingarchive.net/display/NBIA',
    HELP_PATH: 'Data+Administration+Tool+Guide',


    BRAND_DIR: 'brand',
    VERSION_SUFFIX: 'PLACE_HOLDER',  // Don't change this, it is needed by branding.service.ts to know if it is initialized before appending to the version.
    BRAND: '%BRAND%',

    // This is set from the server, so far it is only used in the footer (depending on the brand)
    HOST_NAME: '',

    // This value can be changed in the config file.
    // Show the OHIF viewer button at the Subject and Study levels
    SHOW_OHIF_VIEWER: true,

    // This value can be changed in the config file.
    // If this is left an empty string, the API server url will be used .
    OHIF_SERVER_URL: '',
    MAX_VIDEO_FPS: 30,



    HAVE_URL_TOKEN: false,

    // Show in console, curl version of post & get calls.
    DEBUG_CURL: false,

    // This value can be changed in the config file.  @FIXME  No, this is not yet in the config file!
    HTTP_TIMEOUT: 120000,

    DEV_MODE: false,
    DEV_PASSWORD: 'changeme',
    DEV_USER: 'mlerner',

    DEFAULT_SECRET: 'ItsBetweenUAndMe',  // CHECKME - Should we have this default here or only set in the configuration file?

    MAX_PAGER_BUTTONS: 6,
    DEFAULT_PAGE_LENGTH: 20,
    MAX_PAGE_LENGTH: 200,

    // How many seconds before token end of life to refresh the token
    TOKEN_REFRESH_TIME_MARGIN: 60,

    // DEV_PASSWORD: 'Froggy_127',
    // DEV_USER: 'lernermh',

    // Public.cancerimagingarchive.net

    // This is a flag that is set to true by the ConfigurationService when all the configuration file settings have been set.
    // It used to determine if it is okay to start using the configured settings yet.
    CONFIG_COMPLETE: false,

    SHOW_UNIVERSAL_MENU: true,
    CINE_MODE_TOGGLE_KEY: '1',

    SHOW_ROLES: false,
    DEMO_MODE: false,

    SHOW_HEADER: true,
    SHOW_FOOTER: true,



    SHOW_DYNAMIC_QUERY_CRITERIA_TEST_PAGE: false,
    SHOW_SERVER_QUERY: false,

    // @TODO We shouldn't need these anymore @CHECKME they can be deleted soon
    DEFAULT_SEARCH_TAB: 0, // 0="Criteria Search"  1="Dynamic Search"
    SHOW_ONLY_DEFAULT_SEARCH_TAB: true

};
