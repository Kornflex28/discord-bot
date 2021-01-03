const fetch = require("node-fetch");
const fetch_url = 'https://www.thecocktaildb.com/api/json/v1/1/';
const Discord = require('discord.js');
const translate = require('@vitalets/google-translate-api');

async function formCocktailEmbed(message, drink) {
    cocktailEmbed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setFooter('Données obtenues grâce aux connaissances en mixologie de Dédé. L\'abus d\'alcool est dangereux pour la santé', message.client.user.displayAvatarURL())
        .setTitle(drink.strDrink + ' :cocktail:')
        .setImage(`${drink.strDrinkThumb ? drink.strDrinkThumb : ''}`)
        .setTimestamp();

    let alcoholic = await translate(`${drink.strAlcoholic} cocktail`, { client: 'gtx', from: 'en', to: 'fr' });
    cocktailEmbed.setAuthor(alcoholic.text)
    if (drink.strInstructionsFR) {
        cocktailEmbed.setDescription(drink.strInstructionsFR);
    } else {
        let instr = await translate(drink.strInstructions, { client: 'gtx', from: 'en', to: 'fr' });
        cocktailEmbed.setDescription(`__Instructions__\n*${instr.text}*`);
    }
    ingrs = [];
    for (let i = 1; i < 16; i++) {
        if (!drink[`strIngredient${i}`]) {
            continue
        }
        let ingr = await translate(`${drink[`strMeasure${i}`] ? drink[`strMeasure${i}`] : ''} ${drink[`strIngredient${i}`]}`, { client: 'gtx', from: 'en', to: 'fr' })
        ingrs.push(ingr.text);
    }
    cocktailEmbed.addField('Ingredients', `• ${ingrs.join('\n• ')}`)
    cocktailEmbed.addField('Conversions', '1 once/oz ≈ 29.5 mL')
    return cocktailEmbed;
}

module.exports = {
    name: 'cocktail',
    description: 'Dédé lance les dés et te trouve un cocktail selon tes critères !',
    cooldown: 2,
    aliases: ['drink', 'boisson'],
    usage: 'pour un cocktail aleatoire\n!cocktail <"sa"> pour un cocktail aléatoire sans alcool\n!cocktail <"aa"> pour un cocktail avec alcool\n!cocktail <nom du cocktail> pour chercher un cocktail en particulier\n!cocktail <"avec"> <ingredient> pour un cocktail contenant un ingredient en particulier',
    async execute(message, args) {
        message.channel.send('Laisse moi secouer mes dés un instant ...')
        if (!args.length) {
            fetch(`${fetch_url}random.php`).then(resp => resp.json())
                .then(async json => {
                    let drink = json.drinks[0]
                    let cocktailEmbed = await formCocktailEmbed(message, drink);
                    return message.channel.send(cocktailEmbed);
                })
        }
        else if (args[0] === 'sa') {
            fetch(`${fetch_url}filter.php?a=Non_Alcoholic`).then(resp => resp.json())
                .then(json => {
                    let drinkId = json.drinks[Math.floor(Math.random() * json.drinks.length)].idDrink;
                    fetch(`${fetch_url}lookup.php?i=${drinkId}`).then(resp => resp.json())
                        .then(async data => {
                            let drink = data.drinks[0];
                            let cocktailEmbed = await formCocktailEmbed(message, drink);
                            return message.channel.send(cocktailEmbed);
                        })
                })
        }
        else if (args[0] === 'aa') {
            fetch(`${fetch_url}filter.php?a=Alcoholic`).then(resp => resp.json())
                .then(json => {
                    let drinkId = json.drinks[Math.floor(Math.random() * json.drinks.length)].idDrink;
                    fetch(`${fetch_url}lookup.php?i=${drinkId}`).then(resp => resp.json())
                        .then(async data => {
                            let drink = data.drinks[0];
                            let cocktailEmbed = await formCocktailEmbed(message, drink);
                            return message.channel.send(cocktailEmbed);
                        })
                })
        }
        else if (args[0] === 'avec') {
            let ingrs = args.slice(1).join(' ');
            let ingr = await translate(ingrs, { client: 'gtx', from: 'fr', to: 'en' })
            console.log(ingr.text)
            fetch(`${fetch_url}filter.php?i=${ingr.text}`).then(resp => {
                if (resp.headers.get("content-type") === 'application/json') {
                    return resp.json()
                } else {
                    return null
                }
            })
                .then(json => {
                    if (!json) {
                        return message.channel.send('Désolé mais je n\'ai rien trouvé avec cet ingrédient !')
                    }
                    let drinkId = json.drinks[Math.floor(Math.random() * json.drinks.length)].idDrink;
                    fetch(`${fetch_url}lookup.php?i=${drinkId}`).then(resp => resp.json())
                        .then(async data => {
                            let drink = data.drinks[0];
                            let cocktailEmbed = await formCocktailEmbed(message, drink);
                            return message.channel.send(cocktailEmbed);
                        })
                })
        }
        else {
            fetch(`${fetch_url}search.php?s=${args.join(' ')}`).then(resp => resp.json())
                .then(async json => {
                    if (!json.drinks) {
                        return message.channel.send('Désolé mais je n\'ai pas trouvé de cocktail avec ce nom (en anglais) ... :woozy_face:')
                    }
                    let drink = json.drinks[0]
                    let cocktailEmbed = await formCocktailEmbed(message, drink);
                    return message.channel.send(cocktailEmbed);
                })
        }

    }
}
