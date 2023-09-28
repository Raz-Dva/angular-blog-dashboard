import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Category} from "src/app/model/category";
import {ToastrService} from "ngx-toastr";
import {Collections} from "src/app/enums/collections.enum";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private angFirestore: AngularFirestore,
              private toastr: ToastrService) {
  }

  saveCategory(data: Category): void {
    this.angFirestore
      .collection(Collections.Categories)
      .add(data)
      .then((dockRef) => {
        console.log(dockRef);
        this.toastr.success('Category added successfully');
      })
      .catch((error) => {
        console.log(error);
        this.toastr.error('Error');
      })
  }

  loadCategories(): any {
    return this.angFirestore.collection(Collections.Categories).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((action) => {
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
          return { data, id }
        })
      })
    )
  }
}
