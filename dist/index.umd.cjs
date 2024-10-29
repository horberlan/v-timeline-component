(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("vue")) : typeof define === "function" && define.amd ? define(["exports", "vue"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.Timeline = {}, global.Vue));
})(this, function(exports2, vue) {
  "use strict";
  const __default__ = vue.defineComponent({
    name: "TimelineComponent",
    props: {
      hasCustomContent: {
        default: false,
        type: Boolean
      },
      color: {
        default: "#ddd",
        type: String
      },
      markerSize: {
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
        validator: (value) => ["vertical", "horizontal"].includes(value)
      },
      timelineEvents: {
        required: true,
        type: Array
      }
    },
    setup(props, { slots }) {
      const timelineLine = vue.ref(null);
      const sortedTimelineEvents = vue.ref(
        props.timelineEvents.sort((a, b) => {
          return +new Date(a.date) - +new Date(b.date);
        })
      );
      const getLayoutAndSetDirection = () => {
        var _a;
        const markers = document.querySelectorAll(
          ".timeline-marker"
        );
        const firstMarker = markers[0];
        const lastMarker = markers[markers.length - 1];
        const timelineContainerRect = (_a = document.querySelector(".timeline-container")) == null ? void 0 : _a.getBoundingClientRect();
        if (!timelineContainerRect) return;
        if (props.layout === "vertical") {
          const lineLeft = firstMarker.getBoundingClientRect().left - timelineContainerRect.left + firstMarker.offsetWidth / 2;
          const lineTop = firstMarker.getBoundingClientRect().top - timelineContainerRect.top + firstMarker.offsetHeight / 2;
          const lineHeight = lastMarker.getBoundingClientRect().top - timelineContainerRect.top + lastMarker.offsetHeight / 2 - lineTop;
          if (!timelineLine.value) return;
          timelineLine.value.style.top = `${lineTop}px`;
          timelineLine.value.style.height = `${lineHeight}px`;
          timelineLine.value.style.left = `${lineLeft}px`;
          timelineLine.value.style.width = props.lineWidth;
        } else if (props.layout === "horizontal") {
          const lineTop = firstMarker.getBoundingClientRect().top - timelineContainerRect.top + firstMarker.offsetHeight / 2;
          const lineLeft = firstMarker.getBoundingClientRect().left - timelineContainerRect.left + firstMarker.offsetWidth / 2;
          const lineWidth = lastMarker.getBoundingClientRect().left - timelineContainerRect.left + lastMarker.offsetWidth / 2 - lineLeft;
          if (!timelineLine.value) return;
          timelineLine.value.style.top = `${lineTop}px`;
          timelineLine.value.style.width = `${lineWidth}px`;
          timelineLine.value.style.left = `${lineLeft}px`;
          timelineLine.value.style.height = props.lineWidth;
        }
      };
      vue.onMounted(() => {
        getLayoutAndSetDirection();
      });
      vue.watchEffect(
        () => {
          if (!timelineLine.value) return;
          getLayoutAndSetDirection();
        },
        { flush: "post" }
      );
      return {
        sortedTimelineEvents,
        timelineLine
      };
    }
  });
  const __injectCSSVars__ = () => {
    vue.useCssVars((_ctx) => ({
      "448013ea": _ctx.markerSize,
      "7ea486b3": _ctx.color
    }));
  };
  const __setup__ = __default__.setup;
  __default__.setup = __setup__ ? (props, ctx) => {
    __injectCSSVars__();
    return __setup__(props, ctx);
  } : __injectCSSVars__;
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1 = { class: "timeline-content" };
  const _hoisted_2 = { class: "event-title" };
  const _hoisted_3 = { class: "event-date" };
  const _hoisted_4 = { class: "event-description" };
  const _hoisted_5 = {
    ref: "timelineLine",
    class: "timeline-line"
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["timeline-container", { horizontal: _ctx.layout === "horizontal" }])
    }, [
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.sortedTimelineEvents, (event, index) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          key: index,
          class: "timeline-event"
        }, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["timeline-marker", {
              "is-first": index === 0,
              "is-last": index === _ctx.sortedTimelineEvents.length - 1
            }])
          }, null, 2),
          vue.createElementVNode("div", _hoisted_1, [
            !_ctx.hasCustomContent ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
              vue.createElementVNode("h4", _hoisted_2, vue.toDisplayString(event.title), 1),
              vue.createElementVNode("p", _hoisted_3, vue.toDisplayString(event.date), 1),
              vue.createElementVNode("p", _hoisted_4, vue.toDisplayString(event.description), 1)
            ], 64)) : vue.renderSlot(_ctx.$slots, "default", {
              key: 1,
              event,
              index
            })
          ])
        ]);
      }), 128)),
      vue.createElementVNode("div", _hoisted_5, null, 512)
    ], 2);
  }
  const TimelineComponent = /* @__PURE__ */ _export_sfc(__default__, [["render", _sfc_render]]);
  exports2.TimelineComponent = TimelineComponent;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});

// Types: index.umd.cjs
