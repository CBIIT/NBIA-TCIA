import { ShortenRightPipe } from './shorten-right.pipe';

describe( 'ShortenRightPipe', () => {
    it( 'create an instance', () => {
        const pipe = new ShortenRightPipe();
        expect( pipe ).toBeTruthy();
    } );


    it( 'Test the shortening', () => {
        const pipe = new ShortenRightPipe();
        let text = '12345678901234567890';
        let newText = pipe.transform( text );
        expect( newText ).toBe( '34567890' );
    } );


} );
