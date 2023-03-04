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
