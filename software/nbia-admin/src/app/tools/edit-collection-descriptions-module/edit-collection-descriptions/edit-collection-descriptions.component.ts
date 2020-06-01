import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '@app/admin-common/services/api.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Consts } from '@app/constants';
import { QuerySectionService } from '../../query-section-module/services/query-section.service';
import { Properties } from '@assets/properties';


@Component( {
    selector: 'nbia-edit-collection-descriptions',
    templateUrl: './edit-collection-descriptions.component.html',
    styleUrls: ['./edit-collection-descriptions.component.scss', '../../../app.component.scss']
} )

/**
 * Read, edit, save Collection descriptions.
 */
export class EditCollectionDescriptionsComponent implements OnInit, OnDestroy{
    userRoles;
    roleIsGood = false;

    collections;
    currentCollection;
    showHtml = false;
    consts = Consts;


    // @TODO Most of these configuration values came from a demo.  Look them over, make sure they are good.
    htmlContent = 'The <b>Description</b> text will go here.';
    textTrailer = '';
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
            { class: 'comic-sans-ms', name: 'Comic Sans MS' }
        ],
        sanitize: true,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
            ['heading', 'fontName', 'fontSize', 'color'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
            ['paragraph', 'blockquote', 'removeBlockquote', 'horizontalLine', 'orderedList', 'unorderedList'],
            ['image', 'video', 'insertVideo', 'insertImage', 'customClasses', 'insertHorizontalRule'],
            ['toggleEditorMode', 'unlink']
        ]
    };


    /*
    These are tool bar items that can be hidden wit toolbarHiddenButtons:
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

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiService: ApiService, private utilService: UtilService,
                 private querySectionService: QuerySectionService) {
    }

    ngOnInit() {

        // Receive the Collection names and descriptions. // TODO
        this.apiService.collectionsAndDescriptionEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.collections = data;

                if( !this.utilService.isNullOrUndefinedOrEmpty( this.collections ) ){
                    this.currentCollection = this.collections[0]['name'];
                    this.htmlContent = this.collections[0]['description'];
                    this.textTrailer = this.htmlContent;
                }

            } );

        this.apiService.getCollectionAndDescriptions();


        this.querySectionService.updateCollectionEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.onCollectionClick( data );
            } );


        this.apiService.updatedUserRolesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.userRoles = data;
                if( this.userRoles !== undefined && this.userRoles.indexOf( 'NCIA.MANAGE_COLLECTION_DESCRIPTION' ) > -1 ){
                    this.roleIsGood = true;
                }
            });
        this.apiService.getRoles();


    }

    onCollectionClick( i ) {
        this.currentCollection = this.collections[i]['name'];
        this.htmlContent = this.collections[i]['description'];
        this.textTrailer = this.htmlContent;
    }

    onSave() {
        if( Properties.DEMO_MODE){
            console.log('Demo Mode Update Collection description ', this.htmlContent);
        }
        else{
            if( this.textTrailer !== this.htmlContent ){
                this.apiService.updateCollectionDescription( this.currentCollection.replace( /\/\/.*/, '' ), this.htmlContent );
                this.textTrailer = this.htmlContent;
            }
        }
    }

    onToggleShowHtml() {
        this.showHtml = (!this.showHtml);
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
