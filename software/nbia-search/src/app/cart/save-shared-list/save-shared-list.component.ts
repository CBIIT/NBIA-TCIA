import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonService } from '../../image-search/services/common.service';
import { ApiServerService } from '../../image-search/services/api-server.service';
import { UtilService } from '@app/common/services/util.service';
import { Consts, MenuItems } from '@app/consts';
import { MenuService } from '@app/common/services/menu.service';
import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { Subject } from 'rxjs';

@Component( {
    selector: 'nbia-save-shared-list',
    templateUrl: './save-shared-list.component.html',
    styleUrls: ['../../app.component.scss', './save-shared-list.component.scss']
} )

export class SaveSharedListComponent implements OnInit, OnDestroy{

    showSaveListNameInputBox = false;

    NONE = -1;
    WAITING = 0;
    GOOD = 1;
    BAD = 2;
    DUPE = 3;
    status = this.NONE;
    deleteStatus = this.NONE;

    sharedListCsvFile = 'file-csv';
    useCart = true;
    useFile = false;
    cartOrFile = 1;  // 0 = cart

    sharedListInputType;

    subjectData;
    seriesData;

    // For HTML access
    menuItems = MenuItems;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private apiServerService: ApiServerService,
                 private menuService: MenuService ) {
    }

    ngOnInit() {
        this.commonService.sharedListSavePopupEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                this.sharedListInputType = data;
                this.showSaveListNameInputBox = true;
                this.menuService.lockMenu();
            }
        );


        this.apiServerService.deleteSharedListResultsEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                // We will only receive this emit if there was no error.
                this.deleteStatus = this.GOOD;
            }
        );
        this.apiServerService.deleteSharedListErrorEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            err => {
                console.error( 'Delete shared list ERROR: ', err['status'] );
                console.error( 'Delete shared list ERROR: ', err['_body'] );
                console.error( 'SaveSharedListComponent deleteSharedListErrorEmitter.subscribe: ', err );
            }
        );

        this.apiServerService.saveSharedListResultsEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                this.status = this.GOOD;
            }
        );
        this.apiServerService.saveSharedListErrorEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            err => {
                // Is it an error because this List name is already being used?
                if( err['_body'] === 'Duplicate list name' ){
                    this.status = this.DUPE;
                }
                else{
                    this.status = this.BAD;
                    console.error( 'Save shared list ERROR: ', err['status'] );
                    console.error( 'Save shared list ERROR: ', err['_body'] );
                }
            }
        );


        this.apiServerService.idForSharedListSubjectResultsEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                this.subjectData = data;
                this.status = this.GOOD;
            }
        );
        this.apiServerService.idForSharedListSubjectErrorEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            err => {
                console.error( 'SaveSharedListComponent idForSharedListSubjectErrorEmitter.subscribe: ', err );
            }
        );

        this.apiServerService.seriesForSharedListSubjectResultsEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            data => {
                this.seriesData = data;
                this.status = this.GOOD;
            }
        );
        this.apiServerService.seriesForSharedListSubjectErrorEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            err => {
                console.error( 'SaveSharedListComponent seriesForSharedListSubjectErrorEmitter.subscribe: ', err );
            }
        );


    }

    onNameChange( form: NgForm ) {
        this.status = this.NONE;
    }

    onCancelClick( form: NgForm ) {
        this.showSaveListNameInputBox = false;
        this.menuService.unlockMenu();
        this.status = this.NONE;
        form.reset();
    }


    async onSubmit( form: NgForm ) {
        // If it's a dupe, the user wants us to replace, so delete first
        if( this.status === this.DUPE ){
            this.doDelete( form );
            // Wait for asynchronous delete to be finished
            while( this.deleteStatus === this.WAITING ){
                await this.commonService.sleep( Consts.waitTime );
            }
        }
        this.doSave( form );
    }

    doSave( form: NgForm ) {
        this.status = this.WAITING;

        if( this.sharedListInputType === MenuItems.SAVE_SHARED_LIST_CART_MENU_ITEM ){
            this.saveSharedListFromCart( form );
        }
        else if( this.sharedListInputType === MenuItems.SAVE_SHARED_LIST_SUBJECT_ID_INPUT_MENU_ITEM ){
            this.saveSharedListFromSubjectId( form );
        }
    }


    async saveSharedListFromSubjectId( form: NgForm ) {
        let subjectIdList = form.value['subjectIdList'].replace( /\s*,\s*/g, ' ' ).replace( /\s+/g, ' ' ).replace( /\s*$/, '' ).split( ' ' );

        let i = 0;
        let subjecIdQueryString = '';
        for( let subjectId of subjectIdList ){
            subjecIdQueryString += '&criteriaType' + i + '=PatientCriteria&value' + i + '=' + subjectId;
            i++;
        }
        // Remove leading "&"
        subjecIdQueryString = subjecIdQueryString.substr( 1 );

        this.status = this.WAITING;
        this.apiServerService.doSearch( Consts.SHARED_LIST_SUBJECT_ID_SEARCH, subjecIdQueryString );
        // Wait for asynchronous search to be finished
        while( this.status === this.WAITING ){
            await this.commonService.sleep( Consts.waitTime );
        }

        // Build the query
        let query = '';
        for( let row of  this.subjectData.res ){

            for( let studyIdentifier of row.studyIdentifiers ){

                for( let f = 0; f < studyIdentifier.seriesIdentifiers.length; f++ ){
                    query += '&list=' + studyIdentifier.seriesIdentifiers[f];
                }
            }
        }
        // Remove leading &
        query = query.substr( 1 );

        // Run the query
        this.status = this.WAITING;
        this.apiServerService.doSearch( Consts.SERIES_FOR_SHARED_LIST_SUBJECT, query );

        // Wait for asynchronous search to be finished
        while( this.status === this.WAITING ){
            await this.commonService.sleep( Consts.waitTime );
        }
    }

    async saveSharedListFromCart( form: NgForm ) {

        this.commonService.sharedListDoSave( form.value['name'], form.value['description'], form.value['url'] );

        while( this.status === this.WAITING ){
            await this.commonService.sleep( Consts.waitTime );
        }

        if( this.status === this.GOOD ){
            this.showSaveListNameInputBox = false;
            this.menuService.unlockMenu();
            this.status = this.NONE;
            form.reset();
        }
        else if( this.status === this.DUPE ){
            // alert(form.value['name'] + ' already exists, choose another name.');
        }
        else if( this.status === this.BAD ){
            alert( 'Error saving shared list.' );
            this.status = this.NONE;
            form.reset();
        }

    }

    async doDelete( form: NgForm ) {
        this.deleteStatus = this.WAITING;

        let query = 'name=' + form.value['name'];
        this.apiServerService.doSearch( Consts.DELETE_SHARED_LIST, query );

        while( this.deleteStatus === this.WAITING ){
            await this.commonService.sleep( Consts.waitTime );
        }

        if( this.deleteStatus === this.GOOD ){
        }
        if( this.deleteStatus === this.BAD ){
            console.error( 'Error Deleting shared list: ' + form.value['name'] );
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
