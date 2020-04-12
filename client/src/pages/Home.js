import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import PostCard from "../components/PostCard";
import { Grid } from "semantic-ui-react";

function Home() {
  // prettier-ignore
  const { loading, data } = useQuery(FETCH_POST_QUERY);
  return (
    <Grid columns="three">
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loading posts..</h1>
        ) : (
          data.getPosts && data.getPosts.map(post => (
            <Grid.Column key={post.id} style={{marginBottom: 20}}>
              <PostCard post={post}/>
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
}

const FETCH_POST_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        body
        createdAt
        username
      }
    }
  }
`;

export default Home;
