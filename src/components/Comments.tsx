import * as React from 'react'
import { alpha, styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import PlusSquare from '@mui/icons-material/AddBoxOutlined'
import MinusSquare from '@mui/icons-material/IndeterminateCheckBoxOutlined'
import TreeView from '@mui/lab/TreeView'
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem'
import Collapse from '@mui/material/Collapse'
import { TransitionProps } from '@mui/material/transitions'
import Typography from '@mui/material/Typography'
import _ from 'lodash'

const parseComments = (comments: any) => {
  const commentTree: any = {}
  comments.forEach((comment: any) => {
    if (comment.commentToCommentRelationship.length === 0) {
      commentTree[comment.rootComment.identity.low] = {
        text: comment.rootComment.properties.text,
        from: comment.rootCommentFrom.properties.username,
        createdAt: comment.rootCommentFrom.properties.created_at.low
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
        from: comment.replyCommentFrom.properties.username,
        createdAt: comment.replyCommentFrom.properties.created_at.low
      })
    }
  })

  const renderTree = (nodes: any): any => {
    return Object.keys(nodes).map((nodeKey) => {
      const { text, from, createdAt, ...childrenObjects } = nodes[nodeKey]
      return {
        id: nodeKey,
        name: nodes[nodeKey].text,
        from: nodes[nodeKey].from,
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

const PsuedoLink = ({ text, onClick }: any) => {
  return (
    <Typography
      variant='body2'
      color='#4FC1F1'
      onClick={onClick}
      sx={{
        '&:hover': {
          color: 'white'
        },
        textDecoration: 'underline'
      }}
    >
      {text}
    </Typography>
  )
}

const StyledTreeItem = styled((props: any) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3
    }
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.7)}`
  }
}))

const renderTreeItems = (nodes: any) => {
  return nodes.map((node: any) => {
    return (
      <StyledTreeItem
        key={node.id}
        nodeId={node.id}
        label={
          <Grid container direction='row'>
            <Typography variant='body1'>{node.name}</Typography>&nbsp;(
            <Typography variant='body1'>{node.from}</Typography>&nbsp;
            <Typography variant='body1'>{node.createdAt}</Typography>)&nbsp;
            <PsuedoLink
              text='Reply'
              onClick={() => {
                console.log('Replying!')
              }}
            />
          </Grid>
        }
      >
        {Object.keys(node).includes('children') && Array.isArray(node.children)
          ? node.children.map((childNode: any) => renderTreeItems([childNode]))
          : null}
      </StyledTreeItem>
    )
  })
}

const Comments = ({ comments }: any) => {
  return (
    <TreeView
      aria-label='customized'
      defaultCollapseIcon={<MinusSquare />}
      defaultExpandIcon={<PlusSquare />}
      sx={{ height: '40vh', flexGrow: 1, overflowY: 'auto' }}
    >
      {renderTreeItems(parseComments(comments))}
    </TreeView>
  )
}

export default Comments
