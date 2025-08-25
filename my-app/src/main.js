const { app, BrowserWindow } = require("electron");
const { exec } = require("child_process");

let mainWindow;
let splashWindow;

function createSplashScreen() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    backgroundColor: "#000000"
  });

  splashWindow.loadURL(`file://${__dirname}/components/Splash/splash.html`);
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false, // ここを false にして、準備が完了するまで表示しない
    backgroundColor: "#000000", // 背景を黒にして白画面を防ぐ
    webPreferences: {
      nodeIntegration: true
    }
  });

  const startUrl = "http://localhost:3000";

  mainWindow.loadURL(startUrl);

  // Reactが完全にロードされるまでスプラッシュを維持
  mainWindow.webContents.once("did-finish-load", () => {
    setTimeout(() => {
      if (splashWindow && !splashWindow.isDestroyed()) {
        splashWindow.close();
      }
      mainWindow.show();
    }, 500); // 0.5秒のバッファを入れて白画面を回避
  });
}

app.whenReady().then(() => {
  createSplashScreen();

  // React 開発サーバーをバックグラウンドで起動
  exec("npm start", (error, stdout, stderr) => {
    if (error) {
      console.error(`Reactサーバーの起動に失敗: ${error.message}`);
      return;
    }
    console.log(`Reactサーバー起動ログ: ${stdout}`);
  });

  // メインウィンドウを遅れて作成し、スプラッシュを維持
  setTimeout(() => {
    if (!app.isQuitting) createMainWindow();
  }, 2000);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  app.isQuitting = true;
});
