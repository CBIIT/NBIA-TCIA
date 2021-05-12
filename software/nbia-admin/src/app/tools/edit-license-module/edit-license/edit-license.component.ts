// ----------------------------------------------------------------------------------------
// ----------------------        "Edit Collection Licenses         ------------------------
// ----------------------------------------------------------------------------------------

import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from '@app/admin-common/services/api.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { Consts, TokenStatus } from '@app/constants';
import { PreferencesService } from '@app/preferences/preferences.service';
import { AccessTokenService } from '@app/admin-common/services/access-token.service';


@Component( {
    selector: 'nbia-edit-license',
    templateUrl: './edit-license.component.html',
    styleUrls: ['./edit-license.component.scss'],
} )

export class EditLicenseComponent implements OnInit, OnDestroy{
    userRoles;
    roleIsGood = false;

    /**
     * The currently selected license.
     * If user is entering a new license this will be set to zero (a new license is always inserted at the beginning of licData).
     */
    currentLic = 0;

    /**
     * If the user "Cancel"s out of "New" license we can return them to their previously selected license.
     */
    currentLicHold = 0;

    /**
     * If true show "Cancel" and "Add" buttons and hide "New" and "Save" buttons.
     */
    isEditing = false;

    /**
     * Set true if any license data has been edited/changed by the user.
     * If false, the "Save" button is disabled.
     */
    isChanged = false;

    /**
     * The list of licenses we are working with.
     * This one object/license is a place holder for the HTML until the license data makes its way back from the server.
     */
    licData = [
        {
            shortName: '',
            longName: '',
            licenseURL: '',
            commercialUse: true,
            id: -1,
        },
    ];

    /**
     * used to determine if there are changes that can be saved.
     */
    licChangeDataHold;

    handleMoving = false;
    showConfirmDelete = false;
    editLicErrorNote: string = '';

    commercialTrue = true;
    commercialFalse = false;
    commercialTest = true;
    commercialTestHold = true;
    commercialLicAllowedDefault = true; // The default for new License.

    confirmDeleteLeft = 200;
    popupWidth;
    shortNameTooLong = false;
    shortNameMaxLen = 50;
    currentFont;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor(
        private apiService: ApiService,
        private accessTokenService: AccessTokenService,
        private utilService: UtilService,
        private preferencesService: PreferencesService
    ){
    }

    /**
     * Called when the user selects a Long Name from the dropdown menu.
     * Changing currentLic causes the HTML to change which license is shown in the editing box.
     *
     * @param i the index in the licData array of the selected license.
     */
    onLicenseDropdownClick( i ){
        this.currentLic = i;
        this.commercialTest = this.licData[this.currentLic]['commercialUse'];
    }

    ngOnInit(){
        // Get the user's role
        this.apiService.updatedUserRolesEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.userRoles = data;
                if(
                    this.userRoles !== undefined &&
                    this.userRoles.indexOf(
                        'NCIA.MANAGE_COLLECTION_DESCRIPTION'
                    ) > -1
                ){
                    // TODO make sure this is the correct role!!!.
                    this.roleIsGood = true;
                }
            } );

        this.apiService.getRoles();

        // Get the list of licenses and their associated data.
        this.apiService.collectionLicensesResultsEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.licData = data;
                // Sort by longName.
                this.licData.sort( ( a, b ) =>
                    a['longName']
                        .toUpperCase()
                        .localeCompare( b['longName'].toUpperCase() )
                );
                for( let lic of this.licData ){
                    lic['commercialUse'] = this.utilService.isTrue(
                        lic['commercialUse']
                    );
                }
                // licChangeDataHold will be used to determine if the user has changed any data, will be used to enable the "Save" button.
                this.licChangeDataHold = this.copyLicArray( this.licData );

                this.commercialTest = this.licData[this.currentLic][
                    'commercialUse'
                    ];
            } );


        // A save has completed, we must reread the list from the server to be sure any new license that where saved, now have their ID.
        this.apiService.submitCollectionLicenseResultsEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( () => {
                this.apiService.getCollectionLicenses();
            } );

        // Check for error when deleting a license.
        // It is likely a result of a collection still using the license (so it can't be deleted).
        this.apiService.submitDeleteLicenseErrorEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                if( <string>data['error'].match( /Unable to delete,/ ) ){
                    this.editLicErrorNote = <string>(
                        data['error'].replace( /^.*id:\s*/, '' ).split( /,/ )
                    );
                    this.showConfirmDelete = true;
                }else{
                    console.error( 'Error deleting license: ' + data['error'] );
                }
            } );

        this.apiService.submitDeleteLicenseResultsEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                if( data === 'License deleted' ){
                    // Re-read the license list from the server
                    this.apiService.getCollectionLicenses();
                    this.currentLic = 0;
                }
            } );

        this.preferencesService.setFontSizePreferencesEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.currentFont = data;
            } );

        // Get the initial value
        this.currentFont = this.preferencesService.getFontSize();

        this.initLicenseList();
    }

    async initLicenseList(){
        // If the user has not logged in yet, we have wait for the access token
        while( this.accessTokenService.getAccessToken() === TokenStatus.NO_TOKEN_YET ){
            await this.utilService.sleep( Consts.waitTime );
        }
        this.apiService.getCollectionLicenses();

    }

    /**
     * Create a new license object and add it to the beginning of licData.
     * An id of -1 indicates that this is a new record to be added rather than updated.
     */
    onLicEditNewClick(){
        // Save so we can restore if the user cancels.
        this.currentLicHold = this.currentLic;

        // Create a new empty license. An id of -1 indicates that this is a new record to be added rather than updated.
        let newLic = {
            shortName: '',
            longName: '',
            licenseURL: '',
            commercialUse: true,
            id: -1,
        };

        // Add the new license to the beginning of the array.
        this.licData.unshift( newLic );
        this.currentLic = 0;
        this.isEditing = true;

        // set default
        this.commercialTest = this.commercialLicAllowedDefault;
    }

    onLicEditSaveClick(){
        this.save();
        this.isEditing = false;
        this.isChanged = false;

        // We need to have the IDs of any newly added licenses.
        this.apiService.getCollectionLicenses();
    }

    /**
     * Hides the cancel button and save the new license will stay
     */
    onLicEditAddClick(){
        this.onLicEditSaveClick();
    }

    onLicEditCancelClick(){
        this.isEditing = false;
        this.licData.shift();
        // If they cancel the license, rest the current one to the one they where previously looking at.
        this.currentLic = this.currentLicHold;
        this.commercialTest = this.licData[this.currentLic]['commercialUse'];

        this.onLicChange();
    }

    copyLicArray( licArray ){
        let tempLicArray = [];
        for( let lic of licArray ){
            tempLicArray.push( this.copyLic( lic ) );
        }
        return tempLicArray;
    }

    copyLic( lic ){
        return {
            shortName: lic.shortName,
            longName: lic.longName,
            licenseURL: lic.licenseURL,
            commercialUse: lic.commercialUse,
            id: lic.id,
        };
    }

    shortNameKeypress( e ){
        if(
            this.licData[this.currentLic]['shortName'].length ===
            this.shortNameMaxLen &&
            e['key'] !== 'ArrowLeft' &&
            e['key'] !== 'ArrowRight'
        ){
            this.shortNameTooLong = true;
        }
    }

    shortNameKeyup( e ){
        if(
            this.licData[this.currentLic]['shortName'].length <=
            this.shortNameMaxLen &&
            (e['key'] === 'ArrowLeft' || e['key'] === 'ArrowRight')
        ){
            this.shortNameTooLong = false;
        }
    }

    onShortNameChange(){
        if(
            this.licData[this.currentLic]['shortName'].length <=
            this.shortNameMaxLen
        ){
            this.shortNameTooLong = false;
        }
        this.onLicChange();
    }

    onLicChange(){
        this.isChanged = this.haveChanges();
    }

    haveChanges(){
        let len = this.licData.length;
        let lenChange = this.licChangeDataHold.length;
        if( len !== lenChange ){
            return true;
        }
        for( let i = 0; i < len; i++ ){
            if( !this.compareLic( this.licData[i], this.licChangeDataHold[i] ) ){
                return true; // If they are not the same return true (have changes)
            }
        }
        return false;
    }

    /**
     * Return true if same.
     * @param l0
     * @param l1
     */
    compareLic( l0, l1 ): boolean{
        let ret = !(
            l0['shortName'] !== l1['shortName'] ||
            l0['longName'] !== l1['longName'] ||
            l0['licenseURL'] !== l1['licenseURL'] ||
            l0['id'] !== l1['id'] ||
            l0['commercialUse'] !== l1['commercialUse']
        );
        return ret;
    }

    save(){
        let len = this.licData.length;
        for( let i = 0; i < len; i++ ){
            // Is it new?
            if( this.licData[i]['id'] === -1 ){
                this.addLic( i );
            }else{
                // If it is NOT new, has it changed?
                if(
                    !this.compareLic(
                        this.licData[i],
                        this.licChangeDataHold[
                            this.getLicIndexById(
                                this.licData[i]['id'],
                                this.licChangeDataHold
                            )
                            ]
                    )
                ){
                    this.saveLic( i );
                }
            }
        }
    }

    /**
     * Returns the index in the array of the matching lic, if not found return -1
     *
     * @param id
     * @param licArray
     */
    getLicIndexById( id, licArray ){
        let len = licArray.length;
        for( let i = 0; i < len; i++ ){
            if( licArray[i]['id'] === id ){
                return i;
            }
        }
        return -1;
    }

    addLic( i ){
        let submitData =
            'longName=' +
            this.licData[i]['longName'].replace( '%', '%25' ) +
            '&shortName=' +
            this.licData[i]['shortName'].replace( '%', '%25' ) +
            '&licenseURL=' +
            this.licData[i]['licenseURL'] +
            '&commercialUse=' +
            <string>(this.licData[i]['commercialUse'] ? 'YES' : 'NO');

        this.apiService.doSubmit( Consts.TOOL_EDIT_LICENSE, submitData );
    }

    saveLic( i ){
        let submitData =
            'longName=' +
            this.licData[i]['longName'].replace( '%', '%25' ) +
            '&shortName=' +
            this.licData[i]['shortName'].replace( '%', '%25' ) +
            '&licenseURL=' +
            this.licData[i]['licenseURL'] +
            '&id=' +
            this.licData[i]['id'] +
            '&commercialUse=' +
            <string>(this.licData[i]['commercialUse'] ? 'YES' : 'NO');
        this.apiService.doSubmit( Consts.TOOL_EDIT_LICENSE, submitData );
    }

    onLicEditDeleteClick(){
        this.showConfirmDelete = true;
        // TODO Explain this
        this.popupWidth = Math.max(
            63,
            this.licData[this.currentLic]['longName'].length
        );
        this.confirmDeleteLeft = window.innerWidth / 2 - this.popupWidth * 6;
    }

    onLicEditConfirmDeleteClick(){
        this.showConfirmDelete = false;
        this.apiService.doSubmit(
            Consts.SUBMIT_DELETE_COLLECTION_LICENSES,
            this.licData[this.currentLic]['id']
        );
    }

    onLicEditCancelDeleteClick(){
        this.showConfirmDelete = false;
        this.editLicErrorNote = '';
    }

    onCommercialRadioChange( i ){
        this.licData[this.currentLic].commercialUse = i === 0;
        this.onLicChange();
    }

    /////////////////////////
    onDragBegin( e ){
        this.handleMoving = true;
    }

    onMoveEnd( e ){
        this.handleMoving = false;
    }

    ngOnDestroy(){
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
