import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../../admin-common/services/api.service';
import { UtilService } from '../../../admin-common/services/util.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component( {
    selector: 'nbia-edit-collection-descriptions',
    templateUrl: './edit-collection-descriptions.component.html',
    styleUrls: ['./edit-collection-descriptions.component.scss', '../../../app.component.scss']
} )

/**
 * Read, edit, save Collection descriptions.
 */
export class EditCollectionDescriptionsComponent implements OnInit, OnDestroy{
    collections;
    currentCollection;
    showHtml = false;

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
            ['toggleEditorMode', 'removeFormat', 'unlink']
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

    constructor( private apiService: ApiService, private utilService: UtilService ) {
    }

    ngOnInit() {

        // Receive the Collection names and descriptions. // TODO
        this.apiService.collectionsAndDescriptionEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.collections = data;
                console.log('MHL collections: ', this.collections);
                if( !this.utilService.isNullOrUndefinedOrEmpty( this.collections ) ){
                    this.currentCollection = this.collections[0]['name'];
                    this.htmlContent = this.collections[0]['description'];
                    this.textTrailer = this.htmlContent;
                }
            } );
        console.log('MHL CALLING getCollectionDescriptions' );
        this.apiService.getCollectionAndDescriptions(); // TODO

    }

    onCollectionClick( i ) {
        this.currentCollection = this.collections[i]['name'];
        this.htmlContent = this.collections[i]['description'];
        this.textTrailer = this.htmlContent;
    }

    onSave() {
        if(this.textTrailer !== this.htmlContent){
            console.log('MHL this.currentCollection: ', this.currentCollection.replace(/\/\/.*/, '')); // .replace(/.*(?=#[^\s]*$)/, '')
            this.apiService.updateCollectionDescription( this.currentCollection.replace(/\/\/.*/, ''), this.htmlContent );
            this.textTrailer = this.htmlContent;
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
