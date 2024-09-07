<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Live } from '$lib/dota2Api';
	import { TI_TEAMS } from '$lib/tiDb';
	import MatchInfo from '../components/MatchInfo.svelte';
	import Player from '../components/Player.svelte';

	export let data;

	let matchModal: HTMLDialogElement;
	let matchSelected: Live;

	const formatGameTime = (gameTime: number) => {
		const minutes = Math.floor(gameTime / 60);
		const seconds = gameTime % 60;

		return `${minutes}:${seconds} min`;
	};
</script>

<div class="mx-auto">
	{#if data.matches.length > 0}
		{#each data.matches as match}
			<MatchInfo matchSelected={match}></MatchInfo>
		{/each}
	{/if}
</div>

<!-- Open the modal using ID.showModal() method -->
<dialog bind:this={matchModal} id="matchModal" class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<div class="w-100">
			<form method="dialog">
				<div class="flex" style="justify-content: center;">
					<button class="btn btn-sm btn-wide">Close</button>
				</div>
			</form>
		</div>
	</div>
</dialog>
