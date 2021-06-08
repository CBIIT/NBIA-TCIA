import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { PreferencesService } from '@app/preferences/preferences.service';
import { Subject } from 'rxjs';
import {
    AllAnyTypes,
    AndOrTypes,
    CriteriaTypes
} from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component';
import { DynamicQueryBuilderService } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-builder.service';
import { DynamicCriteriaQueryPart } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-criteria-query-part';
import { DynamicQueryCriteriaService } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.service';
import { ApiService } from '@app/admin-common/services/api.service';
import { DisplayDynamicQueryService } from '@app/tools/display-dynamic-query/display-dynamic-query/display-dynamic-query.service';
import { Consts } from '@app/constants';
import { UtilService } from '@app/admin-common/services/util.service';
import { WidgetCalendarComponent } from '@app/tools/query-section-module/dynamic-query-criteria/widget/widget-calendar/widget-calendar.component';
import { WidgetCalendarService } from '@app/tools/query-section-module/dynamic-query-criteria/widget/widget-calendar/widget-calendar.service';

export enum WIDGET_TYPE{
    UNKNOWN,
    NUMBER,
    TEXT,
    ITEM_LIST,
    ONE_LINE_RADIO_BUTTONS,
    ONE_CHECKBOX,
    CALENDAR
}

@Component( {
    selector: 'nbia-widget',
    templateUrl: './widget.component.html',
    styleUrls: ['./widget.component.scss', '../../left-section/left-section.component.scss']
} )
export class WidgetComponent implements OnInit, OnDestroy, AfterViewInit{
    @Input() queryCriteriaData;
    sequenceNumber = -1;
    widgetType = WIDGET_TYPE.UNKNOWN;


    /**
     * If the widget doesn't have an apply checkbox or button this should be set to true.
     * If it does have an apply checkbox or button, set this to false in ngOnInit.
     */
    applyState = false;

    criteriaCalendar = false;
    criteriaCalendarAllowOneEmpty = false;
    criteriaCalendarPrompt0 = '';
    criteriaCalendarPrompt1 = '';
    criteriaCalendarPlaceHolder0 = '';
    criteriaCalendarPlaceHolder1 = '';
    criteriaSingleCheckboxCalender = false;

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

    criteriaSingleCheckbox = false;
    criteriaSingleCheckboxDefault = false;
    criteriaSingleChoiceList = false;
    criteriaAllowNoChoice = true;

    criteriaRequired = false;
    criteriaHeadingAddOn = '';
    criteriaSelectionInHeadingCollapsed = false;

    /**
     * This will be used in the query returned to the server.
     */
    criteriaQueryType = '';
    /**
     * This will be used in the query returned to the server.
     */
    criteriaQueryInputType = '';

    criteriaLevelAndOrOr = '';

    isApplyCheckboxSet = false;

    date0;
    date1;

    //  haveInput = false;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private preferencesService: PreferencesService, private dynamicQueryBuilderService: DynamicQueryBuilderService,
                 private dynamicQueryCriteriaService: DynamicQueryCriteriaService, private apiService: ApiService,
                 private displayDynamicQueryService: DisplayDynamicQueryService, private utilService: UtilService,
                 private widgetCalendarService: WidgetCalendarService ) {

    }

    ngOnInit() {
        if( this.criteriaCalendar ){
            this.onClearClick( false ); // false = Do not rerun the query
        }

        // Get font size when it changes
        this.preferencesService.setFontSizePreferencesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
                this.currentFont = data;
            } );
        // Get the initial font size value
        this.currentFont = this.preferencesService.getFontSize();


        // When the "Clear" button in the Display query at the top is clicked.
        this.displayDynamicQueryService.clearDynamicQuerySectionQueryEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe( () => {
            this.onClearClick( false ); // false = Do not rerun the query
        } );

        // To know when the date has changed in Widget-calender
         this.widgetCalendarService.dateChange.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe( () => {
            if(this.applyState){
                this.onApplyCheckboxClick( true );
            }
        } );


        this.initParameters();

        // Set applyState to true if there is no Apply checkbox or button
        this.applyState = !(this.criteriaApplyCheckbox || this.criteriaApplyButton);

    }


    /**
     * I don't use the queryCriteriaData['xxx'] directly because I anticipate a future need to modify these values.
     */
    initParameters() {
        this.criteriaQueryType = this.queryCriteriaData['criteriaType'];
        this.criteriaQueryInputType = this.queryCriteriaData['inputType'];
        this.criteriaLevelAndOrOr = this.queryCriteriaData['widgetAndOrOr'];

        if( this.queryCriteriaData['dynamicQueryCriteriaAndOrDefault'] !== undefined ){
            this.andOrRadio[0] = (this.queryCriteriaData['dynamicQueryCriteriaAndOrDefault'].toUpperCase() === 'AND');
            this.andOrRadio[1] = (this.queryCriteriaData['dynamicQueryCriteriaAndOrDefault'].toUpperCase() !== 'AND');
        }

        if( this.queryCriteriaData['dynamicQueryCriteriaAllAnyDefault'] !== undefined ){
            this.allAnyRadio[0] = (this.queryCriteriaData['dynamicQueryCriteriaAllAnyDefault'].toUpperCase() === 'ALL');
            this.allAnyRadio[1] = (this.queryCriteriaData['dynamicQueryCriteriaAllAnyDefault'].toUpperCase() !== 'ALL');
        }

        this.sequenceNumber = this.queryCriteriaData['sequenceNumber'];

        this.criteriaHeading = this.queryCriteriaData['dynamicQueryCriteriaHeading'];
        this.criteriaRequired = this.queryCriteriaData['dynamicQueryCriteriaRequired'];
        this.criteriaSubheading = this.queryCriteriaData['dynamicQueryCriteriaSubHeading'];
        this.criteriaApplyButton = this.queryCriteriaData['dynamicQueryCriteriaApplyButton'];
        this.criteriaApplyCheckbox = this.queryCriteriaData['dynamicQueryCriteriaApplyCheckbox'];
        if( this.criteriaApplyCheckbox === undefined ){
            this.criteriaApplyCheckbox = false;
        }
        this.criteriaApplyText = this.queryCriteriaData['dynamicQueryCriteriaApplyText'];
        this.criteriaOpenCloseButton = this.queryCriteriaData['dynamicQueryCriteriaOpenCloseButton'];
        this.criteriaClearButton = this.queryCriteriaData['dynamicQueryCriteriaClearButton'];
        this.criteriaIsSearchable = this.queryCriteriaData['dynamicQueryCriteriaSearchable'];

        this.criteriaSmallTextInput = this.queryCriteriaData['dynamicQueryCriteriaSmallTextInput'];
        this.criteriaLargeTextInput = this.queryCriteriaData['dynamicQueryCriteriaLargeTextInput'];
        if( this.criteriaSmallTextInput || this.criteriaLargeTextInput ){
            this.widgetType = WIDGET_TYPE.TEXT;
        }

        this.criteriaSingleChoiceList = this.queryCriteriaData['dynamicQueryCriteriaSingleChoiceList'];
        this.criteriaMultiChoiceList = this.queryCriteriaData['dynamicQueryCriteriaMultiChoiceList'];
        if( this.criteriaMultiChoiceList || this.criteriaSingleChoiceList ){
            this.widgetType = WIDGET_TYPE.ITEM_LIST;
        }

        this.criteriaSingleCheckbox = this.queryCriteriaData['dynamicQueryCriteriaSingleCheckbox'];
        if( this.criteriaSingleCheckbox ){
            this.widgetType = WIDGET_TYPE.ONE_CHECKBOX;
        }
        this.criteriaNumberInput = this.queryCriteriaData['dynamicQueryCriteriaNumber'];
        if( this.criteriaNumberInput ){
            this.widgetType = WIDGET_TYPE.NUMBER;
        }
        this.criteriaNumberInputDefault = this.queryCriteriaData['dynamicQueryCriteriaNumberDefault'];
        this.criteriaNumberInputLimitHigh = this.queryCriteriaData['dynamicQueryCriteriaNumberLimitHigh'];
        this.criteriaNumberInputLimitLow = this.queryCriteriaData['dynamicQueryCriteriaNumberLimitLow'];
        this.criteriaSelectionInHeadingCollapsed = this.queryCriteriaData['dynamicQueryCriteriaSelectionInHeadingCollapsed'];

        this.criteriaCalendar = this.queryCriteriaData['dynamicQueryCriteriaCalendar'];
        if( this.criteriaCalendar ){
            this.widgetType = WIDGET_TYPE.CALENDAR;
        }
        this.criteriaCalendarPrompt0 = this.queryCriteriaData['dynamicQueryCriteriaCalendarPrompt0'];
        if( this.criteriaCalendarPrompt0 === undefined ){
            this.criteriaCalendarPrompt0 = '';
        }
        this.criteriaCalendarPrompt1 = this.queryCriteriaData['dynamicQueryCriteriaCalendarPrompt1'];
        if( this.criteriaCalendarPrompt1 === undefined ){
            this.criteriaCalendarPrompt1 = '';
        }
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
            this.widgetType = WIDGET_TYPE.ONE_LINE_RADIO_BUTTONS;
            this.criteriaSingleLineRadioCurrent = this.criteriaSingleLineRadioDefault;
        }
        /*
                this.criteriaSingleLineRadio0 = this.queryCriteriaData['dynamicQueryCriteriaSingleLineRadio0'];
                this.criteriaSingleLineRadio1 = this.queryCriteriaData['dynamicQueryCriteriaSingleLineRadio1'];
                this.criteriaSingleLineRadio2 = this.queryCriteriaData['dynamicQueryCriteriaSingleLineRadio2'];
        */

        this.criteriaSingleCheckboxDefault = this.queryCriteriaData['dynamicQueryCriteriaSingleCheckboxDefault'];


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
        /*
               console.log( 'MHL this.queryCriteriaData[\'dynamicQueryCriteriaAndOrType\']: ', this.queryCriteriaData['dynamicQueryCriteriaAndOrType'] );
               console.log( 'MHL this.queryCriteriaData[\'dynamicQueryCriteriaAndOrDefault\']: ', this.queryCriteriaData['dynamicQueryCriteriaAndOrDefault'] );
               console.log( 'MHL this.queryCriteriaData[\'dynamicQueryCriteriaAllAnyType\']: ', this.queryCriteriaData['dynamicQueryCriteriaAllAnyType'] );
               console.log( 'MHL this.criteriaAndOrType: ', this.criteriaAndOrType );
               console.log( 'MHL this.criteriaAndOrDefault: ', this.criteriaAndOrDefault );
               console.log( 'MHL this.criteriaAllAnyType: ', this.criteriaAllAnyType );
               console.log( 'MHL this.criteriaAllAnyDefault: ', this.criteriaAllAnyDefault );
       */
        // If there is no "Apply" button or checkbox, set applyState to true because we need to apply on any change
        if( (!this.criteriaApplyButton) && (!this.criteriaApplyCheckbox) ){
            this.applyState = true;
        }

        if( this.criteriaCalendar ){
            this.initCalendar();
        }

    }

    async initCalendar() {
        await this.utilService.sleep( Consts.waitTime );
        this.onClearClick( false ); // false = Do not rerun the query

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

    /**
     * Radio button or Checkbox
     *
     * @param i
     * @param e
     */
    onCriteriaListItemClicked( i, e ) {

        // Radio buttons
        if( this.criteriaSingleChoiceList ){
            for( let n = 0; n < this.listCheckboxes.length; n++ ){
                this.listCheckboxes[n] = false;
            }

            this.listCheckboxes[i] = true;
            this.criteriaHeadingAddOn = this.itemList[i]['value'];
        }

        // Checkboxes
        else if( this.criteriaMultiChoiceList ){
            this.listCheckboxes[i] = e.target.checked;
        }
        this.doHaveInput();
        this.onChange();
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


    // Mostly for enable/disable Apply buttons
    /**
     * @TODO Need Calendar, etc. tested here!!!!!
     */
    doHaveInput() {
        // @TODO Cleanup how calendar works
        if( !this.criteriaCalendar ){
            this.haveInput = false;
        }else {
            // Calendar always has input
            this.haveInput = this.applyState;
        }

        if( this.criteriaSingleChoiceList || this.criteriaMultiChoiceList ){
            for( let box of this.listCheckboxes ){
                if( box ){
                    this.haveInput = true;
                    return;
                }
            }
        }else if( this.criteriaSmallTextInput || this.criteriaLargeTextInput ){
            this.haveInput = this.criteriaTextInputText.length > 0;
        }else if( this.criteriaNumberInput ){
            this.haveInput = this.criteriaSingleCheckboxDefault;
        }
    }


    onShowCriteriaClick( state ) {
        this.widgetShowCriteria = state;
    }

    /**
     * When the top right red X is clicked
     */
    onRemoveCriteriaClick() {
        // This service is just used by the tester.  //BE Shore to wire up delete
        this.dynamicQueryCriteriaService.deleteWidget( this.queryCriteriaData['criteriaType'], this.queryCriteriaData['inputType'] );
        this.dynamicQueryBuilderService.deleteCriteriaQueryPart( this.queryCriteriaData['criteriaType'], this.queryCriteriaData['inputType'] );
        this.displayDynamicQueryService.removeFromDisplayQuery( this.sequenceNumber );
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


    /**
     * @TODO Calendar
     *
     * @param doNotRerunTheQuery
     */
    onClearClick( rerunTheQuery: boolean = true ) {
        if( this.criteriaSmallTextInput || this.criteriaLargeTextInput ){
            this.criteriaTextInputText = '';
        }else if( this.criteriaSingleLineRadio ){
            this.criteriaSingleLineRadioCurrent = this.criteriaSingleLineRadioDefault;
        }else if( this.criteriaCalendar ){

            // Set date ranges to From yesterday to today.
            let date: Date = new Date();
            this.date1 = {
                date: { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() },
                formatted: (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
            }
            date.setDate( date.getDate() - 1 );
            this.date0 = {
                date: { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() },
                formatted: (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
            }

            // There is valid data after a date clear
            // this.haveInput = false;
            // this.applyState = false;
            //  rerunTheQuery = false;

            this.onApplyCheckboxClick( false );
            this.criteriaSingleCheckboxCalender = false;

        }else{
            for( let n = 0; n < this.listCheckboxes.length; n++ ){
                this.listCheckboxes[n] = false;
            }
        }

        if( this.criteriaNumberInput ){
            // @CHECKME TODO rename this var.
            this.criteriaSingleCheckboxDefault = false;
            this.criteriaNumberInputDefault = this.criteriaNumberInputLimitLow;
            this.onApplyCheckboxClick( false );
        }

        if( !this.criteriaAllowNoChoice ){
            this.listCheckboxes[0] = true;
        }

        if( this.criteriaApplyCheckbox ){
            this.applyState = false;
        }

        // If we have changed this criteria by clicking on Clear, we want to update the search results regardless of whether it's apply status is false.
        if( rerunTheQuery ){
            this.onChange( true );
            if( this.criteriaApplyButton ){
                this.onApplyButtonClick();
            }
        }

        if( this.criteriaSingleLineRadio ){
            //  this.onChange( );
            this.apiService.setNoSearch();
        }

        if( this.criteriaCalendar ){
            this.criteriaSingleCheckboxCalender = false;
        }

        this.doHaveInput();

    }

    onTextInputChange() {
        this.doHaveInput();
    }

    /**
     * This is for the Search/Filter in a search criteria widget.
     *
     * @param e
     */
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
       // console.log( 'MHL onSearchTextOutFocus: ', n );
    }

    onSearchTextFocus( n ) {
      //  console.log( 'MHL onSearchTextFocus: ', n );
    }

    onWidgetAndOrRadioClick( i ) {
        // 0 is AND, 1 is OR
        this.onChange();
    }

    onWidgetAllAnyRadioClick( i ) {
        // 0 is 1, false is ANY
        this.onChange();
    }

    /**
     * @param i
     */
    onSingleLineRadioChange( i ) {
        this.criteriaSingleLineRadioCurrent = i;
        this.criteriaHeadingAddOn = this.criteriaSingleLineRadioOptions[i];
        this.onChange();
    }

    /**
     *
     * @param e
     */
    onApplyCheckboxClick( e ) {
        if( typeof e === 'boolean' ){
            this.applyState = e;
            if( this.applyState ){
                this.updateQuery();
            }else{
                this.removeQuery( false ); // Works for Master Clear button, but breaks for uncheck run query
                //   this.removeQuery( true ); // Clears display query
            }
        }else{
            this.applyState = e.target.checked;
            if( this.applyState ){
                this.updateQuery();

                if( this.criteriaCalendar ){
                    this.haveInput = true;
                }
            }else{
                this.removeQuery( true ); // Clears display query
            }
        }
    }

    /**
     * Apply buttons
     * When something is checked or clicked that should trigger the query update
     *
     * @param seq
     * @param state
     */
    onApplyButtonClick() {
        this.updateQuery();

    }

    /**
     * When something happens that could change the query.
     * We need to check for apply buttons.
     *
     * When an apply checkbox is included, but is false we need to remove this from the query.
     * If an apply button is included, we should do nothing until the Apply Button is clicked.
     */
    onChange( ignoreApplyState: boolean = false ) {
        if( this.applyState || ignoreApplyState ){
            this.updateQuery();
        }
    }

    /**
     * @CHECKME This might not be needed. An empty query criteria part in updateQuery() should be all that's needed.  BUT
     * Used by onApplyCheckboxClick
     */
    removeQuery( rerunQuery = true ) {
        // Remove this criteria's part of the query and rerun the query
        this.dynamicQueryBuilderService.deleteCriteriaQueryPart( this.criteriaQueryType, this.criteriaQueryInputType, rerunQuery );
        this.displayDynamicQueryService.removeFromDisplayQuery( this.sequenceNumber );
    }

    /**
     *
     */
    updateQuery() {
        let userInput = [];
        let displayQuery = {};

        switch( this.widgetType ){

            case WIDGET_TYPE.NUMBER:
                userInput = [this.criteriaNumberInputDefault.toString()];
                break;

            case WIDGET_TYPE.TEXT:
                /*
                                console.log( 'MHL updateQuery Type: ', WIDGET_TYPE[this.widgetType] );
                                console.log( 'MHL updateQuery TEXT Apply: ', this.criteriaTextInputText );
                                console.log( 'MHL updateQuery TEXT Apply criteriaQueryType: ', this.criteriaQueryType );
                                console.log( 'MHL updateQuery TEXT Apply criteriaQueryInputType: ', this.criteriaQueryInputType );
                                console.log( 'MHL updateQuery TEXT Apply criteriaLevelAndOrOr: ', this.criteriaLevelAndOrOr );
                */
                userInput = [this.criteriaTextInputText];
                break;

            case WIDGET_TYPE.ITEM_LIST:
                userInput = [];
                for( let f = 0; f < this.itemList.length; f++ ){
                    if( this.listCheckboxes[f] ){
                        userInput.push( this.itemList[f]['value'] );
                    }
                }

                /*
                                console.log( 'MHL updateQuery Type: ', WIDGET_TYPE[this.widgetType] );
                                console.log( 'MHL updateQuery CHECKBOX or RADIO LIST: ', userInput );
                                console.log( 'MHL updateQuery CHECKBOX or RADIO Apply criteriaQueryType: ', this.criteriaQueryType );
                                console.log( 'MHL updateQuery CHECKBOX or RADIO Apply criteriaQueryInputType: ', this.criteriaQueryInputType );
                                console.log( 'MHL updateQuery CHECKBOX or RADIO Apply criteriaLevelAndOrOr: ', this.criteriaLevelAndOrOr );
                */
                break;

            case WIDGET_TYPE.ONE_LINE_RADIO_BUTTONS:
                userInput.push( this.criteriaSingleLineRadioOptions[this.criteriaSingleLineRadioCurrent] );
                break;

            case WIDGET_TYPE.ONE_CHECKBOX:
                console.log( 'MHL ONE_CHECKBOX: ', this.criteriaSingleCheckboxDefault );
                break;

            case WIDGET_TYPE.CALENDAR:
                userInput = [];
                if( this.date0 !== undefined ){
                    userInput.push( this.date0['formatted'] );
                }else{
                    userInput.push( '' );
                }
                if( this.date1 !== undefined ){
                    userInput.push( this.date1['formatted'] );
                }else{
                    userInput.push( '' );
                }
                break;
        }

        // Detect completely empty queries.
        let noInputData = true;

        // For ONE_LINE_RADIO_BUTTONS to deal with "Ignore" @TODO we should not be looking at the labels, we need an additional parameter for the widget indicating a "don't use this criteria in the query" index.
        if( this.widgetType === WIDGET_TYPE.ONE_LINE_RADIO_BUTTONS && (this.criteriaSingleLineRadioOptions[this.criteriaSingleLineRadioCurrent].match( /^\s*ignore\s*/i )) ){
            noInputData = true;
        }
        // Calendar will always have some input because "Clear" sets the dates to yesterday and today, but, unchecks apply
        else if( this.widgetType === WIDGET_TYPE.CALENDAR && (!this.applyState) ){
            noInputData = true;
        }else if( (userInput !== undefined) && (userInput[0] !== undefined) && (userInput.length > 0) ){
            for( let f = 0; f < userInput.length; f++ ){
                if( userInput[f].length > 0 ){
                    noInputData = false;
                }
            }
        }

        if( noInputData ){
            // Remove this criteria's part of the query and rerun the query
            this.dynamicQueryBuilderService.deleteCriteriaQueryPart( this.criteriaQueryType, this.criteriaQueryInputType );
            this.displayDynamicQueryService.removeFromDisplayQuery( this.sequenceNumber );
        }
        // Add this to the dynamicQueryBuilderService's list
        else if( userInput.length > 0 ){
            this.dynamicQueryBuilderService.addCriteriaQueryPart(
                new DynamicCriteriaQueryPart( this.widgetType, userInput, this.criteriaQueryType, this.criteriaQueryInputType, this.criteriaLevelAndOrOr )
            );
        }


        // This is used for the DisplayQuery at the top
        displayQuery['criteriaHeading'] = this.criteriaHeading;

        // Not a calendar
        if( this.widgetType !== WIDGET_TYPE.CALENDAR ){
            displayQuery['criteriaSubheading'] = this.criteriaSubheading;
        }else
            // Calendar
        {
            // if there is a subheading use it
            if( this.criteriaSubheading !== undefined ){
                displayQuery['criteriaSubheading'] = this.criteriaSubheading;
            }else
                // If there are two dates (range), use '' (nothing)
            if( this.criteriaCalendarPrompt1 !== undefined && this.criteriaCalendarPrompt1.length > 0 ){
                displayQuery['criteriaSubheading'] = '';
            }else
                // If there is just one date use criteriaCalendarPrompt0
            if( this.criteriaCalendarPrompt0 !== undefined && this.criteriaCalendarPrompt0.length > 0 ){
                displayQuery['criteriaSubheading'] = this.criteriaCalendarPrompt0;
            }else{
                displayQuery['criteriaSubheading'] = '';
            }
        }

        displayQuery['value'] = userInput;
        displayQuery['andOr'] = this.criteriaLevelAndOrOr;
        displayQuery['widgetType'] = this.widgetType;
        displayQuery['sequenceNumber'] = this.sequenceNumber;
        if( !noInputData ){
            this.displayDynamicQueryService.updateDisplayQuery( displayQuery );
        }else{
            this.displayDynamicQueryService.removeFromDisplayQuery( this.sequenceNumber );
        }
    }


    ngAfterViewInit(): void {
        //  this.displayParameters();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
