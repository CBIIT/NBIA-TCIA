import { Component, Input, OnInit } from '@angular/core';
import { Consts } from '@app/constants';
import { UtilService } from '@app/admin-common/services/util.service';


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

    constructor( private utilService: UtilService ) {
    }

    async ngOnInit() {

        // Wait for  @Input() currentTool to be populated
        while( this.currentTool === undefined ){
            await this.utilService.sleep( Consts.waitTime );
        }

        // @TODO this is just a quick fix for early demo purposes.
        if( this.currentTool === Consts.TOOL_EDIT_COLLECTION_DESCRIPTIONS ){
            this.currentToolTitle = 'Edit Collection Descriptions';
        }else if( this.currentTool === Consts.TOOL_APPROVE_DELETIONS ){
            this.currentToolTitle = 'Approve Deletions';
        }else if( this.currentTool === Consts.TOOL_PERFORM_QC ){
            this.currentToolTitle = 'Perform QC';
        }else if( this.currentTool === Consts.TOOL_VIEW_SUBMISSION_REPORTS ){
            this.currentToolTitle = 'View Submission Reports';
        }else if( this.currentTool === Consts.TOOL_PERFORM_ONLINE_DELETION ){
            this.currentToolTitle = 'Perform Online Deletion';
        }else{
            this.currentToolTitle = 'The tool heading will go here: ' + this.currentTool;
        }
    }

}
