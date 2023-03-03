import { Card } from "@/components/Card";
import Layout from "@/components/Layout";
import { getLatestSubmittedRecipes } from "@/lib/recipes";
import { Recipe } from "@/types";
import Link from "next/link";

export default function Home({ recipes = [] }: { recipes: Recipe[] }) {
  return (
    <Layout>
      <div className="grid grid-rows-[50vh_min-content_auto] gap-6">
        <div className="hero h-full">
          <div className="hero-content w-full flex-col gap-16">
            <div className="w-full md:w-2/3">
              <h1 className="text-5xl font-bold">Emotional Wayfinding</h1>
              <p className="py-6">
                A tool to help navigate stormy waters back to calm seas.
              </p>
              <Link href="/recipes/new" className="btn btn-primary">
                Create a new recipe
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-5 bg-base-200 w-full px-16 py-12">
        {recipes.map((recipe, index) => (
          <Card key={recipe.url} recipe={recipe} eager={index === 0} />
        ))}
      </div>

      <div className="container prose mx-auto max-w-4xl mt-20" id="mainContent">
        <h2>What is this?</h2>
        <p>
          These recipes are meant to be a helpful reminder when things are a
          little extra. The goal is to experiment and find which steps work best
          for you in each case then add them to your own recipe.
        </p>

        <h2>How it came about?</h2>
        <p>
          When I was working on trying to recognize and improve my behaviors I
          noticed that I could identify that I was in a rough state of emotion
          but couldn't recall what to do to move through it more gracefully.
        </p>
        <p>
          In the clarity after one such bout I ended up writing down, on an
          index card, things that I know are helpful in that state. This card
          was in my notebook which I carried everywhere so I was able to glance
          at it every time I was in that state.
        </p>
        <p>
          After a few weeks I started differentiating some of my states so I
          created slight variations of that card. These became my emotional
          recipes.
        </p>
        <p>
          This site is a way to explore creating these cards digitally while
          playing with some cool tech.
        </p>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const recipes = await getLatestSubmittedRecipes("FEATURED", 3);

  return {
    props: {
      recipes,
    },
  };
}
