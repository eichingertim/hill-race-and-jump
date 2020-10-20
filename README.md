## [Programmierung und Design von WebApplications mit HTML5, CSS3 und JavaScript](https://lsf.uni-regensburg.de/qisserver/rds?state=verpublish&status=init&vmfile=no&publishid=158883&moduleCall=webInfo&publishConfFile=webInfo&publishSubDir=veranstaltung) ##

SS2020 

Leitung: Dr. Friedrich Wünsch, Louis Ritzkowski

# FIA Formula HILL #

> Entwickler: Tim Eichinger | MtrklNr: `2089449` | [Kontakt]("mailto:tim1.eichinger@stud.uni-regensburg.de")

### Beschreibung ###

Die Grundidee des Spiels ist ein Auto das sowohl steile Hügel als auch tiefe Schluchten überqueren muss, um ans Ziel zu gelangen. Dabei steht aber nur begrenzt Sprit zu Verfügung, der unter der Fahrt zwar duch einsammeln von Kanistern aufgefüllt werden kann, jedoch, je nach Schwierigkeitsgrad, immer seltener spawnt.
Das Auto kann auch fliegen. Jedoch wird dafür immer eine große Menge Sprit verbraucht.

Der Nutzer hat dabei die Auswahl aus 3 Schwierigkeitsgraden: **EASY**, **MIDDLE**, und **HARD**

### Umsetzung ###

Das Spiel wurde mit einem Objektorientiertem Ansatz entwickelt. Heißt jeder Bestandteil besitzt soweit erforderlich ein eigenes Modul/Klasse. Ein `Car` beinhaltet dabei einen `Player`, einen `Body` und zwei `Wheels`. Zusätzlich gibt es noch eine Zielflagge (`Target`), eine Tankanzeige (`Fuel`) und eine Stoppuhr (`StopWatch`). 

Physikalisch gesehen wurde das Prinzip der schiefen Ebene (Hangabtriebskraft) implementiert, um Beschleunigungen bergauf/bergab realistisch zu gestalten.

Für die Erstellung des Bodens (`Ground`), wurde nicht auf `Math.random()` gesetzt sondern auf eine Klasse die die `Perlin Noise` berechnet. Dadurch wird eine möglichst realistische Generierung des Bodens möglich.


### Steuerung (Falls Spiel) ###

* ` > (Pfeil Rechts)`: Gas
* ` < (Pfeil Links)`: Bremse und Rückwärts
* ` space (Leertaste)`: Springen

### Wichtige Klassen/Dateien ###

* `src/index.js`: Einstieg in die WebApp
* `src/game/game.js`: Zusammenführen der einzelnen Module und bearbeiten von Listener, GameOver-Screen und Musik.
* `src/car/car.js`: Erstellung und verarbeitung des Autos. Berechnung von Position, Geschwindigkeit und Inputs.
* `src/game/ground.js`: Erstellung des Bodens, Spwanpunkte von Grässern, Kanistern und Schluchten und Schlucht-/Loch-Detection.

### Designentscheidungen ###

Beim Design wurde sich an dem bekannten Mobile Game **Hill Climb Racing** von [FingerSoft]("https://play.google.com/store/apps/details?id=com.fingersoft.hillclimb&hl=de&gl=US") orientert. 

### Bekannte Fehler & Verbesserungsvorschläge

Die Collision Detection lässt an manchen Stellen noch zu Wünschen übrig und die ein oder andere physikalische Gesetzmäßigkeit könnte noch implementiert werden um etwas realistischer zu werden.
Hin und wieder treten kleine Sound-Bugs auf, die vermutlich mit den Animation-Frames zu tun haben. 

### Quellen

* **Formula One Theme**: https://www.youtube.com/watch?v=8AYy-BcjRXg
* **Car Driving Sounds**: https://www.fesliyanstudios.com/
* **Background**: https://www.wallpapertip.com/wpic/hmiwhT_hill-climb-racing-2-hd/
* **Finish Flag**: https://pixabay.com/vectors/search/checkered%20flag/
* **Icons**: https://material.io/resources/icons/
* **Car Pics**: https://github.com/Code-Bullet/Hill-Climb-Racing-AI/tree/master/Pics
