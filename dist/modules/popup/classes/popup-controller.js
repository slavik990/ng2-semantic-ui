var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HostListener } from "@angular/core";
import { PopupTrigger } from "./popup-config";
import { SuiPopup } from "../components/popup";
var SuiPopupController = (function () {
    function SuiPopupController(renderer, _element, _componentFactory, config) {
        var _this = this;
        this._element = _element;
        this._componentFactory = _componentFactory;
        // Generate a new SuiPopup component and attach it to the application view.
        this._componentRef = this._componentFactory.createComponent(SuiPopup);
        // Configure popup with provided config.
        this.popup.config = config;
        // When the popup is closed (onClose fires on animation complete),
        this.popup.onClose.subscribe(function () { return _this.cleanup(); });
        this._documentListener = renderer.listen("document", "click", function (e) { return _this.onDocumentClick(e); });
    }
    Object.defineProperty(SuiPopupController.prototype, "popup", {
        // Returns generated popup instance.
        get: function () {
            // Use non-null assertion as we only access this when a popup exists.
            return this._componentRef.instance;
        },
        enumerable: true,
        configurable: true
    });
    SuiPopupController.prototype.configure = function (config) {
        if (config) {
            Object.assign(this.popup.config, config);
        }
    };
    SuiPopupController.prototype.openDelayed = function () {
        var _this = this;
        // Cancel the opening timer.
        clearTimeout(this._openingTimeout);
        // Start the popup opening after the specified delay interval.
        this._openingTimeout = window.setTimeout(function () { return _this.open(); }, this.popup.config.delay);
    };
    SuiPopupController.prototype.open = function () {
        // Attach the generated component to the current application.
        this._componentFactory.attachToApplication(this._componentRef);
        // Move the generated element to the body to avoid any positioning issues.
        this._componentFactory.moveToDocumentBody(this._componentRef);
        // Attach a reference to the anchor element. We do it here because IE11 loves to complain.
        this.popup.anchor = this._element;
        // Start popup open transition.
        this.popup.open();
        // Call lifecyle hook
        var lifecycle = this.popupOnOpen;
        if (lifecycle) {
            lifecycle.call(this);
        }
    };
    SuiPopupController.prototype.close = function () {
        // Cancel the opening timer to stop the popup opening after close has been called.
        clearTimeout(this._openingTimeout);
        if (this._componentRef) {
            // Start popup close transition.
            this.popup.close();
        }
        // Call lifecyle hook
        var lifecycle = this.popupOnClose;
        if (lifecycle) {
            lifecycle.call(this);
        }
    };
    SuiPopupController.prototype.toggleDelayed = function () {
        // If the popup hasn't been created, or it has but it isn't currently open, open the popup.
        if (!this._componentRef || (this._componentRef && !this.popup.isOpen)) {
            return this.openDelayed();
        }
        // O'wise, close it.
        return this.close();
    };
    SuiPopupController.prototype.toggle = function () {
        // If the popup hasn't been created, or it has but it isn't currently open, open the popup.
        if (!this._componentRef || (this._componentRef && !this.popup.isOpen)) {
            return this.open();
        }
        // O'wise, close it.
        return this.close();
    };
    SuiPopupController.prototype.onMouseEnter = function () {
        if (this.popup.config.trigger === PopupTrigger.Hover) {
            this.openDelayed();
        }
    };
    SuiPopupController.prototype.onMouseLeave = function () {
        if (this.popup.config.trigger === PopupTrigger.Hover) {
            this.close();
        }
    };
    SuiPopupController.prototype.onClick = function () {
        if (this.popup.config.trigger === PopupTrigger.Click ||
            this.popup.config.trigger === PopupTrigger.OutsideClick) {
            // Repeated clicks require a toggle, rather than just opening the popup each time.
            this.toggleDelayed();
        }
        else if (this.popup.config.trigger === PopupTrigger.Focus &&
            (!this._componentRef || (this._componentRef && !this.popup.isOpen))) {
            // Repeated clicks with a focus trigger requires an open (as focus isn't ever lost on repeated click).
            this.openDelayed();
        }
    };
    SuiPopupController.prototype.onDocumentClick = function (e) {
        // If the popup trigger is outside click,
        if (this._componentRef && this.popup.config.trigger === PopupTrigger.OutsideClick) {
            var target = e.target;
            // Close the popup if the click is outside of the popup element.
            if (!this._element.nativeElement.contains(target)) {
                this.close();
            }
        }
    };
    SuiPopupController.prototype.onFocusIn = function () {
        if (this.popup.config.trigger === PopupTrigger.Focus) {
            this.openDelayed();
        }
    };
    SuiPopupController.prototype.onFocusOut = function (e) {
        if (!this._element.nativeElement.contains(e.relatedTarget) &&
            !this.popup.elementRef.nativeElement.contains(e.relatedTarget) &&
            this.popup.config.trigger === PopupTrigger.Focus) {
            this.close();
        }
    };
    SuiPopupController.prototype.cleanup = function () {
        clearTimeout(this._openingTimeout);
        if (this._componentRef.instance && this._componentRef.instance.positioningService) {
            this._componentRef.instance.positioningService.destroy();
        }
        this._componentFactory.detachFromApplication(this._componentRef);
    };
    SuiPopupController.prototype.ngOnDestroy = function () {
        this.cleanup();
        this._documentListener();
    };
    return SuiPopupController;
}());
export { SuiPopupController };
__decorate([
    HostListener("mouseenter"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuiPopupController.prototype, "onMouseEnter", null);
__decorate([
    HostListener("mouseleave"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuiPopupController.prototype, "onMouseLeave", null);
__decorate([
    HostListener("click"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuiPopupController.prototype, "onClick", null);
__decorate([
    HostListener("focusin"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuiPopupController.prototype, "onFocusIn", null);
__decorate([
    HostListener("focusout", ["$event"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SuiPopupController.prototype, "onFocusOut", null);
//# sourceMappingURL=popup-controller.js.map