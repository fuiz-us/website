<script lang="ts">
	interface Props {
		audioUrl: string;
		volumeOn: boolean;
	}

	let { audioUrl, volumeOn }: Props = $props();
</script>

<audio autoplay loop src={audioUrl} volume={volumeOn ? 1 : 0}></audio>

<style>
	audio {
		display: none;
	}
</style>
