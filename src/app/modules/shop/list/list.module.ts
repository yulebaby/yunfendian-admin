import { NgModule } from '@angular/core';
import { CommonModule , DatePipe } from '@angular/common';
import { ListComponent } from './list.component';
import { RouterModule } from '@angular/router';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ShopModule } from '../shop.module';
import { UpdateComponent } from './update/update.component';
import { AbmModule } from 'angular-baidu-maps';
import { VipComponent } from './vip/vip.component';

@NgModule({
  declarations: [UpdateComponent, ListComponent, VipComponent],
  imports: [
    CommonModule,
    NgRelaxModule,
    NgZorroAntdModule,
    ShopModule,
    RouterModule.forChild([{
      path: '',
      component: ListComponent
    }]),
    AbmModule.forRoot({
      apiKey: '7NCxWo3ADYmuEiFY8GM4SW9yxoNGSnLG'
    })
  ],
  entryComponents: [UpdateComponent,VipComponent],
  providers: [ DatePipe ]
})
export class ListModule { }
