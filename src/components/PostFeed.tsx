// Third party
import Masonry from '@mui/lab/Masonry'

// Local
import '../style/base.css'
import PostCard from './PostCard'

function PostFeed({ activeUserID, posts }: any) {
  return (
    <Masonry columns={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 5 }} spacing={4}>
      {posts.map((post: any) => (
        <PostCard
          key={post.postID}
          activeUserID={activeUserID}
          authorUserID={post.userID}
          authorUsername={post.username}
          avatarSrc={post.userAvatar}
          headerImageSrc='https://distnode-static-dev.sfo3.digitaloceanspaces.com/uploads/paella.jpg'
          title={post.title}
          createdAt={post.postCreatedAt}
          description={post.description}
          linkHref={`/post/${post.postID}`}
          linkText='Read more'
        />
      ))}
    </Masonry>
  )
}

export default PostFeed
