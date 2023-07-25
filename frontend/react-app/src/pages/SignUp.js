import AuthForm from "../components/AuthForm";

export default function SignUp() {
  return (
    <AuthForm
      endpoint=""
      submitButtonText="サインアップ"
      link="/users/signin"
      linkText="アカウントをお持ちの方こちら"
      errorProcessor={(errors) => Object.values(errors).flat()}
    />
  );
}
