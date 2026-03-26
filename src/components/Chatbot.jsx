import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== ZNALOSTNÁ BÁZA PRE VŠETKY JAZYKY ====================
const LOGS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyU4h9NGBAienVI_2miL7IVoKhpTMch8UUQy9Un2OKW8nMQOMruATn0NUPKRBxMxTTbYg/exec';

const knowledgeBase = {
    // SLOVENČINA
    sk: [
        { keywords: ['rezervácia', 'rezervovať', 'vopred', 'dopredu', 'book', 'miesto', 'termín', 'skupina', '12 osôb'], answer: 'Rezervácia vopred nie je nutná, ale odporúčame aspoň deň vopred telefonicky si overiť časy splavov, aby ste sa vyhli dlhému čakaniu. Pre väčšie skupiny (viac ako 12 osôb) je potrebné rezervovať minimálne deň vopred, najlepšie 3 dni.' },
        { keywords: ['kde', 'adresa', 'nájsť', 'lokácia', 'mapa', 'prístav', 'Majere'], answer: 'Splav po Dunajci nájdete na adrese: Majere 34, Prešovský kraj. Prístavisko pltí je v Červenom Kláštore.' },
        { keywords: ['dlho', 'trvá', 'dĺžka', 'hodín', 'minút', 'čas', 'km'], answer: 'Dĺžka splavu z Červeného Kláštora do Lesnice je 11 km a trvá približne 1,5 hodiny. Presný čas závisí od aktuálnej výšky vodnej hladiny Dunajca.' },
        { keywords: ['oblečenie', 'oblecť', 'obliecť', 'čo si vziať', 'mikina', 'kraťasy', 'nepremokavé', 'obuv'], answer: 'V lete odporúčame krátke tričko, tielko, kraťasy. So sebou si môžete vziať aj mikinu alebo sveter. V prípade nepriaznivého počasia si vezmite nepremokavé oblečenie a kvalitnú obuv.' },
        { keywords: ['voda', 'zmoknúť', 'zmoknem', 'mokrý', 'špliecha', 'suchou nohou'], answer: 'Do plte sa nastupuje suchou nohou. Počas splavu sa voda v plti nenachádza, ale výnimočne môže špliechnuť pár kvapiek vody na sediacich po kraji.' },
        { keywords: ['náročná', 'ťažká', 'obtiažnosť', 'bezpečné', 'zvládnem'], answer: 'Rieka Dunajec nie je náročná. Plavíte sa s certifikovanými pltníkmi, ktorí majú odjazdené tisíce kilometrov. Nemusíte sa o nič starať, len si užiť plavbu.' },
        { keywords: ['skok', 'skočiť', 'zaplávať', 'plávať', 'voda', 'kúpanie'], answer: 'Nie, skákať do vody počas plavby je zakázané. Návštevný poriadok Pienin to neumožňuje z bezpečnostných a ochranných dôvodov.' },
        { keywords: ['návrat', 'späť', 'dostať sa', 'taxi', 'bicykel', 'pešo', 'chodník'], answer: 'Možností je viacero: pešo chodníkom popri rieke (krásna prechádzka), požičať si bicykel (dospelácke aj detské čakajú na parkovisku), alebo využiť našu taxi službu 9-miestnymi vozidlami. Vyberte si podľa seba!' },
        { keywords: ['pltník', 'stať sa', 'naučiť', 'práca', 'zamestnanie', 'vodičský preukaz'], answer: 'Ak máte záujem stať sa pltníkom, príďte za nami. Skúsený pltník vás zoberie so sebou na plt, kde sa budete učiť. Keď zvládnete celú jazdu sami, starší pltník vás preverí. Pltníci musia mať aj preukaz vodiča malého plavidla, na ktorý sa robia skúšky.' },
        { keywords: ['mimo sezóny', 'zima', 'čo robia', 'práca', 'privirobok'], answer: 'Pltníctvo nie je hlavná práca pre väčšinu pltníkov – je to privirobok. Pracujú tu študenti, dôchodcovia aj ľudia s iným hlavným zamestnaním.' },
        { keywords: ['sezóna', 'kedy', 'jar', 'apríl', 'máj', 'október', 'začiatok', 'koniec'], answer: 'Sezóna zvyčajne začína na jar (apríl, máj) a trvá až do jesene, kým je dostatočná hladina vody. Väčšinou sa dá plaviť ešte aj v októbri.' },
        { keywords: ['čačina', 'predu', 'predok', 'vlna', 'čo je to'], answer: 'Čačina na predu plte slúži na zastavenie vlny vody, ktorá by sa inak vlievala z predu do plte. Je to dôležitý prvok tradičnej pltníckej architektúry.' },
        { keywords: ['poľské', 'polske', 'rýchlejšie', 'architektúra', 'rozdiel'], answer: 'Poľské plte sú užšie a uhol dreva v predu je strmší, čím dosahujú menší odpor vody a väčšiu rýchlosť. Sú však náchylnejšie na špliechanie vody z boku.' },
        { keywords: ['návrat pltí', 'vracajú', 'navijak', 'rozoberajú', 'auto', 'nákladné'], answer: 'Po doplavení sa plte navijakom vytiahnu na breh, ručne sa rozoberú, naložia na nákladné auto a odvezú späť na štart, kde sa znova zložia a spoja lanom na vode.' },
        { keywords: ['váha', 'hmotnosť', 'koľko váži', 'kg', 'ťažká'], answer: 'Plť môže vážiť od 500 kg do 800 kg. Skladá sa z 5 častí, ktoré sú nasiaknuté vodou a sú veľmi ťažké (viac ako 100 kg každá). V plti sú aj náhradné palice, lavičky, záchranné vesty a záchranné kolesá.' },
        { keywords: ['bezpečnosť', 'bezpečné', 'nebezpečné', 'strach'], answer: 'Plavba je bezpečná. Pltníci sú skúsení a postarajú sa o vašu bezpečnosť počas celej plavby. Pre deti sú k dispozícii záchranné vesty.' },
        { keywords: ['hlbka', 'hĺbka', 'hlboký', 'ako hlboký'], answer: 'Hĺbka Dunajca je rôzna – od 30 cm v plytších úsekoch až po 12–18 metrov na niektorých miestach.' },
        { keywords: ['rýchlosť', 'ako rýchlo', 'km/h', 'ide plt'], answer: 'Rýchlosť plte sa nedá presne určiť. Závisí od ponoru plte, výšky hladiny vody a architektúry, podľa ktorej je postavená.' },
        { keywords: ['výroba', 'vyrába', 'kto robí', 'stolár', 'šéf'], answer: 'Plte vyrába náš šéf, ktorý je stolár. Každá plť je ručne vyrobená s dôrazom na tradíciu a kvalitu.' },
        { keywords: ['vyrobiť si', 'vlastná', 'svojpomocne', 'registračné číslo', 'certifikát'], answer: 'Nie, plť je plavidlo a má pridelené registračné číslo ako auto. Na jej výrobu je potrebný certifikát. Plť si nemôžete vyrobiť svojpomocne.' },
        { keywords: ['cena', 'koľko stojí', 'cenník', 'lístok', 'euro', '€', 'dospelý', 'dieťa'], answer: 'Aktuálna cena za dospelú osobu je 25 €. Deti do 14 rokov majú zľavu (zvyčajne 15 €). Študenti a dôchodcovia často 23 €. Presné ceny overte na mieste alebo telefonicky, pretože sa môžu meniť podľa sezóny.' },
        { keywords: ['pes', 'psy', 'zvieratá', 'domáce zviera'], answer: 'Psy sú povolené po dohode na mieste. Majiteľ je zodpovedný za správanie psa počas splavu.' },
        { keywords: ['parkovanie', 'parkovisko', 'auto', 'kde zaparkovať'], answer: 'Parkovisko je k dispozícii priamo pri prístavisku v Majere. Pre našich zákazníkov je parkovanie väčšinou zdarma.' },
        { keywords: ['počasie', 'dážď', 'prší', 'zrušia', 'odložiť'], answer: 'Splav prebieha aj pri miernom daždi. Pri silnom daždi, búrke alebo veľmi vysokej/nízkej hladine vody môže byť splav z bezpečnostných dôvodov zrušený alebo odložený. V takom prípade vás včas informujeme.' },
        { keywords: ['foto', 'fotografovať', 'mobil', 'fotoaparát', 'veci'], answer: 'Fotografovať môžete, ale odporúčame mobil alebo foťák zabezpečiť (napr. vodotesným obalom). Osobné veci si môžete nechať v aute alebo v úschovni na prevádzke.' },
        { keywords: ['platba', 'hotovosť', 'karta', 'OP', 'občiansky'], answer: 'Platba prebieha v hotovosti pred splavom na prevádzke.' },
        { keywords: ['toaleta', 'wc', 'záchod', 'hygiena', 'kde ísť'], answer: 'Toalety sú k dispozícii pri nástupnom mieste (prístavisku). Počas samotného splavu sa zastávky na toaletu nerobia.' },
        { keywords: ['jazyk', 'anglicky', 'poľsky', 'sprievodca', 'výklad'], answer: 'Pltníci často poskytujú výklad počas plavby. Okrem slovenčiny sa vedia dohovoriť aj poľsky, niektorí aj anglicky.' },
        { keywords: ['firemná akcia', 'teambuilding', 'skupiny', 'firma'], answer: 'Pre firemné akcie a väčšie skupiny vieme zabezpečiť organizovaný splav na mieru. Odporúčame rezerváciu niekoľko dní vopred.' },
        { keywords: ['autobus', 'vlak', 'ako sa dostať bez auta', 'doprava'], answer: 'Do Červeného Kláštora sa dostanete aj autobusom. Najbližšia vlaková stanica je v Starej Ľubovni, odkiaľ pokračujete autobusom.' },

        { keywords: ['jedlo', 'občerstvenie', 'bufet', 'reštaurácia', 'piť'], answer: 'V okolí prístaviska nájdete bufety a reštaurácie. Počas splavu odporúčame mať so sebou vlastnú vodu.' }
    ],

    // ANGLIČTINA
    en: [
        { keywords: ['reservation', 'book', 'advance', 'group', '12 people'], answer: 'Reservation in advance is not necessary, but we recommend calling a day ahead to check the rafting times to avoid waiting. For larger groups (more than 12 people), reservation is required at least one day in advance, preferably 3 days.' },
        { keywords: ['where', 'address', 'find', 'location', 'map', 'port'], answer: 'You can find us at: Majere 34, Prešov Region. The rafting port is in Červený Kláštor.' },
        { keywords: ['how long', 'duration', 'time', 'hours', 'minutes', 'km'], answer: 'The rafting trip from Červený Kláštor to Lesnica is 11 km long and takes approximately 1.5 hours. The exact time depends on the current water level.' },
        { keywords: ['clothing', 'wear', 'what to bring', 'jacket', 'raincoat'], answer: 'In summer we recommend shorts and a t-shirt. You can also bring a sweater. In case of bad weather, bring waterproof clothing and sturdy shoes.' },
        { keywords: ['water', 'wet', 'splash', 'dry'], answer: 'You board the raft with dry feet. During the trip, water does not get into the raft, but a few drops may splash on those sitting at the edges.' },
        { keywords: ['difficult', 'hard', 'safe', 'dangerous'], answer: 'The Dunajec river is not difficult. You will be sailing with certified raftsmen who have thousands of kilometers of experience. Just relax and enjoy the ride.' },
        { keywords: ['swim', 'jump', 'bath', 'water'], answer: 'No, jumping into the water during the rafting trip is prohibited. The Pieniny visitor regulations do not allow it for safety and conservation reasons.' },
        { keywords: ['return', 'back', 'taxi', 'bike', 'walk', 'path'], answer: 'Several options: walk back along the river path (beautiful walk), rent a bike (adult and children\'s bikes available at the parking lot), or use our taxi service with 9-seater vehicles. Choose what suits you best!' },
        { keywords: ['raftsman', 'become', 'learn', 'job', 'work', 'license'], answer: 'If you\'re interested in becoming a raftsman, come and see us. An experienced raftsman will take you on a raft to learn. Once you can handle the entire trip alone, a senior raftsman will evaluate you. Raftsmen also need a small vessel driver\'s license.' },
        { keywords: ['off season', 'winter', 'work', 'job'], answer: 'Rafting is not the main job for most raftsmen – it\'s a side income. Students, retirees, and people with other main jobs work here.' },
        { keywords: ['season', 'when', 'spring', 'april', 'may', 'october'], answer: 'The season usually starts in spring (April, May) and lasts until autumn, as long as the water level is sufficient. You can usually raft until October.' },
        { keywords: ['čačina', 'front', 'wave'], answer: 'The "čačina" at the front of the raft serves to stop waves that would otherwise flow into the raft from the front. It\'s an important element of traditional raft architecture.' },
        { keywords: ['polish', 'faster', 'difference', 'architecture'], answer: 'Polish rafts are narrower and the angle of the wood at the front is steeper, which reduces water resistance and increases speed. However, they are more prone to splashing water from the sides.' },
        { keywords: ['return rafts', 'winch', 'disassemble', 'truck'], answer: 'After reaching the destination, the rafts are pulled ashore with a winch, manually disassembled, loaded onto a truck, and taken back to the start, where they are reassembled and connected on the water.' },
        { keywords: ['weight', 'heavy', 'kg'], answer: 'A raft can weigh from 500 kg to 800 kg. It consists of 5 parts that are waterlogged and very heavy (over 100 kg each). The raft also contains spare poles, benches, life jackets, and rescue rings.' },
        { keywords: ['safe', 'safety', 'dangerous', 'scared'], answer: 'The trip is safe. The raftsmen are experienced and will take care of your safety throughout the journey. Life jackets are available for children.' },
        { keywords: ['depth', 'how deep', 'deep'], answer: 'The depth of the Dunajec varies – from 30 cm in shallow sections to 12–18 meters in some places.' },
        { keywords: ['speed', 'how fast', 'km/h'], answer: 'The speed of the raft cannot be precisely determined. It depends on the raft\'s draft, the water level, and the architecture of the raft.' },
        { keywords: ['production', 'who makes', 'carpenter', 'boss'], answer: 'The rafts are made by our boss, who is a carpenter. Each raft is handmade with an emphasis on tradition and quality.' },
        { keywords: ['make own', 'build', 'registration', 'certificate'], answer: 'No, a raft is a vessel and has a registration number like a car. A certificate is required for its construction. You cannot build your own raft.' }
    ],

    // POĽŠTINA
    pl: [
        { keywords: ['rezerwacja', 'zarezerwować', 'grupa', '12 osób'], answer: 'Rezerwacja z wyprzedzeniem nie jest konieczna, ale zalecamy telefoniczne sprawdzenie godzin spływów dzień wcześniej, aby uniknąć długiego oczekiwania. Dla większych grup (powyżej 12 osób) rezerwacja jest wymagana co najmniej dzień wcześniej, najlepiej 3 dni.' },
        { keywords: ['gdzie', 'adres', 'znaleźć', 'lokalizacja', 'mapa', 'przystań'], answer: 'Znajdziesz nas pod adresem: Majere 34, Kraj preszowski. Przystań tratw znajduje się w Czerwonym Klasztorze.' },
        { keywords: ['jak długo', 'czas', 'godzin', 'minut', 'km'], answer: 'Spływ z Czerwonego Klasztoru do Leśnicy ma długość 11 km i trwa około 1,5 godziny. Dokładny czas zależy od aktualnego poziomu wody.' },
        { keywords: ['ubranie', 'ubrać', 'co zabrać', 'kurtka', 'płaszcz'], answer: 'Latem polecamy krótkie spodenki i koszulkę. Możesz też zabrać bluzę. W przypadku złej pogody zabierz ze sobą nieprzemakalne ubranie i solidne buty.' },
        { keywords: ['woda', 'mokry', 'suchą stopą'], answer: 'Na tratwę wsiada się suchą stopą. Podczas spływu woda nie dostaje się do tratwy, ale może chlapnąć kilka kropel na osoby siedzące przy krawędzi.' },
        { keywords: ['trudny', 'bezpieczny', 'niebezpieczny'], answer: 'Rzeka Dunajec nie jest trudna. Płyniesz z certyfikowanymi flisakami, którzy mają tysiące kilometrów doświadczenia. Po prostu zrelaksuj się i ciesz się podróżą.' },
        { keywords: ['pływać', 'skoczyć', 'kąpiel'], answer: 'Nie, skakanie do wody podczas spływu jest zabronione. Przepisy Pienin nie zezwalają na to ze względów bezpieczeństwa i ochrony przyrody.' },
        { keywords: ['powrót', 'taxi', 'rower', 'pieszo'], answer: 'Kilka opcji: powrót pieszo ścieżką wzdłuż rzeki (piękny spacer), wypożyczenie roweru (rowery dla dorosłych i dzieci czekają na parkingu) lub skorzystanie z naszej usługi taxi (9-osobowe pojazdy). Wybierz, co Ci odpowiada!' },
        { keywords: ['flisak', 'zostać', 'nauczyć', 'praca', 'licencja'], answer: 'Jeśli chcesz zostać flisakiem, przyjdź do nas. Doświadczony flisak zabierze Cię na tratwę, gdzie będziesz się uczyć. Gdy samodzielnie opanujesz cały spływ, starszy flisak Cię sprawdzi. Flisacy muszą mieć również licencję sternika małego statku.' },
        { keywords: ['poza sezonem', 'zima', 'praca'], answer: 'Flisactwo nie jest główną pracą dla większości flisaków – to dodatkowy dochód. Pracują tu studenci, emeryci i osoby z innym głównym zatrudnieniem.' },
        { keywords: ['sezon', 'kiedy', 'wiosna', 'kwiecień', 'maj', 'październik'], answer: 'Sezon zwykle rozpoczyna się wiosną (kwiecień, maj) i trwa do jesieni, dopóki poziom wody jest wystarczający. Zazwyczaj można płynąć do października.' }
    ],
    //Nemčina
    de: [
        { keywords: ['reservierung', 'vorbestellen', 'im voraus', 'gruppe', '12 personen'], answer: 'Eine Reservierung im Voraus ist nicht zwingend erforderlich, aber wir empfehlen, mindestens einen Tag vorher anzurufen, um die Abfahrtszeiten zu prüfen und langes Warten zu vermeiden. Für größere Gruppen (mehr als 12 Personen) ist eine Reservierung mindestens einen Tag im Voraus erforderlich, am besten 3 Tage.' },
        { keywords: ['wo', 'adresse', 'finden', 'lage', 'karte', 'anlegestelle', 'majere'], answer: 'Sie finden uns unter der Adresse: Majere 34, Prešovský kraj. Die Anlegestelle der Flöße befindet sich in Červený Kláštor.' },
        { keywords: ['wie lange', 'dauer', 'zeit', 'stunden', 'kilometer'], answer: 'Die Floßfahrt von Červený Kláštor nach Lesnica ist 11 km lang und dauert etwa 1,5 Stunden. Die genaue Dauer hängt vom aktuellen Wasserstand des Dunajec ab.' },
        { keywords: ['kleidung', 'anziehen', 'mitnehmen', 'jacke', 'regenkleidung', 'schuhe'], answer: 'Im Sommer empfehlen wir Shorts und T-Shirt. Nehmen Sie auch einen Pullover mit. Bei schlechtem Wetter wasserfeste Kleidung und festes Schuhwerk mitbringen.' },
        { keywords: ['wasser', 'nass', 'spritzen', 'trockenen füßen'], answer: 'Man steigt mit trockenen Füßen auf das Floß. Während der Fahrt gelangt normalerweise kein Wasser ins Floß, es können jedoch vereinzelt ein paar Tropfen auf die am Rand Sitzenden spritzen.' },
        { keywords: ['schwierig', 'schwer', 'sicher', 'gefährlich'], answer: 'Der Dunajec ist nicht anspruchsvoll. Sie fahren mit zertifizierten Flößern, die Tausende Kilometer Erfahrung haben. Sie müssen sich um nichts kümmern – einfach die Fahrt genießen.' },
        { keywords: ['schwimmen', 'springen', 'baden'], answer: 'Nein, Springen ins Wasser während der Floßfahrt ist verboten. Die Besucherordnung der Pieninen erlaubt es aus Sicherheits- und Naturschutzgründen nicht.' },
        { keywords: ['rückweg', 'zurück', 'taxi', 'fahrrad', 'zu fuß', 'weg'], answer: 'Mehrere Möglichkeiten: zu Fuß auf dem schönen Weg entlang des Flusses, Fahrrad mieten (Erwachsenen- und Kinderfahrräder stehen auf dem Parkplatz bereit) oder unseren Taxi-Service mit 9-Sitzer-Fahrzeugen nutzen.' },
        { keywords: ['flößer', 'werden', 'lernen', 'job', 'arbeit', 'führerschein'], answer: 'Wenn Sie Flößer werden möchten, kommen Sie zu uns. Ein erfahrener Flößer nimmt Sie mit auf das Floß zum Lernen. Wenn Sie die gesamte Fahrt selbst beherrschen, prüft Sie ein älterer Flößer. Flößer benötigen auch den Führerschein für Kleinfahrzeuge.' },
        { keywords: ['außerhalb der saison', 'winter', 'arbeit'], answer: 'Flößerei ist für die meisten Flößer kein Hauptberuf – es ist ein Zuverdienst. Hier arbeiten Studenten, Rentner und Menschen mit anderem Hauptberuf.' },
        { keywords: ['saison', 'wann', 'frühling', 'april', 'mai', 'oktober'], answer: 'Die Saison beginnt normalerweise im Frühling (April, Mai) und dauert bis in den Herbst, solange der Wasserstand ausreicht. Meistens kann man noch im Oktober fahren.' },
        { keywords: ['čačina', 'vorne', 'welle'], answer: 'Die „Čačina“ am vorderen Teil des Floßes dient dazu, Wellen aufzuhalten, die sonst von vorne ins Floß laufen würden. Es ist ein wichtiges Element der traditionellen Flößer-Architektur.' },
        { keywords: ['polnisch', 'polnische', 'schneller', 'unterschied'], answer: 'Polnische Flöße sind schmaler und der Winkel des Holzes vorne ist steiler, was den Wasserwiderstand verringert und die Geschwindigkeit erhöht. Sie sind jedoch anfälliger für seitliches Spritzen.' },
        { keywords: ['rücktransport', 'winde', 'zerlegen', 'lkw'], answer: 'Nach der Ankunft werden die Flöße mit einer Winde ans Ufer gezogen, manuell zerlegt, auf einen LKW geladen und zurück zum Start gebracht, wo sie wieder zusammengesetzt und auf dem Wasser verbunden werden.' },
        { keywords: ['gewicht', 'schwer', 'kg'], answer: 'Ein Floß wiegt zwischen 500 kg und 800 kg. Es besteht aus 5 Teilen, die mit Wasser vollgesogen und sehr schwer sind (jeweils über 100 kg). Im Floß befinden sich auch Ersatzstangen, Bänke, Rettungswesten und Rettungsringe.' },
        { keywords: ['sicherheit', 'sicher', 'gefahr', 'angst'], answer: 'Die Fahrt ist sicher. Die Flößer sind erfahren und kümmern sich um Ihre Sicherheit während der gesamten Fahrt. Für Kinder stehen Rettungswesten zur Verfügung.' },
        { keywords: ['tiefe', 'wie tief'], answer: 'Die Tiefe des Dunajec variiert – von 30 cm in flachen Abschnitten bis zu 12–18 Metern an manchen Stellen.' },
        { keywords: ['geschwindigkeit', 'wie schnell'], answer: 'Die Geschwindigkeit des Floßes lässt sich nicht genau angeben. Sie hängt vom Tiefgang, dem Wasserstand und der Bauweise des Floßes ab.' },
        { keywords: ['herstellung', 'wer baut', 'tischler', 'chef'], answer: 'Die Flöße werden von unserem Chef gebaut, der Tischler ist. Jedes Floß wird handgefertigt mit Fokus auf Tradition und Qualität.' },
        { keywords: ['selber bauen', 'eigenes floß', 'zulassung'], answer: 'Nein, ein Floß ist ein Wasserfahrzeug und hat eine Zulassungsnummer wie ein Auto. Für den Bau ist ein Zertifikat erforderlich. Sie können kein eigenes Floß bauen.' }
    ],
    //Maďarsky
    hu: [
        { keywords: ['foglalás', 'előre', 'csoport', '12 fő'], answer: 'Előzetes foglalás nem kötelező, de ajánljuk, hogy legalább egy nappal korábban hívjon, hogy ellenőrizze a tutajozási időpontokat és elkerülje a hosszú várakozást. Nagyobb csoportoknál (12 fő felett) legalább egy nappal előre szükséges a foglalás, lehetőleg 3 nappal.' },
        { keywords: ['hol', 'cím', 'címen', 'majere'], answer: 'Majere 34, Prešovský kraj címen talál minket. A tutajkikötő Červený Kláštorban van.' },
        { keywords: ['mennyi ideig', 'időtartam', 'km'], answer: 'A tutajozás Červený Kláštortól Lesnicáig 11 km hosszú és körülbelül 1,5 órát vesz igénybe. A pontos idő a Dunajec aktuális vízszintjétől függ.' },
        { keywords: ['ruha', 'öltözet', 'mit vigyek', 'esőkabát'], answer: 'Nyáron rövidnadrágot és pólót ajánlunk. Vigyen magával pulóvert is. Rossz idő esetén vízálló ruházatot és jó cipőt hozzon.' },
        { keywords: ['víz', 'vizes', 'nedves', 'száraz lábbal'], answer: 'Száraz lábbal száll be a tutajra. Az út során általában nem kerül víz a tutajba, de néha néhány csepp fröccsenhet az oldalon ülőkre.' },
        { keywords: ['nehéz', 'biztonságos', 'veszélyes'], answer: 'A Dunajec nem nehéz. Tapasztalt, tanúsított tutajosokkal utazik, akik több ezer kilométeres tapasztalattal rendelkeznek. Csak élvezze az utat.' },
        { keywords: ['úszni', 'ugrani', 'fürdeni'], answer: 'Nem, a tutajozás közben tilos a vízbe ugrani. A Pieniny látogatói szabályzat biztonsági és természetvédelmi okokból nem engedélyezi.' },
        { keywords: ['visszaút', 'vissza', 'taxi', 'kerékpár', 'gyalog'], answer: 'Több lehetőség van: gyalog a folyó menti gyönyörű ösvényen, kerékpárkölcsönzés (felnőtt és gyerek kerékpárok a parkolóban), vagy igénybe veheti 9 személyes taxi szolgáltatásunkat.' },
        { keywords: ['tutajos', 'legyek', 'tanulni', 'munka'], answer: 'Ha tutajos szeretne lenni, jöjjön el hozzánk. Egy tapasztalt tutajos magával viszi tanulni. Amikor egyedül is boldogul az egész úttal, egy idősebb tutajos ellenőrzi. Szükséges a kis vízi járművezetői engedély is.' },
        { keywords: ['szezonon kívül', 'tél', 'munka'], answer: 'A tutajozás a legtöbb tutajosnak nem főállás – mellékes jövedelem. Diákok, nyugdíjasok és más főállású emberek dolgoznak nálunk.' },
        { keywords: ['szezon', 'mikor', 'tavasz', 'április', 'május', 'október'], answer: 'A szezon általában tavasszal (április, május) kezdődik és őszig tart, amíg megfelelő a vízszint. Általában októberben is lehet még tutajozni.' }
    ],

    cz: [
        { keywords: ['rezervace', 'rezervovat', 'předem', 'skupina', '12 osob'], answer: 'Rezervace předem není nutná, ale doporučujeme zavolat alespoň den předem a ověřit si časy plavby, abyste se vyhnuli dlouhému čekání. Pro větší skupiny (více než 12 osob) je rezervace nutná minimálně den předem, ideálně 3 dny.' },
        { keywords: ['kde', 'adresa', 'najít', 'majere'], answer: 'Najdete nás na adrese: Majere 34, Prešovský kraj. Přístaviště vorů je v Červeném Klášteře.' },
        { keywords: ['jak dlouho', 'doba', 'trvání', 'km'], answer: 'Plavba z Červeného Kláštera do Lesnice je dlouhá 11 km a trvá přibližně 1,5 hodiny. Přesný čas závisí na aktuální výšce vodní hladiny Dunajce.' },
        { keywords: ['oblečení', 'co si vzít', 'nepromokavé'], answer: 'V létě doporučujeme kraťasy a tričko. Vezměte si také mikinu. Při špatném počasí nepromokavé oblečení a kvalitní obuv.' },
        { keywords: ['voda', 'zmoknout', 'suchou nohou'], answer: 'Na vor nastupujete suchou nohou. Během plavby se voda do voru nedostává, ale výjimečně může pár kapek šplíchnout na sedící u okraje.' },
        { keywords: ['těžké', 'bezpečné', 'nebezpečné'], answer: 'Dunajec není náročný. Plujete s certifikovanými voroplavci, kteří mají za sebou tisíce kilometrů. Nemusíte se o nic starat, jen si užívat plavbu.' },
        { keywords: ['plavat', 'skákat', 'koupání'], answer: 'Ne, skákání do vody během plavby je zakázáno. Návštěvní řád Pienin to z bezpečnostních a ochranných důvodů neumožňuje.' },
        { keywords: ['návrat', 'zpět', 'taxi', 'kolo', 'pěšky'], answer: 'Několik možností: pěšky krásnou stezkou podél řeky, půjčit si kolo (dospělé i dětské na parkovišti) nebo využít naši taxi službu s 9-místnými vozy.' }
    ],

    // RUŠTINA (ru)
    ru: [
        { keywords: ['бронирование', 'заранее', 'группа', '12 человек'], answer: 'Бронирование заранее не обязательно, но мы рекомендуем позвонить хотя бы за день, чтобы уточнить время сплава и избежать долгого ожидания. Для больших групп (более 12 человек) бронирование необходимо минимум за день, лучше за 3 дня.' },
        { keywords: ['где', 'адрес', 'найти', 'majere'], answer: 'Вы найдете нас по адресу: Majere 34, Прешовский край. Пристань плотов находится в Червеном Клашторе.' },
        { keywords: ['сколько времени', 'длительность', 'км'], answer: 'Сплав от Червеного Клаштора до Лесницы составляет 11 км и длится примерно 1,5 часа. Точное время зависит от текущего уровня воды в Дунайце.' },
        { keywords: ['одежда', 'что взять', 'непромокаемая'], answer: 'Летом рекомендуем шорты и футболку. Возьмите с собой также толстовку. При плохой погоде — непромокаемую одежду и хорошую обувь.' },
        { keywords: ['вода', 'промокнуть', 'сухими ногами'], answer: 'На плот садятся сухими ногами. Во время сплава вода обычно не попадает в плот, но иногда может плеснуть несколько капель на сидящих у края.' },
        { keywords: ['сложно', 'безопасно', 'опасно'], answer: 'Дунайец не сложная река. Вы плывете с сертифицированными плотогонами, у которых за плечами тысячи километров. Вам не нужно ни о чем беспокоиться — просто наслаждайтесь поездкой.' }
    ],

    // FRANCÚZŠTINA (fr)
    fr: [
        { keywords: ['réservation', 'réserver', 'à l\'avance', 'groupe', '12 personnes'], answer: 'La réservation à l\'avance n\'est pas obligatoire, mais nous recommandons d\'appeler au moins un jour avant pour vérifier les horaires et éviter une longue attente. Pour les groupes de plus de 12 personnes, la réservation est nécessaire au moins un jour à l\'avance, idéalement 3 jours.' },
        { keywords: ['où', 'adresse', 'trouver', 'majere'], answer: 'Vous nous trouverez à l\'adresse : Majere 34, région de Prešov. L\'embarcadère des radeaux se trouve à Červený Kláštor.' },
        { keywords: ['combien de temps', 'durée', 'km'], answer: 'Le trajet en radeau de Červený Kláštor à Lesnica fait 11 km et dure environ 1,5 heure. La durée exacte dépend du niveau actuel de l\'eau.' },
        { keywords: ['vêtements', 'quoi porter', 'imperméable'], answer: 'En été, nous recommandons short et t-shirt. Prenez aussi un pull. En cas de mauvais temps, vêtements imperméables et chaussures solides.' },
        { keywords: ['eau', 'se mouiller', 'pieds secs'], answer: 'On monte sur le radeau les pieds secs. Pendant la descente, l\'eau n\'entre généralement pas dans le radeau, mais quelques gouttes peuvent parfois éclabousser les personnes assises sur les côtés.' }
    ],

    // ŠPANIELČINA (es)
    es: [
        { keywords: ['reserva', 'reservar', 'con antelación', 'grupo', '12 personas'], answer: 'La reserva previa no es obligatoria, pero recomendamos llamar al menos un día antes para verificar los horarios de los descensos y evitar esperas largas. Para grupos grandes (más de 12 personas) se requiere reserva con al menos un día de antelación, preferiblemente 3 días.' },
        { keywords: ['dónde', 'dirección', 'encontrar', 'majere'], answer: 'Nos encontrará en: Majere 34, región de Prešov. El embarcadero de las almadías está en Červený Kláštor.' },
        { keywords: ['cuánto tiempo', 'duración', 'km'], answer: 'El descenso desde Červený Kláštor hasta Lesnica es de 11 km y dura aproximadamente 1,5 horas. El tiempo exacto depende del nivel actual del agua.' },
        { keywords: ['ropa', 'qué llevar', 'impermeable'], answer: 'En verano recomendamos pantalones cortos y camiseta. Lleve también un jersey. En caso de mal tiempo, ropa impermeable y calzado adecuado.' },
        { keywords: ['agua', 'mojarse', 'pies secos'], answer: 'Se sube a la almadía con los pies secos. Durante el descenso normalmente no entra agua en la almadía, aunque ocasionalmente pueden salpicar unas gotas a los que van sentados en los bordes.' }
    ]

};

// Predvolené odpovede pre každý jazyk
const defaultAnswers = {
    sk: "Prepáč, nerozumel som. Skús sa opýtať inak, alebo nás kontaktuj na info@plte-dunajec.sk",
    en: "Sorry, I didn't understand. Try asking differently, or contact us at info@plte-dunajec.sk",
    pl: "Przepraszam, nie zrozumiałem. Spróbuj zapytać inaczej, lub skontaktuj się z nami na info@plte-dunajec.sk",
    de: "Entschuldigung, ich habe nicht verstanden. Versuchen Sie es anders zu fragen oder kontaktieren Sie uns unter info@plte-dunajec.sk",
    hu: "Elnézést, nem értettem. Próbáld másképp kérdezni, vagy írj nekünk az info@plte-dunajec.sk címre",
    cz: "Promiň, nerozuměl jsem. Zkus se zeptat jinak, nebo nás kontaktuj na info@plte-dunajec.sk",
    ru: "Извините, я не понял. Попробуйте спросить иначе или свяжитесь с нами по адресу info@plte-dunajec.sk",
    fr: "Désolé, je n'ai pas compris. Essayez de demander différemment, ou contactez-nous à info@plte-dunajec.sk",
    es: "Lo siento, no entendí. Intenta preguntar de otra manera, o contáctanos en info@plte-dunajec.sk"
};

// ==================== KOMPONENT CHATBOTA ====================
export default function Chatbot({ t, lang }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Privítacia správa pri zmene jazyka
    useEffect(() => {
        setMessages([
            { text: t?.chatbot_greeting || "Ahoj! 👋 Máš nejakú otázku k plavbe? Rád ti pomôžem.", sender: 'bot' }
        ]);
    }, [lang, t]);


    const logUnknownQuestion = async (question, answer) => {
        try {
            await fetch(LOGS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    timestamp: new Date().toISOString(),
                    language: lang,
                    question: question,
                    answer: answer
                })
            });
        } catch (error) {
            console.error('Logovanie zlyhalo:', error);
        }
    };

    const findAnswer = (question) => {
        const lowerQuestion = question.toLowerCase();
        const kb = knowledgeBase[lang] || knowledgeBase.sk;

        for (const item of kb) {
            for (const keyword of item.keywords) {
                if (lowerQuestion.includes(keyword)) {
                    return item.answer;
                }
            }
        }

        const fallbackAnswer = defaultAnswers[lang] || defaultAnswers.sk;

        logUnknownQuestion(question, fallbackAnswer);

        return fallbackAnswer;
    };

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const answer = findAnswer(input);
            const botMessage = { text: answer, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 500);
    };

    const texts = {
        title: t?.chatbot_title || "Máte otázku?",
        placeholder: t?.chatbot_placeholder || "Napíšte otázku...",
        send: t?.chatbot_send || "Odoslať"
    };

    return (
        <>
            {/* Tlačidlo na otvorenie chatu */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 z-50 bg-goral-700 hover:bg-goral-800 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            </button>

            {/* Chat okno */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-20 right-4 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-goral-200 overflow-hidden"
                    >
                        {/* Hlavička */}
                        <div className="bg-goral-700 text-white p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <span className="font-body font-semibold">{texts.title}</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Správy */}
                        <div className="h-80 overflow-y-auto p-4 bg-goral-50">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.sender === 'user'
                                        ? 'bg-goral-700 text-white rounded-br-none'
                                        : 'bg-white border border-goral-200 text-goral-800 rounded-bl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start mb-3">
                                    <div className="bg-white border border-goral-200 p-3 rounded-xl rounded-bl-none">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-goral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-goral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-goral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Vstup */}
                        <div className="p-4 border-t border-goral-200 bg-white">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder={texts.placeholder}
                                    className="flex-1 px-4 py-2 rounded-xl border border-goral-200 bg-goral-50 text-sm focus:outline-none focus:ring-2 focus:ring-goral-400"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="px-4 py-2 rounded-xl bg-goral-700 hover:bg-goral-800 text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}