import { TestBed } from '@angular/core/testing';

import { BrandingService } from './branding.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe( 'BrandingService', () => {
    beforeEach( () =>
        TestBed.configureTestingModule( {
            providers: [HttpClient],
            imports: [ HttpClientModule],
        } )
    );

    it( 'should be created', () => {
        const service: BrandingService = TestBed.get( BrandingService );
        expect( service ).toBeTruthy();
    } );
} );
