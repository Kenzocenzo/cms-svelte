# coding=utf8
from flask import Flask, jsonify, redirect, send_from_directory, request
from flask_cors import CORS
import sqlite3
import json
app = Flask(__name__)
CORS(app)


setter = 0
headers = {
    "main_headers":[
        {"id":0,"name":"Strona główna", "href":"/","show":1},
        {"id":1,"name":"Artykuły", "href":"articles","show":1},
        {"id":2,"name":"Galeria", "href":"gallery","show":1},
        {"id":3,"name":"Komentarze", "href":"comments","show":1}],        
    "additional_headers":[
        {"id":0,"name":"Wiedźmin wiki", "href":"https://witcher.fandom.com/wiki/Witcher_Wiki"}]}
footer = {
    "main_footers":[
        {"id":0,"name":"Strona główna", "href":"/","show":1},
        {"id":1,"name":"Artykuły", "href":"articles","show":1},
        {"id":2,"name":"Galeria", "href":"gallery","show":1},
        {"id":3,"name":"Komentarze", "href":"comments","show":1},
        {"id":4,"name":"Logowanie", "href":"login","show":1},
        {"id":5,"name":"Rejestracja", "href":"register","show":1}],
    "social_media_footers":[
        {"id":0,"name":"facebook", "href":"https://www.facebook.com/","show":1},
        {"id":1,"name":"instagram", "href":"https://www.instagram.com/","show":1},
        {"id":2,"name":"youtube", "href":"https://www.youtube.com/","show":1},
        {"id":3,"name":"twitter", "href":"https://twitter.com/home","show":1},
        {"id":4,"name":"linkedin", "href":"https://www.linkedin.com/","show":1}
    ],
    "contact_footer":
"""Adres: Rzemieślnicza 6 Poznań,
Telefon: 123 456 789,
E-mail: kenzocenzo@gmail.com
""",
"copyright":"Copyright © Kenzocorp | Website by Aleks Rogoziński and Mateusz Obirasek"
}
slider = [
    {"id":0,"src":"https://gfx.antyradio.pl/var/antyradio/storage/images/technologia/gry/wiedzmin-3-jak-bedzie-wygladal-nagi-geralt-w-wersji-na-switcha-35967/10872143-1-pol-PL/Wiedzmin-3-jak-bedzie-wygladal-nagi-Geralt-w-wersji-na-Switcha_article.jpg", "name": "Geralt z Rivii"},
    {"id":1,"src":"https://gfx.antyradio.pl/var/antyradio2/storage/images/filmy-i-seriale/seriale/wiedzmin-henry-cavill-odkryl-swoj-glos-geralta-calkowitym-przypadkiem-48028/15726849-1-pol-PL/Wiedzmin-Henry-Cavill-odkryl-swoj-glos-Geralta-calkowitym-przypadkiem_article.jpg","name":"Również Geralt"},
    {"id":2,"src":"https://planetagracza.pl/wp-content/uploads/2021/10/wiedzmin-3-dziki-gon-wkurzony-geralt-render-3d-pg.jpg","name":"Weird Geralt"}
]
articles = [
    {
        "id":1,
        "title":"Super Partia",
        "img":"https://gwent.one/image/gwent/assets/card/art/medium/2006.jpg",
        "intro":"To jest fajny wstęp, bardzo polecam, ogólnie fajnie jest być skrybą takkkkasddddddd dddddddddddddd",
        "content":
        """ Szkolenie na Wiedźmina
Geralt był synem czarodziejki Visenny i (najprawdopodobniej) wojownika Korina. Krótko po narodzinach został on oddany przez matkę do wiedźmińskiej Szkoły Wilka w twierdzy Kaer Morhen. W trakcie szkolenia na wiedźmina został poddany Próbie Traw, a następnie Zmianom, które przeszedł nadzwyczaj dobrze. Został z tego powodu wybrany razem z innymi młodzikami do dodatkowych eksperymentów, które przeżył jako jedyny. Wynikiem tych działań jest brak pigmentu w jego włosach oraz ich mlecznobiały kolor. W efekcie mutacji i treningów zyskał m.in. zwiększony refleks i prędkość, wolniejsze tętno oraz zdolność adaptacji źrenicy do aktualnego oświetlenia. Jego preceptorem, mistrzem i mentorem był Vesemir, nauczyciel szermierki i znawca potworów. To on nauczył Wilka wszystkiego, co sam umiał i stał się dla niego bardzo bliski, zastępując Geraltowi ojca. Z czasów szkolenia miał towarzysza i przyjaciela Eskela oraz prawdopodobnie Lamberta.

Po ukończeniu wiedźmińskiego szkolenia rozpoczął swoją przygodę ze światem wraz ze swoim koniem, Płotką, by zostać płatnym zabójcą potworów. Nie wiadomo, czy Geralt ukończył szkolenie na krótko przed atakiem na Kaer Morhen, czy też po nim.

Początek na szlaku
Jak sam Geralt wspomina, początek jego szlaku zaczął się od wmieszania się w ludzkie sprawy i zapoznaniem się z prawdziwym i okrutnym życiem. Jego pierwszym potworem spotkanym na szlaku był... człowiek, a konkretnie grupa bandytów, która napadła podróżującego kupca i jego córkę. Geralt, chcąc odegrać rolę bohatera, widowiskowo zabił jednego z maruderów, reszta natomiast na sam widok uciekła w popłochu. Nie spotkał się jednak z oczekiwaną reakcją; przerażony kupiec uciekł razem z oprawcami, a jego zalana łzami córka zemdlała ze strachu. Późniejsze doświadczenia oraz nastawienie ludzi do wiedźmina sprawiły, że stał się on dość pesymistyczny i nabył obojętnego stosunku do świata. W następnych latach Geralt zdobywał renomę podróżując po Królestwach Północy, jednak najczęściej na zimowanie wracał w Góry Sine. Późniejsze przygody i czyny wiedźmina miały rozsławić go na cały świat.

Na mocy prawa niespodzianki Geralt powiązał się przeznaczeniem z Ciri – tajemniczym dzieckiem, Lwiątkiem z Cintry. Ich przygody, a także wielu innych napotkanych przez nich postaci, mają miejsce w czasie wielkiej inwazji Cesarstwa Nilfgaardu na Królestwa Północne. Poza trudnościami, jakie napotyka na swojej drodze, wiążąc się z czarodziejką Yennefer, Geralt bierze udział w bezwzględnej grze wywiadów wojskowych. Chcąc dbać o swoich bliskich, wiedźmin stara się ich chronić, jednak nadal, na przekór wszystkim, zachować neutralność w ogarniętym wojną świecie. Najlepszym przyjacielem wiedźmina jest bard Jaskier, miłością jego życia jest Yennefer, a dzieckiem (przybranym) Ciri.

Szkolenie Ciri i przewrót na Thanedd
Geralt oraz pozostali wiedźmini z Kaer Morhen, z pomocą czarodziejki Triss Merigold, rozpoczęli szkolenie Ciri na wiedźminkę. Ich świat dzielił wówczas krok od wojny między królestwami północy a Cesarstwem Nilfgaardu. Okazało się, że dziewczynka jest źródłem i ma w sobie wielki potencjał magiczny. Kiedy Cirilla wyjechała do Ellander, aby pobierać nauki w świątyni Melitele, Geralt poprosił Yennefer, aby ta została mistrzynią księżniczki i umożliwiła jej zostanie czarodziejką. Cirilla została uczennicą ukochanej Geralta i zaczęła uczyć się czarodziejskiego fachu.

W 1267 roku wiedźmin razem z Yennefer wziął udział w balu, który odbył się na wyspie Thanedd. Nie wiedział, że celem biorących udział w przyjęciu czarodziejów współpracujących z północnymi państwami było pojmanie magów związanych z Nilfgaardem. Cała ta sytuacja przeobraziła się w brutalną walkę. Jedna z czarodziejek, Francesca Findabair, wpuściła na wyspę elfów oraz dóch ludzi, których zadaniem było schwytanie Ciri. Dziewczynce jednak udało się uciec za pomocą zniszczonego portalu znajdującego się na szczycie Wieży Mewy. Geralt, natomiast, został ciężko zraniony w nogę.""",
        "date":"06.04.2022",
        "category":"kat1"
    },
     {
        "id":2,
        "title":"Booba",
        "img":"https://gwent.one/image/gwent/assets/card/art/medium/2037.jpg",
        "intro":"To jest wstęp",
        "content":
        """W prologu, aktach II, III i V nie pojawia się w ogóle. W akcie I sprzedaje towary takie jak: saletra, czarny proch, gęsi smalec, łój, temerska żytnia, lokalna pieprzówka, wiśniówka na spirytusie, nalewka śliwkowa, calcium equum, winny kamień, kwas Ginatzy, biały ocet, sole naezańskie, zerrikańska mieszanka, niedźwiedzie sadło, księżycowe drobiny, sproszkowana perła, piołunówka, siarka, fosfor, proszek alchemików, pasta alchemiczna, czerwona wstążka, olej przeciw upiorom oraz książki: Barghesty, O psach i wilkach, O potworach bagiennych i O roślinach polnych.

Za 30 orenów sprzeda przy pierwszej rozmowie receptę na olej przeciw upiorom. W trakcie wykonywania zadania Ludzie i bestie wiedźmin otrzyma od niej notatki Berengara na temat Bestii oraz receptę na eliksir z jej specjalnego składnika. Jest zleceniodawczynią zadania Zlecenie na barghesty. Zapłaci 100 orenów za 10 czaszek barghestów i podaruje dodatkowo dwa korzenie mandragory.

W zadaniu Ludzie i bestie przewinie się historia jej wrogich stosunków z mieszkańcami wsi:""",
        "date":"06.04.2022",
        "category":"kat2"
    },
     {
        "id":3,
        "title":"Super Artykuł",
        "img":"https://gwent.one/image/gwent/assets/card/art/medium/2045.jpg",
        "intro":"To jest fajny wstęp",
        "content":
        """Rozdział I
Do Wyzimy, stolicy Temerii, przyjeżdża zakapturzony nieznajomy człowiek. Według plotek nadszedł z północy, od Bramy Powroźniczej. Idzie uliczką, trzymając konia za uzdę. W końcu dochodzi do karczmy Stary Narakort, lecz nie wchodzi do środka, ponieważ gospoda jest pełna ludzi. Ciągnie konia w dół uliczki i wchodzi do pustej karczmy Pod Lisem. Zamawia tam piwo u karczmarza, który niechętnie wykonuje zamówienie. Po otrzymaniu piwa pyta, czy jest izba na nocleg. Karczmarz nie chce takiego gościa i odsyła go do Starego Narakortu. Nieznajomy woli jednak spać tutaj, karczmarz ponownie odmawia. Podczas rozmowy udaje mu się rozpoznać jego akcent – to Riv. Obcy proponuje zapłatę, lecz wtedy wstaje od stołu ospowaty mężczyzna z zamiarem wygonienia go. Wytrąca mu kufel piwa z ręki, nieznajomy wywija się spod ciosu, wyciąga miecz i zabija ospowatego. Riv cofa się pod ścianę, trzech strażników z pałkami wpada do karczmy. Na widok trupów wyciągają miecze. Jeden ze strażników negocjuje z mordercą, a drugi rozkazuje trzeciemu, Tresce, zawołać posiłki. Nieznajomy mówi, że sam pójdzie, po czym rzuca na strażników Znak Aksji. Ci prowadzą go, na życzenie Riva, do grododzierżcy.

Rozdział II
Geralt wyjaśnia grododzierżcy, że jest wiedźminem z cechu wilka i przybył tu na ogłoszenie króla Temeri, Foltesta, który obiecuje nagrodę za zdjęcie czaru ze strzygi, swojej dawnej córki. Velerad wyjaśnia Geraltowi całą sytuację. Otóż w młodości król Foltest miał romans z własną siostrą, Addą. Z tego związku narodziła się dziewczynka. Adda umarła przy porodzie, a jej córeczka wkrótce potem. Zostały pochowane w królewskim grobowcu. Po siedmiu latach wyszła z grobu strzyga, która zaczęła mordować ludzi. Wychodzi co parę nocy podczas pełni księżyca i jest wyjątkowo niebezpieczna i bezlitosna. Cała sytuacja trwa już sześć lat. Próby zabicia strzygi nie dały rezultatu. Według pewnego czarodzieja ze strzygi można zdjąć klątwę, należy jedynie spędzić noc w grobowcu królowej Addy i wyjść po trzecim pianiu koguta. Czarodziej zginął, próbując tego dokonać, lecz król trzyma się tego planu i nie pozwala strzygi zabić.

Rozdział III
Geralt przychodzi do króla Foltesta. Utrzymuje, że odczarowanie strzygi jest możliwe, będzie to jednak wyjątkowo niebezpieczne. Król potajemnie odwiedza Geralta w jego komnacie. Ostrzega go, by nie dał się zwieść obietnicami możnowładców, którzy obiecują za zabicie strzygi i upozorowanie wypadku przy pracy nagrodę, a także ochronę przed królewskim gniewem. Oczywiste jest, że w mieście nikt nie wstawi się za wiedźminem. Geralt, który rzeczywiście otrzymał taką propozycję, oznajmia, że nie ma zamiaru jej przyjmować.

Rozdział IV
Wiedźmin wyjaśnia królowi, że po odczarowaniu strzyga będzie normalna, ale tylko fizycznie, bo psychicznie będzie miała mentalność czterolatki, ale i to z czasem minie. Foltest zezwala Geraltowi na zabicie strzygi wtedy i tylko wtedy, gdy będzie to przypadek beznadziejny lub gdy będzie musiał bronić swego życia.

Rozdział V
Geralt wyrusza do grobowca na spotkanie ze strzygą. Przyjeżdża tam możnowładca Ostrit, który proponuje wiedźminowi nagrodę w zamian za zostawienie wszystkiego własnemu losowi. Liczy, że gdy w kraju będzie chaos, to łatwo strąci króla z tronu i zajmie jego miejsce. Geralt nie przyjmuje propozycji i Ostrit atakuje go. Wiedźmin jednak z łatwością nokautuje przeciwnika i wiąże.

Rozdział VI
Ostrit przyznaje się, że kochał królewnę Addę, a gdy wybrała miłość własnego brata, z wściekłości przeklął ją i jej potomstwo. To przez niego księżniczka jest teraz strzygą. Wiedźmin uwalnia Ostrita, który chwilę potem ginie z ręki strzygi. Po nasyceniu się możnowładcą stwór atakuje Geralta. Nie może się jednak do niego zbliżyć, gdyż ma on srebrny łańcuch i srebrny miecz. Po długiej walce Geralt odpędza strzygę i kładzie się w grobowcu Addy.

Rozdział VII
Rano budzi się i zastaje odczarowaną królewnę. Wychodzi z krypty i pochyla się nad nią. Zobaczył (niestety za późno), że ma ona jeszcze pazury strzygi. Wyszedł z grobowca za wcześnie. Strzyga ostatkiem sił raniła go w szyję, on zaś ugryzł ją i trzymał zębami, dopóki się całkowicie nie przemieniła. Potem zemdlał.

Rozdział VIII
Geralt ocknął się dwa dni później. Na stoliku czekała nagroda pieniężna, przed łóżkiem zaś siedział Velerad, który wyjaśnił mu, że wszystko jest tak jak on powiedział: królewna jest normalna fizycznie, lecz psychicznie jeszcze nie, ale to wkrótce minie.""",
        "date":"06.04.2022",
        "category":"kat2"
    },
     {
        "id":4,
        "title":"Super Artykuł",
        "img":"https://gwent.one/image/gwent/assets/card/art/medium/2046.jpg",
        "intro":"To jest fajny wstęp",
        "content":
        """ Lorem ipsum
        dolor sit ametasdsadgsafgsdsdfguiAsd
        asdsad        sad        sa
        d        sad        sa
        d        sa        a
        awhjmjkhu vgm,nujioh;
        o;NK
        h;ihb        ;jnk;lpojpbjiklb;uoib
         &O9t         oi[i9un
         ftuofcghjmxFK         foyl         ;p         fi7
         ;         gy
         ;         i'uib
         o;        uoi'         kj         ,         l nkj.hli
         /o'b g""",
        "date":"06.04.2022",
        "category":"kat3"
    },
     {
        "id":5,
        "title":"Big Black Beef",
        "img":"https://gwent.one/image/gwent/assets/card/art/medium/2065.jpg",
        "intro":"To jest fajny wstęp",
        "content":
        """Vesemir – najstarszy znany wiedźmin, prawdopodobnie starszy od Kaer Morhen. Jedyny żyjący z wiedźmińskiej starszyzny zajmującej się tworzeniem i szkoleniem młodych wiedźminów. Mistrz miecza, nauczyciel szermierki oraz znawca potworów, preceptor wiedźminów Geralta i Eskela. Przekazuje Ciri swoją wiedzę na temat najróżniejszych bestii i potworów. Dla Geralta przybrany ojciec i nauczyciel. Nosił siwą brodę. Spięty i zakłopotany w obecności Triss Merigold.""",
        "date":"06.04.2022",
        "category":"kat3"
    }, {
        "id":6,
        "title":"Just another article",
        "img":"https://gwent.one/image/gwent/assets/card/art/medium/2072.jpg",
        "intro":"To jest fajny wstęp",
        "content":
        """ Lorem ipsum
        dolor sit ametasdsadgsafgsdsdfguiAsd
        asdsad        sad        sa
        d        sad        sa
        d        sa        a
        awhjmjkhu vgm,nujioh;
        o;NK
        h;ihb        ;jnk;lpojpbjiklb;uoib
         &O9t         oi[i9un
         ftuofcghjmxFK         foyl         ;p         fi7
         ;         gy
         ;         i'uib
         o;        uoi'         kj         ,         l nkj.hli
         /o'b g""",
        "date":"14.04.2022",
        "category":"kat1"
    },
     {
        "id":7,
        "title":"Tetra Gilcrest",
        "img":"https://www.leatherjacketblack.com/wp-content/uploads/2022/01/Tetra-Gilcrest-The-Witcher-Nightmare-of-the-Wolf-Red-Coat.jpg",
        "intro":"Czarodziejka na dworze króla Dagreada, przewodziła atakowi na Kaer Morhen.",
        "content":
        """<b>Charakterystyka</b>
Była piękną, młodo wyglądającą kobietą o długich, czarnych włosach i fioletowych oczach.

Purystka oraz zagorzała przeciwniczka wiedźminów – nie zgadzała się z praktykami stosowanymi przez zabójców potworów, a także żywiła do nich osobistą urazę z powodu śmierci matki. Uważała mutacje wywoływane magicznie za plugastwo.

<b>Zdolności magiczne</b>
Opanowała magię żywiołów (w tym ognia) oraz posiadała inne umiejętności, które adeptki nabywały w Aretuzie. Potrafiła również posługiwać się łukiem i często łączyła używanie tej broni z zaklęciami.

<b>Wiedźmin: Zmora Wilka</b>
Wywodziła się od pierwszego ludzkiego czarodzieja, jej matka również była przedstawicielką tej profesji.

Pewnego dnia kobieta została oskarżona o przeklęcie miejscowego kapłana. Wynajęty do rozwiązania problemu wiedźmin udał się do jej domu i zabił ją, świadomy, że morderstwo obserwuje ukryta w szafie Tetra. Kilka dni później okazało się, że matka dziewczynki była niewinna – duchowny był chory, ponieważ jego kucharz podtruwał go, będąc w zmowie z zabójcą potworów, który później podzielił się z nim zyskiem.

Gilcrest odebrała nauki w Aretuzie, a następnie zaczęła kształcić własnych uczniów w Kaedwen, służyła również na dworze Dagreada. Przy każdej możliwej okazji próbowała przekonać monarchę do wygnania wiedźminów z kraju jako przestępców.

W 1165 roku w lasach przy Ard Carraigh zaczęły grasować tajemnicze, potężne bestie. Tetra została oddelegowana, by razem z Vesemirem zbadać problem. Oboje dotarli do ruin zamieszkiwanych przez władającą iluzją potworzycę, gdzie znaleźli uwięzionego Filavandrela. Okazało się, że za wszystkim stoją magowie-rezydenci z Kaer Morhen, którzy na polecenie Deglana używali swojej wiedzy, by tworzyć nowe, niebezpieczne hybrydy, takie jak spotkana wcześniej Kitsu. W leżu ostała się inna elfka Aen Seidhe, która również stała się mutantem. Tetra chciała ją zabić, ale Vesemir powstrzymał ją, pozwalając Filavandrelowi uciec, po czym sam ruszył do siedliszcza.

Gilcrest zawarła sojusz z pokrzywdzoną Kitsu, a także przedstawiła na dworze ostateczne dowody na deklarowaną przez nią szkodliwość wiedźminów, oskarżając ich również o kolaborację z elfami. W świetle nowych dowodów Dagread wydał zezwolenie na przeprowadzenie ataku na Kaer Morhen. Czarodziejka ruszyła pod twierdzę razem ze swoimi uczniami i wściekłym tłumem, niedługo później dołączyła do niej również Kitsu, prowadząc armię potworów.

Ostatecznie Tetra i Kitsu starły się z Vesemirem wewnątrz warowni. Omamiony przez iluzję wiedźmin pozabijał swoich sojuszników, w tym Lady Zerbst, a gdy otrząsnął się, Gilcrest szykowała się do zadania ostatecznego ciosu. Wtedy jednak Deglan rzucił w nią toporem, zabijając ją.""",
        "date":"14.04.2022",
        "category":"Postacie"
    }]
gallery = [
{"id":0,"title":"Karta 1", "src":"https://gwent.one/image/gwent/assets/card/art/max/2220.jpg"},
{"id":1,"title":"Karta 2", "src":"https://gwent.one/image/gwent/assets/card/art/max/2221.jpg"},
{"id":2,"title":"Karta 3", "src":"https://gwent.one/image/gwent/assets/card/art/max/2222.jpg"},
{"id":3,"title":"Karta 4", "src":"https://gwent.one/image/gwent/assets/card/art/max/2223.jpg"},
{"id":4,"title":"Karta 5", "src":"https://gwent.one/image/gwent/assets/card/art/max/2224.jpg"},
{"id":5,"title":"Karta 6", "src":"https://gwent.one/image/gwent/assets/card/art/max/2225.jpg"},
{"id":6,"title":"Karta 7", "src":"https://gwent.one/image/gwent/assets/card/art/max/2226.jpg"},
{"id":7,"title":"Karta 8", "src":"https://gwent.one/image/gwent/assets/card/art/max/2227.jpg"},
{"id":8,"title":"wiesiek","src":"https://static.polityka.pl/_resource/res/path/78/f9/78f90ad4-05ce-43d7-ac93-d57cdfb30171_f1400x900"}]
mainSettings = [{
    "id":0,
    "name":"preset1",
    "bg_color":"#272727",
    "menu_version":0,
    "menu_color":"#b50c0f",
    "menu_font_color":"#eaeaea",
    "menu_font_size":"25px",
    "burger_menu_show":879,
    "burger_menu_color":"#000000",
    "burger_menu_font_color":"#eaeaea",
    "burger_menu_font_size":"20px",
    "loggers_font_color":"#ffffff",
    "loggers_bg_color":"#000000",
    "loggers_border_color":"#ffffff",
    "loggers_border_width":"3px",
    "login_txt":"Zaloguj",
    "logout_txt":"Wyloguj",
    "register_txt":"Zarejestruj",
    "profile_txt":"Profil",
    "main_elements":[1,2,3],
    "headers_color":"#ffffff",
    "headers_size":"35px",
    "footer_bg_color":"#000000",
    "footer_font_color":"#ff0000",
    "slider_font_color:":"#ffffff",
    "slide_duration":300,
    "articles_module_text":"Artykuły",
    "articles_module_amount":5,
    "article_miniature_header_color":"#ffffff",
    "article_miniature_content_color":"#000000",
    "article_miniature_bg_color":"#a52a2a",
    "article_miniature_border_color":"#ff0000",
    "article_page_font_color":"#ffffff",
    "article_page_header_size":"35px",
    "article_page_intro_size":"20px",
    "article_page_content_size":"15px",
    "gallery_title_size":"30px",
    "gallery_title_color":"#ffffff",
    "gallery_minis_amount":5,
    "gallery_arrow_color":"#8b0000",
    "login_bg_color":"#eaeaea",
    "login_border_color":"#ff0000",
    "login_font_color":"#000000",
    "login_title":"Zaloguj",
    "login_button_text":"Zaloguj",
    "login_button_font_color":"#000000",
    "login_button_bg_color":"#ffffff",
    "login_register_text":"Zarejestruj",
    "login_register_font_color":"#0000ff",
    "register_title":"Zarejestruj",
    "register_button_text":"Zarejestruj",
    "profile_bg_color":"#eaeaea",
    "profile_border_color":"#ff0000",
    "profile_font_color":"#000000",
    "comments_section_bg_color":"#b50c0f",
    "comments_section_border_color":"#ffffff",
    "comments_section_adder_bg_color":"#eaeaea",
    "comments_section_adder_font_color":"#000000",
    "comments_section_adder_btn_bg_color":"#b50c0f",
    "comments_section_adder_btn_font_color":"#ffffff",
    "comments_loginfo_text":"Aby dodać komentarz musisz się zalogować",
    "comment_writes":"pisze:",
    "comment_bg_color":"#eaeaea",
    "comment_font_color":"#000000",
    "comment_add_comment":"Dodaj komentarz",
    "comments_module_text":"Ostatnie komentarze",
    "comments_module_amount":4
    },
    {
    "id":1,
    "name":"preset2",
    "bg_color":"#272727",
    "menu_version":0,
    "menu_color":"#b50c0f",
    "menu_font_color":"#eaeaea",
    "menu_font_size":"25px",
    "burger_menu_show":879,
    "burger_menu_color":"#000000",
    "burger_menu_font_color":"#eaeaea",
    "burger_menu_font_size":"20px",
    "loggers_font_color":"#ffffff",
    "loggers_bg_color":"#000000",
    "loggers_border_color":"#ffffff",
    "loggers_border_width":"3px",
    "login_txt":"Zaloguj",
    "logout_txt":"Wyloguj",
    "register_txt":"Zarejestruj",
    "profile_txt":"Profil",
    "main_elements":[1,2,3],
    "headers_color":"#ffffff",
    "headers_size":"35px",
    "footer_bg_color":"#000000",
    "footer_font_color":"#ff0000",
    "slider_font_color:":"#ffffff",
    "slide_duration":300,
    "articles_module_text":"Artykuły",
    "articles_module_amount":5,
    "article_miniature_header_color":"#ffffff",
    "article_miniature_content_color":"#000000",
    "article_miniature_bg_color":"#a52a2a",
    "article_miniature_border_color":"#ff0000",
    "article_page_font_color":"#ffffff",
    "article_page_header_size":"35px",
    "article_page_intro_size":"20px",
    "article_page_content_size":"15px",
    "gallery_title_size":"30px",
    "gallery_title_color":"#ffffff",
    "gallery_minis_amount":5,
    "gallery_arrow_color":"#8b0000",
    "login_bg_color":"#eaeaea",
    "login_border_color":"#ff0000",
    "login_font_color":"#000000",
    "login_title":"Zaloguj",
    "login_button_text":"Zaloguj",
    "login_button_font_color":"#000000",
    "login_button_bg_color":"#ffffff",
    "login_register_text":"Zarejestruj",
    "login_register_font_color":"#0000ff",
    "register_title":"Zarejestruj",
    "register_button_text":"Zarejestruj",
    "profile_bg_color":"#eaeaea",
    "profile_border_color":"#ff0000",
    "profile_font_color":"#000000",
    "comments_section_bg_color":"#b50c0f",
    "comments_section_border_color":"#ffffff",
    "comments_section_adder_bg_color":"#eaeaea",
    "comments_section_adder_font_color":"#000000",
    "comments_section_adder_btn_bg_color":"#b50c0f",
    "comments_section_adder_btn_font_color":"#ffffff",
    "comments_loginfo_text":"Aby dodać komentarz musisz się zalogować",
    "comment_writes":"pisze:",
    "comment_bg_color":"#eaeaea",
    "comment_font_color":"#000000",
    "comment_add_comment":"Dodaj komentarz",
    "comments_module_text":"Ostatnie komentarze",
    "comments_module_amount":4
    },
    {
    "id":2,
    "name":"preset3",
    "bg_color":"#272727",
    "menu_version":0,
    "menu_color":"#b50c0f",
    "menu_font_color":"#eaeaea",
    "menu_font_size":"25px",
    "burger_menu_show":879,
    "burger_menu_color":"#000000",
    "burger_menu_font_color":"#eaeaea",
    "burger_menu_font_size":"20px",
    "loggers_font_color":"#ffffff",
    "loggers_bg_color":"#000000",
    "loggers_border_color":"#ffffff",
    "loggers_border_width":"3px",
    "login_txt":"Zaloguj",
    "logout_txt":"Wyloguj",
    "register_txt":"Zarejestruj",
    "profile_txt":"Profil",
    "main_elements":[1,2,3],
    "headers_color":"#ffffff",
    "headers_size":"35px",
    "footer_bg_color":"#000000",
    "footer_font_color":"#ff0000",
    "slider_font_color:":"#ffffff",
    "slide_duration":300,
    "articles_module_text":"Artykuły",
    "articles_module_amount":5,
    "article_miniature_header_color":"#ffffff",
    "article_miniature_content_color":"#000000",
    "article_miniature_bg_color":"#a52a2a",
    "article_miniature_border_color":"#ff0000",
    "article_page_font_color":"#ffffff",
    "article_page_header_size":"35px",
    "article_page_intro_size":"20px",
    "article_page_content_size":"15px",
    "gallery_title_size":"30px",
    "gallery_title_color":"#ffffff",
    "gallery_minis_amount":5,
    "gallery_arrow_color":"#8b0000",
    "login_bg_color":"#eaeaea",
    "login_border_color":"#ff0000",
    "login_font_color":"#000000",
    "login_title":"Zaloguj",
    "login_button_text":"Zaloguj",
    "login_button_font_color":"#000000",
    "login_button_bg_color":"#ffffff",
    "login_register_text":"Zarejestruj",
    "login_register_font_color":"#0000ff",
    "register_title":"Zarejestruj",
    "register_button_text":"Zarejestruj",
    "profile_bg_color":"#eaeaea",
    "profile_border_color":"#ff0000",
    "profile_font_color":"#000000",
    "comments_section_bg_color":"#b50c0f",
    "comments_section_border_color":"#ffffff",
    "comments_section_adder_bg_color":"#eaeaea",
    "comments_section_adder_font_color":"#000000",
    "comments_section_adder_btn_bg_color":"#b50c0f",
    "comments_section_adder_btn_font_color":"#ffffff",
    "comments_loginfo_text":"Aby dodać komentarz musisz się zalogować",
    "comment_writes":"pisze:",
    "comment_bg_color":"#eaeaea",
    "comment_font_color":"#000000",
    "comment_add_comment":"Dodaj komentarz",
    "comments_module_text":"Ostatnie komentarze",
    "comments_module_amount":4
    }]
# comments = [
#     {"id":0,"username":"Aleksik","content":"Bardzo fajny serwis"},
#     {"id":1,"username":"Kozaczek123","content":"Pogchamp widzowie"},
#     {"id":2,"username":"Obirasek","content":"Kocham matmę, ale to jest nawet lepsze!"},
#     {"id":3,"username":"Aleksik","content":"UwU"},
#     {"id":4,"username":"Aleksik","content":"Bardzo fajny serwis"},
#     {"id":5,"username":"Kozaczek123","content":"Pogchamp widzowie"},
#     {"id":6,"username":"Obirasek","content":"Kocham matmę, ale to jest nawet lepsze!"},
#     {"id":7,"username":"Aleksik","content":"UwU"},
#     {"id":8,"username":"Aleksik","content":"Bardzo fajny serwis"},
#     {"id":9,"username":"Kozaczek123","content":"Pogchamp widzowie"},
#     {"id":10,"username":"Obirasek","content":"Kocham matmę, ale to jest nawet lepsze!"},
#     {"id":11,"username":"Aleksik","content":"UwU"},
#     {"id":12,"username":"Aleksik","content":"Bardzo fajny serwis"},
#     {"id":13,"username":"Kozaczek123","content":"Pogchamp widzowie"},
#     {"id":14,"username":"Obirasek","content":"Kocham matmę, ale to jest nawet lepsze!"},
#     {"id":15,"username":"Aleksik","content":"UwU"}
# ]


# Path for our main Svelte page
@app.route("/")
def base():
    return send_from_directory('client/public', 'index.html')

# Path for all the static files (compiled JS/CSS, etc.)
paths=["global.css", "build/bundle.css", "build/bundle.js"]

@app.route("/<path:path>")
def home(path):
    if path in paths:
         return send_from_directory('client/public', path)
    return send_from_directory('client/public', 'index.html')

@app.route("/getSettings")
def getSettings():
    settings = mainSettings[setter].copy()
    settings["headers"] = headers
    settings["footer"] = footer
    settings["slider"]=slider
    settings["articles"]=articles
    settings["setter"]=setter
    #settings["allSettings"]=mainSettings
    settings["gallery"]=gallery

    myConnection = sqlite3.connect('./database/comments.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT * FROM comments")
    comments = [dict(row) for row in myCursor.fetchall()]
    settings["comments"]=comments
    myConnection.close()
    # print(settings)
    # with open("sample.json", "w") as outfile:
    #     json.dump(articles, outfile)
    return jsonify(settings)

@app.route("/getAllSettings")
def getAllSettings():
    print(mainSettings)
    return jsonify(mainSettings)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    login = data["login"]
    password = data["password"]
    print(login+password)
    myConnection = sqlite3.connect('./database/users.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT *, oid FROM users")
    users = [dict(row) for row in myCursor.fetchall()]
    print(users)
    for el in users:
        print(el)
        if(el["login"]==login):
            if(el["password"]==password):
                isAdmin = el["isAdmin"]
                
                if(isAdmin=='1'):
                    return {"x":1, "y":el["rowid"]}
                else:
                    return {"x":2, "y":el["rowid"]}
            else:
                return {"x":0}
    myConnection.close()
    return {"x":0}

@app.route('/register', methods=['POST'])
def register_account():
    data = request.get_json()
    login = data["login"]
    password = data["password"]
    passwordr= data["passwordr"]
    print(login+password+passwordr)
    if(password!=passwordr):
        return {"x":0}
    myConnection = sqlite3.connect('./database/users.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT *, oid FROM users")

    users = [dict(row) for row in myCursor.fetchall()]
    for el in users:
        if(el["login"]==login):
            return {"x":1}

    myCursor.execute("INSERT INTO users VALUES (:login, :password, :isAdmin)",
                                {
                                    'login': login,
                                    'password': password,
                                    'isAdmin': '0'
                                })

    myConnection.commit()

    myConnection.close()
    print(users)

    return {"x":2}

@app.route('/changeUser',methods=['POST'])
def changeUsername():
    data = request.get_json()
    login = data["login"]
    password = data["password"]
    id = data["id"]
    print(login+password+" "+str(id))
    myConnection = sqlite3.connect('./database/users.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT *, oid FROM users")
    users = [dict(row) for row in myCursor.fetchall()]
    for el in users:
        if(el["login"]==login and int(el["rowid"])!=int(id)):
           return {"x":1}
    myCursor.execute("UPDATE users SET login = '" + login + "', password = '"+password+ "' WHERE oid = "+id)
    myConnection.commit()
    print(users)
    myConnection.close()
    return {"x":2}

@app.route('/getArticles')
def getArticles():
    myConnection = sqlite3.connect('./database/articles.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT * FROM articles")
    articles = [dict(row) for row in myCursor.fetchall()]
    myConnection.close()
    return jsonify(articles)

@app.route('/getUsers')
def getUsers():
    myConnection = sqlite3.connect('./database/users.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT *, oid FROM users")
    users = [dict(row) for row in myCursor.fetchall()]
    myConnection.close()
    return jsonify(users)

@app.route('/deleteUser',methods=['POST'])
def deleteUser():
    data = request.get_json()
    id= data["id"]
    myConnection = sqlite3.connect('./database/users.sqlite')
    print(id)
    myCursor = myConnection.cursor()
    myCursor.execute("DELETE FROM users where oid = "+id)
    myConnection.commit()
    myConnection.close()

@app.route('/addComment',methods=['POST'])
def addComment():
    data = request.get_json()
    comment = data["comment"]
    print(comment)
    myConnection = sqlite3.connect('./database/comments.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()

    myCursor.execute("INSERT INTO comments VALUES (:id, :username, :content)",comment)

    myConnection.commit()

    myConnection.close()

    return {"x":1}




@app.errorhandler(404)
def pageNotFound(error):
   return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)
