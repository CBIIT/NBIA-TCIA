import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertBoxButtonType, AlertBoxType } from '@app/common/components/alert-box/alert-box-consts';
import { Consts, MenuItems } from '@app/consts';
import { Properties } from '@assets/properties';
import { MenuService } from '@app/common/services/menu.service';
import { CartService } from '@app/common/services/cart.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { CommonService } from '@app/image-search/services/common.service';
import { PersistenceService } from '@app/common/services/persistence.service';
import { AlertBoxService } from '@app/common/components/alert-box/alert-box.service';
import { HistoryLogService } from '@app/common/services/history-log.service';
import { UtilService } from '@app/common/services/util.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-application-menu',
    templateUrl: './application-menu.component.html',
    styleUrls: ['./application-menu.component.scss']
} )
export class ApplicationMenuComponent implements OnInit, OnDestroy{


    /**
     * If menu lock is true, and a click event calls this.onMenuItemClick it will immediately return.
     * menuLock is set by this.menuService.menuLockEmitter.subscribe
     * @type {boolean}
     */
    menuLock = false;

    /**
     * Used to determine if the Cart button should be enabled ( >0 ), and to show a count at the right side of the Cart button.
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


    constructor( private menuService: MenuService, private cartService: CartService,
                 private apiServerService: ApiServerService,
                 private commonService: CommonService, private persistenceService: PersistenceService,
                 private alertBoxService: AlertBoxService, private historyLogService: HistoryLogService,
                 private utilService: UtilService ) {
    }

    ngOnInit() {


        // Get the currently logged in user.
        this.currentUser = this.apiServerService.getCurrentUser();

        // Get the currently selected menu item
        this.currentMenuItem = this.menuService.getCurrentItem();

        // Updates the Login button text and userIsLoggedIn.
        this.updateUser();

        // Lock the menu when popups are visible
        this.menuService.menuLockEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.menuLock = <boolean>data;
            }
        );

        this.apiServerService.simpleSearchQueryHoldEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                if( (!this.utilService.isNullOrUndefined( data )) && (!this.utilService.isEmpty( data )) ){
                    this.haveSimpleSearchQuery = true;
                }else{
                    this.haveSimpleSearchQuery = false;
                }
                this.checkShareEnabled();
            } );

        this.apiServerService.textSearchQueryHoldEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                if( (!this.utilService.isNullOrUndefined( data )) && (!this.utilService.isEmpty( data )) ){
                    this.haveTextSearchQuery = true;
                }else{
                    this.haveTextSearchQuery = false;
                }
                this.checkShareEnabled();
            } );


        // We need this for, when the menu selection is changed programmatically elsewhere
        this.menuService.currentMenuItemEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.currentMenuItem = <MenuItems>data;
            }
        );


        // When the (logged in) user changes.
        this.apiServerService.userSetEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.updateUser();
                this.currentUser = data;
                this.currentMenuItem = this.menuService.getCurrentItem();
            }
        );

        // Receive the Cart contents count, and the total size of all its files.
        // When user clicks a cart button in the Search Results or Cart page.
        this.cartService.cartCountEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.cartCount = <any>data['count'];
                this.cartTotalFileSize = <any>data['fileSize'];
                this.cartTotalFileSizeWithDisabled = <any>data['fullFileSize'];
                this.checkShareEnabled();
            }
        );

        // If an alert box is up some things will need to be disabled.
        this.alertBoxService.alertBoxEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.disabled = true;
            }
        );


        // When the alert box has closed (and returned results) store the results, and enable the menu.
        this.alertBoxService.alertBoxReturnEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                if( data['id'] === this.alertId00 ){
                    this.alertBoxResults = data['button'];
                }
                this.disabled = false;

            }
        );


        // Get the current user's role(s)
        this.apiServerService.currentUserRolesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.currentUserRoles = data;
                this.showUserAdminButton = (this.currentUserRoles.indexOf( 'NCIA.ADMIN' ) > -1);

                this.showDataAdminButton = false;
                if( this.currentUserRoles.indexOf( 'NCIA.VIEW_SUBMISSION_REPORT' ) > -1 ){
                    this.showDataAdminButton = true;
                    this.showDataAdminViewSubmissionReports = true;
                }
                if( this.currentUserRoles.indexOf( 'NCIA.SUPER_CURATOR' ) > -1 ){
                    this.showDataAdminButton = true;
                    this.showDataAdminApproveDeletions = true;
                    this.showManageWorkflowItems = true;
                }
                if( this.currentUserRoles.indexOf( 'NCIA.ADMIN' ) > -1 ){
                    this.showDataAdminButton = true;
                }
                if( this.currentUserRoles.indexOf( 'NCIA.DELETE_ADMIN' ) > -1 ){
                    this.showDataAdminButton = true;
                    this.showPerformOnlineDeletions = true;
                }
                if( this.currentUserRoles.indexOf( 'NCIA.CURATE' ) > -1 ){
                    this.showDataAdminButton = true;
                }
                if( this.currentUserRoles.indexOf( 'NCIA.MANAGE_VISIBILITY_STATUS' ) > -1 ){
                    this.showDataAdminButton = true;
                    this.showDataAdminPerformQcButton = true;
                }
                if( this.currentUserRoles.indexOf( 'NCIA.MANAGE_COLLECTION_DESCRIPTION' ) > -1 ){
                    this.showDataAdminButton = true;
                    this.showEditCollectionDescriptions = true;
                }
                if( this.currentUserRoles.indexOf( 'NCIA.MANAGE_COLLECTION_DESCRIPTION' ) > -1 ){
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
        while( (!Properties.CONFIG_COMPLETE) && (runaway > 0) ){
            await this.commonService.sleep( Consts.waitTime );  // Wait 50ms
            runaway--;
        }
        if( ! Properties.NO_LICENSE ){
            this.showDataAdminButton = true;
            this.showEditLicense = true;
        }
    }

    checkShareEnabled() {
        if( this.haveSimpleSearchQuery || this.haveTextSearchQuery || this.cartCount > 0 ){
            this.shareDisabled = false;
        }else{
            this.shareDisabled = true;
        }
    }

    /**
     * Called when one of the menu buttons are clicked.
     *
     * @param menuChoice
     */
    async onMenuItemClick( menuChoice ) {
        if( this.menuLock ){
            return;
        }
        switch( menuChoice ){

            // ------------ User Admin ------------
            case this.menuItem.USER_ADMIN_MENU_ITEM:
                window.open( Properties.API_SERVER_URL +
                    '/nbia-uat/index.html?accessToken=' + this.apiServerService.showToken(),
                    '_blank' );

                break;

            // Perform QC
            case this.menuItem.DATA_ADMIN_PERFORM_QC_MENU_ITEM:
                window.open( Properties.API_SERVER_URL +
                    '/nbia-admin/?tool=' + Consts.TOOL_PERFORM_QC + '&accessToken=' + this.apiServerService.showToken() + ':' + this.apiServerService.showRefreshToken() + ':' + this.apiServerService.showTokenLifeSpan(),
                    '_blank' );

                break;

            // Approve Deletions
            case this.menuItem.DATA_ADMIN_APPROVE_DELETIONS_MENU_ITEM:
                window.open( Properties.API_SERVER_URL +
                    '/nbia-admin/?tool=' + Consts.TOOL_APPROVE_DELETIONS + '&accessToken=' + this.apiServerService.showToken() + ':' + this.apiServerService.showRefreshToken() + ':' + this.apiServerService.showTokenLifeSpan(),
                    '_blank' );

                break;

            // View Submission reports
            case this.menuItem.DATA_ADMIN_VIEW_SUBMISSION_REPORTS_MENU_ITEM:
                window.open( Properties.API_SERVER_URL +
                    '/nbia-admin/?tool=' + Consts.TOOL_VIEW_SUBMISSION_REPORTS + '&accessToken=' + this.apiServerService.showToken() + ':' + this.apiServerService.showRefreshToken() + ':' + this.apiServerService.showTokenLifeSpan(),
                    '_blank' );

                break;


            // Perform online deletion
            case this.menuItem.DATA_ADMIN_PERFORM_ONLINE_DELETION_MENU_ITEM:
                window.open( Properties.API_SERVER_URL +
                    '/nbia-admin/?tool=' + Consts.TOOL_PERFORM_ONLINE_DELETION + '&accessToken=' + this.apiServerService.showToken() + ':' + this.apiServerService.showRefreshToken() + ':' + this.apiServerService.showTokenLifeSpan(),
                    '_blank' );

                break;


            // Edit collection descriptions
            case this.menuItem.DATA_ADMIN_EDIT_COLLECTION_DESCRIPTIONS_MENU_ITEM:
                window.open( Properties.API_SERVER_URL +
                    '/nbia-admin/?tool=' + Consts.TOOL_EDIT_COLLECTION_DESCRIPTIONS + '&accessToken=' + this.apiServerService.showToken() + ':' + this.apiServerService.showRefreshToken() + ':' + this.apiServerService.showTokenLifeSpan(),
                    '_blank' );

                break;

            // Edit collection descriptions
            case this.menuItem.DATA_ADMIN_EDIT_LICENSE_ITEMS_MENU_ITEM:
                window.open( Properties.API_SERVER_URL +
                    '/nbia-admin/?tool=' + Consts.TOOL_EDIT_LICENSE + '&accessToken=' + this.apiServerService.showToken() + ':' + this.apiServerService.showRefreshToken() + ':' + this.apiServerService.showTokenLifeSpan(),
                    '_blank' );

                break;

            // Manage Workflow Items
            case this.menuItem.DATA_ADMIN_MANAGE_WORKFLOW_ITEMS_MENU_ITEM:
                window.open( Properties.API_SERVER_URL +
                    '/nbia-admin/?tool=' + Consts.TOOL_MANAGE_WORKFLOW_ITEMS + '&accessToken=' + this.apiServerService.showToken() + ':' + this.apiServerService.showRefreshToken() + ':' + this.apiServerService.showTokenLifeSpan(),
                    '_blank' );

                break;
            // ------------- Search -------------
            case this.menuItem.IMAGE_SEARCH_MENU_ITEM:
                if( (this.menuService.getCurrentItem() !== this.menuItem.IMAGE_SEARCH_MENU_ITEM) && (!this.disabled) ){
                    this.menuService.setCurrentItem( menuChoice );
                }
                break;


            // ------------- Login -------------
            case this.menuItem.LOGIN_MENU_ITEM:
                // Warn user that they will lose their cart, and give them the option of canceling.
                if( this.cartService.cartGetCount() > 0 ){
                    let text = [];
                    text.push( 'You have ' + this.cartService.cartGetCount() + ' Series in your cart.' );
                    text.push( 'All Series in your cart will be lost.' );
                    text.push( ' ' );
                    text.push( 'Are you sure you wish to continue?' );
                    this.alertBoxResults = null;
                    this.alertBoxService.alertBoxDisplay( this.alertId00,
                        AlertBoxType.ERROR,
                        'Cart contents will be lost!',
                        text,
                        AlertBoxButtonType.CONTINUE | AlertBoxButtonType.CANCEL,
                        350
                    );
                    // Wait here for alertBoxResults.
                    while( this.utilService.isNullOrUndefined( this.alertBoxResults ) ){
                        await this.commonService.sleep( Consts.waitTime );
                    }

                    if( this.alertBoxResults === AlertBoxButtonType.CANCEL ){
                        return;
                    }
                }

                // Only switch to the Login screen if the default user is logged in.
                if( this.menuService.getCurrentItem() !== this.menuItem.LOGIN_MENU_ITEM ){

                    if( this.currentUser === Properties.DEFAULT_USER ){
                        this.menuService.setCurrentItem( menuChoice );
                    }else{
                        this.apiServerService.logOutCurrentUser();
                    }
                }
                break;


            // ------------- Cart -------------
            case this.menuItem.CART_MENU_ITEM:
                // If Cart is empty or we are already in the cart, don't do anything
                if( (this.menuService.getCurrentItem() !== this.menuItem.CART_MENU_ITEM) && (this.cartCount > 0) && (!this.disabled) ){
                    this.menuService.setCurrentItem( menuChoice );
                }
                break;


            // ------------- Download -------------
            case this.menuItem.DOWNLOAD_MENU_ITEM:
                // Don't set the current menu item to this, it's more of a button than a selectable tab.
                if( (this.cartCount > 0) && (!this.disabled) ){
                    this.downloadCart();
                }
                break;


            // ------------- Save Cart as Shared List -------------
            // --- This is commented out in the HTML
            case this.menuItem.SAVE_SHARED_LIST_CART_MENU_ITEM:
                // Don't set the current menu item to this, it is a dropdown not a selectable tab.
                if( this.cartCount > 0 ){
                    this.commonService.sharedListSavePopupButton( this.menuItem.SAVE_SHARED_LIST_CART_MENU_ITEM );
                }
                break;

            // ------------- Save my Cart (as Shared List with random name) -------------
            case this.menuItem.SAVE_CART_MENU_ITEM:
                // Don't set the current menu item to this, it is a dropdown not a selectable tab.
                if( this.cartCount > 0 ){
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
                this.apiServerService.log( this.historyLogService.doLog( Consts.HELP_SITE_LOG_TEXT, this.apiServerService.getCurrentUser(), '' ) );

                this.openInNewTab( Properties.HELP_SITE );
                break;

            case this.menuItem.HELP_MENU_ITEM_TALK_TO_HUMAN:
                this.openInNewTab( Properties.HELP_SITE_HUMAN );
                break;

            case this.menuItem.HELP_MENU_SHOW_INTRO:
                this.commonService.showIntro();
                break;


        }
    }


    downloadCart() {
        // Get the current state of persistenceService.Field.SHOW_DOWNLOADER_DOWNLOAD
        try{
            this.showDownloaderDownload = JSON.parse( this.persistenceService.get( this.persistenceService.Field.SHOW_DOWNLOADER_DOWNLOAD ) );
        }catch( e ){
        }
        if( this.utilService.isNullOrUndefined( this.showDownloaderDownload ) ){
            // If it is not persisted, set it to true
            this.showDownloaderDownload = true;
        }

        // Just launch the cart download.
        if( !this.showDownloaderDownload ){
            this.commonService.cartListDownLoadButton();
        }else{
            // Launch the popup with the TCIA downloader link.
            this.commonService.downloaderDownLoadButton();
        }
    }


    /**
     * This maintains the "Is the mouse pointer over the menu button" state. This isn't used yet.<br>
     * I was thinking in the future, to add real time one line context help to a footer or other status type display.
     */
    onMouseOver( n ) {
        this.menuMouseOver[n] = true;
    }

    /**
     * This maintains the "Is the mouse pointer over the menu button" state. This isn't used yet.<br>
     * I was thinking in the future, to add real time one line context help to a footer or other status type display.
     */
    onMouseOut( n ) {
        this.menuMouseOver[n] = false;
    }


    /**
     * Sets the Login/Logout button text.<br>
     * If the user is Properties.DEFAULT_USER, the button just says "Login".<br>
     * If a regular user is logged in, then the button says "Logout - <user name>".
     */
    updateUser() {
        if( this.apiServerService.getCurrentUser() === Properties.DEFAULT_USER ){
            this.loginButtonText = 'Login';
            this.userIsLoggedIn = false;
        }else{
            this.loginButtonText = 'Logout - ' + this.apiServerService.getCurrentUser();
            this.userIsLoggedIn = true;
        }
    }

    openInNewTab( url ) {
        let win = window.open( url, '_blank' );
        win.focus();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }


}
