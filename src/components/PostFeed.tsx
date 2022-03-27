// Third party
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import moment from 'moment'

// Local
import '../style/base.css'
import MediaCard from './MediaCard'

function PostFeed({ activeUserID, posts }: any) {
  return (
    <ImageList variant='masonry' cols={3} gap={12}>
      {posts.map((post: any) => (
        <ImageListItem key={post.postID}>
          <MediaCard
            headerImageSrc='https://distnode-static-dev.sfo3.digitaloceanspaces.com/uploads/paella.jpg'
            title={post.title}
            subheader={moment
              .duration(post.createdAt - Date.now())
              .humanize(true)}
            body={post.description}
            linkHref={`/post/${post.postID}`}
            linkText='Read more'
          />
        </ImageListItem>
      ))}
    </ImageList>
  )
}

export default PostFeed
