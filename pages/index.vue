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

          <v-data-table
            :headers="tableHeaders"
            :items="mysteryCountryFormat"
            :items-per-page="15"
            class="elevation-1"
          ></v-data-table>
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

    }

  },

}
</script>
