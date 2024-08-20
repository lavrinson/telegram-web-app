// telegram-web-app.js

// Инициализация WebApp и настройка некоторых свойств
window.Telegram = {
    WebApp: {
        initData: '',
        initDataUnsafe: {},
        version: '6.0', // Установите версию API, если нужно
        platform: navigator.userAgent.includes('Telegram') ? 'telegram' : 'web',
        themeParams: {
            bg_color: '#ffffff',
            text_color: '#000000',
            hint_color: '#999999',
            link_color: '#0088cc',
            button_color: '#0088cc',
            button_text_color: '#ffffff'
        },
        isExpanded: false,
        viewportHeight: 0,
        mainButton: {
            isVisible: false,
            isActive: false,
            text: 'OK',
            color: '#0088cc',
            textColor: '#ffffff'
        },
        hapticFeedback: function (type) {
            // Эмуляция вибрации или других тактильных эффектов
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
        }
    }
};

// Авторизация пользователя через Telegram
window.TelegramLoginWidget = {
    onAuth: function (user) {
        console.log('User authenticated:', user);
        // Обработка данных пользователя
    }
};

// Пример взаимодействия с главной кнопкой
window.Telegram.WebApp.mainButton.show = function () {
    this.isVisible = true;
    console.log('Main button shown');
};

window.Telegram.WebApp.mainButton.hide = function () {
    this.isVisible = false;
    console.log('Main button hidden');
};

window.Telegram.WebApp.mainButton.setText = function (text) {
    this.text = text;
    console.log('Main button text set to:', text);
};

window.Telegram.WebApp.mainButton.setColor = function (color) {
    this.color = color;
    console.log('Main button color set to:', color);
};

window.Telegram.WebApp.mainButton.setTextColor = function (textColor) {
    this.textColor = textColor;
    console.log('Main button text color set to:', textColor);
};

// Пример вызова haptic feedback (тактильной обратной связи)
window.Telegram.WebApp.hapticFeedback('impact');
