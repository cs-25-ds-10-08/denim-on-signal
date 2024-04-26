const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;


let clientName = ""

const myFormat = printf(info => {
  return `${clientName} // ${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});


export function getLogger (l, level='info') {  
    
  const consol = new transports.Console();  

  let x =  createLogger({
              level : level, // comment out this file to remove debug messages
              format: combine(
                format.colorize(),        
                label({ label: `${l}` }),
                timestamp(),
                myFormat
              ),
              transports: [consol]
           });

  x.setClienName = (n) => {clientName = n}   
  return x
}