import httpApp from './app'; // Importer l'application configurée

const PORT = process.env.PORT || 3000;

// Démarrer le serveur
if (process.env.NODE_ENV == "prod") {
    httpApp.listen(3000, '0.0.0.0');
    console.log("Launching on HTTP for PROD")
} else if (process.env.NODE_ENV == "dev") {

    console.log("Launching on HTTPS for DEV")
}