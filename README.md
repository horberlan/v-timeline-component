# v-timeline-component

### Customizable Timeline Component for Vue

The `v-timeline-component` is a flexible Vue.js component that visually displays events in a timeline format. It offers both vertical and horizontal layouts, enabling customization of event presentation, styling, and content.

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
...
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
          <template
            #default="{ event }: { event: TimelineEvent, index: number }"
          >
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
| **events**    | `Array<Object>` | **Required** | Array of event objects.                       |

## Contributing

If you would like to contribute to this project, feel free to fork the repository and submit a pull request. Contributions are welcome!
