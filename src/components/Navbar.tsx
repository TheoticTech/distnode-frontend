// Third party
import React from 'react'
import AccountCircle from '@mui/icons-material/AccountCircle'
import AddIcon from '@mui/icons-material/Add'
import AppBar from '@mui/material/AppBar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import HomeIcon from '@mui/icons-material/Home'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Link from '@mui/material/Link'
import MailIcon from '@mui/icons-material/Mail'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreIcon from '@mui/icons-material/MoreVert'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SearchIcon from '@mui/icons-material/Search'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { styled, alpha } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'

// Configurations
import { REACT_APP_NAME } from '../config'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto'
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch'
    }
  }
}))

const StyledMenuItemLink = styled(Link)(({ theme }) => ({
  color: 'inherit',
  textDecoration: 'none',
  justifyContent: 'space-between',
  verticalAlign: 'middle',
  display: 'flex',
  width: '100%'
}))

const Navbar = ({ activeUserID }: any) => {
  const navigate = useNavigate()
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const [addPostMenuEl, setAddPostMenuEl] = React.useState<null | HTMLElement>(
    null
  )
  const addPostMenuOpen = Boolean(addPostMenuEl)

  const handleAddPostMenuButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAddPostMenuEl(event.currentTarget)
  }
  const handleAddPostMenuClose = () => {
    setAddPostMenuEl(null)
  }

  // Menu handlers
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const mobileMenuId = 'mobile-menu'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      disableAutoFocusItem
    >
      <MenuItem>
        <StyledMenuItemLink href='/'>
          <HomeIcon />
          <span style={{ paddingLeft: '4em' }}>Home</span>
        </StyledMenuItemLink>
      </MenuItem>
      <MenuItem>
        <StyledMenuItemLink href='/post/add'>
          <AddIcon />
          <span style={{ paddingLeft: '4em' }}>Create Post</span>
        </StyledMenuItemLink>
      </MenuItem>
      {/*
      // Messages not implemented yet
      <MenuItem>
        <StyledMenuItemLink href='/user/messages'>
          <Badge badgeContent={4} color='error'>
            <MailIcon />
          </Badge>
          <span style={{ paddingLeft: '4em' }}>Messages</span>
        </StyledMenuItemLink>
      </MenuItem>
      */}
      {/*
      // Notifications not implemented yet
      <MenuItem>
        <StyledMenuItemLink href='/user/notifications'>
          <Badge badgeContent={7} color='error'>
            <NotificationsIcon />
          </Badge>
          <span style={{ paddingLeft: '4em' }}>Notifications</span>
        </StyledMenuItemLink>
      </MenuItem>
      */}
      <MenuItem>
        {activeUserID ? (
          <StyledMenuItemLink href={`/user/view/${activeUserID}`}>
            <AccountCircle />
            <span style={{ paddingLeft: '4em' }}>Profile</span>
          </StyledMenuItemLink>
        ) : (
          <StyledMenuItemLink href='/auth/login'>
            <AccountCircle />
            <span style={{ paddingLeft: '4em' }}>Login</span>
          </StyledMenuItemLink>
        )}
      </MenuItem>
    </Menu>
  )

  return (
    <div data-testid='navbar'>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static' style={{ background: '#1976D2' }}>
          <Toolbar>
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ display: 'block' }}
            >
              <StyledMenuItemLink href='/'>{REACT_APP_NAME}</StyledMenuItemLink>
            </Typography>

            {/*
              // Search not implemented yet
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder='Search…'
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
            */}

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton onClick={handleAddPostMenuButtonClick}>
                <AddIcon sx={{ color: 'white' }} />
              </IconButton>
              <Menu
                id='add-post-options-menu'
                anchorEl={addPostMenuEl}
                open={addPostMenuOpen}
                onClose={handleAddPostMenuClose}
                disableAutoFocusItem
              >
                <MenuItem
                  onClick={() => {
                    handleAddPostMenuClose()
                    navigate('/post/add/?type=blog')
                  }}
                >
                  Blog Post
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    handleAddPostMenuClose()
                    navigate('/post/add/?type=link')
                  }}
                >
                  Link Post
                </MenuItem>
              </Menu>

              {/*
                // Messages not implemented yet
                <IconButton
                  size='large'
                  aria-label='show 4 new messages'
                  color='inherit'
                >
                  <Badge badgeContent={4} color='error'>
                    <MailIcon />
                  </Badge>
                </IconButton>
              */}

              {/*
                // Notifications not implemented yet
                <IconButton
                  size='large'
                  aria-label='show 17 new notifications'
                  color='inherit'
                >
                  <Badge badgeContent={17} color='error'>
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              */}

              <IconButton
                size='large'
                aria-label='user profile'
                color='inherit'
              >
                {activeUserID ? (
                  <StyledMenuItemLink href={`/user/view/${activeUserID}`}>
                    <AccountCircle />
                  </StyledMenuItemLink>
                ) : (
                  <StyledMenuItemLink href='/auth/login'>
                    <AccountCircle />
                  </StyledMenuItemLink>
                )}
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                aria-label='show more'
                aria-controls={mobileMenuId}
                aria-haspopup='true'
                onClick={handleMobileMenuOpen}
                color='inherit'
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
      </Box>
    </div>
  )
}

export default Navbar
