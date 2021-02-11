const Mustache = require('mustache');
const fs = require('fs');
const MUSTACHE_MAIN_DIR = './main.mustache';

require('dotenv').config()
const Usercommands = require("./database/uc.js");

async function generateReadMe() {
    let db = await Usercommands.setURL(process.env.LEVELS_DB_URL);
    let commandsExec = await Usercommands.fetchAll();
    let commandsCounts = new Map();
    for (let userGuildInstance of commandsExec) {
        for (let [command, commandCount] of userGuildInstance.commands) {
            if (!commandsCounts.has(command)) {
                commandsCounts.set(command, commandCount)
            } else {
                commandsCounts.set(command, commandCount + commandsCounts.get(command))
            }
        }
    }
    let totalCommandsCounts = Array.from(commandsCounts).sort(function (a, b) {
        return b[1] - a[1];
    })
    let totalExecuted = totalCommandsCounts.reduce((r, a) => r.map((b, i) => a[i] + b))[1]
    let DATA = {
        totalCommands: fs.readdirSync('./commands').filter(file => file.endsWith('.js')).length,
        totalExecuted: totalExecuted,
        date: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short',
            timeZone: 'Europe/Paris',
        }),
    };

    for (let conn of db.connections) {
        conn.close();
    }

    fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
        if (err) throw err;
        const output = Mustache.render(data.toString(), DATA);
        fs.writeFileSync('README.md', output);
    })

} generateReadMe();
