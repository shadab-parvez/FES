const addCheckListUrl = "http://localhost:3000/addCheckList";
const getChecklistsUrl = "http://localhost:3000/getChecklists";
const addObservationUrl = "http://localhost:3000/addObservation";
const getObservationUrl = "http://localhost:3000/getObservations";
const getObservationDetailsUrl = "http://localhost:3000/getObservationDetails";

const COLKey = '2351';
const COLSpeciesListURL = 'https://api.catalogueoflife.org/dataset/' + COLKey + '/nameusage/suggest?fuzzy=false&limit=25&q=';
const COLTaxonomyURL = 'https://api.catalogueoflife.org/dataset/' + COLKey + '/taxon/';
const COLTaxonHeirarchyURL = 'https://api.catalogueoflife.org/dataset/' + COLKey + '/tree/COLID?catalogueKey=' + COLKey + '&insertPlaceholder=true&type=CATALOGUE';