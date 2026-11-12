/* The Last Journey — data: sources, NASA images, map markers, component anchors. Text lives in jr-i18n.js (keys jr_*). */
window.FE_JR = (() => {
const NI = id => "https://images.nasa.gov/details/" + id;
/* sources cited by the experience */
const SRC = {
  jpl2019:["NASA's Opportunity Rover Mission on Mars Comes to End (13 Feb 2019)","https://www.jpl.nasa.gov/news/nasas-opportunity-rover-mission-on-mars-comes-to-end/","NASA/JPL"],
  mer:["Mars Exploration Rovers: Spirit and Opportunity","https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/","NASA Science"],
  merobj:["MER science objectives","https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-objectives/","NASA Science"],
  merhi:["MER science highlights","https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-highlights/","NASA Science"],
  pds:["MER-1 (Opportunity) rover description, SPICE instrument-host catalog","https://naif.jpl.nasa.gov/pub/naif/pds/data/mer1-m-spice-6-v1.0/mer1sp_1000/catalog/insthost.cat","NASA PDS / NAIF"],
  maki:["Maki et al. (2003), Mars Exploration Rover Engineering Cameras, JGR 108(E12) — doi:10.1029/2003JE002077","https://robotics.jpl.nasa.gov/media/documents/maki-jgr-2003je002077.pdf","NASA/JPL"],
  launch:["KSC-03pd2090 — Delta II Heavy launch of Opportunity","https://images.nasa.gov/details/KSC-03pd2090","NASA/KSC"],
  edl:["MER mission timeline: entry, descent and landing (archived)","https://webarchive.library.unt.edu/eot2008/20080916233440/http://mars.jpl.nasa.gov/mer/mission/tl_entry.html","NASA/JPL (archived)"],
  driveoff:["Opportunity drives off its lander (31 Jan 2004, archived release)","https://webarchive.library.unt.edu/eot2008/20080916081951/http://marsrovers.jpl.nasa.gov/newsroom/pressreleases/20040131a.html","NASA/JPL (archived)"],
  marsfact:["Mars Fact Sheet","https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html","NASA NSSDCA"],
  eagle:["PIA21494 — Rover Landing Hardware at Eagle Crater","https://images.nasa.gov/details/PIA21494","NASA/JPL-Caltech/Univ. of Arizona"],
  meteorite:["Opportunity Rover Finds an Iron Meteorite on Mars (19 Jan 2005)","https://www.jpl.nasa.gov/news/opportunity-rover-finds-an-iron-meteorite-on-mars/","NASA/JPL"],
  burns:["PIA15091 — Layers in Burns Cliff Examined by Opportunity","https://images.nasa.gov/details/PIA15091","NASA/JPL-Caltech/Cornell"],
  berries:["PIA05587 — A Bowl of Hematite-Rich Berries","https://images.nasa.gov/details/PIA05587","NASA/JPL/Cornell"],
  homestake:["PIA15035 — Close-up View of Homestake Vein","https://images.nasa.gov/details/PIA15035","NASA/JPL-Caltech"],
  victoria:["PIA08779 — On the Rim of 'Victoria Crater'","https://photojournal.jpl.nasa.gov/catalog/PIA08779","NASA/JPL"],
  endeavour:["PIA14509 — Arrival at 'Spirit Point' by Mars Rover Opportunity","https://www.jpl.nasa.gov/images/pia14509-arrival-at-spirit-point-by-mars-rover-opportunity/","NASA/JPL-Caltech"],
  marathon:["PIA19154 — Opportunity Rover's Full Marathon-Length Traverse","https://photojournal.jpl.nasa.gov/catalog/PIA19154","NASA/JPL-Caltech/MSSS/NMMNHS"],
  finalmap:["PIA23178 — Opportunity's Final Traverse Map","https://science.nasa.gov/photojournal/opportunitys-final-traverse-map/","NASA/JPL-Caltech/MSSS"],
  pvalley:["PIA22217 — Rock Stripes Pattern in 'Perseverance Valley'","https://images.nasa.gov/details/PIA22217","NASA/JPL-Caltech"],
  storm:["PIA22329 — Dust Storm Covers Opportunity","https://images.nasa.gov/details/PIA22329","NASA/JPL-Caltech/MSSS"],
  tau:["PIA22930 — Last Images Opportunity Took","https://images.nasa.gov/details/PIA22930","NASA/JPL-Caltech/Cornell/ASU"],
  lastmsg:["PIA22929 — Opportunity's Last Message","https://images.nasa.gov/details/PIA22929","NASA/JPL-Caltech/Cornell/ASU"],
  after:["PIA22549 — Opportunity After the Dust Storm","https://images.nasa.gov/details/PIA22549","NASA/JPL-Caltech/Univ. of Arizona"],
  purgatory:["PIA07999 — Looking Back at 'Purgatory Dune'","https://www.jpl.nasa.gov/images/pia07999-looking-back-at-purgatory-dune","NASA/JPL"],
  greeley:["Greeley Haven is Winter Workplace for Mars Rover (Jan 2012)","https://www.jpl.nasa.gov/news/greeley-haven-is-winter-workplace-for-mars-rover","NASA/JPL"],
  model:["Spirit and Opportunity Rover, 3D model","https://science.nasa.gov/resource/spirit-and-opportunity-rover-3d-model/","NASA/JPL-Caltech"]
};
/* NASA images used (local copies resized for the web) */
const IMG = {
  launch:{f:"KSC-03pd2090", credit:"NASA/KSC", page:NI("KSC-03pd2090")},
  family:{f:"PIA04421", credit:"NASA/JPL", page:NI("PIA04421")},
  airbags:{f:"PIA05156", credit:"NASA/JPL/Cornell", page:NI("PIA05156")},
  eagle:{f:"PIA21494", credit:"NASA/JPL-Caltech/Univ. of Arizona", page:NI("PIA21494")},
  rat:{f:"PIA05513", credit:"NASA/JPL/Cornell", page:NI("PIA05513")},
  berries:{f:"PIA05587", credit:"NASA/JPL/Cornell", page:NI("PIA05587")},
  navpan:{f:"PIA07463", credit:"NASA/JPL-Caltech", page:NI("PIA07463")},
  spiritpt:{f:"PIA14134", credit:"NASA/JPL-Caltech/Univ. of Arizona", page:NI("PIA14134")},
  homestake:{f:"PIA15035", credit:"NASA/JPL-Caltech", page:NI("PIA15035")},
  burns:{f:"PIA15091", credit:"NASA/JPL-Caltech/Cornell", page:NI("PIA15091")},
  shadow:{f:"PIA16120", credit:"NASA/JPL-Caltech", page:NI("PIA16120")},
  map:{f:"PIA19154", credit:"NASA/JPL-Caltech/MSSS/NMMNHS", page:"https://photojournal.jpl.nasa.gov/catalog/PIA19154"},
  pvpan:{f:"PIA22074", credit:"NASA/JPL-Caltech/Cornell Univ./Arizona State Univ.", page:NI("PIA22074")},
  stripes:{f:"PIA22217", credit:"NASA/JPL-Caltech", page:NI("PIA22217")},
  storm:{f:"PIA22329", credit:"NASA/JPL-Caltech/MSSS", page:NI("PIA22329")},
  tausim:{f:"PIA22521", credit:"NASA/JPL-Caltech/TAMU", page:NI("PIA22521"), sim:true},
  after:{f:"PIA22549", credit:"NASA/JPL-Caltech/Univ. of Arizona", page:NI("PIA22549")},
  lastmsg:{f:"PIA22929", credit:"NASA/JPL-Caltech/Cornell/ASU", page:NI("PIA22929")},
  finalmap:{f:"PIA23178", credit:"NASA/JPL-Caltech/MSSS", page:"https://science.nasa.gov/photojournal/opportunitys-final-traverse-map/"},
  tracks:{f:"PIA23246", credit:"NASA/JPL-Caltech", page:NI("PIA23246")}
};
/* rover selection — mission ids refer to the archive (data.js); only Opportunity is playable in this phase */
const ROVERS = [
  {id:"opportunity", mission:"opportunity", img:"veh/img/opp_self.webp", imgId:"PIA18079", imgPage:NI("PIA18079"), playable:true, landed:"2004-01-25", last:"2018-06-10", where:"jr_w_meridiani"},
  {id:"spirit", mission:"spirit", img:"img/t/spirit.webp", imgId:"PIA05040", imgPage:NI("PIA05040"), landed:"2004-01-04", last:"2010-03-22", where:"jr_w_gusev"},
  {id:"sojourner", mission:"mars-pathfinder", name:"Sojourner", img:"img/t/sojourner.webp", imgId:"PIA04318", imgPage:NI("PIA04318"), landed:"1997-07-04", last:"1997-09-27", where:"jr_w_ares"},
  {id:"curiosity", mission:"curiosity", img:"img/t/curiosity.webp", imgId:"PIA19808", imgPage:NI("PIA19808"), landed:"2012-08-06", where:"jr_w_gale"},
  {id:"perseverance", mission:"perseverance", img:"img/t/perseverance.webp", imgId:"PIA24542", imgPage:NI("PIA24542"), landed:"2021-02-18", where:"jr_w_jezero"}
];
/* chapters: images and sources per chapter */
const CH = [
  {n:1, img:["launch","family"], src:["merobj","launch","jpl2019","driveoff"]},
  {n:2, img:["airbags","eagle"], src:["edl","marsfact","eagle","driveoff","mer"]},
  {n:3, img:["navpan"], src:["model","eagle","meteorite","burns","berries","mer"]},
  {n:4, img:[], src:["berries","burns","meteorite","homestake","merhi","pvalley"]},
  {n:5, img:[], src:["pds","maki","jpl2019","model"]},
  {n:6, img:["storm","tausim","lastmsg","after"], src:["storm","tau","lastmsg","after","jpl2019"]},
  {n:7, img:["tracks","eagle"], src:["jpl2019","mer","merhi","marathon","finalmap"]}
];
/* chapter 4 discovery targets */
const DISC = [
  {k:"d1", img:"berries", src:["berries","merhi"]},
  {k:"d2", img:"burns", src:["burns"]},
  {k:"d3", img:null, src:["meteorite"]},
  {k:"d4", img:"homestake", src:["homestake","merhi"]},
  {k:"d5", img:"spiritpt", src:["merhi","endeavour"]},
  {k:"d6", img:"stripes", src:["pvalley"]}
];
/* chapter 5 components: anchor in model coordinates (metres; +z = front, mast side), sources */
const HW = [
  {k:"h1", a:[-0.56,0.13,0.62], src:["pds","jpl2019"]},
  {k:"h2", a:[0.52,0.36,-0.05], src:["pds","jpl2019"]},
  {k:"h3", a:[-0.86,0.7,-0.2], src:["pds","mer"]},
  {k:"h4", a:[0.18,0.5,-0.25], src:["pds"]},
  {k:"h5", a:[-0.2,0.5,0.1], src:["pds"]},
  {k:"h6", a:[0.05,0.62,0.0], src:["pds","jpl2019"]},
  {k:"h7", a:[-0.05,1.52,0.38], src:["pds","maki"]},
  {k:"h8", a:[0.0,0.52,0.6], src:["maki"]},
  {k:"h9", a:[0.62,1.0,0.32], src:["pds"]},
  {k:"h10", a:[0.27,1.2,0.3], src:["pds"]},
  {k:"h11", a:[0.18,0.4,0.5], src:["pds"]},
  {k:"h12", a:[-0.15,0.36,0.52], src:["pds","jpl2019"]},
  {k:"h13", a:[-0.05,1.05,0.36], src:["pds","meteorite"]}
];
/* mission map markers on PIA19154 (percent of image width/height; placed by eye on the NASA map) */
const SITES = [
  {k:"s1", x:15.9, y:3.6, img:"eagle", src:["eagle","driveoff"]},
  {k:"s2", x:17.6, y:5.3, img:"burns", src:["burns"]},
  {k:"s3", x:18.5, y:21.8, img:null, src:["victoria"]},
  {k:"s4", x:36.5, y:50.3, img:"spiritpt", src:["endeavour","homestake"]},
  {k:"s5", x:36.6, y:65.0, img:null, src:["marathon"]},
  {k:"s6", x:70, y:47, img:"shadow", src:["merhi","endeavour"]}
];
const CHAL = [{k:"ch1", src:["pds","greeley","tau","mer"]}, {k:"ch2", src:["purgatory"]}, {k:"ch3", src:["marsfact","pds"]}, {k:"ch4", src:["pds","jpl2019"]}];
return {SRC, IMG, ROVERS, CH, DISC, HW, SITES, CHAL, model:"models/mer.gltf.json", hwLinks:["opportunity","merb-hardware"]};
})();
