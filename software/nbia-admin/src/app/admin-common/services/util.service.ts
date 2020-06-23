import { Injectable } from '@angular/core';
import Promise from 'ts-promise';

@Injectable( {
  providedIn: 'root'
} )
export class UtilService{

  constructor() {
  }


  isNullOrUndefined( v ): boolean {
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


  isEmpty( obj ) {
    for( let key in obj ){
      if( obj.hasOwnProperty( key ) ){
        return false;
      }
    }
    return true;
  }


  isNullOrUndefinedOrEmpty( v ): boolean {
    if( this.isNullOrUndefined( v ) ){
      return true;
    }

    return this.isEmpty( v ); // CHECKME

  }

  isTrue( value ) {

    if( typeof value === 'boolean' ){
      return value;
    }

    let val = value.toUpperCase();
    return (val === 'TRUE') || (val === 'YES') || (val === 'ON') || (val === '1') || (val === '');

  }

  sleep( ms ) {
    return new Promise( resolve => setTimeout( resolve, ms ) );
  }

    leftPad(val, resultLength = 2, leftpadChar = '0'): string {
        return (String(leftpadChar).repeat(resultLength)
            + String(val)).slice(String(val).length);
    }

}
