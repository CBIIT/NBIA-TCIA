import { ShortenPipe } from './shorten.pipe';

describe( 'ShortenPipe', () => {

    it( 'create an instance', () => {
        const pipe = new ShortenPipe();
        expect( pipe ).toBeTruthy();
    } );

    it( 'Test the shortening', () => {
        const pipe = new ShortenPipe();
        let text = '12345678901234567890';
        let newText = pipe.transform( text );
        expect( newText ).toBe( '12345678' );
    } );

    it( 'Test the shortening with a length parameter', () => {
        const pipe = new ShortenPipe();
        let text = '12345678901234567890';
        let newText = pipe.transform( text, 12 );
        expect( newText ).toBe( '123456789012' );
    } );

    it( 'Should not modify the original string', () => {
        const pipe = new ShortenPipe();
        let text = 'Abcdefghijklmnop';
        let newText = pipe.transform( text );
        expect( newText ).not.toEqual( text );
        expect( text ).toBe( 'Abcdefghijklmnop' );
    } );
} );
