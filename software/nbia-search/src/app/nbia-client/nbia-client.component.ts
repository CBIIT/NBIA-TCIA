import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { MenuService } from '../common/services/menu.service';
import { ApiServerService } from '../image-search/services/api-server.service';
import { CommonService } from '../image-search/services/common.service';
import { Properties } from '@assets/properties';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ParameterService } from '@app/common/services/parameter.service';
import { UtilService } from '@app/common/services/util.service';
import { Consts, MenuItems } from '@app/consts';
import { LoadingDisplayService } from '@app/common/components/loading-display/loading-display.service';
import { PersistenceService } from '@app/common/services/persistence.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BrandingService } from '@app/common/services/branding.service';
import { ConfigurationService } from '@app/common/services/configuration.service';


@Component( {
    selector: 'nbia-nbia-client',
    templateUrl: './nbia-client.component.html',
    styleUrls: ['../app.component.scss', './nbia-client.component.scss']
} )


export class NbiaClientComponent implements OnInit, OnDestroy{

//    @ViewChild( 'parentSpan' ) theParentSpan: ElementRef;

    host: { 'window:beforeunload': 'onExit' };

    /**
     * Tells the HTML what to show. Search results, Login, or Cart.
     */
    menuItems = MenuItems;
    currentMenuItem: MenuItems = this.menuItems.IMAGE_SEARCH_MENU_ITEM;
    currentUser;
    defaultUser;

    logout = false;
    token = '';

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

     constructor( private menuService: MenuService, private apiServerService: ApiServerService,
                       private commonService: CommonService, private titleService: Title,
                       private route: ActivatedRoute, private parameterService: ParameterService,
                       private loadingDisplayService: LoadingDisplayService, private persistenceService: PersistenceService,
                       private utilService: UtilService, private brandingService: BrandingService,
                       elementRef: ElementRef, private configurationService: ConfigurationService ) {

        this.configurationService.initConfiguration();
        // Make sure the configuration from the assets/configuration has been read and used.
        // It has DEFAULT_USER, DEFAULT_PASSWORD and DEFAULT_SECRET
/*
        while( !Properties.CONFIG_COMPLETE ){
            await this.commonService.sleep( Consts.waitTime );
        }
*/

        this.brandingService.initCurrentBrand();

        this.loadingDisplayService.setLoading( true, 'Standby...' );

        this.apiServerService.gettingAccessToken = 1;

        // Set the "From date" before we load any URL parameters, which may replace this date.
        // See if we have a persisted last access date
        let lastAccess = this.persistenceService.get( this.persistenceService.Field.LAST_ACCESS );
        if( this.utilService.isNullOrUndefined( lastAccess ) ){
            lastAccess = this.buildToday();
        }
        Properties.LAST_ACCESS = lastAccess;
        this.persistenceService.put( this.persistenceService.Field.LAST_ACCESS, this.buildToday() );


        this.titleService.setTitle( Properties.TITLE );
        // this.titleService.setTitle( Properties.VERSION );


        this.defaultUser = Properties.DEFAULT_USER;
        this.currentUser = Properties.DEFAULT_USER;


        this.menuService.currentMenuItemEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.currentMenuItem = <MenuItems>data;
            }
        );

        this.apiServerService.userSetEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.currentUser = data;
            }
        );

        // If we don't have an API Url, set it to the same server as the client.
        if( (this.utilService.isNullOrUndefined( Properties.API_SERVER_URL )) || (Properties.API_SERVER_URL.length < 1) ){
            Properties.API_SERVER_URL = location.origin.toString();
        }

        // If we don't have an OHIFViewer Url, set it to the same server as the API Url.
        if( (this.utilService.isNullOrUndefined( Properties.OHIF_SERVER_URL )) || (Properties.OHIF_SERVER_URL.length < 1) ){
            Properties.OHIF_SERVER_URL = Properties.API_SERVER_URL;
        }

    }  // End constructor

  async  ngOnInit() {

        this.initUrlParameters();

        console.log('MHL Start waiting for CONFIG_COMPLETE 001');
        while( !Properties.CONFIG_COMPLETE ){
            await this.commonService.sleep( Consts.waitTime );
        }
        console.log('MHL DONE waiting for CONFIG_COMPLETE 002 : ', Properties.CONFIG_COMPLETE);
        console.log('MHL DONE waiting for DEFAULT_USER 003 : ', Properties.DEFAULT_USER);

        if( this.persistenceService.get( this.persistenceService.Field.IS_GUEST ) ){
            // Logs in the default (guest) user.
            this.initToken();
        }else{
            this.apiServerService.setToken( { 'access_token': this.persistenceService.get( this.persistenceService.Field.ACCESS_TOKEN ) } );
            this.apiServerService.setCurrentUser( this.persistenceService.get( this.persistenceService.Field.USER ) );
            this.apiServerService.setCurrentPassword( '' );
        }

        this.loadingDisplayService.setLoading( false, 'A Standby...' );
    }


    /*
        ngAfterViewChecked() {
            console.log('IN ngAfterViewChecked theParentSpan: ', this.theParentSpan.nativeElement['offsetHeight']);
            this.commonService.setOffsetHeight( this.theParentSpan.nativeElement['offsetHeight'] );
        }
    */

    // FIXME. Can this all go directly in parameterService?
    initUrlParameters() {

        // Get any URL parameters
        let patientID = this.route.snapshot.queryParams[Properties.URL_KEY_PATIENT_ID];  // Subject
        let patientID2 = this.route.snapshot.queryParams[Properties.URL_KEY_PATIENT_ID2];  // For backwards compatibility
        let collections = this.route.snapshot.queryParams[Properties.URL_KEY_COLLECTIONS];
        let collections2 = this.route.snapshot.queryParams[Properties.URL_KEY_COLLECTIONS2]; // For backwards compatibility
        let modality = this.route.snapshot.queryParams[Properties.URL_KEY_MODALITY];
        let modalityAll = this.route.snapshot.queryParams[Properties.URL_KEY_MODALITY_ALL];
        let anatomicalSite = this.route.snapshot.queryParams[Properties.URL_KEY_ANATOMICAL_SITE];
        let species = this.route.snapshot.queryParams[Properties.URL_KEY_SPECIES];
        let phantoms = this.route.snapshot.queryParams[Properties.URL_KEY_PHANTOMS];
        let thirdParty = this.route.snapshot.queryParams[Properties.URL_KEY_THIRD_PARTY];
        let minimumStudies = this.route.snapshot.queryParams[Properties.URL_KEY_MINIMUM_STUDIES];
        let dateRange = this.route.snapshot.queryParams[Properties.URL_KEY_DATE_RANGE];
        let sharedList = this.route.snapshot.queryParams[Properties.URL_KEY_SHARED_LIST];

        let showTest = this.route.snapshot.queryParams[Properties.URL_KEY_SHOW_TEST_TAB];
        let apiUrl = this.route.snapshot.queryParams[Properties.URL_KEY_API_URL];
        let textSearchInput = this.route.snapshot.queryParams[Properties.URL_KEY_TEXT_SEARCH];
        let excludeCommercial = this.route.snapshot.queryParams[Properties.URL_KEY_EXCLUDE_COMMERCIAL];
        let daysFromBaseline = this.route.snapshot.queryParams[Properties.URL_KEY_DAYS_FROM_BASELINE];

        if( !this.utilService.isNullOrUndefined( textSearchInput ) ){
            this.parameterService.setTextSearch( textSearchInput );
        }


        // React to URL parameters
        if( !this.utilService.isNullOrUndefined( modalityAll ) ){
            modalityAll = this.utilService.isTrue( modalityAll );
        }else{
            modalityAll = null;
        }

        if( !this.utilService.isNullOrUndefined( daysFromBaseline ) ){
            this.parameterService.setDaysFromBaseline( daysFromBaseline );
        }

        if( !this.utilService.isNullOrUndefined( excludeCommercial ) ){
            this.parameterService.setExcludeCommercial( excludeCommercial );
        }

        if( !this.utilService.isNullOrUndefined( dateRange ) ){
            this.parameterService.setDateRange( dateRange );
        }

        if( !this.utilService.isNullOrUndefined( minimumStudies ) ){
            this.parameterService.setMinimumStudies( minimumStudies );
        }

        if( !this.utilService.isNullOrUndefined( patientID ) ){
            this.parameterService.setPatientID( patientID );
        }

        // For backwards compatibility
        if( !this.utilService.isNullOrUndefined( patientID2 ) ){
            this.parameterService.setPatientID( patientID2 );
        }

        if( !this.utilService.isNullOrUndefined( collections ) ){
            this.parameterService.setCollection( collections );
        }

        // For backwards compatibility
        if( !this.utilService.isNullOrUndefined( collections2 ) ){
            this.parameterService.setCollection( collections2 );
        }

        if( !this.utilService.isNullOrUndefined( modality ) ){
            this.parameterService.setModality( modality, modalityAll );
        }

        if( !this.utilService.isNullOrUndefined( anatomicalSite ) ){
            this.parameterService.setAnatomicalSite( anatomicalSite );
        }

        if( !this.utilService.isNullOrUndefined( species ) ){
            this.parameterService.setSpecies( species );
        }

        if( !this.utilService.isNullOrUndefined( phantoms ) ){
            this.parameterService.setPhantoms( phantoms );
        }

        if( !this.utilService.isNullOrUndefined( thirdParty ) ){
            this.parameterService.setThirdParty( thirdParty );
        }

        if( !this.utilService.isNullOrUndefined( showTest ) ){
            this.parameterService.setShowTest( showTest );
        }

        if( !this.utilService.isNullOrUndefined( apiUrl ) ){
            this.parameterService.setApiUrl( apiUrl );
        }


        if( !this.utilService.isNullOrUndefined( sharedList ) ){
            this.parameterService.setSharedListName( sharedList );
        }

    }


    /**
     * Login as the default user (get access token).
     *
     * @returns {Promise<void>}
     */
    async initToken() {

        let getTokenComplete = false;

        // Try getting a new Access token
        // This will run asynchronously, so use boolean getTokenComplete to know when to move on.
        this.apiServerService.getToken().subscribe(
            ( res ) => {
                this.apiServerService.setToken( res );
                getTokenComplete = true;
            },

            // We tried and failed to get a new Access token, emit the error.
            ( err ) => {
                console.error( 'Failed to get a new Access token: ' + err.statusText + '[' + err.status + ']' );

                // Even with an error, we still need to stop waiting.
                getTokenComplete = true;
            }
        );

        // Wait here until we have an answer back from apiServerService.getToken(), we will then have an access token or an error.
        while( !getTokenComplete ){
            await this.commonService.sleep( 10 );
        }
        // TODO send word to everything else that we have the token - can we access apiService.gettingAccessToken?

        this.loadingDisplayService.setLoading( false, 'Standby...' ); // There was a typo here in previous version.

    }

    buildToday() {
        let now = new Date();
        let today = {};
        today['date'] = {};
        today['date']['day'] = now.getDate();
        today['date']['month'] = now.getMonth() + 1;
        today['date']['year'] = now.getFullYear();
        return today;
    }


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
