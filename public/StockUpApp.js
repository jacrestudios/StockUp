( _ => {
	var IO = {
		init: _ => {
			//@IO.socket Socket --Sockets.io library on client-side will be accessed with 'io' namespace
			IO.socket = io.connect();
			IO.bindSocketListeners();
		},
		bindSocketListeners: _ => {
			IO.socket.on("connected", IO.onConnected)
		},
		onConnected: data => App.onConnected(data),
		
	};
	 var App = {
	 	//@role String --Used to run different functions depending on incoming broadcasts
		role: '',
		onConnected: data => {},
		Host: {
			player_count: 0,
			transactions: [],
			cards: [],
			stocks: [],
			player_statuses: [],
			game_start: false,
			turn: 0,
		},
		Player: {
			//@leader Boolean --Used to provide a "start up" button to the first joined player
			leader: false,
			name: '',
			networth: '',
			stocks: [],
			cards: [],
			ready: false,
		},
		Display: {
			
		},
	};
	IO.init();
})();

