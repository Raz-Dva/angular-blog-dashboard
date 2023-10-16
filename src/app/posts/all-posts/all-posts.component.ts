import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { Post } from 'src/app/model/dataPostForm.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent implements OnInit {
  posts: Post[] | undefined;
  loadingImages: { [key: string]: boolean } = {};
  constructor(
    private postService: PostsService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.postService.getAllPosts().subscribe((posts: Post[]) => {
      this.posts = posts;
      this.posts.forEach((post) => {
        this.loadingImages[post.id] = true;
      });
    });
  }

  removePost(id: string): void {
    this.postService.deleteById(id).then(() => {
      this.postService
        .getPostById(id)
        .get()
        .subscribe((doc) => {
          if (!doc.exists) {
            this.toastr.success('Post deleted successfully');
          }
        });
    });
  }
}
