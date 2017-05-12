import weedux, { middleware } from 'weedux';
import { event, error } from './ga.js';

export const initialState = {
  servers: {
    gamesRefreshCount: 0,
    games: [],
    details: {},
    loading: true,
    error: ""
  },
  search: {
    terms: "",
    noPassOnly: false,
    userVerificationMode: "show"
  }
};

function initActions(dispatch){
  return {
    games: () => dispatch((d) => {
      d({ type: "GAMES_START" });

      fetch(`${process.env.REACT_APP_API_SERVER_HOST}/api/v1/games`)
        .then(r => r.json())
        .then((p) => d({ type: "GAMES_COMPLETE", payload: p}))
        .catch((e) => d({ type: "GAMES_FAIL", error: e }));
    }),
    details: (gameId, index) => dispatch((d) => {
      d({ type: "DETAILS_START" });

      fetch(`${process.env.REACT_APP_API_SERVER_HOST}/api/v1/details?gameId=${gameId}`)
        .then(r => r.json())
        .then((p) => d({ type: "DETAILS_COMPLETE", gameId, payload: p }))
        .catch((e) => d({ type: "DETAILS_FAIL", gameId, error: e }));
    })
  }
}

const reducers = [
  (s, a) => {
    const newState = { ...s };

    switch(a.type){
      case "GAMES_START":
        newState.servers.loading = true;
        break;

      case "DETAILS_START":
        newState.servers.details[a.gameId] = { loading: true };
        break;

      case "GAMES_COMPLETE":
        event({
          category: "API Call",
          action: "Loaded Games",
          label: "API returned " + a.payload.length + " games.",
          value: newState.servers.gamesRefreshCount + 1
        });
        newState.servers.gamesRefreshCount++;
        newState.servers.games = a.payload;
        newState.servers.loading = false;
        break;

      case "DETAILS_COMPLETE":
        newState.servers.details[a.gameId] = { ...a.payload, loading: false };
        break;

      case "GAMES_FAIL":
        error("Could not load games: " + a.error, true);
        newState.servers.loading = false;
        newState.servers.error = "woops.jpg";
        break;

      case "DETAILS_FAIL":
        error("Could not load game details for game " + a.gameId + " :" + a.error, true);
        newState.servers.loading = false;
        newState.servers.error = "woops.jpg";
        break;

      default:
        return newState;
    }

    return newState;
  }
];

const store = new weedux( initialState, reducers, [middleware.thunk]);

export const actions = initActions(store.dispatcher().bind(store));
export default store;
