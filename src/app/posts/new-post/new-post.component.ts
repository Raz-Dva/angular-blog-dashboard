import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/model/category.interface';
import { PostsService } from 'src/app/services/posts.service';
import {
  PostDataForm,
  PostDataUpdate,
} from 'src/app/model/dataPostForm.interface';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TrimSpaces } from 'src/app/helpers/validators/post-title.validator';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Timestamp } from 'firebase/firestore';
import { FormControls } from 'src/app/model/formControl.interface';

type FormValue = {
  title: string;
  permalink: string;
  excerpt: string;
  category: string;
  file: string;
  content: string;
};

@UntilDestroy()
@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements OnInit {
  noImage = './assets/images/no-img.png';
  imgSrc: string | ArrayBuffer | null = null;
  form: FormGroup;
  categories!: Category[];
  categoriesLoading = true;
  isSubmitting = false;
  title = 'Add';
  private selectedImg: File | undefined;
  private post: PostDataForm | undefined;
  private isEditForm = false;
  private postId: string | undefined;
  private isPostLoaded = new BehaviorSubject<PostDataForm | null>(null);

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private postService: PostsService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {
    this.imgSrc = this.noImage;
    this.form = this.fb.group({
      title: [
        '',
        [
          TrimSpaces(),
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(90),
        ],
      ],
      permalink: ['', Validators.required],
      excerpt: [
        '',
        [TrimSpaces(), Validators.required, Validators.minLength(50)],
      ],
      category: ['', Validators.required],
      file: ['', Validators.required],
      content: ['', Validators.required],
    });

    this.route.queryParams.subscribe((params) => {
      if (params.id) {
        this.postId = params.id;
        this.isEditForm = true;
        this.title = 'Edit';
        this.form.controls['file'].clearValidators();
        this.postService
          .getPostById(params.id)
          .valueChanges()
          .pipe(untilDestroyed(this))
          .subscribe((post) => {
            if (post) {
              this.post = post;
              this.isPostLoaded.next(this.post);
            }
          });
      }
    });
  }

  ngOnInit(): void {
    this.form.controls['permalink'].disable();
    this.categoriesService
      .loadCategories()
      .pipe(untilDestroyed(this))
      .subscribe((categories) => {
        this.categories = categories.map((category) => ({
          category: category.data.category,
          id: category.id,
        }));
        this.categoriesLoading = false;

        if (this.isEditForm) {
          this.isPostLoaded.subscribe((data) => {
            if (data) {
              this.setFormValue(data);
              this.isPostLoaded.complete();
            }
          });
        }
      });
  }

  get FC(): FormControls<FormValue> {
    return this.form.controls as FormControls<FormValue>;
  }

  private setFormValue(data: PostDataForm): void {
    const dataForm: any = {
      title: data.title,
      permalink: data.permalink,
      excerpt: data.excerpt,
      content: data.content,
    };
    const selectedCategory = this.categories.find(
      (category) => category.id === data.category.id,
    );
    this.form.controls.category.setValue(selectedCategory);
    this.imgSrc = data.postImgURL;
    this.form.patchValue(dataForm);
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
    const postFormValue: PostDataUpdate = {
      ...this.form.value,
      permalink: this.form.controls['permalink'].value,
    };
    delete postFormValue.file;
    const postData: PostDataForm = {
      ...postFormValue,
      postImgURL: '',
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: Timestamp.now(),
      postImgPath: `postImg/${Date.now()}`,
    };

    if (this.isEditForm && this.postId) {
      this.onUpdatePost(
        this.postId,
        postFormValue,
        this.selectedImg,
        this.post?.postImgPath,
      );
    } else if (this.selectedImg) {
      this.onSavePost(this.selectedImg, postData);
    }
  }

  private onUpdatePost(
    id: string,
    data: PostDataUpdate,
    file?: File,
    path?: string,
  ): void {
    this.postService.updatePostById(id, data, file, path).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.toastr.success(result.resultText);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.toastr.error(error.resultText);
      },
    });
  }

  private onSavePost(img: File, data: PostDataForm): void {
    this.postService.saveDataPost(img, data).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.toastr.success(result.resultText);
        this.form.reset();
        this.imgSrc = this.noImage;
      },
      error: (error) => {
        this.isSubmitting = false;
        this.toastr.error(error.resultText);
      },
    });
  }
}
