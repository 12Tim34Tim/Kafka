// externalized station text data for Kafkas Prag tour (Literarischer Reiseführer)
const STATIONS_DATA = [
  {
    id: 1,
    title: "Das Geburtshaus",
    description: "Stellen Sie sich vor, Sie werden an einem Ort geboren und über ein Jahrhundert später ist der gesamte Platz nach Ihnen benannt. Genau das ist Franz Kafka passiert. Am 3. Juli 1883 erblickte er hier, mitten im Herzen von Prag, das Licht der Welt. Wenn Sie heute vor dem Gebäude stehen, ist das allerdings nicht mehr exakt das Haus von damals. Das ursprüngliche Gebäude trug den Namen „Haus zum Turm“ und lag direkt an der Grenze zwischen der Altstadt und dem jüdischen Viertel, der Josefstadt.<br><br>Im Jahr 1897 gab es hier jedoch einen großen Brand. Im Zuge der darauffolgenden städtischen Sanierung wurden die Überreste und viele alte Häuser in der Gegend abgerissen. Die historische Stimmung ist dennoch greifbar: Bis auf das schicke, barocke Eingangsportal musste das Haus zwar neu aufgebaut werden, aber genau dieses Portal ist noch original erhalten geblieben. An der Hauswand finden Sie heute eine markante Kafka-Büste aus Bronze und eine Gedenktafel.<br><br>Für Kafka war Prag ein fast unzertrennlicher Teil von ihm. Er selbst schrieb einst in einem Brief, dass Prag ein „Mütterchen“ sei, das „Scharfen Klauen“ hat und einen nicht loslässt. Seine Eltern, Hermann und Julie Kafka, stammten aus eher einfachen Verhältnissen. Franz war das älteste Kind. Seine beiden jüngeren Brüder starben bereits im Säuglingsalter, und seine drei Schwestern Elli, Valli und Ottla wurden erst geboren, als die Familie bereits umgezogen war.",
    task: "Nun haben Sie die Möglichkeit, die verlorenen Überreste zusammenzusetzen und das ursprüngliche „Haus zum Turm“ wieder aufzubauen.",
    gameUrl: "Games/geburtshaus.html",
    resultType: "image"
  },
  {
    id: 2,
    title: "Das Kinsky-Palais",
    description: "Dieses Gebäude ist ein echter Prachtbau direkt am Altstädter Ring. Rosa-weiße Fassade, goldene Verzierungen, voll im prunkvollen Rokoko-Stil. Heute wird das Palais von der tschechischen Nationalgalerie genutzt und stellt Kunst aus. Aber lassen Sie sich von der schönen Optik nicht täuschen: Für Kafka bedeutete dieses Haus jahrelang enorme psychische Belastung und Versagensängste. Hier kreuzten sich nämlich zwei Dinge, die sein Leben prägten: Das k.k. Staatsgymnasium, das er besuchte, befand sich in diesem Palais, ebenso wie das Geschäft seines dominanten Vaters. Im Erdgeschoss des Palais betrieb Hermann Kafka über viele Jahre hinweg sein Galanteriewarengeschäft. Der Vater war ein großer, lauter und extrem ehrgeiziger Geschäftsmann, der absolut kein Verständnis für die sensible, künstlerische Art seines Sohnes aufbringen konnte. Franz fühlte sich neben ihm oft klein und schwach. Das Geschäft des Vaters war für Franz ein Symbol für den Zwang des rein Wirtschaftlichen, den er selbst so sehr verabscheute.",
    task: "Versuchen Sie nun, Kafkas beklemmenden Schulweg durch das Palais zu meistern… vorausgesetzt, Sie können seinem übermächtigen Vater rechtzeitig ausweichen.",
    gameUrl: "Games/kinsky.html",
    resultType: "image"
  },
  {
    id: 3,
    title: "Das Karolinum",
    description: "Nach dem Abitur ging es für Kafka direkt an die Universität. Sie blicken hier auf das Karolinum, den historischen Hauptsitz der berühmten Karls-Universität in Prag, die schon im Jahr 1348 gegründet wurde. Mit seinen gotischen Bogenfenstern und dem dunklen Stein strahlt es genau jene akademische Macht aus, die Kafka oft als einengend empfand. Hier schlug Kafka im Jahr 1901 den Weg ein, den viele Söhne aus gutem, bürgerlichem Hause damals gehen mussten, um den Erwartungen ihrer Eltern gerecht zu werden. Kafka hatte eigentlich wenig Neigung zur Rechtswissenschaft und war völlig orientierungslos. Er schrieb sich zuerst für Chemie ein, merkte aber nach gerade einmal zwei Wochen, dass dies nicht der richtige Weg war. Danach probierte er es mit Kunstgeschichte und Germanistik, kehrte dann aber doch zähneknirschend zum Jura-Studium zurück, da es ihm am ehesten die Möglichkeit auf einen geregelten Beruf offenhielt.",
    task: "Sie können nun wie Kafka versuchen, den richtigen Studiengang zu wählen.",
    gameUrl: "Games/karolinum.html",
    resultType: "image"
  },
  {
    id: 4,
    title: "Assicurazioni Generali",
    description: "Nachdem Kafka seinen Doktor-Titel erlangt und ein Praktikum am Gericht absolviert hatte, brauchte er einen Job. Im Oktober 1907 fing er bei der „Assicurazioni Generali“ an, einer großen italienischen Versicherungsgesellschaft. Das prachtvolle Gebäude im Neorenaissance-Stil steht an der Ecke des Wenzelsplatzes. Wenn Sie heute daran vorbeilaufen, bewundern Sie vermutlich die beeindruckende Architektur. Für Kafka war dieser Ort jedoch der Inbegriff der Bürokratie und ein Ort, der ihn stark belastete. Kafka startete dort als Aushilfskraft in der Abteilung für Lebensversicherungen. Er hoffte, er könnte den Job locker nebenbei machen, um Zeit zum Schreiben zu haben, aber die Realität holte ihn ein. Die Arbeitszeiten mit unbezahlten Überstunden ließen ihm so gut wie keinen Raum für seine Literatur.",
    task: "Sie dürfen nun den Büro-Alltag bei der Assicurazioni Generali am eigenen Leib erfahren.",
    gameUrl: "Games/generali.html",
    resultType: "image"
  },
  {
    id: 5,
    title: "Die Volksschule am Fleischmarkt",
    description: "Für die nächste Station springen wir noch einmal an den Anfang von Kafkas Bildungsweg. Am Fleischmarkt, unweit der Josefstadt, besuchte Franz von 1889 bis 1893 die Deutsche Knabenvolksschule. Man könnte denken, Grundschule bedeute eine unbeschwerte Kindheit. Bei Franz Kafka war diese Zeit jedoch geprägt von starken Selbstzweifeln. Besonders traumatisch war für ihn der tägliche Schulweg. Jeden Morgen brachte die Köchin der Familie Kafka den schmächtigen Franz zur Schule. Er hatte damals die feste Überzeugung, die Lehrer würden jeden Moment merken, dass er den Stoff nicht beherrschte, und ihn von der Schule weisen. Wenn die Köchin unterwegs stehen blieb, um mit jemandem zu reden, hatte er Panik, zu spät zu kommen. Das Verrückte daran: Kafka war durchgehend ein sehr guter Schüler. Die ständige Angst vor einer unsichtbaren Schuld und mächtigen Autoritäten, die seine späteren Romane wie „Der Prozess“ prägten, nahmen hier auf dem Schulweg ihren Ursprung.",
    task: "Sie können nun versuchen, von der Schule, zu Kafkas Wohnung, dem Haus der Minute, in unter zehn Minuten zu gelangen, aber passen Sie auf, dass sie nicht zu spät kommen!",
    gameUrl: "Games/volksschule.html",
    resultType: "image"
  },
  {
    id: 6,
    title: "Kafkas Arbeit bei der Arbeiterunfallversicherung",
    description: "Sie stehen nun neben dem Haus indem Franz Kafka 14 Jahre lang arbeitete, von 1908 bis 1922. Hier kümmerte er sich als Jurist um Angelegenheiten den Unfallschutz betreffend und musste dafür auch öfter Dienstreisen zu betroffenen Fabriken unternehmen und schrieb unteranderem auch Gebrauchsanweisungen für dort verwendete Geräte. Während des ersten Weltkrieges wollte er freiwillig in den Krieg ziehen, sein Arbeitgeber meldete ihn allerdings als unverzichtbare Person weswegen er bis 1922 ununterbrochen hier arbeitete. Zu seinem Job sagte er selber:<br><br>„Dort im Büro ist die wahre Hölle, eine andere fürchte ich nicht mehr.“<br><br>Seine Arbeit sah er also eher als Brotjob an, sie machte ihm keinerlei Freude, sie hielt ihn sogar eher vom Schreiben ab, was ihn noch unglücklicher machte. Weswegen er dennoch so lange dort arbeitete kann man nur mutmaßen, aber vermutlich lag es daran, dass andere Jobs ihm vermutlich nicht mehr Erfüllung gebracht hätten, außerdem verdiente er gut, sein Arbeitsplatz lag nah an seinen zuhause und er konnte Arbeiter in Rechtsfragen unterstützen, was ihm als Sozialist vermutlich ein großes Anliegen war.<br><br>Sein langer Dienst und sein Können resultierten in mehrfachen Beförderungen so, dass er am Ende seiner Laufbahn als Obersekreter angestellt war. Seine Laufbahn beendete er wegen seinem Lungenleiden und wurde deswegen 1922 früh pensioniert.",
    task: "Nun können sie, wenn sie möchten wie Kafka auf folgendem Bild drei Unfallrisiken ausfindig machen.",
    gameUrl: "Games/unfall.html",
    resultType: "image"
  },
  {
    id: 7,
    title: "Alchemistengasse 22",
    description: "Der Lärm Prags hinderte Kafka ständig am Schreiben. 1916 mietete seine Schwester Ottla das winzige Haus Nr. 22 im Goldenen Gässchen. In dieser Abgeschiedenheit fand Kafka die nötige Ruhe zum Schreiben. Diese produktive Phase endete jäh im Spätsommer 1917, als er an Tuberkulose erkrankte und das Haus aufgeben musste.",
    task: "Helfen Sie Kafka, sein Zitat zu verfassen. Klicken Sie die umherschwirrenden Wörter in der exakten Reihenfolge an.",
    gameUrl: "Games/alchemisten.html",
    resultType: "image"
  },
  {
    id: 8,
    title: "Franz Kafka Denkmal",
    description: "Wenn sie schon auf einer Tour über Franz Kafka sind, müssen sie natürlich auch sein Denkmal besuchen. Wie sie sehen Zeigt es Kafka auf einer Person ohne Kopf, Hände oder Füße sitzend. Der Künstler Jaroslav Róna wurde durch Kafkas Erzählung „Beschreibung eines Kampfes“, dazu inspiriert:<br><br>„Schon sprang ich mit ungewohnter Geschicklichkeit meinem Bekannten auf die Schultern und brachte ihn dadurch, dass ich meine Fäuste in seinen Rücken stieß in einen leichten Trab“<br><br>Ausgewählt wurde dieser Platz, da Kafka, wie sie bereits bemerkt haben, hauptsächlich in diesem Bezirk Prags unterwegs war und sein ehemaliges Geburtshaus hier in der Nähe stand.",
    task: "Jetzt haben sie die Möglichkeit in Kafkas Denkmal ein zu tauchen.",
    gameUrl: "Games/denkmal.html",
    resultType: "image"
  },
  {
    id: 9,
    title: "Haus zur Minute",
    description: "In dem mit schwarz-weißen Ornamenten verziertem Haus vor ihnen, lebte die Familie Kafka von 1889 bis 1996. Heute ist es ein Teil des Altstädter Rathauses. Möglicherweise haben sie bereits von dem speziellen Verhältnis von Kafka zu seinem Vater gehört. Falls nicht bietet ihnen der folgende Auszug aus Kafkas „Brief an den Vater“ einen eindruck:<br><br>„Noch nach Jahren litt ich unter der quälenden Vorstellung, daß der riesige Mann, mein Vater, die letzte Instanz, fast ohne Grund kommen und mich in der Nacht aus dem Bett auf die Pawlatsche tragen konnte“.<br>Die eben genannte Pawlatsche, ist wahrscheinlich die, die sie vor sich sehen können.<br><br>Angeblich kommt der Name von einem Italienischen Bäcker, der, sobald sein Brot fertig war, in die Gasse rief: „A minuta, a minuta!“, also in einer Minute!",
    task: "Nun, können sie sich etwas Zeit nehmen und versuchen, in dem Spiel, Kafkas Gefühlszustand auf der Pawlatsche zu ergründen.",
    gameUrl: "Games/haus_zur_minute.html",
    resultType: "image"
  },
  {
    id: 10,
    title: "Oppelthaus",
    description: "Hier lebte Kafka von 1913 bis 1923, also am längsten… zusammen mit seiner Familie. Sie haben von den Spannungen zwischen ihm und seinem Vater gehört, deswegen ist es auch nicht verwunderlich, dass er viele versuche unternahm von seinen Eltern weg zu ziehen, beispielsweise in die Alchemistengasse. Diesen Drang beschreibt folgender Ausschnitt aus seinem Werk „Der Aufbruch“:<br><br>„Ich will nur weg von hier, einfach nur weg von hier. Immer aufbrechen, hier weg, nur so kann ich mein Ziel erreichen“<br><br>Warum er nicht wegzog, lag daran, dass es sich in seinem Umfeld so gehörte bei seinen Eltern zu wohnen, bis man verheiratet war. Kafka als konfliktscheue Person, riskierte es nicht sich so gegen seine Eltern zu stellen, nutzte aber den Moment als er zu Kriegsbeginn sein Zimmer räumen musste um Platz für seine Schwester Elli zu machen und zog aus. Wie sie aber wissen, musste er 1917 wegen der Tuberkulose wieder bei seinen Eltern einziehen. Dieser Aufenthalt wurde nur gelegentlich von Aufenthalten in Sanatorien oder Kuren unterbrochen. Der soziale Zwang und seine Krankheit hatten also auch Ihren Anteil an seinem Verbleib in Prag.",
    task: "Versuchen Sie nun, den Drang nach Freiheit mit den familiären Verpflichtungen auf der Waage auszubalancieren… falls das überhaupt möglich ist.",
    gameUrl: "Games/oppelthaus.html",
    resultType: "image"
  },
  {
    id: 11,
    title: "Erste Eigene Wohnung",
    description: "Bis zu seinem 32. Lebensjahr lebte Franz Kafka noch bei seinen Eltern. Ein Grund dafür war, dass es im bürgerlichen Milieu üblich war, erst auszuziehen, wenn man verheiratet war. Hätte sich Kafka entschieden, früher auszuziehen, hätte dies mit großer Wahrscheinlichkeit einen Konflikt mit der Familie hervorgerufen. Als dann am 18. Juli 1914 der erste Weltkrieg begann, wurden kurz darauf viele Menschen vom Militär in den Krieg einberufen. Da Kafka aber durch seine wichtige Rolle bei der Versicherung nicht in den Krieg mit einziehen konnte, blieb er in Prag. Jedoch wurde auch der Ehemann seiner Schwster Elli in das Militär einberufen, weshalb Elli nun mit in das Elternhaus einzog, da man sie nicht mit einem Kind allein leben lassen wollte. Dort bezog sie das Zimmer von Franz Kafka, darum musste sich dieser nun eine eigene Wohnung suchen.",
    task: "Jetzt haben Sie die Aufgabe, Kafkas Möbel in seinem neuen Zimmer unterzubringen.",
    gameUrl: "Games/wohnung.html",
    resultType: "image"
  },
  {
    id: 12,
    title: "Zivilschwimmschule",
    description: "Franz Kafka ging oft und gerne Schwimmen und Rudern, wofür er im Erwachsenenalter sogar ein eigenes Ruderboot erwarb. Er war oft mit seinem Vater in der Zivilschwimmschule, wo ihm dieser das Schwimmen beibrachte. Allgemein war diese Schwimmschule sehr wichtig, da sie mit die einzige Möglichkeit für Kinder und Jugendliche war sich in ihrer Freizeit sportlich zu betätigen. Jedoch war sie nicht nur mit positiven Erinnerungen von Kafka behaftet. In der Umkleide wurde ihm seine Magerkeit und körperliche Unterlegenheit gegenüber seinem Vater schmerzhaft bewusst und im Wasser war er unfähig die von seinem Vater vorgeführten Schwimmübungen auszuführen, so schreibt er es in einem Brief an seinen Vater.",
    task: "Sie können nun versuchen, Kafkas Selbstbewusstsein durch schnelles Antippen aufzublähen, um aus dem erdrückenden Schatten seines Vaters herauszutreten.",
    gameUrl: "Games/schwimmschule.html",
    resultType: "image"
  },
  {
    id: 13,
    title: "Philosophischer Salon",
    description: "Im ersten Stockwerk des Hauses „Zum Einhorn“ Lag der die Wohnung von Berta Fanta, in der sich oft Intellektuelle trafen, um über viele Themen zu diskutieren. Es wurden gemeinsam philosophische Werke von Hegel und Kant gelesen, über verschiedene Weltanschauungen diskutiert und in den Jahren 1911 und 1912 nahm sogar Albert Einstein manchmal an den Sitzungen teil. In seiner Studienzeit besuchte Kafka ab und zu Lesungen und Diskussionsrunden und wurde trotz seiner eher Zurückgehaltenen Art im Kreis wegen seines Humors sehr geschätzt. Seine Werke kannte damals aber noch niemand außer sein Freund Max Brod, der auch gelegentlich in den Salon ging.",
    task: "Nun haben Sie die Gelegenheit, in der Atmosphäre des Salons Ihren Gedanken freien Lauf zu lassen und einen eigenen philosophischen Satz niederzuschreiben.",
    gameUrl: "Games/philosophie.html",
    resultType: "image"
  },
  {
    id: 14,
    title: "Café Savoy",
    description: "In dem damaligen Café gab es, im Unterschied zu Heute, noch eine Bühne für Theaterstücke, welche sich Kafka sehr gerne ansah. Da oft jüdische Werke aufgeführt wurden konnte Kafka so eine ursprüngliche Welt der Juden erleben, die er als Westjude so nie kennengelernt hat. Des Weiteren freundete sich Kafka mit einem der Schauspieler namens Jizchak Löwy an und pflegte mit noch für längere Zeit Briefkontakt. Durch ihn erfuhr er unter anderem viel über das jüdische Leben in Polen.",
    task: "Jetzt können Sie selbst zur Feder greifen und einen persönlichen Brief an den Schauspieler Jizchak Löwy verfassen, um Ihre Eindrücke aus dieser neuen Welt zu teilen.",
    gameUrl: "Games/savoy.html",
    resultType: "image"
  },
  {
    id: 15,
    title: "Grab auf dem Neuen Jüdischen Friedhof",
    description: "Franz Kafka starb am 3. Juni 1924 an Tuberkulose und wurde acht Tage nach seinem Tod auf dem Neuen Jüdischen Friedhof beerdigt. Am Trauerzug nahmen Verwandte und Freunde teil, insgesamt waren es ungefähr 100 Personen, die am Ende an seinem Grab trauerten.",
    task: "Zum Abschluss haben Sie die ehrenvolle Möglichkeit, ein letztes, selbst gewähltes Wort für die Ewigkeit in Kafkas Grabstein zu meißeln.",
    gameUrl: "Games/grab.html",
    resultType: "image"
  }
];
