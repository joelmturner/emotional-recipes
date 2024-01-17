import { Card } from "@/components/Card";
import Layout from "@/components/Layout";
import { ModerationStates, Recipe, RecipeColumns } from "@/types/general";
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

  async function updateRecipe(
    recipe: Recipe,
    key: RecipeColumns,
    value: boolean | string | number | ModerationStates
  ) {
    const { error } = await supabaseClient
      .from("recipes")
      .update({ [key]: value })
      .eq("id", recipe.id)
      .select();

    if (error) {
      console.error("error", error);
      return;
    }

    setRecipes(prev => {
      const index = prev.findIndex(r => r.id === recipe.id);
      const newRecipe = _merge({}, recipe, { [key]: value });
      return [
        ...prev.slice(0, index),
        newRecipe,
        ...prev.slice(index + 1),
      ].sort((a, b) => a.id - b.id);
    });
  }

  async function handleDeleteRecipe(recipe: Recipe) {
    const { error } = await supabaseClient
      .from("recipes")
      .delete()
      .eq("id", recipe.id)
      .select();

    if (error) {
      console.error("error", error);
      return;
    }

    setRecipes(prev => {
      const index = prev.findIndex(r => r.id === recipe.id);
      return [...prev.slice(0, index), ...prev.slice(index + 1)].sort(
        (a, b) => a.id - b.id
      );
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
                  <div className="flex gap-3 items-center justify-between transition-opacity opacity-30 group-hover:opacity-100">
                    <div className="flex gap-3 items-center">
                      <label>featured</label>
                      <input
                        type="checkbox"
                        className="toggle toggle-sm"
                        checked={recipe.featured}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) =>
                          updateRecipe(recipe, "featured", event.target.checked)
                        }
                      />
                    </div>

                    <div className="dropdown dropdown-top">
                      <label tabIndex={0} className="btn btn-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </label>
                      <div
                        tabIndex={0}
                        className="card compact dropdown-content shadow bg-base-300 rounded-box w-min-content md:w-64"
                      >
                        <div className="card-body not-prose">
                          <div className="text-xl">
                            Are you sure you would like to delete this?
                          </div>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => handleDeleteRecipe(recipe)}
                            disabled={
                              recipe.featured ||
                              recipe.moderation === "APPROVED"
                            }
                          >
                            Yes, delete
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="btn-group ">
                      <button
                        className={`btn btn-sm ${
                          recipe.moderation === "REJECTED" ? "btn-error" : ""
                        }`}
                        onClick={() =>
                          updateRecipe(recipe, "moderation", "REJECTED")
                        }
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
                        className={`btn btn-sm ${
                          recipe.moderation === "PENDING" ? "btn-info" : ""
                        }`}
                        onClick={() =>
                          updateRecipe(recipe, "moderation", "PENDING")
                        }
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
                        className={`btn btn-sm ${
                          recipe.moderation === "APPROVED" ? "btn-success" : ""
                        }`}
                        onClick={() =>
                          updateRecipe(recipe, "moderation", "APPROVED")
                        }
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
