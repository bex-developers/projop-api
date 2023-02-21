//var session = require('express-session');
const session = require('express-session')
//var memoryStore = new session.MemoryStore();
//const memoryStore = new session.MemoryStore();
const Keycloak = require('keycloak-connect');
//Cargamos archivo de configuracion

const config =  require('./config/config.js');

/* require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
}); */
//require('dotenv').config();
//require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })




const bodyParser = require("body-parser");
var cors=require('cors');
var express = require('express');
var app = express();

const memoryStore = new session.MemoryStore();
// const keycloak = require('./config/keycloak-config.js').initKeycloak();
// app.use(keycloak.middleware());

const { getTickets } = require('./controllers/index.controller');
const { getTicketsAdmin } = require('./controllers/index.controller');
const { getTicketsHelpDesk } = require('./controllers/index.controller');
const { getCompanyInfo } = require('./controllers/index.controller');
const { types } = require('./controllers/index.controller');
const { priority } = require('./controllers/index.controller');
const { catalog } = require('./controllers/index.controller');
const { customer_project } = require('./controllers/index.controller');
const { support_project } = require('./controllers/index.controller');
const { customer_company } = require('./controllers/index.controller');
const { customer_class } = require('./controllers/index.controller');
const { system } = require('./controllers/index.controller');
const { status_ticket } = require('./controllers/index.controller');
const { solution_category } = require('./controllers/index.controller');
const { create_ticket } = require('./controllers/index.controller');
const { getTicketsAll } = require('./controllers/index.controller');
const { getCatalog } = require('./controllers/index.controller');
const { getCatalogPage } = require('./controllers/index.controller');
const { getServiceCatalog } = require('./controllers/index.controller');
const { create_service } = require('./controllers/index.controller');
const { getTechSystem } = require('./controllers/index.controller');
const { getBtpService } = require('./controllers/index.controller');
const { getCertInstance } = require('./controllers/index.controller');
const { getPse } = require('./controllers/index.controller');
const { getCert } = require('./controllers/index.controller');
const { getRootCatalog } = require('./controllers/index.controller');
const { getParentCatalog } = require('./controllers/index.controller');
const { getChildCatalog } = require('./controllers/index.controller');
const { getAllCatalog } = require('./controllers/index.controller');


// let kcConfig = {
//  clientId: 'projop-api',
//   bearerOnly: true,
//   serverUrl: 'https://idp.bex.com.pe:8443/auth/',
//   realm: 'bex-soporte',
//   realmPublicKey:'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAreMm6oV2lgLnUQ7SUW85fpXqgyJK48NoYLn11IWvEBOz6y3elhEN1d9y0XSpe8/+UAEinPPix7SPp+hKi/+SsWnAGTBjvb0kBriBIzXBHzdd6UfwwRRKRP+VfPYhm+xw9ie545HiT99/aN5uAZhHpbF2kECXgT+QVj1Xh171CR1EVNuVCFa6l2xg76mPa/YDslkl0o98DZvlm1jtR/iTWxvMwWmJnQnybOT3Jyk8PUrUjhqCmmvGuVPMl+zD3Rt32ZK83M66ee7JchI/R3DBVFzH8VaKbWkZmpui7ywHhKCYDpBANN6V1Dw72kMG3GPTriEbNYUrK0lSQLSSouAVQwIDAQAB'
  
// };
//const keycloak = require('./config/keycloak-config.js').initKeycloak(memoryStore);
//let keycloak = new Keycloak({ store: memoryStore }, kcConfig);
/* app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
}); 
*/
app.use(cors({origin:true,credentials: true}));
//app.use( keycloak.middleware() )
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Agregamos
app.use(session({ secret: 'f70a3643-5961-462a-b982-8c29f2fb0de8', resave: false, saveUninitialized: true, store: memoryStore }));

const keycloak = new Keycloak({
  store: memoryStore
});

app.use(keycloak.middleware({
  // logout: '/logout',
  // admin: '/'
}));


// app.get('/tickets/:company_id/:fecha_inicial/:fecha_final', keycloak.protect(['customer','helpdesk']), getTickets);
// app.get('/ticketsAdmin/:fecha_inicial/:fecha_final', keycloak.protect(['admin']), getTicketsAdmin);
// app.get('/ticketsHelpDesk/:person_id/:fecha_inicial/:fecha_final', keycloak.protect(['helpdesk']), getTicketsHelpDesk);
// app.get('/tickets/company_info/:company_id', keycloak.protect(['customer','helpdesk']), getCompanyInfo);
// app.get('/tickets/types',keycloak.protect(['customer','helpdesk', 'admin']), types);
// app.get('/tickets/priority',keycloak.protect(['customer','helpdesk', 'admin']), priority);
// app.get('/tickets/catalog',keycloak.protect(['customer','helpdesk', 'admin']), catalog);
// app.get('/tickets/solution_category',keycloak.protect(['customer','helpdesk', 'admin']), solution_category);
// app.get('/tickets/customer_project/:company_id',keycloak.protect(['customer','helpdesk']), customer_project);
// app.get('/tickets/customer_company/:company_id',keycloak.protect(['customer','helpdesk']), customer_company);
// app.get('/tickets/customer_class',keycloak.protect(['customer','helpdesk', 'admin']), customer_class);
// app.get('/tickets/system/:company_id',keycloak.protect(['customer','helpdesk']), system);
// app.get('/tickets/support_project/:company_id',keycloak.protect(['customer','helpdesk']), support_project);
// app.get('/tickets/status_ticket',keycloak.protect(['customer','helpdesk', 'admin']), status_ticket);

app.get('/tickets/:company_id/:fecha_inicial/:fecha_final', getTickets);
app.get('/ticketsAdmin/:fecha_inicial/:fecha_final', getTicketsAdmin);
app.get('/ticketsHelpDesk/:person_id/:fecha_inicial/:fecha_final', getTicketsHelpDesk);
app.get('/tickets/company_info/:company_id', getCompanyInfo);
app.get('/tickets/types', types);
app.get('/tickets/priority', priority);
app.get('/tickets/catalog', catalog);
app.get('/tickets/solution_category', solution_category);
app.get('/tickets/customer_project/:company_id', customer_project);
app.get('/tickets/customer_company/:company_id', customer_company);
app.get('/tickets/customer_class', customer_class);
app.get('/tickets/system/:company_id', system);
app.get('/tickets/support_project/:company_id', support_project);
app.get('/tickets/status_ticket', status_ticket);
app.post('/tickets/create_ticket', create_ticket);
app.get('/tickets/:company_id', getTicketsAll);
app.get('/service_catalog', getCatalog);
app.get('/service_catalogpage', getCatalogPage);
app.get('/service-catalog/:category_id', getServiceCatalog);
app.post('/service_catalog/create_service', create_service);
app.get('/tech-system/:company_id', getTechSystem);
app.get('/btp-service/:company_id', getBtpService);
app.get('/cert-instance/:company_id', getCertInstance);
app.get('/pse/:conf_item_id', getPse);
app.get('/cert/:conf_item_id', getCert);
app.get('/root-catalog', getRootCatalog);
app.get('/parent-catalog/:parent_id', getParentCatalog);
app.get('/child-catalog/:parent_id', getChildCatalog);
app.get('/all_catalog/', getAllCatalog);


//app.get('/tickets/:company_id/:fecha_inicial/:fecha_final', getTickets);


//app.listen(port);
console.log(`Running in NODE_ENV=${config.NODE_ENV}`);
console.log('The value of PORT is:', config.PORT);
//const port = config.PORT;
const port = config.PORT;
app.listen(port, () =>
  console.log(`listening on port ${port}`)
);
//app.listen(port);

app.get('/', function(req, res){
   //res.send("Server is up!");
   res.json({status: 'API is ready listen request from ' + config.PORT});
});



// if port 8080 is not available, use port 3000
// const port = 3000;
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
