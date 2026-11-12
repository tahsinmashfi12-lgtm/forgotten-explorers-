/* Forgotten Explorers — Solar System Explorer. Loaded only when a visitor opens it (#solar). */
window.FE_Solar = (() => {
"use strict";
let S = null;
const AU_KM = 149597870.7;
const PLANETS = ["mercury","venus","earth","mars","jupiter","saturn","uranus","neptune"];
const ALL = ["sun", ...PLANETS, "pluto"];
/* UI strings: [en, bn, es, fr, ar] */
const TT = {
 ss_viewmode:["View mode","দৃশ্যের ধরন","Modo de vista","Mode d’affichage","وضع العرض"],
 f_age:["Age","বয়স","Edad","Âge","العمر"],f_comp:["Composition","গঠন","Composición","Composition","التركيب"],f_core:["Core temperature","কেন্দ্রের তাপমাত্রা","Temperatura del núcleo","Température du cœur","حرارة اللب"],
 f_surf:["Surface temperature","পৃষ্ঠের তাপমাত্রা","Temperatura de la superficie","Température de surface","حرارة السطح"],f_dist:["Distance from Earth","পৃথিবী থেকে দূরত্ব","Distancia a la Tierra","Distance à la Terre","البعد عن الأرض"],
 f_lum:["Luminosity","দীপ্তি","Luminosidad","Luminosité","الإضاءة"],f_mloss:["Mass converted to energy","শক্তিতে রূপান্তরিত ভর","Masa convertida en energía","Masse convertie en énergie","الكتلة المتحولة إلى طاقة"],
 to_ecl:["to the ecliptic","ক্রান্তিবৃত্তের সাপেক্ষে","respecto a la eclíptica","par rapport à l’écliptique","بالنسبة إلى مستوى البروج"],
 src_l:["Source","উৎস","Fuente","Source","المصدر"],bar_note:["Mean temperature for giant planets is at the 1-bar level.","দানব গ্রহগুলোর গড় তাপমাত্রা ১-বার চাপের স্তরে মাপা।","La temperatura media de los planetas gigantes corresponde al nivel de 1 bar.","La température moyenne des planètes géantes est donnée au niveau de 1 bar.","متوسط حرارة الكواكب العملاقة مقيس عند مستوى ضغط 1 بار."],
 sat_src:["NASA NSSDCA satellite fact sheets.","নাসা NSSDCA উপগ্রহ তথ্যপত্র।","Fichas técnicas de satélites de la NASA NSSDCA.","Fiches techniques des satellites de la NASA NSSDCA.","صحائف بيانات الأقمار من NASA NSSDCA."],
 u_days:["days","দিন","días","jours","يوم"],u_hours:["hours","ঘণ্টা","horas","heures","ساعة"],u_mkm:["million km from the Sun","সূর্য থেকে মিলিয়ন কিমি","millones de km del Sol","millions de km du Soleil","مليون كم من الشمس"],retro:["retrograde","বিপরীতমুখী","retrógrado","rétrograde","تراجعي"],
 cmp_src:["Source: NASA NSSDCA Planetary and Sun Fact Sheets. Temperatures: mean surface (giant planets at the 1-bar level; Sun = photosphere ≈ 5,500 °C). Distance for the Moon is the Earth–Sun distance.","উৎস: নাসা NSSDCA গ্রহ ও সূর্যের তথ্যপত্র। তাপমাত্রা: পৃষ্ঠের গড় (দানব গ্রহের ক্ষেত্রে ১-বার স্তর; সূর্যের ক্ষেত্রে আলোকমণ্ডল ≈ ৫,৫০০ °সে)। চাঁদের দূরত্ব হিসেবে পৃথিবী–সূর্যের দূরত্ব নেওয়া হয়েছে।","Fuente: fichas de datos planetarios y del Sol de la NASA NSSDCA. Temperaturas: media en superficie (planetas gigantes al nivel de 1 bar; Sol = fotosfera ≈ 5500 °C). Para la Luna se usa la distancia Tierra–Sol.","Source : fiches planétaires et solaires de la NASA NSSDCA. Températures : moyenne en surface (planètes géantes au niveau de 1 bar ; Soleil = photosphère ≈ 5 500 °C). Pour la Lune, la distance indiquée est celle Terre–Soleil.","المصدر: صحائف بيانات الكواكب والشمس من NASA NSSDCA. درجات الحرارة: متوسط السطح (الكواكب العملاقة عند مستوى 1 بار؛ الشمس = الغلاف الضوئي ≈ 5500 °م). المسافة المعتمدة للقمر هي المسافة بين الأرض والشمس."],
 out_note:["Outcomes judge each mission’s primary objectives, not just a successful launch. Sources: {links}, and each mission’s linked page. This archive lists major missions; it is not yet a complete record of every launch.","ফলাফল নির্ধারিত হয়েছে প্রতিটি অভিযানের মূল লক্ষ্যের ভিত্তিতে, শুধু সফল উৎক্ষেপণের ভিত্তিতে নয়। উৎস: {links}, এবং প্রতিটি অভিযানের সংযুক্ত পাতা। এই আর্কাইভে প্রধান অভিযানগুলো আছে; এটি এখনও প্রতিটি উৎক্ষেপণের পূর্ণ তালিকা নয়।","El resultado valora los objetivos principales de cada misión, no solo un lanzamiento exitoso. Fuentes: {links} y la página enlazada de cada misión. Este archivo recoge las misiones principales; aún no es un registro completo de todos los lanzamientos.","Le résultat juge les objectifs principaux de chaque mission, pas seulement la réussite du lancement. Sources : {links}, et la page liée de chaque mission. Cette archive recense les grandes missions ; ce n’est pas encore un registre complet de tous les lancements.","تُقيَّم النتائج وفق الأهداف الرئيسية لكل مهمة، لا وفق نجاح الإطلاق وحده. المصادر: {links}، والصفحة المرتبطة بكل مهمة. يضم هذا الأرشيف المهمات الكبرى، وليس بعد سجلًا كاملًا لكل عمليات الإطلاق."],
 title:["Solar System","সৌরজগৎ","Sistema Solar","Système solaire","النظام الشمسي"],
 intro_line:["Eight planets. One star. Every machine we sent to meet them.","আটটি গ্রহ। একটি নক্ষত্র। তাদের কাছে পাঠানো প্রতিটি যন্ত্র।","Ocho planetas. Una estrella. Cada máquina que enviamos a su encuentro.","Huit planètes. Une étoile. Chaque machine envoyée à leur rencontre.","ثمانية كواكب. نجم واحد. وكل آلة أرسلناها للقائها."],
 skip:["Skip intro","ভূমিকা এড়িয়ে যান","Saltar intro","Passer l’intro","تخطَّ المقدمة"],enter:["Enter Solar System","সৌরজগতে প্রবেশ করুন","Entrar al Sistema Solar","Entrer dans le Système solaire","ادخل النظام الشمسي"],
 overview:["Overview","সারসংক্ষেপ","Vista general","Vue d’ensemble","نظرة عامة"],exit:["Exit","বের হন","Salir","Quitter","خروج"],
 m_explore:["Exploration","অন্বেষণ","Exploración","Exploration","استكشاف"],m_scale:["True scale","প্রকৃত মাপ","Escala real","Échelle réelle","المقياس الحقيقي"],m_distance:["Distance","দূরত্ব","Distancia","Distances","المسافة"],
 note_explore:["Not to scale. Planet sizes are enlarged and distances compressed so the whole system fits on screen. Orbits, order and directions are real.","মাপ অনুযায়ী নয়। পুরো সৌরজগৎ পর্দায় আনতে গ্রহের আকার বড় ও দূরত্ব সংকুচিত করা হয়েছে। কক্ষপথ, ক্রম ও দিক প্রকৃত।","No está a escala. Los tamaños se agrandan y las distancias se comprimen para que todo quepa en pantalla. Órbitas, orden y sentidos son reales.","Pas à l’échelle. Tailles agrandies et distances compressées pour tout faire tenir à l’écran. Orbites, ordre et sens sont réels.","ليس بالمقياس الحقيقي. كُبّرت أحجام الكواكب وضُغطت المسافات ليتسع النظام للشاشة. المدارات والترتيب والاتجاهات حقيقية."],
 note_scale:["True scale: sizes and distances share one scale (1 unit = 1 million km). The planets really are this small — zoom in on a label to find each world.","প্রকৃত মাপ: আকার ও দূরত্ব একই স্কেলে (১ একক = ১০ লক্ষ কিমি)। গ্রহগুলো সত্যিই এত ছোট — লেবেলে জুম করুন।","Escala real: tamaños y distancias comparten escala (1 unidad = 1 millón de km). Los planetas son así de pequeños: acércate a una etiqueta.","Échelle réelle : tailles et distances partagent la même échelle (1 unité = 1 million de km). Les planètes sont vraiment si petites : zoomez sur une étiquette.","مقياس حقيقي: الأحجام والمسافات بمقياس واحد (وحدة = مليون كم). الكواكب صغيرة فعلًا — قرّب إلى أي اسم لتجده."],
 note_distance:["True distances. Planets are shown as markers, not to size. Rings mark distance from the Sun in astronomical units and light travel time.","প্রকৃত দূরত্ব। গ্রহগুলো চিহ্ন হিসেবে দেখানো, মাপ অনুযায়ী নয়। বলয়গুলো সূর্য থেকে দূরত্ব (AU) ও আলোর ভ্রমণকাল দেখায়।","Distancias reales. Los planetas son marcadores, no a escala de tamaño. Los anillos marcan la distancia al Sol en UA y tiempo luz.","Distances réelles. Les planètes sont des repères, pas à la bonne taille. Les cercles indiquent la distance au Soleil en ua et en temps-lumière.","مسافات حقيقية. تظهر الكواكب كعلامات وليس بحجمها. تشير الحلقات إلى البعد عن الشمس بالوحدات الفلكية وزمن انتقال الضوء."],
 bodies:["Bodies","বস্তু","Cuerpos","Astres","الأجرام"],moons:["Moons","উপগ্রহ","Lunas","Lunes","الأقمار"],missions:["Missions","অভিযান","Misiones","Missions","المهمات"],timeline:["Timeline","সময়রেখা","Cronología","Chronologie","الخط الزمني"],
 compare:["Compare","তুলনা","Comparar","Comparer","مقارنة"],journey:["Journey","যাত্রা","Viaje","Voyage","رحلة"],music:["Music","সংগীত","Música","Musique","الموسيقى"],
 play:["Play","চালান","Reproducir","Lecture","تشغيل"],pause:["Pause","থামান","Pausa","Pause","إيقاف مؤقت"],mute:["Mute","নিঃশব্দ","Silenciar","Couper le son","كتم"],unmute:["Unmute","শব্দ চালু","Activar sonido","Rétablir le son","إلغاء الكتم"],
 music_note:["Original ambient score made for this explorer. It plays only here, at low volume.","এই এক্সপ্লোরারের জন্য তৈরি মৌলিক সুর। শুধু এখানেই, কম শব্দে বাজে।","Banda sonora ambiental original creada para este explorador. Solo suena aquí, a bajo volumen.","Musique d’ambiance originale créée pour cet explorateur. Elle ne joue qu’ici, à faible volume.","موسيقى أصلية صُنعت لهذا المستكشف، تُعزف هنا فقط وبصوت منخفض."],
 tab_over:["Overview","সারসংক্ষেপ","Resumen","Aperçu","نظرة عامة"],tab_data:["Data","তথ্য","Datos","Données","البيانات"],tab_moons:["Moons","উপগ্রহ","Lunas","Lunes","الأقمار"],tab_missions:["Missions","অভিযান","Misiones","Missions","المهمات"],tab_hist:["History","ইতিহাস","Historia","Histoire","التاريخ"],tab_layers:["Structure","গঠন","Estructura","Structure","البنية"],
 now_dist:["Distance from Earth now","এখন পৃথিবী থেকে দূরত্ব","Distancia a la Tierra ahora","Distance à la Terre maintenant","البعد عن الأرض الآن"],calc_at:["Calculated","গণনা","Calculado","Calculé","حُسب"],light_time:["Light travel time","আলোর ভ্রমণকাল","Tiempo luz","Temps-lumière","زمن انتقال الضوء"],
 eph_src:["JPL approximate planetary positions (Keplerian elements, valid 1800–2050)","JPL আনুমানিক গ্রহ অবস্থান","Posiciones planetarias aproximadas de JPL","Positions planétaires approchées du JPL","مواقع الكواكب التقريبية من JPL"],
 focus:["Focus in 3D","থ্রিডিতে দেখুন","Ver en 3D","Voir en 3D","اعرض ثلاثي الأبعاد"],back:["Back","ফিরুন","Volver","Retour","رجوع"],close:["Close","বন্ধ","Cerrar","Fermer","إغلاق"],
 diameter:["Diameter","ব্যাস","Diámetro","Diamètre","القطر"],mass:["Mass","ভর","Masa","Masse","الكتلة"],density:["Density","ঘনত্ব","Densidad","Densité","الكثافة"],gravity:["Surface gravity","পৃষ্ঠ মাধ্যাকর্ষণ","Gravedad superficial","Gravité de surface","الجاذبية السطحية"],
 temp:["Mean temperature","গড় তাপমাত্রা","Temperatura media","Température moyenne","متوسط الحرارة"],atm:["Atmosphere","বায়ুমণ্ডল","Atmósfera","Atmosphère","الغلاف الجوي"],rot:["Rotation period","আবর্তন কাল","Periodo de rotación","Période de rotation","فترة الدوران"],
 orb:["Orbital period","প্রদক্ষিণ কাল","Periodo orbital","Période orbitale","الفترة المدارية"],dist_sun:["Mean distance from the Sun","সূর্য থেকে গড় দূরত্ব","Distancia media al Sol","Distance moyenne au Soleil","متوسط البعد عن الشمس"],
 pressure:["Surface pressure","পৃষ্ঠ চাপ","Presión superficial","Pression de surface","الضغط السطحي"],tilt:["Axial tilt","অক্ষীয় ঢাল","Inclinación axial","Inclinaison de l’axe","ميل المحور"],class:["Classification","শ্রেণি","Clasificación","Classification","التصنيف"],
 nmoons:["Moons","উপগ্রহ সংখ্যা","Lunas","Lunes","عدد الأقمار"],surface:["Surface conditions","পৃষ্ঠের অবস্থা","Condiciones de superficie","Conditions de surface","ظروف السطح"],rings:["Rings","বলয়","Anillos","Anneaux","الحلقات"],magf:["Global magnetic field","বৈশ্বিক চৌম্বক ক্ষেত্র","Campo magnético global","Champ magnétique global","مجال مغناطيسي عام"],
 yes:["Yes","হ্যাঁ","Sí","Oui","نعم"],no:["No","না","No","Non","لا"],unknown:["Unknown","অজানা","Desconocido","Inconnu","غير معروف"],
 discovery:["Discovery","আবিষ্কার","Descubrimiento","Découverte","الاكتشاف"],naming:["Name","নামকরণ","Nombre","Nom","التسمية"],highlights:["Important discoveries","গুরুত্বপূর্ণ আবিষ্কার","Descubrimientos importantes","Découvertes importantes","اكتشافات مهمة"],
 moon_count:["Recognised moons","স্বীকৃত উপগ্রহ","Lunas reconocidas","Lunes reconnues","الأقمار المعترف بها"],verified:["Last verified","সর্বশেষ যাচাই","Última verificación","Dernière vérification","آخر تحقق"],
 discovered:["Discovered","আবিষ্কার","Descubierta","Découverte","اكتُشف"],by:["By","আবিষ্কারক","Por","Par","بواسطة"],from_parent:["Distance from planet","গ্রহ থেকে দূরত্ব","Distancia al planeta","Distance à la planète","البعد عن الكوكب"],
 probes:["Investigated by","যেসব মহাকাশযান পর্যবেক্ষণ করেছে","Estudiada por","Étudiée par","درستها"],moon_pos_note:["Moon positions in the 3D view are illustrative; orbital periods are real.","থ্রিডি দৃশ্যে উপগ্রহের অবস্থান প্রতীকী; প্রদক্ষিণ কাল প্রকৃত।","Las posiciones de las lunas en 3D son ilustrativas; los periodos son reales.","Les positions des lunes en 3D sont illustratives ; les périodes sont réelles.","مواقع الأقمار في العرض ثلاثي الأبعاد توضيحية؛ الفترات المدارية حقيقية."],
 o_successful:["Successful","সফল","Exitosa","Réussie","ناجحة"],o_partial:["Partially successful","আংশিক সফল","Parcialmente exitosa","Partiellement réussie","ناجحة جزئيًا"],o_failed:["Failed","ব্যর্থ","Fallida","Échec","فاشلة"],o_ongoing:["Ongoing","চলমান","En curso","En cours","جارية"],o_planned:["Planned","পরিকল্পিত","Planificada","Prévue","مخطط لها"],
 all:["All","সব","Todas","Toutes","الكل"],destination:["Destination","গন্তব্য","Destino","Destination","الوجهة"],outcome:["Outcome","ফলাফল","Resultado","Résultat","النتيجة"],agency:["Agency","সংস্থা","Agencia","Agence","الوكالة"],decade:["Decade","দশক","Década","Décennie","العقد"],
 search:["Search missions…","অভিযান খুঁজুন…","Buscar misiones…","Rechercher…","ابحث في المهمات…"],launch:["Launch","উৎক্ষেপণ","Lanzamiento","Lancement","الإطلاق"],arrival:["Arrival","পৌঁছানো","Llegada","Arrivée","الوصول"],
 objective:["Objective","উদ্দেশ্য","Objetivo","Objectif","الهدف"],tech:["Instruments and technology","যন্ত্র ও প্রযুক্তি","Instrumentos y tecnología","Instruments et technologies","الأجهزة والتقنية"],disc:["Discoveries","আবিষ্কার","Descubrimientos","Découvertes","الاكتشافات"],
 duration:["Duration","মেয়াদ","Duración","Durée","المدة"],why_failed:["What went wrong","কী ভুল হয়েছিল","Qué falló","Ce qui a échoué","ما الذي حدث"],significance:["Significance","তাৎপর্য","Importancia","Importance","الأهمية"],
 source:["Official source","দাপ্তরিক সূত্র","Fuente oficial","Source officielle","المصدر الرسمي"],archive_page:["Full story in the archive","আর্কাইভে পূর্ণ কাহিনি","Historia completa en el archivo","Histoire complète dans l’archive","القصة الكاملة في الأرشيف"],
 no_photo:["No verified photograph in this archive","এই আর্কাইভে যাচাইকৃত ছবি নেই","Sin fotografía verificada en el archivo","Aucune photo vérifiée dans l’archive","لا توجد صورة موثقة في الأرشيف"],
 n_missions:["{n} missions","{n}টি অভিযান","{n} misiones","{n} missions","{n} مهمة"],firsts:["Milestones only","শুধু মাইলফলক","Solo hitos","Jalons seulement","المعالم فقط"],
 tl_pick:["Select a year to see its missions.","একটি বছর বেছে নিন।","Elige un año para ver sus misiones.","Choisissez une année.","اختر سنة لرؤية مهماتها."],
 cmp_pick:["Choose two or more bodies to compare.","তুলনার জন্য দুই বা ততোধিক বস্তু বেছে নিন।","Elige dos o más cuerpos.","Choisissez deux astres ou plus.","اختر جرمين أو أكثر للمقارنة."],
 cmp_visual:["Size to scale","প্রকৃত আকারে","Tamaño a escala","Taille à l’échelle","الحجم بالمقياس"],log_note:["Bars use a logarithmic scale where values differ by many orders of magnitude.","যেখানে মানের পার্থক্য বিশাল, সেখানে বার লগারিদমিক স্কেলে।","Las barras usan escala logarítmica cuando los valores difieren mucho.","Barres en échelle logarithmique quand les écarts sont immenses.","تستخدم الأشرطة مقياسًا لوغاريتميًا عندما تتفاوت القيم كثيرًا."],
 from:["From","থেকে","Desde","Depuis","من"],to:["To","পর্যন্ত","Hasta","Vers","إلى"],go:["Begin journey","যাত্রা শুরু","Iniciar viaje","Commencer le voyage","ابدأ الرحلة"],
 j_note:["This is a visual camera flight, not a spacecraft trajectory. Real missions follow curved transfer orbits and take months to years — for example, about 7 months to Mars and about 12 years for Voyager 2 to reach Neptune.","এটি ক্যামেরার দৃশ্যমান যাত্রা, মহাকাশযানের পথ নয়। প্রকৃত অভিযান বাঁকা কক্ষপথে মাস থেকে বছর লাগে — যেমন মঙ্গলে প্রায় ৭ মাস, ভয়েজার-২ এর নেপচুনে প্রায় ১২ বছর।","Es un vuelo de cámara, no una trayectoria real. Las misiones siguen órbitas de transferencia y tardan meses o años: unos 7 meses a Marte y unos 12 años la Voyager 2 hasta Neptuno.","Ceci est un vol de caméra, pas une trajectoire réelle. Les missions suivent des orbites de transfert et durent des mois ou des années : environ 7 mois vers Mars, environ 12 ans pour Voyager 2 jusqu’à Neptune.","هذه رحلة كاميرا بصرية وليست مسار مركبة. تتبع المهمات الحقيقية مدارات انتقالية وتستغرق شهورًا إلى سنوات — نحو 7 أشهر إلى المريخ ونحو 12 عامًا لفوياجر 2 إلى نبتون."],
 straight:["Straight-line distance today","আজকের সরলরেখা দূরত্ব","Distancia en línea recta hoy","Distance en ligne droite aujourd’hui","المسافة المستقيمة اليوم"],
 date:["Date","তারিখ","Fecha","Date","التاريخ"],now:["Now","এখন","Ahora","Maintenant","الآن"],speed:["Time speed","সময়ের গতি","Velocidad del tiempo","Vitesse du temps","سرعة الزمن"],
 rendering:["Scientific rendering","বৈজ্ঞানিক রেন্ডারিং","Representación científica","Rendu scientifique","تصوير علمي"],texture_src:["3D surface source","থ্রিডি পৃষ্ঠের উৎস","Origen de la superficie 3D","Source de la surface 3D","مصدر سطح النموذج"],
 belts:["Asteroid Belt and Kuiper Belt particles show the regions, not individual objects.","গ্রহাণু বলয় ও কাইপার বলয়ের কণাগুলো অঞ্চল দেখায়, আলাদা বস্তু নয়।","Las partículas del cinturón de asteroides y de Kuiper muestran regiones, no objetos reales.","Les particules des ceintures montrent des régions, pas des objets réels.","تُظهر جزيئات حزامي الكويكبات وكايبر المناطق، لا أجسامًا فعلية."],
 nogl:["3D graphics are not available on this device, so the explorer is shown as information panels.","এই ডিভাইসে থ্রিডি গ্রাফিক্স নেই, তাই তথ্য প্যানেল দেখানো হচ্ছে।","Este dispositivo no admite gráficos 3D; se muestran paneles de información.","La 3D n’est pas disponible sur cet appareil ; l’explorateur s’affiche en panneaux.","الرسومات ثلاثية الأبعاد غير متاحة على هذا الجهاز، لذا يُعرض المستكشف كلوحات معلومات."],
 loading:["Loading planetary maps…","গ্রহের মানচিত্র লোড হচ্ছে…","Cargando mapas planetarios…","Chargement des cartes…","جارٍ تحميل خرائط الكواكب…"],
 help:["Drag to rotate · scroll or pinch to zoom · right-drag or two fingers to pan · 0–9 jump to a body · Esc returns to overview","ঘোরাতে টানুন · জুম করতে স্ক্রল/পিঞ্চ · সরাতে ডান-টান · ০–৯ বস্তুতে যান · Esc সারসংক্ষেপ","Arrastra para girar · rueda o pellizco para zoom · arrastre derecho para desplazar · 0–9 saltar · Esc vista general","Glisser pour tourner · molette ou pincement pour zoomer · clic droit pour déplacer · 0–9 aller à un astre · Échap vue d’ensemble","اسحب للتدوير · مرّر أو اقرص للتكبير · اسحب بالزر الأيمن للتحريك · 0–9 للانتقال · Esc للعودة"]
};
const L = () => ["en","bn","es","fr","ar"].indexOf(S.ctx.lang());
const tr = (k, v) => { const r = TT[k]; let s = r ? (r[L()] || r[0]) : (S.ctx.t(k)); if (v) for (const x in v) s = s.replace("{" + x + "}", v[x]); return s; };
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmtN = (n, d = 0) => { try { return new Intl.NumberFormat(S.ctx.locale(), {maximumFractionDigits:d}).format(n); } catch (e) { return String(n); } };
const B = id => window.SS_BODIES.find(b => b.id === id);
const bname = id => PLANETS.includes(id) || id === "sun" ? S.ctx.t("de_" + id) : B(id).name;
const skey = l => /^\d/.test(l) ? l : "9999";
const moonsOf = id => window.SS_MOONS[id] || [];
const findMoon = id => { for (const p in window.SS_MOONS) { const m = window.SS_MOONS[p].find(x => x.id === id); if (m) return [m, p]; } return [null, null]; };
function imgInfo(k) {
  if (!k) return null;
  const s = window.SS_MEDIA[k]; if (s && !s.isMap) return {src:s.path, t:s.path.replace("ss/img/","ss/img/t/"), m:s};
  const m = window.FE_MEDIA[k]; if (m) return {src:"img/" + k + ".webp", t:"img/t/" + k + ".webp", m};
  return null;
}
const credit = m => ["NASA", m.center && m.center !== "HQ" ? m.center : null].filter(Boolean).join(" / ") + (m.photographer ? " — " + m.photographer : "");
function photo(k, alt, cls = "") {
  const i = imgInfo(k); if (!i) return "";
  const concept = /artist|illustration|concept/i.test(i.m.title);
  return `<figure class="ss-photo ${cls}"><img src="${i.t}" alt="${esc(alt || i.m.title)}" loading="lazy" data-full="${i.src}"><figcaption>${concept ? "<b>" + esc(S.ctx.t("artist_concept")) + "</b> · " : ""}${esc(i.m.title)} · <a href="${esc(i.m.page)}" target="_blank" rel="noopener">${esc(i.m.id)}</a> · ${esc(credit(i.m))}</figcaption></figure>`;
}
const OUT = {successful:"#65B98A", partial:"#D9A35B", failed:"#D2665A", ongoing:"#5599D5", planned:"#9AA9BA"};
const opill = r => `<span class="ss-out ss-${r}"><i></i>${esc(tr("o_" + r))}</span>`;
const missionUrl = m => m.cos ? "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=" + encodeURIComponent(m.cos) : m.url;
const missionImg = m => m.img || (m.page && window.FE_MISSIONS.find(x => "#m-" + x.id === m.page)?.img) || null;
const fmtDateL = d => S.ctx.fmtDate(d);

/* ───────────── START ───────────── */
function start(host, ctx) {
  S = {ctx, host, running:true, mode:"explore", sel:null, selMoon:null, simDate:new Date(), speed:0, follow:null, objs:{}, labels:{}, anim:null, intro:null, music:null, sheet:null};
  host.innerHTML = `<div class="ss-wrap">
   <div class="ss-load" id="ss-load"><span class="mono">${esc(tr("loading"))}</span><div class="bar"><i id="ss-bar"></i></div></div>
   <div class="ss-labels" id="ss-labels" aria-hidden="true"></div>
   <header class="ss-top">
     <a class="brand" href="#home"><b>FORGOTTEN EXPLORERS</b><span>${esc(tr("title").toUpperCase())}</span></a>
     <div class="ss-modes" role="group" aria-label="${esc(tr("ss_viewmode"))}">${["explore","scale","distance"].map(m => `<button data-mode="${m}" aria-pressed="${m === "explore"}">${esc(tr("m_" + m))}</button>`).join("")}</div>
     <nav class="ss-tools">
       <button data-sheet="moons">${esc(tr("moons"))}</button><button data-sheet="missions">${esc(tr("missions"))}</button><button data-sheet="timeline">${esc(tr("timeline"))}</button><button data-sheet="compare">${esc(tr("compare"))}</button><button data-sheet="journey">${esc(tr("journey"))}</button>
       <button class="ss-music" data-music aria-expanded="false" aria-label="${esc(tr("music"))}">♪ <span>${esc(tr("music"))}</span></button>
       <button class="ss-exit" data-exit>✕ <span>${esc(tr("exit"))}</span></button>
     </nav>
   </header>
   <div class="ss-musicpop" id="ss-musicpop" hidden><p>${esc(tr("music_note"))}</p><div class="btnrow"><button class="btn small primary" id="ss-mplay">▶ ${esc(tr("play"))}</button><button class="btn small" id="ss-mmute">${esc(tr("mute"))}</button></div></div>
   <nav class="ss-rail" aria-label="${esc(tr("bodies"))}"><button data-body="overview" class="ov">☉ ${esc(tr("overview"))}</button>${ALL.map((id, i) => `<button data-body="${id}"><kbd>${i}</kbd>${esc(bname(id))}</button>`).join("")}</nav>
   <aside class="ss-panel" id="ss-panel" hidden aria-live="polite"></aside>
   <div class="ss-bottom"><div class="ss-note" id="ss-note"></div>
     <div class="ss-time"><span class="mono" id="ss-date"></span><button data-speed="0" aria-pressed="true">❚❚</button><button data-speed="1">1 d/s</button><button data-speed="30">30 d/s</button><button data-speed="365">1 yr/s</button><button data-now>${esc(tr("now"))}</button></div></div>
   <div class="ss-tip" id="ss-tip" hidden></div>
   <div class="ss-sheet" id="ss-sheet" hidden></div>
   <div class="ss-introui" id="ss-introui" hidden><h2>${esc(tr("title").toUpperCase())}</h2><p>${esc(tr("intro_line"))}</p><div class="btnrow"><button class="btn" id="ss-skip">${esc(tr("skip"))}</button><button class="btn primary" id="ss-enter" hidden>${esc(tr("enter"))}</button></div></div>
   <p class="ss-help mono" id="ss-help">${esc(tr("help"))}</p>
  </div>`;
  bindUI();
  let ok = true;
  try { initGL(); } catch (e) { ok = false; console.warn('Solar 3D unavailable:', e && e.message); }
  if (!ok) { fallback(); return; }
  setMode("explore");
  const seen = ctx.store.get("ssIntroSeen");
  if (!seen && !ctx.reduced) runIntro(); else overview(true);
  loop();
}
function fallback() {
  S.nogl = true;
  S.host.querySelector("#ss-load")?.remove();
  const p = document.createElement("div"); p.className = "ss-nogl";
  p.innerHTML = `<p>${esc(tr("nogl"))}</p><div class="ss-grid">${ALL.map(id => { const b = B(id); return `<button data-body="${id}">${b.img ? photo(b.img, b.name) : ""}<b>${esc(b.name)}</b></button>`; }).join("")}</div>`;
  S.host.querySelector(".ss-wrap").appendChild(p);
  S.host.querySelector(".ss-modes").hidden = true;
  S.host.querySelector(".ss-time").hidden = true;
}

/* ───────────── THREE SCENE ───────────── */
function initGL() {
  const r = new THREE.WebGLRenderer({antialias:true, logarithmicDepthBuffer:true, powerPreference:"high-performance"});
  if (!r.getContext()) throw new Error("no webgl");
  r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  r.outputEncoding = THREE.sRGBEncoding; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.1;
  S.host.querySelector(".ss-wrap").prepend(r.domElement);
  r.domElement.className = "ss-canvas"; r.domElement.tabIndex = 0; r.domElement.setAttribute("aria-label", S.ctx.t("nav_solar_short"));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x020308);
  const cam = new THREE.PerspectiveCamera(50, 1, 0.0005, 5e6);
  const ctl = new THREE.OrbitControls(cam, r.domElement);
  ctl.enableDamping = true; ctl.dampingFactor = 0.08; ctl.rotateSpeed = 0.6; ctl.zoomSpeed = 1.1; ctl.screenSpacePanning = true; ctl.minDistance = 0.0002; ctl.maxDistance = 2e5;
  ctl.listenToKeyEvents?.(window);
  Object.assign(S, {r, scene, cam, ctl, tl:new THREE.TextureLoader(), clock:new THREE.Clock()});
  scene.add(new THREE.AmbientLight(0x8899aa, 0.12));
  const sunLight = new THREE.PointLight(0xfff2dd, 2.2, 0, 0); scene.add(sunLight); S.sunLight = sunLight;
  stars(); buildSun(); PLANETS.concat(["pluto"]).forEach(buildPlanet); buildBelts(); buildDistanceRings();
  const ro = new ResizeObserver(() => { const w = S.host.clientWidth, h = S.host.clientHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); });
  ro.observe(S.host); S.ro = ro;
  // picking
  const ray = new THREE.Raycaster(), v2 = new THREE.Vector2(); let down = null;
  r.domElement.addEventListener("pointerdown", e => down = [e.clientX, e.clientY]);
  r.domElement.addEventListener("pointerup", e => { if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return; const id = pick(e); if (id) selectAny(id); });
  r.domElement.addEventListener("pointermove", e => { if (e.pointerType !== "mouse") return; const id = pick(e); const tip = S.host.querySelector("#ss-tip");
    if (id) { tip.hidden = false; tip.style.left = e.clientX + 14 + "px"; tip.style.top = e.clientY + 10 + "px"; tip.innerHTML = tipHtml(id); r.domElement.style.cursor = "pointer"; } else { tip.hidden = true; r.domElement.style.cursor = ""; } });
  function pick(e) {
    const b = r.domElement.getBoundingClientRect(); v2.set((e.clientX - b.left) / b.width * 2 - 1, -(e.clientY - b.top) / b.height * 2 + 1);
    ray.setFromCamera(v2, cam); const hits = ray.intersectObjects(S.pickables, false).filter(h => h.object.visible);
    return hits[0]?.object.userData.id || null;
  }
  S.pickables = Object.values(S.objs).map(o => o.mesh).filter(Boolean);
  loadTextures();
}
function stars() {
  const g = new THREE.BufferGeometry(), p = [], c = [];
  for (let i = 0; i < 9000; i++) {
    const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, rr = 4e5;
    p.push(rr * Math.sqrt(1 - u * u) * Math.cos(th), rr * u, rr * Math.sqrt(1 - u * u) * Math.sin(th));
    const k = 0.55 + Math.random() * 0.45, tint = Math.random(); c.push(k * (tint > .85 ? 1 : .85), k * .9, k * (tint < .15 ? .8 : 1));
  }
  g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3)); g.setAttribute("color", new THREE.Float32BufferAttribute(c, 3));
  S.stars = new THREE.Points(g, new THREE.PointsMaterial({size:1.3, sizeAttenuation:false, vertexColors:true, transparent:true, opacity:.9, depthWrite:false}));
  S.scene.add(S.stars);
  // faint Milky-Way-like band of dust (decorative, labelled nowhere as data)
  const g2 = new THREE.BufferGeometry(), p2 = [];
  for (let i = 0; i < 5000; i++) { const th = Math.random() * Math.PI * 2, y = (Math.random() + Math.random() - 1) * 0.18, rr = 3.9e5; p2.push(rr * Math.cos(th), rr * y + rr * 0.35 * Math.sin(th), rr * Math.sin(th)); }
  g2.setAttribute("position", new THREE.Float32BufferAttribute(p2, 3));
  S.dust = new THREE.Points(g2, new THREE.PointsMaterial({size:1, sizeAttenuation:false, color:0x8090b0, transparent:true, opacity:.35, depthWrite:false})); S.scene.add(S.dust);
}
/* Sun: animated granulation shader + corona sprite */
function buildSun() {
  const mat = new THREE.ShaderMaterial({uniforms:{t:{value:0}}, vertexShader:`#include <common>
   #include <logdepthbuf_pars_vertex>
   varying vec3 vN; varying vec3 vP; void main(){ vN=normalize(normalMatrix*normal); vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
   #include <logdepthbuf_vertex>
   }`,
   fragmentShader:`#include <logdepthbuf_pars_fragment>
   uniform float t; varying vec3 vN; varying vec3 vP;
   float h(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
   float n(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
    return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}
   void main(){
   #include <logdepthbuf_fragment>
   vec3 p=normalize(vP)*6.0; float g=n(p*3.0+t*.15)*.5+n(p*7.0-t*.25)*.3+n(p*15.0+t*.4)*.2;
    float limb=pow(max(dot(vN,vec3(0,0,1)),0.0),.45);
    vec3 col=mix(vec3(1.0,.42,.08),vec3(1.0,.86,.55),g)*(.55+.6*limb);
    gl_FragColor=vec4(col*1.25,1.0);}`});
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), mat); mesh.userData.id = "sun";
  const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d");
  const gr = g.createRadialGradient(128, 128, 20, 128, 128, 128); gr.addColorStop(0, "rgba(255,220,160,.85)"); gr.addColorStop(.25, "rgba(255,170,80,.35)"); gr.addColorStop(.6, "rgba(255,120,40,.08)"); gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c), blending:THREE.AdditiveBlending, depthWrite:false, transparent:true}));
  const grp = new THREE.Group(); grp.add(mesh); grp.add(glow); S.scene.add(grp);
  S.objs.sun = {id:"sun", grp, mesh, glow, mat, body:B("sun")};
  makeLabel("sun", bname("sun"), "star");
}
function bodyRadiusScene(id, mode) {
  const b = B(id); const km = b.diameter / 2;
  if (mode === "explore") return id === "sun" ? 4.2 : 0.32 + 0.95 * Math.log10(1 + b.diameter / 2000);
  return km / 1e6; // true scale (1 unit = 1e6 km)
}
function distMap(au, mode) { return mode === "explore" ? 12 * Math.pow(au, 0.55) : au * AU_KM / 1e6; }
function buildPlanet(id) {
  const b = B(id);
  const mat = new THREE.MeshStandardMaterial({color:b.tex ? 0xffffff : b.color, roughness:1, metalness:0});
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), mat); mesh.userData.id = id;
  const spin = new THREE.Group(); spin.add(mesh);
  const tiltG = new THREE.Group(); tiltG.rotation.z = THREE.MathUtils.degToRad(Math.min(b.tilt || 0, 180)) * (b.tilt > 90 ? -1 : 1) * (b.tilt > 90 ? (180 - b.tilt) / b.tilt : 1);
  tiltG.rotation.z = THREE.MathUtils.degToRad(b.tilt || 0);
  tiltG.add(spin);
  const grp = new THREE.Group(); grp.add(tiltG); S.scene.add(grp);
  const o = {id, grp, tiltG, spin, mesh, mat, body:b, moons:[]};
  if (!b.tex) { mat.map = procTexture(id); mat.color.set(0xffffff); }
  if (id === "earth") { o.atmo = atmosphere(0x6fa8ff, 1.035); spin.add(o.atmo); }
  if (id === "venus") { o.atmo = atmosphere(0xffe3a8, 1.03); spin.add(o.atmo); }
  if (b.rings) o.rings = ringsFor(id, tiltG);
  // orbit line
  const geo = new THREE.BufferGeometry(); const line = new THREE.Line(geo, new THREE.LineBasicMaterial({color:id === "pluto" ? 0x8a7f99 : 0x5599d5, transparent:true, opacity:.32, depthWrite:false}));
  S.scene.add(line); o.orbit = line;
  // marker (distance / scale modes)
  const mk = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0], 3)), new THREE.PointsMaterial({size:7, sizeAttenuation:false, color:b.color, transparent:true, depthWrite:false}));
  grp.add(mk); o.marker = mk;
  S.objs[id] = o;
  makeLabel(id, bname(id), b.kind === "Dwarf planet" ? "dwarf" : "planet");
  // moons
  moonsOf(id).forEach((m, i) => {
    const mm = new THREE.MeshStandardMaterial({color:m.tex ? 0xffffff : m.color, roughness:1, metalness:0});
    if (!m.tex) mm.map = moonTexture(m);
    const me = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), mm); me.userData.id = m.id; me.userData.moonOf = id;
    const pivot = new THREE.Group(); grp.add(pivot); pivot.add(me);
    const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([...Array(96)].map((_, k) => new THREE.Vector3(Math.cos(k / 96 * Math.PI * 2), 0, Math.sin(k / 96 * Math.PI * 2)))), new THREE.LineBasicMaterial({color:0x9aa9ba, transparent:true, opacity:.18, depthWrite:false}));
    grp.add(ring);
    const phase = [...m.id].reduce((a, c) => a + c.charCodeAt(0), 0) % 628 / 100;
    const P = parseFloat(m.P), retro = /R/.test(m.P) ? -1 : 1;
    const moon = {id:m.id, data:m, parent:id, mesh:me, pivot, ring, mat:mm, phase, P, retro};
    o.moons.push(moon); S.objs[m.id] = moon;
    makeLabel(m.id, m.name.replace("The ", ""), "moon", id);
  });
}
function atmosphere(color, scale) {
  const m = new THREE.ShaderMaterial({uniforms:{c:{value:new THREE.Color(color)}}, transparent:true, depthWrite:false, side:THREE.BackSide, blending:THREE.AdditiveBlending,
    vertexShader:`#include <common>
    #include <logdepthbuf_pars_vertex>
    varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
    #include <logdepthbuf_vertex>
    }`,
    fragmentShader:`#include <logdepthbuf_pars_fragment>
    uniform vec3 c; varying vec3 vN; void main(){
    #include <logdepthbuf_fragment>
    float i=pow(0.72-dot(vN,vec3(0,0,1.0)),3.0); gl_FragColor=vec4(c,1.0)*i; }`});
  const me = new THREE.Mesh(new THREE.SphereGeometry(scale, 48, 32), m); return me;
}
/* Ring systems — radii in planet radii from NSSDCA ring fact sheets (approximate edges) */
function ringsFor(id, parent) {
  const spec = {saturn:[1.11, 2.33, saturnRingTex], uranus:[1.64, 2.0, faintRing("rgba(170,180,190,", [[.0,.2],[.55,.15],[.92,.5]])], neptune:[1.69, 2.54, faintRing("rgba(160,170,190,", [[.0,.12],[.3,.1],[.98,.35]])], jupiter:[1.4, 1.81, faintRing("rgba(200,170,140,", [[.7,.12],[.95,.25]])]}[id];
  const [ri, ro, texFn] = spec;
  const geo = new THREE.RingGeometry(ri, ro, 160, 1);
  const pos = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) { const r = Math.hypot(pos.getX(i), pos.getY(i)); uv.setXY(i, (r - ri) / (ro - ri), 0.5); }
  const mat = new THREE.MeshBasicMaterial({map:typeof texFn === "function" ? texFn() : texFn, transparent:true, side:THREE.DoubleSide, depthWrite:false, opacity:id === "saturn" ? .95 : .6});
  const mesh = new THREE.Mesh(geo, mat); mesh.rotation.x = -Math.PI / 2; parent.add(mesh); return mesh;
}
function saturnRingTex() {
  const c = document.createElement("canvas"); c.width = 1024; c.height = 4; const g = c.getContext("2d");
  const R = 60268, ri = 1.11 * R, ro = 2.33 * R, x = km => (km - ri) / (ro - ri) * 1024;
  const band = (a, b, col, al) => { g.fillStyle = `rgba(${col},${al})`; g.fillRect(x(a), 0, Math.max(1, x(b) - x(a)), 4); };
  band(66900, 74500, "160,150,135", .05);            // D ring
  for (let k = 74658; k < 92000; k += 600) band(k, k + 600, "170,155,135", .18 + .1 * Math.sin(k / 1300)); // C ring
  for (let k = 92000; k < 117580; k += 400) band(k, k + 400, "222,205,170", .75 + .2 * Math.sin(k / 900));  // B ring
  band(117580, 122170, "120,110,100", .06);         // Cassini Division
  for (let k = 122170; k < 136775; k += 400) band(k, k + 400, "205,190,160", .55 + .12 * Math.sin(k / 700)); // A ring
  band(133423, 133748, "0,0,0", 0); g.clearRect(x(133423), 0, x(133748) - x(133423), 4); // Encke Gap
  band(140180, 140500, "220,210,190", .55);          // F ring
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
}
function faintRing(rgb, stops) {
  return () => { const c = document.createElement("canvas"); c.width = 512; c.height = 4; const g = c.getContext("2d");
    stops.forEach(([p, a]) => { g.fillStyle = rgb + a + ")"; g.fillRect(p * 512, 0, 6, 4); }); g.fillStyle = rgb + "0.04)"; g.fillRect(0, 0, 512, 4);
    return new THREE.CanvasTexture(c); };
}
/* Procedural textures for bodies with no global colour map (labelled as renderings in the UI) */
function rnd(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
function procTexture(id) {
  const c = document.createElement("canvas"); c.width = 1024; c.height = 512; const g = c.getContext("2d"); const R = rnd(id.length * 7919);
  const bands = {saturn:["#e5d6ae","#d8c394","#cdb07e","#e8dcbc","#c6a777","#dccaa0","#bfa074","#e3d4ad"], uranus:["#a9dde3","#a2d6dd","#9ccfd8","#a6dadf"], neptune:["#4a7ae0","#3f6ccf","#5584e6","#3a64c2","#4d7ddf"]}[id] || ["#999"];
  let y = 0; while (y < 512) { const h = 8 + R() * (id === "saturn" ? 30 : 60); g.fillStyle = bands[Math.floor(R() * bands.length)]; g.fillRect(0, y, 1024, h + 1); y += h; }
  g.globalAlpha = .12; for (let i = 0; i < 400; i++) { g.fillStyle = R() > .5 ? "#fff" : "#000"; g.fillRect(R() * 1024, R() * 512, 40 + R() * 200, 1 + R() * 2); } g.globalAlpha = 1;
  if (id === "saturn") { g.fillStyle = "rgba(170,160,120,.35)"; g.fillRect(0, 0, 1024, 40); }
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
}
function moonTexture(m) {
  const c = document.createElement("canvas"); c.width = 256; c.height = 128; const g = c.getContext("2d"); const R = rnd(m.id.length * 104729 + m.d | 0);
  const col = new THREE.Color(m.color); g.fillStyle = "#" + col.getHexString(); g.fillRect(0, 0, 256, 128);
  for (let i = 0; i < 260; i++) { const k = .75 + R() * .5; g.fillStyle = `rgba(${col.r * 255 * k | 0},${col.g * 255 * k | 0},${col.b * 255 * k | 0},.6)`; g.beginPath(); g.arc(R() * 256, R() * 128, 1 + R() * 9, 0, 7); g.fill(); }
  if (m.id === "europa") { g.strokeStyle = "rgba(150,80,50,.55)"; for (let i = 0; i < 40; i++) { g.beginPath(); g.moveTo(R() * 256, R() * 128); g.bezierCurveTo(R() * 256, R() * 128, R() * 256, R() * 128, R() * 256, R() * 128); g.stroke(); } }
  if (m.id === "io") { for (let i = 0; i < 70; i++) { g.fillStyle = ["rgba(40,30,20,.7)", "rgba(220,90,30,.6)", "rgba(250,240,170,.6)"][i % 3]; g.beginPath(); g.arc(R() * 256, R() * 128, 1 + R() * 4, 0, 7); g.fill(); } }
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
}
function loadTextures() {
  const list = [];
  ALL.forEach(id => { const b = B(id); if (b.tex) list.push([S.objs[id].mat, "ss/tex/" + b.tex + ".jpg"]); });
  Object.values(window.SS_MOONS).flat().forEach(m => { if (m.tex) list.push([S.objs[m.id].mat, "ss/tex/" + m.tex + ".jpg"]); });
  let done = 0; const bar = S.host.querySelector("#ss-bar");
  const fin = () => { done++; if (bar) bar.style.width = (done / list.length * 100) + "%"; if (done >= list.length) S.host.querySelector("#ss-load")?.remove(); };
  list.forEach(([mat, url]) => S.tl.load(url, t => { t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; mat.map = t; mat.color.set(0xffffff); mat.needsUpdate = true; fin(); }, undefined, fin));
  if (!list.length) fin();
}
function buildBelts() {
  const mk = (n, a0, a1, h, col) => { const g = new THREE.BufferGeometry(); const au = new Float32Array(n * 4); for (let i = 0; i < n; i++) { au[i * 4] = a0 + Math.random() * (a1 - a0); au[i * 4 + 1] = Math.random() * Math.PI * 2; au[i * 4 + 2] = (Math.random() - .5) * h; au[i * 4 + 3] = 0; }
    g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3)); const p = new THREE.Points(g, new THREE.PointsMaterial({size:1.6, sizeAttenuation:false, color:col, transparent:true, opacity:.55, depthWrite:false})); p.userData.au = au; S.scene.add(p); return p; };
  S.belt = mk(4500, 2.1, 3.3, .25, 0x9c8f7a); S.kuiper = mk(6000, 30, 50, 6, 0x7b8ea8);
}
function buildDistanceRings() {
  S.dRings = new THREE.Group(); S.scene.add(S.dRings); S.dLabels = [];
  [1, 5, 10, 20, 30, 40].forEach(au => {
    const r = au * AU_KM / 1e6; const l = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([...Array(256)].map((_, k) => new THREE.Vector3(Math.cos(k / 256 * Math.PI * 2) * r, 0, Math.sin(k / 256 * Math.PI * 2) * r))), new THREE.LineDashedMaterial({color:0x9aa9ba, dashSize:r * .02, gapSize:r * .02, transparent:true, opacity:.35}));
    l.computeLineDistances(); S.dRings.add(l);
    const lm = au * AU_KM / 299792.458 / 60; const txt = `${au} AU · ${lm < 60 ? fmtN(lm, 1) + " light-min" : fmtN(lm / 60, 1) + " light-h"}`;
    makeLabel("ring" + au, txt, "ring"); S.dLabels.push(["ring" + au, new THREE.Vector3(r * .7071, 0, r * .7071)]);
  });
}
/* ───────────── LABELS ───────────── */
function makeLabel(id, text, kind, parent) {
  const el = document.createElement("button"); el.className = "ss-label " + kind; el.textContent = text; el.dataset.id = id; if (parent) el.dataset.parent = parent;
  if (kind !== "ring") el.addEventListener("click", () => selectAny(id)); else el.tabIndex = -1;
  S.host.querySelector("#ss-labels").appendChild(el); S.labels[id] = el;
}
function updateLabels() {
  const w = S.host.clientWidth, h = S.host.clientHeight, v = new THREE.Vector3();
  const camPos = S.cam.position;
  for (const id in S.labels) {
    const el = S.labels[id]; let wp;
    if (id.startsWith("ring")) { const r = S.dLabels.find(x => x[0] === id); if (S.mode !== "distance") { el.hidden = true; continue; } wp = r[1]; }
    else { const o = S.objs[id]; if (!o) continue; wp = (o.mesh || o.grp).getWorldPosition(v.clone()); }
    if (el.dataset.parent) { // moon labels: only near the parent planet
      const p = S.objs[el.dataset.parent].grp.position; const dist = camPos.distanceTo(p); const pr = S.objs[el.dataset.parent].radius;
      if (dist > pr * (S.mode === "explore" ? 14 : 400) || S.mode === "distance") { el.hidden = true; continue; }
    }
    const p = wp.clone().project(S.cam);
    if (p.z > 1 || p.z < -1 || Math.abs(p.x) > 1.1 || Math.abs(p.y) > 1.1) { el.hidden = true; continue; }
    el.hidden = false; el.style.transform = `translate(${(p.x * .5 + .5) * w}px,${(-p.y * .5 + .5) * h}px)`;
    el.classList.toggle("on", S.sel === id || S.selMoon === id);
  }
}
/* ───────────── MODES, POSITIONS ───────────── */
function setMode(mode) {
  S.mode = mode;
  S.host.querySelectorAll("[data-mode]").forEach(b => b.setAttribute("aria-pressed", b.dataset.mode === mode));
  S.host.querySelector("#ss-note").innerHTML = `<b>${esc(tr("m_" + mode))}.</b> ${esc(tr("note_" + mode))} <span class="ss-belt">${esc(tr("belts"))}</span>`;
  if (S.nogl) return;
  const sun = S.objs.sun, sr = bodyRadiusScene("sun", mode);
  sun.mesh.scale.setScalar(sr); sun.glow.scale.setScalar(mode === "explore" ? sr * 5 : mode === "scale" ? sr * 8 : 60);
  sun.mesh.visible = true;
  for (const id of PLANETS.concat(["pluto"])) {
    const o = S.objs[id]; const r = bodyRadiusScene(id, mode); o.radius = r;
    o.mesh.scale.setScalar(r); if (o.atmo) o.atmo.scale.setScalar(r); if (o.rings) o.rings.scale.setScalar(r);
    o.mesh.visible = mode !== "distance"; if (o.rings) o.rings.visible = mode !== "distance"; if (o.atmo) o.atmo.visible = mode !== "distance";
    o.marker.material.size = mode === "explore" ? 0 : mode === "scale" ? 4 : 8; o.marker.visible = mode !== "explore";
    const pts = window.SS_EPHEM.orbitPoints(id, S.simDate, 360).map(([x, y, z]) => mapVec(x, y, z, mode));
    o.orbit.geometry.setFromPoints(pts);
    o.moons.forEach(m => {
      const d = m.data, pr = B(id).diameter / 2;
      const a = mode === "explore" ? r * (1.3 + 0.8 * Math.log10(d.a / pr)) : d.a / 1e6;
      const mr = mode === "explore" ? Math.max(.07, .26 + .7 * Math.log10(1 + (d.d || 20) / 2000)) * .55 : (d.d || 20) / 2 / 1e6;
      m.orbitR = a; m.mesh.scale.setScalar(mr); m.mesh.position.set(a, 0, 0);
      m.ring.scale.setScalar(a); m.ring.visible = mode !== "distance"; m.mesh.visible = mode !== "distance";
    });
  }
  S.dRings.visible = mode === "distance";
  [S.belt, S.kuiper].forEach(p => { const au = p.userData.au, pos = p.geometry.attributes.position; for (let i = 0; i < au.length / 4; i++) { const a = au[i * 4], th = au[i * 4 + 1], z = au[i * 4 + 2]; const v = mapVec(a * Math.cos(th), a * Math.sin(th), z * .03 * a, mode); pos.setXYZ(i, v.x, v.y, v.z); } pos.needsUpdate = true; p.material.size = mode === "explore" ? 1.6 : 1.2; });
  updatePositions(0);
  if (S.sel) focusOn(S.selMoon || S.sel, true); else overview(true);
}
function mapVec(x, y, z, mode) { // ecliptic (x,y,z au) → scene (x, z-up→y)
  const r = Math.hypot(x, y, z) || 1e-9, k = distMap(r, mode) / r;
  return new THREE.Vector3(x * k, z * k, -y * k);
}
function updatePositions(dtDays) {
  if (S.nogl) return;
  S.simDate = new Date(S.simDate.getTime() + dtDays * 86400000);
  for (const id of PLANETS.concat(["pluto"])) {
    const o = S.objs[id], p = window.SS_EPHEM.pos(id, S.simDate); const v = mapVec(p.x, p.y, p.z, S.mode); o.grp.position.copy(v);
    const b = o.body, rotH = Math.abs(b.rot) || 24; o.spin.rotation.y += (dtDays * 24 / rotH) * Math.PI * 2 * Math.sign(b.rot || 1) + (S.focusSpin === id ? 0.0015 : 0);
    const days = (S.simDate.getTime() - Date.UTC(2000, 0, 1)) / 86400000;
    o.moons.forEach(m => { const ang = m.phase + m.retro * days / (m.P || 1) * Math.PI * 2; m.mesh.position.set(Math.cos(ang) * m.orbitR, 0, Math.sin(ang) * m.orbitR); m.mesh.rotation.y = -ang; });
  }
  const dl = S.host.querySelector("#ss-date"); if (dl) dl.textContent = new Intl.DateTimeFormat(S.ctx.locale(), {dateStyle:"medium", timeStyle:"short", timeZone:"UTC"}).format(S.simDate) + " UTC";
}
/* ───────────── CAMERA ───────────── */
function animateCam(toPos, toTarget, dur = 1.6, after) {
  S.anim = {from:S.cam.position.clone(), fromT:S.ctl.target.clone(), toPos, toTarget, t0:performance.now(), dur:dur * 1000, after, arc:S.cam.position.distanceTo(toPos) * .18};
}
function overview(instant) {
  S.sel = null; S.selMoon = null; S.follow = null; S.focusSpin = null;
  const p = S.mode === "explore" ? new THREE.Vector3(0, 70, 118) : S.mode === "scale" ? new THREE.Vector3(0, 2600, 4200) : new THREE.Vector3(0, 5200, 7600);
  if (instant || S.nogl) { if (!S.nogl) { S.cam.position.copy(p); S.ctl.target.set(0, 0, 0); } }
  else animateCam(p, new THREE.Vector3(), 1.8);
  closePanel(); markRail(null);
}
function worldPos(id) { const o = S.objs[id]; if (!o) return new THREE.Vector3(); return (o.mesh && o.parent ? o.mesh : o.grp).getWorldPosition(new THREE.Vector3()); }
function focusOn(id, instant) {
  if (S.nogl) return;
  const o = S.objs[id]; const isMoon = !!o.parent;
  const r = isMoon ? o.mesh.scale.x : id === "sun" ? S.objs.sun.mesh.scale.x : o.radius;
  const d = S.mode === "distance" ? (id === "sun" ? 600 : 140) : Math.max(r * (id === "saturn" ? 7 : 4.2), 0.0004);
  const tgt = worldPos(id);
  let dir;
  if (id !== "sun" && S.mode !== "distance") { // view the sunlit side: from between the Sun and the body, rotated a little
    const toSun = tgt.clone().negate().setY(0).normalize(); const ang = 0.75; dir = new THREE.Vector3(toSun.x * Math.cos(ang) - toSun.z * Math.sin(ang), .32, toSun.x * Math.sin(ang) + toSun.z * Math.cos(ang)).normalize();
    if (!isFinite(dir.x)) dir = new THREE.Vector3(0, .35, 1).normalize();
  } else { dir = S.cam.position.clone().sub(tgt).normalize(); if (!isFinite(dir.x) || dir.length() < .5) dir.set(0, .35, 1).normalize(); dir.y = Math.max(dir.y, .18); dir.normalize(); }
  const pos = tgt.clone().add(dir.multiplyScalar(d));
  S.follow = id; S.focusSpin = isMoon ? null : id;
  if (instant) { S.cam.position.copy(pos); S.ctl.target.copy(tgt); } else animateCam(pos, tgt, 1.8);
}
function loop() {
  if (!S || !S.running) return;
  S.raf = requestAnimationFrame(loop);
  if (S.nogl) return;
  const dt = Math.min(.05, S.clock.getDelta());
  if (!S.intro) updatePositions(S.speed * dt);
  S.objs.sun.mat.uniforms.t.value += dt;
  if (S.anim) {
    const a = S.anim, k = Math.min(1, (performance.now() - a.t0) / a.dur), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    const toT = S.follow ? worldPos(S.follow) : a.toTarget;
    const toP = S.follow ? toT.clone().add(a.toPos.clone().sub(a.toTarget)) : a.toPos;
    S.cam.position.lerpVectors(a.from, toP, e); S.cam.position.y += Math.sin(e * Math.PI) * a.arc;
    S.ctl.target.lerpVectors(a.fromT, toT, e);
    if (k >= 1) { const f = a.after; S.anim = null; f && f(); }
  } else if (S.follow) {
    const tgt = worldPos(S.follow), delta = tgt.clone().sub(S.ctl.target); S.cam.position.add(delta); S.ctl.target.copy(tgt);
  }
  if (S.intro) S.intro.tick(dt);
  S.ctl.update(); updateLabels();
  S.r.render(S.scene, S.cam);
  if (S.journey) S.journey.tick();
}
/* ───────────── INTRO ───────────── */
function runIntro() {
  const ui = S.host.querySelector("#ss-introui"); ui.hidden = false;
  const items = [S.objs.sun, ...PLANETS.map(id => S.objs[id])];
  items.forEach(o => { o.grp.visible = false; if (o.orbit) o.orbit.material.opacity = 0; });
  S.belt.visible = S.kuiper.visible = false; S.objs.pluto.grp.visible = false; S.objs.pluto.orbit.visible = false;
  Object.values(S.labels).forEach(l => l.style.opacity = 0);
  S.cam.position.set(0, 260, 900); S.ctl.target.set(0, 0, 0); S.ctl.enabled = false;
  let t = 0; const T = 7;
  const end = () => {
    if (!S.intro) return; S.intro = null; S.ctl.enabled = true; S.ctx.store.set("ssIntroSeen", "1");
    items.forEach(o => { o.grp.visible = true; if (o.orbit) o.orbit.material.opacity = .32; o.grp.scale.setScalar(1); });
    S.objs.pluto.grp.visible = true; S.objs.pluto.orbit.visible = true; S.belt.visible = S.kuiper.visible = true;
    Object.values(S.labels).forEach(l => l.style.opacity = ""); ui.hidden = true; S.host.querySelector("#ss-help").classList.add("show");
    setTimeout(() => S && S.host.querySelector("#ss-help")?.classList.remove("show"), 7000);
  };
  S.intro = {tick(dt) {
    t += dt; const k = Math.min(1, t / T), e = 1 - Math.pow(1 - k, 3);
    S.cam.position.set(Math.sin(e * 1.2) * 40, 260 - 190 * e, 900 - 782 * e);
    const sk = Math.min(1, t / 1.6); S.objs.sun.grp.visible = true; S.objs.sun.grp.scale.setScalar(.01 + .99 * (1 - Math.pow(1 - sk, 3)));
    PLANETS.forEach((id, i) => { const st = 1.4 + i * .55; const o = S.objs[id]; if (t > st) { o.grp.visible = true; const q = Math.min(1, (t - st) / .6); o.grp.scale.setScalar(q); o.orbit.material.opacity = .32 * q; S.labels[id].style.opacity = q; } });
    if (t > 6) { S.belt.visible = S.kuiper.visible = true; S.objs.pluto.grp.visible = true; S.objs.pluto.orbit.visible = true; }
    if (t > T - 1.2) S.host.querySelector("#ss-enter").hidden = false;
    if (t > T + 4) end();
  }, end};
  S.host.querySelector("#ss-skip").onclick = end; S.host.querySelector("#ss-enter").onclick = end;
}
/* ───────────── SELECTION & PANEL ───────────── */
function markRail(id) { S.host.querySelectorAll(".ss-rail [data-body]").forEach(b => b.setAttribute("aria-current", b.dataset.body === id)); }
function selectAny(id) {
  if (S.intro) return;
  if (ALL.includes(id)) return selectBody(id);
  const [m, parent] = findMoon(id); if (m) return selectMoon(parent, id);
}
function selectBody(id, tab) {
  S.sel = id; S.selMoon = null; markRail(id);
  if (!S.nogl) focusOn(id);
  openPanel(id, tab || "over");
}
function selectMoon(parent, mid) {
  S.sel = parent; S.selMoon = mid; markRail(parent);
  if (!S.nogl) focusOn(mid);
  openMoonPanel(parent, mid);
}
function closePanel() { const p = S.host.querySelector("#ss-panel"); p.hidden = true; p.innerHTML = ""; }
function distNow(id) {
  const now = new Date(); const km = window.SS_EPHEM.distance("earth", id, now);
  const lt = km / 299792.458; const ltS = lt < 3600 ? fmtN(lt / 60, 1) + " min" : fmtN(lt / 3600, 2) + " h";
  return `<div class="ss-dist"><span class="mono">${esc(tr("now_dist"))}</span><b>${fmtN(km / 1e6, 2)} million km</b><span>${fmtN(km / AU_KM, 4)} au · ${esc(tr("light_time"))} ${ltS}</span>
    <small>${esc(tr("calc_at"))}: ${new Intl.DateTimeFormat(S.ctx.locale(), {dateStyle:"medium", timeStyle:"short", timeZone:"UTC"}).format(now)} UTC · ${esc(tr("eph_src"))} · <a href="${window.SS_SOURCES.elements}" target="_blank" rel="noopener">ssd.jpl.nasa.gov</a></small></div>`;
}
function texNote(b) {
  const k = b.tex ? b.tex + "_map" : null; const m = k && window.SS_MEDIA[k];
  if (m) return `<p class="ss-small"><b>${esc(tr("texture_src"))}:</b> <a href="${esc(m.page)}" target="_blank" rel="noopener">${esc(m.title)}</a> (${esc(m.id)})${b.texNote ? " · " + esc(b.texNote) : ""}</p>`;
  if (b.id === "venus") return `<p class="ss-small"><b>${esc(tr("texture_src"))}:</b> Magellan radar map, PIA00255 + PIA00256 · ${esc(b.texNote)}</p>`;
  if (b.id === "sun") return `<p class="ss-small"><b>${esc(tr("rendering"))}:</b> the 3D Sun is an animated rendering; the photograph above is from NASA's Solar Dynamics Observatory.</p>`;
  return `<p class="ss-small"><b>${esc(tr("rendering"))}:</b> ${esc(b.texNote || "")}</p>`;
}
function tabs(id, list, active) { return `<div class="ss-tabs" role="tablist">${list.map(k => `<button role="tab" data-tab="${k}" aria-selected="${k === active}">${esc(tr("tab_" + k))}</button>`).join("")}</div>`; }
function openPanel(id, tab) {
  const b = B(id), p = S.host.querySelector("#ss-panel"); p.hidden = false;
  const list = id === "sun" ? ["over","data","layers","missions"] : ["over","data","moons","missions","hist"];
  if (!list.includes(tab)) tab = "over";
  const head = `<div class="ss-phead"><div><span class="mono">${esc(b.kind === "star" ? "G2 V" : b.kind)}</span><h2>${esc(bname(id))}</h2></div><button class="iconbtn" data-closepanel aria-label="${esc(tr("close"))}">✕</button></div>`;
  let body = "";
  if (tab === "over") body = `${b.img ? photo(b.img, b.name) : ""}<p class="ss-lead">${esc(b.intro)}</p>${id !== "earth" ? distNow(id) : ""}${b.highlights ? `<h3>${esc(tr("highlights"))}</h3><ul>${b.highlights.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}${texNote(b)}${trBtn()}`;
  if (tab === "data") body = dataTable(b);
  if (tab === "layers") body = `<dl class="ss-dl">${Object.entries(b.facts).map(([k, v]) => `<div><dt>${esc({classification:tr("class"), age:tr("f_age"), composition:tr("f_comp"), core:tr("f_core"), surface:tr("f_surf"), distance:tr("f_dist"), luminosity:tr("f_lum"), massLoss:tr("f_mloss")}[k])}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    <h3>${esc(tr("dist_sun"))}</h3><table class="ss-table"><tbody>${PLANETS.concat(["pluto"]).map(pid => `<tr><td>${esc(B(pid).name)}</td><td>${fmtN(B(pid).a, 1)} million km</td><td>${fmtN(B(pid).a * 1e6 / AU_KM, 2)} au</td></tr>`).join("")}</tbody></table>
    ${b.layers.map(([h, x]) => `<h3>${esc(h)}</h3><p>${esc(x)}</p>`).join("")}${trBtn()}`;
  if (tab === "moons") body = moonList(id);
  if (tab === "missions") body = missionList(id === "earth" ? ["earth","moon"] : [id], true);
  if (tab === "hist") body = `<h3>${esc(tr("discovery"))}</h3><p>${esc(b.discovery)}</p><h3>${esc(tr("naming"))}</h3><p>${esc(b.naming)}</p>
    ${(() => { const f = window.SS_MISSIONS.filter(m => m.d.includes(id) && m.first).sort((a, c) => a.l.localeCompare(c.l)); return f.length ? `<h3>${esc(tr("highlights"))}</h3><ul class="ss-firsts">${f.map(m => `<li><time>${esc(fmtDateL(m.l))}</time> ${esc(m.first)} — <b>${esc(m.n)}</b></li>`).join("")}</ul>` : ""; })()}${trBtn()}`;
  p.innerHTML = head + tabs(id, list, tab) + `<div class="ss-pbody">${body}</div>`;
  p.querySelectorAll("[data-tab]").forEach(x => x.onclick = () => openPanel(id, x.dataset.tab));
  p.querySelector("[data-closepanel]").onclick = () => overview(false);
  bindPanelCommon(p, id);
}
function dataTable(b) {
  const row = (k, v) => `<div><dt>${esc(tr(k))}</dt><dd>${v}</dd></div>`;
  const d = b.id === "sun" ? [row("diameter", `${fmtN(b.diameter)} km`), row("mass", esc(b.mass)), row("density", `${fmtN(b.density)} kg/m³`), row("gravity", `${fmtN(b.gravity, 1)} m/s²`), row("temp", esc(b.tempC)), row("rot", esc(b.rot)), row("tilt", `${b.tilt}° (${esc(tr("to_ecl"))})`), row("class", esc(b.facts.classification))]
   : [row("class", esc(b.kind)), row("diameter", `${fmtN(b.diameter)} km`), row("mass", esc(b.mass)), row("density", `${fmtN(b.density)} kg/m³`), row("gravity", `${fmtN(b.gravity, 1)} m/s²`), row("temp", `${fmtN(b.tempC)} °C`), row("pressure", esc(b.pressure)),
      row("atm", esc(b.atmosphere)), row("rot", `${fmtN(Math.abs(b.rot), 1)} h${b.rot < 0 ? " (retrograde)" : ""}`), row("orb", `${fmtN(b.period, 1)} days`), row("dist_sun", `${fmtN(b.a, 1)} million km (${fmtN(b.a * 1e6 / AU_KM, 2)} au)`),
      row("tilt", `${b.tilt}°`), row("nmoons", `${b.moons}`), row("rings", tr(b.rings ? "yes" : "no")), row("magf", tr(b.mag === true ? "yes" : b.mag === false ? "no" : "unknown")), row("surface", esc(b.surface))];
  return `<dl class="ss-dl">${d.join("")}</dl><p class="ss-small">${esc(tr("src_l"))}: <a href="${window.SS_SOURCES.factsheet}" target="_blank" rel="noopener">NASA NSSDCA Planetary Fact Sheet</a> · ${esc(tr("verified"))} ${esc(fmtDateL(window.SS_VERIFIED))}. ${esc(tr("bar_note"))}</p>`;
}
function moonList(pid) {
  const ms = moonsOf(pid), note = window.SS_MOONCOUNT_NOTE[pid];
  return `<div class="ss-count"><span class="mono">${esc(tr("moon_count"))}</span><b>${B(pid).moons}</b><small>${esc(note)} ${esc(tr("verified"))} ${esc(fmtDateL(window.SS_VERIFIED))}.</small></div>
   ${ms.length ? `<div class="ss-mgrid">${ms.map(m => { const i = imgInfo(m.img); return `<button class="ss-mcard" data-moon="${m.id}" data-parent="${pid}">${i ? `<img src="${i.t}" alt="" loading="lazy">` : `<span class="ss-swatch" style="background:#${new THREE.Color(m.color).getHexString()}"></span>`}<b>${esc(m.name)}</b><small>${m.d ? fmtN(m.d) + " km" : "—"} · ${esc(m.year)}</small></button>`; }).join("")}</div>
   <p class="ss-small">${esc(tr("moon_pos_note"))}</p>` : ""}`;
}
function openMoonPanel(pid, mid) {
  const m = moonsOf(pid).find(x => x.id === mid), p = S.host.querySelector("#ss-panel"); p.hidden = false;
  const row = (k, v) => `<div><dt>${esc(tr(k))}</dt><dd>${v}</dd></div>`;
  const tex = m.tex && window.SS_MEDIA[m.tex + "_map"];
  const ms = mid === "moon" ? missionList(["moon"], true) : "";
  p.innerHTML = `<div class="ss-phead"><div><button class="ss-back" data-backto="${pid}">← ${esc(B(pid).name)}</button><h2>${esc(m.name)}</h2></div><button class="iconbtn" data-closepanel aria-label="${esc(tr("close"))}">✕</button></div>
   <div class="ss-pbody">${m.img ? photo(m.img, m.name) : `<div class="noimg" style="height:120px"><div>${esc(tr("no_photo"))}</div></div>`}
   <dl class="ss-dl">${row("diameter", m.d ? fmtN(m.d) + " km" + (m.dims ? " (" + esc(m.dims) + ")" : "") : esc(S.ctx.t("na")))}${row("mass", m.m ? esc(m.m) : esc(S.ctx.t("na")))}${row("discovered", esc(m.year))}${row("by", esc(m.by))}${row("from_parent", fmtN(m.a) + " km")}${row("orb", esc(m.P.replace(" R", "")) + " " + tr("u_days") + (/R/.test(m.P) ? " (" + tr("retro") + ")" : ""))}${row("surface", esc(m.surface))}${row("atm", esc(m.atm))}${row("probes", esc(m.probes))}</dl>
   ${m.facts && m.facts.length ? `<ul>${m.facts.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
   ${tex ? `<p class="ss-small"><b>${esc(tr("texture_src"))}:</b> <a href="${esc(tex.page)}" target="_blank" rel="noopener">${esc(tex.title)}</a> (${esc(tex.id)})</p>` : `<p class="ss-small"><b>${esc(tr("rendering"))}:</b> no global map was used; the 3D surface is an approximate tint.</p>`}
   <p class="ss-small">${esc(tr("moon_pos_note"))} ${esc(tr("src_l"))}: ${esc(tr("sat_src"))}</p>
   ${m.page ? `<a class="btn small" href="${m.page}">${esc(S.ctx.t("nav_moon"))} →</a>` : ""}
   ${ms ? `<h3>${esc(tr("missions"))}</h3>${ms}` : ""}${trBtn()}</div>`;
  p.querySelector("[data-closepanel]").onclick = () => overview(false);
  p.querySelector("[data-backto]").onclick = () => selectBody(pid, "moons");
  bindPanelCommon(p, mid);
}
function missionCard(m, compact) {
  const im = missionImg(m), ii = imgInfo(im), url = missionUrl(m);
  const f = (k, v) => v ? `<div><dt>${esc(tr(k))}</dt><dd>${esc(v)}</dd></div>` : "";
  return `<details class="ss-mission ss-b-${m.r}"><summary>${ii ? `<img src="${ii.t}" alt="" loading="lazy">` : `<span class="ss-noph" title="${esc(tr("no_photo"))}">◌</span>`}<span><b>${esc(m.n)}</b><small>${esc(m.ag)} · ${esc(m.l.length > 4 ? fmtDateL(m.l) : m.l)} · ${m.d.map(d => esc((B(d) || {name:d === "moon" ? "Moon" : d}).name.replace("The ", ""))).join(", ")}</small></span>${opill(m.r)}</summary>
   <div class="ss-mbody">${ii ? `<p class="ss-small">${esc(ii.m.title)} · <a href="${esc(ii.m.page)}" target="_blank" rel="noopener">${esc(ii.m.id)}</a></p>` : `<p class="ss-small">${esc(tr("no_photo"))}.</p>`}
   <dl class="ss-dl">${f("launch", m.l.length > 4 ? fmtDateL(m.l) : m.l)}${f("arrival", m.arr ? (m.arr.length > 7 ? fmtDateL(m.arr) : m.arr) : "")}${f("objective", m.obj)}${f("tech", m.tech)}${f("disc", m.disc)}${f("duration", m.dur)}${f("outcome", tr("o_" + m.r))}${f("why_failed", m.fail)}${f("significance", m.sig || m.first)}</dl>
   <div class="btnrow">${url ? `<a class="btn small" href="${esc(url)}" target="_blank" rel="noopener">${esc(tr("source"))} ↗</a>` : ""}${m.page ? `<a class="btn small" href="${m.page}">${esc(tr("archive_page"))} →</a>` : ""}</div></div></details>`;
}
function missionList(dests, withSummary) {
  const list = window.SS_MISSIONS.filter(m => m.d.some(d => dests.includes(d))).sort((a, b) => skey(a.l).localeCompare(skey(b.l)));
  const counts = {}; list.forEach(m => counts[m.r] = (counts[m.r] || 0) + 1);
  return `${withSummary ? `<div class="ss-outsum">${["successful","partial","failed","ongoing","planned"].filter(k => counts[k]).map(k => `${opill(k)} <b>${counts[k]}</b>`).join(" ")}</div>` : ""}<div class="ss-mlist">${list.map(m => missionCard(m)).join("")}</div>
   <p class="ss-small">${esc(tr("out_note")).replace("{links}", `<a href="${window.SS_SOURCES.marsChron}" target="_blank" rel="noopener">NSSDCA Mars chronology</a>, <a href="${window.SS_SOURCES.venusChron}" target="_blank" rel="noopener">NSSDCA Venus chronology</a>, <a href="${window.SS_SOURCES.chron}" target="_blank" rel="noopener">NSSDCA lunar and planetary chronology</a>`)}</p>`;
}
function trBtn() { return S.ctx.lang() !== "en" ? `<div class="notice ss-trbox"><span>${esc(S.ctx.t("rec_english"))}</span><button class="btn small" data-trpanel>${esc(S.ctx.t("translate_rec"))}</button></div>` : ""; }
function bindPanelCommon(p, key) {
  p.querySelectorAll("[data-moon]").forEach(x => x.onclick = () => selectMoon(x.dataset.parent, x.dataset.moon));
  const tb = p.querySelector("[data-trpanel]"); if (tb) tb.onclick = () => translatePanel(p, key);
  p.scrollTop = 0;
}
async function translatePanel(p, key) {
  const box = p.querySelector(".ss-trbox"); const sample = await S.ctx.getSample();
  if (!sample) { box.innerHTML = `<span>${esc(S.ctx.t("nova_offline"))}</span>`; return; }
  box.innerHTML = `<span>${esc(S.ctx.t("translating"))}</span>`;
  const nodes = [...p.querySelectorAll(".ss-pbody p:not(.ss-small), .ss-pbody li, .ss-pbody dd, .ss-pbody h3")].filter(n => n.textContent.trim().length > 2 && !n.closest(".ss-trbox"));
  const texts = nodes.map(n => n.textContent);
  const lang = ["English","Bengali","Spanish","French","Arabic"][L()];
  try {
    const out = await sample.json(`Translate each string in this JSON array into ${lang}. Keep spacecraft, mission and agency names, numbers, units and dates unchanged. Return a JSON array of the same length.\n\n${JSON.stringify(texts)}`, {modelTier:"quick"});
    if (Array.isArray(out) && out.length === nodes.length) nodes.forEach((n, i) => n.textContent = out[i]);
    box.innerHTML = `<span>${esc(S.ctx.t("translated_note"))}</span>`;
  } catch (e) { box.innerHTML = `<span>${esc(S.ctx.t("nova_err"))}</span>`; }
}
function tipHtml(id) {
  if (ALL.includes(id)) { const b = B(id); return `<b>${esc(b.name)}</b><span>${esc(b.kind === "star" ? "G2 V star" : b.kind)} · ${fmtN(b.diameter)} km</span>`; }
  const [m, p] = findMoon(id); return m ? `<b>${esc(m.name)}</b><span>${esc(B(p).name)} · ${m.d ? fmtN(m.d) + " km" : ""}</span>` : "";
}
/* ───────────── SHEETS: missions, timeline, compare, journey, moons ───────────── */
function openSheet(kind) {
  const sh = S.host.querySelector("#ss-sheet"); S.sheet = kind; sh.hidden = false;
  S.host.querySelectorAll("[data-sheet]").forEach(b => b.setAttribute("aria-pressed", b.dataset.sheet === kind));
  const head = t => `<div class="ss-shead"><h2>${esc(t)}</h2><button class="iconbtn" data-closesheet aria-label="${esc(tr("close"))}">✕</button></div>`;
  if (kind === "missions") {
    const ags = [...new Set(window.SS_MISSIONS.map(m => m.ag.split(/[ /(]/)[0]))].sort();
    sh.innerHTML = head(tr("missions")) + `<div class="ss-filters"><input class="field" id="ssq" placeholder="${esc(tr("search"))}" aria-label="${esc(tr("search"))}">
      <select class="field" id="ssd" aria-label="${esc(tr("destination"))}"><option value="">${esc(tr("destination"))}: ${esc(tr("all"))}</option>${ALL.concat(["moon"]).map(d => `<option value="${d}">${esc(d === "moon" ? S.ctx.t("de_moon") : bname(d))}</option>`).join("")}</select>
      <select class="field" id="sso" aria-label="${esc(tr("outcome"))}"><option value="">${esc(tr("outcome"))}: ${esc(tr("all"))}</option>${["successful","partial","failed","ongoing","planned"].map(k => `<option value="${k}">${esc(tr("o_" + k))}</option>`).join("")}</select>
      <select class="field" id="ssa" aria-label="${esc(tr("agency"))}"><option value="">${esc(tr("agency"))}: ${esc(tr("all"))}</option>${ags.map(a => `<option>${esc(a)}</option>`).join("")}</select>
      <select class="field" id="ssy" aria-label="${esc(tr("decade"))}"><option value="">${esc(tr("decade"))}: ${esc(tr("all"))}</option>${[1950,1960,1970,1980,1990,2000,2010,2020,2030].map(d => `<option value="${d}">${d}s</option>`).join("")}</select></div>
      <p class="mono ss-cnt" id="sscnt" aria-live="polite"></p><div class="ss-mlist wide" id="ssres"></div>`;
    const draw = () => {
      const q = sh.querySelector("#ssq").value.toLowerCase(), d = sh.querySelector("#ssd").value, o = sh.querySelector("#sso").value, a = sh.querySelector("#ssa").value, y = sh.querySelector("#ssy").value;
      const r = window.SS_MISSIONS.filter(m => (!q || (m.n + " " + m.ag + " " + m.obj).toLowerCase().includes(q)) && (!d || m.d.includes(d)) && (!o || m.r === o) && (!a || m.ag.startsWith(a)) && (!y || (parseInt(m.l) >= +y && parseInt(m.l) < +y + 10))).sort((x, z) => skey(x.l).localeCompare(skey(z.l)));
      sh.querySelector("#sscnt").innerHTML = `${esc(tr("n_missions", {n:r.length}))} · ${["successful","partial","failed","ongoing","planned"].map(k => `${opill(k)} ${r.filter(m => m.r === k).length}`).join(" ")}`;
      sh.querySelector("#ssres").innerHTML = r.map(m => missionCard(m)).join("");
    };
    sh.querySelectorAll("input,select").forEach(e => e.addEventListener("input", draw)); draw();
  }
  if (kind === "timeline") {
    const years = []; for (let y = 1957; y <= 2031; y++) years.push(y);
    const byY = y => window.SS_MISSIONS.filter(m => parseInt(m.l) === y);
    sh.innerHTML = head(tr("timeline")) + `<label class="toggle"><input type="checkbox" id="ssfirst"> ${esc(tr("firsts"))}</label>
     <div class="ss-years" id="ssyears">${years.map(y => { const n = byY(y).length; return `<button data-y="${y}" ${n ? "" : "disabled"} style="--n:${Math.min(n, 6)}"><i></i>${y}</button>`; }).join("")}</div>
     <div id="ssyear"><p class="ss-small">${esc(tr("tl_pick"))}</p></div>
     <h3 style="margin-top:22px">${esc(tr("highlights"))}</h3><ul class="ss-firsts">${window.SS_MISSIONS.filter(m => m.first).sort((a, b) => a.l.localeCompare(b.l)).map(m => `<li><button data-y="${parseInt(m.l)}" class="linkish">${esc(m.l.slice(0, 4))}</button> ${esc(m.first)} — <b>${esc(m.n)}</b> ${opill(m.r)}</li>`).join("")}</ul>`;
    const showY = y => { sh.querySelectorAll("#ssyears [data-y]").forEach(b => b.setAttribute("aria-pressed", +b.dataset.y === y)); const f = sh.querySelector("#ssfirst").checked;
      const list = byY(y).filter(m => !f || m.first || m.r === "failed");
      sh.querySelector("#ssyear").innerHTML = `<h3>${y}</h3><div class="ss-mlist wide">${list.map(m => missionCard(m)).join("") || "—"}</div>`; };
    sh.querySelectorAll("[data-y]").forEach(b => b.onclick = () => { showY(+b.dataset.y); sh.querySelector("#ssyear").scrollIntoView({block:"nearest", behavior:"smooth"}); });
    sh.querySelector("#ssfirst").onchange = () => { const cur = sh.querySelector("#ssyears [aria-pressed=true]"); if (cur) showY(+cur.dataset.y); };
  }
  if (kind === "compare") {
    S.cmp = S.cmp || ["earth", "mars", "jupiter"];
    const opts = ALL.concat(["moon"]);
    sh.innerHTML = head(tr("compare")) + `<p class="ss-small">${esc(tr("cmp_pick"))}</p><div class="chips" id="sschips">${opts.map(id => `<button class="chip" data-c="${id}" aria-pressed="${S.cmp.includes(id)}">${esc(id === "moon" ? "Moon" : B(id).name.replace("The ", ""))}</button>`).join("")}</div><div id="sscmp"></div>`;
    const val = (id, k) => { if (id === "moon") return {diameter:3475, massKg:7.346e22, density:3340, gravity:1.6, tempC:-20, a:149.6, moons:0, period:27.3, rot:655.7, atm:"Essentially none"}[k];
      const b = B(id); const mk = b.mass ? parseFloat(b.mass.replace(/,/g, "")) * Math.pow(10, +((b.mass.match(/10([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/) || [])[1] || "").replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, c => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c))) : null;
      return {diameter:b.diameter, massKg:mk, density:b.density, gravity:b.gravity, tempC:typeof b.tempC === "number" ? b.tempC : 5500, a:b.a || 0, moons:b.moons ?? 0, period:b.period || null, rot:Math.abs(typeof b.rot === "number" ? b.rot : 609.12), atm:b.atmosphere || "Hydrogen and helium plasma"}[k]; };
    const draw = () => {
      const ids = S.cmp; const el = sh.querySelector("#sscmp");
      if (ids.length < 2) { el.innerHTML = `<p class="ss-small">${esc(tr("cmp_pick"))}</p>`; return; }
      const metrics = [["diameter","km",true],["massKg","kg",true],["density","kg/m³",false],["gravity","m/s²",false],["tempC","°C",false],["a",tr("u_mkm"),true],["moons","",true],["period",tr("u_days"),true],["rot",tr("u_hours"),true]];
      const label = {diameter:tr("diameter"), massKg:tr("mass"), density:tr("density"), gravity:tr("gravity"), tempC:tr("temp"), a:tr("dist_sun"), moons:tr("nmoons"), period:tr("orb"), rot:tr("rot")};
      const name = id => id === "moon" ? S.ctx.t("de_moon") : bname(id).replace("The ", "");
      const maxD = Math.max(...ids.map(id => val(id, "diameter")));
      el.innerHTML = `<h3>${esc(tr("cmp_visual"))}</h3><div class="ss-sizes">${ids.map(id => { const d = val(id, "diameter"), px = Math.max(2, 220 * d / maxD); const c = id === "moon" ? 0xb7b0a6 : B(id).color; return `<figure><span style="width:${px}px;height:${px}px;background:radial-gradient(circle at 35% 35%,#fff3,#0000 60%),#${new THREE.Color(c).getHexString()}"></span><figcaption>${esc(name(id))}<br><small>${fmtN(d)} km</small></figcaption></figure>`; }).join("")}</div>
       ${metrics.map(([k, u, log]) => { const vs = ids.map(id => val(id, k)); const pos = vs.filter(v => v > 0); const mx = Math.max(...vs.map(Math.abs)), mn = Math.min(...pos); const useLog = log && mx / mn > 50;
         return `<div class="ss-metric"><h4>${esc(label[k])} <small>${esc(u)}${useLog ? " · log" : ""}</small></h4>${ids.map((id, i) => { const v = vs[i]; const w = v == null ? 0 : useLog ? (v > 0 ? (Math.log10(v) - Math.log10(mn) + .3) / (Math.log10(mx) - Math.log10(mn) + .3) : 0) : Math.abs(v) / mx;
           return `<div class="ss-bar"><span>${esc(name(id))}</span><i style="width:${Math.max(1, w * 100)}%;${v < 0 ? "background:var(--blue)" : ""}"></i><b>${v == null ? "—" : k === "massKg" ? v.toExponential(2).replace("e+", " × 10^") : fmtN(v, k === "gravity" ? 1 : 1)}</b></div>`; }).join("")}</div>`; }).join("")}
       <div class="ss-metric"><h4>${esc(tr("atm"))}</h4>${ids.map(id => `<p><b>${esc(name(id))}:</b> ${esc(val(id, "atm"))}</p>`).join("")}</div>
       <p class="ss-small">${esc(tr("log_note"))} ${esc(tr("cmp_src"))}</p>`;
    };
    sh.querySelectorAll("[data-c]").forEach(b => b.onclick = () => { const id = b.dataset.c; S.cmp = S.cmp.includes(id) ? S.cmp.filter(x => x !== id) : S.cmp.concat([id]).slice(-5); sh.querySelectorAll("[data-c]").forEach(x => x.setAttribute("aria-pressed", S.cmp.includes(x.dataset.c))); draw(); });
    draw();
  }
  if (kind === "journey") {
    const opts = ALL.filter(x => x !== "sun").concat(["sun"]);
    sh.innerHTML = head(tr("journey")) + `<div class="ss-filters"><label>${esc(tr("from"))} <select class="field" id="jf">${opts.map(id => `<option value="${id}" ${id === "earth" ? "selected" : ""}>${esc(B(id).name)}</option>`).join("")}</select></label>
      <label>${esc(tr("to"))} <select class="field" id="jt">${opts.map(id => `<option value="${id}" ${id === "mars" ? "selected" : ""}>${esc(B(id).name)}</option>`).join("")}</select></label>
      <button class="btn primary" id="jgo">${esc(tr("go"))} →</button></div>
      <div class="chips">${[["earth","mars"],["earth","jupiter"],["earth","saturn"],["earth","neptune"]].map(([a, b]) => `<button class="chip" data-jp="${a},${b}">${esc(B(a).name)} → ${esc(B(b).name)}</button>`).join("")}</div>
      <p class="ss-small">${esc(tr("j_note"))}</p>`;
    sh.querySelectorAll("[data-jp]").forEach(b => b.onclick = () => { const [a, c] = b.dataset.jp.split(","); sh.querySelector("#jf").value = a; sh.querySelector("#jt").value = c; });
    sh.querySelector("#jgo").onclick = () => { const a = sh.querySelector("#jf").value, c = sh.querySelector("#jt").value; if (a === c) return; closeSheet(); journey(a, c); };
  }
  if (kind === "moons") {
    const ps = ["earth","mars","jupiter","saturn","uranus","neptune","pluto"];
    const cur = S.moonPlanet || "jupiter";
    sh.innerHTML = head(tr("moons")) + `<div class="ss-tabs">${ps.map(p => `<button data-mp="${p}" aria-selected="${p === cur}">${esc(B(p).name)} <small>${B(p).moons}</small></button>`).join("")}</div><div id="ssmoons">${moonList(cur)}</div>`;
    sh.querySelectorAll("[data-mp]").forEach(b => b.onclick = () => { S.moonPlanet = b.dataset.mp; openSheet("moons"); });
    sh.querySelectorAll("[data-moon]").forEach(x => x.onclick = () => { closeSheet(); selectMoon(x.dataset.parent, x.dataset.moon); });
  }
  sh.querySelector("[data-closesheet]").onclick = closeSheet;
  sh.scrollTop = 0; sh.querySelector("[data-closesheet]").focus();
}
function closeSheet() { const sh = S.host.querySelector("#ss-sheet"); sh.hidden = true; sh.innerHTML = ""; S.sheet = null; S.host.querySelectorAll("[data-sheet]").forEach(b => b.setAttribute("aria-pressed", "false")); }
/* Journey: cinematic camera flight between two bodies */
function journey(a, b) {
  if (S.nogl) { selectBody(b); return; }
  closePanel(); S.follow = null;
  const km = window.SS_EPHEM.distance(a, b, new Date());
  const hud = document.createElement("div"); hud.className = "ss-hud";
  const bb = B(b);
  hud.innerHTML = `<span class="mono">${esc(B(a).name)} → ${esc(bb.name)}</span><b id="jkm">0 km</b><small>${esc(tr("straight"))}: ${fmtN(km / 1e6, 1)} million km · ${fmtN(km / AU_KM, 2)} au · ${esc(tr("light_time"))} ${km / 299792.458 < 3600 ? fmtN(km / 299792.458 / 60, 1) + " min" : fmtN(km / 299792.458 / 3600, 2) + " h"}</small><p>${esc(bb.intro)}</p><small>${esc(tr("j_note"))}</small>`;
  S.host.querySelector(".ss-wrap").appendChild(hud);
  const pa = worldPos(a), pb = worldPos(b); const ra = a === "sun" ? S.objs.sun.mesh.scale.x : S.objs[a].radius, rb = b === "sun" ? S.objs.sun.mesh.scale.x : S.objs[b].radius;
  const start = pa.clone().add(new THREE.Vector3(0, ra * 1.2, ra * 4)); S.cam.position.copy(start); S.ctl.target.copy(pa);
  const dir = pb.clone().sub(pa); const mid = pa.clone().add(dir.clone().multiplyScalar(.5)).add(new THREE.Vector3(0, dir.length() * .22, 0));
  const end = pb.clone().add(dir.clone().normalize().multiplyScalar(-rb * 4.5)).add(new THREE.Vector3(0, rb * 1.2, 0));
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end); const T = 7000, t0 = performance.now() + 600;
  S.ctl.enabled = false;
  S.journey = {tick() {
    const k = Math.max(0, Math.min(1, (performance.now() - t0) / T)), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    S.cam.position.copy(curve.getPoint(e)); S.ctl.target.lerpVectors(pa, pb, Math.min(1, e * 1.15));
    const el = hud.querySelector("#jkm"); if (el) el.textContent = fmtN(km * e / 1e6, 1) + " million km";
    if (k >= 1) { S.journey = null; S.ctl.enabled = true; setTimeout(() => hud.remove(), 6000); selectBody(b); }
  }};
}
/* ───────────── MUSIC (only inside this explorer) ───────────── */
function musicToggle(play) {
  const M = S.music || (S.music = {ctx:null, gain:null, src:null, buf:null, playing:false, muted:false});
  const btn = S.host.querySelector("#ss-mplay");
  if (play === false || (play === undefined && M.playing)) {
    if (M.gain && M.ctx) { M.gain.gain.cancelScheduledValues(M.ctx.currentTime); M.gain.gain.setTargetAtTime(0, M.ctx.currentTime, .6); setTimeout(() => { if (!M.playing) M.ctx && M.ctx.suspend(); }, 2500); }
    M.playing = false; if (btn) btn.textContent = "▶ " + tr("play"); S.host.querySelector("[data-music]").classList.remove("on"); return;
  }
  M.playing = true; if (btn) btn.textContent = "❚❚ " + tr("pause"); S.host.querySelector("[data-music]").classList.add("on");
  (async () => {
    if (!M.ctx) { M.ctx = new (window.AudioContext || window.webkitAudioContext)(); M.gain = M.ctx.createGain(); M.gain.gain.value = 0; M.gain.connect(M.ctx.destination);
      const ab = await (await fetch("ss/audio/ambient.mp3")).arrayBuffer(); M.buf = await M.ctx.decodeAudioData(ab);
      M.src = M.ctx.createBufferSource(); M.src.buffer = M.buf; M.src.loop = true; M.src.connect(M.gain); M.src.start(); }
    await M.ctx.resume(); if (!M.playing) return;
    M.gain.gain.cancelScheduledValues(M.ctx.currentTime); M.gain.gain.setTargetAtTime(M.muted ? 0 : 0.13, M.ctx.currentTime, 1.2);
  })().catch(() => { M.playing = false; if (btn) btn.textContent = "▶ " + tr("play"); });
}
function musicMute() {
  const M = S.music; if (!M) return; M.muted = !M.muted;
  S.host.querySelector("#ss-mmute").textContent = M.muted ? tr("unmute") : tr("mute");
  if (M.gain && M.playing) M.gain.gain.setTargetAtTime(M.muted ? 0 : 0.13, M.ctx.currentTime, .4);
}
/* ───────────── UI BINDINGS ───────────── */
function bindUI() {
  const h = S.host;
  h.addEventListener("click", e => {
    const t = e.target.closest("button,a"); if (!t) return;
    if (t.dataset.mode) setMode(t.dataset.mode);
    else if (t.dataset.body) { t.dataset.body === "overview" ? overview(false) : selectBody(t.dataset.body); }
    else if (t.dataset.sheet) { S.sheet === t.dataset.sheet ? closeSheet() : openSheet(t.dataset.sheet); }
    else if (t.hasAttribute("data-exit")) S.ctx.exit();
    else if (t.hasAttribute("data-music")) { const pop = h.querySelector("#ss-musicpop"); pop.hidden = !pop.hidden; t.setAttribute("aria-expanded", !pop.hidden); }
    else if (t.id === "ss-mplay") musicToggle();
    else if (t.id === "ss-mmute") musicMute();
    else if (t.dataset.speed !== undefined) { S.speed = +t.dataset.speed; h.querySelectorAll("[data-speed]").forEach(b => b.setAttribute("aria-pressed", b === t)); }
    else if (t.hasAttribute("data-now")) { S.simDate = new Date(); updatePositions(0); }
  });
  S.key = e => {
    if (!S || /INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName)) return;
    if (e.key === "Escape") { if (S.intro) S.intro.end(); else if (S.sheet) closeSheet(); else if (S.sel) overview(false); }
    else if (/^[0-9]$/.test(e.key) && !S.intro) selectBody(ALL[+e.key]);
  };
  window.addEventListener("keydown", S.key);
}
function stop() {
  if (!S) return;
  S.running = false; cancelAnimationFrame(S.raf);
  window.removeEventListener("keydown", S.key);
  const M = S.music; if (M && M.ctx) { try { M.gain.gain.setTargetAtTime(0, M.ctx.currentTime, .15); setTimeout(() => M.ctx.close(), 500); } catch (e) {} }
  try { S.ro && S.ro.disconnect(); S.ctl && S.ctl.dispose(); S.r && (S.r.dispose(), S.r.forceContextLoss && S.r.forceContextLoss()); } catch (e) {}
  S = null;
}
return {start, stop, _state: () => S};
})();
