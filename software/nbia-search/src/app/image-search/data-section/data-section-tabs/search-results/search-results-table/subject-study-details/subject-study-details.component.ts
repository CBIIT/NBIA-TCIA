import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Consts } from '../../../../../../consts';
import { ApiServerService } from '../../../../../services/api-server.service';
import { LoadingDisplayService } from '../../../../../../common/components/loading-display/loading-display.service';
import { CommonService } from '../../../../../services/common.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Properties } from '@assets/properties';

@Component( {
    selector: 'nbia-subject-study-details',
    templateUrl: './subject-study-details.component.html',
    styleUrls: ['../../../../../../app.component.scss', './subject-study-details.component.scss']
} )
export class SubjectStudyDetailsComponent implements OnInit, OnDestroy{

    @Input() subjectDetailData;
    @Input() subjectIndex;


    SUBJECT_DATE_TOOLTIP = Consts.SUBJECT_DATE_TOOLTIP;


    /**
     * This array is populated by subjectDetailsResultsEmitter.subscribe, it will contain one element for each subject.<br>
     * Each of these Subject elements will have the data for the Subject, and all it's Series.
     * @type {Array}
     */
    resultsArray = [];


    /**
     * Used to gather all the results from the doSearch calls in getSubjectDetails, one call per Subject.
     * When we have them all, these values are stored in resultsArray[].
     * @type {Array}
     */
    tempResultsArray = [];

    /**
     * This will be used to alert users that something is happening, and to wait.
     * @type {boolean}
     */
    busy = false;

    /**
     * Used in subjectDetailsResultsEmitter.subscribe to determine when all the doSearch results for this Subject have been receive.
     * @type {number}
     */
    studyCount = 0;

    /**
     * Each element in this array represents one Study.<br>
     * If an element is true, then it's list of series are displayed.<br>
     * They are initialized to false.
     * @type {Array}
     */
    toggleSeriesVisibleArray: boolean[] = [];

    properties = Properties;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiServerService: ApiServerService, private loadingDisplayService: LoadingDisplayService,
                 private commonService: CommonService ) {
    }

    ngOnInit() {
        // Receives the data when this.getSubjectDetails( subjectRowData ) calls apiServerService.doSearch( Consts.DRILL_DOWN, query ) to get
        // the Study and Series data for one Subject.
        // If there is an error, it will be received by subjectDetailsErrorEmitter.subscribe below.
        this.apiServerService.subjectDetailsResultsEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {

                // Is it one of ours?
                if( this.isStudyInThisSubject( data[0] ) ){ // It arrives as a one element array


                    // tempResultsArray is cleared by getSubjectDetails( subjectRowData )
                    this.tempResultsArray.push( data[0] ); // It arrives as a one element array

                    // apiServerService.doSearch is called in getSubjectDetails for each of the Subject's Studies.
                    // When we have all of them set resultsArray.
                    if( this.tempResultsArray.length === this.studyCount ){
                        // Sort by date
                        this.tempResultsArray.sort( ( row1, row2 ) => row1.date - row2.date );
                        this.resultsArray = this.tempResultsArray;
                        // TODO - We don't really need this if we are using "loadingDisplayService.setLoading"
                        this.busy = false;
                        this.loadingDisplayService.setLoading( false );

                    }
                }
            }
        );


        // If there was an error resulting from the call to apiServerService.doSearch( Consts.DRILL_DOWN, query ) in getSubjectDetails( subjectRowData ),
        // the error information will be received here.
        //
        // TODO React to this error
        this.apiServerService.subjectDetailsErrorEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            err => {
                console.error( 'SubjectStudyDetailsComponent subjectDetailsErrorEmitter.subscribe: ', err );
                this.loadingDisplayService.setLoading( false );
            }
        );

        this.getSubjectDetails( this.subjectDetailData )
    }


    isStudyInThisSubject( study ) {
        for( let subjectStudyIds of this.subjectDetailData.studyIdentifiers ){
            if( subjectStudyIds.studyIdentifier === study.id ){
                return true;
            }
        }
        return false;
    }

    onCloseSubjecStudyDetailsClick() {
        this.commonService.closeSubjectDetails( this.subjectIndex );
    }


    /**
     * Takes one Subject, and retrieves all the data for all it's Studies, and all of their Series.<br>
     * the results are stored in this.resultsArray.
     *
     * @param subjectRowData  One Subject's data.
     */
    getSubjectDetails( subjectRowData ) {
        this.studyCount = subjectRowData.studyIdentifiers.length;
        this.tempResultsArray = [];
        // TODO - We don't really need this if we are using "loadingDisplayService.setLoading"
        this.busy = true;
        this.loadingDisplayService.setLoading( true, 'Loading Subject details' );

        // An array of URL ready lists of seriesIds. Each element is a seriesId list for each Study for this subject
        let queryList = this.buildDrillDownQuery( subjectRowData );

        // One search series data for each Study.
        for( let query of queryList ){
            // This search is asynchronous, the results are received by apiServerService.subjectDetailsResultsEmitter.subscribe (in this component),
            // the results are stored in this.resultsArray.
            this.apiServerService.doSearch( Consts.DRILL_DOWN, query );
        }
    }

    /**
     * Takes one Subjects data, and returns an array of it's Studies, each element will contain a URL formatted list of all it's series.
     *
     * @param subjectRowData   One Subject's data.
     * @returns {Array}  Each element represents one Study, and contains a URL ready list of all it's series.
     */
    buildDrillDownQuery( subjectRowData ) {
        let queryString = '';
        let queryArray = [];

        // Each Study for this Subject.
        for( let studyId of subjectRowData.studyIdentifiers ){
            // Each Series for this Study.
            for( let seriesId of studyId.seriesIdentifiers ){
                queryString += '&list=' + seriesId;
            }
            // Remove leading &
            queryString = queryString.substr( 1 );
            queryArray.push( queryString );
            queryString = '';
        }

        return queryArray
    }

    onShowSeriesClick( i, show ) {
        this.toggleSeriesVisibleArray[i] = show;
        // Tells the Series component for this subject to show or hide.
        this.commonService.showSeries( i, show );

    }

    onStudyOhifViewerClick(){
        alert( 'This feature (onStudyOhifViewerClick) has not yet been implemented.' );
    }


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
