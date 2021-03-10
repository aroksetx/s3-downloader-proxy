const restify = require('restify');
const axios = require('axios');
const cors = require('cors');
var timeout = require('connect-timeout');

const base64Decode = (data64) => {
    let buff = new Buffer.from(data64, 'base64');
    return buff.toString('ascii');
}


const server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
  });
  
  server.use(restify.plugins.acceptParser(server.acceptable));
  server.use(restify.plugins.bodyParser());
  server.pre(restify.pre.sanitizePath());
  server.use(restify.plugins.queryParser({
    mapParams: true
  }));

  
server.use(cors({ origin: true }));
server.use(timeout('60s'))
server.use(haltOnTimedout)

function haltOnTimedout (req, res, next) {
    if (!req.timedout) next()
  }


function haltOnTimedout (req, res, next) {
    if (!req.timedout) next()
  }
 
/**
 * 
 * Object data
 * {s3url: string, filename: string, format: string}
 * 
 */
  server.get('/get', function (req, res, next) {
    if(!req.params.hasOwnProperty('data')){
        res.send({error: 'no parameters'})
    } else {
        let fileInfo;
        try{
            fileInfo = JSON.parse(base64Decode(req.params.data));
        } catch(e) {
            console.log('Error in baser parse block :> ', e)
        }
       try {
           const requestConfig = {
            url: fileInfo.s3url,
            method: 'GET',
            responseType: 'stream'
          }
        axios(requestConfig).then(response => {
           try{
                res.setHeader('Content-disposition', `attachment; filename=${fileInfo.filename}.${fileInfo.format}`);
                response.data.pipe(res)
           }catch(e) {
            console.log('Response error catch :> ', e)
           }
          })
       } catch(e) {
           console.log('Error in request block :> ', e)
       }
        
    }
  });

  
  server.get('*', (req, res, next) => {
    res.send("hello world");
  });

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
  });