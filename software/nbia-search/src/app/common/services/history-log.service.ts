import { Injectable } from '@angular/core';
import { Consts } from '@app/consts';
import { UtilService } from '@app/common/services/util.service';
import { Properties } from '@assets/properties';

@Injectable()
export class HistoryLogService{

    constructor( private utilService: UtilService ) {
    }

    doLog( component, user, data ) {
        let logEntry = '';
        let logData;

        // TODO  This is a temporary fix until the database can accommodate more than 255 chars
        logData = {
            'action': component,
            'user': user
        };

        if( Properties.SHORT_LOG ){
            logEntry = JSON.stringify( logData );
            logEntry = encodeURI( logEntry );
        }

        else{


            switch( component ){

                case Consts.HELP_SITE_LOG_TEXT:

                    break;

                case Consts.LOAD_SAVED_QUERY_LOG_TEXT:
                    logData = {
                        'action': Consts.LOAD_SAVED_QUERY_LOG_TEXT,
                        'user': user
                    };
                    this.parametersToObject( logData, data );


                    logEntry = JSON.stringify( logData );
                    logEntry = encodeURI( logEntry );

                    break;

                case Consts.SAVE_CART_LOG_TEXT:
                    logData = {
                        'action': Consts.SAVE_CART_LOG_TEXT,
                        'user': user,
                        'name': data
                    };
                    logEntry = JSON.stringify( logData );
                    logEntry = encodeURI( logEntry );

                    break;

                case Consts.SHARE_QUERY_LOG_TEXT:
                    logData = {
                        'action': Consts.SHARE_QUERY_LOG_TEXT,
                        'user': user,
                        'API_server': location.origin.toString(),
                        'query': data
                    };

                    logEntry = JSON.stringify( logData );
                    logEntry = encodeURI( logEntry );

                    break;

                case Consts.DOWNLOAD_CART_LOG_TEXT:
                    logData = {
                        'action': Consts.DOWNLOAD_CART_LOG_TEXT,
                        'user': user
                    };

                    for( let item of data ){
                        if( !item.disabled ){
                            let temp = {};
                            temp['subjectId'] = item.patientId;
                            temp['studyId'] = item.studyId;
                            temp['studyDescription'] = item.studyDescription;
                            temp['studyDate'] = item.studyDate;
                            temp['seriesId'] = item.seriesId;
                            temp['seriesDescription'] = item.seriesDescription;
                            temp['seriesNumberOfImages'] = item.numberImages;

                            if( this.utilService.isNullOrUndefined( logData['series'] ) ){
                                logData['series'] = [];
                            }
                            logData['series'].push( temp );
                        }

                    }
                    logEntry = JSON.stringify( logData );
                    logEntry = encodeURI( logEntry );

                    break;

                case Consts.SIMPLE_SEARCH_LOG_TEXT:
                    logData = {
                        'action': Consts.SIMPLE_SEARCH_LOG_TEXT,
                        'user': user,
                        'API_server': location.origin.toString(),
                        'query': data
                    };
                    this.parametersToObject( logData, data );
                    logEntry = JSON.stringify( logData );
                    logEntry = encodeURI( logEntry );

                    break;

               case Consts.TEXT_SEARCH_LOG_TEXT:
                    logData = {
                        'action': Consts.TEXT_SEARCH_LOG_TEXT,
                        'user': user
                    };
                    this.parametersToObject( logData, data );
                    logEntry = JSON.stringify( logData );
                    logEntry = encodeURI( logEntry );

                    break;


            }
        }

        return logEntry;

    }


    /**
     * @TODO This needs error checking after the splits!
     */
    parametersToObject( dataObject, data ) {

        let key;
        let val;

        // Add a trailing "&" so we can blindly remove the trailing ONE "&"
        data += '&';

        let splitData = data.split( /criteriaType[0-9]?=/ );

        for( let item of splitData ){
            if( item.length > 0 ){
                let regex = /^DateRange.*/;

                // Is it a date range?
                if( regex.test( item ) ){
                    let dateParts = item.split( /&/ );
                    key = dateParts[0];
                    val = {};
                    val[dateParts[1].split( /=/ )[0].replace( /[0-9]+$/, '' )] = dateParts[1].split( /=/ )[1];
                    val[dateParts[2].split( /=/ )[0].replace( /[0-9]+$/, '' )] = dateParts[2].split( /=/ )[1];

                }
                else{
                    let itemParts = item.split( /=/ );
                    key = itemParts[0].replace( /&.*/, '' ).replace( /Criteria$/, '' );
                    val = itemParts[1].replace( /&.*/, '' );
                }


                if( this.utilService.isNullOrUndefined( dataObject[key] ) ){
                    dataObject[key] = [];
                }
                dataObject[key].push( val );
            }
        }
    }

}
