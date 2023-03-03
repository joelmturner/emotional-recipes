import { Card } from "@/components/Card";
import Layout from "@/components/Layout";
import { getLatestSubmittedRecipes } from "@/lib/recipes";
import { Recipe } from "@/types";

export default function Recipes({ recipes }: { recipes: Recipe[] }) {
  return (
    <Layout>
      <div className="mx-auto container">
        <h1 className="text-4xl font-bold px-6 my-6">Recipes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          {recipes.map((recipe, index) => (
            <Card key={recipe.url} recipe={recipe} eager={index < 3} />
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
