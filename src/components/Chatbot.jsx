import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== ZNALOSTNÁ BÁZA PRE VŠETKY JAZYKY ====================
const LOGS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyU4h9NGBAienVI_2miL7IVoKhpTMch8UUQy9Un2OKW8nMQOMruATn0NUPKRBxMxTTbYg/exec';

const knowledgeBase = {
    // SLOVENČINA
    sk: [
        {
            keywords: ['rezervácia', 'rezervovať', 'vopred', 'dopredu', 'book', 'miesto', 'termín', 'skupina', '12 osôb', 'rezervacia', 'rezervovat', 'termin', 'skupina', '12 osob'],
            answer: 'Rezervácia vopred nie je nutná, ale odporúčame aspoň deň vopred telefonicky si overiť časy splavov, aby ste sa vyhli dlhému čakaniu. Pre väčšie skupiny (viac ako 12 osôb) je potrebné rezervovať minimálne deň vopred, najlepšie 3 dni.'
        },
        {
            keywords: ['kde', 'adresa', 'nájsť', 'lokácia', 'mapa', 'prístav', 'Majere', 'najst', 'lokacia', 'pristav', 'majere'],
            answer: 'Splav po Dunajci nájdete na adrese: Majere 34, Prešovský kraj. Prístavisko pltí je v Červenom Kláštore.'
        },
        {
            keywords: ['dlho', 'trvá', 'dĺžka', 'hodín', 'minút', 'čas', 'km', 'trva', 'dlzka', 'hodin', 'minut', 'cas'],
            answer: 'Dĺžka splavu z Červeného Kláštora do Lesnice je 11 km a trvá približne 1,5 hodiny. Presný čas závisí od aktuálnej výšky vodnej hladiny Dunajca.'
        },
        {
            keywords: ['oblečenie', 'oblecť', 'obliecť', 'čo si vziať', 'mikina', 'kraťasy', 'nepremokavé', 'obuv', 'oblecenie', 'obliect', 'co si vziat', 'kratasy', 'nepremokave'],
            answer: 'V lete odporúčame krátke tričko, tielko, kraťasy. So sebou si môžete vziať aj mikinu alebo sveter. V prípade nepriaznivého počasia si vezmite nepremokavé oblečenie a kvalitnú obuv.'
        },
        {
            keywords: ['voda', 'zmoknúť', 'zmoknem', 'mokrý', 'špliecha', 'suchou nohou', 'zmoknut', 'mokry', 'spliecha'],
            answer: 'Do plte sa nastupuje suchou nohou. Počas splavu sa voda v plti nenachádza, ale výnimočne môže špliechnuť pár kvapiek vody na sediacich po kraji.'
        },
        {
            keywords: ['náročná', 'ťažká', 'obtiažnosť', 'bezpečné', 'zvládnem', 'narocna', 'tazka', 'obtiaznost', 'bezpecne', 'zvladnem'],
            answer: 'Rieka Dunajec nie je náročná. Plavíte sa s certifikovanými pltníkmi, ktorí majú odjazdené tisíce kilometrov. Nemusíte sa o nič starať, len si užiť plavbu.'
        },
        {
            keywords: ['skok', 'skočiť', 'zaplávať', 'plávať', 'voda', 'kúpanie', 'skocit', 'zaplavat', 'plavat', 'kupanie'],
            answer: 'Nie, skákať do vody počas plavby je zakázané. Návštevný poriadok Pienin to neumožňuje z bezpečnostných a ochranných dôvodov.'
        },
        {
            keywords: ['návrat', 'späť', 'dostať sa', 'taxi', 'bicykel', 'pešo', 'chodník', 'navrat', 'spat', 'dostat sa', 'peso', 'chodnik'],
            answer: 'Možností je viacero: pešo chodníkom popri rieke (krásna prechádzka), požičať si bicykel (dospelácke aj detské čakajú na parkovisku), alebo využiť našu taxi službu 9-miestnymi vozidlami. Vyberte si podľa seba!'
        },
        {
            keywords: ['pltník', 'stať sa', 'naučiť', 'práca', 'zamestnanie', 'vodičský preukaz', 'stat sa', 'naucit', 'vodicsky preukaz'],
            answer: 'Ak máte záujem stať sa pltníkom, príďte za nami. Skúsený pltník vás zoberie so sebou na plt, kde sa budete učiť. Keď zvládnete celú jazdu sami, starší pltník vás preverí. Pltníci musia mať aj preukaz vodiča malého plavidla, na ktorý sa robia skúšky.'
        },
        {
            keywords: ['mimo sezóny', 'zima', 'čo robia', 'práca', 'privirobok', 'mimo sezony'],
            answer: 'Pltníctvo nie je hlavná práca pre väčšinu pltníkov – je to privirobok. Pracujú tu študenti, dôchodcovia aj ľudia s iným hlavným zamestnaním.'
        },
        {
            keywords: ['sezóna', 'kedy', 'jar', 'apríl', 'máj', 'október', 'začiatok', 'koniec', 'april', 'maj', 'oktober', 'zaciatok'],
            answer: 'Sezóna zvyčajne začína na jar (apríl, máj) a trvá až do jesene, kým je dostatočná hladina vody. Väčšinou sa dá plaviť ešte aj v októbri.'
        },
        {
            keywords: ['čačina', 'predu', 'predok', 'vlna', 'čo je to', 'cacina'],
            answer: 'Čačina na predu plte slúži na zastavenie vlny vody, ktorá by sa inak vlievala z predu do plte. Je to dôležitý prvok tradičnej pltníckej architektúry.'
        },
        {
            keywords: ['poľské', 'polske', 'rýchlejšie', 'architektúra', 'rozdiel', 'rychlejsie', 'architektura'],
            answer: 'Poľské plte sú užšie a uhol dreva v predu je strmší, čím dosahujú menší odpor vody a väčšiu rýchlosť. Sú však náchylnejšie na špliechanie vody z boku.'
        },
        {
            keywords: ['návrat pltí', 'vracajú', 'navijak', 'rozoberajú', 'auto', 'nákladné', 'navrat plti', 'vracaju', 'rozoberaju', 'nakladne'],
            answer: 'Po doplavení sa plte navijakom vytiahnu na breh, ručne sa rozoberú, naložia na nákladné auto a odvezú späť na štart, kde sa znova zložia a spoja lanom na vode.'
        },
        {
            keywords: ['váha', 'hmotnosť', 'koľko váži', 'kg', 'ťažká', 'vaha', 'hmotnost', 'kolko vazi', 'tazka'],
            answer: 'Plť môže vážiť od 500 kg do 800 kg. Skladá sa z 5 častí, ktoré sú nasiaknuté vodou a sú veľmi ťažké (viac ako 100 kg každá). V plti sú aj náhradné palice, lavičky, záchranné vesty a záchranné kolesá.'
        },
        {
            keywords: ['bezpečnosť', 'bezpečné', 'nebezpečné', 'strach', 'bezpecnost', 'bezpecne', 'nebezpecne'],
            answer: 'Plavba je bezpečná. Pltníci sú skúsení a postarajú sa o vašu bezpečnosť počas celej plavby. Pre deti sú k dispozícii záchranné vesty.'
        },
        {
            keywords: ['hlbka', 'hĺbka', 'hlboký', 'ako hlboký', 'hlboka', 'hlboke'],
            answer: 'Hĺbka Dunajca je rôzna – od 30 cm v plytších úsekoch až po 12–18 metrov na niektorých miestach.'
        },
        {
            keywords: ['rýchlosť', 'ako rýchlo', 'km/h', 'ide plt', 'rychlost', 'ako rychlo', 'ide plt'],
            answer: 'Rýchlosť plte sa nedá presne určiť. Závisí od ponoru plte, výšky hladiny vody a architektúry, podľa ktorej je postavená.'
        },
        {
            keywords: ['výroba', 'vyrába', 'kto robí', 'stolár', 'šéf', 'vyroba', 'vyraba', 'kto robi', 'stolar', 'sef'],
            answer: 'Plte vyrába náš šéf, ktorý je stolár. Každá plť je ručne vyrobená s dôrazom na tradíciu a kvalitu.'
        },
        {
            keywords: ['vyrobiť si', 'vlastná', 'svojpomocne', 'registračné číslo', 'certifikát', 'vyrobit si', 'vlastna', 'registracne cislo', 'certifikat'],
            answer: 'Nie, plť je plavidlo a má pridelené registračné číslo ako auto. Na jej výrobu je potrebný certifikát. Plť si nemôžete vyrobiť svojpomocne.'
        },
        {
            keywords: ['cena', 'koľko stojí', 'cenník', 'lístok', 'euro', '€', 'dospelý', 'dieťa', 'kolko stoji', 'cennik', 'listok', 'dospely', 'dieta'],
            answer: 'Aktuálna cena za dospelú osobu je 25 €. Deti do 14 rokov majú zľavu (zvyčajne 15 €). Študenti a dôchodcovia často 23 €. Presné ceny overte na mieste alebo telefonicky, pretože sa môžu meniť podľa sezóny.'
        },
        {
            keywords: ['pes', 'psy', 'zvieratá', 'domáce zviera', 'zvierata', 'domace zviera'],
            answer: 'Psy sú povolené po dohode na mieste. Majiteľ je zodpovedný za správanie psa počas splavu.'
        },
        {
            keywords: ['parkovanie', 'parkovisko', 'auto', 'kde zaparkovať', 'zaparkovat'],
            answer: 'Parkovisko je k dispozícii priamo pri prístavisku v Majere. Pre našich zákazníkov je parkovanie väčšinou zdarma.'
        },
        {
            keywords: ['počasie', 'dážď', 'prší', 'zrušia', 'odložiť', 'pocasie', 'dazd', 'prsi', 'zrusia', 'odlozit'],
            answer: 'Splav prebieha aj pri miernom daždi. Pri silnom daždi, búrke alebo veľmi vysokej/nízkej hladine vody môže byť splav z bezpečnostných dôvodov zrušený alebo odložený. V takom prípade vás včas informujeme.'
        },
        {
            keywords: ['foto', 'fotografovať', 'mobil', 'fotoaparát', 'veci', 'fotografovat', 'fotoaparat'],
            answer: 'Fotografovať môžete, ale odporúčame mobil alebo foťák zabezpečiť (napr. vodotesným obalom). Osobné veci si môžete nechať v aute alebo v úschovni na prevádzke.'
        },
        {
            keywords: ['platba', 'hotovosť', 'karta', 'OP', 'občiansky', 'hotovost', 'obciansky'],
            answer: 'Platba prebieha v hotovosti pred splavom na prevádzke.'
        },
        {
            keywords: ['toaleta', 'wc', 'záchod', 'hygiena', 'kde ísť', 'zachod', 'kde ist'],
            answer: 'Toalety sú k dispozícii pri nástupnom mieste (prístavisku). Počas samotného splavu sa zastávky na toaletu nerobia.'
        },
        {
            keywords: ['jazyk', 'anglicky', 'poľsky', 'sprievodca', 'výklad', 'polsky', 'vyklad'],
            answer: 'Pltníci často poskytujú výklad počas plavby. Okrem slovenčiny sa vedia dohovoriť aj poľsky, niektorí aj anglicky.'
        },
        {
            keywords: ['firemná akcia', 'teambuilding', 'skupiny', 'firma', 'firemna akcia'],
            answer: 'Pre firemné akcie a väčšie skupiny vieme zabezpečiť organizovaný splav na mieru. Odporúčame rezerváciu niekoľko dní vopred.'
        },
        {
            keywords: ['autobus', 'vlak', 'ako sa dostať bez auta', 'doprava', 'dostat sa bez auta'],
            answer: 'Do Červeného Kláštora sa dostanete aj autobusom. Najbližšia vlaková stanica je v Starej Ľubovni, odkiaľ pokračujete autobusom.'
        },
        {
            keywords: ['jedlo', 'občerstvenie', 'bufet', 'reštaurácia', 'piť', 'obcerstvenie', 'restauracia', 'pit'],
            answer: 'V okolí prístaviska nájdete bufety a reštaurácie. Počas splavu odporúčame mať so sebou vlastnú vodu.'
        }
    ],

    // ANGLIČTINA
    en: [
        {
            keywords: ['reservation', 'book', 'advance', 'group', '12 people', 'booking', 'reserve', 'in advance', 'groups', '12 persons', '12 people group'],
            answer: 'Reservation in advance is not necessary, but we recommend calling a day ahead to check the rafting times to avoid waiting. For larger groups (more than 12 people), reservation is required at least one day in advance, preferably 3 days.'
        },
        {
            keywords: ['where', 'address', 'find', 'location', 'map', 'port', 'where is', 'how to get', 'directions', 'cerveny klastor', 'majere', 'gps'],
            answer: 'You can find us at: Majere 34, Prešov Region, Slovakia. The rafting port is in Červený Kláštor. GPS coordinates: 49.3985° N, 20.4198° E.'
        },
        {
            keywords: ['how long', 'duration', 'time', 'hours', 'minutes', 'km', 'how many hours', 'length', 'how many km', 'distance'],
            answer: 'The rafting trip from Červený Kláštor to Lesnica is 11 km long and takes approximately 1.5 hours. The exact time depends on the current water level of the Dunajec river.'
        },
        {
            keywords: ['clothing', 'wear', 'what to bring', 'jacket', 'raincoat', 'clothes', 'dress', 'what to wear', 'should i bring', 'equipment'],
            answer: 'In summer we recommend shorts and a t-shirt. You can also bring a sweater. In case of bad weather, bring waterproof clothing and sturdy shoes. Life jackets are provided.'
        },
        {
            keywords: ['water', 'wet', 'splash', 'dry', 'get wet', 'will i get wet', 'water in the raft', 'splashing'],
            answer: 'You board the raft with dry feet. During the trip, water does not get into the raft, but a few drops may splash on those sitting at the edges. It is not a wet experience.'
        },
        {
            keywords: ['difficult', 'hard', 'safe', 'dangerous', 'easy', 'level', 'difficulty', 'is it safe', 'for beginners', 'family friendly'],
            answer: 'The Dunajec river is not difficult. You will be sailing with certified raftsmen who have thousands of kilometers of experience. It is safe for children, beginners, and families. Just relax and enjoy the ride.'
        },
        {
            keywords: ['swim', 'jump', 'bath', 'water', 'swimming', 'jump into water', 'can i swim', 'bath in the river'],
            answer: 'No, jumping into the water during the rafting trip is prohibited. The Pieniny visitor regulations do not allow it for safety and conservation reasons.'
        },
        {
            keywords: ['return', 'back', 'taxi', 'bike', 'walk', 'path', 'how to get back', 'return transport', 'back to start', 'shuttle'],
            answer: 'Several options: walk back along the river path (beautiful walk, about 2 hours), rent a bike (adult and children\'s bikes available at the parking lot), or use our taxi service with 9-seater vehicles. Choose what suits you best!'
        },
        {
            keywords: ['raftsman', 'become', 'learn', 'job', 'work', 'license', 'how to become', 'raftsman job', 'work as raftsman', 'training'],
            answer: 'If you\'re interested in becoming a raftsman, come and see us. An experienced raftsman will take you on a raft to learn. Once you can handle the entire trip alone, a senior raftsman will evaluate you. Raftsmen also need a small vessel driver\'s license.'
        },
        {
            keywords: ['off season', 'winter', 'work', 'job', 'what do they do', 'off-season', 'winter work', 'outside season'],
            answer: 'Rafting is not the main job for most raftsmen – it\'s a side income. Students, retirees, and people with other main jobs work here. In winter, they do maintenance work on the rafts or work their regular jobs.'
        },
        {
            keywords: ['season', 'when', 'spring', 'april', 'may', 'october', 'best time', 'opening', 'closing', 'season dates', 'what months'],
            answer: 'The season usually starts in spring (April, May) and lasts until autumn, as long as the water level is sufficient. You can usually raft until October. July and August are the busiest months.'
        },
        {
            keywords: ['čačina', 'front', 'wave', 'cacina', 'what is that', 'front part', 'wooden front', 'traditional element'],
            answer: 'The "čačina" at the front of the raft serves to stop waves that would otherwise flow into the raft from the front. It\'s an important element of traditional raft architecture that has been used for centuries.'
        },
        {
            keywords: ['polish', 'faster', 'difference', 'architecture', 'polish rafts', 'why are they faster', 'poland rafts', 'difference between'],
            answer: 'Polish rafts are narrower and the angle of the wood at the front is steeper, which reduces water resistance and increases speed. However, they are more prone to splashing water from the sides.'
        },
        {
            keywords: ['return rafts', 'winch', 'disassemble', 'truck', 'how are rafts returned', 'raft transport', 'how do they get back'],
            answer: 'After reaching the destination, the rafts are pulled ashore with a winch, manually disassembled, loaded onto a truck, and taken back to the start, where they are reassembled and connected on the water.'
        },
        {
            keywords: ['weight', 'heavy', 'kg', 'how much does it weigh', 'raft weight', 'how heavy', 'weight of raft'],
            answer: 'A raft can weigh from 500 kg to 800 kg. It consists of 5 parts that are waterlogged and very heavy (over 100 kg each). The raft also contains spare poles, benches, life jackets, and rescue rings.'
        },
        {
            keywords: ['safe', 'safety', 'dangerous', 'scared', 'is it safe', 'for children', 'life jackets', 'emergency'],
            answer: 'The trip is safe. The raftsmen are experienced and will take care of your safety throughout the journey. Life jackets are available for children and adults. Safety rings and first aid kits are on every raft.'
        },
        {
            keywords: ['depth', 'how deep', 'deep', 'water depth', 'deepest', 'shallow', 'river depth'],
            answer: 'The depth of the Dunajec varies – from 30 cm (1 foot) in shallow sections to 12–18 meters (40–60 feet) in some places. The average depth during the rafting trip is about 1-2 meters.'
        },
        {
            keywords: ['speed', 'how fast', 'km/h', 'raft speed', 'fast', 'slow', 'current speed'],
            answer: 'The speed of the raft cannot be precisely determined. It depends on the raft\'s draft, the water level, and the architecture of the raft. Typical speed is about 5-8 km/h, similar to a brisk walking pace.'
        },
        {
            keywords: ['production', 'who makes', 'carpenter', 'boss', 'who builds', 'raft making', 'construction', 'handmade'],
            answer: 'The rafts are made by our boss, who is a carpenter. Each raft is handmade with an emphasis on tradition and quality. It takes several days to build one raft using traditional techniques.'
        },
        {
            keywords: ['make own', 'build', 'registration', 'certificate', 'can i build', 'own raft', 'make my own', 'private raft'],
            answer: 'No, a raft is a vessel and has a registration number like a car. A certificate is required for its construction. You cannot build your own raft for commercial use.'
        },
        {
            keywords: ['price', 'cost', 'how much', 'ticket', '€', 'euro', 'adult', 'child', 'family', 'discount', 'prices'],
            answer: 'Current price is 25 € for adults. Children under 14 have a discount (usually 15 €). Students and seniors often pay 23 €. Family packages available. Exact prices may vary by season – check at the port.'
        },
        {
            keywords: ['dog', 'dogs', 'pet', 'animals', 'pets allowed', 'can i bring dog', 'dog on raft'],
            answer: 'Dogs are allowed upon agreement at the port. The owner is responsible for the dog\'s behavior during the rafting trip. Please keep your dog on a leash.'
        },
        {
            keywords: ['parking', 'park', 'car', 'where to park', 'parking lot', 'free parking', 'parking space'],
            answer: 'Parking is available directly at the port in Majere. Parking is usually free for our customers. In peak season, we recommend arriving earlier to secure a spot.'
        },
        {
            keywords: ['weather', 'rain', 'rainy', 'cancel', 'postpone', 'bad weather', 'what if it rains', 'cancellation'],
            answer: 'The rafting trip takes place even in light rain. In case of heavy rain, storms, or very high/low water levels, the trip may be canceled or postponed for safety reasons. You will be informed in advance.'
        },
        {
            keywords: ['photo', 'photos', 'camera', 'phone', 'take pictures', 'photography', 'can i take photos'],
            answer: 'You can take photos, but we recommend securing your phone or camera (e.g., waterproof case). You can leave personal items in your car or in storage at the port.'
        },
        {
            keywords: ['payment', 'cash', 'card', 'credit card', 'how to pay', 'pay', 'payment methods'],
            answer: 'Payment is accepted in cash at the port before the rafting trip. Cards are not accepted, so please bring enough cash.'
        },
        {
            keywords: ['toilet', 'wc', 'restroom', 'bathroom', 'toilets', 'where is toilet'],
            answer: 'Toilets are available at the boarding point (port). During the rafting trip itself, there are no stops for toilets.'
        },
        {
            keywords: ['language', 'english', 'polish', 'guide', 'commentary', 'do you speak english', 'guide language'],
            answer: 'The raftsmen often provide commentary during the trip. They speak Slovak, Polish, and some also speak basic English.'
        },
        {
            keywords: ['company', 'corporate', 'team building', 'groups', 'large groups', 'corporate event', 'team building event'],
            answer: 'For corporate events and larger groups, we can arrange a customized rafting trip. We recommend booking several days in advance.'
        },
        {
            keywords: ['bus', 'train', 'without car', 'public transport', 'how to get without car', 'transportation'],
            answer: 'You can reach Červený Kláštor by bus. The nearest train station is in Stará Ľubovňa, from where you continue by bus. Check local schedules before your trip.'
        },
        {
            keywords: ['food', 'snack', 'restaurant', 'cafe', 'eat', 'drink', 'refreshments', 'buffet'],
            answer: 'There are snack bars and restaurants near the port. During the rafting trip, we recommend bringing your own water. There is no food service on the raft.'
        },
        {
            keywords: ['children', 'kids', 'child', 'family', 'with kids', 'kids friendly', 'safe for children'],
            answer: 'Children are welcome! Life jackets are provided. Children under 3 years ride for free. The trip is calm and safe for families. Strollers can be left at the port.'
        }
    ],
    pl: [
        {
            keywords: ['rezerwacja', 'zarezerwować', 'grupa', '12 osób', 'rezerwacja online', 'telefon', 'czy trzeba rezerwować', 'wcześniej', 'z wyprzedzeniem', 'dla grup', 'duża grupa', 'grupy', '12 osob', 'rezerwacje'],
            answer: 'Rezerwacja z wyprzedzeniem nie jest konieczna, ale zalecamy telefoniczne sprawdzenie godzin spływów dzień wcześniej, aby uniknąć długiego oczekiwania. Dla większych grup (powyżej 12 osób) rezerwacja jest wymagana co najmniej dzień wcześniej, najlepiej 3 dni.'
        },
        {
            keywords: ['gdzie', 'adres', 'znaleźć', 'lokalizacja', 'mapa', 'przystań', 'jak dojechać', 'dojazd', 'majere', 'czerwony klasztor', 'gps', 'współrzędne'],
            answer: 'Znajdziesz nas pod adresem: Majere 34, Kraj preszowski, Słowacja. Przystań tratw znajduje się w Czerwonym Klasztorze. Współrzędne GPS: 49.3985° N, 20.4198° E.'
        },
        {
            keywords: ['jak długo', 'czas', 'godzin', 'minut', 'km', 'długość', 'ile trwa', 'ile kilometrów', 'czas trwania', 'dystans'],
            answer: 'Spływ z Czerwonego Klasztoru do Leśnicy ma długość 11 km i trwa około 1,5 godziny. Dokładny czas zależy od aktualnego poziomu wody w Dunajcu.'
        },
        {
            keywords: ['ubranie', 'ubrać', 'co zabrać', 'kurtka', 'płaszcz', 'co ze sobą wziąć', 'jak się ubrać', 'ubrania', 'odzież', 'płaszcz przeciwdeszczowy', 'buty'],
            answer: 'Latem polecamy krótkie spodenki i koszulkę. Możesz też zabrać bluzę. W przypadku złej pogody zabierz ze sobą nieprzemakalne ubranie i solidne buty. Kamizelki ratunkowe są zapewnione.'
        },
        {
            keywords: ['woda', 'mokry', 'suchą stopą', 'czy można zmoknąć', 'woda w tratwie', 'chlapanie', 'czy będzie sucho'],
            answer: 'Na tratwę wsiada się suchą stopą. Podczas spływu woda nie dostaje się do tratwy, ale może chlapnąć kilka kropel na osoby siedzące przy krawędzi. To nie jest mokra atrakcja.'
        },
        {
            keywords: ['trudny', 'bezpieczny', 'niebezpieczny', 'czy jest bezpiecznie', 'dla dzieci', 'trudność', 'poziom trudności', 'czy jest łatwy', 'dla rodzin'],
            answer: 'Rzeka Dunajec nie jest trudna. Płyniesz z certyfikowanymi flisakami, którzy mają tysiące kilometrów doświadczenia. Spływ jest bezpieczny dla dzieci, rodzin i początkujących. Po prostu zrelaksuj się i ciesz się podróżą.'
        },
        {
            keywords: ['pływać', 'skoczyć', 'kąpiel', 'czy można pływać', 'skok do wody', 'kąpiel w rzece', 'woda do kąpieli'],
            answer: 'Nie, skakanie do wody podczas spływu jest zabronione. Przepisy Pienin nie zezwalają na to ze względów bezpieczeństwa i ochrony przyrody.'
        },
        {
            keywords: ['powrót', 'taxi', 'rower', 'pieszo', 'jak wrócić', 'transport powrotny', 'dojazd z powrotem', 'bus', 'shuttle'],
            answer: 'Kilka opcji: powrót pieszo ścieżką wzdłuż rzeki (piękny spacer, około 2 godzin), wypożyczenie roweru (rowery dla dorosłych i dzieci czekają na parkingu) lub skorzystanie z naszej usługi taxi (9-osobowe pojazdy). Wybierz, co Ci odpowiada!'
        },
        {
            keywords: ['flisak', 'zostać', 'nauczyć', 'praca', 'licencja', 'jak zostać flisakiem', 'praca flisaka', 'szkolenie', 'wymagania'],
            answer: 'Jeśli chcesz zostać flisakiem, przyjdź do nas. Doświadczony flisak zabierze Cię na tratwę, gdzie będziesz się uczyć. Gdy samodzielnie opanujesz cały spływ, starszy flisak Cię sprawdzi. Flisacy muszą mieć również licencję sternika małego statku.'
        },
        {
            keywords: ['poza sezonem', 'zima', 'praca', 'co robią zimą', 'poza sezonem co robią', 'zima praca', 'off season'],
            answer: 'Flisactwo nie jest główną pracą dla większości flisaków – to dodatkowy dochód. Pracują tu studenci, emeryci i osoby z innym głównym zatrudnieniem. Zimą zajmują się konserwacją tratw lub pracują w swoich głównych zawodach.'
        },
        {
            keywords: ['sezon', 'kiedy', 'wiosna', 'kwiecień', 'maj', 'październik', 'kiedy najlepiej', 'otwarcie sezonu', 'zamknięcie sezonu', 'miesiące', 'kiedy pływać'],
            answer: 'Sezon zwykle rozpoczyna się wiosną (kwiecień, maj) i trwa do jesieni, dopóki poziom wody jest wystarczający. Zazwyczaj można płynąć do października. Lipiec i sierpień to najbardziej ruchliwe miesiące.'
        },
        {
            keywords: ['cena', 'ile kosztuje', 'bilet', 'cennik', '€', 'euro', 'dorosły', 'dziecko', 'zniżka', 'ceny', 'promocja'],
            answer: 'Aktualna cena dla osoby dorosłej to 25 €. Dzieci do 14 lat mają zniżkę (zazwyczaj 15 €). Studenci i emeryci często płacą 23 €. Dokładne ceny sprawdź na miejscu, ponieważ mogą się różnić w zależności od sezonu.'
        },
        {
            keywords: ['pies', 'psy', 'zwierzęta', 'czy można z psem', 'pies na tratwie', 'zwierzęta dozwolone', 'z psem'],
            answer: 'Psy są dozwolone po uzgodnieniu na miejscu. Właściciel odpowiada za zachowanie psa podczas spływu. Prosimy o trzymanie psa na smyczy.'
        },
        {
            keywords: ['parking', 'parking', 'samochód', 'gdzie zaparkować', 'parking gratis', 'bezpłatny parking', 'miejsce parkingowe'],
            answer: 'Parking znajduje się bezpośrednio przy przystani w Majere. Dla naszych klientów parking jest zazwyczaj bezpłatny. W szczycie sezonu zalecamy przyjechać wcześniej, aby znaleźć miejsce.'
        },
        {
            keywords: ['pogoda', 'deszcz', 'pada', 'odwołanie', 'przełożenie', 'czy spływ się odbywa', 'zła pogoda', 'co jeśli pada'],
            answer: 'Spływ odbywa się nawet przy lekkim deszczu. W przypadku ulewnego deszczu, burzy lub bardzo wysokiego/niskiego poziomu wody spływ może zostać odwołany lub przełożony ze względów bezpieczeństwa. Zostaniesz poinformowany z wyprzedzeniem.'
        },
        {
            keywords: ['zdjęcia', 'foto', 'aparaty', 'telefon', 'robić zdjęcia', 'fotografowanie', 'czy można robić zdjęcia'],
            answer: 'Możesz robić zdjęcia, ale zalecamy zabezpieczenie telefonu lub aparatu (np. wodoodpornym etui). Osobiste rzeczy możesz zostawić w samochodzie lub w przechowalni na przystani.'
        },
        {
            keywords: ['płatność', 'gotówka', 'karta', 'jak zapłacić', 'płatność kartą', 'czy można kartą'],
            answer: 'Płatność odbywa się w gotówce przed spływem na przystani. Karty nie są akceptowane, więc prosimy zabrać wystarczającą ilość gotówki.'
        },
        {
            keywords: ['toaleta', 'wc', 'ubikacja', 'gdzie jest toaleta', 'łazienka', 'toalety'],
            answer: 'Toalety są dostępne przy miejscu wsiadania (przystani). Podczas samego spływu nie ma przerw na toaletę.'
        },
        {
            keywords: ['język', 'polski', 'angielski', 'przewodnik', 'komentarz', 'czy mówią po polsku', 'obsługa po polsku'],
            answer: 'Flisacy często opowiadają podczas spływu. Mówią po słowacku i polsku, niektórzy także po angielsku. Na pewno się porozumiesz!'
        },
        {
            keywords: ['jedzenie', 'bufet', 'restauracja', 'kawiarnia', 'jeść', 'pić', 'gdzie zjeść', 'posiłek', 'przekąski'],
            answer: 'W pobliżu przystani znajdziesz bary i restauracje. Podczas spływu zalecamy zabranie własnej wody. Na tratwie nie ma serwisu gastronomicznego.'
        },
        {
            keywords: ['dzieci', 'dziecko', 'rodzina', 'z dziećmi', 'czy można z dzieckiem', 'dzieci na spływie', 'wózek', 'dla rodzin'],
            answer: 'Dzieci są mile widziane! Zapewniamy kamizelki ratunkowe. Dzieci do 3 lat płyną bezpłatnie. Spływ jest spokojny i bezpieczny dla rodzin. Wózki można zostawić na przystani.'
        },
        {
            keywords: ['tratwa', 'budowa', 'waga', 'ciężar', 'jak zbudowana', 'z czego zrobiona', 'tradycyjna tratwa'],
            answer: 'Tratwa może ważyć od 500 kg do 800 kg. Składa się z 5 części, które są nasączone wodą i bardzo ciężkie (ponad 100 kg każda). Na tratwie znajdują się też zapasowe drągi, ławki, kamizelki ratunkowe i koła ratunkowe.'
        },
        {
            keywords: ['prędkość', 'jak szybko', 'km/h', 'szybkość tratwy', 'czy szybko płynie'],
            answer: 'Prędkość tratwy nie może być dokładnie określona. Zależy od zanurzenia tratwy, poziomu wody i konstrukcji tratwy. Typowa prędkość to około 5-8 km/h.'
        },
        {
            keywords: ['głębokość', 'jak głęboko', 'głęboka', 'głębokość rzeki', 'czy jest głęboko'],
            answer: 'Głębokość Dunajca jest różna – od 30 cm w płytkich odcinkach do 12–18 metrów w niektórych miejscach. Średnia głębokość podczas spływu to około 1-2 metry.'
        },
        {
            keywords: ['autobus', 'pociąg', 'dojazd bez samochodu', 'komunikacja', 'jak dojechać bez auta'],
            answer: 'Do Czerwonego Klasztoru dojedziesz autobusem. Najbliższa stacja kolejowa jest w Starej Lubowli, skąd kontynuujesz podróż autobusem. Sprawdź rozkłady przed wyjazdem.'
        }
    ],
    de: [
        {
            keywords: ['reservierung', 'vorbestellen', 'im voraus', 'gruppe', '12 personen', 'reservieren', 'buchung', 'anmeldung', 'vorab', 'gruppen', '12 personen gruppe', 'grosse gruppe'],
            answer: 'Eine Reservierung im Voraus ist nicht zwingend erforderlich, aber wir empfehlen, mindestens einen Tag vorher anzurufen, um die Abfahrtszeiten zu prüfen und langes Warten zu vermeiden. Für größere Gruppen (mehr als 12 Personen) ist eine Reservierung mindestens einen Tag im Voraus erforderlich, am besten 3 Tage.'
        },
        {
            keywords: ['wo', 'adresse', 'finden', 'lage', 'karte', 'anlegestelle', 'majere', 'wie komme ich hin', 'anfahrt', 'gps', 'koordinaten', 'cerveny klastor', 'rothenkloster'],
            answer: 'Sie finden uns unter der Adresse: Majere 34, Prešovský kraj, Slowakei. Die Anlegestelle der Flöße befindet sich in Červený Kláštor (Rotes Kloster). GPS-Koordinaten: 49.3985° N, 20.4198° O.'
        },
        {
            keywords: ['wie lange', 'dauer', 'zeit', 'stunden', 'kilometer', 'wie viele kilometer', 'dauer der fahrt', 'länge', 'wie viel zeit'],
            answer: 'Die Floßfahrt von Červený Kláštor nach Lesnica ist 11 km lang und dauert etwa 1,5 Stunden. Die genaue Dauer hängt vom aktuellen Wasserstand des Dunajec ab.'
        },
        {
            keywords: ['kleidung', 'anziehen', 'mitnehmen', 'jacke', 'regenkleidung', 'schuhe', 'was anziehen', 'was mitnehmen', 'bekleidung', 'regenschutz', 'wetterfest'],
            answer: 'Im Sommer empfehlen wir Shorts und T-Shirt. Nehmen Sie auch einen Pullover mit. Bei schlechtem Wetter wasserfeste Kleidung und festes Schuhwerk mitbringen. Schwimmwesten werden gestellt.'
        },
        {
            keywords: ['wasser', 'nass', 'spritzen', 'trockenen füßen', 'wird man nass', 'spritzwasser', 'nasse füße', 'trocken bleiben'],
            answer: 'Man steigt mit trockenen Füßen auf das Floß. Während der Fahrt gelangt normalerweise kein Wasser ins Floß, es können jedoch vereinzelt ein paar Tropfen auf die am Rand Sitzenden spritzen. Es ist keine nasse Angelegenheit.'
        },
        {
            keywords: ['schwierig', 'schwer', 'sicher', 'gefährlich', 'ist es sicher', 'für anfänger', 'für kinder', 'familienfreundlich', 'einfach', 'schwierigkeitsgrad'],
            answer: 'Der Dunajec ist nicht anspruchsvoll. Sie fahren mit zertifizierten Flößern, die Tausende Kilometer Erfahrung haben. Die Fahrt ist sicher für Kinder, Familien und Anfänger. Sie müssen sich um nichts kümmern – einfach die Fahrt genießen.'
        },
        {
            keywords: ['schwimmen', 'springen', 'baden', 'ins wasser springen', 'schwimmen gehen', 'darf man schwimmen', 'baden im fluss'],
            answer: 'Nein, Springen ins Wasser während der Floßfahrt ist verboten. Die Besucherordnung der Pieninen erlaubt es aus Sicherheits- und Naturschutzgründen nicht.'
        },
        {
            keywords: ['rückweg', 'zurück', 'taxi', 'fahrrad', 'zu fuß', 'weg', 'wie komme ich zurück', 'rückfahrt', 'shuttle', 'transfer'],
            answer: 'Mehrere Möglichkeiten: zu Fuß auf dem schönen Weg entlang des Flusses (etwa 2 Stunden), Fahrrad mieten (Erwachsenen- und Kinderfahrräder stehen auf dem Parkplatz bereit) oder unseren Taxi-Service mit 9-Sitzer-Fahrzeugen nutzen. Wählen Sie, was Ihnen am besten gefällt!'
        },
        {
            keywords: ['flößer', 'werden', 'lernen', 'job', 'arbeit', 'führerschein', 'flösser werden', 'beruf', 'ausbildung', 'wie wird man flößer'],
            answer: 'Wenn Sie Flößer werden möchten, kommen Sie zu uns. Ein erfahrener Flößer nimmt Sie mit auf das Floß zum Lernen. Wenn Sie die gesamte Fahrt selbst beherrschen, prüft Sie ein älterer Flößer. Flößer benötigen auch den Führerschein für Kleinfahrzeuge.'
        },
        {
            keywords: ['außerhalb der saison', 'winter', 'arbeit', 'was machen sie im winter', 'nebenjob', 'hauptberuf', 'off season'],
            answer: 'Flößerei ist für die meisten Flößer kein Hauptberuf – es ist ein Zuverdienst. Hier arbeiten Studenten, Rentner und Menschen mit anderem Hauptberuf. Im Winter kümmern sie sich um die Wartung der Flöße oder arbeiten in ihren Hauptberufen.'
        },
        {
            keywords: ['saison', 'wann', 'frühling', 'april', 'mai', 'oktober', 'beste zeit', 'saisonbeginn', 'saisonende', 'wann kann man fahren'],
            answer: 'Die Saison beginnt normalerweise im Frühling (April, Mai) und dauert bis in den Herbst, solange der Wasserstand ausreicht. Meistens kann man noch im Oktober fahren. Juli und August sind die verkehrsreichsten Monate.'
        },
        {
            keywords: ['čačina', 'vorne', 'welle', 'cacina', 'was ist das', 'vorderteil', 'traditionelles element'],
            answer: 'Die „Čačina“ am vorderen Teil des Floßes dient dazu, Wellen aufzuhalten, die sonst von vorne ins Floß laufen würden. Es ist ein wichtiges Element der traditionellen Flößer-Architektur, das seit Jahrhunderten verwendet wird.'
        },
        {
            keywords: ['polnisch', 'polnische', 'schneller', 'unterschied', 'polnische flöße', 'warum sind sie schneller', 'unterschied zu polnischen'],
            answer: 'Polnische Flöße sind schmaler und der Winkel des Holzes vorne ist steiler, was den Wasserwiderstand verringert und die Geschwindigkeit erhöht. Sie sind jedoch anfälliger für seitliches Spritzen.'
        },
        {
            keywords: ['rücktransport', 'winde', 'zerlegen', 'lkw', 'wie kommen die flöße zurück', 'transport', 'floßtransport'],
            answer: 'Nach der Ankunft werden die Flöße mit einer Winde ans Ufer gezogen, manuell zerlegt, auf einen LKW geladen und zurück zum Start gebracht, wo sie wieder zusammengesetzt und auf dem Wasser verbunden werden.'
        },
        {
            keywords: ['gewicht', 'schwer', 'kg', 'wie schwer', 'gewicht eines flosses', 'wie viel wiegt ein floß'],
            answer: 'Ein Floß wiegt zwischen 500 kg und 800 kg. Es besteht aus 5 Teilen, die mit Wasser vollgesogen und sehr schwer sind (jeweils über 100 kg). Im Floß befinden sich auch Ersatzstangen, Bänke, Rettungswesten und Rettungsringe.'
        },
        {
            keywords: ['sicherheit', 'sicher', 'gefahr', 'angst', 'ist es sicher', 'schwimmwesten', 'rettungsringe', 'für kinder'],
            answer: 'Die Fahrt ist sicher. Die Flößer sind erfahren und kümmern sich um Ihre Sicherheit während der gesamten Fahrt. Für Kinder stehen Rettungswesten zur Verfügung. Rettungsringe und Erste-Hilfe-Sets sind auf jedem Floß vorhanden.'
        },
        {
            keywords: ['tiefe', 'wie tief', 'tief', 'wassertiefe', 'tiefste stelle', 'fluss tiefe'],
            answer: 'Die Tiefe des Dunajec variiert – von 30 cm in flachen Abschnitten bis zu 12–18 Metern an manchen Stellen. Die durchschnittliche Tiefe während der Fahrt beträgt etwa 1-2 Meter.'
        },
        {
            keywords: ['geschwindigkeit', 'wie schnell', 'km/h', 'geschwindigkeit des flosses', 'schnell', 'langsam', 'fahrtgeschwindigkeit'],
            answer: 'Die Geschwindigkeit des Floßes lässt sich nicht genau angeben. Sie hängt vom Tiefgang, dem Wasserstand und der Bauweise des Floßes ab. Die typische Geschwindigkeit beträgt etwa 5-8 km/h.'
        },
        {
            keywords: ['herstellung', 'wer baut', 'tischler', 'chef', 'bau der flöße', 'handarbeit', 'traditionelle bauweise'],
            answer: 'Die Flöße werden von unserem Chef gebaut, der Tischler ist. Jedes Floß wird handgefertigt mit Fokus auf Tradition und Qualität. Der Bau eines Floßes dauert mehrere Tage.'
        },
        {
            keywords: ['selber bauen', 'eigenes floß', 'zulassung', 'kann ich selbst ein floß bauen', 'eigenes floß bauen', 'genehmigung'],
            answer: 'Nein, ein Floß ist ein Wasserfahrzeug und hat eine Zulassungsnummer wie ein Auto. Für den Bau ist ein Zertifikat erforderlich. Sie können kein eigenes Floß für den kommerziellen Gebrauch bauen.'
        },
        {
            keywords: ['preis', 'kosten', 'wie viel', 'karte', '€', 'euro', 'erwachsene', 'kinder', 'ermäßigung', 'familie', 'preise'],
            answer: 'Der aktuelle Preis für Erwachsene beträgt 25 €. Kinder unter 14 Jahren erhalten eine Ermäßigung (normalerweise 15 €). Studenten und Rentner zahlen oft 23 €. Familienpakete sind verfügbar. Genau Preise erfragen Sie bitte vor Ort – sie können je nach Saison variieren.'
        },
        {
            keywords: ['hund', 'hunde', 'haustiere', 'darf ich meinen hund mitnehmen', 'hund auf dem floß', 'tier', 'mit hund'],
            answer: 'Hunde sind nach Absprache vor Ort erlaubt. Der Besitzer ist für das Verhalten des Hundes während der Fahrt verantwortlich. Bitte halten Sie Ihren Hund an der Leine.'
        },
        {
            keywords: ['parken', 'parkplatz', 'auto', 'wo parken', 'parken kostenlos', 'parkmöglichkeiten'],
            answer: 'Parkplätze sind direkt an der Anlegestelle in Majere vorhanden. Für unsere Gäste ist das Parken in der Regel kostenlos. In der Hochsaison empfehlen wir, früher zu kommen, um einen Parkplatz zu sichern.'
        },
        {
            keywords: ['wetter', 'regen', 'regnet', 'abgesagt', 'verschoben', 'was bei regen', 'schlechtes wetter', 'stornierung'],
            answer: 'Die Fahrt findet auch bei leichtem Regen statt. Bei starkem Regen, Sturm oder sehr hohem/niedrigem Wasserstand kann die Fahrt aus Sicherheitsgründen abgesagt oder verschoben werden. Sie werden rechtzeitig informiert.'
        },
        {
            keywords: ['foto', 'fotos', 'kamera', 'handy', 'fotografieren', 'darf ich fotografieren', 'aufnahmen'],
            answer: 'Sie können fotografieren, aber wir empfehlen, Ihr Handy oder Ihre Kamera zu sichern (z.B. wasserdichte Hülle). Persönliche Gegenstände können Sie im Auto oder in der Aufbewahrung an der Anlegestelle lassen.'
        },
        {
            keywords: ['zahlung', 'bar', 'karte', 'kreditkarte', 'wie bezahlen', 'bezahlung', 'zahlungsmethoden'],
            answer: 'Die Zahlung erfolgt in bar vor der Fahrt an der Anlegestelle. Kartenzahlung ist nicht möglich, bringen Sie bitte ausreichend Bargeld mit.'
        },
        {
            keywords: ['toilette', 'wc', 'sanitär', 'wo ist toilette', 'sanitäranlagen'],
            answer: 'Toiletten sind an der Anlegestelle vorhanden. Während der Fahrt selbst gibt es keine Toilettenpausen.'
        },
        {
            keywords: ['sprache', 'deutsch', 'englisch', 'führer', 'kommentar', 'spricht man deutsch', 'führung'],
            answer: 'Die Flößer geben während der Fahrt oft Erklärungen. Sie sprechen Slowakisch und Polnisch, einige auch Deutsch oder Englisch.'
        },
        {
            keywords: ['essen', 'snack', 'restaurant', 'cafe', 'gastronomie', 'verpflegung', 'was essen'],
            answer: 'In der Nähe der Anlegestelle finden Sie Imbisse und Restaurants. Während der Fahrt empfehlen wir, eigenes Wasser mitzunehmen. Es gibt keine Verpflegung auf dem Floß.'
        },
        {
            keywords: ['kinder', 'kind', 'familie', 'mit kindern', 'familienfreundlich', 'kinderwagen', 'baby'],
            answer: 'Kinder sind willkommen! Schwimmwesten werden gestellt. Kinder unter 3 Jahren fahren kostenlos. Die Fahrt ist ruhig und sicher für Familien. Kinderwagen können an der Anlegestelle abgestellt werden.'
        }
    ],
    //Maďarsky
    hu: [
        {
            keywords: ['foglalás', 'előre', 'csoport', '12 fő', 'foglalni', 'előzetes', 'csoportos', '12 fõ', 'nagy csoport', 'előre foglalás', 'kell foglalni'],
            answer: 'Előzetes foglalás nem kötelező, de ajánljuk, hogy legalább egy nappal korábban hívjon, hogy ellenőrizze a tutajozási időpontokat és elkerülje a hosszú várakozást. Nagyobb csoportoknál (12 fő felett) legalább egy nappal előre szükséges a foglalás, lehetőleg 3 nappal.'
        },
        {
            keywords: ['hol', 'cím', 'címen', 'majere', 'hol van', 'cím', 'megtalál', 'gps', 'koordináta', 'cerveny klastor', 'vörös kolostor'],
            answer: 'Majere 34, Prešovský kraj címen talál minket Szlovákiában. A tutajkikötő Červený Kláštorban (Vörös Kolostor) van. GPS koordináták: 49.3985° É, 20.4198° K.'
        },
        {
            keywords: ['mennyi ideig', 'időtartam', 'km', 'mennyi idő', 'hossz', 'hány kilométer', 'mennyi ideig tart', 'idő', 'hosszúság'],
            answer: 'A tutajozás Červený Kláštortól Lesnicáig 11 km hosszú és körülbelül 1,5 órát vesz igénybe. A pontos idő a Dunajec aktuális vízszintjétől függ.'
        },
        {
            keywords: ['ruha', 'öltözet', 'mit vigyek', 'esőkabát', 'ruházat', 'mibe öltözzek', 'cipő', 'vízálló', 'mit hozzak'],
            answer: 'Nyáron rövidnadrágot és pólót ajánlunk. Vigyen magával pulóvert is. Rossz idő esetén vízálló ruházatot és jó cipőt hozzon. Mentőmellényt biztosítunk.'
        },
        {
            keywords: ['víz', 'vizes', 'nedves', 'száraz lábbal', 'bemegy a víz', 'vizes leszek', 'nedves leszek', 'fröcsköl', 'vizesedés'],
            answer: 'Száraz lábbal száll be a tutajra. Az út során általában nem kerül víz a tutajba, de néha néhány csepp fröccsenhet az oldalon ülőkre. Nem vizes élmény.'
        },
        {
            keywords: ['nehéz', 'biztonságos', 'veszélyes', 'biztonságos-e', 'gyerekeknek', 'kezdőknek', 'családoknak', 'nehézség', 'nehéz-e'],
            answer: 'A Dunajec nem nehéz. Tapasztalt, tanúsított tutajosokkal utazik, akik több ezer kilométeres tapasztalattal rendelkeznek. A túra biztonságos gyerekek, családok és kezdők számára. Csak élvezze az utat.'
        },
        {
            keywords: ['úszni', 'ugrani', 'fürdeni', 'beugrani', 'lehet úszni', 'szabad fürdeni', 'vízbe ugrani', 'fürdés'],
            answer: 'Nem, a tutajozás közben tilos a vízbe ugrani. A Pieniny látogatói szabályzat biztonsági és természetvédelmi okokból nem engedélyezi.'
        },
        {
            keywords: ['visszaút', 'vissza', 'taxi', 'kerékpár', 'gyalog', 'hogyan jussak vissza', 'visszajutás', 'bicikli', 'shuttle', 'busz'],
            answer: 'Több lehetőség van: gyalog a folyó menti gyönyörű ösvényen (kb. 2 óra), kerékpárkölcsönzés (felnőtt és gyerek kerékpárok a parkolóban), vagy igénybe veheti 9 személyes taxi szolgáltatásunkat. Válassza ki, amelyik a legjobban megfelel!'
        },
        {
            keywords: ['tutajos', 'legyek', 'tanulni', 'munka', 'hogyan legyek tutajos', 'tutajos munka', 'képzés', 'követelmények', 'engedély'],
            answer: 'Ha tutajos szeretne lenni, jöjjön el hozzánk. Egy tapasztalt tutajos magával viszi tanulni. Amikor egyedül is boldogul az egész úttal, egy idősebb tutajos ellenőrzi. Szükséges a kis vízi járművezetői engedély is.'
        },
        {
            keywords: ['szezonon kívül', 'tél', 'munka', 'télen mit csinálnak', 'szezonon kívül dolgoznak', 'téli munka', 'off season'],
            answer: 'A tutajozás a legtöbb tutajosnak nem főállás – mellékes jövedelem. Diákok, nyugdíjasok és más főállású emberek dolgoznak nálunk. Télen a tutajok karbantartásával foglalkoznak vagy a főállásukban dolgoznak.'
        },
        {
            keywords: ['szezon', 'mikor', 'tavasz', 'április', 'május', 'október', 'mikor lehet tutajozni', 'szezon kezdete', 'szezon vége', 'legjobb idő'],
            answer: 'A szezon általában tavasszal (április, május) kezdődik és őszig tart, amíg megfelelő a vízszint. Általában októberben is lehet még tutajozni. Július és augusztus a legforgalmasabb hónapok.'
        },
        {
            keywords: ['ár', 'cena', 'mennyibe kerül', 'jegy', '€', 'euro', 'felnőtt', 'gyerek', 'kedvezmény', 'árak', 'családi kedvezmény'],
            answer: 'A jelenlegi ár felnőtteknek 25 €. 14 év alatti gyerekek kedvezményt kapnak (általában 15 €). Diákok és nyugdíjasok gyakran 23 €-t fizetnek. Családi csomagok is elérhetők. Pontos árakat a helyszínen ellenőrizze, mert szezonálisan változhatnak.'
        },
        {
            keywords: ['kutya', 'kutyák', 'állatok', 'vihetem a kutyámat', 'kutyával', 'állat', 'kutya a tutajon'],
            answer: 'Kutyák a helyszíni egyeztetés után engedélyezettek. A gazda felelős a kutya viselkedéséért a tutajozás során. Kérjük, tartsa a kutyát pórázon.'
        },
        {
            keywords: ['parkolás', 'parkoló', 'autó', 'hova parkoljak', 'ingyenes parkolás', 'parkolási lehetőség'],
            answer: 'Parkoló közvetlenül a kikötőnél, Majere-ban található. Vendégeink számára a parkolás általában ingyenes. A főszezonban javasoljuk, hogy korábban érkezzen, hogy biztosítsa a parkolóhelyet.'
        },
        {
            keywords: ['időjárás', 'eső', 'szakad az eső', 'lemondás', 'elhalasztás', 'rossz idő', 'mit csinálnak ha esik'],
            answer: 'A tutajozás enyhe esőben is megtartjuk. Heves esőzés, vihar vagy nagyon magas/alacsony vízállás esetén a tutajozás biztonsági okokból törölhető vagy elhalasztható. Erről időben tájékoztatjuk.'
        },
        {
            keywords: ['fotó', 'fényképezés', 'mobil', 'fényképezőgép', 'lehet fényképezni', 'fotózás', 'képek'],
            answer: 'Fényképezhet, de javasoljuk, hogy a telefont vagy fényképezőgépet biztosítsa (pl. vízálló tokban). Személyes tárgyait hagyhatja az autóban vagy a kikötőben a tárolóban.'
        },
        {
            keywords: ['fizetés', 'készpénz', 'kártya', 'hogyan fizethetek', 'bankkártya', 'fizetési mód'],
            answer: 'A fizetés készpénzben történik a tutajozás előtt a kikötőben. Bankkártyát nem fogadunk el, ezért kérem, hozzon magával elegendő készpénzt.'
        },
        {
            keywords: ['wc', 'toalett', 'mosdó', 'hol van wc', 'illetőség', 'vécé'],
            answer: 'WC-k a beszállási helyen (kikötő) állnak rendelkezésre. Maga a tutajozás során nincs WC-megálló.'
        },
        {
            keywords: ['nyelv', 'angol', 'német', 'lengyel', 'idegenvezetés', 'magyarul beszélnek', 'nyelvtudás'],
            answer: 'A tutajosok gyakran nyújtanak kommentárt a túra során. Szlovákul és lengyelül beszélnek, néhányan angolul és németül is. Magyarul is megértik a kérdéseket.'
        },
        {
            keywords: ['étel', 'falatozás', 'büfé', 'étterem', 'kávézó', 'mit egyek', 'ital', 'étkezés'],
            answer: 'A kikötő környékén büfék és éttermek találhatók. A tutajozás során javasoljuk, hogy saját vizet hozzon magával. A tutajon nincs étkezési lehetőség.'
        },
        {
            keywords: ['gyerekek', 'gyerek', 'család', 'gyerekkel', 'családbarát', 'babakocsi', 'kisgyerek', 'csecsemő'],
            answer: 'A gyerekeket szívesen látjuk! Mentőmellényt biztosítunk. 3 év alatti gyerekek ingyenesen utaznak. A túra nyugodt és biztonságos családok számára. A babakocsit a kikötőben hagyhatja.'
        },
        {
            keywords: ['tutaj', 'súly', 'nehéz', 'kg', 'mennyi a tutaj súlya', 'miből készül', 'tutaj felépítése'],
            answer: 'Egy tutaj 500 kg és 800 kg között lehet. 5 részből áll, amelyek vízzel telítettek és nagyon nehezek (mindegyik több mint 100 kg). A tutajon pótrúdak, padok, mentőmellények és mentőkarikák is találhatók.'
        },
        {
            keywords: ['sebesség', 'milyen gyors', 'km/h', 'tutaj sebessége', 'gyorsan megy', 'lassan megy'],
            answer: 'A tutaj sebessége nem határozható meg pontosan. Függ a tutaj merülésétől, a vízszinttől és a tutaj felépítésétől. A tipikus sebesség körülbelül 5-8 km/h.'
        },
        {
            keywords: ['mélység', 'milyen mély', 'mély', 'vízmélység', 'mély a víz'],
            answer: 'A Dunajec mélysége változó – 30 cm-től a sekélyebb szakaszokon 12-18 méterig egyes helyeken. Az átlagos mélység a tutajozás során körülbelül 1-2 méter.'
        },
        {
            keywords: ['busz', 'vonat', 'autó nélkül', 'tömegközlekedés', 'hogyan jutok el autó nélkül'],
            answer: 'Červený Kláštorba busszal juthat el. A legközelebbi vasútállomás Ólublón (Stará Ľubovňa) van, ahonnan busszal folytathatja az utat. Menetrendeket előzetesen ellenőrizze.'
        }
    ],
    cz: [
        {
            keywords: ['rezervace', 'rezervovat', 'předem', 'skupina', '12 osob', 'rezervace', 'vopred', 'dopredu', 'skupiny', 'větší skupina', '12 osob', 'rezervace online', 'telefon'],
            answer: 'Rezervace předem není nutná, ale doporučujeme zavolat alespoň den předem a ověřit si časy plavby, abyste se vyhnuli dlouhému čekání. Pro větší skupiny (více než 12 osob) je rezervace nutná minimálně den předem, ideálně 3 dny.'
        },
        {
            keywords: ['kde', 'adresa', 'najít', 'majere', 'cerveny klastor', 'gps', 'jak se dostat', 'poloha', 'mapa', 'přístav', 'přístaviště', 'červený klášter'],
            answer: 'Najdete nás na adrese: Majere 34, Prešovský kraj, Slovensko. Přístaviště vorů je v Červeném Klášteře. GPS souřadnice: 49.3985° N, 20.4198° E.'
        },
        {
            keywords: ['jak dlouho', 'doba', 'trvání', 'km', 'dlouho', 'čas', 'délka', 'hodiny', 'minuty', 'kilometry', 'jak dlouho trvá', 'délka plavby'],
            answer: 'Plavba z Červeného Kláštera do Lesnice je dlouhá 11 km a trvá přibližně 1,5 hodiny. Přesný čas závisí na aktuální výšce vodní hladiny Dunajce.'
        },
        {
            keywords: ['oblečení', 'co si vzít', 'nepromokavé', 'obléci', 'oblečeni', 'jak se obléct', 'co vzít s sebou', 'pláštěnka', 'bunda', 'boty', 'mikina', 'kraťasy', 'tričko'],
            answer: 'V létě doporučujeme kraťasy a tričko. Vezměte si také mikinu. Při špatném počasí nepromokavé oblečení a kvalitní obuv. Záchranné vesty jsou poskytnuty.'
        },
        {
            keywords: ['voda', 'zmoknout', 'suchou nohou', 'mokrý', 'mokro', 'zmoknuti', 'voda na voru', 'cáká', 'šplíchne', 'bude to mokré'],
            answer: 'Na vor nastupujete suchou nohou. Během plavby se voda do voru nedostává, ale výjimečně může pár kapek šplíchnout na sedící u okraje. Není to mokrá zábava.'
        },
        {
            keywords: ['těžké', 'bezpečné', 'nebezpečné', 'náročné', 'obtížné', 'bezpečnost', 'pro děti', 'pro rodiny', 'zvládnu to', 'je to bezpečné', 'strach'],
            answer: 'Dunajec není náročný. Plujete s certifikovanými voroplavci, kteří mají za sebou tisíce kilometrů. Plavba je bezpečná pro děti, rodiny i začátečníky. Nemusíte se o nic starat, jen si užívat plavbu.'
        },
        {
            keywords: ['plavat', 'skákat', 'koupání', 'skok', 'skákat', 'plavání', 'voda', 'koupání v řece', 'můžu plavat', 'můžu skočit'],
            answer: 'Ne, skákání do vody během plavby je zakázáno. Návštěvní řád Pienin to z bezpečnostních a ochranných důvodů neumožňuje.'
        },
        {
            keywords: ['návrat', 'zpět', 'taxi', 'kolo', 'pěšky', 'jak se vrátit', 'dostat se zpět', 'shuttle', 'autobus', 'transport', 'zpáteční cesta'],
            answer: 'Několik možností: pěšky krásnou stezkou podél řeky (asi 2 hodiny), půjčit si kolo (dospělé i dětské na parkovišti) nebo využít naši taxi službu s 9-místnými vozy. Vyberte si, co vám nejlépe vyhovuje!'
        },
        {
            keywords: ['voroplavec', 'voroplavci', 'práce', 'jak se stát', 'stát se', 'naučit', 'učit se', 'vorař', 'voraři', 'práce voraře', 'vodičský průkaz'],
            answer: 'Pokud máte zájem stát se voroplavcem, přijďte k nám. Zkušený voroplavec vás vezme s sebou na vor, kde se budete učit. Až zvládnete celou plavbu sami, starší voroplavec vás přezkouší. Voroplavci musí mít také průkaz vodce malého plavidla.'
        },
        {
            keywords: ['mimo sezónu', 'zima', 'co dělají', 'práce', 'vedlejší příjem', 'sezóna', 'mimo sezonu'],
            answer: 'Vorařství není hlavní práce pro většinu voroplavců – je to přivýdělek. Pracují zde studenti, důchodci a lidé s jiným hlavním zaměstnáním. V zimě se věnují údržbě vorů nebo pracují ve svých hlavních zaměstnáních.'
        },
        {
            keywords: ['sezona', 'kdy', 'jaro', 'duben', 'květen', 'říjen', 'kdy jet', 'nejlepší doba', 'začátek sezony', 'konec sezony', 'otevřeno', 'měsíce'],
            answer: 'Sezona obvykle začíná na jaře (duben, květen) a trvá až do podzimu, dokud je dostatečná hladina vody. Obvykle se dá plavit ještě v říjnu. Červenec a srpen jsou nejrušnější měsíce.'
        },
        {
            keywords: ['cena', 'ceník', 'kolik stojí', 'lístek', '€', 'euro', 'dospělý', 'děti', 'sleva', 'rodina', 'ceny'],
            answer: 'Aktuální cena pro dospělou osobu je 25 €. Děti do 14 let mají slevu (obvykle 15 €). Studenti a důchodci často 23 €. Rodinné balíčky jsou k dispozici. Přesné ceny ověřte na místě, protože se mohou měnit podle sezóny.'
        },
        {
            keywords: ['pes', 'psi', 'zvířata', 'můžu si vzít psa', 'pes na voru', 'se psem', 'domácí zvíře'],
            answer: 'Psi jsou povoleni po dohodě na místě. Majitel je zodpovědný za chování psa během plavby. Prosíme, mějte psa na vodítku.'
        },
        {
            keywords: ['parkování', 'parkoviště', 'auto', 'kde zaparkovat', 'parkovací místa', 'parkování zdarma'],
            answer: 'Parkoviště je k dispozici přímo u přístaviště v Majere. Pro naše zákazníky je parkování většinou zdarma. V hlavní sezóně doporučujeme přijet dříve, abyste si zajistili místo.'
        },
        {
            keywords: ['počasí', 'déšť', 'prší', 'zrušení', 'odložení', 'špatné počasí', 'co když prší', 'když prší'],
            answer: 'Plavba probíhá i při mírném dešti. Při silném dešti, bouřce nebo velmi vysoké/nízké hladině vody může být plavba z bezpečnostních důvodů zrušena nebo odložena. V takovém případě vás včas informujeme.'
        },
        {
            keywords: ['foto', 'fotit', 'fotografovat', 'mobil', 'fotoaparát', 'fotky', 'fotografie', 'můžu fotit'],
            answer: 'Fotografovat můžete, ale doporučujeme mobil nebo foťák zajistit (např. vodotěsným obalem). Osobní věci si můžete nechat v autě nebo v úschovně na provozovně.'
        },
        {
            keywords: ['platba', 'hotovost', 'karta', 'zaplacení', 'jak zaplatit', 'platit', 'kartou'],
            answer: 'Platba probíhá v hotovosti před plavbou na provozovně. Platba kartou není možná, vezměte si prosím dostatek hotovosti.'
        },
        {
            keywords: ['toaleta', 'wc', 'záchod', 'hygiena', 'kde je toaleta', 'kde se jít', 'toalety'],
            answer: 'Toalety jsou k dispozici u nástupního místa (přístaviště). Během samotné plavby se zastávky na toaletu nedělají.'
        },
        {
            keywords: ['jazyk', 'anglicky', 'polsky', 'průvodce', 'výklad', 'mluví anglicky', 'mluví polsky', 'průvodce jazyk'],
            answer: 'Voroplavci často poskytují výklad během plavby. Kromě slovenštiny se domluví i polsky, někteří také anglicky a německy.'
        },
        {
            keywords: ['firemní akce', 'teambuilding', 'skupiny', 'firma', 'akce pro firmy', 'větší skupiny'],
            answer: 'Pro firemní akce a větší skupiny můžeme zajistit organizovanou plavbu na míru. Doporučujeme rezervaci několik dní předem.'
        },
        {
            keywords: ['autobus', 'vlak', 'bez auta', 'doprava', 'jak se dostat bez auta', 'veřejná doprava'],
            answer: 'Do Červeného Kláštera se dostanete autobusem. Nejbližší vlaková stanice je ve Staré Ľubovni, odkud pokračujete autobusem. Před cestou zkontrolujte místní jízdní řády.'
        },
        {
            keywords: ['jídlo', 'občerstvení', 'bufet', 'restaurace', 'pití', 'kavárna', 'co k jídlu'],
            answer: 'V okolí přístaviště najdete bufety a restaurace. Během plavby doporučujeme mít s sebou vlastní vodu. Na voru není zajištěno občerstvení.'
        },
        {
            keywords: ['děti', 'dítě', 'rodina', 's dětmi', 'dětská', 'kočárek', 'děti na voru', 'dětská plavba'],
            answer: 'Děti jsou vítány! Záchranné vesty jsou k dispozici. Děti do 3 let plavou zdarma. Plavba je klidná a bezpečná pro rodiny. Kočárky můžete nechat v přístavišti.'
        }
    ],

    // RUŠTINA (ru)
    ru: [
        {
            keywords: ['бронирование', 'заранее', 'группа', '12 человек', 'бронировать', 'забронировать', 'нужно ли бронировать', 'предварительно', 'большая группа', 'группы', '12 человек', 'бронь', 'заказ'],
            answer: 'Бронирование заранее не обязательно, но мы рекомендуем позвонить хотя бы за день, чтобы уточнить время сплава и избежать долгого ожидания. Для больших групп (более 12 человек) бронирование необходимо минимум за день, лучше за 3 дня.'
        },
        {
            keywords: ['где', 'адрес', 'найти', 'majere', 'как добраться', 'расположение', 'карта', 'gps', 'координаты', 'червены клаштор', 'пристань', 'местонахождение'],
            answer: 'Вы найдете нас по адресу: Majere 34, Прешовский край, Словакия. Пристань плотов находится в Червеном Клашторе. GPS координаты: 49.3985° с.ш., 20.4198° в.д.'
        },
        {
            keywords: ['сколько времени', 'длительность', 'км', 'сколько длится', 'время', 'продолжительность', 'сколько км', 'длина маршрута', 'сколько часов', 'минут'],
            answer: 'Сплав от Червеного Клаштора до Лесницы составляет 11 км и длится примерно 1,5 часа. Точное время зависит от текущего уровня воды в Дунайце.'
        },
        {
            keywords: ['одежда', 'что взять', 'непромокаемая', 'во что одеться', 'как одеться', 'что надеть', 'куртка', 'дождевик', 'обувь', 'с собой', 'с собой взять'],
            answer: 'Летом рекомендуем шорты и футболку. Возьмите с собой также толстовку. При плохой погоде — непромокаемую одежду и хорошую обувь. Спасательные жилеты предоставляются.'
        },
        {
            keywords: ['вода', 'промокнуть', 'сухими ногами', 'намокнуть', 'мокрый', 'брызги', 'обрызгает', 'будет ли вода', 'зальет'],
            answer: 'На плот садятся сухими ногами. Во время сплава вода обычно не попадает в плот, но иногда может плеснуть несколько капель на сидящих у края. Это не мокрое развлечение.'
        },
        {
            keywords: ['сложно', 'безопасно', 'опасно', 'страшно', 'для детей', 'для начинающих', 'для семей', 'трудно', 'легко', 'сложность', 'уровень сложности'],
            answer: 'Дунайец не сложная река. Вы плывете с сертифицированными плотогонами, у которых за плечами тысячи километров опыта. Сплав безопасен для детей, семей и начинающих. Вам не нужно ни о чем беспокоиться — просто наслаждайтесь поездкой.'
        },
        {
            keywords: ['плавать', 'прыгать', 'купание', 'искупаться', 'прыгнуть в воду', 'можно ли купаться', 'купаться в реке', 'запрещено'],
            answer: 'Нет, прыгать в воду во время сплава запрещено. Правила посещения Пьенин не позволяют этого по соображениям безопасности и охраны природы.'
        },
        {
            keywords: ['возвращение', 'назад', 'такси', 'велосипед', 'пешком', 'как вернуться', 'обратный путь', 'транспорт', 'как добраться обратно', 'шаттл'],
            answer: 'Несколько вариантов: вернуться пешком по красивой тропе вдоль реки (около 2 часов), взять напрокат велосипед (взрослые и детские велосипеды ждут на парковке), или воспользоваться нашим такси (9-местные автомобили). Выбирайте, что вам больше подходит!'
        },
        {
            keywords: ['плотогон', 'стать', 'научиться', 'работа', 'лицензия', 'как стать плотогоном', 'работа плотогоном', 'обучение', 'требования'],
            answer: 'Если вы хотите стать плотогоном, приходите к нам. Опытный плотогон возьмет вас с собой на плот, где вы будете учиться. Когда вы сможете самостоятельно провести весь сплав, старший плотогон проверит вас. Плотогонам также необходимо иметь удостоверение водителя малого судна.'
        },
        {
            keywords: ['вне сезона', 'зима', 'работа', 'что делают зимой', 'чем занимаются', 'основная работа', 'подработка', 'не сезон'],
            answer: 'Плотогонство не является основной работой для большинства плотогонов – это дополнительный заработок. Здесь работают студенты, пенсионеры и люди с другой основной работой. Зимой они занимаются обслуживанием плотов или работают на своей основной работе.'
        },
        {
            keywords: ['сезон', 'когда', 'весна', 'апрель', 'май', 'октябрь', 'когда лучше', 'начало сезона', 'конец сезона', 'месяцы', 'когда можно плыть'],
            answer: 'Сезон обычно начинается весной (апрель, май) и длится до осени, пока уровень воды достаточен. Обычно можно плыть до октября. Июль и август — самые загруженные месяцы.'
        },
        {
            keywords: ['чачина', 'передняя часть', 'волна', 'что это', 'зачем', 'нос плота', 'традиционный элемент'],
            answer: '«Чачина» в передней части плота служит для остановки волн, которые иначе заливались бы в плот спереди. Это важный элемент традиционной архитектуры плотов, используемый на протяжении веков.'
        },
        {
            keywords: ['польские', 'польские плоты', 'быстрее', 'отличие', 'разница', 'почему быстрее', 'архитектура'],
            answer: 'Польские плоты уже, и угол наклона дерева спереди круче, что уменьшает сопротивление воды и увеличивает скорость. Однако они более подвержены забрызгиванию водой с боков.'
        },
        {
            keywords: ['возврат плотов', 'лебедка', 'разбирают', 'грузовик', 'как возвращают', 'транспортировка', 'перевозка'],
            answer: 'После прибытия плоты вытаскивают на берег лебедкой, вручную разбирают, грузят на грузовик и везут обратно к старту, где снова собирают и соединяют на воде.'
        },
        {
            keywords: ['вес', 'масса', 'сколько весит', 'кг', 'тяжелый', 'вес плота', 'сколько кг', 'из чего состоит'],
            answer: 'Плот может весить от 500 кг до 800 кг. Он состоит из 5 частей, которые пропитаны водой и очень тяжелые (каждая более 100 кг). На плоту также есть запасные шесты, скамейки, спасательные жилеты и спасательные круги.'
        },
        {
            keywords: ['безопасность', 'безопасно', 'опасно', 'страшно', 'для детей', 'спасательные жилеты', 'страховка'],
            answer: 'Сплав безопасен. Плотогоны опытны и позаботятся о вашей безопасности на протяжении всего путешествия. Для детей предусмотрены спасательные жилеты. На каждом плоту есть спасательные круги и аптечка.'
        },
        {
            keywords: ['глубина', 'глубоко', 'какая глубина', 'насколько глубоко', 'глубина реки', 'глубокие места', 'мелко'],
            answer: 'Глубина Дунайца различна – от 30 см на мелких участках до 12–18 метров в некоторых местах. Средняя глубина во время сплава составляет около 1-2 метров.'
        },
        {
            keywords: ['скорость', 'как быстро', 'км/ч', 'быстро ли плывет', 'скорость плота', 'медленно', 'быстро'],
            answer: 'Скорость плота невозможно точно определить. Она зависит от осадки плота, уровня воды и конструкции плота. Типичная скорость составляет около 5-8 км/ч, что сравнимо с быстрой ходьбой.'
        },
        {
            keywords: ['производство', 'кто делает', 'столяр', 'шеф', 'изготовление', 'строительство', 'кто строит', 'ручная работа'],
            answer: 'Плоты изготавливает наш шеф, который является столяром. Каждый плот изготавливается вручную с акцентом на традиции и качество. Строительство одного плота занимает несколько дней.'
        },
        {
            keywords: ['сделать самому', 'свой плот', 'построить', 'разрешение', 'регистрационный номер', 'сертификат', 'можно ли построить'],
            answer: 'Нет, плот является судном и имеет регистрационный номер, как автомобиль. Для его постройки требуется сертификат. Вы не можете построить свой собственный плот для коммерческого использования.'
        },
        {
            keywords: ['цена', 'сколько стоит', 'стоимость', 'билет', '€', 'евро', 'взрослый', 'ребенок', 'скидка', 'семья', 'цены', 'прайс'],
            answer: 'Актуальная цена для взрослого составляет 25 €. Дети до 14 лет имеют скидку (обычно 15 €). Студенты и пенсионеры часто платят 23 €. Семейные пакеты доступны. Точные цены уточняйте на месте, так как они могут меняться в зависимости от сезона.'
        },
        {
            keywords: ['собака', 'собаки', 'животные', 'можно с собакой', 'собака на плоту', 'питомец', 'с животными', 'домашние животные'],
            answer: 'Собаки допускаются по согласованию на месте. Владелец отвечает за поведение собаки во время сплава. Пожалуйста, держите собаку на поводке.'
        },
        {
            keywords: ['парковка', 'стоянка', 'машина', 'где парковаться', 'парковка бесплатно', 'оставить машину', 'парковочные места'],
            answer: 'Парковка находится прямо у пристани в Majere. Для наших клиентов парковка обычно бесплатна. В высокий сезон рекомендуем приезжать пораньше, чтобы найти место.'
        },
        {
            keywords: ['погода', 'дождь', 'идет дождь', 'отмена', 'перенос', 'плохая погода', 'что если дождь', 'отменят', 'перенесут'],
            answer: 'Сплав проходит даже при легком дожде. В случае сильного дождя, грозы или очень высокого/низкого уровня воды сплав может быть отменен или перенесен по соображениям безопасности. Вас своевременно проинформируют.'
        },
        {
            keywords: ['фото', 'фотографировать', 'фотографии', 'камера', 'телефон', 'можно ли фотографировать', 'снимать', 'съемка'],
            answer: 'Вы можете фотографировать, но рекомендуем защитить телефон или камеру (например, водонепроницаемым чехлом). Личные вещи вы можете оставить в машине или в камере хранения на пристани.'
        },
        {
            keywords: ['оплата', 'наличные', 'карта', 'как оплатить', 'оплатить', 'расчет', 'кредитная карта', 'безналичный расчет'],
            answer: 'Оплата производится наличными перед сплавом на пристани. Оплата картой не принимается, пожалуйста, возьмите с собой достаточно наличных.'
        },
        {
            keywords: ['туалет', 'wc', 'санузел', 'где туалет', 'уборная', 'туалеты'],
            answer: 'Туалеты есть на месте посадки (пристани). Во время самого сплава остановок для туалета нет.'
        },
        {
            keywords: ['язык', 'английский', 'польский', 'гид', 'экскурсия', 'комментарии', 'говорят по-русски', 'понимают', 'объяснения'],
            answer: 'Плотогоны часто дают пояснения во время сплава. Они говорят по-словацки и по-польски, некоторые также по-английски и по-немецки. По-русски понимают основные вопросы.'
        },
        {
            keywords: ['еда', 'перекус', 'буфет', 'ресторан', 'кафе', 'поесть', 'пить', 'что поесть', 'закуски'],
            answer: 'Рядом с пристанью есть закусочные и рестораны. Во время сплава рекомендуем взять с собой собственную воду. На плоту питание не предоставляется.'
        },
        {
            keywords: ['дети', 'ребенок', 'семья', 'с детьми', 'семейный', 'для детей', 'с ребенком', 'детская', 'коляска', 'маленькие дети'],
            answer: 'Дети приветствуются! Спасательные жилеты предоставляются. Дети до 3 лет плывут бесплатно. Сплав спокойный и безопасный для семей. Коляски можно оставить на пристани.'
        },
        {
            keywords: ['автобус', 'поезд', 'без машины', 'общественный транспорт', 'как добраться без машины', 'транспорт'],
            answer: 'До Червеного Клаштора можно добраться автобусом. Ближайшая железнодорожная станция находится в Стара-Любовне, откуда вы продолжите путь на автобусе. Проверьте местное расписание перед поездкой.'
        }
    ],

    // FRANCÚZŠTINA (fr)
    fr: [
        {
            keywords: ['réservation', 'réserver', 'à l\'avance', 'groupe', '12 personnes', 'réservations', 'réserver en avance', 'groupes', '12 personnes', 'réservation en ligne', 'téléphone', 'faut-il réserver', 'est-ce que je dois réserver', 'à l\'avance'],
            answer: 'La réservation à l\'avance n\'est pas obligatoire, mais nous recommandons d\'appeler au moins un jour avant pour vérifier les horaires et éviter une longue attente. Pour les groupes de plus de 12 personnes, la réservation est nécessaire au moins un jour à l\'avance, idéalement 3 jours.'
        },
        {
            keywords: ['où', 'adresse', 'trouver', 'majere', 'localisation', 'comment venir', 'carte', 'gps', 'coordonnées', 'cerveny klastor', 'embarcadère', 'où se trouve', 'adresse exacte'],
            answer: 'Vous nous trouverez à l\'adresse : Majere 34, région de Prešov, Slovaquie. L\'embarcadère des radeaux se trouve à Červený Kláštor. Coordonnées GPS : 49.3985° N, 20.4198° E.'
        },
        {
            keywords: ['combien de temps', 'durée', 'km', 'quelle durée', 'temps', 'kilomètres', 'distance', 'longueur', 'heures', 'minutes', 'combien de kilomètres', 'ça dure combien de temps'],
            answer: 'Le trajet en radeau de Červený Kláštor à Lesnica fait 11 km et dure environ 1,5 heure. La durée exacte dépend du niveau actuel de l\'eau de la rivière Dunajec.'
        },
        {
            keywords: ['vêtements', 'quoi porter', 'imperméable', 'comment s\'habiller', 'habits', 'tenue', 'veste', 'k-way', 'chaussures', 'vêtements chauds', 'pull', 'vêtements de pluie'],
            answer: 'En été, nous recommandons short et t-shirt. Prenez aussi un pull. En cas de mauvais temps, vêtements imperméables et chaussures solides. Les gilets de sauvetage sont fournis.'
        },
        {
            keywords: ['eau', 'se mouiller', 'pieds secs', 'mouillé', 'éclaboussures', 'vais-je être mouillé', 'entrée d\'eau', 'éclaboussé', 'mouiller'],
            answer: 'On monte sur le radeau les pieds secs. Pendant la descente, l\'eau n\'entre généralement pas dans le radeau, mais quelques gouttes peuvent parfois éclabousser les personnes assises sur les côtés. Ce n\'est pas une expérience humide.'
        },
        {
            keywords: ['difficile', 'facile', 'sécurisé', 'dangereux', 'est-ce que c\'est sûr', 'pour enfants', 'pour familles', 'débutants', 'sécurité', 'craintes', 'niveau de difficulté'],
            answer: 'La rivière Dunajec n\'est pas difficile. Vous naviguerez avec des radeleurs certifiés qui ont des milliers de kilomètres d\'expérience. La descente est sécurisée pour les enfants, les familles et les débutants. Vous n\'avez rien à faire à part vous détendre et profiter du voyage.'
        },
        {
            keywords: ['nager', 'sauter', 'baigner', 'se baigner', 'sauter dans l\'eau', 'peut-on nager', 'baignade dans la rivière', 'interdit', 'plonger'],
            answer: 'Non, sauter dans l\'eau pendant la descente est interdit. Le règlement des visiteurs de Pieniny ne l\'autorise pas pour des raisons de sécurité et de protection de la nature.'
        },
        {
            keywords: ['retour', 'revenir', 'taxi', 'vélo', 'à pied', 'comment revenir', 'chemin du retour', 'transport', 'navette', 'bus', 'comment rentrer'],
            answer: 'Plusieurs options : revenir à pied par le magnifique sentier le long de la rivière (environ 2 heures), louer un vélo (vélos adultes et enfants disponibles sur le parking), ou utiliser notre service de taxi avec véhicules 9 places. Choisissez ce qui vous convient le mieux !'
        },
        {
            keywords: ['radeleur', 'devenir', 'apprendre', 'travail', 'permis', 'comment devenir radeleur', 'métier', 'formation', 'exigences', 'devenir radeleur'],
            answer: 'Si vous souhaitez devenir radeleur, venez nous voir. Un radeleur expérimenté vous emmènera sur un radeau pour apprendre. Lorsque vous pourrez gérer toute la descente seul, un radeleur senior vous évaluera. Les radeleurs ont également besoin d\'un permis de conduire de petit bateau.'
        },
        {
            keywords: ['hors saison', 'hiver', 'travail', 'que font-ils', 'travail principal', 'revenu complémentaire', 'hors saison que font-ils', 'en hiver'],
            answer: 'Être radeleur n\'est pas le travail principal pour la plupart – c\'est un revenu complémentaire. Des étudiants, des retraités et des personnes avec un autre emploi principal travaillent ici. En hiver, ils s\'occupent de l\'entretien des radeaux ou travaillent à leur emploi principal.'
        },
        {
            keywords: ['saison', 'quand', 'printemps', 'avril', 'mai', 'octobre', 'meilleure période', 'début de saison', 'fin de saison', 'mois', 'quand peut-on faire'],
            answer: 'La saison commence généralement au printemps (avril, mai) et dure jusqu\'à l\'automne, tant que le niveau de l\'eau est suffisant. On peut généralement naviguer jusqu\'en octobre. Juillet et août sont les mois les plus fréquentés.'
        },
        {
            keywords: ['čačina', 'devant', 'vague', 'qu\'est-ce que c\'est', 'à quoi ça sert', 'proue', 'élément traditionnel', 'cacina'],
            answer: 'La "čačina" à l\'avant du radeau sert à arrêter les vagues qui autrement entreraient dans le radeau par l\'avant. C\'est un élément important de l\'architecture traditionnelle des radeaux, utilisé depuis des siècles.'
        },
        {
            keywords: ['polonais', 'radeaux polonais', 'plus rapides', 'différence', 'pourquoi sont-ils plus rapides', 'architecture', 'polonais vs slovaques'],
            answer: 'Les radeaux polonais sont plus étroits et l\'angle du bois à l\'avant est plus prononcé, ce qui réduit la résistance à l\'eau et augmente la vitesse. Cependant, ils sont plus sujets aux éclaboussures d\'eau sur les côtés.'
        },
        {
            keywords: ['retour des radeaux', 'treuil', 'démonter', 'camion', 'comment ils reviennent', 'transport', 'comment ils ramènent', 'processus'],
            answer: 'Après avoir atteint la destination, les radeaux sont tirés sur la rive avec un treuil, démontés manuellement, chargés sur un camion et ramenés au point de départ, où ils sont remontés et reliés sur l\'eau.'
        },
        {
            keywords: ['poids', 'lourd', 'kg', 'combien pèse', 'poids du radeau', 'kilos', 'de quoi est-il fait', 'parties'],
            answer: 'Un radeau peut peser entre 500 kg et 800 kg. Il se compose de 5 parties qui sont imbibées d\'eau et très lourdes (plus de 100 kg chacune). Le radeau contient également des perches de rechange, des bancs, des gilets de sauvetage et des bouées de sauvetage.'
        },
        {
            keywords: ['sécurité', 'sûr', 'dangereux', 'peur', 'pour enfants', 'gilets de sauvetage', 'est-ce que c\'est sécurisé', 'mesures de sécurité'],
            answer: 'La descente est sécurisée. Les radeleurs sont expérimentés et prendront soin de votre sécurité tout au long du voyage. Des gilets de sauvetage sont disponibles pour les enfants. Chaque radeau dispose de bouées de sauvetage et d\'une trousse de premiers secours.'
        },
        {
            keywords: ['profondeur', 'quelle profondeur', 'profond', 'profondeur de la rivière', 'endroits profonds', 'endroits peu profonds'],
            answer: 'La profondeur du Dunajec varie – de 30 cm dans les sections peu profondes à 12–18 mètres à certains endroits. La profondeur moyenne pendant la descente est d\'environ 1 à 2 mètres.'
        },
        {
            keywords: ['vitesse', 'quelle vitesse', 'km/h', 'rapidité', 'va vite', 'vitesse du radeau', 'rapide', 'lent'],
            answer: 'La vitesse du radeau ne peut pas être déterminée avec précision. Elle dépend du tirant d\'eau du radeau, du niveau de l\'eau et de l\'architecture du radeau. La vitesse typique est d\'environ 5-8 km/h, similaire à une marche rapide.'
        },
        {
            keywords: ['fabrication', 'qui fabrique', 'menuisier', 'chef', 'construction', 'comment sont-ils fabriqués', 'faits main', 'tradition'],
            answer: 'Les radeaux sont fabriqués par notre chef, qui est menuisier. Chaque radeau est fabriqué à la main avec un accent sur la tradition et la qualité. La construction d\'un radeau prend plusieurs jours.'
        },
        {
            keywords: ['fabriquer le sien', 'construire le sien', 'propre radeau', 'permis', 'numéro d\'enregistrement', 'certificat', 'puis-je construire'],
            answer: 'Non, un radeau est une embarcation et possède un numéro d\'enregistrement comme une voiture. Un certificat est requis pour sa construction. Vous ne pouvez pas construire votre propre radeau pour un usage commercial.'
        },
        {
            keywords: ['prix', 'coût', 'combien ça coûte', 'billet', '€', 'euro', 'adulte', 'enfant', 'réduction', 'famille', 'tarifs', 'tarif'],
            answer: 'Le prix actuel pour un adulte est de 25 €. Les enfants de moins de 14 ans bénéficient d\'une réduction (généralement 15 €). Les étudiants et les retraités paient souvent 23 €. Des forfaits familiaux sont disponibles. Les prix exacts peuvent varier selon la saison – vérifiez sur place.'
        },
        {
            keywords: ['chien', 'chiens', 'animaux', 'puis-je prendre mon chien', 'avec chien', 'animaux domestiques', 'chien autorisé', 'chien accepté'],
            answer: 'Les chiens sont autorisés sur accord sur place. Le propriétaire est responsable du comportement du chien pendant la descente. Veuillez tenir le chien en laisse.'
        },
        {
            keywords: ['parking', 'stationnement', 'voiture', 'où se garer', 'parking gratuit', 'garer la voiture', 'se garer', 'places de parking'],
            answer: 'Un parking est disponible directement à l\'embarcadère à Majere. Pour nos clients, le stationnement est généralement gratuit. En haute saison, nous recommandons d\'arriver tôt pour trouver une place.'
        },
        {
            keywords: ['météo', 'pluie', 'il pleut', 'annulation', 'report', 'mauvais temps', 'que se passe-t-il s\'il pleut', 'annulé', 'reporté'],
            answer: 'La descente a lieu même sous une pluie légère. En cas de fortes pluies, d\'orage ou de niveau d\'eau très haut/bas, la descente peut être annulée ou reportée pour des raisons de sécurité. Vous en serez informé à l\'avance.'
        },
        {
            keywords: ['photo', 'photos', 'photographier', 'téléphone', 'appareil photo', 'puis-je prendre des photos', 'photographie', 'prendre des photos'],
            answer: 'Vous pouvez prendre des photos, mais nous recommandons de sécuriser votre téléphone ou votre appareil photo (par exemple, avec un étui étanche). Vous pouvez laisser vos affaires dans la voiture ou au vestiaire de l\'embarcadère.'
        },
        {
            keywords: ['paiement', 'espèces', 'carte', 'comment payer', 'moyen de paiement', 'payer', 'carte bancaire', 'paiement par carte'],
            answer: 'Le paiement s\'effectue en espèces avant la descente à l\'embarcadère. Les cartes ne sont pas acceptées, veuillez apporter suffisamment d\'espèces.'
        },
        {
            keywords: ['toilettes', 'wc', 'sanitaires', 'où sont les toilettes', 'toilette', 'sanitaires sur place'],
            answer: 'Des toilettes sont disponibles au point d\'embarquement (embarcadère). Pendant la descente elle-même, il n\'y a pas d\'arrêts pour les toilettes.'
        },
        {
            keywords: ['langue', 'anglais', 'polonais', 'allemand', 'guide', 'commentaires', 'parlent-ils français', 'explications', 'langue du guide'],
            answer: 'Les radeleurs fournissent souvent des commentaires pendant la descente. Ils parlent slovaque et polonais, certains parlent aussi anglais et allemand. Ils comprennent les questions de base en français.'
        },
        {
            keywords: ['nourriture', 'snacks', 'buffet', 'restaurant', 'café', 'manger', 'boire', 'quoi manger', 'collation'],
            answer: 'Des snacks et des restaurants se trouvent près de l\'embarcadère. Pendant la descente, nous recommandons d\'apporter votre propre eau. Il n\'y a pas de service de restauration sur le radeau.'
        },
        {
            keywords: ['enfants', 'enfant', 'famille', 'avec enfants', 'familial', 'pour enfants', 'bébés', 'poussette', 'petits'],
            answer: 'Les enfants sont les bienvenus ! Des gilets de sauvetage sont fournis. Les enfants de moins de 3 ans naviguent gratuitement. La descente est calme et sécurisée pour les familles. Les poussettes peuvent être laissées à l\'embarcadère.'
        },
        {
            keywords: ['bus', 'train', 'sans voiture', 'transports en commun', 'comment venir sans voiture', 'transport public'],
            answer: 'Vous pouvez rejoindre Červený Kláštor en bus. La gare la plus proche est à Stará Ľubovňa, d\'où vous continuez en bus. Vérifiez les horaires locaux avant votre voyage.'
        }
    ],

    // ŠPANIELČINA (es)
    es: [
        {
            keywords: ['reserva', 'reservar', 'con antelación', 'grupo', '12 personas', 'reservación', 'reservar con tiempo', 'grupos grandes', 'reserva online', 'telefono', 'necesito reservar', 'hay que reservar', 'por adelantado', 'anticipación'],
            answer: 'La reserva previa no es obligatoria, pero recomendamos llamar al menos un día antes para verificar los horarios de los descensos y evitar esperas largas. Para grupos grandes (más de 12 personas) se requiere reserva con al menos un día de antelación, preferiblemente 3 días.'
        },
        {
            keywords: ['dónde', 'dirección', 'encontrar', 'majere', 'ubicación', 'como llegar', 'mapa', 'gps', 'coordenadas', 'cerveny klastor', 'embarcadero', 'lugar', 'donde está'],
            answer: 'Nos encontrará en: Majere 34, región de Prešov, Eslovaquia. El embarcadero de las almadías está en Červený Kláštor. Coordenadas GPS: 49.3985° N, 20.4198° E.'
        },
        {
            keywords: ['cuánto tiempo', 'duración', 'km', 'cuanto dura', 'tiempo', 'cuantos kilometros', 'distancia', 'longitud', 'horas', 'minutos', 'cuanto se tarda'],
            answer: 'El descenso desde Červený Kláštor hasta Lesnica es de 11 km y dura aproximadamente 1,5 horas. El tiempo exacto depende del nivel actual del agua del río Dunajec.'
        },
        {
            keywords: ['ropa', 'qué llevar', 'impermeable', 'como vestirse', 'vestimenta', 'que ponerse', 'chaqueta', 'chubasquero', 'zapatos', 'calzado', 'abrigo', 'sudadera'],
            answer: 'En verano recomendamos pantalones cortos y camiseta. Lleve también un jersey. En caso de mal tiempo, ropa impermeable y calzado adecuado. Se proporcionan chalecos salvavidas.'
        },
        {
            keywords: ['agua', 'mojarse', 'pies secos', 'salpicaduras', 'mojado', 'me voy a mojar', 'entra agua', 'chapoteo', 'se moja', 'voy a salir mojado'],
            answer: 'Se sube a la almadía con los pies secos. Durante el descenso normalmente no entra agua en la almadía, aunque ocasionalmente pueden salpicar unas gotas a los que van sentados en los bordes. No es una experiencia húmeda.'
        },
        {
            keywords: ['dificultad', 'difícil', 'fácil', 'seguro', 'peligroso', 'es seguro', 'para niños', 'para familias', 'principiantes', 'peligro', 'complicado', 'nivel'],
            answer: 'El río Dunajec no es difícil. Navegará con barqueros certificados que tienen miles de kilómetros de experiencia. El descenso es seguro para niños, familias y principiantes. No tiene que preocuparse por nada, solo relájese y disfrute del paseo.'
        },
        {
            keywords: ['nadar', 'saltar', 'baño', 'bañarse', 'saltar al agua', 'puedo nadar', 'bañarse en el río', 'prohibido'],
            answer: 'No, está prohibido saltar al agua durante el descenso. Las normas de visita de Pieniny no lo permiten por razones de seguridad y conservación de la naturaleza.'
        },
        {
            keywords: ['regreso', 'volver', 'taxi', 'bicicleta', 'andando', 'cómo volver', 'camino de vuelta', 'transporte', 'shuttle', 'autobús', 'como regresar'],
            answer: 'Varias opciones: caminar de vuelta por el hermoso sendero junto al río (unas 2 horas), alquilar una bicicleta (bicicletas para adultos y niños esperan en el aparcamiento), o utilizar nuestro servicio de taxi con vehículos de 9 plazas. ¡Elija lo que más le convenga!'
        },
        {
            keywords: ['barquero', 'almadieros', 'convertirse', 'aprender', 'trabajo', 'licencia', 'cómo ser barquero', 'trabajo de barquero', 'formación', 'requisitos'],
            answer: 'Si está interesado en convertirse en barquero, venga a vernos. Un barquero experimentado le llevará en un almadía para que aprenda. Cuando pueda manejar todo el descenso por sí mismo, un barquero mayor le evaluará. Los barqueros también necesitan un permiso de conductor de embarcaciones pequeñas.'
        },
        {
            keywords: ['fuera de temporada', 'invierno', 'trabajo', 'qué hacen', 'principal trabajo', 'ingresos extra', 'temporada baja', 'invierno que hacen'],
            answer: 'Ser barquero no es el trabajo principal para la mayoría – es un ingreso extra. Aquí trabajan estudiantes, jubilados y personas con otro trabajo principal. En invierno se dedican al mantenimiento de las almadías o trabajan en sus empleos principales.'
        },
        {
            keywords: ['temporada', 'cuándo', 'primavera', 'abril', 'mayo', 'octubre', 'mejor época', 'inicio temporada', 'fin temporada', 'meses', 'cuando se puede hacer'],
            answer: 'La temporada suele comenzar en primavera (abril, mayo) y dura hasta el otoño, mientras el nivel del agua sea suficiente. Normalmente se puede navegar hasta octubre. Julio y agosto son los meses más concurridos.'
        },
        {
            keywords: ['čačina', 'parte delantera', 'ola', 'qué es', 'para qué sirve', 'proa', 'elemento tradicional', 'cacina'],
            answer: 'La "čačina" en la parte delantera de la almadía sirve para detener las olas que de otro modo entrarían en la almadía desde el frente. Es un elemento importante de la arquitectura tradicional de las almadías que se ha utilizado durante siglos.'
        },
        {
            keywords: ['polacas', 'almadías polacas', 'más rápido', 'diferencia', 'por qué son más rápidas', 'arquitectura', 'polacas vs eslovacas'],
            answer: 'Las almadías polacas son más estrechas y el ángulo de la madera en la parte delantera es más pronunciado, lo que reduce la resistencia al agua y aumenta la velocidad. Sin embargo, son más propensas a salpicar agua desde los laterales.'
        },
        {
            keywords: ['regreso de almadías', 'torno', 'desmontar', 'camión', 'cómo regresan', 'transporte', 'como las devuelven', 'proceso'],
            answer: 'Después de llegar al destino, las almadías son sacadas a la orilla con un torno, desmontadas manualmente, cargadas en un camión y llevadas de vuelta al inicio, donde se vuelven a montar y se conectan en el agua.'
        },
        {
            keywords: ['peso', 'pesada', 'kg', 'cuánto pesa', 'peso de la almadía', 'kilos', 'de qué está hecha', 'partes'],
            answer: 'Una almadía puede pesar entre 500 kg y 800 kg. Consta de 5 partes que están empapadas de agua y son muy pesadas (más de 100 kg cada una). La almadía también contiene pértigas de repuesto, bancos, chalecos salvavidas y aros de rescate.'
        },
        {
            keywords: ['seguridad', 'seguro', 'peligro', 'miedo', 'para niños', 'chalecos salvavidas', 'seguro para niños', 'medidas de seguridad'],
            answer: 'El descenso es seguro. Los barqueros son experimentados y cuidarán de su seguridad durante todo el viaje. Hay chalecos salvavidas disponibles para niños. Cada almadía lleva aros de rescate y botiquín.'
        },
        {
            keywords: ['profundidad', 'qué profundidad', 'profundo', 'fondo', 'profundidad del río', 'aguas profundas', 'aguas poco profundas'],
            answer: 'La profundidad del Dunajec varía – desde 30 cm en las secciones poco profundas hasta 12–18 metros en algunos lugares. La profundidad media durante el descenso es de aproximadamente 1-2 metros.'
        },
        {
            keywords: ['velocidad', 'qué velocidad', 'km/h', 'rapidez', 'va rápido', 'velocidad de la almadía', 'rápido', 'lento'],
            answer: 'La velocidad de la almadía no se puede determinar con precisión. Depende del calado de la almadía, el nivel del agua y la arquitectura de la misma. La velocidad típica es de unos 5-8 km/h, similar a un paso rápido.'
        },
        {
            keywords: ['fabricación', 'quién hace', 'carpintero', 'jefe', 'construcción', 'cómo se hacen', 'hechas a mano', 'tradición'],
            answer: 'Las almadías son fabricadas por nuestro jefe, que es carpintero. Cada almadía está hecha a mano con énfasis en la tradición y la calidad. La construcción de una almadía lleva varios días.'
        },
        {
            keywords: ['hacer propia', 'construir propia', 'propia almadía', 'permiso', 'número de registro', 'certificado', 'puedo construir'],
            answer: 'No, una almadía es una embarcación y tiene un número de registro como un coche. Se requiere un certificado para su construcción. No puede construir su propia almadía para uso comercial.'
        },
        {
            keywords: ['precio', 'coste', 'cuánto cuesta', 'entrada', '€', 'euro', 'adulto', 'niño', 'descuento', 'familia', 'tarifas', 'precios'],
            answer: 'El precio actual para adultos es de 25 €. Los niños menores de 14 años tienen descuento (normalmente 15 €). Estudiantes y jubilados suelen pagar 23 €. Hay paquetes familiares disponibles. Los precios exactos pueden variar según la temporada – consulte en el lugar.'
        },
        {
            keywords: ['perro', 'perros', 'animales', 'puedo llevar perro', 'con perro', 'mascotas', 'animales domésticos', 'perro permitido'],
            answer: 'Se permiten perros previo acuerdo en el lugar. El dueño es responsable del comportamiento del perro durante el descenso. Por favor, mantenga al perro con correa.'
        },
        {
            keywords: ['aparcamiento', 'parking', 'coche', 'dónde aparcar', 'estacionamiento', 'aparcar gratis', 'estacionar', 'dejar el coche'],
            answer: 'Hay aparcamiento disponible directamente en el embarcadero en Majere. Para nuestros clientes, el aparcamiento suele ser gratuito. En temporada alta, recomendamos llegar temprano para asegurar un sitio.'
        },
        {
            keywords: ['clima', 'lluvia', 'llueve', 'cancelación', 'aplazamiento', 'mal tiempo', 'qué pasa si llueve', 'cancelan', 'suspendido'],
            answer: 'El descenso se realiza incluso con lluvia ligera. En caso de lluvia intensa, tormenta o nivel de agua muy alto/bajo, el descenso puede ser cancelado o aplazado por razones de seguridad. Se le informará con antelación.'
        },
        {
            keywords: ['foto', 'fotos', 'fotografiar', 'móvil', 'cámara', 'puedo hacer fotos', 'fotografía', 'tomar fotos', 'imágenes'],
            answer: 'Puede tomar fotos, pero recomendamos proteger su teléfono o cámara (por ejemplo, con una funda impermeable). Puede dejar sus pertenencias en el coche o en el guardarropa del embarcadero.'
        },
        {
            keywords: ['pago', 'efectivo', 'tarjeta', 'cómo pagar', 'forma de pago', 'pagar', 'tarjeta crédito', 'pago con tarjeta'],
            answer: 'El pago se realiza en efectivo antes del descenso en el embarcadero. No se aceptan tarjetas, por favor traiga suficiente efectivo.'
        },
        {
            keywords: ['baño', 'aseo', 'wc', 'servicios', 'dónde está el baño', 'sanitario', 'toilettes'],
            answer: 'Hay baños disponibles en el punto de embarque (embarcadero). Durante el descenso en sí, no hay paradas para ir al baño.'
        },
        {
            keywords: ['idioma', 'inglés', 'polaco', 'alemán', 'guía', 'comentarios', 'hablan español', 'explicaciones', 'idioma del guía'],
            answer: 'Los barqueros suelen ofrecer comentarios durante el descenso. Hablan eslovaco y polaco, algunos también inglés y alemán. Entienden las preguntas básicas en español.'
        },
        {
            keywords: ['comida', 'bocadillos', 'bufet', 'restaurante', 'cafetería', 'comer', 'beber', 'qué comer', 'merienda'],
            answer: 'Hay bares y restaurantes cerca del embarcadero. Durante el descenso, recomendamos traer su propia agua. No hay servicio de comida en la almadía.'
        },
        {
            keywords: ['niños', 'niño', 'familia', 'con niños', 'familiar', 'para niños', 'bebés', 'cochecito', 'pequeños'],
            answer: '¡Los niños son bienvenidos! Se proporcionan chalecos salvavidas. Los niños menores de 3 años viajan gratis. El descenso es tranquilo y seguro para familias. Los carritos se pueden dejar en el embarcadero.'
        },
        {
            keywords: ['autobús', 'tren', 'sin coche', 'transporte público', 'cómo llegar sin coche', 'transporte'],
            answer: 'Puede llegar a Červený Kláštor en autobús. La estación de tren más cercana está en Stará Ľubovňa, desde donde continúa en autobús. Consulte los horarios locales antes de su viaje.'
        }
    ],
    lv: [
        {
            keywords: ['rezervācija', 'rezervēt', 'iepriekš', 'grupa', '12 cilvēki', 'rezervacija', 'rezervet', 'grupa', '12 cilveki'],
            answer: 'Rezervācija iepriekš nav obligāta, bet mēs iesakām iepriekšējā dienā piezvanīt, lai pārbaudītu plostu braucienu laikus un izvairītos no ilgas gaidīšanas. Lielākām grupām (vairāk nekā 12 cilvēki) rezervācija ir nepieciešama vismaz vienu dienu iepriekš, vēlams 3 dienas.'
        },
        {
            keywords: ['kur', 'adrese', 'atrast', 'atrašanās vieta', 'karte', 'piestātne', 'majere', 'cerveny klastor', 'gps'],
            answer: 'Jūs atradīsiet mūs adresē: Majere 34, Prešovas apgabals, Slovākija. Plostu piestātne atrodas Červený Kláštor (Sarkanais klosteris). GPS koordinātas: 49.3985° N, 20.4198° E.'
        },
        {
            keywords: ['cik ilgi', 'ilgums', 'laiks', 'stundas', 'minūtes', 'km', 'cik ilgi tas ilgst', 'garums'],
            answer: 'Plostu brauciens no Červený Kláštor līdz Lesnica ir 11 km garš un ilgst aptuveni 1,5 stundas. Precīzs laiks ir atkarīgs no ūdens līmeņa Dunajec upē.'
        },
        {
            keywords: ['apģērbs', 'ģērbties', 'ko paņemt', 'jaka', 'lietusmētelis', 'apgerbs', 'paņemt', 'jakas', 'lietusmētelis', 'apavi'],
            answer: 'Vasarā mēs iesakām šortus un T-kreklu. Paņemiet arī džemperi. Sliktu laikapstākļu gadījumā paņemiet ūdensizturīgu apģērbu un izturīgus apavus. Glābšanas vestes tiek nodrošinātas.'
        },
        {
            keywords: ['ūdens', 'slapjš', 'šļakatas', 'sausām kājām', 'vai es samirkšu', 'ūdens plostā'],
            answer: 'Jūs kāpjat plostā ar sausām kājām. Brauciena laikā ūdens parasti neiekļūst plostā, bet daži pilieni var šļakstīties uz tiem, kas sēž malās. Tas nav slapjš piedzīvojums.'
        },
        {
            keywords: ['grūti', 'viegls', 'drošs', 'bīstams', 'vai tas ir droši', 'bērniem', 'ģimenēm', 'iesācējiem'],
            answer: 'Dunajec upe nav grūta. Jūs brauksiet ar sertificētiem plostniekiem, kuriem ir tūkstošiem kilometru pieredzes. Brauciens ir drošs bērniem, ģimenēm un iesācējiem. Vienkārši atpūtieties un izbaudiet braucienu.'
        },
        {
            keywords: ['peldēt', 'lēkt', 'vannoties', 'vai var peldēt', 'lekt ūdenī', 'peldēšana'],
            answer: 'Nē, lēkt ūdenī plostu brauciena laikā ir aizliegts. Pieninu apmeklētāju noteikumi to nepieļauj drošības un dabas aizsardzības apsvērumu dēļ.'
        },
        {
            keywords: ['atgriešanās', 'atpakaļ', 'taksometrs', 'velosipēds', 'kājām', 'ceļš', 'kā atgriezties', 'transports'],
            answer: 'Vairākas iespējas: atgriezties kājām pa skaisto taku gar upi (apmēram 2 stundas), iznomāt velosipēdu (pieaugušo un bērnu velosipēdi pieejami autostāvvietā), vai izmantot mūsu taksometra pakalpojumu ar 9-vietīgiem transportlīdzekļiem. Izvēlieties, kas jums vislabāk atbilst!'
        },
        {
            keywords: ['plostnieks', 'kļūt', 'mācīties', 'darbs', 'apliecība', 'kļūt par plostnieku', 'darbs plostniekam'],
            answer: 'Ja vēlaties kļūt par plostnieku, nāciet pie mums. Pieredzējis plostnieks paņems jūs līdzi uz plosta, lai mācītos. Kad pats varēsiet vadīt visu braucienu, vecākais plostnieks jūs pārbaudīs. Plostniekiem ir nepieciešama arī maza kuģa vadītāja apliecība.'
        },
        {
            keywords: ['ārpus sezonas', 'ziema', 'darbs', 'ko viņi dara ziemā', 'pamata darbs'],
            answer: 'Plostniecība lielākajai daļai plostnieku nav pamata darbs – tas ir papildu ienākumu avots. Šeit strādā studenti, pensionāri un cilvēki ar citu pamata darbu. Ziemā viņi nodarbojas ar plostu apkopi vai strādā savos pamata darbos.'
        },
        {
            keywords: ['sezona', 'kad', 'pavasaris', 'aprīlis', 'maijs', 'oktobris', 'kad var braukt', 'sezonas sākums', 'sezonas beigas'],
            answer: 'Sezona parasti sākas pavasarī (aprīlī, maijā) un ilgst līdz rudenim, kamēr ūdens līmenis ir pietiekams. Parasti var braukt līdz oktobrim. Jūlijs un augusts ir visnoslogotākie mēneši.'
        },
        {
            keywords: ['cena', 'cik maksā', 'biļete', '€', 'eiro', 'pieaugušais', 'bērns', 'atlaide', 'ģimene', 'cenas'],
            answer: 'Pašreizējā cena pieaugušajiem ir 25 €. Bērniem līdz 14 gadiem ir atlaide (parasti 15 €). Studentiem un pensionāriem bieži 23 €. Ģimenes komplekti pieejami. Precīzas cenas pārbaudiet uz vietas, jo tās var atšķirties atkarībā no sezonas.'
        },
        {
            keywords: ['suns', 'suņi', 'dzīvnieki', 'vai var ņemt suni', 'suns uz plosta', 'ar suni'],
            answer: 'Suņi ir atļauti pēc iepriekšējas vienošanās uz vietas. Īpašnieks ir atbildīgs par suņa uzvedību plostu brauciena laikā. Lūdzu, turiet suni pavadā.'
        },
        {
            keywords: ['stāvvieta', 'autostāvvieta', 'auto', 'kur novietot auto', 'bez maksas stāvvieta', 'parkošanās'],
            answer: 'Autostāvvieta atrodas tieši piestātnē Majere. Mūsu klientiem autostāvvieta parasti ir bez maksas. Augstajā sezonā iesakām ierasties agrāk, lai nodrošinātu vietu.'
        },
        {
            keywords: ['laiks', 'lietus', 'līst', 'atcelšana', 'slikts laiks', 'kas notiek, ja līst'],
            answer: 'Plostu brauciens notiek pat vieglā lietū. Spēcīga lietus, vētras vai ļoti augsta/zema ūdens līmeņa gadījumā braucienu drošības apsvērumu dēļ var atcelt vai pārcelt. Jūs par to tiksiet informēts.'
        },
        {
            keywords: ['foto', 'fotografēt', 'mobilais', 'kamera', 'vai drīkst fotografēt', 'bildes'],
            answer: 'Jūs varat fotografēt, bet iesakām nodrošināt tālruni vai kameru (piemēram, ar ūdensizturīgu maciņu). Personīgās mantas varat atstāt automašīnā vai glabātavā piestātnē.'
        },
        {
            keywords: ['maksājums', 'skaidra nauda', 'karte', 'kā maksāt', 'maksāšana', 'kredītkarte'],
            answer: 'Maksājums tiek veikts skaidrā naudā pirms brauciena piestātnē. Maksājums ar karti netiek pieņemts, lūdzu, paņemiet līdzi pietiekami daudz skaidras naudas.'
        },
        {
            keywords: ['tualete', 'wc', 'tualetes', 'kur ir tualete', 'sanmezgli'],
            answer: 'Tualetes ir pieejamas iekāpšanas vietā (piestātnē). Paša brauciena laikā nav apstāšanās uz tualeti.'
        },
        {
            keywords: ['valoda', 'angļu', 'poļu', 'vācu', 'gids', 'komentāri', 'vai runā angliski'],
            answer: 'Plostnieki brauciena laikā bieži sniedz komentārus. Viņi runā slovāku un poļu valodā, daži runā arī angliski un vāciski.'
        },
        {
            keywords: ['ēdiens', 'uzkodas', 'bufete', 'restorāns', 'kafejnīca', 'ēst', 'dzert'],
            answer: 'Piestātnes tuvumā atrodas bufetes un restorāni. Brauciena laikā iesakām paņemt līdzi savu ūdeni. Uz plosta ēdināšana netiek nodrošināta.'
        },
        {
            keywords: ['bērni', 'bērns', 'ģimene', 'ar bērniem', 'ģimenei draudzīgs', 'ratiņi'],
            answer: 'Bērni ir laipni gaidīti! Glābšanas vestes tiek nodrošinātas. Bērni līdz 3 gadu vecumam brauc bez maksas. Brauciens ir mierīgs un drošs ģimenēm. Ratiņus var atstāt piestātnē.'
        },
        {
            keywords: ['plosts', 'svars', 'smags', 'kg', 'cik sver plosts', 'no kā izgatavots'],
            answer: 'Plosts var svērt no 500 kg līdz 800 kg. Tas sastāv no 5 daļām, kas ir piesūkušās ar ūdeni un ir ļoti smagas (katra vairāk nekā 100 kg). Plostā atrodas arī rezerves stieņi, soliņi, glābšanas vestes un glābšanas riņķi.'
        },
        {
            keywords: ['ātrums', 'cik ātri', 'km/h', 'plosta ātrums', 'ātri', 'lēni'],
            answer: 'Plosta ātrumu nevar precīzi noteikt. Tas ir atkarīgs no plosta iegremdēšanās, ūdens līmeņa un plosta konstrukcijas. Tipiskais ātrums ir apmēram 5-8 km/h.'
        },
        {
            keywords: ['dziļums', 'cik dziļi', 'dziļi', 'ūdens dziļums', 'dziļums upe'],
            answer: 'Dunajec upes dziļums ir dažāds – no 30 cm seklajos posmos līdz 12–18 metriem dažās vietās. Vidējais dziļums brauciena laikā ir apmēram 1-2 metri.'
        },
        {
            keywords: ['autobuss', 'vilciens', 'bez automašīnas', 'sabiedriskais transports', 'kā nokļūt bez auto'],
            answer: 'Uz Červený Kláštor var nokļūt ar autobusu. Tuvākā dzelzceļa stacija ir Stará Ľubovňa, no kurienes turpiniet ar autobusu. Pirms brauciena pārbaudiet vietējos sarakstus.'
        }
    ], lt: [
        {
            keywords: ['rezervacija', 'rezervuoti', 'iš anksto', 'grupė', '12 asmenų', 'rezervacijos', 'grupe', '12 asmenu'],
            answer: 'Rezervacija iš anksto nėra būtina, bet rekomenduojame prieš dieną paskambinti ir pasitikslinti plaustų plaukimo laikus, kad išvengtumėte ilgo laukimo. Didesnėms grupėms (daugiau nei 12 asmenų) rezervacija būtina bent dieną iš anksto, geriausia 3 dienas.'
        },
        {
            keywords: ['kur', 'adresas', 'rasti', 'vieta', 'žemėlapis', 'prieplauka', 'majere', 'cerveny klastor', 'gps'],
            answer: 'Mus rasite adresu: Majere 34, Prešovo kraštas, Slovakija. Plaustinė prieplauka yra Červený Kláštor (Raudonasis vienuolynas). GPS koordinatės: 49.3985° Š, 20.4198° R.'
        },
        {
            keywords: ['kiek ilgai', 'trukmė', 'laikas', 'valandos', 'minutės', 'km', 'kiek trunka', 'ilgis'],
            answer: 'Plaustų plaukimas nuo Červený Kláštor iki Lesnica yra 11 km ilgio ir trunka apie 1,5 valandos. Tikslus laikas priklauso nuo vandens lygio Dunajec upėje.'
        },
        {
            keywords: ['drabužiai', 'apsirengti', 'ką pasiimti', 'striukė', 'lietpaltis', 'drabuziai', 'pasimti', 'striuke', 'lietpaltis', 'batai'],
            answer: 'Vasarą rekomenduojame šortus ir marškinėlius. Pasimkite ir megztinį. Esant blogam orui, pasiimkite neperšlampamus drabužius ir tvirtus batus. Gelbėjimosi liemenės yra pateikiamos.'
        },
        {
            keywords: ['vanduo', 'šlapias', 'aptaškyti', 'sausomis kojomis', 'ar sušlapsiu', 'vanduo plauste'],
            answer: 'Į plaustą lipate sausomis kojomis. Plaukimo metu vanduo į plaustą paprastai nepatenka, tačiau keli lašai gali aptaškyti tuos, kurie sėdi pakraščiuose. Tai nėra šlapia pramoga.'
        },
        {
            keywords: ['sunku', 'lengva', 'saugu', 'pavojinga', 'ar saugu', 'vaikams', 'šeimoms', 'pradedantiesiems'],
            answer: 'Dunajec upė nėra sudėtinga. Jūs plauksite su sertifikuotais plaustų vairininkais, kurie turi tūkstančių kilometrų patirtį. Plaukimas yra saugus vaikams, šeimoms ir pradedantiesiems. Tiesiog atsipalaiduokite ir mėgaukitės kelione.'
        },
        {
            keywords: ['plaukti', 'šokti', 'maudytis', 'ar galima plaukti', 'šokti į vandenį', 'maudymasis'],
            answer: 'Ne, šokti į vandenį plaustų plaukimo metu draudžiama. Pieninų lankytojų taisyklės to neleidžia dėl saugumo ir gamtos apsaugos priežasčių.'
        },
        {
            keywords: ['grįžimas', 'atgal', 'taksi', 'dviračiai', 'pėsčiomis', 'kelias', 'kaip grįžti', 'transportas'],
            answer: 'Keletas variantų: grįžti pėsčiomis gražiu taku palei upę (apie 2 valandas), išsinuomoti dviračius (suaugusiųjų ir vaikų dviračiai laukia automobilių stovėjimo aikštelėje) arba pasinaudoti mūsų taksi paslauga su 9-vietėmis mašinomis. Pasirinkite, kas jums labiausiai tinka!'
        },
        {
            keywords: ['plaustų vairininkas', 'tapti', 'mokytis', 'darbas', 'licencija', 'kaip tapti plaustų vairininku', 'darbas plaustų vairininku'],
            answer: 'Jei norite tapti plaustų vairininku, ateikite pas mus. Patyręs plaustų vairininkas pasiims jus į plaustą mokytis. Kai galėsite patys valdyti visą plaukimą, vyresnysis plaustų vairininkas jus patikrins. Plaustininkams taip pat reikalinga mažo laivo vairuotojo licencija.'
        },
        {
            keywords: ['ne sezono metu', 'žiema', 'darbas', 'ką jie veikia žiemą', 'pagrindinis darbas'],
            answer: 'Plaustų vairininkas daugumai nėra pagrindinis darbas – tai papildomos pajamos. Čia dirba studentai, pensininkai ir žmonės su kitu pagrindiniu darbu. Žiemą jie užsiima plaustų priežiūra arba dirba savo pagrindinį darbą.'
        },
        {
            keywords: ['sezonas', 'kada', 'pavasaris', 'balandis', 'gegužė', 'spalis', 'kada galima plaukti', 'sezono pradžia', 'sezono pabaiga'],
            answer: 'Sezonas paprastai prasideda pavasarį (balandį, gegužę) ir tęsiasi iki rudens, kol vandens lygis yra pakankamas. Paprastai galima plaukti iki spalio. Liepa ir rugpjūtis yra judriausi mėnesiai.'
        },
        {
            keywords: ['kaina', 'kiek kainuoja', 'bilietas', '€', 'euras', 'suaugęs', 'vaikas', 'nuolaida', 'šeima', 'kainos'],
            answer: 'Dabartinė suaugusiųjų kaina yra 25 €. Vaikams iki 14 metų taikoma nuolaida (paprastai 15 €). Studentai ir pensininkai dažnai moka 23 €. Šeimos paketai prieinami. Tikslias kainas patikrinkite vietoje, nes jos gali skirtis priklausomai nuo sezono.'
        },
        {
            keywords: ['šuo', 'šunys', 'gyvūnai', 'ar galima atsivesti šunį', 'šuo plauste', 'su šunimi'],
            answer: 'Šunys leidžiami susitarus vietoje. Savininkas yra atsakingas už šuns elgesį plaustų plaukimo metu. Prašome laikyti šunį pavadėlyje.'
        },
        {
            keywords: ['automobilių stovėjimo aikštelė', 'parkavimas', 'automobilis', 'kur pastatyti automobilį', 'nemokamas parkavimas', 'parkavimas'],
            answer: 'Automobilių stovėjimo aikštelė yra tiesiai prie prieplaukos Majere. Mūsų klientams parkavimas paprastai yra nemokamas. Sezono metu rekomenduojame atvykti anksčiau, kad užtikrintumėte vietą.'
        },
        {
            keywords: ['oras', 'lietus', 'lyja', 'atšaukimas', 'blogas oras', 'kas jei lyja'],
            answer: 'Plaustų plaukimas vyksta net ir esant lengvam lietui. Esant stipriam lietui, audrai arba labai aukštam/žemam vandens lygiui, plaukimas gali būti atšauktas arba atidėtas dėl saugumo priežasčių. Jūs būsite informuoti iš anksto.'
        },
        {
            keywords: ['nuotrauka', 'fotografuoti', 'mobilusis', 'fotoaparatas', 'ar galima fotografuoti', 'nuotraukos'],
            answer: 'Galite fotografuoti, bet rekomenduojame apsaugoti telefoną ar fotoaparatą (pvz., vandeniui atspariu dėklu). Asmeninius daiktus galite palikti automobilyje arba saugykloje prieplaukoje.'
        },
        {
            keywords: ['apmokėjimas', 'grynieji pinigai', 'kortelė', 'kaip sumokėti', 'mokėjimas', 'kredito kortelė'],
            answer: 'Apmokėjimas atliekamas grynaisiais pinigais prieš plaukimą prieplaukoje. Mokėjimas kortele nepriimamas, prašome pasiimti pakankamai grynųjų pinigų.'
        },
        {
            keywords: ['tualetas', 'wc', 'tualetai', 'kur yra tualetas', 'sanitarijos mazgai'],
            answer: 'Tualetai yra įlaipinimo vietoje (prieplaukoje). Pačio plaukimo metu nėra sustojimų į tualetą.'
        },
        {
            keywords: ['kalba', 'anglų', 'lenkų', 'vokiečių', 'gidas', 'komentarai', 'ar kalba angliškai'],
            answer: 'Plaustų vairininkai plaukimo metu dažnai komentuoja. Jie kalba slovakų ir lenkų kalbomis, kai kurie kalba ir angliškai bei vokiškai.'
        },
        {
            keywords: ['maistas', 'užkandžiai', 'bufetas', 'restoranas', 'kavinė', 'valgyti', 'gerti'],
            answer: 'Netoli prieplaukos yra užkandinių ir restoranų. Plaukimo metu rekomenduojame pasiimti savo vandens. Ant plausto maitinimas neteikiamas.'
        },
        {
            keywords: ['vaikai', 'vaikas', 'šeima', 'su vaikais', 'šeimai draugiškas', 'vežimėlis'],
            answer: 'Vaikai laukiami! Gelbėjimosi liemenės yra pateikiamos. Vaikai iki 3 metų plaukia nemokamai. Plaukimas yra ramus ir saugus šeimoms. Vežimėlius galima palikti prieplaukoje.'
        },
        {
            keywords: ['plaustas', 'svoris', 'sunku', 'kg', 'kiek sveria plaustas', 'iš ko pagamintas'],
            answer: 'Plaustas gali sverti nuo 500 kg iki 800 kg. Jį sudaro 5 dalys, kurios yra prisisunkusios vandens ir labai sunkios (kiekviena daugiau nei 100 kg). Plauste taip pat yra atsarginių strypų, suolų, gelbėjimosi liemenių ir gelbėjimo ratų.'
        },
        {
            keywords: ['greitis', 'kaip greitai', 'km/h', 'plausto greitis', 'greitai', 'lėtai'],
            answer: 'Plausto greičio negalima tiksliai nustatyti. Tai priklauso nuo plausto grimzlės, vandens lygio ir plausto konstrukcijos. Tipiškas greitis yra apie 5-8 km/h.'
        },
        {
            keywords: ['gylis', 'kiek giliai', 'gilus', 'vandens gylis', 'upės gylis'],
            answer: 'Dunajec upės gylis yra įvairus – nuo 30 cm seklumose iki 12–18 metrų kai kuriose vietose. Vidutinis gylis plaukimo metu yra apie 1-2 metrus.'
        },
        {
            keywords: ['autobusas', 'traukinys', 'be automobilio', 'viešasis transportas', 'kaip nuvykti be automobilio'],
            answer: 'Į Červený Kláštor galite nuvykti autobusu. Artimiausia geležinkelio stotis yra Stará Ľubovňa, iš kur tęskite autobusu. Prieš kelionę patikrinkite vietinius tvarkaraščius.'
        }
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