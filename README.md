# v-timeline-component

### Customizable Timeline Component for Vue

## Features

- **Layout Customization**: Choose between vertical and horizontal layouts to suit your application's needs.
- **Event Customization**: Provide your own events with title, date, and description.
- **Custom Content Support**: Utilize slots to insert custom content for each event.
- **Styling Customization**: Adjust the color, marker size, and line width to match your desired aesthetic.

### Basic Example (Vertical Layout)

```typescript
<TimelineComponent
  :timeline-events="myEvents"
  layout="vertical"
  color="#333"
  marker-size="1rem"
  line-width="3px"
/>
```

### Basic Example (Horizontal Layout)

```typescript
<TimelineComponent
  :has-custom-content="true"
  :timeline-events="myEvents"
  layout="horizontal"
  color="#666"
  marker-size="0.75rem"
  line-width="2px">

  <template v-slot="{ event, index }">
    <h4>{{ event.title }}</h4>
    <p>Event Index: {{ index }}</p>
  </template>
</TimelineComponent>
```

## Available Props

| **Property**         | **Type**        | **Default**  | **Description**                               |
| :------------------- | :-------------- | :----------- | :-------------------------------------------- |
| **hasCustomContent** | `Boolean`       | `false`      | Enables custom event content slots.           |
| **color**            | `String`        | `#ddd`       | Timeline line and marker color.               |
| **markerSize**       | `String`        | `0.75rem`    | Size of event markers.                        |
| **lineWidth**        | `String`        | `2px`        | Width of the timeline line.                   |
| **layout**           | `String`        | `vertical`   | Timeline layout (`vertical` or `horizontal`). |
| **timelineEvents**   | `Array<Object>` | **Required** | Array of event objects.                       |
