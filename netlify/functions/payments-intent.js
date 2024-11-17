require("dotenv").config();

const stripe = require("stripe")("sk_test_51QLFO4GAVPgDriTXRPc5UsI28653ZVseRu4Meby8iYz5lOgIiZcXxcp1Hz5Uv5GlM41Yxvff0zC8ykONX74H6Z3W005NDn65XH");

exports.handler = async (event) => {
  try {
    const { amount } = JSON.parse(event.body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ paymentIntent }),
    };
  } catch (error) {
    console.log({ error });

    return {
      statusCode: 400,
      body: JSON.stringify({ error }),
    };
  }
};