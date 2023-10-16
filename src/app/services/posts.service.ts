import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  DataPostForm,
  PostDataUpdate,
} from 'src/app/model/dataPostForm.interface';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { EMPTY, from, Observable, Subject } from 'rxjs';
import { map, take, switchMap, catchError } from 'rxjs/operators';
import { tag } from 'rxjs-spy/operators';

type SaveDataResult = { resultText: string; error?: any; data?: any };

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(
    private storage: AngularFireStorage,
    private store: AngularFirestore,
  ) {}
  saveDataPost(
    image: File,
    postData: DataPostForm,
  ): Observable<SaveDataResult> {
    const resultSubject = new Subject<SaveDataResult>();

    from(this.storage.upload(postData.postImgPath, image))
      .pipe(
        tag('3'),
        switchMap(() => {
          return from(this.storage.ref(postData.postImgPath).getDownloadURL());
        }),
        catchError((error) => {
          this.handlerError('Error upload image', resultSubject, error);
          return EMPTY;
        }),
        switchMap((URL) => {
          if (!URL) {
            this.handlerError('Error upload image', resultSubject);
            return EMPTY;
          }
          postData.postImgURL = URL;
          return from(this.store.collection('posts').add(postData));
        }),
        catchError((error) => {
          this.handlerError('Error save Post', resultSubject, error);
          return EMPTY;
        }),
      )
      .subscribe((docRef) => {
        if (docRef) {
          resultSubject.next({ resultText: 'success' });
        } else {
          this.handlerError('Error save Post', resultSubject);
        }
      });

    return resultSubject.asObservable().pipe(take(1));
  }

  getAllPosts(): any {
    return this.store
      .collection('posts')
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

  getPostById(id: string): AngularFirestoreDocument<DataPostForm> {
    return this.store.doc<DataPostForm>(`posts/${id}`);
  }

  updatePostById(
    id: string,
    data: PostDataUpdate,
    file?: File,
  ): Observable<any> {
    const resultSubject = new Subject<any>();
    console.log(data );

    if (file && data.postImgPath) {
      // const imagePath = `postImg/${Date.now()}`;
      const ref = this.storage.ref(data.postImgPath);
      const task = ref.put(file);
      task.then((res) => {
        console.log(res);
      });
    }

    this.store
      .doc(`posts/${id}`)
      .update(data)
      .then(() => {
        resultSubject.next({ resultText: 'Post updated successfully' });
      })
      .catch((error) => {
        this.handlerError('Error upload', resultSubject, error);
      });

    return resultSubject.asObservable().pipe(take(1));
  }

  deleteById(id: string): Promise<void> {
    // also remove img
    return this.store.doc(`posts/${id}`).delete();
  }

  handlerError<T>(errorText: string, subject: Subject<T>, error?: Error) {
    subject.error({ error, resultText: errorText });
    subject.complete();
  }
}
