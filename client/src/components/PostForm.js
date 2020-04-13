import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";
import { useForm } from "../util/hooks";
import { useMutation } from "@apollo/react-hooks";
import { FETCH_POST_QUERY } from "../util/graphql";

function PostForm() {
  // prettier-ignore
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  });
  const [errors, setErrors] = useState();
  // prettier-ignore
  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result){
      const data = proxy.readQuery({
        query: FETCH_POST_QUERY
      })
      // prettier-ignore
      proxy.writeQuery({ query: FETCH_POST_QUERY, data: {getPosts: [result.data.createPost, ...data.getPosts]} })
      values.body = ''
    },
      onError(err){
        setErrors(err.graphQLErrors[0].message)
      }
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hi World!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={errors ? true : false}
          />
          <Button type="submit" color="teal">
            Submit 
          </Button>
        </Form.Field>
      </Form>
      {errors && (
        <div className="ui error message" style={{marginBottom: 20}}>
          <ul className="list">
            <li>{errors}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        id
        username
        createdAt
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

export default PostForm;
