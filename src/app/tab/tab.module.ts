import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabGroupComponent } from './tab-group/tab-group.component';
import { TabDirective } from './tab.directive';

@NgModule({
  declarations: [
    TabGroupComponent,
    TabDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TabGroupComponent,
    TabDirective,
  ]
})
export class TabModule { }
