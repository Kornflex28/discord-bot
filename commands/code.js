const fs = require('fs');

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

async function formatCommand(command) {
    let file = await fs.readFileSync(`./commands/${command.name}.js`, 'utf8')
    let nl_indices = [], i = -1;
    while ((i = file.indexOf("\n", i + 1)) >= 0) nl_indices.push(i);
    const field_lim = 1920;
    let fields = [];
    const n_blocks = Math.ceil(parseInt(nl_indices[nl_indices.length - 1]) / field_lim);
    let prev_idx = 0
    for (let k = 1; k < n_blocks; k++) {
        const diffArr = nl_indices.map(x => Math.abs(k * field_lim - x));
        const minIdx = diffArr.indexOf(Math.min(...diffArr));
        fields.push(file.slice(prev_idx, nl_indices[minIdx]));
        prev_idx = nl_indices[minIdx];
    }
    fields.push(file.slice(prev_idx));
    return [file, fields]
}

module.exports = {
    name: 'code',
    description: 'Donne le nom d\'une commande et Dédé te montre comment il est programmé !',
    usage: '<commande>',
    async execute(message, args) {
        const client = message.client;

        if (!args.length) {
            const command = client.commands.random()
            const [file, fields] = await formatCommand(command)
            if (fields.length > 1) {
                for (let [id, f] of fields.entries()) {
                    try {
                        await message.channel.send(`Code de __\`${command.name}\` (${id + 1}/${fields.length})__\`\`\`js\n${f.replace(/\`\`\`/g, '"""')}\n\`\`\``)
                    } catch (e) {
                        console.log(e)
                        message.channel.send('Oups, il va manquer une partie...')
                    }
                }
            } else {
                message.channel.send(`Code de __\`${command.name}\`__\`\`\`js\n${file.replace(/\`\`\`/g, '"""')}\n\`\`\``)
            }
        } else {
            let commandName = args[0]
            const command = client.commands.get(commandName)
                || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            if (!command) {
                return message.reply(`Désolé mais je n'ai pas trouvé la commande \`${commandName}\` ...`)
            } else {
                const [file, fields] = await formatCommand(command)
                if (fields.length > 1) {
                    for (let [id, f] of fields.entries()) {
                        try {
                            await message.channel.send(`Code de __\`${command.name}\` (${id + 1}/${fields.length})__\`\`\`js\n${f.replace(/\`\`\`/g, '"""')}\n\`\`\``)
                        } catch (e) {
                            console.log(e)
                            message.channel.send('Oups, il va manquer une partie...')
                        }
                    }
                } else {
                    message.channel.send(`Code de __\`${command.name}\`__\`\`\`js\n${file.replace(/\`\`\`/g, '"""')}\n\`\`\``)
                }
            }
        }
    }
}
