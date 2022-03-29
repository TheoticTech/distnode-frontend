// Third party
import React from 'react'
import { styled, alpha } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import HomeIcon from '@mui/icons-material/Home'
import Badge from '@mui/material/Badge'
import Link from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MailIcon from '@mui/icons-material/Mail'
import AddIcon from '@mui/icons-material/Add'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MoreIcon from '@mui/icons-material/MoreVert'

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
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  // Menu handlers
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const mobileMenuId = 'primary-search-account-menu-mobile'
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
    >
      <MenuItem>
        <StyledMenuItemLink href='/'>
          <HomeIcon />
          <span style={{ paddingLeft: '4em' }}>Home</span>
        </StyledMenuItemLink>
      </MenuItem>
      <MenuItem>
        <StyledMenuItemLink href='/posts/add'>
          <AddIcon />
          <span style={{ paddingLeft: '4em' }}>Create Post</span>
        </StyledMenuItemLink>
      </MenuItem>
      <MenuItem>
        <StyledMenuItemLink href='/user/messages'>
          <Badge badgeContent={4} color='error'>
            <MailIcon />
          </Badge>
          <span style={{ paddingLeft: '4em' }}>Messages</span>
        </StyledMenuItemLink>
      </MenuItem>
      <MenuItem>
        <StyledMenuItemLink href='/user/notifications'>
          <Badge badgeContent={7} color='error'>
            <NotificationsIcon />
          </Badge>
          <span style={{ paddingLeft: '4em' }}>Notifications</span>
        </StyledMenuItemLink>
      </MenuItem>
      <MenuItem>
        <StyledMenuItemLink href='/user/profile'>
          <AccountCircle />
          <span style={{ paddingLeft: '4em' }}>Profile</span>
        </StyledMenuItemLink>
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
              sx={{ display: { xs: 'none', sm: 'block' } }}
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
              <IconButton size='large' aria-label='create new' color='inherit'>
                <StyledMenuItemLink href='/posts/add'>
                  <AddIcon />
                </StyledMenuItemLink>
              </IconButton>

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
                  <StyledMenuItemLink href={`/user/${activeUserID}`}>
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
