import { Injectable } from '@angular/core';
import { Properties } from '../../assets/properties';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(  private httpClient: HttpClient, private utilService: UtilService ) { }

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

                }
            }
        }
    }

}
