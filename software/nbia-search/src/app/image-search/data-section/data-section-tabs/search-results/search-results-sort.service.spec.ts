import { TestBed, inject } from '@angular/core/testing';

import { SearchResultsSortService } from './search-results-sort.service';
import { PersistenceService } from '../../../../common/services/persistence.service';
import { CookieService } from 'angular2-cookie/core';
import { CartService } from '../../../../common/services/cart.service';
import { CommonService } from '../../../services/common.service';
import { ConnectionBackend, Http, HttpModule } from '@angular/http';
import { ApiServerService } from '../../../services/api-server.service';
import { ParameterService } from '@app/common/services/parameter.service';
import { InitMonitorService } from '@app/common/services/init-monitor.service';

describe( 'SearchResultsSortService', () => {

    let searchResults0 = [];
    let searchResults = [];
    let criteriaList = [];
    let selectedList = [];
    let textSearchHitList = [];

    beforeEach( () => {
        TestBed.configureTestingModule( {
            providers: [ParameterService, InitMonitorService]
        } );
    } );

    it( 'should be created', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {
        expect( service ).toBeTruthy();
    } ) );


    /******************************************************************************************************/
    /***********************************  Criteria Lists   ************************************************/
    /******************************************************************************************************/

    /**
     * Collections - The list used in the querying checkboxes.
     */
    it( 'Test collection list Sort. No selectedList 00', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {

        criteriaList[0].criteria = 'ZZZZ';
        criteriaList[3].criteria = 'AAAA';

        service.criteriaSort( criteriaList, null );
        expect( criteriaList[0]['criteria'] ).toBe( 'AAAA' );
        expect( criteriaList[criteriaList.length - 1]['criteria'] ).toBe( 'ZZZZ' );

    } ) );

    it( 'Test collection list case Sort. No selectedList 01', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {

        criteriaList[6].criteria = 'bbbb';
        criteriaList[5].criteria = 'cccc';
        criteriaList[7].criteria = 'AAAA';

        service.criteriaSort( criteriaList, null );
        expect( criteriaList[0]['criteria'] ).toBe( 'AAAA' );
        expect( criteriaList[1]['criteria'] ).toBe( 'bbbb' );
        expect( criteriaList[2]['criteria'] ).toBe( 'cccc' );

    } ) );

    /**
     * Collections - The list used in the querying checkboxes.
     */
    it( 'Test collection list Sort. No selectedList 02', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {
        criteriaList[5].criteria = 'AAAA';
        criteriaList[4].criteria = 'AAAb';

        service.criteriaSort( criteriaList, null );
        expect( criteriaList[0]['criteria'] ).toBe( 'AAAA' );
        expect( criteriaList[1]['criteria'] ).toBe( 'AAAb' );

    } ) );

    /**
     * Collections - The list used in the querying checkboxes.
     */
    it( 'Test collection list Sort 03', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {

        criteriaList[5].criteria = 'AAAA';
        criteriaList[4].criteria = 'AAAb';

        service.criteriaSort( criteriaList, selectedList );
        expect( criteriaList[0]['criteria'] ).toBe( 'AAAA' );
        expect( criteriaList[1]['criteria'] ).toBe( 'AAAb' );
    } ) );


    it( 'Test collection list case Sort. With selectedList, but none selected 04', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {

        criteriaList[6].criteria = 'bbbb';
        criteriaList[5].criteria = 'cccc';
        criteriaList[7].criteria = 'AAAA';

        service.criteriaSort( criteriaList, selectedList );
        expect( criteriaList[0]['criteria'] ).toBe( 'AAAA' );
        expect( criteriaList[1]['criteria'] ).toBe( 'bbbb' );
        expect( criteriaList[2]['criteria'] ).toBe( 'cccc' );

    } ) );

    it( 'Test collection list case Sort. With selectedList, with two selected 05', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {

        criteriaList[6].criteria = 'bbbb';
        selectedList[6] = true;
        criteriaList[5].criteria = 'cccc';
        selectedList[5] = true;
        criteriaList[7].criteria = 'AAAA';
        service.criteriaSort( criteriaList, selectedList );
        // console.log( 'Test collection list Sort: ', criteriaList );
        expect( criteriaList[0]['criteria'] ).toBe( 'bbbb' );
        expect( criteriaList[1]['criteria'] ).toBe( 'cccc' );
        expect( criteriaList[2]['criteria'] ).toBe( 'AAAA' );

    } ) );

    /*

        it( 'Test collection list case Sort. With selectedList, with one selected 06', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {

            let criteriaList06: [
                {
                    'criteria': 'BREAST-DIAGNOSIS',
                    'count': '8',
                    'seq': 0
                },
                {
                    'criteria': 'Test',
                    'count': '2',
                    'seq': 1
                },
                {
                    'criteria': 'CBIS-DDSM',
                    'count': '80',
                    'seq': 2
                },
                {
                    'criteria': 'CT Lymph Nodes',
                    'count': '4',
                    'seq': 3
                },
                {
                    'criteria': 'Head-Neck Cetuximab',
                    'count': '3',
                    'seq': 4
                },
                {
                    'criteria': 'LIDC-IDRI',
                    'count': '65',
                    'seq': 5
                }
                ];

            let selectedList06: [
                true,
                false,
                false,
                false,
                false,
                false
                ];

            service.criteriaSort( criteriaList06, selectedList06 );
            // console.log( 'Test collection list Sort: ', criteriaList );
            expect( criteriaList[0]['criteria'] ).toBe( 'bbbb' );
            expect( criteriaList[1]['criteria'] ).toBe( 'cccc' );
            expect( criteriaList[2]['criteria'] ).toBe( 'AAAA' );

        } ) );

    */

    /******************************************************************************************************/
    /***********************************  Search Results   ************************************************/
    /******************************************************************************************************/

    /**
     * collectionSort UP
     */
    it( 'Test collectionSort UP', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {
        service.collectionSort( searchResults, service.State.UP );

        expect( searchResults[0]['project'] ).toBe( 'A_CBIS-DDSM' );
        expect( searchResults[1]['project'] ).toBe( 'B_CBIS-DDSM' );
        expect( searchResults[searchResults.length - 1]['project'] ).toBe( 'Z_CBIS-DDSM' );
    } ) );


    /**
     * collectionSort DOWN
     */
    it( 'Test collectionSort DOWN', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {
        service.collectionSort( searchResults, service.State.DOWN );

        expect( searchResults[0]['project'] ).toBe( 'Z_CBIS-DDSM' );
        expect( searchResults[1]['project'] ).toBe( 'CBIS-DDSM' );
        expect( searchResults[searchResults.length - 1]['project'] ).toBe( 'A_CBIS-DDSM' );
    } ) );


    /**
     * totalSeriesSort UP
     */
    it( 'Test totalSeriesSort Up', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {
        service.totalSeriesSort( searchResults0, service.State.UP );

        expect( searchResults0[0]['subjectId'] ).toBe( 'CBIS-DDSM-1023223917' );
        expect( searchResults0[1]['subjectId'] ).toBe( 'CBIS-DDSM-1004046726' );
        expect( searchResults0[2]['subjectId'] ).toBe( 'CBIS-DDSM-1071224163' );
        expect( searchResults0[3]['subjectId'] ).toBe( 'CBIS-DDSM-1031248166' );
    } ) );


    /**
     * totalSeriesSort DOWN
     */
    it( 'Test totalSeriesSort DOWN', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {
        service.totalSeriesSort( searchResults0, service.State.DOWN );
        expect( searchResults0[3]['subjectId'] ).toBe( 'CBIS-DDSM-1023223917' );
        expect( searchResults0[2]['subjectId'] ).toBe( 'CBIS-DDSM-1004046726' );
        expect( searchResults0[1]['subjectId'] ).toBe( 'CBIS-DDSM-1071224163' );
        expect( searchResults0[0]['subjectId'] ).toBe( 'CBIS-DDSM-1031248166' );
    } ) );


    /**
     * matchedSeriesSort UP
     */
    it( 'Test matchedSeriesSort UP', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {
        service.matchedSeriesSort( searchResults0, service.State.UP );

        expect( searchResults0[0]['subjectId'] ).toBe( 'CBIS-DDSM-1004046726' );
        expect( searchResults0[1]['subjectId'] ).toBe( 'CBIS-DDSM-1023223917' );
        expect( searchResults0[2]['subjectId'] ).toBe( 'CBIS-DDSM-1071224163' );
        expect( searchResults0[3]['subjectId'] ).toBe( 'CBIS-DDSM-1031248166' );
    } ) );


    /**
     * matchedSeriesSort DOWN
     */
    it( 'Test matchedSeriesSort DOWN', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {
        service.matchedSeriesSort( searchResults0, service.State.DOWN );

        expect( searchResults0[3]['subjectId'] ).toBe( 'CBIS-DDSM-1004046726' );
        expect( searchResults0[2]['subjectId'] ).toBe( 'CBIS-DDSM-1023223917' );
        expect( searchResults0[1]['subjectId'] ).toBe( 'CBIS-DDSM-1071224163' );
        expect( searchResults0[0]['subjectId'] ).toBe( 'CBIS-DDSM-1031248166' );
    } ) );


    /**
     * totalStudiesSort UP
     */
    it( 'Test totalStudiesSort UP', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {
        service.totalStudiesSort( searchResults0, service.State.UP );

        expect( searchResults0[0]['subjectId'] ).toBe( 'CBIS-DDSM-1023223917' );
        expect( searchResults0[1]['subjectId'] ).toBe( 'CBIS-DDSM-1004046726' );
        expect( searchResults0[2]['subjectId'] ).toBe( 'CBIS-DDSM-1071224163' );
        expect( searchResults0[3]['subjectId'] ).toBe( 'CBIS-DDSM-1031248166' );
    } ) );


    /**
     * totalStudiesSort  DOWN
     */
    it( 'Test totalStudiesSort DOWN', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {
        service.totalStudiesSort( searchResults0, service.State.DOWN );

        expect( searchResults0[0]['subjectId'] ).toBe( 'CBIS-DDSM-1031248166' );
        expect( searchResults0[1]['subjectId'] ).toBe( 'CBIS-DDSM-1071224163' );
        expect( searchResults0[2]['subjectId'] ).toBe( 'CBIS-DDSM-1004046726' );
        expect( searchResults0[3]['subjectId'] ).toBe( 'CBIS-DDSM-1023223917' );
    } ) );


    /**
     * matchedStudiesSort  UP
     */
    it( 'Test matchedStudiesSort UP', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {
        service.matchedStudiesSort( searchResults0, service.State.UP );

        expect( searchResults0[0]['subjectId'] ).toBe( 'CBIS-DDSM-1031248166' );
        expect( searchResults0[1]['subjectId'] ).toBe( 'CBIS-DDSM-1004046726' );
        expect( searchResults0[2]['subjectId'] ).toBe( 'CBIS-DDSM-1023223917' );
        expect( searchResults0[3]['subjectId'] ).toBe( 'CBIS-DDSM-1071224163' );
    } ) );


    /**
     * matchedStudiesSort  DOWN
     */
    it( 'Test matchedStudiesSort DOWN', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {
        service.matchedStudiesSort( searchResults0, service.State.DOWN );

        expect( searchResults0[0]['subjectId'] ).toBe( 'CBIS-DDSM-1071224163' );
        expect( searchResults0[1]['subjectId'] ).toBe( 'CBIS-DDSM-1023223917' );
        expect( searchResults0[2]['subjectId'] ).toBe( 'CBIS-DDSM-1004046726' );
        expect( searchResults0[3]['subjectId'] ).toBe( 'CBIS-DDSM-1031248166' );
    } ) );


    /**
     * subjectIdSort  UP
     */
    it( 'Test subjectIdSort UP', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {
        service.subjectIdSort( searchResults0, service.State.UP );

        expect( searchResults0[0]['subjectId'] ).toBe( 'CBIS-DDSM-1004046726' );
        expect( searchResults0[1]['subjectId'] ).toBe( 'CBIS-DDSM-1023223917' );
        expect( searchResults0[2]['subjectId'] ).toBe( 'CBIS-DDSM-1031248166' );
        expect( searchResults0[3]['subjectId'] ).toBe( 'CBIS-DDSM-1071224163' );
    } ) );


    /**
     * subjectIdSort  DOWN
     */
    it( 'Test subjectIdSort DOWN', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {
        service.subjectIdSort( searchResults0, service.State.DOWN );
        expect( searchResults0[0]['subjectId'] ).toBe( 'CBIS-DDSM-1071224163' );
        expect( searchResults0[1]['subjectId'] ).toBe( 'CBIS-DDSM-1031248166' );
        expect( searchResults0[2]['subjectId'] ).toBe( 'CBIS-DDSM-1023223917' );
        expect( searchResults0[3]['subjectId'] ).toBe( 'CBIS-DDSM-1004046726' );
    } ) );


    /**
     * textSearchHitSort  DOWN
     */
/*
    it( 'Test textSearchHitSort DOWN', inject( [SearchResultsSortService], ( service: SearchResultsSortService ) => {
        service.textSearchHitSort( textSearchHitList, service.State.DOWN );
        expect( searchResults0[0]['subjectId'] ).toBe( 'CBIS-DDSM-1071224163' );
        expect( searchResults0[1]['subjectId'] ).toBe( 'CBIS-DDSM-1031248166' );
        expect( searchResults0[2]['subjectId'] ).toBe( 'CBIS-DDSM-1023223917' );
        expect( searchResults0[3]['subjectId'] ).toBe( 'CBIS-DDSM-1004046726' );
    } ) );
*/


    /** ***************************** **/
    /**           Initialize          **/
    /** ***************************** **/
    beforeEach( () => {
        TestBed.configureTestingModule( {
            imports: [HttpModule],
            providers: [SearchResultsSortService, PersistenceService, CookieService,
                ApiServerService, CartService, CommonService]
        } );

        textSearchHitList = [
            {
                'subjectId': 'Test-1635222252',
                'project': 'Test',
                'id': 819201,
                'totalNumberOfStudies': 30,
                'totalNumberOfSeries': 63,
                'hit': '<em>bodyPartExamined</em>: <strong>LUNG</strong>',
                'studyIdentifiers': [
                    {
                        'seriesIdentifiers': [
                            917575,
                            917574
                        ],
                        'studyIdentifier': 852002
                    },
                    {
                        'seriesIdentifiers': [
                            917591,
                            917593,
                            917592
                        ],
                        'studyIdentifier': 852009
                    },
                    {
                        'seriesIdentifiers': [
                            917607,
                            917606
                        ],
                        'studyIdentifier': 852015
                    },
                    {
                        'seriesIdentifiers': [
                            917623,
                            917622
                        ],
                        'studyIdentifier': 852023
                    },
                    {
                        'seriesIdentifiers': [
                            917568,
                            917567
                        ],
                        'studyIdentifier': 851998
                    },
                    {
                        'seriesIdentifiers': [
                            917584,
                            917585
                        ],
                        'studyIdentifier': 852007
                    },
                    {
                        'seriesIdentifiers': [
                            917600,
                            917602,
                            917601,
                            917603
                        ],
                        'studyIdentifier': 852013
                    },
                    {
                        'seriesIdentifiers': [
                            917616,
                            917615,
                            917614
                        ],
                        'studyIdentifier': 852019
                    },
                    {
                        'seriesIdentifiers': [
                            917577,
                            917576
                        ],
                        'studyIdentifier': 852003
                    },
                    {
                        'seriesIdentifiers': [
                            917609,
                            917608,
                            917610
                        ],
                        'studyIdentifier': 852016
                    },
                    {
                        'seriesIdentifiers': [
                            917625,
                            917624,
                            917626
                        ],
                        'studyIdentifier': 852024
                    },
                    {
                        'seriesIdentifiers': [
                            917570,
                            917569,
                            917571
                        ],
                        'studyIdentifier': 851999
                    },
                    {
                        'seriesIdentifiers': [
                            917586,
                            917588,
                            917590,
                            917587,
                            917589
                        ],
                        'studyIdentifier': 852008
                    },
                    {
                        'seriesIdentifiers': [
                            917618,
                            917620,
                            917619
                        ],
                        'studyIdentifier': 852021
                    },
                    {
                        'seriesIdentifiers': [
                            917579,
                            917578
                        ],
                        'studyIdentifier': 852004
                    },
                    {
                        'seriesIdentifiers': [
                            917595,
                            917596
                        ],
                        'studyIdentifier': 852011
                    },
                    {
                        'seriesIdentifiers': [
                            917611,
                            917612
                        ],
                        'studyIdentifier': 852017
                    },
                    {
                        'seriesIdentifiers': [
                            917627
                        ],
                        'studyIdentifier': 852025
                    },
                    {
                        'seriesIdentifiers': [
                            917572
                        ],
                        'studyIdentifier': 852000
                    },
                    {
                        'seriesIdentifiers': [
                            917604,
                            917605
                        ],
                        'studyIdentifier': 852014
                    },
                    {
                        'seriesIdentifiers': [
                            917565
                        ],
                        'studyIdentifier': 851996
                    },
                    {
                        'seriesIdentifiers': [
                            917581,
                            917580
                        ],
                        'studyIdentifier': 852005
                    },
                    {
                        'seriesIdentifiers': [
                            917597,
                            917599,
                            917598
                        ],
                        'studyIdentifier': 852012
                    },
                    {
                        'seriesIdentifiers': [
                            917613
                        ],
                        'studyIdentifier': 852018
                    },
                    {
                        'seriesIdentifiers': [
                            917583,
                            917582
                        ],
                        'studyIdentifier': 852006
                    },
                    {
                        'seriesIdentifiers': [
                            917617
                        ],
                        'studyIdentifier': 852020
                    },
                    {
                        'seriesIdentifiers': [
                            917594
                        ],
                        'studyIdentifier': 852010
                    },
                    {
                        'seriesIdentifiers': [
                            917573
                        ],
                        'studyIdentifier': 852001
                    },
                    {
                        'seriesIdentifiers': [
                            917621
                        ],
                        'studyIdentifier': 852022
                    },
                    {
                        'seriesIdentifiers': [
                            917566
                        ],
                        'studyIdentifier': 851997
                    }
                ]
            },
            {
                'subjectId': 'Test-5910936489',
                'project': 'Test',
                'id': 819200,
                'totalNumberOfStudies': 28,
                'totalNumberOfSeries': 61,
                'hit': '<em>bodyPartExamined</em>: <strong>LUNG</strong>',
                'studyIdentifiers': [
                    {
                        'seriesIdentifiers': [
                            917511,
                            917510,
                            917509
                        ],
                        'studyIdentifier': 851972
                    },
                    {
                        'seriesIdentifiers': [
                            917527,
                            917526,
                            917528
                        ],
                        'studyIdentifier': 851979
                    },
                    {
                        'seriesIdentifiers': [
                            917543,
                            917545,
                            917542,
                            917544
                        ],
                        'studyIdentifier': 851987
                    },
                    {
                        'seriesIdentifiers': [
                            917559,
                            917561,
                            917560
                        ],
                        'studyIdentifier': 851993
                    },
                    {
                        'seriesIdentifiers': [
                            917504
                        ],
                        'studyIdentifier': 851968
                    },
                    {
                        'seriesIdentifiers': [
                            917520,
                            917521
                        ],
                        'studyIdentifier': 851976
                    },
                    {
                        'seriesIdentifiers': [
                            917536,
                            917533,
                            917535,
                            917534
                        ],
                        'studyIdentifier': 851982
                    },
                    {
                        'seriesIdentifiers': [
                            917552
                        ],
                        'studyIdentifier': 851989
                    },
                    {
                        'seriesIdentifiers': [
                            917513,
                            917512,
                            917514
                        ],
                        'studyIdentifier': 851973
                    },
                    {
                        'seriesIdentifiers': [
                            917529,
                            917530
                        ],
                        'studyIdentifier': 851980
                    },
                    {
                        'seriesIdentifiers': [
                            917506,
                            917505
                        ],
                        'studyIdentifier': 851969
                    },
                    {
                        'seriesIdentifiers': [
                            917522
                        ],
                        'studyIdentifier': 851977
                    },
                    {
                        'seriesIdentifiers': [
                            917538,
                            917539
                        ],
                        'studyIdentifier': 851984
                    },
                    {
                        'seriesIdentifiers': [
                            917554,
                            917553
                        ],
                        'studyIdentifier': 851990
                    },
                    {
                        'seriesIdentifiers': [
                            917515,
                            917517,
                            917516
                        ],
                        'studyIdentifier': 851974
                    },
                    {
                        'seriesIdentifiers': [
                            917531,
                            917532
                        ],
                        'studyIdentifier': 851981
                    },
                    {
                        'seriesIdentifiers': [
                            917547,
                            917549,
                            917551,
                            917546,
                            917548,
                            917550
                        ],
                        'studyIdentifier': 851988
                    },
                    {
                        'seriesIdentifiers': [
                            917563,
                            917562
                        ],
                        'studyIdentifier': 851994
                    },
                    {
                        'seriesIdentifiers': [
                            917508
                        ],
                        'studyIdentifier': 851971
                    },
                    {
                        'seriesIdentifiers': [
                            917524,
                            917523,
                            917525
                        ],
                        'studyIdentifier': 851978
                    },
                    {
                        'seriesIdentifiers': [
                            917540
                        ],
                        'studyIdentifier': 851985
                    },
                    {
                        'seriesIdentifiers': [
                            917556,
                            917558,
                            917557
                        ],
                        'studyIdentifier': 851992
                    },
                    {
                        'seriesIdentifiers': [
                            917519,
                            917518
                        ],
                        'studyIdentifier': 851975
                    },
                    {
                        'seriesIdentifiers': [
                            917537
                        ],
                        'studyIdentifier': 851983
                    },
                    {
                        'seriesIdentifiers': [
                            917507
                        ],
                        'studyIdentifier': 851970
                    },
                    {
                        'seriesIdentifiers': [
                            917555
                        ],
                        'studyIdentifier': 851991
                    },
                    {
                        'seriesIdentifiers': [
                            917564
                        ],
                        'studyIdentifier': 851995
                    },
                    {
                        'seriesIdentifiers': [
                            917541
                        ],
                        'studyIdentifier': 851986
                    }
                ]
            },
            {
                'subjectId': 'BREAST-DIAGNOSIS-2492413320',
                'project': 'BREAST-DIAGNOSIS',
                'id': 2392071,
                'totalNumberOfStudies': 9,
                'totalNumberOfSeries': 18,
                'hit': '<em>seriesDesc</em>: <strong>LUNG</strong>',
                'studyIdentifiers': [
                    {
                        'seriesIdentifiers': [
                            2490414,
                            2490413,
                            2490415
                        ],
                        'studyIdentifier': 2424849
                    },
                    {
                        'seriesIdentifiers': [
                            2490407,
                            2490408
                        ],
                        'studyIdentifier': 2424846
                    },
                    {
                        'seriesIdentifiers': [
                            2490416,
                            2490418,
                            2490417
                        ],
                        'studyIdentifier': 2424850
                    },
                    {
                        'seriesIdentifiers': [
                            2490409,
                            2490411,
                            2490410
                        ],
                        'studyIdentifier': 2424847
                    },
                    {
                        'seriesIdentifiers': [
                            2490404,
                            2490403
                        ],
                        'studyIdentifier': 2424843
                    },
                    {
                        'seriesIdentifiers': [
                            2490420,
                            2490419
                        ],
                        'studyIdentifier': 2424851
                    },
                    {
                        'seriesIdentifiers': [
                            2490406
                        ],
                        'studyIdentifier': 2424845
                    },
                    {
                        'seriesIdentifiers': [
                            2490412
                        ],
                        'studyIdentifier': 2424848
                    },
                    {
                        'seriesIdentifiers': [
                            2490405
                        ],
                        'studyIdentifier': 2424844
                    }
                ]
            },
            {
                'subjectId': 'LIDC-IDRI-2072730591',
                'project': 'LIDC-IDRI',
                'id': 2883686,
                'totalNumberOfStudies': 1,
                'totalNumberOfSeries': 1,
                'hit': '<em>studyDesc</em>: CT <strong>LUNG</strong> SCREEN',
                'studyIdentifiers': [
                    {
                        'seriesIdentifiers': [
                            2949225
                        ],
                        'studyIdentifier': 2916455
                    }
                ]
            },
            {
                'subjectId': 'LIDC-IDRI-2475241370',
                'project': 'LIDC-IDRI',
                'id': 2883687,
                'totalNumberOfStudies': 1,
                'totalNumberOfSeries': 1,
                'hit': '<em>studyDesc</em>: CT <strong>LUNG</strong> SCREEN',
                'studyIdentifiers': [
                    {
                        'seriesIdentifiers': [
                            2949226
                        ],
                        'studyIdentifier': 2916456
                    }
                ]
            },
            {
                'subjectId': 'LIDC-IDRI-2607747538',
                'project': 'LIDC-IDRI',
                'id': 2883703,
                'totalNumberOfStudies': 1,
                'totalNumberOfSeries': 1,
                'hit': '<em>studyDesc</em>: CT <strong>LUNG</strong> SCREEN',
                'studyIdentifiers': [
                    {
                        'seriesIdentifiers': [
                            2949242
                        ],
                        'studyIdentifier': 2916472
                    }
                ]
            },
            {
                'subjectId': 'LIDC-IDRI-4149964274',
                'project': 'LIDC-IDRI',
                'id': 2883691,
                'totalNumberOfStudies': 1,
                'totalNumberOfSeries': 1,
                'hit': '<em>studyDesc</em>: CT <strong>LUNG</strong> SCREEN',
                'studyIdentifiers': [
                    {
                        'seriesIdentifiers': [
                            2949230
                        ],
                        'studyIdentifier': 2916460
                    }
                ]
            },
            {
                'subjectId': 'LIDC-IDRI-2107268439',
                'project': 'LIDC-IDRI',
                'id': 2883709,
                'totalNumberOfStudies': 1,
                'totalNumberOfSeries': 1,
                'hit': '<em>studyDesc</em>: CT GUIDED <strong>LUNG</strong> B',
                'studyIdentifiers': [
                    {
                        'seriesIdentifiers': [
                            2949248
                        ],
                        'studyIdentifier': 2916478
                    }
                ]
            },
            {
                'subjectId': 'LIDC-IDRI-3088883782',
                'project': 'LIDC-IDRI',
                'id': 2883693,
                'totalNumberOfStudies': 1,
                'totalNumberOfSeries': 1,
                'hit': '<em>studyDesc</em>: CT GUIDED <strong>LUNG</strong> B',
                'studyIdentifiers': [
                    {
                        'seriesIdentifiers': [
                            2949232
                        ],
                        'studyIdentifier': 2916462
                    }
                ]
            }
        ]

        selectedList = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
        criteriaList = [
            { 'criteria': 'ZABDOMEN', 'count': '140' },
            { 'criteria': 'CERVIX', 'count': 0 },
            { 'criteria': 'CHEST', 'count': '1440' },
            { 'criteria': 'CHESTABDPELVIS', 'count': '3' },
            { 'criteria': 'COLON', 'count': '850' },
            { 'criteria': 'ESOPHAGUS', 'count': '16' },
            { 'criteria': 'EXTREMITY', 'count': '51' },
            { 'criteria': 'HEAD', 'count': 0 },
            { 'criteria': 'HEADNECK', 'count': '342' },
            { 'criteria': 'Kidney', 'count': '15' },
            { 'criteria': 'KIDNEY', 'count': '257' },
            { 'criteria': 'LEG', 'count': '1' },
            { 'criteria': 'LIVER', 'count': '75' },
            { 'criteria': 'LUNG', 'count': '756' },
            { 'criteria': 'MEDIASTINUM', 'count': '90' },
            { 'criteria': 'NECK', 'count': '1' },
            { 'criteria': 'OVARY', 'count': '143' },
            { 'criteria': 'PANCREAS', 'count': '82' },
            { 'criteria': 'PHANTOM', 'count': '20' },
            { 'criteria': 'PROSTATE', 'count': '12' },
            { 'criteria': 'RECTUM', 'count': '3' },
            { 'criteria': 'SKULL', 'count': 0 },
            { 'criteria': 'STOMACH', 'count': '46' },
            { 'criteria': 'THORAX_1HEAD_NE', 'count': '3' },
            { 'criteria': 'THYROID', 'count': '6' },
            { 'criteria': 'TSPINE', 'count': 0 },
            { 'criteria': 'UNDEFINED', 'count': '1' },
            { 'criteria': 'UTERUS', 'count': '58' }];


        searchResults0 = [{
            'subjectId': 'CBIS-DDSM-1004046726',
            'project': 'Z_CBIS-DDSM',
            'id': 2883585,
            'totalNumberOfStudies': 11,
            'totalNumberOfSeries': 100,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949123], 'studyIdentifier': 2916354 }],
            'matchedSeries': 1,
            'matchedStudies': 12
        }, {
            'subjectId': 'CBIS-DDSM-1023223917',
            'project': 'C_CBIS-DDSM',
            'id': 2883645,
            'totalNumberOfStudies': 10,
            'totalNumberOfSeries': 25,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949183], 'studyIdentifier': 2916414 }],
            'matchedSeries': 4,
            'matchedStudies': 121
        }, {
            'subjectId': 'CBIS-DDSM-1031248166',
            'project': 'B_CBIS-DDSM',
            'id': 2883629,
            'totalNumberOfStudies': 120,
            'totalNumberOfSeries': 1234,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949167], 'studyIdentifier': 2916398 }],
            'matchedSeries': 1234,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1071224163',
            'project': 'A_CBIS-DDSM',
            'id': 2883655,
            'totalNumberOfStudies': 20,
            'totalNumberOfSeries': 123,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949193], 'studyIdentifier': 2916424 }],
            'matchedSeries': 1230,
            'matchedStudies': 1324
        }
        ];


        searchResults = [{
            'subjectId': 'CBIS-DDSM-1004046726',
            'project': 'Z_CBIS-DDSM',
            'id': 2883585,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 100,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949123], 'studyIdentifier': 2916354 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1023223917',
            'project': 'C_CBIS-DDSM',
            'id': 2883645,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 25,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949183], 'studyIdentifier': 2916414 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1031248166',
            'project': 'B_CBIS-DDSM',
            'id': 2883629,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949167], 'studyIdentifier': 2916398 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1071224163',
            'project': 'A_CBIS-DDSM',
            'id': 2883655,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949193], 'studyIdentifier': 2916424 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1085054301',
            'project': 'CBIS-DDSM',
            'id': 2883650,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949188], 'studyIdentifier': 2916419 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1128684269',
            'project': 'CBIS-DDSM',
            'id': 2883588,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949126], 'studyIdentifier': 2916357 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1169456027',
            'project': 'CBIS-DDSM',
            'id': 2883614,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949152], 'studyIdentifier': 2916383 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1183957155',
            'project': 'CBIS-DDSM',
            'id': 2883601,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949139], 'studyIdentifier': 2916370 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1196117810',
            'project': 'CBIS-DDSM',
            'id': 2883658,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949196], 'studyIdentifier': 2916427 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1361857199',
            'project': 'CBIS-DDSM',
            'id': 2883618,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949156], 'studyIdentifier': 2916387 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1382658157',
            'project': 'CBIS-DDSM',
            'id': 2883623,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949161], 'studyIdentifier': 2916392 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1411851357',
            'project': 'CBIS-DDSM',
            'id': 2883656,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949194], 'studyIdentifier': 2916425 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1507337429',
            'project': 'CBIS-DDSM',
            'id': 2883594,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949132], 'studyIdentifier': 2916363 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1538303164',
            'project': 'CBIS-DDSM',
            'id': 2883663,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949201], 'studyIdentifier': 2916432 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1559897976',
            'project': 'CBIS-DDSM',
            'id': 2883664,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949202], 'studyIdentifier': 2916433 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1583821145',
            'project': 'CBIS-DDSM',
            'id': 2883642,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949180], 'studyIdentifier': 2916411 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1593237920',
            'project': 'CBIS-DDSM',
            'id': 2883606,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949144], 'studyIdentifier': 2916375 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1606342127',
            'project': 'CBIS-DDSM',
            'id': 2883632,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949170], 'studyIdentifier': 2916401 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1652815504',
            'project': 'CBIS-DDSM',
            'id': 2883589,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949127], 'studyIdentifier': 2916358 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1653801567',
            'project': 'CBIS-DDSM',
            'id': 2883613,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949151], 'studyIdentifier': 2916382 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1682952759',
            'project': 'CBIS-DDSM',
            'id': 2883646,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949184], 'studyIdentifier': 2916415 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1792412151',
            'project': 'CBIS-DDSM',
            'id': 2883604,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949142], 'studyIdentifier': 2916373 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1869834188',
            'project': 'CBIS-DDSM',
            'id': 2883631,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949169], 'studyIdentifier': 2916400 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1941939187',
            'project': 'CBIS-DDSM',
            'id': 2883638,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949176], 'studyIdentifier': 2916407 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1976752043',
            'project': 'CBIS-DDSM',
            'id': 2883595,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949133], 'studyIdentifier': 2916364 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-1993125661',
            'project': 'CBIS-DDSM',
            'id': 2883593,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949131], 'studyIdentifier': 2916362 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2108683873',
            'project': 'CBIS-DDSM',
            'id': 2883659,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949197], 'studyIdentifier': 2916428 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2121623267',
            'project': 'CBIS-DDSM',
            'id': 2883611,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949149], 'studyIdentifier': 2916380 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2130544940',
            'project': 'CBIS-DDSM',
            'id': 2883628,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949166], 'studyIdentifier': 2916397 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2168870374',
            'project': 'CBIS-DDSM',
            'id': 2883602,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949140], 'studyIdentifier': 2916371 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2203165484',
            'project': 'CBIS-DDSM',
            'id': 2883600,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949138], 'studyIdentifier': 2916369 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2235219023',
            'project': 'CBIS-DDSM',
            'id': 2883616,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949154], 'studyIdentifier': 2916385 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2245057067',
            'project': 'CBIS-DDSM',
            'id': 2883597,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949135], 'studyIdentifier': 2916366 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2337189195',
            'project': 'CBIS-DDSM',
            'id': 2883633,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949171], 'studyIdentifier': 2916402 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2366955000',
            'project': 'CBIS-DDSM',
            'id': 2883608,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949146], 'studyIdentifier': 2916377 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2413128842',
            'project': 'CBIS-DDSM',
            'id': 2883609,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949147], 'studyIdentifier': 2916378 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2444728761',
            'project': 'CBIS-DDSM',
            'id': 2883649,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949187], 'studyIdentifier': 2916418 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2456340239',
            'project': 'CBIS-DDSM',
            'id': 2883599,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949137], 'studyIdentifier': 2916368 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2553422423',
            'project': 'CBIS-DDSM',
            'id': 2883605,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949143], 'studyIdentifier': 2916374 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2556654818',
            'project': 'CBIS-DDSM',
            'id': 2883657,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949195], 'studyIdentifier': 2916426 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2558268988',
            'project': 'CBIS-DDSM',
            'id': 2883636,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949174], 'studyIdentifier': 2916405 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2566925891',
            'project': 'CBIS-DDSM',
            'id': 2883592,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949130], 'studyIdentifier': 2916361 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2566926571',
            'project': 'CBIS-DDSM',
            'id': 2883586,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949124], 'studyIdentifier': 2916355 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2591968392',
            'project': 'CBIS-DDSM',
            'id': 2883660,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949198], 'studyIdentifier': 2916429 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2616483485',
            'project': 'CBIS-DDSM',
            'id': 2883617,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949155], 'studyIdentifier': 2916386 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2680907975',
            'project': 'CBIS-DDSM',
            'id': 2883643,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949181], 'studyIdentifier': 2916412 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2737678384',
            'project': 'CBIS-DDSM',
            'id': 2883624,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949162], 'studyIdentifier': 2916393 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2762993769',
            'project': 'CBIS-DDSM',
            'id': 2883637,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949175], 'studyIdentifier': 2916406 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2806280399',
            'project': 'CBIS-DDSM',
            'id': 2883598,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949136], 'studyIdentifier': 2916367 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2822878865',
            'project': 'CBIS-DDSM',
            'id': 2883634,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949172], 'studyIdentifier': 2916403 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2905671739',
            'project': 'CBIS-DDSM',
            'id': 2883590,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949128], 'studyIdentifier': 2916359 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-2908482215',
            'project': 'CBIS-DDSM',
            'id': 2883619,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949157], 'studyIdentifier': 2916388 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-3015448508',
            'project': 'CBIS-DDSM',
            'id': 2883625,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949163], 'studyIdentifier': 2916394 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-3017604375',
            'project': 'CBIS-DDSM',
            'id': 2883630,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949168], 'studyIdentifier': 2916399 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-3038382697',
            'project': 'CBIS-DDSM',
            'id': 2883640,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949178], 'studyIdentifier': 2916409 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-3069833726',
            'project': 'CBIS-DDSM',
            'id': 2883662,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949200], 'studyIdentifier': 2916431 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-3096557553',
            'project': 'CBIS-DDSM',
            'id': 2883653,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949191], 'studyIdentifier': 2916422 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-3116951764',
            'project': 'CBIS-DDSM',
            'id': 2883651,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949189], 'studyIdentifier': 2916420 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-3128753658',
            'project': 'CBIS-DDSM',
            'id': 2883661,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949199], 'studyIdentifier': 2916430 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-3153949311',
            'project': 'CBIS-DDSM',
            'id': 2883587,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949125], 'studyIdentifier': 2916356 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-3358874564',
            'project': 'CBIS-DDSM',
            'id': 2883610,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949148], 'studyIdentifier': 2916379 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-3372059600',
            'project': 'CBIS-DDSM',
            'id': 2883652,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949190], 'studyIdentifier': 2916421 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-3591681045',
            'project': 'CBIS-DDSM',
            'id': 2883621,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949159], 'studyIdentifier': 2916390 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-4241421152',
            'project': 'CBIS-DDSM',
            'id': 2883620,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949158], 'studyIdentifier': 2916389 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-5060404731',
            'project': 'CBIS-DDSM',
            'id': 2883622,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949160], 'studyIdentifier': 2916391 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-5754570703',
            'project': 'CBIS-DDSM',
            'id': 2883615,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949153], 'studyIdentifier': 2916384 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-5902448323',
            'project': 'CBIS-DDSM',
            'id': 2883647,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949185], 'studyIdentifier': 2916416 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-6133293015',
            'project': 'CBIS-DDSM',
            'id': 2883635,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949173], 'studyIdentifier': 2916404 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-6764344708',
            'project': 'CBIS-DDSM',
            'id': 2883612,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949150], 'studyIdentifier': 2916381 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-7193855463',
            'project': 'CBIS-DDSM',
            'id': 2883607,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949145], 'studyIdentifier': 2916376 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-7500737087',
            'project': 'CBIS-DDSM',
            'id': 2883627,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949165], 'studyIdentifier': 2916396 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-7684052792',
            'project': 'CBIS-DDSM',
            'id': 2883639,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949177], 'studyIdentifier': 2916408 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-7689418153',
            'project': 'CBIS-DDSM',
            'id': 2883644,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949182], 'studyIdentifier': 2916413 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-7711507991',
            'project': 'CBIS-DDSM',
            'id': 2883641,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949179], 'studyIdentifier': 2916410 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-8027210828',
            'project': 'CBIS-DDSM',
            'id': 2883603,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949141], 'studyIdentifier': 2916372 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-8339495024',
            'project': 'CBIS-DDSM',
            'id': 2883648,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949186], 'studyIdentifier': 2916417 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-8873695750',
            'project': 'CBIS-DDSM',
            'id': 2883591,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949129], 'studyIdentifier': 2916360 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-9185402585',
            'project': 'CBIS-DDSM',
            'id': 2883626,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949164], 'studyIdentifier': 2916395 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-9243101673',
            'project': 'CBIS-DDSM',
            'id': 2883596,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949134], 'studyIdentifier': 2916365 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }, {
            'subjectId': 'CBIS-DDSM-9790950142',
            'project': 'CBIS-DDSM',
            'id': 2883654,
            'totalNumberOfStudies': 1,
            'totalNumberOfSeries': 1,
            'studyIdentifiers': [{ 'seriesIdentifiers': [2949192], 'studyIdentifier': 2916423 }],
            'matchedSeries': 1,
            'matchedStudies': 1
        }];

    } );


} );
