import { AfterContentInit, ChangeDetectorRef } from "@angular/core";
import { Tab } from "../classes/tab";
export declare class SuiTabset implements AfterContentInit {
    changeDetector: ChangeDetectorRef;
    private _tabHeaders;
    private _tabContents;
    tabs: Tab[];
    private _activeTab;
    activeTab: Tab;
    private _barrierCount;
    constructor(changeDetector: ChangeDetectorRef);
    ngAfterContentInit(): void;
    private internalComponentsUpdated();
    private loadTabs();
    private onHeaderActiveChanged(tab);
    activateFirstTab(): void;
    activateClosestTab(tab: Tab): void;
}
