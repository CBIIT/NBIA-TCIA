import {Injectable} from '@angular/core';
import {PersistenceService} from '@app/common/services/persistence.service';
import {UtilService} from '@app/common/services/util.service';

/**
 * This Service is used to do all of the sorting for the Cart page.
 */

@Injectable({
  providedIn: 'root'
})
export class CartSortService {

    /**
     * Each element is one column, a value other than State.NONE indicates that this is the column to sort by.
     * @type {Array}
     */
    cartSortState = [];

    /**
     * List of columns indicating which is sorting key column, and in which direction to sort.
     */
    cartSortColumns;

    /**
     * Sort stats
     * @type {Readonly<{NONE: number; UP: number; DOWN: number}>}
     */
    State = Object.freeze({
        NONE: 0,
        UP: 1,
        DOWN: 2
    });

    constructor(private persistenceService: PersistenceService, private utilService: UtilService) {
    }


    /**
     * Called by CartComponent.ngOnInit()
     *
     * @param columns  List of columns indicating which is sorting key column, and which direction to sort.
     */
    initSortState(columns) {

        this.cartSortColumns = columns;
        // Check for a saved value
        try {
            this.cartSortState = JSON.parse(this.persistenceService.get(this.persistenceService.Field.CART_SORT_STATE));
        } catch (e) {
        }

        // If the cartSortState array is empty, initialize it.
        if ((this.utilService.isNullOrUndefined(this.cartSortState)) || (this.cartSortState.length < 1)) {

            // Clear the sort states
            for (let f = 0; f < this.cartSortColumns.length; f++) {
                this.cartSortState[f] = 0;
            }

            // Set subjectId as default
            this.cartSortState[2] = this.State.UP;

            this.persistenceService.put(this.persistenceService.Field.CART_SORT_STATE, JSON.stringify(this.cartSortState));

        }
    }


    /**
     * Gets the sorting state for an individual column, up, down, or not the sorting column.
     *
     * @param field
     * @returns {any}
     */
    getSortState(field) {
        return this.cartSortState[field];
    }

    /**
     * So far this is just used for testing.
     * @returns {any[]}
     */
    getAllSortState() {
        return this.cartSortState;
    }


    /**
     * The sort state will be: none, up, or down
     *
     * When this method is called the sort changes to the next sort state.
     * If it is none or down it will change to up
     * If it is up it will change to down
     *
     * @param i
     */
    updateCartSortState(i) {
        // Clear the other sort states
        for (let f = 0; f < this.cartSortColumns.length; f++) {
            if (f !== i) {
                this.cartSortState[f] = 0;
            }
        }

        if (this.cartSortState[i] === this.State.NONE) {
            this.cartSortState[i] = this.State.UP;
        } else if (this.cartSortState[i] === this.State.UP) {
            this.cartSortState[i] = this.State.DOWN;
        } else if (this.cartSortState[i] === this.State.DOWN) {
            this.cartSortState[i] = this.State.UP;
        }

        this.persistenceService.put(this.persistenceService.Field.CART_SORT_STATE, JSON.stringify(this.cartSortState));
    }


    /**
     * Will know sort direction from searchResultSortState[]
     *
     * @param cartList
     */
    doSort(cartList) {
        this.cleanUpList(cartList);
        let field = this.getCurrentSortField();
        // If there is no cart to sort, just return
        if ((this.utilService.isNullOrUndefined(cartList)) || (cartList.length < 1)) {
            return;
        }
        switch (field) {
            case 1:
                this.collectionSort(cartList, this.cartSortState[field]);
                break;
            case 2:
                // Sort by patientId
                this.subjectIdSort(cartList, this.cartSortState[field]);
                break;

            case 3:
                // Sort by study Uid
                this.studyUidSort(cartList, this.cartSortState[field]);
                break;

            case 4:
                // Sort by studyDate
                this.studyDateSort(cartList, this.cartSortState[field]);
                break;

            case 5:
                // Sort by studyDescription
                this.studyDescriptionSort(cartList, this.cartSortState[field]);
                break;

            case 6:
                // Sort by seriesId
                this.seriesIdSort(cartList, this.cartSortState[field]);
                break;

            case 7:
                // Sort by seriesDescription
                this.seriesDescriptionSort(cartList, this.cartSortState[field]);
                break;

            case 8:
                // Sort by seriesNumberOfImages
                this.seriesNumberOfImagesSort(cartList, this.cartSortState[field]);
                break;

            case 9:
                // Sort by seriesFileSize
                this.seriesFileSizeSort(cartList, this.cartSortState[field]);
                break;
            /*

                        case 10:
                            // Sort by file size seriesFileSize
                            this.seriesAnnotationsSizeSort( cartList, this.cartSortState[field] );
                            break;
            */
        }
    }

    /**
     * Returns the index in this.cartSortState[] of the current sort column
     * @returns {number}
     */
    getCurrentSortField() {
        for (let f = 0; f < this.cartSortState.length; f++) {
            if (this.cartSortState[f] !== this.State.NONE) {
                return f;
            }
        }
    }


    /**
     *
     * @param cartList
     * @param order 1=up  2=down  0=do nothing - we should never get 0
     */
    subjectIdSort(cartList, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;
        cartList.sort((row1, row2) => row1.patientId.localeCompare(row2.patientId) * multiplier);
    }

    /**
     *
     * @param cartList
     * @param order 1=up  2=down  0=do nothing - we should never get 0
     */
    studyUidSort(cartList, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;
        cartList.sort((row1, row2) => row1.studyId.localeCompare(row2.studyId) * multiplier);
    }

    /**
     * Dates are displayed as readable text, but stored as numbers, so a numeric sort works here.
     *
     * @param cartList
     * @param order 1=up  2=down  0=do nothing - we should never get 0
     * YYY-MM-DD
     */
    studyDateSort(cartList, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;
        cartList.sort((row1, row2) => row1.studyDate.localeCompare(row2.studyDate) * multiplier);
    }

    /**
     *
     * @param cartList
     * @param order  1=up  2=down  0=do nothing - we should never get 0
     */
    studyDescriptionSort(cartList, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;
        cartList.sort((row1, row2) => row1.studyDescription.localeCompare(row2.studyDescription) * multiplier);
    }

    /**
     *
     * @param cartList
     * @param order  1=up  2=down  0=do nothing - we should never get 0
     */
    collectionSort(cartList, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;
        cartList.sort((row1, row2) => row1.project.localeCompare(row2.project) * multiplier);
    }

    /**
     *
     * @param cartList
     * @param order  1=up  2=down  0=do nothing - we should never get 0
     */
    seriesIdSort(cartList, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;
        cartList.sort((row1, row2) => row1.seriesId.localeCompare(row2.seriesId) * multiplier);

    }

    /**
     *
     * @param cartList
     * @param order  1=up  2=down  0=do nothing - we should never get 0
     */
    seriesDescriptionSort(cartList, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;
        cartList.sort((row1, row2) => row1.description.localeCompare(row2.description) * multiplier);

    }

    /**
     *
     * @param cartList
     * @param order  1=up  2=down  0=do nothing - we should never get 0
     */
    seriesNumberOfImagesSort(cartList, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;
        cartList.sort((row1, row2) => (row1.numberImages - row2.numberImages) * multiplier);
    }


    /**
     *
     * @param cartList
     * @param order  1=up  2=down  0=do nothing - we should never get 0
     */
    seriesFileSizeSort(cartList, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;
        cartList.sort((row1, row2) => (row1.exactSize - row2.exactSize) * multiplier);
    }

    /**
     *
     * @param cartList
     * @param order  1=up  2=down  0=do nothing - we should never get 0
     */
    seriesAnnotationsSizeSort(cartList, order) {
        let multiplier = (order === this.State.DOWN) ? -1 : 1;
        // cartList.sort( ( row1, row2 ) => (row1.seriesFileSize - (row2.seriesFileSize === 'N/A' ? 0 : row2.seriesFileSize)) * multiplier );
        cartList.sort((row1, row2) => (row1.annotationsSize - row2.annotationsSize) * multiplier);
    }


    /**
     * Set null studyDescription to empty string.
     *
     * @param cartList
     */
    cleanUpList(cartList) {
        for (let row of cartList) {
            if (this.utilService.isNullOrUndefined(row.studyDescription)) {
                row.studyDescription = '';
            }
        }
    }
}
