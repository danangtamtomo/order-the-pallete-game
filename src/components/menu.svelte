<script>
  import { useMachine } from "svelte-xstate";
  import boardMachine from "../state-machines/board-machine";

  const { send } = $$props;
  const menus = ["Play", "Retry"];
</script>

<div>
  <ul>
    {#each menus as menu}
      <li>
        <button on:click={() => send('CREATE_NEW_GAME')}>{menu}</button>
      </li>
    {/each}
  </ul>
  <button on:click={() => send('SHUFFLE')}>Shuffle</button>
</div>
