import weedux, { middleware } from 'weedux';

export const initialState = {
  servers: {
    games: [],
    loading: true,
    error: ""
  },
  search: {
    terms: "",
    noPassOnly: false,
    userVerificationMode: "show"
  }
};


const reducers = [
  (s, a) => {
    var newState = { ...s };

    switch(a.type){
      case "GAMES_START":
      case "DETAILS_START":
        newState.servers.loading = true;
        break;

      case "GAMES_COMPLETE":
        newState.servers.games = a.payload;
        newState.servers.loading = false;
        break;

      case "DETAILS_COMPLETE":
        newState.servers.games[a.index].details = a.payload
        newState.servers.loading = false;
        break;

      case "GAMES_FAIL":
      case "DETAILS_FAIL":
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
const dispatch = store.dispatcher().bind(store);
export const actions = {
  games: () => dispatch((d) => {
    d({ type: "GAMES_START" });

    fetch(`${process.env.REACT_APP_API_SERVER_HOST}/api/v1/games`)
      .then(r => r.json())
      .then((p) => d({ type: "GAMES_COMPLETE", payload: p}))
      .catch((e) => d({ type: "GAMES_FAIL", payload: e }));
  }),
  details: (gameId, index) => dispatch((d) => {
    d({ type: "DETAILS_START" });

    fetch(`${process.env.REACT_APP_API_SERVER_HOST}/api/v1/details?gameId=${gameId}`)
      .then(r => r.json())
      .then((p) => d({ type: "DETAILS_COMPLETE", gameId, index, payload: p }))
      .catch(() => d({ type: "DETAILS_FAIL" }));
  })
}


export default store;
