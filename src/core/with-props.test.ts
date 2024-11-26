import { defineComponent } from '@vue/runtime-core'
import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { withProps } from './with-props.ts'

it('with props test', async () => {
  const component = withProps(
    defineComponent({
      props: {
        type: String,
        placeholder: String,
      },
      template: `
        <input v-bind="$props" />
      `,
    }),
  )({
    placeholder: 'Hello',
  })

  const wrapper1 = mount(component, {
    props: {
      type: 'text',
    },
  })
  expect(wrapper1.html()).toMatchInlineSnapshot(
    `"<input type="text" placeholder="Hello">"`,
  )

  const wrapper2 = mount(component, {
    props: {
      type: 'password',
      placeholder: 'world',
    },
  })
  expect(wrapper2.html()).toMatchInlineSnapshot(
    `"<input type="password" placeholder="world">"`,
  )
})
