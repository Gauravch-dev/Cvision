import { SignIn } from "@clerk/nextjs";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function SignInPage() {
  return (
    <AuthLayout 
        title="Welcome Back" 
        subtitle="Log in to access your AI-powered recruitment dashboard and continue hiring smarter."
    >
      <SignIn 
        appearance={{
            elements: {
                rootBox: "w-full",
                card: "bg-card border border-border shadow-2xl rounded-2xl w-full p-8",
                headerTitle: "text-2xl font-bold",
                headerSubtitle: "text-muted-foreground",
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl text-base font-medium transition-transform hover:scale-[1.02]",
                formFieldInput: "bg-muted/30 border-border h-12 rounded-xl focus:ring-primary/20",
                footerActionLink: "text-primary hover:text-primary/80"
            }
        }}
        afterSignOutUrl="/" 
      />
    </AuthLayout>
  );
}
