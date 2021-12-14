
const userId = 'UserId_1';
const showChecklistEditor = () => {
	console.log("showChecklistEditor");
	show("checkListEditor");
}

const init = () => {
	submitObservationForm();
	getChecklists();
	initMapClickForLocationCapture();
}

const saveCheckListData = () => {
	var data = {
		name: getValue('createCheckListName'), 
		description: getValue('createCheckListDescription'), 
		is_group: getValue('createCheckListIsGroupYes'), 
		group_count: $("#createCheckListIsGroupYes").is(":checked")? getValue('createCheckListGroupCount') : 0, 
		travel_mode: getValue('createCheckListTravelMode'),
		user_id: userId
	};
	console.log(data)
	if(data.name == "" || data.description == "" || data.is_group == "" || data.travel_mode == "")
	{
		showErrorMessage('Please fill all values');
		return;
	}
	fetch(addCheckListUrl,
	{
		method: "POST",
		headers: {
            "Content-Type": "application/json"
          },
		body: JSON.stringify(data)
	})
	.then(function(res){ return res.text(); })
	.then(function(data) {
		if(data == 'added') {
			const name = getValue('createCheckListName');
			setValue('createCheckListName', '');
			setValue('createCheckListDescription', '');
			setValue('createCheckListIsGroupYes', '');
			setValue('createCheckListGroupCount', '');
			setValue('createCheckListTravelMode', '');
			showSuccessMessage('Checklist ' + name + ' created.');
			$('#addChecklistModal').removeClass('u-dialog-open');
			getChecklists();
		}
		if(data == "exists") {
			showErrorMessage('There exists a checklist by this name. Use a different checklist name.');
		}
	})
}

const getChecklists = () => {
	var data = {
		user_id: userId
	};
	fetch(getChecklistsUrl,
	{
		method: "POST",
		headers: {
            "Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	})
	.then(function(res){ return res.json(); })
	.then(function(data) {
		$("#chekListItems>dl").empty();
		data.forEach(element => {			
			//$("#chekListItems>dl").append("<dt><div><input id='" + element.sp_name + "' type='button' value='Add' class='add-observation-button' onclick='showObservationDialog(this.id)' ><b>" + element.sp_name + "</b></div></dt><dd>" + element.sp_count + " Observations</dd>")
		
			$("#chekListItems").append(
'<div class="u-accordion-item">'
            + '<a class="u-accordion-link u-border-1 u-border-active-palette-1-base u-button-style u-text-active-black u-text-body-color u-text-hover-palette-1-light-2 u-accordion-link-1" id="link-accordion-f752" aria-controls="accordion-f752" aria-selected="true">'
			+ '<span class="u-accordion-link-text">' + element.sp_name + '</span>'
			+ '<span class="u-accordion-link-icon u-accordion-link-icon-hidden u-icon u-icon-circle u-text-palette-1-base u-icon-1">'
			+ '<svg class="u-svg-link" preserveAspectRatio="xMidYMin slice" viewBox="0 0 64 64" style=""><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-58e3"></use></svg>'
			+ '<svg class="u-svg-content" viewBox="0 0 64 64" id="svg-58e3" style="enable-background:new 0 0 64 64;"><style type="text/css"> .st0{fill:currentColor;} </style><g><g id="Icon-Share-Google" transform="translate(280.000000, 380.000000)"><path class="st0" d="M-264.2-339.9c-4.4,0-7.9-3.5-7.9-7.9c0-4.4,3.5-7.9,7.9-7.9c4.4,0,7.9,3.5,7.9,7.9     C-256.3-343.5-259.8-339.9-264.2-339.9L-264.2-339.9z M-264.2-352.8c-2.7,0-4.9,2.2-4.9,4.9c0,2.7,2.2,4.9,4.9,4.9     c2.7,0,4.9-2.2,4.9-4.9C-259.3-350.5-261.5-352.8-264.2-352.8L-264.2-352.8z" id="Fill-61"></path><path class="st0" d="M-232.1-356c-4.4,0-7.9-3.5-7.9-7.9s3.5-7.9,7.9-7.9s7.9,3.5,7.9,7.9S-227.8-356-232.1-356     L-232.1-356z M-232.1-368.8c-2.7,0-4.9,2.2-4.9,4.9s2.2,4.9,4.9,4.9s4.9-2.2,4.9-4.9S-229.4-368.8-232.1-368.8L-232.1-368.8z" id="Fill-62"></path><path class="st0" d="M-232.1-323.9c-4.4,0-7.9-3.5-7.9-7.9s3.5-7.9,7.9-7.9s7.9,3.5,7.9,7.9     S-227.8-323.9-232.1-323.9L-232.1-323.9z M-232.1-336.7c-2.7,0-4.9,2.2-4.9,4.9s2.2,4.9,4.9,4.9s4.9-2.2,4.9-4.9     S-229.4-336.7-232.1-336.7L-232.1-336.7z" id="Fill-63"></path><polyline class="st0" id="Fill-64" points="-238.6,-333.2 -259.2,-343.5 -257.8,-346.4 -237.1,-336.1 -238.6,-333.2    "></polyline><polyline class="st0" id="Fill-65" points="-257.8,-349.3 -259.2,-352.1 -238.6,-362.4 -237.1,-359.6 -257.8,-349.3    "></polyline>'
			+ '</g>'
			+ '</g></svg>'
			+ '</span>'
            + '</a>'
            + '<div class="u-accordion-pane u-accordion-pane u-container-style u-accordion-pane-1" id="accordion-f752" aria-labelledby="link-accordion-f752">'
            + '  <div class="u-container-layout u-container-layout-1">'
            + '    <h5 class="u-text u-text-default u-text-palette-1-light-1 u-text-1"><span class="u-icon u-icon-2"><svg class="u-svg-content" viewBox="0 0 512 512" style="width: 1em; height: 1em;"><path d="M456.765,254.856l-46.821,10.579a24.231,24.231,0,0,1-5.336.6,24.023,24.023,0,0,1-23.362-18.719L356.561,138.069a24.026,24.026,0,0,1,18.121-28.7L421.5,98.79h0a24.026,24.026,0,0,1,28.7,18.12l24.686,109.247A24.028,24.028,0,0,1,456.765,254.856ZM121.713,223.941a8,8,0,0,0-9.567-6.04L79.59,225.257A24.04,24.04,0,0,0,54,214.637h0L38.39,218.164a24.027,24.027,0,0,0-18.12,28.7l10.579,46.818a23.986,23.986,0,0,0,28.7,18.121l15.6-3.526A24.041,24.041,0,0,0,93.7,287.684l32.556-7.356a8,8,0,0,0,6.04-9.568ZM390.749,443.705a8,8,0,1,1-13.5,8.589L281.877,302.421c-.928.3-1.865.575-2.823.791a32.067,32.067,0,0,1-7.075.793,31.705,31.705,0,0,1-10.819-1.912L158.61,452.506a8,8,0,1,1-13.22-9.013L247.938,293.08a31.982,31.982,0,0,1-4.39-6.449l-63.425,14.33a24.2,24.2,0,0,1-5.339.6,24.02,24.02,0,0,1-23.36-18.72l-17.632-78.032a24,24,0,0,1,18.121-28.7l179.476-40.554a8,8,0,0,1,9.566,6.04L365.64,250.841a8,8,0,0,1-6.04,9.567L304,272.972a31.79,31.79,0,0,1-8.627,20.851Zm-115.221-156.1a16.019,16.019,0,1,0-9.405-.733A15.87,15.87,0,0,0,275.528,287.606ZM128,96h16v16a8,8,0,0,0,16,0V96h16a8,8,0,0,0,0-16H160V64a8,8,0,0,0-16,0V80H128a8,8,0,0,0,0,16ZM424,320a24,24,0,1,0,24,24A24,24,0,0,0,424,320Z" style="fill:currentColor"></path></svg><img></span>&nbsp;' + element.sp_count + ' Observations<br>'
            + '    </h5>'
            + '    <a id="' + element.sp_checklist_id + "," + element.sp_name + '" href="#" onclick="showObservationDialogBox(this.id)" class="u-btn u-button-style u-custom-font u-font-arial u-none u-text-hover-palette-1-light-2 u-text-palette-1-base u-btn-1"><span class="u-icon u-text-palette-1-dark-1 u-icon-3"><svg class="u-svg-content" viewBox="0 0 32 32" style="width: 1em; height: 1em;"><defs><style>.cls-1{fill:none;}</style>'
			+ '</defs><g id="Layer_2"><path d="M16,29A13,13,0,1,1,29,16,13,13,0,0,1,16,29ZM16,5A11,11,0,1,0,27,16,11,11,0,0,0,16,5Z"></path><path d="M16,23a1,1,0,0,1-1-1V10a1,1,0,0,1,2,0V22A1,1,0,0,1,16,23Z"></path><path d="M22,17H10a1,1,0,0,1,0-2H22a1,1,0,0,1,0,2Z"></path>'
			+ '</g><g id="frame"><rect class="cls-1" height="32" width="32"></rect>'
			+ '</g></svg><img></span>&nbsp;Add new observation'
            + '    </a>'
            + '    <a href="#" onclick="return false;" class="u-active-none u-btn u-button-style u-hover-none u-none u-text-hover-palette-1-light-2 u-text-palette-1-base u-btn-2"><span class="u-icon u-text-palette-1-dark-1 u-icon-4"><svg class="u-svg-content" viewBox="0 0 64 64" style="width: 1em; height: 1em;"><style type="text/css"> .st0{fill:currentColor;} </style><g><g id="Icon-Eye" transform="translate(278.000000, 484.000000)"><path class="st0" d="M-246-436.6c-16.2,0-23.5-14.3-23.8-14.9c-0.2-0.4-0.2-0.8,0-1.2c0.3-0.6,7.6-14.9,23.8-14.9     s23.5,14.3,23.8,14.9c0.2,0.4,0.2,0.8,0,1.2C-222.5-450.8-229.8-436.6-246-436.6L-246-436.6z M-267.1-452     c1.5,2.6,8.4,12.8,21.1,12.8c12.7,0,19.6-10.2,21.1-12.8c-1.5-2.6-8.4-12.8-21.1-12.8C-258.7-464.8-265.6-454.6-267.1-452     L-267.1-452z" id="Fill-174"></path><path class="st0" d="M-246-439.4c-7,0-12.6-5.7-12.6-12.6s5.7-12.6,12.6-12.6s12.6,5.7,12.6,12.6     S-239-439.4-246-439.4L-246-439.4z M-246-462c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S-240.5-462-246-462L-246-462z" id="Fill-175"></path><path class="st0" d="M-246-445c-3.8,0-7-3.1-7-7c0-0.7,0.6-1.3,1.3-1.3c0.7,0,1.3,0.6,1.3,1.3     c0,2.4,1.9,4.3,4.3,4.3s4.3-1.9,4.3-4.3s-1.9-4.3-4.3-4.3c-0.7,0-1.3-0.6-1.3-1.3c0-0.7,0.6-1.3,1.3-1.3c3.8,0,7,3.1,7,7     S-242.2-445-246-445" id="Fill-176"></path>'
			+ '</g>'
			+ '</g></svg><img></span>&nbsp;View observation'
            + '    </a>'
            + '  </div>'
            + '</div>'
			+ '</div>');

		
		});
	})
}

const show = (el) => {
	document.getElementById(el).style.display = "block";
}

const hide = (el) => {
	document.getElementById(el).style.display = "none";
}

const getValue = (el) => {
	return document.getElementById(el).value;
}

const setValue = (el, value) => {
	return document.getElementById(el).value = value;
}