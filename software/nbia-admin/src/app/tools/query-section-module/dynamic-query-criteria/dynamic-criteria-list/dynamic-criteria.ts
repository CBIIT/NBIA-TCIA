import {
    AllAnyTypes,
    AndOrTypes,
    CriteriaTypes
} from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.component';

export class DynamicCriteria{


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

}
