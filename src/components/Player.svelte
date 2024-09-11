<script lang="ts">
	import {
		HEROES,
		HEROES_ABILITIES_INFO,
		HEROES_SHORT_INFO,
		HEROES_STATS,
		type HeroAbilitiesInfo
	} from '$lib/tiDb';
	import type { LivePlayerInfo } from '$lib/stratzApi';

	export let playerLiveInfo: LivePlayerInfo;
	export let rtl: boolean;

	let hero = HEROES.find((x) => x.id === playerLiveInfo.heroId);
	let heroStats = HEROES_STATS.find((x) => x.id === playerLiveInfo.heroId);
	let heroInfo = (name: string) => Object.entries(HEROES_SHORT_INFO).find((x) => x[0] == name)?.[1];
	let heroAbilitiesInfo = (name: string) =>
		Object.entries(HEROES_ABILITIES_INFO).find((x) => x[0] == name)?.[1] as HeroAbilitiesInfo;

	let heroIcon = (heroStats: any) => 'https://cdn.cloudflare.steamstatic.com' + heroStats?.icon;
	let heroImage = (heroStats: any) => 'https://cdn.cloudflare.steamstatic.com' + heroStats?.img;

	let heroModal: HTMLDialogElement;
	let heroModalBody: HTMLDivElement;
</script>

<tr>
	<td>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="flex flex-col"
			on:click={() => {
				heroModal.showModal();
				heroModalBody.scrollTo({ top: 0 });
			}}
		>
			<div class="flex items-center {rtl ? 'flex-row-reverse' : 'flex-row'}">
				<img
					alt={hero?.name}
					src={heroIcon(heroStats)}
					height="30px"
					style="height:30px;"
					class="my-0"
				/>
				<div class="text-base truncate mx-2" style="max-width: 75%;">
					{playerLiveInfo.name ?? playerLiveInfo.steamAccount?.name}
				</div>
			</div>
			<div class="flex items-center {rtl ? 'flex-row-reverse' : 'flex-row'} mt-1">
				<div class="badge badge-ghost font-bold">
					<span class="mx-1">{playerLiveInfo?.numKills}</span> /
					<span class="mx-1">{playerLiveInfo?.numDeaths}</span>
					/ <span class="mx-1">{playerLiveInfo?.numAssists}</span>
				</div>
			</div>
		</div>
	</td>
</tr>

<dialog bind:this={heroModal} class="modal modal-bottom">
	<div bind:this={heroModalBody} class="modal-box prose">
		{#if hero}
			<h3 class="text-lg font-bold flex flex-col items-center mb-0">
				<img
					alt={hero.name}
					src={heroImage(heroStats)}
					height="100px"
					style="height:100px; object-fit: contain;"
					class="my-0"
				/>
				<div class="flex items-center justify-center">
					<img
						alt={hero.name}
						src={heroIcon(heroStats)}
						height="30px"
						style="height:30px;"
						class="my-0"
					/>
					<div class="text-2xl font-bold mt-2">{hero.localized_name}</div>
				</div>
			</h3>

			<div class="text-center font-bold">
				{heroInfo(hero.localized_name)?.attack_type} | {heroInfo(hero.localized_name)
					?.primary_attribute} | {heroInfo(hero.localized_name)?.role}
			</div>
			<div class="text-lg mt-3 text-center">{heroInfo(hero.localized_name)?.strengths}</div>

			<table class="my-2">
				<thead>
					<th></th>
					<th></th>
				</thead>
				<tbody>
					{#if heroAbilitiesInfo(hero.localized_name)}
						{#each Object.keys(heroAbilitiesInfo(hero.localized_name).abilities) as ability}
							<tr>
								<td class="font-bold">{ability}</td>
								<td>{heroAbilitiesInfo(hero.localized_name).abilities[ability]}</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>

			<div class="modal-action justify-center">
				<form method="dialog">
					<button class="btn btn-sm btn-wide">Close</button>
				</form>
			</div>
		{/if}
	</div>
</dialog>
