import AuthForm from "../components/AuthForm";

export default function SignIn() {
  return (
    <AuthForm
      endpoint="signin"
      submitButtonText="サインイン"
      link="/users"
      linkText="アカウント作成がまだの方はこちら"
    />
  );
}
