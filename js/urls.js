const addCheckListUrl = "http://3.12.73.235:8080/addCheckList";
const getChecklistsUrl = "http://3.12.73.235:8080/getChecklists";
const addObservationUrl = "http://3.12.73.235:8080/addObservation";
const getObservationUrl = "http://3.12.73.235:8080/getObservations";
const getObservationDetailsUrl = "http://3.12.73.235:8080/getObservationDetails";
const searchSpeciesUrl = "http://3.12.73.235:8080/searchSpecies";
const getUserProfileStatistics = 'http://3.12.73.235:8080/getUserProfileStatistics';
const getTotalObservationsUrl = "http://3.12.73.235:8080/getTotalObservations";

const COLKey = '2351';
const COLSpeciesListURL = 'https://api.catalogueoflife.org/dataset/' + COLKey + '/nameusage/suggest?fuzzy=false&limit=25&q=';
const COLTaxonomyURL = 'https://api.catalogueoflife.org/dataset/' + COLKey + '/taxon/';
const COLTaxonHeirarchyURL = 'https://api.catalogueoflife.org/dataset/' + COLKey + '/tree/COLID?catalogueKey=' + COLKey + '&insertPlaceholder=true&type=CATALOGUE';