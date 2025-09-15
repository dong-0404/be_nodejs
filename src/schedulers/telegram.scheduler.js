const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();
const moment = require('moment-timezone');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

const sendMessage = async (message) => {
    try {
        const response = await axios.post(TELEGRAM_API_URL, {
            chat_id: CHAT_ID,
            text: message,
        });
        console.log('Message sent:', response.data);
    } catch (error) {
        console.error('Error sending message:', error.message);
    }
};

// Thiết lập cron job với múi giờ Việt Nam
const scheduleTelegramJob = () => {
    // Chạy cronjob ở giờ địa phương Việt Nam (Asia/Ho_Chi_Minh)
    cron.schedule('0 8 * * *', () => {
        const message = 'Chào buổi sáng! Đây là tin nhắn được gửi bởi Đông dzai. Hiện tại Đông đzai đã sang công ty. Em Tuyết dậy chưa ạ!!!!!';
        sendMessage(message);
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh"  // Set múi giờ Việt Nam
    });

    // 9:30 AM
    cron.schedule('30 9 * * *', () => {
        const message = '9h30 rồi, Dậy đi em Tuyết ơi!!!!!';
        sendMessage(message);
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh"
    });

    // 12:00 PM (Trưa)
    cron.schedule('0 12 * * *', () => {
        const message = 'Hiện tại đã đến giờ nghỉ trưa của Đông đẹp zai. Em Tuyết ăn cơm chưa ạ!!!!!';
        sendMessage(message);
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh"
    });

    // 1:40 PM
    cron.schedule('40 13 * * *', () => {
        const message = 'Chào buổi chiều! Đông đã sang công ty ròi!!!!';
        sendMessage(message);
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh"
    });

    // 3:00 PM
    cron.schedule('0 15 * * *', () => {
        const message = 'Thể dục đi em Tuyết ơiii!!!!!';
        sendMessage(message);
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh"
    });

    // 5:30 PM
    cron.schedule('30 17 * * *', () => {
        const message = 'Đông đẹp zai đã tan làm rồi em Tuyết nhé!!!!!';
        sendMessage(message);
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh"
    });

    // Mỗi phút vào lúc 3h chiều (test)
    // cron.schedule('*/1 16 * * *', () => {
    //     const message = 'Tôi đang test tính năng em Tuyết thông cảm nhé kakakaka';
    //     sendMessage(message);
    // }, {
    //     scheduled: true,
    //     timezone: "Asia/Ho_Chi_Minh"
    // });
};

module.exports = scheduleTelegramJob;
