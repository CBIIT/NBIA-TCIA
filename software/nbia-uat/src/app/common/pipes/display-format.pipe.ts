import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
    name: 'displayFormat'
} )

/**
 * Converts string to Uppercase for the first letter of each word, lower case for the rest of the letters.
 *
 * @param {string} input
 * @returns {string}
 */
export class DisplayFormatPipe implements PipeTransform{
    public transform( input: string ): string {
        if( !input ){
            return '';
        }else{
            let returnStr = input.replace( /([A-Z])/g, ' $1' );
            returnStr = returnStr.replace( /\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr( 1 ).toLowerCase() ) );

            return returnStr;
        }
    }
}
