import * as i0 from '@angular/core';
import { EventEmitter, PLATFORM_ID, ViewContainerRef, Component, Inject, Input, Output, ViewChildren, ViewChild, HostListener, Injectable, Type, TemplateRef } from '@angular/core';
import * as i1 from '@angular/common';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';

const NgxSmartModalConfig = {
    bodyClassOpen: 'dialog-open',
    prefixEvent: 'ngx-smart-modal.'
};

class NgxSmartModalComponent {
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

class NgxSmartModalStackService {
    constructor() {
        this._modalStack = [];
    }
    /**
     * Add a new modal instance. This step is essential and allows to retrieve any modal at any time.
     * It stores an object that contains the given modal identifier and the modal itself directly in the `modalStack`.
     *
     * @param modalInstance The object that contains the given modal identifier and the modal itself.
     * @param force Optional parameter that forces the overriding of modal instance if it already exists.
     * @returns nothing special.
     */
    addModal(modalInstance, force) {
        if (force) {
            const i = this._modalStack.findIndex((o) => o.id === modalInstance.id);
            if (i > -1) {
                this._modalStack[i].modal = modalInstance.modal;
            }
            else {
                this._modalStack.push(modalInstance);
            }
            return;
        }
        this._modalStack.push(modalInstance);
    }
    /**
     * Retrieve a modal instance by its identifier.
     *
     * @param id The modal identifier used at creation time.
     */
    getModal(id) {
        const i = this._modalStack.find((o) => o.id === id);
        if (i !== undefined) {
            return i.modal;
        }
        else {
            throw new Error(`Cannot find modal with identifier ${id}`);
        }
    }
    /**
     * Retrieve all the created modals.
     *
     * @returns an array that contains all modal instances.
     */
    getModalStack() {
        return this._modalStack;
    }
    /**
     * Retrieve all the opened modals. It looks for all modal instances with their `visible` property set to `true`.
     *
     * @returns an array that contains all the opened modals.
     */
    getOpenedModals() {
        return this._modalStack.filter((o) => o.modal.visible);
    }
    /**
     * Retrieve the opened modal with highest z-index.
     *
     * @returns the opened modal with highest z-index.
     */
    getTopOpenedModal() {
        if (!this.getOpenedModals().length) {
            throw new Error('No modal is opened');
        }
        return this.getOpenedModals()
            .map((o) => o.modal)
            .reduce((highest, item) => item.layerPosition > highest.layerPosition ? item : highest, this.getOpenedModals()[0].modal);
    }
    /**
     * Get the higher `z-index` value between all the modal instances. It iterates over the `ModalStack` array and
     * calculates a higher value (it takes the highest index value between all the modal instances and adds 1).
     * Use it to make a modal appear foreground.
     *
     * @returns a higher index from all the existing modal instances.
     */
    getHigherIndex() {
        return Math.max(...this._modalStack.map((o) => o.modal.layerPosition), 1041) + 1;
    }
    /**
     * It gives the number of modal instances. It's helpful to know if the modal stack is empty or not.
     *
     * @returns the number of modal instances.
     */
    getModalStackCount() {
        return this._modalStack.length;
    }
    /**
     * Remove a modal instance from the modal stack.
     * Returns the removed modal instance or undefined if no modal was found
     *
     * @param id The modal identifier.
     * @returns the removed modal instance.
     */
    removeModal(id) {
        const i = this._modalStack.findIndex((o) => o.id === id);
        if (i < 0) {
            return;
        }
        const modalInstance = this._modalStack.splice(i, 1)[0];
        return modalInstance;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalStackService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalStackService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalStackService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });

class NgxSmartModalService {
    constructor(_appRef, _injector, _modalStack, applicationRef, _document, _platformId) {
        this._appRef = _appRef;
        this._injector = _injector;
        this._modalStack = _modalStack;
        this.applicationRef = applicationRef;
        this._document = _document;
        this._platformId = _platformId;
        /**
         * Close the latest opened modal if escape key event is emitted
         * @param event The Keyboard Event
         */
        this._escapeKeyboardEvent = (event) => {
            if (event.key === 'Escape') {
                try {
                    const modal = this.getTopOpenedModal();
                    if (!modal.escapable) {
                        return false;
                    }
                    modal.onEscape.emit(modal);
                    this.closeLatestModal();
                    return true;
                }
                catch (e) {
                    return false;
                }
            }
            return false;
        };
        /**
         * While modal is open, the focus stay on it
         * @param event The Keyboar dEvent
         */
        this._trapFocusModal = (event) => {
            if (event.key === 'Tab') {
                try {
                    const modal = this.getTopOpenedModal();
                    if (!modal.nsmDialog.first.nativeElement.contains(document.activeElement)) {
                        event.preventDefault();
                        event.stopPropagation();
                        modal.nsmDialog.first.nativeElement.focus();
                    }
                    return true;
                }
                catch (e) {
                    return false;
                }
            }
            return false;
        };
        this._addEvents();
    }
    /**
     * Add a new modal instance. This step is essential and allows to retrieve any modal at any time.
     * It stores an object that contains the given modal identifier and the modal itself directly in the `modalStack`.
     *
     * @param modalInstance The object that contains the given modal identifier and the modal itself.
     * @param force Optional parameter that forces the overriding of modal instance if it already exists.
     * @returns nothing special.
     */
    addModal(modalInstance, force) {
        this._modalStack.addModal(modalInstance, force);
    }
    /**
     * Retrieve a modal instance by its identifier.
     *
     * @param id The modal identifier used at creation time.
     */
    getModal(id) {
        return this._modalStack.getModal(id);
    }
    /**
     * Alias of `getModal` to retrieve a modal instance by its identifier.
     *
     * @param id The modal identifier used at creation time.
     */
    get(id) {
        return this.getModal(id);
    }
    /**
     * Open a given modal
     *
     * @param id The modal identifier used at creation time.
     * @param force Tell the modal to open top of all other opened modals
     */
    open(id, force = false) {
        return this._openModal(this.get(id), force);
    }
    /**
     * Close a given modal
     *
     * @param id The modal identifier used at creation time.
     */
    close(id) {
        return this._closeModal(this.get(id));
    }
    /**
     * Close all opened modals
     */
    closeAll() {
        this.getOpenedModals().forEach((instance) => {
            this._closeModal(instance.modal);
        });
    }
    /**
     * Toggles a given modal
     * If the retrieved modal is opened it closes it, else it opens it.
     *
     * @param id The modal identifier used at creation time.
     * @param force Tell the modal to open top of all other opened modals
     */
    toggle(id, force = false) {
        return this._toggleModal(this.get(id), force);
    }
    /**
     * Retrieve all the created modals.
     *
     * @returns an array that contains all modal instances.
     */
    getModalStack() {
        return this._modalStack.getModalStack();
    }
    /**
     * Retrieve all the opened modals. It looks for all modal instances with their `visible` property set to `true`.
     *
     * @returns an array that contains all the opened modals.
     */
    getOpenedModals() {
        return this._modalStack.getOpenedModals();
    }
    /**
     * Retrieve the opened modal with highest z-index.
     *
     * @returns the opened modal with highest z-index.
     */
    getTopOpenedModal() {
        return this._modalStack.getTopOpenedModal();
    }
    /**
     * Get the higher `z-index` value between all the modal instances. It iterates over the `ModalStack` array and
     * calculates a higher value (it takes the highest index value between all the modal instances and adds 1).
     * Use it to make a modal appear foreground.
     *
     * @returns a higher index from all the existing modal instances.
     */
    getHigherIndex() {
        return this._modalStack.getHigherIndex();
    }
    /**
     * It gives the number of modal instances. It's helpful to know if the modal stack is empty or not.
     *
     * @returns the number of modal instances.
     */
    getModalStackCount() {
        return this._modalStack.getModalStackCount();
    }
    /**
     * Remove a modal instance from the modal stack.
     *
     * @param id The modal identifier.
     * @returns the removed modal instance.
     */
    removeModal(id) {
        const modalInstance = this._modalStack.removeModal(id);
        if (modalInstance) {
            this._destroyModal(modalInstance.modal);
        }
    }
    /**
     * Associate data to an identified modal. If the modal isn't already associated to some data, it creates a new
     * entry in the `modalData` array with its `id` and the given `data`. If the modal already has data, it rewrites
     * them with the new ones. Finally if no modal found it returns an error message in the console and false value
     * as method output.
     *
     * @param data The data you want to associate to the modal.
     * @param id The modal identifier.
     * @param force If true, overrides the previous stored data if there was.
     * @returns true if the given modal exists and the process has been tried, either false.
     */
    setModalData(data, id, force) {
        const modal = this.get(id);
        if (modal) {
            modal.setData(data, force);
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Retrieve modal data by its identifier.
     *
     * @param id The modal identifier used at creation time.
     * @returns the associated modal data.
     */
    getModalData(id) {
        const modal = this.get(id);
        if (modal) {
            return modal.getData();
        }
        return null;
    }
    /**
     * Reset the data attached to a given modal.
     *
     * @param id The modal identifier used at creation time.
     * @returns the removed data or false if modal doesn't exist.
     */
    resetModalData(id) {
        if (this._modalStack.getModalStack().find((o) => o.id === id)) {
            const removed = this.getModal(id).getData();
            this.getModal(id).removeData();
            return removed;
        }
        else {
            return false;
        }
    }
    /**
     * Close the latest opened modal
     */
    closeLatestModal() {
        this.getTopOpenedModal().close();
    }
    /**
     * Create dynamic NgxSmartModalComponent
     * @param vcr A ViewContainerRef reference
     * @param id The modal identifier used at creation time
     * @param content The modal content (string, templateRef or Component)
     * @param options Any NgxSmartModalComponent available options
     */
    create(id, content, vcr, options = {}) {
        try {
            return this.getModal(id);
        }
        catch (e) {
            const ngContent = this._resolveNgContent(content);
            const componentRef = vcr.createComponent(NgxSmartModalComponent, { injector: this._injector, projectableNodes: ngContent });
            if (content instanceof Type) {
                componentRef.instance.contentComponent = content;
            }
            componentRef.instance.identifier = id;
            componentRef.instance.createFrom = 'service';
            if (typeof options.closable === 'boolean') {
                componentRef.instance.closable = options.closable;
            }
            if (typeof options.escapable === 'boolean') {
                componentRef.instance.escapable = options.escapable;
            }
            if (typeof options.dismissable === 'boolean') {
                componentRef.instance.dismissable = options.dismissable;
            }
            if (typeof options.customClass === 'string') {
                componentRef.instance.customClass = options.customClass;
            }
            if (typeof options.backdrop === 'boolean') {
                componentRef.instance.backdrop = options.backdrop;
            }
            if (typeof options.force === 'boolean') {
                componentRef.instance.force = options.force;
            }
            if (typeof options.hideDelay === 'number') {
                componentRef.instance.hideDelay = options.hideDelay;
            }
            if (typeof options.autostart === 'boolean') {
                componentRef.instance.autostart = options.autostart;
            }
            if (typeof options.target === 'string') {
                componentRef.instance.target = options.target;
            }
            if (typeof options.ariaLabel === 'string') {
                componentRef.instance.ariaLabel = options.ariaLabel;
            }
            if (typeof options.ariaLabelledBy === 'string') {
                componentRef.instance.ariaLabelledBy = options.ariaLabelledBy;
            }
            if (typeof options.ariaDescribedBy === 'string') {
                componentRef.instance.ariaDescribedBy = options.ariaDescribedBy;
            }
            if (typeof options.refocus === 'boolean') {
                componentRef.instance.refocus = options.refocus;
            }
            const domElem = componentRef.hostView.rootNodes[0];
            this._document.body.appendChild(domElem);
            return componentRef.instance;
        }
    }
    _addEvents() {
        if (!this.isBrowser) {
            return false;
        }
        window.addEventListener(NgxSmartModalConfig.prefixEvent + 'create', ((e) => {
            this._initModal(e.detail.instance);
        }));
        window.addEventListener(NgxSmartModalConfig.prefixEvent + 'delete', ((e) => {
            this._deleteModal(e.detail.instance);
        }));
        window.addEventListener(NgxSmartModalConfig.prefixEvent + 'open', ((e) => {
            this._openModal(e.detail.instance.modal, e.detail.extraData.top);
        }));
        window.addEventListener(NgxSmartModalConfig.prefixEvent + 'toggle', ((e) => {
            this._toggleModal(e.detail.instance.modal, e.detail.extraData.top);
        }));
        window.addEventListener(NgxSmartModalConfig.prefixEvent + 'close', ((e) => {
            this._closeModal(e.detail.instance.modal);
        }));
        window.addEventListener(NgxSmartModalConfig.prefixEvent + 'dismiss', ((e) => {
            this._dismissModal(e.detail.instance.modal);
        }));
        window.addEventListener('keyup', this._escapeKeyboardEvent);
        return true;
    }
    _initModal(modalInstance) {
        modalInstance.modal.layerPosition += this.getModalStackCount();
        this.addModal(modalInstance, modalInstance.modal.force);
        if (modalInstance.modal.autostart) {
            this.open(modalInstance.id);
        }
    }
    _openModal(modal, top) {
        if (modal.visible) {
            return false;
        }
        this.lastElementFocused = document.activeElement;
        if (modal.escapable) {
            window.addEventListener('keyup', this._escapeKeyboardEvent);
        }
        if (modal.backdrop) {
            window.addEventListener('keydown', this._trapFocusModal);
        }
        if (top) {
            modal.layerPosition = this.getHigherIndex();
        }
        modal.addBodyClass();
        modal.overlayVisible = true;
        modal.visible = true;
        modal.onOpen.emit(modal);
        modal.markForCheck();
        setTimeout(() => {
            modal.openedClass = true;
            if (modal.target) {
                modal.targetPlacement();
            }
            modal.nsmDialog.first.nativeElement.setAttribute('role', 'dialog');
            modal.nsmDialog.first.nativeElement.setAttribute('tabIndex', '-1');
            modal.nsmDialog.first.nativeElement.setAttribute('aria-modal', 'true');
            modal.nsmDialog.first.nativeElement.focus();
            modal.markForCheck();
            modal.onOpenFinished.emit(modal);
        });
        return true;
    }
    _toggleModal(modal, top) {
        if (modal.visible) {
            return this._closeModal(modal);
        }
        else {
            return this._openModal(modal, top);
        }
    }
    _closeModal(modal) {
        if (!modal.openedClass) {
            return false;
        }
        modal.openedClass = false;
        modal.onClose.emit(modal);
        modal.onAnyCloseEvent.emit(modal);
        if (this.getOpenedModals().length < 2) {
            modal.removeBodyClass();
            window.removeEventListener('keyup', this._escapeKeyboardEvent);
            window.removeEventListener('keydown', this._trapFocusModal);
        }
        setTimeout(() => {
            modal.visibleChange.emit(modal.visible);
            modal.visible = false;
            modal.overlayVisible = false;
            modal.nsmDialog.first.nativeElement.removeAttribute('tabIndex');
            modal.markForCheck();
            modal.onCloseFinished.emit(modal);
            modal.onAnyCloseEventFinished.emit(modal);
            if (modal.refocus) {
                this.lastElementFocused.focus();
            }
        }, modal.hideDelay);
        return true;
    }
    _dismissModal(modal) {
        if (!modal.openedClass) {
            return false;
        }
        modal.openedClass = false;
        modal.onDismiss.emit(modal);
        modal.onAnyCloseEvent.emit(modal);
        if (this.getOpenedModals().length < 2) {
            modal.removeBodyClass();
        }
        setTimeout(() => {
            modal.visible = false;
            modal.visibleChange.emit(modal.visible);
            modal.overlayVisible = false;
            modal.markForCheck();
            modal.onDismissFinished.emit(modal);
            modal.onAnyCloseEventFinished.emit(modal);
        }, modal.hideDelay);
        return true;
    }
    _deleteModal(modalInstance) {
        this.removeModal(modalInstance.id);
        if (!this.getModalStack().length) {
            modalInstance.modal.removeBodyClass();
        }
    }
    /**
     * Resolve content according to the types
     * @param content The modal content (string, templateRef or Component)
     */
    _resolveNgContent(content) {
        if (typeof content === 'string') {
            const element = this._document.createTextNode(content);
            return [[element]];
        }
        if (content instanceof TemplateRef) {
            const viewRef = content.createEmbeddedView(null);
            this.applicationRef.attachView(viewRef);
            return [viewRef.rootNodes];
        }
        return [];
    }
    /**
     * Is current platform browser
     */
    get isBrowser() {
        return isPlatformBrowser(this._platformId);
    }
    /**
     * Remove dynamically created modal from DOM
     */
    _destroyModal(modal) {
        // Prevent destruction of the inline modals
        if (modal.createFrom !== 'service') {
            return;
        }
        this._document.body.removeChild(modal.elementRef.nativeElement);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalService, deps: [{ token: i0.ApplicationRef }, { token: i0.Injector }, { token: NgxSmartModalStackService }, { token: i0.ApplicationRef }, { token: DOCUMENT }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i0.ApplicationRef }, { type: i0.Injector }, { type: NgxSmartModalStackService }, { type: i0.ApplicationRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });

/*
 * Public API Surface of ngx-smart-modal
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NgxSmartModalComponent, NgxSmartModalService };
//# sourceMappingURL=ngx-smart-modal.mjs.map
