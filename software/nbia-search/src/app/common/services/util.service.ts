import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';

@Injectable( {
    providedIn: 'root'
} )
export class UtilService{


    constructor( @Inject( LOCALE_ID ) private locale: string ) {
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

        if( typeof value === 'boolean'){
            if( value){
                return true;
            }
            else{
                return false;
            }
        }

        let val = value.toUpperCase();
        if( (val === 'TRUE') || (val === 'YES') || (val === 'ON') || (val === '1') || (val === '') ){
            return true;
        }
        return false;
    }


    copyCriteriaObjectArray( origObject ) {
        if( origObject === null ){
            return origObject;
        }
        let copyObj = [];
        for( let criteria of origObject ){
            copyObj.push( this.copyCriteriaObject( criteria ) );
        }
        return copyObj;
    }

    copyCriteriaObject( origCrit ) {
        let copyCrit = {};
        copyCrit['criteria'] = origCrit['criteria'];
        copyCrit['description'] = origCrit['description'];
        copyCrit['count'] = origCrit['count'];
        if( !this.isNullOrUndefined( origCrit['seq'] ) ){
            copyCrit['seq'] = origCrit['seq'];
        }
        return copyCrit;
    }

    // Manufacturer values copy
    copyManufacturerObjectArray( origObject ) {
        if( origObject === null ){
            return origObject;
        }
        let copyObj = [];
        for( let criteria of origObject ){
            copyObj.push( this.copyManufacturerObject( criteria) ) ;
        }
        return copyObj;
    }

    copyManufacturerObject( origCrit ) {
        let copyCrit = {};
        copyCrit['Manufacturer'] = origCrit['Manufacturer']?.replace(/,/g, ' ') || '- NOT SPECIFIED -';;
        //copyCrit['ManufacturerModelName'] = origCrit['ManufacturerModelName'];
        if( !this.isNullOrUndefined( origCrit['seq'] ) ){
            copyCrit['seq'] = origCrit['seq'];
        }
        return copyCrit;
    }

    /**
     * Build a csv formatted string from a cart list, with a header row
     *
     * @param s  The same data that is displayed on the Cart screen.
     * @returns {string}  The complete csv formatted data.
     */
    csvFormatCart( s ) {
        // The heading
        let csvRow = 'Patient ID,Study UID,Study Date,Study Description,Series ID,Series Description,Number of images,File Size,Annotation File Size\n';
        for( let row of s ){
            if( (this.isNullOrUndefined( row.disabled )) || (!row.disabled) ){
                csvRow += this.csvFormatOneField( row.patientId ) + ',' +
                    this.csvFormatOneField( row.studyId ) + ',' +
                    // this.csvFormatOneField( row.studyDate ) + ',' +
                    this.csvFormatOneField( formatDate( row.studyDate, 'MM/dd/yyyy', this.locale ) ) + ',' +
                    this.csvFormatOneField( row.studyDescription ) + ',' +
                    this.csvFormatOneField( row.seriesId ) + ',' +
                    this.csvFormatOneField( row.description ) + ',' +
                    this.csvFormatOneField( row.numberImages ) + ',' +
                    this.csvFormatOneField( row.totalSizeForAllImagesInSeries ) + ',' +
                    this.csvFormatOneField( row.annotationsSize ) + // Make sure there is no comma on the last one.
                    '\n';
            }
        }
        return csvRow;
    }

    csvFormatOneField( s: string ) {
        // If it has a double quote or a comma we need to change it.
        let expr = /(,|")/;  // no quotes here
        if( expr.test( s ) ){
            s = s.replace( new RegExp( '"', 'g' ), '""' );
            s = '"' + s + '"';
        }
        return s;
    }

    setInputFilter( textbox, inputFilter ) {
        ['input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'select', 'contextmenu', 'drop'].forEach( function( event ) {
            textbox.addEventListener( event, function() {
                if( inputFilter( this.value ) ){
                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                }else if( this.hasOwnProperty( 'oldValue' ) ){
                    this.value = this.oldValue;
                    this.setSelectionRange( this.oldSelectionStart, this.oldSelectionEnd );
                }else{
                    this.value = '';
                }
            } );
        } );
    }

}
