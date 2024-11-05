(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("vue")) : typeof define === "function" && define.amd ? define(["vue"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.VTimelineComponent = factory(global.Vue));
})(this, function(vue) {
  "use strict";
  const _hoisted_1 = ["viewBox"];
  const _hoisted_2 = ["x1", "y1", "x2", "y2", "stroke", "stroke-width"];
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "v-timeline-component",
    props: {
      events: {},
      lineWidth: { default: "2px" },
      markerSize: { default: "16px" },
      color: { default: "currentColor" },
      layout: { default: "vertical" }
    },
    setup(__props) {
      vue.useCssVars((_ctx) => ({
        "4a543f55": _ctx.markerSize,
        "10540a10": _ctx.lineWidth,
        "1433d1ae": _ctx.color
      }));
      const props = __props;
      vue.useSlots();
      const classes = vue.useCssModule("vTimeline");
      const slot = vue.useSlots();
      const uniqueId = `timeline-${Math.random().toString(36).slice(2, 11)}`;
      const containerRef = vue.ref(null);
      const markers = vue.ref(null);
      const timelineContainerRect = vue.ref(null);
      const sortedTimelineEvents = vue.computed(
        () => props.events.slice().sort((a, b) => +new Date(a.date) - +new Date(b.date)) ?? props.events
      );
      const lines = vue.ref([]);
      function generateRandomMarkerClass() {
        return `marker-${Math.random().toString(36).substring(2)}`;
      }
      function getCircleSize() {
        var _a;
        const size = parseFloat(props.markerSize || "16");
        const unit = ((_a = props.markerSize) == null ? void 0 : _a.replace(size.toString(), "")) || "px";
        const radius = size / 2;
        return { radius, size, unit };
      }
      function vTimeline() {
        const { radius, size, unit } = getCircleSize();
        return vue.h(
          "div",
          {
            class: `${classes["timeline-events"]} ${uniqueId}`,
            style: {
              display: props.layout === "horizontal" ? "flex" : "block",
              flexDirection: props.layout === "horizontal" ? "row" : "column"
            }
          },
          sortedTimelineEvents.value.map((item, index) => {
            var _a, _b;
            const randomMarkerClass = generateRandomMarkerClass();
            return vue.h("div", { class: classes.event, tabIndex: 0, ariaLabel: index, style: { display: "flex" } }, [
              !slot["marker"] ? vue.h(
                "svg",
                {
                  width: `${size}${unit}`,
                  height: `${size}${unit}`,
                  class: `${classes.marker} ${uniqueId} ${randomMarkerClass}`
                },
                [
                  vue.h("circle", {
                    cx: `${radius}${unit}`,
                    cy: `${radius}${unit}`,
                    r: `${radius / 2}${unit}`,
                    fill: props.color
                  })
                ]
              ) : vue.h(
                "div",
                {
                  class: `${classes.marker} ${uniqueId} ${randomMarkerClass}`,
                  style: {
                    width: `${size}${unit}`,
                    height: `${size}${unit}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: `${size}${unit}`
                  }
                },
                (_a = slot["marker"]) == null ? void 0 : _a.call(slot, { event: item, index })
              ),
              vue.h(
                "div",
                {
                  class: [
                    classes["event-content"],
                    props.layout === "vertical" ? classes["event-content-vertical"] : classes["event-content-horizontal"]
                  ]
                },
                (_b = slot.default) == null ? void 0 : _b.call(slot, { event: item, index })
              )
            ]);
          })
        );
      }
      function updateMarkersAndLine() {
        if (!containerRef.value) return;
        markers.value = containerRef.value.querySelectorAll(
          `.${uniqueId}.${classes.marker} circle, .${uniqueId}.${classes.marker}`
        );
        const timelineEventsContainer = containerRef.value.querySelector(
          `.${uniqueId}.${classes["timeline-events"]}`
        );
        if (timelineEventsContainer) {
          timelineContainerRect.value = timelineEventsContainer.getBoundingClientRect();
        }
        if (!markers.value.length || !timelineContainerRect.value) return;
        lines.value = [];
        markers.value.forEach((marker2, index) => {
          const markerRect = marker2.getBoundingClientRect();
          if (!timelineContainerRect.value || !markers.value) return;
          let x1 = markerRect.left - timelineContainerRect.value.left + markerRect.width / 2;
          let y1 = markerRect.top - timelineContainerRect.value.top + markerRect.height / 2;
          const nextMarker = markers.value[index + 1];
          if (nextMarker) {
            const nextMarkerRect = nextMarker.getBoundingClientRect();
            let x2 = nextMarkerRect.left - timelineContainerRect.value.left + nextMarkerRect.width / 2;
            let y2 = nextMarkerRect.top - timelineContainerRect.value.top + nextMarkerRect.height / 2;
            if (props.layout === "horizontal") {
              const midY = nextMarkerRect.height / 2 + nextMarkerRect.top;
              y1 = midY - timelineContainerRect.value.top;
              y2 = midY - timelineContainerRect.value.top;
            }
            const randomLineClass = generateRandomMarkerClass();
            lines.value.push({ x1, y1, x2, y2, randomClass: randomLineClass });
          }
        });
      }
      vue.onMounted(() => {
        updateMarkersAndLine();
        const resizeObserver = new ResizeObserver(() => {
          updateMarkersAndLine();
        });
        if (containerRef.value) {
          resizeObserver.observe(containerRef.value);
        }
        vue.onBeforeUnmount(() => {
          if (containerRef.value) {
            resizeObserver.unobserve(containerRef.value);
          }
        });
      });
      vue.watch(sortedTimelineEvents, () => {
        updateMarkersAndLine();
      });
      return (_ctx, _cache) => {
        var _a, _b, _c, _d;
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "containerRef",
          ref: containerRef,
          class: vue.normalizeClass(`${uniqueId}-container`),
          style: { "position": "relative" }
        }, [
          sortedTimelineEvents.value.length ? (vue.openBlock(), vue.createBlock(vTimeline, {
            key: 0,
            uniqueId
          })) : vue.createCommentVNode("", true),
          (vue.openBlock(), vue.createElementBlock("svg", {
            class: vue.normalizeClass(vue.unref(classes)["line-connecting-markers"]),
            xmlns: "http://www.w3.org/2000/svg",
            style: vue.normalizeStyle({
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
              overflow: "visible",
              width: props.layout === "horizontal" ? `${((_a = timelineContainerRect.value) == null ? void 0 : _a.width) || 0}px` : "2px",
              height: props.layout === "horizontal" ? "2px" : `${((_b = timelineContainerRect.value) == null ? void 0 : _b.height) || 0}px`
            }),
            viewBox: `0 0 ${props.layout === "horizontal" ? ((_c = timelineContainerRect.value) == null ? void 0 : _c.width) || 0 : 2} ${props.layout === "vertical" ? ((_d = timelineContainerRect.value) == null ? void 0 : _d.height) || 0 : 2}`
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(lines.value, (line, index) => {
              return vue.openBlock(), vue.createElementBlock("line", {
                key: index,
                x1: line.x1,
                y1: line.y1,
                x2: line.x2,
                y2: line.y2,
                stroke: props.color,
                "stroke-width": props.lineWidth,
                class: vue.normalizeClass(`line-${uniqueId}-${line.randomClass}`)
              }, null, 10, _hoisted_2);
            }), 128))
          ], 14, _hoisted_1))
        ], 2);
      };
    }
  });
  const event = "_event_1xk11_5";
  const marker = "_marker_1xk11_19";
  const style0 = {
    "timeline-events": "_timeline-events_1xk11_2",
    event,
    "event-content": "_event-content_1xk11_6",
    "event-content-horizontal": "_event-content-horizontal_1xk11_12",
    "event-content-vertical": "_event-content-vertical_1xk11_15",
    marker,
    "line-connecting-markers": "_line-connecting-markers_1xk11_26"
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const cssModules = {
    "vTimeline": style0
  };
  const vTimelineComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["__cssModules", cssModules]]);
  return vTimelineComponent;
});
