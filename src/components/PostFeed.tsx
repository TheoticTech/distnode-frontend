// Third party
import Masonry from 'react-masonry-css'

// Local
import baseTheme from '../style/baseTheme'
import '../style/base.css'
import PostCard from './PostCard'

function PostFeed({ activeUserID, posts }: any) {
  const { values: breakpointValues } = baseTheme.breakpoints
  // xs, sm, md, lg, xl
  const breakpointCols = {
    default: 1,
    [breakpointValues.xs]: 1,
    [breakpointValues.sm]: 1,
    [breakpointValues.md]: 2,
    [breakpointValues.lg]: 3,
    [breakpointValues.xl]: 3
  }

  return (
    <Masonry
      breakpointCols={breakpointCols}
      className='masonry-grid'
      columnClassName='masonry-grid-column'
    >
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
