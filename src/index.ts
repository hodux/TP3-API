import app from './app';
import {config} from "./config/config.ts"; // Importer l'application configurée

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`Server up successfully - Running on localhost:${PORT}`);
});
