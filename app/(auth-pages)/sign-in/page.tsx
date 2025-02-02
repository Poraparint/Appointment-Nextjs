import React from 'react';
import SignInForm from './signinForm';

const SignIn = () => {
  return (
    <SignInForm
      searchParams={{
        message: "",
      }}
    />
  );
}

export default SignIn;
