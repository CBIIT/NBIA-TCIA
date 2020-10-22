import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '@app/admin-common/services/api.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PreferencesService } from '@app/preferences/preferences.service';


@Component( {
    selector: 'nbia-perform-online-deletion',
    templateUrl: './perform-online-deletion.component.html',
    styleUrls: ['./perform-online-deletion.component.scss']
} )

export class PerformOnlineDeletionComponent implements OnInit, OnDestroy{
    userRoles;
    roleIsGood = false;
    seriesCount = -1;
    deletedFlag = false;
    seriesForDeletion;
 currentFont;

    /*
        testData =  [
            {'order': 1, 'seriesUID': 'uid000', 'project': 'testP0', 'site': 'testS0'},
            {'order': 2, 'seriesUID': 'uid001', 'project': 'testP1', 'site': 'testS1'},
            {'order': 3, 'seriesUID': 'uid002', 'project': 'testP2', 'site': 'testS2'},
            {'order': 4, 'seriesUID': 'uid003', 'project': 'testP2', 'site': 'testS2'},
            {'order': 5, 'seriesUID': 'uid004', 'project': 'testP2', 'site': 'testS2'},
            {'order': 6, 'seriesUID': 'uid005', 'project': 'testP2', 'site': 'testS2'},
            {'order': 7, 'seriesUID': 'uid006', 'project': 'testP2', 'site': 'testS2'},
            {'order': 8, 'seriesUID': 'uid007', 'project': 'testP2', 'site': 'testS2'}
        ];
    */

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private apiService: ApiService, private utilService: UtilService,
                 private preferencesService: PreferencesService ) {
    }

    ngOnInit() {

        this.apiService.updatedUserRolesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.userRoles = data;
                if( this.userRoles !== undefined && this.userRoles.indexOf( 'NCIA.DELETE_ADMIN' ) > -1 ){
                    this.roleIsGood = true;
                }
            } );
        this.apiService.getRoles();

        this.apiService.submitOnlineDeletionResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                if( (<string>data).startsWith( 'ok')){
                    this.deletedFlag = true;
                }
            } );

        this.apiService.seriesForDeletionEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.seriesForDeletion = data;
                this.seriesCount = this.seriesForDeletion.length;
            } );

        this.apiService.getSeriesForDeletion();

        this.preferencesService.setFontSizePreferencesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.currentFont = data;
            } );

        // Get the initial value
        this.currentFont = this.preferencesService.getFontSize();
    }

    onPerformOnlineDeletionClick() {
        this.apiService.submitOnlineDeletion();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }


}
