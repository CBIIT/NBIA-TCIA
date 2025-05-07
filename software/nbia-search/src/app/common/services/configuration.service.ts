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
    private sharedConfig: any;

    constructor( private httpClient: HttpClient, private commonService: CommonService,
                 private utilService: UtilService ) {
    }

    async loadSharedConfig(): Promise<any> {

		//const env = this.resolveEnv(); // "dev" or "prod"
		//const configFile = `/assets/config.${env}.json`;
	
		return await this.httpClient.get('assets/shared-config.json')
		.toPromise().then(data => {
			this.sharedConfig = data;
		}).catch( err => { console.error( 'could not load shared-config ', err);
			this.sharedConfig ={};
		}
		);
	}
	getSharedConfig(key: string): any {
		return this.sharedConfig?.[key];
	}

	getAllSharedConfig(): any {
		return this.sharedConfig;
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
                    key = key.replace(/^\s*/, '');
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

                    if( key === 'SHOW_DATA_ADMIN_MENU' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.SHOW_DATA_ADMIN_MENU = this.utilService.isTrue( value );
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
                    if( key === 'API_host' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.API_SERVER_URL = value;
                        }
                    }

                   if( key === 'DEFAULT_USER' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.DEFAULT_USER = value;
                        }
                    }

                   if( key === 'DEFAULT_PASSWORD' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.DEFAULT_PASSWORD = value;
                        }
                    }

                   if( key === 'DEFAULT_SECRET' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.DEFAULT_SECRET = value;
                        }
                    }

                   if( key === 'DEFAULT_CLIENT_ID' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.DEFAULT_CLIENT_ID = value;
                        }
                    }

                    if( key === 'http_timeout' ){
                        Properties.HTTP_TIMEOUT = value;
                    }

                    if( key === 'OHIF_MODALITIES'){
                        // toUpperCase for case insensitive.
                        Properties.OHIF_MODALITIES = value.toUpperCase().split(/\s*,\s*/);
                    }

                    if( key === 'OHIF_SERVER_URL' ){
                        if( !this.utilService.isNullOrUndefinedOrEmpty( value ) ){
                            Properties.OHIF_SERVER_URL = value;
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
