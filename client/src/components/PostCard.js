import React from "react";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import moment from 'moment';
import { Link } from "react-router-dom";


// prettier-ignore
function PostCard({post: { body, createdAt, id, username, likeCount, commentCount, likes }}) {
  function likePost() {
    console.log("like post");
  }

  function onPost(params) {
    console.log("post comment")
  }
  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button as='div' labelPosition='right' onClick={likePost}>
        <Button color='teal' basic>
          <Icon name='heart' />
        </Button>
        <Label basic color='teal' pointing='left'>
          {likeCount}
        </Label>
      </Button>

        <Button as='div' labelPosition='right' onClick={onPost}>
          <Button color='teal' basic>
            <Icon name='comments' />
          </Button>
          <Label basic color='teal' pointing='left'>
            {commentCount}
          </Label>
        </Button>
      </Card.Content>
    </Card> //
  )
}

export default PostCard;
