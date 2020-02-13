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

    if( this.isEmpty( v ) ){
        return true;
    }
      return false;
  }

  isTrue( value ) {

    if( typeof value === 'boolean' ){
      if( value ){
        return true;
      }else{
        return false;
      }
    }

    let val = value.toUpperCase();
    if( (val === 'TRUE') || (val === 'YES') || (val === 'ON') || (val === '1') || (val === '') ){
      return true;
    }
    return false;
  }

  sleep( ms ) {
    return new Promise( resolve => setTimeout( resolve, ms ) );
  }


}
