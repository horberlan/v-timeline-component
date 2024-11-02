<template>
  <div
    class="timeline-container"
    :class="{ horizontal: layout === 'horizontal' }"
  >
    <div
      v-for="(event, index) in sortedTimelineEvents"
      :key="index"
      class="timeline-event"
    >
      <div
        class="timeline-marker"
        :class="{
          'is-first': index === 0,
          'is-last': index === sortedTimelineEvents.length - 1,
        }"
      ></div>
      <div class="timeline-content">
        <slot :event="event" :index="index" />
      </div>
    </div>
    <div ref="timelineLine" class="timeline-line"></div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  onMounted,
  type Ref,
  type PropType,
  watchEffect,
} from "vue";

interface TimelineEvent {
  title: string;
  date: string;
  description: string;
}

export default defineComponent({
  name: "TimelineComponent",

  props: {
    hasCustomContent: {
      default: false,
      type: Boolean,
    },
    color: {
      default: "#ddd",
      type: String,
    },
    markerSize: {
      default: "0.75rem",
      type: String,
    },
    lineWidth: {
      default: "2px",
      type: String,
    },
    layout: {
      default: "vertical",
      type: String,
      validator: (value: string) => ["vertical", "horizontal"].includes(value),
    },
    timelineEvents: {
      required: true,
      type: Array as PropType<TimelineEvent[]>,
    },
  },

  setup(props, { slots }) {
    const timelineLine: Ref<null | HTMLevents> = ref(null);
    const sortedTimelineEvents = ref(
      props.timelineEvents.sort((a, b) => {
        return +new Date(a.date) - +new Date(b.date);
      })
    );

    const getLayoutAndSetDirection = () => {
      const markers = document.querySelectorAll(
        ".timeline-marker"
      ) as NodeListOf<HTMLDivevents>;
      const firstMarker = markers[0];
      const lastMarker = markers[markers.length - 1];

      const timelineContainerRect = document
        .querySelector(".timeline-container")
        ?.getBoundingClientRect();
      if (!timelineContainerRect) return;
      if (props.layout === "vertical") {
        const lineLeft =
          firstMarker.getBoundingClientRect().left -
          timelineContainerRect.left +
          firstMarker.offsetWidth / 2;
        const lineTop =
          firstMarker.getBoundingClientRect().top -
          timelineContainerRect.top +
          firstMarker.offsetHeight / 2;
        const lineHeight =
          lastMarker.getBoundingClientRect().top -
          timelineContainerRect.top +
          lastMarker.offsetHeight / 2 -
          lineTop;

        if (!timelineLine.value) return;

        timelineLine.value.style.top = `${lineTop}px`;
        timelineLine.value.style.height = `${lineHeight}px`;
        timelineLine.value.style.left = `${lineLeft}px`;
        timelineLine.value.style.width = props.lineWidth;
      } else if (props.layout === "horizontal") {
        const lineTop =
          firstMarker.getBoundingClientRect().top -
          timelineContainerRect.top +
          firstMarker.offsetHeight / 2;
        const lineLeft =
          firstMarker.getBoundingClientRect().left -
          timelineContainerRect.left +
          firstMarker.offsetWidth / 2;
        const lineWidth =
          lastMarker.getBoundingClientRect().left -
          timelineContainerRect.left +
          lastMarker.offsetWidth / 2 -
          lineLeft;

        if (!timelineLine.value) return;

        timelineLine.value.style.top = `${lineTop}px`;
        timelineLine.value.style.width = `${lineWidth}px`;
        timelineLine.value.style.left = `${lineLeft}px`;
        timelineLine.value.style.height = props.lineWidth;
      }
    };

    onMounted(() => {
      getLayoutAndSetDirection();
    });

    watchEffect(
      () => {
        if (!timelineLine.value) return;

        getLayoutAndSetDirection();
      },
      { flush: "post" }
    );
    return {
      sortedTimelineEvents,
      timelineLine,
    };
  },
});
</script>

<style>
.timeline-container {
  display: flex;
  position: relative;
  flex-direction: column;
}

.timeline-container.horizontal {
  flex-direction: row;
}

.timeline-marker {
  width: v-bind(markerSize);
  height: v-bind(markerSize);
  background-color: v-bind(color);
  border-radius: 50%;
  position: absolute;
  transform: translateX(-50%);
  z-index: 2;
}

.timeline-content {
  margin-inline: 2rem;
}

.timeline-event.horizontal-layout {
  display: flex;
  align-items: flex-start;
  margin-block: 2rem;
}

.timeline-event.horizontal-layout.timeline-marker {
  margin-inline-end: 1rem;
}

.timeline-line {
  position: absolute;
  background-color: v-bind(color);
  z-index: 0;
}

.timeline-container.horizontal.timeline-line {
  height: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>
