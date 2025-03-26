import type { VNodeChild } from '@vue/runtime-core'
import type { ComponentExposed } from 'vue-component-type-helpers'
import type { WrapComponentOptions } from './hoc-wrapper.ts'
import type { Component, FnOr } from './utils.ts'
import { createWrapper } from './hoc-wrapper.ts'
import {

  getCallableResult,
  mergeSlots,
} from './utils.ts'

/**
 * inject default slots to component.
 *
 * 包装一个组件，并注入默认的插槽节点。
 *
 * @example
 * ```ts
 * const SubmitButton = withSlots(Button)({
 *   default: () => 'submit'
 * })
 * ```
 */
export function withSlots<
  T extends Component,
  Expose extends ComponentExposed<T>,
  RawSlots extends Expose['$slots'],
  Slots extends {
    [key in keyof RawSlots]: (...args: RawSlots[key] extends (...args: infer Args) => any ? Args : never) => VNodeChild
  },
>(
  Component: T,
  { mergeExpose, props }: WrapComponentOptions = {},
) {
  return <R extends Partial<Slots>>(
    options: FnOr<R>,
  ) => {
    return createWrapper(Component, {
      mergeExpose,
      name: 'withSlots',
      props,
    }, {
      mapSlots(props, context) {
        return mergeSlots(
          getCallableResult(options, undefined, props, context),
          context.slots,
        )
      },
    })
  }
}
