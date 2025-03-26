import type { InjectionKey } from '@vue/runtime-core'
import { defineComponent } from '@vue/runtime-core'
import { expectTypeOf, it } from 'vitest'
import { withInject } from './with-inject.ts'

const Input = defineComponent({
  props: {
    type: {
      type: String,
      required: true,
    },
  },
})

type InputComponent = typeof Input

it('with-inject should match original type', () => {
  const Injected = withInject(Input)('')
  expectTypeOf<InputComponent>().toMatchTypeOf(Injected)
})

it('with-inject should merge props type', () => {
  const injectKey: InjectionKey<{ type: string }> = Symbol('inputDefaultProps')
  const Injected = withInject(Input)(injectKey)
  expectTypeOf<InputComponent>().toMatchTypeOf(Injected)
})
