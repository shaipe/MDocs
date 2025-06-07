<template>
    <div v-if="!page?.body" class="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <h3 class="scroll-m-20 border-r px-4 py-3 text-2xl font-semibold">404</h3>
        <span class="scroll-m-20 px-4"> This page could not be found. </span>
    </div>

    <template v-else>
        <div v-if="page?.fullpage" class="px-4 py-6 md:px-8" :class="[config.main.padded && 'container']">
            <ContentRenderer :key="page._id" :value="page" :data="(appConfig.shadcnDocs as any)?.data" />
        </div>
        <main
            v-else
            class="relative py-6"
            :class="[config.toc.enable && (page.toc ?? true) && 'lg:grid lg:grid-cols-[1fr_220px] lg:gap-14 lg:py-8']">
            <div class="mx-auto w-full min-w-0">
                <LayoutBreadcrumb
                    v-if="page?.body && config.main.breadCrumb && (page.breadcrumb ?? true)"
                    class="mb-4" />
                <LayoutTitle
                    v-if="config.main.showTitle"
                    :title="page?.title"
                    :description="page?.description"
                    :badges="page?.badges"
                    :authors="page?.authors" />

                <Alert v-if="page?.body?.children?.length === 0" title="Empty Page" icon="lucide:circle-x">
                    Start writing in <ProseCodeInline>content/{{ page?._file }}</ProseCodeInline> to see this page
                    taking shape.
                </Alert>

                <ContentRenderer
                    v-else
                    :key="page._id"
                    :value="page"
                    :data="(appConfig.shadcnDocs as any)?.data"
                    class="docs-content" />

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
import { documentApi } from '@/app/api';
import { parseMarkdown } from '@nuxtjs/mdc/runtime';
import { isArray } from '@htui/utils';

const slug = isArray(useRoute().params.slug) ? useRoute().params.slug.join('/') : useRoute().params.slug;

const { page: page_content } = useContent();
const config = useConfig();
const appConfig = useAppConfig();
// 用 shallowRef 包裹 page
const page = shallowRef({});
const loading = ref(true);

console.log(page_content.value);

// defineOgImageComponent(config.value.site.ogImageComponent, {
//     title: page.value?.title,
//     description: page.value?.description,
// });

const loaded = () => {
    useSeoMeta({
        title: `${page.value?.title ?? '404'} - ${config.value.site.name}`,
        ogTitle: page.value?.title,
        description: page.value?.description,
        ogDescription: page.value?.description,
        twitterCard: 'summary_large_image',
    });
};

onMounted(() => {
    if (slug.startsWith('_')) {
        return;
    }
    documentApi.getContent(slug).then((res) => {
        // page.value = res;

        console.log(slug, res);

        try {
            parseMarkdown(res, {
                highlight: false,
            }).then((d) => {
                page.value = {
                    ...d.data,
                    body: { ...d.body, toc: d.toc },
                    _id: Date.now(),
                };

                console.log(page.value);
                loading.value = false;

                loaded();
            });
        } catch (e) {
            // console.error(e);
        }
    });
});
</script>
