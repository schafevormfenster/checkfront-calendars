# Checkfront Calendar Data

## Architecture approach

List of all items --> Msste eine Liste der "Reiseangebote" sein

https://localtour.checkfront.com/api/3.0/item

Item Detail: https://localtour.checkfront.com/api/3.0/item/213

Item Cal: https://localtour.checkfront.com/api/3.0/item/213/cal

More dates: https://localtour.checkfront.com/api/3.0/item/213/cal?end_date=20211030

Ansatz:

Feste liste an Kategorien (präferiert) oder Items, die wir bei uns setzen. Die Location für den
Termin müssen wir manuell setzen bspw. pro Kategorie (Kategorie = Anbieter)

Mapping: Eine Kategorie wird bei uns im Sanity ein Organizer. Ein Organizer muss dann einen Type
"localtours" haben können? Ein Organizer muss dann eine Default-Adresse (Place + Community) haben.

-> https://localtour.checkfront.com/api/3.0/item?categoryid=63 Hier kommen bereits Texte und Bilder
für jedes Item mit. (categoryid (integer) – Filter items by category.) --> nicht rated

Mapping: Jedes Item machen wir im Sanity zu einem Kalender. Kalender bekommen einen Typ
(GoogleCalendar|VEVG|Localtours)

Für jedes Item die /cal Termindaten holen. Mit Enddate-Angabe in 3 Monaten ->
https://localtour.checkfront.com/api/3.0/item/178/cal?end_date=20211030

Für jeden Termin mit >0 (also Verfgbarkeit), wird dann ein JSON erzeugt -> Item Daten plus Datum =
Event JSON

!! Die Datapipelines können super damit arbeiten, wenn wir pro Termin ein JSON mit je allen Daten
haben.

Ein Gulp Flow wäre zweiteilig.

1: Kalender/Angebote holen (selten, 1x wöchentlich oder monatlich)

Hole alle Organiser mit Typ localtours vom Sanity Für jeden Organizer holen per Kategore-Id alle
Items (=Kalender) Erstelle/Aktualisiere für jeden Item einen Kalender im Sanity 2: Termine holen

Hole alle Localtour-Kalender vom Sanity (damit haben wir die Item ID) Hole die Details des Items (=
Kalenders) und speicher die zwischen (JSON) Hole für jeden Kalender (JSON als Input) die Termine und
erstelle für jeden Tag mit >0 ein event JSON, welches zusammengesetzt wird aus: Datum aus /cal
Termindetails/Bild usw. aus dem Kalender-JSON (=Item) Referenz zu Place und Village aus dem
Organizer Und dann Push ins Sanity -->

Dann aus den Terminen mit allen Details jeweils einen Ganztagesevent erstellen. Auch ein Bild mit
anfügen per URL. Zum Detail dann optional noch das Buchungs-Widget.

Wie oft aktualisieren wir? Einmal pro Woche? Und dann immer alle?
