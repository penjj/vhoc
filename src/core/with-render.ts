import type { SetupContext, VNode } from '@vue/runtime-core'
import type { ComponentExposed } from 'vue-component-type-helpers'
import type { Component, ExposeOptions } from './utils.ts'
import { createWrapper } from './hoc-wrapper.ts'

/**
 * hijack render to component.
 *
 * 包装一个组件，并劫持它的渲染函数。
 *
 * @example
 * ```ts
 * const SubmitButton = withRender(Button)((comp, props, context) => {
 *   return h(comp, props, 'submit')
 * })
 * ```
 */
export function withRender<
  T extends Component,
>(
  Component: T,
  { mergeExpose }: ExposeOptions = {},
) {
  return (
    render: (
      Component: T,
      props: ComponentExposed<T>,
      context: SetupContext
    ) => VNode,
  ) => {
    return createWrapper(Component, {
      mergeExpose,
      name: 'withRender',
    }, {
      mapRender: render,
    })
  }
}
