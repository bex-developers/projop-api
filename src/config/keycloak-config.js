var session = require('express-session');
var Keycloak = require('keycloak-connect');

let _keycloak;

var keycloakConfig = {
    clientId: 'projop-api',
    bearerOnly: true,
    serverUrl: 'https://idp.bex.com.pe:8443/auth/',
    realm: 'bex-soporte',
    //realmPublicKey:'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAreMm6oV2lgLnUQ7SUW85fpXqgyJK48NoYLn11IWvEBOz6y3elhEN1d9y0XSpe8/+UAEinPPix7SPp+hKi/+SsWnAGTBjvb0kBriBIzXBHzdd6UfwwRRKRP+VfPYhm+xw9ie545HiT99/aN5uAZhHpbF2kECXgT+QVj1Xh171CR1EVNuVCFa6l2xg76mPa/YDslkl0o98DZvlm1jtR/iTWxvMwWmJnQnybOT3Jyk8PUrUjhqCmmvGuVPMl+zD3Rt32ZK83M66ee7JchI/R3DBVFzH8VaKbWkZmpui7ywHhKCYDpBANN6V1Dw72kMG3GPTriEbNYUrK0lSQLSSouAVQwIDAQAB'
    credentials: {
        secret: 'f70a3643-5961-462a-b982-8c29f2fb0de8'
    }
}

// function initKeycloak() {
//     if (_keycloak) {
//         console.warn("Trying to init Keycloak again!");
//         return _keycloak;
//     } 
//     else {
//         console.log("Initializing Keycloak...");
//         var memoryStore = new session.MemoryStore();
//         _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
//         console.log('logiiin',_keycloak)
//         return _keycloak;
//     }
// }

function initKeycloak() {
    
    if (_keycloak) { 
       console.warn("Trying to init Keycloak again!"); 
       return _keycloak; 
    } 
    else { 
        console.log("Initializing Keycloak..."); 
        var memoryStore = new session.MemoryStore();
        _keycloak = new Keycloak({ store: memoryStore }, 
        keycloakConfig); 
        return _keycloak; 
    } 
}

function getKeycloak() {
    if (!_keycloak){
        console.error('Keycloak has not been initialized. Please called init first.');
    } 
    return _keycloak;
}

module.exports = {
    initKeycloak,
    getKeycloak
};