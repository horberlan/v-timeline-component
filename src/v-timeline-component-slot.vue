<template>
  <template v-if="sortedTimelineEvents.length">
    <vTimeline @vue:updated="updateMarkersAndLine()" />
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
      :class="`line-${line.randomClass}`"
    />
  </svg>
</template>

<script setup lang="ts">
import {
  h,
  ref,
  useSlots,
  watchEffect,
  type Ref,
  useCssModule,
  onMounted,
} from "vue";

const props = withDefaults(
  defineProps<{
    element: Array<{ date: string }>;
    lineWidth?: string;
    color?: string;
  }>(),
  {
    lineWidth: "2px",
    color: "currentColor",
  }
);

const slot = useSlots();
const classes = useCssModule();

const markers: Ref<NodeListOf<HTMLDivElement> | null> = ref(null);
const timelineContainerRect = ref<DOMRect | null>(null);

const sortedTimelineEvents = ref(
  props.element?.sort((a, b) => +new Date(a.date) - +new Date(b.date)) ?? []
);

function generateRandomClass(): string {
  return `marker-${Math.random().toString(36).substr(2, 9)}`;
}

function vTimeline() {
  return h(
    "div",
    { class: [classes["timeline-events"]]},
    sortedTimelineEvents.value.map((item, index) => {
      const randomMarkerClass = generateRandomClass();

      return h("div", [
        h("div", {
          class: `${classes.marker} ${randomMarkerClass}`,
        }),
        slot.default?.({ event: item, index }),
      ]);
    })
  );
}

const lines = ref<
  Array<{ x1: number; y1: number; x2: number; y2: number; randomClass: string }>
>([]);

function updateMarkersAndLine() {
  markers.value = document.querySelectorAll(
    `.${classes.marker}`
  ) as NodeListOf<HTMLDivElement>;

  timelineContainerRect.value = document
    .querySelector(`.${classes["timeline-events"]}`)
    ?.getBoundingClientRect() as DOMRect;

  lines.value = [];

  markers.value.forEach((marker, index) => {
    if (!markers.value || !timelineContainerRect.value) return;
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
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  position: absolute;
  transform: translateX(-50%);
  z-index: 3;
  background-color: v-bind(color);
}

.line-connecting-markers {
  position: absolute;
  z-index: 2;
  width: v-bind(lineWidth);
  color: v-bind(color);
}

.line-[class^="marker-"] {
  stroke-dasharray: 4;
  background-color: red;
}
</style>
