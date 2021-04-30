const https = require('https');
htmlparser = require('node-html-parser');
infos_url = 'https://theskylive.com/sun-info';
lightspeed = 299792458; // m/s

module.exports = {
    name: 'sun',
    description: 'Je lance ma face téléscope pour voir à quelle distance de la Terre se trouve le Soleil !',
    aliases: ['soleil'],
    async execute(message, args) {
        message.channel.send('Laisse moi mettre mes lunettes de soleil un instant... (cf L.D.S de Vald)')
        https.get(infos_url, function (res) {
            let data = "";
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on("end", function () {
                const root = htmlparser.parse(data);
                const page_labels = root.querySelectorAll('label');
                const html_el1 = page_labels.find(e=>e.text == 'Distance Kilometers');
                distance_to_earth = parseFloat(html_el1.nextElementSibling.text.replace(/,/g, ''));
                travel_time = 1000*distance_to_earth/lightspeed;
                message.channel.send(`Le Soleil se trouve actuellement à ${distance_to_earth.toLocaleString('fr')} km de la Terre.\nL'astre brillant que tu vois dans le ciel se trouve en réalité ${Math.floor(travel_time/60)} minutes et ${(travel_time%60).toFixed(9)} secondes dans le passé !`);
            });
        });
        return;
    }
}