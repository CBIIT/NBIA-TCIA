import { TestBed } from '@angular/core/testing';

import { AccessTokenService } from './access-token.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe( 'AccessTokenService', () => {
    beforeEach( () =>
        TestBed.configureTestingModule( {
            providers: [HttpClient],
            imports: [HttpClientModule],
        } )
    );

    it( 'should be created', () => {
        const service: AccessTokenService = TestBed.get( AccessTokenService );
        expect( service ).toBeTruthy();
    } );
} );
