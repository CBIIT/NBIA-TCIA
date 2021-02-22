import {Component, OnInit} from '@angular/core';
import {DynamicQueryCriteriaService} from "@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.service";
import {DynamicQueryCriteriaTypes} from "@app/constants";
import {Properties} from "@assets/properties";
import {
    AllAnyTypes,
    AndOrTypes
} from "@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component";

@Component({
    selector: 'nbia-widget-test-settings',
    templateUrl: './widget-test-settings.component.html',
    styleUrls: ['./widget-test-settings.component.scss']
})
export class WidgetTestSettingsComponent implements OnInit {

    counter = 0;
    // TODO move this
    itemDescription = {
        'dynamicQueryCriteriaSmallTextInput': {'text': 'Small Text Input', 'tooltip': 'Test tool Tip'},
        'dynamicQueryCriteriaLargeTextInput': {'text': 'Large Text Input', 'tooltip': 'Test tool Tip'},
        'dynamicQueryCriteriaMultiChoiceList': {'text': 'Checkbox list (multi-choice)', 'tooltip': 'Test tool Tip'},
        'dynamicQueryCriteriaSingleChoiceList': {'text': 'Radio button list (one-choice)', 'tooltip': 'Test tool Tip'},
        'dynamicQueryCriteriaSingleCheckbox': {'text': 'One checkbox', 'tooltip': 'Test tool Tip'},
        'dynamicQueryCriteriaSingleCheckboxDefault': {'text': 'One checkbox default', 'tooltip': 'Test tool Tip'},
        'dynamicQueryCriteriaNumber': {
            'text': 'A number input',
            'tooltip': 'Can have apply checkbox with no text,\nor apply button with text,\nor no "Apply" (Always apply when updated)'
        },
        'dynamicQueryCriteriaNumberLimitHigh': {'text': 'High limit for number input', 'tooltip': 'Test tooltip'},
        'dynamicQueryCriteriaNumberLimitLow': {'text': 'Low limit for number input', 'tooltip': 'Test tooltip'},
        'dynamicQueryCriteriaNumberDefault': {'text': 'Default value for number input', 'tooltip': 'Test tooltip'},
        'dynamicQueryCriteriaListData': {'text': 'Sample list data'},
        'dynamicQueryCriteriaClearButton': {'text': 'Include top right "Clear" button'},
        'dynamicQueryCriteriaSearchable': {'text': 'Include top right criteria search/Filter'},
        'dynamicQueryCriteriaRequired': {
            'text': 'Is this criteria required (Is NOT optional/deletable)',
            'tooltip': 'A required criteria will not have the red \'X\' at the top right and can not be removed'
        },
        'dynamicQueryCriteriaOpenCloseButton': {'text': 'Include Collapse/show icon at top left of the heading'},
        'dynamicQueryCriteriaSort': {'text': 'Sort list'},
        'dynamicQueryCriteriaApplyButton': {'text': 'Include an "Apply" button'},
        'dynamicQueryCriteriaApplyCheckbox': {'text': 'Include an "Apply" checkbox'},
        'dynamicQueryCriteriaApplyText': {'text': 'Text for "Apply" button or checkbox'},
        'dynamicQueryCriteriaSingleLineRadio': {
            'text': 'One line radio buttons (2 or 3)',
            'tooltip': 'Test tooltip Place holder'
        },
        'dynamicQueryCriteriaSingleLineRadio0': {'text': 'Button 0', 'tooltip': 'Test tooltip Place holder'},
        'dynamicQueryCriteriaSingleLineRadio1': {'text': 'Button 1', 'tooltip': 'Test tooltip Place holder'},
        'dynamicQueryCriteriaSingleLineRadio2': {'text': 'Button 2', 'tooltip': 'Test tooltip Place holder'},

        'dynamicQueryCriteriaAndOrType': {'text': 'And/Or', 'tooltip': 'Test tooltip Place holder'},
        'dynamicQueryCriteriaAndOrDefault': {'text': 'And/Or default', 'tooltip': 'Test tooltip Place holder'},

        'dynamicQueryCriteriaAllAnyType': {'text': 'Any/All', 'tooltip': 'Test tooltip Place holder'},
        'dynamicQueryCriteriaAllAnyDefault': {'text': 'Any/All default', 'tooltip': 'Test tooltip Place holder'},
        'dynamicQueryCriteriaAllowNoChoice': {'text': 'Allow no selection', 'tooltip': 'Test tooltip Place holder'},
        'dynamicQueryCriteriaCalendar': {'text': 'Calendar', 'tooltip': 'Test tooltip Place holder'},
        'dynamicQueryCriteriaCalendarPrompt0': {'text': 'First prompt', 'tooltip': 'Test tooltip Place holder'},
        'dynamicQueryCriteriaCalendarPrompt1': {'text': 'Second prompt', 'tooltip': 'Test tooltip Place holder'},
        'dynamicQueryCriteriaCalendarPlaceHolder0': {'text': 'First place holder', 'tooltip': 'Test tooltip Place holder'},
        'dynamicQueryCriteriaCalendarPlaceHolder1': {'text': 'Second place holder', 'tooltip': 'Test tooltip Place holder'},
        'dynamicQueryCriteriaCalendarAllowOneEmpty': {'text': 'If two date inputs are included, allow one to be empty', 'tooltip': 'Test tooltip Place holder'},
        'dynamicQueryCriteriaHeading': {'text': 'Main top heading', 'tooltip': 'Test tooltip Place holder'},
        'dynamicQueryCriteriaSubHeading': {'text': 'Sub-heading', 'tooltip': 'Test tooltip Place holder'},
    };


    dynamicQueryCriteriaSmallTextInput = false;
    dynamicQueryCriteriaLargeTextInput = false;
    dynamicQueryCriteriaSingleCheckbox = false;
    dynamicQueryCriteriaSingleCheckboxDefault = false;
    dynamicQueryCriteriaMultiChoiceList = true;
    dynamicQueryCriteriaSingleChoiceList = false;
    dynamicQueryCriteriaNumber = false;
    dynamicQueryCriteriaNumberLimitHigh = 100;
    dynamicQueryCriteriaNumberLimitLow = 1;
    dynamicQueryCriteriaNumberDefault = 2;

    dynamicQueryCriteriaSingleLineRadio = false;
    dynamicQueryCriteriaSingleLineRadio0 = '';
    dynamicQueryCriteriaSingleLineRadio1 = '';
    dynamicQueryCriteriaSingleLineRadio2 = '';
    dynamicQueryCriteriaSingleLineRadioDefault = -1;
    dynamicQueryCriteriaSingleLineRadioDefault0 = false;
    dynamicQueryCriteriaSingleLineRadioDefault1 = false;
    dynamicQueryCriteriaSingleLineRadioDefault2 = false;

    dynamicQueryCriteriaCalendar = false;
    dynamicQueryCriteriaCalendarAllowOneEmpty = false;
    dynamicQueryCriteriaCalendarPrompt0 = 'AAA';
    dynamicQueryCriteriaCalendarPrompt1 = 'BBB';
    dynamicQueryCriteriaCalendarPlaceHolder0 = 'CCC';
    dynamicQueryCriteriaCalendarPlaceHolder1 = 'DDD';

    dynamicQueryCriteriaType = DynamicQueryCriteriaTypes.WIDGET;
    // dynamicQueryCriteria = 'testWidget';
    dynamicQueryCriteriaHeading = 'Test Widget';
    dynamicQueryCriteriaSubHeading = 'Sub-heading';
    dynamicQueryCriteriaRequired = false;
    dynamicQueryCriteriaClearButton = true;
    dynamicQueryCriteriaOpenCloseButton = true;
    dynamicQueryCriteriaApplyButton = true;
    dynamicQueryCriteriaApplyCheckbox = false;
    dynamicQueryCriteriaApplyText = 'Apply';
    dynamicQueryCriteriaSearchable = true;
    dynamicQueryCriteriaSort = true;
    dynamicQueryCriteriaAllowNoChoice = true;
    dynamicQueryCriteriaSelectionInHeadingCollapsed = true;

    andOrTypesArray = ['And/Or', 'And only', 'Or only', 'None'];
    currentAndOrType = 3; // For local use, not for the widget
    dynamicQueryCriteriaAndOrDefault = 'AND';
    dynamicQueryCriteriaAndOrType = AndOrTypes[this.currentAndOrType];


    allAnyTypesArray = ['All/Any', 'All ony', 'Any only', 'None'];
    currentAllAnyType = 3; // For local use, not for the widget
    dynamicQueryCriteriaAllAnyDefault = 'ANY';
    dynamicQueryCriteriaAllAnyType = AllAnyTypes[this.currentAllAnyType];

    andOrAllAnyRadioSelection = -1; // -1 = none,  0 = AndOr,  2 = AllAny
    andOrAllAnyRadioSelectionAndOr = false;
    andOrAllAnyRadioSelectionAllAny = false;
    tempListData = '';
    dynamicQueryCriteriaListData = ['Zulu', 'Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Fox', 'Golf', 'Hotel',
        'India', 'Juliette', 'Kilo', 'Lima', 'Mike', 'November'];

    useSampleData = true;
    textHold = '';
    ShowSampleCount = 3;

    /*
        AND_OR: 'ANDOR'
    ,  // Radio buttons
        ONLY_AND: 'ONLYAND'
    , // Just display
        ONLY_OR: 'ONLYOR'
    , // Just display
        NONE: 'NONE' // Do nothing, show nothing
    */


    constructor(private dynamicQueryCriteriaService: DynamicQueryCriteriaService) {
    }

    ngOnInit() {
        this.onAndOrClick(this.currentAndOrType);
        Properties.SHOW_HEADER = false;
        Properties.SHOW_FOOTER = false;
        this.sendWidgetData();
    }

    sendWidgetData() {
       // this.textHold = this.dynamicQueryCriteriaListData.toString();
        if (!this.useSampleData) {
            this.dynamicQueryCriteriaListData = [];
        }

        let temp = {
            dynamicQueryCriteriaType: DynamicQueryCriteriaTypes.WIDGET,
           // dynamicQueryCriteria: this.dynamicQueryCriteria,

            dynamicQueryCriteriaSmallTextInput: this.dynamicQueryCriteriaSmallTextInput,
            dynamicQueryCriteriaLargeTextInput: this.dynamicQueryCriteriaLargeTextInput,
            dynamicQueryCriteriaMultiChoiceList: this.dynamicQueryCriteriaMultiChoiceList,
            dynamicQueryCriteriaSingleCheckbox: this.dynamicQueryCriteriaSingleCheckbox,
            dynamicQueryCriteriaSingleCheckboxDefault: this.dynamicQueryCriteriaSingleCheckboxDefault,
            dynamicQueryCriteriaSingleChoiceList: this.dynamicQueryCriteriaSingleChoiceList,
            dynamicQueryCriteriaNumber: this.dynamicQueryCriteriaNumber,
            dynamicQueryCriteriaNumberDefault: this.dynamicQueryCriteriaNumberDefault,
            dynamicQueryCriteriaNumberLimitHigh: this.dynamicQueryCriteriaNumberLimitHigh,
            dynamicQueryCriteriaNumberLimitLow: this.dynamicQueryCriteriaNumberLimitLow,
            dynamicQueryCriteriaSingleLineRadio: this.dynamicQueryCriteriaSingleLineRadio,
            dynamicQueryCriteriaSingleLineRadioDefault: this.dynamicQueryCriteriaSingleLineRadioDefault,
            dynamicQueryCriteriaSingleLineRadio0: this.dynamicQueryCriteriaSingleLineRadio0,
            dynamicQueryCriteriaSingleLineRadio1: this.dynamicQueryCriteriaSingleLineRadio1,
            dynamicQueryCriteriaSingleLineRadio2: this.dynamicQueryCriteriaSingleLineRadio2,

            dynamicQueryCriteriaRequired: this.dynamicQueryCriteriaRequired,
            dynamicQueryCriteriaClearButton: this.dynamicQueryCriteriaClearButton,
            dynamicQueryCriteriaOpenCloseButton: this.dynamicQueryCriteriaOpenCloseButton,
            dynamicQueryCriteriaAndOrType: this.dynamicQueryCriteriaAndOrType,
            dynamicQueryCriteriaAndOrDefault: this.dynamicQueryCriteriaAndOrDefault,
            dynamicQueryCriteriaAllAnyType: this.dynamicQueryCriteriaAllAnyType,
            dynamicQueryCriteriaAllAnyDefault: this.dynamicQueryCriteriaAllAnyDefault,
            dynamicQueryCriteriaHeading: this.dynamicQueryCriteriaHeading,
            dynamicQueryCriteriaSubHeading: this.dynamicQueryCriteriaSubHeading,
            dynamicQueryCriteriaApplyCheckbox: this.dynamicQueryCriteriaApplyCheckbox,
            dynamicQueryCriteriaApplyButton: this.dynamicQueryCriteriaApplyButton,
            dynamicQueryCriteriaApplyText: this.dynamicQueryCriteriaApplyText,
            dynamicQueryCriteriaSearchable: this.dynamicQueryCriteriaSearchable,
            dynamicQueryCriteriaSort: this.dynamicQueryCriteriaSort,
            dynamicQueryCriteriaListData: this.dynamicQueryCriteriaListData,
            dynamicQueryCriteriaAllowNoChoice: this.dynamicQueryCriteriaAllowNoChoice,
            dynamicQueryCriteriaSelectionInHeadingCollapsed: this.dynamicQueryCriteriaSelectionInHeadingCollapsed,
            dynamicQueryCriteriaCalendar: this.dynamicQueryCriteriaCalendar,
            dynamicQueryCriteriaCalendarPrompt0: this.dynamicQueryCriteriaCalendarPrompt0,
            dynamicQueryCriteriaCalendarPrompt1: this.dynamicQueryCriteriaCalendarPrompt1,
            dynamicQueryCriteriaCalendarPlaceHolder0: this.dynamicQueryCriteriaCalendarPlaceHolder0,
            dynamicQueryCriteriaCalendarPlaceHolder1: this.dynamicQueryCriteriaCalendarPlaceHolder1,
            dynamicQueryCriteriaCalendarAllowOneEmpty: this.dynamicQueryCriteriaCalendarAllowOneEmpty,

             sequenceNumber: ++Properties.dynamicQueryCriteriaSequenceNumber
        };
       // this.dynamicQueryCriteriaListData = this.textHold.split(/,/);
       // console.log('MHL 007 this.dynamicQueryCriteriaListData: ', this.dynamicQueryCriteriaListData);

        // Clean here
        temp = this.cleanWidgetData(temp);
        this.dynamicQueryCriteriaService.initWidget(temp);
    }

    setDynamicQueryCriteriaSingleLineRadioDefault(i) {
        this.dynamicQueryCriteriaSingleLineRadioDefault = -1;

        switch (i) {
            case 0:
                if (this.dynamicQueryCriteriaSingleLineRadioDefault0) {
                    this.dynamicQueryCriteriaSingleLineRadioDefault = 0;
                    this.dynamicQueryCriteriaSingleLineRadioDefault1 = false;
                    this.dynamicQueryCriteriaSingleLineRadioDefault2 = false;
                }
                break;
            case 1:
                if (this.dynamicQueryCriteriaSingleLineRadioDefault1) {
                    this.dynamicQueryCriteriaSingleLineRadioDefault = 1;
                    this.dynamicQueryCriteriaSingleLineRadioDefault0 = false;
                    this.dynamicQueryCriteriaSingleLineRadioDefault2 = false;
                }
                break;
            case 2:
                if (this.dynamicQueryCriteriaSingleLineRadioDefault2) {
                    this.dynamicQueryCriteriaSingleLineRadioDefault = 2;
                    this.dynamicQueryCriteriaSingleLineRadioDefault1 = false;
                    this.dynamicQueryCriteriaSingleLineRadioDefault0 = false;
                }
                break;
        }
    }

    /**
     * @see dynamic-query-test-module/clean-dynamic-search-test-json.pipe.ts
     * @param widgetData
     */
    cleanWidgetData(widgetData) {
        let tempData = widgetData;

        // Single line radio buttons
        if (tempData.dynamicQueryCriteriaSingleLineRadio) {
            tempData.dynamicQueryCriteriaSearchable = false;
            tempData.dynamicQueryCriteriaApplyButton = false;
            tempData.dynamicQueryCriteriaApplyCheckbox = false;
            tempData.dynamicQueryCriteriaApplyText = '';
            tempData.dynamicQueryCriteriaListData = '';

        }
        // If not Single line radio buttons
        else {
            tempData.dynamicQueryCriteriaSingleLineRadio0 = '';
            tempData.dynamicQueryCriteriaSingleLineRadio1 = '';
            tempData.dynamicQueryCriteriaSingleLineRadio2 = '';
        }


        // Text input
        if (this.dynamicQueryCriteriaSmallTextInput || this.dynamicQueryCriteriaLargeTextInput) {
            // Exclude search/filter
            tempData.dynamicQueryCriteriaSearchable = false;

            // Exclude sample data list
            tempData.dynamicQueryCriteriaListData = '';
        }

        // Single checkbox
        if (this.dynamicQueryCriteriaSingleCheckbox) {
            // Exclude subHeading
            tempData.dynamicQueryCriteriaSubHeading = '';

            // Exclude sample data list
            tempData.dynamicQueryCriteriaListData = '';

            // Exclude dynamicQueryCriteriaAndOrType  &  dynamicQueryCriteriaAndOrDefault
            tempData.dynamicQueryCriteriaAndOrType = '';
            tempData.dynamicQueryCriteriaAndOrDefault = '';

            // Exclude dynamicQueryCriteriaAllAnyType  &  dynamicQueryCriteriaAllAnyDefault
            tempData.dynamicQueryCriteriaAllAnyType = '';
            tempData.dynamicQueryCriteriaAllAnyDefault = '';

            // Exclude search/filter
            tempData.dynamicQueryCriteriaSearchable = false;

            // Exclude sort
            tempData.dynamicQueryCriteriaSort = false;

            // Exclude Allow no choice
            tempData.dynamicQueryCriteriaAllowNoChoice = false;

            // Exclude dynamicQueryCriteriaAndOrType  &  dynamicQueryCriteriaAndOrDefault
            tempData.dynamicQueryCriteriaAndOrType = '';
            tempData.dynamicQueryCriteriaAndOrDefault = '';


            // Exclude Apply button and checkbox
            tempData.dynamicQueryCriteriaApplyButton = '';
            tempData.dynamicQueryCriteriaApplyText = '';

            // Exclude top left open/close Icon
            tempData.dynamicQueryCriteriaOpenCloseButton = false;
        }

        // Not Single checkbox
        else {
            tempData.dynamicQueryCriteriaSingleCheckboxDefault = false;
        }

        // Number input
        if (this.dynamicQueryCriteriaNumber) {

            // No show/collapse icon on the top left
            tempData.dynamicQueryCriteriaOpenCloseButton = false;

            // Exclude sample data list
            tempData.dynamicQueryCriteriaListData = '';

            // Exclude sort
            tempData.dynamicQueryCriteriaSort = false;

            // Exclude search/filter
            tempData.dynamicQueryCriteriaSearchable = false;

            // Exclude subHeading
            tempData.dynamicQueryCriteriaSubHeading = '';

            // Exclude dynamicQueryCriteriaAndOrType  &  dynamicQueryCriteriaAndOrDefault
            tempData.dynamicQueryCriteriaAndOrType = '';
            tempData.dynamicQueryCriteriaAndOrDefault = '';
            tempData.dynamicQueryCriteriaAllAnyType = '';
            tempData.dynamicQueryCriteriaAllAnyDefault = '';

            // Exclude apply button and apply text, Apply checkbox is permitted
            tempData.dynamicQueryCriteriaApplyButton = false;
            tempData.dynamicQueryCriteriaApplyText = '';

            // Exclude Allow No Choice
            tempData.dynamicQueryCriteriaAllowNoChoice = false;
        }
        // Not a number input
        else {

        }

        // And/Or
        // None, just clean them out
        if (this.andOrAllAnyRadioSelection === -1 || this.andOrAllAnyRadioSelection === 0) {
            // If it is not "And/Or" then clear the default
            if (this.dynamicQueryCriteriaAndOrType !== AndOrTypes['AND_OR']) {
                tempData.dynamicQueryCriteriaAndOrDefault = '';
            }

            // Exclude dynamicQueryCriteriaAllAnyType  &  dynamicQueryCriteriaAllAnyDefault
            tempData.dynamicQueryCriteriaAllAnyType = '';
            tempData.dynamicQueryCriteriaAllAnyDefault = '';
        }
        // All/Any
        if (this.andOrAllAnyRadioSelection === -1 || this.andOrAllAnyRadioSelection === 1) {
            // If it is not "And/Or" then clear the default
            if (this.dynamicQueryCriteriaAllAnyType !== AllAnyTypes['ALL_ANY']) {
                tempData.dynamicQueryCriteriaAllAnyDefault = '';
            }

            // Exclude dynamicQueryCriteriaAndOrType  &  dynamicQueryCriteriaAndOrDefault
            tempData.dynamicQueryCriteriaAndOrType = '';
            tempData.dynamicQueryCriteriaAndOrDefault = '';
        }

        if(this.dynamicQueryCriteriaCalendar){
            // Exclude sample data list
            tempData.dynamicQueryCriteriaListData = '';

            // Exclude sort
            tempData.dynamicQueryCriteriaSort = false;

            // Exclude search/filter
            tempData.dynamicQueryCriteriaSearchable = false;

            // Exclude dynamicQueryCriteriaAndOrType  &  dynamicQueryCriteriaAndOrDefault
            tempData.dynamicQueryCriteriaAndOrType = '';
            tempData.dynamicQueryCriteriaAndOrDefault = '';
            tempData.dynamicQueryCriteriaAllAnyType = '';
            tempData.dynamicQueryCriteriaAllAnyDefault = '';

            // Exclude 2nd date place holder if it's not used.
            if( this.dynamicQueryCriteriaCalendarPrompt1.length < 1){
                tempData.dynamicQueryCriteriaCalendarPlaceHolder1 = '';
                tempData.dynamicQueryCriteriaCalendarAllowOneEmpty = false
            }

        }
        // Not a calendar
        else{
            tempData.dynamicQueryCriteriaCalendarAllowOneEmpty = false
            tempData.dynamicQueryCriteriaCalendarPlaceHolder0 = '';
            tempData.dynamicQueryCriteriaCalendarPlaceHolder1 = '';
            tempData.dynamicQueryCriteriaCalendarPrompt0 = '';
            tempData.dynamicQueryCriteriaCalendarPrompt1 = '';
        }
        return tempData;
    }

    onAndOrClick(c) {
        this.currentAndOrType = c;
        switch (c) {
            case 0:
                this.dynamicQueryCriteriaAndOrType = AndOrTypes['AND_OR'];
                break;

            case 1:
                this.dynamicQueryCriteriaAndOrType = AndOrTypes['ONLY_AND'];
                break;

            case 2:
                this.dynamicQueryCriteriaAndOrType = AndOrTypes['ONLY_OR'];
                break;

            case 3:
                this.dynamicQueryCriteriaAndOrType = AndOrTypes['NONE'];
                break;

        }
    }

    onAllAnyClick(c) {
        this.currentAllAnyType = c;
        switch (c) {
            case 0:
                this.dynamicQueryCriteriaAllAnyType = AllAnyTypes['ALL_ANY'];
                break;

            case 1:
                this.dynamicQueryCriteriaAllAnyType = AllAnyTypes['ONLY_ALL'];
                break;

            case 2:
                this.dynamicQueryCriteriaAllAnyType = AllAnyTypes['ONLY_ANY'];
                break;

            case 3:
                this.dynamicQueryCriteriaAllAnyType = AllAnyTypes['NONE'];
                break;

        }
    }

    onHeadingChange() {
        // dynamicQueryCriteriaHeading
    }

    onSubHeadingChange() {
        // dynamicQueryCriteriaSubHeading
    }

    onApplyTextChange() {
        //dynamicQueryCriteriaApplyText
    }

    dynamicQueryCriteriaAndOrDefaultRadioClick(r) {
        this.dynamicQueryCriteriaAndOrDefault = r;
    }

    dynamicQueryCriteriaAllAnyDefaultRadioClick(r) {
        this.dynamicQueryCriteriaAllAnyDefault = r;
    }

    onListDataChange(e) {
        console.log('MHL 0 onListDataChange: ', e);
        console.log('MHL 1 onListDataChange: ', this.dynamicQueryCriteriaListData);
        console.log('MHL 2 onListDataChange: ', this.dynamicQueryCriteriaListData = this.dynamicQueryCriteriaListData.toString().split(','));
    }

    onDynamicQueryCriteriaApplyButtonClick() {
        if (this.dynamicQueryCriteriaApplyButton) {
            this.dynamicQueryCriteriaApplyButton = true;
        } else {
            this.dynamicQueryCriteriaApplyCheckbox = false;
        }

    }

    onDynamicQueryCriteriaApplyCheckboxClick() {
        if (this.dynamicQueryCriteriaApplyCheckbox) {
            this.dynamicQueryCriteriaApplyCheckbox = true;
        } else {
            this.dynamicQueryCriteriaApplyButton = false;

        }
    }

    onInputTypeRadioClicked(r) {
        this.dynamicQueryCriteriaSmallTextInput = false;
        this.dynamicQueryCriteriaLargeTextInput = false;
        this.dynamicQueryCriteriaMultiChoiceList = false;
        this.dynamicQueryCriteriaSingleChoiceList = false;
        this.dynamicQueryCriteriaSingleCheckbox = false;
        this.dynamicQueryCriteriaSingleLineRadio = false;
        this.dynamicQueryCriteriaNumber = false;
        this.dynamicQueryCriteriaCalendar = false;

        switch (r) {
            case 0:
                this.dynamicQueryCriteriaSmallTextInput = true;
                break;
            case 1:
                this.dynamicQueryCriteriaLargeTextInput = true;
                break;
            case 2:
                this.dynamicQueryCriteriaMultiChoiceList = true;
                break;
            case 3:
                this.dynamicQueryCriteriaSingleChoiceList = true;
                break;
            case 4:
                this.dynamicQueryCriteriaSingleLineRadio = true;
                break;
            case 5:
                this.dynamicQueryCriteriaSingleCheckbox = true;
                break;
            case 6:
                this.dynamicQueryCriteriaNumber = true;
                break;
            case 7:
                this.dynamicQueryCriteriaCalendar = true;
                break;
        }
    }

    onUseSampleDataCheckbox(e) {
        console.log('MHL onUseSampleDataCheckbox: ', e);
        this.useSampleData = e;
    }

    andOrAllAnyRadio(i) {
        this.andOrAllAnyRadioSelection = -1;

        console.log('MHL 001 andOrAllAnyRadio(' + i + ') andOrAllAnyRadioSelectionAndOr: ', this.andOrAllAnyRadioSelectionAndOr);
        console.log('MHL 002 andOrAllAnyRadio(' + i + ') andOrAllAnyRadioSelectionAllAny: ', this.andOrAllAnyRadioSelectionAllAny);

        // AndOr
        if (i === 0 && this.andOrAllAnyRadioSelectionAndOr) {
            console.log('MHL 003a andOrAllAnyRadio: ', i);
            this.andOrAllAnyRadioSelectionAllAny = false;
            this.andOrAllAnyRadioSelection = 0;
        }

        // AllAny
        else if (i === 1 && this.andOrAllAnyRadioSelectionAllAny) {
            console.log('MHL 004 andOrAllAnyRadio: ', i);
            this.andOrAllAnyRadioSelectionAndOr = false;
            this.andOrAllAnyRadioSelection = 1;
        }

        // None
        else if (i === -1) {
            this.andOrAllAnyRadioSelectionAllAny = false;
            this.andOrAllAnyRadioSelection = 0;
            this.andOrAllAnyRadioSelectionAndOr = false;
            this.andOrAllAnyRadioSelection = 1;

        }
        console.log('MHL 005 andOrAllAnyRadio(' + i + ') andOrAllAnyRadioSelectionAndOr: ', this.andOrAllAnyRadioSelectionAndOr);
        console.log('MHL 006 andOrAllAnyRadio(' + i + ') andOrAllAnyRadioSelectionAllAny: ', this.andOrAllAnyRadioSelectionAllAny);

    }

    reInit() {

    }

}
