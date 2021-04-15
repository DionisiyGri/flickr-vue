<template>
  <div>
    <form @submit.prevent="send">
      <input
        v-model="msg"
        placeholder="Enter flickr tag"
        :disabled="isDisabled"
      />
      <button type="submit" :disabled="isDisabled">submit</button>
      <button :disabled="!request" @click="cancel">Cancel</button>
    </form>
    <span class="common-tags" v-for="tag in mostCommonTags" :key="tag">
      <span class="tag" @click="getImages(tag)">{{ tag }} </span>
    </span>
    <div class="gallery">
      <div
        class="gallery-panel"
        v-for="image in imageItems"
        :key="image.date_taken"
      >
        <img :src="image.media.m" />
        <Votes :image="image"></Votes>
        <span>{{ getPublishedAgo(image.published) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Votes from "../components/Votes.vue";

export default {
  name: "Flickr",
  components: {
    Votes,
  },
  data() {
    return {
      imageItems: [],
      msg: "",
      isDisabled: false,
      tags: [],
      mostCommonTags: [],
      image: {},
      request: null,
      tagHistory: [],
    };
  },
  methods: {
    send() {
      if (this.request) {
        this.cancel();
      }
      this.tagHistory.push(this.msg);
      this.getImages(this.msg);
    },
    cancel() {
      this.request.cancel();
    },
    clearOldRequest(msg) {
      this.request.msg = msg;
      this.request = null;
    },

    getImages(tag) {
      if (!tag.target) {
        this.msg = tag;
      }

      this.isDisabled = true;
      const axiosSource = axios.CancelToken.source();
      this.request = {
        cancel: axiosSource.cancel,
        msg: "Loading...",
      };

      axios
        .get(this.$flickrAPI, {
          cancelToken: axiosSource.token,
          headers: {},
          params: {
            tags: this.msg,
          },
        })
        .then((response) => {
          this.imageItems = response.data.items;

          this.imageItems = this.imageItems.map((obj) => ({
            ...obj,
            vote: 0,
          }));

          this.imageItems.sort((a, b) => {
            new Date(b.published) - new Date(a.published);
          });

          this.imageItems.forEach((item) => {
            let t = item.tags.split(" ");
            this.tags.push(...t);
          });

          this.mostCommonTags = this.getCommonTags(this.tags);
          this.clearOldRequest("Success");
          this.isDisabled = false;
        })
        .then(() => {
          axios.get(this.$apiURL + "images").then((resp) => {
            this.imageItems.forEach((a) => {
              resp.data.forEach((b) => {
                if (b.title == a.title && b.link == a.link) {
                  a.vote = b.vote;
                }
              });
            });
          });
        })
        .catch(this.logResponseErrors);
    },
    logResponseErrors(err) {
      if (axios.isCancel(err)) {
        this.tagHistory.pop();
        this.getImages(this.tagHistory[this.tagHistory.length - 1]);
      }
    },
    getCommonTags(tags) {
      let counts = tags.reduce((a, c) => {
        a[c] = (a[c] || 0) + 1;
        return a;
      }, {});

      let mostFrequent = Object.keys(counts)
        .sort((a, b) => counts[b] - counts[a])
        .slice(0, 5); //get first 5  most common tags

      return mostFrequent;
    },
    getPublishedAgo(date) {
      return moment(date).fromNow();
    },
  },
};
</script>

<style scoped>
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  grid-gap: 1rem;
  max-width: 80rem;
  margin: 5rem auto;
  padding: 0 5rem;
}
.gallery-panel img {
  width: 100%;
  height: 22vw;
  object-fit: cover;
  border-radius: 0.75rem;
}
.common-tags .tag:hover {
  cursor: pointer;
}
</style>
