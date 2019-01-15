import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component( {
    selector: 'nbia-dicom-data',
    templateUrl: './dicom-data.component.html',
    styleUrls: ['../series-details.component.scss', './dicom-data.component.scss',
        '../../subject-study-details.component.scss']
} )
export class DicomDataComponent implements OnInit{

    @Input() dicomData = [];
    @Input() seriesId;
    @Input() dicomDataShow;
    @Output() dicomDataShowChange = new EventEmitter();

    constructor( ) {
    }

    ngOnInit() {
    }

    onDicomDataCloseClick() {
        this.dicomDataShow = ! this.dicomDataShow;
        this.dicomDataShowChange.emit(this.dicomDataShow);
    }
}
