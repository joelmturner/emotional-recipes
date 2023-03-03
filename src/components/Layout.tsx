import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="grid grid-rows-[min-content_1fr_min-content] gap-3 antialiased h-screen text-base-content">
        <div className="navbar border border-b border-base-300">
          <div className="flex items-center justify-between container mx-auto px-6">
            <Link
              href="/"
              className="sm:text-3xl text-xl font-bold ml-2 tracking-tight"
            >
              Emotional Recipes
            </Link>

            <ul className="flex items-center grow md:grow-0 shrink-0 md:shrink gap-2 md:gap-3">
              <li>
                <Link
                  href="/recipes/new"
                  className="btn btn-primary btn-xs normal-case"
                >
                  New Recipe
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="">
                  Recipes
                </Link>
              </li>
              <li>
                <button
                  data-toggle-theme="dark,light"
                  data-act-class="ACTIVECLASS"
                ></button>
              </li>
            </ul>
          </div>
        </div>

        <main className="grow h-full pb-4">{children}</main>

        <footer className="footer p-4 ">
          <div className="container mx-auto flex justify-between items-center">
            <div className="items-center grid-flow-col">
              <p className="text-neutral-content">
                Made with <span className="text-secondary">♡</span> by{" "}
                <a
                  className="link link-hover link-secondary"
                  href="https://joelmturner"
                >
                  @joelmturner
                </a>
              </p>
            </div>
            <p className="text-xs text-neutral-content justify-end">
              Built with Nextjs, DaisyUI (TailwindCSS), and Cloudinary
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
