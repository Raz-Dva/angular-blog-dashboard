import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "src/app/services/categories.service";
import {CategoriesCollection} from "src/app/model/category";
type FormValue = {
  title: string;
  permalink: string;
  excerpt: string;
  category: string;
  file: string;
  content: string;
}

type FormControls<T> = {
  [P in keyof T]: AbstractControl<any, any>;
};

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {
  imgSrc: string | ArrayBuffer | null = './assets/images/no-img.png';
  postForm: FormGroup;
  categories: CategoriesCollection[] | undefined;
  categoriesLoading = true;
  permalink = '';

  constructor(private fb: FormBuilder, private categoriesService: CategoriesService) {
    this.postForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(3)]],
      permalink: ['', [Validators.required]],
      excerpt: ['', [Validators.required, Validators.minLength(50)]],
      category: ['', [Validators.required]],
      file: [null, [Validators.required]],
      content: ['', [Validators.required]],
    });
  }

  get FC(): FormControls<FormValue> {
    return this.postForm.controls  as FormControls<FormValue>;
  }

  ngOnInit(): void {
    this.postForm.controls['permalink'].disable();
    this.categoriesService.loadCategories().subscribe((categories) => {
      this.categories = categories;
      this.categoriesLoading = false
    })
  }

  showPreview(event: Event): void {
    const reader = new FileReader();

    if (event.target instanceof HTMLInputElement) {
      const files = event.target.files;

      if (files && files.length > 0) {
        reader.onload = (e) => {
          if (e.target?.result) {
            this.imgSrc = e.target.result;
          }
        }

        reader.readAsDataURL(files[0])
      }
    }
  }

  createPermalink(event: KeyboardEvent): void {
    if (event.target instanceof HTMLInputElement) {
      const permalink = event.target.value.trim().replace(/\s+/g, '-');
      this.postForm.controls.permalink.setValue(permalink);
    }
  }

  onSubmit(): void {
  };
}
