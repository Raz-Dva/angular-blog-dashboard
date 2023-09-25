import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  constructor(private angFirestore: AngularFirestore) {

  }

  ngOnInit(): void {
  }

  onSubmit(formData: NgForm): void {
    this.angFirestore
      .collection('categories')
      .add(formData.value)
      .then((dockRef) => {
        console.log(dockRef);
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
