(function ($) {
    'use strict';

    var WebsiteControl = function (element, options) {
        this.options = options;
        this.$element = $(element);
        this.$doc = $(document);
        this.$body = $('body');

        this.init();
    };

    WebsiteControl.prototype.init = function () {
        this.controls = {
            $backgroundImage: $('.background-image'),
            $googleMap: this.$element.find('.google-map')
        };

        this.initSmoothScroll();
        this.initGoogleMap();
    }

    WebsiteControl.prototype.initSmoothScroll = function () {
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
    }

    WebsiteControl.prototype.initGoogleMap = function () {
        var _this = this;

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
        this.googleMap = new google.maps.Map(this.controls.$googleMap[0], mapProperties);
        this.googleMap.set('styles', [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]);
        
        // Set marker on Coors Field
        var marker = new google.maps.Marker({
            position: denverLatLong,
            map: this.googleMap,
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
        this.googleMap.setOptions(mapControlsOff)

        // Listener to add controls
        google.maps.event.addDomListener(this.googleMap.getDiv(), 'mouseover', function(e) {
            e.cancelBubble = true;
            if (!_this.googleMap.hover) {
                _this.googleMap.hover = true;
                _this.googleMap.setOptions(mapControlsOn);
            }
        });

        // Listener to remove controls
        google.maps.event.addDomListener(this.$body[0], 'mouseover', function(e) {
            if (_this.googleMap.hover) {
                _this.googleMap.setOptions(mapControlsOff);
                _this.googleMap.hover = false;
            }
        });
    }
    // -------- PLUGIN DEFINITION --------

    $.fn.websiteControl = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('kincade.websitecontrol');
            var options = $.extend({}, WebsiteControl.DEFAULTS, $this.data(), typeof option === 'object' && option);

            if (!data) {
                $this.data('kincade.websitecontrol', (data = new WebsiteControl(this, options)));
            }

            if (typeof option === 'string') {
                data[option]();
            }
        });
    };

    $.fn.websiteControl.Constructor = WebsiteControl;

    // Find the "two factor container" and initialize the plugin
    $(document).ready(function () {
        $('.website-control').websiteControl();
    });

})(jQuery);