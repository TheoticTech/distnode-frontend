// Third party
import Masonry from 'react-masonry-css'

// Local
import baseTheme from '../style/baseTheme'
import '../style/base.css'
import PostCard from './PostCard'
import { PostCardProps } from '../types/PostCardProps'
import VisibilityTriggerWrapper from '../components/VisibilityTrigger'

function PostFeed({
  posts,
  activeUserID,
  onPostReaction,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onLastIsVisible = () => {}
}: any) {
  const { values: breakpointValues } = baseTheme.breakpoints
  const breakpointCols = {
    default: 3,
    [breakpointValues.xs]: 1,
    [breakpointValues.sm]: 1,
    [breakpointValues.md]: 1,
    [breakpointValues.lg]: 2,
    [breakpointValues.xl]: 3
  }

  return (
    <Masonry
      breakpointCols={breakpointCols}
      className='masonry-grid'
      columnClassName='masonry-grid-column'
      style={{ marginTop: '2em', marginBottom: '2em' }}
    >
      {posts.map(
        (post: PostCardProps, index: number, array: Array<PostCardProps>) => {
          // Wrap last post in VisibilityTriggerWrapper
          if (array.length - 1 === index) {
            return (
              <VisibilityTriggerWrapper
                key={post.postID}
                onVisible={onLastIsVisible}
                child={
                  <PostCard
                    activeUserID={activeUserID}
                    authorUserID={post.userID}
                    authorUsername={post.username}
                    avatarSrc={post.avatar}
                    headerImageSrc={post.thumbnail}
                    postID={post.postID}
                    title={post.title}
                    createdAt={post.postCreatedAt}
                    description={post.description}
                    published={post.published}
                    reaction={post.reaction}
                    onPostReaction={onPostReaction}
                  />
                }
              />
            )
          } else {
            return (
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
                published={post.published}
                reaction={post.reaction}
                onPostReaction={onPostReaction}
              />
            )
          }
        }
      )}
    </Masonry>
  )
}

export default PostFeed
