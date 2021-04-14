import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicQueryCriteriaService } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.service';
import { CommonService } from '@app/admin-common/services/common.service';
import { CriteriaSelectionMenuService } from '@app/criteria-selection-menu/criteria-selection-menu.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from '@app/admin-common/services/api.service';
import { Consts, TokenStatus } from '@app/constants';
import { AccessTokenService } from '@app/admin-common/services/access-token.service';
import { UtilService } from '@app/admin-common/services/util.service';

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
    criteriaData = [];
    requiredCriteriaData = [];
    elementsUsed = [];
    elementsUsedUp = [];
    allDataInitialized = false;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private dynamicQueryCriteriaService: DynamicQueryCriteriaService,
                 private criteriaSelectionMenuService: CriteriaSelectionMenuService, private apiService: ApiService,
                 private accessTokenService: AccessTokenService, private utilService: UtilService ) {
    }

    ngOnInit() {
        this.elementsUsed = this.criteriaSelectionMenuService.getElementsUsed();
        this.init();
    }

    async init() {
        this.apiService.getDynamicCriteriaSelectionMenuDataResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            async data => {
                // There are cases where this can be called more than once.
                if(this.criteriaData.length < 1 ){
                    this.criteriaData = data;
this.criteriaSelectionMenuService.initElementsUsed( this.criteriaData );
this.elementsUsed = this.criteriaSelectionMenuService.getElementsUsed();

                    // Set all criteria to "Omit"
                    for( let n = 0; n < this.criteriaData.length; n++ ){
                        this.omit[n] = true;
                    }

                    for( let n = 0; n < this.criteriaData.length; n++ ){
                        for( let i = 0; i < this.criteriaData[n]['criteriaObjects'].length; i++ ){

                            // Required criteria
                            if( (this.criteriaData[n]['criteriaObjects'][i]['configuration']['dynamicQueryCriteriaRequired'] !== undefined) && (this.criteriaData[n]['criteriaObjects'][i]['configuration']['dynamicQueryCriteriaRequired']) ){
                                // Add the widget
                                this.omit[n] = false;
                                this.or[n] = false;
                                this.and[n] = true;
                                this.elementsUsed[n][i] = true;
                                this.criteriaData[n]['criteriaObjects'][i]['configuration']['widgetAndOrOr'] = 'AND'; // AND is the default.
                                this.requiredCriteriaData.push( this.criteriaData[n]['criteriaObjects'][i]['configuration'] );
                            }
                            // END if Required criteria
                        }
                    }
this.criteriaSelectionMenuService.setRequiredCriteriaData( this.requiredCriteriaData );
                }
            } );

        this.dynamicQueryCriteriaService.deleteWidgetEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            item => {
                for( let n = 0; n < this.criteriaData.length; n++ ){
                    for( let i = 0; i < this.criteriaData[n]['criteriaObjects'].length; i++ ){
                        if( (item['criteriaType'] === this.criteriaData[n]['criteriaObjects'][i]['configuration']['criteriaType']) &&
                            (item['inputType'] === this.criteriaData[n]['criteriaObjects'][i]['configuration']['inputType']) ){
                            this.elementsUsed[n][i] = false;
                        }
                    }
                }

                for( let n = 0; n < this.criteriaData.length; n++ ){

                    let stillUsed = false;
                    for( let i = 0; i < this.criteriaData[n]['criteriaObjects'].length; i++ ){
                        if( this.elementsUsed[n][i] ){
                            stillUsed = true;
                        }
                    }
                    if( !stillUsed ){
                        this.and[n] = false;
                        this.or[n] = false;
                        this.omit[n] = true;
                    }
                }

            } );


        this.commonService.showCriteriaSelectionMenuEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                if( data ){
                    // We have just been "Shown" update the already used options
                    for( let n = 0; n < this.criteriaData.length; n++ ){
                        this.omit[n] = true;

                        let anyLeft = false;
                        for( let i = 0; i < this.elementsUsed[n].length; i++ ){
                            if( !this.elementsUsed[n][i] ){
                                this.option[n] = i;  // The starting default
                                anyLeft = true;
                                break;
                            }
                        }
                        if( !anyLeft ){
                            this.elementsUsedUp[n] = true;
                        }
                    }

                }
            } );


        // Wait until we have the access token before getting the dynamic criteria selection menu data.
        while(
            this.accessTokenService.getAccessTokenStatus() === TokenStatus.NO_TOKEN_YET ||
            this.accessTokenService.getAccessTokenStatus() === TokenStatus.NO_TOKEN ||
            this.accessTokenService.getAccessTokenStatus() === -1
            ){
            await this.utilService.sleep( Consts.waitTime );
        }
        this.apiService.getDynamicCriteriaSelectionMenuData();
        // Wait until we have the data for the dynamic criteria selection menu data. @TODO There has to be a better way...
        while(
            this.criteriaData.length < 1
            ){
            await this.utilService.sleep( Consts.waitTime );
        }

        this.allDataInitialized = true;

    }

    initTestData0() {
        this.criteriaData = [
            {
                'parentMenuName': 'SeriesUID',
                'criteriaObjects': [
                    {
                        'criteriaMenuText': 'List',
                        'configuration': {
                            'dynamicQueryCriteriaAllowNoChoice': true,
                            'dynamicQueryCriteriaApplyButton': true,
                            'dynamicQueryCriteriaApplyText': 'Okay',
                            'dynamicQueryCriteriaCalendar': false,
                            'dynamicQueryCriteriaCalendarPlaceHolder0': 'CCC',
                            'dynamicQueryCriteriaCalendarPlaceHolder1': 'DDD',
                            'dynamicQueryCriteriaCalendarPrompt0': 'AAA',
                            'dynamicQueryCriteriaCalendarPrompt1': 'BBB',
                            'dynamicQueryCriteriaClearButton': true,
                            'dynamicQueryCriteriaHeading': 'Series UID List',
                            'dynamicQueryCriteriaLargeTextInput': true,
                            'dynamicQueryCriteriaListData': [],
                            'dynamicQueryCriteriaOpenCloseButton': true,
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'dynamicQueryCriteriaSingleLineRadioDefault': 2,
                            'dynamicQueryCriteriaSort': true,
                            'dynamicQueryCriteriaSubHeading': 'Enter comma separated ID(s)',
                            'criteriaType': 'seriesUID',
                            'inputType': 'list'
                        }
                    },
                    {
                        'criteriaMenuText': 'Starts With',
                        'configuration': {
                            'dynamicQueryCriteriaAllowNoChoice': true,
                            'dynamicQueryCriteriaApplyButton': true,
                            'dynamicQueryCriteriaApplyText': 'Okay',
                            'dynamicQueryCriteriaCalendar': false,
                            'dynamicQueryCriteriaCalendarPlaceHolder0': 'CCC',
                            'dynamicQueryCriteriaCalendarPlaceHolder1': 'DDD',
                            'dynamicQueryCriteriaCalendarPrompt0': 'AAA',
                            'dynamicQueryCriteriaCalendarPrompt1': 'BBB',
                            'dynamicQueryCriteriaClearButton': true,
                            'dynamicQueryCriteriaHeading': 'Series UID',
                            'dynamicQueryCriteriaListData': [],
                            'dynamicQueryCriteriaOpenCloseButton': true,
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'dynamicQueryCriteriaSingleLineRadioDefault': 2,
                            'dynamicQueryCriteriaSmallTextInput': true,
                            'dynamicQueryCriteriaSort': true,
                            'dynamicQueryCriteriaSubHeading': 'Enter Series UID',
                            'criteriaType': 'seriesUID',
                            'inputType': 'startsWith'
                        }
                    }
                ]
            },
            {
                'parentMenuName': 'StudyUID',
                'criteriaObjects': [
                    {
                        'criteriaMenuText': 'List',
                        'configuration': {
                            'dynamicQueryCriteriaAllowNoChoice': true,
                            'dynamicQueryCriteriaApplyButton': true,
                            'dynamicQueryCriteriaApplyText': 'Okay',
                            'dynamicQueryCriteriaCalendar': false,
                            'dynamicQueryCriteriaCalendarPlaceHolder0': 'CCC',
                            'dynamicQueryCriteriaCalendarPlaceHolder1': 'DDD',
                            'dynamicQueryCriteriaCalendarPrompt0': 'AAA',
                            'dynamicQueryCriteriaCalendarPrompt1': 'BBB',
                            'dynamicQueryCriteriaClearButton': true,
                            'dynamicQueryCriteriaHeading': 'Study UID List',
                            'dynamicQueryCriteriaLargeTextInput': true,
                            'dynamicQueryCriteriaListData': [],
                            'dynamicQueryCriteriaOpenCloseButton': true,
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'dynamicQueryCriteriaSingleLineRadioDefault': 2,
                            'dynamicQueryCriteriaSort': true,
                            'dynamicQueryCriteriaSubHeading': 'Enter comma separated ID(s)',
                            'criteriaType': 'studyUID',
                            'inputType': 'list'
                        }
                    },
                    {
                        'criteriaMenuText': 'Starts With',
                        'configuration': {
                            'dynamicQueryCriteriaAllowNoChoice': true,
                            'dynamicQueryCriteriaApplyButton': true,
                            'dynamicQueryCriteriaApplyText': 'Okay',
                            'dynamicQueryCriteriaCalendar': false,
                            'dynamicQueryCriteriaCalendarPlaceHolder0': 'CCC',
                            'dynamicQueryCriteriaCalendarPlaceHolder1': 'DDD',
                            'dynamicQueryCriteriaCalendarPrompt0': 'AAA',
                            'dynamicQueryCriteriaCalendarPrompt1': 'BBB',
                            'dynamicQueryCriteriaClearButton': true,
                            'dynamicQueryCriteriaHeading': 'Study UID',
                            'dynamicQueryCriteriaListData': [],
                            'dynamicQueryCriteriaOpenCloseButton': true,
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'dynamicQueryCriteriaSingleLineRadioDefault': 2,
                            'dynamicQueryCriteriaSmallTextInput': true,
                            'dynamicQueryCriteriaSort': true,
                            'dynamicQueryCriteriaSubHeading': 'Enter Study UID',
                            'criteriaType': 'studyUID',
                            'inputType': 'startsWith'
                        }
                    }
                ]
            },
            {
                'parentMenuName': 'SOPUID',
                'criteriaObjects': [
                    {
                        'criteriaMenuText': 'List',
                        'configuration': {
                            'dynamicQueryCriteriaAllowNoChoice': true,
                            'dynamicQueryCriteriaApplyButton': true,
                            'dynamicQueryCriteriaApplyText': 'Okay',
                            'dynamicQueryCriteriaCalendar': false,
                            'dynamicQueryCriteriaCalendarPlaceHolder0': 'CCC',
                            'dynamicQueryCriteriaCalendarPlaceHolder1': 'DDD',
                            'dynamicQueryCriteriaCalendarPrompt0': 'AAA',
                            'dynamicQueryCriteriaCalendarPrompt1': 'BBB',
                            'dynamicQueryCriteriaClearButton': true,
                            'dynamicQueryCriteriaHeading': 'SOP UID List',
                            'dynamicQueryCriteriaLargeTextInput': true,
                            'dynamicQueryCriteriaListData': [],
                            'dynamicQueryCriteriaOpenCloseButton': true,
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'dynamicQueryCriteriaSingleLineRadioDefault': 2,
                            'dynamicQueryCriteriaSort': true,
                            'dynamicQueryCriteriaSubHeading': 'Enter comma separated ID(s)',
                            'criteriaType': 'sopUID',
                            'inputType': 'list'
                        }
                    },
                    {
                        'criteriaMenuText': 'Starts With',
                        'configuration': {
                            'dynamicQueryCriteriaAllowNoChoice': true,
                            'dynamicQueryCriteriaApplyButton': true,
                            'dynamicQueryCriteriaApplyText': 'Okay',
                            'dynamicQueryCriteriaCalendar': false,
                            'dynamicQueryCriteriaCalendarPlaceHolder0': 'CCC',
                            'dynamicQueryCriteriaCalendarPlaceHolder1': 'DDD',
                            'dynamicQueryCriteriaCalendarPrompt0': 'AAA',
                            'dynamicQueryCriteriaCalendarPrompt1': 'BBB',
                            'dynamicQueryCriteriaClearButton': true,
                            'dynamicQueryCriteriaHeading': 'SOP UID',
                            'dynamicQueryCriteriaListData': [],
                            'dynamicQueryCriteriaOpenCloseButton': true,
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'dynamicQueryCriteriaSingleLineRadioDefault': 2,
                            'dynamicQueryCriteriaSmallTextInput': true,
                            'dynamicQueryCriteriaSort': true,
                            'dynamicQueryCriteriaSubHeading': 'Enter SOP UID',
                            'criteriaType': 'sopUID',
                            'inputType': 'startsWith'
                        }
                    }
                ]
            },
            {
                'parentMenuName': 'PatientID',
                'criteriaObjects': [
                    {
                        'criteriaMenuText': 'List',
                        'configuration': {
                            'dynamicQueryCriteriaAllowNoChoice': true,
                            'dynamicQueryCriteriaApplyButton': true,
                            'dynamicQueryCriteriaApplyText': 'Okay',
                            'dynamicQueryCriteriaCalendar': false,
                            'dynamicQueryCriteriaCalendarPlaceHolder0': 'CCC',
                            'dynamicQueryCriteriaCalendarPlaceHolder1': 'DDD',
                            'dynamicQueryCriteriaCalendarPrompt0': 'AAA',
                            'dynamicQueryCriteriaCalendarPrompt1': 'BBB',
                            'dynamicQueryCriteriaClearButton': true,
                            'dynamicQueryCriteriaHeading': 'Patient ID List',
                            'dynamicQueryCriteriaLargeTextInput': true,
                            'dynamicQueryCriteriaListData': [],
                            'dynamicQueryCriteriaOpenCloseButton': true,
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'dynamicQueryCriteriaSingleLineRadioDefault': 2,
                            'dynamicQueryCriteriaSort': true,
                            'dynamicQueryCriteriaSubHeading': 'Enter comma separated ID(s)',
                            'criteriaType': 'patientID',
                            'inputType': 'list'
                        }
                    },
                    {
                        'criteriaMenuText': 'Starts With',
                        'configuration': {
                            'dynamicQueryCriteriaAllowNoChoice': true,
                            'dynamicQueryCriteriaApplyButton': true,
                            'dynamicQueryCriteriaApplyText': 'Okay',
                            'dynamicQueryCriteriaCalendar': false,
                            'dynamicQueryCriteriaCalendarPlaceHolder0': 'CCC',
                            'dynamicQueryCriteriaCalendarPlaceHolder1': 'DDD',
                            'dynamicQueryCriteriaCalendarPrompt0': 'AAA',
                            'dynamicQueryCriteriaCalendarPrompt1': 'BBB',
                            'dynamicQueryCriteriaClearButton': true,
                            'dynamicQueryCriteriaHeading': 'Patient ID',
                            'dynamicQueryCriteriaListData': [],
                            'dynamicQueryCriteriaOpenCloseButton': true,
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'dynamicQueryCriteriaSingleLineRadioDefault': 2,
                            'dynamicQueryCriteriaSmallTextInput': true,
                            'dynamicQueryCriteriaSort': true,
                            'dynamicQueryCriteriaSubHeading': 'Enter Patient ID',
                            'criteriaType': 'patientID',
                            'inputType': 'startsWith'
                        }
                    }
                ]
            },
            {
                'parentMenuName': 'PatientName',
                'criteriaObjects': [
                    {
                        'criteriaMenuText': 'List',
                        'configuration': {
                            'dynamicQueryCriteriaAllowNoChoice': true,
                            'dynamicQueryCriteriaApplyButton': true,
                            'dynamicQueryCriteriaApplyText': 'Okay',
                            'dynamicQueryCriteriaCalendar': false,
                            'dynamicQueryCriteriaCalendarPlaceHolder0': 'CCC',
                            'dynamicQueryCriteriaCalendarPlaceHolder1': 'DDD',
                            'dynamicQueryCriteriaCalendarPrompt0': 'AAA',
                            'dynamicQueryCriteriaCalendarPrompt1': 'BBB',
                            'dynamicQueryCriteriaClearButton': true,
                            'dynamicQueryCriteriaHeading': 'Patient Name List',
                            'dynamicQueryCriteriaLargeTextInput': true,
                            'dynamicQueryCriteriaListData': [],
                            'dynamicQueryCriteriaOpenCloseButton': true,
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'dynamicQueryCriteriaSingleLineRadioDefault': 2,
                            'dynamicQueryCriteriaSort': true,
                            'dynamicQueryCriteriaSubHeading': 'Enter comma separated Name(s)',
                            'criteriaType': 'patientName',
                            'inputType': 'list'
                        }
                    },
                    {
                        'criteriaMenuText': 'Starts With',
                        'configuration': {
                            'dynamicQueryCriteriaAllowNoChoice': true,
                            'dynamicQueryCriteriaApplyButton': true,
                            'dynamicQueryCriteriaApplyText': 'Okay',
                            'dynamicQueryCriteriaCalendar': false,
                            'dynamicQueryCriteriaCalendarPlaceHolder0': 'CCC',
                            'dynamicQueryCriteriaCalendarPlaceHolder1': 'DDD',
                            'dynamicQueryCriteriaCalendarPrompt0': 'AAA',
                            'dynamicQueryCriteriaCalendarPrompt1': 'BBB',
                            'dynamicQueryCriteriaClearButton': true,
                            'dynamicQueryCriteriaHeading': 'Patient ID',
                            'dynamicQueryCriteriaListData': [],
                            'dynamicQueryCriteriaOpenCloseButton': true,
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'dynamicQueryCriteriaSingleLineRadioDefault': 2,
                            'dynamicQueryCriteriaSmallTextInput': true,
                            'dynamicQueryCriteriaSort': true,
                            'dynamicQueryCriteriaSubHeading': 'Enter Patient Name',
                            'criteriaType': 'patientName',
                            'inputType': 'startsWith'
                        }
                    }
                ]
            },
            {
                'parentMenuName': 'Modality',
                'criteriaObjects': [
                    {
                        'criteriaMenuText': 'Select from List',
                        'configuration': {
                            'dynamicQueryCriteriaAllAnyType': 'ALLANY',
                            'dynamicQueryCriteriaAllAnyDefault': 'ANY',
                            'dynamicQueryCriteriaAllowNoChoice': true,
                            'dynamicQueryCriteriaCalendar': false,
                            'dynamicQueryCriteriaCalendarPlaceHolder0': 'CCC',
                            'dynamicQueryCriteriaCalendarPlaceHolder1': 'DDD',
                            'dynamicQueryCriteriaCalendarPrompt0': 'AAA',
                            'dynamicQueryCriteriaCalendarPrompt1': 'BBB',
                            'dynamicQueryCriteriaClearButton': true,
                            'dynamicQueryCriteriaHeading': 'Modality',
                            'dynamicQueryCriteriaListData': [
                                'CR',
                                'CT',
                                'DX',
                                'MG',
                                'MR',
                                'PT',
                                'RTSTRUCT',
                                'SEG'
                            ],
                            'dynamicQueryCriteriaMultiChoiceList': true,
                            'dynamicQueryCriteriaOpenCloseButton': true,
                            'dynamicQueryCriteriaSearchable': true,
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'dynamicQueryCriteriaSingleLineRadioDefault': 2,
                            'dynamicQueryCriteriaSort': true,
                            'criteriaType': 'modality',
                            'inputType': 'list'
                        }
                    }
                ]
            },
            {
                'parentMenuName': 'Series Description',
                'criteriaObjects': [
                    {
                        'criteriaMenuText': 'Contains',
                        'configuration': {
                            'dynamicQueryCriteriaAllowNoChoice': true,
                            'dynamicQueryCriteriaApplyButton': true,
                            'dynamicQueryCriteriaApplyText': 'Okay',
                            'dynamicQueryCriteriaCalendar': false,
                            'dynamicQueryCriteriaCalendarPlaceHolder0': 'CCC',
                            'dynamicQueryCriteriaCalendarPlaceHolder1': 'DDD',
                            'dynamicQueryCriteriaCalendarPrompt0': 'AAA',
                            'dynamicQueryCriteriaCalendarPrompt1': 'BBB',
                            'dynamicQueryCriteriaClearButton': true,
                            'dynamicQueryCriteriaHeading': 'Series Description',
                            'dynamicQueryCriteriaListData': [],
                            'dynamicQueryCriteriaOpenCloseButton': true,
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'dynamicQueryCriteriaSmallTextInput': true,
                            'dynamicQueryCriteriaSort': true,
                            'criteriaType': 'seriesDesc',
                            'inputType': 'contains'
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
                            'dynamicQueryCriteriaAllowNoChoice': true,
                            'dynamicQueryCriteriaCalendar': true,
                            'dynamicQueryCriteriaCalendarPlaceHolder0': '',
                            'dynamicQueryCriteriaCalendarPrompt0': 'Equals',
                            'dynamicQueryCriteriaClearButton': true,
                            'dynamicQueryCriteriaHeading': 'Study Date',
                            'dynamicQueryCriteriaListData': [],
                            'dynamicQueryCriteriaOpenCloseButton': true,
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'criteriaType': 'studyDate',
                            'inputType': 'dateRange'
                        }
                    }
                ]
            },
            {
                'parentMenuName': 'Study Date',
                'criteriaObjects': [
                    {
                        'criteriaMenuText': 'Less Than',
                        'configuration': {
                            'dynamicQueryCriteriaAllowNoChoice': true,
                            'dynamicQueryCriteriaCalendar': true,
                            'dynamicQueryCriteriaCalendarPlaceHolder0': '',
                            'dynamicQueryCriteriaCalendarPrompt0': 'Equals',
                            'dynamicQueryCriteriaClearButton': true,
                            'dynamicQueryCriteriaHeading': 'Less Than',
                            'dynamicQueryCriteriaListData': [],
                            'dynamicQueryCriteriaOpenCloseButton': true,
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'criteriaType': 'studyDate',
                            'inputType': 'dateTo'
                        }
                    }
                ]
            },
            {
                'parentMenuName': 'Study Date',
                'criteriaObjects': [
                    {
                        'criteriaMenuText': 'Greater Than',
                        'configuration': {
                            'dynamicQueryCriteriaAllowNoChoice': true,
                            'dynamicQueryCriteriaCalendar': true,
                            'dynamicQueryCriteriaCalendarPlaceHolder0': '',
                            'dynamicQueryCriteriaCalendarPrompt0': 'Equals',
                            'dynamicQueryCriteriaClearButton': true,
                            'dynamicQueryCriteriaHeading': 'Greater Than',
                            'dynamicQueryCriteriaListData': [],
                            'dynamicQueryCriteriaOpenCloseButton': true,
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'criteriaType': 'studyDate',
                            'inputType': 'dateFrom'
                        }
                    }
                ]
            },
            {
                'parentMenuName': 'Manufacturer',
                'criteriaObjects': [
                    {
                        'criteriaMenuText': 'Select from List',
                        'configuration': {
                            'dynamicQueryCriteriaAllAnyType': 'ALLANY',
                            'dynamicQueryCriteriaAllAnyDefault': 'ANY',
                            'dynamicQueryCriteriaAllowNoChoice': true,
                            'dynamicQueryCriteriaCalendar': false,
                            'dynamicQueryCriteriaCalendarPlaceHolder0': 'CCC',
                            'dynamicQueryCriteriaCalendarPlaceHolder1': 'DDD',
                            'dynamicQueryCriteriaCalendarPrompt0': 'AAA',
                            'dynamicQueryCriteriaCalendarPrompt1': 'BBB',
                            'dynamicQueryCriteriaClearButton': true,
                            'dynamicQueryCriteriaHeading': 'Manufacturer',
                            'dynamicQueryCriteriaListData': [
                                '',
                                '3D Slicer Community',
                                'ADAC',
                                'CPS',
                                'FUJI PHOTO FILM Co., ltd.',
                                'GE MEDICAL SYSTEMS',
                                'KODAK',
                                'LORAD',
                                'Philips',
                                'Philips Medical Systems',
                                'SIEMENS',
                                'TOSHIBA',
                                'Varian Imaging Laboratories, Switzerland'
                            ],
                            'dynamicQueryCriteriaMultiChoiceList': true,
                            'dynamicQueryCriteriaOpenCloseButton': true,
                            'dynamicQueryCriteriaSearchable': true,
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'dynamicQueryCriteriaSingleLineRadioDefault': 2,
                            'dynamicQueryCriteriaSort': true,
                            'criteriaType': 'manufacturer',
                            'inputType': 'list'
                        }
                    }
                ]
            }
        ]
    }

    /**
     * This will eventual query the server, for now just test data.
     */
    initTestData() {
        this.criteriaData = [
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
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'criteriaType': 'seriesUID',
                            'inputType': 'contains'
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
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'criteriaType': 'seriesUID',
                            'inputType': 'startsWith'
                        }
                    }
                ]
            },
            {
                'parentMenuName': 'Batch Number',
                'criteriaObjects': [
                    {
                        'criteriaMenuText': 'One number',
                        'configuration': {
                            'dynamicQueryCriteriaNumber': true,
                            'dynamicQueryCriteriaNumberDefault': 1,
                            'dynamicQueryCriteriaNumberLimitHigh': 10000,
                            'dynamicQueryCriteriaNumberLimitLow': 1,
                            'dynamicQueryCriteriaClearButton': true,
                            'dynamicQueryCriteriaHeading': 'Batch Number',
                            'dynamicQueryCriteriaApplyCheckbox': true,
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'criteriaType': 'batch',
                            'inputType': 'batchNumber'
                        }
                    }
                ]
            },
            {
                'parentMenuName': 'Released',
                'criteriaObjects': [
                    {
                        'criteriaMenuText': 'Yes, No, or Ignore',
                        'configuration': {
                            'dynamicQueryCriteriaNumberDefault': 2,
                            'dynamicQueryCriteriaNumberLimitHigh': 100,
                            'dynamicQueryCriteriaNumberLimitLow': 1,
                            'dynamicQueryCriteriaSingleLineRadio': true,
                            'dynamicQueryCriteriaSingleLineRadioDefault': 2,
                            'dynamicQueryCriteriaSingleLineRadio0': 'Yes',
                            'dynamicQueryCriteriaSingleLineRadio1': 'No',
                            'dynamicQueryCriteriaSingleLineRadio2': 'Ignore',
                            'dynamicQueryCriteriaClearButton': true,
                            'dynamicQueryCriteriaOpenCloseButton': true,
                            'dynamicQueryCriteriaHeading': 'Released',
                            'dynamicQueryCriteriaSort': true,
                            'dynamicQueryCriteriaAllowNoChoice': true,
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'criteriaType': 'released',
                            'inputType': 'number'
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
                            'dynamicQueryCriteriaSelectionInHeadingCollapsed': true,
                            'criteriaType': 'qcStatus',
                            'inputType': 'list'
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
                            'dynamicQueryCriteriaCalendarPlaceHolder1': 'Select "To" date',
                            'dynamicQueryCriteriaCalendarAllowOneEmpty': true,
                            'criteriaType': 'mostRecentSubmission',
                            'inputType': 'date'
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
                            'dynamicQueryCriteriaCalendarPlaceHolder0': 'Select "Study Date"',
                            'criteriaType': 'studyDate',
                            'inputType': 'equalsDate'
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
                            'dynamicQueryCriteriaCalendarPlaceHolder0': 'Select "Less than Date"',
                            'criteriaType': 'studyDate',
                            'inputType': 'lessThanDate'
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
                            'dynamicQueryCriteriaCalendarPlaceHolder0': 'Select "Greater than Date"',
                            'criteriaType': 'studyDate',
                            'inputType': 'greaterThanDate'
                        }
                    }
                ]
            }
        ]
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
        for( let n = 0; n < this.criteriaData.length; n++ ){
            if( this.omit[n] !== true ){
                let critJson0 = this.criteriaData[n]['criteriaObjects'][this.option[n]];

                // This is to remember what has all ready been selected in this menu and disable it when the user pops up this menu again.
                this.criteriaSelectionMenuService.addElementUsed( n, this.option[n] );

                // Add the And or Or from the radio buttons in popup menu
                // @TODO these should be constants.
                if( this.and[n] !== undefined && this.and[n] ){
                    critJson0['configuration']['widgetAndOrOr'] = 'AND';
                }else if( this.or[n] !== undefined && this.or[n] ){
                    critJson0['configuration']['widgetAndOrOr'] = 'OR';
                }

                // Add the widget
                this.dynamicQueryCriteriaService.addWidget( critJson0['configuration'] );
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


    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
