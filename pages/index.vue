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
                label="Continent"
                v-model="continentFilter"
                :items="CountryHeaders"

              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                solo hide-details clearable multiple deletable-chips chips
                label="Continent Exclude"
                v-model="continentFilterExclude"
                :items="CountryHeaders"
              />
<!--              {{ continentFilterExclude }}-->
            </v-col>
            <!--     firstLetterFilter       One section-->
            <v-col cols="6">
              <v-combobox
                solo hide-details clearable
                label="firstLetterFilter"
                v-model="firstLetterFilter"
                :items="firstLetterItems"
              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                solo hide-details clearable multiple deletable-chips chips
                label="firstLetterFilter Exclude"
                v-model="firstLetterFilterExclude"
                :items="firstLetterItems"
              />
            </v-col>
            <!--        lastLetterFilter    One section-->
            <v-col cols="6">
              <v-combobox
                solo hide-details clearable
                label="lastLetterFilter"
                v-model="lastLetterFilter"
                :items="lastLetterItems"
              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                solo hide-details clearable multiple deletable-chips chips
                label="lastLetterFilter Exclude"
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




<!--V data table-->
          <v-data-table
            :headers="tableHeaders"
            :items="tableItems"
            :items-per-page="15"
            class="elevation-1"
            :search="tableSearch"
          >



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
const CountryHeaders = ["Europe","Asia","Africa",'North America','South America',"Oceania"];
import mysteryCountryFormat from "~/dev/mysteryCountryFormat.json"
import uniqBy from "lodash.uniqby"
import uniq from "lodash.uniq"
export default {
  name:'indexPage',
  data() {
    return {
      tableSearch: "",
      continentFilter: "",
      // continentFilterExclude: [],
      /* dev should only show Oceania */
      continentFilterExclude: [ "Europe", "Asia", "Africa", "South America", "North America" ],
      firstLetterFilter:"",
      firstLetterFilterExclude:[],
      lastLetterFilter:"",
      lastLetterFilterExclude:[],

    }
  },
  methods:{
    clearFilters(){
      this.tableSearch = "";
      this.continentFilter = "";
      this.firstLetterFilter = "";
      this.lastLetterFilter = "";
      this.continentFilterExclude = [];//forget if this works or not
      this.firstLetterFilterExclude = [];
      this.lastLetterFilterExclude = [];
    }
  },
  computed:{
    /* raw data */
    mysteryCountryFormat(){
      return mysteryCountryFormat;
    },
    /* actually continents */
    CountryHeaders(){
      return CountryHeaders;
    },
    firstLetterItems(){
      // return uniqBy(this.mysteryCountryFormat,"firstLetter").map(val => val.firstLetter);
      return uniq(this.mysteryCountryFormat.map(val => val.firstLetter)).sort();

    },
    lastLetterItems(){
      // return uniqBy(this.mysteryCountryFormat.map(val => val.lastLetter),"lastLetter").sort();
      return uniq(this.mysteryCountryFormat.map(val => val.lastLetter)).sort();
    },
    tableHeaders(){
      return [
        {
          text:"Country",
          value:'country'
        },
        {
          text:"Continent",
          value:"continent",
        },
        {
          text:"FL",
          value:"firstLetter",
        },
        {
          text:"LL",
          value:"lastLetter",
        },

      ]
      // return this.CountryHeaders.map(val =>{
      //   return {
      //     text:val,
      //     value:val,
      //   };
      // })

    },
    tableItems(){
      const that = this;
      return this.mysteryCountryFormat.filter(oData =>{
        const {country, continent, firstLetter,lastLetter} = oData;
        let toShow = true;
        //lazy chain
        if(that.continentFilter){
          toShow = toShow && continent.toLowerCase().includes(that.continentFilter.toLowerCase())
        }
        if(that.firstLetterFilter){
          toShow = toShow &&firstLetter.includes(that.firstLetterFilter)
        }
        if(that.lastLetterFilter){
          toShow = toShow &&lastLetter.includes(that.lastLetterFilter)
        }

        if(this.continentFilterExclude.length > 0){
          for (let i = 0; i < this.continentFilterExclude.length; i++) {
            const rowExclude = this.continentFilterExclude[i];
            toShow = toShow && !rowExclude.includes(continent)
            if(!toShow) return toShow;
          }
        }
        if(this.firstLetterFilterExclude.length > 0){
          for (let i = 0; i < this.firstLetterFilterExclude.length; i++) {
            const rowExclude = this.firstLetterFilterExclude[i];
            toShow = toShow && !rowExclude.includes(firstLetter)
            if(!toShow) return toShow;
          }
        }
        if(this.lastLetterFilterExclude.length > 0){
          for (let i = 0; i < this.lastLetterFilterExclude.length; i++) {
            const rowExclude = this.lastLetterFilterExclude[i];
            toShow = toShow && !rowExclude.includes(lastLetter)
            if(!toShow) return toShow;
          }
        }

        return toShow;


      });

    },

  },

}
</script>
