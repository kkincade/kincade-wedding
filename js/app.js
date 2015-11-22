$(function() {
    'use strict';

    var currentImage = 0;
    var imagePaths = [
        '../images/computer.png',
        '../images/engagement.jpg'
    ];

    var controls = {
        $doc: $(document),
        $backgroundImage: $('.background-image'),
        googleMap: document.getElementById('googleMap')
    };

    window.setTimeout(function () {
        currentImage = (currentImage >= imagePaths.length) ? 0 : currentImage += 1;

        controls.$backgroundImage.fadeOut(400, function() {
            $(this).attr('src', imagePaths[currentImage]);
        })
        .fadeIn(400);
    }, 5000);            

    // Smooth scrolling
    var hrefElements = $('a[href*=#]:not([href=#])');
    hrefElements.click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            
            if (target.length) {
                target.velocity('scroll', { duration: 1000, easing: 'easeOutExpo' });

                // Don't remember event in browser history
                event.preventDefault();
                return false;
            }
        }
    });

    function initializeGoogleMap() {
        var denverLatLong = {
            lat: 39.755874,
            lng: -104.994157
        };

        var mapProperties = {
            center: denverLatLong,
            scrollwheel: false,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROAD
        };

        // Create map with custom style
        var map = new google.maps.Map(controls.googleMap, mapProperties);
        map.set('styles', [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]);
        
        // Set marker on Coors Field
        var marker = new google.maps.Marker({
            position: denverLatLong,
            map: map,
            title: 'Denver, CO'
        });

        // The controls to hide
        var mapControlsOff = {
            mapTypeControl: false,
            zoomControl: false,
            rotateControl: false,
            panControl: false,
            streetViewControl: false
        };

        // Create a copy of controlsOut and set all values to true
        var mapControlsOn = {};
        for (var c in mapControlsOff) {
            mapControlsOn[c] = true;
        }

        // Hide the controls initially
        map.setOptions(mapControlsOff)

        // Listener to add controls
        google.maps.event.addDomListener(map.getDiv(), 'mouseover', function(e) {
            e.cancelBubble = true;
            if (!map.hover) {
                map.hover = true;
                map.setOptions(mapControlsOn);
            }
        });

        // Listener to remove controls
        google.maps.event.addDomListener(document.getElementsByTagName('body')[0], 'mouseover', function(e) {
            if (map.hover) {
                map.setOptions(mapControlsOff);
                map.hover = false;
            }
        });
    }

    // Wait for DOM to load before initalizing map
    google.maps.event.addDomListener(window, 'load', initializeGoogleMap);


    // Blur image when scrolling
    // $(window).on('scroll', function () {
    //     var pixels = controls.$doc.scrollTop() / 100;

    //     if (pixels > 5.0) {
    //         return;
    //     }

    //     controls.$backgroundImage.css({
    //         '-webkit-filter': 'blur(' + pixels + 'px)',
    //         'filter': 'blur(' + pixels + 'px)' 
    //     });
    // });
});