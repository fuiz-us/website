<script context="module" lang="ts">
	import type { Metadata } from '../lib';
	import BlogLayout from '$lib/BlogLayout.svelte';
	import image from './image.png';
	import studentA from './studentA.png';
	import studentB from './studentB.png';

	export let metadata: Metadata = {
		title: 'Introducing Fuiz',
		description: 'A free alternative to Kahoot with enhanced collaboration.',
		date: new Date('2024-01-30T15:00:00-04:00'),
		image,
		imageAlt: "Fuiz: Host Live Quizzes Freely",
		published: true
	};
</script>

<BlogLayout {metadata}>

We're thrilled to invite teachers to join us for **Fuiz, a free alternative to Kahoot with enhanced collaboration** developed by MIT students! This is an exciting opportunity to improve students' teamwork and small group discussions. You can explore our website and host online quizzes in class.

In addition to Kahoot's basic functionality, the **collaboration mode** incorporates special features to encourage teamwork. Options are distributed among students in a team, prompting interaction to gather all possible answers. Each team member has access to a full list of options. Teams are randomly assigned at the beginning of the game.

In the example below, Student A and Student B each receive two different screens. To explore additional options, they must communicate with another student in the same group to learn about the possible alternatives. Subsequently, they engage in a conversation with each other to collaborate on finding the answer. This approach fosters small group discussions and promotes teamwork.

<figure>
	<img src={studentA} alt="Student A" />
	<img src={studentB} alt="Student B" />
	<figcaption>Figure: Screens of two students in one team</figcaption>
</figure>

**We value your feedback!** Please share your thoughts on Fuiz through this [form](https://forms.gle/orFqr1wnhm6dv7xY7) and schedule a meeting with us! We're eager to hear from you and improve Fuiz together. We would also love to attend a class when the Fuiz is used during lecture, it will really help us to gather information about how to improve Fuiz.

**Have Questions?** Please contact us at <ins>yichen@fuiz.org</ins> for any inquiries.

This is an excellent opportunity to explore the intersection of technology and classroom teaching. **Please help us by sharing this article with anyone who may be interested**. Thank you very much!

</BlogLayout>

<style>
	figure {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;
	}

	figure img {
		flex: 1;
		width: 100%;
		min-width: 15ch;
		border: 0.15em solid;
		border-radius: 0.7em;
	}

	figcaption {
		width: 100%;
		text-align: center;
	}
</style>
