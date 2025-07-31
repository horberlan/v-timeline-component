<template>
  <div ref="containerRef" :class="`${uniqueId}-container`" style="position: relative" role="list"
    :aria-label="`Timeline com ${sortedTimelineEvents.length} eventos`">
    <template v-if="sortedTimelineEvents.length">
      <vTimeline :uniqueId="uniqueId" />
    </template>
    <svg :class="classes[ 'line-connecting-markers' ]" xmlns="http://www.w3.org/2000/svg" :style="{
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
      overflow: 'visible',
      width: svgAttributes.width,
      height: svgAttributes.height,
    }" :viewBox="svgAttributes.viewBox" aria-hidden="true">
      <line v-for="(line, index) in state.lines" :key="index" :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2"
        :stroke="props.color" :stroke-width="props.lineWidth" :class="`line-${uniqueId}-${line.randomClass}`" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import {
  h,
  ref,
  useSlots,
  onMounted,
  useCssModule,
  watch,
  onBeforeUnmount,
  computed,
  reactive,
} from "vue";

interface TimelineEvent {
  date: string | Date;
  title?: string;
  [ key: string ]: any;
}

interface LineData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  randomClass: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  lineWidth?: string;
  markerSize?: string;
  color?: string;
  layout?: "vertical" | "horizontal";
}

interface MarkerPosition {
  x: number;
  y: number;
}

const props = withDefaults(defineProps<TimelineProps>(), {
  markerSize: "1rem",
  lineWidth: "2px",
  color: "currentColor",
  layout: "vertical",
});

const slots = defineSlots<{
  default(data: { event: TimelineEvent; index: number }): any;
  marker(data: { event: TimelineEvent; index: number }): any;
}>();

const classes = useCssModule("vTimeline");
const slot = useSlots();

const isLayoutHorizontal = ref(props.layout === "horizontal");

watch(() => props.layout, (newLayout) => {
  isLayoutHorizontal.value = newLayout === "horizontal";
});

const uniqueId = `timeline-${Math.random().toString(36).slice(2, 11)}`;

const containerRef = ref<HTMLElement | null>(null);

const state = reactive({
  markers: null as NodeListOf<HTMLElement> | null,
  timelineContainerRect: null as DOMRect | null,
  lines: [] as LineData[],
  resizeObserver: null as ResizeObserver | null,
});

const sortedTimelineEvents = computed((): TimelineEvent[] =>
  [ ...props.events ].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )
);

function generateRandomMarkerClass(): string {
  return `marker-${Math.random().toString(36).substring(2)}`;
}

function getCircleSize() {
  const size = parseFloat(props.markerSize || "16");
  const unit = props.markerSize?.replace(size.toString(), "") || "px";
  const radius = size / 2;
  return { radius, size, unit };
}

function getMarkerPosition(marker: HTMLElement): MarkerPosition {
  if (!state.timelineContainerRect) {
    return { x: 0, y: 0 };
  }

  const markerRect = marker.getBoundingClientRect();

  return {
    x: markerRect.left - state.timelineContainerRect.left + markerRect.width / 2,
    y: markerRect.top - state.timelineContainerRect.top + markerRect.height / 2,
  };
}

function calculateLinePositions(): LineData[] {
  if (!state.markers?.length || !state.timelineContainerRect) {
    return [];
  }

  return Array.from(state.markers).reduce<LineData[]>((lines, marker, index) => {
    const nextMarker = state.markers?.[ index + 1 ];
    if (!nextMarker) return lines;

    const currentPos = getMarkerPosition(marker);
    const nextPos = getMarkerPosition(nextMarker);

    if (isLayoutHorizontal.value) {
      const nextMarkerRect = nextMarker.getBoundingClientRect();
      const midY = nextMarkerRect.height / 2 + nextMarkerRect.top;
      currentPos.y = midY - state.timelineContainerRect!.top;
      nextPos.y = midY - state.timelineContainerRect!.top;
    }

    lines.push({
      x1: currentPos.x,
      y1: currentPos.y,
      x2: nextPos.x,
      y2: nextPos.y,
      randomClass: generateRandomMarkerClass(),
    });

    return lines;
  }, []);
}

function vTimeline() {
  const { radius, size, unit } = getCircleSize();

  return h(
    "div",
    {
      class: `${classes[ "timeline-events" ]} ${uniqueId}`,
      style: {
        display: isLayoutHorizontal.value ? "flex" : "block",
        flexDirection: isLayoutHorizontal.value ? "row" : "column",
      },
    },
    sortedTimelineEvents.value.map((item, index) => {
      const randomMarkerClass = generateRandomMarkerClass();

      return h(
        "div",
        {
          class: classes.event,
          tabindex: 0,
          role: "listitem",
          "aria-label": `Evento ${index + 1}${item.title ? `: ${item.title}` : ''}`,
          style: { display: "flex" },
        },
        [
          !slot[ "marker" ]
            ? h(
              "svg",
              {
                width: `${size}${unit}`,
                height: `${size}${unit}`,
                class: `${classes.marker} ${uniqueId} ${randomMarkerClass}`,
                "aria-hidden": "true",
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
                  zIndex: 3,
                  fontSize: `${size}${unit}`,
                },
                "aria-hidden": "true",
              },
              slot[ "marker" ]?.({ event: item, index })
            ),
          h(
            "div",
            {
              class: [
                classes[ "event-content" ],
                !isLayoutHorizontal.value
                  ? classes[ "event-content-vertical" ]
                  : classes[ "event-content-horizontal" ],
              ],
            },
            slot.default?.({ event: item, index })
          ),
        ]
      );
    })
  );
}

function updateMarkersAndLine(): void {
  try {
    if (!containerRef.value) {
      console.warn('Timeline container not found');
      return;
    }

    state.markers = containerRef.value.querySelectorAll(
      `.${uniqueId}.${classes.marker} circle, .${uniqueId}.${classes.marker}`
    ) as NodeListOf<HTMLElement>;

    const timelineEventsContainer = containerRef.value.querySelector(
      `.${uniqueId}.${classes[ "timeline-events" ]}`
    );

    if (timelineEventsContainer) {
      state.timelineContainerRect = timelineEventsContainer.getBoundingClientRect();
    }

    state.lines = calculateLinePositions();
  } catch (error) {
    console.error('Error updating timeline:', error);
  }
}

const svgAttributes = computed(() => {
  const width = isLayoutHorizontal.value
    ? state.timelineContainerRect?.width || 0
    : 2;
  const height = isLayoutHorizontal.value
    ? 2
    : state.timelineContainerRect?.height || 0;

  return {
    width: `${width}px`,
    height: `${height}px`,
    viewBox: `0 0 ${width} ${height}`,
  };
});

onMounted(() => {
  updateMarkersAndLine();

  state.resizeObserver = new ResizeObserver(() => {
    updateMarkersAndLine();
  });

  if (containerRef.value) {
    state.resizeObserver.observe(containerRef.value);
  }
});

onBeforeUnmount(() => {
  if (state.resizeObserver) {
    state.resizeObserver.disconnect();
    state.resizeObserver = null;
  }

  state.markers = null;
  state.timelineContainerRect = null;
  state.lines = [];
});

watch(sortedTimelineEvents, () => {
  updateMarkersAndLine();
});
</script>

<style module="vTimeline" lang="css">
.timeline-events {
  --marker-size: v-bind(markerSize);
  --line-width: v-bind(lineWidth);
  --timeline-color: v-bind(color);
  position: relative;
}

.event,
.event-content {
  position: relative;
  flex: 1;
}

.event:focus {
  outline: 2px solid var(--timeline-color);
  outline-offset: 2px;
  border-radius: 4px;
}

.event-content-horizontal {
  margin-inline-start: 0rem;
}

.event-content-vertical {
  margin-inline-start: 1rem;
}

.marker {
  position: absolute;
  width: var(--marker-size);
  height: var(--marker-size);
}

.line-connecting-markers {
  position: absolute;
  stroke-width: var(--line-width);
  stroke: var(--timeline-color);
}
</style>