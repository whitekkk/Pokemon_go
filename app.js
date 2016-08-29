var app = window.app = new Vue({
    el: '#app',
    data: {
        msg: 'Pokemon Ranger',
        list: {},
        position: '',
        map: {}
    },
    methods: {
        getApi: function() {
            var url = 'http://www.pokesnipers.com/api/v1/pokemon.json?referrer=home'
            var that = this
            this.$http.get(url).then(function(res) {
                    that.list = res.data.results
                })
                //then คือ จะเอาไปทำอะไร เป็นการ scope ให้ข้อมูลครบ
            this.reMarker(that.list)
        },
        setPos: function(marks) {
            var maps = marks.split(",")
            var myCenter = new google.maps.LatLng(parseFloat(maps[0]), parseFloat(maps[1]))
            this.map.setCenter(myCenter);
            console.log(marks);
            console.log(this.position);
            if (marks != this.position) {

                var directionsDisplay = new google.maps.DirectionsRenderer
                var directionsService = new google.maps.DirectionsService

                directionsDisplay.setMap(this.map)

                this.calculateAndDisplayRoute(directionsService, directionsDisplay, myCenter)
                document.getElementById('mode').addEventListener('change', function() {
                    this.calculateAndDisplayRoute(directionsService, directionsDisplay, myCenter)
                })
            }
        },
        reMarker: function(pokeList) {
            var url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAD7aVfDsori3gazo4jvoaeURiGM-X_-UU&callback=initMap'
            var that = this
            this.$http.get(url).then(function(res) {
                for (var i = 0; i < pokeList.length; i++) {

                    var image = {
                        url: pokeList[i].icon,
                        size: new google.maps.Size(50, 50),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(50, 50)
                    };

                    var maps = pokeList[i].coords.split(",")
                    var myCenter = new google.maps.LatLng(parseFloat(maps[0]), parseFloat(maps[1]));

                    var marker = new google.maps.Marker({
                        position: myCenter,
                        icon: image,
                        title: pokeList[i].name
                    })
                    marker.setMap(that.map)
                }

            })
        },
        calculateAndDisplayRoute: function(directionsService, directionsDisplay, pokeLocation) {
            console.log(this.position);
            var position = this.position.split(",")
            var myPosition = new google.maps.LatLng(parseFloat(position[0]), parseFloat(position[1]))
            var selectedMode = document.getElementById('mode').value;
            directionsService.route({
                origin: myPosition,
                destination: pokeLocation,
                travelMode: google.maps.TravelMode[selectedMode]
            }, function(response, status) {
                if (status == 'OK') {
                    directionsDisplay.setDirections(response);
                } else {
                    //window.alert('Directions request failed due to ' + status);
                }
            });
        },
        initMap: function() {
            var url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAD7aVfDsori3gazo4jvoaeURiGM-X_-UU&callback=app.initMap'
            var that = this
            this.$http.get(url).then(function(res) {

                that.map = new google.maps.Map(document.getElementById('map'), {
                    center: {
                        lat: -34.397,
                        lng: 150.644
                    },
                    travelMode: 'WALKING',
                    zoom: 10
                })

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                        that.position = position.coords.latitude + ',' + position.coords.longitude

                        var marker = new google.maps.Marker({
                            position: pos,
                            title: 'Ranger'
                        })
                        marker.setMap(that.map)
                        
                        that.map.setCenter(pos);
                    }, function() {
                        handleLocationError(true, infoWindow, that.map.getCenter());
                    })
                } else {
                    // Browser doesn't support Geolocation
                    handleLocationError(false, infoWindow, that.map.getCenter());
                }
            })

        }
    },
    ready: function() {
        this.getApi()
        this.initMap()
        var that = this
        setInterval(function() {
            that.getApi()
        }, 5000)
    }
})
console.log(app)
