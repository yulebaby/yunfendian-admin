import { Component, OnInit, Input } from '@angular/core';
import { UserInfoState } from 'src/app/core/reducers/userInfo-reducer';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/reducers/reducers-config';
import { MenuConfig } from 'src/app/core/menu-config';
import { RouterState } from 'src/app/core/reducers/router-reducer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {

  @Input() userInfo: UserInfoState;

  routerState: RouterState;

  menuConfig: any[] = MenuConfig;

  roleAllowPath: string;

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) { }

  ngOnInit() {
    this.store.select('routerState').subscribe(res => this.routerState = res);

    this.store.select('userInfoState').subscribe(res => {
      // this.roleAllowPath = res.menuUrls;
      this.roleAllowPath = '**';
    });
  }

  routerLink(children: any[]) {
    if (this.roleAllowPath.indexOf('**') > -1) {
      this.router.navigateByUrl(children[0].key);
    } else {
      for (let i = 0; i < children.length; i++) {
        if (this.roleAllowPath.indexOf(children[i].key) > -1) {
          this.router.navigateByUrl(children[i].key);
          break;
        }
      }
    }
  }

}
