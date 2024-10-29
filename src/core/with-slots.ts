import type { ComponentExposed } from 'vue-component-type-helpers'
import { createWrapper, type WrapComponentOptions } from './hoc-wrapper.ts'
import {
  type Component,
  type FnOr,
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
  Expose extends ComponentExposed<T> = ComponentExposed<T>,
  Slots extends Expose['$slots'] = Expose['$slots'],
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
