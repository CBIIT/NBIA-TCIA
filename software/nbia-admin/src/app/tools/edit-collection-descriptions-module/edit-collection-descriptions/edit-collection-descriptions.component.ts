// ----------------------------------------------------------------------------------------
// ----------        "Edit Collection Descriptions" and select License         ------------
// ----------------------------------------------------------------------------------------

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '@app/admin-common/services/api.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Consts, TokenStatus } from '@app/constants';
import { QuerySectionService } from '../../query-section-module/services/query-section.service';
import { Properties } from '@assets/properties';
import { PreferencesService } from '@app/preferences/preferences.service';
import { AccessTokenService } from '@app/admin-common/services/access-token.service';


@Component( {
    selector: 'nbia-edit-collection-descriptions',
    templateUrl: './edit-collection-descriptions.component.html',
    styleUrls: [
        './edit-collection-descriptions.component.scss',
        '../../../app.component.scss',
    ],
} )

/**
 * Read, edit, save Collection descriptions, and select licenses.
 */
export class EditCollectionDescriptionsComponent implements OnInit, OnDestroy{
    userRoles;
    roleIsGood = false;

    collections;
    currentCollection;
    currentLicenseIndex = 0;
    currentLicenseIndexTrailer = 0;
    currentCollectionIndex = 0;
    showHtml = false;
    currentFont;

    consts = Consts;


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

    /*
    These are text editor tool bar items that can be hidden with toolbarHiddenButtons:
    backgroundColor
    bold
    customClasses
    fontName
    fontSize
    heading
    indent
    insertHorizontalRule
    insertImage
    insertOrderedList
    insertUnorderedList
    insertVideo
    italic
    justifyCenter
    justifyFull
    justifyLeft
    justifyRight
    link
    outdent
    removeFormat
    strikeThrough
    subscript
    superscript
    textColor
    toggleEditorMode
    underline
    unlink
    */

    // @TODO Most of these configuration values came from a demo.  Look them over, make sure they are good.
    htmlContent = 'The <b>Description</b> text will go here.';
    textTrailer = '';
    licenseIndexTrailer = 0;
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: 'auto',
        minHeight: '130',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,
        placeholder: 'Enter text here...',
        defaultParagraphSeparator: '',
        defaultFontName: '',
        defaultFontSize: '',
        fonts: [
            { class: 'arial', name: 'Arial' },
            { class: 'times-new-roman', name: 'Times New Roman' },
            { class: 'calibri', name: 'Calibri' },
            { class: 'comic-sans-ms', name: 'Comic Sans MS' },
        ],
        sanitize: true,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
            ['heading', 'fontName', 'fontSize', 'color'],
            [
                'justifyLeft',
                'justifyCenter',
                'justifyRight',
                'justifyFull',
                'indent',
                'outdent',
            ],
            [
                'paragraph',
                'blockquote',
                'removeBlockquote',
                'horizontalLine',
                'orderedList',
                'unorderedList',
            ],
            [
                'image',
                'video',
                'insertVideo',
                'insertImage',
                'customClasses',
                'insertHorizontalRule',
            ],
            ['toggleEditorMode', 'unlink'],
        ],
    };

    properties = Properties;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor(
        private apiService: ApiService,
        private accessTokenService: AccessTokenService,
        private utilService: UtilService,
        private querySectionService: QuerySectionService,
        private preferencesService: PreferencesService
    ){
    }

    ngOnInit(){

        // Receive the Collection names and descriptions.
        this.apiService.collectionsAndDescriptionEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) ).subscribe( ( data ) => {
            this.collections = data;
            if(
                !this.utilService.isNullOrUndefinedOrEmpty( this.collections )
            ){
                this.currentCollection = this.collections[0]['name'];
                this.currentLicenseIndex = this.getLicIndexById( this.collections[0]['licenseId'] );
                this.currentLicenseIndexTrailer = this.currentLicenseIndex;
                this.htmlContent = this.collections[0]['description'];
                this.textTrailer = this.htmlContent;
            }
        } );

        // When a Collection is selected from the search criteria on the left, it is received here.
        this.querySectionService.updateCollectionEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) ).subscribe( ( data ) => {
            this.onCollectionSelected( data );
        } );

        // Get this users roles and make sure they have NCIA.MANAGE_COLLECTION_DESCRIPTION
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
                    this.roleIsGood = true;
                }
            } );

        // Get the list of licenses and their associated data.
        this.apiService.collectionLicensesResultsEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.licData = data;
                this.licData.sort( ( a, b ) =>
                    a['longName']
                        .toUpperCase()
                        .localeCompare( b['longName'].toUpperCase() )
                );
            } );

        // Get the font size.
        this.preferencesService.setFontSizePreferencesEmitter
            .pipe( takeUntil( this.ngUnsubscribe ) )
            .subscribe( ( data ) => {
                this.currentFont = data;
            } );

        // Get the initial font size.
        this.currentFont = this.preferencesService.getFontSize();

        // Init has things that need to wait until we are sure we have an access token.
        this.init();
    }

    async init(){
        // Make sure we are logged in
        while( (this.accessTokenService.getAccessToken() === undefined) || this.accessTokenService.getAccessToken() <= TokenStatus.NO_TOKEN_YET ){
            await this.utilService.sleep( Consts.waitTime );
        }

        this.apiService.getRoles();
        this.apiService.getCollectionAndDescriptions();
        this.apiService.getCollectionLicenses();

    }

    /**
     * Update with newly selected Collection data when user selects a Collection from the left side "Criteria Search".
     * @param i - Index in the this.collections array
     */
    onCollectionSelected( i ){
        this.currentCollection = this.collections[i]['name'];
        this.currentLicenseIndex = this.getLicIndexById( this.collections[i]['licenseId'] );
        this.currentLicenseIndexTrailer = this.currentLicenseIndex;
        this.htmlContent = this.collections[i]['description'];
        this.textTrailer = this.htmlContent;
        this.currentCollectionIndex = i;
    }

    onSave(){
        if( Properties.DEMO_MODE ){
            console.log( 'Demo Mode Update Collection description ', this.htmlContent );
        }else{
            if(
                this.textTrailer !== this.htmlContent ||
                this.currentLicenseIndexTrailer !== this.currentLicenseIndex
            ){
                this.apiService.updateCollectionDescription(
                    this.currentCollection.replace( /\/\/.*/, '' ),
                    this.htmlContent,
                    this.licData[this.currentLicenseIndex]['id']
                );
                this.textTrailer = this.htmlContent;
                this.currentLicenseIndexTrailer = this.currentLicenseIndex;
                this.collections[this.currentCollectionIndex]['description'] = this.htmlContent;
                this.collections[this.currentCollectionIndex]['licenseId'] = this.licData[this.currentLicenseIndex]['id'];
            }
        }
    }

    onLicenseDropdownClick( i ){
        this.currentLicenseIndex = i;
    }

    onToggleShowHtml(){
        this.showHtml = !this.showHtml;
    }

    getLicIndexById( id ){
        let len = this.licData.length;
        for( let i = 0; i < len; i++ ){
            if( this.licData[i]['id'] === id ){
                return i;
            }
        }
        return 0;
    }

    ngOnDestroy(): void{
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
