<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Live } from '$lib/dota2Api';
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

<div class="mx-auto prose">
	<div class="card bg-base-100 w-100 shadow-xl">
		<div class="card-body">
			{#if data.matches.length > 0}
				<div class="overflow-x-auto">
					<table class="table">
						<thead>
							<tr>
								<th>Duration</th>
								<th>Radiant</th>
								<th>Dire</th>
								<th>Score</th>
							</tr>
						</thead>
						<tbody>
							{#each data.matches as match}
								<tr
									class="hover"
									on:click={() => {
										matchSelected = match;
										matchModal.showModal();
									}}
								>
									<th>{formatGameTime(match.game_time ?? 0)}</th>
									<td>{match.team_name_radiant}</td>
									<td>{match.team_name_dire}</td>
									<td>{match.radiant_score} : {match.dire_score}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Open the modal using ID.showModal() method -->
<dialog bind:this={matchModal} id="matchModal" class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		{#if matchSelected}
			<div class="prose">
				<h4 class=" text-center">
					{matchSelected.team_name_radiant} : {matchSelected.team_name_dire}
				</h4>
				<h2 class="font-bold text-center">
					{matchSelected.radiant_score} : {matchSelected.dire_score}
				</h2>
				{matchSelected.match_id}
				<div class="flex" style="justify-content: center;">
					<button
						class="btn btn-sm btn-primary btn-wide"
						on:click={() => {
							goto('/matches/' + matchSelected.match_id);
						}}>Details</button
					>
				</div>

				<div class="flex">
					<table class="table">
						<tbody>
							{#each matchSelected.players.filter((x) => x.team === 0) as player}
								<Player {player}></Player>
							{/each}
						</tbody>
					</table>

					<table class="table">
						<tbody>
							{#each matchSelected.players.filter((x) => x.team === 1) as player}
								<Player {player}></Player>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}

		<div class="w-100">
			<form method="dialog">
				<div class="flex" style="justify-content: center;">
					<button class="btn btn-sm btn-wide">Close</button>
				</div>
			</form>
		</div>
	</div>
</dialog>
