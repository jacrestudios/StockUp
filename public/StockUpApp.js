( _ => {
	var IO = {
		init: _ => {
			//@IO.socket Socket --Sockets.io library on client-side will be accessed with 'io' namespace
			IO.socket = io.connect();
			IO.bindSocketListeners();
		},
		bindSocketListeners: _ => {
			IO.socket.on("connected", IO.onConnected);
			IO.socket.on("createdGame", IO.onCreatedGame);
			IO.socket.on("joinedRoom", IO.onJoinedGame);
			IO.socket.on("roomNotFound", IO.onRoomNotFound);
			IO.socket.on("startedGame", IO.onStartedGame);
			
		},
		onConnected: data => App.onConnected(data),
		onCreatedGame: data => App.Host.onCreatedGame(data),
		onJoinedRoom: data => App.Player.onJoinedGame(data),
		onRoomNotFound: _ => App.Player.roomNotFound(),
		onStartedGame: _ => {
			if(App.role === 'host'){App.Host.onStartedGame()}
			if(App.role === 'player'){App.Player.onStartedGame()}
		}
	};
	 var App = {
	 	//@role String --Used to run different functions depending on incoming broadcasts
		role: '',
		onConnected: data => {},
		//@createGame Function --sends createGame to server which responds with a room id
		createGame: _ => {
			IO.socket.emit("createGame");
			App.role = 'host';
		},
		//@joinGame Function --displays new input screen for room id
		joinGame: _ => {
			App.Display.renderTemplate('playerjoin');
			App.role = 'player';
		},
		Host: {
			//@room String --Holds room id for broadcast events
			room: '',
			//@player_count Integer --Incremented for every player joined, used to track start conditions
			player_count: 0,
			//@transactions Object Array --Holds summarized transactions from each player to show total volume for a market turn
			transactions: [],
			//@cards Object Array --Holds cards played by players to resolve at end of card turn
			cards: [],
			//@stocks Object Array --Holds information about stock price and effects of stocks
			stocks: [],
			//@player_status Object Array --Holds player end turn status information
			player_statuses: [],
			//@game_start Boolean --Flag to prevent new game creation or ongoing game joining
			game_start: false,
			//@turn Integer --Turn tracker for seasonality and game end conditions
			turn: 0,
			onCreatedGame: data => {
				App.Host.room = data.room
				App.Display.renderTemplate('hostwait')
			},
			
			
		},
		Player: {
			//@leader Boolean --Used to provide a "start up" button to the first joined player
			leader: false,
			name: '',
			networth: '',
			stocks: [],
			cards: [],
			ready: false,
			//@joinRoom Function --Sends a room id to attempt to join
			joinRoom: room_id => IO.socket.emit('joinGame', {room: room_id}),
			startGame: _ => IO.socket.emit('startGame'),
			//@onJoinedRoom Function --If room exists, then display waiting screen until game start
			onJoinedRoom: data => {App.Display.renderTemplate('playerwait')},
			onRoomNotFound: _ => {},
			
		},
		Display: {
			renderTemplate: template => {},
		},
	};
	IO.init();
})();

