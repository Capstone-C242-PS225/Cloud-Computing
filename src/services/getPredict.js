/* eslint-disable no-undef */
require('dotenv').config();
const axios = require('axios');
const InputError = require('../exceptions/inputError');

/**
 * Sends a POST request to the ML model's endpoint to predict gambling addiction.
 * @param {Object} data - The input data for the prediction model.
 * @param {number} data.newRegister - Whether the user is newly registered (1 = yes, 0 = no).
 * @param {number} data.transaction_amount - The transaction amount.
 * @param {number} data.user_total_cashout - Total cashout amount by the user.
 * @param {number} data.company_total_cashout - Total cashout amount by the company.
 * @param {number} data.user_total_balance - The user's total balance.
 */

async function predictGamble(data) {
    const baseURL = process.env.URL_MODEL;

    if (!baseURL) {
        return { error: 'Environment variable URL_MODEL is not defined.' };
    }

    const url = `${baseURL}/predict_gamble`;

    try {
        const response = await axios.post(url, data);
        const { predicted_addiction, prediction_probabilities } = response.data;
        return { predicted_addiction, prediction_probabilities };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan: ${error.message}`)
    }
}

module.exports = predictGamble;
