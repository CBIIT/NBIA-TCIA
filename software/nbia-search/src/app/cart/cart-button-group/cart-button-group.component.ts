import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '@app/image-search/services/common.service';
import { PersistenceService } from '@app/common/services/persistence.service';
import { UtilService } from '@app/common/services/util.service';


@Component( {
    selector: 'nbia-cart-button-group',
    templateUrl: './cart-button-group.component.html',
    styleUrls: ['../../app.component.scss', './cart-button-group.component.scss']
} )
export class CartButtonGroupComponent implements OnInit{

    @Input() cartList;

    /**
     * If true Launch the popup with the TCIA downloader link.
     */
    showDownloaderDownload;

    constructor( private commonService: CommonService, private persistenceService: PersistenceService,
                 private utilService: UtilService ) {
    }

    ngOnInit() {
    }

    onDownloadClick() {
        // Get the current state of persistenceService.Field.SHOW_DOWNLOADER_DOWNLOAD,
        // this will tell us if the user has previously checked the "Do not show this message again." checkbox.
 /*       try{
            this.showDownloaderDownload = JSON.parse( this.persistenceService.get( this.persistenceService.Field.SHOW_DOWNLOADER_DOWNLOAD ) );
        }catch( e ){
        }
        if( this.utilService.isNullOrUndefined( this.showDownloaderDownload ) ){
            // If it is not persisted, set it to true
            this.showDownloaderDownload = true;
        }

*/
        // Just launch the cart download.
        if( !this.showDownloaderDownload ){
            this.commonService.cartListDownLoadButton();
        }
        else{
            // Launch the popup with the TCIA downloader link.
            this.commonService.downloaderDownLoadButton( );
        }
    }


    /**
     * Start the csv download, cartListForDisplay is the same data in the cart screen,
     * @TODO make sure this is all the data we want exported
     * @TODO Do we want to export the formatted date, currently we are exporting as epoch?
     *
     */
    onDownloadCsvClick() {
        this.commonService.downloadCartAsCsv( this.cartList);
    }

}
