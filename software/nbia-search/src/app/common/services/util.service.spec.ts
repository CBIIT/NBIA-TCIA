import { TestBed, inject } from '@angular/core/testing';

import { UtilService } from './util.service';
import { CartService } from '@app/common/services/cart.service';


describe( 'UtilService', () => {

    beforeEach( () => {
        TestBed.configureTestingModule( {
            providers: [UtilService]
        } );
    } );

    /*

        it( 'should be created', inject( [UtilService], ( service: UtilService ) => {
            console.log( 'IN UtilService' );
            expect( service ).toBeTruthy();
        } ) );

    */



    it( 'Test UtilService', inject( [UtilService], ( service: UtilService ) => {

        expect( service.isTrue( true ) ).toBe( true );
    } ) );


    /*


        it( 'csvFormatOneField00', inject( [UtilService], ( service: UtilService ) => {
            expect( service.csvFormatOneField( 'Abcd, 1234' ) ).toEqual('"Abcd, 1234"');
        } ) );


        it( 'csvFormatOneField01', inject( [UtilService], ( service: UtilService ) => {
            expect( service.csvFormatOneField( '"Abcd, 1234' ) ).toEqual('"""Abcd, 1234"');
        } ) );


        it( 'csvFormatOneField02', inject( [UtilService], ( service: UtilService ) => {
            expect( service.csvFormatOneField( '"Abcd 1234' ) ).toEqual('"""Abcd 1234"');
        } ) );


        it( 'csvFormatOneField03', inject( [UtilService], ( service: UtilService ) => {
            expect( service.csvFormatOneField( 'Abcd 1234"' ) ).toEqual('"Abcd 1234"""');
        } ) );


        it( 'csvFormatOneField04', inject( [UtilService], ( service: UtilService ) => {
            expect( service.csvFormatOneField( '"Abcd 1234"' ) ).toEqual('"""Abcd 1234"""');
        } ) );

*/

/*
        it( 'format_00', inject( [UtilService], ( service: UtilService ) => {
            console.log( 'IN UtilService: ', service.csvFormatCart( [{
                'id': 'aaabcd, efg',
                'studyId': 'a1.3.6.1.4.1.14519,5.2.1.6834.5010.335014117706890137582032169351',
                'subjectId': 'a100_HM10395',
                'seriesPkId': 221872172,
                'seriesInstanceUid': 'xx',
                'size': 26405888,
                'disabled': false
            }, {
                'id': 'bbabc"xyz',
                'studyId': '1.3.6.1.4.1.14519.5.2.1.6834.5010.335014117706890137582032169351',
                'subjectId': '100_HM10395',
                'seriesPkId': 221872461,
                'seriesInstanceUid': '',
                'size': 26405988,
                'disabled': false
            }, {
                'id': 'cc2.3.6.1.4.1.14519.5.2.1.6834.5010.204026634860397031036823480116',
                'studyId': '1.3.6.1.4.1.14519.5.2.1.6834.5010.335014117706890137582032169351',
                'subjectId': '100_HM10395',
                'seriesPkId': 221872322,
                'seriesInstanceUid': '',
                'size': 26405988,
                'disabled': false
            }] ) );
            console.log( '-----------------------------------------' );
        } ) );

*/


/*

    it( 'format_01', inject( [UtilService], ( service: UtilService ) => {
        console.log( 'IN UtilService: ' + service.csvFormatCart( [{
            'id': 'abcd, efg',
            'studyId': '1.3.6.1.4.1.14519,5.2.1.6834.5010.335014117706890137582032169351',
            'subjectId': '100_HM10395',
            'seriesPkId': 221872172,
            'seriesInstanceUid': '',
            'size': 26405888,
            'disabled': false
        }] ) );
        console.log( '-----------------------------------------' );
    } ) );

*/

} );
