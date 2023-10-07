import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories.service';
import {
  CategoriesCollection,
  FormCategory,
} from 'src/app/model/category.interface';
enum Actions {
  Add = 'Add',
  Edit = 'Edit',
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  categoryCollection: CategoriesCollection[] | undefined;
  nameCategory: string | undefined;
  actionCategory: string | undefined;
  idCategory: string | undefined;
  loadingCategory = true;

  constructor(private categoriesService: CategoriesService) {
    this.actionCategory = Actions.Add;
  }

  ngOnInit(): void {
    this.loadingCategory = true;
    this.categoriesService
      .loadCategories()
      .subscribe((categories: CategoriesCollection[]) => {
        this.categoryCollection = categories;
        this.loadingCategory = false;
      });
  }

  editCategory(category: string, id: string): void {
    this.actionCategory = Actions.Edit;
    this.nameCategory = category;
    this.idCategory = id;
  }

  deleteCategory(id: string): void {
    if (id) {
      this.categoriesService.deleteCategory(id);
    }
  }

  onSubmit(form: NgForm): void {
    if (this.actionCategory === Actions.Add) {
      this.categoriesService.saveCategory(form.value);
    } else if (
      this.actionCategory === Actions.Edit &&
      this.idCategory !== undefined
    ) {
      this.categoriesService.updateCategory(
        this.idCategory,
        form.value as FormCategory,
      );
    }
    form.reset();
    this.actionCategory = Actions.Add;
  }
}
