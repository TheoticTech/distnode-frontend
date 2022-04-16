// Third party
import Masonry from '@mui/lab/Masonry'

// Local
import '../style/base.css'
import PostCard from './PostCard'

function PostFeed({ activeUserID, posts }: any) {
  return (
    <Masonry columns={{ xs: 1, sm: 1, md: 2, lg: 3 }} spacing={4}>
      {posts.map((post: any) => (
        <PostCard
          key={post.postID}
          activeUserID={activeUserID}
          authorUserID={post.userID}
          authorUsername={post.username}
          avatarSrc={post.avatar}
          headerImageSrc={post.thumbnail}
          postID={post.postID}
          title={post.title}
          createdAt={post.postCreatedAt}
          description={post.description}
        />
      ))}
    </Masonry>
  )
}

export default PostFeed
