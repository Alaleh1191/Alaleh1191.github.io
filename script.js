var chordDataVar = [];
//iCheck radio button
$(document).ready(function(){
  	$('input').iCheck({
	    checkboxClass: 'icheckbox_flat-blue',
	    radioClass: 'iradio_flat-blue'
  	});
});

numberOfSV = 3;

//reduce
function add(a, b) {
    return a + b;
}

//Draw tracks 
function displayTranscripts(x){
	if(!x){
		$("#probeLoc").css("margin-left","750px");
		$("#title").css("display","block");
	}

	$("#probeLoc").empty();

	var spliceVariants= $(".SV").map(function() {
	   return $(this).val();
	}).get();

	var longestSeq = spliceVariants.sort(function (a, b) { return b.length - a.length; })[0];

	spliceVariants = $(".SV").map(function() {
	   return $(this).val();
	}).get();

	var xScale = d3.scaleLinear()//scaleLinear v4
        .domain(
         	[0,longestSeq.length]
        )
        .range([0,580]);

	var height = spliceVariants.length * 30 + 20;

    var svg = d3.select("#probeLoc")
			.append("svg")
			.attr("id", "svgT")
			.attr("width", "700px")
			.attr("class" , "svg")
			.attr("height", height)
			.append("g")
		  	.append("g")
		  	.attr("class", "g");


	//Color for the unique transcripts
	var transcripts = [$( "input[name='name"+1+"']" ).val(), $( "input[name='name"+2+"']" ).val(), $( "input[name='name"+3+"']" ).val(), $( "input[name='name"+4+"']" ).val(),  $( "input[name='name"+5+"']" ).val(), $( "input[name='name"+6+"']" ).val(), $( "input[name='name"+7+"']" ).val(), $( "input[name='name"+8+"']" ).val(),  $( "input[name='name"+9+"']" ).val(), $( "input[name='name"+10+"']" ).val(), $( "input[name='name"+11+"']" ).val(), $( "input[name='name"+12+"']" ).val(), $( "input[name='name"+13+"']" ).val(), $( "input[name='name"+14+"']" ).val(), $( "input[name='name"+15+"']" ).val(), $( "input[name='name"+16+"']" ).val(), $( "input[name='name"+17+"']" ).val()];
	var colors = [ "#1395B5", "#FE7351","rgb(130, 195, 53)",  "#EA706F" ,  "#F1E64E", "#B3AEB2", "#14D9C8" , "rgb(154, 4, 4)", "rgb(49, 152, 206)", "rgb(62, 165, 5)", "#D7E643", "#7486c3", "rgb(64, 135, 24)","#FE6C5F", "#F1E64E", "#98B914",];
	var color = d3.scaleOrdinal()
    	.domain(transcripts)
    	.range(colors);

	svg.append("rect")
	    .attr("class", "overlay")
	    .attr("width", "700px")
	    .attr("height", height);

	var text = svg.append("g").attr("class", "text");
	var yloc = 10;

	var exons = getAllExonInfo();


	var exonLengths = exons.lengths;
	// the names array
	var namesArray = exons.names;

	for(var i = 0; i < spliceVariants.length; i++){
		var name = $( "input[name='name"+(i+1)+"']" ).val();
		//if exon array not empty go through exons
		if(exonLengths[i].length != 0){
			if(exonLengths[i].map(Number).reduce(add, 0) != spliceVariants[i].length){
				alert("the sum of exon lengths for transcript "+name+" does not add up to the transcript length.");
			}
			var xloc = 0;
			for(var j=0; j < exonLengths[i].length; j++){
				length = exonLengths[i][j];
				svg.append("rect")
		            .attr("x", xloc)
		            .attr("y", yloc)
		            .attr("width", xScale(spliceVariants[i].length)*length/spliceVariants[i].length)
		            .attr("height", 20)
		            .style("opacity", 0.85)
		            .style("stroke", "black")
		            .style("stroke-width", 1)
		            .attr("fill", color(name))
		            .append("svg:title")
	      			.text(function(d, k) { return namesArray[i][j] });
				xloc += xScale(spliceVariants[i].length)*length/spliceVariants[i].length;
				svg.append("rect")
			}
		} else {
			svg.append("rect")
	            .attr("x", 0)
	            .attr("y", yloc)
	            .attr("width", xScale(spliceVariants[i].length))
	            .attr("height", 20)
	            .style("opacity", 0.85)
				.attr("fill", color(name))
				.style("stroke", "black")
		        .style("stroke-width", 1);
		}

		// The name of the transcript
		d3.select(".svg").append("text")
			.attr("class", "vals")
			.attr("x", xScale(spliceVariants[i].length)+10)
            .attr("y", yloc+15)
            .text(name)
            .style("font-size", "17px")
            .style('pointer-events', 'none');

        yloc += 30;
    }
	
}


function trackChange()
{
	var select = document.getElementById('track');
    var option = select.options[select.selectedIndex].value;

    TrackwShared(chordDataVar, parseInt(option));

    

}

//Draw each track and shared sequences on it 
function TrackwShared(x,sv){

 	var spliceVariants= $(".SV").map(function() {
	   return $(this).val();
	}).get();

	var longestSeq = spliceVariants.sort(function (a, b) { return b.length - a.length; })[0];

	spliceVariants = $(".SV").map(function() {
	   return $(this).val();
	}).get();

	var xScale = d3.scaleLinear()//scaleLinear v4
        .domain(
         	[0,longestSeq.length]
        )
        .range([0,580]);

  	
	$("#track_div").css("display","block");
	$("#trackWShared").empty();
	
	/*var xScale = d3.scaleLinear()//scaleLinear v4
        .domain(
         	[0,spliceVariants[sv].length]
        )
        .range([0,800]);*/

	var height = x.length * 10 + 50;

    var height = 30;

    var svg = d3.select("#trackWShared")
			.append("svg")
			.attr("id", "svg2")
			.attr("width", "700px")
			.attr("class" , "svg2")
		//	.attr("height", height)
			.append("g")
		  	.append("g")
		  	.attr("class", "g");


	//Color for the unique transcripts
	var transcripts = [$( "input[name='name"+1+"']" ).val(), $( "input[name='name"+2+"']" ).val(), $( "input[name='name"+3+"']" ).val(), $( "input[name='name"+4+"']" ).val(),  $( "input[name='name"+5+"']" ).val(), $( "input[name='name"+6+"']" ).val(), $( "input[name='name"+7+"']" ).val(), $( "input[name='name"+8+"']" ).val(),  $( "input[name='name"+9+"']" ).val(), $( "input[name='name"+10+"']" ).val(), $( "input[name='name"+11+"']" ).val(), $( "input[name='name"+12+"']" ).val(), $( "input[name='name"+13+"']" ).val(), $( "input[name='name"+14+"']" ).val(), $( "input[name='name"+15+"']" ).val(), $( "input[name='name"+16+"']" ).val(), $( "input[name='name"+17+"']" ).val()];
	var colors = [ "#1395B5", "#FE7351","rgb(130, 195, 53)",  "#EA706F" ,  "#F1E64E", "#B3AEB2", "#14D9C8" , "rgb(154, 4, 4)", "rgb(49, 152, 206)", "rgb(62, 165, 5)", "#D7E643", "#7486c3", "rgb(64, 135, 24)","#FE6C5F", "#F1E64E", "#98B914",];
	var color = d3.scaleOrdinal()
    	.domain(transcripts)
    	.range(colors);

	svg.append("rect")
	    .attr("class", "overlay")
	    .attr("width", "700px")
	    .attr("height", 0);

	var text = svg.append("g").attr("class", "text");
	var yloc = 10;

	var exons = getAllExonInfo();


	var exonLengths = exons.lengths;
	// the names array
	var namesArray = exons.names;

	//for(var i = 0; i < spliceVariants.length; i++){
		i=sv;
		var name = $( "input[name='name"+(i+1)+"']" ).val();
		//if exon array not empty go through exons
		if(exonLengths[i].length != 0){
			if(exonLengths[i].map(Number).reduce(add, 0) != spliceVariants[i].length){
				alert("the sum of exon lengths for transcript "+name+" does not add up to the transcript length.");
			}
			var xloc = 0;
			for(var j=0; j < exonLengths[i].length; j++){
				length = exonLengths[i][j];
				svg.append("rect")
		            .attr("x", xloc)
		            .attr("y", yloc)
		            .attr("width", xScale(spliceVariants[i].length)*length/spliceVariants[i].length)
		            .attr("height", 20)
		            .style("opacity", 0.85)
		            .style("stroke", "black")
		            .style("stroke-width", 1)
		            .attr("fill", color(name))
		            .append("svg:title")
	      			.text(function(d, k) { return namesArray[i][j] });
				xloc += xScale(spliceVariants[i].length)*length/spliceVariants[i].length;
				svg.append("rect")
			}
		} else {
			svg.append("rect")
	            .attr("x", 0)
	            .attr("y", yloc)
	            .attr("width", xScale(spliceVariants[i].length))
	            .attr("height", 20)
	            .style("opacity", 0.85)
				.attr("fill", color(name))
				.style("stroke", "black")
		        .style("stroke-width", 1);
		}

		// The name of the transcript
		d3.select(".svg2").append("text")
			.attr("class", "vals")
			.attr("x", xScale(spliceVariants[i].length)+10)
            .attr("y", yloc+15)
            .text(name)
            .style("font-size", "17px")
            .style('pointer-events', 'none');

        yloc += 30;
    //}

	yloc = 35;
	for(var i=0; i<x.length;i++){
		//console.log(x[i].SpliceVariant);
		
  		if(x[i].SpliceVariant == name){
  			//draw a rect
  			probe = x[i].probe;
  			var indices = indexes(spliceVariants[sv],probe);
			for(j = 0; j < indices.length; j++){
				svg.append("g")
					.append("rect")
		            .attr("x", xScale(indices[j]))
		            .attr("y", yloc)// -5
		            .attr("width", xScale(probe.length))
		            .attr("id", probe)
		            .attr("height", 10)//3
		            .attr("class", "shared")
		            .style("opacity","1")//1
					.attr("fill", "red")//rgb(228, 75, 75)
					.on("click", function(d) {
						$(".shared").css("opacity","0.2")
						$(this).css("opacity","1");
						console.log(this)
			            d3.select("#title").style('display', 'block').html('Shared Sequence: highlight a section of shared sequence to see where it falls on each transcript');
			            d3.select("#probe").style('display', 'block').html(this.id);
						displayLocation(this.id);
					});


			}
			yloc += 11;
  		}
  	}
  	height += yloc;
  	$(".svg2").height(height)
	
}

function getAllExonInfo()
{
	var exonsInfo = {lengths : [], names : []};

	for(var i = 1; i < numberOfSV; i++)
	{
        var exonLengths = [];
        var exonNames   = [];
		var exonInfoText = $('.exon-length.'+i).val();

		exonInfoText = exonInfoText.split(',');
		if(exonInfoText != "") {
			for(var j = 0; j < exonInfoText.length; j++)
			{
	            exonNames.push(exonInfoText[j].split(':')[0].replace(/ /g,''));
	            exonLengths.push(exonInfoText[j].split(':')[1].replace(/ /g,''));
			}
		}

        exonsInfo.names.push(exonNames);
		exonsInfo.lengths.push(exonLengths);
	}

	return exonsInfo;
}

function exonLengthsHumanFormat(exonLengths)
{
	var string = [];

	if(exonLengths === undefined || exonLengths === null)
	{
		return '';
	}

	/*Object.keys(exonLengths).forEach(function(key) {
		string.push(key+':'+exonLengths[key]);
	});*/

	exonLengths.forEach(function(element) {
		string.push(element['key'] + ':' + element['value']);
	});

	return string.join(', ');
}

// Add a new splice variants with the given name and sequence
function addSV(name, sequence, exonLengths){
    if(name === undefined || name === null)
    {
        name = numberOfSV;
    }

    if(sequence === undefined || sequence === null)
	{
        sequence = '';
	}

    exonLengths = exonLengthsHumanFormat(exonLengths);

    $("#SVs").append(" <input type='text' name='name"+numberOfSV+"' class='name "+numberOfSV+"' value='"+name+"' onfocus='onFocus(this)' onblur='onBlur(this)'><textarea class='SV "+numberOfSV+"' style='width: 525px;  height: 13px; margin-bottom: -5px; margin-right:15px; margin-left:24px;'>"+sequence+"</textarea><span class='" +numberOfSV+"' style='margin-right: 4px;'></span><textarea class='exon-length " + numberOfSV +"' style='width: 200px; height: 13px; margin-bottom: -5px'>" + exonLengths + "</textarea><span class='"+numberOfSV+"' style='margin-right: 4px;'></span><img class='del "+numberOfSV+"' onclick='removeSV(this)' src='x-button.png' alt='delete' height='19px' style='margin-bottom: -5px'> <br class='"+numberOfSV+"'/>")
	numberOfSV++;
}

// Default name of transcript
function onFocus(sv){
	if($( "input[name='name"+sv.className+"']" ).val()==sv.className) 
		$( "input[name='name"+sv.className+"']" ).val("");
}

// Default name of transcript
function onBlur(sv) {
	if($( "input[name='name"+sv.className+"']" ).val()=='')
		{$( "input[name='name"+sv.className+"']" ).val(sv.className);}
}

//Once pressed on x button, delete the corresponding transcript
function removeSV(sv){
	sv = sv.className;
	sv = sv.match(/\d+/)[0]; //get the number
	var remove = "."+sv
	$(remove).remove();
	while(sv < numberOfSV){
		sv++;
		var toggleClass = "."+ sv;
		var newClass = sv-1;
		if($( "input[name='name"+sv+"']" ).val() == sv){
			$( "input[name='name"+sv+"']" ).val(newClass);
		}
		$( "input[name='name"+sv+"']" ).attr("name", "name"+newClass)
		$(toggleClass).addClass(newClass.toString()).removeClass(sv.toString());
	}
	numberOfSV--;
}

function fade(){
	if($("#reverse").val() != ""){
		$(".fade").css("opacity","0.5");
		$(".fade2").css("display","none");
	} else {
		$(".fade").css("opacity","1");
		$(".fade2").css("display","block");
	}
}

function chordData()
{
	$("#track_div").css("display","none");
	$("#trackWShared").empty();
    $("#results").empty();
    $("#sv-chart").empty();
    $("#probeLoc").empty();
    $("#title").css("display","none");
	$("#probe").css("display","none");
    $("#loadingChord").css('display', 'block');

    // Splice Variant Names Populate

    var spliceVariantNames = $(".name").map(function() {
	   return $(this).val();
	}).get();

	spliceVariantNamesOptionHTML = '';

	for(var i = 0; i < spliceVariantNames.length; i++)
	{
		spliceVariantNamesOptionHTML += '<option value="' + (i) + '">' + spliceVariantNames[i] + '</option>';
	}

	document.getElementById('track').innerHTML = spliceVariantNamesOptionHTML;
	
	var reverse = $("#reverse").val();
	if(reverse != ""){
		$("#probeLoc").css("margin-left","0px");
		$("#title").css("display","none");
		$("#probe").css("display","none");
		displayTranscripts(1);
		var found = displayLocation(reverse);
		$("#results").html("the white rectangles correspond to the location of the given subsequence");
		if(!found){
			$("#probeLoc").empty();
			$("#results").html("None of the transcripts share the given subsequence. To find all shared subsequences, please empty the subsequence textbox and resubmit.");
		}
		$("#loadingChord").css('display', 'none');
		return;
	}


    var sequences = $(".SV").map(function() {
        return $(this).val();
    }).get();



    var minLength = Number($("#minLength").val());

    if(window.Worker)
    {
        var chordWorker = new Worker('chordWorker.js');

        chordWorker.postMessage([sequences, minLength]);

        chordWorker.onmessage = function(e) {

        	[arrComb, arrSharedSeqs] = e.data;

            makeJsonData(arrComb, arrSharedSeqs);

            $("#loadingChord").css('display', 'none');
        };

        return;
    }

    [arrComb, arrSharedSeqs] = chordComputation(sequences, minLength);

    makeJsonData(arrComb, arrSharedSeqs);

    $("#loadingChord").css('display', 'none');
}
//Convert the shared probes among different splice variants into JSON format
function makeJsonData(combs, sharedSeqs){
	var length = true; 

	if($('input[name=weight]:checked').val() == "shared"){
		length = false;
		var weights = [];
	}

	var arrayOfProbes = [];
	chordDataVar = [];

	for(var i = combs.length - 1; i > -1; i--){
		for( var j = 0; j < sharedSeqs[i].length; j++){
			if(arrayOfProbes.indexOf(sharedSeqs[i][j]) == -1){
				arrayOfProbes.push(sharedSeqs[i][j]);
				if(!length){
					weights.push(combs[i].length);
				}
				for(var k = 0; k < combs[i].length; k++){
					chordDataVar.push({
						"SpliceVariant": $( "input[name='name"+(combs[i][k]+1)+"']" ).val(),
						"probe": sharedSeqs[i][j],
						"size": sharedSeqs[i][j].length
					});
				}
			}
		}
	}

	var temp = [];

	for(var i = 0; i < arrayOfProbes.length; i++){
		if(!length){
			temp.push({
				"name" : arrayOfProbes[i],
				"size" : weights[i]*10
			})
		} else {
			temp.push({
				"name" : arrayOfProbes[i],
				"size" : arrayOfProbes[i].length 
			})
		}
		
	}
	var temp2 = [];
	temp2.push({
		"children": temp
	})
	weightedByLength = {"children": temp2};
	if(chordDataVar.length != 0){
		drawChord(chordDataVar, weightedByLength);
		displayTranscripts(0);
		TrackwShared(chordDataVar,0);
	} else {
		$("#results").html("no SVs of desired min length was found");
	}

}

// Highlighted Section
function highlight()
{
    var textarea = document.getElementById("probe");
    var start = textarea.selectionStart;
    var finish = textarea.selectionEnd;

    $(".highlightClass").remove();

    if(start === finish)
	{
        return;
	}


    var selection = textarea.value.substring(start, finish);

    name = selection;
	var spliceVariants= $(".SV").map(function() {
		return $(this).val();
	}).get();

	var longestSeq = spliceVariants.sort(function (a, b) { return b.length - a.length; })[0];

	spliceVariants= $(".SV").map(function() {
		return $(this).val();
	}).get();

	var xScale = d3.scaleLinear()//scaleLinear v4
		.domain(
			[0,longestSeq.length]
		)
		.range([0,580]);

	var yloc = 10;
	var found = false;
	for(var i = 0; i < spliceVariants.length; i++){

		console.log("Running");

		if(spliceVariants[i].indexOf(name) != -1){// if transcript contains the desired probe
			// for loop find all matches
			found = true;
			var indices = indexes(spliceVariants[i],name);
			for(j = 0; j < indices.length; j++) {
                d3.select("#svgT").append("rect")
                    .attr("x", xScale(indices[j]))
                    .attr("y", yloc + 5)// -5
                    .attr("width", xScale(name.length))
                    .attr("height", 7)//3
                    .attr("class", "highlightClass")
                    .style("opacity", 1)//1
                    .style("pointer-events", "none")
                    .attr("fill", "yellow");//rgb(228, 75, 75)
            }


		}
		yloc += 30;
	}

}
