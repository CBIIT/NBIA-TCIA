import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { PreferencesService } from '@app/preferences/preferences.service';
import { Subject } from 'rxjs';
import {
    AllAnyTypes,
    AndOrTypes,
    CriteriaTypes
} from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component';

@Component( {
    selector: 'nbia-widget',
    templateUrl: './widget.component.html',
    styleUrls: ['./widget.component.scss', '../../left-section/left-section.component.scss']
} )
export class WidgetComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges{
    @Input() queryCriteriaData;
    sequenceNumber = -1;

    criteriaCalendar = false;
    criteriaCalendarAllowOneEmpty = false;
    criteriaCalendarPrompt0 = '';
    criteriaCalendarPrompt1 = '';
    criteriaCalendarPlaceHolder0 = '';
    criteriaCalendarPlaceHolder1 = '';

    currentFont;
    widgetShowCriteria = true;
    searchToolTip = 'Widget tool tip';
    showListSearch = false;
    listSearchInput = '';
    itemList = [];
    listSearchInputHold = '';
    listSearchResultsCount = 0;
    listCheckboxes = [];
    criteriaTextInputText = '';
    // isCheckboxList = false;
    // isRadioList = false;
    currentFilterSearch = '';
    criteriaType;

    criteriaTypes = CriteriaTypes;
    andOrRadio = [];
    allAnyRadio = [];
    andOrTypes = AndOrTypes;  // TODO delete me soon
    allAnyTypes = AllAnyTypes;  // TODO delete me soon

    haveInput = false;
    andOrOptions = ['And', 'Or']; // We use the index of these, don't change the sequence. FIXME
    allAnyOptions = ['All', 'Any']; // We use the index of these, don't change the sequence. FIXME


    //  criteriaName = '';
    criteriaHeading = '';
    criteriaSubheading = '';
    criteriaApplyButton = false;
    criteriaApplyCheckbox = false;
    criteriaApplyText = '';
    criteriaOpenCloseButton = true;
    criteriaClearButton = true;
    criteriaIsSearchable = true;

    criteriaAndOrType = ''; // AndOrTypes.AND_OR;
    criteriaAndOrDefault = 'and';

    criteriaAllAnyType = ''; // AllAnyTypes.ALL_ANY
    criteriaAllAnyDefault = 'any';

    criteriaSort = true;
    criteriaSmallTextInput = false;
    criteriaLargeTextInput = false;
    criteriaMultiChoiceList = false;
    criteriaNumberInput = false;
    criteriaNumberInputDefault = 0;
    criteriaNumberInputLimitLow = 0;
    criteriaNumberInputLimitHigh = 1000;


    criteriaSingleLineRadio = false;
    criteriaSingleLineRadioCurrent = -1;
    criteriaSingleLineRadioDefault = -1;
    criteriaSingleLineRadioOptions = [];
    /*
        criteriaSingleLineRadio0 = '';
        criteriaSingleLineRadio1 = '';
        criteriaSingleLineRadio2 = '';
    */

    criteriaSingleCheckbox = false;
    criteriaSingleCheckboxDefault = false;
    criteriaSingleChoiceList = false;
    criteriaAllowNoChoice = true;

    criteriaRequired = false;
    criteriaHeadingAddOn = '';
    criteriaSelectionInHeadingCollapsed = false;


    date0;
    date1;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private preferencesService: PreferencesService ) {
    }

    ngOnInit() {
        // Get font size when it changes
        this.preferencesService.setFontSizePreferencesEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.currentFont = data;
            } );
        // Get the initial font size value
        this.currentFont = this.preferencesService.getFontSize();

        this.initParameters();
    }


    /**
     * I don't use the queryCriteriaData['xxx'] directly because I anticipate a future need to modify these values.
     */
    initParameters() {

        if( this.queryCriteriaData['dynamicQueryCriteriaAndOrDefault'] !== undefined ){
            this.andOrRadio[0] = (this.queryCriteriaData['dynamicQueryCriteriaAndOrDefault'].toUpperCase() === 'AND');
            this.andOrRadio[1] = (this.queryCriteriaData['dynamicQueryCriteriaAndOrDefault'].toUpperCase() !== 'AND');
        }

        if( this.queryCriteriaData['dynamicQueryCriteriaAllAnyDefault'] !== undefined ){
            this.allAnyRadio[0] = (this.queryCriteriaData['dynamicQueryCriteriaAllAnyDefault'].toUpperCase() === 'ALL');
            this.allAnyRadio[1] = (this.queryCriteriaData['dynamicQueryCriteriaAllAnyDefault'].toUpperCase() !== 'ALL');
        }

        this.sequenceNumber = this.queryCriteriaData['sequenceNumber'];
        // this.criteriaName = this.queryCriteriaData['dynamicQueryCriteria'];

        this.criteriaHeading = this.queryCriteriaData['dynamicQueryCriteriaHeading'];
        this.criteriaRequired = this.queryCriteriaData['dynamicQueryCriteriaRequired'];
        this.criteriaSubheading = this.queryCriteriaData['dynamicQueryCriteriaSubHeading'];
        this.criteriaApplyButton = this.queryCriteriaData['dynamicQueryCriteriaApplyButton'];
        this.criteriaApplyCheckbox = this.queryCriteriaData['dynamicQueryCriteriaApplyCheckbox'];
        this.criteriaApplyText = this.queryCriteriaData['dynamicQueryCriteriaApplyText'];
        this.criteriaOpenCloseButton = this.queryCriteriaData['dynamicQueryCriteriaOpenCloseButton'];
        this.criteriaClearButton = this.queryCriteriaData['dynamicQueryCriteriaClearButton'];
        this.criteriaIsSearchable = this.queryCriteriaData['dynamicQueryCriteriaSearchable'];
        this.criteriaSmallTextInput = this.queryCriteriaData['dynamicQueryCriteriaSmallTextInput'];
        this.criteriaLargeTextInput = this.queryCriteriaData['dynamicQueryCriteriaLargeTextInput'];
        this.criteriaMultiChoiceList = this.queryCriteriaData['dynamicQueryCriteriaMultiChoiceList'];
        this.criteriaSingleCheckbox = this.queryCriteriaData['dynamicQueryCriteriaSingleCheckbox'];
        this.criteriaNumberInput = this.queryCriteriaData['dynamicQueryCriteriaNumber'];
        this.criteriaNumberInputDefault = this.queryCriteriaData['dynamicQueryCriteriaNumberDefault'];
        this.criteriaNumberInputLimitHigh = this.queryCriteriaData['dynamicQueryCriteriaNumberLimitHigh'];
        this.criteriaNumberInputLimitLow = this.queryCriteriaData['dynamicQueryCriteriaNumberLimitLow'];
        this.criteriaSelectionInHeadingCollapsed = this.queryCriteriaData['dynamicQueryCriteriaSelectionInHeadingCollapsed'];

        this.criteriaCalendar = this.queryCriteriaData['dynamicQueryCriteriaCalendar'];
        this.criteriaCalendarPrompt0 = this.queryCriteriaData['dynamicQueryCriteriaCalendarPrompt0'];
        this.criteriaCalendarPrompt1 = this.queryCriteriaData['dynamicQueryCriteriaCalendarPrompt1'];
        this.criteriaCalendarPlaceHolder0 = this.queryCriteriaData['dynamicQueryCriteriaCalendarPlaceHolder0'];
        this.criteriaCalendarPlaceHolder1 = this.queryCriteriaData['dynamicQueryCriteriaCalendarPlaceHolder1'];
        this.criteriaCalendarPlaceHolder1 = this.queryCriteriaData['dynamicQueryCriteriaCalendarPlaceHolder1'];
        this.criteriaCalendarAllowOneEmpty = this.queryCriteriaData['dynamicQueryCriteriaCalendarAllowOneEmpty'];
        this.criteriaSingleLineRadio = this.queryCriteriaData['dynamicQueryCriteriaSingleLineRadio'];
        this.criteriaSingleLineRadioDefault = this.queryCriteriaData['dynamicQueryCriteriaSingleLineRadioDefault'];

        this.criteriaSingleLineRadioOptions[0] = this.queryCriteriaData['dynamicQueryCriteriaSingleLineRadio0'];
        this.criteriaSingleLineRadioOptions[1] = this.queryCriteriaData['dynamicQueryCriteriaSingleLineRadio1'];
        this.criteriaSingleLineRadioOptions[2] = this.queryCriteriaData['dynamicQueryCriteriaSingleLineRadio2'];
        if( this.criteriaSingleLineRadio ){
            this.criteriaHeadingAddOn = this.criteriaSingleLineRadioOptions[this.criteriaSingleLineRadioDefault];
        }
        /*
                this.criteriaSingleLineRadio0 = this.queryCriteriaData['dynamicQueryCriteriaSingleLineRadio0'];
                this.criteriaSingleLineRadio1 = this.queryCriteriaData['dynamicQueryCriteriaSingleLineRadio1'];
                this.criteriaSingleLineRadio2 = this.queryCriteriaData['dynamicQueryCriteriaSingleLineRadio2'];
        */

        this.criteriaSingleCheckboxDefault = this.queryCriteriaData['dynamicQueryCriteriaSingleCheckboxDefault'];

        this.criteriaSingleChoiceList = this.queryCriteriaData['dynamicQueryCriteriaSingleChoiceList'];

        this.criteriaAllowNoChoice = this.queryCriteriaData['dynamicQueryCriteriaAllowNoChoice'];
        this.criteriaSort = this.queryCriteriaData['dynamicQueryCriteriaSort'];

        if( this.queryCriteriaData['dynamicQueryCriteriaListData'] !== undefined && this.queryCriteriaData['dynamicQueryCriteriaListData'].length > 0 ){
            this.initItemList( this.queryCriteriaData['dynamicQueryCriteriaListData'] );
        }
        /*

                if (this.queryCriteriaData['dynamicQueryCriteriaSmallTextInput'] !== undefined && this.queryCriteriaData['dynamicQueryCriteriaSmallTextInput']) {
                    this.criteriaType = CriteriaTypes.TEXT_INPUT_SMALL;
                }
                if (this.queryCriteriaData['dynamicQueryCriteriaLargeTextInput'] !== undefined && this.queryCriteriaData['dynamicQueryCriteriaLargeTextInput']) {
                    this.criteriaType = CriteriaTypes.TEXT_INPUT_LARGE;
                }

        */
        if( this.queryCriteriaData['dynamicQueryCriteriaAndOrType'] !== undefined && this.queryCriteriaData['dynamicQueryCriteriaAndOrType'].length > 0 ){
            this.criteriaAndOrType = this.queryCriteriaData['dynamicQueryCriteriaAndOrType'].toUpperCase();
        }
        if( this.queryCriteriaData['dynamicQueryCriteriaAndOrDefault'] !== undefined ){
            this.criteriaAndOrDefault = this.queryCriteriaData['dynamicQueryCriteriaAndOrDefault'].toUpperCase();
        }

        if( this.queryCriteriaData['dynamicQueryCriteriaAllAnyType'] !== undefined && this.queryCriteriaData['dynamicQueryCriteriaAllAnyType'].length > 0 ){
            this.criteriaAllAnyType = this.queryCriteriaData['dynamicQueryCriteriaAllAnyType'].toUpperCase();
        }

        if( this.queryCriteriaData['dynamicQueryCriteriaAllAnyDefault'] !== undefined ){
            this.criteriaAllAnyDefault = this.queryCriteriaData['dynamicQueryCriteriaAllAnyDefault'].toUpperCase();
        }


    }

    /**
     * Creates the list of options to be displayed.
     * Adds the field "include" which is used for filtering the list (Red magnifying glass).
     *
     * Initializes the listCheckboxes array (which is named badly, they may be radio buttons)
     * @param origList
     */
    initItemList( origList ) {
        for( let n = 0; n < origList.length; n++ ){
            this.itemList[n] = {};
            this.itemList[n]['value'] = origList[n];
            this.itemList[n]['include'] = true;
            this.listCheckboxes[n] = false;
        }

        // Sort
        if( this.criteriaSort ){
            this.itemList.sort( ( a, b ) =>
                a['value'].toUpperCase().localeCompare( b['value'].toUpperCase() )
            );
        }

        if( !this.criteriaAllowNoChoice ){
            this.listCheckboxes[0] = true;
        }


        // If criteriaAllowNoChoice is false, we must select the first element in the list.
        if( this.criteriaAllowNoChoice ){
            this.haveInput = false;
        }else{
            this.haveInput = true;
            this.listCheckboxes[0] = true;
        }

        // TODO
        if( this.criteriaSingleChoiceList && (!this.criteriaAllowNoChoice) ){
            this.criteriaHeadingAddOn = this.itemList[0]['value'];
        }

    }

    onCriteriaClicked( i ) {
        if( this.criteriaSingleChoiceList ){
            for( let n = 0; n < this.listCheckboxes.length; n++ ){
                this.listCheckboxes[n] = false;
            }
            this.listCheckboxes[i] = true;
            this.criteriaHeadingAddOn = this.itemList[i]['value'];
        }else if( this.criteriaMultiChoiceList ){
            this.listCheckboxes[i] = !this.listCheckboxes[i]['value'];
        }

        this.doHaveInput();
    }

    clearItemList() {
        for( let n = 0; n < this.listCheckboxes.length; n++ ){
            this.listCheckboxes[n] = false;
        }
        if( this.criteriaAllowNoChoice ){
            this.haveInput = false;
        }else{
            this.haveInput = true;
            this.listCheckboxes[0] = true;
        }

    }

    doHaveInput() {
        this.haveInput = false;
        if( this.criteriaSingleChoiceList || this.criteriaMultiChoiceList ){
            for( let box of this.listCheckboxes ){
                if( box ){
                    this.haveInput = true;
                    return;
                }
            }
        }else if( this.criteriaSmallTextInput || this.criteriaLargeTextInput ){
            this.haveInput = this.criteriaTextInputText.length > 0;
        }
    }


    onShowCriteriaClick( state ) {
        this.widgetShowCriteria = state;
    }

    onApplyCriteriaClick() {
        console.log( 'MHL WidgetComponent WidgetComponent' );
    }

    onRemoveCriteriaClick() {
        console.log( 'MHL WidgetComponent onRemoveCriteriaClick' );
    }

    onSearchGlassClick() {
        this.showListSearch = (!this.showListSearch);
        if( !this.showListSearch ){
            this.onSearchReset();
            this.listSearchInputHold = this.listSearchInput;
            this.listSearchInput = '';
        }else{
            this.listSearchInput = this.listSearchInputHold;
        }
        this.onSearchChange( this.listSearchInput );
    }

    onSearchReset() {
        for( let item of this.itemList ){
            item['include'] = true;
        }
    }

    onClearClick() {
        if( this.criteriaSmallTextInput || this.criteriaLargeTextInput ){
            this.criteriaTextInputText = '';
        }else{
            for( let n = 0; n < this.listCheckboxes.length; n++ ){
                this.listCheckboxes[n] = false;
            }
            this.onSearchChange( this.currentFilterSearch );
        }

        if( !this.criteriaAllowNoChoice ){
            this.listCheckboxes[0] = true;
        }
        this.doHaveInput();
    }

    onTextInputChange() {
        this.doHaveInput();
    }

    onSearchChange( e ) {
        this.currentFilterSearch = e;
        this.listSearchResultsCount = 0;

        let n = 0;
        let counter = 0;
        for( let item of this.itemList ){
            item['include'] = !!(
                item['value']
                    .toUpperCase()
                    .includes( e.toUpperCase() ) || this.listCheckboxes[n]
            );
            if( item['include'] ){
                this.listSearchResultsCount++;
            }
            n++;
        }
    }


    onSearchTextOutFocus( n ) {
        console.log( 'MHL onSearchTextOutFocus: ', n );
    }

    onSearchTextFocus( n ) {
        console.log( 'MHL onSearchTextFocus: ', n );
    }

    onWidgetAndOrRadioClick( i ) {
        console.log( 'MHL onWidgetAndOrRadioClick: ', i );
    }

    onWidgetAllAnyRadioClick( i ) {
        console.log( 'MHL onWidgetAllAnyRadioClick: ', i );
    }

    onSingleLineRadioChange( i ) {
        this.criteriaSingleLineRadioCurrent = i;
        this.criteriaHeadingAddOn = this.criteriaSingleLineRadioOptions[i];
        /*       switch(i){
                   case 0:
                       this.criteriaHeadingAddOn = this.criteriaSingleLineRadio0;
                       break;
                   case 1:
                       this.criteriaHeadingAddOn = this.criteriaSingleLineRadio1;
                       break;
                   case 2:
                       this.criteriaHeadingAddOn = this.criteriaSingleLineRadio2;
                       break;
               }
       */
    }

    displayParameters() {
        // console.log('this.criteriaName: ', this.criteriaName);
        console.log( 'this.criteriaRequired: ', this.criteriaRequired );
        console.log( 'this.criteriaHeading: ', this.criteriaHeading );
        console.log( 'this.criteriaSubheading: ', this.criteriaSubheading );
        console.log( 'this.criteriaApplyButton: ', this.criteriaApplyButton );
        console.log( 'this.criteriaApplyCheckbox: ', this.criteriaApplyCheckbox );
        console.log( 'this.criteriaApplyButtonText: ', this.criteriaApplyText );
        console.log( 'this.criteriaOpenCloseButton: ', this.criteriaOpenCloseButton );
        console.log( 'this.criteriaClearButton: ', this.criteriaClearButton );
        console.log( 'this.criteriaIsSearchable: ', this.criteriaIsSearchable );
        console.log( 'MHL this.criteriaAndOrType: ', this.criteriaAndOrType );
        console.log( 'MHL this.criteriaAllAnyType: ', this.criteriaAllAnyType );
        console.log( 'this.criteriaAndOrDefault: ', this.criteriaAndOrDefault );
        console.log( 'this.criteriaAllowNoChoice: ', this.criteriaAllowNoChoice );
        console.log( 'this.criteriaSort: ', this.criteriaSort );
        console.log( 'this.criteriaSmallTextInput: ', this.criteriaSmallTextInput );
        console.log( 'this.criteriaLargeTextInput: ', this.criteriaLargeTextInput );
    }


    ngAfterViewInit(): void {
        //  this.displayParameters();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    ngOnChanges( changes: SimpleChanges ) {
        /*
                for (let propName in changes) {
                    let chng = changes[propName];
                    let cur  = JSON.stringify(chng.currentValue);
                    let prev = JSON.stringify(chng.previousValue);
                  //  this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
                    console.log('MHL ngOnChanges: ', `${propName}: currentValue = ${cur}, previousValue = ${prev}`);
                }
        */
        // console.log('MHL changes: ', changes);
    }
}
