/* Forgotten Explorers — human & scientific stories, loaded on demand (mission pages and #words).
   Kept separate from the mission database: every block is keyed by an existing FE_MISSIONS id.
   FE_FINDS   "What did it find?"  [title, explanation, date, why it matters, kind, image, source label, source url]
              kind: o = direct observation · m = measurement · i = scientific interpretation · h = hypothesis / still debated
              When no source is given, the mission's own primary reference (FE_MISSIONS refs[0]) is cited.
   FE_MINDS   "The minds behind the mission" — NASA- and ESA-led missions only. [name, role, contribution, why it matters, biography (Wikipedia slug or full URL), photo]
              photo is only set when an existing archive photograph actually shows that person.
   FE_WORDS   "The words that remain" — documented words only, original wording, with the primary or best available source.
   Records are in English; the interface around them is translated. */
(function () {
const W = s => "https://en.wikipedia.org/wiki/" + s;
window.FE_WIKI = W;
window.FE_FINDS = {
 "curiosity":[
  ["An ancient streambed", "Rounded pebbles cemented into rock outcrops (named Hottah and Link) could only have been shaped by water flowing over them, roughly ankle- to hip-deep.", "2012-09", "The first evidence of a flowing stream at the landing site, weeks after touchdown.", "i", "curiosity"],
  ["A lake that could have supported life", "Rock drilled at Yellowknife Bay contained clay minerals and the key ingredients for life — carbon, hydrogen, nitrogen, oxygen, phosphorus and sulfur — in water that was not too acidic or salty.", "2013-03", "The first time a mission showed that an ancient environment on Mars was habitable for microbes. Habitable does not mean inhabited.", "i", "gale"],
  ["Organic molecules in 3-billion-year-old rock", "The SAM laboratory heated mudstone samples and detected organic molecules preserved for billions of years.", "2018-06", "Organics can come from biology or from non-biological chemistry; finding them preserved shows Mars can keep such records.", "m", "mx/img/curiosity_mount_sharp.webp"],
  ["Methane that rises and falls with the seasons", "Repeated measurements found low background methane that varies over the Martian year.", "2018-06", "The source is unknown — geology and biology are both possible explanations, and the result is still being studied.", "h", null]],
 "perseverance":[
  ["Oxygen made from Martian air", "The MOXIE experiment split carbon dioxide and produced about 5.4 grams of oxygen on its first run.", "2021-04-20", "The first production of a resource from another planet's atmosphere — a step towards fuel and air for human crews.", "m", "perseverance"],
  ["A crater floor shaped by water", "The rocks on Jezero's floor turned out to be volcanic, later altered by water, rather than lake sediments as many expected.", "2022-08", "It pinned down Jezero's history and gave well-dated rocks for the sample collection.", "i", null],
  ["Samples sealed for Earth", "The rover cored and sealed rock and soil samples in tubes, leaving a depot of them on the surface.", "2021-09", "The first samples collected on another planet for possible return to Earth; return plans are uncertain.", "o", "mx/img/perseverance_tube_drill.webp"],
  ["A possible biosignature in 'Cheyava Falls'", "Rock sampled as 'Sapphire Canyon' contains mineral patterns that on Earth are often linked to microbes; NASA called it a potential biosignature.", "2025-09", "It is not proof of life: non-biological chemistry could also explain it, and laboratory study on Earth would be needed.", "h", null, "NASA", "https://science.nasa.gov/mission/mars-2020-perseverance/"]],
 "ingenuity":[
  ["The first powered flight on another planet", "The 1.8 kg helicopter rose about 3 metres, hovered and landed in Mars's thin air.", "2021-04-19", "It proved that aircraft can fly on Mars and went on to make 72 flights, scouting for the rover.", "o", "ingenuity"]],
 "opportunity":[
  ["Rocks soaked in water", "Layered rocks, the iron mineral hematite in small spheres ('blueberries') and the mineral jarosite showed that Meridiani Planum was once wet.", "2004-03-02", "The first rock-solid evidence of past liquid water found by a rover on Mars.", "i", "opportunity"],
  ["A meteorite on Mars", "An iron-nickel rock nicknamed 'Heat Shield Rock' was identified as a meteorite.", "2005-01", "The first meteorite ever identified on another planet.", "o", null],
  ["Gypsum veins at Endeavour", "A bright vein called 'Homestake' turned out to be gypsum deposited by water moving through cracks in the rock.", "2011-12", "Water that is less acidic than at earlier sites — a friendlier environment for life.", "i", "jr/img/PIA15035.jpg"]],
 "spirit":[
  ["Silica from hot springs or steam vents", "A stuck wheel churned up soil that was almost pure silica near 'Home Plate'.", "2007-05", "On Earth, such deposits form in hot springs or steam vents — environments that can support microbes.", "i", "spirit"],
  ["Carbonates in the Columbia Hills", "An outcrop called 'Comanche' was rich in carbonate minerals.", "2010-06", "Carbonates form in water that is not acidic, pointing to once-wet, neutral conditions.", "i", null]],
 "mars-pathfinder":[
  ["The first rover on Mars", "Sojourner analysed the chemistry of rocks and soil next to the lander.", "1997-07", "Proved that small rovers could explore Mars and opened the way for every rover since.", "o", "sojourner"],
  ["Signs of a wetter past", "Rounded pebbles and possible conglomerate rocks at Ares Vallis suggested water had once shaped the site.", "1997", "Supported the view that the landing site was an ancient flood plain.", "i", "pathfinder"]],
 "viking-1":[
  ["The first photographs from the surface of Mars", "Minutes after landing, the camera sent back an image of rocks and the lander's footpad.", "1976-07-20", "Humanity's first view from the ground of another planet beyond the Moon.", "o", "viking"],
  ["Life-detection experiments", "The biology experiments produced reactions in the soil, but the organic analyser found no organic molecules.", "1976", "Most scientists concluded the reactions were chemical, not biological; the results are still discussed.", "h", null],
  ["A fingerprint of Mars's air", "Viking measured the gases and isotopes of the Martian atmosphere.", "1976", "Gases trapped in certain meteorites later matched these measurements, proving that some meteorites on Earth came from Mars.", "m", null]],
 "insight":[
  ["The first marsquakes", "The seismometer recorded the first quake detected on Mars, and more than 1,300 in total.", "2019-04-06", "Mars is seismically active today.", "m", "insight"],
  ["A map of Mars's interior", "Quake waves revealed the thickness of the crust and the size of a liquid metal core.", "2021-07", "The first direct measurement of the inside of another rocky planet.", "i", null]],
 "phoenix":[
  ["Water ice just below the soil", "Bright chunks exposed in a trench disappeared in a few days, and the onboard oven confirmed water in a soil sample.", "2008-06", "The first time water ice was touched and confirmed on Mars.", "o", "mx/img/phoenix_ice.jpg"],
  ["Perchlorate in the soil", "The wet-chemistry laboratory found perchlorate salts.", "2008", "Perchlorate can destroy organic molecules when heated, which changed how Viking's results are interpreted.", "m", null],
  ["Snow from Martian clouds", "A laser instrument detected snow falling from clouds and vaporising before it reached the ground.", "2008-09", "A new look at Mars's water cycle.", "o", null]],
 "mro":[
  ["A spacecraft photographed while landing", "The HiRISE camera captured Phoenix descending under its parachute.", "2008-05-25", "The first image of a spacecraft landing on another planet.", "o", "phoenix"],
  ["Cliffs of buried ice", "Eroding slopes exposed thick sheets of water ice just beneath the surface at mid-latitudes.", "2018-01", "Accessible ice that future explorers could use.", "o", null]],
 "maven":[
  ["How Mars lost its air", "MAVEN measured how the solar wind strips gas from the upper atmosphere, faster during solar storms.", "2015-11", "Explains how Mars changed from a warmer, wetter world to the cold desert of today.", "m", "maven"]],
 "mariner-4":[
  ["The first close-up pictures of another planet", "21 images showed a cratered, Moon-like surface, and radio signals measured a very thin atmosphere.", "1965-07-15", "Ended the idea of canals and a lush Mars, and reset expectations for every later mission.", "o", "mariner4"]],
 "mariner-9":[
  ["Giant volcanoes and canyons", "The first spacecraft to orbit another planet waited out a global dust storm, then mapped Olympus Mons and the canyon system later named Valles Marineris.", "1971-11", "Revealed ancient river channels and a planet far more varied than earlier flybys suggested.", "o", "mx/img/mariner9_olympus_mons.jpg"]],
 "mars-express":[
  ["A possible lake under the south polar ice", "Radar echoes beneath the ice cap were interpreted as a layer of liquid, salty water.", "2018-07", "Still debated: other studies suggest the echoes could come from clays or frozen layers.", "h", null]],
 "apollo-11":[
  ["The first samples from the Moon", "The crew returned 21.5 kg of rock and soil, including volcanic basalts and fragments of a pale crustal rock.", "1969-07", "The samples led to the idea that the young Moon was covered by a magma ocean.", "i", "aldrin"],
  ["A mirror still in use", "The laser ranging retroreflector left at Tranquility Base reflects laser pulses fired from Earth.", "1969-07-21", "It shows the Moon is slowly moving away from Earth, about 3.8 cm a year.", "m", "easep"]],
 "apollo-12":[
  ["A Moon that rang like a bell", "When the empty ascent stage was crashed into the Moon, the seismometer left by the crew recorded vibrations for almost an hour.", "1969-11-20", "Showed that the Moon's crust is dry and fractured, letting seismic waves ring for a long time.", "m", null],
  ["Pieces of Surveyor 3 brought home", "Astronauts removed parts of the robotic lander that had been on the Moon for two and a half years.", "1969-11", "Engineers studied how materials age in space. A claim that bacteria survived inside is now thought to be contamination on Earth.", "h", "surveyor3"]],
 "apollo-15":[
  ["The 'Genesis Rock'", "Sample 15415, an anorthosite about 4 billion years old, came from the Moon's early crust.", "1971-08", "Supported the theory that the lunar crust formed from a magma ocean.", "i", null],
  ["Green volcanic glass", "Tiny beads of green glass were found in the soil.", "1971", "They come from ancient volcanic fire fountains erupting from deep inside the Moon.", "i", null]],
 "apollo-17":[
  ["Orange soil at Shorty crater", "Geologist Harrison Schmitt spotted orange soil, made of tiny volcanic glass beads.", "1972-12", "Evidence of explosive volcanic eruptions on the Moon billions of years ago.", "i", "hero_lrv"],
  ["The largest sample haul", "The crew returned about 110 kg of rock and soil from the Taurus–Littrow valley.", "1972-12", "Some sealed samples were opened only in 2022, for study with modern instruments.", "o", null]],
 "lro":[
  ["Apollo landing sites seen from orbit", "The camera photographed the Apollo hardware, astronaut footpaths and rover tracks.", "2009-07", "Independent orbital images of the six Apollo landing sites.", "o", "doc/img/lro_a11.jpg"],
  ["Some of the coldest places measured in the Solar System", "The Diviner instrument found the floors of permanently shadowed polar craters far colder than −200 °C.", "2009-09", "Such cold traps can preserve water ice for billions of years.", "m", null]],
 "grail":[
  ["The Moon's gravity in fine detail", "Two spacecraft measured tiny changes in the distance between them to map lunar gravity.", "2012-12", "Showed the crust is thinner and more broken up than expected.", "m", null]],
 "ladee":[
  ["A dust cloud around the Moon", "LADEE found a permanent, lopsided cloud of dust kicked up by meteoroid impacts.", "2015-06", "Helps explain the Moon's thin exosphere and the environment future explorers will meet.", "m", null]],
 "ranger-7":[
  ["The first U.S. close-up images of the Moon", "Before impact the spacecraft returned more than 4,000 photographs, the last from about 500 m above the surface.", "1964-07-31", "Showed craters down to about a metre across, helping plan safe landings.", "o", "ranger7"]],
 "surveyor-3":[
  ["Digging into the Moon", "A scoop dug trenches and pressed the soil.", "1967-04", "Showed the surface was firm enough to support a crewed lander.", "m", "surveyor3"]],
 "luna-3":[
  ["The first view of the far side", "Photographs developed on board revealed the side of the Moon never seen from Earth.", "1959-10", "The far side has very few of the dark plains that cover the near side.", "o", null]],
 "luna-9":[
  ["The first soft landing on another world", "The lander sent back panoramic photographs from the surface.", "1966-02", "Showed the Moon's surface could support a spacecraft, not a deep layer of dust.", "o", null]],
 "chandrayaan-1":[
  ["Water on the lunar surface", "NASA's Moon Mineralogy Mapper on board detected the signature of water and hydroxyl molecules across the surface.", "2009-09", "Changed the picture of a completely dry Moon.", "m", "m3"]],
 "chandrayaan-3":[
  ["Sulfur measured near the south pole", "The Pragyan rover's laser instrument confirmed sulfur in the lunar soil.", "2023-08", "The first such measurement made directly on the surface in the south polar region.", "m", null, "ISRO", "https://www.isro.gov.in/"]],
 "change-5":[
  ["Young volcanic rock", "Basalts returned to Earth are about two billion years old.", "2021", "Much younger than Apollo and Luna samples: the Moon stayed volcanically active longer than thought.", "i", null]],
 "change-6":[
  ["The first samples from the far side", "About 1.9 kg of material was returned from the South Pole–Aitken basin.", "2024-06-25", "Lets scientists compare the two hemispheres of the Moon directly.", "o", null]],
 "voyager-1":[
  ["Active volcanoes on Io", "Navigation engineer Linda Morabito spotted a plume rising from Io in a Voyager image.", "1979-03", "The first active volcanoes found beyond Earth.", "o", "voyager_launch"],
  ["Crossing into interstellar space", "Instruments detected the plasma of interstellar space.", "2012-08-25", "The first human-made object to leave the Sun's bubble of solar wind.", "m", null],
  ["The Pale Blue Dot", "Looking back from about 6 billion km, the camera captured Earth as a tiny point of light.", "1990-02-14", "One of the most famous images ever taken of our planet.", "o", "paleblue"]],
 "voyager-2":[
  ["The only visit to Uranus and Neptune", "Voyager 2 discovered new moons and rings and imaged Neptune's Great Dark Spot.", "1986–1989", "Almost everything known up close about the ice giants comes from these flybys.", "o", "neptune"],
  ["Geysers on Triton", "Images showed dark plumes erupting from Neptune's largest moon.", "1989-08", "Activity on one of the coldest surfaces in the Solar System.", "o", null]],
 "hubble":[
  ["An accelerating universe", "Hubble observations of distant supernovae helped show that the expansion of the universe is speeding up.", "1998", "Led to the idea of dark energy; the 2011 Nobel Prize recognised the discovery.", "i", "hubble_sts125"],
  ["The Hubble Deep Field", "Ten days of staring at a tiny patch of sky revealed thousands of galaxies.", "1995-12", "Showed how many galaxies fill the universe and how they changed over time.", "o", null]],
 "jwst":[
  ["Galaxies from the dawn of time", "Webb has measured galaxies seen as they were a few hundred million years after the Big Bang.", "2024", "Galaxies formed and grew bright earlier than many models predicted.", "m", "webb_carina"],
  ["Carbon dioxide on a distant planet", "Webb made the first clear detection of carbon dioxide in an exoplanet's atmosphere (WASP-39 b).", "2022-08", "Opens the way to reading the chemistry of worlds around other stars.", "m", null]],
 "cassini-huygens":[
  ["Ocean spray from Enceladus", "Cassini flew through jets of water ice erupting from the small moon's south pole.", "2005", "Evidence of a salty ocean beneath the ice — one of the best places to look for life.", "i", "cassini_earth"],
  ["Landing on Titan", "ESA's Huygens probe descended through the haze and photographed riverbeds and pebbles of ice.", "2005-01-14", "The most distant landing ever made.", "o", null],
  ["Lakes and seas of methane", "Radar revealed liquid methane and ethane lakes near Titan's poles.", "2006", "Titan is the only other known world with stable liquid on its surface.", "o", null]],
 "new-horizons":[
  ["Pluto is alive with geology", "Images showed a vast plain of nitrogen ice with no craters and mountains of water ice.", "2015-07-14", "A small, cold world can still be geologically active.", "o", "pluto"],
  ["Arrokoth, a building block of planets", "A flyby of a Kuiper Belt object revealed two lobes gently joined together.", "2019-01-01", "Shows how the first planetary building blocks came together.", "o", null]],
 "kepler":[
  ["Thousands of new worlds", "By watching stars dim as planets crossed in front of them, Kepler found thousands of planets.", "2009–2018", "Showed that planets are common and that small, rocky planets are among the most common kinds.", "m", null]],
 "juno":[
  ["Jupiter's polar cyclones", "Juno found clusters of giant cyclones arranged in geometric patterns around both poles.", "2018", "A structure seen nowhere else in the Solar System.", "o", "juno_crescent"]],
 "parker":[
  ["The closest approach to the Sun", "On 24 December 2024 the probe passed about 6.1 million km from the Sun's surface.", "2024-12-24", "The closest any spacecraft has come to a star, sampling the source of the solar wind.", "m", null],
  ["'Switchbacks' in the solar wind", "The probe found sudden S-shaped kinks in the Sun's magnetic field.", "2019", "Clues to how the solar wind is heated and accelerated.", "o", null]],
 "galileo":[
  ["An ocean under Europa's ice", "Magnetic measurements were best explained by a salty liquid ocean beneath the ice shell.", "1990s", "Made Europa a top target in the search for life and led to Europa Clipper.", "i", null],
  ["The first moon of an asteroid", "Galileo discovered tiny Dactyl orbiting asteroid Ida.", "1994", "Asteroids can have their own moons.", "o", null]],
 "messenger":[
  ["Ice at Mercury's poles", "Measurements confirmed water ice in permanently shadowed craters on the planet closest to the Sun.", "2012-11", "Even on the hottest planets, cold traps can hold ice.", "m", "mercury"]],
 "dawn":[
  ["The bright spots of Ceres", "The bright patches in Occator crater are mostly sodium carbonate salts.", "2016", "Left behind by salty water from below — Ceres was once, and may partly still be, wet inside.", "i", null]],
 "osiris-rex":[
  ["A sample from asteroid Bennu", "The capsule delivered about 121.6 g of rock and dust to Earth.", "2023-09-24", "The largest asteroid sample ever returned.", "o", "bennu"],
  ["Ingredients of life in Bennu", "Laboratory analysis found amino acids and all five nucleobases used in DNA and RNA.", "2025-01", "Shows such ingredients formed in space; it is not evidence of life on Bennu.", "m", null]],
 "rosetta":[
  ["The first landing on a comet", "The Philae lander touched down on comet 67P/Churyumov–Gerasimenko.", "2014-11-12", "A first in the history of space exploration.", "o", null],
  ["Comet water is not like ocean water", "Rosetta measured the ratio of heavy to normal hydrogen in the comet's water.", "2014-12", "It differs from Earth's oceans, suggesting comets like this one did not deliver most of Earth's water.", "i", null]],
 "explorer-1":[
  ["The Van Allen radiation belts", "James Van Allen's instrument detected intense radiation trapped around Earth.", "1958", "The first major discovery of the space age.", "m", null]],
 "sputnik-1":[
  ["The first artificial satellite", "Its radio signal was received around the world, and its changing orbit revealed the density of the upper atmosphere.", "1957-10-04", "The start of the space age.", "o", "sputnik"]]
};
window.FE_MINDS = {
 "apollo-11":[
  ["Neil Armstrong", "Commander", "Flew the lunar module Eagle by hand past a boulder field and was the first person to step onto the Moon.", "His steady piloting saved the landing with seconds of fuel margin.", "Neil_Armstrong"],
  ["Buzz Aldrin", "Lunar module pilot", "Second person on the Moon; set up the experiments and took most of the surface photographs.", "An expert in orbital rendezvous, a skill Apollo depended on.", "Buzz_Aldrin", "aldrin"],
  ["Michael Collins", "Command module pilot", "Flew Columbia alone in lunar orbit while his crewmates were on the surface.", "Without him there was no way home.", "Michael_Collins_(astronaut)"],
  ["Margaret Hamilton", "Software engineering lead, MIT Instrumentation Laboratory", "Led the team that developed the on-board flight software for the Apollo guidance computers.", "Her team's priority-based design let the computer keep flying during the 1202 alarms of the landing. She helped establish software engineering as a discipline.", "Margaret_Hamilton_(software_engineer)"],
  ["Gene Kranz", "Flight director", "Led the Mission Control team on shift during the landing.", "Made the final go decisions as Eagle descended.", "Gene_Kranz"],
  ["Steve Bales", "Guidance officer (GUIDO)", "Judged within seconds that the computer alarms were safe to fly through.", "His 'go' call kept the first landing alive.", "Steve_Bales"]],
 "apollo-8":[
  ["Frank Borman", "Commander", "Led the first crew to leave Earth orbit and circle the Moon.", "Proved that people could travel to the Moon and come back.", "Frank_Borman"],
  ["Jim Lovell", "Command module pilot and navigator", "Navigated the spacecraft to the Moon and back.", "Later commanded Apollo 13.", "Jim_Lovell"],
  ["William Anders", "Lunar module pilot", "Took the 'Earthrise' photograph.", "One of the most influential photographs ever made.", "William_Anders"]],
 "apollo-13":[
  ["Jim Lovell", "Commander", "Led the crew after an oxygen tank exploded on the way to the Moon.", "Brought a crippled spacecraft home safely.", "Jim_Lovell"],
  ["Jack Swigert", "Command module pilot", "Reported the explosion and helped power down and restart the command module.", "Joined the crew only days before launch.", "Jack_Swigert"],
  ["Fred Haise", "Lunar module pilot", "Helped run the lunar module as a lifeboat.", "The lander kept the crew alive for four days.", "Fred_Haise"],
  ["Gene Kranz", "Lead flight director", "Directed the Mission Control teams that worked out how to bring the crew home.", "A defining example of crisis management.", "Gene_Kranz"]],
 "apollo-17":[
  ["Eugene Cernan", "Commander", "Explored Taurus–Littrow and was the last person to walk on the Moon.", "Closed the Apollo era on the surface.", "Gene_Cernan", "hero_lrv"],
  ["Harrison Schmitt", "Lunar module pilot and geologist", "The only professional scientist to walk on the Moon; found the orange volcanic soil.", "Brought a geologist's eye to the field work.", "Harrison_Schmitt"],
  ["Ronald Evans", "Command module pilot", "Ran science experiments from lunar orbit.", "Mapped the Moon from America while his crewmates explored below.", "Ronald_Evans_(astronaut)"]],
 "saturn-v":[
  ["Wernher von Braun", "Director, Marshall Space Flight Center", "Led the development of the Saturn V rocket.", "The rocket launched every crewed Apollo mission to the Moon. His earlier V-2 work used forced labour, a history that is part of his record.", "Wernher_von_Braun"]],
 "explorer-1":[
  ["James Van Allen", "Physicist, University of Iowa", "Designed the cosmic-ray instrument on board.", "Discovered the radiation belts that now carry his name.", "James_Van_Allen"],
  ["William Pickering", "Director, Jet Propulsion Laboratory", "Led the team that built the satellite.", "Explorer 1 began America's space science programme.", "William_Hayward_Pickering"]],
 "voyager-1":[
  ["Ed Stone", "Project scientist (1972–2022)", "Led Voyager's science for 50 years.", "Guided the mission from the planets to interstellar space.", "Edward_C._Stone"],
  ["Carl Sagan", "Imaging team member", "Proposed turning the camera back towards Earth and led the Golden Record project.", "Gave the world the Pale Blue Dot.", "Carl_Sagan"],
  ["Linda Morabito", "Optical navigation engineer", "Discovered the volcanic plume on Io in a navigation image.", "The first active volcanism found beyond Earth.", "Linda_A._Morabito"],
  ["Gary Flandro", "Engineer, JPL", "In 1965 identified the rare planetary alignment that allowed a 'Grand Tour' of the outer planets.", "Made the Voyager trajectories possible.", "Gary_Flandro"]],
 "voyager-2":[
  ["Ed Stone", "Project scientist (1972–2022)", "Led Voyager's science through the Uranus and Neptune encounters.", "Guided the only visits to the ice giants.", "Edward_C._Stone"],
  ["Gary Flandro", "Engineer, JPL", "Identified the alignment that let one spacecraft visit Jupiter, Saturn, Uranus and Neptune.", "Voyager 2 flew that Grand Tour.", "Gary_Flandro"]],
 "mars-pathfinder":[
  ["Donna Shirley", "Manager, Mars Exploration Program, JPL", "Led the team that built the Sojourner rover.", "The first rover on another planet.", "Donna_Shirley"],
  ["Tony Spear", "Project manager", "Delivered the mission with a small budget and a new airbag landing.", "Pathfinder became the model for 'faster, better, cheaper' missions.", "Tony_Spear"]],
 "viking-1":[
  ["Gerald Soffen", "Project scientist", "Led the science programme, including the search for life.", "Viking shaped Mars science for decades.", "Gerald_Soffen"]],
 "spirit":[
  ["Steve Squyres", "Principal investigator", "Led the science team of both Mars Exploration Rovers.", "The rovers' discoveries transformed the picture of water on Mars.", "Steve_Squyres"]],
 "opportunity":[
  ["Steve Squyres", "Principal investigator", "Led the science team for more than 14 years of driving.", "Opportunity found the first rover evidence of past water.", "Steve_Squyres"],
  ["John Callas", "Project manager", "Managed the rovers through the end of the mission.", "Kept a 90-day rover working for over 14 years.", "John_Callas"]],
 "curiosity":[
  ["Adam Steltzner", "Lead, entry, descent and landing", "Led the team that developed the sky crane landing system.", "Lowered a car-sized rover onto Mars on cables.", "Adam_Steltzner"],
  ["John Grotzinger", "Project scientist", "Led the science that showed Gale crater once held a habitable lake.", "A landmark result in Mars science.", "John_P._Grotzinger"],
  ["Allen Chen", "Entry, descent and landing operations lead", "Announced the landing from mission control.", "His words became the moment the world heard Curiosity was safe.", "https://science.nasa.gov/resource/sounds-of-mars-touchdown-confirmed-were-safe-on-mars"]],
 "perseverance":[
  ["Swati Mohan", "Guidance, navigation and controls operations lead", "Led the work on the rover's vision-based landing navigation and called out the landing.", "Terrain-relative navigation let the rover land in a hazardous crater.", "Swati_Mohan"],
  ["Kenneth Farley", "Project scientist", "Led the science and sample-collection strategy.", "The samples are the first collected on another planet.", "Kenneth_Farley"]],
 "ingenuity":[
  ["MiMi Aung", "Project manager", "Led the team that built and flew the Mars helicopter.", "The first powered, controlled flight on another planet.", "MiMi_Aung"],
],
 "hubble":[
  ["Nancy Grace Roman", "First chief of astronomy at NASA", "Championed and planned the space telescope programme.", "Known as the 'mother of Hubble'.", "Nancy_Grace_Roman"],
  ["Lyman Spitzer", "Astrophysicist", "Proposed a large telescope in space in 1946.", "His idea became Hubble.", "Lyman_Spitzer"],
  ["Story Musgrave", "Astronaut, Servicing Mission 1", "Performed spacewalks that installed the optics correcting Hubble's flawed mirror.", "Rescued the telescope in 1993.", "Story_Musgrave"]],
 "jwst":[
  ["John Mather", "Senior project scientist", "Led the science of the telescope from its early design.", "A Nobel laureate in physics for earlier work on the cosmic background.", "John_C._Mather"]],
 "cassini-huygens":[
  ["Linda Spilker", "Project scientist", "Led Cassini's science through the end of the mission.", "Cassini changed what we know about Saturn and its moons.", "Linda_Spilker"],
  ["Carolyn Porco", "Imaging team leader", "Led the camera team.", "Her team's images revealed the jets of Enceladus.", "Carolyn_Porco"]],
 "new-horizons":[
  ["Alan Stern", "Principal investigator", "Led the mission from proposal to the flybys of Pluto and Arrokoth.", "The first exploration of the Pluto system.", "Alan_Stern"],
  ["Alice Bowman", "Mission operations manager", "Led the team that operated the spacecraft.", "The first woman in the role of mission operations manager at APL.", "Alice_Bowman"]],
 "kepler":[
  ["William Borucki", "Principal investigator", "Proposed and led the mission for years before it was approved.", "Kepler showed that planets are everywhere.", "William_J._Borucki"]],
 "parker":[
  ["Eugene Parker", "Astrophysicist", "Predicted the solar wind in 1958.", "The first NASA spacecraft named after a living person.", "Eugene_Parker"],
  ["Nicola Fox", "Project scientist", "Led the mission's science through its early years.", "Parker became the closest spacecraft to the Sun.", "Nicola_Fox"]],
 "juno":[
  ["Scott Bolton", "Principal investigator", "Leads the mission's science.", "Juno revealed Jupiter's interior and poles.", "Scott_J._Bolton"]],
 "artemis-2":[
  ["Reid Wiseman", "Commander", "Commanded the first crewed flight of the Artemis programme.", "Humans returned to the vicinity of the Moon for the first time since 1972.", "Reid_Wiseman"],
  ["Victor Glover", "Pilot", "Flew Orion around the Moon.", "The first Black astronaut to travel to the Moon.", "Victor_J._Glover"],
  ["Christina Koch", "Mission specialist", "Flew around the Moon on Orion.", "The first woman to travel to the Moon.", "Christina_Koch"],
  ["Jeremy Hansen", "Mission specialist (Canadian Space Agency)", "Flew around the Moon on Orion.", "The first non-American to travel to the Moon.", "Jeremy_Hansen"]],
 "rosetta":[
  ["Matt Taylor", "Project scientist", "Led Rosetta's science during its time at the comet.", "Rosetta followed a comet for two years.", "Matt_Taylor_(scientist)"],
]
};
window.FE_WORDS = [
 {who:"Yuri Gagarin", role:"Cosmonaut", mission:"vostok-1", date:"1961-04-12", q:"Поехали!", tr:"Let's go!", ctx:"Spoken at lift-off, as the first human was launched into space.", src:["NASA History — Remembering Yuri Gagarin", "https://www.nasa.gov/history/remembering-yuri-gagarin-50-years-later"]},
 {who:"John F. Kennedy", role:"President of the United States", mission:"saturn-v", date:"1962-09-12", q:"We choose to go to the Moon in this decade and do the other things, not because they are easy, but because they are hard…", ctx:"From his address at Rice University in Houston, setting the goal of a Moon landing.", src:["John F. Kennedy Presidential Library — Address at Rice University", "https://www.jfklibrary.org/learn/about-jfk/historic-speeches/address-at-rice-university-on-the-nations-space-effort"]},
 {who:"Frank Borman", role:"Commander, Apollo 8", mission:"apollo-8", date:"1968-12-25", q:"And from the crew of Apollo 8, we close with good night, good luck, a Merry Christmas – and God bless all of you, all of you on the good Earth.", ctx:"Closing the crew's Christmas Eve broadcast from lunar orbit (24 December in Houston).", src:["NASA Earth Observatory — All of You on the Good Earth", "https://earthobservatory.nasa.gov/images/144427/all-of-you-on-the-good-earth"], img:"earthrise"},
 {who:"Charles Duke", role:"Capsule communicator (CAPCOM), Mission Control", mission:"apollo-11", date:"1969-07-20", q:"We're Go on that alarm.", ctx:"Relaying the decision that the lunar module's 1202 computer alarm was safe to fly through during the descent.", src:["Apollo 11 Lunar Surface Journal — The First Lunar Landing", "https://www.nasa.gov/history/alsj/a11/a11.landing.html"]},
 {who:"Neil Armstrong", role:"Commander, Apollo 11", mission:"apollo-11", date:"1969-07-20", q:"Houston, Tranquility Base here. The Eagle has landed.", ctx:"The first words after the first crewed landing on the Moon.", src:["Apollo 11 Lunar Surface Journal — The First Lunar Landing", "https://www.nasa.gov/history/alsj/a11/a11.landing.html"]},
 {who:"Charles Duke", role:"Capsule communicator (CAPCOM), Mission Control", mission:"apollo-11", date:"1969-07-20", q:"Roger, Twan... Tranquility, we copy you on the ground. You got a bunch of guys about to turn blue. We're breathing again. Thanks a lot.", ctx:"Mission Control's reply to the landing call.", src:["Apollo 11 Lunar Surface Journal — The First Lunar Landing", "https://www.nasa.gov/history/alsj/a11/a11.landing.html"]},
 {who:"Neil Armstrong", role:"Commander, Apollo 11", mission:"apollo-11", date:"1969-07-21", q:"That's one small step for [a] man, one giant leap for mankind.", ctx:"Stepping from the footpad onto the lunar surface (02:56 UTC on 21 July; 20 July in the Americas). Armstrong said he intended 'a man'; the word is not clearly heard on the recording.", src:["Apollo 11 Lunar Surface Journal — One Small Step", "https://www.nasa.gov/history/alsj/a11/a11.step.html"], img:"doc/img/a11_bootprint.webp"},
 {who:"Buzz Aldrin", role:"Lunar module pilot, Apollo 11", mission:"apollo-11", date:"1969-07-21", q:"Beautiful view. … Magnificent desolation.", ctx:"His first words after joining Armstrong on the surface.", src:["Apollo 11 Lunar Surface Journal — One Small Step", "https://www.nasa.gov/history/alsj/a11/a11.step.html"], img:"aldrin", portrait:true},
 {who:"Apollo 11 crew and President Richard Nixon", role:"Plaque on the lunar module's descent stage", mission:"apollo-11", date:"1969-07", q:"Here men from the planet Earth first set foot upon the Moon, July 1969, A.D. We came in peace for all mankind.", ctx:"Inscription on the plaque left at Tranquility Base, signed by the three astronauts and the President.", src:["NASA — We Came in Peace for All Mankind", "https://www.nasa.gov/image-article/we-came-peace-all-mankind/"]},
 {who:"Jack Swigert and Jim Lovell", role:"Command module pilot and commander, Apollo 13", mission:"apollo-13", date:"1970-04-14", q:"Okay, Houston, we've had a problem here. … Houston, we've had a problem.", ctx:"Reporting the explosion of an oxygen tank on the way to the Moon (13 April in Houston). Swigert spoke first; Lovell repeated it. The film line 'we have a problem' is a later paraphrase.", src:["Apollo 13 Flight Journal — 'Houston, we've had a problem'", "https://www.nasa.gov/history/afj/ap13fj/08day3-problem.html"]},
 {who:"Eugene Cernan", role:"Commander, Apollo 17", mission:"apollo-17", date:"1972-12-14", q:"…we leave as we came and, God willing, as we shall return, with peace and hope for all mankind. Godspeed the crew of Apollo 17.", ctx:"The last words spoken on the Moon's surface before the crew climbed into the lunar module.", src:["Apollo 17 Lunar Surface Journal", "https://www.nasa.gov/wp-content/uploads/static/history/alsj/a17/a17.launch.html"], img:"hero_lrv", portrait:true},
 {who:"Carl Sagan", role:"Planetary scientist, Voyager imaging team", mission:"voyager-1", date:"1994", q:"Look again at that dot. That's here. That's home. That's us.", ctx:"From his book Pale Blue Dot, reflecting on the image of Earth that Voyager 1 took on 14 February 1990 at his suggestion.", src:["NASA — Voyager 1's Pale Blue Dot", "https://science.nasa.gov/mission/voyager/voyager-1s-pale-blue-dot"], img:"paleblue"},
 {who:"Allen Chen", role:"Entry, descent and landing operations lead, JPL", mission:"curiosity", date:"2012-08-06", q:"Touchdown confirmed. We're safe on Mars.", ctx:"Announcing in mission control that Curiosity had landed in Gale crater.", src:["NASA — Sounds of Mars: Touchdown confirmed, we're safe on Mars", "https://science.nasa.gov/resource/sounds-of-mars-touchdown-confirmed-were-safe-on-mars"], img:"curiosity"},
 {who:"Swati Mohan", role:"Guidance, navigation and controls operations lead, JPL", mission:"perseverance", date:"2021-02-18", q:"Touchdown confirmed. Perseverance safely on the surface of Mars, ready to begin seeking the signs of past life.", ctx:"Calling out the landing in Jezero crater.", src:["PBS NewsHour — NASA's Perseverance rover pulls off tricky landing on Mars", "https://www.pbs.org/newshour/science/nasas-perseverance-rover-pulls-off-tricky-landing-on-mars"], img:"perseverance"},
 {who:"MiMi Aung", role:"Ingenuity project manager, JPL", mission:"ingenuity", date:"2021-04-19", q:"We can now say that human beings have flown a rotorcraft on another planet.", ctx:"After the first powered, controlled flight on another planet.", src:["Scientific American — Liftoff! First Flight on Mars", "https://www.scientificamerican.com/article/liftoff-first-flight-on-mars-launches-new-way-to-explore-worlds/"], img:"ingenuity"}
];
})();
