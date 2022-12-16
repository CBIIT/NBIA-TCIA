import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
    name: 'toMbGb'
} )

/**
 * Convert value to the largest unit of measure and add a space and its abbreviation to the right.
 *
 * @param value
 * @param {number} decimalPlaces
 * @returns {string}
 */
export class ToMbGbPipe implements PipeTransform{
    transform( value: any, decimalPlaces = 0 ): string {
/*      JIRA 1899 
        let kb = 1024.0;
        let mb = 1048576.0;
        let gb = 1073741824.0;
*/

        let kb = 1000.0;
        let mb = 1000000.0;
        let gb = 1000000000.0;

        let bLabel = '';
        let kbLabel = 'KB';
        let mbLabel = 'MB';
        let gbLabel = 'GB';

        let factor;
        let label;

        // if it is less than 1kb, just return the number.
        if( value < kb ){
            return value + bLabel;
        }

        if( value <= mb ){
            factor = kb;
            label = kbLabel;
        }
        else if( value <= gb ){
            factor = mb;
            label = mbLabel;
        }
        else{
            factor = gb;
            label = gbLabel;
        }

        let result;

        if( decimalPlaces > 0 ){
            result = (Math.round( (value / factor * Math.pow( 10, decimalPlaces )) ) / Math.pow( 10, decimalPlaces ));
        }
        else{
            result = Math.round( value / factor );
        }

        return result + ' ' + label;
    }
}
