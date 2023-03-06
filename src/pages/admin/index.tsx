import { Card } from "@/components/Card";
import Layout from "@/components/Layout";
import { ModerationStates, Recipe } from "@/types/general";
import {
  createServerSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import _merge from "lodash/merge";
import { Database } from "src/types/supabase";

export default function Admin({ user }: { user: User }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const supabaseClient = useSupabaseClient<Database>();
  async function getRecipes() {
    const { data } = await supabaseClient.from("recipes").select("*");
    if (data) {
      setRecipes(data);
    }
  }

  async function updateRecipe(recipe: Recipe, status: ModerationStates) {
    const { error } = await supabaseClient
      .from("recipes")
      .update({ moderation: status, featured: recipe.featured })
      .eq("id", recipe.id)
      .select();

    if (error) {
      console.error("error", error);
      return;
    }

    setRecipes(prev => {
      const index = prev.findIndex(r => r.id === recipe.id);
      const newRecipe = _merge({}, recipe, { moderation: status });
      return [...prev.slice(0, index), newRecipe, ...prev.slice(index + 1)];
    });
  }

  useEffect(() => {
    supabaseClient
      .channel("any")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "recipes" },
        payload => {
          console.log("Change received!", payload);
        }
      )
      .subscribe();
    getRecipes();
    return () => {
      supabaseClient.removeAllChannels();
    };
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl container mb-12">Admin</h1>
      <div className="grid grid-cols-3 gap-6 container">
        {recipes.map(recipe => (
          <div className="group relative w-full h-full" key={recipe.url}>
            {recipe.url ? (
              <div className="card w-full bg-base-300 shadow-xl">
                <Card key={recipe.url} url={recipe.url} eager={false} />
                <div className="card-body py-4">
                  <div className="flex gap-3 items-center">
                    <p>id: {recipe.id}</p>
                    <div className="btn-group transition-opacity opacity-30 group-hover:opacity-100">
                      <button
                        className={`btn ${
                          recipe.moderation === "REJECTED" ? "btn-error" : ""
                        }`}
                        onClick={() => updateRecipe(recipe, "REJECTED")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
                          />
                        </svg>
                      </button>

                      <button
                        className={`btn ${
                          recipe.moderation === "PENDING" ? "btn-info" : ""
                        }`}
                        onClick={() => updateRecipe(recipe, "PENDING")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                          />
                        </svg>
                      </button>

                      <button
                        className={`btn ${
                          recipe.moderation === "APPROVED" ? "btn-success" : ""
                        }`}
                        onClick={() => updateRecipe(recipe, "APPROVED")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              "no url "
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (ctx: any) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};
