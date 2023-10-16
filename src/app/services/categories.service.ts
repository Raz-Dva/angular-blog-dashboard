import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import {
  Category,
  FormCategory,
  SingleCategory,
} from 'src/app/model/category.interface';
import { ToastrService } from 'ngx-toastr';
import { Collections } from 'src/app/enums/collections.enum';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CategoryData } from 'src/app/model/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(
    private store: AngularFirestore,
    private toastr: ToastrService,
  ) {}

  saveCategory(data: Category): void {
    const { category } = data;
    this.store
      .collection<SingleCategory>(Collections.Categories)
      .add({ category })
      .then((docRef) => {
        if (docRef.id) {
          this.toastr.success('Category added successfully');
        } else {
          this.toastr.error('Oops, error. Category has not been added');
        }
      })
      .catch((error) => {
        console.log(error);
        this.toastr.error('Oops, error. Category has not been added');
      });
  }

  loadCategories(): Observable<CategoryData[]> {
    return this.store
      .collection<Category>(Collections.Categories)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const data = action.payload.doc.data();
            const id = action.payload.doc.id;
            return { data, id };
          });
        }),
      );
  }

  getCategoryById(id: string): AngularFirestoreDocument<CategoryData> {
    return this.store.doc<CategoryData>(`categories/${id}`);
  }

  updateCategory(id: string, category: FormCategory): void {
    this.store
      .doc<CategoryData>(`categories/${id}`)
      .update(category)
      .then(() => {
        this.toastr.success('Category updated successfully');
      })
      .catch((error) => {
        console.error(error);
        this.toastr.error('Category update error');
      });
  }

  deleteCategory(id: string): void {
    this.store
      .doc<CategoryData>(`categories/${id}`)
      .delete()
      .then(() => {
        this.getCategoryById(id)
          .get()
          .subscribe((doc) => {
            if (!doc.exists) {
              this.toastr.success('Category successfully deleted');
            }
          });
      })
      .catch((error) => {
        console.error(error);
        this.toastr.error('Category delete error');
      });
  }
}
