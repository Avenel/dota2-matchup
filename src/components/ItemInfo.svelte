<script lang="ts">
	import { ITEMS } from '$lib/tiDb';

	export let itemId: number;

	let itemModal: HTMLDialogElement;
	let itemModalBody: HTMLDivElement;

	let item = Object.entries(ITEMS).find((x) => x[0] == itemId?.toString() ?? '-1')?.[1];
	let itemDescription =
		(item?.language.description?.length ?? 0) > 0 ? item?.language.description[0] : '';
	itemDescription = itemDescription
		?.replaceAll('<h1>', '<h4>')
		.replaceAll('</h1>', '</h4>')
		.replaceAll('<h2>', '<h5>')
		.replaceAll('</h2>', '</h5>');
</script>

{#if itemId > 0}
	<button
		class="w-1/3"
		on:click={() => {
			itemModal.showModal();
			itemModalBody.scrollTo({ top: 0 });
		}}
	>
		<img
			alt={item?.shortName}
			src={`https://cdn.stratz.com/images/dota2/items/${item?.shortName}.png`}
		/>
	</button>

	<dialog bind:this={itemModal} class="modal modal-bottom">
		<div bind:this={itemModalBody} class="modal-box prose">
			<div class="modal-action justify-center">
				<form method="dialog">
					<h3 class="text-lg font-bold flex flex-col items-center mb-0">
						<img
							alt={item?.shortName}
							src={`https://cdn.stratz.com/images/dota2/items/${item?.shortName}.png`}
							style="height:100px; object-fit: contain;"
							class="my-0"
						/>
						<div class="flex items-center justify-center">
							<div class="text-2xl font-bold mt-2">{item?.language.displayName}</div>
						</div>
					</h3>

					<div class="flex flex-col text-center font-bold">
						{#each item?.language?.attributes ?? [] as attribute}
							<div>{attribute}</div>
						{/each}
					</div>
					<div class="text-lg mt-3 text-center">
						<div bind:innerHTML={itemDescription} contenteditable="false"></div>
					</div>

					<div class="flex mt-3 items-center justify-center">
						<button class="btn btn-sm btn-wide">Close</button>
					</div>
				</form>
			</div>
		</div>
	</dialog>
{/if}
