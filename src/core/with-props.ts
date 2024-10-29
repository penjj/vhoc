import type { ComponentExposed } from 'vue-component-type-helpers'
import { createWrapper } from './hoc-wrapper.ts'
import {
  cleanUndefFields,
  type Component,
  type ExposeOptions,
  type FnOr,
  getCallableResult,
} from './utils.ts'

/**
 * Create a component with props, and inject `default` props to your component.
 *
 * 创建一个高阶组件，并给内部组件提供默认 props。
 *
 * @example
 * ```ts
 * const MyInput = withProps(Input)({
 *   placeholder: 'Please enter'
 * })
 */
export function withProps<
  T extends Component,
  Expose extends ComponentExposed<T> = ComponentExposed<T>,
  Props extends Expose['$props'] = Expose['$props'],
>(
  Component: T,
  { mergeExpose }: ExposeOptions = {},
) {
  return <R extends Partial<Props>>(
    options: FnOr<R>,
  ) => {
    return createWrapper(Component, {
      mergeExpose,
      name: 'withProps',
    }, {
      mapProps(props) {
        const defaultProps = getCallableResult(options, {} as any)
        return {
          ...defaultProps,
          ...cleanUndefFields(props),
        }
      },
    })
  }
}