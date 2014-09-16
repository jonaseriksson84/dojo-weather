// Jag hann inte riktigt förstå mig på/få define([]) att funka, så det är en jägarns massa nestade funktioner
// då jag bara ville få igång något i första steget

require([
        "dojo/on", "dojo/dom", "dojo/domReady!"],
    function(on, dom) {
        var searchBtn = dom.byId("searchBtn");
        var cityNode = dom.byId("city");
        var tempNode = dom.byId("temperature");
        var iconNode = dom.byId("icon");
        var descNode = dom.byId("desc");

        var countryVal = "";
        var searchVal = "";

        // Lyckades inte riktigt med dijit select så blev ful-JS istället
        // Populera dropdown från json
        require(['dojo/text!./countries.json', 'dojo/json'],
        function(countries, json) {
                var JSON = {
                    "COLUMNS":["name", "code"],
                    "DATA":  json.parse(countries)
                }, select = dom.byId("countrySelect");
                for (var i = 0, at = JSON.DATA[i], name = at[0], code = at[1]; i < JSON.DATA.length; i++) {
                    var option = document.createElement("option");
                    option.value = JSON.DATA[i].code;
                    option.textContent = JSON.DATA[i].name;
                    select.appendChild(option);
                };
            });

        // När man klickar på knappen
        on(searchBtn, "click", function(evt){
            require(["dojo/parser", "dijit/registry", "dijit/form/TextBox", "dijit/form/Select"],
                function(parser, registry){
                    parser.parse();
                    searchVal = registry.byId("searchBox").get("value");
                    countryVal = registry.byId("countrySelect").get("value");
                    if (countryVal !== undefined && countryVal !== "") {
                        searchVal = searchVal + "," + countryVal;
                    }
                    console.log(searchVal);
                    return searchVal;
                });

            // Skall använda en deferred function
            require(["dojo/request", 'dojo/dom-class'], function(request, domClass) {
                request("http://api.openweathermap.org/data/2.5/weather?q=" + searchVal, {
                    handleAs: "json"
                }).then(
                    function(data){
                        console.log(data);
                        if (data.cod === "404") {
                            domClass.remove("error", "hide");
                            domClass.add("weather", "hide");
                        } else {
                            domClass.add("error", "hide");
                            domClass.remove("weather", "hide");
                            cityNode.innerHTML = data.name + ", " + data.sys.country;
                            var temp = data.main.temp - 272.15;
                            // Format decimals
                            require(['dojo/number'], function (number) {
                                temp = number.format(temp, {
                                    places: 1
                                });
                                tempNode.innerHTML = temp + '&#176;C';
                            })
                            iconNode.innerHTML = '<img src="http://openweathermap.org/img/w/'
                                + data.weather[0].icon + '.png">';
                            descNode.innerHTML = data.weather[0].main + '<br />' + data.weather[0].description;
                        }
                    },
                    // Fantastisk errorhandling nedan :P
                    function(error) {
                        console.log("An error occured: " + error);
                    }
                );
            });
        });

        require(["dojo/dom", "dojo/on"], function(dom, on) {
            var select = dom.byId('switch');
            on(select, "click", function(evt){
                console.log(temp);
            });
        })
    });
