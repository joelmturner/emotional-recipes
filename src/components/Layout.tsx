import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="grid grid-rows-[min-content_1fr_min-content] gap-3 antialiased h-screen text-gray-300">
        <div className="navbar bg-base-300 justify-start">
          <Link href="/" className="text-xl px-3">
            Emotional Recipes
          </Link>
          <ul>
            <li>
              <div>
                <Link
                  href="/recipes/new"
                  className="btn btn-primary btn-xs normal-case"
                >
                  New Recipe
                </Link>
              </div>
            </li>
          </ul>
        </div>

        <main className="grow h-full pb-4">{children}</main>

        <footer className="footer items-center p-4 bg-neutral text-neutral-content justify-between">
          <div className="items-center grid-flow-col">
            <p className="text-gray-500">
              Made with <span className="text-accent">♡</span> by{" "}
              <a
                className="link link-hover link-accent"
                href="https://joelmturner"
              >
                @joelmturner
              </a>
            </p>
          </div>
          <p className="text-xs text-slate-400 justify-end">
            Built with Nextjs, DaisyUI (TailwindCSS), and Cloudinary
          </p>
        </footer>
      </div>
    </>
  );
}
