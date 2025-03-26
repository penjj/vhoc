import type { SlotsType, VNode } from '@vue/runtime-core'
import { defineComponent, h } from '@vue/runtime-core'
import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { withSlots } from './with-slots.ts'

it('with props test', async () => {
  const component = withSlots(
    defineComponent({
      slots: {} as SlotsType<{
        default: () => VNode
        addonBefore: () => VNode
        addonAfter: () => VNode
      }>,
      template: `
        <button>
          <slot name="addon-before"></slot>
          <slot name="default"></slot>
          <slot name="addon-after"></slot>
        </button>
      `,
    }),
  )({
    default: () => `Click Me`,
  })

  const wrapper1 = mount(h(component, null, {
    'addon-after': () => '> after',
    'addon-before': () => 'before <',
  }))

  expect(wrapper1.html()).toMatchInlineSnapshot(
    `"<button>before &lt;Click Me&gt; after</button>"`,
  )

  const wrapper2 = mount(h(component, null, {
    'addon-after': () => '> after',
    'addon-before': () => 'before <',
    'default': () => 'Tap',
  }))

  expect(wrapper2.html()).toMatchInlineSnapshot(
    `"<button>before &lt;Tap&gt; after</button>"`,
  )
})
