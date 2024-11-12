import httpApp from './app'; // Importer l'application configurée

const PORT = process.env.PORT || 3000;

httpApp.listen(PORT, () => {
    console.log(`Server up successfully - Running on localhost:${PORT}`);
});
