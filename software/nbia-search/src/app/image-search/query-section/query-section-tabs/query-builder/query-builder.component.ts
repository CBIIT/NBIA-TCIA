import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { UtilService } from '@app/common/services/util.service';
import { CommonService } from '@app/image-search/services/common.service';

import { Subject } from 'rxjs';
import { Consts } from '@app/consts';

@Component( {
    selector: 'nbia-query-builder',
    templateUrl: './query-builder.component.html',
    styleUrls: ['../simple-search/simple-search.component.scss', './query-builder.component.scss']
} )
export class QueryBuilderComponent implements OnInit, OnDestroy{

    DELIMITER = '||';

    NO_INPUT = 0;
    TEXT_INPUT = 1;
    NUMBER_INPUT = 2;
    DATE_INPUT = 3;
    ERROR = 4;

    inputPrompts = ['None', 'Text', 'Number', 'mm/dd/yyyy', 'Error'];
    /**
     * When the user clicks on a menu choice, this value will indicate what kind of input it needs.<br>
     * <ul>
     *     <li>None</li>
     *     <li>Text</li>
     *     <li>Number</li>
     *     <li>Date</li>
     * @type {number}
     */
    userInputType = 0;
    userInputPrompt = 'User input';

    queryArray = [];
    userInput = '';
    haveMenuChoice = false;

    allOrAnyLabels = ['All', 'Any'];
    allOrAnyDefault = 1; // 0=Any  1=All
    tog = true;
    doCollapseAll = false;

    currentMenuCriteria = '';

    menuActive = false;

    /* -------------------------------------------------------------- */
    /* -------------------------------------------------------------- */
    /* -------------------------------------------------------------- */

    selection = '-';
    currentSelection = '-';
    currentSelectionStr = '-';

    collectionArray = ['BREAST-DIAGNOSIS', 'Test', 'CBIS-DDSM', 'Head-Neck Cetuximab', 'LIDC-IDRI', 'CT Lymph Nodes'];
    startsWithEndWithArray = ['starts with', 'ends with', 'contains', 'equals'];
    lessThanGreaterThanArray = ['>', '<', '>==', '<=', '=', '!='];

    // FIXME - This must (eventually) come from the server, it should only be values used in the data base.
    genderArray = ['M', 'F', 'Not Populated (NULL)', 'O', 'U', '0000', 'Masculino', 'Feminino'];

    // FIXME - This must (eventually) come from the server, it should only be values used in the data base. We have the API functionality for this one.
    anatomicalSiteArray = ['BREAST', 'CHEST', 'ABDOMEN', 'HEADNECK', 'LUNG', 'MEDIASTINUM'];

    // FIXME - This must (eventually) come from the server, it should only be values used in the data base. We have the API functionality for this one.
    modalityArray = ['MG', 'CT', 'CR', 'MR', 'DX', 'RTSTRUCT', 'SEG', 'PT'];

    patientArray0 = [
        {
            'name': 'Ethnic Group',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Patient Birthday',
            'subMenu': this.lessThanGreaterThanArray
        }, {
            'name': 'Patient Gender',
            'subMenu': this.genderArray
        }, {
            'name': 'Patient ID',
            'subMenu': this.startsWithEndWithArray
        }, {
            'name': 'Patient Name',
            'subMenu': this.startsWithEndWithArray
        }];

    studyArray = [
        {
            'name': 'Admitting Diagnoses Code Sequence',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Admitting Diagnoses Description',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Occupation',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Patient Age',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Patient Height',
            'subMenu': this.lessThanGreaterThanArray
        },
        {
            'name': 'Patient Weight',
            'subMenu': this.lessThanGreaterThanArray
        },
        {
            'name': 'Patient History',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Study Date',
            'subMenu': this.lessThanGreaterThanArray
        },
        {
            'name': 'Study Description',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Study ID',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Study Instance UID',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Study Time',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Trial Time Point Description',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Trial Time Point ID',
            'subMenu': this.startsWithEndWithArray
        }];

    seriesArray = [
        {
            'name': 'Anatomical Site',
            'subMenu': this.anatomicalSiteArray
        },
        {
            'name': 'Frame of Reference UID',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Frame of Reference UID',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Modality',
            'subMenu': this.modalityArray
        },
        {
            'name': 'Protocol Name',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Series Date',
            'subMenu': this.lessThanGreaterThanArray
        },
        {
            'name': 'Series Description',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Series Instance UID',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Series Laterality',
            'subMenu': ['Not Populated (NULL)', 'R', 'L']
        },
        {
            'name': 'Series Number',
            'subMenu': this.lessThanGreaterThanArray
        },
        {
            'name': 'Synchronization Frame Of Reference UID',
            'subMenu': this.startsWithEndWithArray
        }];

    imageArray = [
        {
            'name': 'Acquisition Date',
            'subMenu': this.lessThanGreaterThanArray
        },
        {
            'name': 'Acquisition Matrix',
            'subMenu': this.lessThanGreaterThanArray
        },
        {
            'name': 'Acquisition Number',
            'subMenu': this.lessThanGreaterThanArray
        },
        {
            'name': 'Acquisition Time',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Column Count',
            'subMenu': this.lessThanGreaterThanArray
        },
        {
            'name': 'Content Date',
            'subMenu': this.lessThanGreaterThanArray
        },
        {
            'name': 'Contrast Bolus Agent',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Contrast Bolus Route',
            'subMenu': ['Not Populated (NULL)', 'IV', 'Oral & IV']
        },
        {
            'name': 'Focal Spot Size',
            'subMenu': this.lessThanGreaterThanArray
        },
        {
            'name': 'Image Comments',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Image Laterality',
            'subMenu': ['Not Populated (NULL)', 'R', 'L', 'U']
        },
        {
            'name': 'Image Orientation Patient',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Image Position Patient',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Image Type',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Instance Number',
            'subMenu': this.lessThanGreaterThanArray
        },
        {
            'name': 'Lossy Image Compression',
            'subMenu': this.startsWithEndWithArray
        },
        {
            'name': 'Patient Position',  // CHECKME  Does this need to com from the server/database
            'subMenu': ['HFS', 'Not Populated (NULL)', 'HFP', 'FFS', 'ERECT']
        }];


    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private renderer: Renderer2,
                 private utilService: UtilService ) {
    }

    ngOnInit() {
        this.commonService.clearAllQueryBuilderEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                this.deleteAll();
            }
        )
    }


    setAllOrAny( a ) {
        this.allOrAnyLabels = a;
    }

    getAllOrAny() {
        return this.allOrAnyLabels;
    }

    onAnyOrAllChange( value ) {
        this.allOrAnyDefault = value;
        this.commonService.setQueryBuilderAnyOrAll( value );
    }


    onSelected( c, l0, l1?, l2?, l3? ) {
        this.menuActive = true;
        if( this.utilService.isNullOrUndefined( l1 ) ){
            this.currentSelection = l0;
            this.currentSelectionStr = c;
        }
        else if( this.utilService.isNullOrUndefined( l2 ) ){
            this.currentSelection = l0 + this.DELIMITER + l1;
            this.currentSelectionStr += this.DELIMITER + c;
        }
        else if( this.utilService.isNullOrUndefined( l3 ) ){
            this.currentSelection = l0 + this.DELIMITER + l1 + this.DELIMITER + l2;  // FIXME  Use a different delimiter
            this.currentSelectionStr += this.DELIMITER + c;

        }
        else{
            console.error( 'QueryBuilderComponent.onSelected' );
        }

    }


    onUnSelected( c, l0, l1?, l2?, l3? ) {
        this.menuActive = false;
        let temp = '';

        if( this.utilService.isNullOrUndefined( l1 ) ){
            temp += l0;
        }
        else if( this.utilService.isNullOrUndefined( l2 ) ){
            temp += l0 + this.DELIMITER + l1;
        }
        else if( this.utilService.isNullOrUndefined( l3 ) ){
            temp += l0 + this.DELIMITER + l1 + this.DELIMITER + l2;
        }
        else{
        }

        if( temp === this.currentSelection ){

            let lastIndex = this.currentSelectionStr.lastIndexOf( this.DELIMITER );
            this.currentSelectionStr = this.currentSelectionStr.substring( 0, lastIndex );
            lastIndex = this.currentSelection.lastIndexOf( this.DELIMITER );
            this.currentSelection = this.currentSelection.substring( 0, lastIndex );

        }
    }


    async onClick( c, l0, l1?, l2?, l3? ) {


        if( this.utilService.isNullOrUndefined( l1 ) ){
            console.log( 'onClick: ' + ' : ' + ' : ' + l0 );
            this.userInputType = this.allowedUserInputType( l0 );
        }
        else if( this.utilService.isNullOrUndefined( l2 ) ){
            console.log( 'onClick: ' + ' : ' + l0 + ' : ' + l1 );
            this.userInputType = this.allowedUserInputType( l0, l1 );
        }
        else if( this.utilService.isNullOrUndefined( l3 ) ){
            console.log( 'onClick: ' + l0 + ' : ' + l1 + ' : ' + l2 );
            this.userInputType = this.allowedUserInputType( l0, l1, l2 );
        }
        else{
            console.error( 'Missing parameter from menu onClick.' );
            this.userInputType = this.ERROR;
        }

        this.userInputPrompt = this.inputPrompts[this.userInputType];

        this.selection = this.currentSelectionStr.slice();
        this.tog = false;
        await this.commonService.sleep( Consts.waitTime );
        this.tog = true;
        // this.doCollapseAll = false;

        // Give focus to the text input  FIXME, some choices won't have a text input
        if( this.userInputType > 0 ){
            this.renderer.selectRootElement( '#userInput' ).focus();
        }


        let reg = new RegExp( this.escapeRegExp( this.DELIMITER ), 'g' );
        // this.currentMenuCriteria = this.currentSelectionStr.replace( reg, ': ' );
        this.currentMenuCriteria = this.currentSelectionStr;

        console.log( 'onClick currentMenuCriteria: ', this.currentMenuCriteria );

        if( this.userInputType === this.NO_INPUT ){
            this.onPlusClick()
        }
        else{
            this.commonService.emitQueryBuilderQueryForDisplay( this.queryArray );
        }

    }

    deleteAll() {
        this.queryArray = [];
    }

    onDeleteQueryClick( i ) {
        this.queryArray.splice( i, 1 );
    }

    onPlusClick() {
        if( this.currentMenuCriteria.trim().length > 0 ){
            let query = [];
            query[0] = this.currentMenuCriteria.trim();
            query[1] = this.userInput.trim();
            this.queryArray.push( query );

            this.clearUserInput();

            this.commonService.emitQueryBuilderQueryForDisplay( this.queryArray );

        }
    }

    onClearUserInputsClick() {
        this.clearUserInput();
    }

    clearUserInput() {
        this.userInput = '';
        this.currentMenuCriteria = '';
        this.userInputType = this.NO_INPUT;
    }

    // FIXME this is a dupe
    cleanQuery( q ) {
        return q.slice().replace( new RegExp( '\\|\\|', 'g' ), ' \|\| ' )
    }


    /* -------------------------------------------------------------- */
    /* -------------------------------------------------------------- */
    /* -------------------------------------------------------------- */

    // FIXME this is a dup, find the other one and put them in a service.
    escapeRegExp( str ) {
        return str.replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' );
    }


    // TODO
    allowedUserInputType( l0, l1?, l2?, l3? ) {

        // Collections
        if( l0 === 0 ){
            return this.NO_INPUT;
        }

        // Patient
        if( l0 === 1 ){
            // Patient Gender
            if( l1 === 2 ){
                return this.NO_INPUT;
            }
            return this.TEXT_INPUT;
        }

        // Study
        if( l0 === 2 ){
            return this.TEXT_INPUT;
        }

        // Series
        if( l0 === 3 ){
            if( (l1 === 0) || (l1 === 3) || (l1 === 8) ){
                return this.NO_INPUT;
            }
            return this.TEXT_INPUT;
        }

        // Image
        if( l0 === 4 ){
            if( (l1 === 7) || (l1 === 10) || (l1 === 16) ){
                return this.NO_INPUT;
            }
            return this.TEXT_INPUT;
        }


        /*

                // Collections
                if( l0 === 0 ){
                    console.log( 'allowedUserInputType l0 === 0' );
                    return this.NO_INPUT;
                }

                // Patient
                if( l0 === 1)
                {
                    // Patient Birthday
                    if( l1 === 1 )
                    {
                        return this.DATE_INPUT
                    }

                    // Patient Gender
                    if( l1 === 2)
                    {
                        return this.NO_INPUT;
                    }

                    // Ethnic Group, Patient ID, Patient Name
                    return this.TEXT_INPUT;
                }

                // Study
                if( l0 === 2)
                {

                }

        */

    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
