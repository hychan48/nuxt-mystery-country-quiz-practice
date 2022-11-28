<template>
  <v-row justify="center" align="center">
    <v-col notes="Table Filter" cols="12">
      <v-card
        :hover=false
      >

        <v-card-title notes="Table Filter"

        >
          <v-icon
            left
          >
            mdi-bell-ring
          </v-icon>
          <span class="title font-weight-light">
            Country Table
          </span>
        </v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="11">
              <v-text-field
                solo hide-details clearable
                placeholder="search"
                v-model="tableSearch"
              />


            </v-col>
            <v-col cols="1">
              <v-btn @click="clearFilters">
                Clear
              </v-btn>
            </v-col>
            <!--           Continent One section-->
            <v-col cols="6">
              <v-combobox
                solo hide-details clearable
                data-lpignore="true"

                label="Continent"
                name="Continent"
                v-model="continentFilter"
                :items="CountryHeaders"

              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                solo hide-details clearable multiple deletable-chips chips
                label="Continent Exclude"
                name="Continent Exclude"
                v-model="continentFilterExclude"
                :items="CountryHeaders"
              />
              <!--              {{ continentFilterExclude }}-->
            </v-col>
            <!--     firstLetterFilter       One section-->
            <v-col cols="6">
              <v-combobox
                solo hide-details clearable
                data-lpignore="true"

                label="firstLetterFilter"
                name="firstLetterFilter"
                v-model="firstLetterFilter"
                :items="firstLetterItems"
              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                solo hide-details clearable multiple deletable-chips chips
                data-lpignore="true"

                label="firstLetterFilter Exclude"
                name="firstLetterFilter Exclude"
                v-model="firstLetterFilterExclude"
                :items="firstLetterItems"
              />
            </v-col>
            <!--        lastLetterFilter    One section-->
            <v-col cols="6">
              <v-combobox
                solo hide-details clearable
                data-lpignore="true"
                autocomplete="off"
                label="lastLetterFilter"
                name="lastLetterFilter"
                v-model="lastLetterFilter"
                :items="lastLetterItems"
              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                solo hide-details clearable multiple deletable-chips chips
                data-lpignore="true"

                label="lastLetterFilter Exclude"
                name="lastLetterFilter Exclude"
                v-model="lastLetterFilterExclude"
                :items="lastLetterItems"
              />
              <!--              {{lastLetterFilterExclude}}-->
            </v-col>
            <!--            One section-->
            <v-col cols="6">

            </v-col>
            <v-col cols="6">

            </v-col>
          </v-row>

<!--          game history-->
<!--          {{gameStates}}-->
<!--          {{excludedCountriesHistory}}-->
          <v-combobox
            solo hide-details multiple
            readonly
            label="excludedCountriesHistory"
            :value="excludedCountriesHistory"
          >
            <template v-slot:selection="{parent,item,on,attrs}">
<!--            <template v-slot:item="item">-->
              <v-chip
                :color="item.color"
                :class="item.styleClass"

              >
<!--                {{ data }}-->
                {{item.country}}
              </v-chip>
            </template>


          </v-combobox>
          <!--game states-->
          <v-col cols="12">
            {{ lastGameState }}
          </v-col>
          <v-col cols="12">

            <v-btn
              v-for="item in gameStateLookupItems"
              :key="item.label"
              :color="item.color"
              @click="item.handler"
              :disabled="!lastGameState.country"
              v-text="item.label"
              :class="item.class"

            ></v-btn>

          </v-col>

<!--          initial country table for easy start-->
          <v-col cols="12">
<!--            can mayve hide this with some state-->
            <v-btn
              v-for="countryItem in largeCountries"
              :key="countryItem.country"
              @click="countryBtnEvent(countryItem)"
              v-text="countryItem.country"
              :tooltip="countryItem.continent"
            >

            </v-btn>
          </v-col>
          <!--V data table-->

          <v-data-table
            :headers="tableHeaders"
            :items="tableItems"
            :items-per-page="15"
            class="elevation-1"
            :search="tableSearch"

            :sort-by="tableSortBy"
            :sort-desc="tableSortByDesc"
            multi-sort
          >
            <template v-slot:item.country="{ item }">
              <v-btn @click="countryBtnEvent(item)">
                {{ item.country }}
              </v-btn>
            </template>


          </v-data-table>
          <!--            {{ CountryHeaders }}-->
          <!--            {{ mysteryCountryFormat }}-->
          <!--          {{ firstLetterItems }}-->

          <!--          {{this.mysteryCountryFormat.map(val => val.lastLetter).sort()}}-->
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
const CountryHeaders = ["Europe", "Asia", "Africa", 'North America', 'South America', "Oceania"];
import mysteryCountryFormat from "~/dev/mysteryCountryFormat.json"
import uniq from "lodash.uniq"

export default {
  name: 'indexPage',
  data() {
    return {
      tableSearch: "",
      continentFilter: "",
      continentFilterExclude: [],
      /* dev should only show Oceania */
      // continentFilterExclude: [ "Europe", "Asia", "Africa", "South America", "North America" ],
      firstLetterFilter: "",
      firstLetterFilterExclude: [],
      lastLetterFilter: "",
      lastLetterFilterExclude: [],

      lastGameState: {},
      gameStates: [],

      tableSortBy:["lastLetterCount","firstLetterCount"],
      tableSortByDesc:[true,true],

    }
  },
  methods: {
    clearFilters() {
      this.tableSearch = "";
      this.continentFilter = "";
      this.firstLetterFilter = "";
      this.lastLetterFilter = "";
      this.continentFilterExclude = [];//forget if this works or not
      this.firstLetterFilterExclude = [];
      this.lastLetterFilterExclude = [];


      this.tableSortBy =["lastLetterCount","firstLetterCount"];
      this.tableSortByDesc=[true,true];

      this.lastGameState = {};
      this.gameStates = [];//todo for undo
    },
    tableFilter(oData){
      const that = this;
      const {country, continent, firstLetter, lastLetter} = oData;
      let toShow = true;
      //lazy chain
      if (that.continentFilter) {
        toShow = toShow && continent.toLowerCase().includes(that.continentFilter.toLowerCase())
      }
      if (that.firstLetterFilter) {
        toShow = toShow && firstLetter.includes(that.firstLetterFilter)
      }
      if (that.lastLetterFilter) {
        toShow = toShow && lastLetter.includes(that.lastLetterFilter)
      }

      if (this.continentFilterExclude.length > 0) {
        for (let i = 0; i < this.continentFilterExclude.length; i++) {
          const rowExclude = this.continentFilterExclude[i];
          toShow = toShow && !rowExclude.includes(continent)
          if (!toShow) return toShow;
        }
      }
      if (this.firstLetterFilterExclude.length > 0) {
        for (let i = 0; i < this.firstLetterFilterExclude.length; i++) {
          const rowExclude = this.firstLetterFilterExclude[i];
          toShow = toShow && !rowExclude.includes(firstLetter)
          if (!toShow) return toShow;
        }
      }
      if (this.lastLetterFilterExclude.length > 0) {
        for (let i = 0; i < this.lastLetterFilterExclude.length; i++) {
          const rowExclude = this.lastLetterFilterExclude[i];
          toShow = toShow && !rowExclude.includes(lastLetter)
          if (!toShow) return toShow;
        }
      }

      //country
      if (this.excludedCountries.length > 0) {
        for (let i = 0; i < this.excludedCountries.length; i++) {
          const rowExclude = this.excludedCountries[i];
          toShow = toShow && !rowExclude.includes(country)
          if (!toShow) return toShow;
        }
      }

      return toShow;
    },
    /* sets last gamestate and clipboard*/
    async countryBtnEvent(item) {
      // console.log(item);
      const {continent, country, firstLetter, lastLetter} = item;
      /* push to state and filter */
      // this.gameStates.push(item); //shouldnt be done here... but in gameStateLookupItems
      /* copy to clipboard */
      this.lastGameState = {...item}
      await navigator.clipboard.writeText(country);

    },

  },
  computed: {
    excludedCountriesHistory(){
      return this.gameStates;
    },
    excludedCountries(){
      return this.gameStates.map( val => val.country)
    },
    /* copied and pasted large countries */
    largeCountries(){
      return [
        {
          //visible country,
          "country": "Somalia",
          "continent": "Africa",
          "firstLetter": "s",
          "lastLetter": "a",
          "firstLetterCount": 26,
          "lastLetterCount": 73
        },
        { "country": "Bahrain", "continent": "Asia", "firstLetter": "b", "lastLetter": "n", "firstLetterCount": 17, "lastLetterCount": 25 },

        //really small but visible
        { "country": "Netherlands", "continent": "Europe", "firstLetter": "n", "lastLetter": "s", "firstLetterCount": 11, "lastLetterCount": 18 },
        { "country": "Mexico", "continent": "North America", "firstLetter": "m", "lastLetter": "o", "firstLetterCount": 17, "lastLetterCount": 12 },

        { "country": "Tuvalu", "continent": "Oceania", "firstLetter": "t", "lastLetter": "u", "firstLetterCount": 11, "lastLetterCount": 6 },
        { "country": "Chile", "continent": "South America", "firstLetter": "c", "lastLetter": "e", "firstLetterCount": 15, "lastLetterCount": 12 },


        {
          "country": "Samoa",
          "continent": "Oceania",
          "firstLetter": "s",
          "lastLetter": "a",
          "firstLetterCount": 26,
          "lastLetterCount": 73
        },
        //not useful letter
        // {
        //   "country": "Canada",
        //   "continent": "North America",
        //   "firstLetter": "c",
        //   "lastLetter": "a"
        // },
        // {
        //   "country": "China",
        //   "continent": "Asia",
        //   "firstLetter": "c",
        //   "lastLetter": "a"
        // },
        {
          "country": "Brazil",
          "continent": "South America",
          "firstLetter": "b",
          "lastLetter": "l"
        },
        {
          "country": "Australia",
          "continent": "Oceania",
          "firstLetter": "a",
          "lastLetter": "a"
        },
        {
          "country": "Egypt",
          "continent": "Africa",
          "firstLetter": "e",
          "lastLetter": "t"
        },
        {
          "country": "France",
          "continent": "Europe",
          "firstLetter": "f",
          "lastLetter": "e"
        },

      ].filter(this.tableFilter)
    },
    /** mystery game colors handler
     * can be cleaned up to clean up the logic of exclusion and for performance
     *
     * */
    gameStateLookupItems() {
      const that = this;

      function fl(fl) {
        that.firstLetterFilter = that.lastGameState.firstLetter;
        const sortIndex = that.tableSortBy.indexOf("firstLetterCount");
        if(sortIndex > -1){
          that.tableSortBy.splice(sortIndex,1)
          that.tableSortByDesc.splice(sortIndex,1)
        }
      }

      function ll(ll) {
        that.lastLetterFilter = that.lastGameState.lastLetter;

        //should remove the table Filter since it's useless
        const sortIndex = that.tableSortBy.indexOf("lastLetterCount");
        if(sortIndex > -1){
          that.tableSortBy.splice(sortIndex,1)
          that.tableSortByDesc.splice(sortIndex,1)
        }


      }

      function co(continent) {
        that.continentFilter = that.lastGameState.continent;


      }

      /**
       * reverse
       */
      function none() {
        that.continentFilterExclude.push(that.lastGameState.continent);
        that.continentFilterExclude = uniq(that.continentFilterExclude);


        that.firstLetterFilterExclude.push(that.lastGameState.firstLetter);
        that.firstLetterFilterExclude = uniq(that.firstLetterFilterExclude);
        that.lastLetterFilterExclude.push(that.lastGameState.lastLetter);
        that.lastLetterFilterExclude = uniq(that.lastLetterFilterExclude);


      }
      /* this one is slighty bugged. let's see if the if statement will save it */
      function la_lm(landmass) {
        if(!that.firstLetterFilter){
          that.firstLetterFilterExclude.push(that.lastGameState.firstLetter);
          that.firstLetterFilterExclude = uniq(that.firstLetterFilterExclude);
        }

        if(!that.lastLetterFilter){
          that.lastLetterFilterExclude.push(that.lastGameState.lastLetter);
          that.lastLetterFilterExclude = uniq(that.lastLetterFilterExclude);
        }



        //land mass is hard so ignoring for now? but might basically mean none + same continents or groups

      }

      function gameStatesHandlerAtEnd(color,styleClass){

        //maybe refactor to add color so it's easier to debug the game flow
        that.gameStates.push({...that.lastGameState,color,styleClass});
        that.lastGameState = {};

      }


      const colorLookup = [
        //skip
        {
          color: "rgb(37,57,93)",
          handler: function () {

            gameStatesHandlerAtEnd("rgb(37,57,93)")
          },
          label: "SKIP",
        },
        //fl
        {
          color: "rgb(0, 255, 0)",
          handler: function () {
            fl();
            that.continentFilterExclude.push(that.lastGameState.continent);
            that.continentFilterExclude = uniq(that.continentFilterExclude);
            that.lastLetterFilterExclude.push(that.lastGameState.lastLetter);
            that.lastLetterFilterExclude = uniq(that.lastLetterFilterExclude);

            gameStatesHandlerAtEnd("rgb(0, 255, 0)","black--text")
          },
          label: "FL",
          class:"black--text",

        },
        //ll
        {
          color: "rgb(0, 0, 255)",
          handler: function () {
            ll();
            that.continentFilterExclude.push(that.lastGameState.continent);
            that.continentFilterExclude = uniq(that.continentFilterExclude);

            that.firstLetterFilterExclude.push(that.lastGameState.firstLetter);
            that.firstLetterFilterExclude = uniq(that.firstLetterFilterExclude);
            gameStatesHandlerAtEnd("rgb(0, 0, 255)")
          },
          label: "LL",
        },
        //continent
        {
          color: "rgb(255, 0, 0)",
          handler: function () {
            co();
            that.firstLetterFilterExclude.push(that.lastGameState.firstLetter);
            that.firstLetterFilterExclude = uniq(that.firstLetterFilterExclude);
            that.lastLetterFilterExclude.push(that.lastGameState.lastLetter);
            that.lastLetterFilterExclude = uniq(that.lastLetterFilterExclude);
            gameStatesHandlerAtEnd("rgb(255, 0, 0)")
          },
          label: "CO",
        },
        //landmass (LA)
        {
          color: "rgb(255, 255, 0)",
          handler: function () {
            la_lm();
            gameStatesHandlerAtEnd("rgb(255, 255, 0)","black--text")
          },
          label: "LM",
          class:"black--text",
        },
        //fl + ll
        {
          color: "rgb(0, 153, 153)",
          handler: function () {
            fl();
            ll();
            that.continentFilterExclude.push(that.lastGameState.continent);
            that.continentFilterExclude = uniq(that.continentFilterExclude);
            gameStatesHandlerAtEnd("rgb(0, 153, 153)")
          },
          label: "FL LL",
        },
        //fl + continent
        {
          color: "rgb(0, 0, 0)",
          handler: function () {
            fl();
            co();
            that.lastLetterFilterExclude.push(that.lastGameState.lastLetter);
            that.lastLetterFilterExclude = uniq(that.lastLetterFilterExclude);
            gameStatesHandlerAtEnd("rgb(0, 0, 0)")          },
          label: "FL CO",
        },
        // fl * landmass
        {
          color: "rgb(153, 153, 0)",
          handler: function () {
            fl();
            la_lm();
            gameStatesHandlerAtEnd("rgb(153, 153, 0)")          },
          label: "FL LM",
        },
        //ll and continent
        {
          color: "rgb(153, 0, 153)",
          handler: function () {
            ll();
            co();
            that.firstLetterFilterExclude.push(that.lastGameState.firstLetter);
            that.firstLetterFilterExclude = uniq(that.firstLetterFilterExclude);
            gameStatesHandlerAtEnd("rgb(153, 0, 153)");
          },
          label: "LL CO",
        },
        //ll * la
        {
          color: "rgb(51, 255, 255)",
          handler: function () {
            ll();
            la_lm();
            gameStatesHandlerAtEnd("rgb(51, 255, 255)","black--text")

          },
          label: "LL LM",
          class:"black--text",

        },
        //fl ll co
        {
          color: "rgb(119, 0, 0)",
          handler: function () {
            fl();
            ll();
            co();
            gameStatesHandlerAtEnd("rgb(119, 0, 0)")
          },
          label: "FL LL CO",
        },
        //fl ll landmass
        {
          color: "rgb(0, 119, 0)",
          handler: function () {
            fl();
            ll();
            la_lm();
            gameStatesHandlerAtEnd("rgb(0, 119, 0)")
          },
          label: "FL LL LM",
        },
        //none
        {
          color: "rgb(255, 255, 255)",
          handler: function () {
            none();
            gameStatesHandlerAtEnd("rgb(255, 255, 255)","black--text")

          },
          label: "NONE",
          class:"black--text",
        },



      ]

      return colorLookup;
    },
    /* raw data */
    mysteryCountryFormat() {
      return mysteryCountryFormat;
    },
    /* actually continents */
    CountryHeaders() {
      return CountryHeaders;
    },
    firstLetterItems() {
      // return uniqBy(this.mysteryCountryFormat,"firstLetter").map(val => val.firstLetter);
      return uniq(this.mysteryCountryFormat.map(val => val.firstLetter)).sort();

    },
    lastLetterItems() {
      // return uniqBy(this.mysteryCountryFormat.map(val => val.lastLetter),"lastLetter").sort();
      return uniq(this.mysteryCountryFormat.map(val => val.lastLetter)).sort();
    },
    tableHeaders() {
      return [
        {
          text: "Country",
          value: 'country'
        },
        {
          text: "Continent",
          value: "continent",
        },
        {
          text: "FL",
          value: "firstLetter",
        },
        {
          text: "FLC",
          value: "firstLetterCount",
        },
        {
          text: "LL",
          value: "lastLetter",
        },
        {
          text: "LLC",
          value: "lastLetterCount",
        },

      ]
      // return this.CountryHeaders.map(val =>{
      //   return {
      //     text:val,
      //     value:val,
      //   };
      // })

    },
    tableItems() {
      // const that = this;
      return this.mysteryCountryFormat.filter(this.tableFilter)

    },

  },

}
</script>
