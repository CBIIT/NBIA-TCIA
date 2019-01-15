import { TestBed, inject } from '@angular/core/testing';

import { UtilService } from './util.service';

describe( 'UtilService', () => {
    beforeEach( () => {
        TestBed.configureTestingModule( {
            providers: [UtilService]
        } );
    } );

    it( 'should be created', inject( [UtilService], ( service: UtilService ) => {
        expect( service ).toBeTruthy();
    } ) );


    // ----------  isEmpty  ----------
    it( 'Empty String is empty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isEmpty( '' ) ).toBe( true );
    } ) );

    it( 'String with content NOT empty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isEmpty( 'X' ) ).toBe( false );
    } ) );


    it( 'Undefined String empty 00', inject( [UtilService], ( service: UtilService ) => {
        let temp: string;
        expect( service.isEmpty( temp ) ).toBe( true );
    } ) );

    it( 'Undefined String empty 01', inject( [UtilService], ( service: UtilService ) => {
        let temp;
        expect( service.isEmpty( temp ) ).toBe( true );
    } ) );


    it( 'Empty array is empty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isEmpty( [] ) ).toBe( true );
    } ) );

    it( 'Empty array in an array NOT empty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isEmpty( [[]] ) ).toBe( false );
    } ) );

    it( 'Array with one element isn NOT empty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isEmpty( [2] ) ).toBe( false );
    } ) );


    it( 'Empty Object is empty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isEmpty( {} ) ).toBe( true );
    } ) );

    it( 'Object with string field content NOT empty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isEmpty( { 'a': 'x' } ) ).toBe( false );
    } ) );


    it( 'Object with number field content NOT empty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isEmpty( { 'a': 55 } ) ).toBe( false );
    } ) );

    // Numbers are empty
    it( 'Undefined numbers are empty', inject( [UtilService], ( service: UtilService ) => {
        let temp: number;
        expect( service.isEmpty( temp ) ).toBe( true );
    } ) );

    it( 'Is Empty 00g', inject( [UtilService], ( service: UtilService ) => {
        let temp: number = 3;
        expect( service.isEmpty( temp ) ).toBe( true );
    } ) );

    // Booleans are empty
    it( 'Boolean true, is Empty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isEmpty( true ) ).toBe( true );
    } ) );

    it( 'Boolean false, is Empty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isEmpty( false ) ).toBe( true );
    } ) );



    // ----------  isTrue  ----------
    it( 'Boolean false, is false', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isTrue( false ) ).toBe( false );
    } ) );

    it( 'Boolean true, is true', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isTrue( true ) ).toBe( true );
    } ) );

    it( 'Boolean \'true\', is true', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isTrue( 'true' ) ).toBe( true );
    } ) );

    it( 'Boolean \'yes\', is true', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isTrue( 'yes' ) ).toBe( true );
    } ) );

    it( 'Boolean \'yes\', is true', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isTrue( 'yes' ) ).toBe( true );
    } ) );

    it( 'Boolean \'on\', is true', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isTrue( 'on' ) ).toBe( true );
    } ) );

    it( 'Boolean \'1\' in quotes, is true', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isTrue( '1' ) ).toBe( true );
    } ) );

    it( 'Boolean \'TrUe\', is true', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isTrue( 'TrUe' ) ).toBe( true );
    } ) );

    it( 'Boolean \'false\', is false', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isTrue( 'false' ) ).toBe( false );
    } ) );

    it( 'Boolean \'FaLsE\', is false', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isTrue( 'FaLsE' ) ).toBe( false );
    } ) );

    it( 'Boolean 0, is false', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isTrue( 0 ) ).toBe( false );
    } ) );

    it( 'Boolean 1, is true', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isTrue( 1 ) ).toBe( true );
    } ) );

    it( 'Boolean 10, is true', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isTrue( 10 ) ).toBe( true );
    } ) );

    it( 'Undefined is false', inject( [UtilService], ( service: UtilService ) => {
        let temp;
        expect( service.isTrue( temp ) ).toBe( false );
    } ) );

    it( 'Null is false', inject( [UtilService], ( service: UtilService ) => {
        let temp = null;
        expect( service.isTrue( temp ) ).toBe( false );
    } ) );


    // isNullOrUndefined
    it( 'Null is isNullOrUndefined', inject( [UtilService], ( service: UtilService ) => {
        let temp = null;
        expect( service.isNullOrUndefined( temp ) ).toBe( true );
    } ) );

    it( 'Undefined is isNullOrUndefined 00', inject( [UtilService], ( service: UtilService ) => {
        let temp;
        expect( service.isNullOrUndefined( temp ) ).toBe( true );
    } ) );


    // ----------  isNullOrUndefinedOrEmpty  ----------
    it( 'Empty String is isNullOrUndefinedOrEmpty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isNullOrUndefinedOrEmpty( '' ) ).toBe( true );
    } ) );

    it( 'String with content NOT isNullOrUndefinedOrEmpty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isNullOrUndefinedOrEmpty( 'X' ) ).toBe( false );
    } ) );


    it( 'Undefined String isNullOrUndefinedOrEmpty 00', inject( [UtilService], ( service: UtilService ) => {
        let temp: string;
        expect( service.isNullOrUndefinedOrEmpty( temp ) ).toBe( true );
    } ) );

    it( 'Undefined String isNullOrUndefinedOrEmpty 01', inject( [UtilService], ( service: UtilService ) => {
        let temp;
        expect( service.isNullOrUndefinedOrEmpty( temp ) ).toBe( true );
    } ) );


    it( 'Empty array is isNullOrUndefinedOrEmpty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isNullOrUndefinedOrEmpty( [] ) ).toBe( true );
    } ) );

    it( 'Empty array in an array NOT isNullOrUndefinedOrEmpty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isNullOrUndefinedOrEmpty( [[]] ) ).toBe( false );
    } ) );

    it( 'Array with one element isn NOT isNullOrUndefinedOrEmpty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isNullOrUndefinedOrEmpty( [2] ) ).toBe( false );
    } ) );


    it( 'Empty Object is isNullOrUndefinedOrEmpty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isNullOrUndefinedOrEmpty( {} ) ).toBe( true );
    } ) );

    it( 'Object with string field content NOT isNullOrUndefinedOrEmpty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isNullOrUndefinedOrEmpty( { 'a': 'x' } ) ).toBe( false );
    } ) );


    it( 'Object with number field content NOT isNullOrUndefinedOrEmpty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isNullOrUndefinedOrEmpty( { 'a': 55 } ) ).toBe( false );
    } ) );

    // Numbers are empty
    it( 'Undefined numbers are isNullOrUndefinedOrEmpty', inject( [UtilService], ( service: UtilService ) => {
        let temp: number;
        expect( service.isNullOrUndefinedOrEmpty( temp ) ).toBe( true );
    } ) );

    it( 'Number is isNullOrUndefinedOrEmpty', inject( [UtilService], ( service: UtilService ) => {
        let temp: number = 3;
        expect( service.isNullOrUndefinedOrEmpty( temp ) ).toBe( true );
    } ) );

    // Booleans are empty
    it( 'Boolean true, is isNullOrUndefinedOrEmpty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isNullOrUndefinedOrEmpty( true ) ).toBe( true );
    } ) );

    it( 'Boolean false, is isNullOrUndefinedOrEmpty', inject( [UtilService], ( service: UtilService ) => {
        expect( service.isNullOrUndefinedOrEmpty( false ) ).toBe( true );
    } ) );



} );
