import { EventEmitter,Injectable } from '@angular/core';

@Injectable()
export class LoadingDisplayService{

    isLoadingEmitter = new EventEmitter();
    isLoadingSubMessageEmitter = new EventEmitter();

    isLoading = 0;

	constructor() {
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
//console.log("loading="+loading +" isLoading="+ this.isLoading);
        // FIXME I think I need to remove the ability to include a message for false.
         if( ! loading){
             message = '';
             subMessage = '';
         }

        if( this.isLoading > 0 ){
//			this.status.next(true);
            this.isLoadingEmitter.emit( { value: true, message: message, subMessage:  subMessage} );
        }
        else{
//			this.status.next(false);
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
     * @param {string} message  This parameter is just used for testing/debugging and can be removed at some point
     */
    setLoadingOff( message = '' ) {
        this.isLoading = 0;
        this.isLoadingEmitter.emit( { value: false, message: '', subMessage: '' } );
    }

    getIsLoading(){
        return this.isLoading;
    }
}
