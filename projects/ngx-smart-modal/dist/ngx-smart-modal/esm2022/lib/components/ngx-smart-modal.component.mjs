import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, Input, Output, PLATFORM_ID, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSmartModalConfig } from '../config/ngx-smart-modal.config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class NgxSmartModalComponent {
    constructor(_renderer, _changeDetectorRef, _viewContainerRef, elementRef, _document, _platformId) {
        this._renderer = _renderer;
        this._changeDetectorRef = _changeDetectorRef;
        this._viewContainerRef = _viewContainerRef;
        this.elementRef = elementRef;
        this._document = _document;
        this._platformId = _platformId;
        this.closable = true;
        this.escapable = true;
        this.dismissable = true;
        this.identifier = '';
        this.customClass = 'nsm-dialog-animation-fade';
        this.visible = false;
        this.backdrop = true;
        this.force = true;
        this.hideDelay = 500;
        this.autostart = false;
        this.target = '';
        this.ariaLabel = null;
        this.ariaLabelledBy = null;
        this.ariaDescribedBy = null;
        this.refocus = true;
        this.visibleChange = new EventEmitter();
        this.onClose = new EventEmitter();
        this.onCloseFinished = new EventEmitter();
        this.onDismiss = new EventEmitter();
        this.onDismissFinished = new EventEmitter();
        this.onAnyCloseEvent = new EventEmitter();
        this.onAnyCloseEventFinished = new EventEmitter();
        this.onOpen = new EventEmitter();
        this.onOpenFinished = new EventEmitter();
        this.onEscape = new EventEmitter();
        this.onDataAdded = new EventEmitter();
        this.onDataRemoved = new EventEmitter();
        this.layerPosition = 1041;
        this.overlayVisible = false;
        this.openedClass = false;
        this.createFrom = 'html';
    }
    ngOnInit() {
        if (!this.identifier || !this.identifier.length) {
            throw new Error('identifier field isn’t set. Please set one before calling <ngx-smart-modal> in a template.');
        }
        this._sendEvent('create');
    }
    ngAfterViewChecked() {
        if (this.overlayVisible &&
            this.contentComponent &&
            this.dynamicContentContainer &&
            this.dynamicContentContainer.length === 0) {
            this.createDynamicContent();
        }
    }
    ngOnDestroy() {
        this._sendEvent('delete');
    }
    /**
     * Open the modal instance
     *
     * @param top open the modal top of all other
     * @returns the modal component
     */
    open(top) {
        this._sendEvent('open', { top: top });
        return this;
    }
    /**
     * Close the modal instance
     *
     * @returns the modal component
     */
    close() {
        this._sendEvent('close');
        return this;
    }
    /**
     * Dismiss the modal instance
     *
     * @param e the event sent by the browser
     * @returns the modal component
     */
    dismiss(e) {
        if (!this.dismissable || !e?.target?.classList.contains('overlay')) {
            return this;
        }
        this._sendEvent('dismiss');
        return this;
    }
    /**
     * Toggle visibility of the modal instance
     *
     * @param top open the modal top of all other
     * @returns the modal component
     */
    toggle(top) {
        this._sendEvent('toggle', { top: top });
        return this;
    }
    /**
     * Add a custom class to the modal instance
     *
     * @param className the class to add
     * @returns the modal component
     */
    addCustomClass(className) {
        if (!this.customClass.length) {
            this.customClass = className;
        }
        else {
            this.customClass += ' ' + className;
        }
        return this;
    }
    /**
     * Remove a custom class to the modal instance
     *
     * @param className the class to remove
     * @returns the modal component
     */
    removeCustomClass(className) {
        if (className) {
            this.customClass = this.customClass.replace(className, '').trim();
        }
        else {
            this.customClass = '';
        }
        return this;
    }
    /**
     * Returns the visibility state of the modal instance
     */
    isVisible() {
        return this.visible;
    }
    /**
     * Checks if data is attached to the modal instance
     */
    hasData() {
        return this._data !== undefined;
    }
    /**
     * Attach data to the modal instance
     *
     * @param data the data to attach
     * @param force override potentially attached data
     * @returns the modal component
     */
    setData(data, force) {
        if (!this.hasData() || (this.hasData() && force)) {
            this._data = data;
            this.assignModalDataToComponentData(this._componentRef);
            this.onDataAdded.emit(this._data);
            this.markForCheck();
        }
        return this;
    }
    /**
     * Retrieve the data attached to the modal instance
     */
    getData() {
        this.assignComponentDataToModalData(this._componentRef);
        return this._data;
    }
    /**
     * Remove the data attached to the modal instance
     *
     * @returns the modal component
     */
    removeData() {
        this._data = undefined;
        this.onDataRemoved.emit(true);
        this.markForCheck();
        return this;
    }
    /**
     * Add body class modal opened
     *
     * @returns the modal component
     */
    addBodyClass() {
        this._renderer.addClass(this._document.body, NgxSmartModalConfig.bodyClassOpen);
        return this;
    }
    /**
     * Add body class modal opened
     *
     * @returns the modal component
     */
    removeBodyClass() {
        this._renderer.removeClass(this._document.body, NgxSmartModalConfig.bodyClassOpen);
        return this;
    }
    markForCheck() {
        try {
            this._changeDetectorRef.detectChanges();
        }
        catch (e) { /* empty */ }
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Listens for window resize event and recalculates modal instance position if it is element-relative
     */
    targetPlacement() {
        if (!this.isBrowser || !this.nsmDialog.length || !this.nsmContent.length || !this.nsmOverlay.length || !this.target) {
            return false;
        }
        const targetElement = this._document.querySelector(this.target);
        if (!targetElement) {
            return false;
        }
        const targetElementRect = targetElement.getBoundingClientRect();
        const bodyRect = this.nsmOverlay.first.nativeElement.getBoundingClientRect();
        const nsmContentRect = this.nsmContent.first.nativeElement.getBoundingClientRect();
        const nsmDialogRect = this.nsmDialog.first.nativeElement.getBoundingClientRect();
        const marginLeft = parseInt(getComputedStyle(this.nsmContent.first.nativeElement).marginLeft, 10);
        const marginTop = parseInt(getComputedStyle(this.nsmContent.first.nativeElement).marginTop, 10);
        let offsetTop = targetElementRect.top - nsmDialogRect.top - ((nsmContentRect.height - targetElementRect.height) / 2);
        let offsetLeft = targetElementRect.left - nsmDialogRect.left - ((nsmContentRect.width - targetElementRect.width) / 2);
        if (offsetLeft + nsmDialogRect.left + nsmContentRect.width + (marginLeft * 2) > bodyRect.width) {
            offsetLeft = bodyRect.width - (nsmDialogRect.left + nsmContentRect.width) - (marginLeft * 2);
        }
        else if (offsetLeft + nsmDialogRect.left < 0) {
            offsetLeft = -nsmDialogRect.left;
        }
        if (offsetTop + nsmDialogRect.top + nsmContentRect.height + marginTop > bodyRect.height) {
            offsetTop = bodyRect.height - (nsmDialogRect.top + nsmContentRect.height) - marginTop;
        }
        this._renderer.setStyle(this.nsmContent.first.nativeElement, 'top', (offsetTop < 0 ? 0 : offsetTop) + 'px');
        this._renderer.setStyle(this.nsmContent.first.nativeElement, 'left', offsetLeft + 'px');
    }
    _sendEvent(name, extraData) {
        if (!this.isBrowser) {
            return false;
        }
        const data = {
            extraData: extraData,
            instance: { id: this.identifier, modal: this }
        };
        const event = new CustomEvent(NgxSmartModalConfig.prefixEvent + name, { detail: data });
        return window.dispatchEvent(event);
    }
    /**
     * Is current platform browser
     */
    get isBrowser() {
        return isPlatformBrowser(this._platformId);
    }
    /**
     * Creates content inside provided ViewContainerRef
     */
    createDynamicContent() {
        this.dynamicContentContainer.clear();
        this._componentRef = this.dynamicContentContainer.createComponent(this.contentComponent);
        this.assignModalDataToComponentData(this._componentRef);
        this.markForCheck();
    }
    /**
     * Assigns the modal data to the ComponentRef instance properties
     */
    assignModalDataToComponentData(componentRef) {
        if (componentRef) {
            Object.assign(componentRef.instance, this._data);
        }
    }
    /**
     * Assigns the ComponentRef instance properties to the modal data object
     */
    assignComponentDataToModalData(componentRef) {
        if (componentRef) {
            Object.assign(this._data, componentRef.instance);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalComponent, deps: [{ token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i0.ViewContainerRef }, { token: i0.ElementRef }, { token: DOCUMENT }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.10", type: NgxSmartModalComponent, isStandalone: true, selector: "ngx-smart-modal", inputs: { closable: "closable", escapable: "escapable", dismissable: "dismissable", identifier: "identifier", customClass: "customClass", visible: "visible", backdrop: "backdrop", force: "force", hideDelay: "hideDelay", autostart: "autostart", target: "target", ariaLabel: "ariaLabel", ariaLabelledBy: "ariaLabelledBy", ariaDescribedBy: "ariaDescribedBy", refocus: "refocus" }, outputs: { visibleChange: "visibleChange", onClose: "onClose", onCloseFinished: "onCloseFinished", onDismiss: "onDismiss", onDismissFinished: "onDismissFinished", onAnyCloseEvent: "onAnyCloseEvent", onAnyCloseEventFinished: "onAnyCloseEventFinished", onOpen: "onOpen", onOpenFinished: "onOpenFinished", onEscape: "onEscape", onDataAdded: "onDataAdded", onDataRemoved: "onDataRemoved" }, host: { listeners: { "window:resize": "targetPlacement()" } }, viewQueries: [{ propertyName: "dynamicContentContainer", first: true, predicate: ["dynamicContent"], descendants: true, read: ViewContainerRef }, { propertyName: "nsmContent", predicate: ["nsmContent"], descendants: true }, { propertyName: "nsmDialog", predicate: ["nsmDialog"], descendants: true }, { propertyName: "nsmOverlay", predicate: ["nsmOverlay"], descendants: true }], ngImport: i0, template: `
  <div *ngIf="overlayVisible"
       [style.z-index]="visible ? layerPosition-1 : -1"
       [ngClass]="{'transparent':!backdrop, 'overlay':true, 'nsm-overlay-open':openedClass}"
       (click)="dismiss($event)" #nsmOverlay>
    <div [style.z-index]="visible ? layerPosition : -1"
         [ngClass]="['nsm-dialog', customClass, openedClass ? 'nsm-dialog-open': 'nsm-dialog-close']" #nsmDialog
         [attr.aria-hidden]="openedClass ? false : true"
         [attr.aria-label]="ariaLabel"
         [attr.aria-labelledby]="ariaLabelledBy"
         [attr.aria-describedby]="ariaDescribedBy">
      <div class="nsm-content" #nsmContent>
        <div class="nsm-body">
          <ng-template #dynamicContent></ng-template>
          <ng-content></ng-content>
        </div>
        <button type="button" *ngIf="closable" (click)="close()" aria-label="Close" class="nsm-dialog-btn-close">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512"
               xml:space="preserve" width="16px" height="16px" role="img" aria-labelledby="closeIconTitle closeIconDesc">
            <title id="closeIconTitle">Close Icon</title>
            <desc id="closeIconDesc">A light-gray close icon used to close the modal</desc>
            <g>
              <path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249    C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306    C514.019,27.23,514.019,14.135,505.943,6.058z"
                    fill="currentColor"/>
            </g>
            <g>
              <path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636    c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"
                    fill="currentColor"/>
            </g>
          </svg>
        </button>
      </div>
    </div>
  </div>
`, isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-smart-modal', standalone: true, imports: [CommonModule], template: `
  <div *ngIf="overlayVisible"
       [style.z-index]="visible ? layerPosition-1 : -1"
       [ngClass]="{'transparent':!backdrop, 'overlay':true, 'nsm-overlay-open':openedClass}"
       (click)="dismiss($event)" #nsmOverlay>
    <div [style.z-index]="visible ? layerPosition : -1"
         [ngClass]="['nsm-dialog', customClass, openedClass ? 'nsm-dialog-open': 'nsm-dialog-close']" #nsmDialog
         [attr.aria-hidden]="openedClass ? false : true"
         [attr.aria-label]="ariaLabel"
         [attr.aria-labelledby]="ariaLabelledBy"
         [attr.aria-describedby]="ariaDescribedBy">
      <div class="nsm-content" #nsmContent>
        <div class="nsm-body">
          <ng-template #dynamicContent></ng-template>
          <ng-content></ng-content>
        </div>
        <button type="button" *ngIf="closable" (click)="close()" aria-label="Close" class="nsm-dialog-btn-close">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512"
               xml:space="preserve" width="16px" height="16px" role="img" aria-labelledby="closeIconTitle closeIconDesc">
            <title id="closeIconTitle">Close Icon</title>
            <desc id="closeIconDesc">A light-gray close icon used to close the modal</desc>
            <g>
              <path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249    C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306    C514.019,27.23,514.019,14.135,505.943,6.058z"
                    fill="currentColor"/>
            </g>
            <g>
              <path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636    c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"
                    fill="currentColor"/>
            </g>
          </svg>
        </button>
      </div>
    </div>
  </div>
` }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i0.ViewContainerRef }, { type: i0.ElementRef }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; }, propDecorators: { closable: [{
                type: Input
            }], escapable: [{
                type: Input
            }], dismissable: [{
                type: Input
            }], identifier: [{
                type: Input
            }], customClass: [{
                type: Input
            }], visible: [{
                type: Input
            }], backdrop: [{
                type: Input
            }], force: [{
                type: Input
            }], hideDelay: [{
                type: Input
            }], autostart: [{
                type: Input
            }], target: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], ariaDescribedBy: [{
                type: Input
            }], refocus: [{
                type: Input
            }], visibleChange: [{
                type: Output
            }], onClose: [{
                type: Output
            }], onCloseFinished: [{
                type: Output
            }], onDismiss: [{
                type: Output
            }], onDismissFinished: [{
                type: Output
            }], onAnyCloseEvent: [{
                type: Output
            }], onAnyCloseEventFinished: [{
                type: Output
            }], onOpen: [{
                type: Output
            }], onOpenFinished: [{
                type: Output
            }], onEscape: [{
                type: Output
            }], onDataAdded: [{
                type: Output
            }], onDataRemoved: [{
                type: Output
            }], nsmContent: [{
                type: ViewChildren,
                args: ['nsmContent']
            }], nsmDialog: [{
                type: ViewChildren,
                args: ['nsmDialog']
            }], nsmOverlay: [{
                type: ViewChildren,
                args: ['nsmOverlay']
            }], dynamicContentContainer: [{
                type: ViewChild,
                args: ['dynamicContent', { read: ViewContainerRef }]
            }], targetPlacement: [{
                type: HostListener,
                args: ['window:resize']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNtYXJ0LW1vZGFsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9uZ3gtc21hcnQtbW9kYWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM5RCxPQUFPLEVBR0wsU0FBUyxFQUdULFlBQVksRUFDWixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFHTCxNQUFNLEVBQ04sV0FBVyxFQUlYLFNBQVMsRUFDVCxZQUFZLEVBQ1osZ0JBQWdCLEVBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7O0FBNEN2RSxNQUFNLE9BQU8sc0JBQXNCO0lBOENqQyxZQUNVLFNBQW9CLEVBQ3BCLGtCQUFxQyxFQUNyQyxpQkFBbUMsRUFDM0IsVUFBc0IsRUFDWixTQUFtQixFQUNoQixXQUFtQjtRQUx4QyxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFDckMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUMzQixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ1osY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNoQixnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQWxEbEMsYUFBUSxHQUFHLElBQUksQ0FBQztRQUNoQixjQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ25CLGVBQVUsR0FBRyxFQUFFLENBQUM7UUFDaEIsZ0JBQVcsR0FBRywyQkFBMkIsQ0FBQztRQUMxQyxZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLGFBQVEsR0FBRyxJQUFJLENB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QUF0QixNQUFNO2dCQUNVLGNBQWM7c0JBQTlCLE1BQU07Z0JBQ1UsUUFBUTtzQkFBeEIsTUFBTTtnQkFDVSxXQUFXO3NCQUEzQixNQUFNO2dCQUNVLGFBQWE7c0JBQTdCLE1BQU07Z0JBWTZCLFVBQVU7c0JBQTdDLFlBQVk7dUJBQUMsWUFBWTtnQkFDUSxTQUFTO3NCQUExQyxZQUFZO3VCQUFDLFdBQVc7Z0JBQ1csVUFBVTtzQkFBN0MsWUFBWTt1QkFBQyxZQUFZO2dCQUN1Qyx1QkFBdUI7c0JBQXZGLFNBQVM7dUJBQUMsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBNE1oRCxlQUFlO3NCQURyQixZQUFZO3VCQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCwgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29tcG9uZW50UmVmLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUExBVEZPUk1fSUQsXG4gIFF1ZXJ5TGlzdCxcbiAgUmVuZGVyZXIyLFxuICBUeXBlLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDaGlsZHJlbixcbiAgVmlld0NvbnRhaW5lclJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ3hTbWFydE1vZGFsQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL25neC1zbWFydC1tb2RhbC5jb25maWcnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtc21hcnQtbW9kYWwnLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiAqbmdJZj1cIm92ZXJsYXlWaXNpYmxlXCJcbiAgICAgICBbc3R5bGUuei1pbmRleF09XCJ2aXNpYmxlID8gbGF5ZXJQb3NpdGlvbi0xIDogLTFcIlxuICAgICAgIFtuZ0NsYXNzXT1cInsndHJhbnNwYXJlbnQnOiFiYWNrZHJvcCwgJ292ZXJsYXknOnRydWUsICduc20tb3ZlcmxheS1vcGVuJzpvcGVuZWRDbGFzc31cIlxuICAgICAgIChjbGljayk9XCJkaXNtaXNzKCRldmVudClcIiAjbnNtT3ZlcmxheT5cbiAgICA8ZGl2IFtzdHlsZS56LWluZGV4XT1cInZpc2libGUgPyBsYXllclBvc2l0aW9uIDogLTFcIlxuICAgICAgICAgW25nQ2xhc3NdPVwiWyduc20tZGlhbG9nJywgY3VzdG9tQ2xhc3MsIG9wZW5lZENsYXNzID8gJ25zbS1kaWFsb2ctb3Blbic6ICduc20tZGlhbG9nLWNsb3NlJ11cIiAjbnNtRGlhbG9nXG4gICAgICAgICBbYXR0ci5hcmlhLWhpZGRlbl09XCJvcGVuZWRDbGFzcyA/IGZhbHNlIDogdHJ1ZVwiXG4gICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbFwiXG4gICAgICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkQnlcIlxuICAgICAgICAgW2F0dHIuYXJpYS1kZXNjcmliZWRieV09XCJhcmlhRGVzY3JpYmVkQnlcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJuc20tY29udGVudFwiICNuc21Db250ZW50PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibnNtLWJvZHlcIj5cbiAgICAgICAgICA8bmctdGVtcGxhdGUgI2R5bmFtaWNDb250ZW50PjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgKm5nSWY9XCJjbG9zYWJsZVwiIChjbGljayk9XCJjbG9zZSgpXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCIgY2xhc3M9XCJuc20tZGlhbG9nLWJ0bi1jbG9zZVwiPlxuICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZlcnNpb249XCIxLjFcIiBpZD1cIkxheWVyXzFcIiB4PVwiMHB4XCIgeT1cIjBweFwiIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiXG4gICAgICAgICAgICAgICB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiIHdpZHRoPVwiMTZweFwiIGhlaWdodD1cIjE2cHhcIiByb2xlPVwiaW1nXCIgYXJpYS1sYWJlbGxlZGJ5PVwiY2xvc2VJY29uVGl0bGUgY2xvc2VJY29uRGVzY1wiPlxuICAgICAgICAgICAgPHRpdGxlIGlkPVwiY2xvc2VJY29uVGl0bGVcIj5DbG9zZSBJY29uPC90aXRsZT5cbiAgICAgICAgICAgIDxkZXNjIGlkPVwiY2xvc2VJY29uRGVzY1wiPkEgbGlnaHQtZ3JheSBjbG9zZSBpY29uIHVzZWQgdG8gY2xvc2UgdGhlIG1vZGFsPC9kZXNjPlxuICAgICAgICAgICAgPGc+XG4gICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNTA1Ljk0Myw2LjA1OGMtOC4wNzctOC4wNzctMjEuMTcyLTguMDc3LTI5LjI0OSwwTDYuMDU4LDQ3Ni42OTNjLTguMDc3LDguMDc3LTguMDc3LDIxLjE3MiwwLDI5LjI0OSAgICBDMTAuMDk2LDUwOS45ODIsMTUuMzksNTEyLDIwLjY4Myw1MTJjNS4yOTMsMCwxMC41ODYtMi4wMTksMTQuNjI1LTYuMDU5TDUwNS45NDMsMzUuMzA2ICAgIEM1MTQuMDE5LDI3LjIzLDUxNC4wMTksMTQuMTM1LDUwNS45NDMsNi4wNTh6XCJcbiAgICAgICAgICAgICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5cbiAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgIDxnPlxuICAgICAgICAgICAgICA8cGF0aCBkPVwiTTUwNS45NDIsNDc2LjY5NEwzNS4zMDYsNi4wNTljLTguMDc2LTguMDc3LTIxLjE3Mi04LjA3Ny0yOS4yNDgsMGMtOC4wNzcsOC4wNzYtOC4wNzcsMjEuMTcxLDAsMjkuMjQ4bDQ3MC42MzYsNDcwLjYzNiAgICBjNC4wMzgsNC4wMzksOS4zMzIsNi4wNTgsMTQuNjI1LDYuMDU4YzUuMjkzLDAsMTAuNTg3LTIuMDE5LDE0LjYyNC02LjA1N0M1MTQuMDE4LDQ5Ny44NjYsNTE0LjAxOCw0ODQuNzcxLDUwNS45NDIsNDc2LjY5NHpcIlxuICAgICAgICAgICAgICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCIvPlxuICAgICAgICAgICAgPC9nPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbmAsXG4gIHN0eWxlczogW1xuICBdXG59KVxuZXhwb3J0IGNsYXNzIE5neFNtYXJ0TW9kYWxDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3Q2hlY2tlZCB7XG5cbiAgQElucHV0KCkgcHVibGljIGNsb3NhYmxlID0gdHJ1ZTtcbiAgQElucHV0KCkgcHVibGljIGVzY2FwYWJsZSA9IHRydWU7XG4gIEBJbnB1dCgpIHB1YmxpYyBkaXNtaXNzYWJsZSA9IHRydWU7XG4gIEBJbnB1dCgpIHB1YmxpYyBpZGVudGlmaWVyID0gJyc7XG4gIEBJbnB1dCgpIHB1YmxpYyBjdXN0b21DbGFzcyA9ICduc20tZGlhbG9nLWFuaW1hdGlvbi1mYWRlJztcbiAgQElucHV0KCkgcHVibGljIHZpc2libGUgPSBmYWxzZTtcbiAgQElucHV0KCkgcHVibGljIGJhY2tkcm9wID0gdHJ1ZTtcbiAgQElucHV0KCkgcHVibGljIGZvcmNlID0gdHJ1ZTtcbiAgQElucHV0KCkgcHVibGljIGhpZGVEZWxheSA9IDUwMDtcbiAgQElucHV0KCkgcHVibGljIGF1dG9zdGFydCA9IGZhbHNlO1xuICBASW5wdXQoKSBwdWJsaWMgdGFyZ2V0ID0gJyc7XG4gIEBJbnB1dCgpIHB1YmxpYyBhcmlhTGFiZWw6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBwdWJsaWMgYXJpYUxhYmVsbGVkQnk6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBwdWJsaWMgYXJpYURlc2NyaWJlZEJ5OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgcHVibGljIHJlZm9jdXMgPSB0cnVlO1xuXG4gIEBPdXRwdXQoKSBwdWJsaWMgdmlzaWJsZUNoYW5nZTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuICBAT3V0cHV0KCkgcHVibGljIG9uQ2xvc2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcHVibGljIG9uQ2xvc2VGaW5pc2hlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBwdWJsaWMgb25EaXNtaXNzOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHB1YmxpYyBvbkRpc21pc3NGaW5pc2hlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBwdWJsaWMgb25BbnlDbG9zZUV2ZW50OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHB1YmxpYyBvbkFueUNsb3NlRXZlbnRGaW5pc2hlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBwdWJsaWMgb25PcGVuOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHB1YmxpYyBvbk9wZW5GaW5pc2hlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBwdWJsaWMgb25Fc2NhcGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcHVibGljIG9uRGF0YUFkZGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHB1YmxpYyBvbkRhdGFSZW1vdmVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwdWJsaWMgY29udGVudENvbXBvbmVudCE6IFR5cGU8YW55PjtcbiAgcHVibGljIGxheWVyUG9zaXRpb24gPSAxMDQxO1xuICBwdWJsaWMgb3ZlcmxheVZpc2libGUgPSBmYWxzZTtcbiAgcHVibGljIG9wZW5lZENsYXNzID0gZmFsc2U7XG5cbiAgcHVibGljIGNyZWF0ZUZyb20gPSAnaHRtbCc7XG5cbiAgcHJpdmF0ZSBfZGF0YTogYW55O1xuICBwcml2YXRlIF9jb21wb25lbnRSZWYhOiBDb21wb25lbnRSZWY8Q29tcG9uZW50PjtcblxuICBAVmlld0NoaWxkcmVuKCduc21Db250ZW50JykgcHJpdmF0ZSBuc21Db250ZW50ITogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xuICBAVmlld0NoaWxkcmVuKCduc21EaWFsb2cnKSBwdWJsaWMgbnNtRGlhbG9nITogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xuICBAVmlld0NoaWxkcmVuKCduc21PdmVybGF5JykgcHJpdmF0ZSBuc21PdmVybGF5ITogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xuICBAVmlld0NoaWxkKCdkeW5hbWljQ29udGVudCcsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSBwcml2YXRlIGR5bmFtaWNDb250ZW50Q29udGFpbmVyITogVmlld0NvbnRhaW5lclJlZjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHB1YmxpYyByZWFkb25seSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBEb2N1bWVudCxcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIF9wbGF0Zm9ybUlkOiBvYmplY3QsXG4gICkgeyB9XG5cbiAgcHVibGljIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5pZGVudGlmaWVyIHx8ICF0aGlzLmlkZW50aWZpZXIubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2lkZW50aWZpZXIgZmllbGQgaXNu4oCZdCBzZXQuIFBsZWFzZSBzZXQgb25lIGJlZm9yZSBjYWxsaW5nIDxuZ3gtc21hcnQtbW9kYWw+IGluIGEgdGVtcGxhdGUuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fc2VuZEV2ZW50KCdjcmVhdGUnKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5vdmVybGF5VmlzaWJsZSAmJlxuICAgICAgdGhpcy5jb250ZW50Q29tcG9uZW50ICYmXG4gICAgICB0aGlzLmR5bmFtaWNDb250ZW50Q29udGFpbmVyICYmXG4gICAgICB0aGlzLmR5bmFtaWNDb250ZW50Q29udGFpbmVyLmxlbmd0aCA9PT0gMFxuICAgICkge1xuICAgICAgdGhpcy5jcmVhdGVEeW5hbWljQ29udGVudCgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zZW5kRXZlbnQoJ2RlbGV0ZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW4gdGhlIG1vZGFsIGluc3RhbmNlXG4gICAqXG4gICAqIEBwYXJhbSB0b3Agb3BlbiB0aGUgbW9kYWwgdG9wIG9mIGFsbCBvdGhlclxuICAgKiBAcmV0dXJucyB0aGUgbW9kYWwgY29tcG9uZW50XG4gICAqL1xuICBwdWJsaWMgb3Blbih0b3A/OiBib29sZWFuKTogTmd4U21hcnRNb2RhbENvbXBvbmVudCB7XG4gICAgdGhpcy5fc2VuZEV2ZW50KCdvcGVuJywgeyB0b3A6IHRvcCB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlIHRoZSBtb2RhbCBpbnN0YW5jZVxuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgbW9kYWwgY29tcG9uZW50XG4gICAqL1xuICBwdWJsaWMgY2xvc2UoKTogTmd4U21hcnRNb2RhbENvbXBvbmVudCB7XG4gICAgdGhpcy5fc2VuZEV2ZW50KCdjbG9zZScpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogRGlzbWlzcyB0aGUgbW9kYWwgaW5zdGFuY2VcbiAgICpcbiAgICogQHBhcmFtIGUgdGhlIGV2ZW50IHNlbnQgYnkgdGhlIGJyb3dzZXJcbiAgICogQHJldHVybnMgdGhlIG1vZGFsIGNvbXBvbmVudFxuICAgKi9cbiAgcHVibGljIGRpc21pc3MoZTogTW91c2VFdmVudCk6IE5neFNtYXJ0TW9kYWxDb21wb25lbnQge1xuICAgIGlmICghdGhpcy5kaXNtaXNzYWJsZSB8fCAhKGU/LnRhcmdldCBhcyBFbGVtZW50KT8uY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVybGF5JykpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRoaXMuX3NlbmRFdmVudCgnZGlzbWlzcycpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlIHZpc2liaWxpdHkgb2YgdGhlIG1vZGFsIGluc3RhbmNlXG4gICAqXG4gICAqIEBwYXJhbSB0b3Agb3BlbiB0aGUgbW9kYWwgdG9wIG9mIGFsbCBvdGhlclxuICAgKiBAcmV0dXJucyB0aGUgbW9kYWwgY29tcG9uZW50XG4gICAqL1xuICBwdWJsaWMgdG9nZ2xlKHRvcD86IGJvb2xlYW4pOiBOZ3hTbWFydE1vZGFsQ29tcG9uZW50IHtcbiAgICB0aGlzLl9zZW5kRXZlbnQoJ3RvZ2dsZScsIHsgdG9wOiB0b3AgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBjdXN0b20gY2xhc3MgdG8gdGhlIG1vZGFsIGluc3RhbmNlXG4gICAqXG4gICAqIEBwYXJhbSBjbGFzc05hbWUgdGhlIGNsYXNzIHRvIGFkZFxuICAgKiBAcmV0dXJucyB0aGUgbW9kYWwgY29tcG9uZW50XG4gICAqL1xuICBwdWJsaWMgYWRkQ3VzdG9tQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpOiBOZ3hTbWFydE1vZGFsQ29tcG9uZW50IHtcbiAgICBpZiAoIXRoaXMuY3VzdG9tQ2xhc3MubGVuZ3RoKSB7XG4gICAgICB0aGlzLmN1c3RvbUNsYXNzID0gY2xhc3NOYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1c3RvbUNsYXNzICs9ICcgJyArIGNsYXNzTmFtZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBjdXN0b20gY2xhc3MgdG8gdGhlIG1vZGFsIGluc3RhbmNlXG4gICAqXG4gICAqIEBwYXJhbSBjbGFzc05hbWUgdGhlIGNsYXNzIHRvIHJlbW92ZVxuICAgKiBAcmV0dXJucyB0aGUgbW9kYWwgY29tcG9uZW50XG4gICAqL1xuICBwdWJsaWMgcmVtb3ZlQ3VzdG9tQ2xhc3MoY2xhc3NOYW1lPzogc3RyaW5nKTogTmd4U21hcnRNb2RhbENvbXBvbmVudCB7XG4gICAgaWYgKGNsYXNzTmFtZSkge1xuICAgICAgdGhpcy5jdXN0b21DbGFzcyA9IHRoaXMuY3VzdG9tQ2xhc3MucmVwbGFjZShjbGFzc05hbWUsICcnKS50cmltKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3VzdG9tQ2xhc3MgPSAnJztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2aXNpYmlsaXR5IHN0YXRlIG9mIHRoZSBtb2RhbCBpbnN0YW5jZVxuICAgKi9cbiAgcHVibGljIGlzVmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy52aXNpYmxlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBkYXRhIGlzIGF0dGFjaGVkIHRvIHRoZSBtb2RhbCBpbnN0YW5jZVxuICAgKi9cbiAgcHVibGljIGhhc0RhdGEoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGEgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2ggZGF0YSB0byB0aGUgbW9kYWwgaW5zdGFuY2VcbiAgICpcbiAgICogQHBhcmFtIGRhdGEgdGhlIGRhdGEgdG8gYXR0YWNoXG4gICAqIEBwYXJhbSBmb3JjZSBvdmVycmlkZSBwb3RlbnRpYWxseSBhdHRhY2hlZCBkYXRhXG4gICAqIEByZXR1cm5zIHRoZSBtb2RhbCBjb21wb25lbnRcbiAgICovXG4gIHB1YmxpYyBzZXREYXRhKGRhdGE6IHVua25vd24sIGZvcmNlPzogYm9vbGVhbik6IE5neFNtYXJ0TW9kYWxDb21wb25lbnQge1xuICAgIGlmICghdGhpcy5oYXNEYXRhKCkgfHwgKHRoaXMuaGFzRGF0YSgpICYmIGZvcmNlKSkge1xuICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgICB0aGlzLmFzc2lnbk1vZGFsRGF0YVRvQ29tcG9uZW50RGF0YSh0aGlzLl9jb21wb25lbnRSZWYpO1xuICAgICAgdGhpcy5vbkRhdGFBZGRlZC5lbWl0KHRoaXMuX2RhdGEpO1xuICAgICAgdGhpcy5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgZGF0YSBhdHRhY2hlZCB0byB0aGUgbW9kYWwgaW5zdGFuY2VcbiAgICovXG4gIHB1YmxpYyBnZXREYXRhKCk6IHVua25vd24ge1xuICAgIHRoaXMuYXNzaWduQ29tcG9uZW50RGF0YVRvTW9kYWxEYXRhKHRoaXMuX2NvbXBvbmVudFJlZik7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBkYXRhIGF0dGFjaGVkIHRvIHRoZSBtb2RhbCBpbnN0YW5jZVxuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgbW9kYWwgY29tcG9uZW50XG4gICAqL1xuICBwdWJsaWMgcmVtb3ZlRGF0YSgpOiBOZ3hTbWFydE1vZGFsQ29tcG9uZW50IHtcbiAgICB0aGlzLl9kYXRhID0gdW5kZWZpbmVkO1xuICAgIHRoaXMub25EYXRhUmVtb3ZlZC5lbWl0KHRydWUpO1xuICAgIHRoaXMubWFya0ZvckNoZWNrKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYm9keSBjbGFzcyBtb2RhbCBvcGVuZWRcbiAgICpcbiAgICogQHJldHVybnMgdGhlIG1vZGFsIGNvbXBvbmVudFxuICAgKi9cbiAgcHVibGljIGFkZEJvZHlDbGFzcygpOiBOZ3hTbWFydE1vZGFsQ29tcG9uZW50IHtcbiAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyh0aGlzLl9kb2N1bWVudC5ib2R5LCBOZ3hTbWFydE1vZGFsQ29uZmlnLmJvZHlDbGFzc09wZW4pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGJvZHkgY2xhc3MgbW9kYWwgb3BlbmVkXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSBtb2RhbCBjb21wb25lbnRcbiAgICovXG4gIHB1YmxpYyByZW1vdmVCb2R5Q2xhc3MoKTogTmd4U21hcnRNb2RhbENvbXBvbmVudCB7XG4gICAgdGhpcy5fcmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5fZG9jdW1lbnQuYm9keSwgTmd4U21hcnRNb2RhbENvbmZpZy5ib2R5Q2xhc3NPcGVuKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIG1hcmtGb3JDaGVjaygpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVucyBmb3Igd2luZG93IHJlc2l6ZSBldmVudCBhbmQgcmVjYWxjdWxhdGVzIG1vZGFsIGluc3RhbmNlIHBvc2l0aW9uIGlmIGl0IGlzIGVsZW1lbnQtcmVsYXRpdmVcbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKVxuICBwdWJsaWMgdGFyZ2V0UGxhY2VtZW50KCk6IGJvb2xlYW4gfCB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNCcm93c2VyIHx8ICF0aGlzLm5zbURpYWxvZy5sZW5ndGggfHwgIXRoaXMubnNtQ29udGVudC5sZW5ndGggfHwgIXRoaXMubnNtT3ZlcmxheS5sZW5ndGggfHwgIXRoaXMudGFyZ2V0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMudGFyZ2V0KTtcblxuICAgIGlmICghdGFyZ2V0RWxlbWVudCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHRhcmdldEVsZW1lbnRSZWN0ID0gdGFyZ2V0RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBib2R5UmVjdCA9IHRoaXMubnNtT3ZlcmxheS5maXJzdC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgY29uc3QgbnNtQ29udGVudFJlY3QgPSB0aGlzLm5zbUNvbnRlbnQuZmlyc3QubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBuc21EaWFsb2dSZWN0ID0gdGhpcy5uc21EaWFsb2cuZmlyc3QubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIGNvbnN0IG1hcmdpbkxlZnQgPSBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKHRoaXMubnNtQ29udGVudC5maXJzdC5uYXRpdmVFbGVtZW50KS5tYXJnaW5MZWZ0LCAxMCk7XG4gICAgY29uc3QgbWFyZ2luVG9wID0gcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLm5zbUNvbnRlbnQuZmlyc3QubmF0aXZlRWxlbWVudCkubWFyZ2luVG9wLCAxMCk7XG5cbiAgICBsZXQgb2Zmc2V0VG9wID0gdGFyZ2V0RWxlbWVudFJlY3QudG9wIC0gbnNtRGlhbG9nUmVjdC50b3AgLSAoKG5zbUNvbnRlbnRSZWN0LmhlaWdodCAtIHRhcmdldEVsZW1lbnRSZWN0LmhlaWdodCkgLyAyKTtcbiAgICBsZXQgb2Zmc2V0TGVmdCA9IHRhcmdldEVsZW1lbnRSZWN0LmxlZnQgLSBuc21EaWFsb2dSZWN0LmxlZnQgLSAoKG5zbUNvbnRlbnRSZWN0LndpZHRoIC0gdGFyZ2V0RWxlbWVudFJlY3Qud2lkdGgpIC8gMik7XG5cbiAgICBpZiAob2Zmc2V0TGVmdCArIG5zbURpYWxvZ1JlY3QubGVmdCArIG5zbUNvbnRlbnRSZWN0LndpZHRoICsgKG1hcmdpbkxlZnQgKiAyKSA+IGJvZHlSZWN0LndpZHRoKSB7XG4gICAgICBvZmZzZXRMZWZ0ID0gYm9keVJlY3Qud2lkdGggLSAobnNtRGlhbG9nUmVjdC5sZWZ0ICsgbnNtQ29udGVudFJlY3Qud2lkdGgpIC0gKG1hcmdpbkxlZnQgKiAyKTtcbiAgICB9IGVsc2UgaWYgKG9mZnNldExlZnQgKyBuc21EaWFsb2dSZWN0LmxlZnQgPCAwKSB7XG4gICAgICBvZmZzZXRMZWZ0ID0gLW5zbURpYWxvZ1JlY3QubGVmdDtcbiAgICB9XG5cbiAgICBpZiAob2Zmc2V0VG9wICsgbnNtRGlhbG9nUmVjdC50b3AgKyBuc21Db250ZW50UmVjdC5oZWlnaHQgKyBtYXJnaW5Ub3AgPiBib2R5UmVjdC5oZWlnaHQpIHtcbiAgICAgIG9mZnNldFRvcCA9IGJvZHlSZWN0LmhlaWdodCAtIChuc21EaWFsb2dSZWN0LnRvcCArIG5zbUNvbnRlbnRSZWN0LmhlaWdodCkgLSBtYXJnaW5Ub3A7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUodGhpcy5uc21Db250ZW50LmZpcnN0Lm5hdGl2ZUVsZW1lbnQsICd0b3AnLCAob2Zmc2V0VG9wIDwgMCA/IDAgOiBvZmZzZXRUb3ApICsgJ3B4Jyk7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUodGhpcy5uc21Db250ZW50LmZpcnN0Lm5hdGl2ZUVsZW1lbnQsICdsZWZ0Jywgb2Zmc2V0TGVmdCArICdweCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2VuZEV2ZW50KG5hbWU6IHN0cmluZywgZXh0cmFEYXRhPzogdW5rbm93bik6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5pc0Jyb3dzZXIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgZXh0cmFEYXRhOiBleHRyYURhdGEsXG4gICAgICBpbnN0YW5jZTogeyBpZDogdGhpcy5pZGVudGlmaWVyLCBtb2RhbDogdGhpcyB9XG4gICAgfTtcblxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KE5neFNtYXJ0TW9kYWxDb25maWcucHJlZml4RXZlbnQgKyBuYW1lLCB7IGRldGFpbDogZGF0YSB9KTtcblxuICAgIHJldHVybiB3aW5kb3cuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH1cblxuICAvKipcbiAgICogSXMgY3VycmVudCBwbGF0Zm9ybSBicm93c2VyXG4gICAqL1xuICBwcml2YXRlIGdldCBpc0Jyb3dzZXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMuX3BsYXRmb3JtSWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgY29udGVudCBpbnNpZGUgcHJvdmlkZWQgVmlld0NvbnRhaW5lclJlZlxuICAgKi9cbiAgcHJpdmF0ZSBjcmVhdGVEeW5hbWljQ29udGVudCgpOiB2b2lkIHtcbiAgICB0aGlzLmR5bmFtaWNDb250ZW50Q29udGFpbmVyLmNsZWFyKCk7XG4gICAgdGhpcy5fY29tcG9uZW50UmVmID0gdGhpcy5keW5hbWljQ29udGVudENvbnRhaW5lci5jcmVhdGVDb21wb25lbnQodGhpcy5jb250ZW50Q29tcG9uZW50KTtcbiAgICB0aGlzLmFzc2lnbk1vZGFsRGF0YVRvQ29tcG9uZW50RGF0YSh0aGlzLl9jb21wb25lbnRSZWYpO1xuICAgIHRoaXMubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogQXNzaWducyB0aGUgbW9kYWwgZGF0YSB0byB0aGUgQ29tcG9uZW50UmVmIGluc3RhbmNlIHByb3BlcnRpZXNcbiAgICovXG4gIHByaXZhdGUgYXNzaWduTW9kYWxEYXRhVG9Db21wb25lbnREYXRhKGNvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPENvbXBvbmVudD4pOiB2b2lkIHtcbiAgICBpZiAoY29tcG9uZW50UmVmKSB7XG4gICAgICBPYmplY3QuYXNzaWduKGNvbXBvbmVudFJlZi5pbnN0YW5jZSwgdGhpcy5fZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFzc2lnbnMgdGhlIENvbXBvbmVudFJlZiBpbnN0YW5jZSBwcm9wZXJ0aWVzIHRvIHRoZSBtb2RhbCBkYXRhIG9iamVjdFxuICAgKi9cbiAgcHJpdmF0ZSBhc3NpZ25Db21wb25lbnREYXRhVG9Nb2RhbERhdGEoY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8Q29tcG9uZW50Pik6IHZvaWQge1xuICAgIGlmIChjb21wb25lbnRSZWYpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5fZGF0YSwgY29tcG9uZW50UmVmLmluc3RhbmNlKTtcbiAgICB9XG4gIH1cblxufVxuIl19