import * as firebase from 'firebase-admin'
import  * as serviceAccount from './path/to/account_admin.json' 

export class ConFirebase{
    params = {
        type: serviceAccount.type,
        projectId: serviceAccount.project_id,
        privateKeyId: serviceAccount.private_key_id,
        privateKey: serviceAccount.private_key,
        clientEmail: serviceAccount.client_email,
        clientId: serviceAccount.client_id,
        authUri: serviceAccount.auth_uri,
        tokenUri: serviceAccount.token_uri,
        authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
        clientC509CertUrl: serviceAccount.client_x509_cert_url
      }
         
      iniciar(){
        try{
            firebase.initializeApp({
                credential: firebase.credential.cert(this.params),
              });
            return true;
        }
        catch(e){
            return false;
        }
      }
}