export let Properties = {
    // 06_NOV_2020
   // VERSION: '1.0.67',
    // 12_MAY_2021
    VERSION: '1.0.67b',
    TITLE: 'Image Viewer',

    VIEWER_COLUMNS_DEFAULT: 5,

    COOKIE_NAME: 'NBIA_data',
    WAIT_TIME: 50,
    DEBUG_CURL: false,
    DEBUG: false,
    LOAD_ALL: 0,
    LOAD_ONE_PAGE: 1,
    LOAD_ONE_IMAGE: 2,
    IMAGE_LOAD_MODE: 1,

    DEFAULT_USER: 'nbia_guest',
    DEFAULT_PASSWORD: 'test',
    DEFAULT_SECRET: 'ItsBetweenUAndMe',


    // This is a flag that is set to true by the ConfigurationService when all the configuration file settings have been set.
    // It used to determine if it is okay to start using the configured settings yet.
    CONFIG_COMPLETE: false,

    // The "CONFIG_FILE" is within the /assets directory
    CONFIG_FILE: 'configuration',

    HTTP_TIMEOUT: 120000,
    HAVE_URL_TOKEN: true,


    /*  How many numbered page buttons between the arrow buttons  */
    MAX_PAGER_BUTTONS: 6,
    IMAGES_PER_PAGE_CHOICE_DEFAULT: 200 ,  // @TODO Get some feed back from users...

    // How many seconds before token end of life to refresh the token
    TOKEN_REFRESH_TIME_MARGIN: 60

};

