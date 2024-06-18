hier is de uitleg over wat de verschillende mappen in dit project doen.
app: frontend draaien.
client-api: requests van frontend opvangen, images via azure maps genereren en opslaan in een blob storage en storage queue, job aanmaken in cosmos
processing-api: images uit de storage queue processen in het ai model en berekeningen doen, resultaten schrijven naar cosmos en email sturen als job klaar is.
roof-detection: ai model trainen en berekeningen op het ai model
docker-compose: om lokaal het project te gebruiken