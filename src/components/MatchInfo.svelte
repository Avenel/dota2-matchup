<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Live, Match } from '$lib/dota2Api';
	import { TI_TEAMS } from '$lib/tiDb';
	import Player from './Player.svelte';

	export let matchSelected: Live;
</script>

<div class="card bg-base-100 min-w-full lg:min-w-80 shadow-xl my-2">
	<div class="card-body">
		<div class="flex flex-row items-center text-center bg-content">
			<div class="flex flex-col w-1/4 bg-content text-content items-center">
				<div class="avatar">
					<div class="rounded-xl bg-base-300 p-1">
						<img
							alt={matchSelected.team_name_radiant}
							src={TI_TEAMS.find((x) => x.team_id == matchSelected.team_id_radiant)?.logo_url}
							class="my-0"
							style="object-fit:contain; width: 50px;"
						/>
					</div>
				</div>
				<div class="font-bold text-xl">
					{TI_TEAMS.find((x) => x.team_id == matchSelected.team_id_radiant)?.tag}
				</div>
				<div class="text-xs">
					{TI_TEAMS.find((x) => x.team_id == matchSelected.team_id_radiant)?.name}
				</div>
			</div>
			<div class="flex-1">
				<div class="font-bold text-center text-3xl bg-content text-content">
					{matchSelected.radiant_score} : {matchSelected.dire_score}
				</div>
			</div>
			<div class="flex flex-col w-1/4 bg-content text-content items-center">
				<div class="avatar">
					<div class="rounded-xl bg-base-300 p-1">
						<img
							alt={matchSelected.team_name_dire}
							src={TI_TEAMS.find((x) => x.team_id == matchSelected.team_id_dire)?.logo_url}
							class="my-0"
							style="object-fit:contain; width: 50px;"
						/>
					</div>
				</div>
				<div class="font-bold text-xl">
					{TI_TEAMS.find((x) => x.team_id == matchSelected.team_id_dire)?.tag}
				</div>
				<div class="text-xs">
					{TI_TEAMS.find((x) => x.team_id == matchSelected.team_id_dire)?.name}
				</div>
			</div>
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

		<div class="flex my-3" style="justify-content: center;">
			<button
				class="btn btn-sm btn-primary btn-wide"
				on:click={() => {
					goto('/matches/' + matchSelected.match_id);
				}}>Details</button
			>
		</div>
	</div>
</div>
