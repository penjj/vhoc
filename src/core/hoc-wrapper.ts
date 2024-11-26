import type {
  ComponentObjectPropsOptions,
  MaybeRef,
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
  mapContext?: (context: any) => any
  mapSlots?: (props: any, context: any) => any
  mapRender?: (component: any, props: any, context: any) => VNode
  mapProps?: (props: MaybeRefOrGetter<any>, context: any) => MaybeRefOrGetter<any>
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
    mapContext,
  }: HocOptions = {},
) {
  return defineComponent({
    props: mergeProps(Component.props as any, props),
    name: `Vhoc_${name}`,
    setup(__props, context) {
      let slots: Slots | undefined = context.slots as any
      let props: MaybeRef = __props

      if (mapRender)
        return () => mapRender(Component, __props, slots)

      if (mapContext)
        context = mapContext(context)

      if (mapProps)
        props = mapProps(__props, context)

      if (mapSlots)
        slots = mapSlots(unref(props), context)

      return () => {
        const finallyProps = {
          ...unref(props),
          ...context.attrs,
        }
        return h(Component, finallyProps, unref(slots))
      }
    },
  }) as Component<InferProps, InferExposed, InferEmits, InferSlots>
}
