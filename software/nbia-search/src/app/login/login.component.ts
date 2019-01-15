import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ApiServerService } from '../image-search/services/api-server.service';
import { Properties } from '@assets/properties';
import { MenuService } from '../common/services/menu.service';
import { Consts, MenuItems } from '../consts';
import { CommonService } from '../image-search/services/common.service';
import { CartService } from '../common/services/cart.service';
import { NgForm } from '@angular/forms';
import { PersistenceService } from '@app/common/services/persistence.service';
import { ParameterService } from '@app/common/services/parameter.service';
import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { Subject } from 'rxjs';
import { UtilService } from '@app/common/services/util.service';

/*
 * Login

 If currently logged in as default user:
 Top menu button says “Login” no user name

 Login top Nav-bar button clicked:
 - Switch to Login screen
 - Both text inputs are cleared
 - User enters name & password, clicks “Login” button

 - Good Login:
 - - Login button at top changes “Logout”
 - - Users name appears somewhere at top
 - - Text fields are cleared
 - - Switch to Image Search screen

 - Bad Login:
 - - Display “Failed Login” message
 - - Remain (Quietly) logged in as Guest
 - - Password input is cleared
 - - When Password input gets focus (by mouse or tab key) “Failed Login” message clears.

 If currently logged in as a user (not Guest):
 - Top menu button says “Log out”
 - Current logged in user’s name appears somewhere at top

 “Log out” button is clicked:
 - Button changes to say “Login”
 - (Formerly) current user’s name is removed from top
 - (Quietly) logged in as Guest
 - Clear search result
 - Clear Query selections
 - Clear Text query
 - Clear Cart
 */

@Component( {
    selector: 'nbia-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
} )

export class LoginComponent implements OnInit, OnDestroy{
    @ViewChild( 'f' ) loginForm: NgForm;
    accessToken;
    username = '';
    statusMessage0 = '';
    currentMenuItem: MenuItems;

    holdFlag = true;

    properties = Properties;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private menuService: MenuService, private apiServerService: ApiServerService,
                 private commonService: CommonService, private cartService: CartService,
                 private persistenceService: PersistenceService, private parameterService: ParameterService,
                 private initMonitorService: InitMonitorService , private utilService: UtilService) {
        this.statusMessage0 = '';

    }

    ngOnInit() {

        // When the current user logs out, quietly log in the default user.
        this.apiServerService.logOutCurrentUserEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                this.loginAsDefaultUser( MenuItems.IMAGE_SEARCH_MENU_ITEM );
            }
        );

        // this.onLoginSelected() doesn't do anything yet, and currentMenuItem isn't used yet, so this subscribe doesn't accomplish anything yet.
        this.menuService.currentMenuItemEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {

                this.currentMenuItem = <MenuItems>data;
                if( this.currentMenuItem === MenuItems.LOGIN_MENU_ITEM ){
                    this.onLoginSelected();
                }
            }
        );
    }


    /**
     * Called when the user has just clicked on the Login menu item.
     * We can put any "Do this first" stuff here.
     *
     * @CHECKME we will probably not need this
     */
    onLoginSelected() {
        // console.log( 'onLoginSelected ' );
    }


    /**
     * When user clicks "Log in" or presses "Enter".
     */
    onSubmit() {
        this.apiServerService.setCurrentUser( this.loginForm.value.username );
        this.apiServerService.setCurrentPassword( this.loginForm.value.password );
        this.doLogin();
    }


    /**
     * Tries to get an access token from the server.<br>
     * If Successful:
     * <ul>
     *     <li>Clear Simple Search results</li>
     *     <li>Clear Text Search results  TODO</li>
     *     <li>Clear Query Builder results TODO</li>
     *     <li>Clear Cart contents</li>
     *     <li>Switch to Image Search</li>
     * </ul>
     * If <b>not</b> Successful:
     * <ul>
     *     <li>Display next to "Log in" button "Login failed: <error from the server>"</li>
     *     <li>Clear error message when Password input gets focus</li>
     *     <li>Quietly log in as default user</li>
     * </ul>
     */
    async doLogin() {

        // Log out current user.
        this.apiServerService.setLoggingOut( true );
        this.apiServerService.setSimpleSearchQueryHold( '' );

        this.commonService.emitSimpleSearchQueryForDisplay( [] );

        let logout = false;
        // Log out any logged in user.
        this.apiServerService.logOut().subscribe(
            data => {
                logout = true;
            },
            err => {
                logout = true;
            }
        );

        // Wait here while we log out the current access token if there is one.
        while( !logout ){
            await this.commonService.sleep( Consts.waitTime );
        }

        this.apiServerService.setToken( null );
        this.apiServerService.setLoggingOut( false );

        //  FIXME TEST delay await this.commonService.sleep( 1500 );

        // Try getting a new Access token
        this.apiServerService.getToken().subscribe(
            // Successful login
            ( res ) => {
                this.accessToken = res['access_token'];
                this.apiServerService.setToken( res );
                this.persistenceService.put( this.persistenceService.Field.USER, this.loginForm.value.username );

                // Rest charts
                this.commonService.reInitCharts();


                // Reload available search criteria, it can be different for each user.
                this.commonService.resetAllSimpleSearchForLogin();
                this.commonService.clearSimpleSearchResults();

                // For clearing all queries, search results, and resetting available Collections, Image Modality, etc, for a newly logged in user,
                // this.commonService.resetAllSimpleSearch();  // FIXME Make sure we don't need this

                // Clear the Text Search
                this.commonService.clearTextSearchUserInput();
                this.commonService.clearTextSearchResults();

                this.cartService.clearCart();

                // Update the Collection descriptions for the new user
                this.commonService.updateCollectionDescriptions();

                if( this.parameterService.haveUrlSimpleSearchParameters() ){

                    // TODO explain this
                    setTimeout( async() => {
                        while( this.initMonitorService.getAnyRunning() ){
                            await this.commonService.sleep( 10 );
                        }
                        this.parameterService.resetUrlQuery();
                    }, 10 );
                }


                // Set this so we do reload the URL shared list when a user logs in.
                if( this.parameterService.haveUrlSharedList() === this.parameterService.seen ){
                    this.parameterService.setHaveUrlSharedList( this.parameterService.yes );
                    // We need a small delay here.  TODO explain
                    setTimeout( () => {
                        this.menuService.setCurrentItem( MenuItems.CART_MENU_ITEM );
                    }, 500 );

                }


                // If there was no "saved-cart" in the URL go to the search page.
                else{
                    // We need a small delay here.  TODO explain
                    setTimeout( () => {
                        this.menuService.setCurrentItem( MenuItems.IMAGE_SEARCH_MENU_ITEM );
                    }, 500 );
                }

                // Clear the form
                this.loginForm.reset();

                this.apiServerService.gotToken();

            },

            // An error
            ( err ) => {
                this.apiServerService.gotToken();

                this.statusMessage0 = 'Login failed: ' + err.statusText;
                this.apiServerService.deleteToken();
                this.loginForm.controls['password'].setValue( '' );
                this.loginAsDefaultUser( MenuItems.LOGIN_MENU_ITEM );

            }
        );
    }


    /**
     * @param tabToGoto
     */
    async loginAsDefaultUser( tabToGoto ) {

        // Log out current user.
        this.apiServerService.setLoggingOut( true );
        this.apiServerService.setSimpleSearchQueryHold( '' );

        this.commonService.emitSimpleSearchQueryForDisplay( [] );

        let logout = false;
        // Log out any logged in user.
        this.apiServerService.logOut().subscribe(
            data => {
                logout = true;
            },
            err => {
                logout = true;
                console.error( 'loginAsDefaultUser logging out error: ', err );
            }
        );

        // Wait here while we log out the current access token if there is one.
        while( !logout ){
            await this.commonService.sleep( Consts.waitTime );
        }
        this.apiServerService.setLoggingOut( false );

        this.apiServerService.setCurrentUser( Properties.API_SERVER_USER_DEFAULT );
        this.persistenceService.put( this.persistenceService.Field.USER, Properties.API_SERVER_USER_DEFAULT );
        this.apiServerService.setCurrentPassword( Properties.API_SERVER_PASSWORD_DEFAULT );

        this.apiServerService.getToken().subscribe(
            ( res ) => {
                this.accessToken = res['access_token'];
                this.apiServerService.setToken( res );

                // Rest charts
                this.commonService.reInitCharts();

                // Reload available search criteria, it can be different for each user.
                this.commonService.resetAllSimpleSearchForLogin();
                this.commonService.clearSimpleSearchResults();
                // For clearing all queries, search results, and resetting available Collections, Image Modality, etc, for a newly logged in user,
                // this.commonService.resetAllSimpleSearch();  // FIXME Make sure we don't need this

                // Clear the Text Search
                this.commonService.clearTextSearchUserInput();
                this.commonService.clearTextSearchResults();

                this.cartService.clearCart();

                // Update the Collection descriptions for the new user
                this.commonService.updateCollectionDescriptions();


                // If there are query parameters passed in the URL, this is where rerun the search with the new users access.
                if( this.parameterService.haveUrlSimpleSearchParameters() ){

                    // TODO explain this
                    setTimeout( async() => {
                        while( this.initMonitorService.getAnyRunning() ){
                            await this.commonService.sleep( 10 );
                        }
                        this.parameterService.resetUrlQuery();
                    }, 10 );
                }

                // Set this so we do reload the URL shared list when a user logs in.
                if( this.parameterService.haveUrlSharedList() === this.parameterService.seen ){
                    this.parameterService.setHaveUrlSharedList( this.parameterService.yes );
                    // We need a small delay here.  TODO explain
                    setTimeout( () => {
                        this.menuService.setCurrentItem( MenuItems.CART_MENU_ITEM );
                    }, 500 );

                }
                this.apiServerService.gotToken();
            },

            // An error  // FIXME - What do we do if the default user can't login???
            ( err ) => {
                this.statusMessage0 = 'Login failed: ' + err.statusText;
                // this.apiServerService.deleteToken();
                // this.loginForm.controls['password'].setValue( '' );
                this.apiServerService.gotToken();
            }
        );
    }

    onPasswordFocus() {
        if( this.statusMessage0.length > 0 ){
            this.statusMessage0 = '';
        }
    }


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
