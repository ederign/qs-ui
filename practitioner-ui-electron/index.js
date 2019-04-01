const { app, BrowserWindow, ipcMain } = require("electron")

const knex = require("knex")({
	client: "sqlite3",
	connection: {
		filename: "./database.db"
	}
});

app.on("ready", () => {
	let mainWindow = new BrowserWindow({ height: 800, width: 800, show: false });
	mainWindow.loadURL(`file://${__dirname}/main.html`);
	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
	});

	ipcMain.on("mainWindowLoaded", () => {
		let result = knex.select("name", "content").from("spaces");
		result.then((rows) => {
			mainWindow.webContents.send("spacesList", rows);
		});
	});
});

app.on("window-all-closed", () => {
	app.quit();
});