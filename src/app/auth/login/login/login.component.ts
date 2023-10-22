import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormControls } from 'src/app/model/formControl.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from 'src/app/enums/auth.enum';
import firebase from 'firebase/compat';
import UserCredential = firebase.auth.UserCredential;

type FormValue = {
  email: string;
  password: string;
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.min(6)]],
  });
  isLogin = false;
  title: string | undefined;
  isSubmitting = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.title = data.title;
      this.isLogin = data.title === Auth.Login;
    });
  }

  get FC(): FormControls<FormValue> {
    return this.form.controls as FormControls<FormValue>;
  }

  onSubmit(): void {
    this.isSubmitting = true;
    let onSubmit: Promise<UserCredential>;

    onSubmit = this.isLogin
      ? this.onLogin(this.FC.email.value, this.FC.password.value)
      : this.onRegistration(this.FC.email.value, this.FC.password.value);

    onSubmit
      .then((res) => {
        this.toastr.success(`${this.title} is success`);
        this.isSubmitting = false;
        if (res.user) {
          this.router.navigate(['/'], {
            state: { user: { email: res.user.email } },
          });
        }
      })
      .catch((e) => {
        this.isSubmitting = false;
        this.toastr.error(e.message || e);
      });
  }

  onLogin(email: string, password: string): Promise<UserCredential> {
    return this.authService.login(email, password);
  }

  onRegistration(email: string, password: string): Promise<UserCredential> {
    return this.authService.register(email, password);
  }
}
