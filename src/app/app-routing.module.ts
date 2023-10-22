import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { CategoriesComponent } from 'src/app/categories/categories.component';
import { AllPostsComponent } from 'src/app/posts/all-posts/all-posts.component';
import { NewPostComponent } from 'src/app/posts/new-post/new-post.component';
import { LoginComponent } from 'src/app/auth/login/login/login.component';
import { AdminComponent } from 'src/app/layouts/admin/admin.component';
import { AuthGuard } from 'src/app/services/auth.guard';
import { Auth } from 'src/app/enums/auth.enum';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { title: Auth.Login },
  },
  {
    path: 'registration',
    component: LoginComponent,
    data: { title: Auth.Registration },
  },
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
      {
        path: 'categories',
        component: CategoriesComponent,
        canActivate: [AuthGuard],
      },
      { path: 'posts', component: AllPostsComponent, canActivate: [AuthGuard] },
      {
        path: 'posts/new',
        component: NewPostComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
