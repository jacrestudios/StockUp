( _ => {
	var IO = {
		init: _ => {
			//@IO.socket Socket --Sockets.io library on client-side will be accessed with 'io' namespace
			IO.socket = io.connect();
			IO.bindSocketListeners();
		},
		bindSocketListeners: _ => {
			//Listen for successful connection
			IO.socket.on("connected", IO.onConnected);
			//Listen for succesful room join by Host
			IO.socket.on("createdGame", IO.onCreatedGame);
			//Listen for successful room join by Player
			IO.socket.on("joinedRoom", IO.onJoinedRoom);
			//Listen for error on join by Player
			IO.socket.on("roomNotFound", IO.onRoomNotFound);
			//Listen for update from Host on player join
			IO.socket.on("newPlayerJoined", IO.onNewPlayerJoined);
			//Listen for update from leader to start game
			IO.socket.on("startedGame", IO.onStartedGame);
			//Listen for card played from Players
			IO.socket.on("playedCard", IO.onPlayedCard);
			//Listen for transaction summary from Players
			IO.socket.on("transactionSummary", IO.onTransactionSummary);
			//Listen for turn status from Players
			IO.socket.on("turnStatus", IO.onTurnStatus);
			//Listen for price update from Host
			IO.socket.on("priceUpdate", IO.onPriceUpdate);
			//Listen for timer end from Host
			IO.socket.on("timerEnd", IO.onTimerEnd);
			//Listen for next phase from Host
			IO.socket.on('nextPhase', IO.onNextPhase)
			//Listen for game end from Host
			IO.socket.on("endedGame", IO.onEndedGame);
		},
		onConnected: data => App.onConnected(data),
		onCreatedGame: data => App.role === 'host' && App.Host.onCreatedGame(data),
		onJoinedRoom: data => {
			App.role === 'player' && App.Player.onJoinedRoom(data)
			App.role === 'host' && App.Host.onJoinedRoom(data)
		},
		onNewPlayerJoined: data => App.role === 'player' && App.Player.onNewPlayerJoined(data),
		onRoomNotFound: _ => App.role === 'player' && App.Player.roomNotFound(),
		onStartedGame: _ => {
			App.role === 'host' && App.Host.onStartedGame();
			App.role === 'player' && App.Player.onStartedGame();
		},
		onPlayedCard: data => App.role === 'host' && App.Host.onPlayedCard(data),
		onTransactionSummary: data => App.role === 'host' && App.Host.onTransactionSummary(data),
		onTurnStatus: data => App.role === 'host' && App.Host.onTurnStatus(data),
		onPriceUpdate: data => {
			App.role === 'host' && App.Host.onPriceUpdate(data);
			App.role === 'player' && App.Player.onPriceUpdate(data);
		},
		onTimerEnd: _ => App.role === 'player' && App.Player.onTimerEnd(),
		onNextPhase: _ => App.role === 'player' && App.Player.onNextPhase(),
		onEndedGame: data => App.role === 'player' && App.Player.onEndedGame(data)
	};
	 var App = {
	 	//@role String --Used to run different functions depending on incoming broadcasts
		role: '',
		phase: '',
		onConnected: data => {},
		bindEventListeners: _ => {},
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
			//@onCreatedGame Function --Displays host waiting screen once a Sockets.io room has been created and the host has joined it
			onCreatedGame: data => {
				App.Host.room = data.room;
				App.Display.renderTemplate('hostwait');
			},
			//@onJoinedRoom Function --Increments player_count and lets other players know a new player joined
			onJoinedRoom: _ => {
				App.Host.player_count++;
				IO.socket.emit('newPlayer', {players: App.Host.player_count})
			},
			//@onStartedGame Function --initializes all values necessary for gameplay and renders the host game screen
			onStartedGame: _ => {},
			//@onTransactionSummary Function --pushes transactions into array for summarizing
			onTransactionSummary: data => {},
			//@summarizeTransactions Function --iterates through transaction summary array to populate volume numbers for turn
			summarizeTransactions: _ => {},
			//@onPlayedCard Function --adds a played card to the cards array for the turn
			onPlayedCard: data => {},
			//@resolveCards Function --parses the effects of all cards to apply price updates
			resolveCards: _ => {},
			//@onTurnStatus Function --pushes received turn status into player_statuses array
			onTurnStatus: data => {},
			//@trackTimer Function --Needed to track countdown value
			trackTimer: _ => {},
			//@countdownTimer Function --Used to move timer down
			countdownTimer: _ => {},
			//@nextPhase Function --calculates the effects of the current phase and starts the next phase
			nextPhase: _ => {},
		},
		Player: {
			//@leader Boolean --Used to provide a "start up" button to the first joined player
			leader: false,
			player_count: 0,
			name: '',
			networth: '',
			cash: 0,
			stocks: [],
			cards: [],
			transactions: [],
			ready: false,
			//@joinRoom Function --Sends a room id to attempt to join
			joinRoom: room_id => IO.socket.emit('joinGame', {room: room_id}),
			//@startGame Function --Sends
			startGame: _ => IO.socket.emit('startGame'),
			//@onJoinedRoom Function --If room exists, then display waiting screen until game start, tell everyone
			onJoinedRoom: data => {
				App.Display.renderTemplate('playerwait');
			},
			//@onNewPlayerJoined Function --Allows setting of leader attribute and player_count
			onNewPlayerJoined: data => {},
			onRoomNotFound: _ => {},
			drawCards: _ => {},
			//@postTransaction Function --Validates transactions, posts it to array, and updates relative cash and stock values
			postTransaction: (type, stock, volume) => {},
			//@sendTransactionSummary Function --Summarizes transactions for turn and sends volume information to Host
			sendTransactionSummary: _ => {IO.socket.emit()},
			playCard: _ => {IO.socket.emit()},
			sendTurnStatus: _ => {IO.socket.emit()},
			onPriceUpdate: data => {},
			onNextPhase: data => {}
		},
		Display: {
			main : document.getElementById('main'),
			renderTemplate: template => {},
		},
		Deck: {
			
		},
	};
	IO.init();
})();

