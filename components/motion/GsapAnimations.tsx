"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type FlowNode = {
  dot: SVGCircleElement;
  ring: SVGCircleElement;
  y: number;
};

function formatNumber(value: number, plain: boolean) {
  if (plain) return Math.round(value).toString();
  return Math.round(value).toLocaleString("en-US");
}

function createLogoSvg(name: string) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 32 32");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.6");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");

  const add = (tag: "circle" | "path", attrs: Record<string, string>) => {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    svg.appendChild(el);
  };

  if (name === "WordPress") {
    add("circle", { cx: "16", cy: "16", r: "13" });
    add("path", { d: "M8 11 L10.5 22 L14 14 L17.5 22 L20 11" });
  } else if (name === "Shopify") {
    add("path", { d: "M9 11h14l-1.3 14a2 2 0 0 1-2 1.8H12.3a2 2 0 0 1-2-1.8z" });
    add("path", { d: "M12.5 11V9.5a3.5 3.5 0 0 1 7 0V11" });
  } else if (name === "سلة") {
    add("path", { d: "M7 13h18l-2 11.5a2 2 0 0 1-2 1.7H11a2 2 0 0 1-2-1.7z" });
    add("path", { d: "M11 13l3-6M21 13l-3-6" });
    add("path", { d: "M13.5 17.5v5M18.5 17.5v5" });
  } else {
    add("path", { d: "M6 13l1.8-5h16.4L26 13" });
    add("path", { d: "M7.5 13v11.5h17V13" });
    add("path", { d: "M13 24.5V18h6v6.5" });
    add("path", { d: "M6 13a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" });
  }

  return svg;
}

export function GsapAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = document.getElementById("landing-root");
    if (!root) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];
    const ctx = gsap.context(() => {
      if (!prefersReduced) document.body.classList.add("reveal-ready");

      const header = root.querySelector<HTMLElement>("#site-header");
      const onScroll = () => {
        if (!header) return;
        header.classList.toggle("scrolled", window.scrollY > 24);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));

      const menuToggle = root.querySelector<HTMLButtonElement>("#menu-toggle");
      const mobileMenu = root.querySelector<HTMLElement>("#mobile-menu");
      const closeMenu = () => {
        mobileMenu?.classList.remove("open");
        menuToggle?.setAttribute("aria-expanded", "false");
      };
      if (menuToggle && mobileMenu) {
        const onToggle = () => {
          const open = !mobileMenu.classList.contains("open");
          mobileMenu.classList.toggle("open", open);
          menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
        };
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.addEventListener("click", onToggle);
        cleanups.push(() => menuToggle.removeEventListener("click", onToggle));
        mobileMenu.querySelectorAll("a").forEach((anchor) => {
          anchor.addEventListener("click", closeMenu);
          cleanups.push(() => anchor.removeEventListener("click", closeMenu));
        });
      }

      root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
        const handler = (event: Event) => {
          const id = link.getAttribute("href");
          if (!id || id.length < 2) return;
          const target = root.querySelector<HTMLElement>(id);
          if (!target) return;
          event.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
          if (history.pushState) history.pushState(null, "", id);
        };
        link.addEventListener("click", handler);
        cleanups.push(() => link.removeEventListener("click", handler));
      });

      const animateCounter = (el: HTMLElement) => {
        if (el.dataset.counted) return;
        el.dataset.counted = "1";
        const target = Number.parseFloat(el.dataset.target || "0");
        const plain = el.hasAttribute("data-plain");
        if (prefersReduced) {
          el.textContent = formatNumber(target, plain);
          return;
        }
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = formatNumber(obj.v, plain);
          },
        });
      };

      root.querySelectorAll<HTMLElement>("[data-counter]").forEach((el) => {
        if (prefersReduced) {
          animateCounter(el);
          return;
        }
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => animateCounter(el),
        });
      });

      const ring = root.querySelector<SVGCircleElement>("#hero-ring");
      if (ring) {
        const fill = () => {
          ring.style.strokeDashoffset = ring.dataset.offset || "38";
        };
        if (prefersReduced) fill();
        else {
          ScrollTrigger.create({
            trigger: ring,
            start: "top 90%",
            once: true,
            onEnter: () => window.setTimeout(fill, 250),
          });
        }
      }

      const staggerSelector = "#faq-list, #stats .grid, #pricing .grid";
      if (!prefersReduced) {
        gsap.utils
          .toArray<HTMLElement>('[data-anim="fade-up"]', root)
          .filter((el) => !el.closest(staggerSelector))
          .forEach((el) => {
            gsap.fromTo(
              el,
              { autoAlpha: 0, y: 42 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              },
            );
          });

        gsap.utils.toArray<HTMLElement>('[data-anim="zoom"]', root).forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, scale: 0.94, y: 30 },
            {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-anim="slide"]', root).forEach((el) => {
          const fromRight = el.dataset.from === "right";
          gsap.fromTo(
            el,
            { autoAlpha: 0, x: fromRight ? 90 : -90 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 1.05,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 84%", once: true },
            },
          );
        });

        root.querySelectorAll<HTMLElement>(".crawl-bar").forEach((bar) => {
          const target = bar.style.width || "76%";
          gsap.fromTo(
            bar,
            { width: "0%" },
            {
              width: target,
              duration: 1.4,
              ease: "power2.out",
              scrollTrigger: { trigger: bar, start: "top 90%", once: true },
            },
          );
        });

        root.querySelectorAll<SVGPathElement>(".trend-line").forEach((path) => {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: path, start: "top 88%", once: true },
          });
        });

        root.querySelectorAll<HTMLElement>(staggerSelector).forEach((grid) => {
          const items = grid.querySelectorAll("[data-anim]");
          gsap.fromTo(
            items,
            { autoAlpha: 0, y: 40 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.12,
              scrollTrigger: { trigger: grid, start: "top 82%", once: true },
              overwrite: "auto",
            },
          );
        });

        root.querySelectorAll<HTMLElement>("[data-float]").forEach((el, i) => {
          gsap.to(el, {
            y: i % 2 === 0 ? -14 : 14,
            duration: 3 + i * 0.4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        });

        const bars = root.querySelectorAll("#showcase-bars > div");
        if (bars.length) {
          gsap.from(bars, {
            scaleY: 0,
            transformOrigin: "bottom",
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: "#showcase-bars", start: "top 85%", once: true },
          });
        }
      }

      root.querySelectorAll<HTMLElement>(".faq-item").forEach((item, index) => {
        const head = item.querySelector<HTMLButtonElement>(".faq-head");
        const body = item.querySelector<HTMLElement>(".faq-body");
        if (!head || !body) return;
        const bodyId = `faq-body-${index + 1}`;
        body.id = bodyId;
        head.setAttribute("aria-controls", bodyId);
        head.setAttribute("aria-expanded", "false");
        const onClick = () => {
          const isOpen = item.classList.contains("open");
          root.querySelectorAll<HTMLElement>(".faq-item").forEach((other) => {
            other.classList.remove("open");
            const otherBody = other.querySelector<HTMLElement>(".faq-body");
            const otherHead = other.querySelector<HTMLButtonElement>(".faq-head");
            if (otherBody) otherBody.style.maxHeight = "";
            if (otherHead) otherHead.setAttribute("aria-expanded", "false");
          });
          if (!isOpen) {
            item.classList.add("open");
            body.style.maxHeight = `${body.scrollHeight}px`;
            head.setAttribute("aria-expanded", "true");
          }
        };
        head.addEventListener("click", onClick);
        cleanups.push(() => head.removeEventListener("click", onClick));
      });

      const slides = Array.from(root.querySelectorAll<HTMLElement>(".t-slide"));
      const dotsWrap = root.querySelector<HTMLElement>("#t-dots");
      if (slides.length && dotsWrap) {
        let idx = 0;
        let timer: number | null = null;
        const portraitWrap = root.querySelector<HTMLElement>("#t-portrait-wrap");
        const portraitInitial = root.querySelector<SVGTextElement>("#t-portrait-initial");
        dotsWrap.textContent = "";
        slides.forEach((_, i) => {
          const dot = document.createElement("button");
          dot.className = "w-2.5 h-2.5 rounded-full transition-all";
          dot.setAttribute("aria-label", `شريحة ${i + 1}`);
          dot.addEventListener("click", () => go(i, true));
          dot.addEventListener("pointerenter", () => go(i, true));
          dotsWrap.appendChild(dot);
        });
        const dots = Array.from(dotsWrap.children) as HTMLElement[];
        const updatePortrait = () => {
          const slide = slides[idx];
          const initial = slide.dataset.portraitInitial || "";
          const color = slide.dataset.portraitColor || "#a0cd39";
          if (portraitInitial) portraitInitial.textContent = initial;
          if (portraitWrap) {
            portraitWrap.style.backgroundColor = color;
            if (!prefersReduced) {
              gsap.fromTo(
                portraitWrap,
                { autoAlpha: 0.72, scale: 0.96 },
                { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power3.out", overwrite: "auto" },
              );
            }
          }
        };
        const render = () => {
          slides.forEach((slide, i) => slide.classList.toggle("active", i === idx));
          dots.forEach((dot, i) => {
            dot.style.backgroundColor = i === idx ? "#a0cd39" : "#d8ddd1";
            dot.style.width = i === idx ? "22px" : "10px";
          });
          updatePortrait();
          if (!prefersReduced) {
            gsap.fromTo(slides[idx], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" });
          }
        };
        function go(i: number, manual = false) {
          idx = (i + slides.length) % slides.length;
          render();
          if (manual) restart();
        }
        function restart() {
          if (timer) window.clearInterval(timer);
          if (!prefersReduced) timer = window.setInterval(() => go(idx + 1), 6000);
        }
        const prev = root.querySelector<HTMLElement>("#t-prev");
        const next = root.querySelector<HTMLElement>("#t-next");
        const prevClick = () => go(idx - 1, true);
        const nextClick = () => go(idx + 1, true);
        prev?.addEventListener("click", prevClick);
        next?.addEventListener("click", nextClick);
        const slideCleanups = slides.map((slide, i) => {
          const onPointerEnter = () => go(i, true);
          slide.addEventListener("pointerenter", onPointerEnter);
          slide.addEventListener("focusin", onPointerEnter);
          return () => {
            slide.removeEventListener("pointerenter", onPointerEnter);
            slide.removeEventListener("focusin", onPointerEnter);
          };
        });
        cleanups.push(() => {
          if (timer) window.clearInterval(timer);
          prev?.removeEventListener("click", prevClick);
          next?.removeEventListener("click", nextClick);
          slideCleanups.forEach((cleanup) => cleanup());
        });
        render();
        restart();
      }

      const logoNames = ["WordPress", "Shopify", "سلة", "زد"];
      const appendSet = (parent: HTMLElement) => {
        logoNames.forEach((name) => {
          const item = document.createElement("div");
          item.className = "logo-item";
          item.appendChild(createLogoSvg(name));
          parent.appendChild(item);
        });
      };
      const fillMarquee = (track: HTMLElement) => {
        track.removeAttribute("data-marquee-ready");
        track.style.transform = "translateX(0)";
        const group = document.createElement("div");
        group.className = "marquee-group";
        let guard = 0;
        do {
          appendSet(group);
          guard += 1;
          track.appendChild(group);
        } while (group.offsetWidth < window.innerWidth * 1.15 && guard < 30);
        group.remove();
        const clone = group.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        track.replaceChildren(group, clone);
        window.setTimeout(() => {
          track.setAttribute("data-marquee-ready", "true");
          track.style.transform = "";
        }, 700);
      };
      const marquees = Array.from(root.querySelectorAll<HTMLElement>("[data-marquee]"));
      marquees.forEach(fillMarquee);
      let marqueeTimer: number | null = null;
      const onMarqueeResize = () => {
        if (marqueeTimer) window.clearTimeout(marqueeTimer);
        marqueeTimer = window.setTimeout(() => marquees.forEach(fillMarquee), 300);
      };
      window.addEventListener("resize", onMarqueeResize);
      cleanups.push(() => {
        if (marqueeTimer) window.clearTimeout(marqueeTimer);
        window.removeEventListener("resize", onMarqueeResize);
      });

      const svg = root.querySelector<SVGSVGElement>("#flow-svg");
      const wrap = root.querySelector<HTMLElement>("#showcase-flow");
      const base = root.querySelector<SVGPathElement>("#flow-base");
      const prog = root.querySelector<SVGPathElement>("#flow-progress");
      const nodesG = root.querySelector<SVGGElement>("#flow-nodes");
      const orb = root.querySelector<SVGGElement>("#flow-orb");
      if (svg && wrap && base && prog && nodesG && orb) {
        const state: { len: number; nodes: FlowNode[]; active: boolean } = { len: 0, nodes: [], active: false };
        const build = () => {
          if (window.innerWidth < 1024) {
            state.active = false;
            return;
          }
          const blocks = wrap.querySelectorAll<HTMLElement>(".feature-block");
          if (blocks.length < 2) return;
          const width = wrap.clientWidth;
          const height = wrap.clientHeight;
          const wrapTop = wrap.getBoundingClientRect().top;
          const pts = [{ x: width * 0.5, y: 0 }];
          blocks.forEach((block, i) => {
            const rect = block.getBoundingClientRect();
            const cy = rect.top - wrapTop + rect.height / 2;
            const imageLeft = i % 2 === 0;
            pts.push({ x: imageLeft ? width * 0.3 : width * 0.7, y: cy });
          });
          let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
          for (let i = 0; i < pts.length - 1; i += 1) {
            const p = pts[i];
            const n = pts[i + 1];
            const my = ((p.y + n.y) / 2).toFixed(1);
            d += ` C ${p.x.toFixed(1)} ${my}, ${n.x.toFixed(1)} ${my}, ${n.x.toFixed(1)} ${n.y.toFixed(1)}`;
          }
          svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
          base.setAttribute("d", d);
          prog.setAttribute("d", d);
          nodesG.textContent = "";
          state.nodes = [];
          for (let i = 1; i < pts.length; i += 1) {
            const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            ring.setAttribute("class", "flow-node-ring");
            ring.setAttribute("cx", String(pts[i].x));
            ring.setAttribute("cy", String(pts[i].y));
            ring.setAttribute("r", "9");
            const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            dot.setAttribute("class", "flow-node");
            dot.setAttribute("cx", String(pts[i].x));
            dot.setAttribute("cy", String(pts[i].y));
            dot.setAttribute("r", "4.5");
            nodesG.appendChild(ring);
            nodesG.appendChild(dot);
            state.nodes.push({ dot, ring, y: pts[i].y });
          }
          state.len = prog.getTotalLength();
          prog.style.strokeDasharray = String(state.len);
          if (prefersReduced) {
            prog.style.strokeDashoffset = "0";
            state.nodes.forEach((node) => {
              node.dot.classList.add("on");
              node.ring.classList.add("on");
            });
            orb.style.opacity = "0";
            state.active = false;
          } else {
            prog.style.strokeDashoffset = String(state.len);
            state.active = true;
          }
        };
        const update = (progress: number) => {
          if (!state.active || !state.len) return;
          prog.style.strokeDashoffset = String(state.len * (1 - progress));
          const point = prog.getPointAtLength(state.len * progress);
          orb.setAttribute("transform", `translate(${point.x} ${point.y})`);
          orb.style.opacity = progress > 0.001 && progress < 0.999 ? "1" : "0";
          state.nodes.forEach((node) => {
            const on = point.y >= node.y - 2;
            node.dot.classList.toggle("on", on);
            node.ring.classList.toggle("on", on);
          });
        };
        build();
        ScrollTrigger.create({
          trigger: wrap,
          start: "top 75%",
          end: "bottom 75%",
          scrub: 0.6,
          onUpdate: (self) => update(self.progress),
          onRefresh: build,
        });
        let resizeTimer: number | null = null;
        const onResize = () => {
          if (resizeTimer) window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(() => {
            build();
            ScrollTrigger.refresh();
          }, 200);
        };
        window.addEventListener("resize", onResize);
        cleanups.push(() => {
          if (resizeTimer) window.clearTimeout(resizeTimer);
          window.removeEventListener("resize", onResize);
        });
      }

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      cleanups.push(() => window.removeEventListener("load", refresh));
      if (document.fonts?.ready) {
        document.fonts.ready.then(refresh).catch(() => undefined);
      }
      window.setTimeout(refresh, 100);
    }, root);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
      document.body.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
