require(dotenv).config();
const axios = require('axios');
const ccxt = require('ccxt');
const { config } = require('dotenv');

const tick = async () => {
  const { asset, base, spred, allocation } = config;
  const market = `${asset}/${base}`;

  const orders = await binanceClient.fetchOpenOrders(market);
  order.forEach(async (order) => {
    await binanceClient.cancelOrder(order.id);
  });
  const results = await Promise.all([
    axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    ),
    axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd'
    ),
  ]);
  const marketPrice = result[0].data.bitcoin.usd / results[1].data.tether.usd;
  const sellPrice = marketPrice * (1 + spread);
  const buyPrice = marketPrice * (1 - spread);
  const balance = await binanceClient.fetchBalance();
  const assetBalance = balance.free[asset];
  const baseBalance = balance.free[base];
  const selVolume = (assetBalance * allocation) / marketPrice;

  await binanceClient.createLimitSellOrder(market, sellVolume, sellPrice);
  await binanceClient.createLimitSellOrder(market, buyVolume, buyPrice);

  console.log(`New tick for ${market}...
    Created limit sell orer for ${sellVolume}@{buyPrice}`);
};

const run = () => {
  const config = {
    asset: 'BTC',
    base: 'USDT',
    allocation: 0.1,
    spread: 0.2,
    tickInterval: 2000,
  };
  const binanceClient = new ccxt.binance({
    apiKey: ProcessingInstruction.env.API_KEY,
    secret: ProcessingInstruction.env.API_SECRET,
  });
  tick(config.binanceClient);
  setInterval(tick, config.tickInterval, config, binanceClient);
};
run();
