import { parse as parseSFC } from '@vue/compiler-sfc'
import type { DefineComponent } from 'vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ForwardSlots: DefineComponent<{
      slots: Record<string, unknown>
    }>
  }
}

const FORWARD_SLOTS_TAG_RE =
  /<\s*forward-?slots\b([^>]*)\s*(?:\/>|>\s*<\/\s*forward-?slots\s*>)/gi

function getSlotsExpression(attributes: string) {
  const match = attributes.match(/(?:^|\s):slots\s*=\s*(?:"([^"]+)"|'([^']+)')/)

  return match?.[1] || match?.[2] || '$slots'
}

export default function forwardSlotsPlugin() {
  return {
    name: 'vite-plugin-vue-forward-slots',
    enforce: 'pre',

    transform(code: string, id: string) {
      if (!id.endsWith('.vue')) return

      const { descriptor } = parseSFC(code)
      if (!descriptor.template) return

      const template = descriptor.template.content

      const replaced = template.replace(FORWARD_SLOTS_TAG_RE, (_, attributes) => {
        const expr = getSlotsExpression(attributes || '')

        return `
<template v-for="(slot,_idx) in Object.keys(${expr})" :key="_idx" v-slot:[slot]="slotProps">
  <slot :name="slot" v-bind="slotProps"></slot>
</template>
`
      })

      if (replaced === template) return

      return code.replace(template, replaced)
    },
  }
}
