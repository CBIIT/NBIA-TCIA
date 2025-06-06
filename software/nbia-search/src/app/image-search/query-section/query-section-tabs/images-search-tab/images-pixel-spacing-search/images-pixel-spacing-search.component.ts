import { Component, OnDestroy, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Consts } from '@app/consts';
import { CommonService } from '@app/image-search/services/common.service';
import { UtilService } from '@app/common/services/util.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { ParameterService } from '@app/common/services/parameter.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';

@Component( {
    selector: 'nbia-images-pixel-spacing-search',
    templateUrl: './images-pixel-spacing-search.component.html',
    styleUrls: ['../../../../../app.component.scss', '../images-search-tab.component.scss', './images-pixel-spacing-search.component.scss'],

} )
export class ImagesPixelSpacingSearchComponent implements OnInit, OnDestroy{ 
    showPixelSpacingRangeExplanation = false;
    posY = 0;

    pixelSpacingSelection = 0;
    fromPixelSpacing: number = 0.0;
    toPixelSpacingTrailer: number = 15.0;
    fromPixelSpacingTrailer: number = 0.0;
    toPixelSpacing: number = 15.0;
    disabled = false;
    options: Options = {
        floor: 0,
        ceil: 15.0,
        step: 0.5,
        enforceStep: false,
        enforceRange: false,
    };

    resultsCount = -1;

    /**
     * The list used by the HTML.
     */
    criteriaList;

    /**
     * For hide or show this group of criteria when the arrows next to the heading are clicked.
     */
    showPixelSpacingRange= false;

    /**
     * Used to clean up subscribes on the way out to prevent memory leak.
     * @type {Subject<boolean>}
     */
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private utilService: UtilService,
                    private initMonitorService: InitMonitorService, private queryUrlService: QueryUrlService,
                    private apiServerService: ApiServerService, private parameterService: ParameterService ) {
    }

    ngOnInit() {

        //Start with default values
        this.onShowPixelSpacingRangeClick(false);

        this.commonService.showPixelSpacingRangeExplanationEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.showPixelSpacingRangeExplanation = <boolean>data;
            }
        );


        // Get persisted pixelSpacing 
        this.showPixelSpacingRange = this.commonService.getCriteriaQueryShow( Consts.SHOW_CRITERIA_PIXEL_SPACING );
        if( this.utilService.isNullOrUndefined( this.showPixelSpacingRange ) ){
            this.showPixelSpacingRange = Consts.SHOW_CRITERIA_PIXEL_SPACING_DEFAULT;
            this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_PIXEL_SPACING, this.showPixelSpacingRange );
        }


        // Called when the "Clear" button on the left side of the Display query at the top.
        this.commonService.resetAllSimpleSearchEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {         
                this.fromPixelSpacing = 0.0;
                this.toPixelSpacing = 15.0;
                this.fromPixelSpacingTrailer = 0.0; 
                this.toPixelSpacingTrailer = 15.0;
                this.queryUrlService.clear( this.queryUrlService.PIXEL_SPACING );
            }
        );

        // Just set the values of pixel spacing range from URL parameter,
        // Just set the values, not the 'Apply pixel spacing range'
        this.parameterService.parameterPixelSpacingRangeEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            async data => {
                try {
                    let dataString = <string>data; //sample data: PixelSpacingCriteria=0-12.5mm
                    let dataArray = dataString.replace('--','-').replace('mm','').split( '-' );
                    if (dataArray && dataArray.length > 1) {
                        this.fromPixelSpacing = Number(dataArray[0]);
                        this.toPixelSpacing = Number(dataArray[1]);
                
                        if (!isNaN(this.fromPixelSpacing) && !isNaN(this.toPixelSpacing)) {
                            this.onApplyPixelSpacingRangeClick(true);
                            this.showPixelSpacingRange = true;
                            this.commonService.setHaveUserInput(false);
                        } else {
                            console.error("Invalid pixel spacing values:", dataString);
                        }
                    } else {
                        console.warn("Unexpected pixel spacing format:", dataString);
                    }
                } catch (error) {
                    console.error("Error processing pixel spacings range:", error);
                }
               
            }
        );

        // Get persisted showPixelSpacingRange value.  Used to show, or collapse this category of criteria in the UI.
        this.showPixelSpacingRange = this.commonService.getCriteriaQueryShow( Consts.SHOW_CRITERIA_PIXEL_SPACING );
        if( this.utilService.isNullOrUndefined( this.showPixelSpacingRange ) ){
            this.showPixelSpacingRange = Consts.SHOW_CRITERIA_PIXEL_SPACING_DEFAULT;
            this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_PIXEL_SPACING, this.showPixelSpacingRange );
        }

        this.initMonitorService.setPixelSpacingRangeInit( true );
    }
    
    /**
     * Hides or shows this group of criteria when the arrows next to the heading are clicked.
     *
     * @param show
     */
    onShowPixelSpacingRangeClick( show: boolean ) {
        this.showPixelSpacingRange = show;
    }

    /**
     *
     * @param {boolean} totalClear  true = the user has cleared the complete current query - no need to rerun the query
     */

    onPixelSpacingClearAllClick() { 
        this.commonService.setHaveUserInput( true );
        this.fromPixelSpacing = 0.0;
        this.toPixelSpacing = 15.0;
        this.fromPixelSpacingTrailer = 0.0; 
        this.toPixelSpacingTrailer = 15.0;
        this.queryUrlService.clear( this.queryUrlService.PIXEL_SPACING );
        let PixelSpacingRangeForQuery: string[] = [];
        PixelSpacingRangeForQuery[0] = Consts.PIXEL_SPACING_RANGE_CRITERIA;

        this.commonService.updateQuery( PixelSpacingRangeForQuery );  
    }

        /**
     * Updates the query.
     * TODO Rename this, there is no longer a checkbox
     *
     * @param checked
     */
        onApplyPixelSpacingRangeClick( checked ) {
        // If this method was called from a URL parameter search, setHaveUserInput will be set to false by the calling method after this method returns.
        this.commonService.setHaveUserInput( true );

        // Build the query.
        let PixelSpacingRangeForQuery: string[] = [];
        PixelSpacingRangeForQuery[0] = Consts.PIXEL_SPACING_RANGE_CRITERIA;
        // Checked, and the user has selected a range.
        if(checked && (+this.fromPixelSpacing > 0) || (+this.toPixelSpacing < 15)){
            let numFromPixelSpacing = Number( this.fromPixelSpacing );
            PixelSpacingRangeForQuery[1] = numFromPixelSpacing.toString();
            let numToPixelSpacing = Number( this.toPixelSpacing );
            PixelSpacingRangeForQuery[2] = numToPixelSpacing.toString();

            // Update queryUrlService  for share my query
            this.queryUrlService.update( this.queryUrlService.PIXEL_SPACING, this.fromPixelSpacing + '-' + this.toPixelSpacing + 'mm' );
        }
        if( ! checked )
        {
            // Remove PixelSpacingRange (if any) in the queryUrlService
            this.queryUrlService.clear( this.queryUrlService.PIXEL_SPACING );
            // If user has unchecked or have changed the event to none ("Select") or has no To AND From values, remove Days from baseline from the query
            PixelSpacingRangeForQuery.slice( 0, 1 );
        }

        this.toPixelSpacingTrailer = this.toPixelSpacing;
        this.fromPixelSpacingTrailer = this.fromPixelSpacing;
    
        this.commonService.updateQuery( PixelSpacingRangeForQuery );

    }

        /**
     * If the user input values have changed, update the query.
     */
        onPixelSpacingRangeApply() {
        if( this.toPixelSpacingTrailer !== this.toPixelSpacing ||
            this.fromPixelSpacingTrailer !== this.fromPixelSpacing){
            
            this.onApplyPixelSpacingRangeClick( true );
        }
    }

    onPixelSpacingRangeExplanationClick(e) {
        this.showPixelSpacingRangeExplanation = true;
        this.posY = e.view.pageYOffset + e.clientY;
    }

    isPixelSpacingUnchanged():boolean { 
        return (this.toPixelSpacingTrailer === this.toPixelSpacing && 
            this.fromPixelSpacingTrailer === this.fromPixelSpacing ) ||
            (this.toPixelSpacing === 15.0 && this.fromPixelSpacing === 0.0);
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
    
    
