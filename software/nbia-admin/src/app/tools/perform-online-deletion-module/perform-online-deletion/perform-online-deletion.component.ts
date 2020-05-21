import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '@app/admin-common/services/api.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-perform-online-deletion',
    templateUrl: './perform-online-deletion.component.html',
    styleUrls: ['./perform-online-deletion.component.scss']
} )
export class PerformOnlineDeletionComponent implements OnInit, OnDestroy{
    userRoles;
    roleIsGood = false;
    seriesCount = -1;

    seriesForDeletion;

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

    constructor( private apiService: ApiService, private utilService: UtilService ) {
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
                console.log( '[submitOnlineDeletionResultsEmitter]We have an answer from the server: ', data );

                // Update search results (Approved for deletion"
                this.apiService.getSeriesForDeletion();
            } );

        this.apiService.seriesForDeletionEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.seriesForDeletion = data;
                this.seriesCount = this.seriesForDeletion.length;
            } );

        this.apiService.getSeriesForDeletion();
    }

    onPerformOnlineDeletionClick() {
        this.apiService.submitOnlineDeletion();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }


}
