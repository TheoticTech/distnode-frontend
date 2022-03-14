// Third party
import React from 'react'
import { styled, alpha } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import Badge from '@mui/material/Badge'
import Link from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MailIcon from '@mui/icons-material/Mail'
import AddIcon from '@mui/icons-material/Add'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MoreIcon from '@mui/icons-material/MoreVert'
import Modal from '@mui/material/Modal'

// Local
import CreatePost from './CreatePost'

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

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#434343',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  color: 'inherit'
}

const StyledMenuItemLink = styled(Link)(({ theme }) => ({
  color: 'inherit',
  textDecoration: 'none'
}))

const Navbar = ({ navbarCreatePostHandler }: any) => {
  const [accountAnchorEl, setAccountAnchorEl] =
    React.useState<null | HTMLElement>(null)
  const [addAnchorEl, setAddAnchorEl] = React.useState<null | HTMLElement>(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null)
  const isAddMenuOpen = Boolean(addAnchorEl)
  const isAccountMenuOpen = Boolean(accountAnchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
  const [createPostModalOpen, setCreatePostModalOpen] = React.useState(false)

  // Modal handlers
  const handleCreatePostModalOpen = () => {
    handleAddMenuClose()
    setCreatePostModalOpen(true)
  }
  const handleCreatePostModalClose = () => setCreatePostModalOpen(false)

  // Menu handlers
  const handleAddMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAddAnchorEl(event.currentTarget)
  }

  const handleAddMenuClose = () => {
    setAddAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountAnchorEl(event.currentTarget)
  }

  const handleAccountMenuClose = () => {
    setAccountAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const addMenuId = 'create-new-menu'
  const renderAddMenu = (
    <Menu
      anchorEl={addAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      id={addMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={isAddMenuOpen}
      onClose={handleAddMenuClose}
    >
      <MenuItem onClick={handleCreatePostModalOpen}>Post</MenuItem>
      <MenuItem onClick={handleAddMenuClose}>Friend Request</MenuItem>
    </Menu>
  )

  const accountMenuId = 'primary-search-account-menu'
  const renderAccountMenu = (
    <Menu
      anchorEl={accountAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      id={accountMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={isAccountMenuOpen}
      onClose={handleAccountMenuClose}
    >
      <MenuItem onClick={handleAccountMenuClose}>
        <StyledMenuItemLink href='/auth/profile'>Profile</StyledMenuItemLink>
      </MenuItem>
      <MenuItem onClick={handleAccountMenuClose}>
        <StyledMenuItemLink href='/auth/account'>Settings</StyledMenuItemLink>
      </MenuItem>
    </Menu>
  )

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
      <MenuItem onClick={handleAddMenuOpen}>
        <IconButton
          size='large'
          aria-label='create new'
          aria-controls={addMenuId}
          aria-haspopup='true'
          color='inherit'
        >
          <AddIcon />
        </IconButton>
        <p>Add</p>
      </MenuItem>
      <MenuItem>
        <IconButton size='large' aria-label='show 4 new mails' color='inherit'>
          <Badge badgeContent={4} color='error'>
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size='large'
          aria-label='show 17 new notifications'
          color='inherit'
        >
          <Badge badgeContent={17} color='error'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleAccountMenuOpen}>
        <IconButton
          size='large'
          aria-label='account of current user'
          aria-controls={accountMenuId}
          aria-haspopup='true'
          color='inherit'
        >
          <AccountCircle />
        </IconButton>
        <p>Account</p>
      </MenuItem>
    </Menu>
  )

  return (
    <div data-testid='navbar'>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static' style={{ background: '#1976D2' }}>
          <Toolbar>
            <IconButton
              size='large'
              edge='start'
              color='inherit'
              aria-label='open drawer'
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              {REACT_APP_NAME}
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder='Search…'
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton
                size='large'
                edge='end'
                aria-label='create new'
                aria-controls={addMenuId}
                aria-haspopup='true'
                onClick={handleAddMenuOpen}
                color='inherit'
              >
                <AddIcon />
              </IconButton>
              <IconButton
                size='large'
                aria-label='show 4 new mails'
                color='inherit'
              >
                <Badge badgeContent={4} color='error'>
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                size='large'
                aria-label='show 17 new notifications'
                color='inherit'
              >
                <Badge badgeContent={17} color='error'>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size='large'
                edge='end'
                aria-label='account of current user'
                aria-controls={accountMenuId}
                aria-haspopup='true'
                onClick={handleAccountMenuOpen}
                color='inherit'
              >
                <AccountCircle />
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
        {renderAddMenu}
        {renderAccountMenu}
      </Box>
      <Modal
        open={createPostModalOpen}
        onClose={handleCreatePostModalClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={modalStyle}>
          <CreatePost
            createPostHandler={() => {
              navbarCreatePostHandler()
              handleCreatePostModalClose()
            }}
          />
        </Box>
      </Modal>
    </div>
  )
}

export default Navbar
