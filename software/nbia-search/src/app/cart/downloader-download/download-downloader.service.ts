import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadDownloaderService {

  doDownloadEmitter = new EventEmitter();

  doDownload( downLoadTool){
      this.doDownloadEmitter.emit( downLoadTool );
  }

  constructor() { }
}
