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
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
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
      recipes,
    },
    revalidate: 10, // In seconds
  };
}
