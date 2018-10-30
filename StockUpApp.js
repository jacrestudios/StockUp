(() => {
	IO : {
		init: () => {}
	}
	App : {
		role: '',
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
			role: '',
			name: '',
			networth: '',
			stocks: [],
			cards: [],
			ready: false,
		},
		Display: {
			
		},
	}
	IO.init();
})();

