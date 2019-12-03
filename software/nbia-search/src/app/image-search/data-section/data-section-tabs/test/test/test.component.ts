import { Component, OnInit } from '@angular/core';
import { ApiServerService } from '../../../../services/api-server.service';
import { PersistenceService } from '@app/common/services/persistence.service';
import { Consts } from '@app/consts';
import { LoadingDisplayService } from '@app/common/components/loading-display/loading-display.service';
import { Properties } from '@assets/properties';
import { CommonService } from '@app/image-search/services/common.service';

@Component( {
    selector: 'nbia-test',
    templateUrl: './test.component.html',
    styleUrls: ['../../../../../app.component.scss', './test.component.scss']
} )
export class TestComponent implements OnInit{
    token;

    colors0 = Consts.COLOR_ARRAY0;
    colors1 = Consts.COLOR_ARRAY1;
    colors2 = Consts.COLOR_ARRAY2;
    col = '#ff70e';


    API_SERVER_URL = Properties.API_SERVER_URL;
    DEBUG_CURL = Properties.DEBUG_CURL;

    sortByCount: boolean = true;
    sortByName: boolean = false;

    properties = Properties;

    // sortByLabels = ['Count', 'Name'];

    constructor( private apiServerService: ApiServerService, private persistenceService: PersistenceService,
                 private loadingDisplayService: LoadingDisplayService, private commonService: CommonService ) {
    }

    ngOnInit() {

        this.token = this.persistenceService.get( 'token' );
        this.sortByCount = Properties.SORT_BY_COUNT;
        this.sortByName = !this.sortByCount;
    }

    onLoadingDisplay() {
        this.loadingDisplayService.setLoading( true, 'Doing stuff for three seconds' );

        // We need a small delay here.
        setTimeout( () => {
            this.loadingDisplayService.setLoading( false );
        }, 3000 );

    }

    onUpdateClick() {
        this.token = this.persistenceService.get( 'token' );
    }


    onOkayClick() {
        this.apiServerService.setToken( this.token );
    }

    onUpdateApiServerUrl() {
        Properties.API_SERVER_URL = this.API_SERVER_URL;
        // Rest charts
        this.commonService.reInitCharts();


        // Reload available search criteria, it can be different for each user.
        this.commonService.resetAllSimpleSearchForLogin();
        this.commonService.clearSimpleSearchResults();
    }

    onDebugCheckboxClick( c ) {
        console.log( 'onDebugCheckboxClick: ', c );
    }

    onDebugApiCheckboxClick( c ) {
        this.DEBUG_CURL = c;
        Properties.DEBUG_CURL = c;
    }

    onSortRadio( state ) {
        this.sortByCount = state;
        this.sortByName = !state;
        Properties.SORT_BY_COUNT = this.sortByCount;
    }
}
