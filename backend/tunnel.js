const localtunnel = require('localtunnel');

(async () => {
  const tunnel = await localtunnel({ port: 5000 });
  console.log("your url is: " + tunnel.url);
  
  tunnel.on('close', () => {
    console.log('tunnels are closed');
  });
})();
