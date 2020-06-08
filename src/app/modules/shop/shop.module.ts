import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
@NgModule({
  declarations: [],
  imports: [
    NgRelaxModule,
    NgZorroAntdModule,
  ],
  providers: [ DatePipe ]
})
export class ShopModule { }
