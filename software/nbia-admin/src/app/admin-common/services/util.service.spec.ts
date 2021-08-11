import { TestBed } from '@angular/core/testing';

import { UtilService } from './util.service';

describe( 'UtilService', () => {
    beforeEach( () => TestBed.configureTestingModule( {} ) );

    it( 'should be created', () => {
        const service: UtilService = TestBed.get( UtilService );
        expect( service ).toBeTruthy();
    } );


    it( 'Test getFirstDayOfMonth', () => {
        const service: UtilService = TestBed.get( UtilService );
        let d = service.getFirstDayOfMonth( 1, 2021 ); //Feb/2021
        expect( d ).toEqual( 0 );
    } );


    it( 'Good date late year', () => {
        console.log( 'MHL Test 00' );
        const service: UtilService = TestBed.get( UtilService );
        let testD0 = '2/3/4567';
        expect( service.isGoodDate( testD0 ) ).toBe( true );
    } );


    it( 'Good date', () => {
        console.log( 'MHL Test 02' );
        const service: UtilService = TestBed.get( UtilService );
        let testD0 = '5/30/1960';
        expect( service.isGoodDate( testD0 ) ).toBe( true );
    } );


    it( 'Only two parts', () => {
        console.log( 'MHL Test 03' );
        const service: UtilService = TestBed.get( UtilService );
        let testD0 = '530/1960';
        expect( service.isGoodDate( testD0 ) ).toBe( false );
    } );


    it( 'Last day of month too late', () => {
        console.log( 'MHL Test 04' );
        const service: UtilService = TestBed.get( UtilService );
        let testD0 = '5/32/1960';
        expect( service.isGoodDate( testD0 ) ).toBe( false );
    } );


    it( 'Year before 1950', () => {
        console.log( 'MHL Year before 1950' );
        const service: UtilService = TestBed.get( UtilService );
        let testD0 = '5/30/1949';
        expect( service.isGoodDate( testD0 ) ).toBe( false );
    } );

    it( 'With letters', () => {
        console.log( 'MHL Year before 1950' );
        const service: UtilService = TestBed.get( UtilService );
        let testD0 = '5/30/19x9';
        expect( service.isGoodDate( testD0 ) ).toBe( false );
    } );


} );
