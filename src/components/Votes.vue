<template>
  <div class="counter">
    <input type="button" value="+" class="button-plus" @click="upvote" />
    {{ vote }}
    <input type="button" value="-" class="button-minus" @click="downvote" />
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Votes",
  props: ["image"],
  data() {
    return {
      upvoted: false,
      downvoted: false,
    };
  },
  methods: {
    upvote() {
      this.upvoted = !this.upvoted;
      this.downvoted = false;
    },
    downvote() {
      this.downvoted = !this.downvoted;
      this.upvoted = false;
    },
  },
  asyncComputed: {
    vote() {
      if (this.upvoted) {
        this.image.vote = this.image.vote + 1;
        axios.post(this.$apiUrl + "images", this.image).then(() => {});
        return this.image.vote;
      } else if (this.downvoted) {
        this.image.vote = this.image.vote - 1;
        axios.post(this.$apiUrl + "images", this.image).then(() => {});
        return this.image.vote;
      } else {
        return this.image.vote;
      }
    },
  },
};
</script>

<style scoped>
input {
  border: 1px solid #eeeeee;
  box-sizing: border-box;
  margin: 0;
  outline: none;
  padding: 10px;
}

input[type="button"] {
  -webkit-appearance: button;
  cursor: pointer;
}
.input-group {
  clear: both;
  margin: 15px 0;
  position: relative;
}

.input-group input[type="button"] {
  background-color: #eeeeee;
  min-width: 38px;
  width: auto;
  transition: all 300ms ease;
}

.input-group .button-minus,
.input-group .button-plus {
  font-weight: bold;
  height: 38px;
  padding: 0;
  width: 38px;
  position: relative;
}

.button-plus {
  left: -13px;
}
</style>
