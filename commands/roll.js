var logf = [0, 0, 0.6931471805599453, 1.791759469228055, 3.1780538303479458, 4.787491742782046, 6.579251212010101, 8.525161361065415, 10.60460290274525, 12.801827480081469, 15.104412573075516, 17.502307845873887, 19.987214495661885, 22.552163853123425, 25.19122118273868, 27.89927138384089, 30.671860106080672, 33.50507345013689, 36.39544520803305, 39.339884187199495, 42.335616460753485, 45.38013889847691, 48.47118135183523, 51.60667556776438, 54.78472939811232, 58.00360522298052, 61.261701761002, 64.55753862700634, 67.88974313718154, 71.25703896716801, 74.65823634883016, 78.0922235533153, 81.55795945611504, 85.05446701758152, 88.58082754219768, 92.1361756036871, 95.7196945421432, 99.33061245478743, 102.96819861451381, 106.63176026064346, 110.32063971475739, 114.0342117814617, 117.77188139974507, 121.53308151543864, 125.3172711493569, 129.12393363912722, 132.95257503561632, 136.80272263732635, 140.67392364823425, 144.5657439463449, 148.47776695177302, 152.40959258449735, 156.3608363030788, 160.3311282166309, 164.32011226319517, 168.32744544842765, 172.3527971391628, 176.39584840699735, 180.45629141754378, 184.53382886144948, 188.6281734236716, 192.7390472878449, 196.86618167289, 201.00931639928152, 205.1681994826412, 209.34258675253685, 213.53224149456327, 217.73693411395422, 221.95644181913033, 226.1905483237276, 230.43904356577696, 234.70172344281826, 238.97838956183432, 243.2688490029827, 247.57291409618688, 251.8904022097232, 256.22113555000954, 260.5649409718632, 264.9216497985528, 269.2910976510198, 273.6731242856937, 278.0675734403661, 282.4742926876304, 286.893133295427, 291.3239500942703, 295.76660135076065, 300.22094864701415, 304.6868567656687, 309.1641935801469, 313.65282994987905, 318.1526396202093, 322.66349912672615, 327.1852877037752, 331.7178871969285, 336.26118197919845, 340.815058870799, 345.37940706226686, 349.95411804077025, 354.5390855194408, 359.1342053695754, 363.73937555556347];
var fact = [1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000, 6402373705728000, 121645100408832000, 2432902008176640000, 51090942171709440000, 1124000727777607680000, 25852016738884976640000, 620448401733239439360000, 15511210043330985984000000, 403291461126605635584000000, 10888869450418352160768000000, 304888344611713860501504000000, 8841761993739701954543616000000, 265252859812191058636308480000000, 8222838654177922817725562880000000, 263130836933693530167218012160000000, 8683317618811886495518194401280000000, 295232799039604140847618609643520000000, 10333147966386144929666651337523200000000, 371993326789901217467999448150835200000000, 13763753091226345046315979581580902400000000, 523022617466601111760007224100074291200000000, 20397882081197443358640281739902897356800000000, 815915283247897734345611269596115894272000000000, 33452526613163807108170062053440751665152000000000, 1405006117752879898543142606244511569936384000000000, 60415263063373835637355132068513997507264512000000000, 2658271574788448768043625811014615890319638528000000000, 119622220865480194561963161495657715064383733760000000000, 5502622159812088949850305428800254892961651752960000000000, 258623241511168180642964355153611979969197632389120000000000, 12413915592536072670862289047373375038521486354677760000000000, 608281864034267560872252163321295376887552831379210240000000000, 30414093201713378043612608166064768844377641568960512000000000000, 1551118753287382280224243016469303211063259720016986112000000000000, 80658175170943878571660636856403766975289505440883277824000000000000, 4274883284060025564298013753389399649690343788366813724672000000000000, 230843697339241380472092742683027581083278564571807941132288000000000000, 12696403353658275925965100847566516959580321051449436762275840000000000000, 710998587804863451854045647463724949736497978881168458687447040000000000000, 40526919504877216755680601905432322134980384796226602145184481280000000000000, 2350561331282878571829474910515074683828862318181142924420699914240000000000000, 138683118545689835737939019720389406345902876772687432540821294940160000000000000, 8320987112741390144276341183223364380754172606361245952449277696409600000000000000, 507580213877224798800856812176625227226004528988036003099405939480985600000000000000, 31469973260387937525653122354950764088012280797258232192163168247821107200000000000000, 1982608315404440064116146708361898137544773690227268628106279599612729753600000000000000, 126886932185884164103433389335161480802865516174545192198801894375214704230400000000000000, 8247650592082470666723170306785496252186258551345437492922123134388955774976000000000000000, 544344939077443064003729240247842752644293064388798874532860126869671081148416000000000000000, 36471110918188685288249859096605464427167635314049524593701628500267962436943872000000000000000, 2480035542436830599600990418569171581047399201355367672371710738018221445712183296000000000000000, 171122452428141311372468338881272839092270544893520369393648040923257279754140647424000000000000000, 11978571669969891796072783721689098736458938142546425857555362864628009582789845319680000000000000000, 850478588567862317521167644239926010288584608120796235886430763388588680378079017697280000000000000000, 61234458376886086861524070385274672740778091784697328983823014963978384987221689274204160000000000000000, 4470115461512684340891257138125051110076800700282905015819080092370422104067183317016903680000000000000000, 330788544151938641225953028221253782145683251820934971170611926835411235700971565459250872320000000000000000, 24809140811395398091946477116594033660926243886570122837795894512655842677572867409443815424000000000000000000, 1885494701666050254987932260861146558230394535379329335672487982961844043495537923117729972224000000000000000000, 145183092028285869634070784086308284983740379224208358846781574688061991349156420080065207861248000000000000000000, 11324281178206297831457521158732046228731749579488251990048962825668835325234200766245086213177344000000000000000000, 894618213078297528685144171539831652069808216779571907213868063227837990693501860533361810841010176000000000000000000, 71569457046263802294811533723186532165584657342365752577109445058227039255480148842668944867280814080000000000000000000, 5797126020747367985879734231578109105412357244731625958745865049716390179693892056256184534249745940480000000000000000000, 475364333701284174842138206989404946643813294067993328617160934076743994734899148613007131808479167119360000000000000000000, 39455239697206586511897471180120610571436503407643446275224357528369751562996629334879591940103770870906880000000000000000000, 3314240134565353266999387579130131288000666286242049487118846032383059131291716864129885722968716753156177920000000000000000000, 281710411438055027694947944226061159480056634330574206405101912752560026159795933451040286452340924018275123200000000000000000000, 24227095383672732381765523203441259715284870552429381750838764496720162249742450276789464634901319465571660595200000000000000000000, 2107757298379527717213600518699389595229783738061356212322972511214654115727593174080683423236414793504734471782400000000000000000000, 185482642257398439114796845645546284380220968949399346684421580986889562184028199319100141244804501828416633516851200000000000000000000, 16507955160908461081216919262453619309839666236496541854913520707833171034378509739399912570787600662729080382999756800000000000000000000, 1485715964481761497309522733620825737885569961284688766942216863704985393094065876545992131370884059645617234469978112000000000000000000000, 135200152767840296255166568759495142147586866476906677791741734597153670771559994765685283954750449427751168336768008192000000000000000000000, 12438414054641307255475324325873553077577991715875414356840239582938137710983519518443046123837041347353107486982656753664000000000000000000000, 1156772507081641574759205162306240436214753229576413535186142281213246807121467315215203289516844845303838996289387078090752000000000000000000000, 108736615665674308027365285256786601004186803580182872307497374434045199869417927630229109214583415458560865651202385340530688000000000000000000000, 10329978488239059262599702099394727095397746340117372869212250571234293987594703124871765375385424468563282236864226607350415360000000000000000000000, 991677934870949689209571401541893801158183648651267795444376054838492222809091499987689476037000748982075094738965754305639874560000000000000000000000, 96192759682482119853328425949563698712343813919172976158104477319333745612481875498805879175589072651261284189679678167647067832320000000000000000000000, 9426890448883247745626185743057242473809693764078951663494238777294707070023223798882976159207729119823605850588608460429412647567360000000000000000000000, 933262154439441526816992388562667004907159682643816214685929638952175999932299156089414639761565182862536979208272237582511852109168640000000000000000000000, 93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000];
function binomial(n, k) {
    return Math.exp(logf[n] - logf[n - k] - logf[k]);
}

function probOfSum(k, n_dice, n_side) {
    var p_out = 0;
    for (let i = 0; i <= Math.floor((k - n_dice) / n_side); i++) {
        p_out += ((-1) ** i) * (binomial(n_dice, i)) * binomial(k - n_side * i - 1, n_dice - 1);
    }

    return (1 / (n_side ** n_dice)) * p_out;
}

module.exports = {
    name: 'roll',
    description: 'Lance les dés et regarde ce que l\'avenir te reserve. Donne moi le nombre de dés à lancer ou j\'en lance un sinon',
    aliases: ['lance', 'de', 'dé'],
    usage: '<nb de dé>',
    cooldown: 2,
    execute(message, args) {
        var n_dice = parseInt(args[0]);
        var dice;
        const client = message.client;
        const messageChannel = message.channel;
        var die_emojis;
       const messageChannel = message.channel;

        if (!args.length) {
            n_dice = Math.floor(Math.random() * 15)+1;
            dice = Array.from({ length: n_dice }, () => Math.floor(Math.random() * 6) + 1);
            die_emojis = dice.map(die => client.emojis.cache.find(emoji => emoji.name === `die${die}`));

            messageChannel.send(`Et hop ! Petit lancer de dés ${client.emojis.cache.find(emoji => emoji.name === `rollingdie`)}`)

        }

        else if (isNaN(n_dice)) {
            return message.reply('ton premier argument n\'est pas un nombre. (Bohr, 1910)');
        }
        else if (n_dice > 15) {
            return message.reply('euuh excuse moi mais ça fait un peu beaucoup de dés là non ? Je m\'y perds ... 😵')

        }
        else {
            if (n_dice < 0) {
                return message.reply('aie, malheureusement je ne possède pas d\'antidé sur moi, c\'est illégal ! 😳');
            }
            else if (n_dice == 0) {
                return message.reply('🤔 comme tu veux ...\nVoilà ! J\'ai lancé 0 dé !! Tu avais 100% de chance d\'obtenir ce résultat 🤯');
            }
            else if (n_dice < 2) {
                message.reply(`et hop ! Petit lancer de dé ${client.emojis.cache.find(emoji => emoji.name === `rollingdie`)}`)
            }
            else if (n_dice < 5) {
                message.reply(`ok c'est parti j'en lance ${n_dice} ${client.emojis.cache.find(emoji => emoji.name === `rollingdie`)}`);
            }
            else if (n_dice < 10) {
                message.reply(`wouah ça commence à faire beaucoup de dés mais ok ${client.emojis.cache.find(emoji => emoji.name === `rollingdie`)}`);
            }
            else {
                message.reply(`😮😮 autant de dés ?? Je fais de mon mieux ${client.emojis.cache.find(emoji => emoji.name === `rollingdie`)}`)
            }
            dice = Array.from({ length: n_dice }, () => Math.floor(Math.random() * 6) + 1);
            die_emojis = dice.map(die => client.emojis.cache.find(emoji => emoji.name === `die${die}`));

        }
        messageChannel.send(`${die_emojis.join("")}`)
            .then(() => {
                const sum = dice.reduce((a, b) => a + b, 0);
                const p_sum = probOfSum(sum, n_dice, 6);
                const n_sum_possibilities = Math.round(p_sum * (6 ** n_dice));
                var die_count = 1
                for(let k=1;k<7;k++){
                    var n_die = dice.filter(x => x==k).length;
                    if (n_die >0) {die_count*=fact[ n_die - 1]};
                }
                const p_roll = (fact[n_dice-1]/die_count) * (1/(6 ** n_dice)); 
                var m = -Math.floor( Math.log10(p_roll)+1);
                messageChannel.send(`*Tu avais ${(100 * p_roll).toFixed(m<2 ? 2 : m)}% de chances d'obtenir c${n_dice>1 ? 'es' : 'e'} dé${n_dice>1 ? 's (sans tenir compte de l\'ordre)' : ''} .*`);
                if (n_dice>1) {messageChannel.send(`*La somme de tes dés vaut ${sum}, il y a ${(100 * p_sum).toFixed(2)}% de chance d'obtenir ce résultat (${n_sum_possibilities.toLocaleString('en').replace(/,/g," ")} ${n_sum_possibilities>1 ? 'lancers' : 'lancer'} sur les ${(6 ** n_dice).toLocaleString('en').replace(/,/g," ")} possibles)*`)};
            });


    },
};