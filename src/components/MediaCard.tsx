import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import FavoriteIcon from '@mui/icons-material/Favorite'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ShareIcon from '@mui/icons-material/Share'
import Typography from '@mui/material/Typography'
import { Grid } from '@mui/material'

function MediaCard({
  headerImageSrc,
  title,
  subheader,
  body,
  linkHref,
  linkText
}: any) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <Link href={linkHref}>
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: 'red' }}>R</Avatar>}
          action={
            <IconButton>
              <MoreVertIcon sx={{ color: 'white' }} />
            </IconButton>
          }
          titleTypographyProps={{ variant: 'h5' }}
          title={title}
          subheaderTypographyProps={{ color: 'white' }}
          subheader={subheader}
        />
        {headerImageSrc && (
          <CardMedia component='img' height='194' image={headerImageSrc} />
        )}
        <CardContent>
          <Typography variant='body2' color='white'>
            {body}
          </Typography>
        </CardContent>
        <CardActions>
          <Grid item xs={6}>
            <Link href={linkHref}>{linkText}</Link>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <IconButton href='/favorites'>
              <FavoriteIcon
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'red'
                  }
                }}
              />
            </IconButton>
            <IconButton href='/share'>
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
        </CardActions>
      </Link>
    </Card>
  )
}

export default MediaCard
