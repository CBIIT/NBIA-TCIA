import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
    name: 'shorten'
} )

/**
 * Returns <len> number of right most characters.
 *
 * @param len Optional length, default is 8.
 */
export class ShortenPipe implements PipeTransform{

    transform( value: string, len = 8 ): any {
        return value.slice(0, len );
    }
}
