export interface CreatePostsInterface {
  title: string;
  description?: string;
  user: {
    userId: string;
    username: string;
  };
}
