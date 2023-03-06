import { Card } from "@/components/Card";
import Layout from "@/components/Layout";
import { getLatestSubmittedRecipes } from "@/lib/recipes";
import { Recipe } from "@/types/general";
import Link from "next/link";

export default function Home({ recipes = [] }: { recipes: Recipe[] }) {
  return (
    <Layout>
      <div className="grid grid-rows-[50vh_min-content_auto] gap-6">
        <section className="hero h-full">
          <div className="hero-content container flex-col gap-16">
            <div className="w-full md:w-2/3 text-center">
              <h1 className="text-5xl font-bold">Emotional Wayfinding</h1>
              <p className="py-6">
                A tool to help navigate stormy waters back to calm seas.
              </p>
              <Link href="/recipes/new" className="btn btn-primary">
                Create a new recipe
              </Link>
            </div>
          </div>
        </section>
      </div>

      <div className="bg-base-300 w-full py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-5 container mx-auto w-full">
          {recipes.map((recipe, index) => (
            <Card key={recipe.url} url={recipe.url} eager={index === 0} />
          ))}
        </div>
      </div>

      <div className="container prose mx-auto max-w-4xl mt-20" id="mainContent">
        <h2>What is this?</h2>
        <p>
          These recipes are meant to be a helpful reminder when things are a
          little extra. The goal is to experiment and find which steps work best
          for you in each case then add them to your own recipe.
        </p>

        <h2>How it came about</h2>
        <p>
          Howdy! Have you ever found yourself in a rough emotional state, but
          couldn't remember what to do to get out of it? Well, that's been me
          quite often. Trying to recall helpful tips in a heightened emotional
          state can be rough.
        </p>

        <p>
          One day, I decided to jot down some helpful strategies on an index
          card which I kept in my notebook. Whenever I found myself in a tough
          spot, I would refer to this card and it always helped me to move
          through my emotions more gracefully.
        </p>

        <p>
          As time passed, I began to differentiate between different emotional
          states and created variations of the original index card. These
          variations became my personal emotional recipes!
        </p>

        <p>
          I'm thrilled to share this, a way to create digital emotional recipes.
          Feel free to come up with{" "}
          <Link href="/recipes/new">personalized cards</Link> or use the{" "}
          <Link href="/recipes">previously created cards</Link> to help you
          through any tough emotions you may face.
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
