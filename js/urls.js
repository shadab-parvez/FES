const addCheckListUrl = "http://localhost:8080/addCheckList";
const getChecklistsUrl = "http://localhost:8080/getChecklists";
const addObservationUrl = "http://localhost:8080/addObservation";
const getObservationUrl = "http://localhost:8080/getObservations";
const getObservationDetailsUrl = "http://localhost:8080/getObservationDetails";

const COLKey = '2351';
const COLSpeciesListURL = 'https://api.catalogueoflife.org/dataset/' + COLKey + '/nameusage/suggest?fuzzy=false&limit=25&q=';
const COLTaxonomyURL = 'https://api.catalogueoflife.org/dataset/' + COLKey + '/taxon/';
const COLTaxonHeirarchyURL = 'https://api.catalogueoflife.org/dataset/' + COLKey + '/tree/COLID?catalogueKey=' + COLKey + '&insertPlaceholder=true&type=CATALOGUE';