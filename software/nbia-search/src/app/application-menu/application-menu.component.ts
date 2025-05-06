import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertBoxButtonType, AlertBoxType} from '@app/common/components/alert-box/alert-box-consts';
import {Consts, DownloadTools, MenuItems} from '@app/consts';
import {Properties} from '@assets/properties';
import {MenuService} from '@app/common/services/menu.service';
import {CartService} from '@app/common/services/cart.service';
import {LoadingDisplayService} from '@app/common/components/loading-display/loading-display.service';
import {ApiServerService} from '@app/image-search/services/api-server.service';
import {CommonService} from '@app/image-search/services/common.service';
import {PersistenceService} from '@app/common/services/persistence.service';
import {AlertBoxService} from '@app/common/components/alert-box/alert-box.service';
import {HistoryLogService} from '@app/common/services/history-log.service';
import {UtilService} from '@app/common/services/util.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DownloadDownloaderService} from '@app/cart/downloader-download/download-downloader.service';

@Component({
    selector: 'nbia-application-menu',
    templateUrl: './application-menu.component.html',
    styleUrls: ['./application-menu.component.scss']
})
export class ApplicationMenuComponent implements OnInit, OnDestroy {


    /**
     * If menu lock is true, and a click event calls this.onMenuItemClick it will immediately return.
     * menuLock is set by this.menuService.menuLockEmitter.subscribe
     * @type {boolean}
     */
    menuLock = false;

    /**
     * Used to determine if the Cart button should be enabled ( >0 ), and to show a count on the right side of the Cart button.
     * It is set in cartService.cartCountEmitter.subscribe.
     * @type {number}
     */
    cartCount = 0;

    /**
     * Used to display a total download size of the current content of the Cart on the bottom of the Cart button.
     * It is set in cartService.cartCountEmitter.subscribe.
     * @type {number}
     */
    cartTotalFileSize = 0;
    cartTotalFileSizeWithDisabled = 0;

    /**
     * This maintains the "Is the mouse pointer over the menu button" state.
     * I was thinking maybe in the future to add real time one line context help to a footer ore other status type display.
     * @type {[boolean , boolean , boolean, boolean, boolean, boolean]}
     */
    menuMouseOver = [false, false, false, false, false, false, false, false];

    /**
     * The text displayed in the login button.
     * Can be Login, or Logout-<User name>
     */
    loginButtonText;

    /**
     * True if a (non-default) user is logged in.
     */
    userIsLoggedIn;

    /**
     * The currently logged in user. If it is the default/guest user, the user name will be set in Properties.DEFAULT_USER
     */
    currentUser;

    /**
     * This is used by the HTML to set the class of the currently active menu button for color.
     */
    currentMenuItem: MenuItems;

    /**
     * If showDownloaderDownload is true, when the user downloads the cart contents, we will first offer to show them how to download
     * the "TCIA Downloader app.
     */
    showDownloaderDownload;

    /**
     * To know if a value returned by the "AlertBox" is ours.
     * The only alertBox this component uses, is to ask the user if it's okay to lose their Cart contents when they log out/log in.
     * @type {string}
     */
    alertId00 = 'nbia-header-00';
    alertBoxResults = null;

    /**
     * Used in the HTM as a flag to disable some menu items if there is a popup/alertbox showing.
     * @type {boolean}
     */
    disabled = false;
    shareDisabled = true;

    // Get the MenuItems enum from consts.ts
    menuItem = MenuItems;
    // Does the user have the role needed to show User Admin tab?
    showUserAdminButton = false;
    showDataAdminButton = false;
    showDataAdminPerformQcButton = false;
    showDataAdminApproveDeletions = false;
    showDataAdminViewSubmissionReports = false;
    showPerformOnlineDeletions = false;
    showEditCollectionDescriptions = false;
    showEditLicense = false;
    showManageWorkflowItems = false;

    haveSimpleSearchQuery = false;
    haveTextSearchQuery = false;

    currentUserRoles;

    properties = Properties;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();


    constructor(private menuService: MenuService, private cartService: CartService,
                private apiServerService: ApiServerService,
                private commonService: CommonService, private persistenceService: PersistenceService,
                private alertBoxService: AlertBoxService, private historyLogService: HistoryLogService,
                private utilService: UtilService, private downloadDownloaderService: DownloadDownloaderService,
                public sortService: CartService, private loadingDisplayService: LoadingDisplayService) {
    }

    ngOnInit() {


        // Get the currently logged in user.
        this.currentUser = this.apiServerService.getCurrentUser();

        // Get the currently selected menu item
        this.currentMenuItem = this.menuService.getCurrentItem();

        // Updates the Login button text and userIsLoggedIn.
        this.updateUser();

        // Lock the menu when popups are visible
        this.menuService.menuLockEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.menuLock = <boolean>data;
            }
        );

        this.downloadDownloaderService.doDownloadEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.loadingDisplayService.setLoading( true, 'Processing Cart Data...' );
                if (data === DownloadTools.SEARCH_QUERY) {
                    this.downloadQueryAsManifestRestrictionCheck();
                }
                if (data === DownloadTools.TEXT_QUERY) {
                    this.downloadTextQueryAsManifestRestrictionCheck();
                }
            });

        this.apiServerService.simpleSearchQueryHoldEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                if ((!this.utilService.isNullOrUndefined(data)) && (!this.utilService.isEmpty(data))) {
                    this.haveSimpleSearchQuery = true;
                } else {
                    this.haveSimpleSearchQuery = false;
                }
                this.checkShareEnabled();
            });

        this.apiServerService.textSearchQueryHoldEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                if ((!this.utilService.isNullOrUndefined(data)) && (!this.utilService.isEmpty(data))) {
                    this.haveTextSearchQuery = true;
                } else {
                    this.haveTextSearchQuery = false;
                }
                this.checkShareEnabled();
            });


        // We need this for, when the menu selection is changed programmatically elsewhere
        this.menuService.currentMenuItemEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.currentMenuItem = <MenuItems>data;
            }
        );


        // Lock the menu when popups are visible
        this.menuService.menuLockEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.menuLock = <boolean>data;
            }
        );

        // When the (logged in) user changes.
        this.apiServerService.userSetEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.updateUser();
                this.currentUser = data;
                this.currentMenuItem = this.menuService.getCurrentItem();
            }
        );

        // Receive the Cart contents count, and the total size of all its files.
        // When user clicks a cart button in the Search Results or Cart page.
        this.cartService.cartCountEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.cartCount = <any>data['count'];
                this.cartTotalFileSize = <any>data['fileSize'];
                this.cartTotalFileSizeWithDisabled = <any>data['fullFileSize'];
                this.checkShareEnabled();
            }
        );

        // If an alert box is up some things will need to be disabled.
        this.alertBoxService.alertBoxEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.disabled = true;
            }
        );


        // When the alert box has closed (and returned results) store the results, and enable the menu.
        this.alertBoxService.alertBoxReturnEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                if (data['id'] === this.alertId00) {
                    this.alertBoxResults = data['button'];
                }
                this.disabled = false;

            }
        );


        // Get the current user's role(s)
        this.apiServerService.currentUserRolesEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.currentUserRoles = data;
                this.showUserAdminButton = (this.currentUserRoles.indexOf('NCIA.ADMIN') > -1);

                this.showDataAdminButton = false;
                if (this.currentUserRoles.indexOf('NCIA.VIEW_SUBMISSION_REPORT') > -1) {
                    this.showDataAdminButton = true;
                    this.showDataAdminViewSubmissionReports = true;
                }
                if (this.currentUserRoles.indexOf('NCIA.SUPER_CURATOR') > -1) {
                    this.showDataAdminButton = true;
                    this.showDataAdminApproveDeletions = true;
                    this.showManageWorkflowItems = true;
                }
                if (this.currentUserRoles.indexOf('NCIA.ADMIN') > -1) {
                    this.showDataAdminButton = true;
                }
                if (this.currentUserRoles.indexOf('NCIA.DELETE_ADMIN') > -1) {
                    this.showDataAdminButton = true;
                    this.showPerformOnlineDeletions = true;
                }
                if (this.currentUserRoles.indexOf('NCIA.CURATE') > -1) {
                    this.showDataAdminButton = true;
                }
                if (this.currentUserRoles.indexOf('NCIA.MANAGE_VISIBILITY_STATUS') > -1) {
                    this.showDataAdminButton = true;
                    this.showDataAdminPerformQcButton = true;
                }
                if (this.currentUserRoles.indexOf('NCIA.MANAGE_COLLECTION_DESCRIPTION') > -1) {
                    this.showDataAdminButton = true;
                    this.showEditCollectionDescriptions = true;
                }
                if (this.currentUserRoles.indexOf('NCIA.MANAGE_COLLECTION_DESCRIPTION') > -1) {
                    this.initLicenseMenuOption();
                }

                /*              NCIA.VIEW_SUBMISSION_REPORT
                                NCIA.SUPER_CURATOR
                                NCIA.ADMIN
                                NCIA.DELETE_ADMIN
                                NCIA.MANAGE_COLLECTION_DESCRIPTION
                                NCIA.CURATE
                                NCIA.MANAGE_VISIBILITY_STATUS
                                NCIA.READ
                 */
            }
        );
    }

    /**
     * We can't check  Properties.NO_LICENSE until we know the configuration file is completely parsed.
     */
    async initLicenseMenuOption() {
        // Check for config file which will take precedence
        let runaway = 100; // Just in case.
        while ((!Properties.CONFIG_COMPLETE) && (runaway > 0)) {
            await this.commonService.sleep(Consts.waitTime);  // Wait 50ms
            runaway--;
        }
        if (!Properties.NO_LICENSE) {
            this.showDataAdminButton = true;
            this.showEditLicense = true;
        }
    }

    checkShareEnabled() {
        if (this.haveSimpleSearchQuery || this.haveTextSearchQuery || this.cartCount > 0) {
            this.shareDisabled = false;
        } else {
            this.shareDisabled = true;
        }
    }

    /**
     * Called when one of the menu buttons are clicked.
     *
     * @param menuChoice
     */
    async onMenuItemClick(menuChoice) {
        if (this.menuLock) {
            return;
        }
        switch (menuChoice) {

            // ------------ User Admin ------------
            case this.menuItem.USER_ADMIN_MENU_ITEM:
                const url = Properties.API_SERVER_URL + '/nbia-uat/index.html';
                var accessToken = this.apiServerService.showToken();
            
                try {
                    // Store the token in localStorage
                    localStorage.setItem('accessToken', accessToken);
                    
                    // Open the new window
                    const newWindow = window.open(url);
                } catch (error) {
                    console.error('There has been a problem with your fetch operation:', error);
                }


                break;

            // Perform QC
            case this.menuItem.DATA_ADMIN_PERFORM_QC_MENU_ITEM:
                const url_perform_qc = Properties.API_SERVER_URL + '/nbia-admin/?tool=' + Consts.TOOL_PERFORM_QC;
            
                try {
                    // Store the token in localStorage
                    var tokenStorage = this.apiServerService.showToken() + ':' + this.apiServerService.showRefreshToken() + ':' + this.apiServerService.showTokenLifeSpan()
                    localStorage.setItem('accessToken', tokenStorage);
                    
                    // Open the new window
                    const newWindow = window.open(url_perform_qc);
                } catch (error) {
                    console.error('There has been a problem with your fetch operation:', error);
                }


                break;

            // Approve Deletions
            case this.menuItem.DATA_ADMIN_APPROVE_DELETIONS_MENU_ITEM:
                const url_approve_deletion = Properties.API_SERVER_URL + '/nbia-admin/?tool=' + Consts.TOOL_APPROVE_DELETIONS;
            
                try {
                    // Store the token in localStorage
                    var tokenStorage = this.apiServerService.showToken() + ':' + this.apiServerService.showRefreshToken() + ':' + this.apiServerService.showTokenLifeSpan()
                    localStorage.setItem('accessToken', tokenStorage);
                    
                    // Open the new window
                    const newWindow = window.open(url_approve_deletion);
                } catch (error) {
                    console.error('There has been a problem with your fetch operation:', error);
                }

                break;

            // View Submission reports
            case this.menuItem.DATA_ADMIN_VIEW_SUBMISSION_REPORTS_MENU_ITEM:
                const url_view_submission = Properties.API_SERVER_URL + '/nbia-admin/?tool=' + Consts.TOOL_VIEW_SUBMISSION_REPORTS;
            
                try {
                    // Store the token in localStorage
                    var tokenStorage = this.apiServerService.showToken() + ':' + this.apiServerService.showRefreshToken() + ':' + this.apiServerService.showTokenLifeSpan()
                    localStorage.setItem('accessToken', tokenStorage);
                    
                    // Open the new window
                    const newWindow = window.open(url_view_submission);
                } catch (error) {
                    console.error('There has been a problem with your fetch operation:', error);
                }

                break;


            // Perform online deletion
            case this.menuItem.DATA_ADMIN_PERFORM_ONLINE_DELETION_MENU_ITEM:
                const url_perform_delete = Properties.API_SERVER_URL + '/nbia-admin/?tool=' + Consts.TOOL_PERFORM_ONLINE_DELETION;
            
                try {
                    // Store the token in localStorage
                    var tokenStorage = this.apiServerService.showToken() + ':' + this.apiServerService.showRefreshToken() + ':' + this.apiServerService.showTokenLifeSpan()
                    localStorage.setItem('accessToken', tokenStorage);
                    
                    // Open the new window
                    const newWindow = window.open(url_perform_delete);
                } catch (error) {
                    console.error('There has been a problem with your fetch operation:', error);
                }

                break;


            // Edit collection descriptions
            case this.menuItem.DATA_ADMIN_EDIT_COLLECTION_DESCRIPTIONS_MENU_ITEM:
                const url_edit_collections_description= Properties.API_SERVER_URL + '/nbia-admin/?tool=' + Consts.TOOL_EDIT_COLLECTION_DESCRIPTIONS;
            
                try {
                    // Store the token in localStorage
                    var tokenStorage = this.apiServerService.showToken() + ':' + this.apiServerService.showRefreshToken() + ':' + this.apiServerService.showTokenLifeSpan()
                    localStorage.setItem('accessToken', tokenStorage);
                    
                    // Open the new window
                    const newWindow = window.open(url_edit_collections_description);
                } catch (error) {
                    console.error('There has been a problem with your fetch operation:', error);
                }

                break;

            // Edit licence
            case this.menuItem.DATA_ADMIN_EDIT_LICENSE_ITEMS_MENU_ITEM:
                const url_edit_license = Properties.API_SERVER_URL + '/nbia-admin/?tool=' + Consts.TOOL_EDIT_LICENSE;
            
                try {
                    // Store the token in localStorage
                    var tokenStorage = this.apiServerService.showToken() + ':' + this.apiServerService.showRefreshToken() + ':' + this.apiServerService.showTokenLifeSpan()
                    localStorage.setItem('accessToken', tokenStorage);
                    
                    // Open the new window
                    const newWindow = window.open(url_edit_license);
                } catch (error) {
                    console.error('There has been a problem with your fetch operation:', error);
                }

                break;

            // Edit Site License descriptions
            case this.menuItem.DATA_ADMIN_EDIT_SITE_LICENSE_ITEMS_MENU_ITEM:
                const url_edit_site_license = Properties.API_SERVER_URL + '/nbia-admin/?tool=' + Consts.TOOL_EDIT_SITE_LICENSE;
            
                try {
                    // Store the token in localStorage
                    var tokenStorage = this.apiServerService.showToken() + ':' + this.apiServerService.showRefreshToken() + ':' + this.apiServerService.showTokenLifeSpan()
                    localStorage.setItem('accessToken', tokenStorage);
                    
                    // Open the new window
                    const newWindow = window.open(url_edit_site_license);
                } catch (error) {
                    console.error('There has been a problem with your fetch operation:', error);
                }

                break;

            // Manage Workflow Items
            case this.menuItem.DATA_ADMIN_MANAGE_WORKFLOW_ITEMS_MENU_ITEM:
                const url_workflow = Properties.API_SERVER_URL + '/nbia-admin/?tool=' + Consts.TOOL_MANAGE_WORKFLOW_ITEMS;
            
                try {
                    // Store the token in localStorage
                    var tokenStorage = this.apiServerService.showToken() + ':' + this.apiServerService.showRefreshToken() + ':' + this.apiServerService.showTokenLifeSpan()
                    localStorage.setItem('accessToken', tokenStorage);
                    
                    // Open the new window
                    const newWindow = window.open(url_workflow);
                } catch (error) {
                    console.error('There has been a problem with your fetch operation:', error);
                }

                break;
            // ------------- Search -------------
            case this.menuItem.IMAGE_SEARCH_MENU_ITEM:
                if ((this.menuService.getCurrentItem() !== this.menuItem.IMAGE_SEARCH_MENU_ITEM) && (!this.disabled)) {
                    this.menuService.setCurrentItem(menuChoice);
                }
                break;


            // ------------- Login -------------
            case this.menuItem.LOGIN_MENU_ITEM:
                // Warn user that they will lose their cart, and give them the option of canceling.
                if (this.cartService.cartGetCount() > 0) {
                    let text = [];
                    text.push('You have ' + this.cartService.cartGetCount() + ' Series in your cart.');
                    text.push('All Series in your cart will be lost.');
                    text.push(' ');
                    text.push('Are you sure you wish to continue?');
                    this.alertBoxResults = null;
                    this.alertBoxService.alertBoxDisplay(this.alertId00,
                        AlertBoxType.ERROR,
                        'Cart contents will be lost!',
                        text,
                        AlertBoxButtonType.CONTINUE | AlertBoxButtonType.CANCEL,
                        350
                    );
                    // Wait here for alertBoxResults.
                    while (this.utilService.isNullOrUndefined(this.alertBoxResults)) {
                        await this.commonService.sleep(Consts.waitTime);
                    }

                    if (this.alertBoxResults === AlertBoxButtonType.CANCEL) {
                        return;
                    }
                }

                // Only switch to the Login screen if the default user is logged in.
                if (this.menuService.getCurrentItem() !== this.menuItem.LOGIN_MENU_ITEM) {

                    //reset userLogged in status
                    const isUserLoggedIn = this.commonService.getUserLoggedInStatus();
                    if (isUserLoggedIn) {
                        this.commonService.setUserLoggedInStatus(false);
                    }

                    // Clear the search criteria on the left when users login or out
                    this.commonService.resetAllSimpleSearch();

                    if (this.currentUser === Properties.DEFAULT_USER) {
                        this.menuService.setCurrentItem(menuChoice);
                    } else {
                        this.apiServerService.logOutCurrentUser();
                        localStorage.removeItem('accessToken')
                    }
                }
                break;


            // ------------- Cart -------------
            case this.menuItem.CART_MENU_ITEM:
                // If Cart is empty, or we are already in the cart, don't do anything
                if ((this.menuService.getCurrentItem() !== this.menuItem.CART_MENU_ITEM) && (this.cartCount > 0) && (!this.disabled)) {
                    this.menuService.setCurrentItem(menuChoice);
                }
                break;


            // ------------- Download (The old one @TODO remove when we can)-------------
            case this.menuItem.DOWNLOAD_MENU_ITEM:
                // Don't set the current menu item to this, it's more of a button than a selectable tab.
                if ((this.cartCount > 0) && (!this.disabled)) {
                    this.downloadCart();
                }
                break;


            // ------------- Download -------------
            case this.menuItem.DOWNLOAD_CART_MENU_ITEM:
                if (this.cartCount > 0) {
                    this.downloadCart();
                }
                break;


            // ------------- Download Query (as manifest)-------------
            case this.menuItem.DOWNLOAD_QUERY_MENU_ITEM:
                // Get the current state of persistenceService.Field.SHOW_DOWNLOADER_DOWNLOAD
                try {
                    this.showDownloaderDownload = JSON.parse(this.persistenceService.get(this.persistenceService.Field.SHOW_DOWNLOADER_DOWNLOAD));
                } catch (e) {
                }
                if (this.utilService.isNullOrUndefined(this.showDownloaderDownload)) {
                    // If it is not persisted, set it to true
                    this.showDownloaderDownload = true;
                }

                if (this.showDownloaderDownload) {
                    if (this.haveTextSearchQuery) {
                        this.commonService.downloaderDownLoadButton(DownloadTools.TEXT_QUERY);
                    } else if (!this.haveTextSearchQuery) {
                        this.commonService.downloaderDownLoadButton(DownloadTools.SEARCH_QUERY);
                    }
                } else {

                    this.loadingDisplayService.setLoading(true, 'Downloading manifest...');

                    if (this.haveTextSearchQuery) {
                        // For text search
                        this.downloadTextQueryAsManifestRestrictionCheck();
                    } else {
                        // For simple search
                        this.downloadQueryAsManifestRestrictionCheck();
                    }

                    this.loadingDisplayService.setLoading(false);
                }

                /*
                                if( this.haveTextSearchQuery ){
                                    console.log('MHL DOWNLOAD_QUERY_MENU_ITEM haveTextSearchQuery');
                                    // For text search
                                    this.downloadTextQueryAsManifestRestrictionCheck()
                                }else{
                                    console.log('MHL DOWNLOAD_QUERY_MENU_ITEM NOT haveTextSearchQuery');
                                    // For simple search
                                    this.downloadQueryAsManifestRestrictionCheck();
                                }
                */
                break;


            // ------------- Save Cart as Shared List -------------
            // --- This is commented out in the HTML
            case this.menuItem.SAVE_SHARED_LIST_CART_MENU_ITEM:
                // Don't set the current menu item to this, it is a dropdown not a selectable tab.
                if (this.cartCount > 0) {
                    this.commonService.sharedListSavePopupButton(this.menuItem.SAVE_SHARED_LIST_CART_MENU_ITEM);
                }
                break;

            // ------------- Save my Cart (as Shared List with random name) -------------
            case this.menuItem.SAVE_CART_MENU_ITEM:
                // Don't set the current menu item to this, it is a dropdown not a selectable tab.
                if (this.cartCount > 0) {
                    this.commonService.saveMyCartPopupButton();
                }
                break;



            // ------------- Save shared List form a list of Subject IDs -------------
            // (we don't do this yet)
            case this.menuItem.SAVE_SHARED_LIST_SUBJECT_ID_INPUT_MENU_ITEM:
                break;


            // ------------- Display URL for this query -------------
            case this.menuItem.DISPLAY_QUERY_URL:
                this.commonService.showQueryUrlToggle();
                break;

            // ------------- Go to Help URL -------------
            case this.menuItem.HELP_MENU_ITEM_SITE:
                this.apiServerService.log(this.historyLogService.doLog(Consts.HELP_SITE_LOG_TEXT, this.apiServerService.getCurrentUser(), ''));

                this.openInNewTab(Properties.HELP_SITE);
                break;

            case this.menuItem.HELP_MENU_ITEM_TALK_TO_HUMAN:
                this.openInNewTab(Properties.HELP_SITE_HUMAN);
                break;

            case this.menuItem.HELP_MENU_SHOW_INTRO:
                this.commonService.showIntro();
                break;


        }
    }


    downloadQueryAsManifestRestrictionCheck() {
        // Check for restrictions
        this.apiServerService.doPost(Consts.API_MANIFEST_RESTRICTIONS_FROM_SEARCH_RESULTS, this.commonService.getDownloadManifestQuery(), this.apiServerService.showToken()).subscribe(
            (restrictionData: any) => {

                // No restrictions, download the manifest
                if (restrictionData.toUpperCase() === 'NO') {
                    this.downloadQueryAsManifest();
                } else {
                    // Has restrictions, ask user to confirm or cancel
                    if (confirm('Your download includes data with commercial use restrictions.\nThere is a filter available to exclude restricted series.') === true) {
                        this.downloadQueryAsManifest();
                    } else {
                        console.log('User has canceled download');
                    }
                }
            },
            (error) => {
                console.error('downloadQueryAsManifestRestrictionCheck: ', error);
            });
    }

    downloadTextQueryAsManifestRestrictionCheck() {
        // Check for restrictions
        this.apiServerService.doPost(Consts.API_MANIFEST_RESTRICTIONS_FROM_TEXT_SEARCH_RESULTS, this.apiServerService.getTextSearchQueryHold(), this.apiServerService.showToken()).subscribe(
            (restrictionData: any) => {
                // No restrictions, download the manifest
                if (restrictionData.toUpperCase() === 'NO') {
                    this.downloadTextQueryAsManifest();
                } else {
                    if (confirm('Your download includes data with commercial use restrictions.\nThere is a filter available to exclude restricted series.') === true) {
                        this.downloadTextQueryAsManifest();
                    } else {
                        console.log('User has canceled download');
                    }
                }
            },
            (error) => {
                console.error('downloadTextQueryAsManifestRestrictionCheck: ', error);
            });
    }


    downloadQueryAsManifest() {
        this.apiServerService.doPost(Consts.API_MANIFEST_FROM_SEARCH_RESULTS, this.commonService.getDownloadManifestQuery(), this.apiServerService.showToken()).subscribe(
            (manifestData: any) => {
                let databasketId = manifestData.match(/databasketId=(.*)/);
                if (databasketId[1] == null) {
                    console.error('Error can not get databasketId from manifest data.');
                }

                let cartManifestFile = new Blob([manifestData], {type: 'application/x-nbia-manifest-file'});

                // TODO in the manifest download popup, it says 'from: blob:'  see if we can change this.
                let objectUrl = (<any>window).URL.createObjectURL(cartManifestFile);
                let a = (<any>window).document.createElement('a');
                a.href = objectUrl;
                a.download = databasketId[1]; // This is the file name
                (<any>window).document.body.appendChild(a);
                a.click();
                (<any>window).document.body.removeChild(a);
                this.loadingDisplayService.setLoading( false );
            },
            (err) => {
                console.error('ERROR downloadQueryAsManifest: ', err);
                this.loadingDisplayService.setLoading( false );
            });
    }


    downloadTextQueryAsManifest() {
        this.apiServerService.doPost(Consts.API_MANIFEST_FROM_TEXT_SEARCH_RESULTS, 'textValue=' + this.apiServerService.getTextSearchQueryHold(), this.apiServerService.showToken()).subscribe(
            (manifestData: any) => {
                let databasketId = manifestData.match(/databasketId=(.*)/);
                if (databasketId[1] == null) {
                    console.error('Error can not get databasketId from manifest data.');
                }

                let cartManifestFile = new Blob([manifestData], {type: 'application/x-nbia-manifest-file'});

                // TODO in the manifest download popup, it says 'from: blob:'  see if we can change this.
                let objectUrl = (<any>window).URL.createObjectURL(cartManifestFile);
                let a = (<any>window).document.createElement('a');
                a.href = objectUrl;

                a.download = databasketId[1];
                (<any>window).document.body.appendChild(a);
                a.click();
                (<any>window).document.body.removeChild(a);
                this.loadingDisplayService.setLoading( false );
            },
            (err) => {
                console.error('ERROR manifest from text search download: ', err);
                this.loadingDisplayService.setLoading( false );
            });
    }

    downloadCart() {
        // Get the current state of persistenceService.Field.SHOW_DOWNLOADER_DOWNLOAD
        try {
            this.showDownloaderDownload = JSON.parse(this.persistenceService.get(this.persistenceService.Field.SHOW_DOWNLOADER_DOWNLOAD));
        } catch (e) {
        }
        if (this.utilService.isNullOrUndefined(this.showDownloaderDownload)) {
            // If it is not persisted, set it to true
            this.showDownloaderDownload = true;
        }

        // Just launch the cart download.
        if (!this.showDownloaderDownload) {
            this.commonService.cartListDownLoadButton(DownloadTools.CART);
        } else {
            // Launch the popup with the TCIA downloader link.
            this.commonService.downloaderDownLoadButton(DownloadTools.CART);
        }
    }


    /**
     * This maintains the "Is the mouse pointer over the menu button" state. This isn't used yet.<br>
     * I was thinking in the future, to add real time one line context help to a footer or other status type display.
     */
    onMouseOver(n) {
        this.menuMouseOver[n] = true;
        console.log('MHL onMouseOver');
    }

    /**
     * This maintains the "Is the mouse pointer over the menu button" state. This isn't used yet.<br>
     * I was thinking in the future, to add real time one line context help to a footer or other status type display.
     */
    onMouseOut(n) {
        this.menuMouseOver[n] = false;
    }


    /**
     * Sets the Login/Logout button text.<br>
     * If the user is Properties.DEFAULT_USER, the button just says "Login".<br>
     * If a regular user is logged in, then the button says "Logout - <user name>".
     */
    updateUser() {
        if (this.apiServerService.getCurrentUser() === Properties.DEFAULT_USER) {
            this.loginButtonText = 'Login';
            this.userIsLoggedIn = false;
        } else {
            this.loginButtonText = 'Logout - ' + this.apiServerService.getCurrentUser();
            this.userIsLoggedIn = true;
        }
    }

    openInNewTab(url) {
        let win = window.open(url, '_blank');
        win.focus();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }


}
