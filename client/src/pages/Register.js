import React, { useState, useContext } from "react";
import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";

function Register(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onChange = (event) => {
    setValues({...values, [event.target.name]: event.target.value})
  }

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, { data: { regisetr: userData }}){
      // console.log(result);
      context.login(userData)
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
    registerUser();
  }

  return (
    <div className="form-container">
      <Form noValidate onSubmit={onSubmit} className={loading ? 'loading' : ''}>
        <h1>Register</h1>
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
          label="Email"
          placeholder="Email"
          type="email"
          name="email"
          value={values.email}
          onChange={onChange}
          error={errors.email ? true : false}
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

        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password"
          type="password"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword ? true : false}
        />
        <Button type="submit" primary>
          Register
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ){
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ){
      id email username createdAt token
    }
  }
`;

export default Register;
