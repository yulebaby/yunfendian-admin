
import { PurchaseComponent } from './purchase.component';

import { ShopModule } from '../shop.module';
import { NgModule } from '@angular/core';
import { CommonModule , DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';


@NgModule({
  declarations: [PurchaseComponent],
  imports: [
    CommonModule,
    NgRelaxModule,
    NgZorroAntdModule,
    ShopModule,
    RouterModule.forChild([{
      path: '',
      component: PurchaseComponent
    }]),
  ],
  providers: [ DatePipe ]
})
export class PurchaseModule { }
