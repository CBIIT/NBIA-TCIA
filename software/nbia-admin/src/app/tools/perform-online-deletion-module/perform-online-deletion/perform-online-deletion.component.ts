import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/admin-common/services/api.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'nbia-perform-online-deletion',
  templateUrl: './perform-online-deletion.component.html',
  styleUrls: ['./perform-online-deletion.component.scss']
})
export class PerformOnlineDeletionComponent implements OnInit {
    userRoles;
    roleIsGood = false;

    seriesForDeletion;

    testData =  [
        {'order': 1, 'seriesUID': 'uid000', 'project': 'testP0', 'site': 'testS0'},
        {'order': 2, 'seriesUID': 'uid001', 'project': 'testP1', 'site': 'testS1'},
        {'order': 3, 'seriesUID': 'uid002', 'project': 'testP2', 'site': 'testS2'}
    ];

        // {{series['order']}}  {{series['seriesUID']}}  {{series['project']}}  {{series['site']}}
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(private apiService: ApiService, private utilService: UtilService) { }

  ngOnInit() {

      this.apiService.updatedUserRolesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
          data => {
              this.userRoles = data;
              if( this.userRoles !== undefined && this.userRoles.indexOf( 'NCIA.DELETE_ADMIN' ) > -1 ){
                  this.roleIsGood = true;
              }
          });
      this.apiService.getRoles();

      this.apiService.seriesForDeletionEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
          data => {
              this.seriesForDeletion = data;

              // FOR TESTING!!!!!!!!!!!!!!!!!!!!
              this.seriesForDeletion = this.testData;
          } );

      this.apiService.getSeriesForDeletion();
  }

}
