import { Ref, PropType, DefineComponent, ExtractPropTypes, ComponentOptionsMixin, PublicProps, ComponentProvideOptions } from 'vue';
interface TimelineEvent {
    title: string;
    date: string;
    description: string;
}
declare const _default: DefineComponent<ExtractPropTypes<{
    hasCustomContent: {
        default: boolean;
        type: BooleanConstructor;
    };
    color: {
        default: string;
        type: StringConstructor;
    };
    markerSize: {
        default: string;
        type: StringConstructor;
    };
    lineWidth: {
        default: string;
        type: StringConstructor;
    };
    layout: {
        default: string;
        type: StringConstructor;
        validator: (value: string) => boolean;
    };
    timelineEvents: {
        required: true;
        type: PropType<TimelineEvent[]>;
    };
}>, {
    sortedTimelineEvents: Ref<{
        title: string;
        date: string;
        description: string;
    }[], TimelineEvent[] | {
        title: string;
        date: string;
        description: string;
    }[]>;
    timelineLine: Ref<HTMLElement | null, HTMLElement | null>;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly< ExtractPropTypes<{
    hasCustomContent: {
        default: boolean;
        type: BooleanConstructor;
    };
    color: {
        default: string;
        type: StringConstructor;
    };
    markerSize: {
        default: string;
        type: StringConstructor;
    };
    lineWidth: {
        default: string;
        type: StringConstructor;
    };
    layout: {
        default: string;
        type: StringConstructor;
        validator: (value: string) => boolean;
    };
    timelineEvents: {
        required: true;
        type: PropType<TimelineEvent[]>;
    };
}>> & Readonly<{}>, {
    hasCustomContent: boolean;
    color: string;
    markerSize: string;
    lineWidth: string;
    layout: string;
}, {}, {}, {}, string, ComponentProvideOptions, true, {}, any>;
export default _default;
