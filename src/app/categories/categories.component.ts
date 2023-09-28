import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {CategoriesService} from "src/app/services/categories.service";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  constructor(
    private categoriesService: CategoriesService) {
  }

  ngOnInit(): void {
    this.categoriesService.loadCategories().subscribe((res: any) => {
      console.log(res)

    })
  }

  onSubmit(formData: NgForm): void {
    this.categoriesService.saveCategory(formData.value);
  }
}
