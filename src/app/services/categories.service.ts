import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Category} from "src/app/model/category";
import {ToastrService} from "ngx-toastr";
import {Collections} from "src/app/enums/collections.enum";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {CategoriesCollection} from "src/app/model/category";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private angFirestore: AngularFirestore,
              private toastr: ToastrService) { }

  saveCategory(data: Category): void{
    const {category} = data;
    this.angFirestore
      .collection<Category>(Collections.Categories)
      .add({category})
      .then((dockRef) => {
        this.toastr.success('Category added successfully');
      })
      .catch((error) => {
        console.log(error)
        this.toastr.error('Error');
      })
  }

  loadCategories(): Observable<CategoriesCollection[]> {
    return this.angFirestore
      .collection<Category>(Collections.Categories)
      .snapshotChanges()
      .pipe(
      map((actions) => {
        return actions.map((action) => {
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
          return {data, id}
        })
      })
    )
  }

  updateCategory(id: string, data: any): void{
    this.angFirestore
      .doc<CategoriesCollection>(`categories/${id}`)
      .update(data)
      .then(() => {
        this.toastr.success('Category updated successfully');
      })
      .catch((error) => {
        console.log(error)
        this.toastr.error('Error');
      });
  }

  deleteCategory(id: string): void{
    this.angFirestore
      .doc<CategoriesCollection>(`categories/${id}`)
      .delete()
      .then(() => {
        this.toastr.success('Category deleted successfully');
      })
      .catch((error) => {
        console.log(error)
        this.toastr.error('Error');
      })
  }
}
