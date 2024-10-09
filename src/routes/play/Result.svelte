<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import NiceBackground from '$lib/NiceBackground.svelte';
	import correct_penguin from '$lib/assets/correct_penguin.svg';
	import wrong_penguin from '$lib/assets/wrong_penguin.svg';
	import Topbar from './Topbar.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		class ConfettiParticle {
			x: number;
			y: number;
			r: number;
			d: number;
			color: string;
			tilt: number;
			tiltAngleIncremental: number;
			tiltAngle: number;

			constructor() {
				this.x = Math.random() * W; // x
				this.y = Math.random() * H - H; // y
				this.r = randomFromTo(11, 33); // radius
				this.d = Math.random() * maxConfettis + 11;
				this.color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
				this.tilt = Math.floor(Math.random() * 33) - 11;
				this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
				this.tiltAngle = 0;
			}

			draw(context: CanvasRenderingContext2D) {
				context.beginPath();
				context.lineWidth = this.r / 2;
				context.strokeStyle = this.color;
				context.moveTo(this.x + this.tilt + this.r / 3, this.y);
				context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
				return context.stroke();
			}
		}

		function getSize(canvas: HTMLCanvasElement) {
			canvas.width = 0;
			canvas.height = 0;
			const confettiContainer = document.querySelector('#confetti-container');
			return {
				width: confettiContainer?.clientWidth ?? window.innerWidth,
				height: confettiContainer?.clientHeight ?? window.innerHeight
			};
		}

		const canvas = document.getElementById('confetti') as HTMLCanvasElement | null;
		if (!canvas) return;

		let { width: W, height: H } = getSize(canvas);

		const context = canvas.getContext('2d');
		if (!context) return;

		const maxConfettis = 150;
		const particles: ConfettiParticle[] = [];

		const possibleColors = [
			'DodgerBlue',
			'OliveDrab',
			'Gold',
			'Pink',
			'SlateBlue',
			'LightBlue',
			'Gold',
			'Violet',
			'PaleGreen',
			'SteelBlue',
			'SandyBrown',
			'Chocolate',
			'Crimson'
		];

		function randomFromTo(from: number, to: number) {
			return Math.floor(Math.random() * (to - from + 1) + from);
		}

		function drawParticles(context: CanvasRenderingContext2D) {
			const results = [];

			// Magical recursive functional love
			requestAnimationFrame(() => drawParticles(context));

			context.clearRect(0, 0, W, window.innerHeight);

			for (const particle of particles) {
				results.push(particle.draw(context));
			}

			for (const [i, particle] of particles.entries()) {
				particle.tiltAngle += particle.tiltAngleIncremental;
				particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
				particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

				if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
					particle.x = Math.random() * W;
					particle.y = -30;
					particle.tilt = Math.floor(Math.random() * 10) - 20;
				}
			}

			return results;
		}

		window.addEventListener(
			'resize',
			() => {
				const size = getSize(canvas);
				canvas.width = W = size.width;
				canvas.height = H = size.height;
			},
			{
				capture: false
			}
		);

		// Push new confetti objects to `particles[]`
		for (let i = 0; i < maxConfettis; i++) {
			particles.push(new ConfettiParticle());
		}

		// Initialize
		canvas.width = W;
		canvas.height = H;
		drawParticles(context);
	});

	export let name: string;
	export let score: number;
	export let correct: boolean;
</script>

<div style:height="100%" style:display="flex" style:flex-direction="column">
	<Topbar {name} {score} />
	<div style:flex="1" id="confetti-container">
		<NiceBackground>
			<div
				style:height="100%"
				style:display="flex"
				style:justify-content="center"
				style:align-items="center"
			>
				<div style:display="flex" style:flex-direction="column" style:align-items="center">
					<img
						style:width="10em"
						src={correct ? correct_penguin : wrong_penguin}
						alt={correct ? m.penguin_checkmark() : m.penguin_crossmark()}
					/>
					<div style:font-weight="bold" style:max-width="10ch" style:text-align="center">
						{#if correct}
							{m.thats_correct()}
							<canvas id="confetti" />
						{:else}
							{m.try_again()}
						{/if}
					</div>
				</div>
			</div>
		</NiceBackground>
	</div>
</div>

<style>
	#confetti {
		overflow-y: hidden;
		overflow-x: hidden;
		width: 100%;
		margin: 0;
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
