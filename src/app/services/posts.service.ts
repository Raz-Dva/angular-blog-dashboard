import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  PostDataForm,
  PostDataUpdate,
  PostFeaturedUpdate,
} from 'src/app/model/dataPostForm.interface';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { EMPTY, from, Observable, Subject, throwError } from 'rxjs';
import { map, take, switchMap, catchError, tap } from 'rxjs/operators';

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
    postData: PostDataForm,
  ): Observable<SaveDataResult> {
    const resultSubject = new Subject<SaveDataResult>();

    from(this.storage.upload(postData.postImgPath, image))
      .pipe(
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

  getPostById(id: string): AngularFirestoreDocument<PostDataForm> {
    return this.store.doc<PostDataForm>(`posts/${id}`);
  }

  updatePostById(
    id: string,
    data: PostDataUpdate,
    file?: File,
    path?: string,
  ): Observable<any> {
    const resultSubject = new Subject<any>();
    let updateObservable = from(this.store.doc(`posts/${id}`).update(data));

    if (file && path) {
      const storageRef = this.storage.ref(path);

      updateObservable = from(storageRef.put(file)).pipe(
        switchMap((task) => {
          if (task.state === 'success') {
            return storageRef.getDownloadURL();
          } else {
            return throwError(new Error('Error update image'));
          }
        }),
        tap((URL) => {
          data.postImgURL = URL;
        }),
        switchMap(() => {
          return from(this.store.doc(`posts/${id}`).update(data));
        }),
      );
    }

    updateObservable
      .pipe(
        catchError((error) => {
          const messageErr = error.message || 'Error update post';
          this.handlerError(messageErr, resultSubject, error);
          return EMPTY;
        }),
      )
      .subscribe(() => {
        resultSubject.next({ resultText: 'Post updated successfully' });
      });

    return resultSubject.asObservable().pipe(take(1));
  }

  updatePostFeatured(id: string, data: PostFeaturedUpdate): Observable<void> {
    return from(this.store.doc(`posts/${id}`).update(data));
  }

  deletePostById(id: string, imgPath: string): Observable<void> {
    return this.storage
      .ref(imgPath)
      .delete()
      .pipe(
        switchMap((result) => {
          return from(this.store.doc(`posts/${id}`).delete());
        }),
      );
  }

  private handlerError<T>(
    errorText: string,
    subject: Subject<T>,
    error?: Error,
  ) {
    subject.error({ error, resultText: errorText });
    subject.complete();
  }
}
