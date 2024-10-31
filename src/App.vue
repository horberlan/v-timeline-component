<template>
  <TimelineComponent
    color="purple"
    marker-size="0.75rem"
    layout="vertical"
    :timeline-events="timelineEvents"
  >
    <template v-slot="{ event }: { event: TimelineEvent }" #default>
      <p>{{ event.title }}</p>
      <p>{{ event.description }}</p>
    </template>
  </TimelineComponent>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import TimelineComponent from "./TimelineComponent.vue";
import vTimelineComponentSlot from "./v-timeline-component-slot.vue";

interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  child?: TimelineEvent[];
}

const timelineEvents: Ref<TimelineEvent[]> = ref([
  {
    title: "Lorem ipsum dolor sit amet",
    date: "2023-02-15",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.",
    child: [
      {
        title: "Lorem ipsum dolor sit amet 1",
        date: "2023-02-16",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.",
      },
      {
        title: "Lorem ipsum dolor sit amet 2",
        date: "2023-02-17",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.",
      },
      {
        title: "Lorem ipsum dolor sit amet 2",
        date: "2023-02-17",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.",
      },
    ],
  },
  {
    title: "Lorem ipsum dolor sit amet 2",
    date: "2023-03-01",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Lorem ipsum dolor sit amet 3",
    date: "2023-04-20",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Lorem ipsum dolor sit amet 4",
    date: "2023-01-20",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
]);
</script>

<style scoped>
* p {
  margin: 0;
}
</style>
