import {
  type ComponentObjectPropsOptions,
  type ComponentPublicInstance,
  type EmitsOptions,
  getCurrentInstance,
  isVNode,
  type ObjectEmitsOptions,
  type Prop,
  type Slot,
  type SlotsType,
  type VNodeProps,
  type VNodeRef,
} from '@vue/runtime-core'
import { extend, isArray, isFunction, isObject } from '@vue/shared'

export const { get, set, ownKeys } = Reflect

export function buildRuntimeProps(obj: any) {
  const ret: any = {}
  for (const k in obj) {
    const value = obj[k]
    ret[k] = {
      default: isObject(value) ? () => value : value,
    }
  }
  return ret
}

/**
 * 把 ref 函数所指向的子组件的 expose 对象合并到当前组件
 *
 * @param [exposeObj] 当前组件需要暴露的上下文对象，ref 指向的对象最终会合并到此对象
 *
 * @example
 * ```tsx
 * const MyTable = defineComponent({
 *   setup() {
 *     // 导出 expose, 并将子组件的 expose 对象继承到当前组件
 *     const ref = createExposedRef({
 *       saySomething: () => {},
 *    })
 *
 *     return () => <ElTable ref={ref} />
 *   },
 * })
 */
function createExposedRef<
  T extends ComponentPublicInstance | null | Element,
  R extends Record<PropertyKey, any>,
>(exposeObj = {} as R) {
  const vm = getCurrentInstance()
  if (!vm)
    return

  vm.exposed = exposeObj

  return (ins: T) => {
    if (!ins || ins instanceof Element || !ins.$)
      return

    // hack: `setupState` is vue internal api.
    const expose = ins.$.exposeProxy || get(ins.$, 'setupState', ins.$)

    if (!expose)
      return

    for (const key of ownKeys(expose)) {
      set(exposeObj, key, get(expose, key))
    }
  }
}

// type HocWrapper
export interface ExposeOptions {
  mergeExpose?: boolean
}

export function createRefProps(options: ExposeOptions) {
  let setRef: VNodeRef | undefined
  if (options.mergeExpose)
    setRef = createExposedRef()

  return { ref: setRef }
}

export type FnOr<T> = ((...args: any[]) => T) | T

/**
 * 调用一个可能为函数的值，并返回结果
 *
 * @example
 * ```ts
 * const a = 1
 * const b = () => 2
 * invokeCallable(a) // 1
 * invokeCallable(b) // 2
 * ```
 */
export function getCallableResult<T>(
  fnOr: FnOr<T>,
  defaultValue?: T,
  ...args: unknown[]
) {
  return isFunction(fnOr) ? fnOr(...args) : fnOr || defaultValue
}

export function toCallable<T>(value: T) {
  return isFunction(value) ? value : () => value
}

export interface Component<
  // eslint-disable-next-line ts/no-empty-object-type
  Props = {},
  Exposed extends Record<string, any> = object,
  Emits extends EmitsOptions = ObjectEmitsOptions,
  Slots extends SlotsType = object,
> {
  [key: string]: any
  props?: Props & VNodeProps
  slots?: Slots
  new (): Exposed & {
    [key: string]: any
    $props: Props
    $slots: Slots
    $emit: Emits extends string[]
      ? (event: Emits[number], ...args: any[]) => void
      : <
          T extends keyof Emits,
          R = Emits[T],
          Params extends any[] = R extends (...args: any[]) => any ? Parameters<R> : any[],
        >(
          event: T,
          ...params: Params
        ) => any
  }
}

export type Optional<T, K extends keyof T> = {
  [P in K]?: T[P];
} & Omit<T, K>

export function mergeSlots<
  const T extends Record<string, Slot> = Record<string, Slot>,
>(injectedSlots?: T | Slot, slots?: T): Record<string, Slot> | undefined {
  if (injectedSlots == null)
    return slots
  if (!isObject(injectedSlots) && !isVNode(injectedSlots)) {
    return mergeSlots(
      {
        default: toCallable(injectedSlots),
      } as any,
      slots,
    )
  }

  if (slots == null)
    return injectedSlots as any

  return extend({}, injectedSlots, slots)
}

function toPropOptions<T>(prop?: Prop<T> | null) {
  if (isArray(prop) || isFunction(prop)) {
    return { type: prop }
  }

  return prop == null ? {} : prop
}

export function mergeProps<T extends ComponentObjectPropsOptions>(
  baseProps = <T>{},
  overrideProps: T = <T>{},
): T {
  const newProps = { ...baseProps }
  for (const [prop, descriptor] of Object.entries(baseProps)) {
    const overrideProp = overrideProps[prop]
    const basePropOption = toPropOptions(descriptor)
    const overridePropOption = toPropOptions(overrideProp)

    set(newProps, prop, {
      ...basePropOption,
      default: overridePropOption.default,
    })
  }
  return newProps
}

export function cleanUndefFields<T extends Record<string, any>>(target: T): T {
  const result = {} as T

  Object.keys(target).forEach((key) => {
    const value = target[key]
    if (value !== undefined) {
      result[key as keyof T] = value
    }
  })

  return result
}
