import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { Consts } from '@app/consts';
import { UtilService } from '@app/common/services/util.service';
import { ParameterService } from '@app/common/services/parameter.service';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-subject-id-query',
    templateUrl: './subject-id-query.component.html',
    styleUrls: ['../simple-search.component.scss', './subject-id-query.component.scss']
} )
export class SubjectIdQueryComponent implements OnInit, OnDestroy{

    showSubjectIdExplanation = false;
    posY = 0;

    /**
     * For hide or show this group of criteria when the arrows next to the heading are clicked.
     */
    showSubjectIds = true;

    /**
     * The comma separated list of Subject IDs to search for.  This is bound to the UI input.
     * @type {string}
     */
    subjectText = '';

    idTypeRadioLabels = ['Patient ID', 'Study Instance UID' , 'Series Instance UID'];
    idTypeApply = false;
    idTypeApplySelection = 0;

    criteraTypeList = [Consts.PATIENT_CRITERIA, Consts.STUDY_CRITERIA, Consts.SERIES_CRITERIA];
    queryUrlTypeList = [];    


    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private parameterService: ParameterService,
                 private queryUrlService: QueryUrlService, private apiServerService: ApiServerService,
                  private initMonitorService: InitMonitorService, private utilService: UtilService ) {
    }

    ngOnInit() {

        // Get persisted showCriteriaList value.  Used to show, or collapse this category of criteria in the UI.
        this.showSubjectIds = this.commonService.getCriteriaQueryShow(Consts.SHOW_CRITERIA_QUERY_SUBJECT_ID) ?? Consts.SHOW_CRITERIA_QUERY_SUBJECT_ID_DEFAULT;
        this.commonService.setCriteriaQueryShow(Consts.SHOW_CRITERIA_QUERY_SUBJECT_ID, this.showSubjectIds);
        try {   



        // Used when the Clear button is clicked in the Display Query.
        this.commonService.resetAllSimpleSearchEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
           async () => await this.resetSearch());

        this.commonService.showSubjectIdExplanationEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            (data: boolean) => {
            this.showSubjectIdExplanation = data;
        });


        this.parameterService.parameterSubjectIdEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
           async (data: string) => {
                this.subjectText = data;
                this.idTypeApplySelection = 0;
                await this.onSearchClick();
                this.commonService.setHaveUserInput( false );

            }
        );

        this.parameterService.parameterSeriesCriteriaEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            async (data: string) => {
                this.subjectText = data;
                this.idTypeApplySelection = 2;
                await this.onSearchClick();
                this.commonService.setHaveUserInput( false );

            }
        );

        this.parameterService.parameterStudyCriteriaEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(   
           async (data: string) => {
                this.subjectText = data;
                this.idTypeApplySelection = 1;
                await this.onSearchClick();
                this.commonService.setHaveUserInput( false );

            }
        );  

        this.initMonitorService.setSubjectIdInit( true );
        this.initMonitorService.setSeriesCriteriaInit( true );
        this.initMonitorService.setStudyCriteriaInit( true );
    } catch (error) {
        console.error('Error in ngOnInit in subject-id-query component: ', error);
        }
    }
    /**
     * Hides or shows this group of criteria when the arrows next to the heading are clicked.
     *
     * @param {boolean} show
     */
    onShowSubjectIdsClick( show: boolean ) {
        this.showSubjectIds = show;
        this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_SUBJECT_ID, this.showSubjectIds );
    }

    /**
     * Clears the UI input, and sends an empty query via onSearchClick() to clear the Search results and Display query.
     */
    onClearClick() {
        this.commonService.setHaveUserInput( true );
        this.subjectText = '';
        this.queryUrlService.clear(this.getSelectedQueryUrlType());

        // Update query with empty selection
        this.updateQuery([]);
    }

    /**
     * Get the list of IDs, split them on commas, and ad to the query.
     */
    async onSearchClick() {
        // If this method was called from a URL parameter search, setHaveUserInput will be set to false by the calling method after this method returns.
        this.commonService.setHaveUserInput( true );

        // Comma delimited, Trim and normalize subjectText
        let subjectIdForQuery = this.subjectText.trim().replace( /^,?\s*,?/g, '' ).replace( /\s*,\s*/g, ',' ).replace( /\s*$/, '' ).split( ',' ).filter( item => item !== '' );
        
        // Clear all unselected query URL types
        await Promise.all(this.getNonSelectedQueryUrlTypes().map(type => this.queryUrlService.clear(type)));

        const selectedType = this.getSelectedQueryUrlType();

        if (subjectIdForQuery.length > 0 && subjectIdForQuery[0] !== '') {
            //Update selected query URL
            await this.queryUrlService.update(selectedType, subjectIdForQuery.join(','));
        } else {
            await this.queryUrlService.clear(selectedType);
        }

        // Ensure criteria type is added to query
        this.updateQuery(subjectIdForQuery);  

    }

    getSelectedQueryUrlType() {
        return [
            this.queryUrlService.SUBJECT_ID,
            this.queryUrlService.STUDY_UID,
            this.queryUrlService.SERIES_UID
        ][this.idTypeApplySelection];
    }

    getNonSelectedQueryUrlTypes() {
        return [
            this.queryUrlService.SUBJECT_ID,
            this.queryUrlService.STUDY_UID,
            this.queryUrlService.SERIES_UID
            
        ].filter((_, index) => index !== this.idTypeApplySelection);
    }

    /**
     * Handles radio button selection change.
     */
    onIdTypeRadioChange( selection: number ) {
        this.idTypeApplySelection = selection;
    }

     /**
     * Handles subject ID explanation click.
     */
    onSubjectIdExplanationClick(e) {
        this.showSubjectIdExplanation = true;
        this.posY = e.view.pageYOffset + e.clientY;
    }

    /**
     * Updates the query in CommonService.
     */
    private updateQuery(subjectIdForQuery: string[]) {
        let query = [this.criteraTypeList[this.idTypeApplySelection], ...subjectIdForQuery];
        this.commonService.updateQuery(query);
        this.criteraTypeList.forEach((item, index) => {
            if (index !== this.idTypeApplySelection) {
                query = [item];
                this.commonService.updateQuery(query);
            }
        });
    }

    /**
     * Resets the search inputs and query.
     */
    private async resetSearch() {
        this.subjectText = '';
        await this.queryUrlService.clear(this.getSelectedQueryUrlType());
        this.idTypeApplySelection = 0;
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
