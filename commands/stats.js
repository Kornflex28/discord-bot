
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
// require('chartjs-plugin-datalabels');
const Usercommands = require("../database/uc.js");
Usercommands.setURL(process.env.LEVELS_DB_URL);

const excludedCommands = ['reload','stats'];
module.exports = {
    name: 'stats',
    description: 'Quelques infos sur les échanges entre moi-même et le serveur',
    cooldown: 2,
    usage: '<> pour des stats sur toutes les commandes ou <"members"> pour des stats sur les membres du serveur',
    aliases: ['stat'],
    async execute(message, args) {

        let guildCommands = await Usercommands.fetchGuildCommands(message.guild.id)
        let totalGuildCommandsCount = new Map()
        let totalUserCommandsCount = new Map()
        for (let userGuild of guildCommands) {
            let userCommandsCount = 0
            for (let [com, value] of userGuild.commands) {
                if (!excludedCommands.includes(com)) {
                    if (!totalGuildCommandsCount.has(com)) { totalGuildCommandsCount.set(com, [value,[[userGuild.userID,value]]]) }
                    else { 
                        [old_val,userList] = totalGuildCommandsCount.get(com);
                        userList.push([userGuild.userID,value])
                        totalGuildCommandsCount.set(com, [value + old_val, userList]) 
                    }
                    userCommandsCount += value
                }
            }
            totalUserCommandsCount.set(userGuild.userID, userCommandsCount)
        }

        let totalCommandsCounts_ = Array.from(totalGuildCommandsCount).sort(function (a, b) {
            return b[1][0] - a[1][0];
        })
        let totalUserCommandsCounts_ = Array.from(totalUserCommandsCount).sort(function (a, b) {
            return b[1] - a[1];
        })

        // console.log(totalCommandsCounts_)
        // console.log(totalUserCommandsCounts_.map(el=>message.guild.members.cache.get(el[0]).user.username))

        const width = 1920; //px
        const height = 1080; //px
        const bg = {
            id: 'custom_canvas_background_color',
            beforeDraw: (chart) => {
                const ctx = chart.canvas.getContext('2d');
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            }
        };

        barColor = 360*Math.random()
        let configuration;
        let canvasRenderService;
        if (!args.length) {
            canvasRenderService = new ChartJSNodeCanvas({ width, height });
            configuration = {
                type: 'bar',
                data: {
                    labels: totalCommandsCounts_.map(x => x[0]),
                    datasets: [{
                        label: 'Nombre d\'appel',
                        data: totalCommandsCounts_.map(x => x[1][0]),
                        backgroundColor:`hsl(${barColor},100%,70%)`,
                        borderColor:`hsl(${barColor},100%,25%)`,
                        borderWidth: 3,
                        borderRadius:10,
                    }]
                },
                plugins: [bg],
                options: {
                    plugins: {
                        title : {
                            display: true,
                            text:`Nombre d'appels par commande sur ${message.guild.name}`,
                            font : {
                                weight : 'bold',
                                size: 40
                            }
                        },
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                font : {
                                    size: 20
                                }
                            }
                        },
                        y: {
                            ticks: {
                                font : {
                                    size: 40
                                }
                            }
                        }
                    }
                }
            };
        } else if (args[0] === 'members') {
            canvasRenderService = new ChartJSNodeCanvas({ width, height });
            configuration = {
                type: 'bar',
                data: {
                    labels: totalUserCommandsCounts_.map(el=>message.guild.members.cache.get(el[0]).user.username),
                    datasets: [{
                        label: 'Nombre d\'appel',
                        data: totalUserCommandsCounts_.map(x => x[1]),
                        backgroundColor:`hsl(${barColor},100%,70%)`,
                        borderColor:`hsl(${barColor},100%,25%)`,
                        borderWidth: 3,
                        borderRadius:10,
                    }]
                },
                plugins: [bg],
                options: {
                    plugins: {
                        title : {
                            display: true,
                            text:`Nombre d'appels par membre de ${message.guild.name}`,
                            font : {
                                weight : 'bold',
                                size: 40
                            }
                        },
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                font : {
                                    size: 20
                                }
                            }
                        },
                        y: {
                            ticks: {
                                font : {
                                    size: 40
                                }
                            }
                        }
                    }
                }
            };
        }
        else {
            const commandName = args[0].toLowerCase();
		    const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            if (!command) return message.channel.send(`Je n'ai pas de face avec le nom ou l'alias \`${commandName}\` ! (N\'hésite pas à tenter \`!help stats\`)`);

            commandStats = totalCommandsCounts_.find(e=>e[0]===command.name)[1][1];
            // console.log(commandStats)
            canvasRenderService = new ChartJSNodeCanvas({ 
                width:height, 
                height:height, 
                // plugins: {
                //     requireLegacy: ['chartjs-plugin-datalabels']
                // }
            });
            configuration = {
                type: 'doughnut',
                data: {
                    labels: commandStats.map(el=>message.guild.members.cache.get(el[0]).user.username),
                    datasets: [{
                        label: 'Nombre d\'appel',
                        data: commandStats.map(x => x[1]),
                        // backgroundColor:`hsl(${barColor},100%,70%)`,
                        // borderColor:`hsl(${barColor},100%,25%)`,
                        borderWidth: 3,
                        borderRadius:10,
                    }]
                },
                plugins: [bg],
                options: {
                    plugins: {
                        title : {
                            display: true,
                            text:`Répartition des appels de ${command.name} sur ${message.guild.name}`,
                            font : {
                                weight : 'bold',
                                size: 40
                            }
                        },
                        legend: {
                            display: true,
                            labels:{
                                font : {
                                    size: 30
                                }
                            }
                        },
                        // labels: {
                        //     render: 'percentage',
                        //     fontColor: '#fff',
                        // }
                    },
                }
            };

        }
        const image = await canvasRenderService.renderToBuffer(configuration);
        message.channel.send({
            files: [image]
        })

    },
};
