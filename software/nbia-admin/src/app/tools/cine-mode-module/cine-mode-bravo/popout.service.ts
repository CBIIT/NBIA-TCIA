import { ComponentPortal, DomPortalOutlet, PortalInjector } from '@angular/cdk/portal';
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector, OnDestroy } from '@angular/core';
import {POPOUT_MODAL_DATA, POPOUT_MODALS, PopoutData, PopoutModalName} from './popout.tokens';
import {CineModeBravoComponent} from './cine-mode-bravo.component';

@Injectable( {
    providedIn: 'root',
} )
export class PopoutService implements OnDestroy {
  styleSheetElement;

  constructor(
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef
  ) {
  }

  ngOnDestroy() {}

  sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  openPopoutModal(data) {
    const windowInstance = this.openOnce(
      'popout.html',
      'MODAL_POPOUT'
    );

    // Wait for window instance to be created
    setTimeout(() => {
      // FF needs this?????
      this.sleep(1);
      this.createCDKPortal(data, windowInstance);
      // FF needs this?????
      this.sleep(1);
    }, 1000);
  }

  openOnce(url, target) {
    // Open a blank "target" window
    // or get the reference to the existing "target" window
    const winRef = window.open('', target, 'popup', true);
    // If the "target" window was just opened, change its url
    if (winRef.location.href === 'about:blank') {
      winRef.location.href = url;
    }
    return winRef;
  }

  createCDKPortal(data, windowInstance) {
    if (windowInstance) {
      // Create a PortalOutlet with the body of the new window document
      const outlet = new DomPortalOutlet(windowInstance.document.body, this.componentFactoryResolver, this.applicationRef, this.injector);
      // Copy styles from parent window
      document.querySelectorAll('style').forEach(htmlElement => {
        windowInstance.document.head.appendChild(htmlElement.cloneNode(true));
      });
      // Copy stylesheet link from parent window
      this.styleSheetElement = this.getStyleSheetElement();
      windowInstance.document.head.appendChild(this.styleSheetElement);

      this.styleSheetElement.onload = () => {
        // Clear popout modal content
        windowInstance.document.body.innerText = '';

        // Create an injector with modal data
        const injector = this.createInjector(data);

        // Attach the portal
        let componentInstance;
        windowInstance.document.title = 'Cine Mode';
        componentInstance = this.attachContainer(outlet, injector);

        POPOUT_MODALS['windowInstance'] = windowInstance;
        POPOUT_MODALS['outlet'] = outlet;
        POPOUT_MODALS['componentInstance'] = componentInstance;
      };
    } else {
      console.log("no window instance found, something went wrong");
    }
  }

  isPopoutWindowOpen() {
    return POPOUT_MODALS['windowInstance'] && !POPOUT_MODALS['windowInstance'].closed;
  }

  focusPopoutWindow() {
    POPOUT_MODALS['windowInstance'].focus();
  }

  closePopoutModal() {
    Object.keys(POPOUT_MODALS).forEach(modalName => {
      if (POPOUT_MODALS['windowInstance']) {
        POPOUT_MODALS['windowInstance'].close();
      }
    });
  }

  attachContainer(outlet, injector) {
    const containerPortal = new ComponentPortal(CineModeBravoComponent, null, injector);
    const containerRef: ComponentRef<CineModeBravoComponent> = outlet.attach(containerPortal);
    return containerRef.instance;
  }

  createInjector(data): PortalInjector {
    const injectionTokens = new WeakMap();
    injectionTokens.set(POPOUT_MODAL_DATA, data);
    return new PortalInjector(this.injector, injectionTokens);
  }

  getStyleSheetElement() {
    const styleSheetElement = document.createElement('link');
    document.querySelectorAll('link').forEach(htmlElement => {
      if (htmlElement.rel === 'stylesheet') {
        const absoluteUrl = new URL(htmlElement.href).href;
        styleSheetElement.rel = 'stylesheet';
        styleSheetElement.href = absoluteUrl;
      }
    });
    return styleSheetElement;
  }
}
