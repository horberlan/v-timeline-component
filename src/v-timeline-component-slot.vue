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
      :style="{ position: 'absolute', top: 0, left: 0 }"
      :width="timelineContainerRect?.width || 0"
      :height="timelineContainerRect?.height || 0"
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
import { h, ref, useSlots, onMounted, type Ref, useCssModule } from "vue";

const props = withDefaults(
  defineProps<{
    element: Array<{ date: string }>;
    lineWidth?: string;
    markerSize?: string;
    color?: string;
  }>(),
  { markerSize: "16px", lineWidth: "2px", color: "currentColor" }
);

const slot = useSlots();
const classes = useCssModule();
const uniqueId = `timeline-${Math.random().toString(36).slice(2, 11)}`;

const containerRef = ref<HTMLElement | null>(null);
const markers: Ref<NodeListOf<SVGCircleElement> | null> = ref(null);
const timelineContainerRect = ref<DOMRect | null>(null);

const sortedTimelineEvents = ref(
  props.element?.sort((a, b) => +new Date(a.date) - +new Date(b.date)) ?? []
);

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
    { class: `${classes["timeline-events"]} ${uniqueId}` },
    sortedTimelineEvents.value.map((item, index) => {
      const randomMarkerClass = generateRandomClass();

      return h("div", { style: "position: relative; margin-bottom: 20px;" }, [
        h(
          "svg",
          {
            width: `${size}${unit}`,
            height: `${size}${unit}`,
            style: "position: absolute; transform: translate(-50%, -50%);",
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
        ),
        slot.default?.({ event: item, index }),
      ]);
    })
  );
}

const lines = ref<
  Array<{ x1: number; y1: number; x2: number; y2: number; randomClass: string }>
>([]);

function updateMarkersAndLine() {
  if (!containerRef.value) return;

  markers.value = containerRef.value.querySelectorAll(
    `.${uniqueId}.${classes.marker} circle`
  ) as NodeListOf<SVGCircleElement>;

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
    if (!timelineContainerRect.value || !markers.value) return;
    const nextMarker =
      index < markers.value.length - 1 ? markers.value[index + 1] : null;
    if (!nextMarker) return;

    const markerRect = marker.getBoundingClientRect();
    const nextMarkerRect = nextMarker.getBoundingClientRect();

    const x1 =
      markerRect.left - timelineContainerRect.value.left + markerRect.width / 2;
    const y1 =
      markerRect.top - timelineContainerRect.value.top + markerRect.height / 2;
    const x2 =
      nextMarkerRect.left -
      timelineContainerRect.value.left +
      nextMarkerRect.width / 2;
    const y2 =
      nextMarkerRect.top -
      timelineContainerRect.value.top +
      nextMarkerRect.height / 2;

    const randomLineClass = generateRandomClass();

    lines.value.push({ x1, y1, x2, y2, randomClass: randomLineClass });
  });
}

onMounted(() => {
  updateMarkersAndLine();
});
</script>

<style module lang="css">
.timeline-events {
  position: relative;
  display: block;
}

.marker {
  position: absolute;
  width: v-bind(markerSize);
  height: v-bind(markerSize);
  z-index: 3;
}

.line-connecting-markers {
  position: absolute;
  z-index: 2;
  width: v-bind(lineWidth);
  color: v-bind(color);
}

.event-content {
  margin-top: 1.5rem;
}
</style>
