import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.PageTitle(),
    Component.HeaderNav({
      links: [
        { text: "Home", slug: "index" },
        { text: "Publications", slug: "index", anchor: "publications" },
        { text: "Misc", slug: "index", anchor: "misc" },
        {
          text: "CV",
          href: "https://drive.google.com/file/d/1USeaNC8mC02B4dxpjs1qmiaFDprz7pkJ/view?usp=sharing",
          newTab: true,
          bold: true,
        },
      ],
    }),
    Component.Search(),
  ],
  afterBody: [],
  footer: Component.Footer({
    links: {
      // GitHub: "https://github.com/jackyzha0/quartz",
      // "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [],
  right: [Component.Backlinks()],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle()],
  left: [],
  right: [],
}
