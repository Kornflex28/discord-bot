const fs = require('fs');

module.exports = {
    name: 'code',
    description: 'Donne le nom d\'une commande et Dédé te montre comment il est programmé !',
    usage: '<commande>',
    async execute(message, args) {
        const client = message.client;


        let commandName = args[0]
        const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) {
            return message.reply(`Désolé mais je n'ai pas trouvé la commande \`${commandName}\` ...`)
        } else {
            let file = await fs.readFileSync(`./commands/${command.name}.js`, 'utf8')
            console.log(file.length)
            let nl_indices = [], i = -1;
            while ((i = file.indexOf("\n", i + 1)) >= 0) nl_indices.push(i);
            const field_lim = 1930;
            let fields = [];
            const n_blocks = Math.ceil(parseInt(nl_indices[nl_indices.length - 1]) / field_lim);
            if (n_blocks > 1) {
                let prev_idx = 0
                for (let k = 1; k < n_blocks; k++) {
                    const diffArr = nl_indices.map(x => Math.abs(k * field_lim - x));
                    const minIdx = diffArr.indexOf(Math.min(...diffArr));
                    fields.push(file.slice(prev_idx, nl_indices[minIdx]));
                    prev_idx = nl_indices[minIdx];
                }
                fields.push(file.slice(prev_idx));
                for (let [id, f] of fields.entries()) {
                    try {
                        await message.channel.send(`Code de __\`${command.name}\` (${id+1}/${fields.length})__\`\`\`js\n${f.replace(/\`\`\`/g, '"""')}\n\`\`\``)
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