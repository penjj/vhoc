import { defineComponent, reactive } from '@vue/runtime-core'
import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { withInject } from './with-inject.ts'

it('with props test', async () => {
  const component = withInject(
    defineComponent({
      props: {
        type: String,
      },
      template: `
        <input v-bind="$props" />
      `,
    }),
  )('defaultInputProps')

  const wrapper1 = mount(component, {
    global: {
      provide: {
        defaultInputProps: {
          type: 'password',
        },
      },
    },
  })
  expect(wrapper1.html()).toMatchInlineSnapshot(
    `"<input type="password">"`,
  )

  const wrapper2 = mount(component, {
    props: {
      type: 'text',
    },
    global: {
      provide: {
        defaultInputProps: {
          type: 'password',
        },
      },
    },
  })
  expect(wrapper2.html()).toMatchInlineSnapshot(
    `"<input type="text">"`,
  )

  const inputProps = reactive({ type: 'password' })
  const wrapper3 = mount(component, {
    global: {
      provide: {
        defaultInputProps: inputProps,
      },
    },
  })
  expect(wrapper3.html()).toMatchInlineSnapshot(
    `"<input type="password">"`,
  )

  inputProps.type = 'text'
  await wrapper3.vm.$nextTick()
  const input = wrapper3.find('input')

  expect(input.element.getAttribute('type')).toEqual('text')
})
