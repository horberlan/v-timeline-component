import { Ref, PropType } from 'vue';
interface TimelineEvent {
    title: string;
    date: string;
    description: string;
}
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    hasCustomContent: {
        default: boolean;
        type: BooleanConstructor;
    };
    color: {
        default: string;
        type: StringConstructor;
    };
    merkerSize: {
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
    timelineEvents: Ref<{
        title: string;
        date: string;
        description: string;
    }[], TimelineEvent[] | {
        title: string;
        date: string;
        description: string;
    }[]>;
    timelineLine: Ref<HTMLElement | null, HTMLElement | null>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    hasCustomContent: {
        default: boolean;
        type: BooleanConstructor;
    };
    color: {
        default: string;
        type: StringConstructor;
    };
    merkerSize: {
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
    merkerSize: string;
    lineWidth: string;
    layout: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default _default;
