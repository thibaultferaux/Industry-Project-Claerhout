in roof detection hebben we alles rond het ai model gedaan. wanneer de applicatie gedraaid worden hieruit geen bestanden gebruikt.
uitleg van alle bestanden en mappen:
    model/best.pt: dit is ons ai model dat we gebruiken
    test-images: images waarop je het ai model wil testen
    data.yaml: yaml file voor het trainen van het ai model. absoluut pad naar folders met images om ai model mee te trainen. info over de verschillende klasses. images moet je lokaal hebben staan of wordt opgehaald van de url.
    predict-images: als je de resultaten van het model op een aantal images wil.
    predict-perimter: omtrek platte daken van bepaalde images berekenen.
    predict-ratio: ratio platte en hellende daken berekenen van bepaalde images berkenen.
    predict-serface-area: oppervlakte platte daken berekenen van bepaalde images berekenen.
    train-model: als je het model lokaal wil trainen.