module.exports = {
	name: 'args-info',
    description: 'Testing args command',
    args:true,
	execute(message, args) {
        message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};