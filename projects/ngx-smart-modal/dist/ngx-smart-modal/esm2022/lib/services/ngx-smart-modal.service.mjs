import { Inject, Injectable, PLATFORM_ID, TemplateRef, Type } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NgxSmartModalComponent } from '../components/ngx-smart-modal.component';
import { NgxSmartModalConfig } from '../config/ngx-smart-modal.config';
import * as i0 from "@angular/core";
import * as i1 from "./ngx-smart-modal-stack.service";
export class NgxSmartModalService {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalService, deps: [{ token: i0.ApplicationRef }, { token: i0.Injector }, { token: i1.NgxSmartModalStackService }, { token: i0.ApplicationRef }, { token: DOCUMENT }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i0.ApplicationRef }, { type: i0.Injector }, { type: i1.NgxSmartModalStackService }, { type: i0.ApplicationRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNtYXJ0LW1vZGFsLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL3NlcnZpY2VzL25neC1zbWFydC1tb2RhbC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBbUMsTUFBTSxFQUFFLFVBQVUsRUFBWSxXQUFXLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBb0IsTUFBTSxlQUFlLENBQUM7QUFDaEosT0FBTyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzlELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ2pGLE9BQU8sRUFBeUIsbUJBQW1CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7O0FBUzlGLE1BQU0sT0FBTyxvQkFBb0I7SUFHL0IsWUFDVSxPQUF1QixFQUN2QixTQUFtQixFQUNuQixXQUFzQyxFQUN0QyxjQUE4QixFQUNaLFNBQWMsRUFDWCxXQUFnQjtRQUxyQyxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUN2QixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQ25CLGdCQUFXLEdBQVgsV0FBVyxDQUEyQjtRQUN0QyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDWixjQUFTLEdBQVQsU0FBUyxDQUFLO1FBQ1gsZ0JBQVcsR0FBWCxXQUFXLENBQUs7UUE4Wi9DOzs7V0FHRztRQUNLLHlCQUFvQixHQUFHLENBQUMsS0FBb0IsRUFBRSxFQUFFO1lBQ3RELElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxRQUFRLEVBQUU7Z0JBQzFCLElBQUk7b0JBQ0YsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7b0JBRXZDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFO3dCQUNwQixPQUFPLEtBQUssQ0FBQztxQkFDZDtvQkFFRCxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FB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QUFtQjtRQUM5QyxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtZQUMvQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2RCxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ3BCO1FBRUQsSUFBSSxPQUFPLFlBQVksV0FBVyxFQUFFO1lBQ2xDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFXLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN4QyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzVCO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBMkJEOztPQUVHO0lBQ0gsSUFBWSxTQUFTO1FBQ25CLE9BQU8saUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUEwQkQ7O09BRUc7SUFDSyxhQUFhLENBQUMsS0FBNkI7UUFDakQsMkNBQTJDO1FBQzNDLElBQUksS0FBSyxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7WUFDbEMsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDbEUsQ0FBQzsrR0F6ZVUsb0JBQW9CLCtJQVFyQixRQUFRLGFBQ1IsV0FBVzttSEFUVixvQkFBb0IsY0FGbkIsTUFBTTs7NEZBRVAsb0JBQW9CO2tCQUhoQyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7MEJBU0ksTUFBTTsyQkFBQyxRQUFROzswQkFDZixNQUFNOzJCQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBsaWNhdGlvblJlZiwgRW1iZWRkZWRWaWV3UmVmLCBJbmplY3QsIEluamVjdGFibGUsIEluamVjdG9yLCBQTEFURk9STV9JRCwgVGVtcGxhdGVSZWYsIFR5cGUsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERPQ1VNRU5ULCBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ3hTbWFydE1vZGFsQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9uZ3gtc21hcnQtbW9kYWwuY29tcG9uZW50JztcbmltcG9ydCB7IElOZ3hTbWFydE1vZGFsT3B0aW9ucywgTmd4U21hcnRNb2RhbENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9uZ3gtc21hcnQtbW9kYWwuY29uZmlnJztcbmltcG9ydCB7IE5neFNtYXJ0TW9kYWxTdGFja1NlcnZpY2UgfSBmcm9tICcuL25neC1zbWFydC1tb2RhbC1zdGFjay5zZXJ2aWNlJztcbmltcG9ydCB7IE1vZGFsSW5zdGFuY2UgfSBmcm9tICcuL21vZGFsLWluc3RhbmNlJztcblxuZXhwb3J0IHR5cGUgQ29udGVudDxUPiA9IHN0cmluZyB8IFRlbXBsYXRlUmVmPFQ+IHwgVHlwZTxUPjtcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmd4U21hcnRNb2RhbFNlcnZpY2Uge1xuICBwcml2YXRlIGxhc3RFbGVtZW50Rm9jdXNlZDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2FwcFJlZjogQXBwbGljYXRpb25SZWYsXG4gICAgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByaXZhdGUgX21vZGFsU3RhY2s6IE5neFNtYXJ0TW9kYWxTdGFja1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBhcHBsaWNhdGlvblJlZjogQXBwbGljYXRpb25SZWYsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIF9wbGF0Zm9ybUlkOiBhbnlcbiAgKSB7XG4gICAgdGhpcy5fYWRkRXZlbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IG1vZGFsIGluc3RhbmNlLiBUaGlzIHN0ZXAgaXMgZXNzZW50aWFsIGFuZCBhbGxvd3MgdG8gcmV0cmlldmUgYW55IG1vZGFsIGF0IGFueSB0aW1lLlxuICAgKiBJdCBzdG9yZXMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIGdpdmVuIG1vZGFsIGlkZW50aWZpZXIgYW5kIHRoZSBtb2RhbCBpdHNlbGYgZGlyZWN0bHkgaW4gdGhlIGBtb2RhbFN0YWNrYC5cbiAgICpcbiAgICogQHBhcmFtIG1vZGFsSW5zdGFuY2UgVGhlIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBnaXZlbiBtb2RhbCBpZGVudGlmaWVyIGFuZCB0aGUgbW9kYWwgaXRzZWxmLlxuICAgKiBAcGFyYW0gZm9yY2UgT3B0aW9uYWwgcGFyYW1ldGVyIHRoYXQgZm9yY2VzIHRoZSBvdmVycmlkaW5nIG9mIG1vZGFsIGluc3RhbmNlIGlmIGl0IGFscmVhZHkgZXhpc3RzLlxuICAgKiBAcmV0dXJucyBub3RoaW5nIHNwZWNpYWwuXG4gICAqL1xuICBwdWJsaWMgYWRkTW9kYWwobW9kYWxJbnN0YW5jZTogTW9kYWxJbnN0YW5jZSwgZm9yY2U/OiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5fbW9kYWxTdGFjay5hZGRNb2RhbChtb2RhbEluc3RhbmNlLCBmb3JjZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYSBtb2RhbCBpbnN0YW5jZSBieSBpdHMgaWRlbnRpZmllci5cbiAgICpcbiAgICogQHBhcmFtIGlkIFRoZSBtb2RhbCBpZGVudGlmaWVyIHVzZWQgYXQgY3JlYXRpb24gdGltZS5cbiAgICovXG4gIHB1YmxpYyBnZXRNb2RhbChpZDogc3RyaW5nKTogTmd4U21hcnRNb2RhbENvbXBvbmVudCB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGFsU3RhY2suZ2V0TW9kYWwoaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsaWFzIG9mIGBnZXRNb2RhbGAgdG8gcmV0cmlldmUgYSBtb2RhbCBpbnN0YW5jZSBieSBpdHMgaWRlbnRpZmllci5cbiAgICpcbiAgICogQHBhcmFtIGlkIFRoZSBtb2RhbCBpZGVudGlmaWVyIHVzZWQgYXQgY3JlYXRpb24gdGltZS5cbiAgICovXG4gIHB1YmxpYyBnZXQoaWQ6IHN0cmluZyk6IE5neFNtYXJ0TW9kYWxDb21wb25lbnQge1xuICAgIHJldHVybiB0aGlzLmdldE1vZGFsKGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVuIGEgZ2l2ZW4gbW9kYWxcbiAgICpcbiAgICogQHBhcmFtIGlkIFRoZSBtb2RhbCBpZGVudGlmaWVyIHVzZWQgYXQgY3JlYXRpb24gdGltZS5cbiAgICogQHBhcmFtIGZvcmNlIFRlbGwgdGhlIG1vZGFsIHRvIG9wZW4gdG9wIG9mIGFsbCBvdGhlciBvcGVuZWQgbW9kYWxzXG4gICAqL1xuICBwdWJsaWMgb3BlbihpZDogc3RyaW5nLCBmb3JjZSA9IGZhbHNlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX29wZW5Nb2RhbCh0aGlzLmdldChpZCksIGZvcmNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZSBhIGdpdmVuIG1vZGFsXG4gICAqXG4gICAqIEBwYXJhbSBpZCBUaGUgbW9kYWwgaWRlbnRpZmllciB1c2VkIGF0IGNyZWF0aW9uIHRpbWUuXG4gICAqL1xuICBwdWJsaWMgY2xvc2UoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9jbG9zZU1vZGFsKHRoaXMuZ2V0KGlkKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2UgYWxsIG9wZW5lZCBtb2RhbHNcbiAgICovXG4gIHB1YmxpYyBjbG9zZUFsbCgpOiB2b2lkIHtcbiAgICB0aGlzLmdldE9wZW5lZE1vZGFscygpLmZvckVhY2goKGluc3RhbmNlOiBNb2RhbEluc3RhbmNlKSA9PiB7XG4gICAgICB0aGlzLl9jbG9zZU1vZGFsKGluc3RhbmNlLm1vZGFsKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIGEgZ2l2ZW4gbW9kYWxcbiAgICogSWYgdGhlIHJldHJpZXZlZCBtb2RhbCBpcyBvcGVuZWQgaXQgY2xvc2VzIGl0LCBlbHNlIGl0IG9wZW5zIGl0LlxuICAgKlxuICAgKiBAcGFyYW0gaWQgVGhlIG1vZGFsIGlkZW50aWZpZXIgdXNlZCBhdCBjcmVhdGlvbiB0aW1lLlxuICAgKiBAcGFyYW0gZm9yY2UgVGVsbCB0aGUgbW9kYWwgdG8gb3BlbiB0b3Agb2YgYWxsIG90aGVyIG9wZW5lZCBtb2RhbHNcbiAgICovXG4gIHB1YmxpYyB0b2dnbGUoaWQ6IHN0cmluZywgZm9yY2UgPSBmYWxzZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl90b2dnbGVNb2RhbCh0aGlzLmdldChpZCksIGZvcmNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhbGwgdGhlIGNyZWF0ZWQgbW9kYWxzLlxuICAgKlxuICAgKiBAcmV0dXJucyBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIGFsbCBtb2RhbCBpbnN0YW5jZXMuXG4gICAqL1xuICBwdWJsaWMgZ2V0TW9kYWxTdGFjaygpOiBNb2RhbEluc3RhbmNlW10ge1xuICAgIHJldHVybiB0aGlzLl9tb2RhbFN0YWNrLmdldE1vZGFsU3RhY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhbGwgdGhlIG9wZW5lZCBtb2RhbHMuIEl0IGxvb2tzIGZvciBhbGwgbW9kYWwgaW5zdGFuY2VzIHdpdGggdGhlaXIgYHZpc2libGVgIHByb3BlcnR5IHNldCB0byBgdHJ1ZWAuXG4gICAqXG4gICAqIEByZXR1cm5zIGFuIGFycmF5IHRoYXQgY29udGFpbnMgYWxsIHRoZSBvcGVuZWQgbW9kYWxzLlxuICAgKi9cbiAgcHVibGljIGdldE9wZW5lZE1vZGFscygpOiBNb2RhbEluc3RhbmNlW10ge1xuICAgIHJldHVybiB0aGlzLl9tb2RhbFN0YWNrLmdldE9wZW5lZE1vZGFscygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIHRoZSBvcGVuZWQgbW9kYWwgd2l0aCBoaWdoZXN0IHotaW5kZXguXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSBvcGVuZWQgbW9kYWwgd2l0aCBoaWdoZXN0IHotaW5kZXguXG4gICAqL1xuICBwdWJsaWMgZ2V0VG9wT3BlbmVkTW9kYWwoKTogTmd4U21hcnRNb2RhbENvbXBvbmVudCB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGFsU3RhY2suZ2V0VG9wT3BlbmVkTW9kYWwoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGhpZ2hlciBgei1pbmRleGAgdmFsdWUgYmV0d2VlbiBhbGwgdGhlIG1vZGFsIGluc3RhbmNlcy4gSXQgaXRlcmF0ZXMgb3ZlciB0aGUgYE1vZGFsU3RhY2tgIGFycmF5IGFuZFxuICAgKiBjYWxjdWxhdGVzIGEgaGlnaGVyIHZhbHVlIChpdCB0YWtlcyB0aGUgaGlnaGVzdCBpbmRleCB2YWx1ZSBiZXR3ZWVuIGFsbCB0aGUgbW9kYWwgaW5zdGFuY2VzIGFuZCBhZGRzIDEpLlxuICAgKiBVc2UgaXQgdG8gbWFrZSBhIG1vZGFsIGFwcGVhciBmb3JlZ3JvdW5kLlxuICAgKlxuICAgKiBAcmV0dXJucyBhIGhpZ2hlciBpbmRleCBmcm9tIGFsbCB0aGUgZXhpc3RpbmcgbW9kYWwgaW5zdGFuY2VzLlxuICAgKi9cbiAgcHVibGljIGdldEhpZ2hlckluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGFsU3RhY2suZ2V0SGlnaGVySW5kZXgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdCBnaXZlcyB0aGUgbnVtYmVyIG9mIG1vZGFsIGluc3RhbmNlcy4gSXQncyBoZWxwZnVsIHRvIGtub3cgaWYgdGhlIG1vZGFsIHN0YWNrIGlzIGVtcHR5IG9yIG5vdC5cbiAgICpcbiAgICogQHJldHVybnMgdGhlIG51bWJlciBvZiBtb2RhbCBpbnN0YW5jZXMuXG4gICAqL1xuICBwdWJsaWMgZ2V0TW9kYWxTdGFja0NvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGFsU3RhY2suZ2V0TW9kYWxTdGFja0NvdW50KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbW9kYWwgaW5zdGFuY2UgZnJvbSB0aGUgbW9kYWwgc3RhY2suXG4gICAqXG4gICAqIEBwYXJhbSBpZCBUaGUgbW9kYWwgaWRlbnRpZmllci5cbiAgICogQHJldHVybnMgdGhlIHJlbW92ZWQgbW9kYWwgaW5zdGFuY2UuXG4gICAqL1xuICBwdWJsaWMgcmVtb3ZlTW9kYWwoaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IG1vZGFsSW5zdGFuY2UgPSB0aGlzLl9tb2RhbFN0YWNrLnJlbW92ZU1vZGFsKGlkKTtcbiAgICBpZiAobW9kYWxJbnN0YW5jZSkge1xuICAgICAgdGhpcy5fZGVzdHJveU1vZGFsKG1vZGFsSW5zdGFuY2UubW9kYWwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NvY2lhdGUgZGF0YSB0byBhbiBpZGVudGlmaWVkIG1vZGFsLiBJZiB0aGUgbW9kYWwgaXNuJ3QgYWxyZWFkeSBhc3NvY2lhdGVkIHRvIHNvbWUgZGF0YSwgaXQgY3JlYXRlcyBhIG5ld1xuICAgKiBlbnRyeSBpbiB0aGUgYG1vZGFsRGF0YWAgYXJyYXkgd2l0aCBpdHMgYGlkYCBhbmQgdGhlIGdpdmVuIGBkYXRhYC4gSWYgdGhlIG1vZGFsIGFscmVhZHkgaGFzIGRhdGEsIGl0IHJld3JpdGVzXG4gICAqIHRoZW0gd2l0aCB0aGUgbmV3IG9uZXMuIEZpbmFsbHkgaWYgbm8gbW9kYWwgZm91bmQgaXQgcmV0dXJucyBhbiBlcnJvciBtZXNzYWdlIGluIHRoZSBjb25zb2xlIGFuZCBmYWxzZSB2YWx1ZVxuICAgKiBhcyBtZXRob2Qgb3V0cHV0LlxuICAgKlxuICAgKiBAcGFyYW0gZGF0YSBUaGUgZGF0YSB5b3Ugd2FudCB0byBhc3NvY2lhdGUgdG8gdGhlIG1vZGFsLlxuICAgKiBAcGFyYW0gaWQgVGhlIG1vZGFsIGlkZW50aWZpZXIuXG4gICAqIEBwYXJhbSBmb3JjZSBJZiB0cnVlLCBvdmVycmlkZXMgdGhlIHByZXZpb3VzIHN0b3JlZCBkYXRhIGlmIHRoZXJlIHdhcy5cbiAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gbW9kYWwgZXhpc3RzIGFuZCB0aGUgcHJvY2VzcyBoYXMgYmVlbiB0cmllZCwgZWl0aGVyIGZhbHNlLlxuICAgKi9cbiAgcHVibGljIHNldE1vZGFsRGF0YShkYXRhOiBhbnksIGlkOiBzdHJpbmcsIGZvcmNlPzogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG1vZGFsID0gdGhpcy5nZXQoaWQpO1xuICAgIGlmIChtb2RhbCkge1xuICAgICAgbW9kYWwuc2V0RGF0YShkYXRhLCBmb3JjZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBtb2RhbCBkYXRhIGJ5IGl0cyBpZGVudGlmaWVyLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgVGhlIG1vZGFsIGlkZW50aWZpZXIgdXNlZCBhdCBjcmVhdGlvbiB0aW1lLlxuICAgKiBAcmV0dXJucyB0aGUgYXNzb2NpYXRlZCBtb2RhbCBkYXRhLlxuICAgKi9cbiAgcHVibGljIGdldE1vZGFsRGF0YShpZDogc3RyaW5nKTogdW5rbm93biB7XG4gICAgY29uc3QgbW9kYWwgPSB0aGlzLmdldChpZCk7XG4gICAgaWYgKG1vZGFsKSB7XG4gICAgICByZXR1cm4gbW9kYWwuZ2V0RGF0YSgpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBkYXRhIGF0dGFjaGVkIHRvIGEgZ2l2ZW4gbW9kYWwuXG4gICAqXG4gICAqIEBwYXJhbSBpZCBUaGUgbW9kYWwgaWRlbnRpZmllciB1c2VkIGF0IGNyZWF0aW9uIHRpbWUuXG4gICAqIEByZXR1cm5zIHRoZSByZW1vdmVkIGRhdGEgb3IgZmFsc2UgaWYgbW9kYWwgZG9lc24ndCBleGlzdC5cbiAgICovXG4gIHB1YmxpYyByZXNldE1vZGFsRGF0YShpZDogc3RyaW5nKTogdW5rbm93biB8IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl9tb2RhbFN0YWNrLmdldE1vZGFsU3RhY2soKS5maW5kKChvOiBNb2RhbEluc3RhbmNlKSA9PiBvLmlkID09PSBpZCkpIHtcbiAgICAgIGNvbnN0IHJlbW92ZWQ6IHVua25vd24gPSB0aGlzLmdldE1vZGFsKGlkKS5nZXREYXRhKCk7XG4gICAgICB0aGlzLmdldE1vZGFsKGlkKS5yZW1vdmVEYXRhKCk7XG4gICAgICByZXR1cm4gcmVtb3ZlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZSB0aGUgbGF0ZXN0IG9wZW5lZCBtb2RhbFxuICAgKi9cbiAgcHVibGljIGNsb3NlTGF0ZXN0TW9kYWwoKTogdm9pZCB7XG4gICAgdGhpcy5nZXRUb3BPcGVuZWRNb2RhbCgpLmNsb3NlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGR5bmFtaWMgTmd4U21hcnRNb2RhbENvbXBvbmVudFxuICAgKiBAcGFyYW0gdmNyIEEgVmlld0NvbnRhaW5lclJlZiByZWZlcmVuY2VcbiAgICogQHBhcmFtIGlkIFRoZSBtb2RhbCBpZGVudGlmaWVyIHVzZWQgYXQgY3JlYXRpb24gdGltZVxuICAgKiBAcGFyYW0gY29udGVudCBUaGUgbW9kYWwgY29udGVudCAoc3RyaW5nLCB0ZW1wbGF0ZVJlZiBvciBDb21wb25lbnQpXG4gICAqIEBwYXJhbSBvcHRpb25zIEFueSBOZ3hTbWFydE1vZGFsQ29tcG9uZW50IGF2YWlsYWJsZSBvcHRpb25zXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlPFQ+KGlkOiBzdHJpbmcsIGNvbnRlbnQ6IENvbnRlbnQ8VD4sIHZjcjogVmlld0NvbnRhaW5lclJlZiwgb3B0aW9uczogSU5neFNtYXJ0TW9kYWxPcHRpb25zID0ge30pIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0TW9kYWwoaWQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnN0IG5nQ29udGVudCA9IHRoaXMuX3Jlc29sdmVOZ0NvbnRlbnQoY29udGVudCk7XG5cbiAgICAgIGNvbnN0IGNvbXBvbmVudFJlZiA9IHZjci5jcmVhdGVDb21wb25lbnQoTmd4U21hcnRNb2RhbENvbXBvbmVudCwgeyBpbmplY3RvcjogdGhpcy5faW5qZWN0b3IsIHByb2plY3RhYmxlTm9kZXM6IG5nQ29udGVudCB9KTtcblxuICAgICAgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBUeXBlKSB7XG4gICAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5jb250ZW50Q29tcG9uZW50ID0gY29udGVudDtcbiAgICAgIH1cblxuICAgICAgY29tcG9uZW50UmVmLmluc3RhbmNlLmlkZW50aWZpZXIgPSBpZDtcbiAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5jcmVhdGVGcm9tID0gJ3NlcnZpY2UnO1xuXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2xvc2FibGUgPT09ICdib29sZWFuJykgeyBjb21wb25lbnRSZWYuaW5zdGFuY2UuY2xvc2FibGUgPSBvcHRpb25zLmNsb3NhYmxlOyB9XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMuZXNjYXBhYmxlID09PSAnYm9vbGVhbicpIHsgY29tcG9uZW50UmVmLmluc3RhbmNlLmVzY2FwYWJsZSA9IG9wdGlvbnMuZXNjYXBhYmxlOyB9XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMuZGlzbWlzc2FibGUgPT09ICdib29sZWFuJykgeyBjb21wb25lbnRSZWYuaW5zdGFuY2UuZGlzbWlzc2FibGUgPSBvcHRpb25zLmRpc21pc3NhYmxlOyB9XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMuY3VzdG9tQ2xhc3MgPT09ICdzdHJpbmcnKSB7IGNvbXBvbmVudFJlZi5pbnN0YW5jZS5jdXN0b21DbGFzcyA9IG9wdGlvbnMuY3VzdG9tQ2xhc3M7IH1cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5iYWNrZHJvcCA9PT0gJ2Jvb2xlYW4nKSB7IGNvbXBvbmVudFJlZi5pbnN0YW5jZS5iYWNrZHJvcCA9IG9wdGlvbnMuYmFja2Ryb3A7IH1cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5mb3JjZSA9PT0gJ2Jvb2xlYW4nKSB7IGNvbXBvbmVudFJlZi5pbnN0YW5jZS5mb3JjZSA9IG9wdGlvbnMuZm9yY2U7IH1cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5oaWRlRGVsYXkgPT09ICdudW1iZXInKSB7IGNvbXBvbmVudFJlZi5pbnN0YW5jZS5oaWRlRGVsYXkgPSBvcHRpb25zLmhpZGVEZWxheTsgfVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmF1dG9zdGFydCA9PT0gJ2Jvb2xlYW4nKSB7IGNvbXBvbmVudFJlZi5pbnN0YW5jZS5hdXRvc3RhcnQgPSBvcHRpb25zLmF1dG9zdGFydDsgfVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnRhcmdldCA9PT0gJ3N0cmluZycpIHsgY29tcG9uZW50UmVmLmluc3RhbmNlLnRhcmdldCA9IG9wdGlvbnMudGFyZ2V0OyB9XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMuYXJpYUxhYmVsID09PSAnc3RyaW5nJykgeyBjb21wb25lbnRSZWYuaW5zdGFuY2UuYXJpYUxhYmVsID0gb3B0aW9ucy5hcmlhTGFiZWw7IH1cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5hcmlhTGFiZWxsZWRCeSA9PT0gJ3N0cmluZycpIHsgY29tcG9uZW50UmVmLmluc3RhbmNlLmFyaWFMYWJlbGxlZEJ5ID0gb3B0aW9ucy5hcmlhTGFiZWxsZWRCeTsgfVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmFyaWFEZXNjcmliZWRCeSA9PT0gJ3N0cmluZycpIHsgY29tcG9uZW50UmVmLmluc3RhbmNlLmFyaWFEZXNjcmliZWRCeSA9IG9wdGlvbnMuYXJpYURlc2NyaWJlZEJ5OyB9XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMucmVmb2N1cyA9PT0gJ2Jvb2xlYW4nKSB7IGNvbXBvbmVudFJlZi5pbnN0YW5jZS5yZWZvY3VzID0gb3B0aW9ucy5yZWZvY3VzOyB9XG5cbiAgICAgIGNvbnN0IGRvbUVsZW0gPSAoY29tcG9uZW50UmVmLmhvc3RWaWV3IGFzIEVtYmVkZGVkVmlld1JlZjxhbnk+KS5yb290Tm9kZXNbMF0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgICB0aGlzLl9kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvbUVsZW0pO1xuXG4gICAgICByZXR1cm4gY29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2FkZEV2ZW50cygpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuaXNCcm93c2VyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoTmd4U21hcnRNb2RhbENvbmZpZy5wcmVmaXhFdmVudCArICdjcmVhdGUnLCAoKGU6IEN1c3RvbUV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9pbml0TW9kYWwoZS5kZXRhaWwuaW5zdGFuY2UpO1xuICAgIH0pIGFzIEV2ZW50TGlzdGVuZXIpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoTmd4U21hcnRNb2RhbENvbmZpZy5wcmVmaXhFdmVudCArICdkZWxldGUnLCAoKGU6IEN1c3RvbUV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9kZWxldGVNb2RhbChlLmRldGFpbC5pbnN0YW5jZSk7XG4gICAgfSkgYXMgRXZlbnRMaXN0ZW5lcik7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihOZ3hTbWFydE1vZGFsQ29uZmlnLnByZWZpeEV2ZW50ICsgJ29wZW4nLCAoKGU6IEN1c3RvbUV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9vcGVuTW9kYWwoZS5kZXRhaWwuaW5zdGFuY2UubW9kYWwsIGUuZGV0YWlsLmV4dHJhRGF0YS50b3ApO1xuICAgIH0pIGFzIEV2ZW50TGlzdGVuZXIpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoTmd4U21hcnRNb2RhbENvbmZpZy5wcmVmaXhFdmVudCArICd0b2dnbGUnLCAoKGU6IEN1c3RvbUV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl90b2dnbGVNb2RhbChlLmRldGFpbC5pbnN0YW5jZS5tb2RhbCwgZS5kZXRhaWwuZXh0cmFEYXRhLnRvcCk7XG4gICAgfSkgYXMgRXZlbnRMaXN0ZW5lcik7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihOZ3hTbWFydE1vZGFsQ29uZmlnLnByZWZpeEV2ZW50ICsgJ2Nsb3NlJywgKChlOiBDdXN0b21FdmVudCkgPT4ge1xuICAgICAgdGhpcy5fY2xvc2VNb2RhbChlLmRldGFpbC5pbnN0YW5jZS5tb2RhbCk7XG4gICAgfSkgYXMgRXZlbnRMaXN0ZW5lcik7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihOZ3hTbWFydE1vZGFsQ29uZmlnLnByZWZpeEV2ZW50ICsgJ2Rpc21pc3MnLCAoKGU6IEN1c3RvbUV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9kaXNtaXNzTW9kYWwoZS5kZXRhaWwuaW5zdGFuY2UubW9kYWwpO1xuICAgIH0pIGFzIEV2ZW50TGlzdGVuZXIpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5fZXNjYXBlS2V5Ym9hcmRFdmVudCk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgX2luaXRNb2RhbChtb2RhbEluc3RhbmNlOiBNb2RhbEluc3RhbmNlKSB7XG4gICAgbW9kYWxJbnN0YW5jZS5tb2RhbC5sYXllclBvc2l0aW9uICs9IHRoaXMuZ2V0TW9kYWxTdGFja0NvdW50KCk7XG4gICAgdGhpcy5hZGRNb2RhbChtb2RhbEluc3RhbmNlLCBtb2RhbEluc3RhbmNlLm1vZGFsLmZvcmNlKTtcblxuICAgIGlmIChtb2RhbEluc3RhbmNlLm1vZGFsLmF1dG9zdGFydCkge1xuICAgICAgdGhpcy5vcGVuKG1vZGFsSW5zdGFuY2UuaWQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX29wZW5Nb2RhbChtb2RhbDogTmd4U21hcnRNb2RhbENvbXBvbmVudCwgdG9wPzogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIGlmIChtb2RhbC52aXNpYmxlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0RWxlbWVudEZvY3VzZWQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG4gICAgaWYgKG1vZGFsLmVzY2FwYWJsZSkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5fZXNjYXBlS2V5Ym9hcmRFdmVudCk7XG4gICAgfVxuXG4gICAgaWYgKG1vZGFsLmJhY2tkcm9wKSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX3RyYXBGb2N1c01vZGFsKTtcbiAgICB9XG5cbiAgICBpZiAodG9wKSB7XG4gICAgICBtb2RhbC5sYXllclBvc2l0aW9uID0gdGhpcy5nZXRIaWdoZXJJbmRleCgpO1xuICAgIH1cblxuICAgIG1vZGFsLmFkZEJvZHlDbGFzcygpO1xuICAgIG1vZGFsLm92ZXJsYXlWaXNpYmxlID0gdHJ1ZTtcbiAgICBtb2RhbC52aXNpYmxlID0gdHJ1ZTtcbiAgICBtb2RhbC5vbk9wZW4uZW1pdChtb2RhbCk7XG4gICAgbW9kYWwubWFya0ZvckNoZWNrKCk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIG1vZGFsLm9wZW5lZENsYXNzID0gdHJ1ZTtcblxuICAgICAgaWYgKG1vZGFsLnRhcmdldCkge1xuICAgICAgICBtb2RhbC50YXJnZXRQbGFjZW1lbnQoKTtcbiAgICAgIH1cblxuICAgICAgbW9kYWwubnNtRGlhbG9nLmZpcnN0Lm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2RpYWxvZycpO1xuICAgICAgbW9kYWwubnNtRGlhbG9nLmZpcnN0Lm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJJbmRleCcsICctMScpO1xuICAgICAgbW9kYWwubnNtRGlhbG9nLmZpcnN0Lm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLW1vZGFsJywgJ3RydWUnKTtcbiAgICAgIG1vZGFsLm5zbURpYWxvZy5maXJzdC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG5cbiAgICAgIG1vZGFsLm1hcmtGb3JDaGVjaygpO1xuICAgICAgbW9kYWwub25PcGVuRmluaXNoZWQuZW1pdChtb2RhbCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgX3RvZ2dsZU1vZGFsKG1vZGFsOiBOZ3hTbWFydE1vZGFsQ29tcG9uZW50LCB0b3A/OiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgaWYgKG1vZGFsLnZpc2libGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jbG9zZU1vZGFsKG1vZGFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX29wZW5Nb2RhbChtb2RhbCwgdG9wKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jbG9zZU1vZGFsKG1vZGFsOiBOZ3hTbWFydE1vZGFsQ29tcG9uZW50KTogYm9vbGVhbiB7XG4gICAgaWYgKCFtb2RhbC5vcGVuZWRDbGFzcykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG1vZGFsLm9wZW5lZENsYXNzID0gZmFsc2U7XG4gICAgbW9kYWwub25DbG9zZS5lbWl0KG1vZGFsKTtcbiAgICBtb2RhbC5vbkFueUNsb3NlRXZlbnQuZW1pdChtb2RhbCk7XG5cbiAgICBpZiAodGhpcy5nZXRPcGVuZWRNb2RhbHMoKS5sZW5ndGggPCAyKSB7XG4gICAgICBtb2RhbC5yZW1vdmVCb2R5Q2xhc3MoKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuX2VzY2FwZUtleWJvYXJkRXZlbnQpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLl90cmFwRm9jdXNNb2RhbCk7XG4gICAgfVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBtb2RhbC52aXNpYmxlQ2hhbmdlLmVtaXQobW9kYWwudmlzaWJsZSk7XG4gICAgICBtb2RhbC52aXNpYmxlID0gZmFsc2U7XG4gICAgICBtb2RhbC5vdmVybGF5VmlzaWJsZSA9IGZhbHNlO1xuICAgICAgbW9kYWwubnNtRGlhbG9nLmZpcnN0Lm5hdGl2ZUVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCd0YWJJbmRleCcpO1xuICAgICAgbW9kYWwubWFya0ZvckNoZWNrKCk7XG4gICAgICBtb2RhbC5vbkNsb3NlRmluaXNoZWQuZW1pdChtb2RhbCk7XG4gICAgICBtb2RhbC5vbkFueUNsb3NlRXZlbnRGaW5pc2hlZC5lbWl0KG1vZGFsKTtcbiAgICAgIGlmIChtb2RhbC5yZWZvY3VzKSB7XG4gICAgICAgIHRoaXMubGFzdEVsZW1lbnRGb2N1c2VkLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSwgbW9kYWwuaGlkZURlbGF5KTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBfZGlzbWlzc01vZGFsKG1vZGFsOiBOZ3hTbWFydE1vZGFsQ29tcG9uZW50KTogYm9vbGVhbiB7XG4gICAgaWYgKCFtb2RhbC5vcGVuZWRDbGFzcykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG1vZGFsLm9wZW5lZENsYXNzID0gZmFsc2U7XG4gICAgbW9kYWwub25EaXNtaXNzLmVtaXQobW9kYWwpO1xuICAgIG1vZGFsLm9uQW55Q2xvc2VFdmVudC5lbWl0KG1vZGFsKTtcblxuICAgIGlmICh0aGlzLmdldE9wZW5lZE1vZGFscygpLmxlbmd0aCA8IDIpIHtcbiAgICAgIG1vZGFsLnJlbW92ZUJvZHlDbGFzcygpO1xuICAgIH1cblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgbW9kYWwudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgbW9kYWwudmlzaWJsZUNoYW5nZS5lbWl0KG1vZGFsLnZpc2libGUpO1xuICAgICAgbW9kYWwub3ZlcmxheVZpc2libGUgPSBmYWxzZTtcbiAgICAgIG1vZGFsLm1hcmtGb3JDaGVjaygpO1xuICAgICAgbW9kYWwub25EaXNtaXNzRmluaXNoZWQuZW1pdChtb2RhbCk7XG4gICAgICBtb2RhbC5vbkFueUNsb3NlRXZlbnRGaW5pc2hlZC5lbWl0KG1vZGFsKTtcbiAgICB9LCBtb2RhbC5oaWRlRGVsYXkpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIF9kZWxldGVNb2RhbChtb2RhbEluc3RhbmNlOiBNb2RhbEluc3RhbmNlKSB7XG4gICAgdGhpcy5yZW1vdmVNb2RhbChtb2RhbEluc3RhbmNlLmlkKTtcblxuICAgIGlmICghdGhpcy5nZXRNb2RhbFN0YWNrKCkubGVuZ3RoKSB7XG4gICAgICBtb2RhbEluc3RhbmNlLm1vZGFsLnJlbW92ZUJvZHlDbGFzcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNvbHZlIGNvbnRlbnQgYWNjb3JkaW5nIHRvIHRoZSB0eXBlc1xuICAgKiBAcGFyYW0gY29udGVudCBUaGUgbW9kYWwgY29udGVudCAoc3RyaW5nLCB0ZW1wbGF0ZVJlZiBvciBDb21wb25lbnQpXG4gICAqL1xuICBwcml2YXRlIF9yZXNvbHZlTmdDb250ZW50PFQ+KGNvbnRlbnQ6IENvbnRlbnQ8VD4pOiBhbnlbXVtdIHwgVGV4dFtdW10ge1xuICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjb250ZW50KTtcbiAgICAgIHJldHVybiBbW2VsZW1lbnRdXTtcbiAgICB9XG5cbiAgICBpZiAoY29udGVudCBpbnN0YW5jZW9mIFRlbXBsYXRlUmVmKSB7XG4gICAgICBjb25zdCB2aWV3UmVmID0gY29udGVudC5jcmVhdGVFbWJlZGRlZFZpZXcobnVsbCBhcyBhbnkpO1xuICAgICAgdGhpcy5hcHBsaWNhdGlvblJlZi5hdHRhY2hWaWV3KHZpZXdSZWYpO1xuICAgICAgcmV0dXJuIFt2aWV3UmVmLnJvb3ROb2Rlc107XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlIHRoZSBsYXRlc3Qgb3BlbmVkIG1vZGFsIGlmIGVzY2FwZSBrZXkgZXZlbnQgaXMgZW1pdHRlZFxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIEtleWJvYXJkIEV2ZW50XG4gICAqL1xuICBwcml2YXRlIF9lc2NhcGVLZXlib2FyZEV2ZW50ID0gKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG1vZGFsID0gdGhpcy5nZXRUb3BPcGVuZWRNb2RhbCgpO1xuXG4gICAgICAgIGlmICghbW9kYWwuZXNjYXBhYmxlKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgbW9kYWwub25Fc2NhcGUuZW1pdChtb2RhbCk7XG4gICAgICAgIHRoaXMuY2xvc2VMYXRlc3RNb2RhbCgpO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIElzIGN1cnJlbnQgcGxhdGZvcm0gYnJvd3NlclxuICAgKi9cbiAgcHJpdmF0ZSBnZXQgaXNCcm93c2VyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLl9wbGF0Zm9ybUlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGlsZSBtb2RhbCBpcyBvcGVuLCB0aGUgZm9jdXMgc3RheSBvbiBpdFxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIEtleWJvYXIgZEV2ZW50XG4gICAqL1xuICBwcml2YXRlIF90cmFwRm9jdXNNb2RhbCA9IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmIChldmVudC5rZXkgPT09ICdUYWInKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBtb2RhbCA9IHRoaXMuZ2V0VG9wT3BlbmVkTW9kYWwoKTtcblxuICAgICAgICBpZiAoIW1vZGFsLm5zbURpYWxvZy5maXJzdC5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBtb2RhbC5uc21EaWFsb2cuZmlyc3QubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGR5bmFtaWNhbGx5IGNyZWF0ZWQgbW9kYWwgZnJvbSBET01cbiAgICovXG4gIHByaXZhdGUgX2Rlc3Ryb3lNb2RhbChtb2RhbDogTmd4U21hcnRNb2RhbENvbXBvbmVudCk6IHZvaWQge1xuICAgIC8vIFByZXZlbnQgZGVzdHJ1Y3Rpb24gb2YgdGhlIGlubGluZSBtb2RhbHNcbiAgICBpZiAobW9kYWwuY3JlYXRlRnJvbSAhPT0gJ3NlcnZpY2UnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChtb2RhbC5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICB9XG59XG4iXX0=