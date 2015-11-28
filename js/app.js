(function ($) {
    'use strict';

    // -------- OBJECT DEFINITION --------

    /**
     * The constructor for the class.
     */
    var WebsiteControl = function (element, options) {
        this.options = options;
        this.$element = $(element);
        this.$doc = $(document);
        this.$body = $('body');

        this.init();
    };

    /**
     * Initializes the controls and calls any other init methods
     * to setup the site.
     */
    WebsiteControl.prototype.init = function () {
        this.templates = {
            videoPlaylistItem: this.$element.find('.playlist-item-template').html()
        };

        this.controls = {
            $backgroundImage: $('.background-image'),

            // Interests Section
            interests: {
                $container: this.$element.find('section.interests-section'),
                $videoPlayer: this.$element.find('.video-player'),
                $videoPlaylistContainer: this.$element.find('.video-playlist-container'),
                $videoPlaylist: this.$element.find('.video-playlist'),
                $bigArrowLeft: this.$element.find('.arrow-left'),
                $bigArrowRight: this.$element.find('.arrow-right'),
                $smallArrowLeft: this.$element.find('.scroll-help .left'),
                $smallArrowRight: this.$element.find('.scroll-help .right'),
                weddingVideos: {}
            },
            
            // Connect Section
            $googleMap: this.$element.find('.google-map')
        };

        this.initSmoothScroll();
        this.initVideoPlayer();
        this.initGoogleMap();
    }

    /**
     * Initializes the smooth scroll occurring when a href tag is clicked.
     */
    WebsiteControl.prototype.initSmoothScroll = function () {
        var hrefElements = $('a[href*=#]:not([href=#])');

        hrefElements.click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var $target = $(this.hash);
                $target = $target.length ? $target : $('[name=' + this.hash.slice(1) +']');
                
                if ($target.length) {
                    $target.velocity('scroll', { duration: 1000, easing: 'easeOutExpo' });

                    // Don't remember event in browser history
                    event.preventDefault();
                    return false;
                }
            }
        });
    };

    /**
     * Initializes the video player. This includes creating the playlist
     * using the template from the DOM and also setting up the scrolling
     * capabilities.
     */
    WebsiteControl.prototype.initVideoPlayer = function ()  {
        var _this = this;

        this.controls.interests.weddingVideos = {
            bradyAndKatie:   { id: 138580909, title: 'Katie & Brady', date: 'July 2015', thumbnail: 'images/brady-katie.jpg' },
            tobyAndErica:    { id: 96914498, title: 'Toby & Erica', date: 'June 2014', thumbnail: 'images/toby-erica.jpg' },
            joseAndVictoria: { id: 87824702, title: 'Jose & Victoria', date: 'October 2013', thumbnail: 'images/jose-victoria.jpg' },
            nickAndAllison:  { id: 82051409, title: 'Nick & Allison', date: 'August 2013', thumbnail: 'images/nick-allison.jpg' },
            shaneAndBree:    { id: 74086184, title: 'Shane & Bree', date: 'July 2013', thumbnail: 'images/shane-bree.jpg' }, 
            juanAndAmanda:   { id: 66216165, title: 'Juan & Amanda', date: 'February 2013', thumbnail: 'images/juan-amanda.jpg' },
            benAndCourtney:  { id: 53657379, title: 'Ben & Courtney', date: 'June 2012', thumbnail: 'images/ben-courtney.jpg' }
        };

        $.each(this.controls.interests.weddingVideos, function () {
            var video = this;

            var template = _this.templates.videoPlaylistItem
                .replace('{{VideoTitle}}', video.title)
                .replace('{{VideoDate}}', ' - ' + video.date)
                .replace('{{Thumbnail}}', '<img src="' + video.thumbnail + '">')
                .replace('{{Id}}', video.id);

            _this.controls.interests.$videoPlaylist.append(template);

            // Get data from vimeo video
            // $.ajax({
            //     url: 'http://www.vimeo.com/api/v2/video/' + this.id + '.json?callback=?',
            //     data: JSON.stringify({}),
            //     async: false,
            //     dataType: "json",
            //     success: function (data) {
            //         video.thumbnail = data[0].thumbnail_medium;
            //         video.url = data[0].url;

            //         var template = _this.templates.videoPlaylistItem
            //             .replace('{{VideoTitle}}', video.title)
            //             .replace('{{VideoDate}}', ' - ' + video.date)
            //             .replace('{{Thumbnail}}', '<img src="' + video.thumbnail + '">');

            //         _this.controls.interests.$videoPlaylist.append(template);
            //     },
            //     error: function (jqXhr, textStatus, errorThrown) {
            //         // TODO Kam: handle error
            //     }
            // });
        });

        this.controls.interests.playlistItems = this.$element.find('.playlist-item');

        // Clicking on a video in the playlist
        this.controls.interests.playlistItems.on('click', function () {
            var videoId = $(this).data('videoId');

            if (_this.controls.interests.$videoPlayer.html().indexOf(videoId.toString()) > -1) {
                return;
            }

            var iFrame = '<iframe src="http://player.vimeo.com/video/' + $(this).data('videoId') + 
                '?title=0&amp;byline=0&amp;portrait=0" frameborder="0" ' +
                'webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
                
            _this.controls.interests.$videoPlayer
                .velocity({ opacity: 0 }, { duration: 300 })
                .empty()
                .append(iFrame)
                .velocity({ opacity: 1 }, { duration: 300 });
        });

        // Callbacks for right scroll arrows  
        this.controls.interests.$bigArrowRight.add(this.controls.interests.$smallArrowRight)
            .bind("click", function (event) {
                _this.$element.velocity('scroll', { 
                    container: _this.controls.interests.$videoPlaylistContainer, 
                    axis: 'x', 
                    offset: '180px', 
                    duration: 750, 
                    easing: 'easeOutExpo' 
                });

                // Don't remember event in browser history
                event.preventDefault();
                return false;
            });

        // Callbacks for left scroll arrows  
        this.controls.interests.$bigArrowLeft.add(this.controls.interests.$smallArrowLeft)
            .bind("click", function (event) {
                _this.$element.velocity('scroll', { 
                    container: _this.controls.interests.$videoPlaylistContainer, 
                    axis: 'x', 
                    offset: '-180px', 
                    duration: 750, 
                    easing: 'easeOutExpo' 
                });

                // Don't remember event in browser history
                event.preventDefault();
                return false;
            });
    };

    /**
     * Initializes the Google map. Uses a theme I found on the web. Sets
     * a marker on the Coors Field Stadium. Also, hides controls unless
     * the mouse is hovering over the map. 
     */
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
        google.maps.event.addDomListener(this.googleMap.getDiv(), 'mouseover', function (e) {
            e.cancelBubble = true;
            if (!_this.googleMap.hover) {
                _this.googleMap.hover = true;
                _this.googleMap.setOptions(mapControlsOn);
            }
        });

        // Listener to remove controls
        google.maps.event.addDomListener(this.$body[0], 'mouseover', function (e) {
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