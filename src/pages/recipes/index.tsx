import Link from "next/link";
import { getLatestSubmittedRecipes } from "@/lib/recipes";
import { Share } from "@/components/Share";
import { Card } from "@/components/Card";
import Layout from "@/components/Layout";
import { Recipe } from "@/types/general";

const CARD_ACTION_CLASSES =
  "btn btn-circle btn-ghost btn-xs text-neutral-content hover:bg-transparent hover:text-base-content transition-color";

export default function Recipes({ recipes }: { recipes: Recipe[] }) {
  return (
    <Layout>
      <div className="bg-base-300 w-full py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto w-full">
          {recipes.map((recipe, index) => (
            <div className="relative w-full h-full group" key={recipe.url}>
              <Card key={recipe.url} url={recipe.url} eager={index < 3} />
              <div className="flex gap-2 absolute top-3 right-3 duration-300 transition-opacity opacity-0 group-hover:opacity-100">
                <div className="dropdown dropdown-left dropdown-start">
                  <label tabIndex={0} className={CARD_ACTION_CLASSES}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.366A2.52 2.52 0 0113 4.5z" />
                    </svg>
                  </label>
                  <div
                    tabIndex={0}
                    className="card compact dropdown-content shadow bg-base-300 rounded-box w-min-content"
                  >
                    <div className="card-body not-prose">
                      <Share
                        url={recipe.url}
                        disabled={false}
                        useButton={false}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="tooltip"
                  data-tip="Create new recipe based on this"
                >
                  <Link
                    href={`/recipes/new?url=${encodeURIComponent(recipe.url)}`}
                    className={CARD_ACTION_CLASSES}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const recipes = await getLatestSubmittedRecipes();

  return {
    props: {
      recipes: recipes ?? null,
    },
    revalidate: 10, // In seconds
  };
}
