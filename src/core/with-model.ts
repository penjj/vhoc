import type { Component, ExposeOptions } from './utils.ts'
import { createWrapper } from './hoc-wrapper.ts'

export type WithModelOptions<T> = Record<string, {
  get: (value: T) => T
  set: (value: T) => void
}>

/**
 * intercept the process of reading and writing values to a component.
 *
 * 拦截组件的属性读写过程，可用于对数据结构做转换的组件等。
 *
 * @example
 * ```ts
 * withModel(Input)({
 *   modelValue: {
 *     get(value) {
 *       return value * 100
 *     },
 *     set(value) {
 *       return value / 100
 *     }
 *   }
 * })
 * ```
 */
export function withModel<T extends Component>(
  Component: T,
  { mergeExpose }: ExposeOptions = {},
) {
  return (options: WithModelOptions<any>) => {
    const mappedProps = Object.keys(options)

    return createWrapper(Component, {
      mergeExpose,
      name: 'withModel',
    }, {
      mapProps(props, context) {
        if (!mappedProps.length)
          return props

        const ret = { ...props }

        Object.entries(options).forEach(([model, modelProxy]) => {
          ret[model] = modelProxy.get(ret[model])
          ret[`onUpdate:${model}`] = (v: any) => {
            context.emit(`update:${model}`, modelProxy.set(v))
          }
        })

        return ret
      },
    })
  }
}
