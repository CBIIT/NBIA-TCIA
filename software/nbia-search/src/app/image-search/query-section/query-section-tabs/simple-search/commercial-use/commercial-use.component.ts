import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { ParameterService } from '@app/common/services/parameter.service';
import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { UtilService } from '@app/common/services/util.service';
import { Consts } from '@app/consts';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component( {
    selector: 'nbia-commercial-use',
    templateUrl: './commercial-use.component.html',
    styleUrls: ['../simple-search.component.scss', './commercial-use.component.scss']
} )
export class CommercialUseComponent implements OnInit, OnDestroy{

    excludeCom = false;

    /**
     * Used to clean up subscribes on the way out to prevent memory leak.
     * @type {Subject<boolean>}
     */
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private parameterService: ParameterService,
                 private initMonitorService: InitMonitorService, private queryUrlService: QueryUrlService,
                 private apiServerService: ApiServerService, private utilService: UtilService ) {
    }

    ngOnInit() {
        // Called when the "Clear" button on the left side of the Display query at the top.
        this.commonService.resetAllSimpleSearchEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            () => {
                this.excludeCom = false;
                this.initMonitorService.setExcludeCommercialInit( true );
            }
        );

        // Used when there are query parameters in the URL.
        this.parameterService.parameterExcludeCommercialEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.excludeCom = (JSON.stringify( data ).toUpperCase() === '"YES"') ? true : false;
                this.onExcludeCommercialCheckboxClick( this.excludeCom );
                this.commonService.setHaveUserInput( false );
            }
        );

        this.initMonitorService.setExcludeCommercialInit( true );
    }

    onExcludeCommercialCheckboxClick( checked ) {
        // If this method was called from a URL parameter search, setHaveUserInput will be set to false by the calling method after this method returns.
        this.commonService.setHaveUserInput( true );

        let excludeCommercialQuery: string[] = [];
        excludeCommercialQuery[0] = Consts.EXCLUDE_COMMERCIAL_CRITERIA;

        if( checked ){
            excludeCommercialQuery[1] = <string>((checked) ? 'YES' : 'NO');
            // Update queryUrlService
            this.queryUrlService.update( this.queryUrlService.EXCLUDE_COMMERCIAL, 'YES' );

        }else{
            // Remove (if any) in the queryUrlService
            this.queryUrlService.clear( this.queryUrlService.EXCLUDE_COMMERCIAL );
        }
        this.commonService.updateQuery( excludeCommercialQuery );

    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
