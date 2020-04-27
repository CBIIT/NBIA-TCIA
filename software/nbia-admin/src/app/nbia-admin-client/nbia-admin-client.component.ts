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
    showEditCollectionDescriptions = false;

    loginMode;
    consts = Consts;
    toolItems = ToolItems;

    tokenStatus = TokenStatus;
    accessTokenStatus;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private parameterService: ParameterService, private apiService: ApiService,
                 private utilService: UtilService, private loginService: LoginService,
                 private accessTokenService: AccessTokenService, private brandingService: BrandingService,
                 private configurationService: ConfigurationService ) {
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
    }

    // If no "tool" parameter is included in the URL a menu is presented.
    // This is called when a user selects a tool.
    onToolItemClicked( tool, enabled ) {
        if( enabled ){
            if( tool === 0 ){
                this.currentTool = Consts.TOOL_PERFORM_QC;
            }
            if( tool === 1 ){
                this.currentTool = Consts.TOOL_APPROVE_DELETIONS;
            }
            if( tool === 2 ){
                this.currentTool = Consts.TOOL_VIEW_SUBMISSION_REPORTS;
            }
            if( tool === 3 ){
                this.currentTool = Consts.TOOL_PERFORM_ONLINE_DELETION;
            }
            if( tool === 4 ){
                this.currentTool = Consts.TOOL_EDIT_COLLECTION_DESCRIPTIONS;
            }
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
        }

        if( this.userRoles.indexOf( 'NCIA.MANAGE_VISIBILITY_STATUS' ) > -1 ){
            this.showDataAdminPerformQcButton = true;
        }
        if( this.userRoles.indexOf( 'NCIA.MANAGE_COLLECTION_DESCRIPTION' ) > -1 ){
            this.showEditCollectionDescriptions = true;
        }
    }

    ngOnDestroy()
        :
        void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
