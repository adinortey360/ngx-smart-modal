import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class NgxSmartModalStackService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNtYXJ0LW1vZGFsLXN0YWNrLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL3NlcnZpY2VzL25neC1zbWFydC1tb2RhbC1zdGFjay5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBTTNDLE1BQU0sT0FBTyx5QkFBeUI7SUFHcEM7UUFDRSxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLFFBQVEsQ0FBQyxhQUE0QixFQUFFLEtBQWU7UUFDM0QsSUFBSSxLQUFLLEVBQUU7WUFDVCxNQUFNLENBQUMsR0FBVyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzlGLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNWLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUM7YUFDakQ7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDdEM7WUFDRCxPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLFFBQVEsQ0FBQyxFQUFVO1FBQ3hCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBZ0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUVuRSxJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7WUFDbkIsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDO1NBQ2hCO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQzVEO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxhQUFhO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLGVBQWU7UUFDcEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxpQkFBaUI7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLEVBQUU7WUFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1NBQ3ZDO1FBRUQsT0FBTyxJQUFJLENBQUMsZUFBZSxFQUFFO2FBQzFCLEdBQUcsQ0FBQyxDQUFDLENBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7YUFDbEMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0gsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLGNBQWM7UUFDbkIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25GLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksa0JBQWtCO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7SUFDakMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLFdBQVcsQ0FBQyxFQUFVO1FBQzNCLE1BQU0sQ0FBQyxHQUFXLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNULE9BQU87U0FDUjtRQUVELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2RCxPQUFPLGFBQWEsQ0FBQztJQUN2QixDQUFDOytHQS9HVSx5QkFBeUI7bUhBQXpCLHlCQUF5Qjs7NEZBQXpCLHlCQUF5QjtrQkFEckMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgTW9kYWxJbnN0YW5jZSB9IGZyb20gJy4vbW9kYWwtaW5zdGFuY2UnO1xuaW1wb3J0IHsgTmd4U21hcnRNb2RhbENvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvbmd4LXNtYXJ0LW1vZGFsLmNvbXBvbmVudCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ3hTbWFydE1vZGFsU3RhY2tTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBfbW9kYWxTdGFjazogTW9kYWxJbnN0YW5jZVtdO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX21vZGFsU3RhY2sgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgbW9kYWwgaW5zdGFuY2UuIFRoaXMgc3RlcCBpcyBlc3NlbnRpYWwgYW5kIGFsbG93cyB0byByZXRyaWV2ZSBhbnkgbW9kYWwgYXQgYW55IHRpbWUuXG4gICAqIEl0IHN0b3JlcyBhbiBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgZ2l2ZW4gbW9kYWwgaWRlbnRpZmllciBhbmQgdGhlIG1vZGFsIGl0c2VsZiBkaXJlY3RseSBpbiB0aGUgYG1vZGFsU3RhY2tgLlxuICAgKlxuICAgKiBAcGFyYW0gbW9kYWxJbnN0YW5jZSBUaGUgb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIGdpdmVuIG1vZGFsIGlkZW50aWZpZXIgYW5kIHRoZSBtb2RhbCBpdHNlbGYuXG4gICAqIEBwYXJhbSBmb3JjZSBPcHRpb25hbCBwYXJhbWV0ZXIgdGhhdCBmb3JjZXMgdGhlIG92ZXJyaWRpbmcgb2YgbW9kYWwgaW5zdGFuY2UgaWYgaXQgYWxyZWFkeSBleGlzdHMuXG4gICAqIEByZXR1cm5zIG5vdGhpbmcgc3BlY2lhbC5cbiAgICovXG4gIHB1YmxpYyBhZGRNb2RhbChtb2RhbEluc3RhbmNlOiBNb2RhbEluc3RhbmNlLCBmb3JjZT86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAoZm9yY2UpIHtcbiAgICAgIGNvbnN0IGk6IG51bWJlciA9IHRoaXMuX21vZGFsU3RhY2suZmluZEluZGV4KChvOiBNb2RhbEluc3RhbmNlKSA9PiBvLmlkID09PSBtb2RhbEluc3RhbmNlLmlkKTtcbiAgICAgIGlmIChpID4gLTEpIHtcbiAgICAgICAgdGhpcy5fbW9kYWxTdGFja1tpXS5tb2RhbCA9IG1vZGFsSW5zdGFuY2UubW9kYWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9tb2RhbFN0YWNrLnB1c2gobW9kYWxJbnN0YW5jZSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX21vZGFsU3RhY2sucHVzaChtb2RhbEluc3RhbmNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhIG1vZGFsIGluc3RhbmNlIGJ5IGl0cyBpZGVudGlmaWVyLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgVGhlIG1vZGFsIGlkZW50aWZpZXIgdXNlZCBhdCBjcmVhdGlvbiB0aW1lLlxuICAgKi9cbiAgcHVibGljIGdldE1vZGFsKGlkOiBzdHJpbmcpOiBOZ3hTbWFydE1vZGFsQ29tcG9uZW50IHtcbiAgICBjb25zdCBpID0gdGhpcy5fbW9kYWxTdGFjay5maW5kKChvOiBNb2RhbEluc3RhbmNlKSA9PiBvLmlkID09PSBpZCk7XG5cbiAgICBpZiAoaSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gaS5tb2RhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCBtb2RhbCB3aXRoIGlkZW50aWZpZXIgJHtpZH1gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYWxsIHRoZSBjcmVhdGVkIG1vZGFscy5cbiAgICpcbiAgICogQHJldHVybnMgYW4gYXJyYXkgdGhhdCBjb250YWlucyBhbGwgbW9kYWwgaW5zdGFuY2VzLlxuICAgKi9cbiAgcHVibGljIGdldE1vZGFsU3RhY2soKTogTW9kYWxJbnN0YW5jZVtdIHtcbiAgICByZXR1cm4gdGhpcy5fbW9kYWxTdGFjaztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhbGwgdGhlIG9wZW5lZCBtb2RhbHMuIEl0IGxvb2tzIGZvciBhbGwgbW9kYWwgaW5zdGFuY2VzIHdpdGggdGhlaXIgYHZpc2libGVgIHByb3BlcnR5IHNldCB0byBgdHJ1ZWAuXG4gICAqXG4gICAqIEByZXR1cm5zIGFuIGFycmF5IHRoYXQgY29udGFpbnMgYWxsIHRoZSBvcGVuZWQgbW9kYWxzLlxuICAgKi9cbiAgcHVibGljIGdldE9wZW5lZE1vZGFscygpOiBNb2RhbEluc3RhbmNlW10ge1xuICAgIHJldHVybiB0aGlzLl9tb2RhbFN0YWNrLmZpbHRlcigobzogTW9kYWxJbnN0YW5jZSkgPT4gby5tb2RhbC52aXNpYmxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgb3BlbmVkIG1vZGFsIHdpdGggaGlnaGVzdCB6LWluZGV4LlxuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgb3BlbmVkIG1vZGFsIHdpdGggaGlnaGVzdCB6LWluZGV4LlxuICAgKi9cbiAgcHVibGljIGdldFRvcE9wZW5lZE1vZGFsKCk6IE5neFNtYXJ0TW9kYWxDb21wb25lbnQge1xuICAgIGlmICghdGhpcy5nZXRPcGVuZWRNb2RhbHMoKS5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gbW9kYWwgaXMgb3BlbmVkJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZ2V0T3BlbmVkTW9kYWxzKClcbiAgICAgIC5tYXAoKG86IE1vZGFsSW5zdGFuY2UpID0+IG8ubW9kYWwpXG4gICAgICAucmVkdWNlKChoaWdoZXN0LCBpdGVtKSA9PiBpdGVtLmxheWVyUG9zaXRpb24gPiBoaWdoZXN0LmxheWVyUG9zaXRpb24gPyBpdGVtIDogaGlnaGVzdCwgdGhpcy5nZXRPcGVuZWRNb2RhbHMoKVswXS5tb2RhbCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBoaWdoZXIgYHotaW5kZXhgIHZhbHVlIGJldHdlZW4gYWxsIHRoZSBtb2RhbCBpbnN0YW5jZXMuIEl0IGl0ZXJhdGVzIG92ZXIgdGhlIGBNb2RhbFN0YWNrYCBhcnJheSBhbmRcbiAgICogY2FsY3VsYXRlcyBhIGhpZ2hlciB2YWx1ZSAoaXQgdGFrZXMgdGhlIGhpZ2hlc3QgaW5kZXggdmFsdWUgYmV0d2VlbiBhbGwgdGhlIG1vZGFsIGluc3RhbmNlcyBhbmQgYWRkcyAxKS5cbiAgICogVXNlIGl0IHRvIG1ha2UgYSBtb2RhbCBhcHBlYXIgZm9yZWdyb3VuZC5cbiAgICpcbiAgICogQHJldHVybnMgYSBoaWdoZXIgaW5kZXggZnJvbSBhbGwgdGhlIGV4aXN0aW5nIG1vZGFsIGluc3RhbmNlcy5cbiAgICovXG4gIHB1YmxpYyBnZXRIaWdoZXJJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLm1heCguLi50aGlzLl9tb2RhbFN0YWNrLm1hcCgobykgPT4gby5tb2RhbC5sYXllclBvc2l0aW9uKSwgMTA0MSkgKyAxO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0IGdpdmVzIHRoZSBudW1iZXIgb2YgbW9kYWwgaW5zdGFuY2VzLiBJdCdzIGhlbHBmdWwgdG8ga25vdyBpZiB0aGUgbW9kYWwgc3RhY2sgaXMgZW1wdHkgb3Igbm90LlxuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgbnVtYmVyIG9mIG1vZGFsIGluc3RhbmNlcy5cbiAgICovXG4gIHB1YmxpYyBnZXRNb2RhbFN0YWNrQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fbW9kYWxTdGFjay5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbW9kYWwgaW5zdGFuY2UgZnJvbSB0aGUgbW9kYWwgc3RhY2suXG4gICAqIFJldHVybnMgdGhlIHJlbW92ZWQgbW9kYWwgaW5zdGFuY2Ugb3IgdW5kZWZpbmVkIGlmIG5vIG1vZGFsIHdhcyBmb3VuZFxuICAgKlxuICAgKiBAcGFyYW0gaWQgVGhlIG1vZGFsIGlkZW50aWZpZXIuXG4gICAqIEByZXR1cm5zIHRoZSByZW1vdmVkIG1vZGFsIGluc3RhbmNlLlxuICAgKi9cbiAgcHVibGljIHJlbW92ZU1vZGFsKGlkOiBzdHJpbmcpOiB1bmRlZmluZWQgfCBNb2RhbEluc3RhbmNlIHtcbiAgICBjb25zdCBpOiBudW1iZXIgPSB0aGlzLl9tb2RhbFN0YWNrLmZpbmRJbmRleCgobzogYW55KSA9PiBvLmlkID09PSBpZCk7XG4gICAgaWYgKGkgPCAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbW9kYWxJbnN0YW5jZSA9IHRoaXMuX21vZGFsU3RhY2suc3BsaWNlKGksIDEpWzBdO1xuICAgIHJldHVybiBtb2RhbEluc3RhbmNlO1xuICB9XG59XG4iXX0=