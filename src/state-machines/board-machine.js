import { Machine, assign, send } from 'xstate';

const palletesTemplate = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25]
];

const boardMachine = Machine(
  {
    id: 'board-machine',
    initial: 'idle',
    // context: {
    //   palletes: []
    // },
    states: {
      idle: {
        on: {
          CREATE_NEW_GAME: 'new_game'
        }
      },
      new_game: {
        on: {
          RENDER_BOARD: {
            target: 'ready_to_play',
            actions: ['renderBoard', 'randomizeOrder']
          }
        }
      },
      // shuffling: {
      //   on: {
      //     SHUFFLE: {
      //       target: 'ready_to_play',
      //       actions: 'randomizeOrder'
      //     }
      //   }
      // },
      ready_to_play: {
        // invoke: {
        //   id: 'runTimer',
        //   src: 'runTimer',
        //   onDone: {
        //     target: 'game_over'
        //   }
        // },
        on: {
          SHUFFLE: {
            target: 'ready_to_play',
            actions: 'randomizeOrder'
          },
          SWITCH_PALLETE: {
            target: 'ready_to_play',
            actions: ['switchPallete']
          },
          CHECKING_GAME_STATUS: {
            target: 'game_over',
            cond: 'ifPalleteOrdered'
          }
        }
      },
      game_over: {
        on: {
          DISPLAY_MOVE_REMAINS: {
            target: 'finished_game'
          }
        }
      },
      finished_game: {
        on: {
          RETRY: 'new_game'
        }
      }
    }
  }
  // {
  //   actions: {
  //     renderBoard: assign({
  //       palletes: () => {
  //         console.log('sssss');
  //         return palletesTemplate;
  //       }
  //     }),
  //     randomizeOrder: () => {},
  //     switchPallete: () => {}
  //   }
  // }
);

export default boardMachine;
