(function ($) {
    'use strict';

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
     * Initializes the controls and calls any other init methods to setup the site.
     */
    WebsiteControl.prototype.init = function () {
        this.templates = {
            weddingPartyMember: this.$element.find('.party-member-template').html()
        };

        var weddingPartyModal = this.$body.find('.wedding-party-member-modal');
        var rsvpModal = this.$body.find('.rsvp-modal');

        this.modals = {
            weddingPartyMemberModal: {
                $container: weddingPartyModal,
                $name: weddingPartyModal.find('.member-name'),
                $type: weddingPartyModal.find('.member-type'),
                $bio: weddingPartyModal.find('.member-bio'),
                $image: weddingPartyModal.find('.member-image')
            },

            rsvpModal: {
                $container: rsvpModal,
                $rsvpForm: rsvpModal.find('form.rsvp-form'),
                $radioAttending: rsvpModal.find('input:radio[name="attendance"].attending'),
                $radioNotAttending: rsvpModal.find('input:radio[name="attendance"].not-attending'),
                $selectAdults: rsvpModal.find('select.adults-select'),
                $selectChildren: rsvpModal.find('select.children-select'),
                $inputFirstName: rsvpModal.find('input.first-name'),
                $inputLastName: rsvpModal.find('input.last-name'),
                $inputGuestNames: rsvpModal.find('input.guest-names'),
                $selectVegan: rsvpModal.find('select.vegan-select'),
                $selectVegetarian: rsvpModal.find('select.vegetarian-select'),
                $selectGlutenFree: rsvpModal.find('select.gluten-free-select'),
                $inputPassword: rsvpModal.find('input.password'),
                $inputComment: rsvpModal.find('textarea.comment'),
                $errorContainer: rsvpModal.find('.error-container'),
                $btnSubmitRsvp: rsvpModal.find('.btn.btn-rsvp')
            }
        }

        this.controls = {
            $backgroundImage: $('.background-image'),
            $rsvpSuccessAlert: this.$body.find('.rsvp-alert'),

            countdownTimer: {
                $container: this.$element.find('.countdown-container'),
                $days: this.$element.find('.countdown-container .days'),
                $hours: this.$element.find('.countdown-container .hours'),
                $minutes: this.$element.find('.countdown-container .minutes'),
                $seconds: this.$element.find('.countdown-container .seconds')
            },

            // Wedding Party Section
            $weddingPartySection: this.$element.find('section.wedding-party-section'),
            $groomsmenContainer: this.$element.find('div.groomsmen'),
            $bridesmaidsContainer: this.$element.find('div.bridesmaids'),

            // Details Section
            $btnContactUs: this.$element.find('.btn.btn-contact-us'),

            // Location Section
            $googleMap: this.$element.find('.google-map')
        };

        this.weddingParty = {
            1: {
                type: 'Best Man',
                imageSrc: 'images/wedding-party/mike.jpg',
                offset: false,
                name: 'Michael Spitzlberger',
                bio: 'Simply put, Mike and I balance each other out. He has consistently made me grow as a person and has pulled me out of my shell. We have a similar sense of humor and have always enjoyed similar activities, such as music and poker. I love Mike\'s free spirit and his dedicated work ethic, and I am honored to call him my Best Man. Mike hopes that after the wedding, Mackenzie and I will move to California and we can all three live together. Mackenzie said she needs much more convincing. '
            },

            2: {
                type: 'Groomsman',
                imageSrc: 'images/wedding-party/matt.jpg',
                offset: false,
                name: 'Matthew Glazier',
                bio: 'Although I\'ve only known Matt since college, we\'ve been known to finish each other\'s sentences. As members of the same band, we both share the same passion for music, especially sweet vocal harmonies. We\'ve been asked countless times if we are brothers. I admire Matt\'s enthusiasm for life and his song-writing ability. I\'m honored to have him as a groomsman.'
            },

            3: {
                type: 'Groomsman',
                imageSrc: 'images/wedding-party/jake.jpg',
                offset: false,
                name: 'Jacob Harris',
                bio: 'I\'ve known Jake since we were both three years old. We\'ve spent countless hours together playing sports, video games, tubing and wakeboarding, and just growing up. I love Jake\'s sense of adventure and the sacrifice he makes as a firefighter. He was recently accepted on at Monument Fire Department! I\'m glad to know I\'ll have a certified firefighter at my wedding. Mackenzie can now have as many candles as she wants at the wedding!'
            },

            4: {
                type: 'Groomsman',
                imageSrc: 'images/wedding-party/alex.jpg',
                offset: true,
                name: 'Alex Hill',
                bio: 'Alex (who I call "Al") is my brother-in-law, but more importantly my brother-by-choice. I am very proud of Al\'s service to our country through his time in the Air Force. It has also been awesome to watch him become a father over the past year. I look up to Al and appreciate all he does for my sister and their family. I love playing golf, grilling ribs, and hanging out with Al. If only he didn\'t live so far away!'
            },

            5: {
                type: 'Groomsman',
                imageSrc: 'images/wedding-party/toby.jpg',
                offset: false,
                name: 'Toby Yarrington',
                bio: 'I remember visiting Toby (my cousin) in London when he was born, a little over thirteen years ago. Him and I both share the middle name of "Webb", a tribute to my late grandfather. I\'ve enjoyed watching Toby grow up into a fine, young man. He reminds me a lot of myself in how he manages to juggle school, sports, and all of his other extracurriculars. More importantly, he always seems to have a genuine smile on his face while doing it. I\'m proud to have Toby with me on the big day'
            },

            6: {
                type: 'Matron of Honor',
                imageSrc: 'images/wedding-party/sarah.jpg',
                offset: false,
                name: 'Sarah Von Thun',
                bio: 'There are some people you meet and instantly click with. Sarah and I have not known each other for very long, but I know she\'ll be one of my best friends for life. From sleepovers to double dates, this girl makes my life a bit more fun every day! She\'s crazy and outgoing, but level-headed when I need girl advice. We met and became friends through the band, and soon she\'ll be stuck fan-girling with me forever!'
            },

            7: {
                type: 'Maid of Honor',
                imageSrc: 'images/wedding-party/jen.jpg',
                offset: false,
                name: 'Jen Wells',
                bio: 'I met Jen while in college. Our friendship grew over sand castles and Dunkin Donuts dates, and I\'m proud to call her one of my best friends. We\'ve been through quite a few ups and downs in the few years we\'ve known each other, and they\'ve only made us closer. I\'m still trying to convince her to move closer to me, but having a place to stay in Florida is always nice as well!'
            },

            8: {
                type: 'Bridesmaid',
                imageSrc: 'images/wedding-party/victoria.jpg',
                offset: false,
                name: 'Victoria Bychkova',
                bio: 'I met Victoria when I started cosmetology school. Throughout the last year and a half we spent many hours together between Paul Mitchell and P.F. Changs. Since we\'ve met, I think I\'ve spent more time with her than I have with Kam! Through all of the laughter and tears she\'s become one of my favorite people. I love that we\'re both in the same career and can help push each other to new levels. She\'s going to make an amazing stylist, and it doesn\'t hurt to have some help on my wedding day.'
            },

            9: {
                type: 'Bridesmaid',
                imageSrc: 'images/wedding-party/lindsay.jpg',
                offset: true,
                name: 'Lindsay Schultz',
                bio: 'She might be my sister-in-law by title, but Lindsay so much more than that to me. Since she joined our family, I\'ve loved growing closer to her as a sister and friend. We\'re both very introverted, so the friendship started slow. But through several double dates and a wedding of her own, we\'ve become much closer and I\'m excited to see our families grow together.'
            },

            10:{
                type: 'Bridesmaid',
                imageSrc: 'images/wedding-party/kayla.jpg',
                offset: false,
                name: 'Kayla Hill',
                bio: 'I greatly admire Kayla in many ways. She has a very difficult career and somehow balances her marriage and a baby at home. Since the start of my relationship with Kam, I haven\'t been able to spend as much time getting to know Kayla as I would have liked. But through the distance, she\'s made an incredible effort to include me in the family. She\'s an extraordinary pilot and an even better wife and mom. I\'m excited to add a sister and join the Kincade family!'
            }
        }

        this.initSmoothScroll();
        this.initGoogleMap();
        this.initCountdownTimer();
        this.initWeddingPartySection();
        this.initDetailsSection();
        this.initRsvpSection();
    }

    /**
     * Initializes the countdown timer.
     */
    WebsiteControl.prototype.initCountdownTimer = function () {
        var _this = this;

        function getTimeRemaining(endtime) {
            var t = Date.parse(endtime) - Date.parse(new Date());
            var seconds = Math.floor((t / 1000) % 60);
            var minutes = Math.floor((t / 1000 / 60) % 60);
            var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            var days = Math.floor(t / (1000 * 60 * 60 * 24));

            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        }

        function initializeCountdown(endtime) {

            function updateTimer() {
                var t = getTimeRemaining(endtime);

                _this.controls.countdownTimer.$days.text(t.days);
                _this.controls.countdownTimer.$hours.text(('0' + t.hours).slice(-2));
                _this.controls.countdownTimer.$minutes.text(('0' + t.minutes).slice(-2));
                _this.controls.countdownTimer.$seconds.text(('0' + t.seconds).slice(-2));

                if (t.total <= 0) {
                  clearInterval(timeinterval);
                }
            }

            updateTimer();
            var timeinterval = setInterval(updateTimer, 1000);
        }

        var deadline = new Date(Date.parse(new Date(2016, 7, 18, 18, 0, 0)));
        initializeCountdown(deadline);
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
     * Initializes the Details section.
     */
    WebsiteControl.prototype.initDetailsSection = function () {

        // Callback for "Contact Us" button
        this.controls.$btnContactUs.on('click', function () {
            // Obfuscate email address to help avoid spam messages.
            var emailName = String.fromCharCode(107, 105, 110, 99, 97, 100, 101)      // kincade
                          + String.fromCharCode(46, 115, 99, 104, 117, 108, 116, 122) // .schultz
                          + String.fromCharCode(46, 50, 48, 49, 54)                // .2016
                          + String.fromCharCode(64, 103, 109, 97, 105, 108)           // @gmail
                          + String.fromCharCode(46, 99, 111, 109);                     // .com
            window.location.href = 'mailto:' + emailName;
        });
    };

    /**
     * Populates the wedding party member content and images. Also defines
     * the onclick callback method that shows the bootstrap modal for a member.
     */
    WebsiteControl.prototype.initWeddingPartySection = function () {
        var _this = this;

        $.each(this.weddingParty, function (index, thisobject) {
            var partyMember = this;

            var template = _this.templates.weddingPartyMember
                .replace('{{Id}}', index)
                .replace('{{MemberName}}', partyMember.name.toUpperCase())
                .replace('{{MemberDescription}}', partyMember.type.toUpperCase())
                .replace('{{MemberImage}}', '<img class="party-member-image" src="' + partyMember.imageSrc + '">')
                .replace('{{Offset}}', partyMember.offset ? 'col-md-offset-2' : '');

            if (partyMember.type.toUpperCase() == 'BEST MAN' ||
                partyMember.type.toUpperCase() == 'GROOMSMAN') {
                _this.controls.$groomsmenContainer.append(template);
            } else {
                _this.controls.$bridesmaidsContainer.append(template);
            }
        });

        this.controls.$weddingPartySection.find('.member-info').on('click', function () {
            // Populate member information
            var partyMember = _this.weddingParty[this.id];

            _this.modals.weddingPartyMemberModal.$name.text(partyMember.name.toUpperCase());
            _this.modals.weddingPartyMemberModal.$type.text(partyMember.type.toUpperCase());
            _this.modals.weddingPartyMemberModal.$bio.text(partyMember.bio);
            _this.modals.weddingPartyMemberModal.$image.attr('src', partyMember.imageSrc);

            // Show the modal
            _this.modals.weddingPartyMemberModal.$container.modal('show');
        });
    };

    WebsiteControl.prototype.initRsvpSection = function () {
        var _this = this;

        this.modals.rsvpModal.$radioAttending.on('click', function () {
            _this.enableDisableRsvp(true);
        });

        // Disable certain form elements when they select "not-attending"
        this.modals.rsvpModal.$radioNotAttending.on('click', function () {
            _this.enableDisableRsvp(false);
        });

        // Initialize the validator
        this.modals.rsvpModal.validator = this.modals.rsvpModal.$rsvpForm.validate({
            rules: {
                'attendance': { required: true },
                firstName: { required: true },
                lastName: { required: true },
                password: { required: true }
            }
        });

        // Hide alert when the close button is pressed
        this.modals.rsvpModal.$errorContainer.find('a').on('click', function () {
            _this.modals.rsvpModal.$errorContainer.velocity("fadeOut", { duration: 200 });
        });

        // Clear form when the modal closes
        this.modals.rsvpModal.$container.on('hidden.bs.modal', function(){
            $(this).find('form')[0].reset();
        });

        this.modals.rsvpModal.$btnSubmitRsvp.on('click', function () {
            if (_this.modals.rsvpModal.$rsvpForm.valid()) {
                _this.sendRsvp();
            }

            return false;
        });
    };

    WebsiteControl.prototype.enableDisableRsvp = function (enable) {
        if (!enable) {
            this.modals.rsvpModal.$selectAdults.val('0');
            this.modals.rsvpModal.$selectChildren.val('0');
            this.modals.rsvpModal.$inputGuestNames.val('');
            this.modals.rsvpModal.$selectVegan.val('0');
            this.modals.rsvpModal.$selectVegetarian.val('0');
            this.modals.rsvpModal.$selectGlutenFree.val('0');
        } else {
            this.modals.rsvpModal.$selectAdults.val('1');
        }

        this.modals.rsvpModal.$selectAdults.prop('disabled', enable ? false : 'disabled');
        this.modals.rsvpModal.$selectChildren.prop('disabled', enable ? false : 'disabled');
        this.modals.rsvpModal.$inputGuestNames.prop('disabled', enable ? false : 'disabled');
        this.modals.rsvpModal.$selectVegan.prop('disabled', enable ? false : 'disabled');
        this.modals.rsvpModal.$selectVegetarian.prop('disabled', enable ? false : 'disabled');
        this.modals.rsvpModal.$selectGlutenFree.prop('disabled', enable ? false : 'disabled');
    };

    WebsiteControl.prototype.sendRsvp = function () {
        var _this = this;

        var dataIn = {
            attending: parseInt(_this.$body.find('.rsvp-modal .attendance-radio input:radio[name="attendance"]:checked').val()),
            adultCount: parseInt(_this.modals.rsvpModal.$selectAdults.val()),
            childrenCount: parseInt(_this.modals.rsvpModal.$selectChildren.val()),
            firstName: _this.modals.rsvpModal.$inputFirstName.val(),
            lastName: _this.modals.rsvpModal.$inputLastName.val(),
            guestNames: _this.modals.rsvpModal.$inputGuestNames.val(),
            veganCount: _this.modals.rsvpModal.$selectVegan.val(),
            vegetarianCount: _this.modals.rsvpModal.$selectVegetarian.val(),
            glutenFreeCount: _this.modals.rsvpModal.$selectGlutenFree.val(),
            password: _this.modals.rsvpModal.$inputPassword.val(),
            comment: _this.modals.rsvpModal.$inputComment.val()
        };

        console.log(JSON.stringify(dataIn));

        $.ajax({
            async: true,
            contentType: 'application/json',
            data: JSON.stringify(dataIn),
            type: 'POST',
            url: '/rsvp',

            success: function (result) {
                if (result.success) {
                    _this.modals.rsvpModal.$container.modal('hide');

                    _this.controls.$rsvpSuccessAlert.fadeIn();
                } else {
                    _this.modals.rsvpModal.$errorContainer.find('.error-message').text(result.message);
                    _this.modals.rsvpModal.$errorContainer.velocity("fadeIn", { duration: 200 });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('error');
            }
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
            lat: 39.61198,
            lng: -105.077294
        };

        var mapProperties = {
            center: denverLatLong,
            scrollwheel: false,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROAD
        };

        // Create map with custom style
        this.googleMap = new google.maps.Map(this.controls.$googleMap[0], mapProperties);
        this.googleMap.set('styles', [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]);

        // Set marker on Coors Field
        var marker = new google.maps.Marker({
            position: denverLatLong,
            map: this.googleMap,
            title: 'The Barn at Raccoon Creek'
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
