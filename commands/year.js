// let canvas = require('canvas');

function getProgress(d) {

    let cy = d.getUTCFullYear();
    let notLeap = cy % 4; //is year not-leap (counts extra day in feb)
    let day_sec = 86400;
    let planets = ['Mercure', 'Vénus', 'Terre', 'Mars', 'Jupiter', 'Saturne', 'Uranus', 'Neptune','Pluton']
    earth_ind = 2;
    let full_year_sec = [87.97, 224.70, 365, 686.98, 4332.82, 10755.70, 30687.15, 60190.03, 90560].map(x => x * day_sec);

    let total = 0;
    if (!notLeap) {
        full += 86400;
        if (d.getUTCMonth() >= 2) total += day_sec;
    }
    let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30];
    total += monthDays.slice(0, d.getUTCMonth()).reduce((a, b) => a + b, 0) * day_sec;
    total += (d.getUTCDate() - 1) * day_sec;
    total += d.getUTCHours() * 3600;
    total += d.getUTCMinutes() * 60;
    total += d.getUTCSeconds();
    return [planets, earth_ind, full_year_sec.map(x => 100 * total / x),full_year_sec];
}

module.exports = {
    name: 'year',
    description: 'Dédé te donne la progression de l\'année actuelle grâce à ses dés.',
    cooldown: 2,
    aliases: ['annee', 'année', 'progress'],
    async execute(message, args) {
        let date = message.createdAt;
        let [planets, earth_ind, planet_progress,planet_year_sec] = getProgress(date);

        earth = planets[earth_ind];
        earth_progress = planet_progress[earth_ind];

        planets.splice(earth_ind, 1);
        planet_progress.splice(earth_ind, 1);
        planet_year_sec.splice(earth_ind, 1);

        rand_planet_ind = Math.floor(Math.random() * planets.length);
        rand_planet = planets[rand_planet_ind];
        rand_planet_progress = planet_progress[rand_planet_ind];
        rand_planet_year_sec = planet_year_sec[rand_planet_ind];

        // let cv = canvas.createCanvas(400, 40);
        // let ctx = cv.getContext('2d');
        // ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, 400, 40); 
        // ctx.fillStyle = '#747f8d'; ctx.fillRect(3, 3, 394, 34);
        // ctx.fillStyle = '#43b581'; ctx.fillRect(3, 3, (Math.floor(394 / 100 * getProgress(date))), 34); 

        message.channel.send(`À cet instant, l'année **${date.getUTCFullYear()}** sur **${earth}** :earth_africa: est complète à **${earth_progress} %** (précision grace à mon horloge à quartz).\n:telescope: Sur ${rand_planet} ${rand_planet_progress>100? `l'année ${date.getUTCFullYear()} est déjà finie et l'année ${Math.floor(rand_planet_progress/100)+date.getUTCFullYear()} est à ${rand_planet_progress%100}% complétée (en jours terriens et `:`l'année est à ${rand_planet_progress%100}% complétée (en jours terriens) et se terminera le ${new Date(date.getTime() + rand_planet_year_sec*(1-rand_planet_progress/100)*1000).toLocaleString('FR')} (`}en décomptant à partir du 1er janvier).`)//, { files: [{ attachment: cv.toBuffer(), name: 'yearprogress.jpg' }] });
    },
};


