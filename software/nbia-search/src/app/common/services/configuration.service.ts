import { Injectable } from '@angular/core';
import { Properties } from '@assets/properties';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '@app/image-search/services/common.service';
import { UtilService } from '@app/common/services/util.service';

@Injectable( {
    providedIn: 'root'
} )
export class ConfigurationService{

    constructor( private httpClient: HttpClient, private commonService: CommonService,
                 private utilService: UtilService ) {
    }

    initConfiguration() {

        this.readTextFile( 'assets/' + Properties.CONFIG_FILE ).subscribe(
            data => {

                this.parseConfig( data );
                Properties.CONFIG_COMPLETE = true;
            },
            err => {
                if( err.status === 404 ){
                    console.error( 'Could not find CONFIG_FILE file "' + 'assets/' + Properties.CONFIG_FILE );
                }
                console.error( 'Could not access CONFIG_FILE file! ', err.status );
                Properties.CONFIG_COMPLETE = true;

            }
        );
    }

    readTextFile( file ): Observable<any> {
        return this.httpClient.get( file,
            {
                responseType: 'text'
            } );
    }


    parseConfig( data ) {
        let config = data.replace( /\r\n/g, '\r' ).replace( /\n/g, '\r' ).split( /\r/ );

        for( let line of config ){
            if( line.match( '^\s*#' ) ){
            }else{
                if( line.includes( '=' ) ){
                    let value = line.replace( /.*?=\s*/, '' );
                    let key = line.replace( /\s*?=.*$/, '' );

                    if( key === 'banner' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.BANNER_TEXT = value;
                        }
                    }

                    if( key === 'banner_exp' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.BANNER_EXP = value;
                        }
                    }

                    if( key === 'brand' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.BRAND = value;
                        }
                    }

                    if( key === 'OHIF_viewer_series' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.SHOW_OHIF_SERIES_VIEWER = this.utilService.isTrue( value );
                        }
                    }

                    if( key === 'OHIF_viewer_study' ){
                        Properties.SHOW_OHIF_VIEWER = this.utilService.isTrue( value );
                    }

                    if( key === 'OHIF_viewer_url' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.OHIF_SERVER_URL = value;
                        }
                    }

                    if( key === 'API_host' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.API_SERVER_URL = value;
                        }
                    }
                    if( key === 'http_timeout' ){
                        Properties.HTTP_TIMEOUT = value;
                    }
                }
            }
        }
    }
}
