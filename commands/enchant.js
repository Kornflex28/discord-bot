function translate(str) {
    let enchantedAlpha = new Map([["a", "ᔑ"], ["b", "ʖ"], ["c", "ᓵ"], ["d", "↸"], ["e", "ᒷ"], ["f", "⎓"], ["g", "⊣"], ["h", "⍑"], ["i", "╎"], ["j", "⋮"], ["k", "ꖌ"], ["l", "ꖎ"], ["m", "ᒲ"], ["n", "リ"], ["o", "𝙹"], ["p", "!¡"], ["q", "ᑑ"], ["r", "∷"], ["s", "ᓭ"], ["t", "ℸ"], ["u", "⚍"], ["v", "⍊"], ["w", "∴"], ["x", "/"], ["y", "||"], ["z", "⨅"]])
    out = ''
    for (ch of str) {
        out += enchantedAlpha.get(ch)
    }
    return out
}
module.exports = {
    name: 'enchant',
    description: 'Enchante !',
    cooldown: 1,
    usage: '<à enchanter>',
    execute(message, args) {
        const re = /[a-z]+/g;
        if (!args.length) {
            message.channel.send(':book: ' + translate((Math.random().toString(36).slice(2).toLowerCase().match(re) || []).join('')));
        } else {
            toTranslate = args.map(str => (str.toLowerCase().match(re) || []).join(''))
            translated = toTranslate.map(str => translate(str))
            message.channel.send(':book: ' + translated.join(' '));
        }
    },
};  