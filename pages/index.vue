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
          <v-text-field
            solo hide-details clearable
            placeholder="search"
            v-model="tableSearch"
          />
          <v-text-field
            solo hide-details clearable
            placeholder="Continent"
            v-model="continentFilter"
          />
          <v-text-field
            solo hide-details clearable
            placeholder="firstLetterFilter"
            v-model="firstLetterFilter"
          />
          <v-text-field
            solo hide-details clearable
            placeholder="lastLetterFilter"
            v-model="lastLetterFilter"
          />

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
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
const CountryHeaders = ["Europe","Asia","Africa",'North America','South America',"Oceania"];
import mysteryCountryFormat from "~/dev/mysteryCountryFormat.json"
export default {
  name:'indexPage',
  data() {
    return {
      tableSearch: "",
      continentFilter: "",
      firstLetterFilter:"",
      lastLetterFilter:"",

    }
  },
  computed:{
    mysteryCountryFormat(){
      return mysteryCountryFormat;
    },
    CountryHeaders(){
      return CountryHeaders;
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
          toShow = toShow &&continent.toLowerCase().includes(that.continentFilter.toLowerCase())
        }
        if(that.firstLetterFilter){
          toShow = toShow &&firstLetter.includes(that.firstLetterFilter)
        }
        if(that.lastLetterFilter){
          toShow = toShow &&lastLetter.includes(that.lastLetterFilter)
        }



        return toShow;


      });

    },

  },

}
</script>
