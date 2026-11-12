/* (bundle) shared engineering data, then the Moon and Mars vehicle records — one request, loaded only when a Moon or Mars mission page opens */
/* Forgotten Explorers — vehicle hardware, scientific instruments and engineering specifications.
   Keyed by the existing FE_MISSIONS id (no duplicate vehicle records).
   Spec types: D = design / nominal value, M = measured or flown performance, R = reported by the agency (configuration not stated), E = estimate or approximate.
   Values that could not be confirmed in official sources are left out and shown as "Not publicly documented". */
(function () {
const S = window.FE_VEH_SRC = {
 alsj:["Apollo Lunar Surface Journal","https://www.nasa.gov/history/alsj/","NASA History Office"],
 a11lm:["Apollo 11 Lunar Module / EASEP","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C","NASA NSSDCA"],
 a12lm:["Apollo 12 Lunar Module / ALSEP","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C","NASA NSSDCA"],
 a17lm:["Apollo 17 Lunar Module / ALSEP","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-096C","NASA NSSDCA"],
 lroSites:["Apollo Landing Site Coordinates (LRO)","https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html","NASA NSSDCA"],
 impacts:["Table of Anthropogenic Impacts and Spacecraft on the Moon","https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_artifact_impacts.html","NASA NSSDCA"],
 surv1:["Surveyor 1","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1966-045A","NASA NSSDCA"],
 surv3:["Surveyor 3","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A","NASA NSSDCA"],
 luna9:["Luna 9","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1966-006A","NASA NSSDCA"],
 luna17:["Luna 17 / Lunokhod 1","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1970-095A","NASA NSSDCA"],
 luna21:["Luna 21 / Lunokhod 2","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1973-001A","NASA NSSDCA"],
 vl1:["Viking 1 Lander","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-075C","NASA NSSDCA"],
 vl2:["Viking 2 Lander","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-083C","NASA NSSDCA"],
 viking:["Viking Project","https://science.nasa.gov/mission/viking-1/","NASA Science"],
 mpf:["Mars Pathfinder (and Sojourner)","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A","NASA NSSDCA"],
 mpfS:["Mars Pathfinder","https://science.nasa.gov/mission/mars-pathfinder/","NASA Science"],
 mer:["Mars Exploration Rovers — Spirit and Opportunity","https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/","NASA Science"],
 merA:["Spirit (MER-A)","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A","NASA NSSDCA"],
 merB:["Opportunity (MER-B)","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A","NASA NSSDCA"],
 phx:["Phoenix Mars Lander","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-034A","NASA NSSDCA"],
 phxS:["Phoenix","https://science.nasa.gov/mission/mars-phoenix/","NASA Science"],
 msl:["Mars Science Laboratory — Curiosity","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-070A","NASA NSSDCA"],
 mslS:["Curiosity","https://science.nasa.gov/mission/msl-curiosity/","NASA Science"],
 m20:["Mars 2020 — Perseverance","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2020-052A","NASA NSSDCA"],
 m20S:["Perseverance","https://science.nasa.gov/mission/mars-2020-perseverance/","NASA Science"],
 heli:["Ingenuity Mars Helicopter","https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/","NASA Science"],
 nsyt:["InSight","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-042A","NASA NSSDCA"],
 nsytS:["InSight","https://science.nasa.gov/mission/insight/","NASA Science"],
 lro:["Lunar Reconnaissance Orbiter","https://science.nasa.gov/mission/lro/","NASA Science"],
 mro:["Mars Reconnaissance Orbiter","https://science.nasa.gov/mission/mars-reconnaissance-orbiter/","NASA Science"],
 ody:["2001 Mars Odyssey","https://science.nasa.gov/mission/odyssey/","NASA Science"],
 maven:["MAVEN","https://science.nasa.gov/mission/maven/","NASA Science"],
 mex:["Mars Express","https://www.esa.int/Science_Exploration/Space_Science/Mars_Express","ESA"],
 ce4:["Chang'e 4 — NSSDCA Chinese lunar missions","https://nssdc.gsfc.nasa.gov/planetary/lunar/cnsa_moon_future.html","NASA NSSDCA"],
 ce5:["Chang'e 5 — NSSDCA Chinese lunar missions","https://nssdc.gsfc.nasa.gov/planetary/lunar/cnsa_moon_future.html","NASA NSSDCA"],
 cnsa:["China National Space Administration","https://www.cnsa.gov.cn/english/","CNSA"],
 tw1:["Tianwen-1 — CNSA","https://www.cnsa.gov.cn/english/","CNSA"],
 ch3:["Chandrayaan-3","https://www.isro.gov.in/Chandrayaan3_Details.html","ISRO"],
 ch1:["Chandrayaan-1","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2008-052A","NASA NSSDCA"],
 ch2:["Chandrayaan-2","https://www.isro.gov.in/Chandrayaan2.html","ISRO"],
 isro:["Indian Space Research Organisation","https://www.isro.gov.in/","ISRO"],
 jaxa:["JAXA","https://global.jaxa.jp/","JAXA"],
 slim:["SLIM — Smart Lander for Investigating Moon","https://global.jaxa.jp/projects/sas/slim/","JAXA"],
 mom:["Mars Orbiter Mission","https://www.isro.gov.in/MarsOrbiterMissionSpacecraft.html","ISRO"],
 hope:["Emirates Mars Mission","https://www.emiratesmarsmission.ae/","UAE Space Agency / MBRSC"],
 mariner4:["Mariner 4","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1964-077A","NASA NSSDCA"],
 mars3:["Mars 3","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-049A","NASA NSSDCA"],
 luna2:["Luna 2","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1959-014A","NASA NSSDCA"],
 luna3:["Luna 3","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1959-008A","NASA NSSDCA"],
 ranger7:["Ranger 7","https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1964-041A","NASA NSSDCA"],
 a8:["Apollo 8","https://www.nasa.gov/mission/apollo-8/","NASA"],
 a11:["Apollo 11","https://www.nasa.gov/mission/apollo-11/","NASA"],
 a12:["Apollo 12","https://www.nasa.gov/mission/apollo-12/","NASA"],
 a17:["Apollo 17","https://www.nasa.gov/mission/apollo-17/","NASA"],
 art1:["Artemis I","https://www.nasa.gov/mission/artemis-i/","NASA"],
 art2:["Artemis II","https://www.nasa.gov/mission/artemis-ii/","NASA"],
 orion:["Orion spacecraft","https://www.nasa.gov/humans-in-space/orion-spacecraft/","NASA"],
 esm:["European Service Module","https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Orion","ESA"],
 satv:["Saturn V","https://www.nasa.gov/history/","NASA History Office"],
 lroc:["Apollo landing sites seen by LRO","https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html","NASA NSSDCA"]
};
/* record helpers — H(category, name, function, how it works, significance, specs, extra) ; I(category, name, abbr, purpose, how, measures, data, results, status, extra) */
const H = (c, n, f, h, s, sp, x) => Object.assign({c, n, f, h, s, sp:sp || null}, x || {});
const I = (c, n, a, p, h, m, d, r, st, x) => Object.assign({c, n, a, p, h, m, d, r, st}, x || {});
const SP = (k, v, t) => [k, v, t || "R"];   // spec row: label, value (null = not publicly documented), type
window.FE_VEH_H = H; window.FE_VEH_I = I; window.FE_VEH_SP = SP;

/* ── shared building blocks ── */
const LM = (name, src, fate) => [
 H("structure","Descent stage",`The lower half of the Lunar Module (${name}): an octagonal aluminium structure holding the descent engine, propellant tanks and stowage bays.`,"It carried the LM from lunar orbit to the surface, then served as the launch platform for the ascent stage.","Every Apollo descent stage was deliberately left on the Moon; they are the largest human-made objects on its surface.",null,{src:[src,"lroSites"],fate}),
 H("structure","Ascent stage (crew cabin)","Pressurised crew compartment with the ascent engine, flight controls, windows and hatches.","It separated from the descent stage at lift-off and flew the crew back to the Command Module in lunar orbit.","The first crewed vehicle designed to operate only in space; it never had to survive Earth's atmosphere.",null,{src:[src]}),
 H("mobility","Landing gear","Four legs with crushable aluminium-honeycomb struts and wide footpads.","On touchdown the honeycomb cartridges crushed to absorb the impact; probes under three footpads signalled surface contact.","Footpad size and stroke were chosen before the lunar soil's strength was known, using data from Surveyor and Luna landers.",null,{src:[src]}),
 H("propulsion","Descent Propulsion System","Throttleable rocket engine burning hypergolic propellants (Aerozine 50 and nitrogen tetroxide).","The crew and guidance computer throttled the engine to slow the descent and hover before touchdown.","The first throttleable rocket engine used for a crewed landing.","Maximum thrust about 45 kN (design)",{src:[src]}),
 H("propulsion","Reaction Control System","Sixteen small thrusters in four quads around the ascent stage.","Short pulses rotated and translated the LM for attitude control, docking and fine manoeuvres.","Allowed precise manual control of the vehicle during landing and rendezvous.",null,{src:[src]}),
 H("nav","Primary guidance, navigation and control","Apollo Guidance Computer with inertial measurement unit, plus a separate abort guidance system.","The computer combined inertial data with landing-radar measurements to steer the descent.","A landmark in digital flight control and real-time software.",null,{src:[src,"alsj"]}),
 H("nav","Landing radar","Doppler radar on the descent stage.","It measured altitude and velocity relative to the surface and fed them to the guidance computer.","Removed the need to rely only on inertial estimates in the final kilometres of descent.",null,{src:[src]}),
 H("power","Batteries","Silver-zinc batteries in both stages.","Supplied all electrical power; the LM had no solar panels or fuel cells.","Battery capacity limited how long the LM could stay on the surface.",null,{src:[src]}),
 H("comms","S-band steerable antenna","Dish antenna on the ascent stage.","Sent voice, telemetry and television directly to Earth's tracking stations.","Carried the first television from the lunar surface (Apollo 11).",null,{src:[src]})
];
const EASEP = [
 I("geo","Passive Seismic Experiment Package","PSEP","Detect moonquakes and meteoroid impacts.","A solar-powered seismometer recorded ground motion and radioed it to Earth.","Ground vibration","Seismic time series","Recorded the first lunar seismic signals before it stopped responding to commands in August 1969.","Inactive",{src:["a11lm","alsj"],img:"a11_psep"}),
 I("geo","Laser Ranging Retroreflector","LRRR","Measure the Earth–Moon distance precisely.","An array of 100 fused-silica corner-cube prisms reflects laser pulses straight back to the observatory that sent them; timing the return gives the distance.","Round-trip light travel time","Range measurements","Still used today; lunar laser ranging tests gravity theory and tracks the Moon's slow recession from Earth.","Operational (passive)",{src:["a11lm","impacts"],img:"easep"})
];
const SWC = I("sample","Solar Wind Composition experiment","SWC","Capture particles of the solar wind.","A sheet of aluminium foil was exposed to the Sun on a pole, then rolled up and returned to Earth for laboratory analysis.","Noble-gas ions from the Sun","Isotopic abundances","Measured solar-wind helium, neon and argon isotopes.","Returned to Earth",{src:["alsj"]});
const ALSEP_SNAP = H("power","SNAP-27 radioisotope generator","Plutonium-238 thermoelectric generator powering the ALSEP station.","Heat from radioactive decay was converted to electricity by thermocouples.","Let experiment stations run through the two-week lunar night for years.","About 70 W at deployment (design)",{src:["alsj"]});
const ALSEP_CS = H("comms","ALSEP central station","Electronics package with antenna that controlled the experiments.","It collected experiment data and sent it to Earth; commands came back the same way.","All ALSEP stations were switched off from Earth on 30 September 1977.",null,{src:["alsj"],img:"alsep12"});
const SURVEYOR = (src, img) => [
 H("structure","Triangular tubular frame","Aluminium spaceframe carrying all subsystems.","Equipment compartments and antennas were mounted on a lightweight triangular structure.","Kept the lander light enough for Atlas-Centaur to send it directly to the Moon.",null,{src:[src]}),
 H("mobility","Three landing legs","Legs with shock absorbers and crushable footpads.","They absorbed the landing load; strain gauges recorded how the soil responded.","Showed that the lunar surface could support a crewed lander.",null,{src:[src]}),
 H("propulsion","Solid retro-rocket and vernier engines","A solid-fuel main retro-rocket plus three throttleable liquid vernier engines.","The retro-rocket removed most of the approach speed and was jettisoned; the verniers controlled the final descent.","Demonstrated automatic soft landing for the United States.",null,{src:[src]}),
 H("nav","Radar altimeter and Doppler velocity sensor","Radar system for the descent.","Measured altitude and velocity so the autopilot could control the verniers.","Its guidance approach informed later landers.",null,{src:[src]}),
 H("power","Solar panel and batteries","A single solar panel with rechargeable batteries.","Generated power during the lunar day; the batteries carried peak loads.","Lunar nights ended normal operations.",null,{src:[src]}),
 H("comms","Planar-array antenna and omnidirectional antennas","High-gain planar antenna plus two omnidirectional antennas.","Sent television pictures and telemetry directly to Earth.","Television was the main science return.",null,{src:[src]})
];
const SURV_TV = (src, res) => I("img","Television camera","TV","Survey the landing site.","A vidicon camera looked into a movable mirror to build panoramas frame by frame.","Surface appearance, rocks, soil","Television frames",res,"Inactive",{src:[src]});
const LUNOKHOD = (src, n) => [
 H("structure","Pressurised instrument compartment","Tub-shaped sealed body with a hinged lid.","Kept electronics at a controlled temperature in a nitrogen atmosphere.","A design that let electronics survive the lunar environment.",null,{src:[src]}),
 H("mobility","Eight-wheel chassis","Eight wheels, each with its own electric motor, brake and suspension.","Differential driving steered the rover; it could keep moving if a wheel failed.",`Driven remotely from Earth by a five-person crew${n === 2 ? "; Lunokhod 2 covered about 39 km" : "; Lunokhod 1 covered about 10.5 km"}.`,null,{src:[src]}),
 H("power","Solar panel in the lid","Solar cells on the inside of the hinged lid.","Opened during the lunar day to charge batteries; closed at night.","Power for driving and instruments.",null,{src:[src]}),
 H("thermal","Polonium-210 heat source","Radioisotope heater.","Kept the compartment warm through the lunar night.","Allowed months of operation across many lunar nights.",null,{src:[src]}),
 H("nav","Television navigation cameras","Two television cameras for driving.","Sent images to the drivers in the Soviet Union, with a delay of several seconds.","Teleoperation of a vehicle on another world.",null,{src:[src]})
];
const LUNOKHOD_INS = (src, n) => [
 I("img","Panoramic telephotometers","—","Image the landscape around the rover.","Scanning cameras built panoramas line by line.","Surface appearance","Panoramic images","Documented the Mare Imbrium and Le Monnier landscapes.","Inactive",{src:[src]}),
 I("chem","RIFMA X-ray fluorescence spectrometer","RIFMA","Measure soil chemistry.","Radioactive sources excited the soil; emitted X-rays revealed elements.","Elemental composition","Spectra","Measured the composition of mare soils along the traverse.","Inactive",{src:[src]}),
 I("geo","Penetrometer","PrOP","Test soil mechanical properties.","A cone pressed into the soil measured resistance.","Bearing strength","Force measurements","Characterised regolith along the route.","Inactive",{src:[src]}),
 I("geo","Laser retroreflector (France)","—","Laser ranging from Earth.","Corner-cube reflectors return laser pulses.","Light travel time","Range measurements",n === 1 ? "Lost for decades, then located with LRO images in 2010 and reflected pulses again." : "Still used by laser-ranging observatories.","Operational (passive)",{src:[src]}),
 ...(n === 2 ? [I("geo","Magnetometer","—","Measure local magnetic fields.","A fluxgate sensor on a boom measured the field.","Magnetic field","Field measurements","Measured magnetic fields along the traverse.","Inactive",{src:[src]}), I("env","Astrophotometer","—","Measure sky brightness.","Photometers measured visible and ultraviolet light.","Sky brightness","Photometry","Measured the brightness of the lunar sky in visible and ultraviolet light.","Inactive",{src:[src]})]
            : [I("rad","X-ray telescope","RT-1","Observe cosmic X-ray sources.","An X-ray detector pointed at the sky.","Cosmic X-rays","Count rates","Early X-ray astronomy from the lunar surface.","Inactive",{src:[src]})])
];
const VIKING = (src, n) => [
 H("structure","Lander body","Six-sided aluminium and titanium body.","Housed computers, instruments and the sampling system.","Twin landers built to the same design.",null,{src:[src,"viking"]}),
 H("propulsion","Terminal descent engines","Three engines, each with 18 small nozzles.","The many nozzles spread the exhaust so it would not dig into or contaminate the soil to be sampled.","An engineering answer to a science requirement.",null,{src:[src]}),
 H("structure","Aeroshell and parachute","Heat shield plus a parachute for entry and descent.","Slowed the lander in the atmosphere before the engines took over.","First successful US Mars entry system.",null,{src:[src]}),
 H("power","Two SNAP-19 radioisotope generators","Plutonium-238 thermoelectric generators.","Converted decay heat into electricity day and night.",`Powered the lander for years; ${n === 1 ? "Viking 1 operated until November 1982" : "Viking 2 operated until April 1980, when its batteries failed"}.`,null,{src:[src]}),
 H("comms","High-gain and UHF antennas","S-band dish for direct-to-Earth links plus a UHF relay antenna.","Sent data to Earth directly or through the Viking orbiter.","Early example of orbiter relay at Mars.",null,{src:[src]}),
 H("robotic","Surface sampler arm","Extendable boom with a collector head.","Dug trenches and delivered soil to the instruments.","First robotic arm to sample Martian soil.",null,{src:[src]})
];
const VIKING_INS = (src, n) => [
 I("img","Facsimile cameras","—","Image the landing site.","Two scanning cameras built pictures one line at a time.","Colour and stereo images","Images","Returned the first pictures from the surface of Mars.","Inactive",{src:[src]}),
 I("chem","Biology instrument","—","Search for microbial metabolism.","Three experiments (Gas Exchange, Labeled Release, Pyrolytic Release) incubated soil samples.","Gases released by soil","Gas measurements","Results were chemically active but are generally interpreted as non-biological.","Inactive",{src:[src]}),
 I("chem","Gas chromatograph–mass spectrometer","GCMS","Look for organic molecules and analyse the atmosphere.","Heated soil and separated the vapours by molecule.","Organic compounds, atmospheric gases","Mass spectra","Found no organic molecules at the parts-per-billion level in the samples analysed.","Inactive",{src:[src]}),
 I("chem","X-ray fluorescence spectrometer","XRFS","Measure soil chemistry.","Radioactive sources excited soil samples; emitted X-rays revealed elements.","Elemental composition","Spectra","Measured iron-rich soils.","Inactive",{src:[src]}),
 I("atmo","Meteorology instruments","—","Measure weather.","Sensors on a boom measured temperature, pressure and wind.","Temperature, pressure, wind","Weather time series","Recorded seasonal pressure cycles caused by carbon dioxide freezing at the poles.","Inactive",{src:[src]}),
 I("geo","Seismometer","—","Detect marsquakes.","A three-axis seismometer on the lander deck.","Ground vibration","Seismic records",n === 1 ? "Viking 1's seismometer did not uncage after landing." : "Operated, but recorded mostly wind-driven lander motion.", "Inactive",{src:[src]})
];
const MER = (src, twin) => [
 H("structure","Warm Electronics Box (rover body)","Insulated body holding computers, batteries and electronics.","Insulation and radioisotope heater units kept electronics within their temperature limits.","Its design shaped all later NASA rovers.",null,{src:[src,"mer"]}),
 H("mobility","Six-wheel rocker-bogie suspension","Six wheels, each with its own motor; four corner wheels steer.","The rocker-bogie linkage keeps all wheels on the ground over obstacles.","Heritage from Sojourner, scaled up.","Top speed about 5 cm/s on flat ground (design)",{src:[src,"mer"]}),
 H("power","Solar arrays and lithium-ion batteries","Deployable solar panels plus rechargeable batteries.","Generated power in daylight and stored it for the night.","Dust-clearing wind events extended both missions far beyond the planned 90 sols.",null,{src:[src,"mer"]}),
 H("comms","High-gain, low-gain and UHF antennas","X-band dish, omnidirectional antenna and UHF relay antenna.","Talked directly to Earth or relayed through Mars orbiters.","Most data returned via orbiter relay.",null,{src:[src,"mer"]}),
 H("nav","Pancam Mast Assembly with Navcams; Hazcams","Mast carrying the panoramic and navigation cameras; hazard cameras on the body.","Stereo images let the rover build terrain maps and drive autonomously.","Early autonomous navigation on Mars.",null,{src:[src,"mer"]}),
 H("robotic","Instrument Deployment Device (robotic arm)","Five-joint arm carrying four tools on a turret.","Placed the Microscopic Imager, APXS, Mössbauer spectrometer and RAT against rocks.","Enabled close-up geology of individual rocks.",null,{src:[src,"mer"]})
];
const MER_INS = (src, extra) => [
 I("img","Panoramic Camera","Pancam","High-resolution colour and stereo imaging.","Two cameras on the mast with filter wheels.","Landscape colour and texture","Images and panoramas","Thousands of panoramas, including the rover self-portraits.","Inactive",{src:[src,"mer"]}),
 I("spectro","Miniature Thermal Emission Spectrometer","Mini-TES","Identify minerals from a distance.","Measured infrared light emitted by rocks and soil.","Mineralogy, atmospheric temperature","Infrared spectra","Helped target rocks for close study.","Inactive",{src:[src,"mer"]}),
 I("spectro","Mössbauer spectrometer","MB","Identify iron-bearing minerals.","A cobalt-57 source illuminated rock; gamma-ray absorption revealed iron minerals.","Iron mineralogy","Spectra","Key evidence for water-related minerals.","Inactive",{src:[src,"mer"]}),
 I("chem","Alpha Particle X-ray Spectrometer","APXS","Measure rock and soil chemistry.","Curium-244 sources excited the sample; emitted X-rays and alpha particles revealed elements.","Elemental composition","Spectra","Measured composition along both traverses.","Inactive",{src:[src,"mer"]}),
 I("img","Microscopic Imager","MI","Close-up images of rock textures.","A fixed-focus camera on the arm.","Grain size, textures","Micro-scale images","Imaged layered rocks and spherules.","Inactive",{src:[src,"mer"]}),
 I("sample","Rock Abrasion Tool","RAT","Expose fresh rock under the weathered surface.","Grinding wheels brushed and ground a shallow circular patch.","—","Prepared surfaces for other instruments","Allowed analysis of rock interiors.","Inactive",{src:[src,"mer"]}),
 ...(extra || [])
];
const ORION = (src) => [
 H("structure","Crew Module","Capsule for the crew, with docking hatch and cockpit displays.","Pressurised cabin with life support; the only part of Orion that returns to Earth.","NASA's deep-space crew capsule.",null,{src:[src,"orion"]}),
 H("thermal","Heat shield","Avcoat ablative heat shield about 5 m across.","Ablates during re-entry, carrying heat away from the capsule.","Protects the crew during re-entry at lunar-return speed.",null,{src:[src,"orion"]}),
 H("propulsion","European Service Module","Propulsion, power, water and air supply built by ESA and Airbus.","Its main engine and thrusters manoeuvre Orion between Earth and the Moon.","International partnership in crewed exploration.",null,{src:[src,"esm"]}),
 H("power","Four solar array wings","Solar arrays on the European Service Module.","Generate electricity for the spacecraft.","Orion's power source beyond Earth orbit.",null,{src:[src,"esm"]}),
 H("structure","Launch Abort System","Tower of solid rocket motors above the capsule.","Can pull the crew module away from the rocket in an emergency; jettisoned after a safe ascent.","Crew safety during launch.",null,{src:[src,"orion"]})
];

window.FE_VEH = {};
window.FE_VEH_PARTS = {LM, EASEP, SWC, ALSEP_SNAP, ALSEP_CS, SURVEYOR, SURV_TV, LUNOKHOD, LUNOKHOD_INS, VIKING, VIKING_INS, MER, MER_INS, ORION};
})();

/* Forgotten Explorers — Moon vehicles: hardware, instruments, specifications (keyed by FE_MISSIONS id). */
(function () {
const H = window.FE_VEH_H, I = window.FE_VEH_I, SP = window.FE_VEH_SP, P = window.FE_VEH_PARTS, V = window.FE_VEH;
const ND = null; // not publicly documented

V["luna-2"] = {level:1, vehicles:["Luna 2 spacecraft (impactor)"],
 overview:"A spherical pressurised spacecraft that flew directly into the Moon. It carried radiation and magnetic-field instruments and metal pennants bearing the Soviet coat of arms.",
 hw:[
  H("structure","Spherical pressurised body","Sealed sphere holding instruments, radio and batteries.","Kept electronics in a controlled environment during the flight.","Typical of the first Soviet lunar probes.",null,{src:["luna2"]}),
  H("power","Batteries","Chemical batteries.","Supplied power for the short flight.","No solar power was needed for a mission of about a day and a half.",null,{src:["luna2"]}),
  H("comms","Radio transmitters and antennas","Antennas on the sphere.","Sent telemetry to Earth until impact.","Tracking confirmed the impact.",null,{src:["luna2"]}),
  H("structure","Pennants","Metal pennants with the Soviet coat of arms.","Carried to the surface as a national emblem.","The first human-made objects on another world.",null,{src:["luna2"]})],
 ins:[
  I("env","Magnetometer","—","Search for a lunar magnetic field.","A three-component fluxgate magnetometer measured the field along the trajectory.","Magnetic field","Field measurements","Found no significant global magnetic field near the Moon.","Destroyed on impact",{src:["luna2"]}),
  I("rad","Geiger and scintillation counters","—","Measure charged-particle radiation.","Counters registered particles passing through detectors.","Radiation intensity","Count rates","Mapped radiation between Earth and the Moon.","Destroyed on impact",{src:["luna2"]}),
  I("env","Micrometeorite detectors and ion traps","—","Measure dust and plasma.","Detectors registered impacts and charged particles.","Dust, solar wind","Counts","Early measurements of the solar wind.","Destroyed on impact",{src:["luna2"]})],
 specs:[SP("Mass","390.2 kg","R"),SP("Power source","Batteries","R"),SP("Mobility","None (impact probe)","R"),SP("Arrival","13 September 1959 (impact)","R"),SP("Operating location","Impact near Palus Putredinis (approximate)","E")],
 status:{kind:"impacted",text:"Destroyed by its planned impact. The impact point is approximate."}, src:["luna2","impacts"]};

V["luna-3"] = {level:1, vehicles:["Luna 3 spacecraft"],
 overview:"A cylindrical spacecraft that photographed the far side of the Moon for the first time, developing film on board and scanning it for transmission.",
 hw:[
  H("structure","Cylindrical pressurised body","Sealed cylinder with hemispherical ends.","Held the camera system, radio and batteries at a controlled temperature.","",null,{src:["luna3"]}),
  H("power","Solar cells and batteries","Solar cells on the outside of the body.","Charged the batteries.","",null,{src:["luna3"]}),
  H("nav","Attitude control system","Sun and Moon sensors with gas jets.","Turned the spacecraft so the cameras faced the Moon.","One of the first spacecraft to be oriented automatically for photography.",null,{src:["luna3"]}),
  H("comms","Radio system","Transmitter and antennas.","Sent scanned images back to Earth.","",null,{src:["luna3"]})],
 ins:[
  I("img","Photographic-television system","—","Photograph the far side.","Two lenses exposed film, which was developed and dried on board, then scanned by a light beam and transmitted.","Visible light","Film images (transmitted as scans)","Returned the first images of the far side, revealing few maria.","Contact lost October 1959",{src:["luna3"]}),
  I("rad","Radiation and micrometeoroid detectors","—","Measure the space environment.","Counters and impact detectors.","Particles, dust","Counts","Space-environment measurements.","Contact lost",{src:["luna3"]})],
 specs:[SP("Mass","278.5 kg","R"),SP("Power source","Solar cells and batteries","R"),SP("Mobility","None (orbiting probe)","R")],
 status:{kind:"lost",text:"Contact was lost on 22 October 1959; the spacecraft later re-entered."}, src:["luna3"]};

V["ranger-7"] = {level:1, vehicles:["Ranger 7 spacecraft (impactor)"],
 overview:"A television spacecraft that photographed the Moon in the final minutes before it crashed, returning the first close-up US images of the surface.",
 hw:[
  H("structure","Hexagonal base and tower","Aluminium hexagonal frame with a cone-shaped tower housing the cameras.","Carried subsystems around the camera tower.","",null,{src:["ranger7"]}),
  H("power","Two solar panels and batteries","Fold-out solar panels.","Powered the spacecraft during cruise; batteries powered the camera system.","",null,{src:["ranger7"]}),
  H("comms","High-gain dish antenna","Dish antenna.","Sent television pictures to Earth in real time before impact.","",null,{src:["ranger7"]}),
  H("propulsion","Mid-course correction engine","Monopropellant engine.","Adjusted the trajectory toward the target area.","",null,{src:["ranger7"]})],
 ins:[I("img","Television camera system","F and P cameras","Photograph the surface at decreasing altitude.","Six vidicon cameras (two full-scan, four partial-scan) imaged continuously until impact.","Surface features down to metre scale","Television frames","Returned 4,308 images; the last showed details under a metre across.","Destroyed on impact",{src:["ranger7"]})],
 specs:[SP("Mass","365.7 kg","R"),SP("Power source","Solar panels and batteries","R"),SP("Mobility","None (impact probe)","R"),SP("Arrival","31 July 1964 (impact)","R")],
 status:{kind:"impacted",text:"Destroyed by its planned impact in Mare Cognitum."}, src:["ranger7","impacts"]};

V["luna-9"] = {level:1, vehicles:["Luna 9 landing capsule","Luna 9 cruise stage (discarded)"],
 overview:"A spherical capsule cushioned by airbags made the first soft landing on another world, then opened four petals to stand upright and transmitted panoramic images.",
 hw:[
  H("structure","Landing capsule","Spherical capsule of about 99 kg.","Ejected just before touchdown, it bounced on inflated airbags, then opened four petals that righted it.","First soft landing on another world.","Mass about 99 kg (reported)",{src:["luna9"]}),
  H("mobility","Airbags","Inflatable bags around the capsule.","Absorbed the landing impact.","An early airbag landing system.",null,{src:["luna9"]}),
  H("comms","Antennas","Spring-loaded antennas on the capsule.","Deployed after landing to transmit to Earth.","",null,{src:["luna9"]}),
  H("power","Batteries","Chemical batteries.","Powered the capsule for about three days.","",null,{src:["luna9"]})],
 ins:[
  I("img","Panoramic camera","—","Photograph the landing site.","An optical-mechanical scanner with a rotating mirror built panoramas line by line.","Surface appearance","Panoramic images","The first images from the lunar surface showed it could support a lander.","Inactive",{src:["luna9"]}),
  I("rad","Radiation detector","—","Measure surface radiation dose.","A gas-discharge counter.","Radiation","Dose","Measured radiation at the surface.","Inactive",{src:["luna9"]})],
 specs:[SP("Mass","1,538 kg (spacecraft at launch); about 99 kg landing capsule","R"),SP("Power source","Batteries","R"),SP("Mobility","None","R"),SP("Landing","3 February 1966","R"),SP("Mission duration","About 3 days on the surface","M"),SP("Operating location","Oceanus Procellarum (published coordinates do not match images; approximate)","E")],
 status:{kind:"left",text:"Batteries depleted; the capsule remains on the surface. Its exact position is not confirmed."}, src:["luna9","impacts"]};

V["surveyor-1"] = {level:1, vehicles:["Surveyor 1 lander"],
 overview:"The first US soft lander on the Moon. A three-legged robotic lander that tested landing techniques for Apollo and returned thousands of television pictures.",
 hw:P.SURVEYOR("surv1"),
 ins:[P.SURV_TV("surv1","Returned thousands of images over two lunar days."), I("geo","Strain gauges on the legs","—","Measure the landing load and soil response.","Gauges recorded forces in the legs during touchdown.","Landing dynamics","Engineering data","Showed the soil was firm enough for Apollo.","Inactive",{src:["surv1"]})],
 specs:[SP("Mass","About 995 kg at launch","R"),SP("Power source","Solar panel and batteries","R"),SP("Mobility","Three landing legs (stationary)","R"),SP("Landing","2 June 1966","R"),SP("Mission duration","Contact ended January 1967","M"),SP("Operating location","Oceanus Procellarum","R")],
 status:{kind:"left",text:"Inactive on the surface since 1967."}, src:["surv1"]};

V["surveyor-3"] = {level:1, vehicles:["Surveyor 3 lander"],
 overview:"A Surveyor lander that also carried a surface sampler scoop. Apollo 12 astronauts visited it in 1969 and brought parts, including its television camera, back to Earth.",
 hw:[...P.SURVEYOR("surv3"), H("robotic","Surface sampler","Extendable arm with a scoop.","Dug trenches and pressed on the soil while the camera watched.","First US digging on the Moon.",null,{src:["surv3"]})],
 ins:[P.SURV_TV("surv3","Its camera was retrieved by Apollo 12 and studied on Earth."), I("sample","Soil Mechanics Surface Sampler","SMSS","Measure soil strength.","Motor currents while digging indicated how the soil resisted.","Soil bearing strength","Engineering and images","Showed the soil compacts under load.","Inactive",{src:["surv3"]})],
 specs:[SP("Mass",ND),SP("Power source","Solar panel and batteries","R"),SP("Mobility","Three landing legs (stationary)","R"),SP("Landing","20 April 1967 (bounced twice because the vernier engines did not shut off)","R"),SP("Mission duration","Operated until 4 May 1967","M"),SP("Operating location","Oceanus Procellarum","R")],
 status:{kind:"left",text:"Inactive on the surface. Some parts were removed by the Apollo 12 crew in November 1969."}, src:["surv3","a12"]};

V["apollo-8"] = {level:1, vehicles:["Command and Service Module (CSM-103)","S-IVB third stage"],
 overview:"The first crewed spacecraft to orbit the Moon: a Command and Service Module launched on a Saturn V. No lunar module was carried.",
 hw:[
  H("structure","Command Module","Conical crew capsule with heat shield.","Housed the three astronauts and returned them to Earth.","First crewed vehicle to re-enter at lunar-return speed.",null,{src:["a8"]}),
  H("propulsion","Service Module and Service Propulsion System","Cylindrical module with the main engine and consumables.","Its engine placed the spacecraft into lunar orbit and sent it home.","Engine firings behind the Moon happened without radio contact.",null,{src:["a8"]}),
  H("power","Fuel cells","Hydrogen–oxygen fuel cells in the Service Module.","Generated electricity and drinking water.","",null,{src:["a8"]}),
  H("comms","Unified S-band system","Combined voice, telemetry, ranging and television.","Linked the spacecraft to NASA's tracking network.","Carried the Christmas Eve broadcast.",null,{src:["a8"]}),
  H("nav","Apollo Guidance Computer","Digital flight computer with inertial platform and optics.","Navigated by star sightings and ground updates.","",null,{src:["a8"]})],
 ins:[I("img","Hand-held cameras","—","Photograph the Moon and Earth.","Hasselblad still cameras and film cameras operated by the crew.","Visible light","Photographs","Earthrise (AS08-14-2383).","Returned to Earth",{src:["a8"]})],
 specs:[SP("Mass",ND),SP("Power source","Fuel cells","R"),SP("Communication","Unified S-band","R"),SP("Mission duration","6 days, 3 hours","M"),SP("Operating location","Lunar orbit (10 orbits)","M")],
 status:{kind:"returned",text:"The Command Module returned to Earth. Nothing was left on the Moon."}, src:["a8"]};

V["apollo-11"] = {level:2, vehicles:["Lunar Module Eagle (LM-5)","Command and Service Module Columbia","Early Apollo Scientific Experiments Package (EASEP)"],
 overview:"Apollo 11's Lunar Module Eagle landed at Tranquility Base. Its descent stage, the EASEP instruments, cameras, tools and other equipment were left on the Moon; the ascent stage returned to lunar orbit and was left there after docking.",
 hw:[...P.LM("Eagle","a11lm","Descent stage left at Tranquility Base"),
  H("structure","Scientific Equipment bay","Compartment in the descent stage.","Carried the EASEP experiments; Aldrin unloaded them during the moonwalk.","",null,{src:["a11lm","alsj"]}),
  H("comms","Lunar surface television camera","Westinghouse slow-scan camera stowed on the descent stage.","Transmitted the first steps live to Earth.","Left on the Moon.",null,{src:["a11lm","alsj"]})],
 ins:[...P.EASEP, P.SWC,
  I("sample","Lunar sample collection","—","Return Moon rocks and soil.","Scoops and tongs collected material into sealed containers.","—","Samples","Returned about 21.5 kg of rock and soil.","Returned to Earth",{src:["a11"]}),
  I("img","Apollo Lunar Surface Close-up Camera","ALSCC","Stereo close-ups of soil.","A hand-held stereo camera pressed against the ground.","Soil texture","Stereo photographs","Close-up stereo images of undisturbed soil; the film was returned.","Camera left on the Moon",{src:["alsj"]})],
 specs:[SP("Vehicle mass","About 15,100 kg (LM fully fuelled)","E"),SP("Dimensions","About 7.0 m tall; about 9.4 m across the deployed landing gear","D"),SP("Power source","Silver-zinc batteries (LM); fuel cells (CSM)","R"),SP("Descent engine thrust","About 45 kN maximum, throttleable","D"),SP("Communication","Unified S-band","R"),SP("Landing","20 July 1969","M"),SP("Time on the surface","About 21.5 hours","M"),SP("Operating location","Tranquility Base, Mare Tranquillitatis (0.674° N, 23.473° E, LRO-derived)","M")],
 status:{kind:"left",text:"Intentionally left: the descent stage, EASEP, cameras, tools and other equipment. The laser retroreflector is still used. The seismometer stopped responding in August 1969."},
 diagram:{img:"veh/img/a11_lm.webp", w:1600, h:1600, id:"AS11-40-5927", page:"https://images.nasa.gov/details/as11-40-5927", credit:"NASA — Apollo 11, 20 July 1969",
  note:"Eagle photographed on the Moon from behind. Aldrin stands at the Scientific Equipment bay preparing to deploy EASEP.",
  spots:[[52,22,"Ascent stage (crew cabin)"],[29,26,"Reaction Control System"],[71,25,"Reaction Control System"],[50,45,"Descent stage"],[47,51,"Scientific Equipment bay"],[22,56,"Landing gear"],[86,69,"Landing gear"]]},
 museum:"lm", src:["a11lm","a11","alsj","lroSites"]};

V["apollo-12"] = {level:2, vehicles:["Lunar Module Intrepid (LM-6)","Command and Service Module Yankee Clipper","Apollo Lunar Surface Experiments Package (ALSEP)"],
 overview:"Apollo 12 made a precision landing near Surveyor 3 and deployed the first complete ALSEP station, powered by a radioisotope generator. The ascent stage was later crashed into the Moon to create a seismic signal.",
 hw:[...P.LM("Intrepid","a12lm","Descent stage left in Oceanus Procellarum"), P.ALSEP_SNAP, P.ALSEP_CS],
 ins:[
  I("geo","Passive Seismic Experiment","PSE","Record moonquakes and impacts.","A long-period seismometer levelled on the surface.","Ground motion","Seismic records","Recorded the ascent-stage impact, which made the Moon ring for nearly an hour.","Switched off 1977",{src:["a12lm","alsj"],img:"alsep12"}),
  I("env","Lunar Surface Magnetometer","LSM","Measure magnetic fields at the surface.","Three fluxgate sensors on booms.","Magnetic field","Field measurements","Detected a local remanent field.","Switched off 1977",{src:["a12lm","alsj"]}),
  I("env","Solar Wind Spectrometer","SWS","Measure the solar-wind plasma.","Faraday cups measured charged particles.","Solar wind","Particle spectra","Measured the solar wind at the lunar surface.","Switched off 1977",{src:["a12lm","alsj"]}),
  I("atmo","Suprathermal Ion Detector and Cold Cathode Ion Gauge","SIDE / CCIG","Measure ions and the tenuous lunar atmosphere.","Ion detectors and a pressure gauge.","Ions, gas pressure","Count rates","Measured the very thin lunar atmosphere.","Switched off 1977",{src:["a12lm","alsj"]}),
  I("env","Lunar Dust Detector","—","Measure dust accumulation.","Solar cells monitored how their output changed.","Dust, temperature","Cell output","Engineering data on dust.","Switched off 1977",{src:["a12lm","alsj"]}),
  P.SWC,
  I("sample","Surveyor 3 parts retrieval","—","Study how hardware ages on the Moon.","The crew cut off the television camera and other parts of Surveyor 3.","Material ageing","Returned parts","Gave the first look at how hardware weathers after years on the Moon.","Returned to Earth",{src:["a12","surv3"]})],
 specs:[SP("Vehicle mass",ND),SP("Power source","Silver-zinc batteries (LM); SNAP-27 RTG (ALSEP)","R"),SP("Communication","Unified S-band","R"),SP("Landing","19 November 1969","M"),SP("Mission duration","10 days, 4 hours","M"),SP("Operating location","Oceanus Procellarum, near Surveyor 3","M")],
 status:{kind:"left",text:"Intentionally left: descent stage and ALSEP (switched off 1977). The ascent stage was deliberately crashed into the Moon."},
 diagram:{img:"veh/img/a11_lm.webp", w:1600, h:1600, id:"AS11-40-5927", page:"https://images.nasa.gov/details/as11-40-5927", credit:"NASA — Apollo 11, 20 July 1969",
  note:"This photograph shows Apollo 11's Eagle, not Intrepid. Intrepid was built to the same Lunar Module design.", spots:[[52,22,"Ascent stage (crew cabin)"],[29,26,"Reaction Control System"],[50,45,"Descent stage"],[22,56,"Landing gear"]]},
 museum:"lm", src:["a12lm","a12","alsj","lroSites"]};

V["lunokhod-1"] = {level:1, vehicles:["Lunokhod 1 rover","Luna 17 landing stage"],
 overview:"The first remote-controlled rover on another world. Luna 17 landed with ramps from which Lunokhod 1 drove off into Mare Imbrium.",
 hw:[...P.LUNOKHOD("luna17",1), H("structure","Luna 17 landing stage","Descent stage with propellant tanks and two ramps.","Landed the rover and provided ramps to drive off.","Left beside the landing site.",null,{src:["luna17"]})],
 ins:P.LUNOKHOD_INS("luna17",1),
 specs:[SP("Rover mass","756 kg","R"),SP("Dimensions",ND),SP("Power source","Solar panel; polonium-210 radioisotope heater","R"),SP("Mobility","Eight wheels, independent motors","R"),SP("Distance driven","About 10.5 km","R"),SP("Landing","17 November 1970","M"),SP("Mission duration","About 10 months (planned 3 lunar days)","M"),SP("Operating location","Mare Imbrium","R")],
 status:{kind:"left",text:"Inactive since September 1971. Its retroreflector still returns laser pulses."}, src:["luna17","impacts"]};

V["lunokhod-2"] = {level:1, vehicles:["Lunokhod 2 rover","Luna 21 landing stage"],
 overview:"An improved Lunokhod with an extra camera, a magnetometer and an astrophotometer. It drove about 39 km in Le Monnier crater, a record that stood for decades.",
 hw:[...P.LUNOKHOD("luna21",2), H("structure","Luna 21 landing stage","Descent stage with ramps.","Landed the rover in Le Monnier crater.","Left at the landing site.",null,{src:["luna21"]})],
 ins:P.LUNOKHOD_INS("luna21",2),
 specs:[SP("Rover mass","840 kg","R"),SP("Dimensions",ND),SP("Power source","Solar panel; radioisotope heater","R"),SP("Mobility","Eight wheels, independent motors","R"),SP("Distance driven","About 39 km","R"),SP("Landing","15 January 1973","M"),SP("Mission duration","About 4 months","M"),SP("Operating location","Le Monnier crater","R")],
 status:{kind:"left",text:"Inactive since 1973. Its retroreflector is still used."}, src:["luna21","impacts"]};

V["apollo-17"] = {level:2, vehicles:["Lunar Module Challenger (LM-12)","Lunar Roving Vehicle (LRV-3)","Command and Service Module America","ALSEP"],
 overview:"The last Apollo mission used an extended Lunar Module and the third Lunar Roving Vehicle. The rover, descent stage and ALSEP station were left in the Taurus-Littrow valley.",
 hw:[...P.LM("Challenger","a17lm","Descent stage left at Taurus-Littrow"),
  H("mobility","LRV chassis","Folding aluminium chassis with two seats.","Unfolded from the LM's side; carried two astronauts, tools and samples.","Extended exploration range to kilometres from the LM.","Length about 3.1 m; mass about 210 kg empty (reported)",{src:["alsj"],img:"hero_lrv"}),
  H("mobility","LRV wire-mesh wheels and drive motors","Four woven zinc-coated steel wheels, each with its own electric motor.","Titanium chevrons on the mesh gave traction in loose soil.","Flexible wheels could not puncture.",null,{src:["alsj"]}),
  H("mobility","LRV steering","Front and rear steering.","Both axles steered for a tight turning radius.","",null,{src:["alsj"]}),
  H("power","LRV batteries","Two 36-volt silver-zinc batteries.","Powered the motors and electronics; either could run the whole rover.","Not rechargeable.",null,{src:["alsj"]}),
  H("nav","LRV navigation system","Directional gyro, odometers and a small computer.","Dead reckoning gave heading and distance back to the LM.","Kept the crew able to find their way back.",null,{src:["alsj"]}),
  H("comms","Lunar Communications Relay Unit and high-gain antenna","Relay unit with umbrella-like high-gain antenna on the LRV.","Sent voice and television directly to Earth from the rover.","",null,{src:["alsj"]}),
  H("comms","Ground-Commanded Television Assembly","TV camera on the LRV controlled from Earth.","Mission control could pan and zoom; it filmed Challenger's lift-off.","",null,{src:["alsj"]}),
  P.ALSEP_SNAP, P.ALSEP_CS],
 ins:[
  I("geo","Heat Flow Experiment","HFE","Measure heat escaping from the Moon's interior.","Temperature probes in drilled holes.","Subsurface temperature, conductivity","Temperature records","Measured lunar heat flow.","Switched off 1977",{src:["a17lm","alsj"]}),
  I("geo","Lunar Seismic Profiling Experiment","LSPE","Study the structure under the valley.","Geophones recorded explosive charges set off after the crew left, and later moonquakes.","Seismic waves","Seismic records","Mapped the layers beneath the valley floor.","Switched off 1977",{src:["a17lm","alsj"]}),
  I("atmo","Lunar Atmospheric Composition Experiment","LACE","Analyse the thin lunar atmosphere.","A mass spectrometer.","Gas composition","Mass spectra","Detected helium, argon and other gases.","Switched off 1977",{src:["a17lm","alsj"]}),
  I("env","Lunar Ejecta and Meteorites","LEAM","Detect dust and micrometeorites.","Detectors measured particle speed and direction.","Dust particles","Counts","Recorded dust activity near the terminator.","Switched off 1977",{src:["a17lm","alsj"]}),
  I("geo","Lunar Surface Gravimeter","LSG","Detect gravitational waves.","A sensitive gravimeter.","Gravity changes","—","Did not operate as designed because of a design error.","Inactive",{src:["a17lm","alsj"]}),
  I("geo","Traverse Gravimeter Experiment","TGE","Measure gravity along the traverses.","A gravimeter carried on the LRV.","Local gravity","Measurements","Revealed dense rock beneath the valley.","Returned / left (record)",{src:["alsj"]}),
  I("geo","Surface Electrical Properties","SEP","Probe the subsurface electrically.","A transmitter antenna on the surface; a receiver on the LRV.","Electrical properties","Recordings","Explored subsurface layering.","Data returned",{src:["alsj"]}),
  I("sample","Lunar sample collection","—","Return geological samples.","Rakes, scoops, core tubes and a drill.","—","Samples","Returned about 110 kg, including orange volcanic glass.","Returned to Earth",{src:["a17"]})],
 specs:[SP("LM mass",ND),SP("LRV mass","About 210 kg empty","R"),SP("LRV length","About 3.1 m","R"),SP("Power source","Silver-zinc batteries (LM and LRV); SNAP-27 RTG (ALSEP)","R"),SP("LRV distance driven","35.7 km","M"),SP("Landing","11 December 1972","M"),SP("Mission duration","12 days, 13 hours","M"),SP("Operating location","Taurus-Littrow valley","M")],
 status:{kind:"left",text:"Intentionally left: descent stage, LRV, ALSEP (switched off 1977) and equipment. The ascent stage was deliberately crashed into the Moon."},
 diagram:{img:"img/hero_lrv.webp", w:1600, h:1120, id:"AS17-147-22526", page:"https://images.nasa.gov/details/as17-147-22526", credit:"NASA — Apollo 17, photo by Harrison Schmitt",
  note:"Gene Cernan checks out the Lunar Roving Vehicle before it was loaded with antennas, the TV camera and tools.",
  spots:[[29,67,"LRV wire-mesh wheels and drive motors"],[66,56,"LRV wire-mesh wheels and drive motors"],[29,46,"LRV chassis"],[41,43,"LRV navigation system"],[54,59,"LRV chassis"]]},
 museum:"lm", src:["a17lm","a17","alsj","lroSites"]};

V["chandrayaan-1"] = {level:1, vehicles:["Chandrayaan-1 orbiter","Moon Impact Probe"],
 overview:"India's first lunar mission: a cuboid orbiter with eleven instruments from India, Europe, the United States and Bulgaria, plus an impact probe released toward the south pole.",
 hw:[
  H("structure","Cuboid spacecraft bus","Box-shaped structure carrying instruments on its deck.","","",null,{src:["ch1"]}),
  H("power","Solar array","Single solar panel with batteries.","","",null,{src:["ch1"]}),
  H("comms","Dual-gimballed high-gain antenna","Steerable dish antenna.","Sent science data to India's Deep Space Network.","",null,{src:["ch1","isro"]}),
  H("structure","Moon Impact Probe","Small probe released from orbit.","Carried a camera, radar altimeter and mass spectrometer down to impact near Shackleton crater on 14 November 2008.","",null,{src:["ch1"]})],
 ins:[
  I("img","Terrain Mapping Camera","TMC","Stereo mapping.","Three-view pushbroom camera.","Topography","Images, elevation models","","Contact lost 2009",{src:["ch1"]}),
  I("spectro","Hyperspectral Imager","HySI","Mineral mapping.","Imaging spectrometer in visible/near-infrared.","Mineralogy","Spectral cubes","","Contact lost 2009",{src:["ch1"]}),
  I("geo","Lunar Laser Ranging Instrument","LLRI","Measure topography.","Laser altimeter.","Altitude","Ranges","","Contact lost 2009",{src:["ch1"]}),
  I("spectro","Moon Mineralogy Mapper (NASA)","M3","Map minerals.","Imaging spectrometer.","Mineral absorption features","Spectral cubes","Detected hydroxyl and water signatures on the lunar surface.","Contact lost 2009",{src:["ch1"],img:"m3"}),
  I("geo","Miniature Synthetic Aperture Radar (NASA)","Mini-SAR","Probe permanently shadowed craters.","Radar imaging.","Radar backscatter","Radar images","Found radar signatures consistent with ice in polar craters.","Contact lost 2009",{src:["ch1"]}),
  I("spectro","X-ray, infrared and particle instruments","C1XS, SIR-2, HEX, SARA, RADOM","Measure surface chemistry, minerals, radiation and neutral atoms.","Spectrometers and detectors from ISRO, ESA partners and Bulgaria.","Elements, minerals, radiation","Spectra and counts","","Contact lost 2009",{src:["ch1"]})],
 specs:[SP("Mass","1,380 kg at launch","R"),SP("Power source","Solar array","R"),SP("Mission duration","About 10 months (planned 2 years)","M"),SP("Operating location","100 km, later 200 km, polar lunar orbit","M")],
 status:{kind:"lost",text:"Contact was lost in August 2009. The Moon Impact Probe hit the surface near the south pole in 2008."}, src:["ch1","isro"]};

V["lro"] = {level:1, vehicles:["Lunar Reconnaissance Orbiter"],
 overview:"A NASA orbiter mapping the Moon at high resolution. Its cameras have imaged the Apollo sites, the Lunokhod rovers and many crash sites.",
 hw:[
  H("power","Solar array","Deployable solar array with lithium-ion battery.","","",null,{src:["lro"]}),
  H("comms","Ka-band high-gain antenna","Steerable high-gain antenna.","High-rate downlink of mapping data.","",null,{src:["lro"]})],
 ins:[
  I("img","Lunar Reconnaissance Orbiter Camera","LROC","High-resolution and wide-angle imaging.","Two Narrow Angle Cameras and a Wide Angle Camera.","Visible and ultraviolet light","Images","Imaged Apollo hardware, rover tracks and new impact craters.","Operational",{src:["lro"],img:"lro"}),
  I("geo","Lunar Orbiter Laser Altimeter","LOLA","Topographic mapping.","Five-beam laser altimeter.","Elevation, roughness","Topography","Produced a precise global topographic map.","Operational",{src:["lro"]}),
  I("env","Diviner Lunar Radiometer Experiment","Diviner","Map surface temperatures.","Infrared radiometer.","Temperature","Thermal maps","Found some of the coldest places in the solar system in polar craters.","Operational",{src:["lro"]}),
  I("spectro","Lyman Alpha Mapping Project","LAMP","Image shadowed regions in ultraviolet.","UV spectrograph using starlight and sky glow.","Surface frost, exosphere","Spectra","","Operational",{src:["lro"]}),
  I("rad","Lunar Exploration Neutron Detector","LEND","Map hydrogen.","Neutron detectors.","Neutron flux","Maps","","Operational",{src:["lro"]}),
  I("rad","Cosmic Ray Telescope for the Effects of Radiation","CRaTER","Measure radiation hazards.","Detectors behind tissue-equivalent plastic.","Cosmic rays","Dose and spectra","","Operational",{src:["lro"]}),
  I("geo","Miniature Radio Frequency","Mini-RF","Radar imaging.","Synthetic aperture radar.","Radar backscatter","Radar images","","Status not confirmed",{src:["lro"]})],
 specs:[SP("Mass","1,916 kg at launch","R"),SP("Power source","Solar array","R"),SP("Communication","Ka-band and S-band","R"),SP("Mission duration","Operating since 2009","M"),SP("Operating location","Polar lunar orbit","R")],
 status:{kind:"operating",text:"Operating."}, src:["lro"]};

V["change-4"] = {level:1, vehicles:["Chang'e 4 lander","Yutu-2 rover","Queqiao relay satellite"],
 overview:"The first landing on the far side of the Moon. The lander and the Yutu-2 rover communicate with Earth through the Queqiao relay satellite.",
 hw:[
  H("structure","Lander","Four-legged lander.","Landed in Von Kármán crater on 3 January 2019.","",null,{src:["ce4","cnsa"]}),
  H("mobility","Yutu-2 rover chassis","Six-wheel rover.","Solar-powered driving across the crater floor.","Long-lived far-side rover.",null,{src:["ce4","cnsa"]}),
  H("power","Solar panels and radioisotope heating","Solar arrays; radioisotope heat for the lunar night.","","",null,{src:["ce4"]}),
  H("comms","Queqiao relay","Relay satellite near the Earth–Moon L2 point.","Links the far side, which never faces Earth, to ground stations.","Made far-side surface operations possible.",null,{src:["ce4","cnsa"]})],
 ins:[
  I("img","Landing, terrain and panoramic cameras","LCAM, TCAM, PCAM","Image the descent and surroundings.","Cameras on lander and rover.","Visible light","Images","","Not confirmed",{src:["ce4"]}),
  I("geo","Lunar Penetrating Radar","LPR","Probe subsurface layers.","Ground-penetrating radar on the rover.","Subsurface structure","Radargrams","Mapped layered material under the crater floor.","Not confirmed",{src:["ce4"]}),
  I("spectro","Visible and Near-Infrared Imaging Spectrometer","VNIS","Identify minerals.","Imaging spectrometer on the rover.","Mineralogy","Spectra","","Not confirmed",{src:["ce4"]}),
  I("rad","Lunar Lander Neutrons and Dosimetry (Germany)","LND","Measure radiation on the surface.","Particle detectors.","Radiation dose","Dose rates","Measured the surface radiation dose.","Not confirmed",{src:["ce4"]}),
  I("atmo","Advanced Small Analyzer for Neutrals (Sweden)","ASAN","Study solar-wind interaction with the surface.","Neutral-atom analyser on the rover.","Energetic neutral atoms","Spectra","","Not confirmed",{src:["ce4"]}),
  I("env","Low Frequency Spectrometer","LFS","Radio astronomy from the shielded far side.","Antennas on the lander.","Low-frequency radio","Spectra","","Not confirmed",{src:["ce4"]})],
 specs:[SP("Mass",ND),SP("Power source","Solar; radioisotope heater","R"),SP("Communication","Queqiao relay","R"),SP("Landing","3 January 2019","M"),SP("Operating location","Von Kármán crater","R")],
 status:{kind:"unknown",text:"Operating status is not confirmed in the verified sources."}, src:["ce4","cnsa"]};

V["chandrayaan-2"] = {level:1, vehicles:["Chandrayaan-2 orbiter","Vikram lander (lost)","Pragyan rover (inside Vikram)"],
 overview:"An orbiter, lander and rover. The orbiter is operating; the Vikram lander crashed during descent in September 2019 with Pragyan still inside.",
 hw:[
  H("structure","Orbiter","Spacecraft bus with science instruments.","","",null,{src:["ch2","isro"]}),
  H("structure","Vikram lander","Four-legged lander with throttleable engines.","Lost during powered descent; debris was found in LRO images.","",null,{src:["ch2","impacts"]})],
 ins:[
  I("img","Orbiter High Resolution Camera","OHRC","Very high-resolution imaging.","Camera on the orbiter.","Surface detail","Images","","Operational",{src:["ch2"]}),
  I("img","Terrain Mapping Camera 2","TMC-2","Stereo mapping.","Three-view camera.","Topography","Images","","Operational",{src:["ch2"]}),
  I("spectro","Imaging Infrared Spectrometer","IIRS","Map minerals and water features.","Imaging spectrometer.","Mineralogy, hydration","Spectra","","Operational",{src:["ch2"]}),
  I("geo","Dual-Frequency Synthetic Aperture Radar","DF-SAR","Radar mapping of polar regions.","L- and S-band radar.","Radar backscatter","Radar images","","Operational",{src:["ch2"]}),
  I("spectro","X-ray spectrometers","CLASS, XSM","Measure surface elements and solar X-rays.","X-ray detectors.","Elemental composition","Spectra","","Operational",{src:["ch2"]}),
  I("atmo","Atmospheric Compositional Explorer 2","CHACE-2","Study the lunar exosphere.","Mass spectrometer.","Gas composition","Spectra","","Operational",{src:["ch2"]})],
 specs:[SP("Mass","3,850 kg (combined)","R"),SP("Power source","Solar","R"),SP("Mission duration","Orbiter operating","M"),SP("Operating location","Polar lunar orbit","R")],
 status:{kind:"operating",text:"The orbiter is operating. The Vikram lander crashed on 6 September 2019 (failed descent)."}, src:["ch2","isro"]};

V["change-5"] = {level:1, vehicles:["Lander","Ascender","Orbiter","Returner"],
 overview:"A four-part sample-return mission. The lander drilled and scooped samples, the ascender lifted them to orbit, and the returner brought 1,731 g back to Earth.",
 hw:[
  H("robotic","Drill and robotic arm","Rotary-percussive drill and scooping arm.","Collected subsurface and surface material and packed it into a container.","",null,{src:["ce5","cnsa"]}),
  H("propulsion","Ascender","Small rocket stage on top of the lander.","Launched the samples from the Moon to dock with the orbiter.","First robotic lunar orbit rendezvous.",null,{src:["ce5"]}),
  H("structure","Lander","Four-legged lander.","Left at the landing site with a national flag.","",null,{src:["ce5"]}),
  H("thermal","Returner capsule","Re-entry capsule with heat shield.","Brought the samples through Earth's atmosphere.","",null,{src:["ce5"]})],
 ins:[
  I("img","Landing and panoramic cameras","—","Image descent and site.","Cameras on the lander.","Visible light","Images","","Inactive",{src:["ce5"]}),
  I("spectro","Lunar Mineralogical Spectrometer","LMS","Identify minerals at the site.","Spectrometer on the lander.","Mineralogy","Spectra","","Inactive",{src:["ce5"]}),
  I("geo","Lunar Regolith Penetrating Radar","LRPR","Probe subsurface layers before drilling.","Radar on the lander.","Regolith structure","Radargrams","","Inactive",{src:["ce5"]}),
  I("sample","Sample collection","—","Return lunar material.","Drill core and scooped surface material.","—","Samples","Returned 1,731 g of young basalt from Oceanus Procellarum.","Returned to Earth",{src:["ce5"]})],
 specs:[SP("Mass",ND),SP("Power source","Solar","R"),SP("Landing","1 December 2020","M"),SP("Mission duration","About 23 days","M"),SP("Operating location","Mons Rümker area, Oceanus Procellarum","R")],
 status:{kind:"left",text:"The lander remains on the Moon. The ascender was deliberately crashed into the Moon after transferring the samples."}, src:["ce5","cnsa","impacts"]};

V["artemis-1"] = {level:1, vehicles:["Orion spacecraft","Space Launch System (Block 1)"],
 overview:"An uncrewed test flight of Orion around the Moon and back, launched on the first Space Launch System rocket.",
 hw:[...P.ORION("art1"), H("propulsion","Space Launch System","Core stage with four RS-25 engines and two solid rocket boosters.","Launched Orion and sent it toward the Moon.","",null,{src:["art1"]})],
 ins:[I("rad","Radiation measurement experiments","—","Measure radiation crew would receive.","Sensors in the cabin and in instrumented mannequins.","Radiation dose","Dose measurements","Radiation data for crewed flights.","Returned to Earth",{src:["art1"]}), I("img","Cameras","—","Document the flight.","Cameras inside and on the solar array wings.","Visible light","Images and video","","Returned to Earth",{src:["art1"]})],
 specs:[SP("Mass",ND),SP("Power source","Solar arrays (European Service Module)","R"),SP("Mission duration","25.5 days","M"),SP("Operating location","Distant retrograde lunar orbit","M")],
 status:{kind:"returned",text:"Orion splashed down on 11 December 2022."}, src:["art1","orion","esm"]};

V["chandrayaan-3"] = {level:1, vehicles:["Vikram lander","Pragyan rover","Propulsion Module"],
 overview:"India's first soft landing on the Moon, near the south pole. Vikram carried the six-wheeled Pragyan rover; the Propulsion Module carried an Earth-observing spectrometer.",
 hw:[
  H("structure","Vikram lander","Four-legged lander with throttleable engines.","Landed autonomously on 23 August 2023; later performed a short hop.","First landing near the lunar south pole.","Mass about 1,750 kg including the rover (reported)",{src:["ch3","isro"]}),
  H("mobility","Pragyan rover","Six-wheel solar-powered rover.","Drove about 100 m and analysed soil.","","Mass about 26 kg (reported)",{src:["ch3","isro"]}),
  H("power","Solar panels","Solar panels on lander and rover.","","Operations ended when the lunar night began.",null,{src:["ch3"]})],
 ins:[
  I("env","Chandra's Surface Thermophysical Experiment","ChaSTE","Measure soil temperature with depth.","A probe pushed into the soil with temperature sensors.","Temperature profile","Measurements","Measured the temperature profile of south-polar soil.","Inactive",{src:["ch3"]}),
  I("geo","Instrument for Lunar Seismic Activity","ILSA","Detect vibrations.","Seismometer.","Ground vibration","Records","","Inactive",{src:["ch3"]}),
  I("atmo","RAMBHA Langmuir Probe","RAMBHA-LP","Measure near-surface plasma.","Langmuir probe.","Plasma density","Measurements","","Inactive",{src:["ch3"]}),
  I("geo","Laser Retroreflector Array (NASA)","LRA","Passive laser target.","Corner-cube reflectors.","Light travel time","Ranges","","Operational (passive)",{src:["ch3"]}),
  I("chem","Alpha Particle X-ray Spectrometer","APXS","Measure soil chemistry on the rover.","Radioactive sources excite the soil.","Elements","Spectra","","Inactive",{src:["ch3"]}),
  I("chem","Laser-Induced Breakdown Spectroscope","LIBS","Measure soil chemistry on the rover.","A laser makes a small plasma whose light reveals elements.","Elements","Spectra","Detected sulfur at the landing site.","Inactive",{src:["ch3"]}),
  I("spectro","Spectro-polarimetry of HAbitable Planet Earth","SHAPE","Observe Earth as an exoplanet.","Spectro-polarimeter on the Propulsion Module.","Earth's light","Spectra","","Not confirmed",{src:["ch3"]})],
 specs:[SP("Mass","3,900 kg (integrated)","R"),SP("Power source","Solar","R"),SP("Landing","23 August 2023","M"),SP("Mission duration","About one lunar day (planned)","M"),SP("Operating location","Near the south pole","R")],
 status:{kind:"left",text:"Lander and rover inactive since the lunar night of September 2023; they did not respond after it."}, src:["ch3","isro"]};

V["slim"] = {level:1, vehicles:["SLIM lander","LEV-1 and LEV-2 mini probes"],
 overview:"A small JAXA lander that demonstrated pinpoint landing using vision-based navigation. One main engine nozzle was lost before touchdown, and it came to rest tilted on its nose.",
 hw:[
  H("nav","Vision-based navigation","Camera navigation that matches surface features to maps.","Allowed landing within about 100 m of the target.","Pinpoint landing technology.",null,{src:["slim","jaxa"]}),
  H("mobility","Crushable landing pads","Pads designed to absorb impact in a two-step landing.","","",null,{src:["slim"]}),
  H("power","Solar cells","Solar cells on the body.","Generated power only when sunlight fell on them because the lander rested on its side.","",null,{src:["slim"]}),
  H("robotic","LEV-1 and LEV-2 mini probes","Small probes released just before landing.","LEV-2 photographed SLIM on the surface.","",null,{src:["slim"]})],
 ins:[I("spectro","Multi-Band Camera","MBC","Study rocks thought to come from the lunar mantle.","Multispectral camera.","Mineralogy (olivine)","Images","","Inactive",{src:["slim"]})],
 specs:[SP("Mass",ND),SP("Power source","Solar","R"),SP("Landing","19 January 2024","M"),SP("Mission duration","January–August 2024 (intermittent)","M"),SP("Operating location","Near Shioli crater","R")],
 status:{kind:"left",text:"Operations ended in 2024; the lander remains near Shioli crater."}, src:["slim","jaxa"]};

V["change-6"] = {level:1, vehicles:["Lander","Ascender","Orbiter","Returner"],
 overview:"The first sample return from the far side of the Moon, from the South Pole–Aitken basin, relayed through Queqiao-2.",
 hw:[
  H("robotic","Drill and robotic arm","Drill and scoop.","Collected samples.","",null,{src:["cnsa"]}),
  H("propulsion","Ascender","Small launch stage.","Lifted samples to lunar orbit.","",null,{src:["cnsa"]}),
  H("comms","Queqiao-2 relay","Relay satellite.","Linked the far-side lander to Earth.","",null,{src:["cnsa"]})],
 ins:[
  I("img","Landing and panoramic cameras","—","Image the site.","Cameras.","Visible light","Images","","Inactive",{src:["cnsa"]}),
  I("spectro","Lunar Mineralogical Spectrometer","LMS","Mineral identification.","Spectrometer.","Mineralogy","Spectra","","Inactive",{src:["cnsa"]}),
  I("geo","Lunar Regolith Penetrating Radar","LRPR","Probe the subsurface.","Radar.","Regolith structure","Radargrams","","Inactive",{src:["cnsa"]}),
  I("atmo","International payloads","DORN, NILS, INRRI","Radon detection (France), negative ions (ESA), laser retroreflector (Italy).","Detectors and a passive reflector.","Radon, ions, laser ranges","Measurements","","Not confirmed",{src:["cnsa"]}),
  I("sample","Sample collection","—","Return far-side material.","Drill and scoop.","—","Samples","Returned 1,935.3 g from the far side.","Returned to Earth",{src:["cnsa"]})],
 specs:[SP("Mass",ND),SP("Power source","Solar","R"),SP("Communication","Queqiao-2 relay","R"),SP("Landing","1 June 2024","M"),SP("Mission duration","53 days","M"),SP("Operating location","Apollo basin, South Pole–Aitken","R")],
 status:{kind:"left",text:"The lander remains on the far side."}, src:["cnsa"]};

V["artemis-2"] = {level:1, vehicles:["Orion spacecraft Integrity","Space Launch System (Block 1)"],
 overview:"The first crewed Orion flight: four astronauts flew around the Moon on a free-return trajectory and returned to Earth.",
 hw:[...P.ORION("art2"), H("structure","Crew systems","Life support, displays and controls for four astronauts.","Supported the crew for about ten days.","First crewed flight of Orion.",null,{src:["art2"]})],
 ins:[I("img","Crew observations and cameras","—","Observe and photograph the Moon and Earth.","Hand-held and mounted cameras.","Visible light","Images","Images of the lunar far side and Earthset.","Returned to Earth",{src:["art2"]})],
 specs:[SP("Mass",ND),SP("Power source","Solar arrays (European Service Module)","R"),SP("Mission duration","About 10 days","M"),SP("Operating location","Lunar free-return flyby","M")],
 status:{kind:"returned",text:"The crew returned to Earth."}, src:["art2","orion","esm"]};

V["saturn-v"] = {level:1, vehicles:["S-IC first stage","S-II second stage","S-IVB third stage","Instrument Unit"],
 overview:"The three-stage rocket that launched every crewed Apollo lunar mission. From Apollo 13 onward, S-IVB third stages were deliberately crashed into the Moon as seismic sources.",
 hw:[
  H("propulsion","S-IC first stage","Five F-1 engines burning kerosene and liquid oxygen.","Lifted the rocket through the lower atmosphere.","","Liftoff thrust about 34 MN (design)",{src:["satv"]}),
  H("propulsion","S-II second stage","Five J-2 engines burning liquid hydrogen and oxygen.","Took the rocket close to orbit.","",null,{src:["satv"]}),
  H("propulsion","S-IVB third stage","One restartable J-2 engine.","Finished reaching orbit, then restarted to send Apollo toward the Moon.","Spent S-IVBs from Apollo 13–17 were crashed into the Moon for seismology.",null,{src:["satv","impacts"]}),
  H("nav","Instrument Unit","Ring of guidance computers and sensors on top of the S-IVB.","Steered the whole rocket.","",null,{src:["satv"]})],
 ins:[],
 specs:[SP("Height","About 110.6 m","R"),SP("Stages","3","D"),SP("Mission duration","1967–1973, 13 launches","M")],
 status:{kind:"retired",text:"Retired in 1973. S-IVB stages from Apollo 13–17 lie in impact craters on the Moon."}, src:["satv","impacts"]};
})();

/* Forgotten Explorers — Mars vehicles: hardware, instruments, specifications (keyed by FE_MISSIONS id). */
(function () {
const H = window.FE_VEH_H, I = window.FE_VEH_I, SP = window.FE_VEH_SP, P = window.FE_VEH_PARTS, V = window.FE_VEH;
const ND = null;

V["mariner-4"] = {level:1, vehicles:["Mariner 4 spacecraft (flyby)"],
 overview:"The first successful Mars flyby. An octagonal spacecraft with four solar panels that returned the first close-up pictures of another planet.",
 hw:[
  H("structure","Octagonal magnesium frame","Eight-sided frame holding electronics bays.","","",null,{src:["mariner4"]}),
  H("power","Four solar panels with solar-pressure vanes","Solar panels; small vanes at their tips.","The vanes used sunlight pressure to help stabilise attitude.","",null,{src:["mariner4"]}),
  H("comms","High-gain dish antenna","Fixed parabolic antenna.","Played back the pictures stored on tape after the flyby.","",null,{src:["mariner4"]}),
  H("nav","Sun and Canopus sensors","Attitude reference sensors.","Locked onto the Sun and the star Canopus.","",null,{src:["mariner4"]})],
 ins:[
  I("img","Television camera","—","Photograph Mars at close range.","Vidicon camera; pictures stored on tape and sent slowly to Earth.","Surface appearance","21 images plus part of a 22nd","Showed a cratered, Moon-like surface.","Inactive",{src:["mariner4"],img:"mariner4"}),
  I("atmo","Radio occultation experiment","—","Measure the atmosphere.","Radio signals passing through the atmosphere as the spacecraft went behind Mars.","Atmospheric pressure profile","Radio data","Showed the atmosphere is very thin.","Inactive",{src:["mariner4"]}),
  I("env","Magnetometer, plasma probe and particle detectors","—","Measure fields and particles.","Helium magnetometer, plasma probe, cosmic-ray and trapped-radiation detectors, cosmic dust detector.","Magnetic field, particles, dust","Measurements","No significant global magnetic field was detected.","Inactive",{src:["mariner4"]})],
 specs:[SP("Mass","260.8 kg","R"),SP("Power source","Solar panels","R"),SP("Arrival","Flyby on 15 July 1965","M"),SP("Mission duration","Operations ended December 1967","M")],
 status:{kind:"retired",text:"In orbit around the Sun since its mission ended in 1967."}, src:["mariner4"]};

V["mars-3"] = {level:1, vehicles:["Mars 3 lander","Mars 3 orbiter","PrOP-M rover (carried, not confirmed deployed)"],
 overview:"The first spacecraft to soft-land on Mars. The lander transmitted for about 20 seconds before falling silent; it carried a small ski-walking rover tethered by cable.",
 hw:[
  H("structure","Lander capsule","Spherical lander protected by an aeroshell.","Entered with a heat shield and parachute, then landed using a retro-rocket.","First soft landing on Mars.","Lander mass about 358 kg (reported)",{src:["mars3"]}),
  H("mobility","PrOP-M micro-rover","Small rover designed to move on skis, tethered by cable.","Was to measure soil properties near the lander.","Not confirmed deployed because the lander fell silent.",null,{src:["mars3"]})],
 ins:[I("img","Television cameras","—","Image the landing site.","Panoramic scanning cameras.","Visible light","Partial image","Transmission stopped after about 20 seconds; the partial image showed no detail.","Lost",{src:["mars3"]})],
 specs:[SP("Mass",ND),SP("Power source",ND),SP("Landing","2 December 1971","M"),SP("Mission duration","About 20 seconds on the surface","M"),SP("Operating location","Terra Sirenum (approximate)","E")],
 status:{kind:"failed",text:"Fell silent seconds after landing. Its exact location is approximate."}, src:["mars3"]};

V["viking-1"] = {level:1, vehicles:["Viking 1 Lander","Viking 1 Orbiter"],
 overview:"The first fully successful landing on Mars. The lander searched for life, studied the soil and recorded weather for more than six years.",
 hw:P.VIKING("vl1",1), ins:P.VIKING_INS("vl1",1),
 specs:[SP("Mass","About 3,530 kg combined at launch","R"),SP("Dimensions",ND),SP("Power source","Two SNAP-19 RTGs (lander)","R"),SP("Communication","S-band direct to Earth; UHF relay via orbiter","R"),SP("Landing","20 July 1976","M"),SP("Mission duration","Lander operated until November 1982","M"),SP("Operating location","Chryse Planitia","R")],
 status:{kind:"left",text:"Contact lost in November 1982 after a faulty command. The lander remains on the surface."}, museum:"viking", src:["vl1","viking"]};

V["viking-2"] = {level:1, vehicles:["Viking 2 Lander","Viking 2 Orbiter"],
 overview:"The twin of Viking 1, landed farther north in Utopia Planitia, where it photographed frost on the ground.",
 hw:P.VIKING("vl2",2), ins:P.VIKING_INS("vl2",2),
 specs:[SP("Mass",ND),SP("Power source","Two SNAP-19 RTGs (lander)","R"),SP("Communication","S-band direct to Earth; UHF relay via orbiter","R"),SP("Landing","3 September 1976","M"),SP("Mission duration","Lander operated until April 1980","M"),SP("Operating location","Utopia Planitia","R")],
 status:{kind:"left",text:"Inactive since its batteries failed in April 1980."}, museum:"viking", src:["vl2","viking"]};

V["mars-pathfinder"] = {level:2, vehicles:["Pathfinder lander (Carl Sagan Memorial Station)","Sojourner rover"],
 overview:"A low-cost lander that bounced to a stop on airbags and released Sojourner, the first rover on Mars. The lander is not the rover: the lander carried the main camera and weather station; Sojourner studied rocks nearby.",
 hw:[
  H("structure","Tetrahedral lander with three petals","Lander that opened like a flower after landing.","Petals unfolded to right the lander and expose solar cells.","",null,{src:["mpf","mpfS"]}),
  H("mobility","Airbags","Inflated airbags around the lander.","The lander bounced across the surface before rolling to a stop.","First airbag landing on Mars; reused for Spirit and Opportunity.",null,{src:["mpf"]}),
  H("mobility","Sojourner six-wheel rocker-bogie chassis","Six wheels with a rocker-bogie suspension.","Kept all wheels in contact while climbing over rocks.","First rocker-bogie rover on Mars.","Top speed about 1 cm/s (design)",{src:["mpf","mpfS"]}),
  H("power","Sojourner solar panel and batteries","Solar panel on top of the rover; non-rechargeable backup batteries.","","",null,{src:["mpf"]}),
  H("comms","Sojourner radio modem","UHF link to the lander.","The lander relayed rover data to Earth.","The rover could not talk to Earth directly.",null,{src:["mpf"]}),
  H("nav","Sojourner cameras and laser hazard detection","Two front monochrome cameras, one rear colour camera, laser stripers.","Detected obstacles and supported semi-autonomous driving.","",null,{src:["mpf"]})],
 ins:[
  I("img","Imager for Mars Pathfinder","IMP","Stereo colour imaging from the lander.","Stereo camera on a mast with filter wheels.","Landscape, atmosphere","Images and panoramas","Thousands of images of Ares Vallis.","Inactive",{src:["mpf"]}),
  I("atmo","Atmospheric Structure Instrument / Meteorology package","ASI/MET","Measure the atmosphere during descent and the weather afterwards.","Sensors for temperature, pressure and wind.","Temperature, pressure, wind","Time series","","Inactive",{src:["mpf"]}),
  I("chem","Alpha Proton X-ray Spectrometer","APXS","Measure rock chemistry from the rover.","Radioactive sources excite the rock.","Elemental composition","Spectra","Analysed rocks such as Barnacle Bill and Yogi.","Inactive",{src:["mpf"]}),
  I("env","Magnet arrays","—","Study magnetic dust.","Magnets collected airborne dust for imaging.","Magnetic dust","Images","","Inactive",{src:["mpf"]})],
 specs:[SP("Rover mass","10.6 kg (Sojourner)","R"),SP("Dimensions",ND),SP("Power source","Solar","R"),SP("Communication","Rover relayed via lander","R"),SP("Landing","4 July 1997","M"),SP("Mission duration","About 3 months (planned 7 sols for the rover, 30 days for the lander)","M"),SP("Operating location","Ares Vallis","R")],
 status:{kind:"left",text:"Last transmission from the lander on 27 September 1997. Lander and rover remain at the site."},
 diagram:{img:"img/sojourner.webp", w:819, h:415, id:"PIA04318", page:"https://images.nasa.gov/details/PIA04318", credit:"NASA/JPL",
  note:"Sojourner on Mars, imaged by the lander's camera.", spots:[[43,57,"Sojourner solar panel and batteries"],[35,75,"Sojourner six-wheel rocker-bogie chassis"],[52,64,"Sojourner cameras and laser hazard detection"]]},
 src:["mpf","mpfS"]};

V["mars-odyssey"] = {level:1, vehicles:["2001 Mars Odyssey orbiter"],
 overview:"NASA's longest-serving Mars spacecraft, mapping minerals and hydrogen and relaying data from landers and rovers.",
 hw:[H("power","Solar array","Solar panels with battery.","","",null,{src:["ody"]}), H("comms","High-gain and UHF relay antennas","X-band dish and UHF relay.","Relays data from surface missions.","",null,{src:["ody"]})],
 ins:[
  I("img","Thermal Emission Imaging System","THEMIS","Map minerals and temperatures.","Visible and infrared imager.","Thermal infrared, visible","Images","Global thermal maps of Mars.","Operational",{src:["ody"]}),
  I("rad","Gamma Ray Spectrometer suite","GRS (with NS and HEND)","Map elements and hydrogen.","Gamma-ray and neutron detectors.","Elements, hydrogen","Maps","Detected hydrogen indicating water ice close to the surface at high latitudes.","Partly operational (not confirmed)",{src:["ody"]}),
  I("rad","Mars Radiation Environment Experiment","MARIE","Measure radiation hazards.","Particle spectrometer.","Radiation","Dose","","Inactive",{src:["ody"]})],
 specs:[SP("Mass","725 kg at launch","R"),SP("Power source","Solar","R"),SP("Communication","UHF relay","R"),SP("Mission duration","Operating since 2001","M")],
 status:{kind:"operating",text:"Operating (as last verified)."}, src:["ody"]};

V["mars-express"] = {level:1, vehicles:["Mars Express orbiter","Beagle 2 lander (lost, found in 2015)"],
 overview:"ESA's first Mars mission. The orbiter is still operating; its Beagle 2 lander landed but failed to deploy fully.",
 hw:[H("power","Solar arrays","Two solar wings.","","",null,{src:["mex"]}), H("comms","High-gain antenna","Dish antenna.","","",null,{src:["mex"]})],
 ins:[
  I("img","High Resolution Stereo Camera","HRSC","Stereo colour mapping.","Pushbroom stereo camera.","Topography, colour","Images, elevation models","","Operational",{src:["mex"]}),
  I("spectro","OMEGA mineralogy spectrometer","OMEGA","Map minerals.","Visible and infrared imaging spectrometer.","Mineralogy","Spectra","Mapped hydrated minerals such as clays and sulfates.","Operational",{src:["mex"]}),
  I("geo","Mars Advanced Radar for Subsurface and Ionosphere Sounding","MARSIS","Probe below the surface.","Low-frequency radar with long antenna.","Subsurface layers, ionosphere","Radargrams","","Operational",{src:["mex"]}),
  I("atmo","Atmosphere and plasma instruments","SPICAM, PFS, ASPERA-3, MaRS","Study atmosphere, climate and solar-wind escape.","Spectrometers, particle analysers and radio science.","Gases, plasma","Spectra","","Operational",{src:["mex"]})],
 specs:[SP("Mass",ND),SP("Power source","Solar","R"),SP("Mission duration","Operating since 2003","M")],
 status:{kind:"operating",text:"Orbiter operating. Beagle 2 landed but did not deploy all its solar panels; it was found in images in 2015."}, src:["mex"]};

V["spirit"] = {level:2, vehicles:["Spirit rover (MER-A)","Lander platform with airbags (left at landing site)"],
 overview:"One of the twin Mars Exploration Rovers. Spirit explored Gusev crater and the Columbia Hills for more than six years, far beyond its 90-sol plan.",
 hw:P.MER("merA"), ins:P.MER_INS("merA"),
 specs:[SP("Mass","185 kg","R"),SP("Dimensions","About 1.5 m tall, 2.3 m wide, 1.6 m long (design)","D"),SP("Power source","Solar arrays, lithium-ion batteries","R"),SP("Communication","Direct to Earth and UHF relay","R"),SP("Maximum speed","About 5 cm/s (design)","D"),SP("Distance driven","7.73 km","M"),SP("Landing","4 January 2004","M"),SP("Mission duration","Planned 90 sols; operated over 6 years","M"),SP("Operating location","Gusev crater","R")],
 status:{kind:"left",text:"Lost a front wheel motor in 2006 and became stuck in soft soil in 2009. Last communication on 22 March 2010."},
 diagram:{img:"veh/img/opp_self.webp", w:1600, h:1251, id:"PIA18079", page:"https://images.nasa.gov/details/PIA18079", credit:"NASA/JPL-Caltech/Cornell Univ./Arizona State Univ.",
  note:"This self-portrait shows Opportunity, Spirit's identical twin, in 2014. Spirit was built to the same design.",
  spots:[[68,30,"Solar arrays and lithium-ion batteries"],[50,64,"Solar arrays and lithium-ion batteries"],[26,74,"Pancam Mast Assembly with Navcams; Hazcams"],[50,45,"Warm Electronics Box (rover body)"]]},
 src:["merA","mer"]};

V["opportunity"] = {level:2, vehicles:["Opportunity rover (MER-B)","Lander platform, heat shield and backshell (left at Meridiani)"],
 overview:"Spirit's twin. Opportunity found evidence of past liquid water at Meridiani Planum and drove more than 45 km in over 14 years.",
 hw:P.MER("merB"), ins:P.MER_INS("merB"),
 specs:[SP("Mass","185 kg","R"),SP("Dimensions","About 1.5 m tall, 2.3 m wide, 1.6 m long (design)","D"),SP("Power source","Solar arrays, lithium-ion batteries","R"),SP("Communication","Direct to Earth and UHF relay","R"),SP("Maximum speed","About 5 cm/s (design)","D"),SP("Distance driven","45.16 km","M"),SP("Landing","25 January 2004","M"),SP("Mission duration","Planned 90 sols; operated over 14 years","M"),SP("Operating location","Meridiani Planum","R")],
 status:{kind:"left",text:"Contact lost on 10 June 2018 during a global dust storm; the mission was declared complete in February 2019."},
 diagram:{img:"veh/img/opp_self.webp", w:1600, h:1251, id:"PIA18079", page:"https://images.nasa.gov/details/PIA18079", credit:"NASA/JPL-Caltech/Cornell Univ./Arizona State Univ.",
  note:"Self-portrait by Opportunity's Pancam in March 2014, after wind cleaned dust from the solar arrays. The mast is in the foreground.",
  spots:[[68,30,"Solar arrays and lithium-ion batteries"],[50,64,"Solar arrays and lithium-ion batteries"],[26,74,"Pancam Mast Assembly with Navcams; Hazcams"],[50,45,"Warm Electronics Box (rover body)"]]},
 src:["merB","mer"]};

V["mro"] = {level:1, vehicles:["Mars Reconnaissance Orbiter"],
 overview:"A NASA orbiter with the most powerful camera sent to another planet. It has imaged landers, rovers, parachutes and crash sites and relays rover data.",
 hw:[H("power","Solar arrays","Two large solar panels.","","",null,{src:["mro"]}), H("comms","3 m high-gain antenna and Electra UHF relay","Dish antenna and relay radio.","High-rate data return and surface relay.","",null,{src:["mro"]})],
 ins:[
  I("img","High Resolution Imaging Science Experiment","HiRISE","Very high-resolution imaging.","Large telescope camera.","Surface detail","Images","Imaged surface hardware, including Beagle 2 and Perseverance's landing gear.","Operational",{src:["mro"],img:"m20_hw"}),
  I("img","Context Camera","CTX","Regional mapping.","Pushbroom camera.","Surface","Images","Near-global coverage.","Operational",{src:["mro"]}),
  I("img","Mars Color Imager","MARCI","Daily weather maps.","Wide-angle camera.","Clouds, dust","Global images","","Operational",{src:["mro"]}),
  I("spectro","Compact Reconnaissance Imaging Spectrometer for Mars","CRISM","Map minerals.","Imaging spectrometer.","Mineralogy","Spectra","","Inactive (retired)",{src:["mro"]}),
  I("atmo","Mars Climate Sounder","MCS","Profile the atmosphere.","Infrared radiometer.","Temperature, dust, ice","Profiles","","Operational",{src:["mro"]}),
  I("geo","Shallow Radar","SHARAD","Probe subsurface layers.","Radar sounder.","Subsurface structure","Radargrams","","Operational",{src:["mro"]})],
 specs:[SP("Mass","2,180 kg at launch","R"),SP("Power source","Solar","R"),SP("Communication","X-band, Ka-band experiment, UHF relay","R"),SP("Mission duration","Operating since 2006","M")],
 status:{kind:"operating",text:"Operating."}, src:["mro"]};

V["phoenix"] = {level:1, vehicles:["Phoenix lander","Heat shield, backshell and parachute (left nearby)"],
 overview:"A stationary lander that dug into icy soil near the north pole and confirmed water ice beneath the surface.",
 hw:[
  H("structure","Lander deck","Three-legged lander built partly from Mars Surveyor 2001 hardware.","","",null,{src:["phx","phxS"]}),
  H("power","Two solar arrays","Decagonal folding solar panels.","Unfolded after landing like fans.","Winter ice later broke at least one panel, seen in orbital images in 2010.",null,{src:["phx","phxS"]}),
  H("robotic","Robotic arm","Arm with scoop, rasp and camera.","Dug trenches and delivered samples to the instruments.","",null,{src:["phx"]}),
  H("comms","UHF relay antenna","UHF radio.","Relayed data through Mars orbiters.","",null,{src:["phx"]})],
 ins:[
  I("img","Surface Stereo Imager","SSI","Stereo colour panoramas.","Mast-mounted stereo camera.","Landscape, atmosphere","Images","","Inactive",{src:["phx"]}),
  I("chem","Thermal and Evolved Gas Analyzer","TEGA","Heat soil and analyse gases.","Small ovens with a mass spectrometer.","Volatiles, ice, minerals","Gas measurements","Confirmed water ice in the samples.","Inactive",{src:["phx"]}),
  I("chem","Microscopy, Electrochemistry and Conductivity Analyzer","MECA","Soil chemistry and microscopy.","Wet-chemistry cells, microscopes and a conductivity probe.","Soluble salts, particle shapes","Measurements and images","Found perchlorate salts in the soil.","Inactive",{src:["phx"]}),
  I("img","Robotic Arm Camera","RAC","Image samples in the scoop and trenches.","Camera on the arm.","Close-up images","Images","","Inactive",{src:["phx"]}),
  I("atmo","Meteorological Station (Canada)","MET","Weather and clouds.","Temperature and pressure sensors plus a lidar.","Weather, cloud particles","Time series, lidar profiles","Detected snow falling from clouds.","Inactive",{src:["phx"]})],
 specs:[SP("Lander mass","350 kg","R"),SP("Power source","Solar arrays","R"),SP("Communication","UHF relay","R"),SP("Landing","25 May 2008","M"),SP("Mission duration","About 5 months (planned 3 months)","M"),SP("Operating location","Vastitas Borealis","R")],
 status:{kind:"left",text:"Last contact on 2 November 2008 as the polar winter set in. It did not revive in 2010."}, src:["phx","phxS"]};

V["curiosity"] = {level:2, vehicles:["Curiosity rover","Descent stage, heat shield and backshell (left near Bradbury Landing)"],
 overview:"A car-sized nuclear-powered rover exploring Gale crater and Mount Sharp. It showed that ancient Gale crater could have supported microbial life.",
 hw:[
  H("structure","Rover body (Warm Electronics Box)","Insulated chassis holding computers and the analytical laboratory instruments.","Fluid loops move heat from the power source around the rover.","",null,{src:["msl","mslS"]}),
  H("mobility","Six aluminium wheels with rocker-bogie suspension","Six wheels, each with its own motor; four steer.","The rocker-bogie keeps wheels in contact over rough ground.","Wheel damage from sharp rocks led to new driving strategies.","Wheel diameter about 50 cm (design); top speed about 4 cm/s (design)",{src:["msl","mslS"]}),
  H("power","Multi-Mission Radioisotope Thermoelectric Generator","MMRTG fuelled with plutonium-238 dioxide, plus lithium-ion batteries.","Converts decay heat to electricity; waste heat warms the rover.","Enables year-round operation independent of sunlight.","About 110 W at launch, declining slowly (design)",{src:["msl","mslS"]}),
  H("comms","High-gain, low-gain and UHF antennas","X-band antennas plus UHF relay radio.","Most data travels via Mars orbiters.","",null,{src:["msl"]}),
  H("nav","Remote Sensing Mast, Navcams and Hazcams","Mast carrying ChemCam, Mastcam and stereo Navcams; Hazcams on the body.","Stereo images support autonomous driving and planning.","",null,{src:["msl","mslS"]}),
  H("nav","Rover Compute Element","Redundant flight computers.","Run driving, arm control and science operations.","",null,{src:["msl"]}),
  H("robotic","Robotic arm and turret","Five-joint arm about 2.1 m long carrying a drill, sample-processing scoop and sieves (CHIMRA), brush, MAHLI and APXS.","Drills rock powder and delivers it to CheMin and SAM inside the body.","First rover to drill into Martian rock for sample analysis.",null,{src:["msl","mslS"]})],
 ins:[
  I("img","Mast Camera","Mastcam","Colour and multispectral imaging.","Two cameras of different focal length on the mast.","Landscape, geology","Images, video","","Operational",{src:["msl","mslS"]}),
  I("chem","Chemistry and Camera","ChemCam","Remote elemental analysis.","A laser vaporises a spot on a rock up to several metres away; a spectrometer reads the light (LIBS).","Elements","Spectra, images","Tens of thousands of laser analyses.","Operational",{src:["msl","mslS"]}),
  I("img","Mars Hand Lens Imager","MAHLI","Close-up imaging; rover selfies.","Camera on the arm turret.","Grain-scale texture","Images","Also takes the rover's self-portraits.","Operational",{src:["msl","mslS"],img:"curiosity"}),
  I("img","Mars Descent Imager","MARDI","Record the descent.","Downward camera.","Landing site","Video","","Operational",{src:["msl"]}),
  I("chem","Alpha Particle X-ray Spectrometer","APXS","Rock and soil chemistry.","Curium sources on the arm turret.","Elements","Spectra","","Operational",{src:["msl"]}),
  I("chem","Chemistry and Mineralogy","CheMin","Identify minerals in drilled samples.","X-ray diffraction.","Mineralogy","Diffraction patterns","Found clay minerals formed in water.","Operational",{src:["msl","mslS"]}),
  I("sample","Sample Analysis at Mars","SAM","Analyse organics, gases and isotopes.","Gas chromatograph, mass spectrometer and tunable laser spectrometer.","Organics, methane, isotopes","Spectra","Detected organic molecules and seasonal changes in methane.","Operational",{src:["msl","mslS"]}),
  I("rad","Radiation Assessment Detector","RAD","Measure radiation for future crews.","Particle detector.","Radiation dose","Dose rates","Measured radiation in cruise and on the surface.","Operational",{src:["msl"]}),
  I("rad","Dynamic Albedo of Neutrons","DAN","Detect hydrogen below the surface.","Neutron generator and detectors.","Subsurface hydrogen","Neutron counts","","Operational",{src:["msl"]}),
  I("atmo","Rover Environmental Monitoring Station","REMS","Weather.","Booms on the mast with temperature, wind, humidity, pressure and UV sensors.","Weather","Time series","Long weather record at Gale crater.","Operational",{src:["msl"]})],
 specs:[SP("Vehicle mass","899 kg","R"),SP("Dimensions","About 3 m long (excluding arm), 2.7 m wide, 2.2 m tall (design)","D"),SP("Power source","MMRTG (plutonium-238)","R"),SP("Power capacity","About 110 W at launch (design)","D"),SP("Mobility","Six wheels, rocker-bogie","R"),SP("Maximum speed","About 4 cm/s on flat ground (design)","D"),SP("Communication","Direct to Earth and UHF relay","R"),SP("Distance driven","38.48 km (JPL waypoints to sol 5045)","M"),SP("Landing","6 August 2012","M"),SP("Mission duration","Planned 2 Earth years; operating since 2012","M"),SP("Operating location","Gale crater / Mount Sharp","R")],
 status:{kind:"operating",text:"Operating (as last verified). Its descent stage, heat shield, backshell and parachute were left on the surface."},
 diagram:{img:"img/curiosity.webp", w:1920, h:1169, id:"PIA19808", page:"https://images.nasa.gov/details/PIA19808", credit:"NASA/JPL-Caltech/MSSS",
  note:"Low-angle self-portrait taken with MAHLI on the robotic arm; the arm was removed from the mosaic.",
  spots:[[57.5,29,"Remote Sensing Mast, Navcams and Hazcams"],[63,47,"Rover body (Warm Electronics Box)"],[82,64,"Six aluminium wheels with rocker-bogie suspension"],[47,58,"Six aluminium wheels with rocker-bogie suspension"]]},
 src:["msl","mslS"]};

V["mangalyaan"] = {level:1, vehicles:["Mars Orbiter Mission spacecraft"],
 overview:"India's first interplanetary mission, which reached Mars orbit on its first attempt and operated for about eight years.",
 hw:[H("power","Solar array","Single solar panel.","","",null,{src:["mom"]}), H("comms","High-gain antenna","Dish antenna.","","",null,{src:["mom"]})],
 ins:[
  I("img","Mars Colour Camera","MCC","Colour imaging.","Camera.","Surface, atmosphere","Images","Full-disc images of Mars.","Contact lost",{src:["mom"]}),
  I("atmo","Lyman Alpha Photometer","LAP","Study hydrogen loss.","Photometer.","Hydrogen and deuterium","Measurements","","Contact lost",{src:["mom"]}),
  I("atmo","Methane Sensor for Mars","MSM","Search for methane.","Spectrometer.","Methane","Spectra","","Contact lost",{src:["mom"]}),
  I("atmo","Mars Exospheric Neutral Composition Analyser","MENCA","Analyse the upper atmosphere.","Mass spectrometer.","Neutral gases","Spectra","","Contact lost",{src:["mom"]}),
  I("spectro","Thermal Infrared Imaging Spectrometer","TIS","Map temperature and minerals.","Infrared spectrometer.","Thermal emission","Spectra","","Contact lost",{src:["mom"]})],
 specs:[SP("Mass","1,337 kg at launch","R"),SP("Power source","Solar","R"),SP("Mission duration","About 8 years","M")],
 status:{kind:"lost",text:"Contact was lost in 2022."}, src:["mom","isro"]};

V["maven"] = {level:1, vehicles:["MAVEN orbiter"],
 overview:"A NASA orbiter studying how Mars lost its atmosphere to space.",
 hw:[H("power","Solar arrays","Gull-wing solar panels.","","",null,{src:["maven"]}), H("comms","High-gain and UHF relay antennas","Dish antenna and relay radio.","","",null,{src:["maven"]})],
 ins:[
  I("atmo","Neutral Gas and Ion Mass Spectrometer","NGIMS","Upper-atmosphere composition.","Mass spectrometer.","Neutral gases, ions","Spectra","","See mission status",{src:["maven"]}),
  I("spectro","Imaging Ultraviolet Spectrograph","IUVS","Upper atmosphere and escaping hydrogen.","UV spectrograph.","UV emissions","Spectra","","See mission status",{src:["maven"]}),
  I("env","Particles and Fields package","SWEA, SWIA, STATIC, SEP, MAG, LPW/EUV","Measure the solar wind, ions and magnetic fields driving escape.","Particle analysers, magnetometer, Langmuir probe.","Plasma, fields","Measurements","Showed the solar wind strips gas from the atmosphere.","See mission status",{src:["maven"]})],
 specs:[SP("Mass","2,454 kg at launch","R"),SP("Power source","Solar","R"),SP("Communication","UHF relay","R"),SP("Mission duration","About 11 years","M")],
 status:{kind:"lost",text:"Contact lost (as recorded in this archive)."}, src:["maven"]};

V["insight"] = {level:1, vehicles:["InSight lander","Heat shield and parachute (left nearby)"],
 overview:"A stationary lander that placed a seismometer and a heat probe on the ground to study the interior of Mars.",
 hw:[
  H("structure","Lander deck","Three-legged lander based on Phoenix's design.","","",null,{src:["nsyt","nsytS"]}),
  H("power","Two round solar arrays","Fan-like solar arrays about 2.2 m across each.","Dust gradually reduced their output.","Dust accumulation ended the mission.",null,{src:["nsyt","nsytS"]}),
  H("robotic","Instrument Deployment Arm","Arm with a grapple and camera.","Lifted SEIS and HP3 off the deck and set them on the ground.","First robotic placement of instruments on another planet's surface.",null,{src:["nsyt"]}),
  H("comms","UHF and X-band antennas","Relay radio and direct-to-Earth antennas.","","",null,{src:["nsyt"]})],
 ins:[
  I("geo","Seismic Experiment for Interior Structure","SEIS","Record marsquakes.","Very sensitive seismometers under a wind and thermal shield.","Ground motion","Seismic records","Recorded more than 1,300 marsquakes and measured the size of the core.","Inactive",{src:["nsyt","nsytS"]}),
  I("geo","Heat Flow and Physical Properties Package","HP3","Measure heat escaping from the interior.","A self-hammering 'mole' with a sensor tether.","Subsurface temperature","Measurements","The mole could not dig deep enough in the cohesive soil.","Inactive",{src:["nsyt"]}),
  I("geo","Rotation and Interior Structure Experiment","RISE","Measure Mars's wobble.","Precise radio tracking.","Rotation","Doppler data","Constrained the size of the core.","Inactive",{src:["nsyt"]}),
  I("atmo","Auxiliary Payload Sensor Suite","APSS (TWINS, pressure sensor, magnetometer)","Weather and magnetic field, to separate wind noise from quakes.","Wind, temperature, pressure and magnetic sensors.","Weather, magnetic field","Time series","Measured the first magnetic field on the surface of Mars.","Inactive",{src:["nsyt"]}),
  I("geo","Laser Retroreflector (Italy)","LaRRI","Passive target for future orbiters.","Corner-cube reflectors.","—","—","","Passive",{src:["nsyt"]})],
 specs:[SP("Lander mass","358 kg","R"),SP("Power source","Solar arrays","R"),SP("Communication","UHF relay; direct to Earth","R"),SP("Landing","26 November 2018","M"),SP("Mission duration","About 4 years","M"),SP("Operating location","Elysium Planitia","R")],
 status:{kind:"left",text:"Last contact on 15 December 2022 after dust covered the solar arrays."}, src:["nsyt","nsytS"]};

V["hope"] = {level:1, vehicles:["Hope orbiter"],
 overview:"The United Arab Emirates' first Mars mission, observing the whole atmosphere from a high orbit.",
 hw:[H("power","Solar arrays","Three solar panels.","","",null,{src:["hope"]}), H("comms","High-gain antenna","Dish antenna.","","",null,{src:["hope"]})],
 ins:[
  I("img","Emirates eXploration Imager","EXI","Colour and UV images of the atmosphere.","Multiband camera.","Clouds, dust, ozone","Images","","Operational",{src:["hope"]}),
  I("spectro","Emirates Mars InfraRed Spectrometer","EMIRS","Lower-atmosphere temperature, dust and ice.","Infrared spectrometer.","Temperature, dust, ice","Spectra","","Operational",{src:["hope"]}),
  I("spectro","Emirates Mars Ultraviolet Spectrometer","EMUS","Upper atmosphere and hydrogen corona.","UV spectrometer.","Oxygen, hydrogen","Spectra","","Operational",{src:["hope"]})],
 specs:[SP("Mass",ND),SP("Power source","Solar","R"),SP("Mission duration","Operating since 2021","M"),SP("Operating location","High Mars orbit","R")],
 status:{kind:"operating",text:"Operating."}, src:["hope"]};

V["tianwen-1"] = {level:1, vehicles:["Tianwen-1 orbiter","Landing platform","Zhurong rover"],
 overview:"China's first Mars mission: an orbiter, a landing platform and the Zhurong rover, which explored Utopia Planitia for about a year. The landing platform is not the rover.",
 hw:[
  H("structure","Landing platform","Lander with ramps.","Landed and released Zhurong.","Remains at the landing site.",null,{src:["tw1","cnsa"]}),
  H("mobility","Zhurong six-wheel chassis","Six-wheel active suspension.","Can raise and lower its body to escape soft ground.","","Rover mass about 240 kg (reported)",{src:["tw1","cnsa"]}),
  H("power","Four solar panels","Butterfly-like solar wings.","Charged batteries; heat-storing windows warmed the rover.","Dust reduced power before hibernation.",null,{src:["tw1"]}),
  H("comms","Relay via orbiter","UHF link to the Tianwen-1 orbiter.","","",null,{src:["tw1"]})],
 ins:[
  I("img","Navigation and terrain cameras","NaTeCam","Stereo images for driving.","Mast cameras.","Terrain","Images","","Not responding since 2022",{src:["tw1"]}),
  I("img","Multispectral camera","MSCam","Colour and spectral imaging.","Camera with filters.","Colour","Images","","Not responding since 2022",{src:["tw1"]}),
  I("geo","Rover penetrating radar","RoPeR","Probe subsurface layers.","Ground-penetrating radar.","Subsurface layers","Radargrams","Revealed buried layers under Utopia Planitia.","Not responding since 2022",{src:["tw1"]}),
  I("chem","Mars Surface Composition Detector","MarSCoDe","Rock chemistry.","Laser-induced breakdown spectroscopy and infrared spectroscopy.","Elements, minerals","Spectra","","Not responding since 2022",{src:["tw1"]}),
  I("env","Magnetometer and climate station","RoMAG, MCS","Magnetic field and weather.","Fluxgate magnetometer; weather sensors.","Field, weather","Time series","","Not responding since 2022",{src:["tw1"]})],
 specs:[SP("Rover mass","About 240 kg","R"),SP("Power source","Solar","R"),SP("Communication","Orbiter relay","R"),SP("Distance driven","1,921 m (reported)","R"),SP("Landing","15 May 2021 Beijing time (14 May UTC)","M"),SP("Mission duration","Rover active about one year","M"),SP("Operating location","Utopia Planitia","R")],
 status:{kind:"left",text:"Zhurong entered hibernation in May 2022 and has not been confirmed to have woken."}, src:["tw1","cnsa"]};

V["perseverance"] = {level:2, vehicles:["Perseverance rover","Ingenuity helicopter (separate page)","Descent stage, heat shield, backshell and parachute (left)"],
 overview:"NASA's sample-caching rover in Jezero crater. Built on Curiosity's design with new instruments, a coring drill and a sample-tube system.",
 hw:[
  H("structure","Rover body","Chassis built on Curiosity's design.","","",null,{src:["m20","m20S"]}),
  H("mobility","Six wheels with rocker-bogie suspension","Narrower, thicker aluminium wheels than Curiosity's.","Each wheel has its own motor; four steer.","Designed to resist the damage seen on Curiosity.","Top speed about 4.2 cm/s (design)",{src:["m20","m20S"]}),
  H("power","Multi-Mission Radioisotope Thermoelectric Generator","MMRTG plus lithium-ion batteries.","Plutonium-238 decay heat converted to electricity.","","About 110 W at launch (design)",{src:["m20"]}),
  H("comms","High-gain, low-gain and UHF antennas","X-band and UHF radios.","Most data relayed by orbiters.","",null,{src:["m20"]}),
  H("nav","Remote Sensing Mast and engineering cameras","Mast with SuperCam, Mastcam-Z and Navcams; Hazcams on the body.","Supports science and autonomous driving (AutoNav).","Drives much faster than earlier rovers using onboard navigation.",null,{src:["m20","m20S"]}),
  H("nav","Terrain-Relative Navigation","Landing camera and onboard map matching.","Picked a safe touchdown point during descent.","Allowed landing in hazardous Jezero crater.",null,{src:["m20","m20S"]}),
  H("robotic","Robotic arm and turret","Arm about 2.1 m long carrying the coring drill, PIXL, SHERLOC/WATSON and an abrasion tool.","Places instruments on rocks and drills cores.","",null,{src:["m20","m20S"]}),
  H("robotic","Sample Caching System","43 sample tubes with an internal handling arm.","Stores rock cores in sealed tubes for possible return to Earth.","Ten tubes were placed in the Three Forks depot.",null,{src:["m20","m20S"]}),
  H("comms","Microphones","Two microphones (one on SuperCam).","Recorded the sounds of Mars, including Ingenuity in flight.","",null,{src:["m20"]})],
 ins:[
  I("img","Mastcam-Z","Mastcam-Z","Zoomable stereo colour imaging.","Twin zoom cameras on the mast.","Landscape, geology","Images, video","","Operational",{src:["m20","m20S"]}),
  I("chem","SuperCam","SuperCam","Remote chemistry and mineralogy.","Laser spectroscopy (LIBS, Raman), infrared spectroscopy, camera and microphone.","Elements, minerals","Spectra, audio","","Operational",{src:["m20","m20S"]}),
  I("chem","Planetary Instrument for X-ray Lithochemistry","PIXL","Fine-scale elemental mapping.","Focused X-ray beam on the arm turret.","Elements","Element maps","","Operational",{src:["m20","m20S"]}),
  I("spectro","Scanning Habitable Environments with Raman & Luminescence for Organics & Chemicals","SHERLOC (with WATSON)","Detect organics and minerals.","Ultraviolet Raman and fluorescence spectrometer with a close-up camera.","Organics, minerals","Spectra, images","","Operational (not confirmed)",{src:["m20","m20S"]}),
  I("geo","Radar Imager for Mars' Subsurface Experiment","RIMFAX","Image subsurface layers.","Ground-penetrating radar.","Subsurface structure","Radargrams","Mapped layers beneath the crater floor.","Operational",{src:["m20","m20S"]}),
  I("atmo","Mars Environmental Dynamics Analyzer","MEDA","Weather and dust.","Wind, temperature, pressure, humidity, radiation and dust sensors.","Weather","Time series","","Operational",{src:["m20","m20S"]}),
  I("sample","Mars Oxygen In-Situ Resource Utilization Experiment","MOXIE","Make oxygen from Martian air.","Solid-oxide electrolysis splits carbon dioxide.","Oxygen production","Performance data","Produced 122 g of oxygen in 16 runs before completing its mission.","Completed",{src:["m20","m20S"]}),
  I("sample","Coring drill and sample tubes","—","Collect cores for possible return.","Rotary-percussive coring drill.","—","Sample tubes","Sealed rock cores from Jezero crater.","Operational",{src:["m20","m20S"]})],
 specs:[SP("Vehicle mass","1,025 kg","R"),SP("Dimensions","About 3 m long (excluding arm), 2.7 m wide, 2.2 m tall (design)","D"),SP("Power source","MMRTG (plutonium-238)","R"),SP("Power capacity","About 110 W at launch (design)","D"),SP("Mobility","Six wheels, rocker-bogie","R"),SP("Maximum speed","About 4.2 cm/s on flat ground (design)","D"),SP("Communication","Direct to Earth and UHF relay","R"),SP("Distance driven","45.25 km (JPL waypoints to sol 2022)","M"),SP("Landing","18 February 2021","M"),SP("Mission duration","Planned at least one Mars year; operating since 2021","M"),SP("Operating location","Jezero crater","R")],
 status:{kind:"operating",text:"Operating (as last verified). Its descent stage, heat shield, backshell and parachute were left on the surface."},
 diagram:{img:"img/perseverance.webp", w:1920, h:1412, id:"PIA24542", page:"https://images.nasa.gov/details/PIA24542", credit:"NASA/JPL-Caltech/MSSS",
  note:"Self-portrait with Ingenuity, taken with WATSON on the robotic arm; the arm was removed from the mosaic.",
  spots:[[64.5,23.5,"Remote Sensing Mast and engineering cameras"],[73,40,"Rover body"],[85,50,"Six wheels with rocker-bogie suspension"],[47,37,"__ingenuity"]]},
 museum:"perseverance", src:["m20","m20S"]};

V["ingenuity"] = {level:2, vehicles:["Ingenuity helicopter"],
 overview:"A 1.8 kg technology demonstration that made the first powered, controlled flight on another planet. It flew 72 times before rotor damage ended flights in January 2024.",
 hw:[
  H("mobility","Coaxial counter-rotating rotors","Two rotors 1.2 m across, spinning in opposite directions.","Spin at about 2,400–2,900 rpm to generate lift in air about 1% as dense as Earth's.","First powered flight on another planet.","Rotor span 1.2 m (design)",{src:["heli"]}),
  H("power","Solar panel and batteries","Solar panel above the rotors charging six lithium-ion cells.","","",null,{src:["heli"]}),
  H("structure","Fuselage","Small box holding batteries, computers and heaters.","Insulated against cold nights.","",null,{src:["heli"]}),
  H("mobility","Four landing legs","Carbon-fibre legs.","","",null,{src:["heli"]}),
  H("nav","Flight computers and sensors","Commercial processor, inertial sensors, laser altimeter and downward navigation camera.","Fly autonomously; Earth is too far away to steer in real time.","Used off-the-shelf parts in a Mars mission.",null,{src:["heli"]}),
  H("comms","Radio link to Perseverance","Low-power radio.","Perseverance relays commands and data.","",null,{src:["heli"]})],
 ins:[I("img","Colour and navigation cameras","RTE, NAV","Navigation and scouting.","A downward black-and-white navigation camera and a colour camera.","Terrain","Images","Scouted routes for Perseverance.","Inactive (flight ended)",{src:["heli"]})],
 specs:[SP("Vehicle mass","1.8 kg","R"),SP("Dimensions","Rotor span 1.2 m","D"),SP("Power source","Solar panel and lithium-ion batteries","R"),SP("Mobility","Flight","R"),SP("Flights","72","M"),SP("Distance flown","About 18.1 km (JPL flight log)","M"),SP("Mission duration","Planned 5 test flights in 30 sols; flew for about 3 years","M"),SP("Operating location","Jezero crater","R")],
 status:{kind:"left",text:"Flight operations ended after damage on flight 72 (18 January 2024). Its current status is not confirmed in verified sources."},
 diagram:{img:"img/ingenuity.webp", w:1920, h:1280, id:"PIA23882", page:"https://images.nasa.gov/details/PIA23882", credit:"NASA/JPL-Caltech",
  note:"The actual flight model before launch.",
  spots:[[47,24,"Solar panel and batteries"],[75,35,"Coaxial counter-rotating rotors"],[30,37,"Coaxial counter-rotating rotors"],[47,57,"Fuselage"],[25,72,"Four landing legs"]]},
 museum:"ingenuity", src:["heli"]};
})();
