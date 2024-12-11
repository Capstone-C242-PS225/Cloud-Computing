const predictGamble = require("../services/getPredict");
const { randomUUID } = require("crypto");

const askPredict = async (request, h) => {
  const requiredFields = [
    "newRegister",
    "transaction_amount",
    "user_total_cashout",
    "company_total_cashout",
    "user_total_balance",
  ];

  const missingFields = requiredFields.filter(
    (field) =>
      request.payload[field] === undefined || request.payload[field] === null
  );

  if (missingFields.length > 0) {
    return h
      .response({
        status: "fail",
        message: `Payload is missing the following fields: ${missingFields.join(
          ", "
        )}`,
      })
      .code(400);
  }

  const {
    newRegister,
    transaction_amount,
    user_total_cashout,
    company_total_cashout,
    user_total_balance,
  } = request.payload;

  const dataInput = {
    newRegister: newRegister,
    transaction_amount: transaction_amount,
    user_total_cashout: user_total_cashout,
    company_total_cashout: company_total_cashout,
    user_total_balance: user_total_balance,
  };

  try {
    const { predicted_addiction, prediction_probabilities } = await predictGamble(
      dataInput
    );
    const id = randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      createdAt: createdAt,
      predicted_addiction: predicted_addiction,
      prediction_probabilities: prediction_probabilities,
    };

    // const dataSave = { ...data, ...dataInput };
    // await storeData(id, dataSave);

    const response = h.response({
      status: "success",
      message: "Model is predicted successfully",
      data: data,
    });

    response.code(201);
    return response;
  } catch (error) {
    return h
      .response({
        status: "error",
        message: "Failed to predict data.",
        error: error.message,
      })
      .code(500);
  }
};

module.exports = {
  askPredict,
};
