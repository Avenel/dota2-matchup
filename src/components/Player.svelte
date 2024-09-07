<script lang="ts">
	import { HEROES, HEROES_STATS } from '$lib/tiDb';
	import type { Player } from '$lib/dota2Api';

	export let player: Player;
	export let rtl: boolean;

	let hero = HEROES.find((x) => x.id === player.hero_id);
	let heroStats = HEROES_STATS.find((x) => x.id === player.hero_id);

	let heroIcon = (heroStats: any) => 'https://cdn.cloudflare.steamstatic.com' + heroStats?.icon;
	let heroImage = (heroStats: any) => 'https://cdn.cloudflare.steamstatic.com' + heroStats?.img;

	let heroModal: HTMLDialogElement;
</script>

<tr>
	<td>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="flex flex-col" on:click={() => heroModal.showModal()}>
			<div class="flex items-center {rtl ? 'flex-row-reverse' : 'flex-row'}">
				<img
					alt={hero?.name}
					src={heroIcon(heroStats)}
					height="30px"
					style="height:30px;"
					class="my-0"
				/>
				<div class="text-base truncate mx-2" style="max-width: 75%;">{player.name}</div>
			</div>
		</div>
	</td>
</tr>

<dialog bind:this={heroModal} class="modal modal-bottom">
	<div class="modal-box">
		<h3 class="text-lg font-bold flex flex-col items-center">
			<div class="flex">
				<img
					alt={hero?.name}
					src={heroIcon(heroStats)}
					height="30px"
					style="height:30px;"
					class="my-0 mr-2"
				/>
				<div class="text-2xl font-bold mb-2">{hero?.localized_name}</div>
			</div>
			<img
				alt={hero?.name}
				src={heroImage(heroStats)}
				height="100px"
				style="height:100px; object-fit: contain;"
				class="my-0 mr-2"
			/>
		</h3>

		<div class="modal-action justify-center">
			<form method="dialog">
				<button class="btn btn-wide">Close</button>
			</form>
		</div>
	</div>
</dialog>
