/* THE MOON: HUMANITY'S JOURNEY TO ANOTHER WORLD — documentary data.
   Narration: the six supplied MP3 files (authoritative; not altered). Caption timings: faster-whisper word timestamps
   on those files, grouped into sentences; spelling of proper names normalised (Lunokhod, SORA-Q, Chang'e-3 …) without changing wording.
   Visuals: only archival/official media. Every shot carries its kind, source page and credit. Reconstructed cards are labelled as such.
   Vehicle panels and the archive reuse the site's sourced Hardware Locator records (hw/hw-data.js). */
window.FE_MD = (function () {
const SRC = {
  nssdc:{t:"NASA NSSDCA — Table of Anthropogenic Impacts and Spacecraft on the Moon", u:"https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_artifact_impacts.html"},
  lroc:{t:"LROC — Lunar Reconnaissance Orbiter Camera featured images (NASA/GSFC/Arizona State University)", u:"https://lroc.im-ldi.com/images"},
  nasaimg:{t:"NASA Image and Video Library", u:"https://images.nasa.gov/"},
  isro3:{t:"ISRO — Chandrayaan-3 images and videos", u:"https://www.isro.gov.in/Chandrayaan3_Details.html"},
  isrovid:{t:"ISRO — Chandrayaan-3 videos", u:"https://www.isro.gov.in/Ch3_Video_Lunar_Orbit_Insertion.html"},
  isroterms:{t:"ISRO — Copyright policy (reproduction free of charge if accurate and not misleading)", u:"https://www.isro.gov.in/CopyrightPolicy.html"},
  jaxaLev:{t:"JAXA press release, 25 Jan 2024 — LEV-1 and LEV-2 (SORA-Q) on the lunar surface", u:"https://global.jaxa.jp/press/2024/01/20240125-4_e.html"},
  jaxaSlim:{t:"JAXA press release, 25 Jan 2024 — SLIM landing results", u:"https://global.jaxa.jp/press/2024/01/20240125-1_e.html"},
  jaxaProj:{t:"JAXA — SLIM project page", u:"https://global.jaxa.jp/projects/sas/slim/"},
  svs:{t:"NASA Scientific Visualization Studio / GSFC — Lee-Lincoln Scarp flyover (LRO data)", u:"https://images.nasa.gov/details/GSFC_20190513_m4714_Lee_Lincoln_Scarp_Moon_Flyover"}
};
const L = n => "https://lroc.im-ldi.com/images/" + n, N = id => "https://images.nasa.gov/details/" + encodeURIComponent(id);
const LROC = "NASA/GSFC/Arizona State University", ISRO = "ISRO", NASA = "NASA";
/* k: kind → md_k_* label. v: Hardware Locator ids shown as hotspots; p: pins [id, x%, y%] placed only where the object's position in the frame was checked by eye. */
const A = {
  fullmoon:{f:"doc/img/a11_fullmoon.webp", k:"photo", n:"Apollo 11", y:1969, id:"AS11-44-6667", page:N("as11-44-6667"), cr:NASA, fit:"contain"},
  ranger7:{f:"img/ranger7.webp", k:"probe", n:"Ranger 7", y:1964, id:"PIA02975", page:N("PIA02975"), cr:"NASA/JPL", v:["ranger-7"]},
  lroc01:{f:"md/img/lroc_01.webp", k:"orbital", n:"Surveyor 1", y:2010, id:"LROC #13", page:L(13), cr:LROC, v:["surveyor-1"], p:[["surveyor-1",47,23]]},
  lroc02:{f:"md/img/lroc_02.webp", k:"orbital", n:"Ranger 7", y:2010, id:"LROC #52", page:L(52), cr:LROC, v:["ranger-7"], ar:1},
  s1shadow:{f:"md/img/s1shadow.webp", k:"probe", n:"Surveyor 1", y:1966, id:"PIA02976", page:N("PIA02976"), cr:"NASA/JPL", v:["surveyor-1"]},
  surveyor3:{f:"img/surveyor3.webp", k:"photo", n:"Surveyor 3 · Apollo 12", y:1969, id:"AS12-48-7121", page:N("as12-48-7121"), cr:NASA, v:["surveyor-3","a12-lm"]},
  lroc03:{f:"md/img/lroc_03.webp", k:"orbital", n:"Apollo 12 · Surveyor 3", y:2011, id:"LROC #141", page:L(141), cr:LROC, v:["a12-lm","surveyor-3","a12-alsep"], p:[["a12-lm",46.3,50.4],["surveyor-3",59.7,62.2],["a12-alsep",36.2,40.3]]},
  a11launch:{f:"img/a11launch.webp", k:"photo", n:"Apollo 11 · Saturn V", y:1969, id:"S69-39961", page:N("S69-39961"), cr:NASA},
  satv:{f:"md/clips/satv.mp4", k:"film", n:"Saturn V", y:1969, id:"Ultimate Saturn V Launch w Enhanced Sound", page:N("Ultimate Saturn V Launch w Enhanced Sound"), cr:"NASA/MSFC", vid:1},
  csm15:{f:"md/img/csm15.webp", k:"photo", n:"Apollo 15 · Endeavour (CSM)", y:1971, id:"AS15-88-11974", page:N("as15-88-11974"), cr:NASA},
  aldrin:{f:"img/aldrin.webp", k:"photo", n:"Apollo 11 · Eagle", y:1969, id:"AS11-40-5903", page:N("as11-40-5903"), cr:NASA, v:["a11-lm"]},
  a11step:{f:"doc/clips/a11_step.mp4", k:"tv", n:"Apollo 11", y:1969, id:"Apollo_11_moonwalk_montage_720p", page:N("Apollo_11_moonwalk_montage_720p"), cr:NASA, vid:1, v:["a11-lm"]},
  a11flag:{f:"doc/clips/a11_flag.mp4", k:"tv", n:"Apollo 11", y:1969, id:"Apollo_11_moonwalk_montage_720p", page:N("Apollo_11_moonwalk_montage_720p"), cr:NASA, vid:1, v:["a11-lm","a11-psep","a11-lrrr"]},
  lroa11:{f:"doc/img/lro_a11.jpg", k:"orbital", n:"Apollo 11", y:2009, id:"PIA12909", page:N("PIA12909"), cr:LROC, v:["a11-lm","a11-psep","a11-lrrr"]},
  a15lift:{f:"doc/clips/a15_liftoff.mp4", k:"film", n:"Apollo 15 · Falcon", y:1971, id:"Apollo 15 Never Been on a Ride like this Before", page:N("Apollo 15 Never Been on a Ride like this Before"), cr:NASA, vid:1, v:["a15-lm","a15-ascent","a15-lrv"]},
  herolrv:{f:"img/hero_lrv.webp", k:"photo", n:"Apollo 17 · LRV", y:1972, id:"AS17-147-22526", page:N("AS17-147-22526"), cr:NASA, v:["a17-lrv"]},
  a15drive:{f:"doc/clips/a15_drive.mp4", k:"film", n:"Apollo 15 · LRV", y:1971, id:"Apollo 15 Never Been on a Ride like this Before", page:N("Apollo 15 Never Been on a Ride like this Before"), cr:NASA, vid:1, v:["a15-lrv"]},
  lrv15:{f:"hw/img/lrv15.jpg", k:"photo", n:"Apollo 15 · LRV", y:1971, id:"AS15-86-11603", page:N("as15-86-11603"), cr:NASA, v:["a15-lrv","a15-lm"]},
  hero:{f:"img/hero.webp", k:"photo", n:"Apollo 17", y:1972, id:"AS17-148-22727", page:N("as17-148-22727"), cr:NASA},
  lroc04:{f:"md/img/lroc_04.webp", k:"orbital", n:"Apollo 17 · Challenger", y:2011, id:"LROC #72", page:L(72), cr:LROC, v:["a17-lm","a17-lrv","a17-alsep"], p:[["a17-lm",50,50]]},
  lroc09:{f:"md/img/lroc_09.jpg", k:"orbital", n:"Lunokhod 2", y:2012, id:"LROC #774", page:L(774), cr:LROC, v:["lunokhod-2"]},
  lroc06:{f:"md/img/lroc_06.webp", k:"orbital", n:"Luna 17", y:2012, id:"LROC #402", page:L(402), cr:LROC, v:["luna-17","lunokhod-1"], p:[["luna-17",47,48]]},
  luna17:{f:"img/lunokhod.webp", k:"orbital", n:"Luna 17", y:2010, id:"PIA12967", page:N("PIA12967"), cr:LROC, v:["luna-17"]},
  lroc05:{f:"md/img/lroc_05.webp", k:"orbital", n:"Lunokhod 1", y:2012, id:"LROC #402", page:L(402), cr:LROC, v:["lunokhod-1"], p:[["lunokhod-1",50,47]]},
  luna21:{f:"img/luna21.webp", k:"orbital", n:"Luna 21", y:2010, id:"PIA12976", page:N("PIA12976"), cr:LROC, v:["luna-21"]},
  lroc07:{f:"md/img/lroc_07.webp", k:"orbital", n:"Lunokhod 2", y:2013, id:"LROC #699", page:L(699), cr:LROC, v:["lunokhod-2"], p:[["lunokhod-2",49,49]]},
  lro:{f:"img/lro.webp", k:"photo", n:"Lunar Reconnaissance Orbiter", y:2009, id:"PIA12086", page:N("PIA12086"), cr:"NASA/JPL"},
  lroc13:{f:"md/img/lroc_13.webp", k:"orbital", n:"Chang'e-3 · Yutu", y:2013, id:"LROC #637", page:L(637), cr:LROC, v:["change-3","yutu"], p:[["change-3",50,48],["yutu",52,57]]},
  lroc14:{f:"md/img/lroc_14.webp", k:"orbital", n:"Chang'e-4 · Yutu-2", y:2019, id:"LROC #1091", page:L(1091), cr:LROC, v:["change-4","yutu-2"]},
  lroc15:{f:"md/img/lroc_15.webp", k:"orbital", n:"Yutu-2", y:2020, id:"LROC #1168", page:L(1168), cr:LROC, v:["yutu-2","change-4"]},
  lroc16:{f:"md/img/lroc_16.webp", k:"orbital", n:"Chang'e-5", y:2020, id:"LROC #1172", page:L(1172), cr:LROC, v:["change-5","change-5-ascent"], p:[["change-5",50,50]]},
  lroc17:{f:"md/img/lroc_17.webp", k:"orbital", n:"Chang'e-6", y:2024, id:"LROC #1374", page:L(1374), cr:LROC, v:["change-6"], p:[["change-6",50,50]]},
  orion:{f:"img/orion_moon.webp", k:"photo", n:"Artemis I · Orion", y:2022, id:"art001e000269", page:N("art001e000269"), cr:NASA},
  cy3loi:{f:"md/clips/cy3_loi.mp4", k:"onboard", n:"Chandrayaan-3", y:2023, id:"Ch3_Video_LOI", page:SRC.isrovid.u, cr:ISRO, vid:1},
  cy3ramp:{f:"md/clips/cy3_ramp.mp4", k:"onboard", n:"Chandrayaan-3 · Pragyan", y:2023, id:"ch3_rover_movement_and_inplace_turn", page:SRC.isrovid.u, cr:ISRO, vid:1, v:["pragyan","vikram-3"]},
  cy3move:{f:"md/clips/cy3_move.mp4", k:"onboard", n:"Chandrayaan-3 · Pragyan", y:2023, id:"ch3_rover_movement_and_inplace_turn", page:SRC.isrovid.u, cr:ISRO, vid:1, v:["pragyan"]},
  cy3rot:{f:"md/clips/cy3_rot.mp4", k:"onboard", n:"Chandrayaan-3 · Pragyan", y:2023, id:"Rover_rotation_captured_by_lander_imager", page:SRC.isrovid.u, cr:ISRO, vid:1, v:["pragyan","vikram-3"]},
  lroc18:{f:"md/img/lroc_18.webp", k:"orbital", n:"Chandrayaan-3 · Vikram", y:2023, id:"LROC #1314", page:L(1314), cr:LROC, v:["vikram-3","pragyan"], p:[["vikram-3",50,50]]},
  lroc19:{f:"md/img/lroc_19.jpg", k:"orbital", n:"SLIM", y:2024, id:"LROC #1358", page:L(1358), cr:LROC, v:["slim","lev-1","lev-2"], p:[["slim",47,50]]},
  isrop11:{f:"md/img/isro_p11.webp", k:"diagram", n:"Pragyan", y:2023, id:"Chandrayaan-3 Picture11", page:SRC.isro3.u, cr:ISRO, v:["pragyan"], fit:"contain"},
  isrop8:{f:"md/img/isro_p8.webp", k:"diagram", n:"Vikram", y:2023, id:"Chandrayaan-3 Picture8", page:SRC.isro3.u, cr:ISRO, v:["vikram-3"], fit:"contain"},
  cy3hop:{f:"md/clips/cy3_hop.mp4", k:"onboard", n:"Chandrayaan-3 · Vikram", y:2023, id:"Ch3_Lander_hop_experiment_Sep3", page:SRC.isrovid.u, cr:ISRO, vid:1, v:["vikram-3"]},
  scarp:{f:"md/clips/scarp.mp4", k:"visual", n:"Taurus-Littrow · Apollo 17", y:2019, id:"GSFC_20190513_m4714", page:SRC.svs.u, cr:"NASA/GSFC/Arizona State University", vid:1, v:["a17-lm","a17-lrv"]},
  lro_a15:{f:"doc/img/lro_a15.webp", k:"orbital", n:"Apollo 15", y:2009, id:"PIA13037", page:N("PIA13037"), cr:LROC, v:["a15-lm","a15-lrv"]},
  earthrise:{f:"img/earthrise.webp", k:"photo", n:"Apollo 8", y:1968, id:"AS08-14-2383", page:N("as08-14-2383"), cr:NASA},
  boot:{f:"doc/img/a11_bootprint.webp", k:"photo", n:"Apollo 11", y:1969, id:"AS11-40-5880", page:N("as11-40-5880"), cr:NASA},
  lroc10:{f:"md/img/lroc_10.webp", k:"orbital", n:"Luna 16", y:2012, id:"LROC #10", page:L(10), cr:LROC, v:["luna-16"], p:[["luna-16",50,49]], ar:1},
  lroc11:{f:"md/img/lroc_11.webp", k:"orbital", n:"Luna 20", y:2012, id:"LROC #9", page:L(9), cr:LROC, v:["luna-20"], p:[["luna-20",49,49]], ar:1},
  lroc12:{f:"md/img/lroc_12.webp", k:"orbital", n:"Luna 24", y:2012, id:"LROC #9", page:L(9), cr:LROC, v:["luna-24"], p:[["luna-24",47,46]], ar:1},
  lroc16b:{f:"md/img/lroc_16.webp", k:"orbital", n:"Chang'e-5", y:2020, id:"LROC #1172", page:L(1172), cr:LROC, v:["change-5"]}
};
/* Shots: s = start (s); a = asset key; z = Ken Burns [scale0, scale1, x%, y%]; card = reconstructed info card (labelled); pair/tri = side-by-side. */
const CH = [
 {id:"c1", audio:"md/audio/moon_01_first_explorers.mp3", score:"md/audio/moon_score_01.mp3", dur:48.77, mood:"md_mood1",
  shots:[{s:0,a:"fullmoon",z:[1.0,1.12,50,50]},{s:7.12,a:"ranger7",z:[1.05,1.2,50,45]},
   {s:9.96,card:"luna2",bg:"fullmoon",v:["luna-2"]},{s:17.96,card:"luna9",bg:"fullmoon",v:["luna-9"]},
   {s:24.48,a:"lroc01",z:[1.0,1.35,47,30]},{s:28.4,a:"s1shadow",z:[1.0,1.1,50,60]},{s:32.2,a:"surveyor3",z:[1.05,1.2,50,45]},
   {s:42.1,a:"lroc03",z:[1.0,1.25,52,55]}]},
 {id:"c2", audio:"md/audio/moon_02_apollo.mp3", score:"md/audio/moon_score_02.mp3", dur:53.97, mood:"md_mood2",
  shots:[{s:0,a:"a11launch",z:[1.05,1.18,50,40]},{s:3.68,a:"satv"},{s:10.04,a:"csm15",z:[1.0,1.15,50,50]},{s:13.46,a:"aldrin",z:[1.0,1.12,40,55]},
   {s:16.48,a:"a11step"},{s:21.54,a:"a11flag"},{s:26.54,a:"lroa11",z:[1.0,1.3,50,50]},{s:28.54,a:"a15lift"},
   {s:34.76,a:"herolrv",z:[1.0,1.12,50,55]},{s:38.58,a:"a15drive"},{s:46.24,a:"lrv15",z:[1.0,1.15,55,60]},{s:49.76,a:"hero",z:[1.0,1.1,50,50]},
   {s:52.42,a:"lroc04",z:[1.0,1.3,50,50]}]},
 {id:"c3", audio:"md/audio/moon_03_lunokhod.mp3", score:"md/audio/moon_score_03.mp3", dur:67.55, mood:"md_mood3",
  shots:[{s:0,a:"lroc09",z:[1.0,1.2,50,50]},{s:6.44,a:"lroc06",z:[1.0,1.3,47,48]},{s:11.82,a:"luna17",z:[1.0,1.15,40,50]},
   {s:15.98,a:"lroc05",z:[1.0,1.35,50,47]},{s:28.19,card:"lk1end",bg:"lroc05",v:["lunokhod-1"]},{s:32.44,a:"lroc05",z:[1.6,2.0,50,47]},
   {s:39.04,a:"luna21",z:[1.0,1.15,60,55]},{s:43.64,a:"lroc07",z:[1.0,1.35,49,49]},{s:49.08,a:"lroc09",z:[1.15,1.35,50,50]},
   {s:54.5,card:"lk2end",bg:"lroc07",v:["lunokhod-2"]},{s:58.62,pair:["lroc05","lroc07"]}]},
 {id:"c4", audio:"md/audio/moon_04_change.mp3", score:"md/audio/moon_score_04.mp3", dur:66.27, mood:"md_mood4",
  shots:[{s:0,a:"fullmoon",z:[1.12,1.0,50,50]},{s:4.2,card:"lro",bg:"lro",v:[]},{s:9.2,a:"lroc13",z:[1.0,1.35,51,52]},
   {s:20.16,a:"lroc14",z:[1.0,1.25,50,45]},{s:26.42,a:"lroc15",z:[1.0,1.2,50,50]},{s:42.02,a:"lroc16",z:[1.0,1.3,50,50]},
   {s:47.58,a:"lroc17",z:[1.0,1.3,50,50]},{s:53.84,pair:["lroc16","lroc17"]},{s:60.48,a:"orion",z:[1.0,1.1,50,50]}]},
 {id:"c5", audio:"md/audio/moon_05_chandrayaan.mp3", score:"md/audio/moon_score_05.mp3", dur:67.63, mood:"md_mood5",
  shots:[{s:0,a:"cy3loi"},{s:11.94,a:"cy3ramp"},{s:17.4,a:"cy3move"},{s:23.52,a:"cy3rot"},{s:28.1,a:"lroc18",z:[1.0,1.35,50,50]},
   {s:32.38,a:"lroc19",z:[1.0,1.15,47,50]},{s:36.4,a:"lroc19",z:[1.15,1.5,47,50]},{s:42.16,card:"lev",bg:"lroc19",v:["lev-1","lev-2","slim"]},
   {s:52.06,a:"isrop11"},{s:56.4,a:"isrop8"},{s:60.78,a:"cy3hop"}]},
 {id:"c6", audio:"md/audio/moon_06_silent_moon.mp3", score:"md/audio/moon_score_06.mp3", dur:80.35, mood:"md_mood6",
  shots:[{s:0,a:"scarp"},{s:9.3,a:"herolrv",z:[1.1,1.0,50,55]},{s:12.96,tri:["lroc05","lroc15","lroc18"]},
   {s:19.56,a:"lroc16b",z:[1.0,1.25,50,50]},{s:24.52,card:"crash",bg:"fullmoon",v:["surveyor-2","vikram-2","beresheet","hakuto-m1","luna-25","hakuto-m2"]},
   {s:30.74,a:"lro",z:[1.0,1.12,45,40]},{s:38.36,a:"earthrise",z:[1.0,1.12,50,60]},{s:49.82,a:"lroc04",z:[1.0,1.4,50,50]},
   {s:59.6,a:"lroc03",z:[1.0,1.2,50,52]},{s:66.0,a:"hero",z:[1.0,1.12,50,50]},{s:69.34,a:"boot",z:[1.0,1.15,50,50]},
   {s:73.38,a:"fullmoon",z:[1.0,0.85,50,50]},{s:77.88,card:"end",bg:null,v:[]}]}
];
/* What happened to each object on the Moon — the distinction the narration makes. Derived from the Hardware Locator records. */
const FATE = {};
const set = (f, ids) => ids.forEach(i => FATE[i] = f);
set("left", ["a11-lm","a11-lrrr","a11-psep","a12-lm","a12-alsep","a14-lm","a14-alsep","a14-lrrr","a15-lm","a15-alsep","a15-lrrr","a15-lrv","a16-lm","a16-alsep","a16-lrv","a17-lm","a17-alsep","a17-lrv"]);
set("done", ["luna-9","luna-16","luna-17","luna-20","luna-21","luna-24","surveyor-1","surveyor-3","surveyor-5","surveyor-6","surveyor-7","change-5","change-6","blue-ghost-1","lev-1","lev-2"]);
set("lost", ["lunokhod-1","lunokhod-2","yutu","vikram-3","pragyan","slim","im-1","im-2"]);
set("unk", ["change-3","change-4","yutu-2"]);
set("crash", ["surveyor-2","vikram-2","beresheet","hakuto-m1","luna-25","hakuto-m2"]);
set("impact", ["luna-2","ranger-7","ranger-8","ranger-9","a11-ascent","a12-ascent","a13-sivb","a14-ascent","a14-sivb","a15-ascent","a15-sivb","a16-sivb","a16-ascent","a17-ascent","a17-sivb","change-5-ascent","lcross","grail"]);
const AGENCY = {beresheet:"SpaceIL / IAI", "hakuto-m1":"ispace", "hakuto-m2":"ispace", "luna-25":"Roscosmos", lcross:"NASA", grail:"NASA"};
/* Two objects the Hardware Locator does not list separately (JAXA sources). */
const EXTRA = [
 {id:"lev-1", name:"LEV-1 (Lunar Excursion Vehicle 1)", mission:"slim", dest:"moon", cat:"robot", date:"2024-01-19", phys:"present", op:"inactive",
  what:"A small hopping probe carried by SLIM.", why:"To move across the surface by jumping and to communicate directly with Earth.",
  happened:"Released just before SLIM touched down; it hopped autonomously and relayed LEV-2's images to Earth.", src:["jaxaLev"], loc:[-13.316,25.251], acc:"landing-site-reference"},
 {id:"lev-2", name:"LEV-2 (SORA-Q)", mission:"slim", dest:"moon", cat:"robot", date:"2024-01-19", phys:"present", op:"inactive",
  what:"A ball-shaped miniature rover that transforms into a two-wheeled explorer.", why:"Fully autonomous exploration and imaging of SLIM on the surface.",
  happened:"Released just before SLIM touched down; it took images that included SLIM, sent to Earth through LEV-1.", src:["jaxaLev"], loc:[-13.316,25.251], acc:"landing-site-reference"}
];
/* Assets found during research but not integrated, with the reason. */
const NOTINT = [
 {ch:1, what:"Luna 2 / Luna 9 original spacecraft photographs and Luna 9 surface panoramas", src:"Soviet-era archives (reproduced by many secondary sites)", why:"No official source with clear reuse terms was found; not used. Shown as labelled data cards instead."},
 {ch:2, what:"Apollo 11 16 mm descent film (“The Eagle Has Landed”, NASA HQ film)", src:"https://images.nasa.gov/details/KSC-19690716-MH-NAS01-0001-The_Flight_of_Apollo_11_The_Eagle_Has_Landed-B_2140", why:"Public domain; not integrated in this version because of file size (existing Apollo 11 TV and 16 mm clips already cover the landing)."},
 {ch:3, what:"Lunokhod 1/2 surface panoramas", src:"lroc.im-ldi.com (hosted from a Russian archive site)", why:"Not a NASA image and reuse terms are unclear; not used."},
 {ch:4, what:"Chang'e-3/4/5/6 lander and Yutu/Yutu-2 rover camera images", src:"https://www.cnsa.gov.cn/english/", why:"CNSA reuse terms could not be confirmed; NASA LRO orbital images of the same sites are used instead."},
 {ch:5, what:"LEV-2 (SORA-Q) image of SLIM on the Moon", src:"https://global.jaxa.jp/press/2024/01/20240125-4_e.html", why:"Credited JAXA/TOMY/Sony Group Corporation/Doshisha University — jointly owned, outside JAXA's open educational terms; not used."},
 {ch:5, what:"SLIM navigation-camera and MBC images", src:"https://global.jaxa.jp/projects/sas/slim/", why:"(c) ISAS/JAXA, allowed for non-profit education; not downloaded in this version — LRO's orbital image of SLIM is used."},
 {ch:1, what:"Surveyor 7 from LRO (LROC #534)", src:"https://lroc.im-ldi.com/images/534", why:"Download failed; not used."}
];
return {SRC, A, CH, FATE, AGENCY, EXTRA, NOTINT, VERIFIED:"2026-11-07"};
})();
