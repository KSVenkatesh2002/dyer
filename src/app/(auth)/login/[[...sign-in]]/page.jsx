import LoginForm from "@/components/LoginForm";
import { SignIn } from "@clerk/nextjs";
export default function LoginPage() {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] m-auto">
      <LoginForm />
      {/* <SignIn forceRedirectUrl='/' /> */}
    </div>
  );
}
