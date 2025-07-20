// page.tsx
import {SignInForm} from "./signinForm";
import { Suspense } from "react";

const SignInPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
};

export default SignInPage;
