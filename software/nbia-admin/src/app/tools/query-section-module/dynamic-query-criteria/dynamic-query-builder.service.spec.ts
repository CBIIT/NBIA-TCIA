import { TestBed } from '@angular/core/testing';

import { DynamicQueryBuilderService } from './dynamic-query-builder.service';
import { DynamicCriteriaQueryPart } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-criteria-query-part';
import { WIDGET_TYPE } from '@app/tools/query-section-module/dynamic-query-criteria/widget/widget.component';

describe( 'DynamicQueryBuilderService', () => {
    beforeEach( () => TestBed.configureTestingModule( {} ) );

    it( 'should be created', () => {
        const service: DynamicQueryBuilderService = TestBed.get( DynamicQueryBuilderService );
        expect( service ).toBeTruthy();
    } );


    it( 'Add a query part', () => {
        const service: DynamicQueryBuilderService = TestBed.get( DynamicQueryBuilderService );
        let qPart =  new DynamicCriteriaQueryPart( WIDGET_TYPE.UNKNOWN,  ['The data'], 'x', 'x', 'x' );
        service.addCriteriaQueryPart( qPart );
        expect( service.getQueryPartCount() ).toEqual( 1 );

        // Make sure it replaces not add.
        service.addCriteriaQueryPart( qPart );
        expect( service.getQueryPartCount() ).toEqual( 1 );

        // Make sure it adds not replaces.
        qPart =  new DynamicCriteriaQueryPart( WIDGET_TYPE.UNKNOWN,  ['The data'], 'xX', 'x', 'x' );
        service.addCriteriaQueryPart( qPart );
        expect( service.getQueryPartCount() ).toEqual( 2 );

        // Make sure it adds not replaces.
        qPart =  new DynamicCriteriaQueryPart( WIDGET_TYPE.UNKNOWN,  ['The data'], 'xX', 'xX', 'x' );
        service.addCriteriaQueryPart( qPart );
        expect( service.getQueryPartCount() ).toEqual( 3 );

        for( let p of service.getQueryPartList()){
            console.log('MHL ', p.toString());
        }
    } );

    it( 'Delete a query part', () => {
        const service: DynamicQueryBuilderService = TestBed.get( DynamicQueryBuilderService );
        let qPart =  new DynamicCriteriaQueryPart( WIDGET_TYPE.UNKNOWN,  ['The data 000'], 'x', 'x', 'x' );
        service.addCriteriaQueryPart( qPart );
        expect( service.getQueryPartCount() ).toEqual( 1 );

        // Make sure it adds not replaces.
        qPart =  new DynamicCriteriaQueryPart( WIDGET_TYPE.UNKNOWN,  ['The data'], 'XX', 'XX', 'or' );
        service.addCriteriaQueryPart( qPart );
        expect( service.getQueryPartCount() ).toEqual( 2 );

        // Make sure it adds not replaces.
        qPart =  new DynamicCriteriaQueryPart( WIDGET_TYPE.UNKNOWN,  ['The data'], 'xX', 'xX', 'x' );
        service.addCriteriaQueryPart( qPart );
        expect( service.getQueryPartCount() ).toEqual( 3 );

        service.deleteCriteriaQueryPart( 'xX', 'xX' );
        expect( service.getQueryPartCount() ).toEqual( 2 );

        qPart =  new DynamicCriteriaQueryPart( WIDGET_TYPE.UNKNOWN,  ['The data'], 'XX', 'XX', 'or' );
        service.deleteCriteriaQueryPart( 'XX', 'XX' );
        expect( service.getQueryPartCount() ).toEqual( 1 );


        expect(service.getQueryPartList()[0].userInput[0] ).toEqual( 'The data 000' );

/*
        for( let p of service.getQueryPartList()){
            console.log('MHL ', p.toString());
        }
*/

    } );


} );
