import React, { useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks';
import { Grid, Card, Image, Button, Icon, Label } from 'semantic-ui-react';
import moment from 'moment';
import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import gql from 'graphql-tag';

function SinglePost() {
  const postId = useParams().postId;
  const { user } = useContext(AuthContext);
  const history = useHistory();

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  })
  
  function deletePostCallback(params) {
    history.push('/');
  }

  let postMarkup;
  if (!data) {
    postMarkup = <p>Loading post...</p>
  } else {
    const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = data.getPost;
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated='right'
              size='small'
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr/>
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => console.log('comment on post')}
                >
                 <Button basic color="blue">
                   <Icon name="comments"/>
                 </Button>
                 <Label basic color="blue" pointing="left">
                   {commentCount}
                 </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
  return postMarkup;
}

const FETCH_POST_QUERY = gql`
  query($postId: ID!){
    getPost(postId: $postId){
      id
      body
      username
      createdAt
      likeCount
      likes{
        username
      }
      commentCount
      comments{
        id
        body
        username
        createdAt
      }
    }
  }
`;

export default SinglePost;
