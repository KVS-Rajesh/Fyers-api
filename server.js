const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Fyers Node Webhook Server is running.');
});

app.get('/callback', (req, res) => {
  const authCode = req.query.auth_code;
  res.send(`Auth Code: ${authCode}`);
});

app.post('/tv-webhook', async (req, res) => {
  const alert = req.body;
  const symbol = alert.symbol?.replace("NSE:", "") || "RELIANCE";
  const side = alert.action === "BUY" ? 1 : -1;

  const orderPayload = {
    symbol,
    qty: 1,
    type: 2,
    side,
    productType: "INTRADAY",
    limitPrice: 0,
    stopPrice: 0,
    disclosedQty: 0,
    validity: "DAY",
    offlineOrder: false,
    stopLoss: 0,
    takeProfit: 0
  };

  try {
    const response = await axios.post("https://api.fyers.in/api/v2/orders", orderPayload, {
      headers: {
        "Authorization": `Bearer YOUR_FYERS_ACCESS_TOKEN`,
        "Content-Type": "application/json"
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Order failed",
      details: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
