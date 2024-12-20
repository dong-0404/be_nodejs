#!/bin/bash

# Kiểm tra xem tiến trình pm2 có đang chạy với index.js hay không
if pm2 list | grep -q 'index.js'; then
    # Nếu tiến trình đã chạy, thực hiện restart
    echo "Tiến trình index.js đã chạy, thực hiện restart."
    pm2 restart index.js
else
    # Nếu tiến trình chưa chạy, thực hiện start
    echo "Tiến trình index.js chưa chạy, thực hiện start."
    pm2 start index.js
fi
