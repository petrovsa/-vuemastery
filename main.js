var eventBus = new Vue();

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `
  <div class="product">
  <div class="product-image">
    <img :src="image" :alt="altText" />
  </div>
  <div class="product-info">
    <h1>{{ title }}</h1>
    <p v-if="inStock">in Stock</p>
    <p>Shipping: {{ shipping }}</p>
    <p v-else :class="[inStock ? '' : 'outstock']">Out of Stock</p>
    <a :href="details" target="_blank">See details ...</a>
      <product-details :details="details"></product-details>
    <div
      v-for="(variant, index) in variants"
      :key="variant.variantId"
      class="color-box"
      :style="{ backgroundColor: variant.variantColor }"
      @mouseover="changeColor(index)"
    ></div>

    <button
      @click="addToCart"
      :disabled="!inStock"
      :class="{disabledButton: !inStock}"
    >
      Add to cart
    </button>
    <button @click="removeFromCart">Remove from cart</button>  
  </div>
  <h2>Reviews</h2>
  <product-tabs :reviews="reviews"></product-tabs>
  
</div>
  `,
  data() {
    return {
      product: "Socks",
      brand: "Petrov Mastery",
      selectedVariant: 0,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      altText: "a pair of Socks",
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: "./assets/vmSocks-green.png",
          variantQuantity: 10,
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: "./assets/vmSocks-blue.png",
          variantQuantity: 0,
        },
      ],
      reviews: [],
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    removeFromCart() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
    changeColor(index) {
      this.selectedVariant = index;
    },
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    shipping() {
      if (this.premium) {
        return "Free";
      }
      return 2.99;
    },
  },
  mounted() {
    eventBus.$on("submit-review", (productReview) => {
      this.reviews.push(productReview);
    });
  },
});
Vue.component("product-details", {
  props: {
    details: {
      type: Array,
      default: [],
    },
  },
  template: `
  <ol>
  <li v-for="detail in details" :key="detail">{{detail}}</li>
  </ol>
  `,
});
Vue.component("product-review", {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">
  <p v-if="errors.length">
  <ul>
  <li v-for="(error, idx) in errors" :key="idx">
  {{error}}
  </li>
  </ul>
  </p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
        <p>Would you recommend this product?</p>
        <label>
          Yes
          <input type="radio" value="Yes" v-model="recommend"/>
        </label>
        <label>
          No
          <input type="radio" value="No" v-model="recommend"/>
        </label>
      </p>
      
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: [],
      recommend: null,
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recomend,
        };
        eventBus.$emit("submit-review", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
        this.errors = [];
      } else {
        if (!this.name) this.errors.push("Name is required");
        if (!this.review) this.errors.push("Review is required");
        if (!this.rating) this.errors.push("Rating is required");
        if (!this.recommend) this.errors.push("Recomendation is required");
      }
    },
  },
});
Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
    },
  },
  template: `
  <div>
  <span class="tab" v-for="(tab, idx) in tabs" :key="idx" :class="{activeTab: selectedTab === tab}" @click="selectedTab = tab">
  {{tab}}
  </span>
  

  <div v-show="selectedTab === 'Reviews'">
  <p v-if="!reviews.length">There are no reviews yet</p>
  <ul>
  <li v-for="(review, idx) in reviews" :key="idx">
  <p>{{ review.name }}</p>
  <p>{{ review.review }}</p>
  <p>{{ review.rating }}</p>
  
  </li>
  </ul>
    
    </div>
    <product-review v-show="selectedTab === 'Make Review'"></product-review>

  </div>
  `,
  data() {
    return {
      tabs: ["Reviews", "Make Review"],
      selectedTab: "Reviews",
    };
  },
});
var app = new Vue({
  el: "#app",
  data: {
    premium: true,
    count: [],
  },
  methods: {
    addToCart(id) {
      this.count.push(id);
    },
    removeFromCart(id) {
      this.count.pop(id);
    },
  },
});
