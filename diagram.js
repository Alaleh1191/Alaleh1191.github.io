//Margins for the chord diagram
var margin = {left:20, top:20, right:20, bottom:20},
	width = Math.max( Math.min(window.innerWidth, 1100) - margin.left - margin.right - 20, 600),
    height = Math.max( Math.min(window.innerHeight - 250, 900) - margin.top - margin.bottom - 20, 600),
    innerRadius = Math.min(width * 0.50, height * .50),
    outerRadius = innerRadius * 1.05;
	
//Recalculate the width and height now that we know the radius
width = outerRadius * 2 + margin.right + margin.left;
height = outerRadius * 2 + margin.top + margin.bottom;
	
//Reset the overall font size
var newFontSize = Math.min(70, Math.max(40, innerRadius * 62.5 / 250));
d3.select("html").style("font-size", newFontSize + "%");

var defaultOpacity = 0.85,
	fadeOpacity = 0.075;
						
var loom = loom()
    .padAngle(0.05)
	.emptyPerc(0)
	.widthOffsetInner(0)
	.value(function(d) { return d.size; })
	.inner(function(d) { return d.probe; })
	.outer(function(d) { return d.SpliceVariant; });

var arc = d3.arc()
    .innerRadius(innerRadius*1.01)
    .outerRadius(outerRadius);

var string = string()
    .radius(innerRadius)
	.pullout(0);


function drawChord(chord, probe){
var svg = d3.select("#sv-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

	var svg2 = d3.select("svg"),
	    diameter = +svg2.attr("width") - 450;
	
					
	//Color for the unique locations
	var locations = [$( "input[name='name"+1+"']" ).val(), $( "input[name='name"+2+"']" ).val(), $( "input[name='name"+3+"']" ).val(), $( "input[name='name"+4+"']" ).val(),  $( "input[name='name"+5+"']" ).val(), $( "input[name='name"+6+"']" ).val(), $( "input[name='name"+7+"']" ).val(), $( "input[name='name"+8+"']" ).val(),  $( "input[name='name"+9+"']" ).val(), $( "input[name='name"+10+"']" ).val(), $( "input[name='name"+11+"']" ).val(), $( "input[name='name"+12+"']" ).val(), $( "input[name='name"+13+"']" ).val(), $( "input[name='name"+14+"']" ).val(), $( "input[name='name"+15+"']" ).val(), $( "input[name='name"+16+"']" ).val(), $( "input[name='name"+17+"']" ).val()];
	var colors = [ "#1395B5", "#FE7351","rgb(130, 195, 53)",  "#EA706F" ,  "#F1E64E", "#B3AEB2", "#14D9C8" , "rgb(154, 4, 4)", "rgb(49, 152, 206)", "rgb(62, 165, 5)", "#D7E643", "#7486c3", "rgb(64, 135, 24)","#FE6C5F", "#F1E64E", "#98B914",];
	var color = d3.scaleOrdinal()
    	.domain(locations)
    	.range(colors);
	


	//Create a group that already holds the data
	var g = svg.append("g")
	    .attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")")
		.datum(loom(chord));	


	var pack = d3.pack()
	    .size([diameter-4, diameter-4])
	    .padding(2);

	 
  	root = d3.hierarchy(probe)
	    .sum(function(d) { return d.size; })
	    .sort(function(a, b) { return b.value - a.value; });

    var arr = [];
    var circlePackData = pack(root).descendants();

    for(var i = 0; i < circlePackData.length; i++){
    	if(circlePackData[i].data.name != null){
    		arr.push({
		        x: circlePackData[i].x - 129,
		        y: circlePackData[i].y - 129,
		        r: circlePackData[i].r,
		        name: circlePackData[i].data.name
		    });
    	}
    }

	var inner;
	var strings = g.append("g")
	    .attr("class", "stringWrapper")
		.style("isolation", "isolate")
	  	.selectAll("path")
	    .data(function(strings) { 

	    	for(var i = 0; i<strings.length; i++){
	    		inner = arr.find(x => x.name === strings[i].inner.name)
	    		strings[i].inner = arr.find(x => x.name === strings[i].inner.name);
	    	}
			return strings; 
		})
	  	.enter().append("path")
		.attr("class", "string")
		.style("mix-blend-mode", "multiply")
	    .attr("d", string)
	    .style("fill", function(d) { return d3.rgb( color(d.outer.outername) ).brighter(0.2) ; })
		.style("opacity", defaultOpacity);


	var node = g.selectAll(".node")
	    .data(pack(root).descendants())
	    .enter().append("g")
	    .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
	    .attr("transform", function(d) { return "translate(" + (d.x - 129) + "," + (d.y -129) + ")"; });

	var innerLabels = g.append("g")
	  	.selectAll("text")
		.data(arr)
	  	.enter()
	    .append("circle")
	  	.attr("class","inner-labels")
	    .attr("cx",function(d,i) { return d.x; })
	    .attr("cy", function(d,i) { return d.y; })
	    .attr("r",function(d,i) { return d.r; })
 	 	.on("mouseover", function(d) {
			//Show all the strings of the highlighted character and hide all else
		    d3.selectAll(".string")
		      	.transition()
		        .style("opacity", function(s) {
					return s.outer.innername !== d.name ? fadeOpacity : 1;
				});

			d3.selectAll(".inner-labels")
		      	.transition()
		        .style("opacity", function(s) {
					return s.name == d.name ? 1: fadeOpacity;
				});
				
			//Update the word count of the outer labels
			var characterData = loom(chord).filter(function(s) { return s.outer.innername === d.name; });
			
			//Hide the arc where the character hasn't said a thing
			d3.selectAll(".arc-wrapper")
		      	.transition()
		        .style("opacity", function(s) {
					//Find which characterData is the correct one based on location
					var loc = characterData.filter(function(c) { return c.outer.outername === s.outername; });
					return loc.length === 0 ? 0.1 : 1;
				});


		})
		.on("click", function(d) {
            d3.select("#title").style('display', 'block').html('Shared Sequence:');
            d3.select("#probe").style('display', 'block').html(d.name);
			displayLocation(d.name);
			$(".shared").css("opacity","0.2");
			$("#"+d.name).css("opacity","1");
		})
     	.on("mouseout", function(d) {
			
     		d3.selectAll(".inner-labels")
		      	.transition()
		        .style("opacity", 1);

			//Put the string opacity back to normal
		    d3.selectAll(".string")
		      	.transition()
				.style("opacity", defaultOpacity);
				
			d3.selectAll(".arc-wrapper")
		      	.transition()
		        .style("opacity", 1);
						
		});


 	var arcs = g.append("g")
	    .attr("class", "arcs")
	  	.selectAll("g")
	    .data(function(s) { 
			return s.groups; 
		})
	  	.enter().append("g")
		.attr("class", "arc-wrapper")
 	 	.on("mouseover", function(d) {

 	 		//Find the data for the strings of the hovered over location
			var locationData = loom(chord).filter(function(s) { return s.outer.outername === d.outername; });
 	 		d3.selectAll(".inner-labels")
		      	.transition()
		        .style("opacity", function(s) {
					var char = locationData.filter(function(c) { return c.outer.innername === s.name; });
					return char.length === 0 ? 0.1 : 1;


				});
			
			//Hide all other arcs	
			d3.selectAll(".arc-wrapper")
		      	.transition()
				.style("opacity", function(s) {
				 	return s.outername === d.outername ? 1 : 0.1; 
				 });
			
			//Hide all other strings
		    d3.selectAll(".string")
		      	.transition()
		        .style("opacity", function(s) { return s.outer.outername === d.outername ? 1 : fadeOpacity; });
				
 	 	})
     	.on("mouseout", function(d) {

     		d3.selectAll(".inner-labels")
		      	.transition()
		        .style("opacity", 1);


			
			//Sjow all arc labels
			d3.selectAll(".arc-wrapper")
		      	.transition()
				.style("opacity", 1);
			
			//Show all strings again
		    d3.selectAll(".string")
		      	.transition()
		        .style("opacity", defaultOpacity);

		});


    var outerArcs = arcs.append("path")
		.attr("class", "arc")
	    .style("fill", function(d) { return color(d.outername); })
	    .attr("d", arc)
	

	//The text needs to be rotated with the offset in the clockwise direction
	var outerLabels = arcs.append("g")
		.each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2); })
		.attr("class", "outer-labels")
		.attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
		.attr("transform", function(d,i) { 
			var c = arc.centroid(d);
			var rotate, translate;
			if (d.angle * 180 / Math.PI  < 180){
				rotate = d.angle * 180 / Math.PI;  
				translate = -20;
			}
			else {
				rotate = d.angle * 180 / Math.PI -180;
				translate = 20;
			}
				
			d.pullOutSize = 0
			return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
			+ "rotate(" + rotate +")"// - 90
			+ "translate(0,"+translate+")"//26, 0
			+ (d.angle > Math.PI ? "rotate(180)" : "")
		})
		
	//The outer name
	outerLabels.append("text")
		.attr("class", "outer-label")
		.attr("dy", ".35em")
		.text(function(d,i){ return d.outername; });
		
}

//Display where the probe is located relative to the transcript 
function displayLocation(name){
	$( ".probe" ).remove();

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
		
		if(spliceVariants[i].indexOf(name) != -1){// if transcript contains the desired probe
			// for loop find all matches
			found = true;
			var indices = indexes(spliceVariants[i],name);
			for(j = 0; j < indices.length; j++){
				d3.select("#svgT").append("rect")
				            .attr("x", xScale(indices[j]))
				            .attr("y", yloc - 0)// -5
				            .attr("width", xScale(name.length))
				            .attr("height", 20)//3
				            .attr("class", "probe")
				            .style("opacity","0.65")//1
				            .style("pointer-events","none")
							.attr("fill", "white");//rgb(228, 75, 75)
			}

			
		}
		yloc += 30;
	}
	return found; 
}

// find occurences of probe in a transcript
function indexes(str, find) {
  var regex = new RegExp(find, "g")
  ,   result
  ,   indices = [];
  while ((result = regex.exec(str))) {
    indices.push(result.index);
  }
  return indices;
}


