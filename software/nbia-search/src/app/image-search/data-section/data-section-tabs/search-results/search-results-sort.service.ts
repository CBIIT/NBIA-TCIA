import {Injectable} from '@angular/core';
import {PersistenceService} from '@app/common/services/persistence.service';
import {CartService} from '@app/common/services/cart.service';
import {UtilService} from '@app/common/services/util.service';
import {Properties} from '@assets/properties';

@Injectable()
export class SearchResultsSortService {

    // 0=none  1=up  2=down
    public State = Object.freeze({
        NONE: 0,
        UP: 1,
        DOWN: 2
    });

    // Each element is one column, a value other than State.NONE (there will always only be one non-NONE) indicates that this is the column to sort by.
    private searchResultSortState = [];

    private searchResultsSortColumns;


    constructor(private persistenceService: PersistenceService, private cartService: CartService,
                private utilService: UtilService) {

    }

    initSortState(columns) {
        this.searchResultsSortColumns = columns;

        // Check for a saved values.
        try {
            this.searchResultSortState = JSON.parse(this.persistenceService.get(this.persistenceService.Field.SEARCH_RESULTS_SORT_STATE));
        } catch (e) {
        }

        // If the searchResultSortState array is empty, initialize it.
        if ((this.utilService.isNullOrUndefined(this.searchResultSortState)) || (this.searchResultSortState.length < 1)) {
            // Clear the sort states
            for (let f = 0; f < this.searchResultsSortColumns.length; f++) {
                this.searchResultSortState[f] = 0;
            }

            // Set subjectId as default
            // FIXME this should be a constant
            this.searchResultSortState[2] = 1;

            this.persistenceService.put(this.persistenceService.Field.SEARCH_RESULTS_SORT_STATE, JSON.stringify(this.searchResultSortState));
        }
    }


    /**
     * The sort state will be: 0=none  1=up  2=down
     *
     * When this method is called the sort changes to the next sort state.
     * If it is 0 (none) or 2 (down) it will change to 1 (up)
     * If it is 1 (up) it will change to 2 (down)
     *
     * @param i
     */
    updateSearchResultsSortState(i) {
        // Clear the other sort states
        for (let f = 0; f < this.searchResultsSortColumns.length; f++) {
            if (f !== i) {
                this.searchResultSortState[f] = 0;
            }
        }

        if (this.searchResultSortState[i] === 0) {
            this.searchResultSortState[i] = 1;
        } else if (this.searchResultSortState[i] === 1) {
            this.searchResultSortState[i] = 2;
        } else if (this.searchResultSortState[i] === 2) {
            this.searchResultSortState[i] = 1;
        }

        this.persistenceService.put(this.persistenceService.Field.SEARCH_RESULTS_SORT_STATE, JSON.stringify(this.searchResultSortState));
    }

    /**
     * Will know sort direction from searchResultSortState[]
     *
     * @param searchResults
     * @TODO this should all be done on the server side now - Clean this up
     */
    doSort(searchResults) {
        return; // @FIXME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        let field = this.getCurrentSortField();

        // If there are no search results to sort, just return
        if ((this.utilService.isNullOrUndefined(searchResults)) || (searchResults.length < 1)) {
            return;
        }

        // FIXME these should be constants
        switch (field) {
            case 0:
                // First sort by Subject ID
                this.subjectIdSort(searchResults, this.State.UP);
                this.cartSort(searchResults, this.searchResultSortState[field]);
                break;

            case 1:
                this.collectionSort(searchResults, this.searchResultSortState[field]);
                break;

            case 2:
                this.subjectIdSort(searchResults, this.searchResultSortState[field]);
                break;
            case 3:
                this.textSearchHitSort(searchResults, this.searchResultSortState[field]);
                break;

            case 4:
                this.matchedStudiesSort(searchResults, this.searchResultSortState[field]);
                break;

            case 5:
                this.totalStudiesSort(searchResults, this.searchResultSortState[field]);
                break;

            case 6:
                this.matchedSeriesSort(searchResults, this.searchResultSortState[field]);
                break;

            case 7:
                this.totalSeriesSort(searchResults, this.searchResultSortState[field]);
                break;

            case 8:
                this.diskSpaceSort(searchResults, this.searchResultSortState[field]);
                break;

            // Image Count
            case 9:
                this.imageCountSort(searchResults, this.searchResultSortState[field]);
                break;

        }
    }


    getCurrentSortField() {
        for (let f = 0; f < this.searchResultSortState.length; f++) {
            if (this.searchResultSortState[f] !== this.State.NONE) {
                return f;
            }
        }
        // Default  FIXME these need to be constants
        return 2; // Subject ID
    }

    getSortState(field) {
        return this.searchResultSortState[field];
    }


    /**
     * Using the subjectId field of the row, returns its "rank"
     * <ul>
     *     <li>2 If selected, or is a parent and all children are selected.</li>
     *     <li>1 If a parent and some, but not all children are selected.</li>
     *     <li>0 If not selected, or if a parent, no children selected.</li>
     * </ul>
     *
     * @param row
     * @returns {number}
     */
    cartRank(row) {
        let selectedChildCount = this.cartService.cartGetIndexByParent(row.subjectId).length;
        let childCount = row.totalNumberOfSeries;
        if (selectedChildCount === childCount) {
            return 2;
        } else if (selectedChildCount > 0) {
            return 1;
        } else {
            return 0;
        }
    }


    /**
     * Sort by Subject ID
     *
     * @param resultsSet
     * @param order 1=up  2=down  0=do nothing - we should never get 0
     * @returns {any}
     */
    subjectIdSort(resultsSet, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;
        let bySubjectId = (row1, row2) => row1.subjectId.localeCompare(row2.subjectId) * multiplier;
        resultsSet.sort(bySubjectId);
    }

    textSearchHitSort(resultsSet, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;

        // Sort by value, not field name
        let byTextSearchHit = ((row1, row2): number => {
            let field1 = row1.hit.replace(/:.*/, '').replace(/<\/?em>/g, '');
            let field2 = row2.hit.replace(/:.*/, '').replace(/<\/?em>/g, '');

            let value1 = row1.hit.replace(/^[^:]*: */, '').replace(/<\/?strong>/g, '');
            let value2 = row2.hit.replace(/^[^:]*: */, '').replace(/<\/?strong>/g, '');

            // Compare values first
            if (value2.localeCompare(value1) !== 0) {
                return value2.localeCompare(value1) * multiplier;
            }

            // If the values where the same, check field.
            return field2.localeCompare(field1) * multiplier;

        });
        resultsSet.sort(byTextSearchHit);
    }

    /**
     *
     * @param resultsSet
     * @param order
     */
    matchedStudiesSort(resultsSet, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;
        resultsSet.sort((row1, row2) => (row1.matchedStudies - row2.matchedStudies) * multiplier);
    }


    /**
     *
     * @param resultsSet
     * @param order
     */
    totalStudiesSort(resultsSet, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;
        resultsSet.sort((row1, row2) => (row1.totalNumberOfStudies - row2.totalNumberOfStudies) * multiplier);
    }


    /**
     *
     * @param resultsSet
     * @param order
     */
    matchedSeriesSort(resultsSet, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;
        resultsSet.sort((row1, row2) => (row1.matchedSeries - row2.matchedSeries) * multiplier);
    }


    /**
     *
     * @param resultsSet
     * @param order
     */
    totalSeriesSort(resultsSet, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;
        resultsSet.sort( ( row1, row2 ) => (row1.totalNumberOfSeries - row2.totalNumberOfSeries) * multiplier );
    }


    /**
     *
     * @param resultsSet
     * @param order
     */
    diskSpaceSort(resultsSet, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;
        resultsSet.sort((row1, row2) => (row1.diskSpace - row2.diskSpace) * multiplier);
    }

    /**
     *
     * @param resultsSet
     * @param order
     */
    imageCountSort(resultsSet, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;
        resultsSet.sort((row1, row2) => (row1.imageCount - row2.imageCount) * multiplier);
    }


    /**
     * 'project' in the search results rows is Collection.
     *
     * @param resultsSet
     * @param order
     */
    collectionSort(resultsSet, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;
        let byProject = (row1, row2) => row1.project.localeCompare(row2.project) * multiplier;
        resultsSet.sort(byProject);
    }


    /**
     * THIS IS NOT USED  TODO should probably delet this.
     * Sort by:  is checked, count, alphabetically
     *
     * @param criteriaList All the selectable search criteria.
     * @param selectedList The selected (by check box) criteria.
     * @todo This was put together rather hastily, and is perhaps worthy of another look
     * @returns {any} A sorted criteriaList
     */
    criteriaSort0(criteriaList, selectedList) {
        let results = [];
        let temp;
        let type = '';
        // FIXME  this should go somewhere with other constants
        let types = ['Collection', 'BodyPartExamined', 'Modality'];

        // Detect Criteria type, we need this for alphabetical part of sort.
        for (let f = 0; f < types.length; f++) {
            //  if (!this.utilService.isNullOrUndefined(criteriaList[0][types[f]]))
            {
                type = types[f];
            }
        }

        if (selectedList === null) {

            for (let f1 = 0; f1 < (criteriaList.length - 1); f1++) {
                for (let f2 = f1 + 1; f2 < criteriaList.length; f2++) {

                    // F1 down and F2 up
                    if (+criteriaList[f1]['count'] < +criteriaList[f2]['count']) {
                        temp = criteriaList[f1];
                        criteriaList[f1] = criteriaList[f2];
                        criteriaList[f2] = temp;
                    } else if ((+criteriaList[f1]['count'] === +criteriaList[f2]['count']) && (criteriaList[f1][type] > criteriaList[f2][type])) {
                        temp = criteriaList[f1];
                        criteriaList[f1] = criteriaList[f2];
                        criteriaList[f2] = temp;
                    }
                }
            }
        } else {
            // There are checkboxes
            for (let f1 = 0; f1 < (criteriaList.length - 1); f1++) {

                for (let f2 = f1 + 1; f2 < criteriaList.length; f2++) {
                    // If only one is checked
                    if ((!selectedList[f1]) && (selectedList[f2])) {
                        // Swap
                        temp = criteriaList[f1];
                        criteriaList[f1] = criteriaList[f2];
                        criteriaList[f2] = temp;

                        temp = selectedList[f1];
                        selectedList[f1] = selectedList[f2];
                        selectedList[f2] = temp;
                    }

                    // They are both checked, or both not checked, so use count
                    else if ((selectedList[f1] && selectedList[f2]) || ((!selectedList[f1]) && (!selectedList[f2]))) {
                        if (+criteriaList[f1]['count'] < +criteriaList[f2]['count']) {
                            // Swap
                            temp = criteriaList[f1];
                            criteriaList[f1] = criteriaList[f2];
                            criteriaList[f2] = temp;

                            temp = selectedList[f1];
                            selectedList[f1] = selectedList[f2];
                            selectedList[f2] = temp;
                        }

                        // Count and checked are the same, sort alphabetically
                        else if ((+criteriaList[f1]['count'] === +criteriaList[f2]['count']) && (criteriaList[f1][type] > criteriaList[f2][type])) {
                            // Swap
                            temp = criteriaList[f1];
                            criteriaList[f1] = criteriaList[f2];
                            criteriaList[f2] = temp;

                            temp = selectedList[f1];
                            selectedList[f1] = selectedList[f2];
                            selectedList[f2] = temp;
                        }
                    }
                }
            }
        }
        return criteriaList;
    }


    /**
     * Properties.SORT_COLLECTIONS_BY_COUNT is the default, it is set to true.
     *
     * @param criteriaList
     * @param selectedList
     * @param {boolean} sortByCount
     * @returns {any}
     */
    criteriaSort(criteriaList, selectedList, sortByCount?) {
        if (this.utilService.isNullOrUndefined(sortByCount)) {
            sortByCount = Properties.SORT_COLLECTIONS_BY_COUNT;
        }
        if (sortByCount) {
            return this.criteriaSortByCount(criteriaList, selectedList);
        } else {
            return this.criteriaSortByName(criteriaList, selectedList);
        }
    }

    /**
     * Sort by:  is checked, count, alphabetically
     *
     * @param criteriaList All the selectable search criteria.
     * @param selectedList The selected (by check box) criteria.
     * @todo This was put together rather hastily, and is perhaps worthy of another look
     * @returns {any} A sorted criteriaList
     */
    criteriaSortByCount(criteriaList, selectedList) {
        let temp;

        // If there are no checked criteria in the list
        if (selectedList === null) {
            let byCriteria = (row1, row2) => (row1.count - row2.count);
            criteriaList.sort(byCriteria);

        } else {
            // There are checkboxes
            for (let f1 = 0; f1 < (criteriaList.length - 1); f1++) {
                for (let f2 = f1 + 1; f2 < criteriaList.length; f2++) {

                    // If only one is checked
                    if ((!selectedList[f1]) && (selectedList[f2])) {

                        // Swap
                        temp = criteriaList[f1];
                        criteriaList[f1] = criteriaList[f2];
                        criteriaList[f2] = temp;

                        temp = selectedList[f1];
                        selectedList[f1] = selectedList[f2];
                        selectedList[f2] = temp;
                    }


                    // They are both checked, or both not checked, so use criteria
                    else if ((selectedList[f1] && selectedList[f2]) || ((!selectedList[f1]) && (!selectedList[f2]))) {

                        if (+(criteriaList[f1]['count']) < +(criteriaList[f2]['count'])) {
                            // Swap
                            temp = criteriaList[f1];
                            criteriaList[f1] = criteriaList[f2];
                            criteriaList[f2] = temp;

                            temp = selectedList[f1];
                            selectedList[f1] = selectedList[f2];
                            selectedList[f2] = temp;

                        }
                        if ((+(criteriaList[f1]['count']) === +(criteriaList[f2]['count'])) && (criteriaList[f1]['criteria'].localeCompare(criteriaList[f2]['criteria']) > 0)) {
                            // Swap
                            temp = criteriaList[f1];
                            criteriaList[f1] = criteriaList[f2];
                            criteriaList[f2] = temp;

                            temp = selectedList[f1];
                            selectedList[f1] = selectedList[f2];
                            selectedList[f2] = temp;
                        }
                    }
                }
            }
        }
        return criteriaList;
    }

    /**
     * Sort by:  is checked, alphabetically
     *
     * @param criteriaList All the selectable search criteria.
     * @param selectedList The selected (by check box) criteria.
     * @todo This was put together rather hastily, and is perhaps worthy of another look
     * @returns {any} A sorted criteriaList
     */
    criteriaSortByName(criteriaList, selectedList) {
        let temp;

        // If there are no checked criteria in the list
        if (selectedList === null) {
            let byCriteria = (row1, row2) => row1.criteria.localeCompare(row2.criteria);
            criteriaList.sort(byCriteria);

        } else {
            // There are checkboxes
            for (let f1 = 0; f1 < (criteriaList.length - 1); f1++) {
                for (let f2 = f1 + 1; f2 < criteriaList.length; f2++) {

                    // If only one is checked
                    if ((!selectedList[f1]) && (selectedList[f2])) {

                        // Swap
                        temp = criteriaList[f1];
                        criteriaList[f1] = criteriaList[f2];
                        criteriaList[f2] = temp;

                        temp = selectedList[f1];
                        selectedList[f1] = selectedList[f2];
                        selectedList[f2] = temp;
                    }

                    // They are both checked, or both not checked, so use criteria
                    else if ((selectedList[f1] && selectedList[f2]) || ((!selectedList[f1]) && (!selectedList[f2]))) {

                        if (criteriaList[f1]['criteria'].localeCompare(criteriaList[f2]['criteria']) > 0) {
                            // Swap
                            temp = criteriaList[f1];
                            criteriaList[f1] = criteriaList[f2];
                            criteriaList[f2] = temp;

                            temp = selectedList[f1];
                            selectedList[f1] = selectedList[f2];
                            selectedList[f2] = temp;
                        }
                    }
                }
            }
        }
        return criteriaList;
    }


    /**
     *
     * @param resultsSet
     * @param order
     */
    cartSort(resultsSet, order) {
        let len = resultsSet.length;
        let rank0 = 0;
        let rank1 = 0;

        for (let f0 = 0; f0 < (len - 1); f0++) {
            for (let f1 = (f0 + 1); f1 < len; f1++) {
                rank0 = this.cartRank(resultsSet[f0]);
                rank1 = this.cartRank(resultsSet[f1]);

                if ((order === 1) && (rank0 > rank1)) {
                    this.rowSwap(resultsSet, f0, f1);
                } else if ((order === 2) && (rank0 < rank1)) {
                    this.rowSwap(resultsSet, f0, f1);
                }
            }
        }
    }

    getsearchResultSortState() {
        return this.searchResultSortState;
    }


    rowSwap(resultsSet, f0, f1) {
        let temp = resultsSet[f0];
        resultsSet[f0] = resultsSet[f1];
        resultsSet[f1] = temp;
    }

}
