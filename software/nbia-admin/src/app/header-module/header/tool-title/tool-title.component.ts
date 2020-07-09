import { Component, Input, OnInit } from '@angular/core';
import { Consts } from '@app/constants';
import { UtilService } from '@app/admin-common/services/util.service';
import { Properties } from '@assets/properties';
import { AccessTokenService } from '@app/admin-common/services/access-token.service';


@Component( {
    selector: 'nbia-tool-title',
    templateUrl: './tool-title.component.html',
    styleUrls: ['./tool-title.component.scss']
} )

/**
 * This is the tool specific heading right below the header.
 */
export class ToolTitleComponent implements OnInit{

    /**
     * nbia-admin-client passes in this value via it's html.
     */
    @Input() currentTool;
    currentToolTitle;
    helpUrl;

    constructor( private utilService: UtilService, private accessTokenService: AccessTokenService ) {
    }

    async ngOnInit() {

        // Wait for  @Input() currentTool to be populated
        while( this.currentTool === undefined ){
            await this.utilService.sleep( Consts.waitTime );
        }

        this.helpUrl = Properties.HELP_BASE_URL + '/' + Properties.HELP_PATH;
        // @TODO this is just a quick fix for early demo purposes.
        if( this.currentTool === Consts.TOOL_EDIT_COLLECTION_DESCRIPTIONS ){
            this.currentToolTitle = 'Edit Collection Descriptions';
            this.helpUrl += '#DataAdministrationToolGuide-EditCollectionDescriptions';
        }else if( this.currentTool === Consts.TOOL_APPROVE_DELETIONS ){
            this.currentToolTitle = 'Approve Deletions';
            this.helpUrl += '#DataAdministrationToolGuide-ApproveDeletions';
        }else if( this.currentTool === Consts.TOOL_PERFORM_QC ){
            this.currentToolTitle = 'Perform Quality Control';
            this.helpUrl += '#DataAdministrationToolGuide-PerformQualityControl';
        }else if( this.currentTool === Consts.TOOL_VIEW_SUBMISSION_REPORTS ){
            this.currentToolTitle = 'View Submission Reports';
        }else if( this.currentTool === Consts.TOOL_PERFORM_ONLINE_DELETION ){
            this.currentToolTitle = 'Perform Online Deletion';
            this.helpUrl += '#DataAdministrationToolGuide-PerformOnlineDeletions';
        }else{
            this.currentToolTitle = 'The tool heading will go here: ' + this.currentTool;
        }
    }
    onHomeMenuClick(){
       // window.open( Properties.API_SERVER_URL + location.pathname + '?accessToken=' + this.accessTokenService.getAccessToken(), '_blank' );
        window.open( Properties.API_SERVER_URL + location.pathname + '?accessToken=' + this.accessTokenService.getAccessToken() );
    }

    onCurrentToolClickClick(){
        window.open( this.helpUrl, '_blank' );
    }
}
