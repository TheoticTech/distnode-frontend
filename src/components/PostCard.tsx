// Third party
import React from 'react'
import axios from 'axios'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import Cookies from 'js-cookie'
import Divider from '@mui/material/Divider'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import moment from 'moment'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Popover from '@mui/material/Popover'
import { useNavigate } from 'react-router-dom'
import ShareIcon from '@mui/icons-material/Share'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

// Local
import { apiHandler } from '../utils/apiHandler'
import { react } from '../utils/react'

// Configurations
import { REACT_APP_API_URL } from '../config'

function PostCard({
  activeUserID,
  authorUserID,
  authorUsername,
  avatarSrc,
  headerImageSrc,
  postID,
  title,
  createdAt,
  description,
  published,
  reaction,
  onPostReaction
}: any) {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = React.useState('')
  const [postCardOptionsMenuEl, setPostCardOptionsMenuEl] =
    React.useState<null | HTMLElement>(null)
  const open = Boolean(postCardOptionsMenuEl)

  const handlePostCardOptionsMenuButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setPostCardOptionsMenuEl(event.currentTarget)
  }
  const handlePostCardOptionsMenuButtonClose = () => {
    setPostCardOptionsMenuEl(null)
  }

  const [popoverAnchorEl, setPopoverAnchorEl] =
    React.useState<null | HTMLElement>(null)
  const handlePopoverClick = (event: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchorEl(popoverAnchorEl ? null : event.currentTarget)
  }
  const handlePopoverClose = () => {
    setPopoverAnchorEl(null)
  }
  const popoverOpen = Boolean(popoverAnchorEl)
  const id = popoverOpen ? 'simple-popover' : undefined

  const confirmDeletePost = async (postID: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await apiHandler({
          apiCall: async () => {
            await axios.delete(
              `${REACT_APP_API_URL}/api/posts/delete/${postID}`,
              {
                data: {
                  csrfToken: Cookies.get('csrfToken')
                },
                withCredentials: true
              }
            )
            navigate(0)
          },
          onError: () => {
            console.error('Unable to delete post, please try again later.')
          }
        })
      } catch (err: any) {
        console.error(
          'An error occurred while calling apiHandler',
          'PostCard - confirmDeletePost'
        )
      }
    }
  }

  return (
    <Card sx={{ borderRadius: '8px' }}>
      <CardHeader
        avatar={
          <Link href={`/user/view/${authorUserID}`}>
            {avatarSrc ? (
              <Avatar src={avatarSrc} />
            ) : (
              <Avatar sx={{ bgcolor: '#EA526F' }}>
                {authorUsername[0].toUpperCase()}
              </Avatar>
            )}
          </Link>
        }
        action={
          activeUserID === authorUserID ? (
            <Grid>
              <IconButton onClick={handlePostCardOptionsMenuButtonClick}>
                <MoreVertIcon sx={{ color: 'white' }} />
              </IconButton>
              <Menu
                id='post-card-options-menu'
                anchorEl={postCardOptionsMenuEl}
                open={open}
                onClose={handlePostCardOptionsMenuButtonClose}
                disableAutoFocusItem
              >
                <MenuItem
                  onClick={() => {
                    handlePostCardOptionsMenuButtonClose()
                    navigate(`/post/edit/${postID}`)
                  }}
                >
                  Edit Post
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    confirmDeletePost(postID)
                    handlePostCardOptionsMenuButtonClose()
                  }}
                  sx={{ color: 'red' }}
                >
                  Delete Post
                </MenuItem>
              </Menu>
            </Grid>
          ) : null
        }
        titleTypographyProps={{ variant: 'h5' }}
        title={
          <Link href={`/post/view/${postID}`} underline='hover' variant='h4'>
            {title}
            {published ? '' : ' (draft)'}
          </Link>
        }
        subheaderTypographyProps={{ variant: 'subtitle1', color: 'white' }}
        subheader={
          <div>
            {`Posted ${moment
              .duration(parseInt(createdAt) - Date.now())
              .humanize(true)} by `}
            <Link
              href={`/user/view/${authorUserID}`}
              underline='hover'
              variant='body1'
              style={{
                color: 'white'
              }}
            >
              {authorUsername}
            </Link>
          </div>
        }
      />
      {headerImageSrc && (
        <Link href={`/post/view/${postID}`}>
          <CardMedia
            component='img'
            sx={{ objectFit: 'contain', maxHeight: '100vh' }}
            image={headerImageSrc}
          />
        </Link>
      )}
      <CardContent>
        <Typography variant='body2' color='white'>
          {description}
        </Typography>
        {errorMessage && (
          <Typography variant='h6' color='error'>
            {errorMessage}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Grid container sx={{ justify: 'space-between' }}>
          <Grid
            item
            xs={6}
            sx={{
              display: 'flex',
              justifyContent: 'left'
            }}
          >
            <div>
              <IconButton
                onClick={async (e) => {
                  if (activeUserID) {
                    react({ postID, reactionType: 'Like' })
                    if (reaction === 'Like') {
                      onPostReaction({ postID })
                    } else {
                      onPostReaction({ postID, reactionType: 'Like' })
                    }
                  } else {
                    handlePopoverClick(e)
                  }
                }}
              >
                <ThumbUpIcon
                  sx={
                    reaction !== 'Like'
                      ? {
                          color: 'white',
                          '&:hover': {
                            color: '#4FC1F1'
                          }
                        }
                      : {
                          color: '#4FC1F1'
                        }
                  }
                />
              </IconButton>
              <IconButton
                onClick={async (e) => {
                  if (activeUserID) {
                    react({ postID, reactionType: 'Dislike' })
                    if (reaction === 'Dislike') {
                      onPostReaction({ postID })
                    } else {
                      onPostReaction({ postID, reactionType: 'Dislike' })
                    }
                  } else {
                    handlePopoverClick(e)
                  }
                }}
              >
                <ThumbDownIcon
                  sx={
                    reaction !== 'Dislike'
                      ? {
                          color: 'white',
                          '&:hover': {
                            color: 'red'
                          }
                        }
                      : {
                          color: 'red'
                        }
                  }
                />
              </IconButton>
              <Popover
                id={id}
                open={popoverOpen}
                anchorEl={popoverAnchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
              >
                <Typography sx={{ p: 2 }}>
                  <Link href={'/auth/login'}>Login</Link> to react
                </Typography>
              </Popover>
            </div>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <IconButton
              onClick={async () => {
                try {
                  await navigator.share({
                    title: `DistNode`,
                    text: `${title}: ${description}`,
                    url: `/post/view/${postID}`
                  })
                } catch (err) {
                  console.error(err)
                }
              }}
            >
              <ShareIcon
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: '#4FC1F1'
                  }
                }}
              />
            </IconButton>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  )
}

export default PostCard
