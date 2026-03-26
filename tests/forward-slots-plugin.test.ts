import { describe, expect, it } from 'vitest'

import forwardSlotsPlugin from '../index'

function transform(code: string) {
  const plugin = forwardSlotsPlugin()
  const result = plugin.transform?.call(plugin, code, '/component.vue')

  if (!result || typeof result === 'string') {
    return result
  }

  return (result as { code: string }).code
}

describe('vite-plugin-vue-forward-slots', () => {
  it('transforms self-closing ForwardSlots tags', () => {
    const source = `<template><ForwardSlots /></template>`
    const result = transform(source)

    expect(result).toContain('v-for="(slot,_idx) in Object.keys($slots)"')
    expect(result).toContain('<slot :name="slot" v-bind="slotProps"></slot>')
  })

  it('transforms paired lowercase forwardslots tags', () => {
    const source = `<template><forwardslots></forwardslots></template>`
    const result = transform(source)

    expect(result).toContain('v-for="(slot,_idx) in Object.keys($slots)"')
    expect(result).not.toContain('<forwardslots></forwardslots>')
  })

  it('transforms paired forward-slots tags', () => {
    const source = `<template><forward-slots></forward-slots></template>`
    const result = transform(source)

    expect(result).toContain('v-for="(slot,_idx) in Object.keys($slots)"')
    expect(result).not.toContain('<forward-slots></forward-slots>')
  })

  it('uses provided :slots expression for paired tags', () => {
    const source = `<template><forwardslots :slots="resolvedSlots"></forwardslots></template>`
    const result = transform(source)

    expect(result).toContain('Object.keys(resolvedSlots)')
  })

  it('leaves templates without ForwardSlots unchanged', () => {
    const source = `<template><div>no-op</div></template>`

    expect(transform(source)).toBeUndefined()
  })

  it('ignores non-vue files', () => {
    const plugin = forwardSlotsPlugin()
    const result = plugin.transform?.call(plugin, '<ForwardSlots />', '/component.ts')

    expect(result).toBeUndefined()
  })
})
