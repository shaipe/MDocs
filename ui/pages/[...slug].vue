<template>
  <div
    v-if="!page?.body"
    class="flex h-[calc(100vh-3.5rem)] items-center justify-center"
  >
    <h3 class="scroll-m-20 border-r px-4 py-3 text-2xl font-semibold">
      404
    </h3>
    <span class="scroll-m-20 px-4">
      This page could not be found.
    </span>
  </div>

  <template v-else>
    <div
      v-if="page?.fullpage"
      class="px-4 py-6 md:px-8"
      :class="[config.main.padded && 'container']"
    >
      <ContentRenderer
        :key="page._id"
        :value="page"
        :data="(appConfig.shadcnDocs as any)?.data"
      />
    </div>
    <main
      v-else
      class="relative py-6"
      :class="[config.toc.enable && (page.toc ?? true) && 'lg:grid lg:grid-cols-[1fr_220px] lg:gap-14 lg:py-8']"
    >
      <div class="mx-auto w-full min-w-0">
        <LayoutBreadcrumb v-if="page?.body && config.main.breadCrumb && (page.breadcrumb ?? true)" class="mb-4" />
        <LayoutTitle
          v-if="config.main.showTitle"
          :title="page?.title"
          :description="page?.description"
          :badges="page?.badges"
          :authors="page?.authors"
        />

        <Alert
          v-if="page?.body?.children?.length === 0"
          title="Empty Page"
          icon="lucide:circle-x"
        >
          Start writing in <ProseCodeInline>content/{{ page?._file }}</ProseCodeInline> to see this page taking shape.
        </Alert>

        <ContentRenderer
          v-else
          :key="page._id"
          :value="page"
          :data="(appConfig.shadcnDocs as any)?.data"
          class="docs-content"
        />

        <LayoutDocsFooter />
      </div>
      <div v-if="config.toc.enable && (page.toc ?? true)" class="hidden text-sm lg:block">
        <div class="sticky top-[90px] h-[calc(100vh-3.5rem)] overflow-hidden">
          <LayoutToc :is-small="false" />
        </div>
      </div>
    </main>
  </template>
</template>

<script setup lang="ts">
const { page } = useContent();
const config = useConfig();
const appConfig = useAppConfig();
console.log(page.value);
// console.log(config.value);

// import mdText from '@/www/content/index.md';

// const slug = useRoute().params.slug
import { parseMarkdown } from '@nuxtjs/mdc/runtime'

const mdText = `---
title: Introduction
description: shadcn-docs-nuxt is a Nuxt documentation template built with Nuxt Content and shadcn-vue.
icon: 'lucide:info'
---

## Motivations

**shadcn-docs-nuxt** is created as a free alternative documentation solution to [Docus](https://docus.dev/) and [Nuxt UI Pro Docs](https://docs-template.nuxt.dev/).

## Features

- Free and [open source](https://github.com/ZTL-UwU/shadcn-docs-nuxt).
- Fully [customizable](/api/configuration).
- Rich [components](/components/prose) to work with.
- Mobile support.
- Indexed searching powered by Nuxt Content.
- Partial component compatibility with .

## Credits

- [Nuxt Content](https://content.nuxt.com/): Content made easy for Vue Developers.
- [shadcn-ui](https://ui.shadcn.com/): For the beautiful component & docs design.
- [shadcn-vue](https://www.shadcn-vue.com/): For the vue port of shadcn-ui & some docs component source.
- [Docus](https://docus.dev/): For inspiration & some docs component source.
- [Nuxt UI Pro Docs](https://docs-template.nuxt.dev/): For inspiration.

## Who's Using

- [unovue/inspira-ui](https://github.com/unovue/inspira-ui) 3.1K ⭐️
- [unjs/magic-regexp](https://github.com/unjs/magic-regexp) 4K ⭐️
- [nuxt-monaco-editor](https://github.com/e-chan1007/nuxt-monaco-editor)
- [nuxt-umami](https://github.com/ijkml/nuxt-umami)
- [Msty](https://docs.msty.app/getting-started/onboarding)
- [Archiver](https://github.com/Ast3risk-ops/archiver)
- [ePoc](https://epoc.inria.fr/en)
- [Add your project 🚀](https://github.com/ZTL-UwU/shadcn-docs-nuxt/edit/main/README.md)

## License

[MIT](https://github.com/ZTL-UwU/shadcn-docs-nuxt/blob/main/LICENSE)

`;

const { data: ast } = await useAsyncData('markdown', () => parseMarkdown(mdText))
console.log(ast.value);

useSeoMeta({
  title: `${page.value?.title ?? '404'} - ${config.value.site.name}`,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description,
  twitterCard: 'summary_large_image',
});

defineOgImageComponent(config.value.site.ogImageComponent, {
  title: page.value?.title,
  description: page.value?.description,
});
</script>
