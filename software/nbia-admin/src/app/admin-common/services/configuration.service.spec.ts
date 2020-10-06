import { TestBed } from '@angular/core/testing';

import { ConfigurationService } from './configuration.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe( 'ConfigurationService', () => {
    beforeEach( () =>
        TestBed.configureTestingModule( {
            providers: [HttpClient],
            imports: [HttpClientModule],
        } )
    );

    it( 'should be created', () => {
        const service: ConfigurationService = TestBed.get( ConfigurationService );
        expect( service ).toBeTruthy();
    } );
} );
