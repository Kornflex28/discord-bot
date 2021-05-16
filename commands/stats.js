
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
// require('chartjs-plugin-datalabels');
const Usercommands = require("../database/uc.js");
Usercommands.setURL(process.env.LEVELS_DB_URL);

const excludedCommands = ['reload', 'stats'];
module.exports = {
    name: 'stats',
    description: 'Quelques infos sur les échanges entre moi-même et le serveur',
    cooldown: 2,
    usage: '<> pour des stats sur toutes les commandes ou <"members"> pour des stats sur les membres du serveur',
    aliases: ['stat'],
    guildOnly: true,
    async execute(message, args) {

        let guildCommands = await Usercommands.fetchGuildCommands(message.guild.id)
        let totalGuildCommandsCount = new Map()
        let totalUserCommandsCount = new Map()
        for (let userGuild of guildCommands) {
            let userCommandsCount = 0
            for (let [com, value] of userGuild.commands) {
                    if (!totalGuildCommandsCount.has(com)) { totalGuildCommandsCount.set(com, [value, [[userGuild.userID, value]]]) }
                    else {
                        [old_val, userList] = totalGuildCommandsCount.get(com);
                        userList.push([userGuild.userID, value])
                        totalGuildCommandsCount.set(com, [value + old_val, userList])
                    }
                    if (!excludedCommands.includes(com)){
                        userCommandsCount += value
                    }
            }
            totalUserCommandsCount.set(userGuild.userID, userCommandsCount)
        }

        let totalCommandsCounts_ = Array.from(totalGuildCommandsCount).sort(function (a, b) {
            return b[1][0] - a[1][0];
        })
        let totalCommandsCounts_withoutexcluded = Array.from(totalGuildCommandsCount).filter(el => !excludedCommands.includes(el[0])).sort(function (a, b) {
            return b[1][0] - a[1][0];
        })
        let totalUserCommandsCounts__withoutexcluded = Array.from(totalUserCommandsCount).sort(function (a, b) {
            return b[1] - a[1];
        })

        // console.log(totalCommandsCounts_)
        // console.log(totalUserCommandsCounts_.map(el=>message.guild.members.cache.get(el[0]).user.username))

        const width = 1920; //px
        const height = 1080; //px
        const bg = {
            id: 'custom_canvas_background_color',
            beforeDraw: (chart) => {
                var ctx = chart.canvas.getContext('2d');
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
                if (chart.config.centerText){
                if (chart.config.centerText.display !== null &&
                    typeof chart.config.centerText.display !== 'undefined' &&
                    chart.config.centerText.display) {
                    var width = chart.chart.width,
                        height = chart.chart.height,
                        ctx = chart.chart.ctx;

                    ctx.restore();
                    var fontSize = (height / 800).toFixed(2);
                    ctx.font = fontSize + "em sans-serif";
                    ctx.textBaseline = "middle";
                    var text = chart.config.centerText.text,
                        textX = Math.round((width - ctx.measureText(text).width) / 2),
                        textY = chart.config.options.layout.padding + Math.round((height + ctx.measureText(text).emHeightAscent) / 2);

                    ctx.fillText(text, textX, textY);
                    ctx.save();
                }}
            }
        };

        barColor = 360 * Math.random()
        let configuration;
        let canvasRenderService;
        const userTarget = message.mentions.members.first();

        // All executions on server by command
        if (!args.length) {
            canvasRenderService = new ChartJSNodeCanvas({
                width,
                height,
                plugins: { requireLegacy: ['chartjs-plugin-datalabels'] }
            });
            configuration = {
                type: 'bar',
                data: {
                    labels: totalCommandsCounts_withoutexcluded.map(x => x[0]),
                    datasets: [{
                        label: 'Nombre d\'éxécution',
                        data: totalCommandsCounts_withoutexcluded.map(x => x[1][0]),
                        backgroundColor: `hsl(${barColor},100%,70%)`,
                        borderColor: `hsl(${barColor},100%,25%)`,
                        borderWidth: 3,
                        // borderRadius:10,
                    }]
                },
                plugins: [bg],
                options: {
                    plugins: {
                        datalabels: {
                            backgroundColor: function (context) {
                                col = context.dataset.backgroundColor.slice(0, context.dataset.backgroundColor.length - 4)
                                col = col + '85%)';
                                return col;
                            },
                            borderColor: function (context) {
                                return context.dataset.borderColor;
                            },
                            borderRadius: 25,
                            borderWidth: 2,
                            color: function (context) {
                                return context.dataset.borderColor;
                            },
                            anchor: 'end',
                            font: {
                                size: 20,
                                weight: 'bold'
                            },
                        }
                    },
                    title: {
                        display: true,
                        text: `Nombre d'éxécutions par commande sur ${message.guild.name}`,
                        fontSize: 40,
                        fontStyle: 'bold',
                    }
                    ,
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            ticks: {
                                fontSize: 20
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                fontSize: 40
                            }
                        }]
                    }
                }
            };
        // All executions on server by members    
        } else if (args[0] === 'members') {
            canvasRenderService = new ChartJSNodeCanvas({
                width,
                height,
                plugins: { requireLegacy: ['chartjs-plugin-datalabels'] }
            });
            configuration = {
                type: 'bar',
                data: {
                    labels: totalUserCommandsCounts__withoutexcluded.map(el => message.guild.members.cache.get(el[0]).user.username),
                    datasets: [{
                        label: 'Nombre d\'éxécution',
                        data: totalUserCommandsCounts__withoutexcluded.map(x => x[1]),
                        backgroundColor: `hsl(${barColor},100%,70%)`,
                        borderColor: `hsl(${barColor},100%,25%)`,
                        borderWidth: 3,
                        // borderRadius: 10,
                    }]
                },
                plugins: [bg],
                options: {
                    plugins: {
                        datalabels: {
                            backgroundColor: function (context) {
                                col = context.dataset.backgroundColor.slice(0, context.dataset.backgroundColor.length - 4)
                                col = col + '85%)';
                                return col;
                            },
                            borderColor: function (context) {
                                return context.dataset.borderColor;
                            },
                            borderRadius: 25,
                            borderWidth: 2,
                            color: function (context) {
                                return context.dataset.borderColor;
                            },
                            anchor: 'end',
                            font: {
                                size: 20,
                                weight: 'bold'
                            },
                        }
                    },

                    title: {
                        display: true,
                        text: `Nombre d'éxécutions par membre de ${message.guild.name}`,
                        fontStyle: 'bold',
                        fontSize: 40
                    },
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            ticks: {
                                fontSize: 20
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                fontSize: 40
                            }
                        }]
                    }
                }
            };
        }
        // All executions for one mentioned user
        else if (userTarget) {
            if (message.guild.me.id === userTarget.id) {
                return message.channel.send('Quelle drôle d\'idée...')
            }
            let userCommands = guildCommands.find(el => el.userID === userTarget.id);
            if (!userCommands) {
                return message.channel.send(`Désolé mais on dirait bien que ${userTarget.user.username} n'a jamais fait appel à moi...`)
            }
            userCommands = Array.from(userCommands.commands).sort(function (a, b) {
                return b[1] - a[1];
            })
            canvasRenderService = new ChartJSNodeCanvas({
                width,
                height,
                plugins: { requireLegacy: ['chartjs-plugin-datalabels'] }
            });
            configuration = {
                type: 'bar',
                data: {
                    labels: userCommands.map(x => x[0]),
                    datasets: [{
                        label: 'Nombre d\'éxécution',
                        data: userCommands.map(x => x[1]),
                        backgroundColor: `hsl(${barColor},100%,70%)`,
                        borderColor: `hsl(${barColor},100%,25%)`,
                        borderWidth: 3,
                        // borderRadius:10,
                    }]
                },
                plugins: [bg],
                options: {
                    plugins: {
                        datalabels: {
                            backgroundColor: function (context) {
                                col = context.dataset.backgroundColor.slice(0, context.dataset.backgroundColor.length - 4)
                                col = col + '85%)';
                                return col;
                            },
                            borderColor: function (context) {
                                return context.dataset.borderColor;
                            },
                            borderRadius: 50,
                            borderWidth: 2,
                            color: function (context) {
                                return context.dataset.borderColor;
                            },
                            anchor: 'end',
                            font: {
                                size: 20,
                                weight: 'bold'
                            },
                        }
                    },
                    title: {
                        display: true,
                        text: `Exécutions de ${userTarget.user.username} sur ${message.guild.name}`,
                        fontSize: 40,
                        fontStyle: 'bold',
                    }
                    ,
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            ticks: {
                                fontSize: 20
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                fontSize: 40
                            }
                        }]
                    }
                }
            };
        }
        // All executions of one command by users
        else if (message.mentions.roles) {
            return message.channel.send('Des statistiques selon les rôles ? Hmm peut-être un jour')
        }
        else {
            const commandName = args[0].toLowerCase();
            const command = message.client.commands.get(commandName)
                || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            if (!command) return message.channel.send(`Je n'ai pas de face avec le nom ou l'alias \`${commandName}\` ! (N\'hésite pas à tenter \`!help stats\`)`);

            commandStats = totalCommandsCounts_.find(e => e[0] === command.name)[1][1];
            // console.log(commandStats)
            canvasRenderService = new ChartJSNodeCanvas({
                width: height,
                height: height,
                plugins: {
                    requireLegacy: ['chartjs-plugin-datalabels'],
                }
            });
            configuration = {
                type: 'doughnut',
                data: {
                    labels: commandStats.map(el => message.guild.members.cache.get(el[0]).user.username),
                    datasets: [{
                        label: 'Nombre d\'éxécution',
                        data: commandStats.map(x => x[1]),
                        backgroundColor: [...Array(commandStats.length).keys()].map(n => `hsl(${360 * n / commandStats.length},100%,70%)`),
                        borderColor: [...Array(commandStats.length).keys()].map(n => `hsl(${360 * n / commandStats.length},100%,25%)`),
                        borderWidth: 3,
                        // borderRadius: 10,
                    }]
                },
                plugins: [bg],
                options: {
                    plugins: {
                        datalabels: {
                            backgroundColor: [...Array(commandStats.length).keys()].map(n => `hsl(${360 * n / commandStats.length},100%,85%)`),
                            borderColor: function (context) {
                                return context.dataset.borderColor;
                            },
                            borderRadius: 25,
                            borderWidth: 2,
                            color: function (context) {
                                return context.dataset.borderColor;
                            },
                            formatter: function (value, context) {
                                return `${value} - ${Math.round(100 * (value / context.dataset.data.reduce((a, b) => a + b, 0)))} %`;
                            },
                            anchor: 'center',
                            font: {
                                size: 20,
                                weight: 'bold'
                            },
                        }
                    },
                    layout: {
                        padding: 50
                    },
                    title: {
                        display: true,
                        text: `Répartition des éxécutions de !${command.name} sur ${message.guild.name}`,
                        fontStyle: 'bold',
                        fontSize: 40
                    },
                    legend: {
                        display: true,
                        labels: {
                            fontSize: 30
                        }
                    },

                },
                centerText: {
                    display: true,
                    text: `${commandStats.map(x => x[1]).reduce((a, b) => a + b, 0)} éxécution${commandStats.map(x => x[1]).reduce((a, b) => a + b, 0)>1?'s':''}`
                }
            }
        }
        const image = await canvasRenderService.renderToBuffer(configuration);
        message.channel.send({
            files: [image]
        })

    },
};
