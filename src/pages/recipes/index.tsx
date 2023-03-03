import { Card } from "@/components/Card";
import Layout from "@/components/Layout";
import { Share } from "@/components/Share";
import { getLatestSubmittedRecipes } from "@/lib/recipes";
import { Recipe } from "@/types";

export default function Recipes({ recipes }: { recipes: Recipe[] }) {
  return (
    <Layout>
      <div className="mx-auto container">
        <h1 className="text-4xl font-bold my-6">Recipes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <div className="relative w-full h-full group" key={recipe.url}>
              <Card key={recipe.url} recipe={recipe} eager={index < 3} />
              <div className="dropdown dropdown-left dropdown-start absolute top-3 right-3 duration-300 transition-opacity opacity-0 group-hover:opacity-100">
                <label
                  tabIndex={0}
                  className="btn btn-circle btn-ghost btn-xs text-neutral-content"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
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
