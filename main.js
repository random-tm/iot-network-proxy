import axios from "axios";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import config from "./config/index.js";
import parseQueryString from "./util/query.js";

const app = new Koa();
app.use(bodyParser());
const activeRetires = {};

app.use(async ctx => {
    const requestPath = ctx.request.path;
    if(config.white_listed_paths.includes(requestPath)){
        try {
            const requestParams = parseQueryString(ctx.request);
            console.log(requestParams);
            if(requestParams.publishKey == config.publish_key){
                const targetUrl = `http://${config.target_ip}:${config.target_port}${requestPath}`;
                axios.post(targetUrl, requestParams).catch(() => {
                    console.log("Failed request");
                    //Dynamic type check fails here so do an explicit conversion
                    if(new Boolean(requestParams.retry) == true){
                        retryLoop(targetUrl, requestParams);
                    }
                })
            }
        } catch {
            console.warn("Invalid request recieved");
        }
    }
});

app.listen(config.service_port);

const retryLoop = (targetUrl, requestParams) => {
    console.log("Executing retry");
    if(activeRetires[requestParams.retryState]){
        clearTimeout(activeRetires[requestParams.retryState]);
        activeRetires[requestParams.retryState] = undefined;
    }
    axios.post(targetUrl, requestParams).catch(() => {
        activeRetires[requestParams.retryState] = setTimeout(() => {
            retryLoop(targetUrl, requestParams);
        }, 1000 * 60 * 5)
    })
}