;(function ($) {
    'use strict';

    // Plugin Name
    // ================
    var name = "fusionchart";
        
    // Constructor
    // =======================
    var Fusionchart = function ( element, options ) {
        this.$element = $( element );
        this.options = options;
        
        this.init();
    }

    // Defaults options

    Fusionchart.DEFAULTS = {
        //svgColor  : "#ffffff",
        //strUrl      : "/Common/assets/components/patterns/javascript/fusionchartjson.json",
        svgHeight   : 80,
        rectGreenW  : 126,
        rectYellowW : 20,
        rectRedW    : 43,
        
        // chart values
        bgColor     : "ffffff",
        setFullWidth: 250,

        upperlimit  : 250,
        
        showBorder  : 0,
        showValues  : 0,
        showtickvalues  : 0,
        showLimits  : 1,
        chartleftmargin : 20,
        chartrightmargin: 20 ,
        lowerLimitDisplay   : "Aug 25",
        upperLimitDisplay   : "May 07",

        adjustTM    : 0, 
        showShadow  : 0, 
        //gaugeFillMix  :{light}, 
        pointerRadius   : 5 ,
        valueAbovePointer   : 0 ,
        autoLoad    : true,

        // colorrange

        // For green
        greenColor  : "588f40",
        gMaxValue   : 150,
        gMinValue   : 0,
        
        // For yellow
        yellowColor : "eaa022",
        yMaxValue   : 215,
        yMinValue   : 150,

        // For red
        redColor    : "c0262c",
        rMaxValue   : 250,
        rMinValue   : 215,

        // pointer     : 200,
        // toolText    : "Jul 06",
        // trendPoints : 215,
        // displayvalue:"May 08",
    }

    Fusionchart.prototype.init = function () {
        var element = this.$element,
        self        = this,
        svgWidth    = this.options.svgWidth || 290,
        setFullWidth= this.options.setFullWidth || 250;
        if( this.options.strUrl ) {
            var fusionJson = $.getJSON( this.options.strUrl );
            $( element ).css( "min-height", this.options.svgHeight+"px" );
            $( element ).append( '<div class="loading-overlay bg-img-medium" style="min-height: '+this.options.svgHeight+'px; "></div></br>' );

            fusionJson.complete( function() {
                var parJson = JSON.parse( fusionJson.responseText );
                if( self.options.autoLoad ) {
                    self.dimentionManage( element, svgWidth, parJson, setFullWidth );
                }
            } );
        }

    };

    Fusionchart.prototype.dimentionManage = function ( element, svgWidth, parJson, setFullWidth ) {
        var self = this,
            upperlimit = self.options.upperlimit || parJson["linearQuotes"]["chart"]["upperlimit"];
        if( this.options.autoLoad && this.options.strUrl ) {
            // parJson["linearQuotes"]["colorrange"]["color"][0]["minvalue"] === 0 ? console.log("1hdskjh") : console.log("2jldkj");
            // Calculation
            var totalWidth      = ( String( parJson["linearQuotes"]["chart"]["upperlimit"] ) ),
                rectGreenW      = ( String( parJson["linearQuotes"]["colorrange"]["color"][0]["maxvalue"] ) || this.options.gMaxValue )- ( String( parJson["linearQuotes"]["colorrange"]["color"][0]["minvalue"] ) || this.options.gMinValue ),
                rectYellowW     = ( String( parJson["linearQuotes"]["colorrange"]["color"][1]["maxvalue"] ) || this.options.yMaxValue )- ( String( parJson["linearQuotes"]["colorrange"]["color"][1]["minvalue"] ) || this.options.yMinValue ),
                rectRedW        = ( String( parJson["linearQuotes"]["colorrange"]["color"][2]["maxvalue"] ) || this.options.rMaxValue )- ( String( parJson["linearQuotes"]["colorrange"]["color"][2]["minvalue"] ) || this.options.rMinValue ),
                gMinValue       = ( String( parJson["linearQuotes"]["colorrange"]["color"][0]["minvalue"] ) || this.options.gMinValue ),
                yMinValue       = ( String( parJson["linearQuotes"]["colorrange"]["color"][1]["minvalue"] ) || this.options.yMinValue ),
                rMinValue       = ( String( parJson["linearQuotes"]["colorrange"]["color"][2]["minvalue"] ) || this.options.rMinValue ),
                greenColor      = ( String( parJson["linearQuotes"]["colorrange"]["color"][0]["code"] ) || this.options.rMinValue ),
                yellowColor     = ( String( parJson["linearQuotes"]["colorrange"]["color"][1]["code"] ) || this.options.rMinValue ),
                redColor        = ( String( parJson["linearQuotes"]["colorrange"]["color"][2]["code"] ) || this.options.rMinValue ),
                displayvalue    = ( String( parJson["linearQuotes"]["pointers"]["pointer"]["toolText"] ) || this.options.displayvalue ),
                trendPointsVal  = ( String( parJson["linearQuotes"]["trendpoints"]["point"]["startvalue"] ) || this.options.displayvalue ),
                pointersVal     = ( String( parJson["linearQuotes"]["pointers"]["pointer"]["value"] ) || this.options.displayvalue ),
                lowerLimitDisplay= ( String( parJson["linearQuotes"]["chart"]["lowerLimitDisplay"] ) || this.options.lowerLimitDisplay ),
                upperLimitDisplay= ( String( parJson["linearQuotes"]["chart"]["upperLimitDisplay"] ) || this.options.upperLimitDisplay ),
                toolText        = ( String( parJson["linearQuotes"]["pointers"]["pointer"]["toolText"] ) || this.options.toolText ),

                // extend values 
                bgColor         = ( String( parJson["linearQuotes"]["chart"]["bgColor"] ) || this.options.bgColor ) ,
                // calculate width in 250px

                rGreenWidthCal  = ( ( rectGreenW*setFullWidth ) / totalWidth ),
                rYellowWidthCal = ( ( rectYellowW*setFullWidth ) / totalWidth ),
                rRedWidthCal    = ( ( rectRedW*setFullWidth ) / totalWidth ),
                gMin            = ( ( gMinValue*setFullWidth ) / totalWidth ),
                yMin            = ( ( yMinValue*setFullWidth ) / totalWidth ),
                rMin            = ( ( rMinValue*setFullWidth ) / totalWidth ),
                trendPoints     = ( ( trendPointsVal*setFullWidth ) / totalWidth ),
                pointers        = ( ( pointersVal*setFullWidth ) / totalWidth ),
                
                fusionArray= new Array();
                
                fusionArray= [element, svgWidth, upperlimit, rGreenWidthCal, rYellowWidthCal, rRedWidthCal, gMin, yMin, rMin, greenColor, yellowColor, redColor, displayvalue, trendPoints, lowerLimitDisplay, upperLimitDisplay, toolText, pointers, bgColor];
                console.log( fusionArray.length );
            this.fusionCreate( fusionArray );
        }
    };

    Fusionchart.prototype.fusionCreate = function ( fusionArray) {
        var self            = this,
            modal           = "",
            element         = fusionArray[0],
            monthStartDate  = fusionArray[14].split(" "),
            monthEndDate    = fusionArray[15].split(" "),
            lastPosition    = 0;
        
        $( element ).html( "" );
        
        modal += "<svg class='fusion-chart' style='background: #"+fusionArray[18]+";' width='"+fusionArray[1]+"' height='"+this.options.svgHeight+"'><g zindex='3'>";
        modal += "<g transform='translate(20,11)'>";
        modal += "<g>";
        modal += "<rect fill='none' x='0' y='0' width='"+fusionArray[2]+"' height='18' stroke-width='0.000001'></rect>";
        modal += "<rect fill='#"+fusionArray[9]+"' x='"+fusionArray[6]+"' y='0' width='"+fusionArray[3]+"' height='18'></rect>";
        modal += "<rect fill='#"+fusionArray[10]+"' x='"+fusionArray[7]+"' y='0' width='"+fusionArray[4]+"' height='18'></rect>";
        modal += "<rect fill='#"+fusionArray[11]+"' x='"+fusionArray[8]+"' y='0' width='"+fusionArray[5]+"' height='18'></rect>";
        modal += "<path d='M "+fusionArray[8]+" 0 L "+fusionArray[8]+" 18' fill='none' stroke='rgb(0,0,0)' stroke-width='2'>";
        modal += "<title>"+fusionArray[12]+"</title>";
        modal += "</path>";
        modal += "</g>";
        modal += "<g transform='translate(0,18)'>";
        modal += "<text x='-6' y='23' style='font-family:Verdana;font-size:10px;line-height:14px;color:#555555;fill:#555555;' text-anchor='start'>";
        modal += "  <tspan x='-6'>"+monthStartDate[0]+"</tspan>";
        modal += "    <tspan dy='14px' x='-6'>"+monthStartDate[1]+"</tspan>";
        modal += "</text>";

        modal += "<path d='M 0 3.5 L "+fusionArray[2]+" 3.5' fill='none' stroke-opacity='1' stroke='rgb(51,51,51)' stroke-linecap='round' stroke-width='1'></path>";
        for( var i = 0; i <= fusionArray[2]; i++ ){
            if( i%50 == 0 ){
                modal += "<path d='M "+i+".5 3.5 L "+i+".5 11' fill='none' stroke-opacity='1' stroke='rgb(51,51,51)' stroke-linecap='round' stroke-width='1'></path>";
            } else if( i%10 == 0 ){
                modal += "<path d='M "+i+".5 3.5 L "+i+".5 8' fill='none' stroke-opacity='1' stroke='rgb(51,51,51)' stroke-linecap='round' stroke-width='1'></path>";
            } else if( i%5 == 0 ){
                modal += "<path d='M "+i+".5 3.5 L "+i+".5 6' fill='none' stroke-opacity='1' stroke='rgb(51,51,51)' stroke-linecap='round' stroke-width='1'></path>";
            }
            lastPosition = i;
        }
        modal += "<text x='"+lastPosition+"' y='23' style='font-family:Verdana;font-size:10px;line-height:14px;color:#555555;fill:#555555;' text-anchor='end'>";
        modal += "  <tspan x='"+lastPosition+"' dx='7'>"+monthEndDate[0]+"</tspan>";
        modal += "  <tspan dy='14px' x='"+lastPosition+"'>"+monthEndDate[1]+"</tspan>";
        modal += "</text>";
        modal += "</g>";
        
        modal += "<g class='highcharts-data-labels' visibility='' zindex='6'>";
        //trendPoints = fusionArray[13] || fusionArray[8];
        modal += "<text x="+fusionArray[13]+" y='-4' style='font-family:Verdana;font-size:10px;color:#555555;line-height:14px;fill:#555555;' text-anchor='middle'>";
        modal += "  <tspan x="+fusionArray[13]+">"+fusionArray[12]+"</tspan>";
        modal += "</text>";
        modal += "</g>";
        modal += "<path class='path' fill='rgb(84,84,84)' fill-opacity='1' stroke-opacity='1' stroke='rgb(84,84,84)' stroke-width='1'>";
        modal += "<title>"+fusionArray[16]+"</title>";
        modal += "</path>";
        
        modal += "</g>";
        modal += "</g></svg>";

        $( element ).append( modal );
        self.fusionPointerSet( element, fusionArray[17] );
     
    };
    Fusionchart.prototype.fusionPointerSet = function () {
        var self           = this;
        //console.log(fusionArray[1]);
        var currentPointer = arguments[1];
        var slidePointer    = currentPointer,
            pointerCenter   = +slidePointer,
            pointerLeft     = +slidePointer - 3.5,
            pointerRight    = +slidePointer + 4.5;
        $(".path").attr("d", 'M '+pointerLeft+' -2.5 L '+pointerRight+' -2.5 L '+pointerCenter+' 5.5 Z');
    };
    // Plugin Definition
    // =======================

    $.fn.fusionchart = function( option ) {
        return this.each( function () {
            var $this = $(this),
                data = $this.data( "f-chart" ),
                options = $.extend({}, Fusionchart.DEFAULTS, $this.data(), typeof option === 'object' && option );

            if ( !data && options == 'destroy' ) return;

            if ( !data ) {
                $this.data(name, (data = new Fusionchart( this, options )));
            }
        });
    };

    $.fn.fusionchart.Constructor = Fusionchart;
    
    // Data-api
    // ==================
    $( document ).ready( function() {
        $( "[data-fusion^='fusionchart']" ).fusionchart({
           strUrl: $( "[data-fusion^='fusionchart']" ).data("strurl"),
        });
        //console.log($( "[data-fusion^='fusionchart']" ).data("strurl"));
    } );
}(jQuery));
