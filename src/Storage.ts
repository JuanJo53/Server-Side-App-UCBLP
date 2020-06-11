// Imports the Google Cloud client library
import * as db from '@google-cloud/storage'
import  * as serviceAccount from './path/to/cloud_storage.json' 
// Creates a client
// Creates a client from a Google service account key.
 const storage = new db.Storage({keyFile:"./path/to/account_admin.json",credentials:{
    client_email:serviceAccount.client_email,
private_key:serviceAccount.private_key},projectId:"grand-citadel-275922"});
 export default storage;
/**
 * TODO(developer): Uncomment these variables before running the sample.
 */

 