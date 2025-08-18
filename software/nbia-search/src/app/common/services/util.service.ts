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

    // In a util service or inside your component
    normalizeName(name: string): string {
        if (!name) return '';
        return name
        .toLowerCase()
        .replace(/[\s_-]+/g, '')  // remove spaces, dashes, underscores
        .trim();
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

    copyCriteriaObjectArraywithFieldName( origObject: any[] , fieldName: string ) : any[] | null {
        if (!Array.isArray(origObject)) return null;
        return origObject.map(criteria => this.copyCriteriaObjectwithFieldName(criteria, fieldName)).filter(copy => copy != null);;
    }

    copyCriteriaObjectwithFieldName( origCrit: any, fieldName: string ): any {
        if (!origCrit || !origCrit.Authorized || origCrit.Authorized !== 1) return null;

        if(fieldName === 'Manufacturer'){
            const result: any = {
                Manufacturer: origCrit[fieldName] ?? 'NOT SPECIFIED', // fallback if already shaped
                count: origCrit.Count ?? origCrit.count,
            };
            return result;
        }else{
            const result: any = {
                criteria: origCrit[fieldName] ?? origCrit['criteria'], // fallback if already shaped
                description: origCrit.description,
                count: origCrit.Count ?? origCrit.count,
            };

            if (!this.isNullOrUndefined(origCrit.seq)) {
                result.seq = origCrit.seq;
            }
            return result;
        }
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
        copyCrit['Manufacturer'] = origCrit['Manufacturer'] || '- NOT SPECIFIED -';;
        //copyCrit['ManufacturerModelName'] = origCrit['ManufacturerModelName'];
        if( !this.isNullOrUndefined( origCrit['seq'] ) ){
            copyCrit['seq'] = origCrit['seq'];
        }
        return copyCrit;
    }

    // deep copy of an tciaProgramList
    copyTciaProgramList( source: any[]): any[] {
        if (!Array.isArray(source)) return [];

        return source.map(program => ({
          ...program,
          relatedCollectionsList: Array.isArray(program.relatedCollectionsList)
            ? program.relatedCollectionsList.map(col => ({ ...col }))
            : []
        }));
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

    /**
    * Preserves transient properties from the original list while merging new data.
    * @param originalList The current tciaProgramList with UI state.
    * @param updatedList The new list with server-updated data.
    * @param transientKeys The list of transient keys to preserve (e.g., 'selected', 'expanded')
    * @param collectionTransientKeys The list of transient keys for related collections to preserve.
    */
    preserveProgramListTransientState<T extends object>(
        originalList: T[],
        updatedList: T[],
        transientKeys: (keyof T)[],
        collectionTransientKeys: string[]
      ): T[] {
        const originalMap = new Map<string, T>();
      
        originalList.forEach(item => {
          const key = (item as any).criteria || (item as any).id;
          if (key) {
            originalMap.set(key, item);
          }
        });
      
        return updatedList.map(updated => {
          const key = (updated as any).criteria || (updated as any).id;
          const original = originalMap.get(key);
          if (!original) return updated;
      
          const preserved: Partial<T> = {};
      
          for (const k of transientKeys) {
            if (k in original) {
              preserved[k] = original[k];
            }
          }
      
          const originalNested = (original as any).relatedCollectionsList || [];
          const originalNestedMap = new Map<string, any>(
            originalNested.map((c: any) => [c.criteria, c])
          );
      
          const updatedNested = ((updated as any).relatedCollectionsList || []).map((c: any) => {
            const o = originalNestedMap.get(c.criteria);
            if (!o) return c;
      
            const preservedNested: any = {};
            for (const k of collectionTransientKeys) {
              if (k in o) {
                preservedNested[k] = o[k];
              }
            }
            return {
              ...c,
              ...preservedNested
            };
          });
      
          return {
            ...(updated as any),
            ...preserved,
            relatedCollectionsList: updatedNested
          };
        });
      }
}
