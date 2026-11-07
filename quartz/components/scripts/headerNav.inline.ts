document.addEventListener("nav", () => {
  const nav = document.querySelector<HTMLElement>(".header-nav")
  const header = nav?.closest<HTMLElement>("header")
  if (!nav || !header) return

  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>("a[data-nav-target]"))
  const homeLink = links.find((link) => link.dataset.navTarget === "")
  const sections = links.flatMap((link) => {
    const id = link.dataset.navTarget
    const heading = id ? document.getElementById(id) : null
    return heading ? [{ link, heading }] : []
  })
  const root = document.documentElement
  const previousOffset = root.style.getPropertyValue("--header-offset")
  let headerOffset = 0
  let frame = 0
  let requestedLink: HTMLAnchorElement | undefined

  function setActive(active: HTMLAnchorElement | undefined) {
    for (const link of links) {
      link.classList.toggle("active", link === active)
      if (link === active) {
        link.setAttribute("aria-current", link === homeLink ? "page" : "location")
      } else {
        link.removeAttribute("aria-current")
      }
    }
  }

  function update() {
    frame = 0
    if (links.length === 0) return

    // Follow the section entering the reading area below the sticky header.
    const readingLine = headerOffset + (window.innerHeight - headerOffset) * 0.35
    let active = homeLink
    for (const { link, heading } of sections) {
      if (heading.getBoundingClientRect().top <= readingLine) active = link
    }

    // A short final section may never reach the reading line.
    const atBottom = window.scrollY + window.innerHeight >= root.scrollHeight - 2
    if (window.scrollY > 0 && atBottom && sections.length > 0) {
      active = sections[sections.length - 1].link
    }

    // On tall screens, several anchors can share the same scroll endpoint. Honor
    // the chosen link there, but don't let a stale URL hash override the view.
    if (requestedLink) {
      const heading = sections.find(({ link }) => link === requestedLink)?.heading
      const targetTop = heading
        ? heading.getBoundingClientRect().top + window.scrollY - headerOffset
        : 0
      const targetScroll = Math.max(0, Math.min(targetTop, root.scrollHeight - window.innerHeight))
      if (Math.abs(window.scrollY - targetScroll) < 3) active = requestedLink
    }
    setActive(active)
  }

  function scheduleUpdate() {
    if (!frame) frame = window.requestAnimationFrame(update)
  }

  function measureHeader() {
    headerOffset = header!.getBoundingClientRect().height + 16
    root.style.setProperty("--header-offset", `${headerOffset}px`)
    scheduleUpdate()
  }

  function followHash() {
    requestedLink = sections.find(({ link }) => new URL(link.href).hash === location.hash)?.link
    scheduleUpdate()
  }

  function onClick(event: MouseEvent) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return
    const target = event.target instanceof Element ? event.target.closest("a") : null
    if (target && links.includes(target)) {
      requestedLink = target
      scheduleUpdate()
    }
  }

  function resumeScrollTracking() {
    requestedLink = undefined
    scheduleUpdate()
  }

  function onKeydown(event: KeyboardEvent) {
    const target = event.target
    if (
      target instanceof HTMLElement &&
      (target.isContentEditable || target.matches("input, textarea, select"))
    ) {
      return
    }
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
      resumeScrollTracking()
    }
  }

  const observer = new ResizeObserver(measureHeader)
  observer.observe(header)
  const article = document.querySelector(".center > article")
  if (article) observer.observe(article)
  measureHeader()
  followHash()
  nav.addEventListener("click", onClick)
  window.addEventListener("scroll", scheduleUpdate, { passive: true })
  window.addEventListener("resize", scheduleUpdate)
  window.addEventListener("hashchange", followHash)
  window.addEventListener("pageshow", scheduleUpdate)
  window.addEventListener("wheel", resumeScrollTracking, { passive: true })
  window.addEventListener("touchstart", resumeScrollTracking, { passive: true })
  window.addEventListener("pointerdown", resumeScrollTracking, { passive: true })
  document.addEventListener("keydown", onKeydown)

  window.addCleanup(() => {
    observer.disconnect()
    window.cancelAnimationFrame(frame)
    nav.removeEventListener("click", onClick)
    window.removeEventListener("scroll", scheduleUpdate)
    window.removeEventListener("resize", scheduleUpdate)
    window.removeEventListener("hashchange", followHash)
    window.removeEventListener("pageshow", scheduleUpdate)
    window.removeEventListener("wheel", resumeScrollTracking)
    window.removeEventListener("touchstart", resumeScrollTracking)
    window.removeEventListener("pointerdown", resumeScrollTracking)
    document.removeEventListener("keydown", onKeydown)
    if (previousOffset) root.style.setProperty("--header-offset", previousOffset)
    else root.style.removeProperty("--header-offset")
  })
})
