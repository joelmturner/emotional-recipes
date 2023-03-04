import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <>
      <div className="grid grid-rows-[min-content_1fr_min-content] gap-3 antialiased h-screen text-base-content overflow-y-auto">
        <div className="navbar px-0 border border-b border-base-300">
          <div className="flex gap-4 items-center justify-between container mx-auto">
            <Link
              href="/"
              className="sm:text-3xl text-xl font-bold tracking-tight w-1/3"
            >
              Emotional Recipes
            </Link>

            <ul className="flex items-center  gap-2 md:gap-3">
              <li>
                <Link
                  href="/recipes/new"
                  className={`btn  btn-xs normal-case ${
                    router.pathname === "/recipes/new"
                      ? "btn-outline"
                      : "btn-primary"
                  }`}
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
