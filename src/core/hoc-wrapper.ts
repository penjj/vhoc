import type {
  ComponentObjectPropsOptions,
  MaybeRefOrGetter,
  Slots,
  VNode,
} from '@vue/runtime-core'
import type {
  ComponentEmit,
  ComponentExposed,
  ComponentProps,
  ComponentSlots,
} from 'vue-component-type-helpers'
import { defineComponent, h, unref } from '@vue/runtime-core'
import { type Component, type ExposeOptions, mergeProps } from './utils.ts'

export interface WrapComponentOptions extends ExposeOptions {
  props?: ComponentObjectPropsOptions
  name?: string
}

interface HocOptions {
  mapRender?: (component: any, props: any, context: any) => VNode
  mapProps?: (props: any, context: any) => MaybeRefOrGetter<any>
  mapSlots?: (props: any, context: any) => any
}

export function createWrapper<
  T extends Component,
  InferProps extends ComponentProps<T> = ComponentProps<T>,
  InferExposed extends ComponentExposed<T> = ComponentExposed<T>,
  InferEmits extends ComponentEmit<T> = ComponentEmit<T>,
  InferSlots extends ComponentSlots<T> = ComponentSlots<T>,
>(
  Component: T,
  {
    name = 'anonymous',
    // mergeExpose,
    props,
  }: WrapComponentOptions = {},
  {
    mapRender,
    mapProps,
    mapSlots,
  }: HocOptions = {},
) {
  return defineComponent({
    props: mergeProps(Component.props as any, props),
    name: `Vhoc_${name}`,
    setup(props, context) {
      let slots: Slots | undefined = context.slots as any
      if (mapRender)
        return () => mapRender(Component, props, slots)

      return () => {
        if (mapProps)
          props = mapProps(props, context)

        if (mapSlots)
          slots = mapSlots(props, context)

        return h(Component, unref(props), unref(slots))
      }
    },
  }) as Component<InferProps, InferExposed, InferEmits, InferSlots>
}
