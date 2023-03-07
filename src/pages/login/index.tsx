import Layout from "@/components/Layout";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Auth } from "@supabase/auth-ui-react";
import Link from "next/link";

const LoginPage = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  if (!user)
    return (
      <Layout>
        <div className="max-w-xs md:max-w-md mt-6 mx-auto">
          <Auth
            redirectTo={
              process.env.NODE_ENV === "development"
                ? "http://localhost:3000/"
                : "https://emotional-recipes.com"
            }
            appearance={{ theme: ThemeSupa }}
            supabaseClient={supabaseClient}
            providers={[]}
            socialLayout="horizontal"
          />
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="container mx-auto flex flex-col gap-3">
        <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
        <Link href="/admin">Go to admin</Link>
      </div>
    </Layout>
  );
};

export default LoginPage;
