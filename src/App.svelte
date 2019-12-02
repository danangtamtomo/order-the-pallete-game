<script>
  import { afterUpdate } from "svelte";
  import { assign, interpret } from "xstate";
  import { useMachine } from "svelte-xstate";
  import Menu from "./components/menu.svelte";
  import Board from "./components/board.svelte";
  import boardMachine from "./state-machines/board-machine";

  const palletesTemplate = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20],
    [21, 22, 23, 24, ""]
  ];

  let [state, send] = useMachine(
    boardMachine
      .withConfig({
        actions: {
          renderBoard: assign({
            palletes: () => {
              return palletesTemplate;
            }
          }),
          randomizeOrder: assign({
            palletes: ({ palletes }) => {
              const flattener = arr =>
                arr.reduce((acc, x) => {
                  if (Array.isArray(x)) {
                    return [...acc, ...flattener(x)];
                  }
                  return [...acc, x];
                }, []);

              const randomizeOrder = flattener(palletes).sort(
                () => Math.random() - 0.5
              );

              const result = palletes.reduce((acc, coll, idx) => {
                idx += 1;
                return [...acc, randomizeOrder.slice(idx * 5 - 5, idx * 5)];
              }, []);

              return result;
            }
          }),
          switchPallete: assign({
            palletes: ({ palletes }, { origin, target }) => {
              const pall = [...palletes];
              const to = pall[target.dim1][target.dim2];
              pall[target.dim1][target.dim2] = pall[origin.dim1][origin.dim2];
              pall[origin.dim1][origin.dim2] = to;

              return pall;
            }
          })
        }
      })
      .withContext({ palletes: [] })
  );

  afterUpdate(() => {
    if ($state.matches("new_game")) {
      send("RENDER_BOARD");
    }
  });
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <Menu {send} />
  <Board {send} {state} />
</main>
