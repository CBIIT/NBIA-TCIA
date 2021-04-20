import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingDisplayService {
    isLoadingEmitter = new EventEmitter();
    isLoadingSubMessageEmitter = new EventEmitter();

    isLoading = 0;

    constructor(  ) {
    }

    setLoading( loading: boolean, message = '', subMessage = '' ) {
        if( loading ){
            this.isLoading++;
        }
        else{
            this.isLoading--;
            if( this.isLoading < 0 ){
                this.isLoading = 0;
            }
         }

        // FIXME I should remove the ability to include a message for false.
        if( ! loading){
            message = '';
            subMessage = '';
        }

        if( this.isLoading > 0 ){
            this.isLoadingEmitter.emit( { value: true, message: message, subMessage:  subMessage} );
        }
        else{
            this.isLoadingEmitter.emit( { value: false, message: '' , subMessage: '' } );
        }

    }

    setLoadingOn( message = '' ) {
        this.isLoading = 1;
        this.isLoadingEmitter.emit( { value: true, message: message, subMessage: '' } );
    }

    updateSubMessage( subMessage){
        this.isLoadingSubMessageEmitter.emit( subMessage );
    }

    /**
     *
     * @param {string} message  This parameter is just used for @testing/debugging and can be removed at some point
     */
    setLoadingOff( message = '' ) {
        this.isLoading = 0;
        this.isLoadingEmitter.emit( { value: false, message: '', subMessage: '' } );
    }

    getIsLoading(){
        return this.isLoading;
    }
}
