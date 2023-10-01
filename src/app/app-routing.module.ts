import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { CategoriesComponent } from 'src/app/categories/categories.component';
import { AllPostsComponent } from 'src/app/posts/all-posts/all-posts.component';
import { NewPostComponent } from 'src/app/posts/new-post/new-post.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'posts', component: AllPostsComponent },
  { path: 'posts/new', component: NewPostComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
