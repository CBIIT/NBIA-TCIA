import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicQueryCriteriaService } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.service';
import { CommonService } from '@app/admin-common/services/common.service';
import { CriteriaSelectionMenuService } from '@app/criteria-selection-menu/criteria-selection-menu.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component( {
    selector: 'nbia-criteria-selection-menu',
    templateUrl: './criteria-selection-menu.component.html',
    styleUrls: ['./criteria-selection-menu.component.scss']
} )
export class CriteriaSelectionMenuComponent implements OnInit, OnDestroy{

    // These are for the radio buttons on the right for each criteria
    and = [];
    or = [];
    omit = [];
    option = [];

    handleMoving = false;
    criteriaData = {};
    elementsUsed=[];
    elementsUsedUp=[];

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private dynamicQueryCriteriaService: DynamicQueryCriteriaService,
                 private criteriaSelectionMenuService: CriteriaSelectionMenuService ) {
    }

    ngOnInit() {
        this.initTestData();
        this.criteriaSelectionMenuService.initElementsUsed( this.criteriaData );

        this.elementsUsed = this.criteriaSelectionMenuService.getElementsUsed();

        this.commonService.showCriteriaSelectionMenuEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                if( data ){
                    // We have just been "Shown" update the already used options
                    this.elementsUsed = this.criteriaSelectionMenuService.getElementsUsed();

                    for( let n = 0; n < this.criteriaData['data'].length; n++ ){
                        this.omit[n] = true;

                        let anyLeft = false;
                        for( let i = 0; i < this.elementsUsed[n].length; i++){
                            if( !this.elementsUsed[n][i] ){
                                this.option[n] = i;  // The starting default
                                anyLeft = true;
                                break;
                            }
                        }
                        if( ! anyLeft){
                            this.elementsUsedUp[n] = true;
                        }
                    }

                }
            } );


        // Set all criteria to "Omit"
        for( let n = 0; n < this.criteriaData['data'].length; n++ ){
            this.omit[n] = true;
        }
    }

    /**
     * This will eventual query the server, for now just test data.
     */
    initTestData() {
        this.criteriaData = {
            'data': [
                {
                    'parentMenuName': 'SeriesUID',
                    'criteriaObjects': [
                        {
                            'criteriaMenuText': 'List',
                            'configuration': {
                                'dynamicQueryCriteriaLargeTextInput': true,
                                'dynamicQueryCriteriaSingleLineRadioDefault': 0,
                                'dynamicQueryCriteriaClearButton': true,
                                'dynamicQueryCriteriaOpenCloseButton': true,
                                'dynamicQueryCriteriaHeading': 'Series UID',
                                'dynamicQueryCriteriaSubHeading': 'Comma separated list',
                                'dynamicQueryCriteriaApplyButton': true,
                                'dynamicQueryCriteriaApplyText': 'Apply',
                                'dynamicQueryCriteriaSort': true,
                                'dynamicQueryCriteriaAllowNoChoice': true,
                                'dynamicQueryCriteriaSelectionInHeadingCollapsed': true
                            }
                        },
                        {
                            'criteriaMenuText': 'Starts With',
                            'configuration': {
                                'dynamicQueryCriteriaSmallTextInput': true,
                                'dynamicQueryCriteriaSingleLineRadioDefault': 0,
                                'dynamicQueryCriteriaClearButton': true,
                                'dynamicQueryCriteriaOpenCloseButton': true,
                                'dynamicQueryCriteriaHeading': 'Series UID',
                                'dynamicQueryCriteriaSubHeading': 'Starts with',
                                'dynamicQueryCriteriaApplyButton': true,
                                'dynamicQueryCriteriaApplyText': 'Apply',
                                'dynamicQueryCriteriaSort': true,
                                'dynamicQueryCriteriaAllowNoChoice': true,
                                'dynamicQueryCriteriaSelectionInHeadingCollapsed': true
                            }
                        }
                    ]
                },
                {
                    'parentMenuName': 'QC Status',
                    'criteriaObjects': [
                        {
                            'criteriaMenuText': 'Select from list',
                            'configuration': {
                                'dynamicQueryCriteriaMultiChoiceList': true,
                                'dynamicQueryCriteriaSingleLineRadioDefault': 0,
                                'dynamicQueryCriteriaClearButton': true,
                                'dynamicQueryCriteriaOpenCloseButton': true,
                                'dynamicQueryCriteriaHeading': 'QC Status',
                                'dynamicQueryCriteriaApplyButton': true,
                                'dynamicQueryCriteriaApplyText': 'Apply',
                                'dynamicQueryCriteriaSearchable': true,
                                'dynamicQueryCriteriaSort': true,
                                'dynamicQueryCriteriaListData': [
                                    'Zulu',
                                    'Alpha',
                                    'Bravo',
                                    'Charlie',
                                    'Delta',
                                    'Echo',
                                    'Fox',
                                    'Golf',
                                    'Hotel',
                                    'India',
                                    'Juliette',
                                    'Kilo',
                                    'Lima',
                                    'Mike',
                                    'November'
                                ],
                                'dynamicQueryCriteriaAllowNoChoice': true,
                                'dynamicQueryCriteriaSelectionInHeadingCollapsed': true
                            }
                        }
                    ]
                },
                {
                    'parentMenuName': 'Most Recent Submission',
                    'criteriaObjects': [
                        {
                            'criteriaMenuText': 'Select date range',
                            'configuration': {
                                'dynamicQueryCriteriaClearButton': true,
                                'dynamicQueryCriteriaOpenCloseButton': true,
                                'dynamicQueryCriteriaHeading': 'Most Recent Submission',
                                'dynamicQueryCriteriaApplyCheckbox': true,
                                'dynamicQueryCriteriaApplyText': 'Apply "Most Recent" Date Range',
                                'dynamicQueryCriteriaAllowNoChoice': true,
                                'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                                'dynamicQueryCriteriaCalendar': true,
                                'dynamicQueryCriteriaCalendarPrompt0': 'From: ',
                                'dynamicQueryCriteriaCalendarPrompt1': 'To: ',
                                'dynamicQueryCriteriaCalendarPlaceHolder0': 'Select "From" date',
                                'dynamicQueryCriteriaCalendarPlaceHolder1': 'Select "To" date'
                            }
                        }
                    ]
                },
                {
                    'parentMenuName': 'Study Date',
                    'criteriaObjects': [
                        {
                            'criteriaMenuText': 'Equals',
                            'configuration': {
                                'dynamicQueryCriteriaClearButton': true,
                                'dynamicQueryCriteriaOpenCloseButton': true,
                                'dynamicQueryCriteriaHeading': 'Study Date',
                                'dynamicQueryCriteriaApplyCheckbox': true,
                                'dynamicQueryCriteriaApplyText': 'Apply "Study Date"',
                                'dynamicQueryCriteriaAllowNoChoice': true,
                                'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                                'dynamicQueryCriteriaCalendar': true,
                                'dynamicQueryCriteriaCalendarPrompt0': 'Equals: ',
                                'dynamicQueryCriteriaCalendarPlaceHolder0': 'Select "Study Date"'
                            }
                        },
                        {
                            'criteriaMenuText': 'Less Than',
                            'configuration': {
                                'dynamicQueryCriteriaClearButton': true,
                                'dynamicQueryCriteriaOpenCloseButton': true,
                                'dynamicQueryCriteriaHeading': 'Study (less than) Date',
                                'dynamicQueryCriteriaApplyCheckbox': true,
                                'dynamicQueryCriteriaApplyText': 'Apply "Study less than Date"',
                                'dynamicQueryCriteriaAllowNoChoice': true,
                                'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                                'dynamicQueryCriteriaCalendar': true,
                                'dynamicQueryCriteriaCalendarPrompt0': 'Less Than: ',
                                'dynamicQueryCriteriaCalendarPlaceHolder0': 'Select "Less than Date"'
                            }
                        },
                        {
                            'criteriaMenuText': 'Greater Than',
                            'configuration': {
                                'dynamicQueryCriteriaClearButton': true,
                                'dynamicQueryCriteriaOpenCloseButton': true,
                                'dynamicQueryCriteriaHeading': 'Study (greater than) Date',
                                'dynamicQueryCriteriaApplyCheckbox': true,
                                'dynamicQueryCriteriaApplyText': 'Apply "Study greater than Date"',
                                'dynamicQueryCriteriaAllowNoChoice': true,
                                'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                                'dynamicQueryCriteriaCalendar': true,
                                'dynamicQueryCriteriaCalendarPrompt0': 'Greater Than: ',
                                'dynamicQueryCriteriaCalendarPlaceHolder0': 'Select "Greater than Date"'
                            }
                        }
                    ]
                }
            ]
        };
    }

    onOmitChange( n ) {
        this.omit[n] = true;
        this.and[n] = false;
        this.or[n] = false;
    }

    onAndChange( n ) {
        this.omit[n] = false;
        this.and[n] = true;
        this.or[n] = false;
    }

    onOrChange( n ) {
        this.omit[n] = false;
        this.and[n] = false;
        this.or[n] = true;
    }

    onCriteriaOptionRadioClick( i, n ) {
        this.option[n] = i;
    }


    criteriaSelectionMenuClose() {
        this.commonService.showCriteriaSelectionMenu( false );
    }

    onCriteriaSelectionMenuCancelClick() {
        this.commonService.showCriteriaSelectionMenu( false );
    }

    onCriteriaSelectionMenuOkayClick() {
        for( let n = 0; n < this.criteriaData['data'].length; n++ ){
            if( this.omit[n] !== true ){
                let critJson0 = this.criteriaData['data'][n]['criteriaObjects'][this.option[n]];
                this.criteriaSelectionMenuService.addElementUsed( n, this.option[n] )
                // Add the widget
                this.dynamicQueryCriteriaService.initWidget( critJson0['configuration'] );
            }
        }
        this.commonService.showCriteriaSelectionMenu( false );
    }

    /////////////////////////
    onDragBegin( e ) {
        this.handleMoving = true;
    }

    onMoveEnd( e ) {
        this.handleMoving = false;
    }


    ngOnDestroy()
        :
        void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
