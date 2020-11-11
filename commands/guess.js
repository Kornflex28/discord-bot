const config = require('../../config.json');
var {_guess_min, _guess_max, _guess_chosen, _guess_n} = config.guess;
module.exports = {
	name: 'guess',
    description: 'Jeu pour tester ton QI où il faut deviner le nombre que j\'ai choisi entre 2 nombres.',
    args:true,
    usage: '<nombre>',
	execute(message, args) {
        const user_guess = parseInt(args[0]);
        
        if (!_guess_chosen){
            _guess_n = Math.floor(Math.random() * (_guess_max - _guess_min) ) + _guess_min;
            _guess_chosen = true;
            message.channel.send(`Nouveau nombre entre **${_guess_min}** et **${_guess_max}** choisi !`)
        }

        if (isNaN(user_guess)) {
            return message.reply('ton premier argument n\'est pas un nombre. (Einstein, 1913)');
        }
        else if (user_guess < _guess_min || user_guess > _guess_max) {
            return message.reply(`allo ca va ??! Mon nombre est entre **${_guess_min}** et **${_guess_max}**`).then((bot_message) => bot_message.react('🧠'));
        }
        else if (user_guess > _guess_n){
            message.channel.send(`Mon nombre est **plus petit que ${user_guess}**`);
        }
        else if (user_guess < _guess_n){
            message.channel.send(`Mon nombre est **plus grand ${user_guess}**`);
        }
        else if (user_guess == _guess_n){
            _guess_chosen = false;
            message.channel.send(`Incroyable ${message.author} tu as deviné ! **Mon nombre était ${user_guess}**`).then((bot_message) => bot_message.react('🤯'));
        }
        // message.reply(`chosen number is: ${config._guess_n}`)
        return;
	},
};