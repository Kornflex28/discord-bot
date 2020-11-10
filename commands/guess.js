const config = require('../config.json');
module.exports = {
	name: 'guess',
    description: 'Guessing number game',
    args:true,
    usage: '<nombre>',
	execute(message, args) {
	    const a = 0;
        const b = 1e3;
        const user_guess = parseInt(args[0]);
        
        if (!config._guess_chosen){
            config._guess_n = Math.floor(Math.random() * (b - a) ) + a;
            config._guess_chosen = true;
            message.channel.send(`New number between ${a} and ${b} chosen !`)
        }

        if (isNaN(user_guess)) {
            return message.reply('your first argument is not a number');
        }
        else if (user_guess < a || user_guess > b) {
            return message.reply(`you dumb or what ?! My number is between ${a} and ${b}`);
        }
        else if (user_guess > config._guess_n){
            return message.channel.send(`My number is lower than ${user_guess}`)
        }
        else if (user_guess < config._guess_n){
            return message.channel.send(`My number is greater than ${user_guess}`)
        }
        else if (user_guess == config._guess_n){
            config._guess_chosen = false;
            return message.channel.send(`Well done, my number was ${user_guess}`)
        }
        // message.reply(`chosen number is: ${config._guess_n}`)
	},
};