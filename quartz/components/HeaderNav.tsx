import { FullSlug, resolveRelative, simplifySlug } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/headerNav.scss"
// @ts-ignore: Quartz bundles inline scripts for the browser.
import script from "./scripts/headerNav.inline"

type HeaderLink = { text: string; bold?: boolean } & (
  | { slug: string; anchor?: string }
  | { href: string; newTab?: boolean }
)

interface Options {
  links: HeaderLink[]
}

export default ((opts: Options) => {
  const HeaderNav: QuartzComponent = ({ fileData, cfg }: QuartzComponentProps) => {
    const currentSlug = simplifySlug(fileData.slug!)
    // A 404 can be served at any depth, so its links must start at the site's base path.
    const basePath =
      fileData.slug === "404"
        ? new URL(`https://${cfg.baseUrl ?? "example.com"}`).pathname.replace(/\/?$/, "/")
        : null

    return (
      <nav class="header-nav" aria-label="Main navigation">
        <ul>
          {opts.links.map((link) => {
            const label = link.bold ? <strong>{link.text}</strong> : link.text
            if ("href" in link) {
              return (
                <li>
                  <a
                    href={link.href}
                    target={link.newTab ? "_blank" : undefined}
                    rel={link.newTab ? "noopener noreferrer" : undefined}
                    aria-label={link.newTab ? `${link.text} (opens in a new tab)` : undefined}
                  >
                    {label}
                  </a>
                </li>
              )
            }

            const { slug, anchor } = link
            const target = slug as FullSlug
            const targetSlug = simplifySlug(target)
            const isSamePage = currentSlug === targetSlug
            const isCurrentPage = isSamePage && !anchor
            const isCurrentSection =
              !anchor &&
              target !== "index" &&
              target.endsWith("/index") &&
              currentSlug.startsWith(targetSlug)
            const pageHref =
              basePath !== null
                ? basePath + (targetSlug === "/" ? "" : targetSlug)
                : resolveRelative(fileData.slug!, target)
            const href = anchor
              ? `${isSamePage ? "" : pageHref}#${encodeURIComponent(anchor)}`
              : isSamePage
                ? "#"
                : pageHref

            return (
              <li>
                <a
                  href={href}
                  data-nav-target={isSamePage ? (anchor ?? "") : undefined}
                  class={isCurrentPage || isCurrentSection ? "active" : undefined}
                  aria-current={isCurrentPage ? "page" : isCurrentSection ? "location" : undefined}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }

  HeaderNav.css = style
  HeaderNav.afterDOMLoaded = script
  return HeaderNav
}) satisfies QuartzComponentConstructor<Options>
