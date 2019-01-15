import { Injectable } from '@angular/core';

@Injectable( {
    providedIn: 'root'
} )
export class UtilService{

    constructor() {
    }


    isNullOrUndefined( val ): boolean {
        let res = false;
        if( val == null ){
            res = true;
        }

        if( val === null ){
            res = true;
        }

        if( typeof val === 'undefined' ){
            res = true;
        }

        return res;
    }


    /**
     * A number or a boolean will return Empty (true)
     * @param obj
     * @returns {boolean}
     */
    isEmpty( obj ) {
        for( let key in obj ){
            if( obj.hasOwnProperty( key ) ){
                return false;
            }
        }
        return true;
    }


    isNullOrUndefinedOrEmpty( val ): boolean {
        if( this.isNullOrUndefined( val ) ){
            return true;
        }

        return( this.isEmpty(val));
    }

    isTrue( value ) {
        if( this.isNullOrUndefined( value ) ){
            return false;
        }

        if( typeof value === 'number' ){
            return value !== 0;
        }

        if( typeof value === 'boolean' ){
            return value;
        }

        let val = '' + value.toUpperCase();
        return (val === 'TRUE') || (val === 'YES') || (val === 'ON') || (val === '1');


    }


    sleep( ms ) {
        return new Promise( resolve => setTimeout( resolve, ms ) );
    }

}
