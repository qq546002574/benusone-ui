# benusone

> A Vue.js project

## Build Setup

``` bash
# benusone组件库

bs-carousel、bs-carousel-item轮播demo

// 全局应用benusone-ui
import components from '@benusone/benusone-ui';
Vue.use(components);

<bs-carousel v-model="checkIndex">
	<bs-carousel-item name="1">
		<img src="./assets/logo.png"/>
	</bs-carousel-item>
	<bs-carousel-item name="2">
		<img src="./assets/logo.png"/>
	</bs-carousel-item>
</bs-carousel>

data() {
	return {
		checkIndex: 1, // index
	}
}

```

