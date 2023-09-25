import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "src/app/dashboard/dashboard.component";
import {CategoriesComponent} from "src/app/categories/categories.component";

const routes: Routes = [
  { path:'', component: DashboardComponent, },
  { path: 'categories', component: CategoriesComponent, }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
