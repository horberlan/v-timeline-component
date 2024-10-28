<template>
  <div
    class="timeline-container"
    :class="{ horizontal: layout === 'horizontal' }"
  >
    <div
      v-for="(event, index) in timelineEvents"
      :key="index"
      class="timeline-event"
    >
      <div
        class="timeline-marker"
        :class="{
          'is-first': index === 0,
          'is-last': index === timelineEvents.length - 1,
        }"
      ></div>
      <div class="timeline-content">
        <template v-if="!hasCustomContent">
          <h4 class="event-title">{{ event.title }}</h4>
          <p class="event-date">{{ event.date }}</p>
          <p class="event-description">{{ event.description }}</p>
        </template>
        <template v-else> <slot :event="event" :index="index" /> </template>
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
  watch,
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
    merkerSize: {
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
    const timelineLine: Ref<null | HTMLElement> = ref(null);
    const timelineEvents = ref(props.timelineEvents);
    timelineEvents.value.sort((a, b) => {
      return +new Date(a.date) - +new Date(b.date);
    });

    onMounted(() => {
      const markers = document.querySelectorAll(".timeline-marker");
      const firstMarker = markers[0];
      const lastMarker = markers[markers.length - 1];

      const timelineContainerRect = document
        .querySelector(".timeline-container")
        ?.getBoundingClientRect();
      if (!timelineContainerRect) return;
      getloyoutAndSetDirection(firstMarker, lastMarker, timelineContainerRect);
    });

    const getloyoutAndSetDirection = (
      firstMarker,
      lastMarker,
      timelineContainerRect
    ) => {
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

    return {
      timelineEvents,
      timelineLine,
    };
  },
});
</script>

<style scoped>

.timeline-container {
  display: flex;
  position: relative;
  flex-direction: column;
}

.timeline-container.horizontal {
  flex-direction: row;
}

.timeline-marker {
  width: v-bind(merkerSize);
  height: v-bind(merkerSize);
  background-color: v-bind(color);
  border-radius: 50%;
  position: absolute;
  transform: translateX(-50%);
  z-index: 2;
}

/* .timeline-marker.is-first,
.timeline-marker.is-last {
} */

.timeline-content {
  margin-inline: 2rem;
}

.event-title {
  margin-top: 0;
}

.event-date {
  font-size: 0.9rem;
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
