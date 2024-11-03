# v-timeline-component

### Customizable Timeline Component for Vue

The `v-timeline-component` is a slot based vue.js component that displays events in a timeline format. It offers both vertical and horizontal layouts, enabling customization of event presentation, styling, and content.

## Features

- **Layout Customization**: Choose between vertical and horizontal layouts to suit your application's needs.
- **Event Customization**: Provide your own events with title, date, and description.
- **Custom Content Support**: Utilize slots to insert custom content for each event.
- **Styling Customization**: Adjust the color, marker size, and line width to match your desired aesthetic.

## Installation

To use the `v-timeline-component`, install it via npm:

```bash
npm install v-timeline-component
```

### Basic Example (Vertical Layout)

```vue
<template>
  <vTimelineComponent
    layout="vertical"
    :events="timelineEvents"
    line-width="1px"
  >
    <template #default="{ event }: { event: TimelineEvent, index: number }">
      <p>{{ event.title }}</p>
      <p>{{ event.description }}</p>
      <p>{{ event.date }}</p>
    </template>
  </vTimelineComponent>
</template>
<script setup lang="ts">
interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  child?: TimelineEvent[];
}
const timelineEvents: Ref<TimelineEvent[]> = ref([
  {
    title: "Event 1 Title",
    date: "2023-02-15",
    description: "Description for the first event. This can be any text.",
    child: [
      {
        title: "child Lorem ipsum dolor sit amet 1",
        date: "2023-02-16",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.",
      },
      {
        title: "child Lorem ipsum dolor sit amet 2",
        date: "2023-02-17",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.",
      },
    ],
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
]);
</script>
```

### Example (Horizontal Layout)

```vue
<vTimelineComponent
    layout="horizontal"
    :events="timelineEvents"
    line-width="1px"
  >
    <template #default="{ event }: { event: TimelineEvent, index: number }">
      <p>{{ event.title }}</p>
      <p>{{ event.description }}</p>
      <p>{{ event.date }}</p>
      <vTimelineComponent
        v-if="event.child"
        layout="vertical"
        :events="event.child"
        line-width="2px"
      >
        <template #default="{ event }: { event: TimelineEvent, index: number }">
          <p>{{ event.title }}</p>
          <p>{{ event.description }}</p>
          <p>{{ event.date }}</p>
        </template>
      </vTimelineComponent>
    </template>
  </vTimelineComponent>
```

## Available Props

| **Property**   | **Type**        | **Default**  | **Description**                               |
| :------------- | :-------------- | :----------- | :-------------------------------------------- |
| **color**      | `String`        | `#ddd`       | Timeline line and marker color.               |
| **markerSize** | `String`        | `0.75rem`    | Size of event markers.                        |
| **lineWidth**  | `String`        | `2px`        | Width of the timeline line.                   |
| **layout**     | `String`        | `vertical`   | Timeline layout (`vertical` or `horizontal`). |
| **events**     | `Array<Object>` | **Required** | Array of event objects.                       |

## Slots

### Default Slot

The default slot allows for custom content within each event on the timeline. It provides the `event` and `index` of the event.

```vue
<template #default="{ event, index }">
  <!-- Custom content for each event -->
</template>
```

### Marker Slot

The `#marker` slot allows for custom markers for each timeline event. Use it to customize the appearance of markers with custom elements or emojis.

```vue
<template #marker>💜</template>
```
Or dynamically with event data:
```vue

<template #marker="{ event }"> {{ event.marker }} </template>
```
		
👉 [example](src/App.vue)

## Contributing

If you would like to contribute to this project, feel free to fork the repository and submit a pull request. Contributions are welcome!
