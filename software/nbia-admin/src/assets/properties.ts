export let Properties = {
    // 18_MAR_2019 Don't change until 7.7
    VERSION: '1.0.1',

    // If this is left an empty string, the server used by the browser to reach the site will be used.
    // This value can be changed in the config file.

    // Use this when server is local npm run
    //  API_SERVER_URL: 'http://192.168.1.20:8080',
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

     // API_SERVER_URL: 'https://public-dev.cancerimagingarchive.net',
     API_SERVER_URL: '',
    // API_SERVER_URL: 'http://192.168.1.20:8080',

    // This value can be changed in the config file.
    // Only series with these modalities will show the OHIF viewer button
    OHIF_MODALITIES: ['MG', 'CT', 'MR', 'PT', 'DX', 'CR', 'SC', 'NM', 'CTPT'],

    DEMO_MODE: false,

    // //////////////////////////////////////////////////////////////////////////
    //  The following values will by set by the "Brand"
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
    HELP_BASE_URL: 'https://wiki.cancerimagingarchive.net/display/NBIA/Data+Administration+Tool+Guide',
    //  END The following values will by set by the "Brand"
    // //////////////////////////////////////////////////////////////////////////


    BRAND_DIR: 'brand',
    VERSION_SUFFIX: 'PLACE_HOLDER',  // Don't change this, it is needed by branding.service.ts to know if it is initialized before appending to the version.
    BRAND: '%BRAND%',

    // This is set from the server, so far it is only used in the footer (depending on the brand)
    HOST_NAME: '',


    // @TODO
    // This does not work yet when the value is not an empty string, leave it an empty string!
    // This value can be changed in the config file.
    // If this is left an empty string, the API server url will be used .
   // OHIF_SERVER_URL: '',

    // This value can be changed in the config file.
    // Show the OHIF viewer button at the Subject and Study levels - Don't set this to "true" yet...
    SHOW_OHIF_VIEWER: true,

    OHIF_SERVER_URL: '',
    MAX_VIDEO_FPS: 30,

    // Show in console, curl version of post & get calls.
    DEBUG_CURL: false,

    // This value can be changed in the config file.  FIXMENOW  No this is not yet in the config file!
    HTTP_TIMEOUT: 120000,


    DEV_MODE: false,

    DEV_PASSWORD: 'changeme',
    DEV_USER: 'mlerner',

    // DEV_PASSWORD: 'Froggy_127',
    // DEV_USER: 'lernermh',

    // Public.cancerimagingarchive.net

    // This is a flag that is set to true by the ConfigurationService when all the configuration file settings have been set.
    // It used to determine if it is okay to start using the configured settings yet.
    CONFIG_COMPLETE: false,

    SHOW_CUSTOM_MENU: true
};
