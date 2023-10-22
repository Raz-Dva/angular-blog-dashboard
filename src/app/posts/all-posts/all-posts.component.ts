import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { Post } from 'src/app/model/dataPostForm.interface';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent implements OnInit {
  posts: Post[] | undefined;
  loadingImages: { [key: string]: boolean } = {};
  isLoadingPost = false;
  constructor(
    private postService: PostsService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.isLoadingPost = true;
    this.postService
      .getAllPosts()
      .pipe(untilDestroyed(this))
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoadingPost = false;
        this.posts.forEach((post) => {
          this.loadingImages[post.id] = true;
        });
      });
  }

  removePost(id: string, path: string): void {
    if (!confirm('Are you sure you want to delete the post?')) {
      return;
    }
    this.postService
      .deletePostById(id, path)
      .pipe(
        switchMap(() => {
          return this.postService.getPostById(id).get();
        }),
        untilDestroyed(this),
      )
      .subscribe((doc) => {
        if (!doc.exists) {
          this.toastr.success('Post deleted successfully');
        }
      });
  }

  markFeatured(id: string): void {
    this.postService
      .updatePostFeatured(id, { isFeatured: true })
      .subscribe((res) => {
        this.toastr.info('Featured Status Updated');
      });
  }

  removeFeatured(id: string): void {
    this.postService
      .updatePostFeatured(id, { isFeatured: false })
      .subscribe((res) => {
        this.toastr.info('Featured Status Updated');
      });
  }
}
