import { TestBed } from '@angular/core/testing';

import { DisplayDynamicQueryService } from './display-dynamic-query.service';

describe( 'DisplayDynamicQueryService', () => {
    beforeEach( () => TestBed.configureTestingModule( {} ) );

    it( 'should be created', () => {
        const service: DisplayDynamicQueryService = TestBed.get( DisplayDynamicQueryService );
        expect( service ).toBeTruthy();
    } );


    it( 'Test setCondition Contains', () => {
        const service: DisplayDynamicQueryService = TestBed.get( DisplayDynamicQueryService );
        let testCriteria = {
            'criteriaHeading': 'Series Description',
            'criteriaSubheading': 'Contains',
            'value': [
                'aaaa'
            ],
            'andOr': 'OR',
            'widgetType': 2,
            'sequenceNumber': 7,
            'condition': 'Contains'
        }
        let res = service.setCondition( testCriteria );
        expect( res ).toBe( 'Contains' );
    } );

    it( 'Test setCondition Starts With', () => {
        const service: DisplayDynamicQueryService = TestBed.get( DisplayDynamicQueryService );
        let testCriteria = {
            'criteriaHeading': 'Series Description',
            'criteriaSubheading': 'Starts With',
            'value': [
                'aaaa'
            ],
            'andOr': 'OR',
            'widgetType': 2,
            'sequenceNumber': 7,
            'condition': 'Contains'
        }
        let res = service.setCondition( testCriteria );
        expect( res ).toBe( 'Starts with' );
    } );

    it( 'Test setCondition Greater than', () => {
        const service: DisplayDynamicQueryService = TestBed.get( DisplayDynamicQueryService );
        let testCriteria = {
            'criteriaHeading': 'Series Description',
            'criteriaSubheading': 'Greater Than',
            'value': [
                'aaaa'
            ],
            'andOr': 'OR',
            'widgetType': 2,
            'sequenceNumber': 7,
            'condition': 'Contains'
        }
        let res = service.setCondition( testCriteria );
        expect( res ).toBe( '>' );
    } );

    it( 'Test setCondition Less than', () => {
        const service: DisplayDynamicQueryService = TestBed.get( DisplayDynamicQueryService );
        let testCriteria = {
            'criteriaHeading': 'Series Description',
            'criteriaSubheading': 'Less Than',
            'value': [
                'aaaa'
            ],
            'andOr': 'OR',
            'widgetType': 2,
            'sequenceNumber': 7,
            'condition': 'Contains'
        }
        let res = service.setCondition( testCriteria );
        expect( res ).toBe( '<' );
    } );

    it( 'Test setCondition unrecognized', () => {
        const service: DisplayDynamicQueryService = TestBed.get( DisplayDynamicQueryService );
        let testCriteria = {
            'criteriaHeading': 'Series Description',
            'criteriaSubheading': 'Select from List',
            'value': [
                'aaaa'
            ],
            'andOr': 'OR',
            'widgetType': 2,
            'sequenceNumber': 7,
            'condition': 'Contains'
        }
        let res = service.setCondition( testCriteria );
        expect( res ).toBe( '' );
    } );


} );
