import { SignIn } from "@clerk/nextjs";
import Logo from "@/components/logo";

export default function SignInPage() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white dark:bg-black">
      {/* High-end Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-500/20 blur-[120px]" />
      </div>

      <div className="flex flex-col items-center gap-8 px-4">
        <div className="flex flex-col items-center gap-2">
          <Logo />
          <h2 className="text-xl font-medium text-slate-500 dark:text-slate-400">
            Welcome back to Budget Tracker
          </h2>
        </div>

        <div className="relative rounded-2xl border border-white/20 bg-white/40 p-1 shadow-2xl backdrop-blur-xl dark:bg-black/40">
          <div className="overflow-hidden rounded-xl">
            <SignIn 
              appearance={{
                elements: {
                  card: "bg-transparent shadow-none border-none",
                  footer: "hidden",
                  headerTitle: "text-blue-600 dark:text-blue-400 font-bold",
                  formButtonPrimary: "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 text-white",
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}