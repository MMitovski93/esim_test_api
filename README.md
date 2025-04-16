Bulking Messagin Api using expressjs, Firebase, FireStore and Firebase Storage.
To setup configuration populate the config.json file on the root of the project. Example provided.
{
    "firebase":{
        "db": {
            "type": "service_account",
            "project_id": "project id",
            "private_key_id": "private key",
            "private_key": "-----BEGIN PRIVATE KEY-----\nyour pricate key\nYqREOt9a/b5L/Kf/ZgFX\n-----END PRIVATE KEY-----\n",
            "client_email": "client email",
            "client_id": "client id",
            "auth_uri": "auth url",
            "token_uri": "token uri",
            "auth_provider_x509_cert_url": "token provider",
            "client_x509_cert_url": "url",
            "universe_domain": "domain"
        },
        "storage":{
            "bucket_url":"you bucket url"
        }
    },
    "twilio":{
        "account_sid":"twilio sid",
        "auth_token":"twilio auth token",
        "sender_number":"sender number needs to be verified"
    },
    "telna_mock_api":{
        "send_to_number":"send to number - needs to be twilio verified to accept messages for testing"
    }
}

Firebase -> db credentials can be found in firebase console. After creating project go to project settings, service-account and generate new private key to generate new json file.
