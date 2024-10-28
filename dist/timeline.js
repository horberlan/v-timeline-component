import { defineComponent as S, ref as g, onMounted as $, useCssVars as B, openBlock as r, createElementBlock as p, normalizeClass as v, Fragment as y, renderList as z, createElementVNode as u, toDisplayString as h, renderSlot as E } from "vue";
const m = S({
  name: "TimelineComponent",
  props: {
    hasCustomContent: {
      default: !1,
      type: Boolean
    },
    color: {
      default: "#ddd",
      type: String
    },
    merkerSize: {
      default: "0.75rem",
      type: String
    },
    lineWidth: {
      default: "2px",
      type: String
    },
    layout: {
      default: "vertical",
      type: String,
      validator: (e) => ["vertical", "horizontal"].includes(e)
    },
    timelineEvents: {
      required: !0,
      type: Array
    }
  },
  setup(e, { slots: c }) {
    const t = g(null), a = g(e.timelineEvents);
    a.value.sort((n, l) => +new Date(n.date) - +new Date(l.date)), $(() => {
      var i;
      const n = document.querySelectorAll(".timeline-marker"), l = n[0], o = n[n.length - 1], s = (i = document.querySelector(".timeline-container")) == null ? void 0 : i.getBoundingClientRect();
      s && d(l, o, s);
    });
    const d = (n, l, o) => {
      if (e.layout === "vertical") {
        const s = n.getBoundingClientRect().left - o.left + n.offsetWidth / 2, i = n.getBoundingClientRect().top - o.top + n.offsetHeight / 2, f = l.getBoundingClientRect().top - o.top + l.offsetHeight / 2 - i;
        if (!t.value) return;
        t.value.style.top = `${i}px`, t.value.style.height = `${f}px`, t.value.style.left = `${s}px`, t.value.style.width = e.lineWidth;
      } else if (e.layout === "horizontal") {
        const s = n.getBoundingClientRect().top - o.top + n.offsetHeight / 2, i = n.getBoundingClientRect().left - o.left + n.offsetWidth / 2, f = l.getBoundingClientRect().left - o.left + l.offsetWidth / 2 - i;
        if (!t.value) return;
        t.value.style.top = `${s}px`, t.value.style.width = `${f}px`, t.value.style.left = `${i}px`, t.value.style.height = e.lineWidth;
      }
    };
    return {
      timelineEvents: a,
      timelineLine: t
    };
  }
}), _ = () => {
  B((e) => ({
    "73696b0c": e.merkerSize,
    28021768: e.color
  }));
}, C = m.setup;
m.setup = C ? (e, c) => (_(), C(e, c)) : _;
const W = (e, c) => {
  const t = e.__vccOpts || e;
  for (const [a, d] of c)
    t[a] = d;
  return t;
}, L = { class: "timeline-content" }, w = { class: "event-title" }, D = { class: "event-date" }, H = { class: "event-description" }, T = {
  ref: "timelineLine",
  class: "timeline-line"
};
function k(e, c, t, a, d, n) {
  return r(), p("div", {
    class: v(["timeline-container", { horizontal: e.layout === "horizontal" }])
  }, [
    (r(!0), p(y, null, z(e.timelineEvents, (l, o) => (r(), p("div", {
      key: o,
      class: "timeline-event"
    }, [
      u("div", {
        class: v(["timeline-marker", {
          "is-first": o === 0,
          "is-last": o === e.timelineEvents.length - 1
        }])
      }, null, 2),
      u("div", L, [
        e.hasCustomContent ? E(e.$slots, "default", {
          key: 1,
          event: l,
          index: o
        }, void 0, !0) : (r(), p(y, { key: 0 }, [
          u("h4", w, h(l.title), 1),
          u("p", D, h(l.date), 1),
          u("p", H, h(l.description), 1)
        ], 64))
      ])
    ]))), 128)),
    u("div", T, null, 512)
  ], 2);
}
const A = /* @__PURE__ */ W(m, [["render", k], ["__scopeId", "data-v-4043878c"]]);
export {
  A as TimelineComponent
};

// Types: timeline.d.ts
