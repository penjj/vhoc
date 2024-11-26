import { defineComponent, ref } from '@vue/runtime-core'
import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { withModel } from './with-model.ts'

it('with model test', async () => {
  const component = withModel(
    defineComponent({
      props: {
        value: String,
      },
      template: `
        <input
          type="text"
          :value="value"
          @change="e => $emit('update:value', e.target.value)"
        />
      `,
    }),
  )({
    value: {
      get(value) {
        return (value / 100).toString()
      },
      set(value) {
        return (value * 100).toString()
      },
    },
  })

  const model = ref('100')
  const wrapper = mount(component, {
    props: {
      'value': model.value,
      'onUpdate:value': (value: string) => {
        return model.value = value
      },
    },
  })

  await wrapper.vm.$nextTick()
  expect(wrapper.html()).toMatchInlineSnapshot(
    `"<input type="text" value="1">"`,
  )

  const input = wrapper.find('input')
  expect(input.element.value).toEqual('1')
  expect(model.value).toEqual('100')

  await input.setValue('100')
  await wrapper.vm.$nextTick()

  expect(input.element.value).toEqual('100')
  expect(model.value).toEqual('10000')
})
