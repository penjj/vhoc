import type { Component, ExposeOptions } from './utils.ts'
import { unref } from '@vue/runtime-core'
import { createWrapper } from './hoc-wrapper.ts'
import { ownKeys } from './utils.ts'

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
    if (!mappedProps.length)
      return Component

    const models = ownKeys(options)
    const updateEvents = models.map(i => `onUpdate:${String(i)}`)

    return createWrapper(Component, {
      mergeExpose,
      name: 'withModel',
    }, {
      mapContext({ attrs, ...ctx }) {
        const fullAttrs: string[] = ownKeys(attrs) as any
        const newAttrs: Record<string, any> = {}
        fullAttrs.forEach((evt) => {
          if (!updateEvents.includes(String(evt))) {
            newAttrs[evt] = attrs[evt]
          }
        })
        return { ...ctx, attrs: newAttrs }
      },
      mapProps(props, context) {
        const ret = { ...unref(props) }
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
