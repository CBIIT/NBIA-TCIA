import { Component, Input, OnInit } from '@angular/core';
import { Consts } from '@app/constants';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from '@app/admin-common/services/api.service';
import { AccessTokenService } from '@app/admin-common/services/access-token.service';
import { UtilService } from '@app/admin-common/services/util.service';
import { PreferencesService } from '@app/preferences/preferences.service';
import {
    WidgetSiteLicenseService
} from '@app/tools/query-section-module/dynamic-query-criteria/widget/widget-site-license.service';

@Component( {
    selector: 'nbia-edit-site-license',
    templateUrl: './edit-site-license.component.html',
    styleUrls: ['./edit-site-license.component.scss']
} )
export class EditSiteLicenseComponent implements OnInit{
    @Input() currentTool;
    consts = Consts;
    currentSelectedSiteLicenseLongName = '';
    currentSelectedSiteLicenseLongNameTrailer = '';
    statusText = '';
    noLicText = 'Select Site license';
    /**
     * The list of licenses we are working with.
     * This one object/license is a placeholder for the HTML until the license data makes its way back from the server.
     */
    licData = [
        {
            shortName: '',
            longName: '',
            licenseURL: '',
            commercialUse: true,
            id: -1,
        }
    ];
    longNameList = [];
    collectionName = '';
    siteName = '';

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor(
        private apiService: ApiService,
        private accessTokenService: AccessTokenService,
        private utilService: UtilService,
        private widgetSiteLicenseService: WidgetSiteLicenseService
    ){
    }

    ngOnInit(){

         this.widgetSiteLicenseService.siteLicenseSiteEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data : string) => {
                let splitted = data['value'].split('//');
                this.apiService.getSiteLicense('collectionName='  +  splitted[0] + '&siteName=' + splitted[1]   );
            }
         );

        // Get the list of licenses and their associated data.
        this.apiService.collectionLicensesResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
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

                for( let lic of this.licData ){
                    this.longNameList.push( lic['longName']);
                }
            } );

        this.apiService.getCollectionLicenses();



        // A Site radio button has been clicked
        this.apiService.siteLicensesResultsEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            ( data ) => {
                this.collectionName = data['collectionName'];
                this.siteName = data['siteName'];

                if( data['licenseDTO'] === null || data['licenseDTO'] === undefined || data['licenseDTO']['longName'] === undefined ){
                   // this.statusText = 'Warning: Could not get current license for this site'; // @TODO we should be able to remove statusText
                   // this.currentSelectedSiteLicenseLongName = this.longNameList[0];  // If they have no License use the first one until/unless they select another
                    this.currentSelectedSiteLicenseLongName = this.noLicText;
                }
                else{
                    // Got a license for this site, continue
                    this.currentSelectedSiteLicenseLongName = data['licenseDTO']['longName'];
                    this.statusText = '';
                }
                this.currentSelectedSiteLicenseLongNameTrailer = this.currentSelectedSiteLicenseLongName;

            },
            ( err ) => {
                console.log( 'Error siteLicensesResultsEmitter error: ', err );
            }
        );
    }


    noLicense(){
        this.currentSelectedSiteLicenseLongName = this.currentSelectedSiteLicenseLongNameTrailer;
    }

    onLicSelect(i){
    }


   async save(){
        let runaway = 1000; // @TESTING  @CHECKME
        while( (runaway > 0 ) && ( this.collectionName === undefined || this.siteName === undefined || this.currentSelectedSiteLicenseLongName === undefined )){
           runaway--;
            await this.utilService.sleep( Consts.waitTime );
        }
        if( runaway < 1 ){
            console.error('MHL NO collectionName & siteName');
        }

        this.apiService.setSiteLicense(this.collectionName, this.siteName, this.currentSelectedSiteLicenseLongName);
        this.statusText = '';
        this.currentSelectedSiteLicenseLongNameTrailer = this.currentSelectedSiteLicenseLongName;
    }

    reset(){
        // Empty string
        if( this.currentSelectedSiteLicenseLongNameTrailer.length < 1){
            this.currentSelectedSiteLicenseLongNameTrailer = this.noLicText;
        }
        this.currentSelectedSiteLicenseLongName = this.currentSelectedSiteLicenseLongNameTrailer;
    }

}
