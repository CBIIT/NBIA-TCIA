import { InjectionToken } from '@angular/core';

export interface PopoutData {
  modalName: string,
  currentTool: string,
}

export const POPOUT_MODAL_DATA = new InjectionToken<PopoutData>('POPOUT_MODAL_DATA');

export enum PopoutModalName {
  'cineMode' = 'CINE_MODE',
}

export let POPOUT_MODALS = {
};

