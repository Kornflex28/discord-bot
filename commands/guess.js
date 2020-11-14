const config = require('../../config.json');
var {_guessMin, _guessMax, _guessChosen, _guessN} = config.guess;
module.exports = {
	name: 'guess',
    description: 'Jeu pour tester ton QI où il faut deviner le nombre que j\'ai choisi entre 2 nombres.',
    args:true,
    usage: '<nombre>',
	execute(message, args) {
        const user_guess = parseInt(args[0]);
        
        if (!_guessChosen){
            _guessN = Math.floor(Math.random() * (_guessMax - _guessMin) ) + _guessMin;
            _guessChosen = true;
            message.channel.send(`Nouveau nombre entre **${_guessMin}** et **${_guessMax}** choisi !`)
        }

        if (isNaN(user_guess)) {
            return message.reply('ton premier argument n\'est pas un nombre. (Einstein, 1913)');
        }
        else if (user_guess < _guessMin || user_guess > _guessMax) {
            return message.reply(`allo ca va 🥴??! Mon nombre est entre **${_guessMin}** et **${_guessMax}**`).then((bot_message) => bot_message.react('🧠'));
        }
        else if (user_guess > _guessN){
            message.channel.send(`Mon nombre est **plus petit que ${user_guess}**`);
        }
        else if (user_guess < _guessN){
            message.channel.send(`Mon nombre est **plus grand ${user_guess}**`);
        }
        else if (user_guess == _guessN){
            _guessChosen = false;
            message.channel.send(`Incroyable ${message.author} tu as deviné ! **Mon nombre était ${user_guess}**`).then((bot_message) => bot_message.react('🤯'));
        }
        // message.reply(`chosen number is: ${config._guessN}`)
        return;
	},
};