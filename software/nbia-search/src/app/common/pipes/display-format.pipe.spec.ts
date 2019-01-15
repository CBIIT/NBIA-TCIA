import { DisplayFormatPipe } from './display-format.pipe';

describe( 'DisplayFormatPipe', () => {
    it( 'create an instance', () => {
        const pipe = new DisplayFormatPipe();
        expect( pipe ).toBeTruthy();
    } );

    it( 'Test for the original value not changing.', () => {
        const pipe = new DisplayFormatPipe();
        let text = 'abcd efg hijk';
        let newText = pipe.transform( text );
        expect( text ).toBe( 'abcd efg hijk' );
        expect( newText ).toBe( 'Abcd Efg Hijk' );
    } );

} );
