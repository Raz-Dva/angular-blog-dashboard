import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Post } from 'src/app/model/post';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

type SaveDataResult = { resultText: string; error?: any; data?: any };

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(
    private storage: AngularFireStorage,
    private angularFireStore: AngularFirestore,
  ) {}
  saveDataPost(image: File, postData: Post): Observable<SaveDataResult> {
    const resultSubject = new Subject<SaveDataResult>();
    const imagePath = `postImg/${Date.now()}`;
    const handleError = (
      errorText: string,
      error: Error | undefined = undefined,
    ) => {
      resultSubject.error({ error, resultText: errorText });
      resultSubject.complete();
    };

    this.storage
      .upload(imagePath, image)
      .then(() => {
        this.storage
          .ref(imagePath)
          .getDownloadURL()
          .subscribe((URL) => {
            if (URL) {
              postData.postImgPath = URL;

              this.angularFireStore
                .collection('posts')
                .add(postData)
                .then((doRef) => {
                  if (doRef) {
                    resultSubject.next({ resultText: 'success' });
                  } else {
                    handleError('Error save Post');
                  }
                })
                .catch((error) => {
                  handleError('Error save Post');
                });
            } else {
              handleError('Error upload image');
            }
          });
      })
      .catch((error) => {
        handleError('Error upload image', error);
      });

    return resultSubject.pipe(take(1));
  }
}
