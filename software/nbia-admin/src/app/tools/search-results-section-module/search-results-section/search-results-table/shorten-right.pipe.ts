import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
    name: 'shortenRight'
} )

/**
 * Returns <len> number of left most characters.
 *
 * @param len Optional length, default is 8.
 */
export class ShortenRightPipe implements PipeTransform{

    transform( value: string, len = 8 ): any {
        return value.slice( -1 * len );
    }

}
