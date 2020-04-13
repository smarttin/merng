import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import PostCard from "../components/PostCard";
import { Grid } from "semantic-ui-react";
import PostForm from "../components/PostForm";
import { AuthContext } from "../context/auth";
import { FETCH_POST_QUERY } from "../util/graphql";


function Home() {
  // prettier-ignore
  const { loading, data } = useQuery(FETCH_POST_QUERY);
  const { user } = useContext(AuthContext);

  return (
    <Grid columns="three">
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
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

export default Home;
