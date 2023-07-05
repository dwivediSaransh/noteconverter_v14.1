import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PopoverArrowDirective } from '../app/Directives/popover-arrow.directive';
import { PopoverCloseDirective } from '../app/Directives/popover-close.directive';
import { PopoverComponent } from '../app/views/popover/popover.component';

@NgModule({
  declarations: [PopoverComponent,PopoverCloseDirective,PopoverArrowDirective],
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule
  ],
  exports: [
    PopoverCloseDirective
  ],
  entryComponents: [PopoverComponent]
})
export class PopoverModule { }