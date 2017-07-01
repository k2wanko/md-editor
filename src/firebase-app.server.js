import * as Functions from 'firebase-functions'
import * as Admin from 'firebase-admin'

export default Admin.initializeApp(Functions.config().firebase)
