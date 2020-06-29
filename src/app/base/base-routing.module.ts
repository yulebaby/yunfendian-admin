import { BaseComponent } from './base.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../ng-relax/services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      
      {
        path: 'index',
        data: { title: '首页', noReuse: true },
        loadChildren: 'src/app/modules/index/index.module#IndexModule'
      },
      {
        path: 'password',
        data: { title: '修改密码', noReuse: true },
        loadChildren: 'src/app/modules/password/password.module#PasswordModule'
      },
      {
        path: 'shop',
        data: { noReuse: true },
        children: [
          {
            path: 'list',
            data: { title: '门店列表' },
            canLoad: [ AuthGuardService ],
            loadChildren: 'src/app/modules/shop/list/list.module#ListModule'
          },
          {
            path: 'purchase',
            data: { title: '购买列表' },
            canLoad: [ AuthGuardService ],
            loadChildren: 'src/app/modules/shop/purchase/purchase.module#PurchaseModule'
          },          
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }
