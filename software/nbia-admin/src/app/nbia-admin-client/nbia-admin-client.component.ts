import { Component, OnDestroy, OnInit } from '@angular/core';
import { ParameterService } from '../admin-common/services/parameter.service';
import { ApiService } from '../admin-common/services/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Consts, TokenStatus, ToolItems } from '../constants';
import { UtilService } from '../admin-common/services/util.service';
import { LoginService } from '../login/login.service';
import { AccessTokenService } from '../admin-common/services/access-token.service';
import { Properties } from '@assets/properties';
import { ConfigurationService } from '../admin-common/services/configuration.service';
import { BrandingService } from '@app/admin-common/services/branding.service';
import { PersistenceService } from '@app/admin-common/services/persistence.service';
import { CommonService } from '@app/admin-common/services/common.service';


@Component( {
    selector: 'nbia-nbia-admin-client',
    templateUrl: './nbia-admin-client.component.html',
    styleUrls: ['./nbia-admin-client.component.scss']
} )

/**
 * This is the (almost) top level component.
 * It looks at the URL "tool" parameter and launches the appropriate tool vi *ngIf="currentTool ===
 */
export class NbiaAdminClientComponent implements OnInit, OnDestroy{
    currentTool = Consts.TOOL_NONE;
    accessToken = TokenStatus.NO_TOKEN_YET;
    userRoles;
    showDataAdminViewSubmissionReports = false;
    showDataAdminApproveDeletions = false;
    showPerformOnlineDeletions = false;
    showDataAdminPerformQcButton = false;
    showSetSiteLicButton = false;
    showDynamicSearchTestButton = false;
    showEditCollectionDescriptions = false;
    showEditLicense = false;
    showCriteriaSelectionMenu = false;

    loginMode;
    consts = Consts;
    toolItems = ToolItems;

    tokenStatus = TokenStatus;
    accessTokenStatus;
    properties = Properties;

     private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private parameterService: ParameterService, private apiService: ApiService,
                 private utilService: UtilService, private loginService: LoginService,
                 private accessTokenService: AccessTokenService, private brandingService: BrandingService,
                 private persistenceService: PersistenceService, private commonService: CommonService,
                 private configurationService: ConfigurationService ) {

                // Read and set configuration from assets/configuration file
                this.configurationService.initConfiguration();
    }

    async ngOnInit() {

        // Get the current tool, if there is one.
        this.parameterService.currentToolEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.currentTool = data;
            } );


        this.accessTokenService.tokenStatusChangeEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                // loginMode determines whether the Login screen needs to bs shown.
                this.loginMode = data;
                this.accessTokenStatus = this.accessTokenService.getAccessTokenStatus();

            } );


        this.commonService.showCriteriaSelectionMenuEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.showCriteriaSelectionMenu = data;
            });

                // If the user roles change we will get the new roles here.
        this.apiService.updatedUserRolesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.userRoles = data;

                // Enable or disable tools according to the users role(s).
                this.enableTools();
            } );

        // Wait for the url parameters to be set
        while( !this.parameterService.haveParameters() ){
            await this.utilService.sleep( Consts.waitTime );
        }
        this.accessToken = this.accessTokenService.getAccessToken();
        this.initAccess();

        this.brandingService.initCurrentBrand();


        // If we don't have an API Url, set it to the same server as the client.
        if( (this.utilService.isNullOrUndefined( Properties.API_SERVER_URL )) || (Properties.API_SERVER_URL.length < 1) ){
            Properties.API_SERVER_URL = location.origin.toString();
        }

        // If we don't have an OHIFViewer Url, set it to the same server as the API Url.
        if( (this.utilService.isNullOrUndefined( Properties.OHIF_SERVER_URL )) || (Properties.OHIF_SERVER_URL.length < 1) ){
            Properties.OHIF_SERVER_URL = Properties.API_SERVER_URL;
        }
        this.showDynamicSearchTestButton = Properties.SHOW_DYNAMIC_QUERY_CRITERIA_TEST_PAGE;

        this.apiService.visibilitiesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
                Properties.QC_STATUSES = data;
            } );
        this.apiService.getVisibilities();
    }

    async initAccess() {
        // DEV_MODE just logs in with user specified in Properties.DEV_PASSWORD and  Properties.DEV_USER
        if( !Properties.DEV_MODE ){
            // Do we have a good token?
            this.accessTokenService.testToken( this.accessToken );
            while( this.accessTokenService.getAccessTokenStatus() === TokenStatus.NO_TOKEN_YET ){
                await this.utilService.sleep( Consts.waitTime );
            }

            // If we don't have an access token.
            if( this.accessTokenService.getAccessTokenStatus() === TokenStatus.NO_TOKEN ){
                this.loginService.doLogin( Consts.ERROR_NO_ACCESS_TOKEN );
            }else if
            (
                (this.accessTokenService.getAccessTokenStatus() === TokenStatus.BAD_TOKEN) ||
                (this.accessTokenService.getAccessTokenStatus() === TokenStatus.EXP_TOKEN)
            ){
                this.loginService.doLogin( Consts.ERROR_401 );
            }
        }else{
            this.accessTokenService.setAccessTokenStatus( TokenStatus.GOOD_TOKEN );
        }
        // @TODO do something here if we don't like accessTokenStatus
        this.accessTokenStatus = this.accessTokenService.getAccessTokenStatus();

        // nbia-admin uses this value to determine if an expired token should trigger a quiet login of the default guest user or prompt the user for a login.
        this.persistenceService.put( this.persistenceService.Field.IS_GUEST, false );


    }

    // If no "tool" parameter is included in the URL a menu is presented.
    // This is called when a user selects a tool.
    onToolItemClicked( tool, enabled ) {
        if( enabled ){
            if( tool === ToolItems.DATA_ADMIN_DYNAMIC_SEARCH_TEST){
                this.currentTool = Consts.TOOL_DYNAMIC_SEARCH_TEST;
            }
           if( tool === ToolItems.DATA_ADMIN_PERFORM_QC_MENU_ITEM ){
                this.currentTool = Consts.TOOL_PERFORM_QC;
            }
          if( tool === ToolItems.DATA_ADMIN_SET_SITE_LICENSE ){
                this.currentTool = Consts.TOOL_EDIT_SITE_LICENSE;
            }
            if( tool === ToolItems.DATA_ADMIN_APPROVE_DELETIONS_MENU_ITEM ){
                this.currentTool = Consts.TOOL_APPROVE_DELETIONS;
            }
            if( tool === ToolItems.DATA_ADMIN_VIEW_SUBMISSION_REPORTS_MENU_ITEM){
                this.currentTool = Consts.TOOL_VIEW_SUBMISSION_REPORTS;
            }
            if( tool === ToolItems.DATA_ADMIN_PERFORM_ONLINE_DELETION_MENU_ITEM ){
                this.currentTool = Consts.TOOL_PERFORM_ONLINE_DELETION;
            }
            if( tool === ToolItems.DATA_ADMIN_EDIT_COLLECTION_DESCRIPTIONS_MENU_ITEM  ){
                this.currentTool = Consts.TOOL_EDIT_COLLECTION_DESCRIPTIONS;
            }
           if( tool === ToolItems.DATA_ADMIN_EDIT_LICENSE ){
                this.currentTool = Consts.TOOL_EDIT_LICENSE;
            }

           this.parameterService.setCurrentTool( this.currentTool );
        }
    }


    enableTools() {
        if( this.userRoles.indexOf( 'NCIA.VIEW_SUBMISSION_REPORT' ) > -1 ){
            this.showDataAdminViewSubmissionReports = true;
        }
        if( this.userRoles.indexOf( 'NCIA.SUPER_CURATOR' ) > -1 ){
            this.showDataAdminApproveDeletions = true;
          //  this.showManageWorkflowItems = true;
        }

        if( this.userRoles.indexOf( 'NCIA.DELETE_ADMIN' ) > -1 ){
            this.showPerformOnlineDeletions = true;
        }

        // TODO find out what access NCIA.CURATE has
        if( this.userRoles.indexOf( 'NCIA.CURATE' ) > -1 ){
            this.showSetSiteLicButton = true;
        }

        if( this.userRoles.indexOf( 'NCIA.MANAGE_VISIBILITY_STATUS' ) > -1 ){
            this.showDataAdminPerformQcButton = true;
        }

        if( this.userRoles.indexOf( 'NCIA.MANAGE_COLLECTION_DESCRIPTION' ) > -1 ){
            this.showSetSiteLicButton = true;
            this.showEditCollectionDescriptions = true;
        }

        if( this.userRoles.indexOf( 'NCIA.MANAGE_COLLECTION_DESCRIPTION' ) > -1 ){
            this.showSetSiteLicButton = true;
            this.showEditLicense = true;
        }
    }


    ngOnDestroy()
        :
        void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
