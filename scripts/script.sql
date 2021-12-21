CREATE TABLE IF NOT EXISTS public.checklist
(
    checklist_id uuid,
    is_group character varying COLLATE pg_catalog."default",
    group_count numeric,
    observation_count numeric,
    travel_mode character varying COLLATE pg_catalog."default",
    description character varying COLLATE pg_catalog."default",
    gps_track character varying COLLATE pg_catalog."default",
    gps_track_frequency character varying COLLATE pg_catalog."default",
    start_datetime timestamp without time zone,
    end_datetime date,
    created_by character varying COLLATE pg_catalog."default",
    modified_date character varying COLLATE pg_catalog."default",
    geometry geometry,
    checklist_name character varying COLLATE pg_catalog."default"
);

CREATE TABLE IF NOT EXISTS public.event
(
    event_id uuid,
    parent_event_id uuid,
    event_date date,
    event_time date,
    year numeric,
    month numeric,
    day numeric,
    habitat character varying COLLATE pg_catalog."default",
    event_remarks character varying COLLATE pg_catalog."default",
    sampling_protocol character varying COLLATE pg_catalog."default",
    sampling_effort character varying COLLATE pg_catalog."default"
);

CREATE TABLE IF NOT EXISTS public.identification
(
    identification_id uuid,
	observation_id uuid,
    identification_qualifier character varying COLLATE pg_catalog."default",
    identified_by character varying COLLATE pg_catalog."default",
    identified_by_id uuid,
    identified_date date,
    identification_references character varying COLLATE pg_catalog."default",
    identification_verification_status character varying COLLATE pg_catalog."default",
    identification_remarks character varying COLLATE pg_catalog."default"
);

CREATE TABLE IF NOT EXISTS public.location
(
    location_id uuid,
    higher_geography_id uuid,
    higher_geography character varying COLLATE pg_catalog."default",
    continent character varying COLLATE pg_catalog."default",
    waterbody character varying COLLATE pg_catalog."default",
    island_group character varying COLLATE pg_catalog."default",
    island character varying COLLATE pg_catalog."default",
    country character varying COLLATE pg_catalog."default",
    country_code character varying COLLATE pg_catalog."default",
    state_province character varying COLLATE pg_catalog."default",
    county character varying COLLATE pg_catalog."default",
    municipality character varying COLLATE pg_catalog."default",
    locality character varying COLLATE pg_catalog."default",
    minimum_elevation_in_meters numeric,
    maximum_elevation_in_meters numeric,
    location_according_to character varying COLLATE pg_catalog."default",
    location_remarks character varying COLLATE pg_catalog."default",
    decimal_latitude numeric,
    decimal_longitude numeric,
    geodetic_datum numeric,
    coordinate_uncertainity_in_meters numeric,
    coordinate_precision numeric,
    observation_id uuid
);

CREATE TABLE IF NOT EXISTS public.observation
(
    observation_id uuid,
    checklist_id character varying COLLATE pg_catalog."default",
    species_count numeric,
    species_id numeric,
    need_id character varying COLLATE pg_catalog."default",
    gender character varying COLLATE pg_catalog."default",
    male_count numeric,
    female_count numeric,
    child_count numeric,
    date_time timestamp without time zone,
    created_by character varying COLLATE pg_catalog."default",
    modified_date date,
    geometry geometry(Geometry,4326)
);

CREATE TABLE IF NOT EXISTS public.occurence
(
    occurence_id uuid,
    recorded_by character varying COLLATE pg_catalog."default",
    recorded_by_id character varying COLLATE pg_catalog."default",
    individual_count numeric,
    sex character varying COLLATE pg_catalog."default",
    lifestage character varying COLLATE pg_catalog."default",
    reproductive_condition character varying COLLATE pg_catalog."default",
    behaviour character varying COLLATE pg_catalog."default",
    occurence_status character varying COLLATE pg_catalog."default",
    associated_media character varying COLLATE pg_catalog."default",
    associated_occurences character varying COLLATE pg_catalog."default",
    occurence_remarks character varying COLLATE pg_catalog."default",
    observation_id uuid
);

CREATE TABLE IF NOT EXISTS public.record_level
(
    record_level_id uuid,
    type character varying COLLATE pg_catalog."default",
    modified date,
    language character varying COLLATE pg_catalog."default",
    license character varying COLLATE pg_catalog."default",
    rights_holder character varying COLLATE pg_catalog."default",
    access_rights character varying COLLATE pg_catalog."default",
    institution_id character varying COLLATE pg_catalog."default",
    collection_id character varying COLLATE pg_catalog."default",
    dataset_id character varying COLLATE pg_catalog."default",
    institution_code character varying COLLATE pg_catalog."default",
    collection_code character varying COLLATE pg_catalog."default",
    dataset_name character varying COLLATE pg_catalog."default",
    basis_of_record character varying COLLATE pg_catalog."default",
    dynamic_properties character varying COLLATE pg_catalog."default",
    file_path character varying COLLATE pg_catalog."default",
    file_uri character varying COLLATE pg_catalog."default",
    observation_id uuid
);

CREATE TABLE IF NOT EXISTS public.taxon
(
    taxon_id character varying COLLATE pg_catalog."default",
    observation_id uuid,
    scientific_name_id character varying COLLATE pg_catalog."default",
    accepted_name_usage_id character varying COLLATE pg_catalog."default",
    parent_name_usage_id character varying COLLATE pg_catalog."default",
    original_name_usage_id character varying COLLATE pg_catalog."default",
    name_according_to_id character varying COLLATE pg_catalog."default",
    name_published_in_id character varying COLLATE pg_catalog."default",
    scientific_name character varying COLLATE pg_catalog."default",
    accepted_name_usage character varying COLLATE pg_catalog."default",
    parent_name_usage character varying COLLATE pg_catalog."default",
    original_name_usage character varying COLLATE pg_catalog."default",
    name_according_to character varying COLLATE pg_catalog."default",
    name_published_in character varying COLLATE pg_catalog."default",
    name_published_in_year numeric,
    higher_classification character varying COLLATE pg_catalog."default",
    kingdom character varying COLLATE pg_catalog."default",
    phylum character varying COLLATE pg_catalog."default",
    class character varying COLLATE pg_catalog."default",
    "order" character varying COLLATE pg_catalog."default",
    family character varying COLLATE pg_catalog."default",
    subfamily character varying COLLATE pg_catalog."default",
    genus character varying COLLATE pg_catalog."default",
    generic_name character varying COLLATE pg_catalog."default",
    sub_genus character varying COLLATE pg_catalog."default",
    infra_generic_epithet character varying COLLATE pg_catalog."default",
    specific_epithet character varying COLLATE pg_catalog."default",
    infra_specific_epithet character varying COLLATE pg_catalog."default",
    cultivar_epithet character varying COLLATE pg_catalog."default",
    taxon_rank character varying COLLATE pg_catalog."default",
    scientific_name_authorship character varying COLLATE pg_catalog."default",
    vernacular_name character varying COLLATE pg_catalog."default",
    nomenclatural_code character varying COLLATE pg_catalog."default",
    taxonomic_status character varying COLLATE pg_catalog."default",
    nomenclatural_status character varying COLLATE pg_catalog."default"
);



-- DROP FUNCTION IF EXISTS public.sp_addchecklist(character varying, character varying, character varying, integer, character varying, character varying);

CREATE OR REPLACE FUNCTION public.sp_addchecklist(
	sp_checklist_name character varying,
	sp_description character varying,
	sp_is_group character varying,
	sp_group_count integer,
	sp_travel_mode character varying,
	sp_created_by character varying)
    RETURNS character varying
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
	IF EXISTS (SELECT 1 FROM checklist WHERE checklist_name = sp_checklist_name) THEN
		RETURN 'EXISTS';
	ELSE
		INSERT INTO checklist(checklist_id, checklist_name, description, is_group, group_count, travel_mode, start_datetime, created_by)
		VALUES (uuid_generate_v4(), sp_checklist_name, sp_description, sp_is_group, sp_group_count, sp_travel_mode, CURRENT_TIMESTAMP, sp_created_by);
		RETURN 'SUCCESS';
	END IF;
END;
$BODY$;


-- DROP FUNCTION IF EXISTS public.sp_addobservation(character varying, character varying, integer, character varying, character varying, integer, integer, integer, character varying, double precision, double precision, character varying, character varying[], character varying[], character varying[], numeric, character varying, character varying, character varying, character varying, character varying, double precision, double precision, character varying, double precision, double precision, double precision, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying);

CREATE OR REPLACE FUNCTION public.sp_addObservation(
	sp_checklist_id character varying,
	sp_checklist_name character varying,
	sp_species_count integer,
	sp_species character varying,
	sp_gender character varying,
	sp_male_count integer,
	sp_female_count integer,
	sp_child_count integer,
	sp_created_by character varying,
	sp_longitude double precision,
	sp_latitude double precision,
	sp_license character varying,
	sp_file_path character varying[],
	sp_file_uri character varying[],
	sp_file_extensions character varying[],

	sp_individual_count numeric,
	sp_lifestage character varying,
	sp_reproductive_condition character varying,
	sp_behaviour character varying,
	sp_grouped_file_path character varying,
	sp_occurence_remarks character varying,

	sp_minimum_elevation_in_meters double precision,
	sp_maximum_elevation_in_meters double precision,
	sp_location_remarks character varying,
	sp_geodetic_datum double precision,
	sp_coordinate_uncertainity_in_meters double precision, 
	sp_coordinate_precision double precision,

	sp_taxon_id character varying,
	sp_scientific_name_id character varying,
	sp_accepted_name_usage_id character varying,
	sp_parent_name_usage_id character varying,
	sp_original_name_usage_id character varying,
	sp_name_according_to_id character varying,
	sp_scientific_name character varying,
	sp_accepted_name_usage character varying,
	sp_parent_name_usage character varying,
	sp_original_name_usage character varying,
	sp_higher_classification character varying,
	sp_kingdom character varying,
	sp_phylum character varying,
	sp_class character varying,
	sp_order character varying,
	sp_family character varying,
	sp_subfamily character varying,
	sp_genus character varying,
	sp_generic_name character varying,
	sp_sub_genus character varying,
	sp_infra_generic_epithet character varying,
	sp_specific_epithet character varying,
	sp_infra_specific_epithet character varying,
	sp_cultivar_epithet character varying,
	sp_taxon_rank character varying,
	sp_scientific_name_authorship character varying,
	sp_vernacular_name character varying,
	sp_nomenclatural_code character varying,
	sp_taxonomic_status character varying,
	sp_nomenclatural_status character varying)
	RETURNS character varying
	LANGUAGE 'plpgsql'
AS $$
DECLARE
	var_observation_id uuid;
	counter INT = 0 ;
	record_type character varying;
	is_image_type boolean;
	is_video_type boolean;
BEGIN
	var_observation_id := uuid_generate_v4();
	INSERT INTO observation(observation_id, checklist_id, species_count, species_id, need_id, gender, male_count, female_count, child_count, date_time, created_by, geometry)
	VALUES (var_observation_id, sp_checklist_id, sp_species_count, 0, null, sp_gender, sp_male_count, sp_female_count, sp_child_count, CURRENT_TIMESTAMP, sp_created_by, ST_MakePoint(sp_longitude, sp_latitude));
	
	INSERT INTO record_level(
	observation_id, record_level_id, type, language, license, rights_holder, access_rights, institution_id, collection_id, dataset_id, institution_code, collection_code, dataset_name, basis_of_record, dynamic_properties, file_path, file_uri, is_image, is_video)
	VALUES (var_observation_id, uuid_generate_v4(), 'Event', 'en', sp_license, sp_created_by, null, null, null, null, null, 'IBIS', sp_checklist_name, 'HumanObservation', null, null, null, null, null);
	
	FOR counter in array_lower(sp_file_path, 1) .. array_upper(sp_file_path, 1)
	LOOP
		IF sp_file_extensions[counter] IN ('JPG','TIFF','PNG') THEN
			record_type := 'StillImage';
			is_image_type := true;
			is_video_type := null;
		END IF;
		IF sp_file_extensions[counter] IN ('MOV','AVI','MPEG') THEN
			record_type := 'Movie';
			is_image_type := null;
			is_video_type := true;
		END IF;
		INSERT INTO public.record_level(
		observation_id, record_level_id, type, language, license, rights_holder, access_rights, institution_id, collection_id, dataset_id, institution_code, collection_code, dataset_name, basis_of_record, dynamic_properties, file_path, file_uri, is_image, is_video)
		VALUES (var_observation_id, uuid_generate_v4(), record_type, 'en', sp_license, sp_created_by, null, null, null, null, null, 'IBIS', sp_checklist_name, 'HumanObservation', null, sp_file_path[counter], sp_file_uri[counter], is_image_type, is_video_type);
		
	END LOOP;
	
	INSERT INTO occurence(
	observation_id, occurence_id, recorded_by, recorded_by_id, individual_count, sex, lifestage, reproductive_condition, behaviour, occurence_status, associated_media, associated_occurences, occurence_remarks)
	VALUES (var_observation_id, uuid_generate_v4(), null, null, sp_individual_count, sp_gender, sp_lifestage, sp_reproductive_condition, sp_behaviour, 'present', sp_grouped_file_path, null, sp_occurence_remarks);
	
	INSERT INTO location(
	observation_id,location_id, higher_geography_id, higher_geography, continent, waterbody, island_group, island, country, country_code, state_province, county, municipality, locality, minimum_elevation_in_meters, maximum_elevation_in_meters, location_according_to, location_remarks, decimal_latitude, decimal_longitude, geodetic_datum, coordinate_uncertainity_in_meters, coordinate_precision)
	VALUES (var_observation_id, uuid_generate_v4(), null, null, 'Asia', null, null, null, null, null, null, null, null, null, sp_minimum_elevation_in_meters, sp_maximum_elevation_in_meters, null, sp_location_remarks, sp_latitude, sp_longitude, sp_geodetic_datum, sp_coordinate_uncertainity_in_meters, sp_coordinate_precision);
	
	INSERT INTO public.taxon(
	observation_id, taxon_id, scientific_name_id, accepted_name_usage_id, parent_name_usage_id, original_name_usage_id, name_according_to_id, scientific_name, accepted_name_usage, parent_name_usage, original_name_usage, higher_classification, kingdom, phylum, class, "order", family, subfamily, genus, generic_name, sub_genus, infra_generic_epithet, specific_epithet, infra_specific_epithet, cultivar_epithet, taxon_rank, scientific_name_authorship, vernacular_name, nomenclatural_code, taxonomic_status, nomenclatural_status)
	VALUES (var_observation_id, sp_taxon_id, sp_scientific_name_id, sp_accepted_name_usage_id, sp_parent_name_usage_id, sp_original_name_usage_id, sp_name_according_to_id, sp_scientific_name, sp_accepted_name_usage, sp_parent_name_usage, sp_original_name_usage, sp_higher_classification, sp_kingdom, sp_phylum, sp_class, sp_order, sp_family, sp_subfamily, sp_genus, sp_generic_name, sp_sub_genus, sp_infra_generic_epithet, sp_specific_epithet, sp_infra_specific_epithet, sp_cultivar_epithet, sp_taxon_rank, sp_scientific_name_authorship, sp_vernacular_name, sp_nomenclatural_code, sp_taxonomic_status, sp_nomenclatural_status);
	
	RETURN 'SUCCESS';
	
END;
$$;


-- DROP FUNCTION IF EXISTS public.sp_getchecklists(character varying);

CREATE OR REPLACE FUNCTION public.sp_getchecklists(
	user_id character varying)
    RETURNS TABLE(sp_checklist_id uuid, sp_name character varying, sp_count bigint, sp_start_datetime timestamp without time zone) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
  return query 
	SELECT A.checklist_id, A.checklist_name, A."count", A.start_datetime FROM (
	(SELECT c.checklist_id, c.checklist_name, COUNT(c.checklist_name), c.start_datetime FROM checklist c 
	INNER JOIN  observation o
	ON c.checklist_id = o.checklist_id::uuid WHERE c.created_by = user_id
	GROUP BY c.checklist_id, c.checklist_name, c.start_datetime
	ORDER BY c.start_datetime DESC)
	UNION
	(SELECT checklist_id, checklist_name, 0, start_datetime as "count" FROM checklist 
	WHERE checklist_id NOT IN (SELECT checklist_id::uuid FROM observation)
	AND created_by = user_id)) as A
	ORDER BY A.start_datetime DESC;
END;
$BODY$;


-- DROP FUNCTION IF EXISTS public.sp_getobservationdetails(uuid);

CREATE OR REPLACE FUNCTION public.sp_getobservationdetails(
	observationid uuid)
    RETURNS TABLE(json_row json) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
	return query 	
	SELECT row_to_json(a) FROM  (SELECT o.observation_id, o.species_count, o.gender, o.male_count, o.female_count, o.child_count, o.date_time, o.geometry as "geometry", r."type", r."language", r.license, r.rights_holder,
	r.institution_id, r.institution_code, r.collection_id, r.collection_code, r.dataset_id, r.dataset_name, r.basis_of_record, r.dynamic_properties, r.file_uri,
	oc.occurence_id, oc.recorded_by, oc.recorded_by_id, oc.individual_count, oc.sex, oc.lifestage, oc.reproductive_condition, oc.behaviour, oc.occurence_status, oc.associated_media, oc.associated_occurences, oc.occurence_remarks,
	loc.location_id, loc.higher_geography_id, loc.higher_geography, loc.continent, loc.waterbody, loc.island_group, loc.island, loc.country, loc.country_code, loc.state_province, loc.county, loc.municipality, loc.locality, loc.minimum_elevation_in_meters, loc.maximum_elevation_in_meters, loc.location_according_to, loc.location_remarks, loc.decimal_latitude, loc.decimal_longitude, loc.geodetic_datum, loc.coordinate_uncertainity_in_meters, loc.coordinate_precision,
	tax.taxon_id, tax.scientific_name_id, tax.accepted_name_usage_id, tax.parent_name_usage_id, tax.original_name_usage_id, tax.name_according_to_id, tax.name_published_in_id, tax.scientific_name, tax.accepted_name_usage, tax.parent_name_usage, tax.original_name_usage, tax.name_according_to, tax.name_published_in, tax.name_published_in_year, tax.higher_classification, tax.kingdom, tax.phylum, tax.class, tax."order", tax.family, tax.subfamily, tax.genus, tax.generic_name, tax.sub_genus, tax.infra_generic_epithet, tax.specific_epithet, tax.infra_specific_epithet, tax.cultivar_epithet, tax.taxon_rank, tax.scientific_name_authorship, tax.vernacular_name, tax.nomenclatural_code, tax.taxonomic_status, tax.nomenclatural_status						 
	FROM observation o 
	INNER JOIN record_level r ON o.observation_id = r.observation_id
	INNER JOIN occurence oc ON o.observation_id = oc.observation_id
	INNER JOIN "location" loc ON o.observation_id = loc.observation_id
	INNER JOIN taxon tax ON o.observation_id = tax.observation_id
	WHERE o.observation_id = observationId
	AND r."type" = 'Event'
	) a;
END;
$BODY$;


-- DROP FUNCTION IF EXISTS public.sp_getobservations(character varying, character varying);

CREATE OR REPLACE FUNCTION public.sp_getobservations(
	sp_user_id character varying,
	sp_checklist_id character varying)
    RETURNS TABLE(json_row jsonb) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
	
	IF sp_checklist_id IS NULL THEN
		return query
		SELECT jsonb_build_object(
		'type',       'Feature',
		'id',         observation_id,
		'geometry',   ST_AsGeoJSON(geometry)::jsonb,
		'properties', to_jsonb(row) - 'geometry'
		) FROM (SELECT o.observation_id, o.species_count, o.gender, o.male_count, o.female_count, o.child_count, o.date_time, ST_Transform(o.geometry, 3857) as "geometry", r."type", r."language", r.license, r.rights_holder,
		r.institution_id, r.institution_code, r.collection_id, r.collection_code, r.dataset_id, r.dataset_name, r.basis_of_record, r.dynamic_properties, r.file_uri
		FROM observation o INNER JOIN record_level r
		ON o.observation_id = r.observation_id
		WHERE o.created_by = sp_user_id
		AND r."type" = 'Event'
		) row;
	ELSE
		return query
		SELECT jsonb_build_object(
		'type',       'Feature',
		'id',         observation_id,
		'geometry',   ST_AsGeoJSON(geometry)::jsonb,
		'properties', to_jsonb(row) - 'geometry'
		) FROM (SELECT o.observation_id, o.species_count, o.gender, o.male_count, o.female_count, o.child_count, o.date_time, ST_Transform(o.geometry, 3857) as "geometry", r."type", r."language", r.license, r.rights_holder,
		r.institution_id, r.institution_code, r.collection_id, r.collection_code, r.dataset_id, r.dataset_name, r.basis_of_record, r.dynamic_properties, r.file_uri
		FROM observation o INNER JOIN record_level r
		ON o.observation_id = r.observation_id
		WHERE o.created_by = sp_user_id
		AND o.checklist_id = sp_checklist_id
		AND r."type" = 'Event'
		) row;
	END IF;
END;
$BODY$;


CREATE OR REPLACE FUNCTION public.sp_searchSpecies(
	sp_keyword character varying)
    RETURNS TABLE(json_row jsonb) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
	RETURN query
	SELECT jsonb_build_object(
		'type',       'Feature',
		'id',         observation_id,
		'geometry',   ST_AsGeoJSON(geom)::jsonb,
		'properties', to_jsonb(row) - 'geom'
		) FROM (SELECT tax.observation_id, ST_AsGeoJSON(ST_Transform(o.geometry, 3857)) as "geom", tax.scientific_name, tax.kingdom, tax.phylum, tax.class, tax."order", tax.family, tax.subfamily, tax.genus, tax.sub_genus, tax.generic_name, tax.vernacular_name FROM taxon tax
	INNER JOIN observation o ON o.observation_id = tax.observation_id
	WHERE UPPER(tax.scientific_name) LIKE UPPER('%' || sp_keyword || '%')
	OR UPPER(tax.kingdom) LIKE UPPER('%' || sp_keyword || '%')
	OR UPPER(tax.phylum) LIKE UPPER('%' || sp_keyword || '%')
	OR UPPER(tax.class) LIKE UPPER('%' || sp_keyword || '%')
	OR UPPER(tax."order") LIKE UPPER('%' || sp_keyword || '%')
	OR UPPER(tax.family) LIKE UPPER('%' || sp_keyword || '%')
	OR UPPER(tax.subfamily) LIKE UPPER('%' || sp_keyword || '%')
	OR UPPER(tax.genus) LIKE UPPER('%' || sp_keyword || '%')
	OR UPPER(tax.sub_genus) LIKE UPPER('%' || sp_keyword || '%')
	OR UPPER(tax.generic_name) LIKE UPPER('%' || sp_keyword || '%')
	OR UPPER(tax.vernacular_name) LIKE UPPER('%' || sp_keyword || '%')) row;	
END;
$BODY$;


CREATE OR REPLACE FUNCTION sp_getprofilestatistics(user_id character varying) 
returns table (
		observations bigint,
		checklists bigint,
		species bigint,
		identifications bigint,
		images bigint,
		videos bigint
	) 
LANGUAGE plpgsql
AS $$
BEGIN
  return query 
	SELECT 	COUNT(DISTINCT(o.observation_id)) as "Observations",
		COUNT(DISTINCT(c.checklist_id)) as "Checklists",
		COUNT(DISTINCT(tax.taxon_id)) as "Species",
		COUNT(DISTINCT(i.identification_id)) as "Identifications",
		COUNT(r.is_image) as "Images",
		COUNT(r.is_video) as "Video"
	FROM observation o 
	INNER JOIN checklist c ON c.checklist_id = o.checklist_id::uuid
	INNER JOIN record_level r ON o.observation_id = r.observation_id
	INNER JOIN occurence oc ON o.observation_id = oc.observation_id
	INNER JOIN "location" loc ON o.observation_id = loc.observation_id
	INNER JOIN taxon tax ON o.observation_id = tax.observation_id
	FULL JOIN identification i ON o.observation_id = i.observation_id
	WHERE o.created_by = user_id;
END;
$$;
