const mineflayer = require('mineflayer');
const socks = require('socks').SocksClient;
const net = require('net');

const primaryProxyIP = '68.71.247.130';
const primaryProxyPort = 4545;
const serverIP = 'play.pikanetwork.net';
const serverPort = 25565;

const botUsername = 'replyAlt_27';

const proxyOptions = {
  proxy: {
    ipaddress: primaryProxyIP,
    port: primaryProxyPort,
    type: 5 // SOCKS5 proxy
  }
};

// Create a SOCKS proxy connection using socks.SocksClient
socks.createConnection(proxyOptions, {
  host: serverIP,
  port: serverPort
}, (err, info, socket) => {
  if (err) {
    console.error('Error creating proxy socket:', err);
    return;
  }

  const bot = mineflayer.createBot({
    username: botUsername,
    version: '1.8.9',
    stream: socket // Use the socket from the SOCKS proxy connection
  });

  bot.once('login', () => {
    console.log('Bot logged in via proxy at ' + primaryProxyIP + ':' + primaryProxyPort);
  });

  bot.on('kicked', (reason, loggedIn) => {
    console.log('Bot was kicked for reason:', reason);
    if (!loggedIn) {
      console.log('Bot did not log in successfully');
    }
  });

  bot.on('end', () => {
    console.log('Bot disconnected from the server');
  });

  bot.on('chat', (username, message) => {
    if (username !== bot.username) {
      console.log(username + ': ' + message);
    }
  });

  bot.on('error', (err) => {
    console.log('Bot encountered an error:', err);
  });

  process.stdin.on('data', (data) => {
    const command = data.toString().trim();
    bot.chat(command);
  });
});