<script lang="ts">
	import { HEROES, HEROES_STATS } from '$lib/tiDb';
	import type { PlayerDetail } from '$lib/dota2Api';

	export let player: PlayerDetail;

	let hero = HEROES.find((x) => x.id === player.hero_id);
	let heroStats = HEROES_STATS.find((x) => x.id === player.hero_id);
	let heroIcon = 'https://cdn.cloudflare.steamstatic.com' + heroStats?.img;
</script>

<tr>
	<td>
		<div class="flex flex-col">
			<img alt={hero?.name} src={heroIcon} height="30px" class="flex-1" />
			<strong>{player.name}</strong>
		</div>
	</td>
</tr>
