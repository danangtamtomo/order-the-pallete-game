<script>
  import { quadOut } from "svelte/easing";
  import { flip } from "svelte/animate";
  import { crossfade } from "svelte/transition";

  const { state, send } = $$props;

  $: palletes = $state.context.palletes;

  let originNode = {
    event: {},
    dim1: 0,
    dim2: 0
  };

  function onDrop(ev, dim1, dim2) {
    ev.preventDefault();
    if (ev.toElement.innerHTML === "") {
      const target = ev.target.id.split("-")[1];
      const origin = originNode.event.target.id.split("-")[1];
      send("SWITCH_PALLETE", {
        origin: { dim1: originNode.dim1, dim2: originNode.dim2 },
        target: { dim1, dim2 }
      });
    }
    originNode.event.srcElement.classList.remove("pallete__item--no-content");
    ev.srcElement.style.zIndex = 1;
  }

  function onDragStart(ev, dim1, dim2) {
    ev.srcElement.style.zIndex = 10;
    originNode = {
      event: ev,
      dim1,
      dim2
    };
  }

  function onDragOver(ev, dim1, dim2) {
    ev.preventDefault();
    originNode.event.srcElement.classList.add("pallete__item--no-content");
  }

  const [sending, receive] = crossfade({
    duration: d => Math.sqrt(d * 300),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;

      return {
        duration: 300,
        easing: quadOut,
        css: t => `
					transform: ${transform} scale(${t});
				`
      };
    }
  });

  $: isReadyToPlay = $state.matches("ready_to_play")
    ? "1px solid sandybrown"
    : "none";
</script>

<style>
  .board-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .board {
    border: var(--border);
    width: 500px;
  }

  .pallete {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .pallete .pallete__item {
    width: 100px;
    height: 100px;
    background: #46b3e6;
    border: 1px solid #4d80e4;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 800;
  }

  .pallete .pallete__item.pallete__item--no-content {
    background: white;
    border: 1px solid #fff;
    color: white;
  }
</style>

<div class="board-container">
  <div class="board" style="--border:{isReadyToPlay}">
    {#each palletes as palleteCol, i}
      <div class="pallete">
        {#each palleteCol as pallete, idx (pallete)}
          <div
            id={`pal-${pallete}`}
            class="pallete__item"
            in:receive={{ key: `pal-${pallete}` }}
            out:sending={{ key: `pal-${pallete}` }}
            animate:flip={{ delay: 0, duration: 300, easing: quadOut }}
            draggable="true"
            class:pallete__item--no-content={!pallete}
            on:dragover={ev => onDragOver(ev, i, idx)}
            on:dragstart={ev => onDragStart(ev, i, idx)}
            on:drop={e => onDrop(e, i, idx)}>
            {pallete}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>
