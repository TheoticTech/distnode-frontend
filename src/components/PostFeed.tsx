// Third party
import Masonry from '@mui/lab/Masonry'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import moment from 'moment'

// Local
import '../style/base.css'
import MediaCard from './MediaCard'

function PostFeed({ activeUserID, posts }: any) {
  return (
    <Masonry columns={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 5 }} spacing={4}>
      {posts.map((post: any) => (
        <MediaCard
          key={post.postID}
          headerImageSrc='https://distnode-static-dev.sfo3.digitaloceanspaces.com/uploads/paella.jpg'
          title={post.title}
          subheader={`Posted ${moment
            .duration(post.createdAt - Date.now())
            .humanize(true)} by ${post.username}`}
          body={post.description}
          linkHref={`/post/${post.postID}`}
          linkText='Read more'
        />
      ))}
    </Masonry>
  )
}

export default PostFeed
