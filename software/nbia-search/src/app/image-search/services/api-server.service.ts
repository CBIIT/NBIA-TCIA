import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'

import {Consts, NumberHash} from '@app/consts';
import {PersistenceService} from '@app/common/services/persistence.service';
import {Properties} from '@assets/properties';
import {CommonService} from './common.service';
import {Observable, Subject} from 'rxjs';
import {takeUntil, timeout} from 'rxjs/operators';
import {UtilService} from '@app/common/services/util.service';
import {ParameterService} from '@app/common/services/parameter.service';
import {HistoryLogService} from '@app/common/services/history-log.service';
import {LoadingDisplayService} from '@app/common/components/loading-display/loading-display.service';


@Injectable({
  providedIn: 'root'
})
export class ApiServerService implements OnDestroy {

    /**
     * Used to return results from a Simple search.
     * @type {EventEmitter}
     */
    simpleSearchResultsEmitter = new EventEmitter();
    simpleSearchTimePointsMinMaxEmitter = new EventEmitter();

    /**
     * Used to return error data from a Simple search.
     * @type {EventEmitter}
     */
    simpleSearchErrorEmitter = new EventEmitter();

    /**
     * Used to return results from a Drill down search.
     * @type {EventEmitter}
     */
    subjectDetailsResultsEmitter = new EventEmitter();

    /**
     * Used to return error data from a Drill down search.
     * @type {EventEmitter}
     */
    subjectDetailsErrorEmitter = new EventEmitter();

    /**
     * Used by emitPostResults when doSearch is called.
     * @type {EventEmitter<any>}
     */
    seriesForCartResultsEmitter = new EventEmitter();

    imageDataResultsEmitter = new EventEmitter();
    imageDataErrorEmitter = new EventEmitter();

    /**
     * Used by emitPostError when doSearch is called.
     * @type {EventEmitter<any>}
     */
    seriesForCartResultsErrorEmitter = new EventEmitter();

    // @TODO explain
    seriesForCartFromSeriesIdResultsEmitter = new EventEmitter();
    seriesForCartFromSeriesIdErrorEmitter = new EventEmitter();


    /**
     * Used by emitPostResults when doSearch is called.
     * @type {EventEmitter<any>}
     */
    seriesForSubjectResultsEmitter = new EventEmitter();


    // @TODO explain
    idForSharedListSubjectResultsEmitter = new EventEmitter();
    idForSharedListSubjectErrorEmitter = new EventEmitter();
    seriesForSharedListSubjectResultsEmitter = new EventEmitter();
    seriesForSharedListSubjectErrorEmitter = new EventEmitter();

    /**
     * Used by emitPostError when doSearch is called.
     * @type {EventEmitter<any>}
     */
    seriesForSubjectErrorEmitter = new EventEmitter();

    /**
     * Used by emitPostResults when doSearch is called.
     * @type {EventEmitter<any>}
     */
    textSearchResultsEmitter = new EventEmitter();
    textSearchClearEmitter = new EventEmitter();

    /**
     * Used by emitPostError when doSearch is called.
     * @type {EventEmitter<any>}
     */
    textSearchErrorEmitter = new EventEmitter();


    saveSharedListResultsEmitter = new EventEmitter();
    saveSharedListErrorEmitter = new EventEmitter();

    deleteSharedListResultsEmitter = new EventEmitter();
    deleteSharedListErrorEmitter = new EventEmitter();

    getSharedListResultsEmitter = new EventEmitter();
    getSharedListErrorEmitter = new EventEmitter();

    logEntryResultsEmitter = new EventEmitter();
    logEntryErrorEmitter = new EventEmitter();

    collectionDescriptionsResultsEmitter = new EventEmitter();
    collectionDescriptionsErrorEmitter = new EventEmitter();

    // We will use these two when Query Builder is hooked up.
    criteriaSearchResultsEmitter = new EventEmitter();
    criteriaSearchErrorEmitter = new EventEmitter();


    /**
     * Used by emitGetResults when dataGet is called
     * @type {EventEmitter<any>}
     */
    getCollectionValuesAndCountsEmitter = new EventEmitter();

    /**
     * Used by emitGetError when dataGet is called
     * @type {EventEmitter<any>}
     */
    getCollectionValuesAndCountsErrorEmitter = new EventEmitter();

    getHostNameEmitter = new EventEmitter();
    getHostNameErrorEmitter = new EventEmitter();


    /**
     * Used by emitGetResults when dataGet is called
     * @type {EventEmitter<any>}
     */
    getModalityValuesAndCountsEmitter = new EventEmitter();

    /**
     * Used by emitGetError when dataGet is called
     * @type {EventEmitter<any>}
     */
    getModalityValuesAndCountsErrorEmitter = new EventEmitter();

    /**
     * Used by emitGetResults when dataGet is called
     * @type {EventEmitter<any>}
     */
    getBodyPartValuesAndCountsEmitter = new EventEmitter();
    /**
     * Used by emitGetError when dataGet is called
     * @type {EventEmitter<any>}
     */
    getBodyPartValuesAndCountsErrorEmitter = new EventEmitter();

    /**
     * Used by emitGetResults when dataGet is called
     * @type {EventEmitter<any>}
     */
    getSpeciesValuesAndCountsEmitter = new EventEmitter();
    /**
     * Used by emitGetError when dataGet is called
     * @type {EventEmitter<any>}
     */
    getSpeciesValuesAndCountsErrorEmitter = new EventEmitter();

    /**
     * Used by emitGetResults when dataGet is called
     * @type {EventEmitter<any>}
     */
    getSpeciesTaxEmitter = new EventEmitter();
    /**
     * Used by emitGetError when dataGet is called
     * @type {EventEmitter<any>}
     */
    getSpeciesTaxErrorEmitter = new EventEmitter();
    speciesTax;

    getMinMaxTimepointsEmitter = new EventEmitter();

    /**
     * Used by emitGetResults when dataGet is called
     * @type {EventEmitter<any>}
     */
    getManufacturerTreeEmitter = new EventEmitter();

    /**
     * Used by emitGetError when dataGet is called
     * @type {EventEmitter<any>}
     */
    getManufacturerTreeErrorEmitter = new EventEmitter();

    collectionLicenses;
    collectionLicensesResultsEmitter = new EventEmitter();
    collectionLicensesErrorEmitter = new EventEmitter();

    getEventTypesEmitter = new EventEmitter();
    getEventTypesErrorEmitter = new EventEmitter();

    getDicomTagsEmitter = new EventEmitter();
    getDicomTagsErrorEmitter = new EventEmitter();

    getDicomTagsByImageEmitter = new EventEmitter();
    getDicomTagsByImageErrorEmitter = new EventEmitter();


    // TODO Explain
    // FIXME make this name Image Modality specific. and getImageModalityAllOrAny & setImageModalityAllOrAny
    imageModalityAllOrAnyLabels;

    /**
     * Access token from the API server - nbia-api/oauth/token<br>
     *
     * If an API search call gets a 401, we will try to get a new token.
     */
    accessToken: string;
    refreshToken: string;
    tokenLifeSpan: 100000;
    rawAccessToken;

    /**
     * This is used for logging in, if the currentUser is not Properties.DEFAULT_USER, this name is displayed in the login/logout button.<br>
     * Outside of this service, this is accessed with this.setCurrentUser and this.getCurrentUser.
     */
    currentUser;
    currentUserRoles: [];
    currentUserRolesEmitter = new EventEmitter();

    /**
     * Used when getting an access token from the API server.
     */
    currentApiPassword;

    userSetEmitter = new EventEmitter();
    logOutCurrentUserEmitter = new EventEmitter();

    // TODO explain
    criteriaCountUpdateEmitter = new EventEmitter();

    // Used when adding parameters to the search string that will be sent to the API.
    queryBuilderIndex = 0;

    // For now this is only being used to emit simpleSearch results, filtered for Minimum matched studies,
    // when the 'Minimum matched studies' has changed, but the rest of the query has not, so no need to rerun the query.
    // TODO explain this better
    currentSearchResults;
    currentSearchResultsData;

    simpleSearchQueryHold;
    simpleSearchQueryHoldEmitter = new EventEmitter();

    textSearchQueryHold;
    textSearchQueryHoldEmitter = new EventEmitter();

    // Used to determine if we are in the process of logging out the current user.
    loggingOut = false;

    temp = '';

    criteriaCountsImageModality: NumberHash = {};
    criteriaCountsAnatomicalSite: NumberHash = {};
    criteriaCountsCollection: NumberHash = {};
    criteriaCountsSpecies: NumberHash = {};

    simpleSearchQueryTrailer = '';

    public gettingAccessToken = 0;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor(private httpClient: HttpClient, private persistenceService: PersistenceService,
                private commonService: CommonService, private parameterService: ParameterService,
                private historyLogService: HistoryLogService, private utilService: UtilService,
                private loadingDisplayService: LoadingDisplayService) {

        // Until the user logs in, we do everything as the default/guest user.
        this.initUserLoginData();

        // Called when the 'Clear' button on the left side of the Display query at the top.
        this.commonService.resetAllSimpleSearchEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            async () => {
                this.setSimpleSearchQueryHold(null);
                this.getCriteriaCounts();
            });
    }

    async initUserLoginData() {
        // Make sure the configuration from the assets/configuration has been read and used.
        // It has DEFAULT_USER, DEFAULT_PASSWORD and DEFAULT_SECRET
        while (!Properties.CONFIG_COMPLETE) {
            await this.commonService.sleep(Consts.waitTime);
        }

        // Until the user logs in, we do everything as the default/guest user.
        if (this.persistenceService.get(this.persistenceService.Field.IS_GUEST) ||
            this.utilService.isNullOrUndefined(this.persistenceService.getAccessToken())
        ) {
            this.setCurrentUser(Properties.DEFAULT_USER);
            this.setCurrentPassword(Properties.DEFAULT_PASSWORD);
        } else {
            this.setToken(this.persistenceService.getTokens());
            this.setCurrentUser(this.persistenceService.get(this.persistenceService.Field.USER));
            this.setCurrentPassword('');
        }
    }

    setLoggingOut(l) {
        this.loggingOut = l;
    }

    getLoggingOut() {
        return this.loggingOut;
    }

    getCurrentUserRoles() {
        return this.currentUserRoles;
    }

    getSpeciesTax() {
        return this.speciesTax;
    }

    getSimpleSearchQueryHold() {
        return this.simpleSearchQueryHold;
    }

    setSimpleSearchQueryHold(s) {
        this.simpleSearchQueryHold = s;

        this.simpleSearchQueryHoldEmitter.emit(this.simpleSearchQueryHold);

    }

    getTextSearchQueryHold() {
        return this.textSearchQueryHold;
    }

    setTextSearchQueryHold(s) {
        this.textSearchQueryHold = s;
        // So far this is only used to tell the HeaderComponent Share -> Share my query if it should be enabled.
        this.textSearchQueryHoldEmitter.emit(this.textSearchQueryHold);

    }

    // Just for testing
    showAllQueryData(allData) {
        let criteriaStr = ['CollectionCriteria', 'ImageModalityCriteria', 'AnatomicalSiteCriteria', 'PatientCriteria', 'ManufacturerCriteria', 'MinNumberOfStudiesCriteria', 'SpeciesCriteria'];
        for (let name of criteriaStr) {
            if ((!this.utilService.isNullOrUndefined(allData[name])) && (allData[name].length > 0)) {
                console.log('allQueryData[' + name + ']: ', allData[name]);
            } else {
                console.log('allQueryData[' + name + ']: -');
            }
        }
    }


    /**
     * Builds the query string in the format needed by the Rest call.
     *
     * @returns {string}
     */
    buildSimpleSearchQuery(allData) {
        let searchQuery = '';
        this.queryBuilderIndex = 0;

        let isSearchable = false; // CHECKME I don't think we need/use this

        // Days from baseline
        if ((allData[Consts.DAYS_FROM_BASELINE_CRITERIA] !== undefined) &&
            (allData[Consts.DAYS_FROM_BASELINE_CRITERIA][0] !== undefined) &&
            (allData[Consts.DAYS_FROM_BASELINE_CRITERIA].length > 0)) {
            isSearchable = true;

            searchQuery += '&' + 'criteriaType' + this.queryBuilderIndex + '=' + Consts.DAYS_FROM_BASELINE_CRITERIA + '&eventType' + this.queryBuilderIndex + '=' +
                allData[Consts.DAYS_FROM_BASELINE_CRITERIA][0];
            if (allData[Consts.DAYS_FROM_BASELINE_CRITERIA][1].length > 0) {
                searchQuery += '&fromDay' + (this.queryBuilderIndex) + '=' + allData[Consts.DAYS_FROM_BASELINE_CRITERIA][1];
            }
            if (allData[Consts.DAYS_FROM_BASELINE_CRITERIA][2].length > 0) {
                searchQuery += '&toDay' + (this.queryBuilderIndex) + '=' + allData[Consts.DAYS_FROM_BASELINE_CRITERIA][2];
            }
            this.queryBuilderIndex++;
        }

        // Exclude Commercial
        if ((allData[Consts.EXCLUDE_COMMERCIAL_CRITERIA] !== undefined) &&
            (allData[Consts.EXCLUDE_COMMERCIAL_CRITERIA][0] !== undefined) &&
            (allData[Consts.EXCLUDE_COMMERCIAL_CRITERIA].length > 0)) {
            isSearchable = true;

            searchQuery += '&' + 'criteriaType' + this.queryBuilderIndex + '=' + Consts.EXCLUDE_COMMERCIAL_CRITERIA + '&value' + this.queryBuilderIndex + '=' +
                allData[Consts.EXCLUDE_COMMERCIAL_CRITERIA][0];
            this.queryBuilderIndex++;
        }

        // Collections
        if ((allData[Consts.COLLECTION_CRITERIA] !== undefined) && (allData[Consts.COLLECTION_CRITERIA].length > 0)) {
            isSearchable = true;
            for (let item of allData[Consts.COLLECTION_CRITERIA]) {
                searchQuery += '&' + 'criteriaType' + this.queryBuilderIndex + '=' + Consts.COLLECTION_CRITERIA + '&value' + this.queryBuilderIndex + '=' + item;
                this.queryBuilderIndex++;
            }
        }

        // Minimum Studies
        if ((allData[Consts.MINIMUM_STUDIES] !== undefined) && (allData[Consts.MINIMUM_STUDIES].length > 0)) {
            isSearchable = true;

            for (let item of allData[Consts.MINIMUM_STUDIES]) {

                let msCount = +item - 1;
                if (msCount > 0) {
                    searchQuery += '&' + 'criteriaType' + this.queryBuilderIndex + '=' + Consts.MINIMUM_STUDIES + '&value' + this.queryBuilderIndex + '=' + msCount;
                    this.queryBuilderIndex++;
                }
            }
        }


        // Image Modality
        if ((allData[Consts.IMAGE_MODALITY_CRITERIA] !== undefined) && (allData[Consts.IMAGE_MODALITY_CRITERIA].length > 0)) {
            isSearchable = true;
            for (let item of allData[Consts.IMAGE_MODALITY_CRITERIA]) {
                searchQuery += '&' + 'criteriaType' + this.queryBuilderIndex + '=' + Consts.IMAGE_MODALITY_CRITERIA + '&value' + this.queryBuilderIndex + '=' + item;
                this.queryBuilderIndex++;
            }
            if (this.getImageModalityAllOrAny() === 'All')  // FIXME make a constant
            {
                searchQuery += '&' + 'criteriaType' + this.queryBuilderIndex + '=ModalityAndedSearchCriteria&value' + this.queryBuilderIndex + '=all';
            }
        }

        // Anatomical Site
        if ((allData[Consts.ANATOMICAL_SITE_CRITERIA] !== undefined) && (allData[Consts.ANATOMICAL_SITE_CRITERIA].length > 0)) {
            isSearchable = true;
            for (let item of allData[Consts.ANATOMICAL_SITE_CRITERIA]) {
                searchQuery += '&' + 'criteriaType' + this.queryBuilderIndex + '=' + Consts.ANATOMICAL_SITE_CRITERIA + '&value' + this.queryBuilderIndex + '=' + item;
                this.queryBuilderIndex++;
            }
        }

        // Species
        if ((allData[Consts.SPECIES_CRITERIA] !== undefined) && (allData[Consts.SPECIES_CRITERIA].length > 0)) {
            isSearchable = true;
            for (let item of allData[Consts.SPECIES_CRITERIA]) {
                searchQuery += '&' + 'criteriaType' + this.queryBuilderIndex + '=' + Consts.SPECIES_CRITERIA + '&value' + this.queryBuilderIndex + '=' + item;
                this.queryBuilderIndex++;
            }
        }

        // Phantoms
        if ((allData[Consts.PHANTOMS_CRITERIA] !== undefined) && (allData[Consts.PHANTOMS_CRITERIA].length > 0)) {
            isSearchable = true;
            for (let item of allData[Consts.PHANTOMS_CRITERIA]) {
                searchQuery += '&' + 'criteriaType' + this.queryBuilderIndex + '=' + Consts.PHANTOMS_CRITERIA + '&value' + this.queryBuilderIndex + '=' + item;
                this.queryBuilderIndex++;
            }
        }

        // Third Party Analyses
        if ((allData[Consts.THIRD_PARTY_CRITERIA] !== undefined) && (allData[Consts.THIRD_PARTY_CRITERIA].length > 0)) {
            isSearchable = true;
            for (let item of allData[Consts.THIRD_PARTY_CRITERIA]) {
                searchQuery += '&' + 'criteriaType' + this.queryBuilderIndex + '=' + Consts.THIRD_PARTY_CRITERIA + '&value' + this.queryBuilderIndex + '=' + item;
                this.queryBuilderIndex++;
            }
        }

        // Available  -  Date Range
        if ((allData[Consts.DATE_RANGE_CRITERIA] !== undefined) && (allData[Consts.DATE_RANGE_CRITERIA].length > 0)) {
            searchQuery += '&' + 'criteriaType' + this.queryBuilderIndex + '=' + Consts.DATE_RANGE_CRITERIA + '&' +
                'fromDate' + this.queryBuilderIndex + '=' + allData[Consts.DATE_RANGE_CRITERIA][0] + '&' +
                'toDate' + this.queryBuilderIndex + '=' + allData[Consts.DATE_RANGE_CRITERIA][1];
            this.queryBuilderIndex++;
        }

        // Subject ID  -  Patient Criteria
        if ((allData[Consts.PATIENT_CRITERIA] !== undefined) && (allData[Consts.PATIENT_CRITERIA].length > 0)) {
            isSearchable = true;
            for (let item of allData[Consts.PATIENT_CRITERIA]) {
                searchQuery += '&' + 'criteriaType' + this.queryBuilderIndex + '=' + Consts.PATIENT_CRITERIA + '&value' + this.queryBuilderIndex + '=' + item;
                this.queryBuilderIndex++;
            }
        }


        // Manufacturer
        if ((allData[Consts.MANUFACTURER_CRITERIA] !== undefined) && (allData[Consts.MANUFACTURER_CRITERIA].length > 0)) {
            isSearchable = true;
            for (let item of allData[Consts.MANUFACTURER_CRITERIA]) {
                searchQuery += '&' + 'criteriaType' + this.queryBuilderIndex + '=' + Consts.MANUFACTURER_CRITERIA + '&value' + this.queryBuilderIndex + '=' + item;
                this.queryBuilderIndex++;
            }
        }

        // Manufacturer Model
        if ((allData[Consts.MANUFACTURER_MODEL_CRITERIA] !== undefined) && (allData[Consts.MANUFACTURER_MODEL_CRITERIA].length > 0)) {
            isSearchable = true;
            for (let item of allData[Consts.MANUFACTURER_MODEL_CRITERIA]) {
                searchQuery += '&' + 'criteriaType' + this.queryBuilderIndex + '=' + Consts.MANUFACTURER_MODEL_CRITERIA + '&value' + this.queryBuilderIndex + '=' + item;
                this.queryBuilderIndex++;
            }
        }

        // Manufacturer Software version
        if ((allData[Consts.MANUFACTURER_SOFTWARE_VERSION_CRITERIA] !== undefined) && (allData[Consts.MANUFACTURER_SOFTWARE_VERSION_CRITERIA].length > 0)) {
            isSearchable = true;
            for (let item of allData[Consts.MANUFACTURER_SOFTWARE_VERSION_CRITERIA]) {
                searchQuery += '&' + 'criteriaType' + this.queryBuilderIndex + '=' + Consts.MANUFACTURER_SOFTWARE_VERSION_CRITERIA + '&value' + this.queryBuilderIndex + '=' + item;
                this.queryBuilderIndex++;
            }
        }
        // Add tool name to query so server can track usage.

        if (searchQuery.length > 0) {
            searchQuery += '&tool=nbiaclient';
        }

        // Remove leading &
        searchQuery = searchQuery.substr(1);
        this.commonService.setIsSearchable(isSearchable);  // CHECKME I don't think we need/use this

        return searchQuery;
    }


    /** TODO Update this comment
     * This is called whenever a new access token is retrieved from the server when:<br><ol>
     *  <li>If there is an Authorization error when doPost does a search (post), it will try get a new token, if it succeeds, it will call setToken.
     *  <li>If there is an Authorization error when dataGet retrieves data from the server (get)
     *  <li>LoginComponent.doLogin  when a user is logged in and retrieves an access token.
     *  <li>NbiaClientComponent.initToken during startup initialization.</li></ol>
     *
     * @param t Access token
     */
    setToken(t) {
        if (t === null) {
            this.accessToken = null;
        } else {
            this.accessToken = t['access_token'];
            this.refreshToken = t['refresh_token'];
            this.tokenLifeSpan = t['expires_in'];
            this.gotToken();
        }
        this.persistenceService.storeTokens(this.accessToken, this.refreshToken, this.tokenLifeSpan);
        this.rawAccessToken = t;

        if(t !== null){
            // Get this user's role(s)
            this.doGet(Consts.GET_USER_ROLES, this.accessToken).subscribe(
                (resGetUserRoles) => {
                    this.currentUserRoles = resGetUserRoles;
                    this.currentUserRolesEmitter.emit(this.currentUserRoles);
                },
                (errGetUserRoles) => {
                    // If we can't get the users role(s), we will give them none.
                    this.currentUserRoles = [];
                    this.currentUserRolesEmitter.emit(this.currentUserRoles);
                });
        } else {
            this.currentUserRoles = [];
            this.currentUserRolesEmitter.emit(this.currentUserRoles);
        }
    }

    /**
     * This is only used by diagnostic and debugging functions
     *
     * @returns {string}
     */
    showToken() {
        return this.accessToken;
    }

    showRefreshToken() {
        return this.refreshToken;
    }


    getRefreshToken() {
        return this.showRefreshToken();
    }

    showTokenLifeSpan() {
        return this.tokenLifeSpan;
    }

    getTokenLifeSpan() {
        return this.showTokenLifeSpan();
    }

    /**
     * Called by the LoginComponent.
     *
     * currentUser is needed by NbiaClientComponent to determine if default user is the current user,
     * and HeaderComponent when the Login button is used.
     *
     * Sets is_guest in persistenceService, used by the thumbnail viewer, to know if it should relogin as guest if token expires.
     *
     * @param user
     */
    setCurrentUser(user) {
        this.currentUser = user;

        // This emit tells the header component to update the Login/Logout button.
        this.userSetEmitter.emit(this.currentUser);
        if (user === Properties.DEFAULT_USER) {
            this.persistenceService.put(this.persistenceService.Field.IS_GUEST, true);
        } else {
            this.persistenceService.put(this.persistenceService.Field.IS_GUEST, false);
        }
    }

    /**
     *
     * @returns {any}
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Called by LoginComponent.
     *
     * @param pw plain text password.
     */
    setCurrentPassword(pw) {
        this.currentApiPassword = pw;
    }

    getCurrentPassword() {
        return this.currentApiPassword;
    }


    /**
     * Called when the Logout button in the HeaderComponent is clicked.<br>
     * Tells LoginComponent to 'quietly' login the default user.
     */
    logOutCurrentUser() {
        this.logOutCurrentUserEmitter.emit(true);
    }

    log(logText) {
        if (Properties.ACTION_LOGGING) {
            this.doSearch(Consts.LOG_ENTRY, 'action=' + logText);
        }
        /*
             else{
             console.log('Log: ', 'action=' + logText);
         }
        */
    }


    /**
     * Called by SearchResultsTableComponent.
     */
    clearSearchResults() {
        this.currentSearchResults = [];

        // CommonServices has a copy which is used restore results when Search type tabs change and minimum studies changes.
        this.commonService.clearSimpleSearchResults();
    }

    /**  TODO Add comments about calling components
     * Emit the API server call results.<br>
     * A different emitter is used depending on the 'searchType'.
     *
     * @param searchType  SIMPLE_SEARCH for initial search results,  DRILL_DOWN for search of 'Subject ID',
     *                    DRILL_DOWN_CART to get all the series for the selected Studies or Subjects,
     *                    SERIES_FOR_SUBJECT to get all the series of a Subject, or TEXT_SEARCH.
     * @param res
     * @param selected Optional If this is for SERIES_FOR_SUBJECT, which was called when a Subject ID (parent) was clicked, we need to pass along the state.
     */
    emitPostResults(searchType, res, id?, selected?) {
        if ((!this.utilService.isNullOrUndefined(res['resultSet'])) && (res['resultSet'].length < 1)) {
            // 0 means no results from a search,  -1 means no search
            this.commonService.updateSearchResultsCount(0);
        }

        if (searchType === Consts.SIMPLE_SEARCH && Properties.PAGED_SEARCH) {
            this.currentSearchResultsData = res;
            this.currentSearchResults = res['resultSet'].slice();
            // Tell everyone the the search results count.
            this.commonService.updateSearchResultsCount(this.currentSearchResultsData['totalPatients']);

            // TODO Explain why we need this ( for now )
            this.commonService.updateSimpleSearchResultsCount(this.currentSearchResultsData['totalPatients']);

            this.simpleSearchTimePointsMinMaxEmitter.emit({
                'minTimepoints': this.currentSearchResultsData['minTimepoints'],
                'maxTimepoints': this.currentSearchResultsData['maxTimepoints']
            });
            // We need to add matchedStudies to the data.
            for (let row of this.currentSearchResults) {
                let matchedSeriesCount = 0;
                for (let sId of row['studyIdentifiers']) {
                    matchedSeriesCount += sId['seriesIdentifiers'].length;
                }

                row['matchedSeries'] = matchedSeriesCount;
                row['matchedStudies'] = row['studyIdentifiers'].length;

            }


            this.getCriteriaCounts();
            this.simpleSearchResultsEmitter.emit(this.currentSearchResults);
        }

        // TODO we will probably never go back to non-paged results. Should start cleaning this stuff out.
        if (searchType === Consts.SIMPLE_SEARCH && (!Properties.PAGED_SEARCH)) {

            this.currentSearchResults = res.slice();

            // We need to add matchedStudies to the data.
            for (let row of res) {

                let matchedSeriesCount = 0;
                for (let sId of row['studyIdentifiers']) {
                    matchedSeriesCount += sId['seriesIdentifiers'].length;
                }
                row['matchedSeries'] = matchedSeriesCount;
                row['matchedStudies'] = row['studyIdentifiers'].length;
            }

            this.getCriteriaCounts();
            this.simpleSearchResultsEmitter.emit(res);
        } else if (searchType === Consts.DRILL_DOWN_CART) {

            this.seriesForCartResultsEmitter.emit(res);
        } else if (searchType === Consts.DRILL_DOWN_IMAGE) {
            this.imageDataResultsEmitter.emit(res);
        } else if (searchType === Consts.DRILL_DOWN_CART_FROM_SERIES) {
            this.seriesForCartFromSeriesIdResultsEmitter.emit(res);
        } else if (searchType === Consts.DRILL_DOWN) {
            this.subjectDetailsResultsEmitter.emit(res);
        }
        // Results of Subject level cart is clicked.
        else if (searchType === Consts.SERIES_FOR_SUBJECT) {
            this.seriesForSubjectResultsEmitter.emit({res, id, selected});
        } else if (searchType === Consts.SERIES_FOR_SHARED_LIST_SUBJECT) {
            this.seriesForSharedListSubjectResultsEmitter.emit({res});
        }

        // To get all the studies for the subject(s)  // @TODO rename things to say Study - MAKE SURE THAT IS CORRECT!
        else if (searchType === Consts.SHARED_LIST_SUBJECT_ID_SEARCH) {
            this.idForSharedListSubjectResultsEmitter.emit({res});
        } else if (searchType === Consts.CREATE_SHARED_LIST) {
            this.saveSharedListResultsEmitter.emit(res);
        } else if (searchType === Consts.DELETE_SHARED_LIST) {
            this.deleteSharedListResultsEmitter.emit(res);
        } else if (searchType === Consts.GET_SHARED_LIST) {
            this.getSharedListResultsEmitter.emit(res);
        } else if (searchType === Consts.LOG_ENTRY) {
            this.logEntryResultsEmitter.emit(res);
        } else if (searchType === Consts.GET_HOST_NAME) {
            this.getHostNameEmitter.emit(res);
        } else if (searchType === Consts.TEXT_SEARCH) {


            // We need to add matchedStudies to the data.
            for (let row of res) {
                let matchedSeriesCount = 0;
                for (let sId of row['studyIdentifiers']) {
                    matchedSeriesCount += sId['seriesIdentifiers'].length;
                }
                row['matchedSeries'] = matchedSeriesCount;
                row['matchedStudies'] = row['studyIdentifiers'].length;
            }
            this.commonService.updateSearchResultsCount(res.length);
            this.textSearchResultsEmitter.emit(res);
        }
    }

    /**
     * Emit the error of an API server post call.<br>
     * A different emitter is used depending on the 'searchType' to deliver the error message.
     *
     * @TODO id - I don't think we will need it?
     * @TODO subscribers need to react to errors.
     * @param searchType  SIMPLE_SEARCH for initial search results,  DRILL_DOWN for search of 'Subject ID',
     *                    DRILL_DOWN_CART to get all the series for the selected Studies or Subjects,
     *                    SERIES_FOR_SUBJECT to get all the series of a Subject, or TEXT_SEARCH.
     * @param err  The error object
     * @param id I don't think I'm going to use this?
     */
    emitPostError(searchType, err, id) {

        // console.error( 'PostError  searchType:', searchType, '  err:', err['_body']  + '  ' + this.temp);
        if (searchType === Consts.SIMPLE_SEARCH) {
            this.simpleSearchErrorEmitter.emit(err);
        } else if (searchType === Consts.GET_HOST_NAME) {
            this.getHostNameErrorEmitter.emit(err);
        } else if (searchType === Consts.DRILL_DOWN_CART) {
            this.seriesForCartResultsErrorEmitter.emit(err);
        } else if (searchType === Consts.DRILL_DOWN_IMAGE) {
            this.imageDataErrorEmitter.emit(err);
        } else if (searchType === Consts.DRILL_DOWN_CART_FROM_SERIES) {
            this.seriesForCartFromSeriesIdErrorEmitter.emit(err);
        } else if (searchType === Consts.DRILL_DOWN) {
            this.subjectDetailsErrorEmitter.emit(err);
        } else if (searchType === Consts.SERIES_FOR_SUBJECT) {
            this.seriesForSubjectErrorEmitter.emit(err);
        } else if (searchType === Consts.TEXT_SEARCH) {
            this.textSearchErrorEmitter.emit(err);
        } else if (searchType === Consts.SERIES_FOR_SHARED_LIST_SUBJECT) {
            this.seriesForSharedListSubjectErrorEmitter.emit({err});
        } else if (searchType === Consts.SHARED_LIST_SUBJECT_ID_SEARCH) {
            this.idForSharedListSubjectErrorEmitter.emit({err});
        } else if (searchType === Consts.CREATE_SHARED_LIST) {
            this.saveSharedListErrorEmitter.emit(err);
        } else if (searchType === Consts.DELETE_SHARED_LIST) {
            this.deleteSharedListErrorEmitter.emit(err);
        } else if (searchType === Consts.GET_SHARED_LIST) {
            this.getSharedListErrorEmitter.emit(err);
        } else if (searchType === Consts.LOG_ENTRY) {
            this.logEntryErrorEmitter.emit(err);
        }

    }


    /**
     * Determines search type, then calls doPost, if the search returns a 401 (Authorization) error,
     * it will try to get a new access token then try again.<br>
     *
     *  The search results are passed to emitPostResults which will use a different Emitter for each search type, to deliver the results.<br><br>
     *  If there is an error, an error message is passed to emitPostError which will use a different Emitter for each search type, to deliver the error message.
     *
     * @param searchType SIMPLE_SEARCH for initial search results,  DRILL_DOWN for search of 'Subject ID',
     *                    DRILL_DOWN_CART to get all the series for the selected Studies or Subjects,
     *                    SERIES_FOR_SUBJECT to get all the series of a Subject, or TEXT_SEARCH.
     * @param query
     * @param id Optional additional string, which is carried along to the results as is.
     * @param selected Optional
     */
    doSearch(searchType, query, id ?, selected ?) {
        this.temp = query;
        let searchService;
        let re = /&start=[0-9]+&/;

        switch (searchType) {

            case Consts.SIMPLE_SEARCH:
                // Only log for the initial search, not each change of the page.
                // Do not log if the query has not changed other than "start=".
                if (query.includes('&start=0') && (query.replace(re, '') !== this.simpleSearchQueryTrailer.replace(re, ''))) {
                    this.log(this.historyLogService.doLog(Consts.SIMPLE_SEARCH_LOG_TEXT, this.currentUser, query));
                }
                this.simpleSearchQueryTrailer = query;

                // We are doing a simple search, so we need to update the criteria counts.
                this.setSimpleSearchQueryHold(query);
                searchService = Consts.SIMPLE_SEARCH;
                break;

            case Consts.SHARED_LIST_SUBJECT_ID_SEARCH:
                searchService = Consts.SIMPLE_SEARCH;
                break;

            // Get image data to get thumbnail (and later images)
            case Consts.DRILL_DOWN_IMAGE:
                searchService = Consts.DRILL_DOWN_IMAGE;
                break;


            // Searches that use drillDown search
            case Consts.DRILL_DOWN_CART:
                searchService = Consts.DRILL_DOWN_CART;
                break;

            case Consts.DRILL_DOWN:
            case Consts.SERIES_FOR_SHARED_LIST_SUBJECT:

            // Called when a Subject level cart is clicked.
            case Consts.SERIES_FOR_SUBJECT:
                searchService = Consts.DRILL_DOWN;
                break;

            // @TODO ADD error check
            case Consts.DRILL_DOWN_CART_FROM_SERIES:
                searchService = Consts.DRILL_DOWN_WITH_SERIES;
                break;

            case Consts.DICOM_TAGS:
                searchService = Consts.DICOM_TAGS + '?' + query;
                break;

            case Consts.DICOM_TAGS_BY_IMAGE:
                searchService = Consts.DICOM_TAGS_BY_IMAGE + '?' + query;
                break;


            case Consts.TEXT_SEARCH:
                searchService = Consts.TEXT_SEARCH;
                this.log(this.historyLogService.doLog(Consts.TEXT_SEARCH_LOG_TEXT, this.currentUser, query));

                break;

            case Consts.SEARCH_CRITERIA_VALUES:
                searchService = Consts.SEARCH_CRITERIA_VALUES;
                break;

            case Consts.CREATE_SHARED_LIST:
                searchService = Consts.CREATE_SHARED_LIST;
                break;

            case Consts.DELETE_SHARED_LIST:
                searchService = Consts.DELETE_SHARED_LIST;
                break;

            case Consts.GET_SHARED_LIST:
                searchService = Consts.GET_SHARED_LIST;
                break;

            case Consts.LOG_ENTRY:
                searchService = Consts.LOG_ENTRY;
                break;

            case Consts.GET_HOST_NAME:
                searchService = Consts.GET_HOST_NAME;
                break
        }

        // Run the query
        this.doPost(searchService, query).subscribe(
            // Good results, emit the search results.
            (res) => {
                // id and selected are just passed along from the 'doSearch' parameters.
                this.emitPostResults(searchType, res, id, selected);
            },

            // An error
            (err) => {

                // What kind of error?
                switch (err.status) {

                    // Bad authorization - could be a bad Access token
                    case 401:
                        // console.warn( 'Error ' + err.statusText + '[' + err.status + '], will try to get a new Access token for: ' + this.currentUser );

                        // Try getting a new Access token
                        this.getToken().subscribe(
                            (res0) => {
                                this.setToken(res0);


                                // We have a new token, try the search one more time.
                                this.doPost(searchService, query).subscribe(
                                    // The second attempt to search (with a new Access token) has succeeded,  emit the search results.
                                    (res1) => {
                                        this.emitPostResults(searchType, res1, id, selected);
                                    },

                                    // Our second attempt with a new Access token has failed, emit the error.
                                    (err1) => {
                                        switch (err1.status) {
                                            case 401:
                                                console.error('Attempt with new Access token: ' + err1.statusText + '[' + err1.status + ']');
                                                break;

                                            default:
                                                console.error('ERROR: ' + err1.statusText + '[' + err1.status + '] ' + err1.message);
                                                break;
                                        }
                                        this.emitPostError(searchType, err1, id);
                                    }
                                );

                            },

                            // We tried and failed to get a new Access token, emit the error.
                            (err1) => {
                                console.error('Failed to get a new Access token: ' + err1.statusText + '[' + err1.status + ']');
                                this.emitPostError(searchType, err1, id);
                                this.gotToken();

                            }
                        );

                        break;
                    // End of case 401
                    // An error other than 401
                    default:

                        this.emitPostError(searchType, err, id);
                        break;
                }
            }
        );
    }


    /**
     *
     * @param queryType  Consts.SIMPLE_SEARCH, Consts.DRILL_DOWN, or Consts.TEXT_SEARCH
     * @param query The query in the format that can be passed on to the Rest service.
     * @param accessToken
     */
    doPost(queryType, query, accessToken ?) {
        if (accessToken === undefined) {
            accessToken = this.accessToken;
        }

        if (Properties.DEBUG_CURL) {
            let curl = 'curl -H \'Authorization:Bearer  ' + this.showToken() + '\' -k \'' + Properties.API_SERVER_URL + '/nbia-api/services/' + queryType + '\' -d \'' + query + '\'';
            console.log('01 doPost: ', curl);
        }

        let simpleSearchUrl = Properties.API_SERVER_URL + '/nbia-api/services/' + queryType;


        let headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + accessToken
        });

        let options;

        // These are returned as text NOT JSON.
        if ((queryType === Consts.CREATE_SHARED_LIST) ||
            (queryType === Consts.DELETE_SHARED_LIST) ||
            (queryType === Consts.GET_HOST_NAME) ||
            (queryType === Consts.DICOM_TAGS_BY_IMAGE) ||
            (queryType === Consts.API_MANIFEST_FROM_SEARCH_RESULTS) ||
            (queryType === Consts.API_MANIFEST_RESTRICTIONS_FROM_SEARCH_RESULTS) ||
            (queryType === Consts.API_MANIFEST_FROM_TEXT_SEARCH_RESULTS) ||
            (queryType === Consts.API_MANIFEST_RESTRICTIONS_FROM_TEXT_SEARCH_RESULTS) ||
            (queryType === Consts.LOG_ENTRY)) {
            options = {
                headers: headers,
                responseType: 'text' as 'text'
            };
        } else {
            options = {
                headers: headers
            };
        }

        /*
                console.log( 'doPost simpleSearchUrl: ', simpleSearchUrl );
                console.log( 'doPost query: ', query );
                console.log( 'doPost options: ', options );
        */

        return this.httpClient.post(simpleSearchUrl, query, options).pipe(timeout(Properties.HTTP_TIMEOUT));
    }


    /**
     *
     * @param queryType
     * @param res
     */
    emitGetResults(queryType, res, id ?) {
        if (queryType === 'getCollectionValuesAndCounts') {
            this.getCollectionValuesAndCountsEmitter.emit(res);
        } else if (queryType === Consts.GET_HOST_NAME) {
            this.getHostNameEmitter.emit(res);
        } else if (queryType === 'getModalityValuesAndCounts') {
            this.getModalityValuesAndCountsEmitter.emit(res);
        } else if (queryType === 'getBodyPartValuesAndCounts') {
            this.getBodyPartValuesAndCountsEmitter.emit(res);
        } else if (queryType === 'getSpeciesValuesAndCounts') {
            this.getSpeciesValuesAndCountsEmitter.emit(res);
        } else if (queryType === Consts.GET_SPECIES_TAX) {
            this.speciesTax = res;
            this.getSpeciesTaxEmitter.emit(res);
        } else if (queryType === 'getEventTypes') {
            this.getEventTypesEmitter.emit(res);
        } else if (queryType === Consts.GET_MIN_MAX_TIME_POINTS) {
            this.getMinMaxTimepointsEmitter.emit(res);
        } else if (queryType === 'getManufacturerTree') {
            this.getManufacturerTreeEmitter.emit(res);
        } else if (queryType === Consts.DICOM_TAGS) {
            this.getDicomTagsEmitter.emit({'id': id, 'res': res});
        } else if (queryType === Consts.DICOM_TAGS_BY_IMAGE) {
            this.getDicomTagsByImageEmitter.emit({'id': id, 'res': res});
        } else if (queryType === Consts.COLLECTION_DESCRIPTIONS) {
            this.collectionDescriptionsResultsEmitter.emit(res);
        }

    }


    emitGetError(queryType, err, id ?) {
        if (queryType === 'getCollectionValuesAndCounts') {
            this.getCollectionValuesAndCountsErrorEmitter.emit(err);
        } else if (queryType === Consts.GET_HOST_NAME) {
            this.getHostNameErrorEmitter.emit(err);
        } else if (queryType === 'getModalityValuesAndCounts') {
            this.getModalityValuesAndCountsErrorEmitter.emit(err);
        } else if (queryType === 'getBodyPartValuesAndCounts') {
            this.getBodyPartValuesAndCountsErrorEmitter.emit(err);
        } else if (queryType === 'getSpeciesValuesAndCounts') {
            this.getSpeciesValuesAndCountsErrorEmitter.emit(err);
        } else if (queryType === Consts.GET_SPECIES_TAX) {
            this.getSpeciesTaxErrorEmitter.emit(err);
        } else if (queryType === 'getEventTypes') {
            this.getEventTypesErrorEmitter.emit(err);
        } else if (queryType === 'getManufacturerTree') {
            this.getManufacturerTreeErrorEmitter.emit(err);
        } else if (queryType.replace(/\?.*/g, '') === Consts.DICOM_TAGS) {
            this.getDicomTagsErrorEmitter.emit({err, id});
        } else if (queryType.replace(/\?.*/g, '') === Consts.DICOM_TAGS_BY_IMAGE) {
            this.getDicomTagsByImageErrorEmitter.emit({err, id});
        } else if (queryType === Consts.COLLECTION_DESCRIPTIONS) {
            this.collectionDescriptionsErrorEmitter.emit(err);
        }
    }


    /**
     *
     * @param queryType
     * @param query
     * @param accessToken
     */
    async dataGet(queryType, query, accessToken ?) {

        while (!Properties.CONFIG_COMPLETE) {
            await this.commonService.sleep(Consts.waitTime);
        }


        let queryTypeOrig = queryType;

        if ((!this.utilService.isNullOrUndefined(query)) && (query.length > 0)) {
            queryType = queryType + '?' + query;
        }
        let counter = 0; // If something goes wrong, we don't want to be an endless loop
        // If something else is waiting for an access token, wait here
        while (this.gettingAccessToken > 0 && counter < 50) {
            counter++;
            await this.commonService.sleep(100);
        }

        this.doGet(queryType, accessToken).subscribe(
            // Good results, return the search results.
            (res) => {
                if ((!this.utilService.isNullOrUndefined(query)) && (query.length > 0)) {
                    this.emitGetResults(queryTypeOrig, res, query.replace('SeriesUID=', ''));
                } else {
                    this.emitGetResults(queryType, res);
                }
            },

            // An error
            (err) => {

                // What kind of error?
                switch (err.status) {

                    // Bad authorization - could be a bad Access token
                    case 401:

                        // If the user is not guest and the password field is empty - Switch to default (guest) user.
                        if (!this.persistenceService.get(this.persistenceService.Field.IS_GUEST) && this.utilService.isEmpty(this.getCurrentPassword())) {
                            /*
                                console.log('We can\'t reuse queryType: [' + queryType + ']' );
                                console.log('We can\'t reuse query: [' + query + ']' );
                                console.log('We can\'t reuse accessToken: [' + accessToken + ']' );
                            */

                            this.setCurrentUser(Properties.DEFAULT_USER);
                            this.setCurrentPassword(Properties.DEFAULT_PASSWORD);
                            // this.loadingDisplayService.setLoadingOff();
                        }

                        // There is no need to tell the users this.
                        // console.error( 'Error [' + queryType + ']  ' + err.statusText + '[' + err.status +
                        //    '], will try to get a new Access token for: ' + this.currentUser + '  gettingAccessToken: ', this.gettingAccessToken );

                        // Try getting a new Access token
                        this.getToken().subscribe(
                            (res0) => {
                                this.setToken(res0);
                                accessToken = res0['access_token'];

                                // We have a new token, try the query one more time.
                                this.doGet(queryType, accessToken).subscribe(
                                    // The second attempt to search (with a new Access token) has succeeded,  emit the search results.
                                    (res1) => {
                                        if ((!this.utilService.isNullOrUndefined(query)) && (query.length > 0)) {
                                            this.emitGetResults(queryTypeOrig, res1, query.replace('SeriesUID=', ''));
                                        } else {
                                            this.emitGetResults(queryType, res1);
                                        }

                                    },

                                    // Our second attempt with a new Access token has failed, emit the error.
                                    (err1) => {
                                        switch (err1.status) {
                                            case 401:
                                                console.error('Attempt with new Access token: ' + err1.statusText + '[' + err1.status + ']');
                                                break;

                                            default:
                                                console.error('ERROR: ' + err1.statusText + '[' + err1.status + '] ' + err1.message);
                                                break;
                                        }
                                        this.emitGetError(queryType, err1);
                                    }
                                );
                            },

                            // We tried and failed to get a new Access token, emit the error.
                            (err1) => {
                                console.error('Failed to get a new Access token: ' + err1.statusText + '[' + err1.status + ']');
                                this.emitGetError(queryType, err1);
                                this.gotToken();
                            }
                        );

                        break;
                    // End of case 401

                    default:
                        // console.error( 'nbia-api/services/' + queryType + ' Error: ' + err.statusText + '[' + err.status + '] ' + err.message );
                        console.error('nbia-api/services/' + queryType + ' Error: ' + err.statusText + '[' + err.status + '] ');
                        this.emitGetError(queryType, err);
                        break;
                }
            }
        );
        // this.doGet( queryType, accessToken );

    }


    doGet(queryType, accessToken) {
        let getUrl = Properties.API_SERVER_URL + '/nbia-api/services/' + queryType;

        if (Properties.DEBUG_CURL) {
            let curl = 'curl -H \'Authorization:Bearer  ' + this.showToken() + '\' -k \'' + getUrl + '\'';
            console.log('doGet: ' + curl);
        }

        if (this.utilService.isNullOrUndefined(accessToken)) {
            accessToken = this.accessToken;
        }

        let headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + accessToken
        });

        let options = {
            headers: headers,
            method: 'get',
        };

        let results;
        try {
            results = this.httpClient.get(getUrl, options).pipe(timeout(Properties.HTTP_TIMEOUT));
        } catch (e) {
            // TODO react to error.
            console.error('doGet Exception: ' + e);
        }

        return results;
    }

    doGetNoToken(queryType) {
        let getUrl = Properties.API_SERVER_URL + '/nbia-api/services/' + queryType;

        if (Properties.DEBUG_CURL) {
            let curl = 'curl  -k \'' + getUrl + '\'';
            console.log('doGet: ' + curl);
        }

        let headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        let options = {
            headers: headers,
            method: 'get',
            responseType: 'text' as 'text'
        };

        let results;
        try {
            results = this.httpClient.get(getUrl, options).pipe(timeout(Properties.HTTP_TIMEOUT));
        } catch (e) {
            // TODO react to error.
            console.error('doGetNoToken Exception: ' + e);
        }

        return results;
    }


    downloadSeriesList(seriesList) {
        let query = seriesList + '&password=' + this.currentApiPassword + '&includeAnnotation=true';
        let downloadManifestUrl = this.commonService.buildPath(Properties.API_SERVER_URL, Consts.API_MANIFEST_URL);

        if (Properties.DEBUG_CURL) {
            let curl = ' curl -H \'Authorization:Bearer  ' + this.showToken() + '\' -k \'' + Properties.API_SERVER_URL + '/' + Consts.API_MANIFEST_URL + '\' -d \'' + query + '\'';
            console.log('03 doPost: ', curl);
        }


        let headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + this.accessToken
        });

        let options = {
            headers: headers,
            responseType: 'text' as 'text'
        };

        return this.httpClient.post(downloadManifestUrl, query, options).pipe(timeout(Properties.HTTP_TIMEOUT));
    }

    setImageModalityAllOrAny(a) {
        this.imageModalityAllOrAnyLabels = a;
    }

    getImageModalityAllOrAny() {
        return this.imageModalityAllOrAnyLabels;
    }

    getCollectionLicenses() {
        this.doGet(Consts.GET_COLLECTION_LICENSES, this.showToken()).subscribe(
            (collectionLicensesData) => {
                this.collectionLicenses = collectionLicensesData;
                // Emit here
                this.collectionLicensesResultsEmitter.emit(this.collectionLicenses);
            },
            collectionLicensesError => {
                this.collectionDescriptionsErrorEmitter.emit(collectionLicensesError);
            });
    }


    deleteToken() {
        this.persistenceService.deleteTokens();
    }

    /**
     *
     * @returns {Observable<any>}
     */
    getToken(): Observable<any> {
        let token = this.getAccessToken(this.currentUser, this.currentApiPassword, Properties.DEFAULT_SECRET);
        return token;
    }

    /**
     * Tell any components waiting in dataGet for that first initial token retrieved in nbia-client that we have the token.
     */
    gotToken() {
        this.gettingAccessToken = 0;
    }

    /**
     * Requests an Access token from the API server.
     * @param user
     * @param password
     * @param secret
     * @returns {Observable<R>}
     */
    getAccessToken(user, password, secret): Observable<any> {
        // Guest user
        if( user === undefined){
            user = Properties.DEFAULT_USER;
            password = Properties.DEFAULT_PASSWORD;
        }
        let post_url = Properties.API_SERVER_URL + '/' + Consts.API_ACCESS_TOKEN_URL;
        let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

        console.log('TESTING user: ', user );
        let data = 'username=' + user + '&password=' + password + '&client_id=' + Properties.DEFAULT_CLIENT_ID + '&client_secret=' + secret + '&grant_type=password';

        if (Properties.DEBUG_CURL) {
            let curl = 'curl  -v -d  \'' + data + '\' ' + ' -X POST -k \'' + post_url + '\'';
            console.log('getAccessToken: ' + curl);
        }

        let options =
            {
                headers: headers,
                method: 'post'
            };
        return this.httpClient.post(post_url, data, options).pipe(timeout(Properties.HTTP_TIMEOUT));
    }


    logOut() {
        // let getUrl = Properties.API_SERVER_URL + '/' + Consts.API_LOGOUT_URL;
        let postUrl = Properties.KEYCLOAK_LOGOUT_URL
        if (Properties.DEBUG_CURL) {
            let curl = 'curl -H \'Authorization:Bearer  ' + this.showToken() + '\' -k \'' + postUrl + '\'';
            console.log('doPost: ' + curl);
        }
        let headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + this.accessToken
        });

        let data = `refresh_token=${this.refreshToken}&token=${this.accessToken}&client_id=${Properties.DEFAULT_CLIENT_ID}`;

        let options =
            {
                headers: headers,
                method: 'post',
                responseType: 'text' as 'text'
            };

        return this.httpClient.post(postUrl, data, options).pipe(timeout(Properties.HTTP_TIMEOUT));
    }

    /**
     *
     * Needs to emit two objects
     *
     */
    getCriteriaCounts2() {
        if (this.utilService.isNullOrUndefined(this.simpleSearchQueryHold) || this.simpleSearchQueryHold.length < 1) {
            return;
        }
        let query = this.simpleSearchQueryHold;

        // Add 'At least X studies'
        let minStudies = this.commonService.getMinimumMatchedStudiesValue();
        if (+minStudies > 1) {
            // Get the current parameter number
            let parameterNumber = query.replace(/.*value/, '');
            parameterNumber = parameterNumber.replace(/=.*/, '');
            parameterNumber++;
            minStudies--;
            query += '&criteriaType' + parameterNumber + '=MinNumberOfStudiesCriteria&value' + parameterNumber + '=' + minStudies;
        }

        this.doSearch(Consts.SEARCH_CRITERIA_VALUES, query);
    }


    // @TODO we can probably get rid of this and Properties.PAGED_SEARCH because we will always use Properties.PAGED_SEARCH
    getCriteriaCounts() {
        if (Properties.PAGED_SEARCH) {
            return this.getCriteriaCountsPaged();
        }

        if (
            (this.utilService.isNullOrUndefined(this.simpleSearchQueryHold)) ||
            (this.simpleSearchQueryHold.length < 1) ||
            (this.utilService.isNullOrUndefined(this.currentSearchResults))
        ) {
            return;
        }

        this.criteriaCountsImageModality = {};
        this.criteriaCountsAnatomicalSite = {};
        this.criteriaCountsCollection = {};
        this.criteriaCountsSpecies = {};

        for (let data of this.currentSearchResults) {
            for (let modality of data.modalities) {
                if (this.utilService.isNullOrUndefined(this.criteriaCountsImageModality[modality])) {
                    this.criteriaCountsImageModality[modality] = 0;
                }
                this.criteriaCountsImageModality[modality]++;
            }

            for (let sp of data.species) {
                if (this.utilService.isNullOrUndefined(this.criteriaCountsSpecies[sp])) {
                    this.criteriaCountsSpecies[sp] = 0;
                }
                this.criteriaCountsSpecies[sp]++;
            }

            for (let anatomicalSite of data.bodyParts) {
                if (this.utilService.isNullOrUndefined(this.criteriaCountsAnatomicalSite [anatomicalSite])) {
                    this.criteriaCountsAnatomicalSite [anatomicalSite] = 0;
                }
                this.criteriaCountsAnatomicalSite [anatomicalSite]++;
            }

            if (this.utilService.isNullOrUndefined(this.criteriaCountsCollection[data.project])) {
                this.criteriaCountsCollection[data.project] = 0;
            }
            this.criteriaCountsCollection[data.project]++;

        }

        let resObj = [];
        // Add modality
        let modalityObj = {'criteria': 'Image Modality', 'values': []};
        Object.keys(this.criteriaCountsImageModality).forEach(
            (key) => {
                modalityObj.values.push(
                    {
                        'criteria': key,
                        'count': this.criteriaCountsImageModality [key]
                    }
                );
            }
        );

        let anatomicalSiteObj = {'criteria': 'Anatomical Site', 'values': []};
        Object.keys(this.criteriaCountsAnatomicalSite).forEach(
            (key) => {
                anatomicalSiteObj.values.push(
                    {
                        'criteria': key,
                        'count': this.criteriaCountsAnatomicalSite [key]
                    }
                );
            }
        );

        let speciesObj = {'criteria': 'Species', 'values': []};
        Object.keys(this.criteriaCountsSpecies).forEach(
            (key) => {
                speciesObj.values.push(
                    {
                        'criteria': key,
                        'count': this.criteriaCountsSpecies [key]
                    }
                );
            }
        );

        let collectionObj = {'criteria': 'Collections', 'values': []};
        Object.keys(this.criteriaCountsCollection).forEach(
            (key) => {
                collectionObj.values.push(
                    {
                        'criteria': key,
                        'count': this.criteriaCountsCollection [key]
                    }
                );
            }
        );

        resObj.push(collectionObj);
        resObj.push(anatomicalSiteObj);
        resObj.push(modalityObj);
        resObj.push(speciesObj);

        this.criteriaCountUpdateEmitter.emit({'res': resObj});
    }

    /**
     * This version is for "One page at a time search"
     */
    getCriteriaCountsPaged() {

        if (
            (this.utilService.isNullOrUndefined(this.simpleSearchQueryHold)) ||
            (this.simpleSearchQueryHold.length < 1) ||
            (this.utilService.isNullOrUndefined(this.currentSearchResults))
        ) {
            return;
        }
        let resObj = [];
        let collectionObjPaged = {'criteria': 'Collections', 'values': []};
        // CHECKME  This "if" is a work around for a bug on the server side which sometimes gives "null" as the counts
        if (this.currentSearchResultsData['collections'] !== 'null') {
            for (let collection of this.currentSearchResultsData['collections']) {

                collectionObjPaged.values.push(
                    {
                        'criteria': collection.value,
                        'count': collection.count
                    }
                );
            }
        }

        let modalityObjPaged = {'criteria': 'Image Modality', 'values': []};
        // CHECKME  This "if" is a work around for a bug on the server side which sometimes gives "null" as the counts
        if (this.currentSearchResultsData['modalities'] !== 'null') {
            for (let modality of this.currentSearchResultsData['modalities']) {
                modalityObjPaged.values.push(
                    {
                        'criteria': modality.value,
                        'count': modality.count
                    }
                );
            }
        }
        let anatomicalSiteObjPaged = {'criteria': 'Anatomical Site', 'values': []};
        // CHECKME  This "if" is a work around for a bug on the server side which sometimes gives "null" as the counts
        if (this.currentSearchResultsData['bodyParts'] !== 'null') {
            for (let bodyPart of this.currentSearchResultsData['bodyParts']) {
                anatomicalSiteObjPaged.values.push(
                    {
                        'criteria': bodyPart.value,
                        'count': bodyPart.count
                    }
                );
            }
        }
        let speciesObjPaged = {'criteria': 'Species', 'values': []};
        // CHECKME  This "if" is a work around for a bug on the server side which sometimes gives "null" as the counts
        if ((this.currentSearchResultsData['species'] !== 'null') && (this.currentSearchResultsData['species'] !== null)) {
            for (let species of this.currentSearchResultsData['species']) {
                speciesObjPaged.values.push(
                    {
                        'criteria': species.value,
                        'count': species.count
                    }
                );
            }
        }

        resObj.push(collectionObjPaged);
        resObj.push(anatomicalSiteObjPaged);
        resObj.push(modalityObjPaged);
        resObj.push(speciesObjPaged);

        this.criteriaCountUpdateEmitter.emit({'res': resObj});
    }


    refreshCriteriaCounts() {
        this.criteriaCountUpdateEmitter.emit({});
    }


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
