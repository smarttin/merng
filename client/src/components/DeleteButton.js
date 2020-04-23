import React, { useState } from "react";
import gql from "graphql-tag";
import { Icon, Button, Confirm } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import { FETCH_POST_QUERY } from "../util/graphql";

function DeleteButton({ postId, callback, commentId }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrCommentMutation] = useMutation(mutation, {
    variables: { postId, commentId },
    update(proxy) {
      setConfirmOpen(false);

      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POST_QUERY
        });
        proxy.writeQuery({ query: FETCH_POST_QUERY, data: {getPosts: data.getPosts.filter(p => p.id !== postId)}})
      }

      if (callback) callback()
    },
  });
  return (
    <>
      <Button
        as="div"
        color="red"
        floated="right"
        onClick={() => setConfirmOpen(true)}
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrCommentMutation}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!){
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!){
    deleteComment(postId: $postId, commentId: $commentId){
      id
      comments{
        id
        username
        body
        createdAt
      }
      commentCount
    }
  }
`;

export default DeleteButton;
