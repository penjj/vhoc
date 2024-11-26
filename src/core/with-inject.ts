import type { ComponentProps } from 'vue-component-type-helpers'
import type { Component, ExposeOptions } from './utils.ts'
import { computed, inject, type InjectionKey, unref } from '@vue/runtime-core'
import { createWrapper } from './hoc-wrapper.ts'

/**
 * Create a component with props, and inject `default` props to your component.
 *
 * 创建一个高阶组件，并给内部组件提供默认 props。
 *
 * @example
 * ```ts
 * import { type InjectionKey } from 'vue'
 *
 * const defaultInputKey: InjectionKey<{ type?: string }> = Symbol()
 * const MyInput = withProps(Input)(defaultInputKey)
 * ```
 */
export function withInject<
  T extends Component,
  Props extends ComponentProps<T> = ComponentProps<T>,
>(
  Component: T,
  { mergeExpose }: ExposeOptions = {},
) {
  return <T extends Props>(
    injectionKey: InjectionKey<T> | string,
  ) => {
    return createWrapper(Component, {
      mergeExpose,
      name: 'withInject',
    }, {
      mapProps(__props) {
        const props = unref(__props)
        const injection = inject(injectionKey)
        const actualProps: Record<string, any> = {}
        for (const key in props) {
          if (typeof props[key] !== 'undefined')
            actualProps[key] = props[key]
        }
        return computed(() => ({
          ...injection,
          ...actualProps,
        }))
      },
    })
  }
}
