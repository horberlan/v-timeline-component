<template>
  <!-- <TimelineComponent has-custom-content="false" /> -->
  <TimelineComponent
    :has-custom-content="true"
    color="#ddd"
    merker-size="0.75rem"
    :timeline-events="timelineEvents"
  >
    <template v-slot="{ event, index }">
      <h4>{{ event.title }}</h4>
      <p>Event Index: {{ index }}</p>
    </template>
  </TimelineComponent>
</template>

<script setup>
import { ref } from "vue";
import TimelineComponent from "./TimelineComponent.vue";

const timelineEvents = ref([
  {
    title: "Event 1 Title",
    date: "2023-02-15",
    description: "Description for the first event. This can be any text.",
  },
  {
    title: "Event 2 Title",
    date: "2023-03-01",
    description: "This is the second event on our timeline.",
  },
  {
    title: "Event 3 Title",
    date: "2023-04-20",
    description:
      "Aperiam animi ut. Odit ullam eaque. Iusto laboriosam non nulla nisi soluta nobis est dolor ea",
  },
  {
    title: "Event 4 Title",
    date: "2023-01-20",
    description:
      "Aperiam animi ut. Odit ullam eaque. Iusto laboriosam non nulla nisi soluta nobis est dolor ea.",
  },
]);
</script>

<style scoped></style>
