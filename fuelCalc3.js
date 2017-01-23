
$(document).ready(function () {
    InitAll();

    $(window).on("orientationchange", function (event) {
        InitDrag();
    });

});
function InitAll() {
    $('table tr:odd').addClass("alt")

    $document = $(document),

    InitDrag();

    $(".calc").click(function () {
        calculate();
    });
    $(".selector img").click(function () {
        if ($(this).index() == 0) { // Up
            adjustVal(this, 1);
        }
        else { // Down
            adjustVal(this, -1);
        }
    });

    $(".grid input[type=text]").change(function () { adjustThisVal($(this), 0) });
}

function InitDrag() {
    $(".slider.fuelprice img").each(function () {
        $this = $(this);
        var $left = .06 * $('.slider.fuelprice')[0].clientWidth;
        $this.css("left", $left);
        $this.parents(".slider").find(".bubble").css("left", $left + $this.parent()[0].offsetWidth -7);
    });
    $(".slider.runtimes img").each(function () {
        $this = $(this);
        var $left = .01 * $('.slider.runtimes')[0].clientWidth;
        $this.css("left", $left);
        $this.parents(".slider").find(".bubble").css("left", $left + $this.parent()[0].offsetWidth -7);
    });
    $(".slider.opweeks img").each(function () {
        $this = $(this);
        var $left = .60 * $('.slider.opweeks')[0].clientWidth;
        $this.css("left", $left);
        $this.parents(".slider").find(".bubble").css("left", $left + $this.parent()[0].offsetWidth -7);
    });
    $(".slider.fleetunits img").each(function () {
        $this = $(this);
        var $left = .01 * $('.slider.fleetunits')[0].clientWidth - 30;
        $this.css("left", $left);
        $this.parents(".slider").find(".bubble").css("left", $left + $this.parent()[0].offsetWidth -7);
    });

    $(".slider .bar img").each(function () {
        $(this).draggable({
            axis: "x",
            containment: $(this).parent().parent(),//[$(this)[0].offsetLeft - 29, 0, $(this).parent()[0].clientWidth + 19, 0],
            opacity: 0.8,
            stop: function (e, ui) {
                calculate();
            },
            drag: function (e, ui) {
                $(e.target).parents(".slider").find(".bubble").css("left", ui.position.left + $(e.target).parent()[0].offsetWidth -7);

                var Min = $(e.target).parents(".bar").data('min');
                var Max = $(e.target).parents(".bar").data('max');

                var val = Min + ((Max - Min) * (ui.position.left+22)) / ($(e.target).parents(".slider")[0].clientWidth-22);
                val = Math.max($(e.target).parents(".bar").data('min'), val);
                val = Math.min($(e.target).parents(".bar").data('max'), val);
                
                val = val.toFixed($(e.target).parents(".bar").data('precision'));
                $(e.target).prev('.bubble').find('span').html(val);
                calculate();
            }
        });
    });
}
function adjustVal(obj, sign) {
    var $txtNum = $(obj).parent().next('input');
    adjustThisVal($txtNum, sign)
}

function adjustThisVal(obj, sign) {
    var num = Number(obj.val().replace(/\$/g, ''));

    if (obj.parent()[0].className == 'fleetunits') {
        obj.val(Math.max(Math.min(num + (1 * sign), obj.data("max")), obj.data("min")));
        obj.next('span').html(obj.val());
    }
	else if (obj.parent()[0].className == 'runtimes') {
        obj.val(Math.max(Math.min(num + (.5 * sign), obj.data("max")), obj.data("min")));
        obj.next('span').html(obj.val());
    }
	else if (obj.parent()[0].className == 'opweeks') {
        obj.val(Math.max(Math.min(num + (1 * sign), obj.data("max")), obj.data("min")));
        obj.next('span').html(obj.val());
    }
    else {
        obj.next('span').html(Math.max(Math.min(num + (0.01 * sign), obj.data("max")), obj.data("min")).toFixed(2));
        obj.val("$" + obj.next('span').html());
    }

}
function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}

var ozToGallon = Number(0.0078125000001);
//length of this string below is dependent on how many products are listed in the html table. If a new product is added the string needs lengthened and the numbers in the fuel calculations should also be changed. 
var fuelConsumption = [48.7, 49, 52.7, 60.2, 60.9, 51.4, 43.3];
var fuelConsumption2 = [48.7, 49, 52.7, 60.2, 60.9, 51.4, 42.6];
//var fuelConsumption = [51.9, 52.4, 52.6, 59.4, 59.8, 43.2];
//var fuelConsumption = [.41, .41, .41, .46, .47, .34];
//var OilCostPerGallon = 1.10;
var OilCostPerGallon = 1.65;

function calculate() {

    var total = [];
    var total2 = [];
    var fuelPrice = Number($('.fuelprice span').html());
    var runTime = Number($('.runtimes span').html());
    var opweeks = Number($('.opweeks span').html());
    var fleetunits = Number($('.fleetunits span').html());
    var AnnualRunTime = runTime * opweeks;
    
    //br600 calc
    for (var i = fuelConsumption.length-1; i >= 0; i--) {
        total[i] = fleetunits * fuelConsumption[i] * ozToGallon * AnnualRunTime * (OilCostPerGallon + fuelPrice);
        $('.result:eq(' + i + ')').html("<span class='dollar'>$</span>" + commaSeparateNumber(total[i].toFixed(2)));
        if (i < 6) { $('.diff:eq(' + i + ')').html("<span class='dollar'>$</span>" + commaSeparateNumber((total[i] - total[6]).toFixed(2))); }
    }
    $('span#total').html("<span class='dollar'>$</span>" + commaSeparateNumber((total[4] - total[6]).toFixed(2)));
    
    //br700 calc 
    for (var i = fuelConsumption2.length-1; i >= 0; i--) {
        total2[i] = fleetunits * fuelConsumption2[i] * ozToGallon * AnnualRunTime * (OilCostPerGallon + fuelPrice);
        $('.result2:eq(' + i + ')').html("<span class='dollar'>$</span>" + commaSeparateNumber(total2[i].toFixed(2)));
        if (i < 6) { $('.diff2:eq(' + i + ')').html("<span class='dollar'>$</span>" + commaSeparateNumber((total2[i] - total2[6]).toFixed(2))); }
    }
    $('span#total2').html("<span class='dollar'>$</span>" + commaSeparateNumber((total2[4] - total2[6]).toFixed(2)));
}
