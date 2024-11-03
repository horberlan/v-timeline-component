<template>
  <div
    ref="containerRef"
    :class="`${uniqueId}-container`"
    style="position: relative"
  >
    <template v-if="sortedTimelineEvents.length">
      <vTimeline :uniqueId="uniqueId" />
    </template>
    <svg
      :class="classes['line-connecting-markers']"
      xmlns="http://www.w3.org/2000/svg"
      :style="{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        overflow: 'visible',
        width:
          props.layout === 'horizontal'
            ? `${timelineContainerRect?.width || 0}px`
            : '2px',
        height:
          props.layout === 'horizontal'
            ? '2px'
            : `${timelineContainerRect?.height || 0}px`,
      }"
      :viewBox="`0 0 ${
        props.layout === 'horizontal' ? timelineContainerRect?.width || 0 : 2
      } ${
        props.layout === 'vertical' ? timelineContainerRect?.height || 0 : 2
      }`"
    >
      <line
        v-for="(line, index) in lines"
        :key="index"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        :stroke="props.color"
        :stroke-width="props.lineWidth"
        :class="`line-${uniqueId}-${line.randomClass}`"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import {
  h,
  ref,
  useSlots,
  onMounted,
  type Ref,
  useCssModule,
  watch,
  onBeforeUnmount,
} from "vue";

const props = withDefaults(
  defineProps<{
    events: any[];
    lineWidth?: string;
    markerSize?: string;
    color?: string;
    layout?: "vertical" | "horizontal";
  }>(),
  {
    markerSize: "16px",
    lineWidth: "2px",
    color: "currentColor",
    layout: "vertical",
  }
);

const slots = defineSlots<{
  default(data: { event: any; index: number });
  marker: (data: { event: any; index: number }) => HTMLElement | string;
}>();

const classes = useCssModule("vTimeline");
const slot = useSlots();

const uniqueId = `timeline-${Math.random().toString(36).slice(2, 11)}`;

const containerRef = ref<HTMLElement | null>(null);
const markers: Ref<NodeListOf<SVGCircleElement | HTMLElement> | null> =
  ref(null);
const timelineContainerRect = ref<DOMRect | null>(null);

const sortedTimelineEvents = ref(
  props.events?.sort((a, b) => +new Date(a.date) - +new Date(b.date)) ??
    props.events
);
const lines = ref<
  Array<{ x1: number; y1: number; x2: number; y2: number; randomClass: string }>
>([]);

function generateRandomClass(): string {
  return `marker-${Math.random().toString(36).slice(2, 11)}`;
}

function getCircleSize() {
  const size = parseFloat(props.markerSize || "16");
  const unit = props.markerSize?.replace(size.toString(), "") || "px";
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
        flexDirection: props.layout === "horizontal" ? "row" : "column",
      },
    },
    sortedTimelineEvents.value.map((item, index) => {
      const randomMarkerClass = generateRandomClass();

      return h("div", { class: classes.event }, [
        !slot["marker"]
          ? h(
              "svg",
              {
                width: `${size}${unit}`,
                height: `${size}${unit}`,
                class: `${classes.marker} ${uniqueId} ${randomMarkerClass}`,
              },
              [
                h("circle", {
                  cx: `${radius}${unit}`,
                  cy: `${radius}${unit}`,
                  r: `${radius / 2}${unit}`,
                  fill: props.color,
                }),
              ]
            )
          : h(
              "div",
              {
                class: `${classes.marker} ${uniqueId} ${randomMarkerClass}`,
                style: {
                  width: `${size}${unit}`,
                  height: `${size}${unit}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: `${size}${unit}`,
                },
              },
              slot["marker"]?.({ event: item, index })
            ),
        h(
          "div",
          {
            class: [
              classes["event-content"],
              props.layout === "vertical"
                ? classes["event-content-vertical"]
                : classes["event-content-horizontal"],
            ],
          },
          slot.default?.({ event: item, index })
        ),
      ]);
    })
  );
}

function updateMarkersAndLine() {
  if (!containerRef.value) return;

  markers.value = containerRef.value.querySelectorAll(
    `.${uniqueId}.${classes.marker} circle, .${uniqueId}.${classes.marker}`
  ) as NodeListOf<HTMLElement>;

  const timelineEventsContainer = containerRef.value.querySelector(
    `.${uniqueId}.${classes["timeline-events"]}`
  );

  if (timelineEventsContainer) {
    timelineContainerRect.value =
      timelineEventsContainer.getBoundingClientRect();
  }

  if (!markers.value.length || !timelineContainerRect.value) return;

  lines.value = [];

  markers.value.forEach((marker, index) => {
    const markerRect = marker.getBoundingClientRect();
    if (!timelineContainerRect.value || !markers.value) return;

    let x1 =
      markerRect.left - timelineContainerRect.value.left + markerRect.width / 2;
    let y1 =
      markerRect.top - timelineContainerRect.value.top + markerRect.height / 2;

    const nextMarker = markers.value[index + 1];
    if (nextMarker) {
      const nextMarkerRect = nextMarker.getBoundingClientRect();
      let x2 =
        nextMarkerRect.left -
        timelineContainerRect.value.left +
        nextMarkerRect.width / 2;
      let y2 =
        nextMarkerRect.top -
        timelineContainerRect.value.top +
        nextMarkerRect.height / 2;

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
</script>

<style module="vTimeline" lang="css">
.timeline-events {
  position: relative;
  display: block;
}
.event,
.event-content {
  position: relative;
  flex: 1;
}

/* relax young grasshopper, i will remove this soon */
.event-content-horizontal {
  margin-inline-start: 0rem;
}
.event-content-vertical {
  margin-inline-start: 1rem;
}

.marker {
  position: absolute;
  width: v-bind(markerSize);
  height: v-bind(markerSize);
  z-index: 2;
}

.line-connecting-markers {
  position: absolute;
  stroke-width: v-bind(lineWidth);
  stroke: v-bind(color);
}
</style>
