import { DefineComponent, ComponentOptionsMixin, PublicProps, ComponentProvideOptions } from 'vue';
declare function __VLS_template(): {
    slots: Readonly<{
        default(data: {
            event: any;
            index: number;
        }): any;
        marker: (data: {
            event: any;
            index: number;
        }) => HTMLElement | string;
    }> & {
        default(data: {
            event: any;
            index: number;
        }): any;
        marker: (data: {
            event: any;
            index: number;
        }) => HTMLElement | string;
    };
    refs: {
        containerRef: HTMLDivElement;
    };
    attrs: Partial<{}>;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: DefineComponent<{
    events: any[];
    lineWidth?: string;
    markerSize?: string;
    color?: string;
    layout?: "vertical" | "horizontal";
}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{
    events: any[];
    lineWidth?: string;
    markerSize?: string;
    color?: string;
    layout?: "vertical" | "horizontal";
}> & Readonly<{}>, {
    lineWidth: string;
    markerSize: string;
    color: string;
    layout: "vertical" | "horizontal";
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
