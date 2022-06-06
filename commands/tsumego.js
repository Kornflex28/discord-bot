require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
let canvas = require('canvas');
var glob = require("glob");
const alpha = 'abcdefghjklmnopqrstuvwxyz';
// const offset_letter = 'g';
// let ioffset = alpha.indexOf(offset_letter)+1

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}
module.exports = {
    name: 'tsumego',
    description: 'ok',
    aliases: ['tsu'],
    cooldown: 5,
    async execute(message, args) {
        let problemFiles = glob.sync('./database/tsumego/*/*/*.json')
        let problemFile = problemFiles.random()

        let problemRawData = fs.readFileSync(problemFile);
        let pbJSON = JSON.parse(problemRawData);
        let pbName = problemFile.split('/').slice(3,6).join(' - ').slice(0,-5);

        console.log(pbJSON);
        console.log(problemFile)

        const text_offset = 20 //px
        const board_size = 800; //px
        const n_rows = 19;
        const n_cols = 19;
        const x_margin = 0.05*board_size; //px
        const y_margin = 0.05*board_size; //px
        
        let cv = canvas.createCanvas(board_size+text_offset, board_size+2*text_offset);
        let ctx = cv.getContext('2d');

        // Board 
        let board_color = '#ffd382';
        ctx.fillStyle = board_color; 
        ctx.fillRect(0, 0, cv.width, cv.height); 

        // Grid
        let square_width  = (board_size-x_margin-text_offset)/n_rows;
        let square_height = (board_size-y_margin-text_offset)/n_cols;
        let grid_color = "#000000";
        ctx.strokeStyle = grid_color;
        ctx.lineWidth = 1;
        ctx.fillStyle = grid_color;
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        for (let icol=0;icol<n_cols;icol++) {
            ctx.moveTo(x_margin+icol*square_width, y_margin+text_offset);
            ctx.lineTo(x_margin+icol*square_width, board_size-y_margin);
            ctx.stroke();
            ctx.fillText(`${alpha[icol].toUpperCase()}`, x_margin+icol*square_width, 1.5*text_offset);
        }
        for (let irow=0;irow<n_rows;irow++) {
            ctx.moveTo(x_margin, text_offset+y_margin+irow*square_height);
            ctx.lineTo(board_size-x_margin-text_offset, text_offset+y_margin+irow*square_height);
            ctx.stroke();
            ctx.fillText(n_rows -irow,cv.width-text_offset-x_margin, text_offset+y_margin+irow*square_height );
        }

        // Sentence
        let sent;
        if (pbJSON['C'].includes('Black')) {
            sent = 'Noir joue';
        } else {
            sent = 'Blanc joue';
        }
        ctx.font = "30px Arial";
        ctx.fillText(sent.toUpperCase(),board_size/2, cv.height-1.5*text_offset);

        // Pieces
        let stroke_color = '#000000';
        ctx.strokeStyle = stroke_color;
        ctx.lineWidth = 1;

        // Black pieces
        let piece_color = '#000000';
        ctx.fillStyle = piece_color;
        for(let pos of pbJSON['AB']) {
            // let icol = alpha.indexOf(pos[0])-ioffset
            let icol = alpha.indexOf(pos[0])
            let irow = alpha.indexOf(pos[1])
            text_pos = `${alpha[icol]}${irow+1}`
            // console.log(pos,text_pos)
            ctx.beginPath();
            ctx.arc(x_margin+icol*square_width, text_offset+y_margin+irow*square_height, square_width/2.3, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }

        // White pieces
        piece_color = '#FFFFFF';
        ctx.fillStyle = piece_color;
        for(let pos of pbJSON['AW']) {
            // let icol = alpha.indexOf(pos[0])-ioffset
            let icol = alpha.indexOf(pos[0])
            let irow = alpha.indexOf(pos[1])
            ctx.beginPath();
            ctx.arc(x_margin+icol*square_width, text_offset+y_margin+irow*square_height, square_width/2.1, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }

        // Solution
        // let icol_sol = alpha.indexOf(pbJSON['SOL'][0][1][0])-ioffset
        let icol_sol = alpha.indexOf(pbJSON['SOL'][0][1][0])
        let irow_sol = alpha.indexOf(pbJSON['SOL'][0][1][1])
        text_sol = `${alpha[icol_sol]}${n_rows-irow_sol}`
        // console.log(alpha[icol_sol]+alpha[irow_sol])
        // console.log(text_sol)
        
        message.channel.send('' , { files: [{ attachment: cv.toBuffer(), name: 'tsumego.jpg' }] })
        .then( (msg) => {
            msg.channel.send(`${pbName}\nSolution possible: || ${text_sol.toUpperCase()} ||`);
        });
    }
}