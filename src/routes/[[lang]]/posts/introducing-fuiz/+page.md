<script context="module" lang="ts">
	import type { Metadata } from '../lib';
	import BlogLayout from '$lib/BlogLayout.svelte';
	import image from './image.png';

	export let metadata: Metadata = {
		title: 'Introducing Fuiz',
		description: 'First post.',
		date: new Date('2023-12-06T17:00:00-04:00'),
		image,
		imageAlt: "Fuiz: Host Live Quizzes Freely",
		published: false
	};
</script>

<BlogLayout {metadata}>

## Markdown

Hey friends! 👋

</BlogLayout>
