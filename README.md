# vite-plugin-vue-forward-slots

A tiny Vite plugin that transforms `<ForwardSlots />` into native Vue slot-forwarding template syntax.

## Why this exists

There are many `ForwardSlots` component implementations, but in real projects we kept hitting reactivity and edge-case issues that were hard to fully solve in a runtime component.

This plugin avoids that class of problems by compiling `ForwardSlots` usage directly into native Vue template syntax at build time.

## Install

```bash
bun install vite-plugin-vue-forward-slots
```

## Usage

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import forwardSlotsPlugin from 'vite-plugin-vue-forward-slots'

export default defineConfig({
  plugins: [forwardSlotsPlugin(), vue()],
})
```

## Supported syntax

Both forms are supported:

```vue
<ForwardSlots />
<forward-slots></forward-slots>
```

You can also forward from a custom slots object:

```vue
<ForwardSlots :slots="resolvedSlots" />
```

## Transform example

Input:

```vue
<template>
  <ForwardSlots :slots="resolvedSlots" />
</template>
```

Output:

```vue
<template>
  <template v-for="(slot,_idx) in Object.keys(resolvedSlots)" :key="_idx" v-slot:[slot]="slotProps">
	<slot :name="slot" v-bind="slotProps"></slot>
  </template>
</template>
```

## Development

```bash
bun install
bun test
bun run build
```

## Publish checklist

```bash
bun test
bun run build
```
