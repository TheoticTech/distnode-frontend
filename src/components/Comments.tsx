// Third party
import * as React from 'react'
import { alpha, styled } from '@mui/material/styles'
import { TransitionProps } from '@mui/material/transitions'
import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import clsx from 'clsx'
import Collapse from '@mui/material/Collapse'
import Cookies from 'js-cookie'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import MinusSquare from '@mui/icons-material/IndeterminateCheckBoxOutlined'
import moment from 'moment'
import PlusSquare from '@mui/icons-material/AddBoxOutlined'
import TextField from '@mui/material/TextField'
import TreeView from '@mui/lab/TreeView'
import Typography from '@mui/material/Typography'
import TreeItem, {
  treeItemClasses,
  TreeItemContentProps,
  useTreeItem
} from '@mui/lab/TreeItem'
import _ from 'lodash'

// Local
import { AuthError, apiHandler } from '../utils/apiHandler'

// Configurations
import { REACT_APP_API_URL, REACT_APP_AUTH_URL } from '../config'

const parseComments = (comments: any) => {
  if (!comments) {
    return []
  }
  const commentTree: any = {}
  comments.forEach((comment: any) => {
    if (comment.commentToCommentRelationship.length === 0) {
      commentTree[comment.rootComment.identity.low] = {
        text: comment.rootComment.properties.text,
        from: comment.rootCommentFrom.username,
        fromID: comment.rootCommentFrom.userID,
        avatar: comment.rootCommentFrom.avatar,
        createdAt: comment.rootComment.created_at
      }
    } else {
      const commentPath =
        [...comment.commentToCommentRelationship]
          .reverse()
          .map((relationship: any) => {
            return relationship.end.low
          })
          .join('.') +
        '.' +
        comment.replyComment.identity.low
      _.set(commentTree, commentPath, {
        text: comment.replyComment.properties.text,
        from: comment.replyCommentFrom.username,
        fromID: comment.replyCommentFrom.userID,
        avatar: comment.replyCommentFrom.avatar,
        createdAt: comment.replyComment.created_at
      })
    }
  })

  const renderTree = (nodes: any): any => {
    return Object.keys(nodes).map((nodeKey) => {
      const { text, from, fromID, avatar, createdAt, ...childrenObjects } =
        nodes[nodeKey]
      return {
        id: nodeKey,
        name: nodes[nodeKey].text,
        from: nodes[nodeKey].from,
        fromID: nodes[nodeKey].fromID,
        avatar: nodes[nodeKey].avatar,
        createdAt: nodes[nodeKey].createdAt,
        ...(Object.keys(childrenObjects).length > 0 && {
          children: renderTree(childrenObjects)
        })
      }
    })
  }

  return renderTree(commentTree)
}

function TransitionComponent(props: TransitionProps) {
  return <Collapse {...props} />
}

const confirmDeleteComment = async (commentID: number) => {
  // const navigate = useNavigate()

  if (window.confirm('Are you sure you want to delete this comment?')) {
    try {
      // First, ensure user has fresh CSRF token
      await axios.get(`${REACT_APP_AUTH_URL}/auth/refreshed-tokens`, {
        withCredentials: true
      })
      // Then, delete post
      await apiHandler(async () => {
        await axios.delete(
          `${REACT_APP_API_URL}/api/comments/delete/${commentID}`,
          {
            data: {
              csrfToken: Cookies.get('csrfToken')
            },
            withCredentials: true
          }
        )
        window.location.reload()
      })
    } catch (err: any) {
      console.error(err)
    }
  }
}

const CommentBox = ({
  label = 'Reply',
  postID,
  rootComment,
  navigate
}: any) => {
  const [isActive, setIsActive] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  const addComment = async (
    commentData: React.FormEvent<HTMLFormElement>,
    postID: any,
    rootComment: any
  ) => {
    commentData.preventDefault()

    try {
      const commentText = commentData.currentTarget.commentText.value
      if (commentText) {
        return await apiHandler(async () => {
          await axios.post(
            rootComment
              ? `${REACT_APP_API_URL}/api/posts/${postID}/comment/${rootComment}/reply`
              : `${REACT_APP_API_URL}/api/posts/${postID}/comment`,
            {
              comment: commentText,
              csrfToken: Cookies.get('csrfToken')
            },
            { withCredentials: true }
          )
          window.location.reload()
        })
      }
    } catch (err: any) {
      if (err instanceof AuthError) {
        navigate('/auth/login', { state: { next: `/post/view/${postID}` } })
      } else {
        setErrorMessage(err.message)
      }
    }
  }

  return (
    <Box
      component='form'
      onSubmit={async (commentData: any) => {
        await addComment(commentData, postID, rootComment)
      }}
      noValidate
      sx={{ input: { color: 'white' }, width: '100%', mt: 0 }}
    >
      <Grid
        container
        direction='row'
        onFocus={() => setIsActive(true)}
        // Prevent blurring before button submit is called
        onBlur={() => setTimeout(() => setIsActive(false), 100)}
      >
        <Grid item md={isActive ? 11 : 0} xs={12}>
          <TextField
            inputProps={{ style: { color: 'white' } }}
            variant='filled'
            multiline
            minRows={1}
            size='small'
            fullWidth
            required
            id='commentText'
            label={label}
            name='commentText'
          />
        </Grid>
        <Grid
          item
          md={isActive ? 1 : 0}
          xs={12}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <Button
            type='submit'
            fullWidth
            variant='contained'
            size='small'
            sx={{
              alignSelf: 'center',
              height: '2rem',
              display: isActive ? 'initial' : 'none'
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
      <Grid>
        {errorMessage && (
          <Typography variant='body1' color='error'>
            {errorMessage}
          </Typography>
        )}
      </Grid>
    </Box>
  )
}

const CustomContent = React.forwardRef(function CustomContent(
  props: TreeItemContentProps,
  ref
) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon
  } = props

  const { disabled, expanded, handleExpansion } = useTreeItem(nodeId)

  const icon = iconProp || expansionIcon || displayIcon

  const handleExpansionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    handleExpansion(event)
  }

  return (
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.disabled]: disabled
      })}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography component='div' className={classes.label}>
        {label}
      </Typography>
    </div>
  )
})

const StyledTreeItem = styled((props: any) => (
  <TreeItem
    {...props}
    ContentComponent={CustomContent}
    TransitionComponent={TransitionComponent}
  />
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3
    },
    marginRight: theme.spacing(1)
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.7)}`
  }
}))

const renderTreeItems = (nodes: any, activeUserID: string | undefined) => {
  return nodes.map((node: any) => {
    return (
      <StyledTreeItem
        key={node.id}
        nodeId={node.id}
        sx={{ mx: '1rem', my: '2rem' }}
        label={
          <Grid container>
            <Grid
              container
              direction='row'
              sx={{ WebkitAlignItems: 'center', mb: '0.5rem' }}
            >
              <Link href={`/user/view/${node.fromID}`} sx={{ mr: '0.5rem' }}>
                {node.avatar ? (
                  <Avatar src={node.avatar} />
                ) : (
                  <Avatar sx={{ bgcolor: '#EA526F' }}>
                    {node.from[0].toUpperCase()}
                  </Avatar>
                )}
              </Link>
              <Typography variant='body1' sx={{ fontStyle: 'italic' }}>
                {node.from}
              </Typography>
              &nbsp;
              <Typography variant='body1' sx={{ opacity: '70%' }}>
                -{' '}
                {moment
                  .duration(parseInt(node.createdAt) - Date.now())
                  .humanize(true)}
              </Typography>
            </Grid>
            <Grid
              container
              direction='row'
              sx={{ alignItems: 'center', mb: '0.5rem' }}
            >
              <Typography variant='body1'>{node.name}</Typography>
              {activeUserID && activeUserID === node.fromID && (
                <Button
                  variant='text'
                  color='secondary'
                  onClick={async () => await confirmDeleteComment(node.id)}
                >
                  Delete
                </Button>
              )}
            </Grid>
            <CommentBox rootComment={node.id} />
          </Grid>
        }
      >
        {Object.keys(node).includes('children') && Array.isArray(node.children)
          ? node.children.map((childNode: any) =>
              renderTreeItems([childNode], activeUserID)
            )
          : null}
      </StyledTreeItem>
    )
  })
}

const getNodeIDs = (nodeArr: any[]) => {
  let nodeIDs: any[] = []
  nodeArr.forEach((node) => {
    nodeIDs.push(node.id)
    if (node.children) {
      nodeIDs = nodeIDs.concat(getNodeIDs(node.children))
    }
  })
  return nodeIDs
}

const Comments = ({ comments, postID, activeUserID }: any) => {
  const [expanded, setExpanded] = React.useState<string[]>([])

  const parsedComments = parseComments(comments)

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds)
  }

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? getNodeIDs(parsedComments) : []
    )
  }

  return (
    <div>
      <CommentBox label={'Reply to post'} postID={postID} />
      {parsedComments.length > 0 && (
        <TreeView
          aria-label='customized'
          disableSelection={true}
          expanded={expanded}
          onNodeToggle={handleToggle}
          defaultCollapseIcon={<MinusSquare />}
          defaultExpandIcon={<PlusSquare />}
          sx={{
            height: '70vh',
            flexGrow: 1,
            overflowY: 'auto'
          }}
        >
          <Button onClick={handleExpandClick} sx={{ m: '1rem' }}>
            {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
          </Button>
          {renderTreeItems(parsedComments, activeUserID)}
        </TreeView>
      )}
    </div>
  )
}

export default Comments
