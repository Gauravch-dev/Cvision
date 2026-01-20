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
                card: "bg-zinc-950/50 backdrop-blur-3xl border border-white/10 shadow-[0_0_100px_-20px_rgba(59,130,246,0.5)] w-full p-10 rounded-[2.5rem] ring-1 ring-white/10 relative overflow-hidden",
                headerTitle: "text-4xl font-black tracking-tighter text-white mb-2",
                headerSubtitle: "text-zinc-400 text-lg font-light tracking-wide",
                formButtonPrimary: "bg-white text-black hover:bg-zinc-200 h-16 rounded-2xl text-lg font-bold transition-all hover:scale-[1.02] shadow-[0_0_30px_-10px_rgba(255,255,255,0.5)]",
                formFieldInput: "bg-white/5 border-white/5 focus:border-blue-500/50 h-14 rounded-xl text-lg focus:ring-4 focus:ring-blue-500/10 transition-all text-white placeholder:text-zinc-600",
                footerActionLink: "text-blue-400 font-bold hover:text-blue-300 underline decoration-2 underline-offset-4",
                dividerLine: "bg-white/5",
                dividerText: "text-zinc-600 font-medium uppercase tracking-widest text-xs",
                socialButtonsBlockButton: "bg-white/5 border-white/5 hover:bg-white/10 h-14 rounded-xl transition-all hover:scale-[1.02] text-white font-medium",
                formFieldLabel: "text-zinc-400 font-bold ml-1 mb-2 tracking-wide uppercase text-xs",
                footer: "!hidden",
                badge: "!hidden"
            }
        }}
        afterSignOutUrl="/" 
      />
      
      {/* Custom Footer Link */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted/50 border border-border backdrop-blur-md">
            <span className="text-muted-foreground">Don't have an account?</span>
            <a href="/sign-up" className="text-foreground font-bold hover:text-primary transition-colors">
                Sign Up
            </a>
        </div>
      </div>
    </AuthLayout>
  );
}
