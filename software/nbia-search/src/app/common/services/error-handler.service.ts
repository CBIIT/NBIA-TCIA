import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


/**
 * This service (at least for now) will only provide user notification and console output.
 */
export class ErrorHandlerService{

    Source = Object.freeze( {
        COMMON_SERVICE: 0,
        API_SERVICE: 1
    } );


    constructor() {
    }

    warn(source, element, errorText?, errorNumber?)
    {

    }

    error(source, element, errorText?, errorNumber?)
    {

    }

}
