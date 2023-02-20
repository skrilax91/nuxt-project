<template>
  <IonApp >
    <b-container fluid class="h-100 contain" style="background-color: #335b86">
      <slot />
    </b-container>
  </IonApp>
</template>

<style>
* {
  	scrollbar-width: none;
}

*::-webkit-scrollbar {
  	display: none;
}

html {
	-webkit-user-select: none;
	user-select: none;
}

body, html, #__nuxt, #__layout {
	min-height: 100%;
}

.scroll-block {
  overflow: auto;
  -ms-overflow-style: none;
}

</style>