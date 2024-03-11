import { Component, ContentChildren, ElementRef, EventEmitter, OnDestroy, OnInit, Output, QueryList, TemplateRef } from '@angular/core';
import { TabConfig, TabDirective } from '../tab.directive';

/**
 * Simple directive for managing tabs. Please use ng-tamplate tag with appTab directive to provide tabs.
 * The component contains to major section the header and the body. 
 * Header:
 *  - In the header the titles are presented.
 *  - Each title consists of 2 buttons, one for selection, one for removal
 * 
 * Body:
 *  - The content of the currently selected tab
 * 
 */
@Component({
  selector: 'app-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrl: './tab-group.component.css'
})
export class TabGroupComponent {
  
  /** The index of the currently selected tab 
   * @returns {number} the selected tab's index
  */
  public get selectedTabIdx() {
    return this.#selectedTabIdx;
  }

  /** The template ref of the currently selected tab
   * @returns {TemplateRef<TabDirective>} the currently selected tab
   */
  public get selectedTab(): TemplateRef<TabDirective> {
    return this.tabs.get(this.#selectedTabIdx).templateRef;
  }

  /** Tab configuration of the tabs 
   * @returns {TabConfig[]}
  */
  public get configs(): TabConfig[] {
    return this.tabs.map(item => item.config);
  }

  /** Number of the tabs presented in the group 
   * @returns {number}
  */
  public get numberOfTabs() {
    return this.tabs.length ?? 0;
  }

  /** An emitter which is triggered whenever a tab gets selected */
  @Output()
  public tabSelected = new EventEmitter<number>();

  @ContentChildren(TabDirective)
  private tabs: QueryList<TabDirective>;

  #selectedTabIdx: number = 0;

  /** A function to select a tab by its index. 
   * @param {number} idx - The index of the tab to select, zero-based.
   * @throws Error if index is greater or equal to number of tabs.
   */
  public selectTab(idx: number) {
    if (idx > this.tabs.length) {
      throw new Error(`Tab index (${idx}) out of range!`);
    }

    this.#selectedTabIdx = idx;
    this.tabSelected.emit(idx);
  }

  /** 
   * A function to remove a tab by its index.
   * After removing the tab automatically selects the previous or the first one if no previous exists.
   * @param {number} idx - The index of the tab to remove, zero-based.
   * @throws Error if index is greater or equal to number of tabs.
  */
  public removeTab(idx: number) {
    if (idx > this.tabs.length) {
      throw new Error(`Tab index (${idx}) out of range!`);
    }

    const tabsArray = this.tabs.toArray();
    const removedTab = tabsArray.splice(idx, 1)[0];
    this.tabs.reset(tabsArray);

    if (this.selectedTabIdx === idx) {
      this.selectTab(Math.max(this.selectedTabIdx - 1, 0));
    }

    removedTab.tabRemoved.emit();
  }
}
