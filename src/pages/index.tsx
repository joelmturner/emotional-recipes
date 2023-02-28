import { Card } from "@/components/Card";
import Layout from "@/components/Layout";
import { getLatestSubmittedRecipes } from "@/lib/recipes";
import { Recipe } from "@/types";

export default function Home({ recipes }: { recipes: Recipe[] }) {
  console.log("recipes", recipes);
  return (
    <Layout>
      <section className="flex flex-col gap-3">
        <div className="text-xl">Recipes</div>
        <div className="grid grid-cols-2 gap-4">
          {recipes
            .filter(recipe => !!recipe.url)
            .map(recipe => (
              <Card key={recipe.url} recipe={recipe} />
            ))}
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const recipes = await getLatestSubmittedRecipes();
  console.dir(recipes);

  return {
    props: {
      recipes,
    },
    revalidate: 10, // In seconds
  };
}
