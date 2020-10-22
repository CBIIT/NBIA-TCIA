import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe( 'ApiService', () => {
    beforeEach( () =>
        TestBed.configureTestingModule( {
            providers: [HttpClient],
            imports: [RouterTestingModule, HttpClientModule],
        } )
    );

    it( 'should be created', () => {
        const service: ApiService = TestBed.get( ApiService );
        expect( service ).toBeTruthy();
    } );
} );
