import { ToMbGbPipe } from './to-mb-gb.pipe';

describe( 'ToMbGbPipe', () => {
    let pipe: ToMbGbPipe;

    beforeEach( () => {
        pipe = new ToMbGbPipe();
    } );


    it( 'create an instance', () => {
        let pipeTest = new ToMbGbPipe();
        expect( pipeTest ).toBeTruthy();
    } );


    it( 'Test just bytes no decimal places', () => {
        expect( pipe.transform( 900 ) ).toBe( '900' );
    } );


    it( 'Test just bytes no decimal places', () => {
        expect( pipe.transform( 900, 1 ) ).toBe( '900' );
    } );

    it( 'Test KB no decimal places', () => {
        expect( pipe.transform( 2000 ) ).toBe( '2 KB' );
    } );

    it( 'Test MB two decimal places', () => {
        expect( pipe.transform( 2000000, 2 ) ).toBe( '1.91 MB' );
    } );


    it( 'Test MB no decimal places', () => {
        expect( pipe.transform( 2000000, -1 ) ).toBe( '2 MB' );
    } );


    it( 'Test MB no decimal places', () => {
        expect( pipe.transform( 2000000, 0 ) ).toBe( '2 MB' );
    } );


    it( 'Test MB no decimal places', () => {
        expect( pipe.transform( 2000000 ) ).toBe( '2 MB' );
    } );


    it( 'Test MB four decimal places', () => {
        expect( pipe.transform( 2000000, 4 ) ).toBe( '1.9073 MB' );
    } );


    it( 'Test GB no decimal places', () => {
        expect( pipe.transform( 1234567890 ) ).toBe( '1 GB' );
    } );


    it( 'Test GB no decimal places', () => {
        expect( pipe.transform( 51234567890 ) ).toBe( '48 GB' );
    } );


    it( 'Test GB 2 decimal places', () => {
        expect( pipe.transform( 51234567890, 2 ) ).toBe( '47.72 GB' );
    } );


    it( 'Test GB four decimal places', () => {
        expect( pipe.transform( 1234567890, 4 ) ).toBe( '1.1498 GB' );
    } );


} );
