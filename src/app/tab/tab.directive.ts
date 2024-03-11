import { Directive, EventEmitter, Input, Output, TemplateRef, ViewContainerRef } from '@angular/core';

/** 
 * A basic interface to wrap tab related settings.
*/
export interface TabConfig {
  
  /**
   * The title of the tab which is shown in the header section.
   */
  title: string;

  /**
   * A flag to make a tab disabled (not selectable) in the header. The tab can be selected programatically.
   */
  disabled?: boolean;

  /** 
   * An optional label used by assertive technologies. If not provided the title is used.
  */
  ariaLabel?: string;
}

/**
 * This directive represents a tab in a @see{TabGroupComponent}. Please use it only on ng-template.
 */
@Directive({
  selector: '[appTab]',
})
export class TabDirective {

  /**
   * The title of the tab which is shown in the header, required.
   */
  @Input({alias: 'appTab', required: true}) public appTabTitle: string;

  /**
   * An optional flag which can be used to make the tab disabled in the header. The tab can be selected programatically.
   */
  @Input() public appTabDisabled = false;

  /** An optional label used by assertive technologies. If not provided the title is used. */
  @Input() public appTabAriaLabel: string;

  /** An emitter which is triggered when the current tab is removed. */
  @Output() public tabRemoved = new EventEmitter<void>();

  constructor(public templateRef: TemplateRef<TabDirective>, public viewContainer: ViewContainerRef) {}

  /** A property to query the given params */
  public get config(): TabConfig {
    return {
      title: this.appTabTitle,
      disabled: this.appTabDisabled,
      ariaLabel: this.appTabAriaLabel,
    }
  }
}
