import { Component, HostListener } from '@angular/core';
import { Properties } from '@assets/properties';

@Component( {
    selector: 'nbia-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
} )
export class AppComponent{
    title = 'nbia';

    @HostListener( 'window:beforeunload', ['$event'] )
    public beforeunloadHandler( $event ) {
        if( Properties.CONFIRM_EXIT){
            $event.returnValue = 'Confirm?';
        }
    }

}
