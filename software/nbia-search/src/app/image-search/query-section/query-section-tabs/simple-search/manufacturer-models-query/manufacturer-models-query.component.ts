import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { ApiServerService } from '@app/image-search/services/api-server.service';
import { UtilService } from '@app/common/services/util.service';
import { Consts } from '@app/consts';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-manufacturer-models-query',
    templateUrl: './manufacturer-models-query.component.html',
    styleUrls: ['../simple-search.component.scss', './manufacturer-models-query.component.scss']
} )
export class ManufacturerModelsQueryComponent implements OnInit, OnDestroy{

    n = 0;
    nodes = [];
    tempNodes = [];

    treeNodes;
    showCriteriaList = true;
    cBox = [];

    completeCriteriaList;
    checkedCount = 0;

    delimiter = '||';

    selectedList = [];

    manufacturerCriteriaForQuery: string[] = [];
    modelCriteriaForQuery: string[] = [];
    softwareVersionCriteriaForQuery: string[] = [];

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private apiServerService: ApiServerService,
                 private utilService: UtilService ) {
    }

    async ngOnInit() {

        let errorFlag = false;
        // Get the full complete criteria list.
        this.apiServerService.getManufacturerTreeEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            ( data ) => {
                this.completeCriteriaList = data;
                this.treeNodes = this.completeCriteriaList;

                // initialize cBox
                let len = this.completeCriteriaList.children.length;
                for( let f = 0; f < len; f++ ){
                    this.cBox[f] = false;
                }
            } );

        // React to errors when getting the full complete criteria list.
        this.apiServerService.getManufacturerTreeErrorEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            ( err ) => {
                errorFlag = true;
                alert( 'error: ' + err );
            } );

        // Used when the Clear button is clicked in the Display Query.
        this.commonService.resetAllSimpleSearchEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            data => {
                this.totalQueryClear();
            }
        );


        // The call to trigger populating this.completeCriteriaList (above)
        this.apiServerService.dataGet( 'getManufacturerTree', '' );
        while( (this.utilService.isNullOrUndefined( this.completeCriteriaList )) && (!errorFlag) ){
            await this.commonService.sleep( Consts.waitTime );
        }

        this.initNodes( this.treeNodes['children'] );

        // Set the tree data, html uses this.nodes, but ut needs to be set from a different set of nodes ( this.tempNodes )
        this.nodes = this.tempNodes;

        // Get persisted showCriteriaList
        this.showCriteriaList = this.commonService.getCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_MANUFACTURER_MODEL );
        if( this.utilService.isNullOrUndefined( this.showCriteriaList ) ){
            this.showCriteriaList = Consts.SHOW_CRITERIA_QUERY_MANUFACTURER_MODEL_DEFAULT;
            this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_MANUFACTURER_MODEL, this.showCriteriaList );
        }


        // Initialize the three possible queries
        this.manufacturerCriteriaForQuery.push( Consts.MANUFACTURER_CRITERIA );
        this.modelCriteriaForQuery.push( Consts.MANUFACTURER_MODEL_CRITERIA );
        this.softwareVersionCriteriaForQuery.push( Consts.MANUFACTURER_SOFTWARE_VERSION_CRITERIA );


    }

    onShowTreeClick( show: boolean ) {
        this.showCriteriaList = show;
        this.commonService.setCriteriaQueryShow( Consts.SHOW_CRITERIA_QUERY_MANUFACTURER_MODEL, this.showCriteriaList );
    }


    initNodes( nodes ) {
        // Get the data name
        let tempNode;

        for( let topNode of nodes ){
            tempNode = {

                'id': this.n++,
                'name': topNode.data.value,
                'longName': topNode.data.value,
                'type': topNode.data.criteria
            };
            // Has children
            if( topNode.children.length > 0 ){
                tempNode['children'] = [];

                for( let child0 of topNode.children ){

                    // New Child node
                    let tempChildNode = {
                        'id': this.n++,
                        'name': child0.data.value,
                        'longName': tempNode.longName + this.delimiter + child0.data.value,
                        'type': child0.data.criteria
                    };


                    if( child0['children'].length > 0 ){
                        tempChildNode['children'] = [];
                        for( let GChild0 of child0['children'] ){
                            // New GChild node
                            let tempGChildNode = {
                                'id': this.n++,
                                'name': GChild0.data.value,
                                'longName': tempChildNode.longName + this.delimiter + GChild0.data.value,
                                'type': GChild0.data.criteria
                            };
                            tempChildNode['children'].push( tempGChildNode );
                        }
                    }

                    // Add the new child node
                    tempNode['children'].push( tempChildNode );
                }
            }

            this.tempNodes.push( tempNode );
        }
    }

    ////////////////////////////////////////////
    initNodes0( nodes ) {
        // Get the data name
        let tempNode;


        for( let topNode of nodes ){
            tempNode = {

                'id': this.n++,
                'name': topNode.data.name,
                'longName': topNode.data.name,
                'type': topNode.data.criteria
            };
            // Has children
            if( topNode.children.length > 0 ){
                tempNode['children'] = [];

                for( let child0 of topNode.children ){

                    // New Child node
                    let tempChildNode = {
                        'id': this.n++,
                        'name': child0.data.name,
                        'longName': tempNode.longName + ':::' + child0.data.name,
                        'type': child0.data.criteria
                    };


                    if( child0['children'].length > 0 ){
                        tempChildNode['children'] = [];
                        for( let GChild0 of child0['children'] ){
                            // New GChild node
                            let tempGChildNode = {
                                'id': this.n++,
                                'name': GChild0.data.name,
                                'longName': tempChildNode.longName + ':::' + GChild0.data.name,
                                'type': GChild0.data.criteria
                            };
                            tempChildNode['children'].push( tempGChildNode );
                        }
                    }

                    // Add the new child node
                    tempNode['children'].push( tempChildNode );
                }
            }

            this.nodes.push( tempNode );
        }
    }

    getNodeById( id, nodes ) {
        for( let topNode of nodes ){
            if( topNode.id === id ){
                return topNode;
            }

            if( (!this.utilService.isNullOrUndefined( topNode.children )) && (topNode.children.length > 0) ){
                let temp = this.getNodeById( id, topNode.children );
                if( !this.utilService.isNullOrUndefined( temp ) ){
                    return temp;
                }
            }
        }
    }


    onCheckBoxClick( e, id, nodeType ) {
        this.cBox[id] = e.target.checked;
        this.checkedCount = 0;
        this.selectedList = [];

        let selectedType = nodeType;
        // Build the query parameter here
        for( let f = 0; f < this.cBox.length; f++ ){
            if( (!this.utilService.isNullOrUndefined( this.cBox[f] )) && (this.cBox[f]) ){
                this.checkedCount++;
                let useNode = this.getNodeById( f, this.nodes );
                this.selectedList.push( useNode );
            }
        }

        this.cleanSelectedList();
        let len1 = this.selectedList.length;

        // We can have none to three different kinds of queries.


        // this.modelCriteriaForQuery.push( Consts.MANUFACTURER_MODEL_CRITERIA );
        this.modelCriteriaForQuery[this.modelCriteriaForQuery.length] = Consts.MANUFACTURER_MODEL_CRITERIA;
        // this.softwareVersionCriteriaForQuery.push( Consts.MANUFACTURER_SOFTWARE_VERSION_CRITERIA );
        this.softwareVersionCriteriaForQuery[this.softwareVersionCriteriaForQuery.length] = Consts.MANUFACTURER_SOFTWARE_VERSION_CRITERIA;

        // manufacture
        this.manufacturerCriteriaForQuery = [];
        // this.manufacturerCriteriaForQuery.push( Consts.MANUFACTURER_CRITERIA );
        this.manufacturerCriteriaForQuery[0] = Consts.MANUFACTURER_CRITERIA;

        for( let f1 = 0; f1 < len1; f1++ ){
            if( this.selectedList[f1].type === Consts.MANUFACTURER ){
                // this.manufacturerCriteriaForQuery.push( this.selectedList[f1].longName );
                this.manufacturerCriteriaForQuery[this.manufacturerCriteriaForQuery.length] = this.selectedList[f1].longName;

            }
        }

        // model
        this.modelCriteriaForQuery = [];
        // this.modelCriteriaForQuery.push( Consts.MANUFACTURER_MODEL_CRITERIA );
        this.modelCriteriaForQuery[0] = Consts.MANUFACTURER_MODEL_CRITERIA;
        for( let f1 = 0; f1 < len1; f1++ ){
            if( this.selectedList[f1].type === Consts.MANUFACTURER_MODEL ){
                // this.modelCriteriaForQuery.push( this.selectedList[f1].longName );
                this.modelCriteriaForQuery[this.modelCriteriaForQuery.length] = this.selectedList[f1].longName;
            }
        }


        // softwareVersion
        this.softwareVersionCriteriaForQuery = [];
        // this.softwareVersionCriteriaForQuery.push( Consts.MANUFACTURER_SOFTWARE_VERSION_CRITERIA );
        this.softwareVersionCriteriaForQuery[0] = Consts.MANUFACTURER_SOFTWARE_VERSION_CRITERIA;
        for( let f1 = 0; f1 < len1; f1++ ){
            if( this.selectedList[f1].type === Consts.MANUFACTURER_SOFTWARE_VERSION ){
                // this.softwareVersionCriteriaForQuery.push( this.selectedList[f1].longName );
                this.softwareVersionCriteriaForQuery[this.softwareVersionCriteriaForQuery.length] = this.selectedList[f1].longName;
            }
        }

        // Only update the query with the type that was clicked on  FIXME This is wrong, we need to send an update query when a parent unselects a child
        if( nodeType === Consts.MANUFACTURER ){
            this.commonService.updateQuery( this.manufacturerCriteriaForQuery );
        }
        else if( nodeType === Consts.MANUFACTURER_MODEL ){
            this.commonService.updateQuery( this.modelCriteriaForQuery );
        }
        else if( nodeType === Consts.MANUFACTURER_SOFTWARE_VERSION ){
            this.commonService.updateQuery( this.softwareVersionCriteriaForQuery );
        }

    }

    /**
     * When a parent or grandparent of an entry is also included, remove the child or grandchild.
     */
    cleanSelectedList() {

        // *************************************
        // Top level (Manufacturer)
        // If a Manufacturer and a Manufacturer's child (Model) has been selected, remove model,
        // because all of a Manufacturer's models are included if the Manufacturer is selected.
        // *************************************
        let len0 = this.selectedList.length;
        for( let f0 = 0; f0 < len0; f0++ ){
            if( (!this.utilService.isNullOrUndefined( this.selectedList[f0] ))
                && (this.selectedList[f0].type === 'Manufacturer') ){ // Is top level


                // Loop at all the children, if they have the same manufacturer remove them since the parent will include all its children.
                let regexModel = new RegExp( '^.*' + this.escapeRegExp( this.selectedList[f0].name + this.delimiter ) + '.*$' );
                for( let f1 = 0; f1 < len0; f1++ ){
                    if( (this.selectedList[f1].type !== 'Manufacturer') && (regexModel.test( this.selectedList[f1].longName )) ){
                        this.cBox[this.selectedList[f1].id] = false;
                        this.selectedList.splice( f1, 1 );
                        if( f1 > 0 ){
                            f1--;
                        }
                        len0 = this.selectedList.length;
                    }
                }
            }
        }
        // *************************************
        // 2nd level (Model)
        // For each Model, remove an children that are selected.
        // *************************************
        len0 = this.selectedList.length;
        for( let modelIndex = 0; modelIndex < len0; modelIndex++ ){
            if( (!this.utilService.isNullOrUndefined( this.selectedList[modelIndex] )) &&
                (
                    this.selectedList[modelIndex].type !== 'Manufacturer'    // FIXME these should be consts
                )
            ){ // Is 2nd level
                let regexModel = new RegExp( '^.*' + this.escapeRegExp( this.selectedList[modelIndex].longName + this.delimiter ) + '.*$' );
                for( let softwareVerIndex = 0; softwareVerIndex < len0; softwareVerIndex++ ){
                    if(
                        (
                            ((this.selectedList[modelIndex].type === 'Model'))
                            &&
                            ((regexModel.test( this.selectedList[softwareVerIndex].longName )))
                        )
                    ){
                        this.cBox[this.selectedList[softwareVerIndex].id] = false;
                        this.selectedList.splice( softwareVerIndex, 1 );
                        if( softwareVerIndex > 0 ){
                            softwareVerIndex--;
                        }
                        len0 = this.selectedList.length;
                    }
                }
            }
        }


        for( let c = 0; c < this.cBox.length; c++ ){
            if( this.cBox[c] ){
                console.log( 'this.cBox[' + c + ']: ', this.cBox[c] );
            }
        }

    }

    /**
     * Match longName
     * @param str
     */
    selectedListHas( list, str ) {
        let len = list.length;
        for( let f = 0; f < len; f++ ){
            console.log( '[' + list[f].longName + '] Does it match: [' + str + ']' );
            if( (f > 10) || (list[f].longName === str) ){
                console.log( '[' + list[f].longName + '] MATCH' );
                return true;
            }
        }
        return false;
    }

    /**
     * Called when the user is totally clearing the complete current query
     */
    totalQueryClear() {
        this.clearAll( true );
    }

    /**
     *
     * @param {boolean} totalClear  true = the user has cleared the complete current query - no need to rerun the query
     */
    clearAll( totalClear: boolean ) {
        for( let f = 0; f < this.cBox.length; f++ ){
            this.cBox[f] = false;
        }
        this.checkedCount = 0;
        this.selectedList = [];

        if( !totalClear ){
            let criteriaForQuery: string[] = [];
            criteriaForQuery.push( Consts.MANUFACTURER_SOFTWARE_VERSION_CRITERIA );
            this.commonService.updateQuery( criteriaForQuery );

            criteriaForQuery = [];
            criteriaForQuery.push( Consts.MANUFACTURER_MODEL_CRITERIA );
            this.commonService.updateQuery( criteriaForQuery );

            criteriaForQuery = [];
            criteriaForQuery.push( Consts.MANUFACTURER_CRITERIA );
            this.commonService.updateQuery( criteriaForQuery );
        }
    }

    escapeRegExp( str ) {
        return str.replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
