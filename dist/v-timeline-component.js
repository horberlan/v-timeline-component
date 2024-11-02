import { defineComponent, useCssVars, useSlots, useCssModule, ref, onMounted, onBeforeUnmount, watch, openBlock, createElementBlock, normalizeClass, createBlock, createCommentVNode, unref, normalizeStyle, Fragment, renderList, h } from "vue";
const _hoisted_1 = ["viewBox"];
const _hoisted_2 = ["x1", "y1", "x2", "y2", "stroke", "stroke-width"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "v-timeline-component",
  props: {
    events: {},
    lineWidth: { default: "2px" },
    markerSize: { default: "16px" },
    color: { default: "currentColor" },
    layout: { default: "vertical" }
  },
  setup(__props) {
    var _a;
    useCssVars((_ctx) => ({
      "3e277427": _ctx.markerSize,
      "313fe3e6": _ctx.lineWidth,
      "3295a717": _ctx.color
    }));
    const props = __props;
    useSlots();
    const classes = useCssModule("vTimeline");
    const slot = useSlots();
    const uniqueId = `timeline-${Math.random().toString(36).slice(2, 11)}`;
    const containerRef = ref(null);
    const markers = ref(null);
    const timelineContainerRect = ref(null);
    const sortedTimelineEvents = ref(
      ((_a = props.events) == null ? void 0 : _a.sort((a, b) => +new Date(a.date) - +new Date(b.date))) ?? props.events
    );
    const lines = ref([]);
    function generateRandomClass() {
      return `marker-${Math.random().toString(36).slice(2, 11)}`;
    }
    function getCircleSize() {
      var _a2;
      const size = parseFloat(props.markerSize || "16");
      const unit = ((_a2 = props.markerSize) == null ? void 0 : _a2.replace(size.toString(), "")) || "px";
      const radius = size / 2;
      return { radius, size, unit };
    }
    function vTimeline() {
      const { radius, size, unit } = getCircleSize();
      return h(
        "div",
        {
          class: `${classes["timeline-events"]} ${uniqueId}`,
          style: {
            display: props.layout === "horizontal" ? "flex" : "block",
            flexDirection: props.layout === "horizontal" ? "row" : "column"
          }
        },
        sortedTimelineEvents.value.map((item, index) => {
          var _a2, _b;
          const randomMarkerClass = generateRandomClass();
          return h("div", { class: classes.event }, [
            !slot["marker"] ? h(
              "svg",
              {
                width: `${size}${unit}`,
                height: `${size}${unit}`,
                class: `${classes.marker} ${uniqueId} ${randomMarkerClass}`
              },
              [
                h("circle", {
                  cx: `${radius}${unit}`,
                  cy: `${radius}${unit}`,
                  r: `${radius / 2}${unit}`,
                  fill: props.color
                })
              ]
            ) : h(
              "div",
              {
                class: `${classes.marker} ${uniqueId} ${randomMarkerClass}`,
                style: {
                  width: `${size}${unit}`,
                  height: `${size}${unit}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }
              },
              (_a2 = slot["marker"]) == null ? void 0 : _a2.call(slot, { event: item, index })
            ),
            h(
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
          const randomLineClass = generateRandomClass();
          lines.value.push({ x1, y1, x2, y2, randomClass: randomLineClass });
        }
      });
    }
    onMounted(() => {
      updateMarkersAndLine();
      const resizeObserver = new ResizeObserver(() => {
        updateMarkersAndLine();
      });
      if (containerRef.value) {
        resizeObserver.observe(containerRef.value);
      }
      onBeforeUnmount(() => {
        if (containerRef.value) {
          resizeObserver.unobserve(containerRef.value);
        }
      });
    });
    watch(sortedTimelineEvents, () => {
      updateMarkersAndLine();
    });
    return (_ctx, _cache) => {
      var _a2, _b, _c, _d;
      return openBlock(), createElementBlock("div", {
        ref_key: "containerRef",
        ref: containerRef,
        class: normalizeClass(`${uniqueId}-container`),
        style: { "position": "relative" }
      }, [
        sortedTimelineEvents.value.length ? (openBlock(), createBlock(vTimeline, {
          key: 0,
          uniqueId
        })) : createCommentVNode("", true),
        (openBlock(), createElementBlock("svg", {
          class: normalizeClass(unref(classes)["line-connecting-markers"]),
          xmlns: "http://www.w3.org/2000/svg",
          style: normalizeStyle({
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
            overflow: "visible",
            width: props.layout === "horizontal" ? `${((_a2 = timelineContainerRect.value) == null ? void 0 : _a2.width) || 0}px` : "2px",
            height: props.layout === "horizontal" ? "2px" : `${((_b = timelineContainerRect.value) == null ? void 0 : _b.height) || 0}px`
          }),
          viewBox: `0 0 ${props.layout === "horizontal" ? ((_c = timelineContainerRect.value) == null ? void 0 : _c.width) || 0 : 2} ${props.layout === "vertical" ? ((_d = timelineContainerRect.value) == null ? void 0 : _d.height) || 0 : 2}`
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(lines.value, (line, index) => {
            return openBlock(), createElementBlock("line", {
              key: index,
              x1: line.x1,
              y1: line.y1,
              x2: line.x2,
              y2: line.y2,
              stroke: props.color,
              "stroke-width": props.lineWidth,
              class: normalizeClass(`line-${uniqueId}-${line.randomClass}`)
            }, null, 10, _hoisted_2);
          }), 128))
        ], 14, _hoisted_1))
      ], 2);
    };
  }
});
const event = "_event_1gn2x_6";
const marker = "_marker_1gn2x_20";
const style0 = {
  "timeline-events": "_timeline-events_1gn2x_2",
  event,
  "event-content": "_event-content_1gn2x_7",
  "event-content-horizontal": "_event-content-horizontal_1gn2x_13",
  "event-content-vertical": "_event-content-vertical_1gn2x_16",
  marker,
  "line-connecting-markers": "_line-connecting-markers_1gn2x_27"
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
export {
  vTimelineComponent as default
};
