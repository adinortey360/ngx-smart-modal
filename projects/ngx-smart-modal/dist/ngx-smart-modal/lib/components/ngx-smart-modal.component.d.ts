import { AfterViewChecked, ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, OnInit, QueryList, Renderer2, Type, ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class NgxSmartModalComponent implements OnInit, OnDestroy, AfterViewChecked {
    private _renderer;
    private _changeDetectorRef;
    private _viewContainerRef;
    readonly elementRef: ElementRef;
    private _document;
    private _platformId;
    closable: boolean;
    escapable: boolean;
    dismissable: boolean;
    identifier: string;
    customClass: string;
    visible: boolean;
    backdrop: boolean;
    force: boolean;
    hideDelay: number;
    autostart: boolean;
    target: string;
    ariaLabel: string | null;
    ariaLabelledBy: string | null;
    ariaDescribedBy: string | null;
    refocus: boolean;
    visibleChange: EventEmitter<boolean>;
    onClose: EventEmitter<any>;
    onCloseFinished: EventEmitter<any>;
    onDismiss: EventEmitter<any>;
    onDismissFinished: EventEmitter<any>;
    onAnyCloseEvent: EventEmitter<any>;
    onAnyCloseEventFinished: EventEmitter<any>;
    onOpen: EventEmitter<any>;
    onOpenFinished: EventEmitter<any>;
    onEscape: EventEmitter<any>;
    onDataAdded: EventEmitter<any>;
    onDataRemoved: EventEmitter<any>;
    contentComponent: Type<any>;
    layerPosition: number;
    overlayVisible: boolean;
    openedClass: boolean;
    createFrom: string;
    private _data;
    private _componentRef;
    private nsmContent;
    nsmDialog: QueryList<ElementRef>;
    private nsmOverlay;
    private dynamicContentContainer;
    constructor(_renderer: Renderer2, _changeDetectorRef: ChangeDetectorRef, _viewContainerRef: ViewContainerRef, elementRef: ElementRef, _document: Document, _platformId: object);
    ngOnInit(): void;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    /**
     * Open the modal instance
     *
     * @param top open the modal top of all other
     * @returns the modal component
     */
    open(top?: boolean): NgxSmartModalComponent;
    /**
     * Close the modal instance
     *
     * @returns the modal component
     */
    close(): NgxSmartModalComponent;
    /**
     * Dismiss the modal instance
     *
     * @param e the event sent by the browser
     * @returns the modal component
     */
    dismiss(e: MouseEvent): NgxSmartModalComponent;
    /**
     * Toggle visibility of the modal instance
     *
     * @param top open the modal top of all other
     * @returns the modal component
     */
    toggle(top?: boolean): NgxSmartModalComponent;
    /**
     * Add a custom class to the modal instance
     *
     * @param className the class to add
     * @returns the modal component
     */
    addCustomClass(className: string): NgxSmartModalComponent;
    /**
     * Remove a custom class to the modal instance
     *
     * @param className the class to remove
     * @returns the modal component
     */
    removeCustomClass(className?: string): NgxSmartModalComponent;
    /**
     * Returns the visibility state of the modal instance
     */
    isVisible(): boolean;
    /**
     * Checks if data is attached to the modal instance
     */
    hasData(): boolean;
    /**
     * Attach data to the modal instance
     *
     * @param data the data to attach
     * @param force override potentially attached data
     * @returns the modal component
     */
    setData(data: unknown, force?: boolean): NgxSmartModalComponent;
    /**
     * Retrieve the data attached to the modal instance
     */
    getData(): unknown;
    /**
     * Remove the data attached to the modal instance
     *
     * @returns the modal component
     */
    removeData(): NgxSmartModalComponent;
    /**
     * Add body class modal opened
     *
     * @returns the modal component
     */
    addBodyClass(): NgxSmartModalComponent;
    /**
     * Add body class modal opened
     *
     * @returns the modal component
     */
    removeBodyClass(): NgxSmartModalComponent;
    markForCheck(): void;
    /**
     * Listens for window resize event and recalculates modal instance position if it is element-relative
     */
    targetPlacement(): boolean | void;
    private _sendEvent;
    /**
     * Is current platform browser
     */
    private get isBrowser();
    /**
     * Creates content inside provided ViewContainerRef
     */
    private createDynamicContent;
    /**
     * Assigns the modal data to the ComponentRef instance properties
     */
    private assignModalDataToComponentData;
    /**
     * Assigns the ComponentRef instance properties to the modal data object
     */
    private assignComponentDataToModalData;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxSmartModalComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxSmartModalComponent, "ngx-smart-modal", never, { "closable": { "alias": "closable"; "required": false; }; "escapable": { "alias": "escapable"; "required": false; }; "dismissable": { "alias": "dismissable"; "required": false; }; "identifier": { "alias": "identifier"; "required": false; }; "customClass": { "alias": "customClass"; "required": false; }; "visible": { "alias": "visible"; "required": false; }; "backdrop": { "alias": "backdrop"; "required": false; }; "force": { "alias": "force"; "required": false; }; "hideDelay": { "alias": "hideDelay"; "required": false; }; "autostart": { "alias": "autostart"; "required": false; }; "target": { "alias": "target"; "required": false; }; "ariaLabel": { "alias": "ariaLabel"; "required": false; }; "ariaLabelledBy": { "alias": "ariaLabelledBy"; "required": false; }; "ariaDescribedBy": { "alias": "ariaDescribedBy"; "required": false; }; "refocus": { "alias": "refocus"; "required": false; }; }, { "visibleChange": "visibleChange"; "onClose": "onClose"; "onCloseFinished": "onCloseFinished"; "onDismiss": "onDismiss"; "onDismissFinished": "onDismissFinished"; "onAnyCloseEvent": "onAnyCloseEvent"; "onAnyCloseEventFinished": "onAnyCloseEventFinished"; "onOpen": "onOpen"; "onOpenFinished": "onOpenFinished"; "onEscape": "onEscape"; "onDataAdded": "onDataAdded"; "onDataRemoved": "onDataRemoved"; }, never, ["*"], true, never>;
}
