import { NgModule } from '@angular/core';
import { CommonModule , DatePipe } from '@angular/common';
import { ListComponent } from './list.component';
import { RouterModule } from '@angular/router';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ShopModule } from '../shop.module';
import { UpdateComponent } from './update/update.component';



@NgModule({
  declarations: [UpdateComponent, ListComponent],
  imports: [
    CommonModule,
    NgRelaxModule,
    NgZorroAntdModule,
    ShopModule,
    RouterModule.forChild([{
      path: '',
      component: ListComponent
    }]),
  ],
  entryComponents: [UpdateComponent],
  providers: [ DatePipe ]
})
export class ListModule { }
