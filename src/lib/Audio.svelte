<script lang="ts">
	interface Props {
		audioUrl: string;
		volumeOn: boolean;
	}

	let { audioUrl, volumeOn }: Props = $props();
</script>

<audio autoplay loop muted={!volumeOn} src={audioUrl}></audio>

<style>
	audio {
		display: none;
	}
</style>
