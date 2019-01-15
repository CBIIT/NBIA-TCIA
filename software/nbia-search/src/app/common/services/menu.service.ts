import {Injectable, EventEmitter} from '@angular/core';
import { MenuItems } from '@app/consts';

@Injectable()
export class MenuService {
    currentMenuItemEmitter = new EventEmitter();
    menuLockEmitter = new EventEmitter();

    currentItem = 0;

    constructor() {
    }

    /**
     * Lets anyone subscribing, know the top menu in the header has been set/changed.
     *
     * @param n
     */
    setCurrentItem(n: MenuItems) {
        // Only emit if this is a change
        if (n !== this.currentItem) {
            this.currentItem = n;
            this.currentMenuItemEmitter.emit(this.currentItem);
        }
    }


    getCurrentItem() {
        return this.currentItem;
    }

    lockMenu(){
        this.menuLockEmitter.emit( true );
    }

    unlockMenu(){
        this.menuLockEmitter.emit( false );
    }

    setMenuLock( mLock){
        this.menuLockEmitter.emit( mLock );

    }

}
