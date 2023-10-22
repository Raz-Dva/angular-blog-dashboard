import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userEmail: string = '';

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (history.state.user) {
      this.userEmail = history.state.user.email;
    } else {
      this.authService
        .userAuthInfo()
        .pipe(untilDestroyed(this))
        .subscribe((user) => {
          this.userEmail = user?.email ? user.email : '';
        });
    }
  }

  logOut(): void {
    this.authService.logOut().then(() => {
      this.toastr.info('User Logged Out Successfully');
      this.router.navigate(['/login']);
    });
  }
}
