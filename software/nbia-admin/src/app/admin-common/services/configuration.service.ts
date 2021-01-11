import { Injectable } from '@angular/core';
import { Properties } from '@assets/properties';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';

@Injectable( {
    providedIn: 'root'
} )
export class ConfigurationService {

    constructor( private httpClient: HttpClient, private utilService: UtilService ) {
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
        // console.log('MHL parseConfig: ', data);
        let config = data.replace( /\r\n/g, '\r' ).replace( /\n/g, '\r' ).split( /\r/ );

        for( let line of config ){
            if( line.match( '^\s*#' ) ){
            }else{
                if( line.includes( '=' ) ){
                    let value = line.replace( /.*?=\s*/, '' );
                    let key = line.replace( /\s*?=.*$/, '' );
                    key = key.replace( /^\s*/, '' );


                    if( key === 'OHIF_SERVER_URL' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.OHIF_SERVER_URL = value;
                        }
                    }

                    if( key === 'MAX_VIDEO_FPS' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.MAX_VIDEO_FPS = value;
                        }
                    }

                    if( key === 'OHIF_MODALITIES' ){
                        // toUpperCase for case insensitive.
                        Properties.OHIF_MODALITIES = value.toUpperCase().split( /\s*,\s*/ );
                    }

                    if( key === 'OHIF_viewer' ){
                        Properties.SHOW_OHIF_VIEWER = this.utilService.isTrue( value );
                    }

                    if( key === 'ENABLE_WIDGET_TESTER' ){
                        Properties.SHOW_DYNAMIC_QUERY_CRITERIA_TEST_PAGE = this.utilService.isTrue( value );
                        // console.log('MHL Properties.SHOW_DYNAMIC_QUERY_CRITERIA_TEST_PAGE value: ', value);
                        // console.log('MHL Properties.SHOW_DYNAMIC_QUERY_CRITERIA_TEST_PAGE: ', Properties.SHOW_DYNAMIC_QUERY_CRITERIA_TEST_PAGE);
                    }

                    if( key === 'DEMO_MODE' ){
                        Properties.DEMO_MODE = this.utilService.isTrue( value );
                    }

                    if( key === 'brand' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.BRAND = value;
                        }
                    }


                    if( key === 'DEFAULT_SECRET' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.DEFAULT_SECRET = value;
                        }
                    }

                    if( key === 'SHOW_UNIVERSAL_MENU' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.SHOW_UNIVERSAL_MENU = value;
                        }
                    }

                    if( key === 'HELP_BASE_URL' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.HELP_BASE_URL = value;
                        }
                    }

                    if( key === 'CINE_MODE_TOGGLE_KEY' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.CINE_MODE_TOGGLE_KEY = value;
                        }
                    }

                    if( key === 'UNIVERSAL_HEADING_AND_MENU' ){
                        Properties.SHOW_UNIVERSAL_MENU = this.utilService.isTrue( value );
                    }

                    if( key === 'SHOW_ROLES' ){
                        Properties.SHOW_ROLES = this.utilService.isTrue( value );
                    }

                    if( key === 'NO_LICENSE' ){
                        Properties.NO_LICENSE = this.utilService.isTrue( value );
                    }

                }
            }
        }
    }


}
