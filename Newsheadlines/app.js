"use strict";

const NYTBaseUrl = "https://newsapi.org/v1/articles?source=";
const ApiKey = config.KEY;
const SECTIONS =source.LIST;

function buildUrl (url) {
    return NYTBaseUrl + url + "&sortBy=latest&apiKey=" + ApiKey;
}

Vue.component('news-list', {
  props: ['results'],
  template: `
    <section>
      <div class="row" v-for="posts in processedPosts">
        <div class="columns large-3 medium-6" v-for="post in posts">
          <div class="card">
          <div class="card-divider">
          {{ post.title }}
          </div>
          <a :href="post.url" target="_blank"><img :src="post.urlToImage"></a>
          <div class="card-section">
            <p>{{ post.description }}</p>
          </div>
        </div>
        </div>
      </div>
  </section>
  `,
  computed: {
    processedPosts() {
      let posts = this.results;

      // Add image_url attribute
      posts.map(post => {
        post.urlToImage = post.urlToImage ? post.urlToImage : "img/300x200.png";
      });

      // Put Array into Chunks
      let i, j, chunkedArray = [], chunk = 4;
      for (i=0, j=0; i < posts.length; i += chunk, j++) {
        chunkedArray[j] = posts.slice(i,i+chunk);
      }
      console.log(chunkedArray);
      return chunkedArray;
    }
  }
});

const vm = new Vue({
  el: '#app',
  data: {
    results: [],
    sections: SECTIONS.split(', '), // create an array of the sections
    section: 'the-hindu', // set default section to 'hindu'
    loading: true,
    title: ''
  },
  mounted () {
    this.getPosts('the-hindu');
  },
  methods: {
    getPosts(section) {
      let url = buildUrl(section);
      axios.get(url).then((response) => {
        console.log(response);
        this.loading = false;
        this.results = response.data.articles;
        let title = this.section !== 'the-hindu' ? "Latest top stories in "+ this.section + " today" : "Latest top stories today";
        this.title = title;
      }).catch((error) => {
        console.log(error); });
    }
  }
});
