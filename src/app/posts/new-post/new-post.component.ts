import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories.service';
import { CategoriesCollection } from 'src/app/model/category.interface';
import { PostsService } from 'src/app/services/posts.service';
import { Post } from 'src/app/model/post';
import { ToastrService } from 'ngx-toastr';
import { tag } from 'rxjs-spy/operators';

type FormValue = {
  title: string;
  permalink: string;
  excerpt: string;
  category: string;
  file: string;
  content: string;
};

type FormControls<T> = {
  [P in keyof T]: AbstractControl<any, any>;
};

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements OnInit {
  imgSrc: string | ArrayBuffer | null = './assets/images/no-img.png';
  form: FormGroup;
  categories: CategoriesCollection[] | undefined;
  categoriesLoading = true;
  isSubmitting = false;
  selectedImg: File | undefined;

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private postService: PostsService,
    private toastr: ToastrService,
  ) {
    this.form = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(90),
        ],
      ],
      permalink: ['', [Validators.required]],
      excerpt: ['', [Validators.required, Validators.minLength(50)]],
      category: [''],
      file: [null, [Validators.required]],
      content: ['', [Validators.required]],
    });
  }

  get FC(): FormControls<FormValue> {
    return this.form.controls as FormControls<FormValue>;
  }

  ngOnInit(): void {
    this.form.controls['permalink'].disable();
    this.categoriesService.loadCategories().subscribe((categories) => {
      this.categories = categories;
      this.categoriesLoading = false;
    });
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
        };

        reader.readAsDataURL(files[0]);
        this.selectedImg = files[0];
      }
    }
  }

  createPermalink(event: KeyboardEvent): void {
    if (event.target instanceof HTMLInputElement) {
      const permalink = event.target.value.trim().replace(/\s+/g, '-');
      this.form.controls.permalink.setValue(permalink);
    }
  }

  onSubmit(): void {
    this.isSubmitting = true;
    const postFormValue = { ...this.form.value };
    delete postFormValue.file;
    const postData: Post = {
      ...postFormValue,
      permalink: this.form.controls['permalink'].value,
      postImgPath: '',
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date(),
    };

    if (this.selectedImg) {
      this.postService
        .saveDataPost(this.selectedImg, postData)
        .pipe(tag('1'))
        .subscribe({
          next: (result) => {
            this.isSubmitting = false;
            this.toastr.success(result.resultText);
            this.form.reset();
            this.imgSrc = './assets/images/no-img.png';
          },
          error: (error) => {
            this.isSubmitting = false;
            this.toastr.error(error.resultText);
          },
        });
    }
  }
}
