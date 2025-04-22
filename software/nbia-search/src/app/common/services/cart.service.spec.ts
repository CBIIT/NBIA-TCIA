import { TestBed, inject } from '@angular/core/testing';
import { CartService } from './cart.service';
import { CommonService } from '@app/image-search/services/common.service';
import { ConnectionBackend, Http, HttpModule } from '@angular/http';
import { PersistenceService } from './persistence.service';
import { CookieService } from 'ngx-cookie-service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { ParameterService } from '@app/common/services/parameter.service';
import { InitMonitorService } from '@app/common/services/init-monitor.service';


describe( 'CartService', () => {
    let testData = {
        id: 'id',
        studyId: 'studyId',
        subjectId: 'subjectId',
        seriesPkId: 'seriesPkId',
        seriesSize: 'seriesSize'
    };

    beforeEach( () => {
        TestBed.configureTestingModule( {
            imports: [HttpModule],
            providers: [CartService, CommonService, Http, ConnectionBackend,
                ParameterService, PersistenceService, CookieService,
                ApiServerService, InitMonitorService]
        } );
    } );

    it( 'should be created', inject( [CartService], ( service: CartService ) => {
        expect( service ).toBeTruthy();

    } ) );


    it( 'Test cartAdd and cartGetCount', inject( [CartService], ( service: CartService ) => {
        service.cartAdd( testData.id, testData.studyId, testData.subjectId, testData.seriesPkId, '', testData.seriesSize );
        service.cartAdd( testData.id + '2', testData.studyId, testData.subjectId, testData.seriesPkId, '', testData.seriesSize );
        expect( service.cartGetCount() ).toBe( 2 );
    } ) );


    it( 'Test delete', inject( [CartService], ( service: CartService ) => {
        service.cartAdd( testData.id, testData.studyId, testData.subjectId, testData.seriesPkId, '', testData.seriesSize );
        service.cartAdd( testData.id + '2', testData.studyId, testData.subjectId, testData.seriesPkId, '', testData.seriesSize );
        service.cartDelete( testData.id );
        expect( service.cartGetCount() ).toBe( 1 );
    } ) );



    it( 'Test setCartEnableCartById', inject( [CartService], ( service: CartService ) => {
        service.cartAdd( testData.id + '0', testData.studyId + '0', testData.subjectId, testData.seriesPkId, '', testData.seriesSize );
        service.cartAdd( testData.id + '1', testData.studyId + '1', testData.subjectId, testData.seriesPkId + 'ABC', '', testData.seriesSize );
        service.setCartEnableCartById( testData.id + '1', true );
        let temp = service.cartGetCartByStudy( testData.studyId + '1' )[0]['disabled'];
        expect( temp ).toBeDefined();
        expect( temp ).toBeFalsy();
    } ) );


    it( 'Test disableCartById', inject( [CartService], ( service: CartService ) => {
        service.cartAdd( testData.id + '0', testData.studyId + '0', testData.subjectId, testData.seriesPkId, '', testData.seriesSize );
        service.cartAdd( testData.id + '1', testData.studyId + '1', testData.subjectId, testData.seriesPkId, '', testData.seriesSize );
        service.disableCartById( testData.id + '1' );
        let temp = service.cartGetCartByStudy( testData.studyId + '1' )[0]['disabled'];
        expect( temp ).toBeTruthy();
    } ) );


    it( 'Test enableCartById', inject( [CartService], ( service: CartService ) => {
        service.cartAdd( testData.id + '0', testData.studyId + '0', testData.subjectId, testData.seriesPkId, '', testData.seriesSize );
        service.cartAdd( testData.id + '1', testData.studyId + '1', testData.subjectId, testData.seriesPkId, '', testData.seriesSize );
        service.enableCartById( testData.id + '1' );
        let temp = service.cartGetCartByStudy( testData.studyId + '1' )[0]['disabled'];
        expect( temp ).toBeDefined();
        expect( temp ).toBeFalsy();
    } ) );


    it( 'Test cartGetAll', inject( [CartService], ( service: CartService ) => {
        service.cartAdd( testData.id, testData.studyId + 'XYZ', testData.subjectId, testData.seriesPkId, '', testData.seriesSize );
        service.cartAdd( testData.id + '2', testData.studyId, testData.subjectId, testData.seriesPkId, '', testData.seriesSize );
        expect( service.cartGetAll()[0]['studyId'] ).toBe( 'studyIdXYZ' );
    } ) );


    it( 'Test cartGetCartByStudy', inject( [CartService], ( service: CartService ) => {
        service.cartAdd( testData.id, testData.studyId + 'XX', testData.subjectId, testData.seriesPkId, '', testData.seriesSize + 'XYZ' );
        service.cartAdd( testData.id + '2', testData.studyId, testData.subjectId, testData.seriesPkId, '', testData.seriesSize );
        expect( service.cartGetCartByStudy( 'studyIdXX' )[0]['size'] ).toBe( 'seriesSizeXYZ' );
    } ) );


    it( 'Test updateCartCount', inject( [CartService], ( service: CartService ) => {
        service.cartCountEmitter.subscribe(
            data => {
                expect( data['count'] ).toBe( 1 );
                expect( data['fileSize'] ).toBe( 9876543210 );
            }
        );
        service.cartAdd( testData.id + '0', testData.studyId, testData.subjectId, testData.seriesPkId, '', 9876543210 );
    } ) );

} );
