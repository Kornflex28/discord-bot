let canvas = require('canvas');

function getProgress(d) {

    let cy = d.getUTCFullYear();
    let notLeap = cy % 4; //is year not-leap (counts extra day in feb)

    let full = 31536000;
    let total = 0;
    if (!notLeap) {
        full += 86400;
        if (d.getUTCMonth() >= 2) total += 86400;
    }
    let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30];
    total += monthDays.slice(0, d.getUTCMonth()).reduce((a, b) => a + b, 0) * 86400;
    total += (d.getUTCDate() - 1) * 86400;
    total += d.getUTCHours() * 3600;
    total += d.getUTCMinutes() * 60;
    total += d.getUTCSeconds();
    return total * 100 / full;
}

module.exports = {
    name: 'year',
    description: 'Dédé te donne la progression de l\'année actuelle grâce à ses dés.',
    cooldown: 2,
    aliases: ['annee', 'année', 'progress'],
    async execute(message, args) {
        let date = message.createdAt;
        
        
        let cv = canvas.createCanvas(400, 40);
        let ctx = cv.getContext('2d');
        ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, 400, 40); 
        ctx.fillStyle = '#747f8d'; ctx.fillRect(5, 5, 390, 30);
        ctx.fillStyle = '#43b581'; ctx.fillRect(5, 5, (Math.floor(390 / 100 * getProgress(date))), 30); 
        message.channel.send(`L'année **${date.getUTCFullYear()}** est à ce moment **${getProgress(date)} %** complétée.`, { files: [{ attachment: cv.toBuffer(), name: 'yearprogress.jpg' }] });
    },
};


