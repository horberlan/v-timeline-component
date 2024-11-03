<template>
  <div class="custom-content">
    <vTimelineComponent
      layout="vertical"
      :events="timelineEvents"
      line-width="4px"
      color="#bf6a53"
    >
      <template #default="{ event }: { event: TimelineEvent, index: number }">
        <p>{{ event.title }}</p>
        <p>{{ event.description }}</p>
        <p>{{ event.date }}</p>
      </template>
      <template #marker> 💩</template>
    </vTimelineComponent>
    <vTimelineComponent
      layout="horizontal"
      :events="timelineEvents"
      line-width="2px"
      color="#aa8ed6"
      marker-size="1.2rem"
    >
      <template #default="{ event }: { event: TimelineEvent, index: number }">
        <p>{{ event.title }}</p>
        <p>{{ event.description }}</p>
        <p>{{ event.date }}</p>
      </template>
      <template #marker="{ event }"> {{ event.marker }}</template>
    </vTimelineComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import vTimelineComponent from "./v-timeline-component.vue";

interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  child?: TimelineEvent[];
}

const timelineEvents: Ref<TimelineEvent[]> = ref([
  {
    title: "Lorem ipsum dolor sit amet 0",
    date: "2023-02-15",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    marker: "🥳",
  },
  {
    title: "Lorem ipsum dolor sit amet 1",
    date: "2023-03-01",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    marker: "🥴",
  },
  {
    title: "Lorem ipsum dolor sit amet 2",
    date: "2023-04-20",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    marker: "🐸",
  },
  {
    title: "Lorem ipsum dolor sit amet 3",
    date: "2023-01-20",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    marker: "🤫",
  },
]);
</script>

<style scoped>
.custom-content {
  position: relative;
  margin-left: 10px;
}
.test {
  background-color: red;
  max-width: 8px;
}
</style>
