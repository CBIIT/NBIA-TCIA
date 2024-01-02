import { Injectable } from '@angular/core';

@Injectable( {
    providedIn: 'root'
} )
export class UtilService{

    constructor(){
    }


    isNullOrUndefined( v ): boolean{
        let res = false;
        if( v == null ){
            res = true;
        }
        if( v === null ){
            res = true;
        }
        if( typeof v === 'undefined' ){
            res = true;
        }
        return res;
    }


    isEmpty( obj ){
        for( let key in obj ){
            if( obj.hasOwnProperty( key ) ){
                return false;
            }
        }
        return true;
    }


    isNullOrUndefinedOrEmpty( v ): boolean{
        if( this.isNullOrUndefined( v ) ){
            return true;
        }

        return this.isEmpty( v ); // CHECKME

    }

    isTrue( value ){

        if( typeof value === 'boolean' ){
            return value;
        }

        let val = value.toUpperCase();
        return (val === 'TRUE') || (val === 'YES') || (val === 'ON') || (val === '1') || (val === '');

    }

    sleep( ms ){
        return new Promise( resolve => setTimeout( resolve, ms ) );
    }

    leftPad( val, resultLength = 2, leftpadChar = '0' ): string{
        return (String( leftpadChar ).repeat( resultLength )
            + String( val )).slice( String( val ).length );
    }

    // @TODO Get rid of this  :)
    getFirstDayOfMonth( m, y ){
        let d = 0;
        // console.log( 'MHL NOG getFirstDayOfMonth m: ', m );
        // console.log( 'MHL NOG getFirstDayOfMonth y: ', y );
        return d;
    }


    /**
     * Format m/d/y
     * @param d
     */
    isGoodDate( date ): boolean{
        if(! date.match('^[0-9/]+$' )  ){
            return false;
        }

        let parts = date.split( '/' );
        if( parts.length !== 3 ){
            return false;
        }

        let m = parts[0];
        let d = parts[1];
        let y = parts[2];

        // Are all the dates numbers
        let numberRegex = /[0-9]+/;
        if( m.match(numberRegex) ){
            // console.log( 'month is a number: ', m );
        }else{
            // console.log( 'm is NOT a number typeof m: ', typeof m);
            return false;
        }

        if( y < 1950 ){
            return false;
        }

        let daysInThisMonth = new Date( y, m, 0 ).getDate();
        if( d > daysInThisMonth || m > 12 ){
            return false;
        }

        let tempDate = new Date( y, m - 1, d );
        return true;
    }

}
