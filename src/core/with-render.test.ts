import { defineComponent, h } from '@vue/runtime-core'
import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { withRender } from './with-render.ts'

it('with props test', async () => {
  const component = withRender(
    defineComponent({
      props: {
        type: String,
        placeholder: String,
      },
      template: `
        <button v-bind="$props" />
      `,
    }),
  )((Component, props, context) => {
    return h('div', [
      h(Component, props, context.slots),
    ])
  })

  const wrapper1 = mount(component)

  expect(wrapper1.html()).toMatchInlineSnapshot(
    `"<div><button></button></div>"`,
  )
})
