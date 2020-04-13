import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

function Login(props) {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const onChange = (event) => {
    setValues({...values, [event.target.name]: event.target.value})
  }

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, result){
      console.log(result);
      props.history.push('/');
    },
    onError(err){
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables: values
  })

  const onSubmit = (event) => {
    event.preventDefault();
    loginUser()
  }

  return (
    <div className="form-container">
      <Form noValidate onSubmit={onSubmit} className={loading ? 'loading' : ''}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username"
          type="text"
          name="username"
          value={values.username}
          onChange={onChange}
          error={errors.username ? true : false}
        />

        <Form.Input
          label="Password"
          placeholder="Password"
          type="password"
          name="password"
          value={values.password}
          onChange={onChange}
          error={errors.password ? true : false}
        />

        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ){
    login(
        username: $username
        password: $password
        
    ){
      id email username createdAt token
    }
  }
`;

export default Login;
