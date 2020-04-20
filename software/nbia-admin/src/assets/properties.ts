export let Properties = {
    // 18_MAR_2019 Don't change until 7.7
    VERSION: '1.0',

    // If this is left an empty string, the server used by the browser to reach the site will be used.
    // This value can be changed in the config file.

    // Use this when server is local npm run
      API_SERVER_URL: 'http://192.168.1.20:8080',
    // API_SERVER_URL: '',
     // API_SERVER_URL: 'https://public-dev.cancerimagingarchive.net',

    CONFIG_FILE: 'configuration',

    // This value can be changed in the config file.
    // Only series with these modalities will show the OHIF viewer button
    OHIF_MODALITIES: ['MG', 'CT', 'MR', 'PT', 'DX', 'CR', 'SC', 'NM', 'CTPT'],

    DEMO_MODE: false,

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


    LOGO_FILE: 'assets/images/logo.png',

    DEV_MODE: false,

    DEV_PASSWORD: 'changeme',
    DEV_USER: 'mlerner',

    // DEV_PASSWORD: 'Froggy_127',
    // DEV_USER: 'lernermh',

    // Public.cancerimagingarchive.net

    // This is a flag that is set to true by the ConfigurationService when all the configuration file settings have been set.
    // It used to determine if it is okay to start using the configured settings yet.
    CONFIG_COMPLETE: false,


};
